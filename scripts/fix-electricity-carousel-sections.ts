/**
 * Reshapes two sections of the US/China electricity piece so the carousel
 * picks the paragraph that carries the point.
 *
 *   npx tsx --env-file=.env.local scripts/fix-electricity-carousel-sections.ts
 *   npx tsx --env-file=.env.local scripts/fix-electricity-carousel-sections.ts --apply
 *
 * Two separate instances of the same failure:
 *
 * 1. "Capacity is not electricity" split the two ratios across two
 *    paragraphs. The scorer took the first — the definition of nameplate and
 *    the 3-to-1 figure — which is the half that agrees with the video. The
 *    slide would have argued the opposite of the section. Merged so one
 *    paragraph carries both numbers and the reason the second is the one
 *    that matters.
 *
 * 2. The "13 years" paragraph opened on "But", which the scorer penalises as
 *    a back-reference, handing the slide to the paragraph conceding China's
 *    growth. Reopened on a word that is not a pointer backwards.
 *
 * Published article, so this is an update. `publishedAt` is untouched — the
 * collection stamps it only on the draft -> published transition.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "china-3x-capacity-2x-electricity-which-number-runs-a-datacentre";
const APPLY = process.argv.includes("--apply");

const edits: [string, string][] = [
  [
    `**Installed capacity** is nameplate — the maximum a fleet could produce with everything running flat out. China's total generating capacity reached **3.89 TW** at the end of 2025, up **16.1%** year on year. The most recent comparable US figure is **1.28 TW** at the end of 2024. That is roughly **3 to 1**, and Musk's number is fair.

**Generation** is what actually arrives. Per Ember, China's 2025 electricity demand was **10,573 TWh**; the United States' was **4,536 TWh**. That is **2.33 to 1**.

The gap between 3x and 2.33x is not a rounding difference. It is composition.`,
    `**Installed capacity** is nameplate. China ended 2025 at **3.89 TW** against a US **1.28 TW** at end-2024 — roughly **3 to 1**, and Musk's figure is fair. **Generation** is what arrives: Ember puts China's 2025 demand at **10,573 TWh** against **4,536 TWh**, or **2.33 to 1**. A training run is a constant load, and solar nameplate at two in the morning is zero.

The gap between the two ratios is not rounding, it is composition.`,
  ],
  [
    `Which means the 3x figure — the one the reel leads with — is the measure **least** relevant to the thing being argued about. A frontier training run is a constant load. Solar nameplate at two in the morning is zero. The number that matters for a data centre is firm, round-the-clock generation, and on that measure the ratio is 2.33, not 3.`,
    `Which means the 3x figure — the one the reel leads with — is the measure **least** relevant to the thing being argued about. The number that decides whether a data centre runs is firm, round-the-clock generation, and on that measure the ratio is 2.33, not 3.`,
  ],
  [
    `But run the two growth rates forward. The ratio widens by about **1.9% a year**.`,
    `Run those rates forward, though, and the ratio widens by about **1.9% a year**.`,
  ],
];

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "articles",
  where: { slug: { equals: SLUG } },
  limit: 1,
});

const doc = docs[0];
if (!doc) {
  console.error(`no article with slug ${SLUG}`);
  process.exit(1);
}

let body = doc.body;
for (const [before, after] of edits) {
  if (!body.includes(before)) {
    console.error(`not found:\n${before.slice(0, 90)}...`);
    process.exit(1);
  }
  body = body.replace(before, after);
}

console.log(`${SLUG}: ${doc.body.length} -> ${body.length} chars, ${edits.length} edits`);

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");

// The afterChange hook fires revalidate and IndexNow without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
