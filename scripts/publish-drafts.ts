/**
 * Publishes drafts.
 *
 *   npx tsx --env-file=.env.local scripts/publish-drafts.ts            # list only
 *   npx tsx --env-file=.env.local scripts/publish-drafts.ts --apply    # publish all drafts
 *   npx tsx --env-file=.env.local scripts/publish-drafts.ts --apply <slug> <slug>
 *
 * Dry-run by default, like the other write scripts here — publishing is the one
 * irreversible-feeling action in this repo, because the afterChange hook pings
 * IndexNow on the draft -> published transition and that cannot be recalled.
 *
 * `publishedAt` is left alone: the collection's beforeChange hook stamps it at
 * the moment of the transition, and setting it here would look like a
 * deliberate backdate and suppress that.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "articles",
  where: slugs.length
    ? { and: [{ status: { equals: "draft" } }, { slug: { in: slugs } }] }
    : { status: { equals: "draft" } },
  limit: 100,
  depth: 0,
  sort: "id",
});

if (docs.length === 0) {
  console.log(slugs.length ? "no drafts matched those slugs" : "no drafts to publish");
  process.exit(0);
}

// Named slugs that do not exist as drafts are worth saying out loud — a typo
// would otherwise look like a successful no-op.
if (slugs.length) {
  const found = new Set(docs.map((d) => d.slug));
  for (const s of slugs) if (!found.has(s)) console.warn(`  not a draft (skipped): ${s}`);
}

console.log(`${APPLY ? "publishing" : "would publish"} ${docs.length}:`);
for (const doc of docs) {
  console.log(`  ${doc.id}  ${doc.categorySlug.padEnd(9)}  ${doc.slug}`);
}

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to publish");
  process.exit(0);
}

for (const doc of docs) {
  await payload.update({
    collection: "articles",
    id: doc.id,
    data: { status: "published" },
  });
  console.log(`published: ${doc.slug}`);
}

console.log(`\n${docs.length} published`);

// The afterChange hook fires submitToIndexNow without awaiting it — harmless
// inside a server request, fatal in a script, because process.exit() kills the
// ping mid-flight and the search engines are never told. The first run of this
// script did exactly that. Give it room to land before exiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
