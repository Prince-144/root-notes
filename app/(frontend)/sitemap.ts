import type { MetadataRoute } from "next";
import { getAllTags, getArticles, getByCategory } from "@/lib/articles";
import { categories, siteConfig } from "@/site.config";
import { PAGE_SIZE } from "@/lib/pagination";

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

  return [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    ...homePageEntries,
    ...categoryEntries,
    ...categoryPageEntries,
    ...tagEntries,
    ...articleEntries,
  ];
}
