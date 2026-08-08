import Link from "next/link";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { ArticleCard, TrendingRow } from "@/components/article-card";
import { NewsletterBox } from "@/components/newsletter-box";
import { formatDate, getArticles, getFeatured, getTrending } from "@/lib/articles";
import { categories, siteConfig } from "@/site.config";

export default async function HomePage() {
  const featured = await getFeatured();
  const allArticles = await getArticles();
  const latest = allArticles.filter((a) => a.slug !== featured?.slug);
  const trending = await getTrending(5);

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

      {/* ---------- STATUS STRIP ---------- */}
      <section className="mt-10 rounded-md border border-line bg-panel px-5 py-5 sm:px-7">
        <h2 className="label-mono">Coverage</h2>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/category/${c.slug}`} className="group block">
                <span
                  className="font-mono text-sm font-medium transition-opacity group-hover:opacity-70"
                  style={{ color: c.color }}
                >
                  {c.name}
                </span>
                <span className="mt-1 block font-mono text-2xs uppercase tracking-widest text-fg-subtle">
                  {c.description.split(",")[0].split(" ").slice(0, 3).join(" ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- MAIN GRID ---------- */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_280px]">
        <section>
          <h2 className="text-lg font-semibold tracking-tight text-fg">
            Latest analysis
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          {/* Trending is empty until there's enough traffic to rank honestly
              (see getTrending) — show the beats instead of a fake leaderboard. */}
          {trending.length > 0 ? (
            <>
              <h2 className="label-mono">Trending now</h2>
              <ul className="mt-3">
                {trending.map((article, i) => (
                  <TrendingRow key={article.slug} article={article} index={i} />
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2 className="label-mono">Browse by beat</h2>
              <ul className="mt-3 space-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="link-underline font-mono text-sm text-fg"
                    >
                      {category.name}
                    </Link>
                    <p className="mt-1 text-xs leading-relaxed text-fg-subtle">
                      {category.description}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-10">
            <NewsletterBox />
          </div>
        </aside>
      </div>
    </div>
  );
}
