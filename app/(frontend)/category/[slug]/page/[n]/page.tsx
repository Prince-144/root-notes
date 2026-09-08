import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleRow } from "@/components/article-card";
import { BackButton } from "@/components/back-button";
import { Pagination } from "@/components/pagination";
import { getByCategory } from "@/lib/articles";
import { categories, siteConfig } from "@/site.config";
import { jsonLd } from "@/lib/json-ld";
import { PAGE_SIZE, paginate, parsePage } from "@/lib/pagination";

/**
 * Pages two and up of a category listing. Page one stays at
 * /category/slug, and /category/slug/page/1 redirects there so the same
 * content is never served from two URLs.
 */
export async function generateStaticParams() {
  const params: { slug: string; n: string }[] = [];
  for (const category of categories) {
    const articles = await getByCategory(category.slug);
    const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
    for (let n = 2; n <= totalPages; n += 1) {
      params.push({ slug: category.slug, n: String(n) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; n: string }>;
}): Promise<Metadata> {
  const { slug, n } = await params;
  const category = categories.find((c) => c.slug === slug);
  const page = parsePage(n);
  if (!category || !page) return {};

  return {
    title: `${category.name} — page ${page}`,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}/page/${page}` },
    openGraph: {
      type: "website",
      title: `${category.name} — page ${page} | ${siteConfig.name}`,
      description: category.description,
      url: `${siteConfig.url}/category/${category.slug}/page/${page}`,
    },
  };
}

export default async function CategoryArchivePage({
  params,
}: {
  params: Promise<{ slug: string; n: string }>;
}) {
  const { slug, n } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const page = parsePage(n);
  if (!page) notFound();
  if (page === 1) redirect(`/category/${category.slug}`);

  const articles = await getByCategory(category.slug);
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
        name: category.name,
        item: `${siteConfig.url}/category/${category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Page ${page}`,
        item: `${siteConfig.url}/category/${category.slug}/page/${page}`,
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
      <TerminalWindow title={`category — ${category.slug}`}>
        <Prompt>
          ls ./category/{category.slug} --page {page}
        </Prompt>
        <h1
          className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
          style={{ color: category.color }}
        >
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
          {category.description}
        </p>
        <div className="mt-6 font-mono text-xs text-fg-subtle">
          page {page} of {totalPages} — {total}{" "}
          {total === 1 ? "article" : "articles"}
        </div>
      </TerminalWindow>

      <div className="mt-12">
        {items.map((article) => (
          <ArticleRow key={article.slug} article={article} showCategory={false} />
        ))}
      </div>

      <Pagination
        basePath={`/category/${category.slug}`}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
