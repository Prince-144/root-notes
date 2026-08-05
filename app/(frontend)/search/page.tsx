import type { Metadata } from "next";
import { BackButton } from "@/components/back-button";
import { SearchClient } from "@/components/search-client";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const articles = await getArticles();

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-4">
        <BackButton />
      </div>

      <SearchClient articles={articles} initialQuery={q ?? ""} />
    </div>
  );
}
