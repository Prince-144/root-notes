import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { ResetConsentButton } from "@/components/cookie-consent";
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
        <em>Last updated: 18 August 2026</em>
      </p>

      <p>
        Short version: {siteConfig.name} asks before loading Google Analytics, and loads
        nothing if you say no. We don&apos;t run advertising cookies or sell data to anyone.
      </p>

      <h2>Your choice</h2>
      <p>
        On your first visit a banner asks whether we may load Google Analytics. Until you
        answer, it is not loaded and no analytics cookies are set. Declining is a real
        no — the script never runs — and the site behaves identically either way.
      </p>
      <p>
        Your answer is stored in your browser&apos;s local storage, not in a cookie, so it
        never leaves your device. To change it:
      </p>
      <p>
        <ResetConsentButton />
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

      <h2>Google Analytics</h2>
      <p>
        We use Google Analytics (GA4) to understand which articles get read and how visitors
        find the site — page views, referrers, approximate location (country/city level), and
        device type. Google sets its own cookies (<code>_ga</code>, <code>_ga_*</code>) to do
        this; see{" "}
        <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noreferrer">
          Google&apos;s cookie policy
        </a>{" "}
        for what they store and how long. We don&apos;t see or store your individual browsing
        activity ourselves — Google Analytics only gives us aggregated numbers.
      </p>
      <p>
        This only applies if you accepted the banner. If you declined, or have not answered,
        none of it runs. Should you want belt and braces on top of declining, a browser
        extension like{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">
          Google Analytics Opt-out
        </a>{" "}
        or blocking <code>*.google-analytics.com</code> and{" "}
        <code>*.googletagmanager.com</code> in your browser&apos;s tracking-protection
        settings will do it.
      </p>

      <h2>No advertising cookies</h2>
      <p>
        We don&apos;t run ad networks or retargeting scripts. If that changes, this page will
        be updated first to say what&apos;s added and why.
      </p>
    </StaticPage>
  );
}
