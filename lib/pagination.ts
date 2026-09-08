/**
 * Page-size and slicing for the listing pages.
 *
 * The homepage and the category pages were rendering every published article
 * in one document: 241 rows and 241 next/image tags, which is 1.5 MB of HTML
 * on the homepage and 905 KB on /category/security. At roughly nine articles a
 * day that grows without bound, and almost all of it is bytes nobody scrolls
 * to — on a phone, which is where the Instagram traffic lands, it is the whole
 * first-load cost for content below several screens of feed.
 *
 * Page one keeps the canonical URL (/ and /category/slug) so nothing that is
 * already indexed moves. Later pages hang off /page/n.
 */
export const PAGE_SIZE = 24;

export type Paged<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
};

/**
 * Slices `items` for a 1-based page number.
 *
 * `totalPages` is at least 1 so an empty category still renders as "page 1 of
 * 1" rather than "page 1 of 0", and page 1 of an empty list is valid rather
 * than a 404.
 */
export function paginate<T>(items: T[], page: number): Paged<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  return {
    items: items.slice(start, start + PAGE_SIZE),
    page,
    totalPages,
    total,
  };
}

/**
 * Parses a page segment, returning null for anything that is not a plain
 * positive integer — "01", "2.0", "-1" and "abc" all 404 rather than
 * resolving to the same content under a second URL.
 */
export function parsePage(segment: string): number | null {
  if (!/^[1-9][0-9]*$/.test(segment)) return null;
  const n = Number(segment);
  return Number.isSafeInteger(n) ? n : null;
}

/**
 * The href for a page of a listing, given the base path of page one.
 *
 * Page one is the base path itself rather than base/page/1, so there is only
 * ever one URL for it.
 */
export function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath === "/" ? "" : basePath}/page/${page}`;
}

/**
 * Page numbers to render, with nulls standing in for gaps.
 *
 * Always shows the first and last page and a window around the current one, so
 * the control stays a fixed width whether there are 3 pages or 300.
 */
export function pageWindow(page: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const shown = new Set<number>([1, totalPages, page]);
  if (page - 1 > 1) shown.add(page - 1);
  if (page + 1 < totalPages) shown.add(page + 1);

  const sorted = [...shown].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  for (const [i, n] of sorted.entries()) {
    if (i > 0 && n - sorted[i - 1] > 1) out.push(null);
    out.push(n);
  }
  return out;
}
