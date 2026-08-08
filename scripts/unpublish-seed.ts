/**
 * Retires the demo articles created by scripts/seed.ts.
 *
 * That seed data was scaffolding — invented cost tables, invented incident
 * timelines, no sources — but it shipped to production under a real byline
 * alongside genuinely researched articles, and its hardcoded view counts
 * (up to 9,130) monopolised the trending list. Unpublished rather than
 * deleted so the decision stays reversible.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SEED_SLUGS = [
  "openai-agent-pricing-shakeup",
  "npm-supply-chain-attack-postmortem",
  "seed-round-drought-2026",
  "arm-laptops-benchmark-roundup",
  "eu-ai-act-enforcement-begins",
  "self-hosting-comeback",
];

const payload = await getPayload({ config });

for (const slug of SEED_SLUGS) {
  const { docs } = await payload.find({
    collection: "articles",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });

  const doc = docs[0];
  if (!doc) {
    console.log(`skip   ${slug} (not found)`);
    continue;
  }

  await payload.update({
    collection: "articles",
    id: doc.id,
    // Clearing views and featured too: leaving them set would put the fake
    // numbers straight back into the rankings if these are ever republished.
    data: { status: "draft", views: 0, featured: false },
  });

  console.log(`retire ${slug} (was ${doc.status}, ${doc.views ?? 0} views)`);
}

const { totalDocs } = await payload.count({
  collection: "articles",
  where: { status: { equals: "published" } },
});
console.log(`published articles remaining: ${totalDocs}`);

process.exit(0);
