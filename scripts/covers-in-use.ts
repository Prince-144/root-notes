/**
 * Every cover already in use, so a new batch does not repeat one.
 *
 *   npx tsx --env-file=.env.local scripts/covers-in-use.ts
 *   npx tsx --env-file=.env.local scripts/covers-in-use.ts photo-1594915440248-1e419eba6611 ...
 *
 * With arguments it answers only whether those covers are taken, which is the
 * question a batch actually has. Selects one field, so the whole check costs a
 * few tens of kilobytes against a metered database.
 *
 * Covers sitting in draft scripts that were never inserted are not in here —
 * scripts/check-drafts-offline.ts is what compares a batch against those.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const asked = process.argv.slice(2).map((a) => a.match(/photo-\d+-[0-9a-z]+/)?.[0] ?? a);

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  limit: 0,
  depth: 0,
  select: { slug: true, coverImageUrl: true },
});

const used = new Map<string, string>();
for (const doc of docs) {
  const id = (doc.coverImageUrl ?? "").match(/photo-\d+-[0-9a-z]+/)?.[0];
  if (id) used.set(id, doc.slug);
}

if (asked.length === 0) {
  console.log(`${docs.length} articles, ${used.size} stock covers in use\n`);
  for (const [id, slug] of used) console.log(`${id}  ${slug}`);
} else {
  for (const id of asked) {
    const slug = used.get(id);
    console.log(`${slug ? "TAKEN by " + slug : "free"}  ${id}`);
  }
}

process.exit(0);
