/**
 * CISA's Known Exploited Vulnerabilities catalog.
 *
 * The identifier pages deliberately report no severity of their own, because
 * nothing here has read the vendor advisory — see the note in lib/cve.ts. KEV
 * is the exception worth making: it is a public, dated, machine-readable
 * statement from a named authority that a given identifier is being exploited
 * in the wild. Quoting it is reporting a fact with a source and a date, not
 * inventing a score.
 *
 * It also discriminates, which is what makes it worth showing. Of six
 * identifiers this site covered in a fortnight, three were listed and three
 * were not.
 *
 * Never throws and never blocks a page. A CVE page that cannot reach CISA
 * renders without the status rather than failing; an external feed is not
 * allowed to take the site down.
 */
import { cache } from "react";

const FEED =
  "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

/**
 * Six hours. CISA publishes at most once a day and usually less often, and
 * fetch is not cached by default in this version of Next, so the interval has
 * to be asked for explicitly or every render would pull a two-megabyte file.
 */
const REVALIDATE_SECONDS = 21_600;

export type KevEntry = {
  /** The day CISA added it, as the catalog gives it: YYYY-MM-DD. */
  dateAdded: string;
  /** The day US federal agencies were required to have remediated by. */
  dueDate: string;
  /** CISA's own field. "Known" when it has seen ransomware use, else "Unknown". */
  knownRansomwareCampaignUse: string;
};

export type KevCatalog = {
  /** CISA's catalogVersion, e.g. "2026.10.08" — the "as of" for a negative. */
  version: string;
  entries: Map<string, KevEntry>;
};

type FeedShape = {
  catalogVersion?: string;
  vulnerabilities?: {
    cveID?: string;
    dateAdded?: string;
    dueDate?: string;
    knownRansomwareCampaignUse?: string;
  }[];
};

const EMPTY: KevCatalog = { version: "", entries: new Map() };

export const getKevCatalog = cache(async (): Promise<KevCatalog> => {
  try {
    const res = await fetch(FEED, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      console.warn(`[kev] catalog fetch failed: ${res.status}`);
      return EMPTY;
    }

    const data = (await res.json()) as FeedShape;
    const entries = new Map<string, KevEntry>();

    for (const row of data.vulnerabilities ?? []) {
      if (!row.cveID || !row.dateAdded) continue;
      entries.set(row.cveID.toUpperCase(), {
        dateAdded: row.dateAdded,
        dueDate: row.dueDate ?? "",
        knownRansomwareCampaignUse: row.knownRansomwareCampaignUse ?? "Unknown",
      });
    }

    return { version: data.catalogVersion ?? "", entries };
  } catch (err) {
    console.warn(`[kev] catalog unavailable: ${String(err)}`);
    return EMPTY;
  }
});

export async function getKevEntry(id: string): Promise<KevEntry | undefined> {
  const { entries } = await getKevCatalog();
  return entries.get(id.toUpperCase());
}

/** CISA's own page for an identifier's catalog entry. */
export const KEV_URL = "https://www.cisa.gov/known-exploited-vulnerabilities-catalog";
