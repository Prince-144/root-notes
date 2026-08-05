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
import type { Article } from "./article-types";

export type { Article } from "./article-types";
export { formatDate } from "./article-types";

function normalize(doc: PayloadArticleDoc): Article {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    body: doc.body,
    categorySlug: doc.categorySlug,
    tags: doc.tags ?? [],
    author: doc.author,
    publishedAt: doc.publishedAt,
    readingMinutes: doc.readingMinutes,
    featured: doc.featured ?? false,
    views: doc.views ?? 0,
  };
}

/**
 * The single DB round trip everything else derives from, memoized per
 * request via React `cache()` — calling `getArticles`, `getFeatured`,
 * `getByCategory`, `getBySlug`, etc multiple times in the same render
 * (e.g. `generateMetadata` + the page component) hits Postgres once, not once
 * per call.
 */
const fetchAllArticles = cache(async (): Promise<Article[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "articles",
    sort: "-publishedAt",
    limit: 0,
    depth: 0,
  });
  return docs.map(normalize);
});

/** Newest first. */
export async function getArticles(limit?: number): Promise<Article[]> {
  const articles = await fetchAllArticles();
  return limit ? articles.slice(0, limit) : articles;
}

export async function getFeatured(): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.featured) ?? articles[0];
}

export async function getByCategory(slug: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.categorySlug === slug);
}

export async function getBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}

/** Same-category articles first, newest first, backfilled from the rest if the category runs short. */
export async function getRelated(article: Article, limit = 3): Promise<Article[]> {
  const rest = (await getArticles()).filter((a) => a.slug !== article.slug);
  const sameCategory = rest.filter((a) => a.categorySlug === article.categorySlug);
  const others = rest.filter((a) => a.categorySlug !== article.categorySlug);
  return [...sameCategory, ...others].slice(0, limit);
}

/**
 * Hacker News gravity ranking: recent + popular beats merely popular.
 * score = views / (hours_since_publish + 2)^1.5
 */
export async function getTrending(limit = 5): Promise<Article[]> {
  const articles = await getArticles();
  const now = Date.now();
  return articles
    .map((a) => {
      const hours = (now - Date.parse(a.publishedAt)) / 3_600_000;
      return { a, score: (a.views ?? 0) / Math.pow(hours + 2, 1.5) };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}

/**
 * Simple substring search across title, excerpt, author, tags and category.
 * Runs against the same cached `getArticles()` list as everything else —
 * fine at this content scale; swap for Postgres full-text (or Meilisearch)
 * if the article count grows large enough for it to matter.
 */
export async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) return [];
  const articles = await getArticles();
  return articles.filter((a) => matchesQuery(a, query));
}
