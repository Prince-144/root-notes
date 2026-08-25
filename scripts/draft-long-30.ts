/**
 * Long-form drafts — 25 August 2026, fourth batch.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, cannot read a table, and
 * truncates past ~460 characters. Each section's strongest paragraph is written
 * to stand alone, carry its own figures, and stay under that limit.
 *
 * Sourcing note: RBI's own site refuses automated requests, so the Directions
 * piece is built from several independent secondary readings that agree on the
 * specifics, and it prints the circular reference numbers so a reader can check
 * the primary text. Where the secondary sources do not agree or do not say, the
 * article says so rather than picking one.
 *
 * The Sleepwalker piece leans on the researcher's own statement of what he
 * cannot establish. He published the unknowns himself; quoting that is the
 * point of the piece, not a caveat appended to it.
 *
 * Cover note: all three downloaded and viewed. The Glassbox cover is a blurred
 * night crowd because that is the researcher's own advice — be in a large,
 * identical crowd — and because nobody in it is identifiable, which would be a
 * poor look on a piece about tracking individuals.
 *
 * Pass --update to rewrite existing drafts; published articles are skipped.
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
    slug: "sleepwalker-backdoor-magic-packet-no-outbound-traffic",
    title:
      "This backdoor never phones home — it waits for a packet, and everything hunting for beacons misses it",
    excerpt:
      "Sleepwalker is a Windows backdoor with a 23-instruction custom bytecode language, AES-256-CCM, and no outbound connections at all. It sits dormant until a specially crafted packet arrives. It loads by side-loading through a security vendor's own management agent while pretending to be Microsoft's dpapi.dll — and the researcher who found it says plainly that he cannot name a single victim.",
    categorySlug: "security",
    tags: [
      "backdoor",
      "windows",
      "magic-packet",
      "dll-side-loading",
      "threat-research",
      "detection",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1696694138288-d3c14bdd35f1${P}`,
    body: `Almost every network detection strategy in use rests on one behaviour: malware talks back. It beacons to a command server, resolves a suspicious domain, opens a connection somebody can flag.

**Sleepwalker** does none of that.

Malware researcher **Dominik Reichel** published an analysis on **24 August 2026** of a Windows backdoor that, in his words, never sends anything out on its own and does not open any obvious listening port by default — so tools that watch for connections to known-bad domains or unusual outbound traffic will not see anything unusual.

## How it wakes up

It waits for a **magic packet**.

The backdoor sits dormant, sniffing traffic, until a specifically crafted packet arrives. Only then does it execute. There is no schedule, no callback interval, and nothing to correlate — the initiative belongs entirely to the operator, and the machine looks idle until the moment it is used.

That inverts the usual detection economics. Beaconing is what makes command-and-control findable: it is repetitive, it is periodic, and it happens whether or not the attacker is doing anything. A backdoor that speaks only when spoken to produces no baseline to deviate from.

## The 23 instructions

Sleepwalker is a 64-bit Windows DLL that implements its own **bytecode command language** — **23** instructions, encrypted with **AES-256-CCM**, decoded as raw byte sequences rather than readable text.

Reichel's summary: the 23 instructions cover scheduling, several ways to move data, staged file delivery and running code directly in memory.

Broken down:

| Group | Instructions |
| --- | --- |
| Magic-packet sniffing | 2 |
| Basic operations (exit, listener startup) | 2 |
| Data transmission and concealment | 4 |
| Inbound task reception | 5 |
| Program building and execution | 5 |

The data-movement group covers TCP connections, writes to named pipes, and optional credential authentication. The inbound group covers listening on TCP and UDP ports and creating named pipes.

Named pipes matter here. Traffic over a named pipe between machines rides inside SMB, which is ordinary Windows administrative traffic in every enterprise on earth. It is not an exotic channel; it is the most boring one available.

## It loads through a security product

The delivery is the part that should make a defender uncomfortable.

Sleepwalker masquerades as Microsoft's **dpapi.dll**, the Windows Data Protection API library. It exports **seven** legitimate dpapi.dll functions and forwards those calls onward to a fictitious **dpapisvc.dll**, so the functions that are supposed to work still appear to.

It reaches memory by **DLL side-loading** through **ERAAgent.exe** — the **ESET Management Agent** — with a forged ESET Management Agent version resource attached to make the file look right.

A security vendor's own management agent is a well-chosen host. It runs with privilege, it is expected on the machine, and it is frequently excluded from the very scanning that would examine what it loads.

That is the same theme running through this month: [an implant that unlinks EDR callbacks in the kernel](/article/uat-10147-spectre-implant-170000-urls-old-cves), [a signed Defender driver that can delete Defender at boot](/article/defender-btr-sys-boot-time-removal-golden-window-no-patch), [malware that sets its own Defender exclusions](/article/weedhack-fake-minecraft-clients-seo-poisoning-defender-exclusions). Here the security software is not disabled at all. It is used as the ladder.

## What the researcher will not claim

This is the part worth holding up.

Reichel states directly that he has no collection context tying the file to a confirmed intrusion, and therefore cannot identify a victim, industry, country or affected organisation.

He assesses the design as indicating a targeted, well-resourced operation rather than an opportunistic one — and notes there is no code correlation with any known group. He does not name an actor, and he does not stretch the sample into a campaign.

A researcher publishing a capable backdoor with no attribution, no victim and no campaign attached, and saying so in the analysis itself, is doing the job correctly. Most of the pressure in this field runs the other way.

He also shipped a toolkit for decoding the bytecode and analysing the encrypted artefacts, plus a remediation script and mitigation guide.

## What to do

- **Stop treating "no outbound traffic" as evidence of cleanliness.** This is the sample that breaks that assumption.
- **Hunt on the host, not the wire.** DLLs loaded by ERAAgent.exe and other management agents, unexpected dpapi.dll copies outside System32, and version resources that do not match the signing.
- **Look at named pipe creation and unexpected listeners**, including UDP. The magic-packet sniffing does not require a bound port, but several of the 23 instructions do open one.
- **Check whether your management and EDR agents' directories are excluded from scanning.** That exclusion is what makes side-loading through them worth doing.
- **Use Reichel's toolkit** if you have a suspect sample. It is published.

## What is not established

Reichel's own list, which is unusually complete:

- **The initial compromise vector**, and how the malware was delivered.
- **Who built or operates it.** No attribution.
- **Any victim** — organisation, industry or country.
- **What was done post-compromise.**
- **Deployment scope, timeline, variants, or whether the campaign is ongoing.**`,
  },
  {
    slug: "glassbox-browser-fingerprinting-hardening-makes-you-unique",
    title:
      "Hardening your browser can make you easier to track — a new tool shows you your own number",
    excerpt:
      "Glassbox runs 30-plus fingerprinting techniques locally and tells you how identifiable you are. Its author measured Chrome at 99% and Tor Browser at 56%, and one work session as unique among 7.6 billion browsers. His advice is the opposite of what most privacy guides say: stop customising, and get into a large identical crowd.",
    categorySlug: "security",
    tags: [
      "privacy",
      "browser-fingerprinting",
      "tracking",
      "tor",
      "open-source",
      "consent",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1485288734756-0b31a0a31d95${P}`,
    body: `A cookie banner asks permission. Fingerprinting does not ask, because it does not store anything on your machine — it measures what your machine already is, and no consent dialog governs a measurement.

**Glassbox**, by **David Dale**, is a tool that runs those measurements on you and shows you the result. It runs locally: everything happens in the browser, with a single public geolocation call as the only exception.

## What it measures

More than **30** fingerprinting techniques, including canvas rendering, WebGL, installed font libraries, WebAssembly feature support, API matrices, cross-site login states, and silent audio sawtooth waves — a technique Dale found in use on AliExpress.

None of these are stored identifiers. They are properties: how your specific combination of GPU, driver, fonts, operating system and browser build renders a shape or processes a tone. Clearing cookies does nothing to any of them, and neither does private browsing.

## The numbers

Dale's identifiability estimates run from **56%** for **Tor Browser** to **99%** for **Chrome**.

One work Chrome session came out unique among **7.6 billion** browsers.

He caps his calculations at roughly **33 bits** of entropy, which is the number that makes the whole subject intuitive. Two to the power of 33 is about 8.6 billion — near enough the world's population. Thirty-three bits of distinguishing information is therefore, in principle, enough to pick one human out of everyone. Each independent measurable property contributes some of those bits, and there are more than thirty of them on offer.

## The advice is counterintuitive, and it is the important part

Most privacy guidance tells you to harden your browser: install extensions, block APIs, spoof the user agent, tweak settings.

Dale's position is that this is backwards. In his words, the single highest-impact move is to use a browser that puts you in a large, identical crowd.

The reason is arithmetic. Fingerprinting does not measure how *protected* you are, it measures how *unusual* you are. A stock Chrome install on a common laptop resembles millions of others. The same machine with six privacy extensions, a spoofed user agent, a blocked canvas API and a custom font set resembles nothing else in the world — and every one of those modifications is itself measurable.

A hardened browser can be more identifiable than the one it replaced. The user gets a stronger sense of privacy and a weaker version of the thing itself.

Dale advises against customised hardened setups for that reason, recommending Tor or a VPN instead, and separately fixing WebRTC leaks.

## Why we are writing this one carefully

Root Notes runs a consent banner. So it is worth being straight about the limits of that arrangement.

A consent banner governs cookies and similar storage. It does not govern fingerprinting, because fingerprinting does not need anything the banner controls. Any site that wanted to could measure the properties Glassbox measures without asking, and a reader who clicked *Decline* would be no less identifiable.

That is not a defence of the practice. It is the reason a tool like this matters: the compliance layer most people believe protects them addresses a different mechanism entirely.

## Built with AI, and said so

Dale notes that tools like Claude Code have made it much easier to polish ideas and offer the useful ones to a wider audience.

A privacy diagnostic built with AI assistance, published for free, running entirely on the user's own machine — set against Veracode's finding that AI-written code carries a vulnerability in roughly **44%** of generation tasks. Both are true. The tooling lowers the barrier for the person with a good idea and no time, and it lowers the floor on what ships.

## What to do

- **Run it and look at your own number.** It is local; that is the point of it being local.
- **Use a browser with a large identical population**, in its default configuration. Tor Browser is designed around exactly this idea.
- **Resist stacking privacy extensions.** Each one is a distinguishing property. Two or three well-chosen ones are not the problem; a bespoke configuration is.
- **Fix WebRTC leaks separately.** They disclose your real address regardless of fingerprint surface.
- **Do not read a cookie banner as tracking protection.** Different mechanism.

## What is not established

- **How Dale's identifiability percentages are calculated**, in detail — they are his estimates, on his methodology.
- **How widely the audio-sawtooth technique is deployed** beyond the site he found it on.
- **Whether browsers will respond.** Some already randomise canvas output; there is no announced change tied to this tool.
- **How the estimates behave on mobile**, where hardware and font diversity are much lower.`,
  },
  {
    slug: "rbi-seven-cybersecurity-directions-2026-daksh-six-hours",
    title:
      "India's banking regulator issued seven cybersecurity directions at once, and they were already in force when you read about them",
    excerpt:
      "On 31 July the RBI published parallel Cybersecurity, Technology: Risk, Resilience and Assurance Framework Directions for commercial banks, small finance banks, payments banks, urban co-operative banks, financial institutions, NBFCs and credit information companies. They took effect immediately, they repeal what came before, and incidents must reach the RBI within six hours.",
    categorySlug: "world",
    tags: [
      "rbi",
      "india",
      "regulation",
      "banking",
      "incident-reporting",
      "compliance",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1561829301-29016f0c53b4${P}`,
    body: `On **31 July 2026** the **Reserve Bank of India** issued **seven** sets of Cybersecurity, Technology: Risk, Resilience and Assurance Framework Directions — one for each class of regulated entity — and they came into force immediately.

Not a consultation. Not a transition period. In force on issue.

## Seven directions, one framework

| Entity class | Circular reference |
| --- | --- |
| Commercial Banks | RBI/DoS/2026-27/410 |
| Small Finance Banks | RBI/DoS/2026-27/419 |
| Payments Banks | RBI/DoS/2026-27/428 |
| Urban Co-operative Banks | RBI/DoS/2026-27/437 |
| All India Financial Institutions | RBI/DoS/2026-27/456 |
| NBFCs | RBI/DoS/2026-27/461 |
| Credit Information Companies | RBI/DoS/2026-27/470 |

Each repeals the earlier cyber and IT-governance instructions for its class. Regional Rural Banks have no instrument in this framework; Local Area Banks received a separate one.

Splitting the framework by entity class rather than issuing one circular is the design choice worth noticing. It lets the RBI scale obligations to size — NBFC duties track the scale-based layers from Base to Top, and urban co-operative banks are graded across four levels by the digital services they offer, with higher levels stacking requirements. An entity may voluntarily adopt stricter measures. It may not downgrade.

## Six hours, twice

A cyber incident must be reported to the RBI within **six hours** of detection, through **DAKSH**, the RBI's supervisory platform.

**CERT-In** has required six-hour reporting under the IT Act since 2022. Both obligations apply. Two regulators, one clock, two separate submissions.

Six hours from *detection* is a demanding number in practice, because detection is rarely a moment. It is an analyst raising an eyebrow at 2am, a ticket, an escalation, and somewhere in that sequence a clock started that nobody was watching. The compliance question is not whether you can write a report in six hours. It is whether your organisation can agree, quickly and in writing, when it knew.

That is a process problem, not a technology one, and it is the requirement most likely to be missed.

## What the directions require

**Governance.** The board approves IT, cybersecurity and business continuity strategies annually. The IT Strategy Committee needs at least three directors and an independent chair with a minimum of seven years managing information systems. A senior **CISO** reports directly to the executive overseeing risk management. The cybersecurity policy must be distinct from the IT policy — not a chapter inside it.

**Operations.** An information asset inventory with criticality classification. Secure configuration and patch management. Multi-factor authentication for privileged users and critical systems. Data loss prevention across endpoints, transit and storage. A Cyber Security Operations Centre with round-the-clock monitoring and SIEM-based log correlation. Cryptography standards, secure software development, source code escrow, and IPv6 readiness.

**Testing.** Vulnerability assessment at least half-yearly. Penetration testing of critical systems at least annually, by independent assessors. Disaster recovery drills half-yearly, with recovery objectives set close to zero.

Third-party rules run on a separate track: the 2026 framework's provisions apply to IT and cybersecurity arrangements outside the scope of the RBI's Managing Risks in Outsourcing Directions (**RBI/DOR/2025-26/171**, 28 November 2025). Both apply concurrently.

## Credit information companies are in scope

This is the line Indian readers should stop on.

We wrote about [the four-year gap between what banks could see in your credit record and what you could](/article/cibil-score-story-banks-saw-it-four-years-before-you-could). Credit information companies hold the financial history of most working adults in the country and have no customer relationship with any of them — you cannot take your business elsewhere.

They now have their own cyber direction with the same six-hour reporting clock, the same board obligations and the same testing cadence as a bank. Given what a CIC holds, that is overdue rather than aggressive.

## Read the circulars, not the summaries

A caution about this piece and every other one you will read on the subject.

The RBI's own text is the authority, and the reference numbers are in the table above. This article is assembled from independent readings that agree on the specifics; the RBI's website does not serve automated requests, so we have not machine-verified the primary text line by line. For anything you intend to act on — particularly the exact scope for foreign banks and the level-by-level requirements for co-operative banks — read the circular for your entity class.

That is the correct posture for regulatory reporting generally. Secondary summaries are a map, and this one included.

## What is not established

- **Penalties.** Not specified in the material available to us.
- **The comply-or-explain scope for foreign banks** on selected chapters.
- **What is expected of Regional Rural Banks**, which have no instrument in this framework.
- **Specific SOC and SIEM operational standards** — round-the-clock monitoring is required, but the bar is not elaborated.
- **How the RBI and CERT-In obligations interact** where a single incident triggers both.`,
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
