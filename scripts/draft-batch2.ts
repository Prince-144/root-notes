/**
 * One-off: two more researched drafts — Startups and Gadgets.
 */
import { getPayload } from "payload";
import config from "@payload-config";

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  tags: string[];
  readingMinutes: number;
  coverImageUrl: string;
  body: string;
};

const DRAFTS: Draft[] = [
  {
    slug: "cybersecurity-funding-h1-2026-concentration",
    title: "Security startups raised $10.6bn in six months — and the deal count is what should worry founders",
    excerpt:
      "H1 2026 funding held up. Q2 didn't: $4.4bn, down around 30% on both Q1 and the year before, with round counts falling too. The total survived because eight companies took $100m or more.",
    categorySlug: "startups",
    tags: ["cybersecurity", "vc", "startup-funding", "market-data", "founders", "ai-security"],
    readingMinutes: 5,
    coverImageUrl:
      "https://images.unsplash.com/photo-1680992046626-418f7e910589?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `Cybersecurity and privacy startups raised **$10.6 billion** in the first half of 2026, which [Crunchbase News](https://news.crunchbase.com/cybersecurity/solid-startup-venture-funding-growth-h1-2026/) describes as roughly in line with recent comparable periods. Read only that line and the market looks stable.

The quarterly split tells a different story. Q2 brought in **$4.4 billion** — down about **30%** on Q1, and down about 30% on Q2 2025. Round counts fell by a similar margin.

A half-year total that holds while the second quarter drops 30% means the first quarter was carrying it. And the reason Q2 didn't fall further is that **eight rounds of $100 million or more** landed inside it.

## Where the money actually went

| Company | Raised | Valuation |
| --- | --- | --- |
| Cyera | $600m | $12bn |
| NinjaOne | $400m+ (Series C extension) | $12.3bn |
| Dream | $260m | $3bn |

More recently, consumer privacy and security platform **Cloaked** took a **$375 million Series B**, and **Tenex.AI**, selling AI-driven security services, raised a **$250 million Series B**.

Note what those have in common. They are late-stage cheques into companies that already have distribution, or into the specific intersection of security and AI. None of them is evidence that it got easier to raise a first round.

## The number founders should read

Total capital is the wrong metric if you are the one fundraising. You cannot access a market total — you access a cheque, and cheques come from deals.

Deal count falling roughly in line with dollars, while eight companies absorb nine figures each, describes a barbell: a small number of very large rounds at the top, and a thinner, harder market underneath. The average conceals both ends.

This is also why "cybersecurity funding is at historically high levels" and "it is harder to raise than last year" can both be true at once, and usually are.

## The AI comparison is the context

Crunchbase's read is that the Q2 dip is moderate rather than alarming — a decline against unusually strong prior quarters, not a warning sign.

The more structural point in the same analysis is that security is no longer where investor attention concentrates. AI is. That matters less for the capital available and more for the terms and the pace: sectors that aren't the current thesis get diligenced longer and priced harder.

Which is roughly what the Tenex.AI round suggests founders have noticed — the security companies raising largest are the ones that can credibly describe themselves as AI companies.

## If you're raising into this

- **Model on deal count, not sector totals.** The headline number includes rounds you were never eligible for.
- **Assume a longer process.** Fewer deals at similar dollars means more time per deal, not less.
- **Be precise about the AI claim.** "AI-powered" is now a filter both ways: absent, you look dated; overstated, you get tested on it in diligence.
- **Late-stage strength is not early-stage weather.** A $600m round at a $12bn valuation says something about Cyera. It says nothing about the market for your seed.

The money is still in the sector. It is just arriving in fewer, larger pieces, which is a different market to raise into even when the annual chart looks flat.`,
  },
  {
    slug: "eu-right-to-repair-deadline-battery-2027-repairability-grades",
    title: "The EU's repair deadline passed on 31 July — and the harder rule lands in February 2027",
    excerpt:
      "Member states had until the end of July to implement the Right to Repair directive. The bigger change comes in 2027, when phones, tablets, earbuds and laptops sold in the EU must let users swap the battery with ordinary tools.",
    categorySlug: "gadgets",
    tags: ["right-to-repair", "regulation", "europe", "smartphones", "laptops", "hardware", "compliance"],
    readingMinutes: 5,
    coverImageUrl:
      "https://images.unsplash.com/photo-1550041473-d296a3a8a18a?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `Two deadlines are worth separating, because coverage keeps merging them.

The first has passed. EU member states had until **31 July 2026** to implement the Right to Repair directive, which covers phones, tablets and household goods. It obliges manufacturers to make spare parts available and forbids design and contract techniques that obstruct repair.

The second is the one with teeth. From **18 February 2027**, any smartphone, tablet, wireless earbud or laptop sold in the EU must let a user replace the battery using **commonly available tools** — no solvents, no heat gun, no proprietary kit.

That second sentence is a hardware requirement, not a paperwork one. It cannot be satisfied with a support page.

## Why the battery rule is the difficult one

Making parts purchasable is a supply chain problem. Making a battery user-swappable without heat or solvents is a mechanical design problem, and it collides with a decade of industrial direction: thinner devices, adhesive-bonded assemblies, water ingress ratings achieved by sealing everything.

A device designed today ships into that deadline. The engineering decisions that determine compliance are being made now, not in 2027.

## Where manufacturers currently stand

PIRG's *Failing the Fix 2026* scorecard grades manufacturers on how easily devices open, whether parts and documentation are available, and where companies stand on repair policy. The phone grades:

| Maker | Grade |
| --- | --- |
| Motorola | **B+** |
| Google | C− |
| Samsung | D |
| Apple | **D−** |

On laptops the spread is tighter and the floor is higher — HP moved up to a B− this year — but **Apple again finishes last, at C−**.

The gap between Motorola and Apple on phones is not a rounding difference. It is roughly the distance between a device built to be opened and one built not to be.

## This is not only a European rule

The EU is not the largest smartphone market, but it is a market no major manufacturer will exit, and repairability is expensive to implement regionally. A separately engineered EU-only chassis costs more than one design that satisfies the strictest rule.

That is how the USB-C mandate played out: legislated in Europe, then shipped worldwide because maintaining two connector designs made no sense. The same logic points the same way here.

## What to watch

- **Devices launching through 2026.** Battery removal difficulty on this year's models is the clearest signal of who is engineering toward February 2027 and who is planning to argue about it.
- **The gap between policy and product.** Several manufacturers publicly support repair while scoring poorly on how their hardware actually opens. The scorecard measures the second.
- **Whether prices move.** Repairable design carries a bill of materials cost, and it arrives in the same window as [the memory shortage](/article/memory-shortage-2026-device-prices-ram) already pushing device prices up.

For buyers, the practical read is simple: a device bought now will likely be less repairable than the equivalent sold in two years — and the battery in it is the part most likely to fail first.`,
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
