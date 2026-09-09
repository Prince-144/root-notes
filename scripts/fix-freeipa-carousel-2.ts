/**
 * Second pass on the FreeIPA carousel — two mistakes in the first one.
 *
 *   npx tsx --env-file=.env.local scripts/fix-freeipa-carousel-2.ts --apply
 *
 * The rewritten "anonymous" paragraph kept its original opening word, "It",
 * which is on the scorer's back-reference list. Four hundred characters and a
 * figure, minus five for starting with a pronoun, and it lost its own section
 * to a 57-character sentence. Rewritten to open on the word being defined.
 *
 * The "question nobody has answered" paragraph landed at 421 characters, one
 * past the overflow threshold, which is the line where a card starts cutting
 * off. Trimmed.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "freeipa-anonymous-client-passes-the-ownership-check-by-being-nobody";
const APPLY = process.argv.includes("--apply");

const edits = [
  {
    label: "anonymous — drop the leading pronoun",
    before: `It does not mean an attacker who guessed a password, or one holding a low-privilege account, or one who phished a user. It means a client that has never authenticated, has no account and no login history, reaching the directory service over the network. The only precondition is being able to talk to it — which is what makes this a **9.8** rather than a **7**, and why restricting who can reach the service is the one compensating control available.`,
    after: `Anonymous does not mean an attacker who guessed a password, or one holding a low-privilege account, or one who phished a user. The attacker model is a client that has never authenticated, has no account and no login history, reaching the directory service over the network. Being able to talk to it is the only precondition — which is what makes this a **9.8** rather than a **7**.`,
  },
  {
    label: "the question — 421 to under the threshold",
    before: `**0** detection rules have been published, **0** indicators of compromise, and no guidance on whether patching removes attacker-created entries or how an administrator would ever find one.`,
    after: `**0** detection rules have been published, **0** indicators of compromise, and no guidance on whether patching removes attacker-created entries or how anyone would find one.`,
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
