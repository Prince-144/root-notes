/**
 * One-off: two researched drafts — World and Gadgets, the two thinnest
 * categories on the site. Figures come from sources read this session.
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

const DRAFTS: Draft[] = [
  {
    slug: "doj-xai-colorado-ai-act-preemption-fight",
    title: "The DOJ is suing to kill Colorado's AI law — which took effect anyway, and is enforceable today",
    excerpt:
      "xAI sued in April, the Justice Department intervened two weeks later, and SB24-205 came into force on 30 June regardless. No court has enjoined it and no federal statute preempts it, which makes the compliance obligation entirely real.",
    categorySlug: "world",
    tags: [
      "regulation",
      "ai-governance",
      "policy",
      "compliance",
      "united-states",
      "algorithmic-discrimination",
    ],
    readingMinutes: 6,
    coverImageUrl:
      "https://images.unsplash.com/photo-1636652966850-5ac4d02370e9?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `There is a lot of noise about the US federal government overriding state AI laws. Here is the part that matters operationally: **it hasn't happened**. No federal statute preempts any state AI law, no court has paused one, and Colorado's took effect on schedule.

If your systems are in scope, you are in scope today.

## What Colorado actually requires

**SB24-205** governs "high-risk" AI — systems that are a substantial factor in decisions about **education, employment or healthcare**.

Developers must use *reasonable care* to protect consumers from known or reasonably foreseeable risks of algorithmic discrimination. Deployers carry the heavier operational load:

- risk management policies
- **annual impact assessments**
- yearly reviews of deployments
- disclosure obligations to regulators, to deployers downstream, and to the public

It took effect **30 June 2026**.

## The case against it

**9 April 2026** — xAI filed in the US District Court for the District of Colorado, arguing the law is unconstitutional on four grounds: the **First Amendment** (compelled speech and viewpoint discrimination), the **Dormant Commerce Clause** (extraterritorial reach), **Due Process** (vagueness), and **Equal Protection** (racial classification via the law's diversity carveout).

**24 April 2026** — the Department of Justice moved to intervene. The court granted it.

The DOJ's own complaint runs narrower: that SB24-205 violates the **Equal Protection Clause** by compelling discrimination on the basis of race, sex and religion, and by authorising intentional differential treatment through its diversity exemption.

This follows from the **AI Litigation Task Force** the DOJ stood up on **9 January 2026**, whose stated purpose is challenging state AI laws as unconstitutional regulation of interstate commerce, preempted by federal regulation, or otherwise unlawful in the Attorney General's judgment.

## What has not happened

**No injunction has been granted.** The case is pending with no final ruling.

That distinction is the whole article. A lawsuit filed, and joined by the federal government, changes the odds on a law's future. It changes nothing about its force today. Colorado's requirements applied from 30 June and apply now.

Compliance teams reading "DOJ sues to block Colorado AI law" as "Colorado AI law blocked" are making an expensive category error.

## Why this is the template, not the exception

Two things are worth separating.

The **substance** of the challenge is unusual — the DOJ arguing that an anti-discrimination law is itself discriminatory, on the basis of its diversity carveout, is a genuinely novel line of attack rather than the interstate-commerce argument the Task Force was set up around.

The **structure** is not unusual at all, and is likely to repeat: a company sues a state, the federal government intervenes on its side, and the litigation runs for years while the state law remains in force throughout. Texas has its own AI framework. Other states have theirs.

For anyone operating across states, the working assumption should be that patchwork compliance is the medium-term reality, not a temporary condition awaiting federal cleanup.

## What to do about it

- **Treat SB24-205 as live.** Impact assessments and risk management policies are due obligations, not contingencies.
- **Scope by use case, not by product.** "High-risk" is defined by whether the system substantially factors into education, employment or healthcare decisions — the same model can be in scope in one deployment and out in another.
- **Watch the docket, not the headlines.** The event that would change your obligations is an injunction. Nothing else in this story does.
- **Assume more states, not fewer.** Building to the strictest applicable standard costs less than maintaining one compliance posture per jurisdiction.`,
  },
  {
    slug: "coldcard-rng-flaw-bitcoin-theft-hardware-wallet",
    title: "A hardware wallet's random number generator wasn't random — and $88.6m left in 41 minutes",
    excerpt:
      "COLDCARD firmware fell back to a deterministic pseudo-random generator seeded from the chip ID and system timing. Researchers say seeds made that way could be reconstructed offline, and the sweep began roughly 30 hours before the flaw was public.",
    categorySlug: "gadgets",
    tags: [
      "hardware-security",
      "firmware",
      "cryptography",
      "vulnerability",
      "hardware",
      "incident-response",
    ],
    readingMinutes: 6,
    coverImageUrl:
      "https://images.unsplash.com/photo-1746005514011-ea00280f3b6e?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `A hardware wallet exists to do one thing well: generate a secret nobody else can guess, and keep it off general-purpose computers. COLDCARD's firmware got the first half wrong.

The device has an **STM32 hardware random number generator**. The firmware, in the affected builds, did not use it. It fell back to **MicroPython's Yasmarang** — a deterministic pseudo-random generator — seeded from the **microcontroller identifier and system timing**.

Neither of those is a secret. Both are potentially observable or reconstructable, which means the search space for a seed collapses from *astronomically large* to *something you can grind through offline and check against the blockchain*.

## The timeline is the ugly part

**30 July 2026** — Block's Bitcoin Engineering and Security teams, investigating reports of thefts, identified the flaw and disclosed it to Coinkite. Coinkite published its advisory the same day.

Roughly **30 hours before** that disclosure, someone started emptying wallets.

Galaxy Research mapped the sweep:

| Wave | Date | Taken | Addresses |
| --- | --- | --- | --- |
| 1 | 30 July | 1,083 BTC (~$70.2m) | 1,196 |
| 2–3 | 1 Aug | +284 BTC | — |
| **Total** | | **~1,367 BTC (~$88.6m)** | **4,585** |

The first wave ran for **41 minutes**.

## How they know it was automated

Every transaction used an identical fee rate of **30 satoshis/vB** — between 30 and 75 times the going rate — and none produced change outputs. Galaxy Research's read is that this is an automated tool spending keys it already held, paying whatever it took to confirm fast and not caring about cost.

Chainalysis adds that the attacker went for **high-value wallets first**: about **$30 million in the first ten minutes**, and **$1.8 million from a single victim**. That ordering implies the target list was built before the sweep began, not discovered during it.

## Which devices

Seeds generated on:

- **Mk2, Mk3** — firmware **4.0.1 through 4.1.9**
- **Mk4, Mk5** — before **5.6.0** (or Edge **6.6.0X**)
- **Q** — before **1.5.0Q** (or Edge **6.6.0QX**)

**TAPSIGNER, OPENDIME and SATSCARD were not affected.**

## The bit people will get wrong

Coinkite has shipped fixed firmware — 4.2.0+, 5.6.0+, 1.5.0Q+.

**Updating the firmware does not fix a seed that already exists.** The weak secret was generated once, at setup, by the old code. Patching the device changes how the *next* seed is made and nothing about the current one.

Anyone whose seed came from an affected build needs to upgrade **and then generate a new seed**, moving funds across.

Seeds strengthened at setup with **50+ fair dice rolls** or a strong **BIP-39 passphrase** are materially less exposed, because the entropy did not come solely from the broken source — but migration is still the recommendation.

Coinkite says it destroyed affected devices still awaiting shipment and emailed customers who had already received them.

## What this generalises to

The causal link between the flaw and the theft is researchers' assessment rather than a proven chain, and it is worth stating that plainly. The circumstantial case — the timing, the automation, the target selection — is strong.

The transferable lesson is narrower and older than cryptocurrency: **a fallback path is a code path**. Someone wrote a graceful degradation from hardware RNG to software PRNG, which is reasonable engineering in most contexts and catastrophic in this one, and the fallback ran in production for years without anyone noticing that the safety net was the failure.

If a system's security rests on entropy, the thing to test is not that it produces random-looking output. It is which generator actually ran.`,
  },
];

const payload = await getPayload({ config });

for (const draft of DRAFTS) {
  const { docs: clash } = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
  });

  if (clash.length > 0) {
    console.log(`skip (exists): ${draft.slug}`);
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
