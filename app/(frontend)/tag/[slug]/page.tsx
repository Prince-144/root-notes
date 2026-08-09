import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleRow } from "@/components/article-card";
import { BackButton } from "@/components/back-button";
import { getAllTags, getByTag } from "@/lib/articles";
import { siteConfig } from "@/site.config";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

/**
 * A tag coined after the last build still works — it just renders on demand
 * instead of being prebuilt. Without this, tagging a new article with a new
 * word would 404 until the next deploy.
 */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getByTag(slug);
  if (articles.length === 0) return {};

  const description = `Every Root Notes story tagged ${slug}.`;

  return {
    title: `#${slug}`,
    description,
    alternates: { canonical: `/tag/${slug}` },
    openGraph: {
      type: "website",
      title: `#${slug} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/tag/${slug}`,
    },
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getByTag(slug);

  // No tag page for a word nothing carries — otherwise any URL would render
  // an empty shell and get indexed as a real page.
  if (articles.length === 0) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: `#${slug}`,
        item: `${siteConfig.url}/tag/${slug}`,
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

      <TerminalWindow title={`tag — ${slug}`}>
        <Prompt>grep -rl &quot;{slug}&quot; ./articles</Prompt>
        <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-3xl">
          #{slug}
        </h1>
        <div className="mt-6 font-mono text-xs text-fg-subtle">
          {articles.length} {articles.length === 1 ? "article" : "articles"}
        </div>
      </TerminalWindow>

      <div className="mt-12">
        {articles.map((article) => (
          <ArticleRow key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
