/**
 * A bare "<" before a digit is valid prose ("<1,000 roles") and invalid MDX —
 * the compiler reads it as the start of a JSX tag and the whole page fails.
 * One published article was returning 500 because of it.
 *
 * Escapes those to &lt; everywhere except inside fenced blocks and inline code,
 * where MDX does not parse tags.
 *
 * Pass --apply to write; dry run otherwise.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "articles",
  limit: 300,
  depth: 0,
  select: { slug: true, status: true, body: true },
});

function escapeLine(line: string): string {
  // Protect inline code spans, escape the rest, then put them back.
  const spans: string[] = [];
  const masked = line.replace(/`[^`]*`/g, (m) => {
    spans.push(m);
    return `\u0000${spans.length - 1}\u0000`;
  });
  const fixed = masked.replace(/<(?=[0-9=\s])/g, "&lt;");
  return fixed.replace(/\u0000(\d+)\u0000/g, (_, i) => spans[Number(i)]);
}

let touched = 0;
for (const d of docs as any[]) {
  let inFence = false;
  let changed = false;
  const out = d.body.split("\n").map((line: string) => {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      return line;
    }
    if (inFence) return line;
    const fixed = escapeLine(line);
    if (fixed !== line) {
      changed = true;
      console.log(`  ${d.slug}\n    - ${line.trim().slice(0, 130)}\n    + ${fixed.trim().slice(0, 130)}`);
    }
    return fixed;
  });

  if (!changed) continue;
  touched += 1;
  if (APPLY) {
    await payload.update({ collection: "articles", id: d.id, data: { body: out.join("\n") } });
  }
}

console.log(`\n${APPLY ? "fixed" : "would fix"}: ${touched} article(s)`);
process.exit(0);
