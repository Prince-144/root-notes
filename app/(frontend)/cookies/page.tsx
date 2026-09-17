import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { AnalyticsOptOut } from "@/components/google-analytics";
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
        <em>Last updated: 17 September 2026</em>
      </p>

      <p>
        Short version: {siteConfig.name} uses Google Analytics, which sets cookies, to see
        which articles get read, and you can turn it off for your browser on this page.
        Vercel Web Analytics counts page views as well, without cookies. We don&apos;t run
        advertising cookies or sell data to anyone.
      </p>

      <h2>Google Analytics</h2>
      <p>
        We use Google Analytics (GA4) to understand which articles get read and how visitors
        find the site — page views, referrers, approximate location (country/city level), and
        device type. It loads on every page for every visitor who has not turned it off, and
        Google sets its own cookies (<code>_ga</code>, <code>_ga_*</code>) to recognise your
        browser from one visit to the next; see{" "}
        <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noreferrer">
          Google&apos;s cookie policy
        </a>{" "}
        for what they store and how long. We don&apos;t see or store your individual browsing
        activity ourselves — Google Analytics only gives us aggregated numbers.
      </p>

      <h2>Turning it off</h2>
      <p>
        This switch turns Google Analytics off in this browser. It deletes the cookies Google
        Analytics has already set here and stops the script loading on any later page. The
        choice is kept in your browser&apos;s local storage, not in a cookie, so it never
        leaves your device; clearing this site&apos;s data undoes it.
      </p>
      <p>
        <AnalyticsOptOut />
      </p>
      <p>
        If you pressed Decline on the banner this site used to show, that choice still stands
        in the browser you made it in, and Google Analytics does not load there. To block it
        on every site rather than just this one, a browser extension like{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">
          Google Analytics Opt-out
        </a>{" "}
        or blocking <code>*.google-analytics.com</code> and{" "}
        <code>*.googletagmanager.com</code> in your browser&apos;s tracking-protection
        settings will do it.
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

      <h2>Counting without cookies</h2>
      <p>
        <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">
          Vercel Web Analytics
        </a>
        , run by the company that hosts this site, counts page views too. It sets no cookie,
        stores no identifier that survives your visit and does not follow you to any other
        site; it records the page, the referring site and a country-level location. It is
        there because ad blockers and browsers&apos; tracking protection stop Google Analytics
        for some readers, which leaves Google&apos;s numbers short.
      </p>
      <p>
        It is served from this site&apos;s own domain rather than a third-party one, so a
        blocklist that works by host will not catch it, and the switch above does not turn it
        off. Turning JavaScript off for this site stops it, and every article remains readable
        without it.
      </p>

      <h2>No advertising cookies</h2>
      <p>
        We don&apos;t run ad networks or retargeting scripts. If that changes, this page will
        be updated first to say what&apos;s added and why.
      </p>
    </StaticPage>
  );
}
