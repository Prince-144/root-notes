/**
 * Drafts the 2 September KEV batch piece.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-47.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-47.ts --update
 *
 * Every figure below is read from the CISA KEV feed directly. Catalogue
 * state: 1,694 entries, released 2026-09-02T16:54:39Z.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "@/payload-types";

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
const UPDATE = process.argv.includes("--update");

const drafts: Draft[] = [
  {
    slug: "kev-seven-additions-litellm-starlette-fail-open-auth",
    title:
      "CISA added seven exploited flaws in one day, and the two with the widest blast radius are auth checks that fail open",
    excerpt:
      "LiteLLM falls back to empty credentials after a failed API key check, so any bearer token opens an authenticated MCP session. Starlette lets a single malformed character in the Host header walk past path-based auth. Five of the seven additions carry a three-day deadline.",
    categorySlug: "security",
    tags: ["kev", "cisa", "litellm", "starlette", "fastapi", "fail-open"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1550353127-b0da3aeaa0ca${P}`,
    body: `On **2 September 2026** CISA added **seven** vulnerabilities to the Known Exploited Vulnerabilities catalogue in a single release, taking it to **1,694** entries.

Four of them are edge appliances and developer infrastructure this site wrote about last week. Three are the Python and AI service stack, and those are the ones worth your morning.

## What was added

| CVE | Product | Remediation due |
| --- | --- | --- |
| CVE-2026-59822 | BerriAI LiteLLM | 16 September |
| CVE-2026-48710 | Starlette | 16 September |
| CVE-2026-49869 | Kestra OSS | **5 September** |
| CVE-2026-82329 | JFrog Artifactory | **5 September** |
| CVE-2026-9586 | Sangoma Switchvox | **5 September** |
| CVE-2026-83548 | SonicWall SMA1000 | **5 September** |
| CVE-2026-83549 | SonicWall SMA1000 | **5 September** |

**Five of the seven carry a three-day deadline.** That is the treatment CISA reserves for exploitation it considers current rather than historical, and it is worth reading as a severity signal in its own right. Required actions cite **BOD 26-04**, the directive that replaced BOD 22-01.

## Both AI-stack auth bugs fail open

The two entries with the longest reach are authentication bypasses, and both fail in the same direction.

**CVE-2026-59822** is improper authentication in **LiteLLM**'s MCP Streamable HTTP endpoint. Per the advisory, after a failed API key verification the code **falls back to empty credentials** — so an unauthenticated attacker can establish an authenticated MCP session using **an arbitrary bearer token**. Fixed in **1.84.0**.

Read that mechanism carefully. The check did not fail to run. It ran, it failed, and the failure path treated "no valid credential" as "no credential required".

**CVE-2026-48710**, called **BadHost**, is in **Starlette**. A single malformed character injected into the HTTP **Host** header lets an attacker prepend a path, so the reconstructed URL no longer matches what path-based security middleware thought it was protecting. Anything authenticating on that reconstructed path is bypassed. It affects **0.8.3 through 1.0.0** and is fixed in **1.0.1**. CISA's entry notes it can be chained with **CVE-2026-42271**.

This is the third fail-open authentication story here in a week. [METR lost an API key because an auth check silently stopped checking](/article/metr-attacker-asked-the-agent-for-its-api-key), and [Artifactory issued a phantom join key to instances that had not configured one](/article/jfrog-artifactory-phantom-join-key-admin-tokens-three-days). Different products, one defect: the code decided what to do when authentication did not succeed, and chose to continue.

A failed check that returns "unauthenticated" is a bug you find in a test. A failed check that returns "fine" is a bug you find in KEV.

## Starlette is the one you do not know you run

Most organisations affected by CVE-2026-48710 do not have Starlette on any inventory. They have **FastAPI**, which is built on it — and CISA's entry says so explicitly, flagging it as an open-source component that could be used by different products.

That makes this a dependency problem before it is a patching problem. The remediation instruction is "upgrade Starlette", and the operational question is which of your services pulls it in transitively, through which framework, pinned at what version.

If your answer to that is a search across lockfiles rather than a lookup in an asset register, that is the actual finding here, and it will be the same next time.

The same reasoning applies to **LiteLLM**, which sits as a proxy in front of models for a lot of teams and is therefore holding provider credentials for all of them. We have written about [poisoned LiteLLM releases reaching 2,500 organisations](/article/litellm-poisoned-releases-cloudsek-2500-organisations); this is the same component reached a different way.

## Kestra is unauthenticated command execution

**CVE-2026-49869** in **Kestra OSS** is OS command injection allowing an unauthenticated remote attacker to **create and execute arbitrary workflows without credentials**. It is on the three-day clock.

A workflow orchestrator is a machine whose entire job is running things on other machines with stored credentials. Arbitrary workflow creation is not a foothold on one host; it is the scheduler.

## About the four we said were not in KEV

Last week this site checked the feed directly for the SonicWall pair, the Switchvox SQL injection and the Artifactory bypass, reported all four **absent**, and said in each piece that KEV would be behind on them.

All four were added on 2 September, with **5 September** deadlines. The prediction was right and the window was **48 hours** wide.

That is not a boast — the point of saying it out loud at the time was that the gap is a known property of the catalogue, not a flaw in it. KEV records exploitation that has been established. It is a floor for prioritisation and it cannot be the ceiling, because everything spends some days being exploited before it qualifies.

Those three articles now carry the update.

## What to do

- **Upgrade Starlette to 1.0.1**, and find it by searching lockfiles, not asset lists. FastAPI services are affected without naming it.
- **Upgrade LiteLLM to 1.84.0.** If it fronts your model access, treat the provider credentials it holds as exposed for the period it was reachable.
- **Patch Kestra, Artifactory, Switchvox and the SonicWall pair by 5 September** if you are on a federal clock, and this week regardless.
- **Grep your own code for the fail-open pattern.** Find every place authentication can fail, and check what the code does next. The answer should be a refusal, not a default.
- **Check for MCP sessions you did not open.** The LiteLLM flaw grants a session, and a session is not a request in a log.

## What is not established

- **How widely any of the seven are being exploited.** KEV records that exploitation is known, not its scale.
- **Whether the LiteLLM and Starlette entries are related in the wild**, beyond CISA noting that CVE-2026-48710 can be chained with CVE-2026-42271.
- **Who is exploiting them.** No attribution accompanies KEV entries.
- **Whether the three-day deadlines were met.** Compliance data is not published per-CVE.
- **How many products embed the affected Starlette range.** CISA flags the component-reuse problem and does not enumerate it, because nobody can.`,
  },
];

const payload = await getPayload({ config });

for (const draft of drafts) {
  const existing = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
  });

  const clash = existing.docs[0];
  const words = draft.body.split(/\s+/).length;

  if (clash?.status === "published") {
    console.log(`skipped (published): ${draft.slug}`);
    continue;
  }

  if (clash && UPDATE) {
    await payload.update({ collection: "articles", id: clash.id, data: draft });
    console.log(`updated: ${draft.slug} (${words} words)`);
    continue;
  }

  if (clash) {
    console.log(`skipped (draft exists, pass --update): ${draft.slug}`);
    continue;
  }

  const created = await payload.create({
    collection: "articles",
    data: {
      ...draft,
      author: "Prince Baruwala",
      publishedAt: new Date().toISOString(),
      status: "draft",
    },
  });
  console.log(`drafted: ${draft.slug} (id ${created.id}, ${draft.categorySlug}, ${words} words)`);
}

await new Promise((resolve) => setTimeout(resolve, 3000));
process.exit(0);
