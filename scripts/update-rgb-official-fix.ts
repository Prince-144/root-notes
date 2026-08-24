/**
 * Update for a published article.
 *
 * /article/windows-kb5121003-rgb-lighting-inpoutx64-driver-crashes went live on
 * 23 August saying Microsoft had not published an official workaround, and
 * pointing readers at the community one: delete the inpoutx64 file from the
 * Windows drivers folder.
 *
 * On 24 August Microsoft published an official workaround — set the Start value
 * of the inpoutx64 service to 4 in the registry. That matters to a reader
 * rather than being housekeeping: disabling a service is reversible, deleting a
 * driver file is not, and the article currently recommends the second.
 *
 * Adds a dated update note and rewrites the two passages that are now wrong.
 * publishedAt is preserved by the beforeChange hook.
 *
 * Dry run by default; pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "windows-kb5121003-rgb-lighting-inpoutx64-driver-crashes";

const NOTE = `> **Update, 24 August 2026:** Microsoft has now published an official workaround. Rather than deleting the driver, set the **Start** value under **HKEY_LOCAL_MACHINE\\\\SYSTEM\\\\CurrentControlSet\\\\Services\\\\inpoutx64** to **4** and restart. Prefer this to the community fix below — disabling a service can be undone, deleting a file cannot. Microsoft warns it can still cause unintended behaviour such as RGB features not working, and says it is still working out the relationship between the components and the games.

`;

const REPLACEMENTS: Array<[string, string]> = [
  [
    "- **Treat the delete-the-driver workaround as temporary.** It is a community fix, it will break your lighting control, and Microsoft has not published an official one.",
    "- **Use Microsoft's registry workaround rather than deleting the file.** Setting the service's Start value to 4 disables the driver and can be reversed; removing the file cannot. Either way your lighting control stops working.",
  ],
  [
    "- **When an official fix arrives.** No date given.",
    "- **When a permanent fix arrives.** Microsoft has published a workaround but no date for an actual fix.",
  ],
];

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) {
  console.error(`no article with slug "${SLUG}"`);
  process.exit(1);
}
if (doc.body.startsWith("> **Update,")) {
  console.log("already updated — nothing to do");
  process.exit(0);
}

let body = doc.body;
for (const [from, to] of REPLACEMENTS) {
  if (!body.includes(from)) {
    console.error(`could not find the passage to replace:\n---\n${from.slice(0, 90)}...\n---`);
    console.error("the body has changed since this script was written; re-read it first");
    process.exit(1);
  }
  body = body.replace(from, to);
}
body = NOTE + body;

console.log(`status: ${doc.status}`);
console.log(`words:  ${doc.body.split(/\s+/).length} -> ${body.split(/\s+/).length}`);
console.log(`changes: update note prepended, plus 2 passages rewritten\n`);

if (!APPLY) {
  console.log("dry run — pass --apply to write this to the live article");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("applied. redeploy for the change to reach rootnotes.in.");
process.exit(0);
