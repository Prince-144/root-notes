/**
 * Drafts the 13 October batch — three stories, researched a day ahead.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-99.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-99.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-99.ts --update
 *
 *   1. CVE-2026-0257 (security). Not a new flaw — disclosed in May, in CISA's
 *      catalogue since 29 May, which this session verified against the feed
 *      directly. The news is who is using it now, and that patching does not
 *      end a session the forged cookie already opened.
 *   2. AnyDesk AnyPwn (security). Pre-approval root on Linux. The fix shipped
 *      in June described as a crash bug, with no CVE and no advisory, and the
 *      working exploit arrived on 8 October.
 *   3. UAT-11985 (security). Talos names no country, hedges the AI claim
 *      explicitly, and analysed three emails. All three are carried as stated
 *      rather than as the secondary coverage renders them.
 *
 * Primary sources: ReliaQuest's 11 October update as reported, the V12
 * researchers' write-up as reported, and Cisco Talos's own UAT-11985 post.
 *
 * This batch was researched on 12 October for publishing on the 13th, so
 * check nothing has moved before publishing — particularly the AnyDesk
 * version numbers and whether Palo Alto has said anything further.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - CVE-2026-0257: patch cables into rack switching, for the perimeter.
 *   - AnyDesk: a workstation, which is what the session connects to.
 *   - UAT-11985: a bulletin board of posters carrying QR codes, which is
 *     precisely the scenario Talos describes.
 *
 * Rejected on the way: a network switch with tp-link and its model number
 * legible, which has nothing to do with the Palo Alto story.
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
    slug: "cve-2026-0257-five-months-in-the-catalogue-and-still-the-way-in",
    title:
      "The flaw has been in the exploited catalogue since May, and it is still how the ransomware crews are getting in",
    excerpt:
      "ReliaQuest names Qilin and a newer operation called Settra as exploiting a GlobalProtect authentication bypass that Palo Alto disclosed in May. Nothing about the vulnerability is new. What is worth reading is that patching does not close the sessions a forged cookie already opened.",
    categorySlug: "security",
    tags: [
      "cve-2026-0257",
      "palo-alto",
      "globalprotect",
      "qilin",
      "settra",
      "ransomware",
      "vpn",
      "reliaquest",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1663932210347-164a05ed0ccd${P}`,
    body: `**ReliaQuest** published a threat update on **11 October** naming the **Qilin** ransomware-as-a-service operation and a newer group it calls **Settra** as exploiting **CVE-2026-0257**, an authentication bypass in Palo Alto Networks' **GlobalProtect**.

Before anything else, the dates. Palo Alto disclosed this on **13 May 2026**, scored 7.8. **CISA added it to the Known Exploited Vulnerabilities catalogue on 29 May** — we checked that against CISA's own feed rather than taking it from coverage. Exploitation has been observed since mid-May.

So this is not a new vulnerability, and a headline that reads as one is the wrong shape. Five months after disclosure, after a vendor advisory and a federal remediation deadline, it is still a working way into corporate networks.

## What the flaw does

GlobalProtect can be configured to issue an **authentication override cookie**, so a user who has authenticated once is not challenged again for a period.

The bypass lets an unauthenticated attacker **forge an authentication override cookie**. The result is not a partial foothold or a crash. It is a fully authorised VPN session, with no credentials, belonging to whoever the attacker says it belongs to.

Exposure depends on configuration: the authentication override cookies have to be enabled on the portal or gateway, and the certificate used to sign them has to be reused or exposed. PAN-OS 10.2, 11.1, 11.2 and 12.1 branches are listed as affected. Panorama and Cloud NGFW are not. Reporting conflicts on whether Prisma Access deployments are in scope, so check the vendor advisory rather than any summary of it, including this one.

## The part that is actually new

The useful finding in ReliaQuest's update is not the attribution. It is a line in the remediation advice: after patching, **terminate all active GlobalProtect sessions**.

That is there because the patch does not do it. A session established with a forged cookie before remediation is a legitimate session afterwards — the server has no way to distinguish it from one a real user opened. Patch the appliance, congratulate yourself, and the attacker stays logged in.

This is the same shape as a problem this site keeps running into from different directions. [A deleted Kibana integration leaves its redirection in place](/article/kibana-cve-2026-102406-one-tenant-could-claim-anothers-data-stream). Removal, or patching, ends the mechanism. It does not undo what the mechanism did.

ReliaQuest also suggests looking for unexpected connections, including devices with hostnames such as **kali** — and is careful to call that an investigation lead rather than proof of anything. It is an attacker forgetting to rename a machine, which happens, and is not evidence on its own.

## Who is using it

**Qilin** is the one to note. It appeared near the top of [the most prolific groups in Comparitech's record third quarter](/article/comparitech-q3-2026-the-record-is-2627-claimed-and-247-confirmed), and here it is as the named operator of a five-month-old VPN bypass. Prolific and unoriginal are not in tension; they explain each other.

**Settra** is newer, first seen in **June 2026**, reported against consumer services, retail and manufacturing.

Post-access activity reported alongside it is entirely conventional: **Cobalt Strike** for command and control, **BloodHound** and **SharpHound** for mapping Active Directory. Earlier in the year **Arctic Wolf** traced several Qilin intrusions to this same entry point, with LSASS memory dumping, extraction of the Active Directory database and lateral movement through administrative shares.

There is no novelty anywhere in that chain. The novelty was the way in, and that was published in May.

## Why the old ones keep working

Last week CISA added five identifiers to its exploited-vulnerabilities catalogue and [three of them were from 2015 and 2016](/article/flax-typhoon-seizures-and-the-five-kev-additions-from-2015-and-2016). This is that observation at a shorter range.

An internet-facing VPN appliance is the hardest thing in most estates to patch, because it is the thing everyone is connected through. The maintenance window is a business negotiation. Which means a flaw in that class has a long tail by default, and attackers who are reading the same advisories as the defenders know exactly how long.

## What to do

- Patch, then **end every active GlobalProtect session**. The second step is the one that evicts.
- Check whether authentication override cookies are enabled at all. If the feature is not needed, the exposure goes away with it.
- Rotate the certificate used to sign those cookies. A forged cookie implies the signing material is reusable.
- Review GlobalProtect logs back to **mid-May**, not back to this week. That is when exploitation starts.
- Treat any session that predates your patch as suspect rather than as history.

## What is not established

- Whether Prisma Access deployments are affected. Sources conflict and the vendor advisory is the only answer.
- How many organisations have been reached this way. ReliaQuest describes activity, not a count.
- Whether Qilin and Settra are related, beyond using the same entry point.
- How the attackers obtain or forge the signing material in each case.
- Whether the mid-May and June exploitation waves are the same operators as the October activity.`,
  },

  {
    slug: "anydesk-anypwn-the-fix-shipped-in-june-as-a-crash-bug",
    title:
      "The fix shipped in June described as a bug that could lead to a crash, with no CVE and no advisory",
    excerpt:
      "Researchers published a working pre-authentication exploit for AnyDesk on Linux that runs code as root before the user approves anything. The flaw was patched four months ago, in a release whose changelog called it a crash, so nobody had a reason to treat the upgrade as urgent.",
    categorySlug: "security",
    tags: [
      "anydesk",
      "anypwn",
      "linux",
      "remote-access",
      "heap-overflow",
      "integer-overflow",
      "silent-patch",
      "v12",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1545665277-5937489579f2${P}`,
    body: `On **8 October**, researchers published a working exploit for a flaw in **AnyDesk on Linux** that they call **AnyPwn**. It runs attacker code **before the user approves the connection**, and because the Linux service typically runs as root, what it runs, it runs as root.

The flaw was fixed in **8.0.3**, in **June**.

## The changelog is the story

AnyDesk's release note for that version described the fix as a bug that could lead to a crash. No **CVE** was assigned. No security advisory was published.

Consider what that leaves an administrator with. A remote-access tool, installed on Linux machines across an estate, running as a system service. A new version appears whose changelog mentions a crash. There is no identifier to track, nothing for a vulnerability scanner to flag, no advisory to forward to a change-approval board.

Four months later somebody publishes pre-authentication root.

The same gap turned up at a different vendor with a different product: [an AI tool where picking a model ran that model's code, and no CVE existed to tell anyone](/article/unsloth-studio-picking-a-model-ran-its-code-and-there-is-no-cve-to-tell-you). The pattern is not that the vendors fail to fix things. They fix them. It is that the fix is invisible to every process organisations actually use to decide what to install.

## What the bug is

It is an integer problem that becomes a memory problem.

The session protocol has a handler for one stream packet type. It takes the payload length from the remote side and **trusts it before validating it**. A 16-byte header is added to that length using **32-bit arithmetic**, so a large enough value **wraps**, and the allocation that follows is tiny.

Then the code copies the attacker-controlled packet into it. The copy uses the real length; the buffer was sized by the wrapped one.

Exploitation is **probabilistic**: it needs the heap to place a useful object next to the overflowed buffer. When it does not, the service crashes instead.

Which is presumably what the June changelog was describing. Seen from inside, a report of a crash is a crash. That is exactly how this class of bug presents until somebody does the work to turn it into execution, and the work is what was published on 8 October.

## What is exposed

The published exploit targets **x86_64**, AnyDesk running in **service mode**, over **direct connections to TCP port 7070**.

The vendor's position, stated in June, is that the issue is limited to direct connections on Linux, and that **Windows and macOS are not affected**.

The researchers validated a trigger over AnyDesk's relay infrastructure using instrumentation, but **did not demonstrate the full chain over relays**. That gap matters: direct connections on 7070 are a configuration many estates do not have, and relay-based exploitation would be a different exposure entirely. Nobody has shown it works. Nobody has shown it does not.

**8.0.2** is the version the exploit targets, and the offsets are specific to it. The researchers suspect **8.0.1** shares the vulnerable code and have not confirmed it. The current release is **8.1.0**.

## Credit, and how it was found

The flaw is credited to **Rick de Jager** of the **V12** security team, found using the team's own code-review engine.

That is worth a line on its own. The sequence here is a tool reading source, a human turning the finding into a working exploit, and a vendor fix that predates the exploit by four months. Each part of that is now ordinary, and the combination compresses the time between a bug existing and a bug being usable.

## A remote-access tool is a strange thing to leave unpatched

Step back from the memory corruption for a second and look at what the product is.

AnyDesk exists to hand control of a machine to somebody who is not at it. The Linux service runs as **root** because that is what controlling a machine requires. The only thing standing between an inbound connection and that control is the **approval dialog**.

This flaw runs before the dialog. The security model of the entire product is a prompt, and the bug is reached without reaching the prompt.

There is a second reason this class of software deserves attention beyond its own bugs. Attackers already favour legitimate remote-access and monitoring tools, because traffic to a tool the organisation installed itself does not look like intrusion. A vulnerability in one is a shortcut past the part of an operation where something has to be installed and might be noticed.

## What to do

- Find every Linux host running AnyDesk and check the version. Anything at or below **8.0.2** needs upgrading, and so does 8.0.1 on the researchers' unconfirmed suspicion.
- If you cannot upgrade immediately, close **TCP 7070** at the firewall. The published exploit needs a direct connection.
- Audit where AnyDesk is running as a root service and whether it needs to be.
- Review your process rather than only your estate. If a release note that says crash would not have prompted an upgrade in June, that is the thing to fix.

## What is not established

- Whether the exploit works over AnyDesk's relays. The researchers triggered the bug there and did not complete the chain.
- Whether 8.0.1 and earlier builds are affected.
- Whether this has been exploited by anyone. A public exploit four months after a patch is not evidence of use.
- Why no CVE was requested. The vendor has not said.
- How many Linux installations are exposed on 7070, which nobody has measured.`,
  },

  {
    slug: "uat-11985-the-kit-relays-the-mfa-prompt-and-keeps-the-session",
    title:
      "The kit sends your password to Google, relays the real prompt back, and keeps the session that comes out",
    excerpt:
      "Cisco Talos documented a spear-phishing campaign against people at Taiwanese research institutes that steals authenticated Google sessions in real time. The lures came as event invitations, some as QR codes on altered posters. Talos analysed three emails and is careful about what that proves.",
    categorySlug: "security",
    tags: [
      "uat-11985",
      "cisco-talos",
      "phishing",
      "adversary-in-the-middle",
      "mfa-bypass",
      "quishing",
      "taiwan",
      "session-tokens",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1741636174266-a090f9427ec0${P}`,
    body: `**Cisco Talos** has published research on a spear-phishing campaign it tracks as **UAT-11985**, aimed at people affiliated with **Taiwanese research organisations**. The lures are event invitations. What sits behind them is an adversary-in-the-middle kit that takes an authenticated Google session while the victim watches it work.

## How the kit defeats multi-factor authentication

It does not break MFA. It stands in the middle of it.

The victim lands on a page impersonating Google's sign-in, served in Simplified Chinese, Traditional Chinese or English, with its client-side JavaScript obfuscated by string rotation and control-flow tricks.

The kit runs two channels at once. **HTTP POST** carries one-shot exfiltration — browser fingerprints, the submitted credentials, challenge responses, periodic heartbeats. A **WebSocket** holds a persistent, low-latency connection over which the operator's server streams state updates that decide **which screen the victim sees next**.

Behind the page, the operator's server forwards the identifier and password to the **real Google**, and relays Google's answers back — including the type of MFA challenge issued, and whether a passkey is available. The victim completes the challenge they were always going to complete. The kit harvests the **authenticated session token** that results.

Talos describes this as effectively bypassing MFA to take complete session tokens, enabling full account takeover.

The practical consequence is the one people get wrong. A password reset does not help, because the attacker never needed the password after the first second. A session token is the thing to revoke, and most people do not know where that control is.

## The posters

Several lures carried attached **event posters**. The designs were lifted from legitimate sites. The **QR codes on them were replaced**.

Talos makes a point about the posters that is easy to skip: a poster is printed. A recipient who finds the invitation plausible may pin it to an **office noticeboard**, and then the attack reaches everyone who walks past and scans it — people who were never emailed, never evaluated the sender, and have no reason to think a poster on a wall is a phishing vector.

That is a delivery mechanism that outlives the email and escapes the mailbox entirely.

## What Talos actually says about AI

The campaign is being reported as AI-assisted. Talos's own wording is more careful, and the difference is worth keeping.

Its basis is structural: three invitation emails sharing a near-identical three-part structure, repeated jargon, interchangeable flattery, and fast customisation across different geopolitical topics — which reads as a reusable template.

Its hedge is explicit. Talos says it "cannot conclusively determine whether the emails were fully generated by a large language model", and that linguistic indicators alone cannot prove generative AI was used.

So the finding is a strong inference from writing style, not an observation of a tool. We [made the same distinction about an agentic pentest tool last week](/article/artex-south-korean-finance-the-open-directory-held-the-operators-own-cv): what gets reported as "AI did this" is usually "this looks like how AI writes", and those are different claims with different evidential weight.

## Attribution, at the resolution Talos gives it

Talos calls this an advanced persistent threat campaign and **names no country and no group**.

The only language-based assessment in the post is narrower than the headlines suggest, and it is not about the operator. Talos says it assesses **with moderate confidence** that the **phishing kit's developer** is probably a Simplified Chinese speaker.

A kit's author and a kit's user are not the same person. Phishing kits are built, sold and rented. An assessment about who wrote the code is not an assessment about who sent the emails, and the post does not make the second one.

The impersonated organisations were the **Taiwan European Union Centre**, the **NCCU Institute of International Relations** and the **Taiwan Research Institute**. Recipients who contacted them could not confirm the senders worked there, which is how the fabrication was established.

One more number worth holding: Talos analysed **three** emails in detail, and gives no total for the campaign.

## What to do

- Move the people who matter to **phishing-resistant** authentication. A relayed challenge is defeated by a credential bound to the origin, and by very little else.
- When an account is suspected, **revoke sessions** before resetting the password. The token is the asset.
- Verify event invitations through a channel other than the invitation — a published address, a known contact, the organisation's own site.
- Treat **QR codes on printed material** as untrusted links, because that is what they are, and tell the people who pin things to noticeboards.
- Talos published ClamAV and Snort coverage and indicators in its public repository.

## What is not established

- The size of the campaign. Three emails were analysed in detail; no total is given.
- Who is behind it. Talos names no actor and no country.
- Whether a large language model wrote the lures. Talos explicitly declines to conclude it.
- Whether the kit is bespoke or rented, which bears directly on how much the developer assessment says about the operator.
- Whether any accounts were actually taken, as distinct from being targeted.`,
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
