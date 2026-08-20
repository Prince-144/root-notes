/**
 * Draft — the story of how India got a credit bureau.
 *
 * Not a cyber piece. It sits with the Zomato and Paytm explainers: a widely
 * repeated subject where the interesting facts are the dates nobody quotes.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Sourcing note: the scoring weightings that circulate everywhere are not
 * published by TransUnion CIBIL, which treats the model as proprietary. They
 * are attributed here as widely reported rather than stated as the company's
 * own figures.
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
    slug: "cibil-score-story-banks-saw-it-four-years-before-you-could",
    title:
      "Banks could see your CIBIL score four years before you were allowed to — and then it cost ₹550 to look",
    excerpt:
      "India had no credit bureau until 2000, and the one it got was built to fix the banks' bad-loan problem, not to help you. The score reached lenders in 2007. Consumers were let in during 2011. It took a 2016 announcement by Raghuram Rajan before looking at your own record stopped costing money.",
    categorySlug: "world",
    tags: [
      "india",
      "finance",
      "credit-scoring",
      "rbi",
      "regulation",
      "consumer-rights",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1729077537326-91749c1c9197${P}`,
    body: `A three-digit number decides whether you get a home loan, and what you pay for it. Most explainers tell you how to raise it. Almost none tell you where it came from, and the history is the part that explains why the system behaves the way it does.

The short version: the score was built for the banks, and it took **11 years** before an ordinary person could see their own for free.

## Before 2000 there was nothing

India had no credit bureau. Lenders shared information through the **Reserve Bank of India**, and beyond that a bank simply asked other banks for a reference on the borrower in front of it.

A UK bureau looked at entering the market in **1990** and the conclusion at the time was that India did not need one — the technology was not there.

What changed the answer was not consumer demand. It was **non-performing assets**. Banks were carrying bad loans they could not have priced properly, because nobody could see whether a borrower was already over-extended somewhere else. The RBI set up the **Siddiqui Committee** to look at forming a credit information bureau, and its recommendations produced one.

## 2000: CIBIL exists, and it is not for you

**Credit Information Bureau (India) Limited** was founded in **August 2000**.

Read the original purpose plainly. It was infrastructure for lenders, created on a banking regulator's recommendation to reduce bad debt. A borrower's ability to inspect their own file was not the problem it was built to solve. Everything that came later — free reports, dispute rights — was added to a system already running.

## 2005: the law catches up

The **Credit Information Companies (Regulation) Act** — **CICRA** — was passed in **2005**.

That mattered more than it sounds. Until there was a statute, a bank handing your repayment record to a private company sat in an awkward legal space. CICRA licensed bureaus, set the rules for who may share and receive credit information, and put the whole arrangement on a legal footing.

It is also the ancestor of the argument India is having right now. CICRA regulated one specific category of sensitive data twenty years before the [DPDP Act's broader obligations arrive in November 2026](/article/india-dpdp-enforcement-timeline-november-2026).

## 2007 and 2011: the four-year gap

The **CIBIL Score** was introduced in **2007** as a generic risk model — for banks and financial institutions.

Individual consumers could first obtain their own score in **2011**.

So for **4 years** there existed a number, derived from your own behaviour, that determined whether you were lent money and on what terms, and you had no way to see it. Not a secret exactly. Just not addressed to you.

## 2016: it stops costing money to look

Even after 2011, seeing your own record was a purchase. A report with a one-time score came to about **₹550**.

In **July 2016**, RBI Governor **Raghuram Rajan** announced that credit bureaus would provide one free credit report a year, so people could check their standing and raise a dispute if something was wrong. It was in place by the end of that year.

That is the moment the thing became a consumer instrument rather than purely a lender's tool. **One** free full report per calendar year is still the entitlement — and the dispute right is the part most people never use, despite an error in your file costing you real money on every rate you are offered.

## You do not have one score

The most common misunderstanding, and it survives because "CIBIL score" is used the way "Xerox" is used for photocopying.

India has **4** licensed credit information companies: **TransUnion CIBIL**, **Experian**, **Equifax** and **CRIF High Mark**. Each holds its own file on you and produces its own score. A lender may pull any of them, and the numbers will not match — different members report to different bureaus at different times.

CIBIL itself is no longer purely Indian either. **TransUnion**, the American bureau, is now the controlling shareholder, and the company operates as TransUnion CIBIL.

## What the number is made of

The weightings quoted everywhere are: payment history around **30%**, credit utilisation **25%**, length of credit history **25%**, credit mix **10%**, and new enquiries **10%**.

Treat those as widely reported rather than official. TransUnion CIBIL does not publish the model — it is proprietary, which is itself a fact worth noticing about a number you are judged by.

What is not in dispute is the direction of the largest factor. Paying on time, every time, is the single biggest lever, which is why the standard advice is boring and correct. **700 to 750** is generally treated as good and above **750** as excellent, on a scale running **300 to 900**.

## The myth worth killing

**Checking your own score does not lower it.**

When you look at your own record it is recorded as a **soft enquiry** and has no effect on the score. What counts against you is a **hard enquiry** — a lender pulling your file because you applied for credit — and several of those in a short window suggest someone shopping desperately for a loan.

The practical consequence is the opposite of what the myth implies. Because errors happen and disputes take time, the incentive is to check *more* often, not less.

## Why any of this matters beyond your own loan

Because the same question is being asked of every scoring system now being built.

A credit score is an early example of a number generated about you, by a private company, from records you did not submit, using a method that is not published, which then decides what you are offered. India built one in 2000 and spent the following sixteen years retrofitting the parts that let the person being scored see the file and argue with it.

That retrofit is the pattern to watch as scoring spreads into hiring, insurance and lending-by-app. Visibility and the right to dispute came last, and only because a regulator said so.

## What is not established

- **The exact scoring weights.** The model is proprietary; the percentages above are the widely circulated figures, not a published breakdown.
- **How often files contain errors.** No regulator-published error rate for Indian credit files is available.
- **How many people use the free annual report.** Not published.
- **Whether ₹550 was uniform.** It is the figure reported for a report with a one-time score before the free entitlement; pricing varied by product.`,
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
