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
        <em>Last updated: 19 August 2026</em>
      </p>

      <p>
        Short version: {siteConfig.name} asks before loading Google Analytics, and loads
        nothing if you say no. Two counters run either way, neither of which uses cookies
        or identifies you. We don&apos;t run advertising cookies or sell data to anyone.
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

      <h2>Counting without cookies</h2>
      <p>
        Two things count page views whether or not you accept the banner, because neither
        sets a cookie, stores an identifier that survives your visit, or follows you to any
        other site. There is nothing about you in either of them to consent to.
      </p>
      <p>
        The first is our own view counter. When you open an article, your browser tells our
        server that this article was opened — nothing else. It is what the &ldquo;views&rdquo;
        number on the site comes from.
      </p>
      <p>
        The second is{" "}
        <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">
          Vercel Web Analytics
        </a>
        , run by the company that hosts this site. It records the page, the referring site
        and a country-level location, and it exists because Google Analytics only ever sees
        readers who pressed Accept, which makes those numbers an unreliable picture of who
        actually reads this.
      </p>
      <p>
        Both are served from this site&apos;s own domain rather than a third-party one, so
        a blocklist that works by host will not catch them. Turning JavaScript off for this
        site stops both, and every article remains readable without it.
      </p>

      <h2>No advertising cookies</h2>
      <p>
        We don&apos;t run ad networks or retargeting scripts. If that changes, this page will
        be updated first to say what&apos;s added and why.
      </p>
    </StaticPage>
  );
}
