import Link from "next/link";
import type { Metadata } from "next";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { formatDate, getArticles } from "@/lib/articles";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Archive",
  description: `Every article published on ${siteConfig.name}, newest first.`,
  alternates: { canonical: "/archive" },
  robots: { index: true, follow: true },
};

/**
 * Every article on one page, grouped by month.
 *
 * This exists for crawlers as much as for readers. The feed shows one page at
 * a time and the rest is reachable through pagination, which puts a piece from
 * two months ago thirty clicks from the homepage — and Google's answer to that
 * depth, on a site this young, was to leave 153 articles discovered and never
 * crawled. An archive page makes every one of them one click from here, and
 * one more from the homepage.
 *
 * Built from the list the rest of the build already has, so it costs no extra
 * database read.
 */
export default async function ArchivePage() {
  const articles = await getArticles();

  const months = new Map<string, typeof articles>();
  for (const article of articles) {
    const key = article.publishedAt.slice(0, 7); // YYYY-MM
    const group = months.get(key);
    if (group) group.push(article);
    else months.set(key, [article]);
  }

  const monthLabel = (key: string) =>
    new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <div className="container-page py-10 sm:py-14">
      <TerminalWindow title="archive">
        <Prompt>ls -lt articles/</Prompt>
        <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-3xl">
          Archive
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
          All {articles.length} articles, newest first. For a specific subject,{" "}
          <Link href="/search" className="text-accent hover:opacity-70">
            search
          </Link>{" "}
          is faster.
        </p>
      </TerminalWindow>

      {[...months.entries()].map(([key, group]) => (
        <section key={key} className="mt-12">
          <h2 className="label-mono">{monthLabel(key)}</h2>

          <ul className="mt-4 border-t border-line">
            {group.map((article) => (
              <li
                key={article.slug}
                className="flex flex-col gap-1 border-b border-line py-3 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="shrink-0 font-mono text-xs tabular-nums text-fg-subtle">
                  {formatDate(article.publishedAt)}
                </span>
                <Link
                  href={`/article/${article.slug}`}
                  className="link-underline text-sm leading-snug text-fg"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
