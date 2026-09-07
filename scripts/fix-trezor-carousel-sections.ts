/**
 * Reshapes two sections of the Trezor piece so the carousel carries the story.
 *
 *   npx tsx --env-file=.env.local scripts/fix-trezor-carousel-sections.ts
 *   npx tsx --env-file=.env.local scripts/fix-trezor-carousel-sections.ts --apply
 *
 * carousel-scores.ts put the top three at "Two disclosures" (4.63), "The part
 * that should not have been possible" (4.44) and "ShipMonk has said nothing"
 * (1.74) — two problems.
 *
 * "Physical security risks is not boilerplate here" scored 1.25 and dropped
 * out, which is the wrong thing to lose. It is the section that says what the
 * list actually is: people who bought a hardware wallet, matched to their home
 * address. Its strongest paragraph opens "That is a target list" and takes the
 * backref penalty, and its winner carried no figure.
 *
 * The other problem is that "ShipMonk has said nothing" was won by the
 * paragraph cross-linking the Thomson Reuters piece, which on a standalone card
 * is an argument about a different company. Lifting the other two sections
 * above it drops it out rather than requiring that section to be rewritten.
 *
 * Both rewritten paragraphs are sized into the 400-420 band — 400 is where the
 * section ranker stops crediting length, 420 is where the paragraph scorer
 * starts penalising — and each carries a standalone digit for the +3.
 *
 * New section scores: physical-security 5.00, should-not-have-been-possible
 * 5.00, two-disclosures 4.63, against 1.74 for the section that drops out. In
 * article order the cards run: the failure, why it matters, and that it is
 * still growing.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "trezor-shipmonk-deletion-was-confirmed-in-writing-and-did-not-happen";
const APPLY = process.argv.includes("--apply");

const edits: { label: string; before: string; after: string }[] = [
  {
    label: "The part that should not have been possible",
    before: `Read those two facts against the date range. The oldest exposed records are from **November 2019**. Against a 90-day policy, that is data retained roughly **twenty-eight times longer** than the policy allowed, at a company that had confirmed in writing, more than once, that it no longer held it.`,
    after: `Read those two facts against the date range. The oldest exposed records are from **November 2019**. Against a **90**-day policy, that is data retained roughly **28 times longer** than the policy allowed — at a company that had confirmed in writing, more than once, that it no longer held it. Trezor asked. Trezor received an answer. The answer was wrong for almost seven years and there was no way to find out.`,
  },
  {
    label: "Physical security risks",
    before: `Reconstruct what the list actually is. Every person on it is someone who bought a **hardware wallet** — a device whose entire purpose is holding cryptocurrency offline — and every record pairs that person's name with their **home address** and phone number.

That is a target list for physical coercion. The pattern has a name in the industry and a growing case history, and it does not require the attacker to know how much anyone holds. It requires believing they hold something, which the purchase itself implies.`,
    after: `Reconstruct what the list actually is. **67,000** people who bought a **hardware wallet** — a device whose entire purpose is holding cryptocurrency offline — each one matched to a **home address** and a phone number. That is a target list for physical coercion, and it does not require the attacker to know how much anyone holds. It requires believing they hold something, which the purchase itself already says.

The pattern has a name in the industry and a growing case history, and it is the reason this sentence in the notice is not the usual legal padding.`,
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
    console.error(`"${edit.label}": section not found — the body has moved on`);
    process.exit(1);
  }
  body = body.replace(edit.before, edit.after);
  console.log(`ok  ${edit.label}`);
}

console.log(`\n${SLUG}: ${doc.body.length} -> ${body.length} chars`);

if (!APPLY) {
  console.log("dry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");

// The afterChange hook fires revalidate and IndexNow without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
