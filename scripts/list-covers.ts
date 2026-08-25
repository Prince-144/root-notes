/**
 * Prints the Unsplash photo id of every article cover, so a new draft can pick
 * an unused one.
 *
 * It also names any id used by more than one article. The count line alone was
 * not enough: "145 distinct covers across 147 articles" says two covers are
 * reused but not which, and reusing a cover is the one rule this check exists
 * to enforce.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", limit: 500, depth: 0,
  select: { slug: true, status: true, coverImageUrl: true },
});

const bySlug = new Map<string, string[]>();
for (const d of docs) {
  const m = (d.coverImageUrl ?? "").match(/photo-[\w-]+/);
  if (!m) continue;
  const users = bySlug.get(m[0]) ?? [];
  users.push(`${d.slug} (${d.status})`);
  bySlug.set(m[0], users);
}

console.log([...bySlug.keys()].sort().join("\n"));
console.log(`\n${bySlug.size} distinct covers across ${docs.length} articles`);

const dupes = [...bySlug.entries()].filter(([, users]) => users.length > 1);
if (dupes.length === 0) {
  console.log("no cover is used twice");
} else {
  console.log(`\n${dupes.length} cover(s) used more than once:`);
  for (const [id, users] of dupes) {
    console.log(`  ${id}`);
    for (const u of users) console.log(`      ${u}`);
  }
}
process.exit(0);
