/**
 * Drafts three pieces from 31 August - 2 September news.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-44.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-44.ts --update
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
    slug: "sality-sinkholed-peer-list-15000-machines-still-infected",
    title:
      "Police used Sality's own peer list against it. The 15,000 machines are still infected",
    excerpt:
      "Sality trusted any peer that spoke its protocol, so investigators became its peers and substituted sinkholes for the real ones. The operator is reportedly still in Bashkortostan, no arrests are reported, and the malware sitting on every one of those machines is exactly where it was on Sunday.",
    categorySlug: "security",
    tags: ["sality", "botnet", "takedown", "crowdstrike", "doj", "p2p"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1638013574869-7efea993a6e0${P}`,
    body: `On **31 August 2026**, the **US Department of Justice**, with authorities in **Bulgaria**, **Hungary** and **Romania** and private partners **CrowdStrike** and the **Shadowserver Foundation**, sinkholed the **Sality** peer-to-peer network and seized malware-hosting domains across the US and Europe.

Sality has been running since **2003**. It is older than most of the machines it infects.

## The flaw they exploited was missing authentication

Sality has no central server to seize. Infected machines find each other, and that is the whole design — which is also where it broke.

The malware **trusted any peer that spoke its protocol**, without verifying who was on the other end. So the investigators became peers.

The technique is **peer list manipulation**. Every **40 minutes**, an infected machine checks the status of the peers it knows about. Investigators used that cycle to strip legitimate peers out at the protocol level and substitute entries pointing at sinkholes they controlled. **Super peers** — the well-connected nodes that hold the network together — went first. Machines sitting passively behind firewalls were picked off afterwards, during their own maintenance cycles.

Two Sality networks, **version 3** and **version 4**, were live until the disruption. More than **15,000** infected machines were reachable for payload delivery.

Read the mechanism again, though, because it is familiar. A protocol that accepts instructions from an unauthenticated party is the same class of defect this site writes about in enterprise products most weeks. Here it happened to be in malware, and the people who found it useful happened to have badges.

That is worth sitting with rather than cheering. The capability that ended Sality is not a law-enforcement superpower. It is a missing authentication check.

## "Takedown" is doing a lot of work

Three things did not happen.

**Nobody was arrested.** No arrests are reported in connection with the operation. The threat actor is described as operating from Russia's **Republic of Bashkortostan**, which is not a jurisdiction that responds to US indictments.

**The malware was not removed.** Every one of those 15,000 machines is still infected. CrowdStrike's own guidance is explicit: existing malware on those systems remains active and should be removed. Sinkholing changed **who the bots call**, not what is on them.

**The infections were not fixed at source.** Sality spreads by modifying Windows executables. That mechanism is untouched.

What actually changed is that the operator lost the ability to push new payloads to a network he had been running for over twenty years. That is a real result, and it is much smaller than the word "takedown" implies. Compare it with [the Commerzbank case, where the arrests happened within four days](/article/operation-klonen-commerzbank-30-million-four-days-arrests) — that is what disruption plus accountability looks like.

## The remediation bill just moved to 15,000 people

This is the part that will not get written up.

Before Sunday, 15,000 machines were infected and their owners mostly did not know. After Sunday, 15,000 machines are infected, their owners still mostly do not know, and the party with an interest in fixing them has been removed from the equation.

Sinkhole data gets passed to national CERTs and ISPs, who notify downstream. That process works, slowly, and it works best for organisations that have someone to receive a notification. A small business running an infected workstation from 2019 does not.

## What to check

- **Look for UDP traffic to 188.166.101[.]148** in network logs. That is the sinkhole. Anything of yours talking to it is infected and needs cleaning, not congratulating.
- **Sality infects executables.** Remediation is not "delete a file" — assume binaries on the host are modified and rebuild rather than clean.
- **Check for it on the machines nobody logs into.** A 23-year-old file infector survives on the estate that estate management forgot: build servers, kiosks, lab machines, the PC attached to a machine tool.
- **Do not treat the sinkhole as protection.** It is a redirect maintained by a private company, for as long as that company maintains it.

## What is not established

- **Whether the sinkholing is permanent.** Sinkholes are maintained infrastructure. Nothing published says for how long.
- **Whether the operator can rebuild.** The peer protocol's trust model is the weakness; a version 5 that authenticates peers is not a hard piece of engineering.
- **The true infection count.** 15,000 is what was reachable through the P2P network during the operation, not a census.
- **Any attribution beyond geography.** "Operating from Bashkortostan" is a location, not an identification, and no charges are reported.
- **What proportion of the 15,000 will actually be cleaned.** Historically, the answer to this is not encouraging, and nobody publishes the follow-up.`,
  },
  {
    slug: "switchvox-cve-2026-9586-patch-does-not-rotate-the-signing-key",
    title:
      "Switchvox is being exploited 47 days after the patch — and patching does not rotate the key they already took",
    excerpt:
      "CVE-2026-9586 is an unauthenticated SQL injection in Sangoma Switchvox that gives code execution as the PostgreSQL superuser. Researchers used it to steal the cookie signing key, which lets them forge a session for any user. That key does not change when you install the update.",
    categorySlug: "security",
    tags: ["sangoma", "switchvox", "sql-injection", "voip", "horizon3", "cve"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1773517459098-5211082374a4${P}`,
    body: `**CVE-2026-9586** is an unauthenticated SQL injection in **Sangoma Switchvox SMB Edition**, CVSS **9.3**. The **/pa** endpoint concatenates the user-controlled **PhoneIP** value straight into PostgreSQL queries with no parameterisation, which yields arbitrary SQL and then code execution as the **PostgreSQL superuser**. No credentials required.

