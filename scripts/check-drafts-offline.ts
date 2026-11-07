/**
 * Checks a batch of drafts without touching the database.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-78.ts
 *
 * Written while the Neon project was suspended for exceeding its data-transfer
 * quota (16 September to 1 October 2026). check-mdx.ts and carousel-scores.ts
 * both read from the database, so drafts written in that window could not be
 * checked by them — and a draft that only fails after it is inserted, or after
 * it is published, is exactly the failure this is meant to catch early.
 *
 * The draft module has to export `drafts` and only touch the database when run
 * directly (see draft-long-78.ts). For each draft it checks:
 *
 *   - the body compiles with the article page's MDX pipeline;
 *   - the body has no backticks, angle brackets or braces, which break MDX;
 *   - the cover is not already used by another draft script, or by another
 *     draft in the same batch;
 *   - which three sections the Instagram carousel will pick, and the paragraph
 *     it will print for each — mirrored from scripts/instagram-carousel.ts,
 *     so keep the two in step.
 *
 * Covers used only on the live site and never in a script are not visible
 * here; check those against the site's listing pages separately.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  tags: string[];
  readingMinutes: number;
  coverImageUrl: string;
  body: string;
};

const target = process.argv[2];
if (!target) {
  console.error("usage: check-drafts-offline.ts <draft-module.ts>");
  process.exit(1);
}

const mod = (await import(pathToFileURL(path.resolve(target)).href)) as { drafts?: Draft[] };
if (!mod.drafts) {
  console.error(`${target} does not export drafts`);
  process.exit(1);
}
const drafts = mod.drafts;

// ---- carousel logic, mirrored from scripts/instagram-carousel.ts ----------

const POINT_SLIDES = 3;
const BACK_REFERENCE =
  /^(that|this|these|those|it|they|such|both|neither|and|but|so|because|which|then|also|again|instead|here)\b/i;

function clean(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\((?:[^()]|\([^()]*\))*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Two dots or more is a version string. One dot is usually a score or a
// quantity, and stripping those made CVSS numbers invisible to the scorer.
// Kept identical to the rule in instagram-carousel.ts, which is the one that
// decides what actually goes on a slide.
function figureCount(t: string): number {
  return (
    t
      .replace(/(?<![$€£])\b\d+(?:\.\d+){2,}\b/g, " ")
      .match(/(?<![\w.])[$€£]?\d[\d,]*(?:\.\d+)?%?(?![\w]|\.\d)/g) ?? []
  ).length;
}

function paragraphScore(p: string): number {
  const t = clean(p);
  return (
    (figureCount(t) > 0 ? 3 : 0) +
    Math.min(t.length, 420) / 100 -
    (BACK_REFERENCE.test(t) ? 5 : 0) -
    (t.length > 420 ? 4 : 0)
  );
}

type Section = {
  heading: string;
  text: string;
  isQuote: boolean;
  winner: number;
  leadsWithList: boolean;
};

/**
 * True when the section's first block is a list.
 *
 * Lists are never slide candidates — the eligible filter drops them, because
 * clean() flattens one into a run-on sentence that overflows. That is right,
 * and it has a consequence worth surfacing: a section whose whole point is the
 * list gets its slide from whatever prose follows, so the slide carries a
 * heading promising the list and a body that is an aside.
 *
 * It has happened twice. "Five vendors, five totals" rendered with none of the
 * totals on it, and "What actually happened" rendered without the timeline.
 * Both were caught by eye afterwards and fixed in the article by leading the
 * section with the same content in prose.
 *
 * Not an error. Plenty of sections mention a list in passing and the prose
 * after it is genuinely the point. It is a flag to look at, printed against
 * the slide it affects.
 */
function leadsWithList(paragraphs: string[]): boolean {
  return /^([-*+] |\d+\. )/.test(paragraphs[0] ?? "");
}


