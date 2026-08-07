import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <StaticPage promptCmd="cat privacy-policy.md" title="privacy-policy">
      <h1>Privacy Policy</h1>
      <p>
        <em>Last updated: 2026</em>
      </p>

      <p>
        This is a template written to describe what {siteConfig.name} actually does today. It
        is not legal advice — have it reviewed for your jurisdiction before treating it as
        final.
      </p>

      <h2>What we collect</h2>
      <p>
        If you subscribe to the newsletter, we store the email address you provide and a
        confirmation timestamp. Separately, Google Analytics collects aggregate,
        non-identifying traffic data for every visitor (page views, referrers, approximate
        location, device type) — see our{" "}
        <a href="/cookies">Cookie Policy</a> for detail and how to opt out. We don&apos;t run
        ad tracking or any other visitor-tracking script beyond that.
      </p>

      <h2>How we use it</h2>
      <p>
        Solely to send the newsletter you asked for, via a double opt-in flow — you
        won&apos;t be added to any list until you confirm via the email we send. We don&apos;t
        sell, rent, or share subscriber emails with anyone.
      </p>

      <h2>Who processes it</h2>
      <ul>
        <li>
          <strong>Resend</strong> — delivers the confirmation and newsletter emails on our
          behalf.
        </li>
        <li>
          <strong>Neon (Postgres)</strong> — hosts the database where subscriber records are
          stored.
        </li>
        <li>
          <strong>Vercel</strong> — hosts the site and processes standard server request logs
          (IP address, user agent) for operational purposes.
        </li>
        <li>
          <strong>Google Analytics</strong> — collects aggregate traffic data for every
          visitor, per Google&apos;s own privacy policy.
        </li>
      </ul>

      <h2>Unsubscribing</h2>
      <p>
        Every email we send includes an unsubscribe link — one click removes your address
        immediately, no login required. You can also email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>

      <h2>Changes</h2>
      <p>
        If what we collect or how we use it changes, this page will be updated and the date
        above will change with it.
      </p>
    </StaticPage>
  );
}
