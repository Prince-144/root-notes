/**
 * Draft — the 24 August Claude outage, written from the status page.
 *
 * Disclosure, stated in the article too: this was researched and drafted with
 * an Anthropic model, about an Anthropic outage, during that outage. Every fact
 * comes from status.claude.com as read on the day. Nothing about the cause is
 * asserted, because Anthropic has not published one.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Cover note: image downloaded and viewed before use.
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
    slug: "claude-outage-24-august-2026-opus-5-elevated-errors",
    title:
      "Claude went down across four surfaces on 24 August — and the only place to find out was the status page",
    excerpt:
      "Anthropic's status page logged elevated errors across multiple models, Opus 5 among them, from 05:06 UTC on 24 August, with the cause identified 21 minutes later. The API, Claude Code, claude.ai and Cowork all showed partial outages. It is the second multi-model incident in four days, and the 90-day uptime numbers are where the pattern shows.",
    categorySlug: "ai",
    tags: [
      "anthropic",
      "claude",
      "outage",
      "reliability",
      "ai-infrastructure",
      "status",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1622318614813-8f27b0ae8ce3${P}`,
    body: `On **24 August 2026**, Claude started returning errors.

Anthropic's status page logged it as **elevated errors for multiple models** — **Claude Opus 5**, **Mythos 5**, **Fable 5** and others — first reported at **05:06 UTC** and marked **Identified** by **05:27 UTC**. Identified means the cause was found and a fix was in progress; it does not mean service was restored, and it does not mean the cause was made public.

We are writing this one from the inside of it. More on that at the end.

## What was affected

Four surfaces showed a **partial outage** at once:

| Surface | Status during the incident |
| --- | --- |
| Claude API | Partial outage |
| Claude Code | Partial outage |
| claude.ai | Partial outage |
| Claude Cowork | Partial outage |
| Claude Console | Operational |
| Claude for Government | Operational |

The split is worth reading. The Console and the government environment stayed up while the API, the consumer app, the coding tool and the agent product went down together. When several distinct products fail at the same moment and one isolated environment does not, the fault is usually in something they share underneath rather than in each of them separately.

That is inference, not a finding. Anthropic has not said what broke.

## Twenty-one minutes to "identified", and then the hard part

**05:06** to **05:27** — twenty-one minutes from first report to cause identified — is fast, and it is the easy half.

"Identified" is not "resolved". Finding what broke and making the fix safe to roll out across production are different problems, and the second is the one users actually feel, because it is the stretch where the errors are still happening and the page still says a fix is in progress. A status page that reaches "identified" quickly is a team with good telemetry. It says nothing yet about time to recovery.

## The second one in four days

The same status page notes a previous incident affecting multiple Claude models on **20 August**, since resolved.

Two multi-model incidents in the same week is the part worth watching, not because two is a large number, but because of what the model has become. When Claude was a chat window, an outage meant waiting to ask a question. Now it is wired into coding pipelines, agents and other companies' products — [OpenAI paused a training run over an incident in its own research cluster](/article/openai-pauses-frontier-rl-astra-critical-cyber-monitoring), and the industry increasingly runs work through these APIs unattended. When the model is a dependency rather than a destination, its downtime is inherited by everything built on it.

## What the uptime numbers actually say

The single most honest figures on the page are the **90-day uptimes**, because they are cumulative and cannot be spun by a fast "identified":

| Surface | 90-day uptime |
| --- | --- |
| Claude for Government | 100.0% |
| Claude Console | 99.86% |
| Claude Cowork | 99.47% |
| Claude API | 99.46% |
| claude.ai | 99.35% |
| Claude Code | 99.38% |

**99.4%** sounds like an A. Over 90 days it is a little over **12 hours** of downtime. For a person opening a chat, twelve hours spread across three months is nothing. For a CI pipeline that calls the API on every commit, or an agent left running overnight, it is a number you have to design around — retries, fallbacks, and a plan for what your product does when the model does not answer.

The gap between those two readings of the same percentage is the whole story of what AI has quietly become this year.

## What to take from it if you build on Claude

- **Handle the API being down as a normal state, not an exception.** Timeouts, retries with backoff, and a defined behaviour when the call fails — the same discipline any external dependency gets.
- **Do not put a model call on a path that cannot fail.** If a user action hard-depends on a live completion, an outage becomes your outage.
- **Subscribe to the status page.** status.claude.com has email, SMS, Slack and webhook alerts. During an incident it is the source, and it is faster than noticing your own error rate.
- **Keep a fallback for what matters.** A smaller or alternate model on the critical paths is cheaper than the path being dead. This is true of every provider, not this one.
- **Read the 90-day number, not the incident.** One outage is noise; the cumulative figure is the thing to budget against.

## The disclosure

This article was researched and written with an Anthropic model, about an Anthropic outage, while that outage was ongoing. That is a conflict, and the way we have handled it is the way we handle any first-party subject: every fact here comes from **status.claude.com** as read on the day, not from any inside knowledge, and nothing about the cause is asserted, because none has been published.

It is also, in a small way, the point. The tool used to write this was one of the affected services. That is what it means for a model to be infrastructure.

## What is not established

- **The cause.** Marked identified; not disclosed.
- **When it resolved**, or how long recovery took after "identified".
- **How many users or requests were affected.** Partial outage is not quantified.
- **Whether the 20 and 24 August incidents share a root cause.** Both are logged; no link has been stated.`,
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
