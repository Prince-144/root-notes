import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Cookie policy for ${siteConfig.name}.`,
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <StaticPage promptCmd="cat cookie-policy.md" title="cookie-policy">
      <h1>Cookie Policy</h1>
      <p>
        <em>Last updated: 2026</em>
      </p>

      <p>
        Short version: {siteConfig.name} doesn&apos;t set tracking or advertising cookies for
        visitors.
      </p>

      <h2>Theme preference</h2>
      <p>
        Your light/dark mode choice is saved in your browser&apos;s local storage, not a
        cookie, and never leaves your device.
      </p>

      <h2>Admin login</h2>
      <p>
        The site&apos;s CMS login uses a secure session cookie for authentication. This only
        applies to logged-in site administrators, not regular visitors.
      </p>

      <h2>No analytics or ad cookies — yet</h2>
      <p>
        We don&apos;t currently run analytics or advertising scripts. If that changes, this
        page will be updated first to say what&apos;s added and why.
      </p>
    </StaticPage>
  );
}
