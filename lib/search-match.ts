import type { ArticleSummary } from "./article-types";

/** Pure matcher shared by the server-side search action and the live client-side filter. */
export function matchesQuery(article: ArticleSummary, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  return (
    article.title.toLowerCase().includes(q) ||
    article.excerpt.toLowerCase().includes(q) ||
    article.author.toLowerCase().includes(q) ||
    article.categorySlug.toLowerCase().includes(q) ||
    article.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}
