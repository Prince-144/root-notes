import { getArticles } from "@/lib/articles";
import { escapeXml } from "@/lib/xml";
import { siteConfig } from "@/site.config";

/**
 * The news sitemap, which is a different document from the ordinary one.
 *
 * Google reads this for recency rather than for discovery: it carries only
 * what was published in the last two days, with each entry's publication time
 * and headline, and it is the file a news crawler checks when deciding whether
 * a site has anything new. The ordinary sitemap lists all 300-odd articles and
 * says nothing about which of them is an hour old.
 *
 * It does not get a site into Google News on its own. Acceptance happens in
 * Publisher Center; this is the signal that matters once that is in place, and
 * it costs nothing to publish before then.
 */
export const dynamic = "force-static";

/** Google's own limit for this file, and the window it reads. */
const WINDOW_HOURS = 48;
const MAX_ENTRIES = 1000;

export async function GET(): Promise<Response> {
  const articles = await getArticles();
  const cutoff = Date.now() - WINDOW_HOURS * 60 * 60 * 1000;

  const recent = articles
    .filter((article) => Date.parse(article.publishedAt) >= cutoff)
    .slice(0, MAX_ENTRIES);

  const entries = recent
    .map(
      (article) => `  <url>
    <loc>${siteConfig.url}/article/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(siteConfig.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
