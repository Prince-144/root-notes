/**
 * Long-form drafts — 25 August 2026, from four Instagram Reels sent for
 * research.
 *
 * Two of the four reels carried a checkable claim, one carried a claim that
 * turned out to be false, and one ("Watch till end!" from
 * @the.aditya.productions) carried no claim at all — nothing to research, so
 * nothing written.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, cannot read a table, and
 * truncates past ~460 characters. Each section's strongest paragraph is written
 * to stand alone, carry its own figures, and stay under that limit.
 *
 * Sourcing note on the "25 August" piece: every figure in circulation comes
 * from user-generated video. There is no police statement, no named victim and
 * no mainstream report. The piece therefore reports the disagreement between
 * the numbers rather than picking one, and states plainly that we cannot
 * confirm the event happened as described. The one thing we can check is the
 * arithmetic, and it does not hold.
 *
 * Editorial note on the Altman piece: the defendant has pleaded not guilty and
 * nothing is proven. No manifesto contents, names or addresses are reproduced.
 * The framing circulating on social media — that fear-based AI marketing caused
 * this — is a causal claim nobody has established, and the defence has raised a
 * mental health crisis. Both are said, neither is adopted.
 *
 * Cover note: all three downloaded and viewed. The Altman piece uses a
 * courthouse rather than anything depicting the attack, because the current
 * state of the story is an unresolved legal process. The scam piece uses a
 * silhouette so nobody is identifiable.
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
    slug: "ram-is-not-worth-more-than-gold-dram-shortage-numbers",
    title:
      "No, RAM is not worth more than gold by weight — the true numbers are strange enough",
    excerpt:
      "A claim doing the rounds says AI demand has pushed memory past gold by weight. Gold closed at $150.34 a gram; a 32GB DDR5 kit at $400 works out around $4 to $5. The claim is wrong by a factor of about thirty. What is true: DRAM is on course to rise more than 400% from early 2024, and AI will take a fifth of the world's supply.",
    categorySlug: "ai",
    tags: [
      "dram",
      "memory-prices",
      "ai-infrastructure",
      "hardware",
      "fact-check",
      "supply-chain",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1541029071515-84cc54f84dc5${P}`,
    body: `A claim is circulating that RAM is now worth more than gold by weight, and that AI is the reason.

Half of that is right. Let us do the second half properly, because it takes about a minute.

## The arithmetic

Gold on **25 August 2026** sits at **$4,675.96** an ounce — **$150.34** a gram.

A mainstream **32GB DDR5** kit currently runs **$399** to **$479**, with the wider market between **$380** and **$589**. Call it **$400**.

Now weigh it. A two-module kit with heatspreaders comes to roughly **80–100 grams**, which puts the kit at about **$4 to $5 per gram** — around **thirty times cheaper** than gold.

And the conclusion does not depend on getting the weight right. Suppose the entire kit somehow weighed only **20 grams**, which is less than one bare module. That is still **$20** a gram against gold's **$150**. The claim fails by a wide margin at any plausible weight, which is the useful kind of check: it survives being wrong about the inputs.

The only way to make the comparison work is to weigh the silicon alone and price the finished product — to divide the cost of a thing you can buy by the mass of a thing you cannot. That is not a price comparison. It is a sentence that sounds like one.

## What is actually true

The real figures did not need the embellishment:

| Measure | Change |
| --- | --- |
| DRAM, start of 2024 to end of 2026 (est.) | more than **400%** |
| DRAM over 2025 | roughly **170%** |
| DDR5 in Q1 2026 | up to **110%** |
| Average DRAM this quarter vs Q4 2025 | **50–55%** |
| NAND flash contract prices, single month (Nov 2025) | more than **60%** |

A 32GB DDR5 kit that sold near **$100** a year ago now lists around **$400**. A 16GB kit that was under **$100** is now upward of **$240**.

That is a consumer product quadrupling in a year, which almost nothing outside a genuine shortage ever does.

## Why it is happening

**Samsung**, **SK Hynix** and **Micron** control more than **95%** of global DRAM output. All three are moving wafer capacity away from consumer memory and toward **high-bandwidth memory** for AI accelerators.

AI is expected to consume **20%** of total DRAM production in 2026.

The shortage is therefore not a disruption. Nothing broke, no fab burned down, no ship ran aground. Three companies made the same rational decision at the same time — sell the same silicon into the market paying more — and consumer memory is what is left over.

That is a more interesting story than the gold line, because it is a structural fact about who gets served when a general-purpose input becomes scarce. It is the same shape as [Broadcom pointing AI at Spring and finding 200-plus vulnerabilities in a year](/article/spring-91-cves-200-this-year-broadcom-ai-discovery): the resource goes where the return is, and everyone else adjusts.

## When it ends

Not soon. Leadership at **Synopsys** has put the shortage as lasting at least through **2027**, and some forecasts push full resolution out toward **2030**. New fab capacity is the constraint, and fabs take years.

## What to do if you are buying

- **Buy the RAM you need now, not the RAM you might want later.** The usual advice — overspecify memory because it is cheap — is currently backwards.
- **Check second-hand and older standards.** DDR4 pricing has risen too, but the delta is different, and an older platform may be the cheaper total build.
- **If you are specifying laptops or phones for the next cycle, expect the memory tier to cost more than it used to.** Manufacturers are absorbing some of this and passing on the rest.
- **Do not wait for a crash.** The capacity decisions driving this were made for good commercial reasons and are not about to reverse.

## Why the claim spread anyway

Because "more expensive than gold" is a sentence people can repeat, and "DRAM contract prices rose 170% in 2025 as producers reallocated wafers to HBM" is not.

The check took a minute and a search for the gold price. That is the whole cost of not repeating it.

## What is not established

- **The exact weight of a given kit.** We used a range; the conclusion holds across it and well beyond it.
- **Where the claim originated**, or whether its author was comparing bare die.
- **Whether the 400% estimate lands.** It is a projection to end-2026, not a measurement.
- **How much of the increase reaches retail prices of finished devices**, as opposed to being absorbed by manufacturers.`,
  },
  {
    slug: "altman-home-attack-moreno-gama-charges-not-proven",
    title:
      "A 20-year-old is facing life over an attack on Sam Altman's home — and almost every claim about why is unproven",
    excerpt:
      "Daniel Moreno-Gama travelled from Texas to San Francisco and, prosecutors say, threw a Molotov cocktail at the OpenAI chief executive's house in April, carrying kerosene and a manifesto listing AI executives. He has pleaded not guilty. The clips recirculating this month leave out the date, the plea, and the fact that no court has found anything.",
    categorySlug: "world",
    tags: [
      "openai",
      "ai-backlash",
      "legal",
      "san-francisco",
      "extremism",
      "media-literacy",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1780445333332-3abb7dde9ad1${P}`,
    body: `A clip is going round again describing a 20-year-old who flew from Texas to San Francisco with a manifesto and a list of AI chief executives.

The underlying case is real. It is also from **April**, the defendant has pleaded **not guilty**, and no court has found any of it proven. None of that survives the trip to a fifteen-second video, so here is the whole thing.

## What prosecutors allege

At roughly **4am** on **10 April 2026**, prosecutors say, **Daniel Moreno-Gama**, **20**, of Spring, Texas, threw a Molotov cocktail at the San Francisco home of OpenAI chief executive **Sam Altman**.

Police say they found him with further incendiary devices, a jug of kerosene, a lighter, and a written document titled **"Your Last Warning"** which advocated killing executives and investors in the AI industry and listed names and addresses said to belong to several of them.

We are not reproducing any part of that list, or the document's contents beyond what the charges rest on.

## Where the case stands

He faces **two counts of attempted murder** and nine further state charges, carrying between **19 years and life**. Federally he is charged with possession of an unregistered firearm and attempted destruction of property by means of explosives, together carrying up to **30** additional years.

He has pleaded **not guilty**.

His attorney has called the incident a property crime at best, argued the charges are disproportionate, and cited a mental health crisis.

That is the entire status: allegations, a plea, and a defence position. Nothing has been decided.

## The framing that travels with the clip

The captions carrying this story generally supply a cause: that the AI industry marketed itself through fear for years and this is the result.

It is worth separating that into two claims, because they are not the same.

**That there is a backlash** is documented. Between April and June 2025, **20** proposed data centre projects worth a combined **$98 billion** were blocked or delayed by local resistance. That is a measurable phenomenon with planning records behind it.

**That the industry's rhetoric produced this specific attack** is a causal claim about one person's motivation, made by people with no access to him, against a defence that has raised his mental health. It may be right. Nothing published establishes it, and a social media caption is not where that gets settled.

## Why the date matters

The attack was in April. The arraignment was in May. It is late August.

A clip that carries no date reads as news. Someone who sees it today reasonably believes an attack just happened, that the AI backlash has escalated this week, and that the situation is more volatile than it is. That is a real distortion produced by nothing more than an omission.

It is the same mechanism we wrote about in [the reels claiming a company had built something too dangerous to release](/article/redc2-4-npm-packages-llm-red-agent-99-dollars): a true-ish core, stripped of the qualifiers that make it accurate, travelling faster than the original.

## The part worth taking seriously

Underneath the recirculation, the substance is not trivial.

Somebody wrote down the names and addresses of technology executives and, on the prosecution's account, acted on it. Whatever a court decides about this defendant, executives in the sector have had to think about physical security in a way they did not two years ago, and that shift is real regardless of how this case resolves.

It sits alongside the planning fights, the [regulatory penalties arriving at a new scale](/article/uber-825-million-dutch-dpa-automated-driver-suspensions), and the general sense that the argument about AI has stopped being conducted only in essays. Most of that argument is lawful and ordinary. This case, if proven, is not part of it — it is the thing that ordinary opposition gets tarred with, which is its own cost.

## What is not established

- **Anything alleged.** He has pleaded not guilty; there is no verdict.
- **His motive**, beyond what the document is said to contain.
- **The document's length.** Page counts circulating with the clips are not something we could confirm.
- **Whether domestic terrorism charges will follow.** Prosecutors have left the possibility open; nothing has been filed.
- **Any connection to a group or movement.** None reported.`,
  },
  {
    slug: "25-august-telegram-scam-numbers-do-not-agree",
    title:
      "Everyone is quoting a number for the \"25 August\" scam, and the numbers do not agree with each other",
    excerpt:
      "A viral mystery pointed Instagram users at a Telegram channel charging ₹500 for the reveal. The totals now circulating are ₹3 crore, ₹8.3 crore and ₹10 crore — for the same event. There is no police statement, no named victim and no mainstream report. The one thing anyone can check is the multiplication, and it does not work.",
    categorySlug: "security",
    tags: [
      "social-engineering",
      "india",
      "telegram",
      "instagram",
      "scams",
      "media-literacy",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1597888619263-41e68f36c16a${P}`,
    body: `A mystery built around the date **25 August** spread across Indian Instagram, and the payoff was on Telegram: pay **₹500**, see the reveal.

Since then the internet has been quoting a total. The trouble is that it is quoting several.

## Three numbers, one event

The figures circulating for the same alleged scheme are **₹3 crore**, **₹8.3 crore** and **₹10 crore**.

Those are not rounding differences. The largest is more than three times the smallest, and every one of them is presented as fact.

## The multiplication does not hold

The most-shared framing pairs two specific inputs: **1.66 lakh** people, at **₹500** each.

Multiply them. **1,66,000 × 500 = ₹8.3 crore.**

So the videos quoting **₹8.3 crore** are at least internally consistent with their own inputs. The ones quoting **₹3 crore** alongside the same **1.66 lakh** figure are not — **₹3 crore** at **₹500** a head implies about **60,000** people, not 1.66 lakh.

That is a headline disagreeing with its own subtitle, and it is checkable on a phone in five seconds.

## Where the participant count comes from

This is the weaker link, and it deserves saying plainly.

Nobody has published a payment record. The **1.66 lakh** figure appears to derive from a channel's member count, and a member count is not a payment count. People join to look. People join because a video told them to. People join to screenshot it and make their own video.

Treating subscribers as buyers assumes a conversion rate of **100%**, which no product in history has achieved.

## What we cannot confirm

All of it, essentially.

There is no police statement. No cyber cell has announced a case. No victim has been named. No arrest has been reported. No mainstream Indian outlet has covered it. Every figure in circulation traces back to user-generated video, and several of those videos cite each other.

We are not saying nothing happened. Something plainly spread, and the mechanism described — mystery, urgency, a small fee for the reveal — is real and works. We are saying that the amount, the participant count and the outcome are all unverified, and that the confidence with which they are being repeated is not supported by anything published.

## The mechanism needs no malware

Worth being clear about what this is, if it is what it appears to be.

There is no exploit here. No malicious app, no credential theft, no [SEO poisoning](/article/weedhack-fake-minecraft-clients-seo-poisoning-defender-exclusions), no [side-loaded implant](/article/uat-10147-spectre-implant-170000-urls-old-cves). Somebody manufactured curiosity, attached a date to it, moved the audience to a platform with no refunds, and charged a sum small enough that nobody complains to the police.

**₹500** is the design. It is large enough to be worth collecting at scale and small enough that the loss is not worth a complaint — which is also why a case may never be registered, and why the true total may never be known by anyone except the operator.

## The warning videos are part of the distribution

This is the uncomfortable bit.

A video that says "1.66 lakh people paid ₹500, do not fall for it" is an advertisement with a disclaimer attached. It certifies that the thing is popular, tells the audience where it happened, and supplies a number that makes it sound like everyone else already went.

Some of those videos are made by people genuinely warning others. The effect on reach is the same either way, and this article is not exempt from that — which is why it contains no channel name, no link and no instruction on where to find any of it.

## What to do

- **Never pay for a reveal.** The content behind a paid mystery is worth what it cost to produce, which is nothing.
- **If you paid, do not chase it.** The second wave of these is a "recovery" service that charges again.
- **Report it anyway** at cybercrime.gov.in or 1930, even for ₹500. Small unreported losses are exactly why the pattern keeps working.
- **Check the arithmetic before resharing a number.** Count times price equals total. When it does not, neither figure is reliable.
- **Assume a member count is not a customer count.** This is the single most repeated error in viral scam reporting.

## What is not established

- **Whether any of the totals are accurate.** None is sourced.
- **How many people actually paid**, as distinct from joined.
- **Who ran it**, and whether it was one operator or several copying each other.
- **Whether any complaint has been registered anywhere.** None reported.
- **What the "reveal" even was.** No consistent account exists.`,
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
