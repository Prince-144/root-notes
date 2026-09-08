import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleRow } from "@/components/article-card";
import { Pagination } from "@/components/pagination";
import { getArticles } from "@/lib/articles";
import { siteConfig } from "@/site.config";
import { jsonLd } from "@/lib/json-ld";
import { PAGE_SIZE, paginate, parsePage } from "@/lib/pagination";

/**
 * Pages two and up of the front-page feed.
 *
 * Page one stays at "/" — it is the URL that is already indexed and linked,
 * and having it answer at /page/1 as well would be the same content under two
 * addresses, so that path redirects instead.
 *
 * This page is deliberately plainer than the homepage: no hero, no positioning
 * copy, no Coverage grid. Somebody on page four is reading the archive, not
 * being introduced to the site.
 */
export async function generateStaticParams() {
  const articles = await getArticles();
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  const page = parsePage(n);
  if (!page) return {};

  return {
    title: `Archive — page ${page}`,
    description: `Page ${page} of every analysis published on ${siteConfig.name}.`,
    alternates: { canonical: `/page/${page}` },
    openGraph: {
      type: "website",
      title: `Archive — page ${page} | ${siteConfig.name}`,
      url: `${siteConfig.url}/page/${page}`,
    },
  };
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const page = parsePage(n);
  if (!page) notFound();
  if (page === 1) redirect("/");

  const articles = await getArticles();
  const { items, totalPages, total } = paginate(articles, page);
  if (page > totalPages) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: `Page ${page}`,
        item: `${siteConfig.url}/page/${page}`,
      },
    ],
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbLd) }}
      />

      <TerminalWindow title={`${siteConfig.name.toLowerCase()} — archive`}>
        <Prompt>ls ./archive --page {page}</Prompt>
        <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-3xl">
          Archive
        </h1>
        <div className="mt-6 font-mono text-xs text-fg-subtle">
          page {page} of {totalPages} — {total}{" "}
          {total === 1 ? "article" : "articles"}
        </div>
      </TerminalWindow>

      <div className="mt-12">
        {items.map((article) => (
          <ArticleRow key={article.slug} article={article} />
        ))}
      </div>

      <Pagination basePath="/" page={page} totalPages={totalPages} />

      <Link
        href="/search"
        className="mt-6 inline-block font-mono text-sm text-accent transition-opacity hover:opacity-70"
      >
        Search all {total} articles →
      </Link>
    </div>
  );
}
