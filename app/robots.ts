import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    // Both files, because they answer different questions: sitemap.xml is the
    // full list, news-sitemap.xml is only the last two days with publication
    // times, which is what a news crawler polls.
    sitemap: [`${siteConfig.url}/sitemap.xml`, `${siteConfig.url}/news-sitemap.xml`],
  };
}
