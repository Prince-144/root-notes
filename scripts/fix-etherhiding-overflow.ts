/**
 * Trims the testnet paragraph back under the overflow threshold.
 *
 *   npx tsx --env-file=.env.local scripts/fix-etherhiding-overflow.ts --apply
 *
 * Merging the definition in pushed the paragraph to 476 characters. The
 * rendered slide cut off at "Bulletproof hosting at 0" and lost "marginal
 * cost." — which is exactly what the 420 threshold in the scorer exists to
 * prevent, and which I walked into by editing for meaning without re-checking
 * the length.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "etherhiding-on-a-free-testnet-bulletproof-hosting-at-zero-cost";
const APPLY = process.argv.includes("--apply");

const BEFORE = `The word that matters is **testnet**. A testnet exists for developers: it behaves like the production chain and it is **free** — no gas costs, no funding, no wallet to top up. Every property that made EtherHiding attractive on mainnet is still here: nobody you can email hosts the contract, there is no takedown to serve, and the operator can rewrite the payload in-contract whenever they like. What the testnet removes is the cost of doing so. Bulletproof hosting at **0** marginal cost.`;

const AFTER = `The word that matters is **testnet**. A testnet exists for developers: it behaves like the production chain and it is **free** — no gas, no funding, no wallet. Everything that made EtherHiding attractive on mainnet is still here: nobody you can email hosts the contract, and the operator can rewrite the payload whenever they like. What the testnet removes is the cost of doing so — bulletproof hosting at **0** marginal cost.`;

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
