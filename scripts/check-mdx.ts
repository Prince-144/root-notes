/**
 * Compiles article bodies with the same MDX pipeline the article page uses
 * (next-mdx-remote/rsc -> @mdx-js/mdx, remark-gfm).
 *
 * Drafts are not reachable on the frontend, so this is the only way to know a
 * draft will render before it is published. A bare "<" before a digit already
 * cost the site a live 500 once.
 *
 *   npx tsx --env-file=.env.local scripts/check-mdx.ts              drafts + changed in last 3 days
 *   npx tsx --env-file=.env.local scripts/check-mdx.ts <slug> ...   just these
 *   npx tsx --env-file=.env.local scripts/check-mdx.ts --all        every article
 *
 * Scoped by default because every body is the largest thing in the database.
 * The unscoped sweep pulled all of them — about 2MB — and ran after nearly
 * every edit, which helped exhaust the database's monthly data-transfer quota
 * in September 2026. A published body that has not changed since it last
 * compiled cannot have started failing, so skipping it loses nothing.
 */
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Where } from "payload";

const ALL = process.argv.includes("--all");
const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const RECENT_DAYS = 3;
const since = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000).toISOString();

const where: Where | undefined =
  only.length > 0
    ? { slug: { in: only } }
    : ALL
      ? undefined
      : { or: [{ status: { equals: "draft" } }, { updatedAt: { greater_than: since } }] };

const scope =
  only.length > 0 ? "named" : ALL ? "all" : `drafts + changed in the last ${RECENT_DAYS} days`;

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  where,
  limit: 0,
  depth: 0,
  select: { slug: true, body: true, status: true },
});

let failed = 0;
for (const d of docs) {
  try {
    await compile(d.body, { remarkPlugins: [remarkGfm] });
  } catch (err) {
    failed += 1;
    console.log(`FAIL (${d.status}) ${d.slug}\n  ${(err as Error).message.split("\n")[0]}`);
  }
}

console.log(
  failed === 0
    ? `\nall ${docs.length} bodies compile (${scope})`
    : `\n${failed} of ${docs.length} failed (${scope})`,
);
process.exit(failed === 0 ? 0 : 1);
