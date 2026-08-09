/**
 * One-off: saves the researched EU AI Act / Digital Omnibus piece as a draft.
 * Same shape the generator writes, so it reviews identically in the admin.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "eu-ai-act-high-risk-deadline-deferred-2027";

const BODY = `Plenty of coverage this month says the EU AI Act became fully enforceable on 2 August 2026. It didn't. The deadline that date referred to was moved six days before it arrived, and the obligations most companies were preparing for now land in December 2027.

The instrument that did it is [Regulation (EU) 2026/1744](https://www.nicfab.eu/en/posts/digital-omnibus-ai-official-journal/) — the Digital Omnibus on AI, the first set of amendments to the AI Act since it passed in 2024. Parliament adopted it on 16 June, the Council gave final approval on 29 June, it was signed on 8 July, published in the Official Journal on 24 July, and entered into force on 27 July.

That timing was not incidental. The institutions were racing to get it in force before 2 August precisely so the postponement would be law rather than an intention. Had they missed, the original deadline would have applied exactly as written.

## What actually moved

A new Article 113 resets the application dates for high-risk systems:

| Category | Was | Now |
| --- | --- | --- |
| Annex III standalone high-risk | 2 Aug 2026 | **2 Dec 2027** |
| Annex I high-risk embedded in regulated products | 2 Aug 2027 | **2 Aug 2028** |

Annex III is the list that catches most organisations that aren't building AI for a living: biometrics, employment and hiring, education, migration, and access to essential services. If you were told your recruitment screening tool needed a conformity assessment this summer, that is the deadline that just moved sixteen months.

## What is in force, and has been for a while

The deferral applies to the high-risk tier. It is not a pause on the AI Act, and reading it as one is the expensive mistake available here.

- **Prohibited practices** have been enforceable since **2 February 2025** — social scoring, manipulative systems, untargeted facial-image scraping, most real-time remote biometric identification in public.
- **General-purpose AI model obligations** have applied since **2 August 2025**, along with the governance and penalty machinery.
- **Article 50 transparency duties** stay broadly on the original schedule: telling people when they are dealing with an AI system, and labelling synthetic content. Systems already on the market got until **2 December 2026** for the watermarking requirement.

## The fines, stated properly

Penalty figures get quoted loosely, usually as a flat "€35 million or 7%". There are three tiers, and they attach to different failures:

| Breach | Cap |
| --- | --- |
| Prohibited AI practices | €35m or **7%** of worldwide annual turnover |
| High-risk and transparency obligations | €15m or **3%** |
| Supplying misleading information to authorities | €7.5m or **1%** |

Whichever is higher applies — except for SMEs and startups, where it is whichever is **lower**. Quoting the 7% ceiling against a transparency slip overstates the exposure by more than double.

## Why this reaches past Europe

The AI Act binds anyone placing a system on the EU market, which is why US and Chinese model providers have been building to it regardless of where they are based. When the compliance date for the high-risk tier moves, the de facto global specification for those systems moves with it.

The uncomfortable part is what a sixteen-month deferral says about readiness. The standards and conformity-assessment infrastructure the high-risk regime depends on were not going to be in place in time, and the deferral is an admission of that rather than a change of policy direction. The rules were not softened. The clock was.

## What to check

- **Confirm which tier you are in.** If your exposure is Annex III, you have until December 2027. If it is prohibitions, GPAI, or Article 50, your date has already passed.
- **Don't stand the programme down.** Sixteen months is roughly what a first conformity assessment takes once standards land, and the standards are the thing that slipped.
- **Watch what you read.** A deadline that moved days before it hit is exactly the kind of change that outruns the articles written about it.`;

const payload = await getPayload({ config });

const { docs: clash } = await payload.find({
  collection: "articles",
  where: { slug: { equals: SLUG } },
  limit: 1,
  depth: 0,
});

if (clash.length > 0) {
  console.log(`already exists: ${SLUG} (id ${clash[0].id}) — nothing written`);
  process.exit(0);
}

const created = await payload.create({
  collection: "articles",
  data: {
    title: "Europe's high-risk AI deadline was due on 2 August — it was postponed to 2027 six days earlier",
    slug: SLUG,
    excerpt:
      "Regulation (EU) 2026/1744 entered into force on 27 July, moving Annex III high-risk obligations to December 2027 and embedded systems to August 2028. Prohibitions, GPAI rules and transparency duties are unaffected — and already in force.",
    body: BODY,
    categorySlug: "world",
    tags: [
      "eu-ai-act",
      "regulation",
      "compliance",
      "europe",
      "ai-governance",
      "policy",
      "high-risk-ai",
    ],
    author: "Prince Baruwala",
    publishedAt: new Date().toISOString(),
    readingMinutes: 6,
    status: "draft",
    featured: false,
    views: 0,
    coverImageUrl:
      "https://images.unsplash.com/photo-1539796326180-5d8272550830?w=1600&h=900&fit=crop&crop=entropy&q=80",
  },
});

console.log(`drafted: ${SLUG} (id ${created.id}, ${BODY.split(/\s+/).length} words)`);
process.exit(0);
