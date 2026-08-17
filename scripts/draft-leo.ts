/**
 * Amazon Leo vs Starlink — the viral scoreboard, checked.
 *
 * Note on style: inline code spans inside these template literals close the
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
    slug: "amazon-leo-starlink-fcc-waiver-new-glenn-explosion",
    title:
      "Amazon does not have zero satellites in orbit — it has about 337, and the deadline it was going to miss has already been waived",
    excerpt:
      "New Glenn did explode, on the pad, destroying 49 Leo satellites' ride and Blue Origin's only operational launch complex. But the FCC did not hold the line it was supposed to, and Amazon is buying launches from SpaceX.",
    categorySlug: "world",
    tags: [
      "space",
      "amazon",
      "spacex",
      "fcc",
      "infrastructure",
      "regulation",
    ],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1785112927376-df14ff97ea4f${P}`,
    body: `The scoreboard doing the rounds: Amazon has burned **$10 billion+** on Project Leo, Musk has **7,000+** satellites up and Mars on the roadmap, and Bezos has **zero satellites in orbit**, one launch pad which is now destroyed, and an FCC deadline of **3,236 satellites by 2029 or lose the licence**.

The explosion is real and it is worse than the summary suggests. Three of the other numbers are wrong, and the one that is most wrong is the one that makes the whole thing land.

## "Zero satellites in orbit" is false

Amazon Leo — renamed from Project Kuiper — has been launching production satellites since April 2025.

| When | In orbit |
| --- | --- |
| Late April 2026 | **231** production satellites, 11 launches |
| August 2026 | **337+** production satellites, 12 missions |

Not zero. Not close to zero.

What is true, and is the actual problem, is that 337 against a required 1,618 is roughly **21% of the halfway milestone** — with the milestone date already passed. That is a real failure and it does not need to be exaggerated into "zero."

## The explosion, accurately

**28 May 2026**, around **9 p.m. EDT**. New Glenn erupted in a fireball at **Launch Complex 36**, Cape Canaveral.

It was not a launch. It was a **hotfire static test**, intended to clear the path for New Glenn's fourth flight — which was carrying **49 Amazon Leo satellites**.

The damage:

- The vehicle destroyed
- **LC-36 severely damaged** — Blue Origin's only operational New Glenn launch site
- The **lightning tower** and the **transporter-erector** destroyed
- Damage visible from orbit in commercial satellite imagery
- **No injuries**

"One launch pad, which is now destroyed" is close enough to be fair, with one correction worth making: Blue Origin has **started rebuilding** it, says it will look substantially different, and has stated it aims to fly New Glenn again by the end of the year.

Whether that schedule holds is a separate question. But "destroyed and that is the end of it" is not the position.

## The FCC deadline is the part that inverts the story

The reel gives one deadline: 3,236 satellites by 2029. That is real — 30 July 2029, under the licence granted in July 2020.

It omits the one that mattered.

The same licence required **1,618 satellites — half the constellation — by 30 July 2026.** That was the binding near-term milestone, and Amazon was never going to hit it.

In **January 2026**, Amazon asked the FCC for a **two-year extension**, citing limited availability of commercial launch opportunities.

**The FCC did not grant the extension. It issued a conditional waiver** — freeing Amazon from the 30 July requirement without moving the date for everyone.

So the framing "an FCC deadline that says put them up or lose the licence" describes a jeopardy that the regulator has already relieved. The interesting question is not whether Amazon loses its licence in 2029. It is that the milestone system designed to stop spectrum warehousing bent the first time a company with Amazon's resources leaned on it.

That is a more consequential story than the explosion, and nobody is telling it.

## And Starlink is much further ahead than "7,000+"

| | |
| --- | --- |
| Active Starlink satellites (Aug 2026) | **~10,764** |
| Earlier 2026 count | 10,087 active, 11,612 launched in total |
| FCC-approved constellation | **15,000** after a further 7,500 Gen2 approved on 9 January 2026 |
| Filed for | up to 42,000 |

Counting methods differ — some count every satellite ever launched, some everything still in orbit, some only active ones — so treat any single figure as approximate. But the gap is not 7,000 to 0. It is roughly **10,700 to 337**, which is a factor of thirty.

## The detail that says the most

Amazon's January request to the FCC came alongside it **buying more launches from SpaceX**.

Bezos's satellite constellation is partly reaching orbit on Musk's rockets, because Blue Origin cannot fly them fast enough. That is the single most informative fact in this story and it is in none of the viral versions.

## Why this belongs in an infrastructure feed

Low-earth-orbit broadband has quietly become critical infrastructure. It carries connectivity for maritime and aviation, rural networks, disaster response and, increasingly, military communications.

A market where one operator holds roughly thirty times the on-orbit capacity of its nearest competitor is a concentration risk in the same category as a single cloud region or a single certificate authority. We have written about [what happens when a supplier everyone depends on gets breached](/article/apple-openai-trade-secrets-tata-leak-siri-gemini) and about [attackers reaching a power plant through infrastructure nobody owned](/article/polish-chp-plant-private-apn-wago-turbine-shutdown). The pattern is the same: the dependency is invisible until it fails.

Amazon Leo mattering is not about Bezos versus Musk. It is about whether there is a second option.

## What is not established

- **The $10 billion.** The widely reported figure is Amazon's committed investment in the programme. Whether it has been *spent*, and how much of it went up in the LC-36 fire, is not something we could source.
- **The cause of the explosion.** Under investigation at the time of the reporting we read.
- **Whether the end-of-year return-to-flight target holds.** It is Blue Origin's own statement.
- **The conditions attached to the FCC waiver.** The waiver is described as conditional; we did not obtain the conditions themselves.
- **Current satellite counts.** These move weekly and the sources disagree by method. Every figure here is dated.

## The honest scoreboard

Amazon is roughly a fifth of the way to a milestone it has already missed, lost 49 satellites and its only operational pad in one night, is buying rides from its main competitor, and has been let off the deadline that was supposed to force the issue.

That is a bad position. It is not zero satellites, and the regulator is not about to take the licence away — which, depending on what you think spectrum milestones are for, is either sensible flexibility or the whole point being quietly abandoned.`,
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
