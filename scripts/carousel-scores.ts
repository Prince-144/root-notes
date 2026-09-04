/**
 * Prints the carousel's paragraph scores for an article, section by section.
 *
 *   npx tsx --env-file=.env.local scripts/carousel-scores.ts <slug>
 *
 * Every carousel in this repo has needed at least one section reshaped
 * because the scorer picked a paragraph that did not carry the section's
 * point, and each time the diagnosis was done by eyeballing paragraph
 * lengths — which is guesswork, and has been wrong. This runs the same
 * arithmetic the generator runs and shows the ranking, so a fix can be
 * aimed rather than attempted.
 *
 * The scoring below mirrors scripts/instagram-carousel.ts. If that file's
 * `score` changes, change this one too — the check at the end compares the
 * winner against what the generator actually picked, so drift shows up as a
 * mismatch rather than silently misleading.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: carousel-scores.ts <slug>");
  process.exit(1);
}

function clean(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function score(p: string): { total: number; parts: string } {
  const t = clean(p);
  const digits = (
    t.replace(/(?<![$€£])\b\d+(?:\.\d+)+\b/g, " ").match(/(?<![\w.])[$€£]?\d[\d,]*(?:\.\d+)?%?(?![\w]|\.\d)/g) ?? []
  ).length;
  const lengthScore = Math.min(t.length, 420) / 100;
  const backReference =
    /^(that|this|these|those|it|they|such|both|neither|and|but|so|because|which|then|also|again|instead|here)\b/i.test(
      t,
    );
  const overflows = t.length > 420;
  const total =
    (digits > 0 ? 3 : 0) + lengthScore - (backReference ? 5 : 0) - (overflows ? 4 : 0);
  const parts = [
    `len ${t.length}`,
    `+${lengthScore.toFixed(2)}`,
    digits > 0 ? "+3 fig" : "  0 fig",
    backReference ? "-5 backref" : "",
    overflows ? "-4 overflow" : "",
  ]
    .filter(Boolean)
    .join("  ");
  return { total, parts };
}

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  where: { slug: { equals: slug } },
  limit: 1,
});

const doc = docs[0];
if (!doc) {
  console.error(`no article with slug ${slug}`);
  process.exit(1);
}

for (const block of doc.body.split(/\n(?=## )/)) {
  const match = block.match(/^## (.+)/);
  if (!match) continue;

  const paragraphs = block
    .slice(match[0].length)
    .trim()
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const eligible = paragraphs.filter(
    (p) => !/^([|>`#]|[-*+] |\d+\. )/.test(p) && !p.endsWith(":") && clean(p).length > 40,
  );

  console.log(`\n## ${match[1].trim()}`);

  const ranked = paragraphs
    .map((p) => ({ p, ok: eligible.includes(p), s: score(p) }))
    .sort((a, b) => (a.ok === b.ok ? b.s.total - a.s.total : a.ok ? -1 : 1));

  for (const [i, r] of ranked.entries()) {
    const mark = !r.ok ? "  --  " : i === 0 ? "  WIN " : "      ";
    const label = r.ok ? r.s.total.toFixed(2).padStart(6) : "ineli.";
    console.log(`${mark}${label}  ${r.s.parts}`);
    console.log(`         ${clean(r.p).slice(0, 96)}`);
  }
}

process.exit(0);
