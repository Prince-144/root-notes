/**
 * Throwaway: rewrites three carousel-winning paragraphs in article 289.
 *
 * Every replacement is bounded by a start and end anchor, and the script
 * refuses to write unless each anchor occurs exactly once in the body. That
 * check exists because an earlier edit matched an anchor inside a markdown
 * table row rather than the intended paragraph and silently deleted two
 * sections of article 291. Bold markers matter: "any operating system" does
 * not appear in the source, "any **operating system**" does.
 *
 *   npx tsx --env-file=.env.local scripts/tmp-check-289.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/tmp-check-289.ts --apply
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");

/** [start anchor, end anchor, replacement] — anchors are inclusive bounds. */
const EDITS: [string, string, string][] = [
  [
    "Under AB 1856, any",
    "minimum necessary.",
    `Under AB 1856, any **operating system** with an account setup feature must ask the account holder at setup for the birth date, age, or both of the device's primary user. The operating system then produces a signal — **"age bracket data"** — in **4** brackets: under 13, 13 to 15, 16 to 17, and 18 or older. App stores pass it along, and developers must treat it as the primary indicator of a user's age range.`,
  ],
  [
    "The operative definition is narrower",
    "not in the prohibition.",
    `The operative definition is narrower than the coverage suggested. An **addictive feature** under section 22682 is an **addictive feed** or **autoplay**, and an addictive feed is one where content is recommended, selected or prioritised using information about the user, with **7** exceptions. **Infinite scroll** and **notifications** appear in the bill's findings, not in the prohibition.`,
  ],
  [
    "That last clause is where",
    "itself the danger.",
    `The parent alert is where the headlines ran ahead of the text. On a **"credible and imminent threat"** the operator must either notify a parent, only if that notification does not risk serious harm to the child, or give the child streamlined access to the **988** crisis line. It is a choice, not a guaranteed alert — with an explicit exception for the children for whom telling a parent is itself the danger.`,
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
  where: { id: { equals: 289 } },
  limit: 1,
});
let body = res.docs[0].body as string;

let ok = true;

for (const [start, end, repl] of EDITS) {
  const s = score(repl);
  const startN = body.split(start).length - 1;
  const endN = body.split(end).length - 1;
  const good =
    s.len >= 360 && s.len <= 420 && !s.br && s.fig && startN === 1 && endN === 1;
  if (!good) ok = false;
  console.log(
    `${good ? "OK " : "BAD"} len ${s.len} fig ${s.fig} backref ${s.br} score ${s.score.toFixed(2)} | anchors ${startN}/${endN} | ${start.slice(0, 34)}`,
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

const heads = body.split("\n").filter((l) => l.startsWith("## "));
console.log(`words ${body.split(/\s+/).length} sections ${heads.length}`);

await payload.update({ collection: "articles", id: 289, data: { body } });
console.log("UPDATED 289");
process.exit(0);
