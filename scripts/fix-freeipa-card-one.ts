/**
 * Makes the FreeIPA mechanism card stand on its own.
 *
 *   npx tsx --env-file=.env.local scripts/fix-freeipa-card-one.ts --apply
 *
 * The rendered card opened "Now put them together" with no them above it, and
 * described "2 rules, each defensible on its own" without ever saying which
 * two. A reader arriving on that card got the punchline and none of the setup.
 *
 * Rewritten to name both components inside the paragraph. 405 characters.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "freeipa-anonymous-client-passes-the-ownership-check-by-being-nobody";
const APPLY = process.argv.includes("--apply");

const BEFORE = `Now put them together. **2** rules, each defensible on its own, meeting in one request. An unauthenticated client has an **empty name**. The entry it just created has an **empty stored owner**. The ownership check compares one against the other as plain text, finds them equal, and permits the write. The attacker does not defeat the check — the attacker satisfies it, by being nobody, because the empty string is the empty string.`;

const AFTER = `**2** rules, each defensible alone. FreeIPA lets unauthenticated users manage their own one-time-password token. 389 Directory Server checks ownership by comparing names as plain text. An unauthenticated client has an **empty name**; the entry it just created has an **empty owner**; the check finds them equal and permits the write. The attacker does not defeat the check — the attacker satisfies it, by being nobody.`;

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
