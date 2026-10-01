import { Suspense } from "react";
import type { Metadata } from "next";
import { BackButton } from "@/components/back-button";
import { SearchClient } from "@/components/search-client";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

/**
 * Prerendered, and filtered in the browser.
 *
 * The filtering was always client-side — SearchClient has the whole list and
 * matchesQuery runs in the browser — but reading the q parameter on the server
 * made the page dynamic, so every visit and every crawler hitting a ?q= URL
 * queried Postgres for the full article list. The database is metered, and
 * that is a query nobody needed: the list is identical whatever the query is.
 *
 * SearchClient reads q from the URL itself now, which is why the boundary
 * below exists — useSearchParams needs one in a statically rendered page.
 * force-static is here to keep it that way: anything that reintroduces a
 * request-time dependency fails the build instead of quietly costing a query
 * per visit.
 */
export const dynamic = "force-static";

export default async function SearchPage() {
  const articles = await getArticles();

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-4">
        <BackButton />
      </div>

      <Suspense fallback={null}>
        <SearchClient articles={articles} />
      </Suspense>
    </div>
  );
}
