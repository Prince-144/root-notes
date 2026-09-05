/**
 * Drafts the GPT-6 Astra piece.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-52.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-52.ts --update
 *
 * This site is written with Claude, made by Anthropic, which competes with
 * OpenAI. The article discloses that in its first line rather than leaving
 * the reader to work it out.
 *
 * Checked the naming before writing: reporting splits between "Astra" and
 * "GPT-6 Astra", and OpenAI's own language is "called GPT-6 Astra", so the
 * full name is used here.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "@/payload-types";

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
const UPDATE = process.argv.includes("--update");

const drafts: Draft[] = [
  {
    slug: "gpt-6-astra-critical-cyber-threshold-openai-wrote-the-line",
    title:
      "GPT-6 Astra crossed the Critical cyber line. OpenAI wrote the line, ran the test, and cleared the release",
    excerpt:
      "Astra is the first model OpenAI says meets the Critical cybersecurity bar of its own Preparedness Framework: a perfect ExploitBench score, two previously unknown vulnerabilities found during evaluation, and a browser sandbox escape to command execution on the host. Every one of those judgments belongs to the company shipping it.",
    categorySlug: "ai",
    tags: ["openai", "astra", "ai-security", "preparedness-framework", "benchmarks", "disclosure"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1604060347666-8ea250214724${P}`,
    body: `**Disclosure: this site is written with Claude, which is made by Anthropic — a direct competitor to OpenAI.** Read what follows knowing that.

On **Thursday 3 September 2026**, OpenAI released **GPT-6 Astra** to a limited audience, and said it is the first of its models to meet the **Critical** cybersecurity capability threshold in its own **Preparedness Framework**.

That is a significant thing for a company to say about a product it is shipping the same week.

## What the Critical bar says

OpenAI's own definition: a model reaches Critical if it can identify and develop functional zero-day exploits **of all severity levels** in **many hardened real-world critical systems** **without human intervention** — or devise and execute end-to-end novel cyberattack strategies against hardened targets **given only a high-level goal**.

Read that twice. It is not "helps a researcher". It is autonomy against defended systems.

## What was demonstrated

- A **perfect score on ExploitBench**, the benchmark measuring whether a model can turn known vulnerabilities into working exploits.
- Evaluating high-severity flaws disclosed between **June and August 2026**, Astra found **two previously unknown vulnerabilities** and used them as part of an exploit chain.
- A **full browser-compromise chain**: sandbox escape to command execution on the host, triggered by the browser opening an HTML file.
- Multiple flaws in a **hardened operating system**, chained into local privilege escalation from an unprivileged user **to root**.
- It declines **91.5%** of cyber-related jailbreak attempts, against **59%** for its predecessor GPT-5.6 Sol.

Taken at face value that is a serious capability, and the defensive reading is real: a model that turns advisories into working exploits is also a model that finds your bugs before somebody else does.

## Every step of that is OpenAI's

Here is the structure, stated without accusation, because the structure is the story.

OpenAI **wrote** the Preparedness Framework. OpenAI **defined** the Critical threshold. OpenAI **ran** the evaluations. OpenAI **judged** that the threshold was met. OpenAI **decided** the safeguards "sufficiently minimize the risk of severe harm for release". And OpenAI **operates the list** of who gets the capability.

No external body signed any of that off, and none is quoted. [We made the same observation about all three labs last week](/article/three-labs-shipped-cyber-models-and-graded-their-own-homework) — this is the sharpest instance of it, because the judgment being self-made is not a benchmark score but a safety determination about a capability the company itself classifies as Critical.

Give credit where it is due: OpenAI published the framework in advance, published the finding, gated the release, and said the uncomfortable thing out loud. A company that wanted to avoid this conversation had easier options. But "we set the bar, we measured ourselves against it, and we cleared ourselves" is the accurate description, and it is worth saying while the announcement is being repeated.

Members of Congress and AI researchers are separately pressing for visibility into how US government bodies — the Center for AI Standards and Innovation, and the NSA — test frontier systems before release. That pressure exists precisely because the answer today is mostly "the vendor does it".

## "Without human intervention" and "expert-led" are different claims

The Critical definition turns on autonomy. The demonstrations are described as **expert-led assessments** against a hardened browser and operating system.

Those can both be true — an expert can set up an evaluation the model then completes unaided — and they are not the same sentence, and no independent reproduction has been published either way. Anyone reporting "the model autonomously found zero-days" is choosing one reading of a phrase that was not written that precisely.

## The safeguard is a customer list

Astra reaches **Daybreak** participants first, then enterprise and consumer accounts. The most capable cyber functionality runs through **Daybreak Blue**, which requires **identity verification**, **legal attestations**, **approved-use restrictions** and **account monitoring**. Named participants include **Accenture**, **IBM**, **CrowdStrike**, **Cisco**, **Sophos** and **Cloudflare**.

As control sets go that is a reasonable one. It is also, precisely, vetting — and vetting fails in a known way: not when an unvetted party sneaks in, but when a vetted one is compromised. Every organisation on that list is a target, and several of them are on it because they are targets.

The question nobody has answered is what happens to Critical-threshold access when a Daybreak Blue customer has an incident.

## Two sentences from the same launch

**Greg Brockman**: *"Astra can really do anything a human can do with a computer."* And: *"Welcome to the AGI era!"*

**Jakub Pachocki**: *"As these models become more capable, understanding exactly what they can do gets harder."* And: *"We will not accept degradation in our ability to monitor model alignment."*

The first pair will be quoted everywhere. The second pair is the one that tells you something, and it is an admission: capability is outrunning the ability to characterise it. The Information has reported concerns that the development techniques involved may reduce human understanding of how the system reasons.

## What the evidence looks like on the ground

Set the launch claims beside the one public, independent, costed experiment this site has covered.

Last week Forescout published an attempt to have a frontier model [port a working pre-auth exploit from one industrial controller to another](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout). It took **8 hours 32 minutes** and **$535.74**, needed sustained human steering, and bricked the device. The lab's own conclusion was that the researcher would have been faster and cheaper alone.

That is a different model from a different vendor, and it is a year of capability behind. It is also the only number in this discussion produced by someone with nothing to sell, and the honest position is that the gap between it and "can do anything a human can do with a computer" has not been independently measured by anybody.

## What to do

- **Do not buy on the benchmark.** 100% on ExploitBench is a fact about ExploitBench.
- **If you are inside Daybreak Blue, you are the control.** The safeguard against misuse of this capability is that your organisation is not compromised.
- **Assume the offensive capability arrives for defenders and attackers on different schedules, not different timelines.** Gated access delays diffusion; it does not prevent it.
- **Ask for third-party evaluation when you procure.** It does not exist yet for this class of claim, and demand is how it starts existing.
- **Read Pachocki's sentence, not Brockman's.** One is marketing and one is a risk statement from the same podium.

## What is not established

- **Whether the demonstrations were autonomous** in the sense the Critical definition requires.
- **Whether any of it replicates.** No independent party has published a reproduction of the ExploitBench result, the zero-day discoveries or the browser chain.
- **Which software** the two previously unknown vulnerabilities were in, or whether they were disclosed to the vendor.
- **How Daybreak Blue applicants are actually assessed**, beyond the four named requirements.
- **What OpenAI would do differently** at the next threshold. The framework describes categories; it does not describe a point at which a release does not happen.`,
  },
];

const payload = await getPayload({ config });

for (const draft of drafts) {
  const existing = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
  });

  const clash = existing.docs[0];
  const words = draft.body.split(/\s+/).length;

  if (clash?.status === "published") {
    console.log(`skipped (published): ${draft.slug}`);
    continue;
  }

  if (clash && UPDATE) {
    await payload.update({ collection: "articles", id: clash.id, data: draft });
    console.log(`updated: ${draft.slug} (${words} words)`);
    continue;
  }

  if (clash) {
    console.log(`skipped (draft exists, pass --update): ${draft.slug}`);
    continue;
  }

  const created = await payload.create({
    collection: "articles",
    data: {
      ...draft,
      author: "Prince Baruwala",
      publishedAt: new Date().toISOString(),
      status: "draft",
    },
  });
  console.log(`drafted: ${draft.slug} (id ${created.id}, ${draft.categorySlug}, ${words} words)`);
}

await new Promise((resolve) => setTimeout(resolve, 3000));
process.exit(0);
