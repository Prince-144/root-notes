/**
 * Drafts the 10 September piece on the iPhone price increase.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-67.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-67.ts --update
 *
 * The two findings worth the article:
 *
 *   1. Apple raised the price of phones it had already been selling. iPhone 17
 *      did not change on 9 September and now costs more than it did at launch
 *      a year ago; iPhone 16 is back at its 2024 launch price, its 2025
 *      discount withdrawn. Old models get cheaper when a generation lands, so
 *      a rise on unchanged hardware can only be about inputs.
 *   2. The storage ladder steepened only at the top. 512GB to 1TB went from
 *      +200 to +400, and 1TB to 2TB from +400 to +600, while the first step
 *      stayed at +200. Non-memory costs do not scale with capacity, so the
 *      curve separates the NAND signal from everything else in the bill.
 *
 * Prices verified on Apple's own store today; the iPhone 17 Pro baseline is
 * from Apple's September 2025 newsroom release. BOM figures are TechInsights
 * estimates and are labelled as such throughout.
 *
 * Cover: the 18 Pro colour lineup, checked at full size and through the
 * 1600x900 centre crop the article header actually applies.
 *
 * No backticks and no angle brackets in the body.
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

const NEWSROOM = "https://www.apple.com/newsroom/images/2026/09";
const UPDATE = process.argv.includes("--update");

const drafts: Draft[] = [
  {
    slug: "every-iphone-went-up-100-dollars-including-the-ones-that-did-not-change",
    title: "Every iPhone went up 100 dollars, including the ones that did not change",
    excerpt:
      "The iPhone 17 is the same phone it was on 8 September and it now costs more than it did at launch. Old models get cheaper when a new generation lands, not dearer — and Apple's own storage ladder, which steepened only at the top, says exactly which component did this.",
    categorySlug: "gadgets",
    tags: ["apple", "iphone", "pricing", "memory-shortage", "nand", "dram", "supply-chain", "ai-buildout"],
    readingMinutes: 10,
    coverImageUrl: `${NEWSROOM}/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/article/Apple-iPhone-18-Pro-color-lineup-260909_big.jpg.large_2x.jpg`,
    body: `On **9 September 2026** Apple raised the price of every iPhone it sells by **100 dollars**.

Not the new ones. Every one.

| Model | 8 September | 9 September |
|---|---|---|
| iPhone 17e | 599 | 699 |
| iPhone 16 | 699 | 799 |
| iPhone 17 | 799 | 899 |
| iPhone Air | 999 | 1,099 |
| iPhone 17 Pro to 18 Pro | 1,099 | 1,199 |
| iPhone 17 Pro Max to 18 Pro Max | 1,199 | 1,299 |

The last two rows are a generational comparison, and a new phone costing more than last year's is ordinary. The first four are not that. Those are the prices of phones that already existed, and they went up overnight.

## Apple raised the price of phones it had already built

The **iPhone 17** did not change on 9 September 2026. Same chip, same cameras, same display, same box. It is the identical product it was the day before, and it costs 100 dollars more — which puts it **above the price it launched at** twelve months earlier.

The **iPhone 16** got there by a slightly different route, and the distinction is worth keeping. It launched at 799 dollars in September 2024, was cut to 699 when the iPhone 17 arrived a year later, and is now back at 799. Apple did not push it past its original price. It withdrew the discount.

Either way the direction is wrong. When a new generation lands the previous generation gets **cheaper** — that is the entire mechanism by which last year's flagship becomes this year's mid-range, and it has been the shape of every Apple launch for well over a decade. Old stock is discounted to clear it and to fill the ladder underneath the new thing.

Here the ladder moved up underneath the new thing instead, and at least one model went past where it started.

This is why those rows matter more than the Pro ones. A new phone costing more can always be explained by what is new inside it, and there is plenty new inside an 18 Pro. An old phone costing more cannot be explained that way at all. The product did not move, so the price is saying something about the inputs and nothing about the product.

## The storage ladder says which input

A flat 100 dollars across the whole range tells you something got more expensive in every phone. It does not tell you what.

Apple's storage tiers do. Here is the same phone's upgrade ladder, one year apart:

| Step | iPhone 17 Pro Max | iPhone 18 Pro Max |
|---|---|---|
| 256GB to 512GB | +200 | +200 |
| 512GB to 1TB | +200 | +400 |
| 1TB to 2TB | +400 | +600 |

The first step did not move. The second doubled. The third went up by half.

That shape is diagnostic. A tariff applies to the whole phone. A more expensive processor applies to the whole phone. Assembly, glass, titanium, the display, the modem — none of them scale with how much storage you ordered. Only the storage does.

So the flat 100 dollars is the part that sits in every unit, and the extra 200 or 400 dollars at the top of the ladder is the part that scales with capacity. Read together, Apple's price list is a fairly precise instrument for measuring what happened to memory.

The full picture at the top end: a **2TB iPhone 18 Pro Max is 2,499 dollars**, against 1,999 for the same capacity last year. That is a **500 dollar** increase on one configuration. The 18 Pro gained a 2TB tier it did not have before, at 2,399.

## What the memory actually costs now

TechInsights, which takes these phones apart and prices the parts, puts numbers on it. These are estimates from outside Apple, not Apple's figures, and should be read that way.

| Component | iPhone 17 Pro | iPhone 18 Pro |
|---|---|---|
| 256GB NAND flash | about 13 | about 51 |
| 12GB LPDDR5X RAM | about 39 | about 145 |

Roughly **52 dollars of memory and storage became roughly 196**. The same firm has memory going from about **9 percent** of the bill of materials to about **27 percent**, with the total build cost up somewhere near 38 percent.

Set that against the retail move. The parts went up around 144 dollars. The entry price went up 100. On the base configuration Apple appears to be absorbing part of it and recovering the rest further up the ladder, where the capacity — and therefore the NAND content — is highest.

Apple does not publish RAM figures, so the 12GB is TechInsights' reading of the hardware rather than a specification.

## Nobody outbid you, because you were never in the room

The cause is not a shortage in the ordinary sense. Nothing broke.

Memory makers — Samsung, SK Hynix, Micron — moved manufacturing capacity toward **high-bandwidth memory** for AI accelerators, because that is where the margin went. Reporting through 2026 puts AI datacentres at roughly **70 percent** of high-end DRAM consumption, and DRAM spot prices up several hundred percent year on year. Contract prices were still climbing by double digits quarter on quarter in the third quarter of 2026.

Consumer DRAM and NAND did not get harder to make. They got outbid, by a customer that buys in volumes a phone maker cannot match and passes the cost to a business model that tolerates it.

[The datacentre capacity numbers we looked at earlier this month](/article/china-3x-capacity-2x-electricity-which-number-runs-a-datacentre) are the supply side of this. The 100 dollars on an iPhone 16 is the demand side arriving at a till.

## Apple said so, on the way out

This is the unusual part: Apple named the cause itself, before the increase.

On his final earnings call as chief executive on **30 July 2026** — the transition [we covered at the start of the month](/article/tim-cook-executive-chairman-encryption-succession-uk-tribunal) — **Tim Cook** described the situation as **"a 100-year flood on the memory pricing"**, and told the Wall Street Journal: **"This is a hundred-year flood. I've never seen anything like it in any area in over 40 years."**

Apple had already raised **Mac and iPad** prices in **June 2026** for the same reason. The iPhone was the third wave, not the first, and the company had flagged margin pressure before it touched the phone.

## What this means if you are buying

- **Buying an older model to save money works less well than it used to.** The usual strategy of taking last year's phone at a discount has been partly closed off, because last year's phone went up too.
- **The storage decision is where the money now is.** Going from 512GB to 1TB on a Pro Max costs 400 dollars, double what the same step cost a year ago. If you can live in the cloud, this is the year to.
- **Do not read the 100 dollars as the whole increase.** At 2TB it is 500.
- **Expect this to persist.** Memory makers have guided to tight supply well beyond 2026, and capacity aimed at AI does not come back quickly.

## What is not established

- **How much of the increase is memory and how much is tariffs.** Both are real; nobody has published a split, and Apple has not broken it out.
- **The bill-of-materials figures.** TechInsights estimates, not Apple's numbers, and teardown pricing is inherently approximate.
- **Whether Apple holds these prices** if memory eases, or whether they become the new base.
- **How much margin Apple is absorbing** on any given configuration.
- **Whether the entry-level 100 dollars covers the DRAM increase** or is itself partly subsidised by the high-capacity tiers.`,
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
