/**
 * Drafts the MikroTik follow-up for 12 September.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-75.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-75.ts --update
 *
 * The chain was confirmed from CERT Polska's own exploitation advisory, fetched
 * and parsed locally rather than through a summariser: MikroTrick is
 * CVE-2026-67276 plus CVE-2026-86060, which is what the site already published
 * on 7 September. An earlier summariser reading had invented a different pair;
 * the raw text settles it.
 *
 * What is new, and what this piece is about:
 *   1. The six flaws were found in an agent-driven laboratory using two OpenAI
 *      models under the GTAC programme, and CERT Polska published an unusually
 *      honest account of what the models did not do.
 *   2. The technique that worked — modelling protocols as state machines and
 *      breaking the order of steps — matches the shape of the bugs found.
 *   3. CISA's catalogue lists CVE-2026-86060 and CVE-2026-67277. It does not
 *      list CVE-2026-67276, the authentication bypass that starts the chain,
 *      and CVE-2026-67277 is the one CERT Polska says is not in the chain.
 *   4. MikroTik shipped compromise detection inside the patch, and said plainly
 *      that a clean marker proves nothing.
 *
 * Scores differ by source: CERT Polska gives 9.2 / 9.2 / 8.8, NVD gives
 * 9.2 / 9.8 / 8.2. Both are named in the body.
 *
 * Cover checked at full 1600x900 and reuse-checked. Three router photographs
 * were rejected for carrying TP-Link, ASUS and DrayTek branding on a MikroTik
 * story, and a terminal photograph was dropped for showing unrelated Raspberry Pi package names.
 *
 * No backticks and no angle brackets in the body.
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
    slug: "cert-polska-found-the-mikrotik-flaws-with-ai-agents",
    title: "CERT Polska found the MikroTik flaws with AI agents, and wrote down what the agents could not do",
    excerpt:
      "The six RouterOS vulnerabilities behind the MikroTrick chain came out of an agent-driven laboratory running two OpenAI models. The technique that worked was modelling protocols as state machines and breaking the order of the steps, which is exactly the shape of the bugs. Meanwhile CISA's catalogue lists two of the six, and one of them is not in the chain.",
    categorySlug: "security",
    tags: ["mikrotik", "routeros", "cert-polska", "ai-agents", "vulnerability-research", "cisa-kev", "mikrotrick", "state-machines"],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1546124404-9e7e3cac2ec1${P}`,
    body: `[When we covered the MikroTik chain last week](/article/cert-polska-two-flaws-chained-against-mikrotik-nobody-will-say-which-two), the story was that nobody would say which two flaws combined. They have since been named: **CVE-2026-67276**, an SSH authentication bypass, and **CVE-2026-86060**, privilege manipulation through a crafted username. CERT Polska calls the pair **MikroTrick**.

What has not been written about is how the vulnerabilities were found, and CERT Polska's own account of that is the most useful thing published about this incident.

## Found in an agent-driven laboratory

From the advisory, under a heading CERT Polska titled Research supported by LLMs:

**"The vulnerabilities were discovered by Sławomir Rozbicki from the CERT Polska team using the GPT-5.5-cyber and GPT-5.6-sol models as part of the team's access to the OpenAI Government and Trust Agency Collaboration (GTAC) program."**

The set-up: an isolated laboratory of MikroTik machines, documentation of the system architecture, and rules for safe test execution. Inside it, **"The models were used as part of an agent-based research environment to automate the laboratory and systematically search for vulnerabilities in areas selected and supervised by the researchers."**

What the agent actually did: **"the creation and restoration of machines, downloading and comparing versions, analyzing RFCs and binary code, and building scripts that confirm the presence of vulnerabilities."**

That is a national CERT describing, in public, an offensive research pipeline it ran against a vendor's firmware with model assistance. It is the mirror image of the week's other agent stories — [the PaperCut operator who pointed hundreds of agents at print servers](/article/papercut-ai-agents-were-told-to-skip-28-countries-and-hit-six-of-them) was doing a cruder version of the same thing, without the laboratory or the supervision.

## The technique explains the bugs

One sentence in the advisory does more work than the rest: **"Modeling protocols as state machines and checking what happens when a stage is skipped, repeated, or executed in the wrong order proved particularly effective."**

Now look at what came out of it. Nearly every flaw in the set is a step taken out of order:

- **CVE-2026-67276** — during public key authentication the server compares the key type and modulus but not the whole key, so a stage of the check is effectively skipped.
- **CVE-2026-67277** — the bandwidth-test service **"allowed an unauthenticated connection to enter a state that should only be reachable after logging in."**
- **CVE-2026-67279** — SSH enters the connection protocol after a client-requested rekey **"even though user authentication was never attempted."**
- **CVE-2026-86060** — a username beginning with a disallowed character is read by the login helper as an argument rather than as data.
- **CVE-2026-67281** — a newly allocated WebFig session keeps a stale pointer from a previous one.

This is a single bug class found five times: the protocol has an order, the implementation does not enforce it, and something that should only be possible later becomes possible earlier. A method that systematically asks what happens when you skip a step will find exactly these, which is a more interesting result than the raw count.

## What the models did not do

The part worth quoting in full, because it is rarer than the announcement:

**"This was not, however, the result of a single instruction (prompt). Every hypothesis required confirmation on a real RouterOS system, negative control tests, repetition on a machine in a clean state, and an impact assessment by the researchers."**

And on where the work actually went: the most labour-intensive parts were **"preparing useful context about RouterOS, designing a safe laboratory and tools, choosing research directions, and then fully verifying the results, eliminating false conclusions, and documenting the real impact of each vulnerability."**

Their conclusion: **"The models significantly accelerated analysis and hypothesis exploration, but they did not replace these stages."**

Three specific things in there are worth keeping: **negative control tests**, **repetition on a clean machine**, and **eliminating false conclusions**. Those are the defences against a model that produces a confident, plausible, wrong finding — and they are the steps most likely to be dropped by anyone reproducing this pipeline in a hurry.

## Why it was published early

CERT Polska also explains its timing, and the reason is one that keeps recurring: **"We are publishing this information on an accelerated schedule because the patched RouterOS packages are already public, and their comparative analysis has allowed the community to reconstruct some of the fixed bugs."**

The fix was the disclosure. Once the patched packages shipped, comparing them against the previous release told anyone who cared what had been wrong. The advisory withholds exploit code, which at that point is the only thing left to withhold.

## CISA lists two, and one of them is not in the chain

Here is the part that will not show up in a summary. On **10 September** CISA added two MikroTik flaws to the Known Exploited Vulnerabilities catalog, both with a federal deadline of **13 September**.

| Flaw | CERT Polska's description | In the catalogue |
|---|---|---|
| CVE-2026-67276 | First half of MikroTrick: SSH authentication bypass | No |
| CVE-2026-86060 | Second half: privilege manipulation via crafted username | Yes |
| CVE-2026-67277 | Not part of the chain: memory disclosure and crash in bandwidth-test | Yes |

So the catalogue names the escalation and a denial-of-service issue, and omits the authentication bypass that the confirmed attacks start with.

Two fair qualifications. The catalogue lists flaws with evidence of exploitation, so CISA may simply have different telemetry than CERT Polska. And because a single RouterOS update fixes all six, anyone who patches is covered regardless of which entries are listed.

But plenty of organisations triage from the catalogue rather than from the vendor. For them, this list points at the second step of the chain and not the first.

The scores disagree too, which is worth naming when quoting them. CERT Polska publishes **9.2**, **9.2** and **8.8** for those three flaws. NVD's records give **9.2**, **9.8** and **8.2**.

## MikroTik put a detector in the patch

The other genuinely unusual thing here is what shipped with the fix. In the patched releases, RouterOS **"scans the configuration for known signs of unauthorized changes, disables the recognized suspicious configuration entries, writes a critical message to the log, and sets a warning (the Flagged marker)."**

A vendor shipping compromise detection inside a security update is not common, and it is the right instinct for a device class where nobody reads the logs. MikroTik also, per CERT Polska, sent a push notification to the phones of users with its app installed — **"for the first time in history."**

CERT Polska is careful about what the marker means: **"This mechanism detects only selected traces left after a compromise - the absence of the marker is not proof that the device is safe."** And a device that is flagged should be treated as taken over, not as proof of which vulnerability was used.

## What to do

- **Update to 6.49.21, 7.23.4, 7.24.2 or 7.25beta3**, matching your branch. One update closes all six.
- **Check the flagged value** in the output of the system device-mode print command, and read the log for the critical message.
- **Search the logs for the two published strings** — a login failure for user -2 arriving over ssh, and an account added by ssh:-2 — and for a highly privileged account named **ops**.
- **Check whether the addresses 82.192.72.4 or 103.102.31.18 appear.** Attacks from the first have been observed since at least 2 September.
- **If anything is flagged, secure the logs and configuration before you reset**, then factory reset, rebuild from a verified configuration, and rotate every password, key and secret. Do not restore a backup taken from a device you suspect, and do not clear the marker before the analysis is finished.
- **Take SSH, WWW and the bandwidth-test server off the public internet** whether or not you have patched.

## What is not established

- **Why CVE-2026-67276 is absent from the catalogue**, and whether CISA has separate evidence for the bandwidth-test flaw.
- **How many devices were compromised.** The exposure figure of roughly 122,500 with SSH reachable counts what is reachable, not what fell.
- **Who is behind the attacks**, or what the routers are being used for.
- **How much of the discovery the models drove** versus the researchers, beyond the account given.
- **Whether the Flagged mechanism misses categories of tampering** beyond the selected traces CERT Polska mentions.`,
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
