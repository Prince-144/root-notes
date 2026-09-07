/**
 * Corrects the N-central piece: N-able contradicts itself, not Huntress.
 *
 *   npx tsx --env-file=.env.local scripts/fix-n-central-self-contradiction.ts
 *   npx tsx --env-file=.env.local scripts/fix-n-central-self-contradiction.ts --apply
 *
 * The published version framed this as "the vendor and the hunters disagree,
 * and both can be right" — a vendor stating what it can prove, a hunting firm
 * reporting telemetry. Fuller reporting shows that is not the disagreement.
 *
 * N-able's release notes and status post say there are "no confirmations that
 * this vulnerability has been exploited in production environments". N-able's
 * incident notice says the flaw "has been observed being exploited in the
 * wild". Same company, same CVE. And Huntress does not claim exploitation at
 * all — it says it cannot determine from its own data whether CVE-2026-86218
 * was the vector in the 4 September compromise it investigated.
 *
 * Also adds what was missing: CVSS 10.0, the four-hotfix timeline across five
 * weeks (2 Aug, 6 Aug, 5 Sep, 6 Sep) starting from an incomplete fix, the
 * one-day gap between the last two, and the 31 July intrusion affecting "a
 * limited number of customers".
 *
 * Published article, so `publishedAt` is untouched. The body is replaced
 * wholesale rather than patched, because the argument changed.
 */
import { readFileSync } from "node:fs";
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "n-central-cve-2026-86218-unauthenticated-rce-in-the-box-that-manages-the-boxes";
const APPLY = process.argv.includes("--apply");

// The corrected article lives in the draft script, which is the source of
// truth for its text; pull it from there so the two cannot drift.
const source = readFileSync("scripts/draft-long-58.ts", "utf8");

function field(name: string): string {
  const start = source.indexOf(`slug: "${SLUG}"`);
  if (start === -1) throw new Error("article not found in draft-long-58.ts");
  const rest = source.slice(start);
  const marker = `${name}:`;
  const at = rest.indexOf(marker);
  if (at === -1) throw new Error(`${name} not found`);
  const after = rest.slice(at + marker.length).replace(/^\s*\n?\s*/, "");
  const quote = after[0];
  if (quote !== '"' && quote !== "`") throw new Error(`${name} is not a string literal`);
  let out = "";
  for (let i = 1; i < after.length; i += 1) {
    const ch = after[i];
    if (ch === "\\") {
      out += after[i + 1];
      i += 1;
      continue;
    }
    if (ch === quote) break;
    out += ch;
  }
  return out;
}

const title = field("title");
const excerpt = field("excerpt");
const body = field("body");

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  where: { slug: { equals: SLUG } },
  limit: 1,
});

const doc = docs[0];
if (!doc) {
  console.error(`no article with slug ${SLUG}`);
  process.exit(1);
}

console.log(`title:   ${doc.title}\n      -> ${title}`);
console.log(`body:    ${doc.body.length} -> ${body.length} chars`);

if (!body.includes("N-able's incident notice")) {
  console.error("extracted body does not contain the correction — aborting");
  process.exit(1);
}

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { title, excerpt, body } });
console.log("updated");
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
