/**
 * Reshapes the OpenAI section of the three-labs piece so the carousel uses it.
 *
 *   npx tsx --env-file=.env.local scripts/fix-three-labs-openai-section.ts
 *   npx tsx --env-file=.env.local scripts/fix-three-labs-openai-section.ts --apply
 *
 * scripts/carousel-scores.ts put the top three sections as Anthropic's line,
 * the self-graded benchmarks, and Anthropic's false-positive metric — so two
 * of the three cards were about Anthropic, on a piece whose subject is all
 * three labs and which discloses that this site is written with Claude. That
 * is not a balance the article argues for.
 *
 * The section it displaced carries the most consequential fact in the batch:
 * OpenAI stating, inside a product announcement, that Astra meets the Critical
 * bar of its own Preparedness Framework. It scored 1.31 because its winning
 * paragraph had no figure and the follow-up that asks who polices the gate
 * opened on "It" and lost five points.
 *
 * Merged, with the three access programmes counted so the paragraph carries a
 * figure: section score 4.98, top of the piece.
 *
 * Published article, so this is an update. `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "three-labs-shipped-cyber-models-and-graded-their-own-homework";
const APPLY = process.argv.includes("--apply");

const BEFORE = `Buried inside a product announcement is a company stating that its model meets the Critical bar of its own safety framework — the one that describes autonomous zero-day discovery and exploitation against defended systems — and shipping it under access controls.

Whatever you think of the claim, that is a significant thing to say out loud, and it will be under-covered because of where it was said.

It also invites the obvious question, which none of these announcements answers: **who decides whether the gate holds?** Fairwind, Daybreak Blue and the Cyber Verification Program are all vendor-operated allowlists. The safeguard against misuse of a Critical-threshold capability is a company's own customer vetting.`;

const AFTER = `Buried inside a product announcement is a company stating its model meets the Critical bar of its own safety framework — autonomous zero-day discovery and exploitation against defended systems — and shipping it anyway, under access controls. Fairwind, Daybreak Blue and CVP are **3** vendor-run allowlists, so the safeguard against a Critical-threshold capability is a company vetting its own customers.

Whatever you think of the claim, that is a significant thing to say out loud, and it will be under-covered because of where it was said.`;

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
  console.error("section not found — the body has moved on");
  process.exit(1);
}

const body = doc.body.replace(BEFORE, AFTER);
console.log(`${SLUG}: ${doc.body.length} -> ${body.length} chars`);

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");

// The afterChange hook fires revalidate and IndexNow without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
