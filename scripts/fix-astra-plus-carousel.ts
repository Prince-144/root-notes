/**
 * Reshapes two sections of the Astra-on-Plus piece for the carousel.
 *
 *   npx tsx --env-file=.env.local scripts/fix-astra-plus-carousel.ts --apply
 *
 * carousel-scores.ts had the top three at 4.38, 4.01 and 3.79, with the two
 * argument-carrying sections winning on short paragraphs — 201 and 158
 * characters — so the cards would have been sparse and the actual comparison
 * that makes the piece (an 8.5% residual behind identity verification versus
 * the same residual as the entire gate) never reached a slide.
 *
 * Both rewritten paragraphs are sized into the 400-420 band and carry
 * standalone digits. The opening card is left alone deliberately: it is the
 * paragraph establishing that OpenAI kept its published timeline, and a
 * carousel that omits that is unfair to the subject.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "astra-on-plus-the-control-changed-from-who-you-are-to-whether-it-says-no";
const APPLY = process.argv.includes("--apply");

const edits = [
  {
    label: "What actually changed",
    before: `On **Daybreak Blue**, the controls are **identity verification**, **legal attestations**, **approved-use restrictions** and **account monitoring**. Every one of those is a control on a **person**. They do not make the model refuse anything. They make the requester known, accountable, and revocable — and they mean that a persistent abuser leaves a trail with a name on it.`,
    after: `On **Daybreak Blue** the controls are identity verification, legal attestations, approved-use restrictions and account monitoring. All **4** are controls on a **person**. They do not make the model refuse anything — they make the requester known, accountable and revocable, and they mean a persistent abuser leaves a trail with a name on it. On a **$20** Plus plan there is no identity verification and no attestation.`,
  },
  {
    label: "OpenAI published the number",
    before: `To its credit, OpenAI did not leave this to inference. It reported that Astra **declines 91.5%** of cyber-related jailbreak attempts, against **59%** for GPT-5.6 Sol.

That is a large, real improvement and it should be said plainly.

It also means roughly **one attempt in twelve** is not declined.`,
    after: `To its credit, OpenAI did not leave this to inference. It reported that Astra **declines 91.5%** of cyber-related jailbreak attempts, against **59%** for GPT-5.6 Sol. That is a large, real improvement and it should be said plainly. It also means roughly **1** attempt in **12** is not declined — and whether that matters depends entirely on what is standing behind the model when the twelfth one lands.`,
  },
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
for (const edit of edits) {
  if (!body.includes(edit.before)) {
    console.error(`"${edit.label}": not found — the body has moved on`);
    process.exit(1);
  }
  body = body.replace(edit.before, edit.after);
  console.log(`ok  ${edit.label}`);
}

console.log(`${doc.body.length} -> ${body.length} chars`);
if (!APPLY) {
  console.log("dry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
