import Link from "next/link";
import type { Metadata } from "next";
import { CveSearch } from "@/components/cve-search";
import { getAllCves } from "@/lib/articles";
import { getKevCatalog } from "@/lib/kev";
import type { CveIndexEntry } from "@/lib/cve";
import { jsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "CVE Index",
  description:
    "Every CVE identifier Root Notes has reported on, searchable by number. Each one links to our coverage and to the authoritative record.",
  alternates: { canonical: "/cve" },
  robots: { index: true, follow: true },
};

/**
 * The hub for the identifier pages.
 *
 * It exists for the same reason the archive does: forty-odd CVE pages that
 * nothing links to are forty-odd pages Google will leave discovered and
 * uncrawled, which is precisely what happened to 153 articles before the
 * archive page gave them one click from the footer. Every identifier is one
 * click from here, and this is one click from every page on the site.
 *
 * Built from the list the rest of the build already has, so it costs no extra
 * database read.
 */
export default async function CveIndexPage() {
  const cves = await getAllCves();

  // One fetch for the whole index rather than one per row. An unreachable
  // catalog leaves every row unmarked, which is the honest default.
  const { entries: kev } = await getKevCatalog();

  // Only what a row needs. Shipping the full article summaries for every
  // identifier would send the whole feed to the browser to render two lines
  // of each.
  const entries: CveIndexEntry[] = cves.map((cve) => ({
    id: cve.id,
    slug: cve.slug,
    count: cve.articles.length,
    latestTitle: cve.articles[0].title,
    latestDate: cve.articles[0].publishedAt,
    kevAdded: kev.get(cve.id)?.dateAdded,
  }));

  const articleCount = new Set(cves.flatMap((c) => c.articles.map((a) => a.slug))).size;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "CVE Index",
        item: `${siteConfig.url}/cve`,
      },
    ],
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbLd) }}
      />

      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-3xl">
        CVE Index
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        {entries.length} identifiers across {articleCount}{" "}
        {articleCount === 1 ? "article" : "articles"}. Search by number — the box
        below matches identifiers only. For a subject rather than a number,{" "}
        <Link href="/search" className="text-accent hover:opacity-70">
          search the writing
        </Link>
        .
      </p>

      <div className="mt-8">
        <CveSearch entries={entries} />
      </div>
    </div>
  );
}
