/**
 * Apple's three simultaneous crises — checked against the record.
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
    slug: "apple-openai-trade-secrets-tata-leak-siri-gemini",
    title:
      "Apple's lawsuit names two people, not 400 — and the iPhone 18 leak did not come from Apple",
    excerpt:
      "Three crises are being bundled into one story about a company cracking. The suit against OpenAI is real and names a Chief Hardware Officer. The 630GB of iPhone 18 Pro files came out of Tata Electronics. And Siri is not still broken — Apple bought a way out for about $1bn a year.",
    categorySlug: "security",
    tags: [
      "apple",
      "openai",
      "trade-secrets",
      "insider-risk",
      "supply-chain",
      "litigation",
    ],
    readingMinutes: 12,
    coverImageUrl: `https://images.unsplash.com/photo-1727079547627-836b0e391f21${P}`,
    body: `The framing going around is that Apple is failing on every front at once — the AI, the hardware, the talent, the leadership — and that the outside still shines while the inside cracks.

Three specific claims carry that argument. All three point at something real. Two of them are described wrongly, and the third has an ending that the framing leaves out.

## Claim one: "Apple is suing OpenAI, claiming 400+ engineers walked out with secrets"

The lawsuit is real. Apple filed on **10 July 2026** in the **US District Court for the Northern District of California**, alleging trade secret theft and breach of contract.

Apple's own language:

> At every level, from members of its Technical Staff to its Chief Hardware Officer, and in coordination with business partners, OpenAI has been stealing Apple's trade secrets and confidential information

**But the complaint names two people.**

**Tang Tan**, OpenAI's Chief Hardware Officer, who spent **24 years at Apple** as VP of product design for iPhone and Apple Watch. Apple alleges he used Apple's confidential project code names during recruiting, **asked job candidates to bring Apple hardware components to their interviews**, coached departing Apple employees on evading the company's security procedures, and asked for details about unannounced products.

**Chang Liu**, a senior systems electrical engineer for **eight years** at Apple who left for OpenAI in 2026. Apple alleges he failed to return an Apple-issued laptop, used it to download confidential technical documents, and shared Apple information with other job applicants.

We could not source the **400+** figure in any of the reporting we read, and TechCrunch's account states explicitly that no total number of ex-Apple employees is specified. If it exists it is probably a count of ex-Apple staff now at OpenAI — a normal figure for two large Californian technology companies — and not a count of people accused of anything.

That distinction is the whole difference between "a company had two bad leavers and a recruiting culture problem" and "four hundred people stole from Apple."

**What Apple is asking for tells you what this is about.** Not damages first — an order barring OpenAI from using or disclosing the trade secrets, requiring return of confidential materials, and preserving evidence. That is a suit aimed at stopping a product, and OpenAI is rumoured to be building a hardware device.

Context the framing omits: **Jony Ive's design startup io was acquired by OpenAI in 2025 for $6.5 billion**, and **Ive is not named in the complaint**. Apple also wrote to OpenAI in **February** raising concerns and says it received no response.

OpenAI's answer:

> We have no interest in other companies' trade secrets. We remain focused on building innovative technology that empowers people everywhere.

## Claim two: "The iPhone 18 leaked to the dark web before it even launched"

True. And **Apple was not breached.**

The files came out of **Tata Electronics**, the Indian contract manufacturer. A group called **World Leaks** claimed the breach on its leak site on **12 June**, posting **more than 200,000 files** totalling **over 630 GB**.

What was in it:

- Circuit board drawings for the **iPhone 18 Pro**
- The **A20 chip**
- **Supplier lists** tying hundreds of specific components — batteries, camera modules, mainboard chips — to their vendors
- **Drop-test photographs** from a Tata plant, dated early 2026, showing a slab-shaped grey handset with three rear cameras

Files carry confidential watermarks and internal codenames consistent with the iPhone 18 Pro generation. The phone is expected in **September 2026**.

This is a supply-chain breach, and calling it "Apple leaking" gets the lesson backwards. Apple's own security did not fail here. A supplier's did — and Apple's most sensitive pre-release data was sitting in that supplier's environment because it has to be, because someone has to manufacture the thing.

The supplier-list portion is arguably worse than the design leak. Designs become public in September anyway. A validated map of who makes which component for the next iPhone is a targeting list, and it stays useful for years.

We have written this story repeatedly with different names on it — [poisoned data fetched by WordPress plugins](/article/bdthemes-wordpress-json-poisoning-rogue-admins), [a publishing token that survived an incomplete rotation](/article/litellm-poisoned-releases-cloudsek-2500-organisations), [a worm publishing credentials to public repositories](/article/shai-hulud-2-npm-worm-secrets-outlive-the-cleanup). Your security posture is the weakest posture among everyone holding your data.

## Claim three: "Siri has been broken for two years"

Directionally fair, and it has an ending.

Personalised Siri was announced at **WWDC 2024**, delayed on **7 March 2025**, and slipped through 2025 into 2026. That is a genuine two-year failure to ship, and it was Apple's most visible product embarrassment in years.

Then Apple bought its way out.

On **12 January 2026**, Apple and Google announced a multi-year partnership making **Google's Gemini** the foundation for a rebuilt Siri and the next generation of Apple Intelligence — estimated by Bloomberg's Mark Gurman at roughly **$1 billion a year**, with a custom Gemini model running in **Apple's own data centres**.

At **WWDC 2026 on 8 June**, Apple announced a completely rebuilt assistant, rebranded **Siri AI**.

So Siri is not still broken. What happened is more interesting than that: **the company whose entire brand is that it controls its own stack conceded the foundation model layer to Google** — while keeping the inference on its own hardware, which is the part it actually cares about.

That is not a company cracking. That is a company deciding which fight it is not going to win, and paying to exit it. Whether it was the right call is a real question. It is a different question from the one the framing asks.

## What the security lesson actually is

For anyone running a security programme, the Apple v OpenAI complaint is the most useful document here, because the alleged failures are ordinary ones:

- **A laptop that was not returned.** Offboarding did not reclaim the device, and documents were downloaded from it after departure.
- **Documents downloadable in bulk** by a departing engineer, apparently without triggering anything.
- **Candidates asked to bring hardware components to interviews.** No technical control catches that. It is caught by people knowing it is a firing offence and being told so.
- **Departing staff coached on evading security procedures.** Which implies the procedures were known, documented, and predictable enough to route around.

None of that requires a nation-state or a zero-day. It is offboarding, DLP and culture — and this is Apple, which has among the most aggressive secrecy practices in the industry.

## What is not established

- **The 400 figure.** We could not source it. Treat it as unverified until someone produces it from the complaint.
- **Whether any of Apple's allegations are true.** This is a complaint. OpenAI denies it. Nothing has been tested.
- **What Apple knew when.** Apple says it wrote in February and got no response; we have not seen the letter.
- **Whether Tata has confirmed the breach**, or what its scope was beyond World Leaks' claims. As with any leak site, the volume figures are the criminals' own.
- **Whether the leaked drop-test images show the final design.** They are dated early 2026 and hardware changes late.

## The honest version

Three things went wrong at Apple in eighteen months: a flagship AI feature it could not ship, a supplier that lost 630 GB of unreleased product data, and a senior hardware team defecting to a competitor building a rival device.

That is a bad run and it is worth reporting as one. It is not four hundred people stealing secrets, it is not Apple being hacked, and the AI problem has an outcome — a billion dollars a year to Google, and an assistant that shipped.

The interesting story is smaller and more specific than "everything is cracking", which is usually how it goes.`,
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
