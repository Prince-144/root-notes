import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Advertise",
  description: `Advertising and sponsorship options for ${siteConfig.name}.`,
};

export default function AdvertisePage() {
  return (
    <StaticPage promptCmd="cat advertise.md" title="advertise">
      <h1>Advertise with {siteConfig.name}</h1>

      <p>
        {siteConfig.name} reaches developers, IT professionals, and tech-curious readers who
        want the point of a story without the padding. We keep the ad load light on purpose —
        a cluttered page is a page nobody finishes.
      </p>

      <h2>Options</h2>
      <ul>
        <li>
          <strong>Sponsored posts</strong> — written in the same five-minute, explainer-first
          format as regular coverage, clearly labeled as sponsored.
        </li>
        <li>
          <strong>Newsletter sponsorship</strong> — a single placement in the daily digest.
        </li>
        <li>
          <strong>Display placements</strong> — header, in-article and sidebar slots, sized to
          avoid layout shift.
        </li>
      </ul>

      <h2>Get in touch</h2>
      <p>
        Email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> with
        what you have in mind — we&apos;ll send current rates and available slots.
      </p>
    </StaticPage>
  );
}
