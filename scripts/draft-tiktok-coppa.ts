/**
 * Draft — the TikTok COPPA settlement, read against the 2019 one.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Sourcing note: the 2019 figures come from the FTC's own press release and
 * business-guidance post, not from this year's coverage. The conditional
 * $100m is described as a structure, and the piece states plainly that it
 * cannot establish what, if anything, replaces the vacated decree.
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
    slug: "tiktok-400-million-coppa-settlement-vacating-musically-decree",
    title:
      "The same law cost TikTok $5.7 million in 2019 — this time it is $400 million, and the last $100 million is conditional",
    excerpt:
      "The DoJ and FTC sued TikTok and ByteDance in August 2024 over children's privacy. The settlement is $300 million now and $100 million more once a court vacates the consent decree entered against Musical.ly, TikTok's predecessor — the order from the 2019 case that was supposed to stop this happening again.",
    categorySlug: "world",
    tags: [
      "tiktok",
      "coppa",
      "privacy",
      "regulation",
      "children",
      "enforcement",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1627397159237-d2acb7f500af${P}`,
    body: `In **August 2024** the **Department of Justice** and the **Federal Trade Commission** sued **TikTok** and its parent **ByteDance**, alleging what the complaint called massive-scale invasions of children's privacy.

The case has settled for **$400 million**. The DoJ describes it as one of the largest recoveries ever under **COPPA**, the Children's Online Privacy Protection Act.

## What was alleged

Three things, and the third is the one that tends to get skipped:

- TikTok knowingly allowed children under **13** to create accounts
- It harvested their data through **Kids Mode**, the version of the app built for younger users
- It **failed to honour parental deletion requests**

COPPA's core requirement is verifiable parental consent before collecting personal information from a child under 13. The deletion failure is a separate obligation and arguably the more revealing allegation: a parent who found out, asked, and was ignored.

## The payment has two parts

**$300 million** is due immediately.

The remaining **$100 million** is due, in the DoJ's words, upon entry of an order vacating a prior consent decree entered against **Musical.ly** — the app that became TikTok.

Read that twice. A quarter of the settlement is contingent on a court removing the order from the *last* time this happened.

## What the 2019 order was

On **27 February 2019**, the operators of Musical.ly agreed to pay **$5.7 million** to settle FTC allegations that they had illegally collected children's personal information. It was, at the time, the largest civil penalty the Commission had ever obtained in a children's privacy case. The Commission voted **5-0**.

The FTC's complaint said Musical.ly knew a significant percentage of its users were under 13, and had received **thousands** of complaints from parents whose children had created accounts.

Beyond the money, the settlement required the operators to comply with COPPA going forward and to take **offline every video made by a child under 13**.

## The number that frames everything

**$5.7 million** in 2019. **$400 million** in 2026. Roughly **70 times** larger, for the same statute and, on the face of the allegations, substantially the same conduct.

Two honest readings of that, and both are worth holding.

The generous one is that enforcement has grown teeth. A penalty that was a rounding error against ByteDance's revenue in 2019 is now large enough to appear in a board paper, and regulators learned that the earlier figure did not change behaviour.

The uncomfortable one is arithmetic. If a company earns more from the conduct than the penalty costs, the penalty is a licence fee. Nobody outside the company can say which side of that line **$400 million** falls on, because the revenue attributable to under-13 users has never been published.

## The conditional $100 million

A consent decree is not a fine. It is ongoing court supervision — a set of obligations a company agrees to operate under, enforceable by contempt if broken.

So the structure here is: settle the new case, and pay an additional **$100 million** to have the supervision from the old one lifted.

That may be entirely routine. Vacating a superseded decree is normal housekeeping when a newer order covers the same ground, and it would be unfair to assume otherwise. **What we cannot establish from the announcement is what replaces it** — whether the new settlement carries comparable obligations, for how long, and who audits them. That is the question worth asking of the filed documents when they are available, and it matters more than the headline figure.

What is established is that the 2019 decree required COPPA compliance going forward, and that the 2024 complaint alleges conduct after it.

## TikTok is not admitting anything

TikTok did not admit fault. Its position is that many of the allegations concern past events and practices that were either factually inaccurate or have since been addressed, and it points to strengthened age controls, safeguards for younger users, and improved parental oversight.

Settling without admission is standard and it is not evidence of anything either way. It does mean no court has found facts here, which is worth remembering when the figure gets quoted as a finding.

Associate Attorney General **Stanley E. Woodward Jr.** called the settlement a major victory for American children and parents.

## Why this matters outside the United States

Because the same argument is arriving everywhere, and the enforcement question is always the same one.

COPPA is nearly thirty years old and its central mechanism — consent before collection, for a defined class of person — is the mechanism every newer privacy law reaches for. India's [DPDP Act obligations arrive in November 2026](/article/india-dpdp-enforcement-timeline-november-2026) with children's data treated as a distinct category. The EU has spent the year testing whether a large fine changes conduct, most visibly in [the €890 million DMA penalty against Google](/article/google-dma-fine-890-million-search-play-steering).

The US case is the longest-running natural experiment available: the same company, the same statute, seven years apart. The first penalty did not stop it. Whether the second does is the only question that matters, and the answer will not be visible for years.

## What is not established

- **What obligations replace the vacated decree.** The announcement does not say.
- **Whether the conduct alleged in 2024 continued after 2019 in the way the complaint implies.** Alleged, not adjudicated — the case settled.
- **How much revenue was involved.** No figure has been published, which is what makes "is the fine large enough" unanswerable.
- **Whether the remediation works.** TikTok describes the measures; no independent audit has been reported.`,
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
