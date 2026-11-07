/**
 * The title a search engine gets, which is not always the headline.
 *
 * House headlines lead with the finding — "The NetScaler web shell answers a
 * request for a missing icon" — which is the right way to open a piece and the
 * wrong way to be found. The query people actually type is the identifier, and
 * a result listing truncates somewhere around sixty characters, so a CVE in
 * the last clause is a CVE nobody sees.
 *
 * So the identifier moves to the front of the title tag only. The page still
 * shows the headline, and so do the social cards, which are read by people
 * rather than matched against a query.
 *
 * Deliberately narrow: identifiers are unambiguous and worth leading with,
 * while a company name usually reads worse in front of a sentence than inside
 * it. Anything else belongs in a per-article field, not in a heuristic.
 */
import { CVE_ID } from "./cve";

export function searchTitle(article: { title: string; tags?: string[] }): string {
  const headline = article.title.toUpperCase();

  const ids = (article.tags ?? [])
    .filter((tag) => CVE_ID.test(tag))
    .map((tag) => tag.toUpperCase())
    .filter((id) => !headline.includes(id));

  if (ids.length === 0) return article.title;

  // Two is the most that fits before the headline starts being pushed out of
  // the visible part of a result.
  return `${ids.slice(0, 2).join(", ")}: ${article.title}`;
}

/**
 * The headline Google's structured data gets, which is not always the one on
 * the page either.
 *
 * Google's Article guidance caps `headline` at 110 characters and says a
 * longer one may be truncated or the field ignored. House headlines run to
 * two clauses and routinely pass 130, so most articles were handing Google a
 * field it could discard. The visible H1, the social cards and the news
 * sitemap keep the full headline: this shortens only the JSON-LD.
 *
 * It cuts at a sentence or clause boundary and nowhere else, taking the
 * longest clean prefix that fits. Cutting at a word boundary instead is what
 * produces a headline ending in "and a" or "for", and a headline that reads
 * as though it broke off is worse than one Google might shorten itself. When
 * no clean boundary fits, the full headline goes through untouched, which
 * leaves us exactly where we were rather than somewhere worse.
 */
const MAX = 110;

export function structuredHeadline(title: string): string {
  if (title.length <= MAX) return title;

  // End of a sentence or clause, as an index just past the break.
  const breaks: number[] = [];
  const pattern = /[.;:,]\s|\s[—-]\s/g;
  for (let m = pattern.exec(title); m !== null; m = pattern.exec(title)) {
    breaks.push(m[0].startsWith(" ") ? m.index : m.index + 1);
  }

  const fits = breaks.filter((end) => end <= MAX);
  if (fits.length === 0) return title;

  // A full stop reads as a finished thought and stays; a comma, colon or
  // semicolon reads as though more was coming, so it goes.
  return title.slice(0, Math.max(...fits)).trimEnd().replace(/[,;:]$/, "");
}
