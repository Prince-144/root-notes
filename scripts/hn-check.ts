/**
 * Decides which recent articles are worth submitting to Hacker News, and says
 * why not for the rest.
 *
 * Three things sank the candidates we looked at by hand, and this checks all
 * three. The topic was already on HN and worked through: the Anthropic S-1 had
 * 1,709 points before we wrote about it. The primary source was already
 * submitted under its author's name, which makes us the secondary source:
 * AuthMask, twice, 1 point each. And our angle was already in the comments of
 * the earlier thread: the convertible-notes point, 16 minutes in.
 *
 * Reads the live RSS feed and the public article pages, never the database,
 * because the database is metered and none of this needs it. HN's Algolia API
 * needs no key.
 *
 * What it cannot judge: whether a piece is our own work or a write-up of
 * someone else's report. That is the thing that actually decides whether HN
 * keeps it, and it stays a human call. The script gathers the evidence for it.
 *
 *   npx tsx scripts/hn-check.ts
 *   npx tsx scripts/hn-check.ts --count 15
 */
import { writeFile } from "node:fs/promises";

const FEED = "https://rootnotes.in/rss.xml";
const ALGOLIA = "https://hn.algolia.com/api/v1";
const DAYS = 120;
const OUT = "hn-candidates.md";

const argv = process.argv.slice(2);
const COUNT = (() => {
  const i = argv.indexOf("--count");
  return i === -1 ? 10 : Number(argv[i + 1]) || 10;
})();

// Words that carry no signal in a search for one of our own pieces: our house
// vocabulary appears across half the archive, so searching on it matches noise.
const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "for", "to", "of", "in", "on", "at", "by", "is", "was",
  "are", "were", "it", "its", "this", "that", "these", "those", "with", "from", "as", "not", "no",
  "than", "then", "they", "them", "their", "what", "which", "who", "how", "why", "when", "where",
  "will", "would", "can", "could", "has", "have", "had", "been", "be", "after", "before", "over",
  "under", "into", "out", "up", "down", "about", "more", "most", "one", "two", "three", "now",
  "new", "says", "said", "show", "shows", "shown", "did", "does", "do", "you", "your", "security",
  "attack", "attacks", "vulnerability", "flaw", "bug", "data", "breach", "report", "published",
  "researchers", "company", "million", "billion", "dollar", "dollars", "percent", "first", "last",
  "week", "also", "only", "still", "even", "never", "every", "any", "all", "some", "own",
  "because", "while", "between",
]);

type Item = { title: string; link: string; description: string; category: string; pubDate: string };

function parseFeed(xml: string): Item[] {
  const pick = (block: string, tag: string) => {
    const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
    if (!m) return "";
    return m[1]
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .trim();
  };
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => ({
    title: pick(m[1], "title"),
    link: pick(m[1], "link"),
    description: pick(m[1], "description"),
    category: pick(m[1], "category"),
    pubDate: pick(m[1], "pubDate"),
  }));
}

/**
 * The named subjects of a piece, each searched on its own.
 *
 * Searching on several words at once was the first version and it missed the
 * thing it existed to catch: "Anthropic filing loss" does not match the story
 * titled "Anthropic S-1", which had 1,709 points. HN titles are short, so the
 * query has to be short too, and one entity at a time.
 *
 * The excerpt matters as much as the headline here, because that is where the
 * piece names who published what: ARTEX, VOLTA, Talos, Enclave.
 */
