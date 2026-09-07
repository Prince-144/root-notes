/**
 * Second pass on the Trezor carousel, after looking at the rendered slides.
 *
 *   npx tsx --env-file=.env.local scripts/fix-trezor-carousel-orphans.ts --apply
 *
 * Two defects the scores could not show:
 *
 *   - Card 1 opened "Read those two facts against the date range." On a card
 *     there are no two facts above it. Merged the 90-day policy into the same
 *     paragraph so it stands alone.
 *   - Card 3's heading promises "two disclosures, one month apart, five times
 *     larger" and its body was about the records being five to seven years old.
 *     The paragraph that matches the heading scored 4.87 and lost to 6.26;
 *     lengthened it into the 400-420 band so it wins its own section.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "trezor-shipmonk-deletion-was-confirmed-in-writing-and-did-not-happen";
const APPLY = process.argv.includes("--apply");

const edits = [
  {
    label: "card 1 orphan",
    before: `And its stated policy: customer addresses and phone numbers are deleted or anonymised after **90 days**.

Read those two facts against the date range. The oldest exposed records are from **November 2019**. Against a **90**-day policy, that is data retained roughly **28 times longer** than the policy allowed — at a company that had confirmed in writing, more than once, that it no longer held it. Trezor asked. Trezor received an answer. The answer was wrong for almost seven years and there was no way to find out.`,
    after: `Trezor's stated policy is that customer addresses and phone numbers are deleted or anonymised after **90** days. The oldest exposed records are from **November 2019** — data retained roughly **28 times longer** than the policy allowed, at a company that had confirmed in writing, more than once, that it no longer held it. Trezor asked. Trezor received an answer. The answer was wrong for almost seven years.`,
  },
  {
    label: "card 3 heading mismatch",
    before: `13,689 in August. 67,000 in September. That progression usually means the scope assessment is still running, and it is a reason to treat the current number as a floor rather than a total.`,
    after: `**13,689** in August. **67,000** in September. Two disclosures a month apart, the second five times the size of the first. That progression usually means the scope assessment is still running, which is a reason to treat the current number as a floor rather than a total — and the party best placed to say how many records it actually held is the one that has said nothing at all.`,
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
