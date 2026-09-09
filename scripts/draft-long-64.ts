/**
 * Drafts the 9 September late batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-64.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-64.ts --update
 *
 *   1. F5 BIG-IP APM. Two things worth the article: the web shell never exists
 *      on disk in final form, so file integrity monitoring against known-good
 *      copies passes — and the entry CVE was published as a denial of service
 *      in October 2025 and reclassified as unauthenticated RCE five months
 *      later, which means everyone who triaged it correctly at the time was
 *      wrong for five months.
 *   2. cPanel. The advisory publishes almost nothing — no CVSS, no mechanism,
 *      no privilege detail, no workaround — and on shared hosting the attacker
 *      precondition is satisfied by anyone who buys a plan.
 *   3. Shai-Hulud. 469 is locations searched, not credentials found, up from
 *      189. What entered the list is the signal: AI tool configuration.
 *
 * Covers checked at full size.
 *
 * No backticks and no angle brackets in the bodies.
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
    slug: "f5-big-ip-web-shell-never-exists-on-disk-and-the-cve-was-filed-as-dos",
    title: "The web shell never exists on disk, and the CVE that let it in was filed as a denial of service",
    excerpt:
      "Sophos documented malware that infects the Apache binary on F5 BIG-IP APM, hooks the runtime as PHP loads, and writes a web shell into memory in front of three real scripts. File integrity checks pass. The entry point, CVE-2025-53521, was published as a DoS in October 2025 and reclassified as unauthenticated RCE five months later.",
    categorySlug: "security",
    tags: ["f5", "big-ip", "web-shell", "sophos", "memory-resident", "cve-2025-53521", "edge-devices"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1600336757481-6185c4be6ff6${P}`,
    body: `Sophos published analysis on **7 September 2026** of malware found on **F5 BIG-IP Access Policy Manager**, the appliance component that decides who is allowed through the edge into an organisation.

The chain is worth following step by step, because each step is chosen to defeat a specific control.

## How the shell gets into memory

An installer named **umount** prepends malicious code to the Apache binary at **/usr/sbin/httpd**.

When Apache loads, that code hooks the Apache Portable Runtime function **apr_dso_load** and waits for the PHP module to be activated.

The moment PHP loads, the malware reads **/proc/self/maps**, makes memory pages temporarily writable, and rewrites the file-access function calls.

Then it waits for one of exactly three scripts — **apm_css.php3**, **full_wt.php3**, **webtop_popup_css.php3** — and when one is loaded, inserts the web shell **in front of the original content**.

Sophos's own summary of why that matters: **"The web shell does not need to exist in its final form on disk."**

## Which control that defeats, precisely

File integrity monitoring on an appliance usually works by comparing files against known-good copies. Those three .php3 files on disk are unmodified. They hash correctly. A diff against the vendor image comes back clean.

The shell is assembled in memory as the file is read, so the artefact you would compare never touches the filesystem. F5 notes that changes to those three scripts do not on their own confirm compromise — which cuts both ways, because their absence does not clear you either.

[The HAProxy implant last week reached the same destination differently](/article/ted-implant-haproxy-2-8-12-not-a-haproxy-vulnerability), by being version-identical to a clean build. Both are the same idea: do not evade the check, arrange for the check to pass.

## What the shell does

It reads HTTP request bodies looking for a marker, decrypts the remainder, and executes the command. It answers with **HTTP 201** and a **CSS content type**, so the traffic reads as a stylesheet response rather than as command output.

It also opens a local socket at **/run/bigtlog.pipe** giving bash access **without any network exposure** — so an operator who is already on the box does not need to touch the network path at all.

ESET reports the malware is built to survive upgrades by infecting installation images covering **umount**, **httpd** and **rc.local**. The usual remediation for a compromised appliance is to rebuild it, and this is designed for exactly that.

## The entry point was filed as a denial of service

**CVE-2025-53521** is the way in: unauthenticated remote code execution, **CVSS 9.8/9.3**, affecting BIG-IP APM where an access policy is configured on virtual servers.

It was published in **October 2025** as a **denial of service**, and reclassified on **27 March 2026** after exploitation was discovered.

Sit with what that means for anyone who triaged it at the time. A DoS on an edge appliance is a real issue and a routine one — it goes in the next maintenance window, behind anything that grants access. That was a correct decision on the information published, and it was wrong for **five months**.

The patch has existed since October 2025. The reason to install it changed in March 2026, and nothing about the CVE identifier changed to make anyone look again.

This is the argument for re-reading old advisories rather than trusting the triage you did when they landed. Classifications move, and nothing notifies you.

## Indicators

Files and processes:

