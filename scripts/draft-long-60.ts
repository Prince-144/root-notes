/**
 * Drafts the 8 September batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-60.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-60.ts --update
 *
 *   1. PEEP. Same correction the Ted/HAProxy piece needed: the headline says
 *      the browser becomes a backdoor, the report says it needs prior admin or
 *      code execution. Not a browser vulnerability. The interesting part is
 *      that it forges Chromium's Secure Preferences integrity values, so the
 *      browser's own tamper detection reports everything is fine.
 *   2. StyleSmuggler. Unpatched Magento zero-day where the first confirmed
 *      victim was fully patched, and the trigger is Magento rendering an email
 *      nobody has to open.
 *   3. JSCeal. The headline claim — bypassing Google authentication — is
 *      session cookie replay. Nothing in the authentication is broken, and the
 *      distinction changes what you do about it.
 *
 * Covers checked at full size.
 *
 * No backticks in the bodies: inline code spans inside these template literals
 * break the MDX parse.
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
    slug: "peep-forges-chromium-secure-preferences-integrity-values",
    title: "PEEP forges Chromium's own integrity values. It also needs you to be compromised first",
    excerpt:
      "SOCRadar documented a post-exploitation toolkit that installs itself into Chrome and Edge profiles as an extension called Smart Bookmarks, forges the signatures Chromium uses to detect exactly that, and reaches the operating system through native messaging. It cannot get onto a machine by itself, which is the part the headlines drop.",
    categorySlug: "security",
    tags: ["chrome", "edge", "chromium", "post-exploitation", "socradar", "extensions", "attribution"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1762330467186-1af11aa6bd31${P}`,
    body: `On **7 September 2026**, SOCRadar published an analysis of **PEEP**, a Chromium post-exploitation toolkit that presents itself as a browser extension called **Smart Bookmarks**, extension ID **ejkndncpkdcjcikfhiamcdehdoegilbj**. It is built on **RedExt**, an open-source red teaming framework.

## Start with the precondition

PEEP requires **prior administrative or code execution access** on the machine. It cannot compromise anything on its own.

That single sentence changes what the story is. This is not a flaw in Chrome or Edge, there is nothing to patch, and no amount of careful browsing exposes you to it. It is a decision about **where to live once you are already in** — and, like [the implant compiled into HAProxy last week](/article/ted-implant-haproxy-2-8-12-not-a-haproxy-vulnerability), the attacker picked the process that already has everything worth having.

The browser holds your sessions, your saved credentials, your internal applications and your OAuth tokens, and it makes outbound requests all day without anyone thinking about it. As post-compromise real estate, it is close to ideal.

## Forging the check that would catch it

Chromium stores extension state in a **Secure Preferences** file, and signs it so that tampering can be detected. That mechanism exists precisely to stop someone writing an extension into a profile from outside the browser.

PEEP **forges those integrity values**. The browser inspects its own preferences, finds the signatures valid, and reports that nothing has been altered.

This is the same shape as an implant erasing its own entries from the proxy log: the attacker has not evaded the verification, they have taken it over. Anything downstream that trusts "Chromium says the profile is intact" is now reading a document the attacker signs.

## Escaping the sandbox through the front door

The toolkit ships a native-messaging binary, **nm_host.exe**. Native messaging is a documented Chromium feature that lets an extension talk to a program on the host, and it exists so that extensions can do things the sandbox forbids.

PEEP uses it exactly as designed, which is why there is nothing to fix. Through that channel it runs shell commands, manages files and enumerates processes and services. Inside the browser it takes screenshots, manipulates the clipboard, injects JavaScript, steals cookies and hijacks sessions, and exfiltrates browsing history, active-tab metadata, session cookies and credentials.

## Persistence that looks like your IT department

The persistence list is worth reading in full, because one entry is different from the others:

- Sideloading with Developer Mode enabled
- **Enterprise ExtensionInstallForcelist policy**
- Secure Preferences file manipulation
- ScriptCache fallback
- Re-registration through the External Extensions JSON manifest

**ExtensionInstallForcelist** is the Group Policy setting administrators use to push required extensions to a fleet. An extension installed that way cannot be removed by the user, reinstalls if deleted, and appears in the browser as **installed by your organisation** — which is the most effective disguise available, because it is the one explanation an employee will accept without asking.

[We have written before about extensions that became malicious after the fact](/article/19-browser-extensions-bought-then-turned-malicious). This is the same destination reached by policy instead of by purchase.

## The operational security is poor, and that helps you

PEEP beacons **every 30 seconds over plaintext HTTP**.

Not HTTPS. Not jittered. Every thirty seconds, in the clear, to endpoints named **/api/commands**, **/api/register**, **/api/agents/[id]/heartbeat**, **/api/extension_update/**, **/api/exfil** and **/health**.

