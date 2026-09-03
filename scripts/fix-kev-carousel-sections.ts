/**
 * Reshapes two sections of the KEV batch piece for the carousel.
 *
 *   npx tsx --env-file=.env.local scripts/fix-kev-carousel-sections.ts
 *   npx tsx --env-file=.env.local scripts/fix-kev-carousel-sections.ts --apply
 *
 * scripts/carousel-scores.ts showed two mismatches:
 *
 * 1. "Both AI-stack auth bugs fail open" would have shown one of the two.
 *    The Starlette paragraph won at 7.20 and the LiteLLM one placed second
 *    at 6.05, so the card said "both" in the heading and described one. The
 *    two mechanisms are merged into a single paragraph with the shared
 *    defect stated at the end, and the version detail moved to the paragraph
 *    after it so nothing is lost from the article.
 * 2. "Starlette is the one you do not know you run" would have shown the
 *    LiteLLM aside, which won 5.91 to 5.46 against the FastAPI point the
 *    heading promises. The FastAPI paragraph absorbs the sentence that was
 *    carrying the operational question and now wins.
 *
 * Published article, so this is an update. `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "kev-seven-additions-litellm-starlette-fail-open-auth";
const APPLY = process.argv.includes("--apply");

const edits: [string, string][] = [
  [
    `**CVE-2026-59822** is improper authentication in **LiteLLM**'s MCP Streamable HTTP endpoint. Per the advisory, after a failed API key verification the code **falls back to empty credentials** — so an unauthenticated attacker can establish an authenticated MCP session using **an arbitrary bearer token**. Fixed in **1.84.0**.

Read that mechanism carefully. The check did not fail to run. It ran, it failed, and the failure path treated "no valid credential" as "no credential required".

**CVE-2026-48710**, called **BadHost**, is in **Starlette**. A single malformed character injected into the HTTP **Host** header lets an attacker prepend a path, so the reconstructed URL no longer matches what path-based security middleware thought it was protecting. Anything authenticating on that reconstructed path is bypassed. It affects **0.8.3 through 1.0.0** and is fixed in **1.0.1**. CISA's entry notes it can be chained with **CVE-2026-42271**.`,
    `**CVE-2026-59822** is improper authentication in **LiteLLM**'s MCP Streamable HTTP endpoint: after a **failed** API key verification the code falls back to **empty credentials**, so any bearer token opens an authenticated session. **CVE-2026-48710**, called **BadHost**, is in **Starlette**: one malformed character in the HTTP **Host** header prepends a path, so anything authenticating on the reconstructed URL is bypassed. Neither check failed to run. Both ran, failed, and continued.

LiteLLM is fixed in **1.84.0**. Starlette is affected from **0.8.3 through 1.0.0** and fixed in **1.0.1**; CISA's entry notes it can be chained with **CVE-2026-42271**.`,
  ],
  [
    `Most organisations affected by CVE-2026-48710 do not have Starlette on any inventory. They have **FastAPI**, which is built on it — and CISA's entry says so explicitly, flagging it as an open-source component that could be used by different products.

That makes this a dependency problem before it is a patching problem. The remediation instruction is "upgrade Starlette", and the operational question is which of your services pulls it in transitively, through which framework, pinned at what version.`,
    `Most organisations affected by CVE-2026-48710 do not have Starlette on any inventory. They have **FastAPI**, which is built on it — and CISA's entry says so explicitly, flagging it as an open-source component that could be used by different products. The remediation instruction is "upgrade Starlette"; the operational question is which of your services pulls it in transitively, through which framework, pinned at what version.

That makes this a dependency problem before it is a patching problem.`,
  ],
];

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "articles",
  where: { slug: { equals: SLUG } },
  limit: 1,
});

const doc = docs[0];
if (!doc) {
  console.error(`no article with slug ${SLUG}`);
  process.exit(1);
}

let body = doc.body;
for (const [before, after] of edits) {
  if (!body.includes(before)) {
    console.error(`not found:\n${before.slice(0, 90)}...`);
    process.exit(1);
  }
  body = body.replace(before, after);
}

console.log(`${SLUG}: ${doc.body.length} -> ${body.length} chars, ${edits.length} edits`);

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");

// The afterChange hook fires revalidate and IndexNow without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
