/**
 * Drafts the second 13 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-100.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-100.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-100.ts --update
 *
 *   1. GitLab CVE-2026-97229 (security). CVSS 10.0, unauthenticated, in the
 *      CI/CD regex compiler. The piece flags that sources disagree on which
 *      19.3 release is the fix, and that one of the candidates has a known
 *      breakage — which is a patching hazard, not a footnote.
 *   2. CyberXero (security). SOCRadar's AI-augmented access broker, found
 *      through an open directory. The third operation this month documented
 *      because of a directory listing, and we wrote the other two.
 *   3. Kimsuky Operation GitPower (world). The first email carries nothing to
 *      detect, and the operators shipped a persistence script with a filename
 *      bug — which Genians says plainly and most coverage of APTs does not.
 *
 * Primary sources: GitLab's advisory as reported, SOCRadar's CyberXero
 * research as reported, and Genians' Operation GitPower write-up.
 *
 * KEV checked directly: none of CVE-2026-97229, CVE-2026-105134 or
 * CVE-2026-85097 is listed, and CISA's catalogue has not moved since
 * 2026.10.08 — so AhsayCBS, exploited since the 7th, is still absent.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - GitLab: dark code, which happens to be matcher syntax.
 *   - CyberXero: a transmission tower, for the infrastructure half.
 *   - Kimsuky: a laptop, which is where the invitation lands and the
 *     shortcut runs.
 *
 * Rejected on the way: three interior shots whose entropy crop picked the
 * ceiling, and a pylon photograph cropped down to two wires and sky.
 *
 * No backticks, angle brackets or braces in the bodies.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
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

export const drafts: Draft[] = [
  {
    slug: "gitlab-cve-2026-97229-a-regular-expression-and-no-login",
    title:
      "A regular expression in a CI configuration is enough, and nobody has to log in",
    excerpt:
      "GitLab shipped emergency patches for a flaw scored 10.0 in its CI/CD regular expression compiler, reachable without authentication. Self-managed installations are the exposed population — and sources disagree on which 19.3 release actually contains the fix.",
    categorySlug: "security",
    tags: [
      "gitlab",
      "cve-2026-97229",
      "cicd",
      "integer-overflow",
      "rce",
      "self-managed",
      "patching",
      "devops",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1604591259403-81d6c9cf87d7${P}`,
    body: `**GitLab** has released emergency patches for **CVE-2026-97229**, scored **10.0** — the top of the scale, which is rare enough to be worth pausing on.

The flaw is an integer overflow arising from insufficient validation in the **CI/CD regular expression compiler**. A crafted regular expression in CI configuration leads to arbitrary code execution on the server. The vector is network-reachable, the complexity is low, no privileges are required and no user has to do anything.

It affects both Community and Enterprise editions.

## Who is exposed

**GitLab.com is already patched. GitLab Dedicated requires no action.** The exposed population is **self-managed** installations, which is the version organisations run inside their own networks — and, as it happens, the version that tends to hold the most.

That is worth saying plainly because of what a GitLab server is. It holds source code, CI configuration, deployment credentials and the pipeline that pushes to production. We wrote recently about [an operation that reached every victim outside one sector through GitLab CI/CD variable stores and repository history](/article/azazel-gentlemen-mcp-as-a-command-channel-and-the-affiliate-who-kept-the-money) — and that attacker needed stolen credentials to get in. This needs none.

## The version numbers do not agree, and that is a problem

Affected releases are 19.2 before 19.2.8, 19.3 before its fix, and 19.4 before 19.4.2.

For 19.3, coverage splits: some outlets name **19.3.4** as the fixed release, others name **19.3.5**. That is not a trivia question when the instruction is to patch immediately.

It gets more awkward. There is a reported known issue in **19.3.4** where merge request pages break when a particular integration is enabled, with a fix planned for 19.3.5. So one candidate for "the version that fixes your critical vulnerability" is also the version with a visible functional regression — which is exactly the kind of thing that stalls a change approval.

Check GitLab's own advisory for the 19.3 number. Do not take it from a summary, including this one.

Two smaller discrepancies in the reporting of this release, for completeness: most sources date it to **12 October**, one says the 8th; and the total number of issues fixed in the same release is given as 22 by some and 24 by others. Neither changes what you do.

## Not in the exploited catalogue

We checked CISA's **Known Exploited Vulnerabilities** feed directly. CVE-2026-97229 is not in it, and the catalogue has not been updated since **8 October**.

Absence from that catalogue means CISA has not confirmed exploitation. It does not mean nobody is exploiting it — the catalogue records what has been established, and it lags. The same feed still does not list the AhsayCBS flaws that [Huntress watched being exploited on 7 October](/article/ahsaycbs-exploited-three-days-after-disclosure-and-the-safe-version-is-not).

No exploitation of the GitLab flaw has been reported, and no workaround has been published. Patching is the remediation.

## Why a regex compiler

The location is the interesting part. Nobody attacks a regular expression engine because it is a tempting target; they attack it because it is a parser that accepts input from somewhere untrusted and does arithmetic on lengths.

That is the second such story this week. The AnyDesk flaw published on 8 October was a payload length trusted before validation, with a 16-byte header added in 32-bit arithmetic so the allocation wrapped small. Different product, different language, same shape: a number that is assumed to be small, arithmetic that silently wraps, and a buffer sized by the wrong answer.

Parsers remain where this class of bug lives, and CI systems are full of them because a pipeline definition is a document the server has to interpret.

## What to do

- Upgrade self-managed GitLab now. **19.2.8** and **19.4.2** are agreed; confirm the 19.3 target against GitLab's advisory.
- If you are on 19.3 and the known issue affects you, that is a conversation to have today rather than a reason to wait. The vulnerability is unauthenticated and scored 10.0.
- Check whether your GitLab is reachable from the internet at all. For many self-managed installs it does not need to be.
- After patching, treat credentials held in CI/CD variables as potentially exposed if your instance was reachable. Rotation is cheap relative to the alternative.
- Read the rest of the release. Twenty-odd other issues shipped with it.

## What is not established

- Which 19.3 release is the fix. Sources conflict and only the vendor advisory settles it.
- Whether this is being exploited. Nothing has been reported and it is not in CISA's catalogue.
- The exact release date, 8 or 12 October, and the total issue count.
- How many self-managed instances are internet-facing, which nobody has measured publicly.
- Whether a proof of concept exists privately. A 10.0 in a widely deployed product does not usually stay theoretical for long.`,
  },

  {
    slug: "cyberxero-the-third-operation-this-month-found-through-an-open-directory",
    title:
      "The operation was documented because its working directory was browsable — the third one this month",
    excerpt:
      "SOCRadar tracked a Russian-speaking access broker running Cobalt Strike alongside an AI orchestration layer against Ukrainian infrastructure and WordPress sites worldwide. The research exists because the operator left a directory listing open, including the AI session logs.",
    categorySlug: "security",
    tags: [
      "cyberxero",
      "socradar",
      "initial-access-broker",
      "ukraine",
      "wordpress",
      "cobalt-strike",
      "ai-assisted-attacks",
      "opsec",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1504250746301-659b6b611c48${P}`,
    body: `**SOCRadar** has published research on an operation it calls **CyberXero**, which it describes as a Russian-speaking, financially motivated **initial access broker** — a business that breaks in and sells the way in to somebody else.

The entire investigation rests on one configuration mistake. The operator left an **open directory** serving their live working directory: AI session logs, scripts with plaintext tokens, and exfiltrated victim data, readable by anyone who found it.

## The third time this month

That sentence should be starting to feel familiar, because it is the third time in a fortnight we have written it.

[A Gentlemen ransomware affiliate was documented because his staging server had an unauthenticated file listing](/article/azazel-gentlemen-mcp-as-a-command-channel-and-the-affiliate-who-kept-the-money). [The operator behind the ARTEX intrusions into South Korean finance left browsable folders holding session logs and, apparently, their own CV](/article/artex-south-korean-finance-the-open-directory-held-the-operators-own-cv). Now this.

Three operations, three competent technical campaigns, three directory listings left on.

The honest reading of three in a fortnight is not that attackers are careless. It is that this is the failure mode we **can see**, so it is the one that gets written about. Every campaign documented this way is a campaign that made one specific mistake, and the ones that did not make it are not in anybody's blog. The research pipeline for threat intelligence has a bias built into it, and three in a fortnight is a good moment to notice.

## What it runs

The tooling is a mix of the completely ordinary and the new.

**Cobalt Strike** does the command and control, as it has for a decade. Alongside it SOCRadar describes an AI orchestration layer: up to **51 specialised agents** built on Anthropic's **Claude Code**, covering reconnaissance, exploitation, lateral movement and exfiltration, plus a separate **PentAGI** integration wired to Cobalt Strike through an AI provider's API.

Two things are worth keeping straight here.

First, the reporting is explicit that this connects AI assistance to established offensive tools rather than replacing an intrusion with one autonomous system. Fifty-one agents is a number about task decomposition, not about autonomy.

Second, the disclosure we make whenever this comes up: this site is written with Claude's assistance, which is stated on our [editorial policy](/editorial-policy) page. That is a reason to report this precisely, not a reason to skip it.

## Two pipelines

The structure is what makes it an access broker rather than a crew with a target.

One pipeline is **automated and global**, pointed at WordPress and e-commerce sites. In a single run SOCRadar describes it scanning **4,708 targets**, confirming access to **429 WordPress administration panels**, and deploying **32 shells in 61 seconds**.

The other is **manual and specific**, aimed at Ukrainian energy and infrastructure organisations.

That division tells you how the business works. The automated side produces inventory — access to sell, in volume, to whoever wants it. The manual side is where attention is spent, and attention is the expensive input. An access broker does not need to know what the buyer wants; it needs a catalogue.

## The number to be careful with

Reporting carries a figure of more than **628,000 records**.

It comes from **seven infrastructure targets**, and one bulletin notes the origin and full impact of the dataset are unclear. Treat it as reported rather than verified. Where a record count has not been confirmed against the organisations it supposedly came from, it is a claim about what was in a directory, not a count of affected people.

SOCRadar says the operation was still active at publication, which is its own warning: access obtained during the investigation period may already have been sold.

## What to do

- If you run **WordPress** with an administration panel reachable from the internet, you are in the automated half of this. Put it behind authentication at the edge, enforce multi-factor on administrator accounts, and check for shells in upload directories.
- Shells deployed at a rate of thirty-two a minute are not placed by hand. Look for file creation in web-writable paths rather than for a person.
- For infrastructure operators in the region: the manual pipeline is the one to read SOCRadar's indicators for.
- Treat an access broker compromise as a timer. The point of the intrusion is to sell it, so the gap between the breach and the consequence can be weeks.

## What is not established

- Whether the 628,000-record figure is accurate, or what it contains.
- Who bought anything, and what they did with it.
- Whether the automated WordPress activity and the Ukrainian targeting are the same operator throughout, or a shared toolkit.
- How many organisations are affected. Scans and confirmed panels are not the same as compromises.
- Anything about the operator's identity beyond the language assessment.`,
  },

  {
    slug: "kimsuky-gitpower-the-first-email-carried-nothing-to-detect",
    title:
      "The first email carried no link and no attachment, which is the whole reason it worked",
    excerpt:
      "Genians documented a Kimsuky campaign against Ukrainian diplomacy and security experts that opens with a clean conference invitation designed only to get a reply. The malicious file arrives in the thread afterwards — and the operators shipped a persistence script with a bug in it.",
    categorySlug: "world",
    tags: [
      "kimsuky",
      "operation-gitpower",
      "genians",
      "north-korea",
      "ukraine",
      "spear-phishing",
      "lnk",
      "asyncrat",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1490222290941-64c01f7e0f50${P}`,
    body: `**Genians** has published research on a campaign it calls **Operation GitPower**, which it attributes to **Kimsuky**, the North Korean group the US Treasury sanctioned in 2023 and describes as subordinate to the Reconnaissance General Bureau.

The targets are people working on **Ukrainian** diplomacy, security and international policy. A North Korean intelligence group collecting on Ukraine is the geopolitical note; the delivery technique is the practical one.

## The first email is clean

The opening message is a conference invitation with **no attachment and no link**. In one case the operators impersonated the organisers of a Korean cybersecurity conference.

There is nothing in it to detect. No URL for a gateway to resolve and score, no file for a sandbox to detonate, no payload to match a signature against. It is a plausible email from a plausible organisation asking a plausible question.

Its only purpose is to get a **reply**.

Once the recipient replies to that invitation, the thread is live, and the second message carries a ZIP: an HTML decoy, and a shortcut file named so that the visible part reads as a PDF invitation. Elsewhere in the campaign Genians describes a file posing as a **Zoom installer**.

This inverts the usual defensive assumption. Most filtering treats first contact as the risky moment and an established thread as context that lowers suspicion. Here first contact is deliberately harmless, and the thread the recipient helped create is the delivery channel.

When one file-based attempt failed, the operators went back to the **same thread** and sent a link instead — a Zoom-lookalike domain, with a page mixing Google Meet, Gmail and Zoom branding. The thread was worth more than the payload.

## They are not flawless, and the researchers say so

The detail worth the most here is one most writing about state-linked groups leaves out.

Genians found a persistence script that **saved a file under one name while the scheduled task it created called a different one**. It did not work. A later revision fixed it.

That is a bug. It is the kind of bug anybody writes, and it means at least some attempts failed for reasons that have nothing to do with the defender. Genians is direct that the intrusion was neither automatically successful nor technically flawless.

It is worth saying because the word "APT" does a lot of unearned work. A sanctioned intelligence service with a budget still ships broken code, tests in production and patches it afterwards. Treating these operations as inevitable is bad for defenders — it makes ordinary controls feel pointless when in practice they are catching things, and so is the attackers' own sloppiness.

## The supporting infrastructure

Beyond the lures, Genians describes the campaign using **GitHub and GitLab as command-and-control channels**, and staging encrypted .NET **AsyncRAT** payloads disguised as image files.

Code hosts as C2 is now a pattern rather than a trick. [A botnet resolves its command server out of a poem in a GitHub repository](/article/poellm-canto-incognito-the-c2-address-is-four-words-in-a-poem); [a credential-theft campaign commits its payload as a workflow file](/article/ghostaction-the-workflow-was-tailored-to-the-secrets-each-repository-used); here a state group uses the same hosts for the same reason. Traffic to a code host from a developer's machine, or from almost any corporate network, is traffic nobody blocks.

Earlier Genians work on the same actor covered thirteen malicious shortcut samples collected between **11 and 19 August 2026**, using Korean business-document lures — the same technique pointed at a different audience.

## Attribution

Genians ties this to Kimsuky on overlaps with earlier campaigns, infrastructure clues, and **North Korean vocabulary recovered from operator logs**.

That last one is the strongest of the three and the most fragile. Vocabulary in a log is evidence about who typed, which is better than most language-based attribution — and it is still evidence about a person at a keyboard rather than about who tasked them.

## What to do

- Train the specific shape, not the general warning. "Be careful with attachments" does not cover an email whose first message has none.
- Treat **shortcut files** as executables, because they are. Blocking .lnk delivery through mail and archive extraction removes this entire chain.
- Check whether your environment distinguishes a reply in an existing thread from a new inbound message. If it relaxes for threads, that is the gap being used.
- Log and review outbound connections to code hosts from machines that have no development role.
- For the people most at risk — policy researchers, journalists, diplomatic staff — phishing-resistant authentication and a verification habit outside the thread are worth more than any filter.

## What is not established

- Whether anyone was successfully compromised. The coverage confirms no victims.
- The scale of the campaign. Genians describes technique, not totals.
- Who the intelligence requirement came from, as distinct from who ran the operation.
- Whether the Ukrainian targeting is a new standing priority or a short-term tasking.
- How the fixed persistence script performed afterwards.`,
  },
];

const isMain =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const UPDATE = process.argv.includes("--update");
  // Imported here, not at the top, so check-drafts-offline.ts can import this
  // module without loading the Payload config or needing a database.
  const { getPayload } = await import("payload");
  const { default: config } = await import("@payload-config");

  const payload = await getPayload({ config });

  for (const draft of drafts) {
    const existing = await payload.find({
      collection: "articles",
      where: { slug: { equals: draft.slug } },
      limit: 1,
      depth: 0,
      select: { status: true },
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
}
