import Link from "next/link";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleRow, TrendingRow } from "@/components/article-card";
import { NewsletterBox } from "@/components/newsletter-box";
import { formatDate, getArticles, getFeatured, getTrending } from "@/lib/articles";
import { categories, siteConfig } from "@/site.config";

export default async function HomePage() {
  const featured = await getFeatured();
  const allArticles = await getArticles();
  // The featured piece stays in this list. The hero above is a one-line
  // ticker, not a card — dropping the newest story out of "Latest analysis"
  // to avoid repeating a headline left the feed starting at the second-newest.
  const latest = allArticles;
  const trending = await getTrending(5);

  // Counted from the list already in hand rather than a query per category.
  // Published only, since that's what getArticles returns — the number a
  // reader sees matches what they'll find when they click through.
  const countByCategory = allArticles.reduce<Record<string, number>>((acc, a) => {
    acc[a.categorySlug] = (acc[a.categorySlug] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container-page py-10 sm:py-14">
      {/* ---------- HERO: live terminal feed ---------- */}
      <TerminalWindow title={`${siteConfig.name.toLowerCase()} — live feed`}>
        <Prompt>whoami</Prompt>
        <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-3xl">
          {siteConfig.tagline}
        </h1>

        <div className="mt-6">
          <Prompt>tail -f headlines.log</Prompt>
        </div>

        {featured && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-xs text-fg-subtle">
              [{formatDate(featured.publishedAt)}]
            </span>
            <span className="font-mono text-xs font-medium text-accent">NEW</span>
            <span className="tag-chip text-fg-subtle">
              {featured.categorySlug}
            </span>
            <Link
              href={`/article/${featured.slug}`}
              className="link-underline font-mono text-sm text-fg"
            >
              {featured.title}
            </Link>
          </div>
        )}

        <div className="mt-6 font-mono text-sm">
          <span className="mr-2 text-accent" aria-hidden>
            $
          </span>
          <span className="cursor-blink" aria-hidden />
        </div>
      </TerminalWindow>

      {/* ---------- POSITIONING ---------- */}
      <p className="mt-12 max-w-2xl text-base leading-relaxed text-fg-muted">
        Most news sites re-package yesterday&apos;s press releases. This one
        doesn&apos;t — every post is capped at five minutes, opens with what actually
        changed, and tells you why it matters before it tells you what happened.
      </p>

      {/* ---------- MAIN GRID ----------
          The sidebar column only exists when there's trending data to put in
          it (see getTrending). Keeping the two-column track unconditionally
          would leave a 280px hole beside the feed until then. */}
      <div
        className={
          trending.length > 0
            ? "mt-16 grid gap-12 lg:grid-cols-[1fr_280px]"
            : "mt-16"
        }
      >
        <section>
          <h2 className="text-lg font-semibold tracking-tight text-fg">
            Latest analysis
          </h2>
          <div className="mt-6">
            {latest.map((article) => (
              <ArticleRow key={article.slug} article={article} />
            ))}
          </div>
        </section>

        {trending.length > 0 && (
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <h2 className="label-mono">Trending now</h2>
            <ul className="mt-3">
              {trending.map((article, i) => (
                <TrendingRow key={article.slug} article={article} index={i} />
              ))}
            </ul>
          </aside>
        )}
      </div>

      {/* ---------- COVERAGE ----------
          Below the feed, not above it: this is where you look once you've
          finished scanning the headlines, and above the fold it was pushing
          the articles themselves down the page. */}
      <section className="mt-16 rounded-md border border-line bg-panel px-5 py-5 sm:px-7">
        <h2 className="label-mono">Coverage</h2>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => {
            const count = countByCategory[c.slug] ?? 0;
            return (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="group block">
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className="font-mono text-sm font-medium transition-opacity group-hover:opacity-70"
                      style={{ color: c.color }}
                    >
                      {c.name}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-fg-muted">
                      {count}
                    </span>
                  </span>
                  <span className="mt-1 block font-mono text-2xs uppercase tracking-widest text-fg-subtle">
                    {c.description.split(",")[0].split(" ").slice(0, 3).join(" ")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Last thing before the footer: the ask comes after the reader has
          seen what they'd be signing up for, not beside it. */}
      <div className="mt-10">
        <NewsletterBox />
      </div>
    </div>
  );
}
