"use client";

import { useMemo, useState } from "react";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleRow } from "@/components/article-card";
import { matchesQuery } from "@/lib/search-match";
import type { ArticleSummary } from "@/lib/article-types";

export function SearchClient({
  articles,
  initialQuery,
}: {
  articles: ArticleSummary[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const trimmed = query.trim();

  /**
   * With no query this lists everything rather than showing an empty page.
   * The homepage caps its feed and links here as "view all", so this is the
   * archive — arriving at a blank screen after clicking that would be a dead
   * end for the reader and for anything crawling the link.
   */
  const results = useMemo(
    () => (trimmed ? articles.filter((a) => matchesQuery(a, query)) : articles),
    [articles, query, trimmed],
  );

  return (
    <>
      <TerminalWindow title="search">
        <Prompt>
          <span className="flex flex-1 items-center gap-2">
            <span aria-hidden>grep -ri</span>
            <label htmlFor="search-q" className="sr-only">
              Search articles
            </label>
            <input
              id="search-q"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ransomware, agent pricing, arm laptops…"
              autoFocus
              className="min-w-0 flex-1 border-b border-line bg-transparent px-1 py-0.5 font-mono text-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
            />
          </span>
        </Prompt>

        <div className="mt-4 font-mono text-xs text-fg-subtle">
          {trimmed ? (
            <>
              {results.length} result{results.length === 1 ? "" : "s"} for &quot;{trimmed}&quot;
            </>
          ) : (
            <>{articles.length} articles — type to filter</>
          )}
        </div>
      </TerminalWindow>

      {results.length > 0 && (
        <div className="mt-12">
          {results.map((article) => (
            <ArticleRow key={article.slug} article={article} />
          ))}
        </div>
      )}

      {trimmed && results.length === 0 && (
        <p className="mt-12 font-mono text-sm text-fg-subtle">
          No matches. Try a different term.
        </p>
      )}
    </>
  );
}
