/**
 * Google Analytics 4 report.
 *
 *   npx tsx --env-file=.env.local scripts/report-ga.ts [days]
 *
 * Needs two things in .env.local:
 *
 *   GA4_PROPERTY_ID=512345678
 *   GOOGLE_APPLICATION_CREDENTIALS=./.secrets/ga-service-account.json
 *
 * GA4_PROPERTY_ID is the numeric property id from GA Admin -> Property
 * Settings. It is NOT the G-XXXXXXX measurement id in site.config.ts: that one
 * is write-only, it sends events and cannot read them back.
 *
 * READ THE NUMBERS WITH THIS IN MIND: components/google-analytics.tsx loads
 * the tag for every reader, but ad blockers, browser tracking protection and
 * the opt-out on /cookies all stop it, so these counts run below real traffic.
 * Vercel Web Analytics is served from the site's own domain, which host
 * blocklists miss, and is the better source for "how many people read this".
 * GA is here for what that does not have — sources, geography, devices,
 * engagement.
 */
import { existsSync } from "node:fs";

import { BetaAnalyticsDataClient } from "@google-analytics/data";

const DAYS = Number(process.argv[2] ?? 28);
const PROPERTY = process.env.GA4_PROPERTY_ID;
const KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// The key file is checked here rather than left to the client, which throws an
// unhandled ENOENT from deep inside google-auth-library. Setting the variable
// is the easy half; the file it points at is the half that is usually missing.
const KEY_PRESENT = Boolean(KEY) && existsSync(KEY as string);

if (!PROPERTY || !KEY || !KEY_PRESENT) {
  console.error(`
Not configured yet:

  GA4_PROPERTY_ID                  ${PROPERTY ? "ok" : "MISSING"}
  GOOGLE_APPLICATION_CREDENTIALS   ${KEY ? "ok" : "MISSING"}
  the key file it points at        ${KEY_PRESENT ? "ok" : `MISSING${KEY ? ` (${KEY})` : ""}`}

To get them:

  1. GA4_PROPERTY_ID — Google Analytics -> Admin -> Property Settings.
     A number like 512345678. Not the G-XXXXXXX measurement id.

  2. Google Cloud console -> enable the "Google Analytics Data API"
     -> create a service account -> create a JSON key -> download it.
     Save it OUTSIDE version control, e.g. ./.secrets/ga-service-account.json
     (.secrets is gitignored), and point GOOGLE_APPLICATION_CREDENTIALS at it.

  3. Google Analytics -> Admin -> Property Access Management -> add the
     service account's email address with the Viewer role. Without this step
     the API authenticates fine and then returns 403.
`);
  process.exit(1);
}

const client = new BetaAnalyticsDataClient();
const property = `properties/${PROPERTY}`;
const dateRanges = [{ startDate: `${DAYS}daysAgo`, endDate: "today" }];

type Row = { keys: string[]; values: string[] };

async function report(
  dimensions: string[],
  metrics: string[],
  limit = 15,
  orderByMetric = 0,
): Promise<Row[]> {
  const [res] = await client.runReport({
    property,
    dateRanges,
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    limit,
    orderBys: metrics.length
      ? [{ metric: { metricName: metrics[orderByMetric] }, desc: true }]
      : undefined,
  });

  return (res.rows ?? []).map((r) => ({
    keys: (r.dimensionValues ?? []).map((d) => d.value ?? ""),
    values: (r.metricValues ?? []).map((m) => m.value ?? "0"),
  }));
}

const n = (v: string) => Number(v).toLocaleString("en-IN");
const bar = (v: number, max: number, w = 20) =>
  "#".repeat(max === 0 ? 0 : Math.round((v / max) * w)).padEnd(w);

function table(title: string, rows: Row[], label: (r: Row) => string, width = 46) {
  console.log(`\n${title}\n${"-".repeat(72)}`);
  if (rows.length === 0) {
    console.log("(no data in range)");
    return;
  }
  const max = Number(rows[0].values[0]);
  for (const r of rows) {
    const v = Number(r.values[0]);
    console.log(
      `${String(n(r.values[0])).padStart(7)}  ${bar(v, max)}  ${label(r).slice(0, width)}`,
    );
  }
}

// --- Totals ---------------------------------------------------------------
const [totals] = await report(
  [],
  ["activeUsers", "newUsers", "sessions", "screenPageViews", "averageSessionDuration"],
  1,
);

console.log(`\nROOT NOTES — Google Analytics, last ${DAYS} days\n${"=".repeat(72)}`);
if (!totals) {
  console.log("No data returned. Either the range is empty or the property is wrong.");
} else {
  const [users, newUsers, sessions, views, dur] = totals.values;
  console.log(`active users        ${n(users)}`);
  console.log(`new users           ${n(newUsers)}`);
  console.log(`sessions            ${n(sessions)}`);
  console.log(`page views          ${n(views)}`);
  console.log(`avg session         ${Math.round(Number(dur))}s`);
}

table("TOP PAGES", await report(["pagePath"], ["screenPageViews"]), (r) => r.keys[0], 52);

table(
  "WHERE THEY CAME FROM",
  await report(["sessionSourceMedium"], ["sessions"], 12),
  (r) => r.keys[0],
);

table("COUNTRIES", await report(["country"], ["activeUsers"], 12), (r) => r.keys[0]);

table("CITIES", await report(["city"], ["activeUsers"], 10), (r) => r.keys[0]);

table("DEVICE", await report(["deviceCategory"], ["activeUsers"], 5), (r) => r.keys[0]);

table(
  "BY DAY",
  (await report(["date"], ["activeUsers"], 400)).sort((a, b) => a.keys[0].localeCompare(b.keys[0])),
  (r) => `${r.keys[0].slice(0, 4)}-${r.keys[0].slice(4, 6)}-${r.keys[0].slice(6, 8)}`,
  20,
);

console.log(`
Readers who block Google Analytics — ad blockers, tracking protection, the
opt-out on /cookies — are missing from these numbers. For total readership
use Vercel Web Analytics.
`);
process.exit(0);
