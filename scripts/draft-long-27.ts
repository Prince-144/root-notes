/**
 * Long-form drafts — 25 August 2026.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, cannot read a table, and
 * truncates past ~460 characters. Each section's strongest paragraph is written
 * to stand alone, carry its own figures, and stay under that limit.
 *
 * Sourcing note: the UK power plant piece deliberately does not lead on the
 * Iran attribution. It is media-reported, unconfirmed by the NCSC, and the CEO
 * of Dragos has publicly warned against it. The cover is a generic, unnamed
 * power station for the same reason the article does not name one — nobody has.
 *
 * Cover note: all three images downloaded and viewed. Two code-screen
 * candidates were rejected for the Spring piece — one had "Laravel" legible
 * on it, and the one first shipped turned out to carry an "Activate Windows"
 * watermark that only became obvious once rendered onto a slide. Viewing the
 * source image is not enough; check the composited output too. The abstract
 * replacement cannot carry legible text at all.
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
    slug: "uk-power-plant-four-day-shutdown-attribution-not-confirmed",
    title:
      "A UK power plant was down for four days — and almost nothing in the headline is confirmed",
    excerpt:
      "The Telegraph reported on 22 August that a small British generator was shut down for four days in July, and the coverage that followed called it Iran-linked. Neither the government nor the NCSC has confirmed that, the plant has not been named, and the CEO of Dragos is publicly warning that this is exactly the situation false flags are built for.",
    categorySlug: "security",
    tags: [
      "critical-infrastructure",
      "operational-technology",
      "attribution",
      "energy",
      "uk",
      "dragos",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1605727285872-37eedac52db6${P}`,
    body: `On **22 August 2026** the Telegraph reported that a British power plant had been shut down by a cyberattack for **4 days** in **July**. The BBC, the Guardian and the Financial Times followed, and most of the coverage carried the same three words: **Iran-linked hackers**.

Here is the honest version of what is known.

## What is actually reported

A relatively small power plant — a distributed energy generator rather than a major station — stopped producing for four days. There was no wider grid disruption.

That is close to the complete list.

## What is not established

Everything else, and the gaps are unusually wide for a story this size:

- **The plant.** Not named. Nor its operator.
- **Which systems were compromised**, or whether the shutdown was caused directly or was a precautionary disconnection.
- **How they got in.** No entry vector reported.
- **Why recovery took four days.**
- **Official confirmation.** Neither the UK government nor the **NCSC** has confirmed the account in detail.
- **The attribution.** Iran-linked is media reporting, not an official finding.

## The warning worth printing in full

**Robert M. Lee**, chief executive of the industrial security firm **Dragos**, put it plainly: people jumping to conclusions about Iran being behind the UK attack are very susceptible to false flag operations.

That is not a man saying Iran did not do it. It is a man whose company does this work for a living saying that an unattributed OT incident, reported through the press before any agency confirms it, is precisely the shape an attacker would choose if the goal were to have someone else blamed.

Attribution in operational technology is slower and harder than in IT, because the artefacts are fewer and the systems keep worse records. When it arrives early, through journalists rather than responders, that is a reason to hold it loosely.

## Why the story still matters without the attribution

Because the thing that happened is significant regardless of who did it.

We have spent this month writing about pre-positioning. [Five US agencies described AI-written tooling aimed at Siemens PLCs and called the activity persistent reconnaissance](/article/siemens-s7-plc-ai-written-snap7-tooling-five-agency-advisory) — mapping the ability to stop a process, not stopping one. [Thirty water systems in Minnesota were disrupted without exploiting anything](/article/minnesota-water-plc-attacks-no-exploit-needed). [A Polish CHP plant lost a turbine](/article/polish-chp-plant-private-apn-wago-turbine-shutdown).

Four days of lost generation is the category those pieces kept describing as the thing that had not happened yet in Britain. It has now, whoever did it.

## The distributed-energy problem

Two experts quoted in the coverage make the same structural point from different angles.

**Phil Tonkin** of Dragos notes these are often very repeatable attacks that could be deployed at scale. **Rafael Narezzi**, chief executive of Centrii, points at Britain's thousands of distributed assets and the collective exposure they create.

That is the part that should worry a policymaker more than the flag on the attacker. A grid built from many small independent generators has no single operator, no shared security budget, and no common floor of competence. A technique that works on one of them likely works on many, and the operator of a small solar or gas site is not resourced like a national utility.

Small plant, four days, no grid impact reads like a minor incident. It also reads like a test.

## What to do if you run one of these sites

- **Assume you are in scope.** The story here is a *small* generator. Being unimportant is not a control.
- **Know what is reachable from outside**, including remote-support paths your integrator uses and may not have told you about.
- **Have a manual runbook.** Four days is a long recovery, and recovery time is usually dominated by not knowing what is safe to turn back on.
- **Log enough to answer the attribution question yourself.** Most OT sites cannot reconstruct an intrusion afterwards, which is why stories like this stay unconfirmed.
- **Do not wait for the NCSC to name a threat actor.** The technique will be reusable long before the attribution is settled.

## What we will not do

Run the headline. If the NCSC confirms an actor, we will report it and say who confirmed it. Until then the accurate sentence is that a British generator was stopped for four days by someone, and the country's own experts are asking people to slow down.`,
  },
  {
    slug: "uber-825-million-dutch-dpa-automated-driver-suspensions",
    title:
      "Uber was fined €825 million for letting software fire drivers without a person checking",
    excerpt:
      "The Dutch Data Protection Authority found Uber suspended driver accounts — sometimes permanently — through automated decisions with no human review, and did not tell drivers it was happening. The violations run from 2018 to 2022. It is the authority's fourth fine against the company, and Uber is appealing.",
    categorySlug: "world",
    tags: [
      "gdpr",
      "uber",
      "automated-decisions",
      "regulation",
      "privacy",
      "netherlands",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1624947627905-08cdbbe545b8${P}`,
    body: `On **24 August 2026** the **Dutch Data Protection Authority** fined **Uber** **€825 million** — about **$964 million** — for breaching the **GDPR**.

The finding is not about a breach or a leak. It is about who, or what, made a decision.

## What Uber did

It used automated software to suspend driver accounts, sometimes permanently, **without human review** to catch mistakes. And it did not tell drivers that automated decision-making was being applied to them.

The violations run from **2018 to 2022**.

## The right being enforced

GDPR restricts decisions made solely by automated processing where they produce legal or similarly significant effects on a person. Losing the account you drive for is comfortably inside that.

The obligation is not that software cannot be involved. It is that a person must be able to obtain human intervention, express a view and contest the outcome — and must be told the processing is happening in the first place. On the regulator's finding, Uber failed on both halves: no human in the loop, and no notice.

That distinction matters for anyone building with models right now. The rule was never "do not automate". It is that an automated decision about a person needs a door back to a human, and the person has to know the door exists.

## Uber's answer

The company disagrees and will appeal. It says it takes driver welfare seriously and is fully committed to fair treatment, including human reviews, robust safeguards and the opportunity for drivers to appeal — and that the policies at issue were discontinued years ago.

Both things can be true. A company can have fixed a practice and still be fined for the years it ran, which is how enforcement of a four-year-old violation necessarily works.

## The fourth fine, and the trajectory

This is the **fourth** penalty the same Dutch authority has issued against Uber. In **2024** it fined the company **€290 million** over transfers of European driver data to the United States.

**€290 million** then. **€825 million** now. Roughly **2.8 times** larger, from the same regulator, against the same company, two years apart.

That is the same curve we traced through [TikTok's COPPA settlement, where a $5.7 million penalty in 2019 became $400 million in 2026](/article/tiktok-400-million-coppa-settlement-vacating-musically-decree) and through [Google's €890 million DMA fine](/article/google-dma-fine-890-million-search-play-steering). Regulators across two continents have arrived at the same conclusion in the same year: the previous numbers were too small to change behaviour.

## Why this one is different from the others

The **€825 million** is not about data crossing a border it should not, or a market being tilted. It is about an algorithm ending someone's income with nobody obliged to look at it — the first of these fines that reads as direct precedent for the AI systems now going into hiring, lending, insurance and moderation.

None of that reasoning depends on the software being sophisticated. It depends on there being a consequential decision, no human, and no notice.

India's [DPDP obligations arrive in November 2026](/article/india-dpdp-enforcement-timeline-november-2026) without an equivalent automated-decision right in the same form, which makes the European position the one to watch if you build for both markets.

## What is not established

- **How many drivers were affected.** Not specified in the reporting.
- **Whether the fine survives appeal.** Uber has said it will contest it.
- **What the automated system actually did** — the technical basis for suspensions has not been described publicly.
- **Whether the current process satisfies the regulator.** Uber says the policies were discontinued; the authority has not said the replacement is compliant.`,
  },
  {
    slug: "spring-91-cves-200-this-year-broadcom-ai-discovery",
    title:
      "Spring had 16 CVEs in all of 2025 — it has passed 200 this year, and the reason is that AI is now looking",
    excerpt:
      "Broadcom shipped 91 vulnerability fixes for the Spring framework in one release, including a critical flaw in Spring Security's embedded LDAP server. The count went 22, then 16, then over 200. The jump is attributed to Broadcom putting AI on the problem, which is the same capability the attack stories run on, pointed the other way.",
    categorySlug: "security",
    tags: [
      "spring",
      "java",
      "vulnerabilities",
      "ai-assisted-defence",
      "patching",
      "broadcom",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1750969185331-e03829f72c7d${P}`,
    body: `**Broadcom** has released fixes for **91** vulnerabilities across the **Spring** application framework — Spring Security, Spring AI, Cloud Config, Data REST, Integration, Reactor Core, Reactor Netty, AMQP and Batch — affecting more than **200,000** software components.

One is critical. **CVE-2026-59270** is in Spring Security's embedded **UnboundID LDAP** server and could let an attacker authenticate and modify entries in the in-memory directory. More than a dozen are rated high.

**Sonatype** flagged two others worth naming: **CVE-2026-59285**, remote code execution in Spring for GraphQL, and **CVE-2026-59318**, a privilege escalation in Spring AI.

## The number that is actually the story

Spring recorded **22** vulnerabilities in **2024** and **16** in **2025**. In **2026** it has passed **200**.

That is not a framework that suddenly became insecure. It is a framework that suddenly became **searched**.

The surge is attributed to Broadcom putting AI to work on finding them. Which means the most consequential AI security story of the week is not an attack at all.

## The same capability, pointed the other way

We have spent this month writing about AI lowering the barrier for attackers — [a $99.99 command-and-control framework with a natural-language front end](/article/redc2-4-npm-packages-llm-red-agent-99-dollars), [AI-written tooling for Siemens controllers](/article/siemens-s7-plc-ai-written-snap7-tooling-five-agency-advisory), [170,000 targets selected by machine](/article/uat-10147-spectre-implant-170000-urls-old-cves).

This is the same technique with the sign flipped, and the result is a **12-fold** increase in defect discovery in one of the most widely deployed frameworks in enterprise Java. [Anthropic's coordinated agent swarm surfaced 266 vulnerabilities across 15 open-source projects](/article/anthropic-multiagent-conflict-kill-loops-266-vulnerabilities) and produced the same shape of result.

The honest read is that the capability is symmetric and the advantage goes to whoever applies it first to a given codebase. Broadcom got there before anyone else did on Spring, and every one of those 200 findings is a bug that is now fixed rather than available.

## The cost nobody budgeted

The uncomfortable half.

Two hundred CVEs in one framework in one year is a patching burden that did not exist when teams planned their year. A shop running Spring set an expectation from 2024 and 2025 — roughly twenty advisories, a couple of urgent ones — and is now looking at ten times the volume, most of it medium and low severity, all of it requiring triage.

The risk is not that teams fail to patch the critical one. It is **alert fatigue at the advisory level**: when the feed goes from sixteen items a year to two hundred, the practice of reading each one stops, and the one that matters arrives in a crowd.

Spring has a real exploitation history — **Spring4Shell**, and active attacks against Spring Cloud Gateway — so the crowd is not harmless.

## What to do

- **Patch the critical one first.** CVE-2026-59270, Spring Security's embedded LDAP server.
- **Check whether you ship Spring AI.** It is newer, less audited, and CVE-2026-59318 is in it.
- **Stop reading advisories one at a time.** At this volume you need dependency scanning that tells you which of the 91 you actually run, not a mailing list.
- **Re-plan the year's patching capacity.** If the 2026 rate holds, the assumption baked into your maintenance windows is wrong by an order of magnitude.
- **Expect this to happen to your other frameworks.** Spring is not special; it is early.

## What is not established

- **Whether the rate holds.** One year is not a trend, and a first AI pass over an old codebase should find more than the second.
- **How many of the 200 are genuinely exploitable.** Volume of findings is not volume of risk.
- **Which AI tooling Broadcom used**, or how much human triage sat behind it.
- **Whether any of the 91 are being exploited.** None reported at the time of writing.`,
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
