/**
 * Reshapes three carousel cards in article 302 (passkey-themed vishing).
 *
 * The title's claim lives in "Two ways in, neither of them a passkey", and
 * that section scored lowest of five: the two routes sit in an ineligible
 * bullet list, and the paragraph explaining why a passkey closes neither
 * opened on "This is why", taking the back-reference penalty. The "Then
 * Graph, then files" winner opened on "Collection follows" and never
 * mentioned Graph. "Who is behind it" said "the same initial-access
 * technique" without the card ever naming one.
 *
 * Each edit rewrites a paragraph in place; nothing is added or restated.
 *
 * Guards, any failure writes nothing: every anchor occurs exactly once;
 * every replacement has a figure, no back-reference opener, and fits its
 * length band (360-420 for rebuilt cards, a lower floor for the one-clause
 * wording fix); the section count does not change.
 *
 *   npx tsx --env-file=.env.local scripts/fix-302-carousel-cards.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/fix-302-carousel-cards.ts --apply
 */
import { getPayload } from "payload";
import config from "@payload-config";

const ID = 302;
const APPLY = process.argv.includes("--apply");

/** [start anchor, end anchor, replacement, minimum length]. */
const EDITS: [string, string, string, number][] = [
  [
    "This is why the theme is clever.",
    "just as readily as a password would.",
    `The passkey theme works because both routes survive it. A passkey is bound to the real site, so it defeats the **relayed sign-in**, but only if the account no longer accepts anything weaker. And a **device-code approval** happens on Microsoft's genuine page, where a passkey completes it just as readily as a password would. Of the **2** routes, a passkey alone closes neither.`,
    360,
  ],
  [
    "Collection follows from SharePoint",
    "to blend in with normal use.",
    `Having mapped the tenant through **Microsoft Graph**, the attackers collect from SharePoint, OneDrive and, in some intrusions, Exchange Online through its REST interface, with the python-httpx user agent showing up in several cases. The pace is deliberate: fewer than **1,000** files or emails in any hour, over periods from several hours to days, to blend in with normal use.`,
    360,
  ],
  [
    "Microsoft says the same initial-access technique",
    "operate under the Helix name.",
    `Microsoft says the passkey-themed calls are an initial-access technique shared by several actors in one extortion ecosystem. It names **Storm-3121**, whose access leads to ShinyHunters and Falcon extortion, and **Storm-3032**, a set of actors that split from the BlackFile group and now operate under the Helix name.`,
    280,
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
  const startN = body.split(start).length - 1;
  const endN = body.split(end).length - 1;
  const s = score(repl);
  const good =
    s.len >= min && s.len <= 420 && !s.br && s.fig && startN === 1 && endN === 1;
  if (!good) ok = false;
  console.log(
    `${good ? "OK " : "BAD"} len ${s.len} (min ${min}) fig ${s.fig} backref ${s.br} score ${s.score.toFixed(2)} | anchors ${startN}/${endN} | ${start.slice(0, 36)}`,
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
  const i = body.indexOf(start);
  const j = body.indexOf(end, i);
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
