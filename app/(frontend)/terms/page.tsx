import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${siteConfig.name}.`,
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <StaticPage promptCmd="cat terms-of-use.md" title="terms-of-use">
      <h1>Terms of Use</h1>
      <p>
        <em>Last updated: 2026</em>
      </p>

      <p>
        This is a generic starting template, not legal advice — have it reviewed before
        treating it as final.
      </p>

      <h2>Content</h2>
      <p>
        Articles published on {siteConfig.name} reflect the views of their authors at the
        time of publication and are provided for informational purposes. We try to be
        accurate; we don&apos;t guarantee it. If you find an error, tell us — see{" "}
        <a href="/contact">contact</a>.
      </p>

      <h2>Ownership</h2>
      <p>
        Unless otherwise noted, content on this site is © {new Date().getFullYear()}{" "}
        {siteConfig.name}. Quoting a short excerpt with a link back is fine; republishing full
        articles requires permission.
      </p>

      <h2>External links</h2>
      <p>
        We link to third-party sites as sources. We don&apos;t control and aren&apos;t
        responsible for their content.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don&apos;t attempt to disrupt the site, scrape it abusively, or use it to distribute
        malware or spam.
      </p>

      <h2>Changes</h2>
      <p>These terms may change over time. Continued use of the site means you accept the current version.</p>
    </StaticPage>
  );
}
