import type { MetadataRoute } from "next";
import { getAllTags, getArticles } from "@/lib/articles";
import { categories, siteConfig } from "@/site.config";

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
    ...categoryEntries,
    ...tagEntries,
    ...articleEntries,
  ];
}
