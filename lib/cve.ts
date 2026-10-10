/**
 * CVE identifiers, as first-class pages.
 *
 * Every vulnerability story here is already tagged with its identifier, so the
 * site held a page for each one at /tag/cve-2026-88779 — and that page was the
 * wrong shape for the only query that matters. Someone reading an advisory
 * types the bare identifier into a search box and nothing else, and in the
 * first days after disclosure almost nobody is competing for it. What answered
 * that query was a page titled with a lowercase hashtag, which the sitemap
 * never mentioned: tag entries are filtered to three articles or more, and a
 * CVE is usually covered once. Forty-five identifiers, none of them submitted.
 *
 * So CVEs get their own route, the identifier as the title, and a sitemap entry
 * however many times we have written about them.
 *
 * This module stays free of server-only imports — the regex is shared with
 * lib/seo-title.ts and the helpers with the client-side search box, and
 * reaching lib/articles.ts from either would drag Payload into the browser
 * bundle (see the note at the top of lib/article-types.ts). The functions that
 * read the article list live in lib/articles.ts beside getAllTags.
 */
import type { ArticleSummary } from "./article-types";

/**
 * CVE-YYYY-NNNN, four digits or more in the sequence. Case-insensitive because
 * tags are free text — "CVE-2026-88779" and "cve-2026-88779" are one tag.
 *
 * The single definition. lib/seo-title.ts matches the same shape when it moves
 * an identifier to the front of a title tag, and two copies of this would drift.
 */
export const CVE_ID = /^cve-\d{4}-\d{4,}$/i;

export function isCveTag(tag: string): boolean {
  return CVE_ID.test(tag.trim());
}

/** The URL form: lowercase, like every other slug on the site. */
export function cveSlug(tag: string): string {
  return tag.trim().toLowerCase();
}

/** The display form, as every advisory and database writes it. */
export function cveId(tag: string): string {
  return tag.trim().toUpperCase();
}

/** The year in the identifier — the year it was reserved, not fixed. */
export function cveYear(id: string): string {
  return id.split("-")[1] ?? "";
}

/**
 * The authoritative records, for a reader who wants the primary source rather
 * than our account of it.
 *
 * Both are deterministic URL patterns keyed by the identifier. Nothing here has
 * read either record, so nothing here says what they contain — no severity, no
 * score, no affected range. The page links out and stops, because a CVSS
 * vector invented to fill a column is worse than an empty one.
 */
export function cveRecords(id: string): { name: string; url: string }[] {
  return [
    { name: "NVD", url: `https://nvd.nist.gov/vuln/detail/${id}` },
    { name: "MITRE", url: `https://www.cve.org/CVERecord?id=${id}` },
  ];
}

/** Every CVE we have covered, with the pieces that covered it, newest first. */
export type CveCoverage = {
  /** CVE-2026-88779 */
  id: string;
  /** cve-2026-88779 */
  slug: string;
  articles: ArticleSummary[];
};

/** What the index hands its search box — small enough to ship to the browser. */
export type CveIndexEntry = {
  id: string;
  slug: string;
  count: number;
  /** The most recent headline, so a row says something before it is clicked. */
  latestTitle: string;
  latestDate: string;
  /** The date CISA added it to KEV, when it is listed. Absent when it is not. */
  kevAdded?: string;
};

/**
 * What the homepage strip ships: a number and a date, no headline.
 *
 * Narrower than CveIndexEntry on purpose — the strip holds every identifier so
 * its search box can see them all, and the titles would be most of that weight
 * for something it never renders.
 */
export type CveTickerEntry = {
  id: string;
  slug: string;
  latestDate: string;
};

/**
 * Matched on digits alone, so every way an identifier gets typed finds it:
 * "CVE-2026-88779", "cve 2026 88779", "2026-88779", or just "88779" off the
 * end of an advisory. Punctuation and case are noise in an identifier.
 */
export function cveMatches(entry: { id: string }, query: string): boolean {
  const needle = query.replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (!needle) return true;
  return entry.id.replace(/[^a-z0-9]/gi, "").toLowerCase().includes(needle);
}
