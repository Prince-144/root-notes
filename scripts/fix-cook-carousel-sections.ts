/**
 * Merges two paragraphs in the Cook piece so the carousel can reach the claim.
 *
 *   npx tsx --env-file=.env.local scripts/fix-cook-carousel-sections.ts
 *   npx tsx --env-file=.env.local scripts/fix-cook-carousel-sections.ts --apply
 *
 * scripts/carousel-scores.ts found the same failure in two sections:
 *
 * 1. "What actually happened" would have shown the date correction and not
 *    the bigger one. "And he did not resign" is 104 characters and opens on a
 *    back-reference, so it scored -3.96 and could not win anything — and that
 *    sentence is the headline of the piece.
 * 2. "What we do not know about Ternus" would have shown his CV. The point —
 *    a public record with nothing in it on lawful access — opens on "That"
 *    and loses five points for it.
 *
 * Both fixed by merging, not by adding. Published article, so this is an
 * update; `publishedAt` is untouched, since the collection stamps it only on
 * the draft -> published transition.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "tim-cook-executive-chairman-encryption-succession-uk-tribunal";
const APPLY = process.argv.includes("--apply");

const edits: [string, string][] = [
  [
    `Apple announced the transition on **20 April 2026**, not in August. The handover took effect on **1 September 2026**, which made **31 August** Cook's last day as chief executive — a date, not an announcement.

And he did not resign. **Cook became Apple's executive chairman.** He is still at the company, on the board.`,
    `Apple announced the transition on **20 April 2026**, not in August. The handover took effect on **1 September 2026**, which made **31 August** Cook's last day as chief executive — a date, not an announcement. He did not resign either: **Cook became Apple's executive chairman**, and is still at the company, on the board.`,
  ],
  [
    `Ternus joined Apple's product design team in **2001**, became vice president of Hardware Engineering in **2013**, and joined the executive team in **2021**. He holds a mechanical engineering degree from the **University of Pennsylvania** and worked at Virtual Research Systems before Apple.

That is 25 years of building hardware. It is also, for our purposes, a public record with almost nothing in it about encryption policy, lawful access, or how far he would go in a standoff with a government.`,
    `Ternus joined Apple's product design team in **2001**, became vice president of Hardware Engineering in **2013**, and joined the executive team in **2021** — **25 years** of building hardware, and a public record with almost nothing in it about encryption policy, lawful access, or how far he would go in a standoff with a government.

He holds a mechanical engineering degree from the **University of Pennsylvania** and worked at Virtual Research Systems before Apple.`,
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
