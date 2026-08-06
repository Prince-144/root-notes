import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <StaticPage promptCmd="cat contact.md" title="contact">
      <h1>Contact</h1>

      <p>
        For corrections, tips, or anything else:{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>

      <p>
        For advertising or sponsorship enquiries, see the{" "}
        <a href="/advertise">advertise page</a>. For guest posts, see{" "}
        <a href="/contribute">write for us</a>.
      </p>

      <p>We read everything. Replies aren&apos;t always fast, but they happen.</p>
    </StaticPage>
  );
}
