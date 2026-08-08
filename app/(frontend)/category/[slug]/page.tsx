import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleRow } from "@/components/article-card";
import { BackButton } from "@/components/back-button";
import { getByCategory } from "@/lib/articles";
import { categories, siteConfig } from "@/site.config";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      type: "website",
      title: `${category.name} | ${siteConfig.name}`,
      description: category.description,
      url: `${siteConfig.url}/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = await getByCategory(category.slug);

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
    ],
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="mb-4">
        <BackButton />
      </div>
      <TerminalWindow title={`category — ${category.slug}`}>
        <Prompt>ls ./category/{category.slug}</Prompt>
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
          {articles.length} {articles.length === 1 ? "article" : "articles"}
        </div>
      </TerminalWindow>

      {articles.length > 0 ? (
        <div className="mt-12">
          {articles.map((article) => (
            <ArticleRow key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-12 font-mono text-sm text-fg-subtle">
          No articles here yet — check back soon.
        </p>
      )}
    </div>
  );
}
