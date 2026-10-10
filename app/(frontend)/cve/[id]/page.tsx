import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleRow } from "@/components/article-card";
import { BackButton } from "@/components/back-button";
import { formatDate, getAllCves, getCve } from "@/lib/articles";
import { cveRecords, cveSlug } from "@/lib/cve";
import { getKevCatalog, getKevEntry, KEV_URL } from "@/lib/kev";
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

  // The one piece of status this page reports, because it is the one that
  // comes dated and attributed. An unreachable catalog has an empty version,
  // and then the page says nothing rather than claiming an absence it could
  // not check.
  const kev = await getKevEntry(cve.id);
  const { version: kevVersion } = await getKevCatalog();

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

        {kev ? (
          <div className="mt-2 font-mono text-xs text-[var(--color-sig-amber)]">
            IN CISA KEV — ADDED {kev.dateAdded}
            {kev.knownRansomwareCampaignUse === "Known" && " — KNOWN RANSOMWARE USE"}
          </div>
        ) : kevVersion ? (
          <div className="mt-2 font-mono text-xs text-fg-subtle">
            NOT IN CISA KEV — CATALOG {kevVersion}
          </div>
        ) : null}
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

        {/* KEV is the exception to this page reporting no status of its own.
            It is a dated, attributed statement from a named authority that
            something is being exploited — a fact with a source, rather than a
            severity we would be inventing. */}
        {kev ? (
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            CISA added this identifier to its{" "}
            <a
              href={KEV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:opacity-70"
            >
              Known Exploited Vulnerabilities catalog
            </a>{" "}
            on {kev.dateAdded}, which means the agency has evidence of exploitation
            rather than a judgement that exploitation is possible.
            {kev.dueDate
              ? ` US federal agencies were required to remediate it by ${kev.dueDate}.`
              : ""}
            {kev.knownRansomwareCampaignUse === "Known"
              ? " CISA also records known use in ransomware campaigns."
              : ""}
          </p>
        ) : kevVersion ? (
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            Not listed in{" "}
            <a
              href={KEV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:opacity-70"
            >
              CISA&apos;s Known Exploited Vulnerabilities catalog
            </a>{" "}
            as of catalog {kevVersion}. That is not evidence it is not being
            exploited — the catalog records what CISA has confirmed, and
            identifiers have been attacked for days before appearing in it.
          </p>
        ) : null}
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