Sangoma fixed it in **8.4.0.2** on **14 July 2026**. Exploitation in the wild was observed on **30 August** — **47 days** later.

## The part that survives the update

**SRA Labs**, who found the flaw independently in May, did not stop at reading the database. They used the access to **exfiltrate the cookie signing keys**, and then forged authentication cookies for arbitrary users.

Think about what that means for the remediation plan.

Installing 8.4.0.2 closes the injection point. It does not change the signing key. If an attacker took that key before you patched, they can still mint a valid session for any account on the system — as an administrator, through the front door, with no exploit involved and nothing in the logs that looks like an attack.

This is the same shape as the [Rails flaw where the fix only works if your native image library is new enough](/article/kindarails2shell-patch-depends-on-libvips-version): the patch is necessary and it is not the whole job. Anywhere a vulnerability leaks a long-lived secret, the patch and the rotation are two separate tasks, and only one of them is on the vendor's release notes.

**Rotate the cookie signing key.** Then invalidate existing sessions. If you cannot establish when you patched relative to when scanning started, assume the key is gone.

## What the attacks look like

**Horizon3.ai** picked up the exploitation on its honeypots. The observed activity is unglamorous: reverse shells, and Base64-encoded commands enumerating running processes — reconnaissance by an operator working out what they have landed on.

Evidence lands in **/var/log/switchvox/db-quirks.log** on systems with SSH enabled. One source address, **176.65.148[.]184**, is already flagged publicly for port scanning, brute-forcing and exploitation.

Roughly **4,000** Switchvox instances are exposed to the internet, predominantly in the **United States**. Horizon3's own read is that most internet-exposed instances "will be or have already been targeted" — which is a projection, not a measurement, and worth labelling as one.

## Twelve flaws, one vendor, one April

The disclosure history matters here more than the CVE does.

**Horizon3.ai** reported this vulnerability to Sangoma in **April 2026** — alongside **eleven others**. **SRA Labs** independently found the same bug in **May**, which tells you it was not buried deep.

And Sangoma products are not new to this. Checking the **CISA KEV** catalogue directly: **three** Sangoma **FreePBX** flaws are already listed as known-exploited — **CVE-2025-57819** added **29 August 2025**, then **CVE-2025-64328** and **CVE-2019-19006** both added **3 February 2026**. One of those is a 2019 CVE.

CVE-2026-9586 itself is **not** in KEV as of the **1 September 2026** catalogue, despite confirmed exploitation. That gap is normal — KEV addition lags observed activity — but if you are using KEV as your prioritisation input, this is the case where it will be late.

## What to do

- **Patch to 8.4.0.2 or later.** It shipped in July.
- **Rotate the cookie signing key and invalidate sessions.** This is the step the advisory does not do for you.
- **Grep /var/log/switchvox/db-quirks.log** and check for connections to the flagged address.
- **Take it off the internet.** A phone system's management interface has no business being publicly reachable, and 4,000 of them are.
- **Audit administrator accounts** created or modified since mid-July.

## What is not established

