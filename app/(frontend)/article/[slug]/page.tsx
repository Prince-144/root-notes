import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { RelatedPosts } from "@/components/related-posts";
import { CategoryChip, MetaChip } from "@/components/tag-chip";
import { BackButton } from "@/components/back-button";
import { ViewTracker } from "@/components/view-tracker";
import { formatDate, getArticles, getBySlug, getRelated, tagToSlug } from "@/lib/articles";
import { getCategory, siteConfig } from "@/site.config";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/article/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [article.author],
      url: `${siteConfig.url}/article/${article.slug}`,
      ...(article.coverImageUrl ? { images: [article.coverImageUrl] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBySlug(slug);
  if (!article) notFound();

  const category = getCategory(article.categorySlug);
  const related = await getRelated(article, 3);

  const articleUrl = `${siteConfig.url}/article/${article.slug}`;
  const categoryUrl = `${siteConfig.url}/category/${category.slug}`;

  /**
   * `image` and `publisher.logo` are required for Google's article rich
   * results — without them the page renders fine and simply never qualifies,
   * which is a silent failure rather than an error anyone would notice.
   *
   * Relative image paths are made absolute: structured data is consumed
   * outside the page's own context, so it can't resolve "/covers/x.jpg".
   */
  const absolute = (url: string) => (url.startsWith("http") ? url : `${siteConfig.url}${url}`);

  const newsArticleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    ...(article.coverImageUrl ? { image: [absolute(article.coverImageUrl)] } : {}),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.png`,
      },
    },
    mainEntityOfPage: articleUrl,
    articleSection: category.name,
    keywords: article.tags.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: category.name, item: categoryUrl },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ViewTracker slug={article.slug} />
      <div className="mb-4">
        <BackButton />
      </div>
      <Prompt>
        <Link href={`/category/${category.slug}`} className="link-underline">
          cd /category/{category.slug}
        </Link>
      </Prompt>

      <TerminalWindow title={`${article.slug}.mdx`} className="mt-4">
        <Prompt>cat {article.slug}.mdx --frontmatter</Prompt>
        <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-3xl">
          {article.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <CategoryChip slug={article.categorySlug} />
          <MetaChip>{article.author}</MetaChip>
          <MetaChip>{formatDate(article.publishedAt)}</MetaChip>
        </div>
      </TerminalWindow>

      {article.coverImageUrl && (
        <div className="relative mx-auto mt-10 aspect-video max-w-content overflow-hidden rounded-md border border-line">
          {/* The lead image carries meaning here, unlike the card thumbnails
              where the headline sits directly alongside. Uses the uploader's
              description when there is one, and falls back to the headline
              rather than leaving a screen reader with nothing. */}
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt ?? article.title}
            fill
            sizes="(min-width: 768px) 720px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <article className="article-body mx-auto mt-10 max-w-content">
        {/* remark-gfm, or a markdown table in the body renders as a paragraph
            of pipe characters. Article bodies routinely contain tables, so
            without this the comparison in a piece silently turns to noise. */}
        <MDXRemote
          source={article.body}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>

      <div className="mx-auto mt-10 flex max-w-content flex-wrap gap-2">
        {article.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tagToSlug(tag)}`}
            className="tag-chip text-fg-subtle transition-colors hover:border-accent hover:text-fg"
          >
            {tag}
          </Link>
        ))}
      </div>

      <RelatedPosts articles={related} />
    </div>
  );
}
