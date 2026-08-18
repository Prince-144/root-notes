/**
 * Checks every internal /article/... link in every body against the collection.
 *
 * Catches two things: a slug that does not exist, and a link to an article that
 * is still a draft — both render as a 404 for the reader.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", limit: 500, depth: 0,
  select: { slug: true, body: true, status: true },
});

const status = new Map<string, string>();
for (const d of docs as Array<Record<string, string>>) status.set(d.slug, d.status);

let bad = 0;
for (const d of docs as Array<Record<string, string>>) {
  const targets = [...d.body.matchAll(/\]\(\/article\/([a-z0-9-]+)\)/g)].map((m) => m[1]);
  for (const t of new Set(targets)) {
    if (!status.has(t)) { bad += 1; console.log(`MISSING  ${d.slug} -> ${t}`); }
    else if (status.get(t) !== "published") { bad += 1; console.log(`DRAFT    ${d.slug} -> ${t}`); }
  }
}
console.log(bad === 0 ? "\nall internal article links resolve to published articles" : `\n${bad} broken`);
process.exit(0);
