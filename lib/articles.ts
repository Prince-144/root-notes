/**
 * Content layer backed by Payload CMS + Postgres.
 * Function signatures match the Step-1/2 in-memory version — components
 * import the same names, they just now `await` them.
 */
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article as PayloadArticleDoc } from "../payload-types";
import { matchesQuery } from "./search-match";
import type { Article, ArticleSummary } from "./article-types";

export type { Article, ArticleSummary } from "./article-types";
export { formatDate } from "./article-types";

/**
 * An uploaded cover beats the URL field — someone picking a file in the admin
 * is overriding the stock image the generator chose. Prefers the 1600x900
 * derivative so a card isn't handed the full-size original to scale down.
 *
 * Only populated when the query runs at depth >= 1; at depth 0 the relation is
 * just an id and this correctly falls through to the URL.
 */
function resolveCover(
  doc: Pick<PayloadArticleDoc, "coverImage" | "coverImageUrl">,
): string | undefined {
  const upload = doc.coverImage;
  if (upload && typeof upload === "object") {
    const sized = upload.sizes?.cover?.url;
    if (sized) return sized;
    if (upload.url) return upload.url;
  }
  return doc.coverImageUrl ?? undefined;
}

/** The shape a LIST_SELECT query returns — a partial doc, not a whole one. */
type ListDoc = Pick<
  PayloadArticleDoc,
  | "slug"
  | "title"
  | "excerpt"
  | "categorySlug"
  | "tags"
  | "author"
  | "publishedAt"
  | "readingMinutes"
  | "featured"
  | "views"
  | "coverImageUrl"
  | "coverImage"
>;

/** Fields every list view needs. `body` is deliberately absent — see LIST_SELECT. */
function normalize(doc: ListDoc): ArticleSummary {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    categorySlug: doc.categorySlug,
    tags: doc.tags ?? [],
    author: doc.author,
    publishedAt: doc.publishedAt,
    readingMinutes: doc.readingMinutes,
    featured: doc.featured ?? false,
    views: doc.views ?? 0,
    coverImageUrl: resolveCover(doc),
    coverImageAlt:
      doc.coverImage && typeof doc.coverImage === "object"
        ? (doc.coverImage.alt ?? undefined)
        : undefined,
  };
}

/**
 * Asking Postgres for only what a list renders. Without this every list page
 * pulled the full MDX of every article: 85KB against 15KB at 19 articles, and
 * the gap widens with each one published.
 */
const LIST_SELECT = {
  slug: true,
  title: true,
  excerpt: true,
  categorySlug: true,
  tags: true,
  author: true,
  publishedAt: true,
  readingMinutes: true,
  featured: true,
  views: true,
  coverImageUrl: true,
  coverImage: true,
} as const;

/**
 * The single DB round trip everything else derives from, memoized per
 * request via React `cache()` — calling `getArticles`, `getFeatured`,
 * `getByCategory`, `getBySlug`, etc multiple times in the same render
 * (e.g. `generateMetadata` + the page component) hits Postgres once, not once
 * per call.
 */
const fetchAllArticles = cache(async (): Promise<ArticleSummary[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "articles",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 0,
    // depth 1 populates the coverImage upload so its URL is available;
    // Articles has no other relations, so this costs one join.
    depth: 1,
    select: LIST_SELECT,
  });
  return docs.map(normalize);
});

/** Newest first. */
export async function getArticles(limit?: number): Promise<ArticleSummary[]> {
  const articles = await fetchAllArticles();
  return limit ? articles.slice(0, limit) : articles;
}

export async function getFeatured(): Promise<ArticleSummary | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.featured) ?? articles[0];
}

export async function getByCategory(slug: string): Promise<ArticleSummary[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.categorySlug === slug);
}

/**
 * Tags are free text the writer (or the generator) typed, not a controlled
 * vocabulary — so they're matched case-insensitively and compared in their
 * URL form. "AI Infrastructure" and "ai-infrastructure" are the same tag.
 */
export function tagToSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function getByTag(slug: string): Promise<ArticleSummary[]> {
  const wanted = tagToSlug(slug);
  const articles = await getArticles();
  return articles.filter((a) => a.tags.some((t) => tagToSlug(t) === wanted));
}

/** Every tag in use, with how many published articles carry it. */
export async function getAllTags(): Promise<{ slug: string; label: string; count: number }[]> {
  const articles = await getArticles();
  const seen = new Map<string, { slug: string; label: string; count: number }>();

  for (const article of articles) {
    for (const tag of article.tags) {
      const slug = tagToSlug(tag);
      if (!slug) continue;
      const existing = seen.get(slug);
      if (existing) existing.count += 1;
      else seen.set(slug, { slug, label: tag, count: 1 });
    }
  }

  return [...seen.values()].sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/**
 * The one query that fetches a body, because the article page is the one place
 * that renders it. Memoized so `generateMetadata` and the page component share
 * a single round trip.
 */
export const getBySlug = cache(async (slug: string): Promise<Article | undefined> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "articles",
    where: { slug: { equals: slug }, status: { equals: "published" } },
    limit: 1,
    depth: 1,
  });

  const doc = docs[0];
  return doc
    ? { ...normalize(doc), body: doc.body, updatedAt: doc.updatedAt ?? undefined }
    : undefined;
});

/** Same-category articles first, newest first, backfilled from the rest if the category runs short. */
export async function getRelated(
  article: ArticleSummary,
  limit = 3,
): Promise<ArticleSummary[]> {
  const rest = (await getArticles()).filter((a) => a.slug !== article.slug);
  const sameCategory = rest.filter((a) => a.categorySlug === article.categorySlug);
  const others = rest.filter((a) => a.categorySlug !== article.categorySlug);
  return [...sameCategory, ...others].slice(0, limit);
}

/**
 * Views the leader needs before a trending list means anything.
 *
 * Under this, the ranking is decided by a handful of stray hits — one reader
 * refreshing twice would outrank everything else. An empty list is honest;
 * a list built from three page views is not.
 */
const TRENDING_MIN_VIEWS = 50;

/**
 * Hacker News gravity ranking: recent + popular beats merely popular.
 * score = views / (hours_since_publish + 2)^1.5
 *
 * Returns nothing until there's real traffic to rank — callers should treat
 * an empty array as "no trending data yet", not as an error.
 */
export async function getTrending(limit = 5): Promise<ArticleSummary[]> {
  const articles = await getArticles();
  const now = Date.now();

  const ranked = articles
    .filter((a) => (a.views ?? 0) > 0)
    .map((a) => {
      const hours = (now - Date.parse(a.publishedAt)) / 3_600_000;
      return { a, score: (a.views ?? 0) / Math.pow(hours + 2, 1.5) };
    })
    .sort((x, y) => y.score - x.score);

  if (!ranked.length || (ranked[0].a.views ?? 0) < TRENDING_MIN_VIEWS) return [];

  return ranked.slice(0, limit).map((x) => x.a);
}

/**
 * Simple substring search across title, excerpt, author, tags and category.
 * Runs against the same cached `getArticles()` list as everything else —
 * fine at this content scale; swap for Postgres full-text (or Meilisearch)
 * if the article count grows large enough for it to matter.
 */
export async function searchArticles(query: string): Promise<ArticleSummary[]> {
  if (!query.trim()) return [];
  const articles = await getArticles();
  return articles.filter((a) => matchesQuery(a, query));
}
