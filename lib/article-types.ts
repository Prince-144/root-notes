/**
 * Client-safe pieces split out of lib/articles.ts. That file imports Payload's
 * server-only SDK (getPayload, @payload-config) — any client component that
 * imports even `formatDate` or the `Article` type from it drags the whole
 * Payload/Postgres module graph into the browser bundle and breaks the build.
 * Components reachable from a "use client" component must import from here
 * instead.
 */
/**
 * Everything a list view needs — cards, rows, search, feeds, sitemap.
 *
 * Deliberately excludes the body. Every list page renders every article, and
 * pulling the full MDX for each one made the query 6x larger than the fields
 * actually being displayed (85KB vs 15KB at 19 articles, growing linearly).
 */
export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  tags: string[];
  author: string;
  publishedAt: string; // ISO date
  readingMinutes: number;
  featured?: boolean;
  views?: number;
  coverImageUrl?: string;
  /**
   * Description of the cover image. Only present for uploaded covers, where
   * the Media collection requires one — stock URLs have nothing to describe
   * them, so callers should fall back rather than render an empty alt on a
   * meaningful image.
   */
  coverImageAlt?: string;
};

/** A summary plus the MDX source — only fetched for the article page itself. */
export type Article = ArticleSummary & {
  /** MDX source for the article body — rendered into .article-body via next-mdx-remote. */
  body: string;
  /** Payload's own timestamp, used for dateModified in the article's structured data. */
  updatedAt?: string;
};

export function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10); // 2026-08-04
}
