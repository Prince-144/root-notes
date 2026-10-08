import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleRow } from "@/components/article-card";
import { BackButton } from "@/components/back-button";
import { formatDate, getAllCves, getCve } from "@/lib/articles";
import { cveRecords, cveSlug } from "@/lib/cve";
import { jsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/site.config";

export async function generateStaticParams() {
  const cves = await getAllCves();
  return cves.map((cve) => ({ id: cve.slug }));
}

/**
 * An identifier first written about after the last build still works — it
 * renders on demand instead of being prebuilt. Without this, a CVE covered
 * between deploys would 404 for exactly the days the number is being searched,
 * which is the only window where this page has little competition.
 */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cve = await getCve(id);
  if (!cve) return {};

  /**
   * The identifier alone, which the layout turns into "CVE-2026-88779 | Root
   * Notes". No headline in front of it and no words after it: the query this
   * page is for is the bare number, and a result listing cuts off around sixty
   * characters. Same reasoning as lib/seo-title.ts, one step further.
   */
  const description = cve.articles[0].excerpt;

  return {
    title: cve.id,
    description,
    alternates: { canonical: `/cve/${cve.slug}` },
    openGraph: {
      type: "website",
      title: `${cve.id} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/cve/${cve.slug}`,
    },
  };
}

export default async function CvePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  /**
   * One identifier, one URL.
   *
   * generateStaticParams emits the lowercase form, but uppercase is how every
   * advisory writes it and therefore how it gets typed and pasted. Rendering
   * the same page at both spellings would split it into two competing URLs, so
   * the uppercase one is a permanent redirect rather than a copy.
   */
  if (id !== cveSlug(id)) permanentRedirect(`/cve/${cveSlug(id)}`);

  const cve = await getCve(id);

  // No page for an identifier nothing covers — otherwise every CVE number ever
  // issued would render an empty shell here and ask to be indexed.
  if (!cve) notFound();

  const newest = cve.articles[0];
  const oldest = cve.articles[cve.articles.length - 1];
  const records = cveRecords(cve.id);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "CVE Index", item: `${siteConfig.url}/cve` },
      {
        "@type": "ListItem",
        position: 3,
        name: cve.id,
        item: `${siteConfig.url}/cve/${cve.slug}`,
      },
    ],
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbLd) }}
      />
      <div className="mb-4">
        <BackButton />
      </div>

      <TerminalWindow title={`cve — ${cve.slug}`}>
        <Prompt>grep -rl &quot;{cve.id}&quot; ./articles</Prompt>
        <h1 className="mt-3 font-mono text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-3xl">
          {cve.id}
        </h1>

        {/* Our own account of it, not a sentence of boilerplate about the page.
            A list of links with no prose above it is a thin page, and thin
            pages are what the crawl budget on this domain gets spent on. */}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted">
          {newest.excerpt}
        </p>

        <div className="mt-6 font-mono text-xs text-fg-subtle">
          {cve.articles.length} {cve.articles.length === 1 ? "article" : "articles"} —{" "}
          {cve.articles.length === 1
            ? formatDate(newest.publishedAt)
            : `${formatDate(oldest.publishedAt)} to ${formatDate(newest.publishedAt)}`}
        </div>
      </TerminalWindow>

      {/* Linked, not summarised. Nothing here has read either record, so
          nothing here reports a severity, a score or an affected range. */}
      <div className="mt-8 border border-line p-4">
        <h2 className="label-mono">Authoritative record</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Root Notes reports on this identifier; it does not maintain it. For the
          vendor advisory, the affected versions and the scoring,{" "}
          {records.map((record, i) => (
            <span key={record.name}>
              {i > 0 && " and "}
              <a
                href={record.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:opacity-70"
              >
                {record.name}
              </a>
            </span>
          ))}{" "}
          hold the primary records.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="label-mono">Our coverage</h2>
        <div className="mt-4">
          {cve.articles.map((article) => (
            <ArticleRow key={article.slug} article={article} />
          ))}
        </div>
      </div>

      <p className="mt-12 font-mono text-xs text-fg-subtle">
        <Link href="/cve" className="text-accent hover:opacity-70">
          ../cve
        </Link>{" "}
        — every identifier we have covered
      </p>
    </div>
  );
}
