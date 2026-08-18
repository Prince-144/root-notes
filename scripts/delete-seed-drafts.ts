/**
 * One-off: removes the six fabricated seed articles.
 *
 * These came from scripts/seed.ts and contain invented figures. They were
 * unpublished early on but left in the drafts list, where one mistaken click
 * would put made-up numbers back on a site whose whole claim is that it checks
 * them.
 *
 * Deletes by exact slug, and only when the record is still a draft — a
 * published article of the same name would be a different decision.
 *
 * Pass --apply to delete; dry run otherwise.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");

const SLUGS = [
  "self-hosting-comeback",
  "eu-ai-act-enforcement-begins",
  "arm-laptops-benchmark-roundup",
  "seed-round-drought-2026",
  "npm-supply-chain-attack-postmortem",
  "openai-agent-pricing-shakeup",
];

const payload = await getPayload({ config });

let removed = 0;
for (const slug of SLUGS) {
  const { docs } = await payload.find({
    collection: "articles",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    select: { slug: true, status: true, title: true },
  });

  const doc = docs[0] as { id: number | string; status: string; title: string } | undefined;

  if (!doc) {
    console.log(`missing:   ${slug}`);
    continue;
  }
  if (doc.status !== "draft") {
    console.log(`SKIP (${doc.status}): ${slug}`);
    continue;
  }

  console.log(`${APPLY ? "deleted:" : "would delete:"} ${slug} — ${doc.title.slice(0, 60)}`);
  if (APPLY) {
    await payload.delete({ collection: "articles", id: doc.id });
    removed += 1;
  }
}

console.log(`\n${APPLY ? `removed ${removed}` : "dry run — pass --apply to delete"}`);
process.exit(0);
