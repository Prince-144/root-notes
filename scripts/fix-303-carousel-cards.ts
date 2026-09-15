/**
 * Reshapes two carousel cards in article 303 (Revolut fraudulent data request).
 *
 * The title's claim — every email check passed because the government domain
 * was real — lives in "Why every check passed". Its winning paragraph opened
 * "All three answer the same question" without the card naming SPF, DKIM or
 * DMARC, and the point that none of them can identify who controls the
 * mailbox sat in the paragraph after it. The section was picked by 0.17.
 *
 * "A known pattern" was won by a paragraph opening "The same reporting",
 * while the pattern itself — the FBI's November 2024 warning and forum
 * sellers charging per successful request — sat in a 462-character paragraph
 * that took the overflow penalty.
 *
 * The checks card absorbs the first sentence of the paragraph after it, which
 * is deleted so the article does not say it twice. The pattern paragraph is
 * trimmed in place.
 *
 * Guards, any failure writes nothing: every anchor occurs exactly once in the
 * original body AND again at the moment its edit is applied, so an earlier
 * replacement cannot plant a second copy of a later anchor; every replacement
 * has a figure, no back-reference opener, and fits its length band; the
 * section count does not change.
 *
 *   npx tsx --env-file=.env.local scripts/fix-303-carousel-cards.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/fix-303-carousel-cards.ts --apply
 */
import { getPayload } from "payload";
import config from "@payload-config";

const ID = 303;
const APPLY = process.argv.includes("--apply");

/** [start anchor, end anchor, replacement, minimum length]. Empty replacement deletes. */
const EDITS: [string, string, string, number][] = [
  [
    "All three answer the same question",
    "The checks did their job.",
    `**SPF**, **DKIM** and **DMARC** all answer one question: did this message really come from the domain it claims? According to the notice, the request Revolut received came from an unauthorised account on the agency's official domain, so the honest answer was yes, and all **3** checks did their job. None of them can say who controls that mailbox, or whether that person has any right to demand a customer's records.`,
    360,
  ],
  // Its point now closes the card above; the paragraph keeps its second sentence.
  [
    "What none of them can say is who controls",
    "to demand a customer's records. ",
    "",
    0,
  ],
  [
    "In **November 2024** the FBI warned",
    "in more than 25 countries.",
    `In **November 2024** the FBI warned US companies that criminals were likely using compromised US and foreign government email addresses to send fraudulent emergency data requests, exposing customers' personal information. KrebsOnSecurity reported that sellers on crime forums were offering such requests for **1,000 to 3,000 dollars** per successful request, claiming government email access in more than 25 countries.`,
    360,
  ],
];

function score(t: string) {
  const pl = t.replace(/\*\*/g, "");
  const br =
    /^(that|this|these|those|it|they|such|both|neither|and|but|so|because|which|then|also|again|instead|here)\b/i.test(
      pl,
    );
  const fig = /\d/.test(pl.replace(/\d+(\.\d+)+/g, ""));
  const s =
    (fig ? 3 : 0) +
    Math.min(pl.length, 420) / 100 -
    (br ? 5 : 0) -
    (pl.length > 420 ? 4 : 0);
  return { len: pl.length, br, fig, score: s };
}

const count = (hay: string, needle: string) => hay.split(needle).length - 1;

const payload = await getPayload({ config });
const res = await payload.find({
  collection: "articles",
  where: { id: { equals: ID } },
  limit: 1,
});
let body = res.docs[0].body as string;
const sectionsBefore = body.split("\n").filter((l) => l.startsWith("## ")).length;

let ok = true;

for (const [start, end, repl, min] of EDITS) {
  const startN = count(body, start);
  const endN = count(body, end);
  if (repl === "") {
    const good = startN === 1 && endN === 1;
    if (!good) ok = false;
    console.log(`${good ? "OK " : "BAD"} delete | anchors ${startN}/${endN} | ${start.slice(0, 40)}`);
    continue;
  }
  const s = score(repl);
  const good =
    s.len >= min && s.len <= 420 && !s.br && s.fig && startN === 1 && endN === 1;
  if (!good) ok = false;
  console.log(
    `${good ? "OK " : "BAD"} len ${s.len} (min ${min}) fig ${s.fig} backref ${s.br} score ${s.score.toFixed(2)} | anchors ${startN}/${endN} | ${start.slice(0, 40)}`,
  );
}

if (!ok) {
  console.log("GUARD FAILED — nothing written");
  process.exit(1);
}

if (!APPLY) {
  console.log("dry run OK — pass --apply to write");
  process.exit(0);
}

for (const [start, end, repl] of EDITS) {
  if (count(body, start) !== 1) {
    console.log(`ANCHOR NOT UNIQUE AT APPLY TIME: ${start} — nothing written`);
    process.exit(1);
  }
  const i = body.indexOf(start);
  const j = body.indexOf(end, i);
  if (j < 0) {
    console.log(`END ANCHOR NOT FOUND AFTER START AT APPLY TIME: ${end} — nothing written`);
    process.exit(1);
  }
  body = body.slice(0, i) + repl + body.slice(j + end.length);
}

const sectionsAfter = body.split("\n").filter((l) => l.startsWith("## ")).length;
if (sectionsAfter !== sectionsBefore) {
  console.log(`SECTION COUNT CHANGED ${sectionsBefore} -> ${sectionsAfter} — nothing written`);
  process.exit(1);
}

console.log(`words ${body.split(/\s+/).length} sections ${sectionsAfter}`);
await payload.update({ collection: "articles", id: ID, data: { body } });
console.log(`UPDATED ${ID}`);
process.exit(0);
