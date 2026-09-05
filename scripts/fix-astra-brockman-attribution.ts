/**
 * Attributes the Brockman quote in the evidence section.
 *
 *   npx tsx --env-file=.env.local scripts/fix-astra-brockman-attribution.ts
 *   npx tsx --env-file=.env.local scripts/fix-astra-brockman-attribution.ts --apply
 *
 * On the rendered carousel slide the paragraph opened with an unattributed
 * "anything a human can do with a computer" and went straight into Claude
 * bricking a PLC. Read cold, that parses as the quote being a claim about
 * Claude — the opposite of who said it and about what. In the article the
 * attribution is two sections up; on a card there is nothing above it.
 *
 * Naming Brockman costs 29 characters and keeps the paragraph at 336, inside
 * the 420 the scorer starts penalising. Section score 4.68, still top three.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "gpt-6-astra-critical-cyber-threshold-openai-wrote-the-line";
const APPLY = process.argv.includes("--apply");

const BEFORE = `Set against "anything a human can do with a computer": Forescout had **Claude** [port a working pre-auth exploit between two industrial controllers](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout). It took **8 hours 32 minutes** and **$535.74**, needed constant human steering, and bricked the device. The lab concluded its own researcher would have been faster and cheaper alone.`;

const AFTER = `Set against Greg Brockman's "Astra can do anything a human can do with a computer": Forescout had **Claude** [port a working pre-auth exploit between two industrial controllers](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout). It took **8 hours 32 minutes** and **$535.74**, needed constant human steering, and bricked the device. The lab concluded its own researcher would have been faster alone.`;

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
console.log(`${SLUG}: ${doc.body.length} -> ${body.length} chars`);

if (!APPLY) {
  console.log("dry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");

// The afterChange hook fires revalidate and IndexNow without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
