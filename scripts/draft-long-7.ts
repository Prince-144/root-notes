/**
 * Long-form drafts — week of 10–11 August 2026.
 *
 * Six stories, each researched against the primary reporting and, where the
 * research was presented publicly, against the venue. Covers are picked from
 * ids verified to return 200 and checked against every cover already in use.
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
    slug: "malicious-sim-run-at-modem-code-execution",
    title:
      "A SIM card can tell your modem what to do — and on some devices, that means code execution",
    excerpt:
      "Researchers from the University of Birmingham and Fuzzware showed that a hostile SIM can drive a standardised command called RUN AT straight into the modem. Three of eighteen phones accepted it. So did six of eight Quectel modules, and an EV charger.",
    categorySlug: "gadgets",
    tags: [
      "hardware",
      "iot",
      "cellular",
      "vulnerabilities",
      "supply-chain",
      "qualcomm",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1753036051291-cfc20d052c24${P}`,
    body: `Presented at **USENIX WOOT** in Baltimore this month, research from the **University of Birmingham** and the security firm **Fuzzware** makes an argument that is easy to state and unusually hard to dismiss: the SIM card is not a passive credential. It can issue commands to the modem, one of those commands is a general-purpose console, and on a meaningful fraction of devices nothing stops it.

The command is **RUN AT**. It is a proactive SIM command — part of the standard, not a bug — and it asks the modem to execute an AT command. AT is the modem control language that dates back to the 1981 Hayes Smartmodem. It is still how software talks to cellular hardware.

Put a hostile SIM in a device whose modem honours RUN AT, and you have a shell.

## What they tested, and what accepted it

| Category | Tested | Accepted RUN AT |
| --- | --- | --- |
| Phones | 18 | **3** |
| Quectel modules | 8 | **6** |

The three phones were the **OPPO Find X5**, the **OPPO Reno 14 F 5G** and the **ASUS Zenfone 9**. No iPhone and no Pixel was among them.

The modules matter more than the phones. **Quectel EC25, EG25 and RM52xN** parts are the cellular radios inside industrial routers, telematics units, payment terminals and EV chargers — devices with an accessible SIM tray, a long service life and no update story worth the name.

## Three separate failures, one interface

The paper is not a single bug. It is the same interface used three different ways, which is what makes "just patch it" the wrong frame.

**The EV charger.** On an **Autel MAXI US AC W12-L-4G**, \`atfwd_daemon\` passes attacker-controlled text into a shell call through an unsafe format string. There is a character blocklist. It does not block newlines. Two stages later, that is code execution — driven entirely by commands the SIM issued.

**The phone.** \`AT+COPS=0,,,0\` pins the handset to 2G. That is not a crash and not a compromise; it is a configuration change the owner cannot undo through any user-facing setting. A device pinned to 2G is a device that will talk to a fake base station.

**The module.** A TFTP daemon on the Quectel part runs as root and does not check whether a path is a symbolic link. Arbitrary file read, from a SIM.

The common factor is not a coding mistake. It is that the modem trusts the SIM, and the software behind the modem trusts the modem.

## The CVE list is shorter than the problem

| Identifier | What it covers |
| --- | --- |
| **CVE-2026-57550** | The SIM AT interface, assigned through Qualcomm |
| **CVD-2026-0122** | GSMA tracking for the same issue |
| CVE-2025-48618 | Separate Android flaw — hostile SIM opening web pages on locked Pixels |
| CVE-2021-31698 | Command injection in the same daemon, from 2021 |

That last row is the uncomfortable one. The same daemon had a command injection five years ago. The interface it sits behind was not reconsidered then.

## Where the vendors are

**Qualcomm** has built a hardened configuration that switches the interface off by default, and says it will be the default on future devices, with fixes reaching affected modules as updates.

**Quectel** has mitigated the file-access flaw and is still working on the interface itself.

**Semtech** confirmed the findings and plans to ship patches written by Qualcomm.

**OPPO** and **Google** treated the findings as informative but outside bug bounty scope.

As of **10 August**, none of the five vendors had published a public advisory.

The researchers' position is that the interface should be hardened, deprecated, or disabled outright. No attacks using it have been reported.

## Why this is not a phone story

The instinct on reading "malicious SIM card" is to picture a stolen handset. That framing understates it in one direction and overstates it in another.

It overstates it because a phone in your pocket is not where a hostile SIM lands. It understates it because the devices that *do* have SIM trays sitting in unattended locations — chargers, cabinet routers, telematics boxes, kiosks — are exactly the devices with the weakest software and the longest replacement cycles.

We wrote in July about [the Minnesota water systems that were reached through cellular modems rather than through any exploit](/article/minnesota-water-plc-attacks-no-exploit-needed). The pattern here is adjacent. The cellular link is treated as plumbing — something the network team owns and the security team never models — and the SIM inside it is treated as an identity token rather than as an input.

It is an input.

## What to actually do

- **Inventory the SIM trays.** Not the devices with cellular. The devices where a person can physically reach the SIM. That is a much shorter and much more actionable list.
- **Ask your module vendor about RUN AT specifically.** "Are you affected by CVE-2026-57550" will get a slower answer than "does your firmware honour the RUN AT proactive command, and can it be disabled."
- **Treat 2G pinning as a detectable event.** If a fleet device drops to 2G and stays there, that is worth an alert, regardless of cause.
- **Do not wait on advisories.** Five vendors, no public advisory, three weeks after a conference talk. The hardened Qualcomm configuration is real but it is a default for future devices, which is not the same as a fix for the ones already in cabinets.

The honest summary: this is a standards-level design decision that aged badly, being addressed device by device. That process is going to take years, and the affected hardware has a service life measured in the same units.`,
  },
  {
    slug: "polish-chp-plant-private-apn-wago-turbine-shutdown",
    title:
      "Attackers walked from a wind farm to a heat plant's turbine over a private cellular network",
    excerpt:
      "CERT Polska's report on a December 2025 intrusion at a Polish CHP plant describes what it calls the first real-world use of a private APN as an attack path. The controller they landed on still had its default admin password.",
    categorySlug: "security",
    tags: [
      "ics",
      "ot-security",
      "critical-infrastructure",
      "cellular",
      "incident-response",
      "europe",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1772376920691-3c454f7f80a0${P}`,
    body: `On **8 August 2026**, after a three-month investigation, **CERT Polska** published its account of an intrusion at a Polish **combined heat and power plant** — a facility supplying heat to roughly **50,000 residents**. The attack itself happened in **December 2025**. Poland's prime minister had mentioned in January that two CHP plants were hit; this is the second of them to be described in detail.

The plant is not named. Almost everything else is.

## The route

| When | What |
| --- | --- |
| — | FortiGate firewall at a **wind farm**, internet-exposed, VPN accepting accounts without MFA |
| **18–25 Dec** | Attacker scans the private APN, finds a **WAGO PFC200** controller with default admin credentials |
| **25 Dec** | Connects to three **Siemens PLCs** over S7 — reconnaissance only |
| **29 Dec, 05:30–10:10** | Siemens controllers switched to STOP and password-protected; **steam turbine** and **process-water treatment** shut down |

Recovery began around **07:30**, while the attackers were still active on the network. Customers lost neither heat nor electricity.

## The part CERT calls a first

The pivot did not go over the internet. It went over a **private APN** — a dedicated cellular data network operated by the local distribution system operator, the kind of link an energy utility uses to reach remote sites without exposing them publicly.

CERT Polska describes this as the first instance of that attack vector being observed in a real-world cyberattack.

The mechanism is mundane, which is the point. Polish organisations running private APNs commonly let any device on the network reach any other. A wind farm and a heat plant have no business talking to each other. On the APN, they could.

CERT's first recommendation is correspondingly plain: audit the private APN configuration and switch on client isolation.

## The equipment list

- **FortiGate** firewall (initial access)
- **Teltonika RUTX50** cellular router
- **WAGO PFC200** controller
- **Siemens S7-300, S7-1200, S7-1500** PLCs
- Seven **Moxa** serial device servers

Read that list the way an incident responder would. There is no zero-day in it.

**No CVE was established as the cause.** The WAGO controller retained its default admin credentials. The private APN permitted client-to-client traffic. The Teltonika router's SSH service and the controller's web interface functioned exactly as configured.

Everything worked as designed. The design was the problem.

## Eleven days of nothing, then forty minutes

The gap between the scan on 18 December and the destructive action on 29 December is the most operationally useful detail in the report.

The attacker was on the network for eleven days before touching anything. They connected to the Siemens PLCs on the 25th and did nothing. Then, on the 29th, between 05:30 and 10:10 — early morning, holiday week — they stopped the controllers and set passwords on them.

Password-protecting a PLC after switching it to STOP is not a ransomware move and it is not noise. It is an attempt to extend the outage by making recovery require the vendor.

That is the window defenders had, and it is a generous one. Eleven days of an unfamiliar device scanning an APN is detectable if anyone is looking at the APN. Nobody was, because the APN is a telecoms product and the security team does not own it.

## Attribution: nobody has named anyone

The broader December campaign drew four separate assessments in January — from Poland's government, CERT Polska, **ESET** and **Dragos**. None of them addressed this specific intrusion, and no actor has been named for it.

That is worth stating plainly, because the surrounding coverage tends to fill the gap. A CHP plant in Poland in December 2025 invites an obvious assumption. The report does not make it, and neither will we.

## What this changes for anyone running OT

- **Your private APN is a flat network until you prove otherwise.** Client isolation is a setting. Ask whether it is on. If the answer takes more than a day to obtain, that is itself the finding.
- **Default credentials on a controller are not a low-severity item** when the controller is reachable from a network you do not monitor. Severity is a function of reachability.
- **Shared infrastructure between generation sites is a trust relationship.** A wind farm and a heat plant sharing an APN means the wind farm's firewall is the heat plant's firewall.
- **Watch for STOP-plus-password as a signature.** It is a deliberate recovery-delay tactic and it distinguishes a destructive operator from an opportunistic one.

The recurring lesson across the OT incidents we have covered this year — [the Minnesota water systems reached with no exploit at all](/article/minnesota-water-plc-attacks-no-exploit-needed) among them — is that the attacks are not clever. They are patient, and they use the parts of the network that nobody has drawn on a diagram.`,
  },
  {
    slug: "ghostsplice-mcp-split-instructions-coding-agents",
    title:
      "Splitting a malicious instruction in two took model compliance from 42% to 82%",
    excerpt:
      "ASSET Research Group's GhostSplice technique fragments an exfiltration request across MCP tool descriptions and tool results. No single piece looks wrong. The agent assembles it. Several models went from 0% to 100%.",
    categorySlug: "ai",
    tags: [
      "prompt-injection",
      "mcp",
      "ai-security",
      "coding-agents",
      "supply-chain",
      "llm",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1619410283995-43d9134e7656${P}`,
    body: `Most prompt-injection defences work on the assumption that the malicious instruction exists somewhere as a coherent instruction — in a page, a file, a tool description — and can therefore be detected, filtered or refused.

**GhostSplice**, disclosed by the **ASSET Research Group** with a reference implementation on their public GitHub, attacks that assumption directly. The technique splits the request into fragments that each look routine, places them in channels the assistant already uses, and lets the agent stitch them together.

Nothing the model sees is an instruction to exfiltrate anything. The exfiltration is an emergent property of the pieces.

## How the pieces fit

The demonstration uses a harmless-looking MCP tool called \`integrity_checker\` with bland parameters — alpha through delta. There is nothing to refuse there; it is a tool that checks integrity and takes four fields.

The mapping from those fields to sensitive file paths arrives separately, inside a **project-scan result**. Also unremarkable on its own: a scan result that mentions where things live.

The agent holds both. It fills alpha through delta with the contents of the mapped paths, because that is what the two pieces, together, describe.

A three-channel variant goes further, separating project inventory, file-to-field mapping, and collection across different interactions.

## The numbers

Across **eleven API-tested models**, splitting the instruction into two pieces moved average compliance from **42% to 82%**.

The per-model figures are starker.

| Model | Single instruction | Split |
| --- | --- | --- |
| GPT-4o | 0% | **100%** |
| Gemini 2.0 Flash | 0% | **100%** |
| Llama 3.3 70B | 0% | **100%** |
| Claude Haiku 4.5 | 0% (API) | **100%** (Cursor, three-piece) |

A model at 0% is not a model that resists this class of attack. It is a model that recognised a coherent malicious request. Remove the coherence and the refusal has nothing to fire on.

**GPT-5.4** ran between **90%** in Cursor and **100%** in Codex CLI — and **0% behind Claude Code**. Same model, three harnesses, three results.

Claude Sonnet 4.6 and Opus 4.6 show 0% in the published tables, though the researchers noted Sonnet sent proprietary source containing a live hardcoded key in one test. That is worth carrying: a 0% in a compliance table is not the same as no data leaving.

The line the researchers draw from this is the one that generalises:

> The safety boundary around the model can matter as much as the model itself.

## What was targeted

- \`.ssh/id_rsa\` — SSH private keys
- \`.env\` — environment variables
- Proprietary source code
- \`customers.csv\` — customer data

The list is unglamorous on purpose. These are the files a coding agent already has permission to read.

## The precondition that bounds the risk

This is not an external intrusion vector, and the research is clear about it. GhostSplice requires that the developer has **already connected the attacker's MCP server**, and it assumes the agent can already read the files being taken.

That is a real constraint. It is also a smaller one than it sounds, because installing an MCP server is currently a two-line config change made on the strength of a README, and the ecosystem has no equivalent of package signing.

We looked in July at [instruction files that run before a developer types their first prompt](/article/coding-agents-code-runs-before-first-prompt-datadog) and at [PromptLogger's findings on AI instruction files as a persistence mechanism](/article/promptlogger-ai-instruction-files-mitiga). GhostSplice is the same category of problem with the delivery moved one layer out: the agent's tool surface rather than its file context.

No CVE identifiers had been assigned as of **10 August 2026**. The disclosure followed coordinated vulnerability disclosure. OpenAI's current guidance already warns that unsafe MCP servers increase prompt-injection risk and recommends vetting integrations — which is correct, and is advice that only works if there is something to vet against.

## What to take from it

- **Model choice is not the control.** GPT-5.4 went from 100% to 0% by changing harness, not model. Whatever Claude Code does differently is doing more work than the model's own refusals.
- **Per-request filtering cannot see this.** Every fragment is individually benign. A filter that scores requests in isolation will pass all of them.
- **Treat MCP servers as dependencies with write access to your reasoning.** Not as plugins. The tool description is untrusted input that reaches the model on every turn.
- **Egress is the last honest boundary.** If an agent can reach an arbitrary host, the assembled instruction has somewhere to send data. If it cannot, most of this stops being interesting.
- **A 0% row is not a clean bill of health.** One of the 0% models still sent source with a live key in it.

The uncomfortable structural point is that the split-instruction problem does not have an obvious model-level fix. Assembling scattered context into a coherent action is not a failure mode of a capable agent. It is the capability.`,
  },
  {
    slug: "passkey-attacks-2026-synced-keys-entra-windows-hello",
    title:
      "Three separate teams found ways around passkeys — and one of them recovers the private key",
    excerpt:
      "Black Hat and the weeks around it produced three unrelated results against phishing-resistant authentication: replayable signatures in Windows event logs, a master key pulled from Chrome's memory, and Windows Hello keys used without a PIN prompt.",
    categorySlug: "security",
    tags: [
      "passkeys",
      "authentication",
      "mfa",
      "windows",
      "microsoft",
      "vulnerabilities",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1768839720936-87ce3adf2d08${P}`,
    body: `Passkeys are sold on a specific promise: the private key never leaves the authenticator, so there is nothing for a phishing page to capture. That promise is about the credential. Three pieces of research published in early August 2026 go after everything around it — and one goes after the credential itself.

They are unrelated efforts by unrelated teams. That is the part worth noticing.

## 1. Pass-the-Passkey — SpecterOps

**Michael Grafnetter**, principal security researcher at SpecterOps, presented this at **Black Hat USA** on **5 August**.

Windows stored **YubiKey signatures in cleartext**, in a location readable by unprivileged users. Those signatures were reused during **Microsoft Entra ID** passkey validation. An attacker who could read the event log could replay an assertion and satisfy a phishing-resistant MFA requirement without the key.

| | |
| --- | --- |
| Affected | Windows 10, Windows 11, Windows Server; Entra ID |
| CVE | **CVE-2026-34348** — Windows Event Logging Service information disclosure, CVSS **6.5** |
| Fixed | July 2026 updates |

Microsoft's statement: *"We have applied mitigations for the reported issue involving passkey relay assertions."* The July updates make WebAuthn assertions in event logs unusable for replay.

CVSS 6.5 is a "medium". An information disclosure that yields an MFA bypass is not a medium in practice, and this is a good example of why severity scores and operational impact diverge.

## 2. Pass-ta-key — Unit 42

**Unit 42** (Palo Alto Networks) published three variants against **Google Password Manager's synced passkeys** in Chrome on Windows.

- **Signature without unlock.** Abuses Chrome's device identity machinery to obtain signatures without the user unlocking anything.
- **User-verification manipulation.** Demonstrated against eBay.
- **The Golden Pass-ta-key.** Recovers the **32-byte Security Domain Secret** — the master key — from Chrome process memory during re-registration. With it, the attacker recovers the victim's synced passkey private keys.

The third one is the outlier in this whole set. The other results defeat a *check*. This one takes the *key*.

And there is no rotation or revocation path for it. A stolen password gets changed. A stolen synced passkey private key, obtained through the master secret, does not have an equivalent remedy exposed to the user.

## 3. Windows Hello for Business — Dirk-jan Mollema

Independent researcher **Dirk-jan Mollema** showed that low-privilege processes inside a compromised user session can call Windows cryptographic interfaces to *use* the non-exportable Windows Hello for Business key — without a PIN or biometric prompt. The key then functions as a **FIDO2 credential against Entra ID**.

"Non-exportable" turns out to be a claim about extraction, not about use.

He also found that **Entra WebAuthn challenges stay valid for five minutes** and are not bound to session, user or tenant. A challenge can be generated on one system and answered on another. Tokens issued this way lack device ID claims.

No specific Microsoft statement accompanied this finding in the reporting.

## The pattern across all three

| Research | What it defeats | What it does not defeat |
| --- | --- | --- |
| Pass-the-Passkey | The MFA check | The key |
| Pass-ta-key (Golden) | **The key itself** | — |
| Windows Hello | The user-presence requirement | The key's storage |

Two of the three do not break WebAuthn. They break the plumbing around it — logging, challenge binding, process isolation — on a host the attacker already has a foothold on.

That precondition matters and should not be waved away. None of this is a remote phishing attack against a passkey. All of it assumes local presence.

But "assumes local presence" is precisely the scenario passkeys are often deployed to survive. The pitch for phishing-resistant MFA in an enterprise is that credential theft stops being catastrophic. If a compromised session yields a replayable assertion or a usable Hello key, the blast radius of that session is larger than the deployment assumed.

We covered the [Teams vishing campaign that led to Chaos ransomware in under 17 hours](/article/teams-vishing-stac4749-chaos-ransomware) in July. The route to a compromised session is not the hard part any more.

## What to do about it now

- **Take the July Windows updates** if you have not. CVE-2026-34348 is fixed there.
- **Audit who can read the security event log.** The mitigation removed the usable assertions; the underlying "unprivileged users can read a lot" problem is a configuration question.
- **Do not treat synced passkeys and hardware passkeys as the same control.** The Golden Pass-ta-key result applies to the synced kind. For accounts where key recovery would be unrecoverable, that distinction is now load-bearing.
- **Ask your IdP about challenge binding.** Five minutes, unbound to session or tenant, is the detail that makes the Hello result portable across machines.
- **Keep device ID claims in your conditional access policy** — tokens generated through this path lack them, which makes it a detection opportunity rather than only a gap.

None of this makes passwords look better. Passkeys remain the stronger control. The correction is narrower: phishing-resistant is a statement about phishing, and these three results are not phishing.`,
  },
  {
    slug: "mozilla-linux-signing-key-revoked-private-repo",
    title:
      "Mozilla revoked its Linux signing key because someone committed it to a private repo",
    excerpt:
      "No external compromise, no evidence of misuse, and the key still had until March 2027 to run. Mozilla revoked it anyway — which is the right call, and a useful reference point for how a signing-key incident should read.",
    categorySlug: "security",
    tags: [
      "supply-chain",
      "mozilla",
      "code-signing",
      "linux",
      "incident-response",
      "open-source",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1634979149798-e9a118734e93${P}`,
    body: `On **6 August 2026 at 11:14 UTC**, Mozilla generated a revocation for the GPG subkey used to sign Firefox and Thunderbird Linux releases:

\`\`\`
09BE ED63 F346 2A2D FFAB  3B87 5ECB 6497 C1A2 0256
\`\`\`

The reason is one sentence long. An unencrypted copy of the private key was committed by mistake to one of Mozilla's own **private** code repositories.

Not a public repo. Not a leak. A private repository, visible to people who already had legitimate access.

Mozilla revoked it anyway.

## The timeline

| Date | Event |
| --- | --- |
| April 2025 | Subkey announced, expiry set for **March 2027** |
| 6 Aug 2026, 11:14 UTC | Revocation generated |
| 10 Aug 2026 | New key published |

The replacement fingerprint is \`827E 6586 0867 9618 CD34 9F93 678E 455D 7676 7AA3\`, valid until **5 August 2028**.

## What Mozilla found, and what it did anyway

A review of audit records showed **no sign of unauthorised access**. Everyone with visibility into the repository already had legitimate access. Nothing points to anyone outside the company obtaining the key.

That is a fairly comfortable set of findings, and there was a defensible argument for leaving a key with nineteen months of validity in place.

Mozilla revoked it regardless.

This is the correct handling of a signing key and it is worth being explicit about why. A signing key's value is not that it is secret; it is that its secrecy is *provable*. Once an unencrypted copy has existed somewhere it was not supposed to exist, that property is gone. Audit logs can tell you nobody accessed it through the paths you log. They cannot tell you nobody copied it.

"No evidence of compromise" and "evidence of no compromise" are different statements, and only one of them justifies keeping a key.

## What users have to do

| You are | Action |
| --- | --- |
| Checking signatures manually | Import the new key and the revocation certificate |
| On RPM (Fedora, RHEL, openSUSE) | Updates may fail; swap keys manually using Mozilla's commands |
| On APT (Debian, Ubuntu) | **Nothing** — different key infrastructure |

The RPM case is the one that will generate support noise. A failed update on a browser is the kind of thing users work around by disabling verification, which is the worst possible outcome of a well-handled key rotation.

## Why the "private repo" detail is the whole story

The instinct on reading "signing key exposed" is to look for an attacker. There isn't one here, and that is what makes it useful.

Private repositories accumulate secrets because they feel like a safe place to put them. They are access-controlled, they are not indexed, and the people in them are colleagues. Every one of those things is true, and none of them changes the fact that a private repo is a durable, replicated, searchable, backed-up store that outlives the reason the secret was put there.

Git makes this worse in a specific way: a commit is not undone by a later commit. Removing the file leaves it in history. Rewriting history leaves it in every clone that already fetched.

This is the same structural issue behind the [npm dropper that flooded the registry with 846 malicious packages](/article/npm-flooding-dropper-846-malicious-packages) and behind the [U-Boot FIT signature flaws Binarly documented](/article/u-boot-fit-signature-flaws-binarly-2026) — the trust in a software distribution chain rests on a small number of keys, and the failure modes are rarely cryptographic. They are operational.

## The reference point

If you need an internal example of how to handle this, use this one:

1. **Assume the copy is a compromise** even without evidence of access.
2. **Revoke rather than expire.** A key left to run out on schedule is a key you are still asserting is trustworthy.
3. **Publish the revocation certificate**, not just the new key. Consumers need to be able to invalidate the old one, not merely add the new one.
4. **Say what happened in plain terms.** Mozilla's disclosure names the mechanism — committed by mistake, unencrypted, private repo — which is more useful to everyone else than a sentence about an abundance of caution.

Four days from revocation to replacement key, with a public explanation. That is a good number.`,
  },
  {
    slug: "fake-crypto-startup-hired-north-korean-it-workers",
    title:
      "Researchers built a fake crypto startup, hired three suspected North Korean developers, and watched",
    excerpt:
      "Ballena Azul did not exist. The recruitment did. Three developers came through a referral chain, signed contracts, got VM access — and within minutes ran dxdiag and checked which country their connection appeared to come from.",
    categorySlug: "world",
    tags: [
      "north-korea",
      "insider-threat",
      "threat-intelligence",
      "hiring",
      "sanctions",
      "ai",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1702726001096-096efcf640b8${P}`,
    body: `**Ballena Azul** was a DeFi protocol that did not exist. It had a pitch, open developer roles, and a hiring process. It was built by **Mauro Eldritch** of BCA LTD, **Heiner García** of NorthScan, and the malware analysis firm **ANY.RUN**, for the specific purpose of finding out what happens after a North Korean IT worker gets hired.

Three of them did.

## How they arrived

Not through a job board. A recruiter trawling GitHub for facilitators delivered the first developer. **That developer vouched for a friend, who vouched for a third.**

That referral chain is the operationally important detail. The screening pressure a company applies is highest on the first hire and lowest on a referral from someone already inside. The chain exploits a bias every hiring process has.

All three went through the standard sequence — interview, contract, VM access — and all three were placed before anything looked wrong.

## The first ten minutes

Once they had access, the reconnaissance was immediate and unsubtle:

\`\`\`
dxdiag
systeminfo
wmic
\`\`\`

Machine profiling. Then a check on **what country their connection appeared to originate from** — verifying their own cover rather than probing the target.

One operative installed **Chrome Remote Desktop** and synced his personal Google account to the sandbox. That handed the researchers his browsing history, his saved passwords and his installed extensions. He also logged into GitHub on company infrastructure.

This is the kind of mistake that only shows up when someone is running many identities at once and the operational discipline thins out.

## What was in the browser

The extension list is the part with the widest implications:

- **AIApply**
- **Final Round AI**
- **Simplify Copilot**
- A saved-prompts tool for ChatGPT

These are commercial job-application and interview-assistance products. They are not malware and they are not North Korean tooling. They are the same extensions used by ordinary candidates trying to get through the same funnel — which is exactly why they defeat the interview stage. The tell that used to work (a candidate who cannot answer follow-ups in real time) has been productised away for everybody.

Identity documents showed a second AI signal. Image metadata indicated processing with **Google Gemini**, and the researchers reported a **SynthID watermark** on the imagery.

Infrastructure ran through **Vultr**, **Gorilla Servers** and **AstrillVPN** exit nodes.

## The detection signals that held up

| Signal | Why it works |
| --- | --- |
| Inconsistent location across identity documents | Hard to keep straight across many personas |
| AI-edited photographs with metadata traces | SynthID and Gemini metadata survive casual handling |
| Browser fingerprinting to verify connection origin | Legitimate candidates do not check what country they appear to be in |
| Machine-translation cadence in profile text | Consistent across the set |
| Multiple logins from different geographies in a short window | Operational, not behavioural — and logged |

The last row is the one a company can actually act on, because it does not require a human to notice anything during an interview.

## On the attribution

The researchers attribute the three to suspected **Famous Chollima** operatives — CrowdStrike's naming, placed under the broader Lazarus umbrella.

As of **11 August 2026**, no government source had confirmed that identification. We are repeating the researchers' assessment as an assessment.

For scale, a separate 2024 Justice Department case sentenced two US facilitators over a scheme that placed workers at **more than 100 US companies** using at least **80 stolen identities**, earning North Korea **over $5 million**. No salary figures were published for the Ballena Azul three.

## What a hiring team should change

The temptation is to treat this as an intelligence story. It is a **hiring process** story, and the fixes sit with people who do not read threat intel.

- **Referrals are not a trust signal from a new hire.** A referral from someone who has been there three weeks is a referral from a stranger.
- **Instrument the first session, not the interview.** \`dxdiag\` and \`systeminfo\` inside ten minutes of first access is a detection you can write today. Interview-stage detection is losing to commercial AI tooling and will keep losing.
- **Block personal account sync on company machines.** The Chrome Remote Desktop mistake is what unravelled one of these operatives. It should not have been possible.
- **Check document metadata.** SynthID and generator metadata are cheap to look for and were present here.
- **Correlate login geography across the first month.** Fully remote hiring removed the physical check; nothing replaced it.

The uncomfortable framing: this operation succeeded at the hiring stage against researchers who were *specifically expecting it*. A company that is not expecting it is not running a harder gate.`,
  },
];

const payload = await getPayload({ config });

for (const draft of DRAFTS) {
  const { docs: clash } = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
  });

  if (clash.length > 0) {
    console.log(`skip (exists): ${draft.slug}`);
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
