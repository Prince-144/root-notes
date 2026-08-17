/**
 * "Can you stop the AI race?" — the protest, and the Pentagon episode that
 * actually tests the argument.
 *
 * Pass --update to rewrite if the draft exists; published articles are skipped.
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
    slug: "anthropic-pentagon-refusal-supply-chain-risk-ai-race",
    title:
      "Anthropic said no to the Pentagon's terms, got labelled a supply-chain risk, and was replaced by eight companies in ninety days",
    excerpt:
      "The protest slogan is that company ethics cannot stop the AI race, only law can. The Pentagon episode is the cleanest test of that claim anyone has run — and it did not end well for the company that held the line.",
    categorySlug: "world",
    tags: [
      "ai-policy",
      "anthropic",
      "openai",
      "defence",
      "regulation",
      "protest",
    ],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1638553116334-357ceba417c9${P}`,
    body: `On **11 July 2026** a crowd walked from OpenAI's Mission Bay headquarters to Anthropic's downtown office to Google's building on the Embarcadero, stopping on the way to jeer outside Andreessen Horowitz. It took about two hours. San Francisco police escorted it on motorcycles and blocked streets.

The argument being made was simple and is worth taking seriously: **individual company ethics cannot stop a race, because competition forces every participant forward. Only law can.**

That is an empirical claim, and it happens to have been tested in public over the preceding eighteen months.

## Start with the protest, honestly

Turnout is disputed, and the gap is not small.

| Source | Figure |
| --- | --- |
| SF Standard | "more than 100" |
| Daily Californian | ~350, "largest AI protest in American history" |

Both were reporting the same march. We are giving you both because neither is verifiable from here, and because the second framing is doing something the first is not. Even at 350, this is a small protest — the significance is not the number.

Organiser **Michael Trazzi** ran a bus from Berkeley; people came from Sacramento and Los Angeles. The coalition included **Stop The AI Race, QuitGPT, AI Action, PauseAI, Evitable** and **Stop AI**. Chants included *"Slam the breaks and slow the race."*

Trazzi's stated concern:

> building an AI that is so smart that we can't control it

Protester Phillip Jeffries, 68: *"If we're gonna build something that's smarter than we are, then how are we gonna prevent it from taking over?"* Erik Leklem, 52: *"I'm really worried about my children's future with this technology."*

The demand at an earlier March 2026 march was a **conditional pause** — labs commit to stopping, on condition that all others do too. That condition is the interesting part. It is an admission built into the demand: nobody expects a unilateral stop to survive.

**OpenAI, Anthropic and Google did not respond to requests for comment.**

## The test case

Now the part that makes the protest's thesis checkable.

**July 2025** — Anthropic signs an agreement with the Department of Defense worth up to **$200 million**.

**Late 2025** — the relationship breaks down over a usage clause. The DoD wants Claude usable **"for all lawful purposes"**, which would include **autonomous weapons** and **domestic mass surveillance**. Anthropic refuses, wanting guardrails against exactly those two uses.

**February 2026** — the administration moves against Anthropic. Within hours of the announcement, **OpenAI announces its own DoD deal** for classified networks.

**March 2026** — a judge grants Anthropic an **injunction** while its litigation with the DoD proceeds.

**April 2026** — **Google** expands the Pentagon's access to its AI, permitting *"all lawful uses."*

**1 May 2026** — the DoD finalises AI agreements with **eight companies**: OpenAI, Google, Microsoft, Amazon Web Services, Nvidia, SpaceX, Oracle and Reflection AI.

One company declined the terms. Within about ninety days there were eight replacements.

## The designation

The consequence of refusing is the detail that should travel further than it has.

The DoD designated Anthropic a **"supply-chain risk"** — a designation normally reserved for foreign adversaries.

Read that twice. A US company, refusing to let its product be used for domestic mass surveillance of US citizens, was placed in a category built for hostile foreign suppliers. Anthropic is now in litigation with the department, and won an injunction in March.

Whatever you think of Anthropic, that is a serious escalation, and it is not a market outcome. It is a state one.

## What OpenAI and Google actually agreed

Here is where the viral version needs correcting.

The framing is "Anthropic refused, OpenAI accepted." That is directionally right and factually incomplete.

Both **OpenAI's** and **Google's** contracts contain language saying the company **does not intend** its AI to be used for domestic mass surveillance or in autonomous weapons — similar in substance to what Anthropic wanted.

The difference is the form. Per the Wall Street Journal, *"it is unclear whether such provisions are legally binding or enforceable."*

So the distinction is not ethics versus no ethics. It is a **binding restriction** versus a **statement of intent**. Anthropic wanted a clause that constrains the customer. The others accepted language that describes the vendor's hopes.

That is a smaller gap rhetorically and a very large one legally, and it is the actual thing that happened.

## Does this prove the protest's point?

Partly, and not the way either side would like.

**It supports the thesis.** A company that held a line on a stated ethical commitment lost the contract, was labelled a supply-chain risk, and was replaced eight times over in a quarter. Nothing about the market punished the companies that accepted looser terms. If you wanted a demonstration that unilateral corporate restraint does not hold under competitive and political pressure, this is it.

**It complicates the thesis.** Anthropic did not quietly fold. It refused, sued, and won an injunction. **950 Google employees** signed an open letter asking their employer to follow Anthropic's lead. Corporate ethics did not evaporate; it lost a round and is still in court.

**And it undercuts the proposed remedy.** The protest's answer is regulation. But the pressure that broke Anthropic's position *came from the state* — a government customer demanding unrestricted use, and a designation applied when it did not get it. "Only law can stop this" is a weaker argument when the government is the party pushing hardest against the guardrail.

That is not a case against regulation. It is a case against assuming regulation runs in the direction you expect.

## What is not established

- **The precise mechanism of the February action.** Reporting describes the administration moving against Anthropic; we did not obtain the underlying order or its terms.
- **The status of the $200m agreement.** Whether it was terminated, allowed to lapse, or is part of the litigation is not clear from the sources we could reach.
- **The current state of the litigation.** An injunction was granted in March 2026. We found no reporting on what has happened since.
- **Turnout.** Two outlets, two figures, a factor of three apart.
- **Whether the intent language in the OpenAI and Google contracts binds anything.** The Wall Street Journal says it is unclear. Nobody has tested it.

## Why this belongs in a security feed

Because the question of whether a model provider can refuse a use case is an access-control question, and it is being answered right now, in court, by a customer with subpoena power.

Every enterprise buying frontier AI inherits some version of this. The terms your vendor accepted from its largest customer are the terms that define what the product is permitted to do — and if those terms are statements of intent rather than binding restrictions, your own contractual assurances are built on the same sand.

The related fight over [state versus federal authority to regulate AI](/article/doj-xai-colorado-ai-act-preemption-fight) is the other half of this. One is about who can compel a model to be used a certain way. The other is about who can compel it not to be.`,
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