For a toolkit this careful about the browser's integrity mechanisms, that is a strange gap, and it is the single easiest thing to detect in this entire report. Any egress monitoring at all sees a machine calling an unknown host twice a minute in plaintext.

C2 infrastructure: **206.237.30[.]232** and **xfjcc[.]fun**.

## On attribution, and on the numbers

SOCRadar observed **Chinese-language artifacts in the source code** and presumes a Chinese-speaking threat actor. It also says the **activity remains unattributed**.

Both of those are worth repeating exactly as stated. Language artifacts tell you something about who wrote the code. They do not tell you who is running it, who is paying for it, or where. A tool built by one person is frequently operated by someone else entirely, and RedExt — the framework underneath it — is public.

The observed infrastructure showed **34 agent entries, 10 active sessions and 507 data records**, and SOCRadar notes these may include the developer's own test deployments. Treat them as an upper bound on a small number rather than a victim count.

One further note, offered as an observation rather than a finding: SOCRadar remarks on an **"Authorized CTF"** framing in the material, which it reads as possible misuse of AI safety guardrails during development. Nothing about that is established, and it is not evidence of anything on its own — but it is the second time in a week that a report has raised the question of what was used to build the tool as well as what the tool does.

## What to do

- **Enumerate extensions across your fleet**, and reconcile every one against what you deliberately deployed. Start with the ID above.
- **Audit your ExtensionInstallForcelist policy.** An attacker with admin can add to it, and users cannot remove what it installs.
- **Alert on plaintext HTTP beaconing at fixed intervals.** Thirty seconds, no jitter, unknown host. This is the cheapest detection available.
- **Look for nm_host.exe and unexpected native-messaging host registrations**, which live in the registry and in on-disk manifests.
- **Do not treat this as a browser patching problem.** If PEEP is present, something else got admin first, and that is the incident.

## What is not established

