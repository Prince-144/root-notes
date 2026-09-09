/**
 * Reshapes three sections of the FreeIPA piece for the carousel.
 *
 *   npx tsx --env-file=.env.local scripts/fix-freeipa-carousel.ts --apply
 *
 * The ranking put the top three at "Two bugs" (3.72), "The question nobody has
 * answered" (1.22) and "Credit, and the disclosure" (0.94) — so the third card
 * would have been the Anthropic disclosure, standing alone with no article
 * around it to be a disclosure about. And the mechanism the whole piece exists
 * to explain won its section on a 143-character paragraph.
 *
 * Two sections scored below zero because their winners were under the
 * 140-character floor, which is the scorer correctly refusing to build a card
 * out of a sentence.
 *
 * All three rewritten into the 400-420 band with standalone digits: the
 * mechanism, why "anonymous" makes it a 9.8, and the fact that patching cannot
 * tell you whether it already happened. The disclosure stays in the article,
 * where it belongs, and nothing on the carousel needs it — the three cards are
 * bug mechanics.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "freeipa-anonymous-client-passes-the-ownership-check-by-being-nobody";
const APPLY = process.argv.includes("--apply");

const edits = [
  {
    label: "the mechanism",
    before: `Now put them together.

An unauthenticated client has an **empty name**. The entry it just created has an **empty stored owner**. The check compares one against the other, finds them equal, and permits the write.`,
    after: `Now put them together. **2** rules, each defensible on its own, meeting in one request. An unauthenticated client has an **empty name**. The entry it just created has an **empty stored owner**. The ownership check compares one against the other as plain text, finds them equal, and permits the write. The attacker does not defeat the check — the attacker satisfies it, by being nobody, because the empty string is the empty string.`,
  },
  {
    label: "what anonymous means",
    before: `It does not mean an attacker who guessed a password, or one with a low-privilege account, or one who phished a user. It means a client that has never authenticated, has no account, and has no login history — reaching the directory service over the network.

The only precondition is being able to talk to it. That is what makes this a 9.8 rather than a 7.`,
    after: `It does not mean an attacker who guessed a password, or one holding a low-privilege account, or one who phished a user. It means a client that has never authenticated, has no account and no login history, reaching the directory service over the network. The only precondition is being able to talk to it — which is what makes this a **9.8** rather than a **7**, and why restricting who can reach the service is the one compensating control available.`,
  },
  {
    label: "the question nobody has answered",
    before: `The attack **creates an identity**. An identity created before the patch survives the patch, because it is now a legitimate row in your directory with legitimate administrative group membership. There is nothing structurally wrong with it any more.

No detection rules have been published. No indicators of compromise have been published. No guidance exists on whether patching removes attacker-created entries or how an administrator would find them.`,
    after: `The attack **creates an identity**. One created before the patch survives the patch, because it is now a legitimate row in your directory with legitimate administrative group membership, and there is nothing structurally wrong with it any more. **0** detection rules have been published, **0** indicators of compromise, and no guidance on whether patching removes attacker-created entries or how an administrator would ever find one.`,
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
