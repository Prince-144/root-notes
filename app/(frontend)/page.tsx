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
  //
  // Capped, because it used to render every published article. Past about
  // thirty rows nobody is still scanning, and everything below the feed —
  // Coverage, the newsletter — was pushed somewhere no reader reaches.
  const HOME_FEED_LIMIT = 30;
  const latest = allArticles.slice(0, HOME_FEED_LIMIT);
  const hasMore = allArticles.length > HOME_FEED_LIMIT;
  const trending = await getTrending(5);

  // Counted from the list already in hand rather than a query per category.
  // Published only, since that's what getArticles returns — the number a
  // reader sees matches what they'll find when they click through.
  const countByCategory = allArticles.reduce<Record<string, number>>((acc, a) => {
    acc[a.categorySlug] = (acc[a.categorySlug] ?? 0) + 1;
    return acc;
  }, {});

  /**
   * The article pages carry NewsArticle markup, but the homepage carried none,
   * so nothing told Google what the site itself is. WebSite + Organization is
   * how a publication gets treated as a publication rather than as a loose
   * collection of pages.
   */
  const siteLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.tagline,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/icon.png`,
        },
      },
    ],
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
      />

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
          {/* Ten articles are laid out normally; the rest scroll inside the
              feed rather than running the page to nine thousand pixels, so
              Coverage and the newsletter sit just below a readable feed
              instead of past thirty rows.

              1820px is ten rows at their measured height — tying it to a vh
              value made the visible count depend on the reader's screen.

              Left as normal flow on small screens: a tall scroll region inside
              a phone viewport traps the gesture and is worse than a long page.
              The cap on `latest` is what keeps mobile reasonable. */}
          <div className="mt-6 lg:max-h-[1820px] lg:overflow-y-auto lg:pr-3">
            {latest.map((article) => (
              <ArticleRow key={article.slug} article={article} />
            ))}
          </div>

          {hasMore && (
            <Link
              href="/search"
              className="mt-6 inline-block font-mono text-sm text-accent transition-opacity hover:opacity-70"
            >
              View all {allArticles.length} articles →
            </Link>
          )}
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
          the articles themselves down the page.

          It reads as a wide five-across strip; squeezed into the 280px sidebar
          it looked cramped and wrong, so it stays full width. What keeps it
          reachable is the cap on the feed above, not a change of position. */}
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
