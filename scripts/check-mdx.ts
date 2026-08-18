/**
 * Compiles every article body with the same MDX pipeline the article page uses
 * (next-mdx-remote/rsc -> @mdx-js/mdx, remark-gfm).
 *
 * Drafts are not reachable on the frontend, so this is the only way to know a
 * draft will render before it is published. A bare "<" before a digit already
 * cost the site a live 500 once.
 */
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { getPayload } from "payload";
import config from "@payload-config";

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  limit: 500,
  depth: 0,
  select: { slug: true, body: true, status: true },
});

let failed = 0;
for (const d of docs as Array<Record<string, string>>) {
  if (only.length > 0 && !only.includes(d.slug)) continue;
  try {
    await compile(d.body, { remarkPlugins: [remarkGfm] });
  } catch (err) {
    failed += 1;
    console.log(`FAIL (${d.status}) ${d.slug}\n  ${(err as Error).message.split("\n")[0]}`);
  }
}

console.log(failed === 0 ? `\nall ${docs.length} bodies compile` : `\n${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
