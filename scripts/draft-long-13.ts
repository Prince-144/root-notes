/**
 * Long-form drafts sourced from vendor primary material — Google Threat
 * Intelligence and Anthropic — rather than from trade-press write-ups.
 *
 * Pass --update to rewrite existing drafts; published articles are skipped.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "../payload-types";

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

const DRAFTS: Draft[] = [
  {
    slug: "gtig-first-ai-developed-zero-day-promptspy-android",
    title:
      "Google says it found the first zero-day it believes was developed with AI — and it was a logic flaw, not a memory bug",
    excerpt:
      "GTIG's threat tracker names five PRC-nexus groups, six malware families and a 2FA bypass in an open-source admin tool. The interesting part is why an LLM found it: fuzzers look for crashes, and this was a hardcoded trust assumption.",
    categorySlug: "ai",
    tags: [
      "threat-intelligence",
      "ai-security",
      "zero-day",
      "google",
      "malware",
      "china",
    ],
    readingMinutes: 12,
    coverImageUrl: `https://images.unsplash.com/photo-1771011726574-60ab6028724a${P}`,
    body: `Google Threat Intelligence Group published its AI Threat Tracker on **12 May 2026**, and buried in it is a first:

> For the first time, GTIG has identified a threat actor using a zero-day exploit that we believe was developed with AI.

The detail underneath that sentence is more useful than the sentence.

## What the vulnerability was

A **2FA bypass** in a popular open-source, web-based system administration tool. GTIG does not name it.

The nature of it is the point:

> It stems not from common implementation errors like memory corruption or improper input sanitization, but a high-level semantic logic flaw where the developer hardcoded a trust assumption.

That is not the kind of bug automated tooling finds. GTIG says so directly:

> While fuzzers and static analysis tools are optimized to detect sinks and crashes, frontier LLMs excel at identifying these types of high-level flaws and hardcoded static anomalies… they have an increasing ability to perform contextual reasoning, effectively reading the developer's intent to correlate the 2FA enforcement logic with the contradictions of its hardcoded exceptions.

A fuzzer finds a crash. It cannot find "the developer wrote an exception here that contradicts the rule they wrote there", because nothing crashes. That requires reading intent.

**Note the caveat on the bypass itself:** it requires valid user credentials first. It is a bypass of the second factor, not of authentication.

## How Google knows AI was involved

It does not, exactly, and it says so:

> Although we do not believe Gemini was used, based on the structure and content of these exploits, we have **high confidence** that the actor leveraged an AI model

The tells were in the artefact: a Python script with educational docstrings, a **hallucinated CVSS score**, and a structured Pythonic format.

A hallucinated severity score in a working exploit is a good detail. It is the sort of thing a model adds because exploit write-ups usually have one, and that a human exploit developer would not bother inventing.

GTIG disclosed to the vendor and says its **proactive counter discovery may have prevented its use** in a planned mass-exploitation campaign.

## The actors, and what they actually used AI for

Five PRC-nexus groups are named, and none of the use cases are exotic:

| Actor | Use |
| --- | --- |
| **UNC2814** | Persona jailbreaking — telling Gemini it was a "senior security auditor" or "C/C++ binary security expert" to get vulnerability research on TP-Link firmware |
| **APT45** | "thousands of repetitive prompts that recursively analyze different CVEs and validate PoC exploits" |
| **APT27** | Building a fleet-management app for its ORB relay network |
| **UNC6201** | A GitHub script automating premium LLM account registration and cancellation |
| **UNC5673** | Account pooling and LLM cost-sharing via Claude-Relay-Service and CLI-Proxy-API |

Two of those five are about **getting cheap access to models**, not about capability. That is worth noticing. A meaningful share of observed "AI threat activity" is threat actors solving the same billing problem everyone else has.

Also named: **TeamPCP/UNC6780**, which compromised PyPI and GitHub — the campaign behind [the poisoned LiteLLM releases](/article/litellm-poisoned-releases-cloudsek-2500-organisations) — and **Operation Overload**, a pro-Russia influence campaign using suspected AI voice cloning to impersonate journalists.

## The malware is where AI is genuinely load-bearing

Six families, and the design of one of them is a real shift.

**PROMPTSPY** — an Android backdoor that calls the Gemini API to drive the device itself. Its agent module serialises the device's UI hierarchy to XML via the Accessibility API, posts it to \`gemini-2.5-flash-lite\`, and executes the returned CLICK and SWIPE instructions at the coordinates the model computes.

It captures and replays biometric authentication, draws invisible overlays over uninstall buttons, and updates its C2, Gemini API keys and VNC relays at runtime.

That is malware that navigates an unfamiliar app by looking at it, rather than by having its screens hardcoded. It is the difference between a script and an operator.

The others: **PROMPTFLUX** (dynamic code modification via LLM), **HONESTCUE** (VBScript obfuscation via the Gemini API), **CANFAIL** and **LONGSTREAM** (decoy logic for evasion), and **SANDCLOCK** (a credential stealer delivered through the TeamPCP supply-chain compromises).

Google says **no app containing PROMPTSPY was found on Google Play**, and Play Protect covers known versions.

## Google's own limits on the story

GTIG is notably restrained, and the restraint is the most quotable part:

> Throughout early 2026, we observed that threat actors have not yet achieved breakthrough capabilities to bypass the core security logic of frontier models.

On influence operations:

> we have not identified this generated content in the wild, and none of these attempts have created breakthrough capabilities for IO campaigns.

And on where the AI advantage actually applies: LLMs excel at semantic logic flaws but **struggle to navigate complex enterprise authorization logic**.

So the honest summary is narrow. AI found one class of bug that traditional tooling is bad at. It did not make attackers generally better.

## The other half: Google is doing the same thing

Two of its own agents get named. **Big Sleep**, which found a real-world vulnerability Google says was "imminently going to be used by threat actors". And **CodeMender**, an experimental agent that automatically fixes critical code vulnerabilities.

That is the actual shape of this. The capability that found a hardcoded trust assumption in an open-source admin tool is available to whoever runs it, and both sides are running it.

## What to take from it

- **Audit for the bug class, not the tool.** Hardcoded exceptions in authentication logic, trust assumptions in config parsing, contradictions between an enforcement rule and its carve-outs. These survived years of fuzzing because fuzzing cannot see them.
- **Your 2FA implementation is the place to look first.** That is where this one was.
- **Treat "AI-assisted" claims sceptically and read the caveats.** GTIG has "high confidence" from artefact structure, and says outright it does not think its own model was used.
- **Watch Accessibility-service permissions on Android fleets.** PROMPTSPY's entire capability rests on that one grant.
- **Do not over-read this.** One zero-day, one bug class, and a vendor that says the frontier models have not been broken.`,
  },
  {
    slug: "cisco-catalyst-sd-wan-cve-2026-20245-troot-backdoor",
    title:
      "Attackers spent five months inside service-provider SD-WAN, then added a root account called troot and cleaned up after themselves",
    excerpt:
      "Mandiant documented CVE-2026-20245 in Cisco Catalyst SD-WAN Manager — a CSV upload that runs as root. The intrusion chain starts with peering authentication bypasses and ends with an anti-forensic script that verifies its own indicators are gone.",
    categorySlug: "security",
    tags: [
      "cisco",
      "zero-day",
      "sd-wan",
      "privilege-escalation",
      "incident-response",
      "telecom",
    ],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1698668975271-2ba9a323be6b${P}`,
    body: `**CVE-2026-20245** is a local privilege escalation in **Cisco Catalyst SD-WAN Manager**. An authenticated local attacker uploads a crafted CSV through the tenant-upload feature and gets command execution as root, because the upload does not filter what is in the file.

The command is one line:

\`\`\`
request tenant-upload tenant-list /home/admin/evil_tenant.csv vpn 0
\`\`\`

And the payload appends a user to the system:

\`\`\`
grep -q '^troot:' /etc/passwd || echo 'troot:x:0:0:root:/root:/bin/bash' >> /etc/passwd
\`\`\`

A root account named **troot** — one character from the real thing, which is the point.

## The chain, and why the CVE is the least of it

Mandiant traces the intrusion from **late 2025 to April 2026** against service-provider SD-WAN infrastructure:

1. Initial access via **unauthorised peering connections**, possibly through **CVE-2026-20127** or **CVE-2026-20182**
2. Theft or manipulation of the **\`vmanage-admin\`** account
3. Changing the default **\`admin\`** password
4. Exfiltrating configuration through the web interface
5. **CVE-2026-20245** for privilege escalation
6. Creating the rogue **troot** root account

Steps one and two are the ones to sit with. Both **CVE-2026-20127** and **CVE-2026-20182** are peering authentication bypasses that are **unauthenticated and remote**, and both grant administrative privileges.

So the zero-day is the escalation, not the entry. The entry was two remote auth bypasses in the peering layer — the part of the system that exists to trust other network devices.

## The cleanup is the professional part

After finishing, the actor:

- Deleted **evil_tenant.csv** and its backups
- Restored the original system configuration
- **Ran a validation script to verify every indicator had been removed**

That last item is what distinguishes this from most intrusions. The operator did not just tidy up; they wrote something to check the tidying worked.

If you are hunting this after the fact, you are looking for what a competent cleanup missed — the \`troot\` account, which had to stay for access to persist, and the network indicators the actor did not control.

## Patch, precisely

Fixed releases:

| Branch | Fixed in |
| --- | --- |
| 20.9 | **20.9.9.2** |
| 20.12 | **20.12.7.2** |
| 20.15 | **20.15.4.5** and **20.15.5.3** |
| 20.18 | **20.18.3.1** |
| 26.1 | **26.1.1.2** |

Two 20.15 entries because there are two supported trains — check which you are on rather than taking the higher number.

## Indicators

The malicious file:

- \`/home/admin/evil_tenant.csv\`
- SHA256 \`b82936f37648518425c7d3cf9e09eaffa41d7cdb3840f6a40287e3a108880f7b\`

Attacker IPs published by Mandiant: 126.51.108[.]152, 76.92.245[.]217, 207.190.37[.]94, 23.245.7[.]178, 153.186.231[.]233, 167.179.79[.]189, 45.32.38[.]160, 209.137.225[.]101.

The file hash is close to useless retrospectively — the actor deleted it. The IPs and the account are what survive.

## Why service providers, and why you should care anyway

The confirmed targeting is service-provider SD-WAN infrastructure. That is a supply-chain position: whoever controls a provider's SD-WAN manager controls routing for every downstream customer of that provider.

Mandiant notes potential exposure across banks, retail, healthcare and technology services — not because those were targeted, but because they sit behind the infrastructure that was.

This is the same shape as [the Polish CHP plant reached through a distribution operator's private APN](/article/polish-chp-plant-private-apn-wago-turbine-shutdown): the compromise happened in shared infrastructure that none of the affected organisations owned or monitored.

## What to do

- **Check your version against the table**, and check the branch, not just the number.
- **Grep \`/etc/passwd\` for accounts you did not create**, on every SD-WAN Manager instance. \`troot\` specifically.
- **Audit the \`vmanage-admin\` and \`admin\` accounts** — password change history and last-used.
- **Patch CVE-2026-20127 and CVE-2026-20182 too.** They are the unauthenticated remote entry; the escalation is worthless without them.
- **Ask your connectivity provider whether they were affected.** If you buy managed SD-WAN, this is their patch to apply and your exposure.`,
  },
  {
    slug: "adfs-signing-keys-machine-dpapi-golden-saml-ghost-certificate",
    title:
      "A retired certificate in the database, a live key on disk: how Mandiant pulled an ADFS signing key and forged Global Administrator",
    excerpt:
      "The technique needs SYSTEM on the ADFS host and touches neither LSASS nor the running service. It works because manual certificate rotation leaves the database pointing at a ghost while the real key sits in the machine DPAPI store.",
    categorySlug: "security",
    tags: [
      "identity",
      "adfs",
      "golden-saml",
      "active-directory",
      "detection",
      "red-team",
    ],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1782094673136-5198a372980c${P}`,
    body: `Mandiant has documented a way to recover a **live ADFS token-signing private key** from the machine-scoped DPAPI store, and used it in a red team engagement to forge a SAML assertion that Entra ID accepted as **Global Administrator**.

What that key is worth:

> By obtaining the private key of an ADFS token-signing certificate, an attacker can authenticate as any user to any SAML-federated application, bypassing multifactor authentication (MFA), conditional access, and all identity-based controls.

This is **Golden SAML**, first described by CyberArk in 2017. What is new is the extraction path.

## The precondition, stated honestly

**SYSTEM on the ADFS host.** That is not a small ask, and anyone presenting this as a remote attack is misreading it.

But Mandiant's own framing of why it still matters is the right one: if SYSTEM is achieved on an ADFS host, **the signing key must be considered compromised** — and most organisations do not treat ADFS as though that were true.

## The "ghost certificate"

The interesting failure is a configuration drift almost nobody audits for.

When **AutoCertificateRollover is disabled** and certificates are rotated by hand, administrators frequently install the new certificate without updating ADFS itself. The result:

> the database often becomes a "ghost" — a record that still exists, still decrypts successfully, but references a certificate no longer used for token signing by the ADFS service.

So an investigator reading the configuration database sees a retired certificate and concludes nothing of value is there. The **live** key is somewhere else: in the machine key store at \`C:\\ProgramData\\Microsoft\\Crypto\\RSA\\MachineKeys\\\`, protected by the \`DPAPI_SYSTEM\` LSA secret and machine masterkeys under \`S-1-5-18\`.

Mandiant confirmed the active key material's location with \`SharpDPAPI /machine\` enumeration.

## Why it evades the monitoring you have

The technique never touches the things security teams watch:

> The technique avoids direct interaction with components such as LSASS and the live ADFS service process, which are often subject to enhanced monitoring in enterprise environments, and may therefore result in lower visibility depending on the organization's telemetry coverage.

No LSASS access. No interaction with the running service. No credential-dumping behaviour to alert on. Just file reads against a crypto directory and an LSA secret — both of which a SYSTEM process is entitled to do.

## This is documented behaviour, not a bug

Worth being clear: Microsoft has not patched this and probably will not, because it is how the design works. Machine-scoped DPAPI protection is what lets ADFS keys survive service-account password changes, gMSA rotations and reboots. That resilience is the feature.

Mandiant's framing:

> this design introduces an operational security implication that is not commonly emphasized in standard ADFS hardening guidance

Not a vulnerability. An implication of an architecture, plus a configuration habit that hides where the live key actually is.

## Detection, in order of usefulness

**1. Token issuance without preceding authentication.** Compare primary authentication events against token issuance in the ADFS audit log — Event IDs 299 and the 1200-series, depending on version. A forged assertion produces the second without the first. This is the strongest signal available.

**2. Configuration drift — ADFS Event ID 385.** This is the observable symptom of the ghost condition. It self-resolves once AutoCertificateRollover is re-enabled and a rollover runs; if it persists in a manually-rotated environment, that is the drift.

**3. SACL auditing on the crypto stores.** Object access auditing on \`MachineKeys\\\` and the \`S-1-5-18\` protect directory generates **Event ID 4663**. Mandiant is explicit that this is supporting evidence, not a standalone signal — legitimate processes read those paths.

**4. Federated identity correlation.** For privileged accounts, watch for unexpected IP ranges, claim-set deviations and user-agent inconsistencies, cross-correlating Entra ID sign-in logs with ADFS-side issuance. Neither source alone is sufficient.

## What to fix

- **Treat ADFS as Tier 0.** Same controls as a domain controller: restricted admin paths, dedicated privileged access workstations, separation from general server administration.
- **Validate that your rotations completed.** With AutoCertificateRollover disabled, installing the certificate is not enough — you must run \`Set-AdfsCertificate\`, then verify with \`Get-AdfsCertificate\`. This single check finds the ghost condition.
- **Move token-signing keys to an HSM.** That removes the extraction path entirely, because the key never exists in software-accessible storage.
- **Run ADFS under gMSA** to cut the credential-rotation drift that causes this in the first place.
- **Audit every relying party trust, not just Microsoft ones.** A compromised signing key affects every SAML application you federate — including the SaaS platforms nobody remembers configuring.
- **Consider migrating off ADFS** to native OIDC federation, which removes this path along with several others.

## What is not established

- **Not observed in the wild.** This came out of a Mandiant red team engagement. Nothing here says an actual intrusion has used it.
- **No CVE and no patch**, because the behaviour is by design.
- **No prevalence figure.** Mandiant says the configuration is "commonly deployed"; nobody has counted.

The one thing to take away if you take nothing else: run \`Get-AdfsCertificate\` and check that what ADFS thinks it is signing with is what is actually on disk.`,
  },
  {
    slug: "unc6671-blackfile-rebrand-vishing-passkey-enrollment",
    title:
      "The vishing crew calls your staff on their personal phones and offers to help enrol their passkey",
    excerpt:
      "UNC6671 runs four extortion brands off one set of domains. The pretext is a security upgrade — FIDO2 enrolment, MFA migration — and the payoff is an adversary-in-the-middle portal. Average settled payment: $750,000.",
    categorySlug: "security",
    tags: [
      "vishing",
      "social-engineering",
      "extortion",
      "identity",
      "cloud-security",
      "threat-intelligence",
    ],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1587560699334-bea93391dcef${P}`,
    body: `Google Threat Intelligence published its analysis of **UNC6671** on **7 August 2026**. The group used to be **BlackFile**. It now runs four extortion brands simultaneously — **REDACT**, **PINK**, **HELIX** and **FALCON** — off one shared set of domains.

The lure is the part worth studying, because it inverts a security message your own organisation has probably been sending.

## The call

1. Someone rings an employee **on their personal mobile**, which routes around every corporate control you have.
2. They present as **IT helpdesk**, running an urgent security migration — **FIDO2 passkey enrolment**, or an **MFA update**.
3. They send the victim to a spoofed portal, on a domain like \`[company].createssopasskey[.]com\`.
4. An **adversary-in-the-middle** rig captures the credential and the MFA token in real time.
5. The session persists as a legitimate authenticated session.

Then scripts pull data out of **Microsoft 365**, **Okta** and whatever else is federated, while the actor **deletes password-reset confirmations, security alerts and MFA configuration notices** so the victim never sees the trail.

The pretext works because it is the message every security team is currently sending. "We are moving everyone to passkeys, it is more secure, please enrol." A caller offering to help with that is offering to help you do the thing you were told to do.

## The domains give the whole thing away

UNC6671 reuses root domains across brands that are supposed to look like separate operations:

| Brand | Domains |
| --- | --- |
| FALCON | passkeyhelpdesk[.]com · portalpasskey[.]com · addssopasskey[.]com |
| HELIX | **passkeyhelpdesk[.]com** (shared with FALCON) · oskeysync[.]com · keysyncos[.]com |
| PINK | passkeyms[.]com · mysecurepasskey[.]com · passkeydeploy[.]com |
| BlackFile | setupsso[.]com · idokta[.]com · passkeyuser[.]com |

Google also found **identical phishing templates deployed simultaneously** across domains, hitting different companies that were later claimed by different leak-site brands.

Every one of those names contains "passkey", "sso" or "okta". A domain-registration monitor for those strings plus your company name is a cheap, high-yield control.

## The money

Tracking 18 BlackFile Bitcoin wallets from **7 January to 12 May 2026**:

| | |
| --- | --- |
| Total received | **141.65 BTC (~$10.69 million)** |
| Opening demand | $1–3 million |
| Typical negotiated reduction | **50–75%** |
| Average final payment | **$750,000** (~10.2 BTC), in **53%** of cases |

Two things follow. The demand is an opening position, and roughly half of victims pay.

## The targeting moved up-market

| Period | Sectors |
| --- | --- |
| Apr–May 2026 | Manufacturing, real estate, healthcare, insurance |
| Jun 2026 | Technology, transportation, hospitality — organisations with IP and source code |
| **Jul 2026** | **Financial services and legal** — private equity, law firms, rating agencies |

The July shift is deliberate. Private equity firms, law firms and rating agencies hold M&A material, capital deployment plans and litigation data. That is information whose value does not depend on encrypting anything — it is worth money to the people it is about, and to people trading against them.

Operational tempo rose to match: 28 root domains at one every 2.2 days in April–May, accelerating to one every 1.6 days by June–July, with **seven domains in 72 hours** on 20–22 July.

## The rebrand story is worth one paragraph

On **11 May 2026** the group announced BlackFile's leak site was shutting down. Operations continued. On **27 June** it announced the REDACT rebrand, claiming the BlackFile brand had been *"compromised and hijacked by an exiled affiliate"* running an unauthorised lookalike site.

Take that as marketing. What it tells you is that the brand is a disposable layer over a stable operation — which is exactly why [counting ransomware groups produces wildly different numbers depending on who counts](/article/storm-ransomware-new-leak-site-nineteen-victims-eight-days). Four brands here are one crew.

## Detection worth implementing this week

**In your IdP logs**, the sequence that gives it away:

\`\`\`
system.multifactor.factor.setup
  preceded by  user.authentication.auth_via_mfa failures
  preceded by  abandoned push challenges
\`\`\`

An MFA enrolment that follows failed authentications and abandoned pushes is someone else enrolling their factor on the victim's account.

**In SaaS logs**, exfiltration shows up as \`FileAccessed\` events with scripting user-agents — \`python-requests/2.28.1\`, \`WindowsPowerShell/5.1\`, \`Go-http-client\` — or access volumes above any plausible human browsing rate.

**In authentication sources**, watch for commercial VPN providers (Mullvad, Private Layer) and residential broadband pools (AT&T, Comcast, Charter) diverging from an employee's geographic baseline. Residential proxies are how this crew looks normal.

## What actually stops it

- **Phishing-resistant MFA, properly.** FIDO2 roaming keys, platform authenticators, Okta FastPass. An AiTM portal cannot replay a hardware-bound assertion.
- **Tell staff the helpdesk will never call them on a personal phone about passkeys.** Name the specific pretext. Generic "beware of phishing" training does not cover a call that sounds exactly like your own rollout.
- **Restrict authentication to trusted networks and managed devices.** Conditional access on device compliance defeats the session even after a credential is captured.
- **Alert on MFA enrolment**, always, to a channel the attacker cannot delete from.
- **Monitor domain registrations** containing "passkey", "sso", "okta" and your brand.

We covered [the Teams vishing campaign that reached encryption in under 17 hours](/article/teams-vishing-stac4749-chaos-ransomware) last month. Same category, better production values, and now aimed at the firms that hold other companies' secrets.`,
  },
  {
    slug: "claude-text-watermark-synthid-what-it-cannot-do",
    title:
      "Anthropic watermarked Claude's text — and published the list of things that erase it",
    excerpt:
      "It uses Google DeepMind's SynthID-Text, biasing word choice with a cryptographic key. It needs long passages, barely marks factual sentences or code, and a rewrite removes it entirely. The detector is not public yet.",
    categorySlug: "ai",
    tags: [
      "anthropic",
      "watermarking",
      "provenance",
      "ai-policy",
      "content-authenticity",
      "eu-ai-act",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1691438929124-ad2ea67dd190${P}`,
    body: `Anthropic published an explanation on **14 August 2026** of how Claude's text watermark works. The notable thing about it is how much of the post is about what the watermark cannot do.

## The mechanism

It uses **SynthID-Text**, the method published by Google DeepMind. Nothing in the output is visibly altered.

When a model generates text there are usually several equally good next words — "overcast" or "grey". SynthID uses a **cryptographic key** to bias that choice, so the sequence carries a statistical signature.

Anthropic's description:

> the words that Claude picks are still random, but now, one can check the sequence of words and see if it's consistent with the choices Claude would make if it was using the key

The key insight is that the watermark lives in the **freedom** the model has. Where there is no freedom, there is no watermark.

## Which is why the limits fall where they do

Every limitation Anthropic lists follows from that one fact:

**Short samples do not work.** Detection needs enough choices to become statistically distinguishable from chance. Anthropic: detection "doesn't work well on small samples."

**Factual sentences barely carry it.** Their example: *"Isaac Newton's most famous work was called Principia."* There is no alternative wording that is equally correct, so there is nothing to bias.

**Code carries less** than prose, because exact output is usually required.

**Edited human text barely carries it** — "nearly all the words are the person's."

**A full rewrite removes it.** Anthropic's own comment on that is fair: at that point "it's arguable whether the text can any longer be described as AI-generated."

**Translation preserves it**, because every word in the translation is chosen by Claude.

## What it explicitly cannot tell you

> [The watermark] cannot distinguish "Claude wrote this" from "Claude heavily edited this."

Nor can it confirm that text was human-written, nor detect other AI systems.

That is the sentence that should govern every downstream use. A watermark detector answers one question — *does this text carry Claude's signature* — and a negative answer means almost nothing. Not watermarked could be: another model, a human, a rewrite, a short passage, a factual passage, code, or a Claude output someone edited.

## Where it applies, and when

Watermarking applies to **Claude models launched after 2 August 2026**, globally at launch. Older models get it "over the coming months", and Anthropic attributes that phasing to **EU law transition periods** — which tells you the regulatory driver behind this.

Separately, Claude attaches **C2PA content credentials** to images (.png, .jpg, .svg) in file metadata, using the open industry standard rather than a bespoke scheme.

**The detection API does not exist yet.** Anthropic says it plans to offer one and is "in the process of working out the details." No accuracy figure and no false-positive rate have been published.

## Why this matters for anyone who might have to rely on it

The obvious application is academic integrity and hiring, and that is where the limits bite hardest.

A student who prompts Claude, then rewrites in their own words, defeats it — and arguably should. A student who submits raw output gets caught. So it catches the laziest case and nothing else, which is a real but narrow win.

The dangerous failure mode is the inverse. **A missing watermark is not evidence of human authorship.** If an institution treats "not detected" as exculpatory, it will clear people who used a different model. If it treats "not detected" as suspicious, it has no basis for that at all.

And the false-positive question is unanswered because the API is not out. Until Anthropic publishes a false-positive rate, nobody should be making a decision about a person on the strength of this.

## The honest read

This is a good-faith implementation of a technique with known limits, shipped on a regulatory timetable, documented candidly including the ways to defeat it.

It is not a solution to AI-generated content detection, and Anthropic does not claim it is. It is provenance signalling for unmodified output — useful for platform-scale filtering, useless for adjudicating an individual case.

Two things to watch: **whether the detection API ships with a published false-positive rate**, and **whether other labs adopt SynthID-Text**. A watermark only one vendor applies tells you which model was used, not whether a model was used — and the second question is the one everyone actually wants answered.`,
  },
];

const UPDATE = process.argv.includes("--update");
const payload = await getPayload({ config });

for (const draft of DRAFTS) {
  const { docs: clash } = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
  });

  if (clash.length > 0) {
    const existing = clash[0] as { id: number | string; status: string };
    if (!UPDATE || existing.status === "published") {
      console.log(`skip (${existing.status}): ${draft.slug}`);
      continue;
    }
    await payload.update({ collection: "articles", id: existing.id, data: { ...draft } });
    console.log(`updated: ${draft.slug} (${draft.body.split(/\s+/).length} words)`);
    continue;
  }

  const created = await payload.create({
    collection: "articles",
    data: {
      ...draft,
      author: "Prince Baruwala",
      publishedAt: new Date().toISOString(),
      status: "draft",
      featured: false,
      views: 0,
    },
  });

  console.log(
    `drafted: ${draft.slug} (id ${created.id}, ${draft.categorySlug}, ${draft.body.split(/\s+/).length} words)`,
  );
}

process.exit(0);
