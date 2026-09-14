/**
 * Reshapes two carousel cards in article 296 (Fields Medallists declaration).
 *
 * The article's thesis — that solving problems is a proxy for understanding,
 * and optimising a proxy separates it from what it stood for — scored lowest
 * of the four sections and dropped out. The paragraph that states it best
 * opened on "That" and ran to 429 characters, so it took both penalties. The
 * "What actually gets skipped" card opened on "Strip those away", where
 * "those" is a bullet list the card does not show.
 *
 * The proxy rewrite absorbs the bare-quote paragraph above it, so the article
 * loses a paragraph rather than gaining a restatement. The counter-argument
 * card already stands alone and is left untouched.
 *
 * Anchors must each occur exactly once, every replacement must fit the
 * 360-420 band with a figure and no back-reference opener, and the section
 * count must not change — or nothing is written.
 *
 *   npx tsx --env-file=.env.local scripts/fix-296-carousel-cards.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/fix-296-carousel-cards.ts --apply
 */
import { getPayload } from "payload";
import config from "@payload-config";

const ID = 296;
const APPLY = process.argv.includes("--apply");

/** [start anchor, end anchor, replacement]. Empty replacement deletes. */
const EDITS: [string, string, string][] = [
  [
    "The declaration's argument is that",
    "what it was standing in for.",
    `The declaration, signed by **25** Fields Medallists, argues that **"solving problems is only a tool and proxy for achieving the primary goal of conceptual understanding and insight."** A discipline picks a measurable thing that tracks what it actually wants — patch counts for security, benchmark scores for capability. Optimise the proxy hard enough and it separates from what it was standing in for.`,
  ],
  [
    "Strip those away and you have an answer",
    "as the tools change the practice.",
    `Write-up, method and citation are what make a result useful to anyone other than its author: how a proof gets checked, how an answer becomes a technique, how the next person finds the line of work. Strip those **3** away and you have an answer without a discipline around it, which is why the declaration calls for urgent action from mathematicians, AI companies and society.`,
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
