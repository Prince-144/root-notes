import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { categories, siteConfig } from "@/site.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();

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

  return [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    ...categoryEntries,
    ...articleEntries,
  ];
}
