/**
 * Cover swap for a published article.
 *
 * /article/facebook-founding-story-what-the-film-invented shipped with an image
 * of an industrial door carrying an Arabic sign. It has nothing to do with the
 * story. That is my error: the cover was chosen from a list of Unsplash IDs
 * returned by a search, without ever looking at the picture.
 *
 * Replaces it with Harvard's red-brick collegiate architecture, which was
 * downloaded and viewed before being used here.
 *
 * publishedAt is preserved by the beforeChange hook. Pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "facebook-founding-story-what-the-film-invented";
const NEW_COVER =
  "https://images.unsplash.com/photo-1622397333309-3056849bc70b?w=1600&h=900&fit=crop&crop=entropy&q=80";

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) { console.error(`no article with slug "${SLUG}"`); process.exit(1); }
if (doc.coverImageUrl === NEW_COVER) { console.log("already swapped"); process.exit(0); }

console.log(`status: ${doc.status}`);
console.log(`old: ${doc.coverImageUrl}`);
console.log(`new: ${NEW_COVER}`);

if (!APPLY) { console.log("\ndry run — pass --apply to write"); process.exit(0); }

await payload.update({ collection: "articles", id: doc.id, data: { coverImageUrl: NEW_COVER } });
console.log("\napplied. regenerate the carousel, then redeploy.");
process.exit(0);
