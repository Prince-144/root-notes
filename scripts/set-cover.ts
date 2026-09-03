/**
 * Points an article at a different cover image.
 *
 *   npx tsx --env-file=.env.local scripts/set-cover.ts <slug> <url-or-unsplash-id>
 *   npx tsx --env-file=.env.local scripts/set-cover.ts <slug> <url-or-unsplash-id> --apply
 *
 * The drafting scripts skip anything already published, which is correct for
 * bodies and wrong for covers — a cover is usually only judged once the article
 * is live and the image is sitting under a headline. This is the published-safe
 * way to change one, and replaces writing another one-off script each time.
 *
 * A bare Unsplash id (photo-...) is expanded with the same crop parameters the
 * drafting scripts use, so a cover set here matches every other cover on the
 * site rather than arriving at a different size or crop.
 *
 * Refuses a cover already in use elsewhere. Two articles sharing an image reads
 * as a mistake in a feed, and check-covers exists to catch exactly that — no
 * point introducing the problem it was written to find.
 */
import { existsSync } from "node:fs";
import { getPayload } from "payload";
import config from "@payload-config";

const CROP = "?w=1600&h=900&fit=crop&crop=entropy&q=80";
const APPLY = process.argv.includes("--apply");
const [slug, image] = process.argv.slice(2).filter((a) => !a.startsWith("--"));

if (!slug || !image) {
  console.error("usage: set-cover.ts <slug> <url-or-unsplash-id> [--apply]");
  process.exit(1);
}

// Three kinds of value are accepted: a full URL, a site-relative path for a
// file in public/ (how the GTA covers were done, and why that needed its own
// script), and a bare Unsplash id.
const siteRelative = image.startsWith("/");
const url = image.startsWith("http")
  ? image
  : siteRelative
    ? image
    : `https://images.unsplash.com/${image}${CROP}`;

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "articles",
  where: { slug: { equals: slug } },
  limit: 1,
});

const doc = docs[0];
if (!doc) {
  console.error(`no article with slug ${slug}`);
  process.exit(1);
}

// Compare on the Unsplash id, not the full URL — the same photo with different
// crop parameters is still the same photo on the page.
const identity = (u: string | null | undefined) => u?.match(/photo-[\w-]+/)?.[0] ?? u ?? "";
const wanted = identity(url);

const { docs: all } = await payload.find({
  collection: "articles",
  limit: 500,
  depth: 0,
});
const clash = all.find((a) => a.slug !== slug && identity(a.coverImageUrl) === wanted);
if (clash) {
  console.error(`that cover is already used by: ${clash.slug}`);
  process.exit(1);
}

console.log(`${slug}`);
console.log(`  from: ${doc.coverImageUrl}`);
console.log(`  to:   ${url}`);

// A cover that 404s renders as a broken image on the live article, which is
// worse than the cover it replaced. Check before writing, not after.
//
// A site-relative cover cannot be fetched — it does not exist at a URL until
// the next deploy — so the check is that the file is on disk under public/.
// Getting this wrong ships a broken image that only shows up after deploying.
if (siteRelative) {
  const onDisk = `public${url}`;
  if (!existsSync(onDisk)) {
    console.error(`${onDisk} does not exist — not writing`);
    process.exit(1);
  }
  console.log(`  file:  ${onDisk} present (live after the next deploy)`);
} else {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    console.error(`\ncover URL returned ${res.status} — not writing`);
    process.exit(1);
  }
  console.log(`  fetch: ${res.status} ${res.headers.get("content-type")}`);
}

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { coverImageUrl: url } });
console.log("\nupdated");

// The afterChange hook fires its revalidate and IndexNow work without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
