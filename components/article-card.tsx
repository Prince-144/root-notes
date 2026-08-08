import Image from "next/image";
import Link from "next/link";
import { formatDate, type Article } from "@/lib/article-types";
import { CategoryChip, MetaChip } from "./tag-chip";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex h-full flex-col rounded-md border border-line bg-panel p-5 transition-colors hover:border-line-strong">
      {article.coverImageUrl && (
        <div className="relative -mx-5 -mt-5 mb-4 aspect-video overflow-hidden rounded-t-md border-b border-line">
          <Image
            src={article.coverImageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex items-center gap-3">
        <CategoryChip slug={article.categorySlug} />
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-fg">
        <Link href={`/article/${article.slug}`} className="link-underline">
          <span className="absolute inset-0" aria-hidden />
          {article.title}
        </Link>
      </h3>

      <p className="mt-2.5 text-sm leading-relaxed text-fg-subtle">{article.excerpt}</p>

      {/* Rule under the meta row: without it the date and the category chip
          render as the same small mono text and the card reads as one flat
          block. The rule gives the meta somewhere to sit. */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
        <p className="font-mono text-2xs tracking-widest text-fg-subtle">
          {formatDate(article.publishedAt)}
        </p>
        {/* Dimmed rather than hover-only: hover never fires on touch, so a
            reveal-on-hover affordance is invisible to half the readers. */}
        <span
          aria-hidden
          className="shrink-0 font-mono text-2xs tracking-widest text-accent opacity-50 transition-opacity group-hover:opacity-100"
        >
          READ →
        </span>
      </div>
    </article>
  );
}

/**
 * Wide list row: thumbnail left, headline and standfirst right.
 *
 * Trades the grid's density for scannability — at a glance you get the
 * headline at full width instead of wrapped across four lines in a narrow
 * column, which is what a news feed is actually read for.
 */
export function ArticleRow({ article }: { article: Article }) {
  return (
    <article className="group relative flex gap-4 border-b border-line py-6 first:pt-0 last:border-0 sm:gap-6">
      {article.coverImageUrl && (
        <div className="relative aspect-video w-28 shrink-0 self-start overflow-hidden rounded-md border border-line sm:w-56">
          <Image
            src={article.coverImageUrl}
            alt=""
            fill
            sizes="(min-width: 640px) 224px, 112px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold leading-snug tracking-tight text-fg sm:text-lg">
          <Link href={`/article/${article.slug}`} className="link-underline">
            <span className="absolute inset-0" aria-hidden />
            {article.title}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <MetaChip>{formatDate(article.publishedAt)}</MetaChip>
          <CategoryChip slug={article.categorySlug} />
        </div>

        {/* Clamped rather than full: uneven excerpt lengths turn a stacked
            list into a ragged wall, and the row is a teaser, not the piece. */}
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-fg-subtle">
          {article.excerpt}
        </p>
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
        </div>
      </div>
    </li>
  );
}