- **/run/bigtlog.pipe** or **/run/bigstart.ltm** present
- Size or timestamp mismatches on **/usr/bin/umount** or **/usr/sbin/httpd**
- Changes to the three .php3 scripts, which F5 notes are not confirmation on their own

SHA-256: **26bd5b0722d1dbab5db749a063c49bc8638653ac2addfead7a9cb3d6d57bccc9**

Behaviour, which is where the real signal is:

- Apache workers reading **/proc/self/maps**
- Memory permission changes around libphp
- Socket binding under **/run**
- Bash spawning via the iControl REST API
- **HTTP 201** responses carrying a CSS content type
- SELinux being disabled through iControl REST

Logs: **/var/log/restjavad-audit** showing local iControl REST access, **/var/log/auditd** showing SELinux modification, and **/var/log/audit** showing base64 data writes and **/run/bigstart.ltm** execution.

## What to do

- **Patch CVE-2025-53521 if you have not.** The fix has been available since October 2025 across the 15.1.0 to 17.5.1 range.
- **Stop hunting by file hash on this one and hunt by behaviour.** An Apache worker reading its own memory map is not normal, and it is the cheapest detection in the list.
- **Check for the two socket paths first.** They are the fastest yes-or-no available.
- **Do not assume a rebuild clears it.** ESET says the malware targets installation images specifically.
- **Re-read your October 2025 triage decisions.** This CVE changed category five months after you filed it.

## What is not established

