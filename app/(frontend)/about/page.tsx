import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — ${siteConfig.tagline}`,
};

export default function AboutPage() {
  return (
    <StaticPage promptCmd="cat about.md" title="about">
      <h1>About {siteConfig.name}</h1>

      <p>{siteConfig.description}</p>

      <h2>Why five minutes</h2>
      <p>
        Most news coverage buries the point under a paragraph of throat-clearing. Every post
        here is capped at roughly five minutes of reading, opens with what actually changed,
        and explains why it matters before it explains what happened. If a story needs more
        room than that to say something real, it gets the room — but the default is short.
      </p>

      <h2>What we cover</h2>
      <p>
        Security, AI, startups, gadgets and the trending stories that cut across all of them.
        We&apos;d rather publish fewer, sharper pieces than chase every headline.
      </p>

      <h2>Corrections</h2>
      <p>
        If something here is wrong, we want to know. Reach out via the{" "}
        <a href="/contact">contact page</a> and we&apos;ll fix it.
      </p>
    </StaticPage>
  );
}
