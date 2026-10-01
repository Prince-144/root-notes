import Link from "next/link";
import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { formatDate, getArticles } from "@/lib/articles";
import { jsonLd } from "@/lib/json-ld";
import { siteConfig, socialLinks } from "@/site.config";

const SLUG = "prince-baruwala";

export const metadata: Metadata = {
  title: siteConfig.author,
  description: `${siteConfig.author} writes and edits ${siteConfig.name} — ${siteConfig.tagline}`,
  alternates: { canonical: `/author/${SLUG}` },
  robots: { index: true, follow: true },
};

/**
 * The byline has somewhere to point.
 *
 * Every article carries an author name and Person markup, but the name was not
 * a link, so there was nothing on the site that said who writes it, how, or
 * how to reach them. For a news site that is a gap a reader notices and an
 * absence Google's news guidance asks about.
 *
 * ProfilePage markup rather than an ordinary page: it is the type Google reads
 * for author pages, and it ties the Person in each article's NewsArticle
 * markup to a page about that person.
 */
export default async function AuthorPage() {
  const articles = await getArticles();
  const recent = articles.slice(0, 10);
  const instagram = socialLinks.find((s) => s.name === "Instagram")?.href;

  const profileLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: articles[articles.length - 1]?.publishedAt,
    dateModified: articles[0]?.publishedAt,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.author,
      url: `${siteConfig.url}/author/${SLUG}`,
      email: siteConfig.contactEmail,
      jobTitle: "Editor",
      worksFor: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      ...(instagram ? { sameAs: [instagram] } : {}),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(profileLd) }}
      />

      <StaticPage promptCmd={`whois ${SLUG}`} title={SLUG}>
        <h1>{siteConfig.author}</h1>

        <p>
          I write and edit {siteConfig.name}, from India. The site covers security — breaches,
          exploited vulnerabilities, the tooling attackers use — alongside AI, infrastructure
          and the companies building both.
        </p>

        <h2>How I work</h2>
        <p>
          Every piece starts at the primary source: the vendor advisory, the research
          write-up, the regulator&apos;s document, the filing. Where reporting is the only
          source, it is named as such. Quotations are kept short and few, and the rest is
          paraphrased with attribution, so a reader can tell what a company said from what I
          concluded.
        </p>
        <p>
          Each article ends with what is <em>not</em> established — the attribution nobody has
          confirmed, the number two sources disagree about, the question the research leaves
          open. That section exists because a story that only lists what is known reads as
          more certain than it is. The full method is in the{" "}
          <Link href="/editorial-policy">editorial policy</Link>.
        </p>

        <h2>Corrections and contact</h2>
        <p>
          If something here is wrong, tell me and I will fix it:{" "}
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. How
          corrections are handled is set out in the{" "}
          <Link href="/editorial-policy">editorial policy</Link>.
        </p>

        <h2>Recent articles</h2>
        <ul>
          {recent.map((article) => (
            <li key={article.slug}>
              <Link href={`/article/${article.slug}`}>{article.title}</Link>{" "}
              <span className="text-fg-subtle">— {formatDate(article.publishedAt)}</span>
            </li>
          ))}
        </ul>
        <p>
          The rest are in the <Link href="/archive">archive</Link>.
        </p>
      </StaticPage>
    </>
  );
}