- **Whether patching removes an existing infection.** F5 has not said.
- **When exploitation actually began** relative to the October 2025 disclosure.
- **Who is behind it.** Sophos says it lacks evidence to attribute; ESET was undecided as of April 2026.
- **How widespread it is.** A single sample was analysed, and Sophos withheld the victim and how it obtained the sample.`,
  },
  {
    slug: "cpanel-advisory-says-almost-nothing-and-shared-hosting-is-the-population",
    title: "The cPanel advisory says almost nothing, and on shared hosting the precondition is a paid plan",
    excerpt:
      "CVE-2026-67401 affects every supported version of cPanel and WHM, and lets an authenticated account holder with mail privileges reach root. There is no CVSS score, no explanation of how SQL injection becomes file creation becomes root, no detail on which privilege is required, and no workaround.",
    categorySlug: "security",
    tags: ["cpanel", "whm", "cve-2026-67401", "shared-hosting", "privilege-escalation", "advisories"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1484557052118-f32bd25b45b5${P}`,
    body: `cPanel has patched **CVE-2026-67401**, which lets an authenticated account holder with mail-related privileges execute code as **root**.

**Every supported version of cPanel and WHM is affected.** The fixed builds:

| Release line | Fixed in |
|---|---|
| 11.110 | 11.110.0.143 |
| 11.134 | 11.134.0.55 |
| 11.136 | 11.136.0.39 |
| 11.138 | 11.138.0.4 |
| WP Squared | 11.138.1.9 |

Reported by **Ali Mustafa (rz1027)** and **abed1526**. No public exploit, not in CISA's KEV catalogue, no reported exploitation.

## What the advisory does not contain

This is unusually thin, and the gaps are worth listing because each one is a question an administrator has to answer anyway:

- **No CVSS score.** Nothing to feed a prioritisation process.
- **No mechanism.** The advisory does not explain how an SQL injection problem becomes file creation and then becomes root access. Three distinct steps, none described.
- **No definition of the precondition.** "Mail-related privileges" is the stated requirement, and EmailTrack is mentioned, but which privilege level actually qualifies is not said.
- **No workaround**, unlike previous cPanel advisories.
- **No guidance on whether patching removes attacker artefacts** from a server already compromised.

A shop deciding whether this is a same-night emergency or a next-window job has been given the affected version list and nothing else to reason with.

## On shared hosting, the precondition is the business model

"Requires an authenticated account holder with mail privileges" reads like a constraint. On the population that actually runs cPanel, it is a description of the customer.

Shared hosting puts many unrelated customers on one machine, each with a cPanel account, each with mail. The attacker precondition here is **buying a plan** — often a few dollars a month, often with no identity verification beyond a payment that can be made with a stolen card.

So the boundary this flaw crosses is not the perimeter. It is the wall between paying tenants, and on the other side of it is root on a box holding every other customer's files, databases and mail.

[The WordPress plugin campaigns we covered this week](/article/440000-blocked-attempts-is-a-waf-metric-not-a-compromise-count) hit the same population from outside. This one starts inside, and it does not need a vulnerability in anybody's website.

## The people at risk cannot fix it

Worth stating plainly, because most vulnerability advice assumes the reader controls the software.

If you are a hosting customer, you cannot patch cPanel. You do not have root, you do not choose the build, and you will not be told when it is updated. The only action available to you is to ask, and the only lever is choosing a different host.

If you are a hosting provider, you are the entire mitigation for everyone on your platform, and the flaw is in the tenant boundary you sell.

## What to do

**If you run the servers:**

- **Update to the fixed build for your release line** — the table above.
- **Do not wait for a CVSS score.** Root from a tenant account on a multi-tenant box is the severity, whatever number eventually gets attached.
- **Audit for artefacts yourself.** Nobody has said whether patching cleans a compromised server, so check for unexpected root-owned files, cron entries and SUID binaries with recent timestamps.
- **Review which accounts hold mail-related privileges**, since that is the stated precondition and it is probably broader than you assume.

**If you are a customer:**

- **Ask your host which cPanel build they are on.** A host that answers quickly is telling you something; one that cannot is telling you more.
- **Keep your own backups off the platform.** This is the general lesson of every shared-hosting incident.

## What is not established

- **The severity score.** None published.
- **How the chain works.** SQL injection to file creation to root is asserted, not explained.
- **Which mail privilege is required.**
- **Whether patching removes artefacts** left by a prior compromise.
- **Whether it has been exploited.** No reports, no KEV listing.`,
  },
  {
    slug: "shai-hulud-searches-469-places-now-and-one-of-them-is-your-ai-config",
    title: "Shai-Hulud searches 469 places now, and the new ones include your AI tool config",
    excerpt:
      "GitGuardian found a variant of the npm worm checking 469 locations across developer environments for credentials, up from 189. That number counts places it looks, not credentials it found — and what was added is the interesting part: CI/CD tooling, cloud configuration, and AI tool settings.",
    categorySlug: "security",
    tags: ["shai-hulud", "npm", "supply-chain", "gitguardian", "credentials", "infostealer", "ai-tooling"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1733412505442-36cfa59a4240${P}`,
    body: `GitGuardian identified an evolved variant of the **Shai-Hulud** worm in early **August 2026**, searching **469** locations across developer environments for credentials. The previous version checked **189**.

## What 469 counts

It counts **places the malware looks**, not credentials it found, and not machines infected.

That distinction is going to be lost immediately, because 469 reads like a haul. It is a capability figure — the size of the search, published by researchers who read the code, and it says nothing about how many developers were reached or what came back.

No infection count has been published. No indicators of compromise were included. There is no npm statement in the reporting.

So the honest reading: the worm got more thorough, and nobody outside GitGuardian can say how well it did.

## The additions are the signal

Where it looks has always been the interesting part, because the list is a map of what is worth stealing at a given moment.

The original set was the classic developer environment: **.env** files, shell history, package manager configuration. The new variant adds **CI/CD tooling**, **cloud configuration**, and — the one worth stopping on — **AI tool settings**.

An AI tool's configuration file holds API keys for model providers. Those keys are billable, they are frequently scoped generously because nobody expects a model endpoint to be a lateral movement path, and they are stored by tools that were written recently and fast. A year ago they were not on anybody's target list. They are on this one.

If your organisation has been issuing model provider keys to developers on the assumption that the worst case is a surprise invoice, this is the week to revisit that.

## It does not break trust. It borrows it.

The mechanism is worth being precise about, because "supply chain worm" invites the wrong mental picture.

Shai-Hulud does not compromise npm, forge signatures or break a trust relationship. It harvests credentials and then **uses them as intended**. Publishing credentials are the dangerous class: with them, the worm pushes a package through the normal, trusted, fully authenticated channel, and everything downstream verifies correctly because everything downstream is correct.

Which means the detection question is not "was this package tampered with" but "did the person whose key signed it actually mean to". [The same shape turned up in the JSCeal analysis this week](/article/jsceal-nothing-in-google-authentication-was-bypassed): nothing cryptographic failed, an attacker simply held something they should not have.

## What to do

- **Treat model provider API keys as production credentials.** Scope them, rotate them, and put them somewhere a file-scanning worm does not reach.
- **Get credentials out of .env files on developer machines.** That has been the advice for years and this is the reason it keeps being given.
- **Rotate npm publishing tokens**, and require two-factor authentication for publish. Publishing credentials are the ones that propagate.
- **Check CI/CD variable stores against what actually needs to be there.** The new search list includes them because they are usually generous and rarely audited.
- **Do not read 469 as a breach figure.** It is the size of a search.

## What is not established

- **How many machines are infected.** No figure published.
- **Which organisations were affected.**
- **How many credentials were actually taken**, as opposed to looked for.
- **Whether the distribution vectors have changed.**
- **Attribution.** None offered.`,
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
