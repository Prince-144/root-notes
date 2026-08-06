import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { siteConfig, categories } from "@/site.config";

export const metadata: Metadata = {
  title: "Write for us",
  description: `Contributor guidelines for ${siteConfig.name}.`,
};

export default function ContributePage() {
  return (
    <StaticPage promptCmd="cat contribute.md" title="write-for-us">
      <h1>Write for {siteConfig.name}</h1>

      <p>
        We publish explainer-first pieces on{" "}
        {categories.map((c) => c.name.toLowerCase()).join(", ")} — always short, always
        original, always answering &quot;why does this matter&quot; before &quot;what
        happened&quot;.
      </p>

      <h2>What we&apos;re looking for</h2>
      <ul>
        <li>Original reporting or analysis — not a rewrite of someone else&apos;s post</li>
        <li>~600 words, capped at roughly a five-minute read</li>
        <li>A TL;DR-worthy opening: the point, stated plainly, in the first paragraph</li>
        <li>Sources linked, claims checked</li>
      </ul>

      <h2>What we&apos;re not looking for</h2>
      <ul>
        <li>Thinly-veiled product pitches</li>
        <li>AI-generated drafts you haven&apos;t actually edited</li>
        <li>Anything you can&apos;t back up with a source</li>
      </ul>

      <h2>How to pitch</h2>
      <p>
        Send a one-paragraph pitch — not a full draft — to{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. Tell us
        the angle and why it&apos;s timely. We&apos;ll get back to you before you write
        anything.
      </p>
    </StaticPage>
  );
}
