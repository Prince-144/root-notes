/**
 * Sets official Rockstar key art as the cover on the three published GTA VI
 * articles.
 *
 * These went live before the covers were finalised, so the draft script skips
 * them — this writes to published articles directly.
 *
 * Three distinct images, because no cover is used twice on this site:
 *   leak piece     -> the box-art collage
 *   subpoena piece -> a character holding up a phone
 *   fake ISO piece -> the logo on black
 *
 * The logo started on the subpoena piece and moved. As an article cover it is
 * fine, but the carousel renders the headline over the middle of the image,
 * which is exactly where the logo lettering sits — a six-line headline landed
 * on top of it and both turned to mush. It sits better under the fake ISO
 * piece, whose headline is short enough to clear it.
 *
 * All three were downloaded from rockstargames.com, cropped to 16:9 and are
 * hosted locally under public/covers/ rather than hotlinked. They are the only
 * covers here that are not Unsplash-licensed or original photography: they are
 * publisher key art illustrating news about that publisher's own game.
 *
 * Note that public/ assets only exist on the live site after a deploy. Writing
 * the URL here without deploying produces a 404 and a broken image, which is
 * exactly what happened the first time.
 *
 * publishedAt is preserved by the beforeChange hook.
 *
 * Dry run by default; pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");

const COVERS: Record<string, string> = {
  "gta-vi-cyberleek-leak-working-build-protest-demand": "/covers/gta-vi-key-art.jpg",
  "take-two-dmca-subpoena-onedrive-discord-device-ids": "/covers/gta-vi-phone.jpg",
  "gta-vi-fake-iso-113gb-zeroes-defender-whitelist": "/covers/gta-vi-logo.jpg",
};

const payload = await getPayload({ config });
let changed = 0;

for (const [slug, coverImageUrl] of Object.entries(COVERS)) {
  const { docs } = await payload.find({
    collection: "articles", where: { slug: { equals: slug } }, limit: 1, depth: 0,
  });
  const doc = docs[0];
  if (!doc) {
    console.error(`no article with slug "${slug}"`);
    continue;
  }
  if (doc.coverImageUrl === coverImageUrl) {
    console.log(`unchanged (${doc.status}): ${slug}`);
    continue;
  }
  console.log(`${doc.status}: ${slug}`);
  console.log(`    ${doc.coverImageUrl}`);
  console.log(` -> ${coverImageUrl}`);
  changed++;
  if (APPLY) await payload.update({ collection: "articles", id: doc.id, data: { coverImageUrl } });
}

console.log(`\n${changed} cover(s) ${APPLY ? "updated" : "would change"}`);
if (!APPLY) console.log("dry run — pass --apply to write");
else console.log("applied. the images only resolve on rootnotes.in after a deploy.");
process.exit(0);
