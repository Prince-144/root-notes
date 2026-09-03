/**
 * Updates three live articles that said these CVEs were not in KEV.
 *
 *   npx tsx --env-file=.env.local scripts/update-kev-additions-2-september.ts
 *   npx tsx --env-file=.env.local scripts/update-kev-additions-2-september.ts --apply
 *
 * On 2 September 2026 CISA added seven flaws to the Known Exploited
 * Vulnerabilities catalogue, four of them the ones these pieces had just
 * checked the feed for and reported absent:
 *
 *   CVE-2026-9586   Sangoma Switchvox      due 2026-09-05
 *   CVE-2026-82329  JFrog Artifactory      due 2026-09-05
 *   CVE-2026-83548  SonicWall SMA1000      due 2026-09-05
 *   CVE-2026-83549  SonicWall SMA1000      due 2026-09-05
 *
 * Each article was accurate when published and dated its claim to the
 * 1 September catalogue, so nothing here is a retraction. But each also said
 * KEV would be late on this one, and each was right within 48 hours — a
 * prediction that lands is worth recording rather than quietly editing away.
 * The absent-from-KEV lines are updated in place and the outcome stated.
 *
 * `publishedAt` is untouched: the collection stamps it only on the
 * draft -> published transition.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");

const work: { slug: string; edits: [string, string][] }[] = [
  {
    slug: "switchvox-cve-2026-9586-patch-does-not-rotate-the-signing-key",
    edits: [
      [
        `CVE-2026-9586 itself is **not** in KEV as of the **1 September 2026** catalogue, despite confirmed exploitation. That gap is normal — KEV addition lags observed activity — but if you are using KEV as your prioritisation input, this is the case where it will be late.`,
        `When this was written, CVE-2026-9586 was **not** in KEV as of the 1 September 2026 catalogue, despite confirmed exploitation — and we said that if you use KEV as your prioritisation input, this is the case where it will be late.

**Update, 2 September 2026:** CISA added it, with a remediation deadline of **5 September**. Three days. The gap was 48 hours wide, and it is closed.`,
      ],
    ],
  },
  {
    slug: "sonicwall-sma1000-second-ssrf-plus-injection-pair-in-seven-weeks",
    edits: [
      [
        `## Neither new CVE is in KEV yet

We checked the feed directly — **1,687** entries as of **1 September 2026**. Neither **CVE-2026-83548** nor **CVE-2026-83549** appears.

That is not reassurance. KEV addition lags observed exploitation, and the vendor has already said exploitation is happening. If your prioritisation is driven by KEV, this is precisely the window in which it will be behind.`,
        `## Both are now in KEV, with a three-day deadline

When this was published, neither CVE appeared in the catalogue — **1,687** entries as of **1 September 2026** — and we said that was not reassurance, only the window in which KEV runs behind observed exploitation.

**Update, 2 September 2026:** CISA added **both**, along with five other flaws, and set the remediation deadline at **5 September**. Three days, the same treatment the July pair got.

The window was 48 hours. If you waited for the catalogue, you spent it.`,
      ],
      [
        `- **Do not wait for KEV.** It is not there yet and the exploitation is not hypothetical.`,
        `- **The KEV deadline is 5 September.** Both CVEs were added on 2 September with a three-day clock.`,
      ],
    ],
  },
  {
    slug: "jfrog-artifactory-phantom-join-key-admin-tokens-three-days",
    edits: [
      [
        `CVE-2026-82329 itself is **not** in KEV as of the **1 September** catalogue of 1,687 entries, despite watchTowr's observed exploitation. If you are working a KEV-derived queue, you would currently be patching the August path traversal and not the authentication bypass, which is the wrong way round.`,
        `At publication, CVE-2026-82329 was **not** in KEV as of the 1 September catalogue of 1,687 entries, despite watchTowr's observed exploitation — so a KEV-derived queue would have had you patching the August path traversal and not the authentication bypass, which is the wrong way round.

**Update, 2 September 2026:** CISA added it with a remediation deadline of **5 September**, which puts it ahead of the path traversal it was queued behind. The ordering is corrected; the 48 hours are not recoverable.`,
      ],
    ],
  },
];

const payload = await getPayload({ config });

let changed = 0;

for (const { slug, edits } of work) {
  const { docs } = await payload.find({
    collection: "articles",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const doc = docs[0];
  if (!doc) {
    console.error(`no article with slug ${slug}`);
    process.exit(1);
  }

  let body = doc.body;
  for (const [before, after] of edits) {
    if (!body.includes(before)) {
      console.error(`${slug}: not found —\n  ${before.slice(0, 90)}...`);
      process.exit(1);
    }
    body = body.replace(before, after);
  }

  console.log(`${slug}: ${doc.body.length} -> ${body.length} chars, ${edits.length} edit(s)`);

  if (APPLY) {
    await payload.update({ collection: "articles", id: doc.id, data: { body } });
    console.log("  updated");
    changed += 1;
  }
}

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

console.log(`\n${changed} article(s) updated`);

// The afterChange hook fires revalidate and IndexNow without awaiting.
await new Promise((resolve) => setTimeout(resolve, 5000));
process.exit(0);
