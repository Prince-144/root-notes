import { getArticles } from "@/lib/articles";
import { siteConfig } from "@/site.config";

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return char;
    }
  });
}

/**
 * Number of items in the feed. Readers only ever show the newest handful, and
 * the archive is on the site; shipping every article would grow this response
 * without limit as the archive does.
 */
const FEED_LIMIT = 50;

export async function GET() {
  const articles = (await getArticles()).slice(0, FEED_LIMIT);

  const items = articles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteConfig.url}/article/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/article/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
      <dc:creator>${escapeXml(article.author)}</dc:creator>
      <category>${escapeXml(article.categorySlug)}</category>
    </item>`,
    )
    .join("");

  // Newest article, or now for an empty feed.
  const updated = articles[0]?.publishedAt
    ? new Date(articles[0].publishedAt)
    : new Date();

  /**
   * The atom:self link and dc:creator are what feed validators ask for: RSS
   * 2.0's own <author> element is specified as an email address, so a bare
   * name belongs in Dublin Core instead.
   */
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
