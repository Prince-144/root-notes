/**
 * Folds "A refusal is a signal." into the paragraph after it in the
 * GuardBreaker piece.
 *
 *   npx tsx --env-file=.env.local scripts/fix-guardbreaker-refusal-section.ts
 *   npx tsx --env-file=.env.local scripts/fix-guardbreaker-refusal-section.ts --apply
 *
 * The line is the thesis of its section and the best four words in the piece,
 * but at 22 characters the carousel's paragraph picker cannot use it — the
 * eligibility floor is 40 — so the slide for that section led with the
 * consequence and left the claim behind. Merging puts the claim first on the
 * card and reads no worse in the article.
 *
 * The article is already published, so this is an update. `publishedAt` is
 * untouched: the collection stamps it only on the draft -> published
 * transition.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "uac-0099-guardbreaker-nuclear-prompt-vbs-comment";
const APPLY = process.argv.includes("--apply");

const BEFORE = `A refusal is a signal.

If an analysis tool declines to process a file, that is an anomaly about the file, and it belongs in the queue rather than in the bin.`;

const AFTER = `A refusal is a signal. If an analysis tool declines to process a file, that is an anomaly about the file, and it belongs in the queue rather than in the bin.`;

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

if (!doc.body.includes(BEFORE)) {
  console.error("paragraph not found — the body has moved on");
  process.exit(1);
}

const body = doc.body.replace(BEFORE, AFTER);
console.log(`${SLUG}: merged, ${doc.body.length} -> ${body.length} chars`);

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");

// The afterChange hook fires its revalidate and IndexNow work without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