- **How many of the 4,000 are compromised.** Exposure is measured; compromise is not.
- **Whether the observed activity is one actor or several.** One source address is flagged; that is not the same as one operator.
- **Whether the other eleven Horizon3 findings are fixed**, or which of them made it into 8.4.0.2.
- **Whether key theft has occurred outside the research setting.** SRA demonstrated it. Nobody has published evidence of it happening in a real intrusion.`,
  },
  {
    slug: "geonetwork-chain-8-6-plus-9-1-equals-preauth-rce-89-percent-government",
    title:
      "Neither GeoNetwork flaw is pre-auth RCE. Chained, they are — and 89% of exposed instances are government",
    excerpt:
      "One bug lets anyone upload a stylesheet. The other lets a stylesheet run operating-system commands. Ethiack found 121 exposed GeoNetwork deployments across 39 countries, nearly nine in ten of them government, military or national-agency. The fix shipped on 8 July; the advisory arrived on 31 August.",
    categorySlug: "security",
    tags: ["geonetwork", "xslt", "rce", "ethiack", "government", "inspire"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1772536888848-c0e7f0f6cf39${P}`,
    body: `**GeoNetwork** is catalogue software for geospatial metadata. It began at the **UN Food and Agriculture Organization** and is now a core component of Spatial Data Infrastructure across Europe, including the backend of the **European INSPIRE geoportal**.

**Rafael Castilho** of **Ethiack** found two flaws in it. Separately, neither is unauthenticated remote code execution. Together, they are.

## The chain is the finding

**CVE-2026-63219**, CVSS **8.6**, is a missing authorization check on the formatter upload endpoint. An unauthenticated attacker can upload arbitrary **.xsl** or **.zip** formatter files to the server. On its own that is unauthorised write access — bad, but not execution.

**CVE-2026-58400**, CVSS **9.1**, is an unsafe configuration of the **Saxon** XSLT processor. Secure processing is enabled, but Java extension functions are not restricted, so any stylesheet Saxon loads can call **java.lang.Runtime.exec()** or **java.lang.ProcessBuilder** and run operating-system commands. On its own that requires the ability to get a stylesheet in front of the engine — which normally means privileges.

Put them together and the privilege requirement disappears. Upload a malicious formatter with no credentials, then issue a plain **GET** request against a public record to make Saxon load and execute it.

That is the whole attack: an anonymous upload, then a normal-looking read of a public page.

It is worth being precise about why this matters beyond the individual scores. Vulnerability triage is usually done per-CVE, and neither of these would top a queue on its own — an 8.6 write and a 9.1 that "requires privileges". The composition is what produces pre-auth RCE, and composition is exactly what per-CVE scoring does not represent.

## Who is running it

Ethiack fingerprinted **121** exposed GeoNetwork deployments across **39** countries. **89%** were government, military or national-agency related.

Those are *exposed* instances, not confirmed compromises — the distinction matters and Ethiack draws it.

But the population is the point. Geospatial metadata catalogues are not a consumer product; they are national infrastructure inventories, sitting in the part of government that publishes where things are. A code-execution foothold there is a foothold on a machine that, by design, indexes other systems.

## Eight weeks between the fix and the advisory

Versions **4.4.12** and **4.2.17** shipped on **8 July 2026**. The advisories were published on **31 August** — roughly eight weeks later.

Affected are all **4.4.x** through **4.4.11** and all **4.2.x** through **4.2.16**, with the issue reachable since **4.0.6**. That is a long tail of versions.

The gap is defensible as coordinated disclosure — it gives operators time to update before the details are public. It is also not silent. The fix is in a public open-source repository from the day it lands, and anyone diffing releases can reconstruct what changed. An eight-week window protects the operators who patch promptly and nobody else.

Ethiack is the same lab behind [the Rails Active Storage flaw](/article/kindarails2shell-patch-depends-on-libvips-version), which had a comparable shape: a fix that is real, and a set of operators who have not applied it.

## No evidence of exploitation

We checked the **CISA KEV** catalogue directly — 1,687 entries as of **1 September 2026** — and neither CVE appears, nor any other GeoNetwork entry. No public reporting describes exploitation either.

Say that plainly rather than letting the absence read as an omission: this is a disclosed, patched, unexploited-so-far chain against a government-heavy install base. That is the good version of this story, and it stays the good version only for as long as the patching goes faster than the reverse-engineering.

## What to do

- **Update to 4.4.12 or 4.2.17.** They have been available since July.
- **Check the formatter directory** for .xsl or .zip files nobody uploaded deliberately. The upload is the first half of the chain and it leaves an artefact.
- **Do not expose the catalogue to the internet** if the deployment does not need to be public. Most of the 121 probably do; some certainly do not.
- **Review Saxon configuration** in anything else you run that processes XSLT from a source users can influence. The unsafe default here is not unique to GeoNetwork.

## What is not established

- **Whether any of the 121 exposed instances is compromised.** Exposure was measured; nothing else was.
- **How many total deployments exist.** 121 is what internet fingerprinting found, not an install base.
- **Whether the flaws were independently discovered.** Only Ethiack is credited.
- **Whether the chain works against every affected version**, or only the configurations tested.
- **What the INSPIRE geoportal itself runs.** GeoNetwork is named as the backend; nothing published says which version, or whether it was ever vulnerable.`,
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
