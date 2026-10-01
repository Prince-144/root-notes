/**
 * Which slugs from a draft script are already in the database.
 *
 *   npx tsx --env-file=.env.local scripts/draft-status.ts scripts/draft-long-77.ts
 *
 * Batches pile up whenever inserting is not possible — the database spent a
 * fortnight suspended over its transfer quota in September 2026 — and running
 * a batch twice creates duplicates. This answers which of them still need to
 * go in, for a few hundred bytes of query.
 *
 * Slugs are read out of the file text rather than by importing it: the older
 * batch scripts insert as soon as they are imported, which is the thing this
 * exists to check before doing.
 */
import { readFileSync } from "node:fs";
import { getPayload } from "payload";
import config from "@payload-config";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: draft-status.ts <draft-file...>");
  process.exit(1);
}

const payload = await getPayload({ config });

for (const file of files) {
  const slugs = [...readFileSync(file, "utf8").matchAll(/^\s+slug: "([^"]+)"/gm)].map((m) => m[1]);

  const { docs } = await payload.find({
    collection: "articles",
    where: { slug: { in: slugs } },
    limit: slugs.length || 1,
    depth: 0,
    select: { slug: true, status: true, publishedAt: true, updatedAt: true },
  });

  const found = new Map(
    docs.map((d) => [d.slug as string, d as { status: string; updatedAt?: string }]),
  );

  console.log(`\n${file} — ${slugs.length} slugs, ${found.size} already in the database`);
  for (const slug of slugs) {
    const doc = found.get(slug);
    // Last edit included, because a status that changed after insertion is
    // somebody working in the admin panel rather than a script.
    const edited = doc?.updatedAt ? new Date(doc.updatedAt).toISOString().slice(0, 19) : "";
    console.log(`  ${(doc?.status ?? "MISSING").padEnd(9)} ${edited.padEnd(20)} ${slug}`);
  }
}

process.exit(0);
