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

  // Only tags carrying more than one article. A tag used once adds a page
  // that duplicates the article it points at, which is thin content Google
  // will treat as noise rather than a useful index.
  const tagEntries: MetadataRoute.Sitemap = tags
    .filter((tag) => tag.count > 1)
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
