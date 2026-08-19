/** Dumps one article's title, excerpt and body so a new draft can avoid repeating it. */
import { getPayload } from "payload";
import config from "@payload-config";

const slug = process.argv[2];
const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  where: { slug: { equals: slug } },
  limit: 1,
  depth: 0,
});
const d = docs[0];
if (!d) { console.log("not found"); process.exit(1); }
console.log("TITLE:", d.title);
console.log("EXCERPT:", d.excerpt);
console.log("COVER:", d.coverImageUrl);
console.log("---BODY---");
console.log(d.body);
process.exit(0);
