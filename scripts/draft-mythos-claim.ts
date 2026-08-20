/**
 * Draft — checking a viral claim about Anthropic's "too dangerous to release".
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Sourcing note: this piece assesses claims about Anthropic, and it was
 * researched and drafted with an Anthropic model. Every load-bearing figure
 * therefore comes from a source that is not Anthropic — the UK AI Security
 * Institute's own evaluation, and trade reporting — rather than from the
 * company's account of itself. That is the reason the numbers below are
 * AISI's rather than Anthropic's, and the reason the piece does not resolve
 * the parts that are genuinely unresolved.
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
    slug: "too-dangerous-to-release-mythos-claim-checked-aisi",
    title:
      "\"Too dangerous to release\" got called marketing — a government lab published its own numbers the next day",
    excerpt:
      "The criticism is that Anthropic controls the product and the narrative, nobody can check the claims, and cheap models find the same bugs. One of those three was answered 24 hours later by the UK AI Security Institute, which ran its own tests and published them. The other two are still standing, and one of them is the interesting part.",
    categorySlug: "ai",
    tags: [
      "anthropic",
      "ai-safety",
      "evaluations",
      "uk-aisi",
      "fact-check",
      "vulnerability-research",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1579618217299-92460380cf99${P}`,
    body: `A criticism that circulates every time an AI lab says a model is too dangerous to ship goes roughly like this: the phrase is positioning, the company controls both the product and the story, nobody outside can verify anything, and cheaper models are finding the same bugs anyway.

It is a fair thing to suspect. It is also checkable, and the check has interesting results — one claim answered squarely, one unsupported, and one that survives and deserves to.

## What actually happened

On **7 April 2026** Anthropic announced **Claude Mythos Preview** and did not release it commercially, saying frontier models had reached a point where they could surpass all but the most skilled humans at finding and exploiting software vulnerabilities.

Instead of a product launch it opened **Project Glasswing**, giving a restricted set of organisations access for defensive work. By **2 June 2026** that had expanded to roughly **200** organisations across more than **15** countries, with partners collectively reporting over **10,000** high- and critical-severity flaws in under two months. **ICE**, **NYSE** and **Rubrik** are named as running Mythos against their own infrastructure. The version generally available to everyone else is Claude Code Security built on Opus 4.8.

## Claim 1: nobody can independently verify it

This is the one that has been answered, and the timing is almost comic.

On **13 April 2026** — six days after the announcement — the **UK AI Security Institute**, a government body, published its own evaluation of Mythos Preview. Not a summary of Anthropic's tests. Its own, on its own ranges.

AISI's headline results:

| Test | Result |
| --- | --- |
| Expert-level CTF challenges | **73%** success rate |
| "The Last Ones" 32-step network attack, full completion | **3** of 10 attempts |
| Same test, average progress | **22** of 32 steps |
| Claude Opus 4.6, same test | **16** of 32 steps |
| Human professional time for the same range | around **20** hours |

For scale on how fast this moved: AISI notes that expert-level CTF tasks could not be completed by any model at all before **April 2025**, and that two years ago the best models could barely finish beginner-level cyber tasks.

So the specific claim that nobody outside the company can check the numbers is not true for this model. A government institute checked them, disagreed with nothing material, and published the methodology.

## Claim 2: cheap models find the same bugs

This one is unsupported, and it also compares two different things.

Cheap models genuinely do find real vulnerabilities — that is not in dispute, and we covered [the surge in AI-assisted vulnerability reports on HackerOne, where the valid rate held](/article/ai-vulnerability-reports-surge-hackerone-valid-rate-held). Small models fuzzing, triaging and pattern-matching their way to genuine findings is now ordinary.

But finding a bug and executing a 32-step intrusion are not the same task. AISI's range runs from reconnaissance to full network takeover, and the discriminating result is not that Mythos found bugs — it is that it chained them. On that measure, the gap between two **frontier** models was **22 steps against 16**, which is not the shape of a field where price is irrelevant.

Anthropic's own later research points the same way, and should be read as self-reported: in a swarm experiment, Mythos Preview surfaced **266** vulnerabilities across 15 open-source projects where a coordinated Opus 4.8 found **41**. Take the exact figures with the caution any first-party number deserves. The ratio is still not a rounding error.

No published benchmark shows a model at the very cheap end matching either result. If one appears, this section is wrong and we will say so.

## Claim 3: it is positioning

This one survives, and the honest answer is that it can be positioning *and* true at the same time.

Against the cynical reading: withholding a frontier model from commercial release is expensive, and it stayed withheld. Anthropic did not quietly ship it three weeks later.

For it: "we built something too dangerous to sell you" is, as a sentence, extraordinary marketing. Glasswing also converts a restriction into roughly 200 institutional relationships, a defensive-AI story, and a seat at the table on cyber policy. Restricted access is still access, granted by the company, on its terms, to partners it chose. None of that requires anyone to be lying.

The most useful thing AISI published is the part that supports the sceptics rather than the company. Its ranges had **no active defenders**, no defensive tooling, and no penalty for tripping alerts, and it describes them as small, weakly defended and vulnerable enterprise systems. Its own conclusion is that it cannot say whether Mythos Preview could attack well-defended systems. Mythos also failed one operational-technology range outright, getting stuck on the IT sections before it reached the OT part.

That is the correct size of the claim. A large, independently measured jump in capability against soft targets, with the question of hardened real-world networks explicitly open.

## What this is actually a lesson in

Check the date before you decide a question is unanswerable.

The criticism was posted on **12 April 2026**. AISI published on **13 April 2026**. At the moment the criticism was made it was reasonable — there was no independent evaluation to point to. One day later there was, and the version of the argument that keeps circulating months afterwards is the version that stopped being accurate almost immediately.

That is not a point about one creator. It is the normal life cycle of a take: the sceptical reaction travels, the evaluation that answers it does not, and the reaction outlives its own accuracy. The same thing happened with [the thirty-minutes-to-exploit figure](/article/thirty-minutes-to-exploit-tracing-the-claim) and with [the Suno leak](/article/suno-leak-what-the-viral-version-gets-wrong).

## What is not established

- **Whether Mythos would work against a defended network.** AISI says explicitly that it cannot say.
- **What Anthropic's commercial motive was.** Nobody outside the company knows, and the actions are consistent with both readings.
- **Whether the AISI numbers generalise.** They were produced on AISI's ranges, with token budgets up to **100M**, and AISI expects performance to keep improving beyond the budgets it tested.
- **What a cheap model can actually do on the same ranges.** Nobody has published it. That is the test that would settle the second claim, and it has not been run.

*Disclosure: this article was researched with AI assistance. Every figure in it comes from the UK AI Security Institute's published evaluation or from named reporting, not from Anthropic's own account of its capabilities.*`,
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
