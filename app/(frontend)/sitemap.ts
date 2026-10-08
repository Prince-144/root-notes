import type { MetadataRoute } from "next";
import { getAllCves, getAllTags, getArticles, getByCategory } from "@/lib/articles";
import { categories, siteConfig } from "@/site.config";
import { PAGE_SIZE } from "@/lib/pagination";

/**
 * Half an hour, because publishing does not reach this route.
 *
 * The afterChange hook calls revalidatePath("/sitemap.xml") along with every
 * other path, and the news sitemap beside it picks that up within seconds.
 * This one does not: it is a metadata route rather than a route handler we
 * wrote, and in practice the invalidation misses it, so the file only changed
 * when a deploy rebuilt it. An article published between deploys was in the
 * news sitemap, the feed, the archive and the home page, and absent from the
 * one file Search Console reads for coverage.
 *
 * A timer sidesteps the question of why. The cost is bounded: this regenerates
 * at most once per half hour, and only when something actually requests the
 * file, which is crawlers a handful of times a day — not a load worth putting
 * on a metered database for a faster answer.
 */
export const revalidate = 1800;

/**
 * Pages 2..n of a listing. Page one is listed separately under its own URL,
 * so this deliberately starts at two rather than emitting a duplicate.
 *
 * Listing pages are worth submitting because they are how a crawler reaches
 * older articles now that the feed is paged — without them, anything past the
 * first two dozen is only discoverable through the article sitemap entries.
 */
function pageEntries(
  basePath: string,
  count: number,
  priority: number,
): MetadataRoute.Sitemap {
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    url: `${siteConfig.url}${basePath}/page/${i + 2}`,
    changeFrequency: "weekly" as const,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const tags = await getAllTags();
  const cves = await getAllCves();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/article/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/category/${category.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const categoryPageEntries: MetadataRoute.Sitemap = (
    await Promise.all(
      categories.map(async (category) =>
        pageEntries(
          `/category/${category.slug}`,
          (await getByCategory(category.slug)).length,
          0.4,
        ),
      ),
    )
  ).flat();

  const homePageEntries = pageEntries("", articles.length, 0.5);

  // Only tags carrying at least three articles.
  //
  // Tags are granular — 84 of them across 20 articles, 56 used exactly once —
  // so a low threshold puts more aggregation pages in front of Google than
  // there are articles to aggregate. At `> 1` this listed 28 tag pages against
  // 20 articles, and a crawl budget this domain doesn't have yet would go on
  // two-item lists rather than on the writing. The pages still exist and are
  // still linked from articles; they just aren't pushed for indexing.
  const TAG_SITEMAP_MIN_ARTICLES = 3;

  const tagEntries: MetadataRoute.Sitemap = tags
    .filter((tag) => tag.count >= TAG_SITEMAP_MIN_ARTICLES)
    .map((tag) => ({
      url: `${siteConfig.url}/tag/${tag.slug}`,
      changeFrequency: "weekly",
      priority: 0.4,
    }));

  /**
   * Every identifier, whatever its article count — the opposite of the rule
   * above it, on purpose.
   *
   * The threshold on tags is there because a two-item list of prose adds
   * nothing a crawler needs. An identifier is not that: the page is the answer
   * to a specific query, "CVE-2026-88779", that almost nothing else competes
   * for in the days after disclosure, and it is worth submitting even when one
   * article carries it. Under the tag rule these pages existed and were never
   * once named in the sitemap, because a CVE is usually covered exactly once.
   *
   * Ranked above tag pages and below articles: more worth crawling than an
   * aggregation of prose, less than the writing itself.
   */
  const cveEntries: MetadataRoute.Sitemap = cves.map((cve) => ({
    url: `${siteConfig.url}/cve/${cve.slug}`,
    lastModified: cve.articles[0].publishedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  /**
   * The pages that are not generated from articles, and were not in here at all.
   *
   * Every URL this file emitted was derived from the article list — the feed,
   * the categories, the tags, the identifiers, the articles. Eleven hand-written
   * pages existed and not one was submitted, including the two that matter most
   * to a crawler and to a reader deciding whether to trust the place.
   *
   * /archive is the worse omission. It exists for crawlers before readers: it
   * puts every article one click from the footer, which is the answer to 153
   * pieces sitting discovered and never fetched. It was doing that job without
   * ever being named in the file Search Console reads.
   *
   * /about, /editorial-policy and the author page are the ones that say who
   * writes this and what happens when it is wrong. A publication that does not
   * submit those is asking to be assessed without them.
   *
   * Deliberately absent, because they set robots index:false and a sitemap
   * entry would contradict their own page: /search, /privacy, /terms, /cookies,
   * and the newsletter confirmation and unsubscribe pages — not /newsletter
   * itself, which is indexable and listed below. Submitting a URL we
   * have told Google not to index is a mixed signal, not a free listing.
   */
  const staticEntries: MetadataRoute.Sitemap = [
    // Daily, because both gain a row every time something is published.
    { path: "/archive", changeFrequency: "daily" as const, priority: 0.7 },
    { path: "/author/prince-baruwala", changeFrequency: "daily" as const, priority: 0.5 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
    // Weekly, because the page carries a live preview of the most recent digest.
    { path: "/newsletter", changeFrequency: "weekly" as const, priority: 0.5 },
    { path: "/editorial-policy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/contribute", changeFrequency: "monthly" as const, priority: 0.3 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.3 },
    { path: "/advertise", changeFrequency: "monthly" as const, priority: 0.3 },
  ].map((entry) => ({
    url: `${siteConfig.url}${entry.path}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  return [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    ...staticEntries,
    { url: `${siteConfig.url}/cve`, changeFrequency: "daily", priority: 0.6 },
    ...homePageEntries,
    ...categoryEntries,
    ...categoryPageEntries,
    ...tagEntries,
    ...cveEntries,
    ...articleEntries,
  ];
}