function sections(body: string): Section[] {
  const out: Section[] = [];
  for (const block of body.split(/\n(?=## )/)) {
    const match = block.match(/^## (.+)/);
    if (!match) continue;
    const paragraphs = block
      .slice(match[0].length)
      .trim()
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    const quote = paragraphs.find((p) => p.startsWith(">"));
    const eligible = paragraphs.filter(
      (p) =>
        !/^([|>`#]|!\[|[-*+] |\d+\. )/.test(p) && !p.endsWith(":") && clean(p).length > 40,
    );
    const prose = eligible.slice().sort((a, b) => paragraphScore(b) - paragraphScore(a))[0];
    const chosen =
      quote && (!prose || paragraphScore(quote) + 1.5 >= paragraphScore(prose))
        ? quote
        : (prose ?? quote);
    if (!chosen) continue;
    out.push({
      heading: match[1].trim(),
      text: clean(chosen.replace(/^>\s?/gm, "")),
      isQuote: chosen === quote,
      winner: paragraphScore(chosen),
      leadsWithList: leadsWithList(paragraphs),
    });
  }
  return out;
}

function sectionScore(s: Section): number {
  return (
    (figureCount(s.text) > 0 ? 3 : 0) +
    (s.isQuote ? 1 : 0) +
    Math.min(s.text.length, 400) / 200 -
    (s.text.length < 140 ? 4 : 0)
  );
}

// ---- covers already used by other draft scripts ---------------------------

const used = new Map<string, string>();
for (const f of readdirSync("scripts").filter((n) => /^draft-.*\.ts$/.test(n))) {
  if (path.resolve("scripts", f) === path.resolve(target)) continue;
  for (const m of readFileSync(path.join("scripts", f), "utf8").matchAll(/photo-\d+-[0-9a-f]+/g)) {
    used.set(m[0], f);
  }
}

// ---- checks ---------------------------------------------------------------

let problems = 0;
const inBatch = new Map<string, string>();

for (const d of drafts) {
  const issues: string[] = [];

  for (const [ch, name] of [
    ["`", "backtick"],
    ["<", "angle bracket"],
    [">", "angle bracket"],
    ["{", "brace"],
    ["}", "brace"],
  ] as const) {
    if (d.body.includes(ch)) issues.push(`body contains a ${name} (${ch})`);
  }

  try {
    await compile(d.body, { remarkPlugins: [remarkGfm] });
  } catch (err) {
    issues.push(`MDX compile failed: ${(err as Error).message.split("\n")[0]}`);
  }

  const cover = d.coverImageUrl.match(/photo-\d+-[0-9a-f]+/)?.[0];
  if (cover && used.has(cover)) issues.push(`cover ${cover} already used in ${used.get(cover)}`);
  if (cover && inBatch.has(cover)) issues.push(`cover ${cover} repeats ${inBatch.get(cover)}`);
  if (cover) inBatch.set(cover, d.slug);

  const words = d.body.split(/\s+/).length;
  console.log(`\n=== ${d.slug}`);
  console.log(`    ${words} words, excerpt ${d.excerpt.length} chars, category ${d.categorySlug}`);

  const secs = sections(d.body);
  const picked = new Set(
    secs
      .map((s, i) => ({ i, score: sectionScore(s) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, POINT_SLIDES)
      .map((x) => x.i),
  );
  secs.forEach((s, i) => {
    const mark = picked.has(i) ? "CARD" : "    ";
    console.log(
      `    ${mark} ${sectionScore(s).toFixed(2)}  (para ${s.winner.toFixed(2)}, ${s.text.length} chars)  ## ${s.heading}`,
    );
    if (picked.has(i)) {
      console.log(`           "${s.text.slice(0, 110)}…"`);
      if (s.leadsWithList) {
        console.log(
          "           ^ section opens with a list, which cannot go on a slide." +
            " Check the heading still describes what the slide says.",
        );
      }
    }
  });

  if (issues.length) {
    problems += issues.length;
    for (const issue of issues) console.log(`    PROBLEM: ${issue}`);
  }
}

console.log(problems === 0 ? `\nall ${drafts.length} drafts pass` : `\n${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
