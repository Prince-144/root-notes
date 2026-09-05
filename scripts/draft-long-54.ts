/**
 * Drafts the God's Eye piece.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-54.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-54.ts --update
 *
 * Researching "God's Eye" as a tool returns three unrelated products using
 * the name, which turned out to be the article rather than a problem with the
 * search:
 *
 *   - bilawalsidhu/gods-eye-view, MIT, an aggregation globe whose README
 *     refuses person-tracking outright and publishes a blunt accuracy
 *     disclaimer.
 *   - cyberwarfare.ai's "God's Eye", a facial recognition product claiming to
 *     de-mask, de-age, detect sex changes and score attractiveness as
 *     trafficking risk, with no published accuracy figure and no source for
 *     any of it except the vendor's own page.
 *   - gesrl.in's "God's Eye", an autonomous pentest framework claiming 100%
 *     reproducible, deterministic results from twenty parallel AI agents.
 *
 * The claims of the second and third are reported as claims throughout. The
 * affect-inference criticism is anchored to Barrett et al. 2019 rather than
 * asserted, and the piece says plainly that no independent evaluation of
 * either product could be found.
 *
 * No backticks in the body: inline code spans inside the template literal
 * break the MDX parse.
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
    slug: "three-tools-called-gods-eye-only-one-publishes-what-it-cannot-see",
    title: "Three tools are called God's Eye. Only one of them publishes what it cannot see",
    excerpt:
      "An MIT-licensed OSINT globe with 17.7k stars refuses to add person tracking and warns its own data may be wrong. A facial recognition product with the same name claims to unmask faces, detect sex changes and score attractiveness as trafficking risk, and publishes no accuracy figure at all. The name is identical. The honesty is not.",
    categorySlug: "security",
    tags: ["osint", "surveillance", "facial-recognition", "open-source", "ai-claims", "tools"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1663160055679-7b7fecb4468f${P}`,
    body: `Search for a tool called **God's Eye** and you get three unrelated products. That is not a problem with the search. It is the story.

The name is a claim — total sight, nothing hidden — and it turns out to be a useful sorting device. What separates these three is not what each says it can do. It is whether any of them will tell you what it cannot.

## The one that draws a line

**God's Eye View** was released MIT-licensed on **24 August 2026** by Bilawal Sidhu: a browser-based 3D globe that fuses live public data feeds. Four days after release it had around **8,300 stars**. It now shows **17.7k stars** and **3.6k forks**.

Thirteen layers, and **ten of them need no API key**:

| Layer | Source | Key |
|---|---|---|
| Live flights | OpenSky + adsb.lol | no |
| Military flights | adsb.lol | no |
| Satellites | CelesTrak | no |
| Earthquakes | USGS | no |
| Traffic | TomTom + OSM | no |
| CCTV mesh | city APIs | no |
| Radio | Radio Browser | no |
| Bikeshare | GBFS | no |
| Space missions | Launch Library 2 | no |
| Mapped installations | OpenStreetMap | no |
| Live vessels | AISStream | yes (free) |
| Active fires | NASA FIRMS | yes (free) |

Nothing here is privileged access. Every one of those feeds was already public; what the project supplies is the assembly. That is worth being clear-eyed about — aggregation is itself a capability, and "it was all public anyway" has never been a complete answer.

Which is why the two paragraphs in its README matter more than the feature list.

On scope:

> It does not build features for named-person search, face recognition, or tracking individuals, and pull requests that cross that line won't be merged. People are not a query type here.

On accuracy:

> Data may be delayed, incomplete, modeled, inferred, or wrong. Do not use it for flight or maritime navigation, emergency response, medical or health decisions, investment decisions, or other safety-critical or operational purposes.

Two things a tool almost never says about itself: here is the thing I refuse to become, and here is why you should not trust me.

Worth noting honestly: the author's own launch write-up is about setup and API costs, not ethics. The line is drawn in the repository, not argued in the essay. It is still a line, and it is still enforceable through the one mechanism that matters in an MIT project — what gets merged.

## The one that claims to see through a mask

A product marketed at cyberwarfare.ai carries the same name and states it is "available exclusively to the U.S. and Israeli governments".

Its own page claims the system performs:

- **AI Misdirection Analysis** — removing makeup and reconstructing faces
- **AI De-Masking** — identifying people behind masks
- **Gender Reconstruction** — detecting that someone has had a sex change and reconstructing their "original appearance"
- **AI Body Structure Analysis** — for disabled people it describes as attempting to bypass recognition
- Aging and de-aging

And it claims to detect or predict, from a face: **sentiment, emotion, age range, gender, race, "Attractiveness Scoring (Trafficking Risk)", depression, and aggression.**

It names **enLIST** as its analytics platform and claims automatic updates from Interpol Red, Interpol Yellow, NCMEC and LexisNexis ADAM.

It publishes **no accuracy figure**. No error rate, no evaluation, no test set, no false-positive rate across demographic groups. No pricing. No named deployment.

Every sentence above is the vendor's claim about itself. Searching for independent coverage, testing or procurement records turns up nothing but the vendor's own page — which is a finding in its own right. A system that claims to identify people through masks and makeup for two governments, and that has never been evaluated by anyone who does not sell it, is not a capability. It is a brochure.

## The claims with no science under them

Some of that list is not merely unverified. It is asserting things the research says cannot be done from a face at all.

The standard reference is **Barrett, Adolphs, Marsella, Martinez and Pollak (2019)**, *Emotional Expressions Reconsidered*, which reviewed over **1,000 papers** and concluded there is no scientific support for the assumption that a person's emotional state can be readily inferred from their facial movements. The link is not reliable, not specific, and not generalisable across cultures and contexts. Algorithms are good at detecting facial movements; nothing equips them to say what those movements mean.

Everything in the emotion column falls under that: sentiment, emotion, depression, aggression.

"Attractiveness Scoring (Trafficking Risk)" is a category of its own. It proposes that how attractive a machine rates a face predicts that person's involvement in trafficking. There is no literature supporting that, and the failure mode is not abstract — it is a system that flags people for police attention on the basis of appearance.

"Race Detection/Prediction" is automated racial classification, a feature several jurisdictions have moved to prohibit outright.

And "Gender Reconstruction" is, in plain terms, a claim to identify trans people and generate an image of how they looked before transition. Whatever one thinks of the investigative use case, that is the capability being advertised, and it is being advertised to states.

## The one that promises determinism from LLM agents

The third is at gesrl.in, styling itself "**World's #1** Autonomous Pentest Framework": one command, five phases, **34 AI agents**, a full VAPT "in under 24 hours" against the "2–4 weeks" it attributes to pentest firms.

Its claim table includes "**100% Reproducible results**", "**Deterministic — same checks every run**", and "**< 30s** mean time to first finding".

Set those beside its own pipeline description, which puts **20 parallel AI agents** in the vulnerability analysis phase. Determinism and twenty parallel language-model agents are difficult claims to hold simultaneously, and the site does not explain how it does. "World's #1" has no basis given, and no customers are named.

To its credit, the site carries a clear warning that testing requires ownership or explicit written permission, and links a responsible disclosure policy. That is more than many tools in this category bother with.

On whether an agent can actually replace a pentester: [the one public, independently costed experiment we have covered](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout) took **8 hours 32 minutes** and **$535.74** to port a single working exploit between two industrial controllers, needed constant human steering, and bricked the device. That is one exploit, not a full VAPT, and the lab concluded its own researcher would have been faster alone.

## What actually separates them

Not capability. The aggregation globe is genuinely powerful and its author does not pretend otherwise.

The difference is that one of the three publishes its limits — what it will not do, and what its output should not be trusted for — and the other two publish superlatives with nothing behind them.

That is the same pattern as [a lab writing its own safety threshold, running its own test and clearing its own release](/article/gpt-6-astra-critical-cyber-threshold-openai-wrote-the-line). When the only party describing a capability is the party selling it, the description is marketing regardless of how technical it sounds.

## What to do

- **Ask for the error rate.** Any identification or classification product without a published false-positive rate, broken out by demographic group, has not been evaluated.
- **Treat "no independent coverage" as a finding.** For a product claiming national-security deployment, an empty search is information.
- **Read the refusals.** A tool that publishes what it will not do has thought about misuse. One that publishes only superlatives has thought about procurement.
- **Discount affect claims to zero.** Emotion, depression and aggression inference from faces does not have the science behind it, whatever the interface shows.
- **Be careful what aggregation you are excusing.** "It was already public" is true of every feed on that globe and is still not a complete argument.

## What is not established

- **Whether the cyberwarfare.ai product exists as described**, is deployed anywhere, or works at all. Nothing outside the vendor's own page describes it.
- **Whether either government named on that page is a customer.** The claim is the vendor's.
- **Any accuracy figure for any claim on that page.** None is published.
- **How gesrl.in reconciles determinism with twenty parallel AI agents**, or what "World's #1" is measured against.
- **Whether God's Eye View's scope policy survives its fork count.** 3.6k forks are not bound by what the upstream maintainer declines to merge.`,
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
