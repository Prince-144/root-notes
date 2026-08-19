/**
 * Prints every article's slug, status and cover image.
 *
 * Used before drafting to check two things the site's rules depend on: that a
 * topic is not already covered, and that a cover image is not about to be
 * reused.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const { docs, totalDocs } = await payload.find({
  collection: "articles",
  limit: 500,
  depth: 0,
  sort: "-publishedAt",
  select: { slug: true, status: true, title: true, publishedAt: true },
});

for (const d of docs) {
  console.log([d.status.padEnd(9), (d.publishedAt ?? "").slice(0, 10), d.slug].join("  "));
}
console.log(`\ntotal ${totalDocs}`);
process.exit(0);