- **The initial access vector.** Unknown in the observed cases.
- **Who the victims are**, or how many are real rather than test deployments.
- **Who is operating it.** SOCRadar says the activity is unattributed and only the language of the source is observed.
- **When it was deployed.** No timeline has been published.
- **Whether Google or Microsoft have responded.** Neither is quoted.`,
  },
  {
    slug: "stylesmuggler-first-victim-was-fully-patched-and-there-is-no-patch",
    title: "The first confirmed StyleSmuggler victim was fully patched. There is still no patch",
    excerpt:
      "Sansec says attackers have been exploiting an unpatched Magento and Adobe Commerce flaw since 4 September. The first confirmed victim was running 2.4.6-p15 with the August 2026 patches applied. The trigger is Magento rendering a Payment Transaction Failed Reminder — nobody has to open the email.",
    categorySlug: "security",
    tags: ["magento", "adobe-commerce", "zero-day", "sansec", "ecommerce", "backdoor", "rust"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1763872011479-aa293bf083a8${P}`,
    body: `**Sansec**, the Dutch firm that watches Magento for a living, published an advisory on **5 September 2026** on a flaw it calls **StyleSmuggler**, under active exploitation since **4 September**.

As of **6 September** there is **no CVE, no patch, no Adobe advisory and no vendor workaround**.

Affected: **Magento Open Source 2.4.6, 2.4.7, 2.4.8 and 2.4.9**, and Adobe Commerce. All current versions are confirmed vulnerable. Adobe Commerce on Cloud is unconfirmed either way.

## The sentence that matters

The first confirmed victim was running **2.4.6-p15 with the latest August 2026 patches applied**.

Fully patched. Compromised anyway.

That is worth sitting with, because the standard advice does not work here. "Are you up to date" is the first question anyone asks after a Magento incident, and this week the answer is not diagnostic. There are at least **2 confirmed breaches**, verified through independent incident response by Disrex Group and by hosting providers Nexcess and Liquid Web — three parties who do not share an interest in agreeing.

## The email nobody opens

The exploitation is two stages.

First, PHP code is injected into files that **Magento itself writes**.

Second, execution is triggered through a **Payment Transaction Failed Reminder** email — and in Sansec's words, "the code runs while Magento renders the message, so no one has to open it."

That is the part worth understanding properly. There is no victim in this chain. Nobody clicks anything, nobody opens an attachment, no customer or administrator makes a mistake. A scheduled job renders a templated email on the server, and rendering it is the execution.

Any control that depends on someone not falling for something is irrelevant here.

## The backdoor pretends to be the kernel

What lands is a **Rust binary of roughly 1.9 MB**, built for both **x86-64 and arm64**, running as a background process disguised as **[kworker/u:8:0]**.

On Linux, names in square brackets in a process listing are how the kernel presents its own threads. Choosing that name means an administrator scrolling through output sees something they have been trained their whole career to ignore.

It is also a checkable lie. **Real kernel threads are children of kthreadd, which is PID 2.** A userspace process wearing a kernel thread's name will not have that parent, and it will have things a kernel thread never has — an executable path, memory mappings, open sockets. That check takes one command and it is the most useful thing in this article.

## No skimmer, which is the strange part

Magento compromises are almost always about payment card skimming. This one is not, so far.

In one Disrex investigation there was **no evidence of data exfiltration, no rogue administrator accounts, no injected payment skimmer and no database backdoor**. The attackers established access and did nothing visible with it.

Two readings fit. Either this is staging — access banked now, monetised later or sold on — or the operators are building an inventory to sell. Both are speculation and neither is supported by published evidence, so hold them loosely. What is established is that a persistent backdoor exists on stores where nothing appears to have been stolen, and that "we checked and nothing was taken" is not the same as "we are fine".

## Indicators

Files:

- **~/.local/share/.gvfsd/gvfsd-user**
- **~/.local/share/.gvfsd/.gvfsd_[8 hex].lock**
- **/tmp/.gvfsd_[8 hex].lock**
- **/tmp/.kw_[random]**

SHA-256: **e315687a1dfe61ef4a5a5642214db6d3b2b05d81391285eebc2af664641a26a7** (Sansec), **8334b434fa3fe9f59cebe9609b11e0b1fd19d10212c45c705adec1902a1d06ef** (Disrex, disk), **251fabd50d7b18a8b5e1b3ef5d64e7198c17244778f6461fb1ab07f6169bf220** (Disrex, memory).

Network: **247.cdnflare[.]xyz**, and **99.84.67[.]186:443**, **88.216.72[.]181**, **5.181.86[.]133**.

Note the **.gvfsd** naming — it borrows from GNOME's virtual filesystem daemon, another name chosen to be skipped over.

## What to do

- **Check the process table for [kworker/…] entries whose parent is not PID 2.** This is the fastest possible triage and it costs nothing.
- **Search for the file paths above**, particularly anything matching /tmp/.gvfsd_ or /tmp/.kw_.
- **Do not wait for the patch to start looking.** Exploitation began on 4 September and the vendor has published nothing. Detection is the only thing available.
- **Treat "we are on the latest patch" as irrelevant to this one.** The first victim was.
- **Review what your Magento process can write**, and whether templated emails need to render with the permissions they currently have. The injection target is files Magento writes itself.
- **Watch Sansec rather than the CVE feed.** There is no CVE, so vulnerability scanners have nothing to key on.

## What is not established

- **The full exploit chain.** Sansec has not published it, deliberately.
- **Whether Adobe Commerce on Cloud is affected.**
- **How many stores are compromised.** Two are confirmed; the real figure is unknown.
- **Whether the installed backdoors have been used** since installation.
- **Who is behind it.**
- **Whether the unofficial patches circulating are complete.** Nobody has verified them against an unpublished chain.`,
  },
  {
    slug: "jsceal-nothing-in-google-authentication-was-bypassed",
    title: "Nothing in Google's authentication was bypassed. The malware took the session and replayed it",
    excerpt:
      "JSCeal steals cookies from Chromium browser profiles and reconstructs the session to reach a victim's Google account. That is being written up as bypassing Google authentication. It is not — no authentication mechanism is defeated, and the difference decides whether you go looking for an auth fix that does not exist.",
    categorySlug: "security",
    tags: ["jsceal", "infostealer", "session-hijacking", "malvertising", "check-point", "nodejs"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1761850167081-473019536383${P}`,
    body: `Check Point Research has published analysis of **JSCeal**, a compiled V8 JavaScript malware family targeting Windows, distributed through malvertising that impersonates cryptocurrency and trading platforms — **TradingView**, **Solana**, **Luno**, **Bybit**. Related activity has been tracked by Bitdefender since **September 2025** and by Confiant as **SourTrade** since **July 2026**, under cluster names including **WEEVILPROXY** and **MeadowLocust**.

Its browser-stealing module extracts cookies, passwords and OAuth tokens from the user-data directories of Chromium browsers — Chrome, Edge, Brave, Opera, Vivaldi, Cốc Cốc and others — and reconstructs the browser session to reach the victim's Google account.

That last capability is being reported as bypassing Google authentication. It is worth being precise, because the wording decides what people go and do on Monday.

## What was actually defeated

Nothing in Google's authentication.

A session cookie is what a service issues **after** you have authenticated. It exists so you do not have to log in on every request. Stealing it and replaying it does not break the login — it skips it, because the login already happened and the browser was told to remember that.

So: no password was cracked, no multi-factor prompt was defeated, no passkey was forged. Those mechanisms were not involved at any point. Malware with read access to the browser profile took a token the browser was holding and used it.

This is also not specific to Google. The same theft works against every service in that profile, for the same reason. Google is in the headline because it is recognisable.

## Why the distinction changes the response

If you believe Google authentication was bypassed, you look for an authentication fix — stronger MFA, a different provider, a configuration change. None of those help, because none of them are the failure.

The failure is that unauthorised code ran on the endpoint with access to the browser profile. Once that is true, every session in that profile is the attacker's, and it stays that way until the sessions are invalidated.

What does help:

- **Endpoint control**, because the whole chain starts with a malicious installer being run.
- **Short session lifetimes and reauthentication for sensitive actions**, which shrink the window a stolen cookie is worth anything.
- **Device-bound session credentials**, which cryptographically tie a session to the machine that created it so that a replayed cookie from elsewhere fails. This is the only control in the list that addresses the actual technique.
- **Sign out everywhere after a suspected infection.** Rotating the password without invalidating sessions leaves the attacker exactly where they were.

[The same confusion turned up in the passkey coverage last week](/article/passkey-attacks-2026-synced-keys-entra-windows-hello): the cryptography holds and the account still falls, because the attack was never aimed at the cryptography.

## How it arrives

Malvertising on **Facebook** and **Google** points at counterfeit trading sites. The victim downloads what looks like an installer for TradingView or a similar platform.

What runs is a PowerShell stage that pulls **two ZIP archives**: one containing a **Node.js runtime**, the other the payload.

Bringing your own Node runtime is a deliberate choice. The interpreter is legitimate and signed; the malicious part is script that a trusted binary executes. Nothing on disk looks like malware because, strictly, nothing on disk is.

The payload itself is **compiled V8 bytecode** rather than JavaScript source, which removes the easiest static analysis path. In the related **SourTrade** activity, what gets delivered is described as **assembly instructions for building the malware in memory** rather than a finished binary — no complete artifact to scan at any point.

## Scale

The campaign has run since **late 2024** in its SourTrade form, targeting **12 countries in 25 languages**, concentrated in Asia Pacific and Latin America.

No infection count has been published, no indicators of compromise are included in the reporting, and Google has not commented.

## What to do

- **Treat any machine that ran an unexpected installer as fully compromised**, and invalidate its sessions everywhere rather than only changing passwords.
- **Enable device-bound session credentials** wherever your provider offers them. It is the one control aimed at this technique rather than around it.
- **Shorten session lifetimes** for administrative and financial accounts, and require reauthentication for high-value actions.
- **Assume search and social advertising is a delivery channel.** The lure here is a paid ad for software the victim went looking for.
- **Do not tell your users that MFA failed.** It did not, and telling them otherwise teaches the wrong lesson about what protects them.

## What is not established

- **Attribution.** No actor is named.
- **Victim count.** None published.
- **Indicators of compromise.** None were included in the reporting.
- **Whether Google has shipped detections** or responded at all.
- **How effective stolen cookies are against Google's anomalous-login detection**, which is the question that decides how much of this actually works in practice.`,
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
