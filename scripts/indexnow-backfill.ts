/**
 * One-off: submits the pages already published to IndexNow.
 *
 * New articles ping automatically on the draft -> published transition (see
 * collections/Articles.ts), but everything published before that hook existed
 * was never announced. This catches them up in a single submission.
 *
 * Submits the same set the sitemap advertises, so nothing thin gets pushed.
 */
import { getAllTags, getArticles } from "@/lib/articles";
import { submitToIndexNow } from "@/lib/indexnow";
import { categories } from "@/site.config";

const TAG_SITEMAP_MIN_ARTICLES = 3;

const articles = await getArticles();
const tags = await getAllTags();

const paths = [
  "/",
  ...categories.map((c) => `/category/${c.slug}`),
  ...tags.filter((t) => t.count >= TAG_SITEMAP_MIN_ARTICLES).map((t) => `/tag/${t.slug}`),
  ...articles.map((a) => `/article/${a.slug}`),
];

console.log(`submitting ${paths.length} urls`);
console.log(`  ${articles.length} articles, ${categories.length} categories, ${paths.length - articles.length - categories.length - 1} tags, 1 home`);

await submitToIndexNow(paths);
process.exit(0);