function entities(item: Item): string[] {
  const text = `${item.title}. ${item.description}`;
  const out: string[] = [];

  // Identifiers first; they are unambiguous.
  for (const m of text.matchAll(/CVE-\d{4}-\d{4,7}/gi)) out.push(m[0]);

  // Runs of capitalised words, which is how organisations appear: "Sony Network
  // Communications", "GMO Internet Group", "Cisco Talos". Matched within a
  // sentence, never across one: letting a run cross a full stop produced
  // "October. Revenue" and "October. A", and the second of those matched a
  // 24-point story about Opt Out October.
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    for (const m of sentence.matchAll(/\b([A-Z][A-Za-z0-9-]*(?: [A-Z][A-Za-z0-9-]*){0,3})/g)) {
      const phrase = m[1].trim().replace(/[.,;:]+$/, "");
      if (phrase.length < 3) continue;
      if (STOP.has(phrase.toLowerCase())) continue;
      // Our pieces are dated, so every excerpt carries a month. Not a name.
      if (phrase.split(" ").some((w) => MONTHS.test(w))) continue;
      // A single capitalised word that only got its capital from starting a
      // sentence is not a name.
      const words = phrase.split(" ");
      if (words.length === 1 && !/^[A-Z0-9-]+$/.test(phrase) && !text.includes(` ${phrase}`)) continue;
      out.push(phrase);
    }
  }

  // Prefer the longest, most specific forms, then an all-caps product name.
  const ranked = [...new Set(out)].sort((a, b) => {
    const caps = (s: string) => (/^[A-Z0-9.-]{3,}$/.test(s) ? 1 : 0);
    return caps(b) - caps(a) || b.length - a.length;
  });

  // Drop anything wholly contained in a form we are already searching for.
  const kept: string[] = [];
  for (const e of ranked) {
    if (kept.some((k) => k.toLowerCase().includes(e.toLowerCase()))) continue;
    kept.push(e);
    if (kept.length === 4) break;
  }
  return kept;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function algolia(pathAndQuery: string): Promise<Record<string, unknown>> {
  await sleep(350); // courtesy; the API is free and unauthenticated
  const res = await fetch(`${ALGOLIA}/${pathAndQuery}`);
  if (!res.ok) throw new Error(`algolia ${res.status} on ${pathAndQuery}`);
  return res.json();
}

type Story = {
  title: string;
  url: string;
  points: number;
  comments: number;
  date: string;
  id: string;
  via?: string;
};

function toStories(hits: unknown): Story[] {
  if (!Array.isArray(hits)) return [];
  return hits.map((h) => ({
    title: h.title ?? "",
    url: h.url ?? "",
    points: h.points ?? 0,
    comments: h.num_comments ?? 0,
    date: String(h.created_at ?? "").slice(0, 10),
    id: String(h.objectID),
  }));
}

/**
 * Prior submissions naming the same subject, one entity at a time, titles only.
 *
 * Titles only because searching the body text of every story matches anything
 * that mentions a vendor in passing. Recent only because a story from last year
 * does not stop us submitting today.
 */
/**
 * Whether a name is distinctive enough that a title match means something on
 * its own: a product in capitals (ARTEX, VOLTA, GMO), an identifier (CVE-2026-
 * 80097, S-1), or a multi-word organisation (Sony Network Communications).
 */
function isSpecific(e: string): boolean {
  if (e.includes(" ")) return true;
  if (/\d/.test(e) && e.includes("-")) return true;
  return /^[A-Z0-9.-]{3,}$/.test(e);
}

const MONTHS = /^(january|february|march|april|may|june|july|august|september|october|november|december)$/i;

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w) && !MONTHS.test(w)),
  );
}

function sharedTokens(storyTitle: string, item: Item): number {
  const ours = tokens(`${item.title} ${item.description}`);
  let n = 0;
  for (const w of tokens(storyTitle)) if (ours.has(w)) n += 1;
  return n;
}

