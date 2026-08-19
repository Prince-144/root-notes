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
        <em>Last updated: 19 August 2026</em>
      </p>

      <p>
        {siteConfig.name} is operated from India. This page describes what we collect, why,
        who processes it, and what you can ask us to do about it.
      </p>

      <h2>What we collect</h2>
      <p>
        If you subscribe to the newsletter, we store the email address you provide and a
        confirmation timestamp.
      </p>
      <p>
        Separately, three things count traffic, and they do not see the same people. Google
        Analytics collects aggregate, non-identifying data (page views, referrers,
        approximate location, device type) but only from visitors who accepted the banner.
        Vercel Web Analytics and our own article view counter run for everyone, set no
        cookie and store no identifier that outlives the visit. Our{" "}
        <a href="/cookies">Cookie Policy</a> sets out what each records and how to stop
        them. We don&apos;t run ad tracking or any other visitor-tracking script.
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
          <strong>Vercel</strong> — hosts the site, processes standard server request logs
          (IP address, user agent) for operational purposes, and runs Vercel Web Analytics,
          which records page views without cookies or a stored identifier.
        </li>
        <li>
          <strong>Google Analytics</strong> — collects aggregate traffic data, per
          Google&apos;s own privacy policy, and only from visitors who accepted the banner.
        </li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        Subscriber records are kept for as long as you stay subscribed. When you
        unsubscribe, the record is retained only as long as needed to honour that
        request — so that we do not re-add an address that asked to be removed — and is
        deleted on request. Unconfirmed sign-ups are removed if they are never confirmed.
        Server request logs held by our hosting provider follow that provider&apos;s own
        retention schedule.
      </p>

      <h2>Your rights</h2>
      <p>
        Under India&apos;s Digital Personal Data Protection Act, and equivalent rights
        elsewhere, you can ask us to:
      </p>
      <ul>
        <li>tell you what personal data of yours we hold, and what we do with it</li>
        <li>correct or complete anything inaccurate</li>
        <li>erase it — for a newsletter subscription this is immediate and unconditional</li>
        <li>withdraw consent, which for us means unsubscribing</li>
      </ul>
      <p>
        Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> and we
        will act on it. There is no form and no account required.
      </p>

      <h2>Grievances</h2>
      <p>
        If you are not satisfied with how we have handled your data or a request about it,
        contact {siteConfig.author} at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>, who is
        responsible for answering it. If the answer does not resolve the matter, Indian
        users may escalate to the Data Protection Board of India.
      </p>

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
