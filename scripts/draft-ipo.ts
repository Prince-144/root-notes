/**
 * Anthropic's IPO filing against Google's 2004 IPO — the comparison checked.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
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
    slug: "anthropic-ipo-filing-965bn-vs-google-2004-multiple",
    title:
      "Anthropic is not listing at 42 times Google's price — on the multiple that matters it is cheaper than Google was",
    excerpt:
      "Google IPO'd at roughly 24 times sales in 2004. Anthropic's $965bn private mark against a $47bn run rate is about 20 times. The 42x figure compares two dollar amounts twenty-two years apart, and $965bn is not an IPO price at all.",
    categorySlug: "startups",
    tags: [
      "ipo",
      "anthropic",
      "openai",
      "valuation",
      "ai-bubble",
      "markets",
    ],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3${P}`,
    body: `The comparison going around: Google was profitable before its IPO, had a monopoly, and still only listed at **$23 billion**. Anthropic has filed at **$965 billion** — **42 times Google's price** — has never been consistently profitable, and competes with OpenAI, Google, DeepSeek and a dozen free alternatives.

The filing is real. The $965 billion is real. The 42x is arithmetic that does not mean what it is being used to mean.

## First, what was actually filed

Anthropic **confidentially submitted a draft S-1** to the SEC on **1 June 2026**. Target: a **Nasdaq listing as early as October 2026**, with Goldman Sachs, JPMorgan and Morgan Stanley leading an offering expected to raise **more than $60 billion**.

A confidential draft has **no share count and no price range**. It is the standard mechanism for beginning SEC review privately before any roadshow.

So **$965 billion is not an IPO valuation.** It is the **post-money from a $65 billion Series H** — a private round. What Anthropic actually lists at is unknown, and the gap between a last private mark and an IPO price has gone both directions plenty of times.

Saying a company "filed for IPO at $965 billion" describes something that has not happened yet.

## The number the comparison leaves out

Anthropic's **run-rate revenue reached $47 billion** in late May 2026, up from **$9 billion** at the end of 2025 — driven by enterprise adoption and Claude Code.

Now redo the comparison properly.

| | Google, Aug 2004 | Anthropic, June 2026 |
| --- | --- | --- |
| Valuation | $23bn | $965bn (private) |
| Revenue | $962m (2003) | **$47bn run rate** |
| **Price / sales** | **~24×** | **~20.5×** |

On the multiple — the only comparison that survives twenty-two years of inflation, market growth and index levels — **Anthropic's private mark is cheaper than Google's IPO was.**

That is not a defence of the valuation. It is a statement that the 42x figure compares two absolute dollar amounts from different decades and tells you nothing. By the same method, Google's $23bn IPO was "23 times" Netscape's 1995 listing.

## Where the viral version is right

Three things stand up, and one is the important one.

**"Never been consistently profitable."** We could not source Anthropic's profitability either way, and nothing in the reporting we read establishes it. Google, by contrast, had been profitable since **2001** — three years before its IPO, not two — and listed with a P/E of 80. A company with earnings and a company with a run rate are different propositions and it is fair to say so.

**The competition point is real.** Google in 2004 had a search monopoly. Anthropic competes with OpenAI, Google, DeepSeek and free alternatives, in a market where switching costs are an API key.

**Run rate is not revenue.** $47 billion is a recent period annualised, not money collected over twelve months. Trailing revenue is far lower, and a multiple built on a run rate flatters any fast-growing company. This is the strongest argument against the table above, and anyone quoting the 20.5× should quote this caveat with it.

## The OpenAI tender, and why it does not say what it is used to say

The claim: 600 OpenAI employees cashed out **$6.6 billion** before the IPO started — insiders selling before inviting you in.

The facts: **more than 600 current and former employees** sold roughly **$6.6 billion**, at a **$500 billion** valuation, in **October 2025**. About **75** hit the **$30 million** per-person cap; the remaining ~525 split the rest at an average near **$8.3 million**. OpenAI wrapped a further **$7 billion** share sale in **August 2026**.

Two problems with the reading.

**The timing is backwards.** That tender was in October 2025. OpenAI confidentially filed for its IPO in **June 2026** — eight months later. They did not sell ahead of a filing they knew about.

**They sold low.** The tender priced OpenAI at **$500 billion**. The company closed a **$122 billion round at an $852 billion post-money** in March 2026. Every employee who sold in that tender left roughly 70% on the table.

If insider selling is supposed to signal that people who know the company think it is overvalued, this is evidence of the opposite.

What a tender offer actually is: the mechanism a private company uses to give employees liquidity when there is no public market. Sales are capped, which is why 525 people averaged $8.3m rather than selling everything. That is compensation policy, not an exit.

## The Bank of America line is real, and worth keeping

**Michael Hartnett**, BofA's Chief Investment Strategist, characterised this IPO cycle as essentially a large-scale transfer of accumulated risk from early investors to the public market.

That framing is sound and does not depend on any of the numbers above being wrong. Three offerings — Anthropic, OpenAI, SpaceX — could exceed **$200 billion** combined. Whether public market liquidity absorbs that is a real question, and the people selling into it are the people who bought at $10 billion.

The reel's closing line is also correct: latecomers funding the exit is not a warning, it is how IPOs work. That is the most useful sentence in it.

## What is not established

- **Anthropic's profitability.** Not sourced either way.
- **The actual IPO price.** No share count, no range, confidential draft.
- **Google's 2003 revenue.** We used **$962 million**, the figure attached to its $105 million net income. Other sources give **$1.466 billion** for 2003 — the difference is most likely gross revenue versus revenue net of traffic acquisition costs. On the higher figure Google's multiple is ~16×, which would put it *below* Anthropic's. The direction of the correction changes; the point that 42× is meaningless does not.
- **Trailing revenue for Anthropic.** Only the run rate is public.
- **Whether October 2026 holds.** A confidential filing is not a timetable.

## The honest summary

A confidential draft was filed. The $965 billion is a private round's post-money, not a listing price. On revenue multiple the mark is in the same territory as Google's IPO and possibly below it.

What is genuinely different is that Google arrived with three years of profits and a monopoly, and Anthropic arrives with a run rate that quintupled in five months and four serious competitors. That is a real distinction, and it does not need a 42× headline to make it.`,
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
