/** Prints the Unsplash photo id of every article cover, so a new draft can pick an unused one. */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", limit: 500, depth: 0, select: { slug: true, coverImageUrl: true },
});

const ids = new Set<string>();
for (const d of docs) {
  const m = (d.coverImageUrl ?? "").match(/photo-[\w-]+/);
  if (m) ids.add(m[0]);
}
console.log([...ids].sort().join("\n"));
console.log(`\n${ids.size} distinct covers across ${docs.length} articles`);
process.exit(0);