async function topicStories(ents: string[], item: Item): Promise<Story[]> {
  const since = Math.floor(Date.now() / 1000) - DAYS * 86400;
  const found: Story[] = [];
  for (const e of ents) {
    const q = encodeURIComponent(e);
    const r = await algolia(
      `search?query=${q}&tags=story&restrictSearchableAttributes=title` +
        `&numericFilters=created_at_i>${since}&hitsPerPage=4`,
    );
    for (const s of toStories(r.hits)) {
      // Algolia will fuzzy-match, so require the entity to actually be there.
      if (!s.title.toLowerCase().includes(e.toLowerCase().split(" ")[0])) continue;
      // One ordinary capitalised word is not enough on its own. "Google"
      // matched a 2,017-point story about something else entirely, and
      // "October" matched a 277-point one, because our pieces mention a vendor
      // and a month in passing. A specific form stands alone; anything else
      // has to be corroborated by a second word the two titles share.
      if (!isSpecific(e) && sharedTokens(s.title, item) < 2) continue;
      found.push({ ...s, via: e });
    }
  }
  const seen = new Set<string>();
  return found
    .filter((s) => s.points >= 2)
    .filter((s) => (seen.has(s.id) ? false : seen.add(s.id)))
    .sort((a, b) => b.points - a.points);
}

// The share buttons and analytics on every page. Not sources.
const NOT_A_SOURCE =
  /(^|\.)(x\.com|twitter\.com|linkedin\.com|wa\.me|reddit\.com|instagram\.com|facebook\.com|t\.me|bsky\.app|threads\.net|googletagmanager\.com|google-analytics\.com|unsplash\.com|w3\.org|schema\.org|gravatar\.com)$/;

/**
 * Outbound links on our page: the sources we read, which HN prefers over us.
 *
 * Worth knowing what this found the first time it ran: nothing but share
 * buttons. The articles name their primary sources in prose and do not link
 * them, so there is nothing here to check against HN, and an HN reader cannot
 * click through to the source either.
 */
async function primarySources(link: string): Promise<string[]> {
  const res = await fetch(link);
  if (!res.ok) return [];
  const html = await res.text();
  const hosts = new Set<string>();
  for (const m of html.matchAll(/<a[^>]+href="(https?:\/\/[^"]+)"/g)) {
    try {
      const u = new URL(m[1]);
      if (/rootnotes\.in$/.test(u.hostname)) continue;
      if (NOT_A_SOURCE.test(u.hostname)) continue;
      hosts.add(u.origin + u.pathname.replace(/\/$/, ""));
    } catch {
      // Malformed href, skip.
    }
  }
  return [...hosts].slice(0, 6);
}

