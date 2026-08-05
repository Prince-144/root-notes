import Link from "next/link";
import { formatDate, type Article } from "@/lib/article-types";
import { CategoryChip, MetaChip } from "./tag-chip";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex h-full flex-col rounded-md border border-line bg-panel p-5 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between gap-3">
        <CategoryChip slug={article.categorySlug} />
        <MetaChip>{article.readingMinutes} MIN</MetaChip>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-fg">
        <Link href={`/article/${article.slug}`} className="link-underline">
          <span className="absolute inset-0" aria-hidden />
          {article.title}
        </Link>
      </h3>

      <p className="mt-2.5 text-sm leading-relaxed text-fg-subtle">{article.excerpt}</p>

      <div className="mt-auto pt-5">
        <MetaChip>{formatDate(article.publishedAt)}</MetaChip>
      </div>
    </article>
  );
}

/** Compact numbered row used in the Trending list. */
export function TrendingRow({ article, index }: { article: Article; index: number }) {
  return (
    <li className="group relative flex gap-4 border-b border-line py-4 last:border-0">
      <span className="font-mono text-sm text-accent/70 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-medium leading-snug text-fg">
          <Link href={`/article/${article.slug}`} className="link-underline">
            <span className="absolute inset-0" aria-hidden />
            {article.title}
          </Link>
        </h3>
        <div className="mt-1.5 flex items-center gap-3">
          <MetaChip>{article.categorySlug.toUpperCase()}</MetaChip>
          <MetaChip>{article.readingMinutes} MIN</MetaChip>
        </div>
      </div>
    </li>
  );
}
