/**
 * Update for a published article.
 *
 * /article/uk-power-plant-four-day-shutdown-attribution-not-confirmed went live
 * saying, under "What is not established", that neither the UK government nor
 * the NCSC had confirmed the account in detail.
 *
 * That line has since been overtaken. A British government spokesperson
 * confirmed the incident to The Register, saying "At no point was there a risk
 * to the wider energy system", and Energy Minister Michael Shanks said his
 * department briefed energy CEOs and shared further advice with companies.
 *
 * The article's thesis is unaffected and arguably strengthened: the government
 * spoke, and pointedly did not attribute the attack to Iran or name the plant.
 * But a bullet asserting no official comment is now wrong, and the article is
 * live. This rewrites that bullet and adds a dated update note.
 *
 * publishedAt is preserved by the beforeChange hook.
 *
 * Dry run by default; pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "uk-power-plant-four-day-shutdown-attribution-not-confirmed";

const NOTE = `> **Update, 25 August 2026:** The UK government has now commented. A spokesperson told The Register that **"At no point was there a risk to the wider energy system"**, describing the energy system as highly resilient, and Energy Minister **Michael Shanks** said his department briefed energy CEOs and shared further advice on the steps companies should take. The government still has **not** attributed the attack to Iran or to anyone else, and still has not named the plant. The piece below is unchanged apart from the bullet on official confirmation.

`;

const FROM = `- **Official confirmation.** Neither the UK government nor the **NCSC** has confirmed the account in detail.`;

const TO = `- **The attribution, officially.** The UK government has confirmed the incident and its scope — a spokesperson said there was at no point a risk to the wider energy system — but has attributed it to nobody. Confirming that something happened is not confirming who did it, and only the first has occurred.`;

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) {
  console.error(`no article with slug "${SLUG}"`);
  process.exit(1);
}
if (doc.body.startsWith("> **Update,")) {
  console.log("already updated — nothing to do");
  process.exit(0);
}
if (!doc.body.includes(FROM)) {
  console.error("could not find the bullet to replace; the body has changed since this was written");
  process.exit(1);
}

const body = NOTE + doc.body.replace(FROM, TO);

console.log(`status: ${doc.status}`);
console.log(`words:  ${doc.body.split(/\s+/).length} -> ${body.split(/\s+/).length}`);
console.log(`changes: update note prepended, 1 bullet rewritten\n`);

if (!APPLY) {
  console.log("dry run — pass --apply to write this to the live article");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("applied. redeploy for the change to reach rootnotes.in.");
process.exit(0);
