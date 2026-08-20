/**
 * Draft — underwater data centres, and what the viral version misattributes.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Sourcing note: the 1/8th failure figure is Microsoft's own and is real. The
 * cause it is usually given — the ocean — is not the cause Microsoft gave,
 * which was the sealed dry-nitrogen atmosphere. That distinction is the piece.
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
    slug: "underwater-data-centres-nitrogen-not-ocean-natick-lingang",
    title:
      "The servers under the sea failed eight times less — and the reason was the nitrogen, not the ocean",
    excerpt:
      "Microsoft's Orkney experiment is real and the 1/8th failure rate is Microsoft's own figure. But the cause it gave was a sealed dry-nitrogen atmosphere with nobody walking around inside, which you can build on land. China's $226 million Shanghai project is also real, is running, and raises a question the viral version says nobody has studied. People have studied it.",
    categorySlug: "world",
    tags: [
      "data-centres",
      "infrastructure",
      "china",
      "microsoft",
      "energy",
      "environment",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1650531165149-d32f1c117780${P}`,
    body: `Underwater data centres are having a moment on social media, usually in a shape that runs: Microsoft proved it worked, gave up anyway, and China took the idea and built one.

Most of the specifics in that story are right. The most-quoted one is right about the number and wrong about the reason, and the reason is what decides whether any of this matters.

## What Microsoft actually did

**Project Natick** put a sealed cylinder called **Northern Isles** on the seabed off Scotland's **Orkney Islands** in spring **2018**, at **117 feet** — about 36 metres. It came back up in 2020.

One correction on the timeline that circulates: Natick began as a research effort around **2013**, but the Scotland deployment was 2018, and the first sea trial in **2015** was off **California**. The 2013 date and the Scotland location belong to different parts of the project.

## The 8x is real. The explanation usually attached to it is not.

Microsoft reported that the submerged servers failed at **one-eighth** the rate of equivalent servers in a conventional land data centre. That figure is Microsoft's own and it is not disputed.

The reason Microsoft gave was not the sea. It was the **sealed dry-nitrogen atmosphere** inside the tube — no oxygen to corrode components, no humidity, no dust, and nobody opening the rack to bump a cable.

That distinction is the whole story, because the nitrogen part does not need an ocean. A sealed, nitrogen-filled, unstaffed enclosure is buildable on dry land, and the results suggest most of the reliability gain would come with it. The water was solving cooling. The nitrogen was solving failure. Merging the two makes an argument for putting data centres in the sea out of evidence that mostly argues for sealing them.

## Why Microsoft stopped, in its own words

In **June 2024** Microsoft confirmed Natick was no longer active. **Noelle Walsh**, who runs its Cloud Operations and Innovation division, said she is not building subsea data centres anywhere in the world.

What she did **not** say is that maintaining hardware on the seabed proved impractical. Her stated position was that the team worked on it, that it worked, and that they learned about operating below sea level and about vibration effects on servers — learnings now applied elsewhere.

The viral version supplies a reason Microsoft did not give. A company declining to continue a research programme is not the same as a company reporting that the idea failed, and the difference matters if you are trying to work out whether the technology has a future.

## China's is real, running, and larger

The **Shanghai Lingang** undersea data centre entered operation in **May 2026**, roughly **10 km** off the Lingang coast. It was built by **Shanghai Hailanyun Technology** with a subsidiary of **China Communications Construction**.

The figures: about **$226 million** invested, **24 MW** of designed power capacity, around **2,000** servers, green electricity covering as much as **95%** of operations, no freshwater used, and land use cut by more than **90%** compared with an equivalent facility ashore. It is described as the first undersea data centre powered by offshore wind.

Those numbers hold up. Two framing notes: the depth figure of 35 metres that circulates is not something we could confirm from the operator's published material, and "China picked up the idea after Microsoft dropped it" implies a sequence that the timeline does not require — Chinese subsea data-centre work was under way before Microsoft's 2024 announcement.

## The claim that nobody has studied the heat

This is the part that is simply not true, and the accurate version is more interesting.

Research on thermal discharge from underwater data centres exists. Operating facilities report seawater temperature increases of **less than 1°C** in the surrounding water. Surveys following Natick's retrieval detected thermal microzones and changes in sediment biochemistry. There is peer-reviewed work on thermal architecture for these systems and a substantial literature on how thermal discharge alters coastal microbial communities generally.

What a **2025** life cycle assessment flagged as missing is not the study. It is the **regulatory framework**: there is no established regime governing subsea thermal discharge from data centres.

And the specific comparison in the viral claim — is the ocean heat worse than the carbon from land data centres — is not an unanswered question so much as a badly formed one. Localised thermal discharge into a bay and global greenhouse emissions are not measured in the same units and do not act on the same system. One is an ecosystem effect in a defined area. The other is a climate effect everywhere. Asking which is worse produces an argument, not a number, which is a fair guess at why nobody has published the comparison as posed.

## The number that actually scales

Under **1°C** sounds trivial, and at one facility it is.

The figure worth holding is what happens with volume. Reporting on the sector notes that continuously discharging **100 MW** of waste heat is enough to noticeably warm tens of thousands of cubic metres of seawater within an hour. Shanghai Lingang is designed for **24 MW**. The question is not what one installation does. It is what a coastline of them does, and that is genuinely unstudied because it has not happened yet.

## What is actually established

- Sealed, unstaffed, nitrogen-filled servers fail far less often. **Microsoft's figure, Microsoft's explanation.**
- Seawater cooling removes freshwater consumption, which matters a great deal in places where data centres compete with people for water.
- A commercial installation is operating off Shanghai and is majority-powered by offshore wind.
- Nobody has a regulatory framework for the heat.

## What is not established

- **Whether the reliability gain requires the ocean.** The stated cause is the atmosphere inside the tube.
- **Maintenance economics at scale.** Microsoft has not published why it declined to continue beyond saying it is not doing it.
- **The depth of the Shanghai installation**, and its measured environmental effect over time.
- **Cumulative thermal impact.** The single-facility numbers are small. Nobody has measured a cluster, because there is not one.`,
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
