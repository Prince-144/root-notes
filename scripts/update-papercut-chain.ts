/**
 * Update for a published article.
 *
 * /article/papercut-zero-day-missing-logs-are-the-indicator went live when the
 * flaw had no CVE, no CVSS and no published mechanism. All three now exist, and
 * they confirm the article's central observation while explaining something it
 * could only describe.
 *
 * The piece listed an odd error string among the indicators — a message about
 * no suitable driver being found for a jdbc URL — without being able to say why
 * it appeared. CVE-2026-82078 instantiates database drivers from configurable
 * driver names without checking them against an allowlist, so that error is the
 * artefact of the exploitation itself rather than an unrelated fault.
 *
 * It also said the missing server.log was the indicator. Researchers have since
 * confirmed post-exploitation cleanup of specific log files, which is the same
 * finding with names attached.
 *
 * Adds a dated update note. publishedAt is preserved by the beforeChange hook.
 *
 * Dry run by default; pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "papercut-zero-day-missing-logs-are-the-indicator";

const NOTE = `> **Update, 27 August 2026:** The flaw now has identifiers and a mechanism, and it is a chain of two. **CVE-2026-81578** (**8.8**) is an access-control failure in the web management interface: a crafted request names one page to be rendered and another that owns the component, and the authorisation check trusts the rendered page while missing the permission requirement for the actual component. That bypass lets an attacker edit a configuration file, which reaches **CVE-2026-82078** (**9.4**) — unsafe dynamic class loading that instantiates database drivers from configurable driver names **without checking them against an allowlist**. watchTowr's **Jake Knott** describes the chain directly: CVE-2026-81578 allows you to bypass authentication, and from there you can edit a configuration file to exploit CVE-2026-82078 and gain remote code execution.
>
> That explains the odd indicator below. The error about no suitable driver being found for a jdbc URL is not an unrelated fault — it is what a manipulated driver name leaves behind. Patches exist for **v24**, **v25** and **v26**. Attacks have been observed on **two** customer environments, running Base64-encoded reconnaissance and deploying OS-agnostic Java class files, then deleting **server.log**, **derby.log** and a file named Udydn.out — which is the article's point about missing logs, with filenames attached. Reported by Huntress (**John Hammond**, **Andrew Brandt**), watchTowr and Rapid7. Hammond's caution stands: there is not enough evidence to determine the attackers' end goal.

`;

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) { console.error(`no article with slug "${SLUG}"`); process.exit(1); }
if (doc.body.startsWith("> **Update,")) { console.log("already updated — nothing to do"); process.exit(0); }

const body = NOTE + doc.body;
console.log(`status: ${doc.status}`);
console.log(`words:  ${doc.body.split(/\s+/).length} -> ${body.split(/\s+/).length}`);
console.log(`changes: dated update note prepended with both CVEs, the chain, and the log filenames`);
if (!APPLY) { console.log("\ndry run — pass --apply to write"); process.exit(0); }
await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("applied. redeploy for the change to reach rootnotes.in.");
process.exit(0);
