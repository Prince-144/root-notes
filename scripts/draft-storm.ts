/**
 * "Storm" — a new RaaS leak site, and the counting problem underneath it.
 *
 * Sourced from leak-site monitoring (ransomware.live, WatchGuard) rather than
 * from any single outlet's write-up, then checked against the quarterly
 * ecosystem reports that disagree with it.
 *
 * Pass --update to rewrite if the draft exists; published articles are skipped.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "../payload-types";

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: Article["categorySlug"];
  tags: string[];
  readingMinutes: number;
  coverImageUrl: string;
  body: string;
};

const P = "?w=1600&h=900&fit=crop&crop=entropy&q=80";

const DRAFTS: Draft[] = [
  {
    slug: "storm-ransomware-new-leak-site-nineteen-victims-eight-days",
    title:
      "A ransomware group called Storm posted 19 victims in eight days — and it is not the Storm you have already read about",
    excerpt:
      "Two law firms, an equine hospital, a mental health charity and three metal companies, published in batches with a two-day gap between attack and leak. It shares a name with Microsoft's Storm-1175, which is a different actor entirely.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "threat-intelligence",
      "leak-sites",
      "extortion",
      "raas",
      "metrics",
    ],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1749476244079-ec5d127a6de1${P}`,
    body: `A ransomware operation calling itself **Storm** appeared on **7 August 2026** and has published **19 victims** in the eight days since.

We are writing this from leak-site monitoring rather than from anyone's incident report, which means the usual caveat applies harder than usual: **everything below is what the group claims about itself.** Ransomware.live, which tracks it, says so on its own page — this is an emerging group, and claims should be treated with caution until independently verified.

With that stated, the pattern is worth looking at, and there is a naming problem that needs clearing up first.

## It is not Storm-1175

Microsoft uses a **Storm-####** convention for threat actors it has not yet finished attributing. **Storm-1175** is a China-linked, financially motivated group that Microsoft documented deploying a new locker called **StormEncryptor** from 2 August 2026, likely through an N-able N-central flaw — [we covered that one last week](/article/storm-1175-stormencryptor-n-central-patch-bypass).

This **Storm** is a different thing: a self-named RaaS brand with its own Tor extortion portal, first seen five days later.

Same word, two actors, two weeks apart. Expect them to be conflated, including by tooling that matches on strings.

## What the group has posted

| | |
| --- | --- |
| First victim published | **7 August 2026** |
| Victims claimed | **19** |
| Average gap, attack to publication | **2 days** |
| Countries | **3** |
| Model | RaaS, listed as data broker; direct and double extortion |

Victims visible in the most recent batch, with the group's own attack-date estimates:

- **Hinman Straub** — law firm, Albany, New York (est. 13 Aug)
- **3-point Australia** — project management consultancy (est. 13 Aug)
- **Rood & Riddle Equine Hospital** — Lexington, Kentucky (est. 11 Aug)
- **Canadian Mental Health Association** (est. 11 Aug)
- **Tapper Cuddy LLP** — law firm, Manitoba (est. 11 Aug)
- **Integra Castings** — iron foundry (est. 11 Aug)
- **Southern Metals Company** — metal recycling, Charlotte, NC (est. 10 Aug)

Earlier claims include **Supportive Insurance Services** (10 Aug) and **United Group of Companies**, a real estate developer in Troy, NY (8 Aug).

## The two-day gap is the operational tell

Most ransomware groups sit on a victim. The standard sequence is encrypt, negotiate privately, and publish only when the victim stops responding or refuses — a gap of weeks.

Two days from estimated attack to public listing is not a negotiation window. It is either a group that is not really negotiating, or one that has decided reputation-building matters more than this quarter's payments. New brands need a leak site that looks busy, because affiliates choose where to work based on whether the operation appears to be functioning.

The victim mix supports that reading. There is no vertical here. Legal, veterinary healthcare, a mental health charity, foundry, metal recycling, insurance compliance, real estate, consultancy — across the US, Canada and Australia. That is what opportunistic exploitation of whatever was reachable looks like, not a targeting strategy.

The **Canadian Mental Health Association** entry is the one worth pausing on. A mental health charity holds among the most sensitive records any organisation can hold, and has among the least capacity to defend them or to pay.

## The count you cite depends on who you ask

Here is where this gets genuinely useful, because a second discrepancy showed up while checking the first.

**On this group:**

| Source | Victims |
| --- | --- |
| Ransomware.live | **19**, across 3 countries |
| WatchGuard tracker | **10**, all United States |

Both are monitoring the same leak site. The gap is collection timing plus whatever each platform counts as a listing — and the "all US" characterisation is already contradicted by the Australian and Canadian entries above.

**On the ecosystem as a whole, the divergence is much worse:**

| Source | Active groups |
| --- | --- |
| Ransomware.live (live counter) | **387** |
| Help Net Security, June 2026 | **146** |
| IBM X-Force, 2026 | **109** extortion groups (up from 73 in 2024) |
| Check Point, Q1 2026 | **71** |

These are not four measurements of one thing. Check Point counts groups that posted a victim to a monitored leak site during the quarter, across "more than 70 active data leak sites". Ransomware.live's 387 is a tracker total, not a quarterly active count. Nobody publishes a formal definition of "active", which is why the numbers span a factor of five.

If you have quoted an active-group figure in a board deck this year, it is worth knowing which of these you used.

## Fragmentation or consolidation? Both are being reported

The same split runs through the trend analysis.

**Check Point's Q1 2026 data says the ecosystem consolidated:**

| Period | Active groups | Top-10 share of victims |
| --- | --- | --- |
| Q1 2024 | 51 | 68% |
| Q3 2025 | **85** (peak fragmentation) | **57%** |
| Q1 2026 | 71 | **71.1%** |

2,122 victims posted in Q1 2026, with the top ten taking 71.1% — a concentration level not seen since early 2024.

**Other reporting says the opposite:** 61 new groups in 2026, more than one a week, and rising victim totals.

Both can be true simultaneously, and this is the part most coverage misses. **New brands can proliferate while the victim count concentrates.** Dozens of small operations launch, post a handful of victims each, and fold — while ten established groups take seven victims in ten. A new-group counter measures churn. A top-10 share measures where the damage is.

Storm is a data point for the first metric. Whether it becomes one for the second is the open question, and 19 victims in eight days is a genuinely fast start.

Ransomware.live's own year-to-date figures show the same tension: **6,191 victims in 2026, up 28.7% on 2025** — and **534 this month, down 44% on July.**

## What is not established

- **Whether the victims are real.** Every name here is the group's claim. Groups recycle old breaches, inflate victim lists, and occasionally post organisations they never touched.
- **Initial access method.** Nothing is published. No CVE, no vector, no tooling.
- **Whether Storm is a rebrand.** New RaaS brands are frequently existing crews under a new name after a takedown or an exit scam. Nobody has linked Storm to a predecessor, which means only that nobody has looked yet.
- **Any victim confirmation.** We found no statement from any listed organisation.
- **The relationship, if any, to Storm-1175.** There is no reporting either way. Absence of a link is not evidence of one.

## What to do with a source like this

Leak-site trackers are the fastest signal available for ransomware and the least reliable. Used properly they are early warning; used carelessly they launder a criminal's marketing into a statistic.

- **Attribute to the claim, not the fact.** "Listed on Storm's leak site" — never "breached by Storm" — until the victim or a responder says otherwise.
- **Check whether your own name or a supplier's appears.** That is the one use where speed genuinely beats confirmation.
- **Do not aggregate tracker counts with vendor quarterly reports.** They count different things, as the table above shows.
- **Watch new groups for a second month, not a first week.** Most disappear. The ones that do not are the ones worth tracking.

For anyone wondering how this gets reported without going anywhere near a criminal marketplace: this is entirely from clearweb monitoring platforms that scrape leak sites and republish, cross-checked against vendor quarterly data. The \`.onion\` address exists and is publicly quoted. Nobody needs to visit it.`,
  },
];

const UPDATE = process.argv.includes("--update");
const payload = await getPayload({ config });

for (const draft of DRAFTS) {
  const { docs: clash } = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
  });

  if (clash.length > 0) {
    const existing = clash[0] as { id: number | string; status: string };
    if (!UPDATE || existing.status === "published") {
      console.log(`skip (${existing.status}): ${draft.slug}`);
      continue;
    }
    await payload.update({ collection: "articles", id: existing.id, data: { ...draft } });
    console.log(`updated: ${draft.slug} (${draft.body.split(/\s+/).length} words)`);
    continue;
  }

  const created = await payload.create({
    collection: "articles",
    data: {
      ...draft,
      author: "Prince Baruwala",
      publishedAt: new Date().toISOString(),
      status: "draft",
      featured: false,
      views: 0,
    },
  });

  console.log(
    `drafted: ${draft.slug} (id ${created.id}, ${draft.categorySlug}, ${draft.body.split(/\s+/).length} words)`,
  );
}

process.exit(0);
