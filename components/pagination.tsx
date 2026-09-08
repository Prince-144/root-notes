import Link from "next/link";
import { pageHref, pageWindow } from "@/lib/pagination";

/**
 * Listing pagination, styled as a command line rather than a row of buttons —
 * it sits under a terminal-framed feed and a set of pill buttons reads as
 * borrowed from somewhere else.
 *
 * Renders nothing for a single page, so a category with eight articles does
 * not get a control that only ever points at itself.
 */
export function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const numbers = pageWindow(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-6 font-mono text-sm"
    >
      {page > 1 ? (
        <Link
          href={pageHref(basePath, page - 1)}
          rel="prev"
          className="text-accent transition-opacity hover:opacity-70"
        >
          ← prev
        </Link>
      ) : (
        <span className="text-fg-subtle" aria-hidden>
          ← prev
        </span>
      )}

      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {numbers.map((n, i) =>
          n === null ? (
            <li key={`gap-${i}`} className="text-fg-subtle" aria-hidden>
              …
            </li>
          ) : (
            <li key={n}>
              {n === page ? (
                <span
                  aria-current="page"
                  className="tabular-nums font-medium text-fg"
                >
                  {n}
                </span>
              ) : (
                <Link
                  href={pageHref(basePath, n)}
                  className="tabular-nums text-fg-muted transition-colors hover:text-accent"
                >
                  {n}
                </Link>
              )}
            </li>
          ),
        )}
      </ol>

      {page < totalPages ? (
        <Link
          href={pageHref(basePath, page + 1)}
          rel="next"
          className="text-accent transition-opacity hover:opacity-70"
        >
          next →
        </Link>
      ) : (
        <span className="text-fg-subtle" aria-hidden>
          next →
        </span>
      )}

      <span className="ml-auto text-xs text-fg-subtle">
        page {page} of {totalPages}
      </span>
    </nav>
  );
}
