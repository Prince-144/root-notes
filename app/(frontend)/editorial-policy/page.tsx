import Link from "next/link";
import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: `How ${siteConfig.name} sources, writes and corrects what it publishes.`,
  alternates: { canonical: "/editorial-policy" },
  robots: { index: true, follow: true },
};

/**
 * What the site promises about its own reporting.
 *
 * Written because the rules were real but unwritten: primary sources, short
 * quotations, a "what is not established" section on every piece. A reader had
 * no way to know any of that, and Google's news guidance asks publishers to
 * say who is behind a site and what happens when it gets something wrong.
 */
export default function EditorialPolicyPage() {
  return (
    <StaticPage promptCmd="cat editorial-policy.md" title="editorial-policy">
      <h1>Editorial Policy</h1>
      <p>
        <em>Last updated: 1 October 2026</em>
      </p>

      <p>
        {siteConfig.name} is an independent publication written and edited by{" "}
        <Link href="/author/prince-baruwala">{siteConfig.author}</Link>, and operated from
        India. It is not owned by, funded by or affiliated with any of the companies it
        covers.
      </p>

      <h2>Where the facts come from</h2>
      <p>
        Every article is built from primary sources: the vendor&apos;s advisory, the
        researcher&apos;s write-up, the regulator&apos;s report, the court or company filing,
        the catalogue entry. Where the only available account is somebody else&apos;s
        reporting, the article says so and names the outlet, so a reader can tell a document
        from a claim about one.
      </p>
      <p>
        Figures are taken from the source that produced them, with the source named in the
        sentence that uses them. Where two sources give different numbers, the article gives
        both and says they disagree rather than picking the larger one.
      </p>

      <h2>Quotation and paraphrase</h2>
      <p>
        Quotations are kept short and few. The rest is paraphrased with attribution, because
        a page of block quotes hides the difference between what a company said and what
        follows from it. Nothing is quoted out of the context that changes its meaning.
      </p>

      <h2>What is not established</h2>
      <p>
        Every article ends with a section listing what remains unknown: an attribution that
        has not been confirmed, a count the sources disagree about, a question the research
        leaves open, a vendor that has not responded.
      </p>
      <p>
        This is the part of the method worth stating plainly. Security reporting is written
        while the facts are still moving, and a piece that lists only what is known reads as
        more settled than it is. Saying what is missing is how a reader judges the rest.
      </p>

      <h2>Corrections</h2>
      <p>
        If something here is wrong, write to{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> or use the{" "}
        <Link href="/contact">contact page</Link>. Corrections are welcome from anyone,
        including the companies and researchers an article is about.
      </p>
      <ul>
        <li>
          A factual error is fixed as soon as it is confirmed, and the article&apos;s
          modified date changes with it.
        </li>
        <li>
          Where a correction changes what the piece means — a wrong attribution, a wrong
          number, a conclusion that no longer follows — the change is noted on the article
          itself rather than made silently.
        </li>
        <li>
          A typographical fix that does not change the meaning is made without a note.
        </li>
        <li>
          Articles are not removed to settle a dispute. Where something cannot be stood up,
          it is corrected in public.
        </li>
      </ul>

      <h2>Independence and money</h2>
      <p>
        {siteConfig.name} runs no advertising network and no retargeting scripts, as set out
        in the <Link href="/cookies">cookie policy</Link>. Any sponsored or paid placement,
        if one is ever accepted through the{" "}
        <Link href="/advertise">advertise page</Link>, will be labelled as such on the piece
        itself and will not be written as editorial coverage.
      </p>
      <p>
        No company covered here has any say over what is published, before or after the fact.
      </p>

      <h2>Privacy and data</h2>
      <p>
        What the site collects about readers, and how to turn it off, is in the{" "}
        <Link href="/privacy">privacy policy</Link> and the{" "}
        <Link href="/cookies">cookie policy</Link>.
      </p>
    </StaticPage>
  );
}
