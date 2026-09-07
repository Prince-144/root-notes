/**
 * Names Krebs in the paragraph the carousel puts on a card.
 *
 *   npx tsx --env-file=.env.local scripts/fix-idscan-krebs-antecedent.ts --apply
 *
 * The rendered slide opened "He confirmed it." In the article the previous
 * paragraph names him; on a standalone card there is nothing above it, so the
 * pronoun has no antecedent and the reader does not know whose licence it was.
 *
 * Costs 11 characters, keeping the paragraph at 380 — inside the 400 where the
 * section ranker stops giving length credit. Section score 4.90, still ahead of
 * the 4.58 it needs to beat.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "idscan-nexus-infrared-ultraviolet-copies-traced-the-scans";
const APPLY = process.argv.includes("--apply");

const BEFORE = `He confirmed it. **6** image files, timestamped **June 2025**`;
const AFTER = `Brian Krebs confirmed it. **6** image files, timestamped **June 2025**`;

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
console.log(`${doc.body.length} -> ${body.length} chars`);

if (!APPLY) {
  console.log("dry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
