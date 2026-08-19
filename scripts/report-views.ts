/**
 * Readership report from the site's own view counter.
 *
 * Source is the `views` field on articles, written by components/view-tracker.tsx
 * through /api/articles/[slug]/view. That path sets no cookies and is not gated
 * by consent, so unlike GA4 it sees every reader.
 *
 * It is also approximate, and deliberately so: the endpoint is public and the
 * only throttle is one count per article per browser session. Read these as
 * relative popularity, not as audited traffic.
 *
 *   npx tsx --env-file=.env.local scripts/report-views.ts [topN]
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { categories, siteConfig } from "@/site.config";

const TOP = Number(process.argv[2] ?? 15);

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  limit: 500,
  depth: 0,
  where: { status: { equals: "published" } },
  select: { slug: true, title: true, views: true, categorySlug: true, publishedAt: true, tags: true },
});

type Row = {
  slug: string; title: string; views: number;
  categorySlug: string; publishedAt: string; tags?: string[];
};
const rows = (docs as unknown as Row[]).map((d) => ({ ...d, views: d.views ?? 0 }));

const total = rows.reduce((n, r) => n + r.views, 0);
const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { timeZone: siteConfig.timeZone });

const pct = (n: number) => (total === 0 ? "0.0" : ((n / total) * 100).toFixed(1));
const bar = (n: number, max: number, width = 24) =>
  "#".repeat(max === 0 ? 0 : Math.round((n / max) * width)).padEnd(width);

console.log(`\nROOT NOTES — readership\n${"=".repeat(72)}`);
console.log(`published articles   ${rows.length}`);
console.log(`total views          ${total.toLocaleString("en-IN")}`);
console.log(`mean per article     ${rows.length ? Math.round(total / rows.length) : 0}`);
console.log(`articles with 0      ${rows.filter((r) => r.views === 0).length}`);

// --- Top articles ---------------------------------------------------------
const top = [...rows].sort((a, b) => b.views - a.views).slice(0, TOP);
const max = top[0]?.views ?? 0;
console.log(`\nTOP ${TOP} ARTICLES\n${"-".repeat(72)}`);
for (const [i, r] of top.entries()) {
  console.log(
    `${String(i + 1).padStart(2)}. ${String(r.views).padStart(5)}  ${bar(r.views, max)}  ${r.title.slice(0, 60)}`,
  );
  console.log(`    ${day(r.publishedAt)}  ${r.categorySlug}  /${r.slug}`);
}

// --- By category ----------------------------------------------------------
console.log(`\nBY CATEGORY\n${"-".repeat(72)}`);
const byCat = categories
  .map((c) => {
    const inCat = rows.filter((r) => r.categorySlug === c.slug);
    const views = inCat.reduce((n, r) => n + r.views, 0);
    return { name: c.name, count: inCat.length, views, mean: inCat.length ? Math.round(views / inCat.length) : 0 };
  })
  .sort((a, b) => b.views - a.views);
const catMax = byCat[0]?.views ?? 0;
for (const c of byCat) {
  console.log(
    `${c.name.padEnd(10)} ${String(c.views).padStart(6)}  ${String(pct(c.views)).padStart(5)}%  ${bar(c.views, catMax)}  ${c.count} articles, mean ${c.mean}`,
  );
}

// --- By tag ---------------------------------------------------------------
console.log(`\nTOP TAGS BY MEAN VIEWS (3+ articles)\n${"-".repeat(72)}`);
const tagStats = new Map<string, { n: number; views: number }>();
for (const r of rows) {
  for (const t of r.tags ?? []) {
    const cur = tagStats.get(t) ?? { n: 0, views: 0 };
    tagStats.set(t, { n: cur.n + 1, views: cur.views + r.views });
  }
}
[...tagStats.entries()]
  .filter(([, s]) => s.n >= 3)
  .map(([t, s]) => ({ t, n: s.n, mean: Math.round(s.views / s.n) }))
  .sort((a, b) => b.mean - a.mean)
  .slice(0, 12)
  .forEach((x) => console.log(`${x.t.padEnd(24)} mean ${String(x.mean).padStart(5)}   (${x.n} articles)`));

// --- Recent -------------------------------------------------------------
console.log(`\nLAST 10 PUBLISHED\n${"-".repeat(72)}`);
[...rows]
  .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  .slice(0, 10)
  .forEach((r) => console.log(`${day(r.publishedAt)}  ${String(r.views).padStart(5)}  ${r.title.slice(0, 58)}`));

console.log(
  `\nNote: counts come from the site's own endpoint, capped at one per article\nper browser session. Treat them as relative, not audited.\n`,
);
process.exit(0);
