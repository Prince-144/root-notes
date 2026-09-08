/**
 * Puts the definition of a testnet into the paragraph the carousel uses.
 *
 *   npx tsx --env-file=.env.local scripts/fix-etherhiding-testnet-definition.ts --apply
 *
 * The rendered card carried the heading "EtherHiding, and the word that
 * matters" and never said the word, because the two sentences naming testnet
 * and saying it is free were separate short paragraphs that lost the ranking.
 * A reader landing on that card was told every property is "present here"
 * without being told what here is.
 *
 * Merged into one paragraph sized for the 400-420 band.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "etherhiding-on-a-free-testnet-bulletproof-hosting-at-zero-cost";
const APPLY = process.argv.includes("--apply");

const BEFORE = `The word that matters is **testnet**.

A testnet exists for developers. It behaves like the production chain, and it is **free**. No gas costs, no funding, no wallet to top up.

Every property that made EtherHiding attractive on mainnet is present here: the contract is hosted by nobody you can email, there is no registrar to file with, no host to notify, no takedown to serve, and the operator can rewrite the payload in-contract whenever they like. What the testnet removes is the only thing that was ever a friction, which is the cost of updating it. Bulletproof hosting at **0** marginal cost.`;

const AFTER = `The word that matters is **testnet**. A testnet exists for developers: it behaves like the production chain and it is **free** — no gas costs, no funding, no wallet to top up. Every property that made EtherHiding attractive on mainnet is still here: nobody you can email hosts the contract, there is no takedown to serve, and the operator can rewrite the payload in-contract whenever they like. What the testnet removes is the cost of doing so. Bulletproof hosting at **0** marginal cost.`;

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
console.log(`${doc.body.length} -> ${body.length} chars`);
if (!APPLY) {
  console.log("dry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
