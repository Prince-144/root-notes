/**
 * Drafts the 15 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-103.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-103.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-103.ts --update
 *
 *   1. PAN-OS CVE-2026-0322 (security). Exploited, root on the management
 *      interface, credentials required. Deliberately does NOT claim a chain
 *      with CVE-2026-0257 — different interface, different auth.
 *   2. Cisco Secure Email Gateway CVE-2026-76519 (security). The attachment
 *      scanner is the attack surface. Unauthenticated root from an email.
 *   3. AhsayCBS (security). Follow-up that corrects our own 12 October piece:
 *      a hotfix existed two days before we said none did, because it sits
 *      behind a partner portal.
 *
 * All four KEV additions read directly from CISA's feed, catalog 2026.10.14:
 * CVE-2026-0322, CVE-2026-76519, CVE-2026-105133 and CVE-2026-105134, all
 * added 14 October with a 17 October due date.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - PAN-OS: a fibre patch panel, for the network edge.
 *   - Cisco: plain envelopes, because the attack arrives as mail.
 *   - AhsayCBS: drive bays, for a backup server. Deliberately not the opened
 *     hard drive used on the first piece, so the two read as separate.
 *
 * Rejected on the way: wartime V-Mail envelopes with legible names and
 * addresses, and stacked drives with Western Digital across them.
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
    slug: "pan-os-cve-2026-0322-exploited-root-on-the-management-interface",
    title:
      "Palo Alto is patching a second exploited flaw this month, and this one runs as root on the management interface",
    excerpt:
      "CVE-2026-0322 is a code injection in the PAN-OS management interface that gives root. It needs valid credentials, which sounds like a barrier until you ask the question the requirement actually raises: who can reach that interface at all.",
    categorySlug: "security",
    tags: [
      "palo-alto",
      "pan-os",
      "cve-2026-0322",
      "firewall",
      "management-interface",
      "cisa-kev",
      "code-injection",
      "exploited",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1594915854088-2128db6a8db5${P}`,
    body: `**Palo Alto Networks** has patched **CVE-2026-0322**, a code injection flaw in the **PAN-OS management interface** that lets an attacker run code as **root** on the firewall. The company says it is aware of limited exploitation against customer firewalls and has published indicators of compromise.

CISA added it to the exploited catalogue on **14 October** with a **17 October** deadline — three days, which is as short as CISA sets. We read that from the feed directly.

Affected: **PA-Series** and **VM-Series** firewalls and **Panorama**. Cloud NGFW and Prisma Access are not affected. Fixes exist across the 10.2, 11.1, 11.2, 12.1 and 12.2 branches, with a build for 11.2.16 expected today.

## It needs credentials, and that is the interesting part

The CVSS vector lists privileges required as high: an attacker must already have **valid credentials** for the management interface and network access to it. The score is 8.6 rather than a 9-point-something for exactly that reason.

It is tempting to read that as a mitigating factor. It is more useful to read it as a question: **who can reach your management interface, and with whose credentials?**

Because the requirement only binds if the interface is hard to reach. On a firewall whose management plane is bound to an internal address, reachable from a jump host, with administrators on phishing-resistant authentication, "requires credentials" is a real barrier. On a firewall whose management interface answers from the internet — which is a configuration that exists in large numbers, repeatedly, across every vendor in this category — it is a formality. Credentials are the most widely traded commodity in the criminal economy.

Palo Alto's own mitigation advice says the same thing in vendor language: **restrict management interface access to trusted internal addresses**. There is no workaround. Threat Prevention signatures give partial coverage against known patterns, which is not the same as protection.

## Two Palo Alto flaws, and what connects them is not a chain

We wrote four days ago about [CVE-2026-0257, an authentication bypass in GlobalProtect that forges a session cookie and has been in CISA's catalogue since May](/article/cve-2026-0257-five-months-in-the-catalogue-and-still-the-way-in), still being used by ransomware crews five months on.

It is tempting to put the two together into a chain: use the first to get in, the second to get root. We are not going to, because the pieces do not obviously fit. CVE-2026-0257 produces an authorised **VPN** session as a user. CVE-2026-0322 needs credentials for the **management interface**, which is a separate authentication surface. Nobody has demonstrated one leading to the other, and inventing the link would be the kind of thing this site complains about when others do it.

What is true without the chain is simpler. The same product line has two separately exploited flaws in active use this month, one needing nothing and one needing credentials, and the defensive answer to both is about **where the interfaces are reachable from** rather than about either bug.

## Why these interfaces end up reachable

"Restrict the management interface to trusted internal addresses" is correct and it is also the advice that has been given after every firewall flaw for a decade. It is worth asking why it keeps needing to be given.

Some of it is remote administration: the people who manage the device are not in the building, and the management plane became the path of least resistance before anyone wrote down a better one. Some of it is managed service providers running fleets across customers who have no shared private network. Some of it is **VM-Series** instances in cloud accounts, where "internal" is a boundary somebody had to define rather than a wall that already existed.

And some of it is simple risk asymmetry. Locking down a management plane is a change that can lock the administrator out of the device that controls their own network path, at which point recovery means physical access. The failure mode of leaving it open is theoretical until a day like today. The failure mode of getting the lockdown wrong is immediate.

That is not an argument for leaving it open. It is why the fix is a planned change with a tested rollback, not a checkbox, and why it keeps being deferred.

## What to do

- Patch to a fixed release for your branch. Check the vendor advisory for the exact build; the branch coverage is wide and the 11.2 build landed last.
- Then answer the reachability question honestly. If the management interface is reachable from anything other than a defined administrative network, that is the finding, and it outlives this CVE.
- Review the published indicators. Palo Alto has released IP addresses associated with the observed activity.
- Rotate management-interface credentials after patching. A flaw that requires credentials is a flaw whose exploitation implies somebody had them.
- Treat Panorama with the same urgency as the firewalls. It is in scope and it manages the rest.

## What is not established

- Who is exploiting it. No attribution has been offered.
- How attackers are obtaining the credentials the flaw requires.
- How many devices are affected. "Limited exploitation" is the vendor's characterisation, without a figure.
- Whether a public proof of concept exists. One aggregator records no available exploit, which contradicts the vendor and CISA and appears to be automated rather than researched.
- Whether this and the GlobalProtect bypass have been used against the same targets.`,
  },

  {
    slug: "cisco-secure-email-gateway-cve-2026-76519-an-attachment-writes-the-file",
    title:
      "The thing that scans attachments for malware is exploited by an attachment, and it runs as root",
    excerpt:
      "An unauthenticated attacker sends an email to a Cisco Secure Email Gateway, and a path traversal in the malware-scanning path writes arbitrary files and executes commands as root. Scored 9.8, exploited, and there is a fix that needs no reboot.",
    categorySlug: "security",
    tags: [
      "cisco",
      "cve-2026-76519",
      "email-gateway",
      "path-traversal",
      "exploited",
      "cisa-kev",
      "mail-security",
      "asyncos",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1567794636765-5e4869f627e1${P}`,
    body: `**Cisco** published an advisory on **14 October** for **CVE-2026-76519**, a relative path traversal in **Secure Email Gateway**. An **unauthenticated** attacker sends a crafted email attachment; the appliance writes arbitrary files and the attacker runs commands as **root**.

It is scored **9.8**. Cisco's PSIRT says it became aware of active exploitation in October. CISA added it on **14 October** with a **17 October** deadline.

## The scanner is the attack surface

CVE-2026-76519 sits in the **Advanced Malware Protection** path — the File Reputation feature, the part of the product whose entire job is to examine attachments that might be hostile.

So the delivery mechanism is the product's purpose. There is no user to phish, no link to click, no credential to steal. An email arrives, the gateway inspects the attachment as designed, and the inspection is the exploit.

That inverts the usual mental model of a security appliance. A mail gateway is bought to stand between the organisation and hostile email, which means it is the one device in the estate guaranteed to process attacker-supplied input from strangers, at volume, automatically. Its attack surface is its feature list.

## Two conditions, and one of them is the easy fix

A device is exposed only if **both** are true:

- **File Reputation is enabled** and assigned to a mail policy, and
- **Content Scanner Tools is older than 25.3.0.5525**.

Which means there are two remediation paths, and the second is much cheaper.

The fixed AsyncOS builds are **15.5.5-014** and **16.5.0-780**. Note that **AsyncOS 16.0 has no fixed build** — the advisory says to migrate to a fixed release, which is a version move rather than a patch.

But updating **Content Scanner Tools to 25.3.0.5525 or later** also closes it, and that needs **no software upgrade and no restart**. For an appliance that sits in the mail path for an entire organisation, the difference between "schedule a maintenance window" and "update a component definition" is the difference between doing it today and doing it next month.

Cisco lists no workarounds beyond those.

## Check the logs that are not on the box

The most useful line in Cisco's guidance is about where to look afterwards.

Because successful exploitation gives root on the underlying operating system, an attacker can **erase the evidence on the appliance**. Cisco's recommendation is to review **network and firewall logs from outside** the device — unexpected uploads to external addresses, downloads from known-bad ones.

This is the second time this week that a vendor or researcher has had to say that about an appliance. Volexity made the same point about [an Ivanti appliance where the integrity checker returned clean on a compromised device](/article/ivanti-connect-secure-uta0576-a-patched-appliance-and-an-unpatched-link). The pattern is worth stating plainly: on a sealed appliance you do not administer at the OS level, the device's own account of itself is the least reliable evidence available, and the only trustworthy record is the one kept somewhere the attacker could not reach.

## The records do not all agree yet

Two things to be aware of if you are checking this against public sources today.

**NVD** still lists the record as undergoing analysis, so the enrichment there is incomplete. And CVE.org's umbrella path-traversal record — last updated in September — says no malicious use is known, which is stale against Cisco's own revised advisory and the KEV listing.

Cisco's advisory and the CISA entry are the authoritative records for this flaw. We read the KEV entry directly: added 14 October, due 17 October, ransomware use recorded as unknown.

No public proof of concept has surfaced.

## What to do

- Check whether **File Reputation** is enabled and assigned to a policy. If it is not, you are not exposed by this.
- If it is, check the **Content Scanner Tools** version. Updating it to 25.3.0.5525 or later is the fast path and needs no restart.
- Otherwise move to AsyncOS 15.5.5-014 or 16.5.0-780. If you are on 16.0, plan the migration; there is no patch for that line.
- Hunt off the appliance. Pull outbound connection records from your own network logging for the period before patching, not from the gateway.
- If you find anything, assume the appliance's local logs are incomplete.

## What is not established

- Who is exploiting it, and how widely. Cisco reports awareness of active exploitation without a figure.
- When exploitation began. The advisory does not give a start date.
- Whether the attacks are targeted or opportunistic, which for a mail gateway matters a great deal.
- Whether the Content Scanner Tools update is equivalent protection to the AsyncOS fix, or merely sufficient for the currently known attack path.`,
  },

  {
    slug: "ahsaycbs-the-first-patch-did-not-fix-it-and-the-vendor-said-so",
    title:
      "The first patch did not fix it, the vendor said so, and the working one was behind a partner portal",
    excerpt:
      "Ahsay has confirmed that the build it shipped for two exploited backup-server flaws did not address them. A hotfix exists and Huntress has verified it. We reported on 12 October that no patch was available, which was already wrong by two days — this is why.",
    categorySlug: "security",
    tags: [
      "ahsaycbs",
      "cve-2026-105133",
      "cve-2026-105134",
      "patching",
      "backup",
      "cisa-kev",
      "huntress",
      "disclosure",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1507333199169-84fd735371fb${P}`,
    body: `A correction first, because it is also the story.

On **12 October** we wrote that two exploited **AhsayCBS** flaws had no patch, and that every version through 10.3.4 was affected. The second half was right. The first half was already wrong by two days: a hotfix shipped on **10 October**.

It was not visible from the public research we were reading, and it is distributed through Ahsay's **partner portal**. So the fix existed while the public record said it did not.

## What actually happened

The sequence, assembled from Ahsay's guidance as reported, Huntress's research and Horizon3's write-up:

- **4 October** — the CVE records are published.
- **7 October** — Huntress sees exploitation begin, at 23:20 UTC.
- **8 October** — Huntress establishes that **10.3.4 is still vulnerable**, correcting earlier reporting that had called it fixed.
- **10 October** — Ahsay **confirms that 10.3.4.0 did not adequately address** either flaw, and that the v9 build 9.15.2.59 was also insufficient. It releases hotfix **10.3.4.45**, and **9.15.2.70** for the v9 line.
- **14 October** — CISA adds both identifiers to the exploited catalogue, due **17 October**.

The current fixed builds are **v10.3.4.45** and **v9.15.2.70**. Anyone on v7 or v8 upgrades to 9.15.0.0 first, then applies the v9 hotfix.

**Huntress independently verified** that 10.3.4.45 blocks the authentication bypass, which is the entry to the chain — close that and the command execution behind it is unreachable. Rescana notes it found no independent confirmation that the hotfix fully resolves both issues, and advises treating any v10 build below 10.3.4.45 as potentially exposed.

## A vendor saying its own patch failed is rare and useful

It is worth pausing on the 10 October admission, because most vendors do not make it.

The normal failure mode, when a shipped patch turns out to be insufficient, is silence: a second build appears with a vague changelog, nobody is told the first one was incomplete, and administrators who patched believe they are done. A remote-access vendor did that in June, shipping a fix for pre-authentication root in a release whose notes described it only as a crash; the gap between fixing and telling ran to four months.

Ahsay did the opposite: it named the insufficient builds. That is the behaviour that lets an administrator know they are not finished, and it is the reason this story is a correction rather than a quiet re-exploitation in three weeks.

The distribution is the part that still does not work. A fix behind a partner portal is a fix that security researchers, CERTs and the press cannot see, which is how public reporting — ours included — ends up two days out of date on the most important question in the story.

## Patching does not clean up

The other line worth carrying from Ahsay's guidance: applying the hotfix **does not remove** webshells, unauthorised accounts, or other persistence left by an intrusion that already happened.

Ahsay's own recommendation for a compromised host is to **reinstall the operating system**, install AhsayCBS with the hotfix, and restore a server configuration that predates the compromise.

That is the strongest version of a point this site keeps making, and it is the vendor making it. On a backup platform used by managed service providers it is also the hardest advice to follow, because the machine being rebuilt is the one that holds everyone else's restore points.

## The catalogue lag, measured

One number falls out of this timeline that is worth keeping.

Exploitation was observed on **7 October**. The identifiers entered CISA's exploited catalogue on **14 October**. Seven days, and ten from the CVE records being published.

We made the general point in that first piece that absence from the catalogue is not evidence of absence. This is the specific measurement on a case we watched from the start.

## What to do

- If you run AhsayCBS, go to **v10.3.4.45** or **v9.15.2.70**. If you applied 10.3.4.0 or 9.15.2.59 and stopped, you are not patched.
- The hotfix is on the partner portal. If you reach Ahsay through an MSP, that is who has to apply it.
- Patching is not remediation here. Check for the indicators Huntress published before deciding the host is clean.
- Keep the management interface off the internet regardless of version.

## What is not established

- Whether the hotfix fully resolves both flaws. Huntress verified the bypass is blocked; nobody has independently confirmed more than that.
- Why the first builds were insufficient.
- How many organisations were compromised in the window between 7 and 10 October.
- Whether a fix was available to partners earlier than 10 October.
- Whether Ahsay will publish advisories outside the partner portal in future.`,
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
