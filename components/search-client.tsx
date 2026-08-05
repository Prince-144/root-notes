"use client";

import { useMemo, useState } from "react";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleCard } from "@/components/article-card";
import { matchesQuery } from "@/lib/search-match";
import type { Article } from "@/lib/article-types";

export function SearchClient({
  articles,
  initialQuery,
}: {
  articles: Article[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const trimmed = query.trim();

  const results = useMemo(
    () => (trimmed ? articles.filter((a) => matchesQuery(a, query)) : []),
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

        {trimmed && (
          <div className="mt-4 font-mono text-xs text-fg-subtle">
            {results.length} result{results.length === 1 ? "" : "s"} for &quot;{trimmed}&quot;
          </div>
        )}
      </TerminalWindow>

      {trimmed && results.length > 0 && (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((article) => (
            <ArticleCard key={article.slug} article={article} />
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
