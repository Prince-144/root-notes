import Link from "next/link";
import type { Metadata } from "next";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { NewsletterBox } from "@/components/newsletter-box";
import { formatDate, getArticles } from "@/lib/articles";
import { jsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Newsletter",
  description: `One email each morning with every story ${siteConfig.name} published in the previous day. See exactly what arrives before you subscribe.`,
  alternates: { canonical: "/newsletter" },
  robots: { index: true, follow: true },
};

/**
 * The page the subscribe box never had.
 *
 * Until now the only ask on the site was a one-line box — "One email each
 * morning. No filler." — and a reader had no way to find out what that meant
 * before handing over an address. /newsletter was also a 404, while
 * /newsletter/confirmed and /newsletter/unsubscribed underneath it were not,
 * so the one URL somebody would guess was the one that did not exist.
 *
 * The preview below is not a mock-up. It is built from the most recent day of
 * stories, in the order and with the wording the digest itself uses, and
 * styled the way the email is rather than the way this site is — because the
 * question it answers is what lands in an inbox.
 */
export default async function NewsletterPage() {
  const articles = await getArticles();

  // The most recent day that actually carried stories, which is what a digest
  // is: everything from one publishing day, not a fixed count.
  const latestDay = articles.length > 0 ? formatDate(articles[0].publishedAt) : null;
  const preview = latestDay
    ? articles.filter((a) => formatDate(a.publishedAt) === latestDay)
    : [];

  const subject = `${siteConfig.name} — ${preview.length} new ${
    preview.length === 1 ? "story" : "stories"
  } today`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Newsletter",
        item: `${siteConfig.url}/newsletter`,
      },
    ],
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbLd) }}
      />

      <TerminalWindow title="subscribe --daily">
        <Prompt>cat newsletter.md</Prompt>
        <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-3xl">
          One email each morning
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted">
          Every story published in the previous twenty-four hours, with the same
          opening summary that appears on the site. No roundups of other
          people&apos;s writing, no sponsored items, nothing that was not
          published here that day.
        </p>
      </TerminalWindow>

      <section className="mt-12">
        <h2 className="label-mono">What you are agreeing to</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-fg-muted">
          <li>
            <strong className="text-fg">One email a day, at 07:30 IST</strong> — and only
            when something was published in the preceding day. A quiet day means no
            email rather than a filler one.
          </li>
          <li>
            <strong className="text-fg">Titles and summaries, not full articles.</strong>{" "}
            The email is a list; the writing stays on the site.
          </li>
          <li>
            <strong className="text-fg">Confirmation first.</strong> Subscribing sends one
            email with a link. Nothing else arrives until that link is clicked, so an
            address typed by somebody else never ends up on the list.
          </li>
          <li>
            <strong className="text-fg">One click to leave.</strong> Every email carries an
            unsubscribe link that works without a login or a reply.
          </li>
          <li>
            <strong className="text-fg">The address is used for this and nothing else.</strong>{" "}
            It is not sold, shared or used to advertise. See the{" "}
            <Link href="/privacy" className="text-accent hover:opacity-70">
              privacy policy
            </Link>
            .
          </li>
        </ul>
      </section>

      {preview.length > 0 && latestDay && (
        <section className="mt-12">
          <h2 className="label-mono">What it looks like</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
            The stories from {latestDay}, in the order the digest sends them. This is
            the email, not an illustration of one.
          </p>

          {/* Deliberately not in the site's palette. The email is light and
              sans-serif, and a preview rendered in the terminal theme would be
              answering a different question than the one the reader has. */}
          <div className="mt-5 overflow-hidden rounded-md border border-line">
            <div className="border-b border-line bg-panel px-4 py-2.5 font-mono text-2xs text-fg-subtle sm:px-5">
              <span className="text-fg-muted">Subject:</span> {subject}
            </div>

            <div className="bg-white px-5 py-6 sm:px-8 sm:py-8">
              <div className="mx-auto max-w-[600px] font-sans">
                <h3 className="text-xl font-bold text-[#111]">{siteConfig.name}</h3>
                <p className="mt-0.5 text-[13px] text-[#888]">{siteConfig.tagline}</p>

                <ul className="mt-6 space-y-[18px]">
                  {preview.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/article/${article.slug}`}
                        className="font-semibold text-[#111] hover:underline"
                      >
                        {article.title}
                      </Link>
                      <p className="mt-1 text-sm leading-relaxed text-[#666]">
                        {article.excerpt}
                      </p>
                    </li>
                  ))}
                </ul>

                <p className="mt-8 border-t border-[#eee] pt-4 text-xs text-[#aaa]">
                  Unsubscribe
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mt-12">
        <NewsletterBox />
      </div>

      <p className="mt-6 text-sm leading-relaxed text-fg-muted">
        Would rather not hand over an address? The same stories go out on{" "}
        <Link href="/rss.xml" className="text-accent hover:opacity-70">
          RSS
        </Link>
        , and all {articles.length} of them are in the{" "}
        <Link href="/archive" className="text-accent hover:opacity-70">
          archive
        </Link>
        .
      </p>
    </div>
  );
}