async function sourceAlreadySubmitted(urls: string[]): Promise<Story[]> {
  const found: Story[] = [];
  for (const u of urls) {
    const q = encodeURIComponent(u.replace(/^https?:\/\//, ""));
    const r = await algolia(`search?query=${q}&restrictSearchableAttributes=url&tags=story&hitsPerPage=2`);
    for (const s of toStories(r.hits)) {
      // Algolia tokenises URLs, so confirm the host really matches.
      try {
        if (s.url && new URL(s.url).hostname === new URL(u).hostname) found.push(s);
      } catch {
        // Skip.
      }
    }
  }
  const seen = new Set<string>();
  return found.filter((s) => (seen.has(s.id) ? false : seen.add(s.id)));
}

/**
 * Figures from our excerpt, looked for in the earlier thread's comments.
 *
 * A year is not a figure. The first version reported that "2026" was already in
 * the thread, which is true of almost every thread and tells us nothing.
 */
async function angleTaken(storyId: string, item: Item): Promise<string[]> {
  const figures = [...item.description.matchAll(/\b\d[\d,]{2,}\b/g)]
    .map((m) => m[0])
    .filter((f) => !/^(19|20)\d\d$/.test(f))
    .slice(0, 3);
  const hit: string[] = [];
  for (const f of figures) {
    const r = await algolia(`search?query=${encodeURIComponent(f)}&tags=comment,story_${storyId}&hitsPerPage=1`);
    if (Number(r.nbHits ?? 0) > 0) hit.push(f);
  }
  return hit;
}

const feed = await fetch(FEED).then((r) => r.text());
const items = parseFeed(feed).slice(0, COUNT);
console.log(`checking ${items.length} articles against HN\n`);

type Verdict = { item: Item; verdict: string; why: string[]; detail: string[] };
const results: Verdict[] = [];

for (const item of items) {
  const why: string[] = [];
  const detail: string[] = [];

  const ents = entities(item);
  const topic = await topicStories(ents, item);
  const sources = await primarySources(item.link);
  const submitted = await sourceAlreadySubmitted(sources);

  const worked = topic.find((s) => s.points >= 50);
  const taken = worked ? await angleTaken(worked.id, item) : [];

  let verdict: string;
  if (worked && taken.length > 0) {
    verdict = "SKIP";
    why.push(
      `"${worked.via}" already had ${worked.points} points on HN, and our figures ` +
        `(${taken.join(", ")}) are already in that thread`,
    );
  } else if (worked) {
    verdict = "WEAK";
    why.push(
      `"${worked.via}" already had ${worked.points} points and ${worked.comments} comments on HN`,
    );
  } else if (submitted.length > 0) {
    const best = [...submitted].sort((a, b) => b.points - a.points)[0];
    verdict = best.points >= 20 ? "SKIP" : "WEAK";
    why.push(`a primary source is already on HN with ${best.points} points: ${best.url}`);
  } else if (topic.length === 0) {
    verdict = "OPEN";
    why.push(`no prior HN submission on this topic in the last ${DAYS} days`);
  } else {
    verdict = "OPEN";
    why.push(`only low-scoring prior submissions, at ${topic.map((s) => s.points).join(" and ")} points`);
  }

  detail.push(`searched: ${ents.join(" | ")}`);
  for (const s of topic) {
    detail.push(`topic [${s.via}]: ${s.points}p ${s.comments}c ${s.date} ${s.title}`);
  }
  for (const s of submitted) detail.push(`source on HN: ${s.points}p ${s.date} ${s.url}`);
  detail.push(
    sources.length === 0
      ? "outbound source links on the page: none, so this check could not run"
      : `outbound source links: ${sources.join(" , ")}`,
  );

  results.push({ item, verdict, why, detail });
  console.log(`${verdict.padEnd(5)} ${item.title.slice(0, 72)}`);
  for (const w of why) console.log(`      ${w}`);
}

const rank: Record<string, number> = { OPEN: 0, WEAK: 1, SKIP: 2 };
results.sort((a, b) => rank[a.verdict] - rank[b.verdict]);

const md = [
  "# HN candidates",
  "",
  `Checked ${items.length} articles from the live feed on ${new Date().toISOString().slice(0, 10)}.`,
  "",
  "OPEN means nobody has worked the topic on HN and the primary sources are not",
  "there either. It does not mean the piece is good enough. The question this",
  "cannot answer is whether the article is our own work or a write-up of someone",
  "else's report, and only the second kind gets punished. Read the piece first.",
  "",
  ...results.flatMap((r) => [
    `## ${r.verdict}: ${r.item.title}`,
    "",
    r.item.link,
    `${r.item.category} | ${r.item.pubDate}`,
    "",
    ...r.why.map((w) => `- ${w}`),
    "",
    ...(r.detail.length ? ["```", ...r.detail, "```", ""] : []),
  ]),
  "## Before you submit",
  "",
  "- Title must be 80 characters or fewer, and must not be made more dramatic",
  "  than the article supports.",
  "- URL or text, never both. Context goes in your own first comment.",
  "- Write that comment yourself. HN's guidelines forbid generated text and",
  "  automated posting, and the penalty lands on the domain.",
  "- One submission. Weekday mornings US Eastern, which is 18:30 IST onward.",
  "- Then sit with the thread for two hours and answer the replies.",
  "",
].join("\n");

await writeFile(OUT, md, "utf8");
console.log(`\nwrote ${OUT}`);
process.exit(0);
