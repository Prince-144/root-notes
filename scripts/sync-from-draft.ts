/**
 * Pushes an article's text from its draft script to a published record.
 *
 *   npx tsx --env-file=.env.local scripts/sync-from-draft.ts <slug> <script>
 *   npx tsx --env-file=.env.local scripts/sync-from-draft.ts <slug> <script> --apply
 *
 * The draft scripts refuse to touch a published article, which is the right
 * default — but news moves, and twice now a published piece has needed its
 * text replaced wholesale rather than patched: the N-central piece when the
 * vendor turned out to contradict itself, and the StyleSmuggler piece when
 * Adobe shipped the patch its headline said did not exist.
 *
 * Both times the fix was a one-off script carrying a duplicate copy of the
 * article. That is how the script and the live record drift apart. This reads
 * the text out of the draft script instead, so there stays exactly one source
 * for it.
 *
 * `publishedAt` is never touched — this updates what the piece says, not when
 * it ran.
 */
import { readFileSync } from "node:fs";
import { getPayload } from "payload";
import config from "@payload-config";

const [slug, scriptPath] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const APPLY = process.argv.includes("--apply");

if (!slug || !scriptPath) {
  console.error("usage: sync-from-draft.ts <slug> <path-to-draft-script> [--apply]");
  process.exit(1);
}

const source = readFileSync(scriptPath, "utf8");

/**
 * Pulls one string field out of the entry whose slug matches.
 *
 * Walks the literal character by character rather than using a regex, because
 * the bodies are template literals full of quotes, apostrophes and newlines,
 * and any pattern short enough to read would stop at the wrong one. Escapes
 * are unwrapped so \` inside a body survives the round trip.
 */
function field(name: string): string {
  const start = source.indexOf(`slug: "${slug}"`);
  if (start === -1) throw new Error(`no entry with slug ${slug} in ${scriptPath}`);

  const rest = source.slice(start);
  const at = rest.indexOf(`${name}:`);
  if (at === -1) throw new Error(`${name} not found for ${slug}`);

  const after = rest.slice(at + name.length + 1).replace(/^\s*\n?\s*/, "");
  const quote = after[0];
  if (quote !== '"' && quote !== "`") {
    throw new Error(`${name} is not a string literal`);
  }

  let out = "";
  for (let i = 1; i < after.length; i += 1) {
    const ch = after[i];
    if (ch === "\\") {
      out += after[i + 1];
      i += 1;
      continue;
    }
    if (ch === quote) return out;
    out += ch;
  }
  throw new Error(`unterminated ${name} for ${slug}`);
}

const title = field("title");
const excerpt = field("excerpt");
const body = field("body");

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

const changed =
  doc.title !== title || doc.excerpt !== excerpt || doc.body !== body;

console.log(`${slug} (${doc.status}, id ${doc.id})`);
console.log(`  title    ${doc.title === title ? "unchanged" : "CHANGED"}`);
if (doc.title !== title) console.log(`           -> ${title}`);
console.log(`  excerpt  ${doc.excerpt === excerpt ? "unchanged" : "CHANGED"}`);
console.log(`  body     ${doc.body.length} -> ${body.length} chars`);

if (!changed) {
  console.log("\nnothing to do");
  process.exit(0);
}

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({
  collection: "articles",
  id: doc.id,
  data: { title, excerpt, body },
});
console.log("\nupdated");

// The afterChange hook fires revalidate and IndexNow without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
