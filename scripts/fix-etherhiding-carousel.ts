/**
 * Reshapes two sections of the EtherHiding piece for the carousel.
 *
 *   npx tsx --env-file=.env.local scripts/fix-etherhiding-carousel.ts --apply
 *
 * Only one section carried a figure, so it took the +3 and the rest ranked on
 * length alone: numbers 4.01, testnet 1.86, CAPTCHA 1.77, stager 1.63. The
 * headline idea — that the testnet is free, which is the whole reason this is
 * news rather than a rerun of EtherHiding — would have placed second on a
 * paragraph with nothing to anchor it, and the fake CAPTCHA, which is the part
 * a reader can actually act on, third.
 *
 * Both rewritten into the 400-420 band with standalone digits, which drops the
 * stager section and leaves, in article order: what the testnet changes, what
 * the victim sees, and how to read the two counts.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "etherhiding-on-a-free-testnet-bulletproof-hosting-at-zero-cost";
const APPLY = process.argv.includes("--apply");

const edits = [
  {
    label: "the word that matters",
    before: `Every property that made EtherHiding attractive on mainnet is present here: the contract is not hosted by anyone you can email, there is no registrar to file with, no host to notify, no takedown to serve, and the operator can rewrite the payload in-contract whenever they like. What the testnet removes is the only thing that was ever a friction — the cost of updating it.`,
    after: `Every property that made EtherHiding attractive on mainnet is present here: the contract is hosted by nobody you can email, there is no registrar to file with, no host to notify, no takedown to serve, and the operator can rewrite the payload in-contract whenever they like. What the testnet removes is the only thing that was ever a friction, which is the cost of updating it. Bulletproof hosting at **0** marginal cost.`,
  },
  {
    label: "the lure is a fake CAPTCHA",
    before: `The payload chain ends in **ClickFix**: the compromised page shows a fake CAPTCHA, and tells the visitor to complete verification by pasting a command into the Windows **Run dialog** and pressing Enter.`,
    after: `The payload chain ends in **ClickFix**: the compromised page shows a fake CAPTCHA and tells the visitor to complete verification by pasting a command into the Windows **Run dialog** and pressing Enter. Around **300** of the compromised sites serve that lure on any given day. Nothing downloads and executes on its own — the visitor types the command themselves, which routes around a great deal of automated control.`,
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
