/**
 * Client-safe pieces split out of lib/articles.ts. That file imports Payload's
 * server-only SDK (getPayload, @payload-config) — any client component that
 * imports even `formatDate` or the `Article` type from it drags the whole
 * Payload/Postgres module graph into the browser bundle and breaks the build.
 * Components reachable from a "use client" component must import from here
 * instead.
 */
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  /** MDX source for the article body — rendered into .article-body via next-mdx-remote. */
  body: string;
  categorySlug: string;
  tags: string[];
  author: string;
  publishedAt: string; // ISO date
  readingMinutes: number;
  featured?: boolean;
  views?: number;
};

export function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10); // 2026-08-04
}
