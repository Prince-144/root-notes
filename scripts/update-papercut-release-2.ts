/**
 * Second update for a published article.
 *
 * /article/papercut-zero-day-missing-logs-are-the-indicator already carries a
 * dated note adding the two CVEs and the exploitation chain. PaperCut has since
 * released a second emergency patch, because researchers found bypasses for the
 * first one — which means anybody who acted on the earlier note is not done.
 *
 * Appended as a second dated line rather than rewritten, so the record of what
 * was known when stays intact.
 *
 * publishedAt is preserved by the beforeChange hook.
 *
 * Dry run by default; pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "papercut-zero-day-missing-logs-are-the-indicator";

const MARKER = "**Second update:**";
const NOTE = `> **Second update:** **The first emergency patch was bypassed.** Researchers at **watchTowr** and **Huntress** found multiple ways around it, and watchTowr identified a further authentication vulnerability in the process. PaperCut has released **Emergency Patch Release 2**, covering NG and MF versions **24**, **25** and **26** on Windows, Linux and macOS. In the company's words, following further work with its internal security team and external researchers including Huntress and watchTowr, it has released an updated emergency patch that includes additional hardening beyond the original. **Applying the first patch is not sufficient.** The bypass techniques have not been described publicly.

`;

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) { console.error(`no article with slug "${SLUG}"`); process.exit(1); }
if (doc.body.includes(MARKER)) { console.log("already updated — nothing to do"); process.exit(0); }
if (!doc.body.startsWith("> **Update,")) {
  console.error("expected the first update note at the top; the body is not what this script assumes");
  process.exit(1);
}

// Insert after the existing note block, so the notes read in the order they
// were written rather than newest-first above older context.
const firstBlockEnd = doc.body.indexOf("\n\n", doc.body.lastIndexOf("> ", doc.body.indexOf("\n\n> ") + 1));
const idx = doc.body.indexOf("\n\n", doc.body.search(/\n(?!>)/) === -1 ? 0 : doc.body.split("\n").findIndex((l) => !l.startsWith(">")));
const lines = doc.body.split("\n");
let cut = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith(">") || lines[i].trim() === "") { cut = i + 1; } else { break; }
}
const body = lines.slice(0, cut).join("\n") + NOTE + lines.slice(cut).join("\n");

console.log(`status: ${doc.status}`);
console.log(`words:  ${doc.body.split(/\s+/).length} -> ${body.split(/\s+/).length}`);
console.log(`changes: second dated note inserted after the existing one`);
if (!APPLY) { console.log("\ndry run — pass --apply to write"); process.exit(0); }
await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("applied. redeploy for the change to reach rootnotes.in.");
process.exit(0);
