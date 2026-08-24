/**
 * Draft — ToxicPanda 2.0, from Zimperium.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, cannot read a table, and
 * truncates past ~460 characters. Each section's strongest paragraph is written
 * to stand alone, carry its own figures, and stay under that limit.
 *
 * Cover note: image downloaded and viewed. Three earlier candidates were
 * rejected on sight — two showed identifiable third-party apps on screen, which
 * on a story about malware targeting 349 banking apps would imply something the
 * research does not say, and one of those was an iPhone on an Android story.
 *
 * Pass --update to rewrite an existing draft; published articles are skipped.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "../payload-types";

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: Article["categorySlug"];
  tags: string[];
  readingMinutes: number;
  coverImageUrl: string;
  body: string;
};

const P = "?w=1600&h=900&fit=crop&crop=entropy&q=80";

const DRAFTS: Draft[] = [
  {
    slug: "toxicpanda-2-vpn-permission-blocks-google-play-protect",
    title:
      "It takes the phone's VPN slot and uses it to cut off Google Play — then installs the payload",
    excerpt:
      "Zimperium's analysis of ToxicPanda 2.0 describes malware that claims the VPN permission, filters the device's own traffic, and blocks Google Play and Play Services so security updates and app verification cannot run. It targets 349 apps across 16 countries and supports 167 remote commands.",
    categorySlug: "security",
    tags: [
      "android",
      "banking-trojans",
      "mobile",
      "google-play",
      "accessibility-abuse",
      "zimperium",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1630993094890-f7d47e9dcf56${P}`,
    body: `**Zimperium** has published analysis of **ToxicPanda 2.0**, an Android banking trojan that has grown a great deal since it was first documented.

The numbers first: **167** remote commands, **349** targeted applications across banking, financial, cryptocurrency and e-wallet services, in **16** countries. A separate PIN-harvesting module aims at **140** financial apps.

But the technique worth understanding is not in that list.

## It uses the VPN permission to blind Google

ToxicPanda 2.0 asks for the **VPN service** permission. Granted, it stands up a local network interface and starts intercepting and filtering the device's own traffic.

What it filters is the point. Per Zimperium, it blocks communication from **Google Play** and **Google Play Services** — and it does this **before** installing its payload. That means security updates cannot arrive and app verification cannot run at the moment they would matter most.

Android permits exactly one VPN at a time, by design, and a VPN sees everything. So the permission that exists to protect your traffic is also the permission that lets something sit between your phone and the service that would have told you it was there.

## This is the week's third defence-blinding story

Not a coincidence, and worth naming as a pattern.

[UAT-10147's SPECTRE implant unlinks EDR callbacks in the Windows kernel](/article/uat-10147-spectre-implant-170000-urls-old-cves) so security products stop being notified rather than stop running. [A Defender driver can delete Defender at boot](/article/defender-btr-sys-boot-time-removal-golden-window-no-patch) before it locks itself. And now a phone's VPN slot is used to cut the line to Play Protect.

None of these defeat the defence. They all remove its ability to see or report, which produces the same silence as an environment where nothing is wrong. That is the harder problem, because the absence of an alert is indistinguishable from safety.

## Accessibility, converted into a shell

The second technique is the sharper one.

ToxicPanda 2.0 uses **Accessibility Services** permissions to turn on **Wireless Debugging** and extract the **ADB pairing code**. That hands it Android Debug Bridge access — shell-level control of the device.

Zimperium's description of why this matters is exact: it **bypasses standard Android runtime consent prompts**, granting broad permissions and disabling background restrictions without the dialogs a user would normally see and could normally refuse.

So one permission that people are routinely talked into granting — Accessibility is requested by screen readers, automation tools and a great many things pretending to be them — is converted into a level of access the operating system would never grant through its own prompts.

## What else it does

- **Invisible phishing overlays** that capture touch input on top of real apps
- **Fake lock screens** and update overlays
- **PIN harvesting** aimed at **140** financial apps
- **Manufacturer-specific persistence** techniques, tailored per device maker

The overlay work is the same family as [the fake Windows lock screen SynkLoader paints](/article/synkloader-teams-phishlocker-fake-lock-screen-alt-tab) — except a phone has no Alt+Tab, and no equivalent of the Secure Attention Sequence to prove a screen is genuine.

## Where it comes from

Distribution runs through **Amazon AWS**-hosted buckets, which is the mobile version of the pattern in almost every campaign this month: host on infrastructure nobody can block, and the download is unremarkable.

Zimperium has published indicators of compromise on GitHub.

## What to do

- **Look at which apps hold VPN permission.** Settings will show what is running a VPN. If it is something you did not knowingly install as a VPN, that is the finding — and it is checkable in under a minute.
- **Audit Accessibility Services the same way.** Almost nothing on a normal phone needs it. Anything there that you cannot justify should be removed, not merely disabled.
- **Check whether Wireless Debugging is on.** It is in Developer Options and it should be off. If Developer Options is enabled and you did not enable it, treat that as a compromise indicator.
- **Install banking apps only from the Play Store, and only from the bank's own link.** Sideloading is the entry point this whole class depends on.
- **If Play Protect appears broken or Play Services keep failing, do not dismiss it.** That symptom is the attack here, not an inconvenience.
- **A factory reset is the honest remediation** if you find any of the above. Manufacturer-specific persistence is not something to clean by hand.

## What is not established

- **Which 16 countries.** Not enumerated in the reporting we have seen.
- **How many devices are infected.** No victim count published.
- **Who operates it.** No attribution stated.
- **Whether Google has shipped a mitigation** for the VPN-blocking behaviour. Nothing announced.`,
  },
];

const UPDATE = process.argv.includes("--update");
const payload = await getPayload({ config });

for (const draft of DRAFTS) {
  const { docs: clash } = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
  });

  if (clash.length > 0) {
    const existing = clash[0] as { id: number | string; status: string };
    if (!UPDATE || existing.status === "published") {
      console.log(`skip (${existing.status}): ${draft.slug}`);
      continue;
    }
    await payload.update({ collection: "articles", id: existing.id, data: { ...draft } });
    console.log(`updated: ${draft.slug} (${draft.body.split(/\s+/).length} words)`);
    continue;
  }

  const created = await payload.create({
    collection: "articles",
    data: {
      ...draft,
      author: "Prince Baruwala",
      publishedAt: new Date().toISOString(),
      status: "draft",
      featured: false,
      views: 0,
    },
  });

  console.log(
    `drafted: ${draft.slug} (id ${created.id}, ${draft.categorySlug}, ${draft.body.split(/\s+/).length} words)`,
  );
}

process.exit(0);
