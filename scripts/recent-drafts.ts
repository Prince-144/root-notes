/**
 * Lists the most recently created articles, with whether a cover is attached.
 *
 *   npx tsx --env-file=.env.local scripts/recent-drafts.ts
 *   npx tsx --env-file=.env.local scripts/recent-drafts.ts 20
 *
 * Written to check what an unattended run actually put in the database,
 * without needing to read its logs. It is read-only and selects only the
 * few columns it prints, because the database is metered.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const limit = Number(process.argv[2] ?? 12);

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "articles",
  sort: "-createdAt",
  limit,
  depth: 0,
  select: {
    slug: true,
    title: true,
    status: true,
    categorySlug: true,
    coverImage: true,
    coverImageUrl: true,
    createdAt: true,
  },
});

console.log(`${docs.length} most recent articles, newest first:\n`);

for (const d of docs) {
  const created = new Date(d.createdAt).toISOString().replace("T", " ").slice(0, 16);
  const cover = d.coverImage ? `upload ${String(d.coverImage)}` : (d.coverImageUrl ?? "NONE");
  console.log(
    `${String(d.id).padStart(4)}  ${created}  ${d.status.padEnd(9)} ${String(d.categorySlug).padEnd(9)} ${d.slug}`,
  );
  console.log(`      cover: ${cover}`);
}

await new Promise((resolve) => setTimeout(resolve, 2000));
process.exit(0);
