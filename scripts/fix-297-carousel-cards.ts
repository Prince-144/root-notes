/**
 * Reshapes three carousel cards in article 297 (CERT Polska / MikroTrick).
 *
 * Every section scored without a figure, so the generator picked the three
 * longest winners: the lab set-up, the model limits, and the in-patch
 * detector. That dropped the two points the excerpt is built on — that the
 * technique which worked is the shape of the bugs it found, and that CISA's
 * catalogue lists the second half of the chain but not the first — and the
 * model-limits card opened on "in there", whose antecedent is a quote the
 * card does not show.
 *
 * Each rewrite replaces the section's closing synthesis paragraph, so the
 * article gains no restatement. Anchors must each occur exactly once or
 * nothing is written; see fix-289-carousel-cards.ts for why.
 *
 *   npx tsx --env-file=.env.local scripts/fix-297-carousel-cards.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/fix-297-carousel-cards.ts --apply
 */
import { getPayload } from "payload";
import config from "@payload-config";

const ID = 297;
const APPLY = process.argv.includes("--apply");

/** [start anchor, end anchor, replacement]. Empty replacement deletes. */
const EDITS: [string, string, string][] = [
  [
    "This is a single bug class found five times",
    "more interesting result than the raw count.",
    `The method CERT Polska found most effective was **modelling protocols as state machines** and checking what happens when a stage is skipped, repeated or run in the wrong order. That is also the bug class it kept finding: **5** of the flaws are a step taken out of order, where the protocol has a sequence the implementation does not enforce, so something possible only later becomes possible earlier.`,
  ],
  [
    "Three specific things in there are worth keeping",
    "reproducing this pipeline in a hurry.",
    `Every hypothesis needed **4** checks: confirmation on a real RouterOS system, **negative control tests**, repetition on a machine in a clean state, and an impact assessment by the researchers. Those are the defences against a model that produces a confident, plausible, wrong finding — and they are the steps most likely to be dropped by anyone reproducing this pipeline in a hurry.`,
  ],
  [
    "So the catalogue names the escalation",
    "the confirmed attacks start with.",
    `CISA's catalogue names **CVE-2026-86060**, the second half of the MikroTrick chain, and **CVE-2026-67277**, a bandwidth-test memory disclosure that is not part of the chain at all. It omits **CVE-2026-67276**, the SSH authentication bypass the confirmed attacks start with. Anyone who triages from the catalogue rather than from the vendor is pointed at the second step of the chain, not the first.`,
  ],
  // The last sentence of the card above now carries this paragraph's point.
  ["But plenty of organisations triage", "and not the first.", ""],
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

for (const [start, end, repl] of EDITS) {
  const startN = body.split(start).length - 1;
  const endN = body.split(end).length - 1;
  if (repl === "") {
    const good = startN === 1 && endN === 1;
    if (!good) ok = false;
    console.log(`${good ? "OK " : "BAD"} delete | anchors ${startN}/${endN} | ${start.slice(0, 36)}`);
    continue;
  }
  const s = score(repl);
  const good =
    s.len >= 360 && s.len <= 420 && !s.br && s.fig && startN === 1 && endN === 1;
  if (!good) ok = false;
  console.log(
    `${good ? "OK " : "BAD"} len ${s.len} fig ${s.fig} backref ${s.br} score ${s.score.toFixed(2)} | anchors ${startN}/${endN} | ${start.slice(0, 36)}`,
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
body = body.replace(/\n{3,}/g, "\n\n");

const sectionsAfter = body.split("\n").filter((l) => l.startsWith("## ")).length;
if (sectionsAfter !== sectionsBefore) {
  console.log(`SECTION COUNT CHANGED ${sectionsBefore} -> ${sectionsAfter} — nothing written`);
  process.exit(1);
}

console.log(`words ${body.split(/\s+/).length} sections ${sectionsAfter}`);
await payload.update({ collection: "articles", id: ID, data: { body } });
console.log(`UPDATED ${ID}`);
process.exit(0);
