/**
 * Long-form drafts — Startups and World.
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
    slug: "physical-ai-week-funding-security-in-top-ten",
    title: "A robotics company took $1.7bn in one week — and three of the ten biggest rounds were security",
    excerpt:
      "The week of 18–24 July 2026 was read as a physical-AI story, and Atoms' $1.7 billion made that easy. Underneath it, Cathedral, Glow and Neo Security took $360m between them, which says more about where security capital is going than any sector total does.",
    categorySlug: "startups",
    tags: [
      "vc",
      "startup-funding",
      "market-data",
      "cybersecurity",
      "ai",
      "founders",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1525182008055-f88b95ff7980${P}`,
    body: `The headline from the week of **18–24 July 2026** wrote itself: **Atoms**, the physical-AI robotics company founded by Travis Kalanick, raised **$1.7 billion** in a growth round led by Andreessen Horowitz.

[Crunchbase's list](https://news.crunchbase.com/venture/biggest-funding-rounds-physical-ai-fintech-defense-atoms/) of the week's ten biggest rounds is worth reading past the first line, though, because three of the ten were security companies.

## The ten

| # | Company | Raised | Stage | Valuation | What it does |
| --- | --- | --- | --- | --- | --- |
| 1 | Atoms | $1.7B | Growth | — | Physical AI robotics |
| 2 | Meshy AI | $400M | Series B | $1.5B | 3D AI generation |
| 3 | Sila | $300M | Growth | — | Battery technology |
| 4 | Etched | $300M | Series C | **$10B pre-money** | AI inference chips |
| 5 | Augustus | $180M | Series B | $1B | Fintech |
| 6 | **Cathedral** | $160M | Growth | **$14B reported** | Defence / military cyber |
| 7 | Crystalys | $130M | Series B | — | Biotech |
| 8 | Candid Health | $120M | Series D | — | Healthcare revenue software |
| 9 | **Glow** | $100M | — | — | AI endpoint security |
| 10 | **Neo Security** | $100M | Growth | — | Enterprise software control |

Cathedral, Glow and Neo Security account for **$360 million** across the three.

## Why that matters more than the sector total

We looked recently at [cybersecurity funding holding at $10.6bn for the half while Q2 fell about 30%](/article/cybersecurity-funding-h1-2026-concentration). The conclusion there was that the total was being carried by a small number of very large rounds while deal counts fell — a barbell.

This week is that pattern in a single frame. Security did not appear as a sector having a good week. It appeared as **three individual companies**, in a top ten otherwise dominated by AI and hardware, taking nine figures each.

Note the investor names attached: Cathedral led by **Sequoia and Andreessen Horowitz**, Glow by **Sequoia, Cyberstarts, Greenoaks and Redpoint**, Neo Security by **Bessemer and Andreessen Horowitz**. These are the same firms writing the AI cheques. It is not a separate pool of security capital; it is the same capital, occasionally pointed at security.

## Cathedral's number is the one to sit with

**$160 million at a reported $14 billion valuation** is an unusual shape. The round is small relative to the valuation — roughly 1% — which typically indicates a company that does not need the money and is raising on terms it likes, rather than one funding a burn plan.

The category is defence and military cyber. That places it in a segment with government customers, long procurement cycles and, at the moment, considerable political tailwind.

For founders, the useful read is not "defence tech is hot." It is that **valuation and round size are decoupling**, and a large valuation attached to a modest raise is a different signal than the same valuation attached to a large one.

## What Etched says about the AI stack

**$300 million at a $10 billion pre-money**, from Sequoia, for **AI inference chips**.

That is the second-highest valuation in the table, for a company selling silicon rather than software. It fits a pattern visible in the same week's list — Sila on batteries, Atoms on robotics — where the largest cheques went to companies with physical products and heavy capital requirements.

Crunchbase's own framing quotes the thesis behind the Atoms round: the coming industrial revolution in which large industrial sectors get completely digitised.

Whether that thesis is right is a separate question. What is observable is where the money went, and it went to atoms rather than bits with unusual consistency for one week.

## What founders should take from this

- **A sector total tells you nothing about your round.** Security "appeared" in this list three times, and all three were at a stage most companies reading this will never reach. The early-stage market is a different market.
- **The same funds are doing both.** If a16z is writing a $1.7bn physical-AI cheque and a $100m security cheque in the same week, "we're a security company" is not a differentiator to that firm. What you are doing that is hard is.
- **Watch round size against valuation.** Cathedral raising 1% of its valuation and a company raising 25% of its valuation are in completely different negotiating positions, and the headline number obscures which is which.
- **One week is one week.** This is a snapshot, not a trend. It is useful for seeing *shape* — who is writing cheques, at what stages, in what categories — and close to useless for predicting next quarter.

The most reliable observation in the table is the least exciting one: at the top of the market, capital is available and concentrated. Neither half of that sentence describes what it is like to raise a Series A.`,
  },
  {
    slug: "google-dma-fine-890-million-search-play-steering",
    title: "The EU fined Google €890m — and gave it 60 days before the meter starts running",
    excerpt:
      "Reported almost everywhere as a $1 billion fine, the figure is €890 million: €460m for preferencing its own services in Search and €430m for restricting how developers steer users to cheaper deals. The consequence that matters is what happens after day 60.",
    categorySlug: "world",
    tags: [
      "regulation",
      "europe",
      "policy",
      "compliance",
      "antitrust",
      "big-tech",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1608817576203-3c27ed168bd2${P}`,
    body: `On **23 July 2026** the European Commission fined Google **€890 million** for breaching the Digital Markets Act.

Most coverage rounded that to "$1 billion", which is approximately right in dollars and drops the more useful detail — that the fine is two separate findings with two separate figures attached.

| Breach | Fine |
| --- | --- |
| Self-preferencing in Search | **€460m** |
| App store steering restrictions | **€430m** |

## What the Commission actually found

**Self-preferencing.** The Commission found that Google gives preferential treatment to its own services — shopping, hotels, transport and sports results — over those of third parties in Google Search.

**Steering.** Google prevented app developers from freely promoting alternative purchase options, restricting their ability to tell users about cheaper deals available in competing app stores.

The second is worth being precise about, because it is frequently described as a fee dispute. It is not. The finding is about **communication** — whether a developer may tell its own users that the same subscription is cheaper elsewhere. The commission rate is a separate argument; this one is about whether the fact may be mentioned.

## The 60 days is the story

The fine is the part that gets reported. The remedy is the part with consequences.

Google must **end both practices within 60 days** or face **periodic penalty payments of up to 5% of worldwide turnover**.

Set those two numbers against each other. €890 million is a large fine and a manageable one for a company of Google's size. **5% of worldwide turnover, applied periodically**, is a different category of instrument — it is designed to be more expensive than non-compliance, indefinitely, rather than to punish something that already happened.

That is the structural difference between the DMA and the antitrust regime that preceded it. The old model was investigate, fine, litigate for years. The DMA model is comply by a date, or the meter starts.

## Google is already moving

The Commission acknowledged **substantial progress toward compliance**: Google has been testing changes to search result placement and has rolled out modifications to its steering terms.

That acknowledgement, in a decision imposing a fine, is itself informative. It suggests the Commission's objective is behavioural change rather than revenue, and that a company visibly moving gets credit for it.

Google **may appeal**. On recent form, an appeal changes the timetable of the fine and not the obligation to comply, which is the point of the 60-day clock.

## Where this sits in the sequence

| When | Action | Amount |
| --- | --- | --- |
| Sept 2023 | French cookie enforcement | €325m |
| July 2024 | Android promotion fine — final appeal dismissed in July 2026 | €4.1bn |
| Sept 2025 | Adtech anti-competitive practices | €2.95bn |
| **July 2026** | **DMA: search self-preferencing + steering** | **€890m** |

Two things stand out.

The **€890m is the smallest** of the recent decisions by some distance — smaller than the adtech fine by a factor of three. If you read fines as the measure of severity, this looks like a lesser matter.

It is not, and that is the point. The DMA's leverage is not in the penalty for the past. It is in the 5% recurring exposure for the future.

The other is timing: Google's **final appeal against the €4.1bn Android decision was dismissed in early July 2026**, weeks before this decision landed. A company that has just exhausted its appeals on one matter is in a materially different position when deciding whether to fight the next one.

## Why it reaches beyond Europe

Search ranking and app store rules are global systems. Building a distinct version for the EU is possible and expensive, and the pattern across previous mandates has been that once a change is engineered for Europe it tends to ship everywhere, because maintaining two behaviours is more costly than adopting the stricter one.

That is what happened with USB-C, and it is the same logic that makes [European rules on repairability and battery replacement](/article/eu-right-to-repair-deadline-battery-2027-repairability-grades) a global product question rather than a regional compliance one.

If you build anything that depends on search visibility or app store distribution, the changes to watch are the ones Google ships in the next two months — not the fine.

## What to actually watch

- **The 60-day mark.** Whether the Commission declares compliance, or the periodic payments begin, is the only outcome that changes anything.
- **Whether the steering change is global.** If developers can point users to cheaper options outside the app store, that is a pricing-power shift wherever it applies.
- **Whether search placement changes hold.** Testing is not shipping, and "substantial progress" is not the same as compliance.
- **The appeal, but loosely.** It affects the money and the timetable, not the obligation.`,
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
