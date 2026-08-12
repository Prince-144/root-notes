/**
 * One-off: three articles were drafted by script on 11 Aug and published by
 * hand afterwards, so publishedAt still held the draft-creation time. For these
 * three the only write after creation was the publish action, which makes
 * updatedAt the real publish time.
 *
 * Deliberately narrow. Older articles have updatedAt values set by bulk
 * maintenance scripts (retag, cover dedupe), not by publishing, so the same
 * inference does not hold for them and their dates are left alone.
 *
 * Pass --apply to write; dry run otherwise.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");

const SLUGS = [
  "malicious-sim-run-at-modem-code-execution",
  "polish-chp-plant-private-apn-wago-turbine-shutdown",
  "ghostsplice-mcp-split-instructions-coding-agents",
];

const payload = await getPayload({ config });

for (const slug of SLUGS) {
  const { docs } = await payload.find({
    collection: "articles",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    select: { slug: true, publishedAt: true, createdAt: true, updatedAt: true },
  });
  const d = docs[0] as any;
  if (!d) { console.log(`missing: ${slug}`); continue; }

  console.log(`${slug}\n  ${d.publishedAt}  ->  ${d.updatedAt}`);
  if (APPLY) {
    await payload.update({
      collection: "articles",
      id: d.id,
      data: { publishedAt: d.updatedAt },
    });
  }
}

console.log(APPLY ? "\napplied" : "\ndry run — pass --apply to write");
process.exit(0);
