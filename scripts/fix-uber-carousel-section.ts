/**
 * Prose fix for a published article.
 *
 * /article/uber-825-million-dutch-dpa-automated-driver-suspensions went live
 * while the carousel for it was being rendered. Its "Why this one is different
 * from the others" section answers the heading in its first two paragraphs,
 * but both open on a back-reference ("Because...", "That is..."), which the
 * carousel scorer penalises. The India DPDP aside won on digits, so slide 4
 * paired a heading promising a difference with a body that never states it.
 *
 * This rewrites the section's opener to stand on its own and carry its own
 * figure. No fact changes — the same claim, said without leaning on the
 * sentence before it. It reads better on the page too.
 *
 * publishedAt is preserved by the beforeChange hook.
 *
 * Dry run by default; pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "uber-825-million-dutch-dpa-automated-driver-suspensions";

const FROM = `Because it is not about data moving somewhere it should not, or a market being tilted. It is about an algorithm making a decision that ended someone's income, with nobody obliged to look at it.

That is the first of these fines that reads as a direct precedent for AI systems now being deployed into hiring, lending, insurance and moderation. None of the reasoning depends on the software being sophisticated. It depends on there being a consequential decision, no human, and no notice.`;

const TO = `The **€825 million** is not about data crossing a border it should not, or a market being tilted. It is about an algorithm ending someone's income with nobody obliged to look at it — the first of these fines that reads as direct precedent for the AI systems now going into hiring, lending, insurance and moderation.

None of that reasoning depends on the software being sophisticated. It depends on there being a consequential decision, no human, and no notice.`;

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) {
  console.error(`no article with slug "${SLUG}"`);
  process.exit(1);
}
if (doc.body.includes(TO)) {
  console.log("already fixed — nothing to do");
  process.exit(0);
}
if (!doc.body.includes(FROM)) {
  console.error("could not find the passage to replace; the body has changed since this was written");
  process.exit(1);
}

const body = doc.body.replace(FROM, TO);
console.log(`status: ${doc.status}`);
console.log(`words:  ${doc.body.split(/\s+/).length} -> ${body.split(/\s+/).length}`);
console.log(`changes: 1 section opener rewritten to stand alone; no facts altered\n`);

if (!APPLY) {
  console.log("dry run — pass --apply to write this to the live article");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("applied. redeploy for the change to reach rootnotes.in.");
process.exit(0);
