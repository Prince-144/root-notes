/**
 * Proves the JSON-LD serialiser cannot be used to break out of its own
 * `<script>` block.
 *
 * The structured data on every article page is built from CMS fields — title,
 * excerpt, tags, author — and injected with `dangerouslySetInnerHTML`. Plain
 * `JSON.stringify` leaves `<` alone, so a title containing `</script>` ends the
 * block and the rest of the value is parsed as HTML. The site's CSP allows
 * `'unsafe-inline'` for analytics, so an injected `<script>` there executes.
 *
 * Run: npx tsx scripts/check-json-ld-escaping.ts
 */
import { jsonLd } from "@/lib/json-ld";

const payload = {
  headline: "Breach at </script><img src=x onerror=alert(1)>",
  description: "Ampersand & angle > brackets < everywhere",
  keywords: ["<!--", "-->", "</SCRIPT >"],
};

const rendered = jsonLd(payload);
const checks: [string, boolean][] = [
  ["no raw '<' survives", !rendered.includes("<")],
  ["no raw '>' survives", !rendered.includes(">")],
  ["no raw '&' survives", !rendered.includes("&")],
  ["still parses as JSON", JSON.parse(rendered).headline === payload.headline],
  [
    "value is unchanged for JSON readers",
    JSON.stringify(JSON.parse(rendered)) === JSON.stringify(payload),
  ],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}`);
  if (!ok) failed += 1;
}
console.log(`\nrendered: ${rendered}`);

if (failed > 0) {
  console.error(`\n${failed} check(s) failed — the JSON-LD sink is injectable.`);
  process.exit(1);
}
console.log("\nJSON-LD escaping holds.");
