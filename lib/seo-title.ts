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
const CVE = /^cve-\d{4}-\d{4,}$/i;

export function searchTitle(article: { title: string; tags?: string[] }): string {
  const headline = article.title.toUpperCase();

  const ids = (article.tags ?? [])
    .filter((tag) => CVE.test(tag))
    .map((tag) => tag.toUpperCase())
    .filter((id) => !headline.includes(id));

  if (ids.length === 0) return article.title;

  // Two is the most that fits before the headline starts being pushed out of
  // the visible part of a result.
  return `${ids.slice(0, 2).join(", ")}: ${article.title}`;
}
