/**
 * Update for a published article.
 *
 * /article/cert-polska-two-flaws-chained-against-mikrotik-nobody-will-say-which-two
 * was written when CERT Polska had not said which two flaws combined, and was
 * later revised in place once they were named. The body now identifies both
 * CVEs and quotes the exposure figure, but the "What is not established"
 * section was never brought along, so it still asks two questions the article
 * itself answers a few paragraphs earlier.
 *
 * Two bullets are replaced with questions that are actually still open:
 *
 *   - the chain bullet becomes whether the other four disclosed flaws are being
 *     exploited, noting that CISA has since listed the bandwidth-test flaw;
 *   - the device-count bullet keeps the compromise question and drops the claim
 *     that no exposure count exists, since the body gives one.
 *
 * Nothing else changes. publishedAt is preserved by the beforeChange hook.
 *
 * Dry run by default; pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "cert-polska-two-flaws-chained-against-mikrotik-nobody-will-say-which-two";

const EDITS: Array<{ from: string; to: string }> = [
  {
    from: "- **Which two vulnerabilities form the chain**, or whether CVEs have been assigned.",
    to: "- **Whether the other four disclosed flaws are being exploited.** CERT Polska's confirmation covers the MikroTrick pair only, though CISA has since listed the bandwidth-test flaw as exploited as well.",
  },
  {
    from: "- **How many devices are compromised**, or how many are exposed. No count has been published.",
    to: "- **How many devices are compromised.** The figure above counts routers with SSH reachable from the internet, not routers that fell.",
  },
];

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) { console.error(`no article with slug "${SLUG}"`); process.exit(1); }

let body = doc.body;
let applied = 0;

for (const { from, to } of EDITS) {
  if (body.includes(to)) { console.log(`already updated: ${to.slice(0, 48)}...`); continue; }
  const hits = body.split(from).length - 1;
  if (hits !== 1) { console.error(`expected 1 match, found ${hits}: ${from.slice(0, 60)}...`); process.exit(1); }
  body = body.replace(from, to);
  applied += 1;
}

if (applied === 0) { console.log("nothing to do"); process.exit(0); }

console.log(`status: ${doc.status}`);
console.log(`words:  ${doc.body.split(/\s+/).length} -> ${body.split(/\s+/).length}`);
console.log(`changes: ${applied} stale bullets in What is not established replaced`);

if (!APPLY) {
  console.log("\n--- new section ---");
  console.log(body.slice(body.indexOf("## What is not established")));
  console.log("\ndry run — pass --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("applied. redeploy for the change to reach rootnotes.in.");
process.exit(0);
