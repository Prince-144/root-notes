/**
 * Long-form drafts — 12 August 2026.
 *
 * Same rules as the previous batches: primary reporting, figures carried
 * across verbatim, covers checked for a 200 and against every cover in use.
 * Bare "<" before a digit is escaped — MDX reads it as a JSX tag and takes the
 * whole page down with it.
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
    slug: "openai-gpt-5-6-cyber-daybreak-red-reduced-refusals",
    title:
      "OpenAI shipped a model that refuses 95% less on exploit development — and gated it behind an application",
    excerpt:
      "GPT-5.6-Cyber completes 95.0% of requests on OpenAI's advanced cybersecurity evaluation, against 1.5% for the base model. It is not on the API. You apply to Daybreak Red, and someone decides.",
    categorySlug: "ai",
    tags: [
      "openai",
      "ai-security",
      "offensive-security",
      "llm",
      "vulnerability-research",
      "ai-policy",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1753513291124-4f615bf1f6de${P}`,
    body: `On **10 August 2026** OpenAI released **GPT-5.6-Cyber**, a cybersecurity model built on GPT-5.6 Sol, trained to be better at finding zero-days and building exploit chains — and trained to refuse fewer of the requests that work requires.

The headline number is the refusal rate.

| Model | Advanced Cybersecurity Completion Rate |
| --- | --- |
| GPT-5.6 Sol | **1.5%** |
| **GPT-5.6-Cyber** | **95.0%** |

That is OpenAI's own internal evaluation, and it measures how often the model completes a request rather than declining it. A jump from 1.5% to 95% is not a capability improvement with a safety side-effect. It is the point of the release.

OpenAI researcher **Eric Wallace** described it as the company's first large-scale attempt at directly improving capabilities for advanced cybersecurity tasks such as exploit development.

## What it has already found

The claims attached to the launch are specific about impact and deliberately vague about targets:

- At least **five vulnerabilities** in an unnamed popular mobile operating system
- **Three critical vulnerabilities** in an unnamed popular database
- More than **400 vulnerabilities** capable of producing privilege escalation in a popular operating-system kernel

The third figure is the one that should make you sit up. Four hundred privilege-escalation bugs in one kernel is not a research result. It is a throughput result — it says the cost of finding this class of bug has changed.

The anonymisation is standard disclosure hygiene, and it also means none of it is independently checkable yet.

## The gate is the actual policy

GPT-5.6-Cyber is **not** available to ChatGPT or API customers. Access runs through **Daybreak Red**, a new tier of OpenAI's Daybreak cybersecurity programme, and organisations have to be accepted into it — with verification routed through trusted partners including Accenture, Cisco and Palo Alto Networks.

This is worth naming plainly, because it is the whole safety argument. The model's guardrails have been substantially removed. What replaces them is **an admissions process**.

That is a defensible design. It is also a different kind of control from the one the industry has spent three years building. Refusals are a property of the model and apply to everyone equally. An access tier is a property of a contract, and it works exactly as well as the vetting behind it — no better.

## Why this is not the same as the misuse reports

We have covered a run of stories about attackers using AI: [DeepSeek-agent-driven proxyjacking](/article/deepseek-agent-autonomous-attack-jesta-proxyjacking), and this week Kimsuky assembling a local model stack on its own infrastructure. Those are stories about capability leaking out.

This is the opposite shape. A frontier lab has decided the defensive value of a low-refusal offensive-security model outweighs the risk, and has built a gate rather than a guardrail.

Whether that is right depends entirely on a question the announcement cannot answer: does the defender's advantage from 400 kernel bugs found early exceed the attacker's advantage if the same capability reaches them? Vulnerability discovery is symmetric. The patch pipeline is not.

There is also a quieter problem, and it is already here. Security teams are dealing with [AI-generated vulnerability reports that nobody has proved](/article/ai-safety-evaluations-sandbox-escapes-pattern) — findings that look rigorous and cost real triage hours. A model tuned to complete 95% of exploit-development requests will produce more output, not more verified output.

## What to watch

- **Who gets into Daybreak Red.** The vetting is the control. If the tier grows quickly, the control weakens quickly.
- **Whether the anonymised findings get confirmed.** Five mobile OS bugs and 400 kernel escalations should surface as advisories eventually. If they do not, the numbers stay marketing.
- **Whether competitors follow.** The first lab to ship a low-refusal offensive model changes what the others can decline to ship.
- **Triage load.** If your team already fields AI-assisted reports, expect volume and expect a lower proportion of them to be real.

The honest summary: this is a considered bet, not a slip. OpenAI has traded a model-level control for an organisational one, in the open, with the numbers published. The bet is that the people they let in are the people they think they are letting in.`,
  },
  {
    slug: "litellm-poisoned-releases-cloudsek-2500-organisations",
    title:
      "The LiteLLM packages were live for 40 minutes — the credentials they took are still being counted",
    excerpt:
      "Two poisoned releases in March, published with a token stolen in the Trivy breach and kept alive by an incomplete rotation. CloudSEK's dataset of 434,000 captured files now maps possible exposure across 2,500+ organisations.",
    categorySlug: "ai",
    tags: [
      "supply-chain",
      "pypi",
      "credentials",
      "ai-tooling",
      "ci-cd",
      "threat-intelligence",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1515879218367-8466d910aaa4${P}`,
    body: `**LiteLLM 1.82.7 and 1.82.8** were on PyPI on **24 March 2026** from **10:39 UTC**, for about **40 minutes**, before they were pulled. The project advises treating any install up to **16:00 UTC** that day as potentially compromised.

Forty minutes. That is the whole exposure window, and it is more than enough, because the packages were not waiting for anyone to run them.

## The payload ran before your code did

The releases shipped a file named \`litellm_init.pth\`. A \`.pth\` file in site-packages executes **at Python interpreter startup** — not on import of the package, not on any call into it. Installing it and then running anything at all in that environment was sufficient.

What it collected:

- Environment variables, including \`OPENAI_API_KEY\` and \`ANTHROPIC_API_KEY\`
- SSH keys
- Cloud credentials
- Kubernetes tokens
- Database passwords

Encrypted, then sent to \`models.litellm[.]cloud\` — a domain chosen to survive a glance at egress logs.

## How the attacker still had the token

This is part of the **TeamPCP** campaign, tracked by Google as **UNC6780**, and the chain back is the useful part.

| When | What |
| --- | --- |
| **19 March 2026** | Trivy scanner compromised |
| — | Credentials rotated — **incompletely** |
| **24 March 2026** | A surviving PyPI publishing token is used to push poisoned LiteLLM releases |

The attacker did not compromise LiteLLM. They compromised something else, kept a credential through the cleanup, and used it a week later against a different project.

That is the failure mode worth carrying out of this. An incomplete rotation is not a partial fix; it is no fix, on a delay. We made the same point about [Mozilla revoking a signing key with no evidence of misuse](/article/mozilla-linux-signing-key-revoked-private-repo) — once a credential's secrecy is unprovable, the only safe assumption is that it is gone.

**CVE-2026-33634** was assigned and added to **CISA's KEV catalog on 26 March 2026**.

## The number everyone is quoting, and what it means

**CloudSEK** obtained roughly **434,000 captured files** from the campaign and published a searchable dataset mapping possible exposure across **more than 2,500 organisations** — names including NVIDIA, Cisco, Deloitte, Volkswagen, FedEx, Siemens and X Corp.

Read that carefully, because the framing matters and most coverage drops it.

This is **captured loot and log files**, not confirmed victim accounts. The 434,000 figure counts **individual exfiltration events**, not unique pipelines — one badly-configured CI job running hourly contributes hundreds of them.

CloudSEK's method: two independent checks, CI identity variables and a separate ownership derivation from the captured logs. Where they disagree, the report is withheld, and the lower confidence level sets the final classification.

That is more rigour than most exposure datasets carry, and it still does not convert "your name is in the data" into "you were breached."

## Where it is confirmed

Three organisations have said something concrete:

- **Checkmarx** — unauthorised GitHub repository access, enabling malicious artifact publication
- **Mercor** — contained unauthorised activity after exposure to the poisoned versions
- **CERT-EU** — assessed with **high confidence** that a European Commission AWS account was compromised, with roughly **91.7 GB** of compressed data exfiltrated

The CERT-EU figure is the one that establishes this was not a smash-and-grab of a few API keys.

## The FBI's point about timing

Advisory **FLASH-20260702-01** warns that credentials harvested in this campaign will likely be weaponised **long after** the initial compromise, and recommends rotating CI/CD secrets and cloud credentials.

That is the reason this is a story in August about something that happened in March. Stolen credentials do not expire on a news cycle. An organisation that checked its logs in March, found nothing, and moved on is exactly the organisation this advisory is addressed to.

## What to do

- **Rotate CI/CD and cloud credentials** if you installed LiteLLM on 24 March, even if you saw no follow-on activity. Especially then.
- **Search for \`models.litellm[.]cloud\`** in DNS and proxy logs going back to March.
- **Audit \`.pth\` files in your site-packages.** Most environments have a handful and you should be able to account for every one.
- **Check whether your March rotation was complete.** Publishing tokens, deploy keys and machine accounts are the ones that get missed, because no human notices them failing.
- **Treat the CloudSEK dataset as a prompt, not a verdict.** Your name appearing there means look; it does not mean you were breached.

The structural lesson is the one behind every entry in this category, from [the npm dropper that flooded the registry](/article/npm-flooding-dropper-846-malicious-packages) to [CI secrets reachable from coding agents](/article/claude-code-gemini-cli-ci-secrets-novee-black-hat): the blast radius of a package is the blast radius of the environment it installs into, and for AI tooling that environment holds every key you own.`,
  },
  {
    slug: "microsoft-august-2026-patch-tuesday-398-afd-zero-day",
    title:
      "Four hundred-odd fixes, four unauthenticated RCEs at 9.8 — and the one being exploited scores 7.0",
    excerpt:
      "Three outlets counted this Patch Tuesday three different ways, which tells you how little the total matters. CVE-2026-68820 in afd.sys is a use-after-free rated 7.0, Check Point ties it to Lazarus, and the chain starts with a fake job offer.",
    categorySlug: "security",
    tags: [
      "microsoft",
      "patch-tuesday",
      "zero-day",
      "windows",
      "privilege-escalation",
      "vulnerabilities",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1785682117028-6fcf2c0b515b${P}`,
    body: `August 2026 is the largest Patch Tuesday on record, and nobody agrees on how large.

| Outlet | CVEs reported |
| --- | --- |
| The Hacker News | 398 |
| BleepingComputer | 400 |
| SecurityWeek | **421** |

None of them publishes a counting method. The gap is presumably third-party CVEs — SecurityWeek notes two non-Microsoft entries in TPM 2.0 alone — plus republished Chromium advisories and Mariner packages, which some counts fold in and others do not.

We are flagging it rather than picking one, because the number is the least useful thing in the release. Whichever figure is right, no organisation patches four hundred things this week, and the order you do them in is what changes your risk.

## The one under attack

**CVE-2026-68820** — a use-after-free in **afd.sys**, the Ancillary Function Driver for WinSock, which is the kernel-side component behind Windows networking.

| | |
| --- | --- |
| CVSS | **7.0** |
| Requires | Code already running on the machine |
| Gives | **SYSTEM** |

Microsoft's description: a locally authenticated attacker runs a crafted application to trigger a race condition, and successful exploitation yields SYSTEM.

**Check Point** discovered and reported it, and attributes the exploitation to **Lazarus**. Microsoft has made no official attribution of its own.

A 7.0 that is being used beats a 9.8 that is not, and this is the clearest example of that you will see this year. The score is low because the flaw needs a foothold first — which is a statement about the vulnerability, not about the campaign.

## How the foothold arrives

Check Point's chain is worth reading in full, because it explains why "requires local access" is not the mitigation it sounds like:

1. **Fake recruiter outreach** on professional platforms
2. A malicious archive containing a PDF viewer, a malicious DLL and an encrypted payload
3. **DLL sideloading** executes the **Mistpen** downloader in memory
4. Reconnaissance and persistence
5. **CVE-2026-68820** for privilege escalation
6. **ForestTiger** backdoor deployed

An alternative chain uses a trojanised "SecurityPDF" viewer to deploy **Troy**, a new DLL implant supporting **17 operator commands** including file operations and shell access. Infrastructure runs through compromised Roundcube webmail and CMS platforms hosting **RelayShell**, a relay between infected endpoints and the operator.

Targets: **defence, aerospace and aviation** in **France, Germany, Brazil and India**. Active since early 2026.

Step one is a job offer. Every organisation is one convincing recruiter away from step five, and this month step five works on a fully patched machine.

Priority one is this patch, on any Windows estate where a foothold is plausible. That is all of them.

## The four that need no foothold at all

Four unauthenticated RCEs at **CVSS 9.8** — no authentication, no user interaction, no prior access:

| CVE | Component | Note |
| --- | --- | --- |
| **CVE-2026-62878** | Windows DNS Server | Stack-based buffer overflow; ZDI labels it **wormable** |
| **CVE-2026-62893** | Windows Deployment Services | Exploitable through TFTP handling |
| **CVE-2026-62815** | Microsoft QUIC | RCE, no interaction |
| CVE-2026-59124 | HPC Pack | Rated Important; not installed by default; exploitation "more likely" |

"Wormable" on a DNS server is the phrase to stop at. Windows DNS Server is usually a domain controller, and a domain controller is usually reachable from everything. If you run one exposed in any form, CVE-2026-62878 is not a monthly-cycle item.

The other three are narrower by deployment: WDS and HPC Pack exist in specific estates, and Microsoft QUIC's exposure depends on what is listening.

## The SharePoint chain closes

This one spans two months, which is easy to mishandle:

- **CVE-2026-55040** (July) — critical authentication bypass, **CVSS 9.1**, allowing user impersonation
- **CVE-2026-63520** (August) — the RCE component

Chained, they produced **unauthenticated remote code execution** on SharePoint. Patching the July authentication bypass breaks the demonstrated chain.

If you deferred July's SharePoint update and are now applying August's, you have half a fix. On-premises SharePoint farms need both.

## Reading a 398-CVE month

A release this size cannot be triaged by severity alone — there are 62 Criticals and no organisation patches 62 things this week. The order that actually reduces risk:

1. **CVE-2026-68820** — exploited, and the precondition is one you should assume
2. **Exposed DNS, WDS, QUIC and HPC services** — unauthenticated, and the DNS one is wormable
3. **On-premises SharePoint** — both July and August, or neither counts

Everything else follows your normal cycle.

The pattern is the same one behind [the Kemp LoadMaster flaw that reached KEV](/article/kemp-loadmaster-cve-2026-8037-escape-quotes-kev): the CVSS number describes the vulnerability in isolation, and the thing you are defending against is a campaign. Lazarus does not care that afd.sys scores 7.0. They care that it works after the phishing email lands, and this month it does.`,
  },
  {
    slug: "deadlock-ransomware-polygon-smart-contracts-session",
    title:
      "DeadLock put its leak site on a blockchain — 96 victims and no server to seize",
    excerpt:
      "Microsoft's analysis describes two Polygon wallet addresses holding proxy URLs and leak-blog posts, with negotiation over Session. There is no hosting provider to serve, because there is no hosting.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "blockchain",
      "microsoft",
      "threat-intelligence",
      "law-enforcement",
      "extortion",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1782338937062-2c8849f5ad27${P}`,
    body: `**Microsoft Threat Intelligence** published its analysis of **DeadLock** on **10 August 2026**, following earlier work by Singapore-based **Group-IB** in January. The ransomware itself is conventional: Rust, double extortion, first seen **July 2025**, **96 claimed victims** as of August 2026 across Italy, Spain, Poland, Türkiye and the US.

The infrastructure is not conventional, and that is the story.

## Two wallets doing the job of two servers

DeadLock stores operational data in **two Polygon wallet addresses**:

- One holds **proxy server URLs** for routing communications
- The other hosts the **data leak blog posts**

Microsoft's assessment:

> This architecture likely increases resilience of portions of its communication, leak-hosting, and negotiation infrastructure, allowing DeadLock operators to recover from some disruption efforts.

Note the hedging — "portions of", "some disruption efforts". Microsoft is not claiming this is untouchable, and neither should anyone else.

But consider what a takedown normally consists of. Law enforcement identifies the hosting provider, serves process, seizes the server, and puts a splash page on the domain. Every step of that assumes a server and a provider.

A wallet address on a public chain has neither. The data is replicated across every node, readable by anyone, and there is no operator to serve.

## Negotiation moved too

Ransom notes direct victims to **Session**, a privacy-focused messenger, as the primary contact channel. An HTML recovery file provides an alternative interface with **end-to-end encrypted chat, a paginated data leak blog, and a file browser** — none of which requires a traditional backend.

That last detail is the one to sit with. The victim-facing "portal" that ransomware crews normally host is now a file, running locally, reading from the chain.

## What this actually changes, and what it does not

**Changed:** the leak site and the proxy list are durable. The blog cannot be seized. The proxy list regenerates with infinite variants, so blocking known proxies is a treadmill.

**Not changed:** the encryption, the intrusion, the initial access. DeadLock still has to get in, and it gets in the same way everyone else does. Nothing about Polygon helps with that.

**Also not changed:** the money. Payments still move through channels that can be traced and, occasionally, frozen. Publishing your leak blog on a public ledger is resilient and it is also, permanently, public — every post timestamped and attributable to an address.

The timeline has a gap worth noting. Group-IB observed the first public victim discoveries in **late May 2026**, and the group has been active since **July 2025**. Roughly ten months of attacks preceded the first victims becoming visible. A leak site is a marketing channel; its absence does not mean the attacks were not happening.

## What defenders should take from it

- **Do not plan around takedowns.** They were never a control you owned, and for this group they are less likely than usual.
- **The intrusion is still the place to spend.** [The July ransomware wave](/article/ransomware-surge-july-2026-qilin) came in through unpatched edge devices and phishing, and so does this.
- **Watch for Session as an IoC.** A Session client appearing on a corporate endpoint is worth a question.
- **Expect the victim count to be understated.** Ten months of activity before public victims appeared means the leak blog is a partial record by design.

The strategic read: ransomware operators have spent five years hardening against disruption, and this is what the current step looks like. It is incremental — the crews still need initial access, still need to encrypt, still need to get paid. What they no longer need is a hosting provider willing to look away.`,
  },
  {
    slug: "sandworm-uac-0145-fake-interviews-sopravpn-cert-ua",
    title:
      "A GRU subgroup is running fake job interviews to get IT staff to install a VPN that takes commands",
    excerpt:
      "CERT-UA describes UAC-0145 posing as recruiters for a real consulting firm, running Zoom interviews, then handing over a WireGuard config that fails on purpose — so the candidate downloads 'SopraVPN' instead.",
    categorySlug: "world",
    tags: [
      "sandworm",
      "russia",
      "ukraine",
      "social-engineering",
      "apt",
      "malware",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1607799279861-4dd421887fb3${P}`,
    body: `**CERT-UA** has disclosed a campaign by **UAC-0145**, a subgroup of **Sandworm** — the GRU-affiliated actor also tracked as APT44, Seashell Blizzard and UAC-0002. It has been running since **May 2026**, and it targets Ukrainian system administrators and IT specialists through their job search.

## The funnel

1. **Job boards.** Attackers pose as recruiters and contact sysadmins and IT specialists.
2. **Telegram.** The conversation moves off the job site early.
3. **A fake HR manager** from **Sopra Steria Bulgaria** — a real European consulting firm — runs a preliminary interview.
4. **A Zoom call** follows.
5. **Technical interview instructions** arrive by email, containing **WireGuard VPN configuration files**.
6. **The connection fails.** The attacker helpfully suggests downloading **"SopraVPN"** from SourceForge links dressed up to look like the company's site.

Step six is the design. A configuration file that simply worked would end the interaction; one that fails creates a support moment, and a support moment is when a technical person will install a binary someone else recommended.

CERT-UA is careful about the video call:

> it's unclear whether the person showing up in the interview was a genuine participant or a synthetic persona generated using artificial intelligence

That uncertainty is now a permanent feature of this threat model. "I saw them on video" has stopped being evidence.

## What SopraVPN is

A trojanised WireGuard client — modified genuine code, not a lookalike wrapper.

CERT-UA's description of the mechanism:

> support for the non-standard 'SymmetricKey' option has been added to the configuration processing mechanism; its value contains BASE64-encoded data for AES-256-GCM

So the command channel is a **configuration option**. The VPN reads its config, finds a field the real WireGuard does not have, decrypts it, and executes.

That is a deliberate choice against detection. The binary is mostly real WireGuard and will behave like it. The malicious instruction arrives as data in a config file, which is the least suspicious artifact on a machine belonging to someone who was just asked to set up a VPN.

**Windows** builds create scheduled tasks that download secondary payloads. **Linux** builds use cURL.

## Why IT staff specifically

The target set is the point. A system administrator is not a lucrative victim in themselves — they are a route. Their machine holds credentials, jump-host access, infrastructure documentation and, often, a VPN into somewhere that matters.

Recruitment is also the one context where sending a technical person an unusual file is completely normal. A take-home task, a test environment, a VPN config for the "internal" interview — none of it looks wrong.

The hiring pipeline is a trusted channel that no security team monitors, and it is being worked from both ends this year — North Korean operatives applying for real jobs, and now a GRU subgroup offering fake ones. In both directions the recruitment process is the attack surface, and in both directions it sits outside anything the security team owns.

## What to actually do

- **Tell your admins that a technical interview is a phishing surface.** Not as a policy line — as a specific scenario, with the failed-VPN-then-download step named.
- **Any VPN client should come from your own software distribution**, not from a link a recruiter sent, even a SourceForge one.
- **Treat "the config didn't work, try this instead" as the signature.** The failure is the hook, and it is the most recognisable moment in the chain.
- **Watch for scheduled tasks created shortly after a new VPN install** on Windows, and unexpected cURL activity on Linux.
- **Stop treating a video call as identity verification.** CERT-UA cannot say whether the interviewer was a person.

The scope CERT-UA describes is Ukrainian IT professionals since May 2026. The technique has nothing Ukraine-specific in it.`,
  },
  {
    slug: "kimwolf-v7-android-botnet-http2-browser-fingerprints",
    title:
      "This botnet's DDoS traffic looks like Chrome because it builds a complete browser fingerprint",
    excerpt:
      "Unit 42's analysis of Kimwolf v7 describes HTTP/2 floods that mirror real browser behaviour at the protocol and header level. It runs on Android TV boxes with port 5555 open, and resolves its C2 through Ethereum Name Service.",
    categorySlug: "gadgets",
    tags: [
      "android",
      "iot",
      "botnet",
      "ddos",
      "malware",
      "consumer-devices",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1783683783819-e6cb806bba69${P}`,
    body: `**Unit 42** researchers **Asher Davila**, **Chris Navarrete** and **Doel Santos** identified **Kimwolf v7** in **February 2026**. Kimwolf has been running since mid-2024 on Android and IoT devices; its Linux counterpart is tracked as **AISURU**.

The v7 change that matters is how the attack traffic looks.

## Floods that pass as browsing

Kimwolf uses the **nghttp2** library to run HTTP/2 flood attacks, and constructs **complete browser fingerprints** — mirroring legitimate browser behaviour at the protocol and header level.

That is a direct attack on how volumetric DDoS is filtered. Mitigation at the application layer works by finding the ways automated traffic differs from a browser: header order, HTTP/2 settings frames, window sizes, the shape of the connection. Get all of those right and the request is, to a filter, a person visiting the site.

The defence that remains is behavioural and volumetric rather than signature-based — rate, distribution, and what the traffic asks for. Those are slower and noisier than fingerprint matching, which is exactly the trade the malware is trying to force.

## The devices are Android TV boxes with a debug port open

Infection comes through **exposed Android Debug Bridge ports (5555)** on local networks. The botnet then distributes APK packages posing as **"SystemService"**, which probe for root and execute embedded ELF payloads.

ADB on 5555 is a developer feature. It ships enabled on a long tail of cheap Android TV boxes, and the people who own those boxes are not reading advisories.

That is the same structural problem behind [the SIM interface that lets a card run commands on a modem](/article/malicious-sim-run-at-modem-code-execution) and behind [the water systems reached through cellular modems with no exploit at all](/article/minnesota-water-plc-attacks-no-exploit-needed): the vulnerable population is devices nobody administers, with a service enabled by default, on a network nobody segments.

## v7's infrastructure

- **Ethereum Name Service (ENS)** for command-and-control resolution
- A hard-coded **Tor .onion** address
- Traffic routed through a **localhost proxy at 127.0.0.1:23075**

ENS is the notable one. Resolving C2 through a blockchain naming system removes the registrar and the DNS takedown from the disruption playbook, the same way DeadLock's use of Polygon removes the hosting provider. Two unrelated crews reaching for the same property in the same month is a trend rather than a coincidence.

The command set was also **consolidated from 43 text-named methods to 15 numbered commands**, including UDP floods optimised for ARM. That is a maintenance decision — smaller protocol, less to fingerprint, less to break.

## What to do

Unit 42's mitigation is short and, for once, entirely actionable by an ordinary IT team:

- **Segment Android TV boxes off enterprise networks.** Meeting-room streaming devices, digital signage and lobby TVs are the ones sitting on corporate VLANs today.
- **Disable ADB, or restrict it to USB only.** Network ADB has no legitimate use on a deployed device.
- **Block 5555 inbound at the network edge and between VLANs.**

For anyone defending a website rather than a fleet, the practical takeaway is different: if your DDoS mitigation depends on distinguishing bots by their fingerprint, this class of traffic is designed to defeat it. Rate limiting per source, request-cost analysis and challenge flows do not care how convincing the headers are.`,
  },
  {
    slug: "vmware-vcenter-cve-2026-59310-exploited-reverse-ssh",
    title:
      "361 vCenter servers were compromised five days after the patch went public",
    excerpt:
      "QUIRSO traced exploitation of CVE-2026-59310 across 47 countries, with victims first contacting attacker infrastructure on 3 August. The persistence mechanism is a cron job running an open-source reverse SSH tool.",
    categorySlug: "security",
    tags: [
      "vmware",
      "exploitation",
      "patching",
      "apt",
      "incident-response",
      "vulnerabilities",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1506399309177-3b43e99fead2${P}`,
    body: `**CVE-2026-59310** is a directory-traversal flaw in **Broadcom VMware vCenter**, **CVSS 9.8**, allowing a network-accessible attacker to execute arbitrary code. Broadcom patched it in **late July 2026**.

German security firm **QUIRSO** found it being exploited during an incident response engagement, and then went looking for the scale of it.

## The numbers

| | |
| --- | --- |
| Unique victim IPs | **~361** |
| Countries | **47** |
| Concentrated in | Germany, US, Turkey, Iran, France |
| First contact with attacker domains | **3 August 2026** |

That last row is the one to hold onto. Public disclosure was in late July. Compromised systems started calling home on **3 August** — **five days later**.

QUIRSO's read:

> the strong correlation between the time of disclosure and exploitation suggests the disclosure as the initial starting point

Which is to say: the attacker did not have this before the advisory. They read the advisory, built the exploit, and were landing on hosts inside a working week.

The firm believes the activity is attributable to an APT actor, while stating that is unconfirmed.

## The persistence is deliberately boring

The chain is path traversal, then a **malicious cron job** running **reverse_ssh** — an open-source tool that establishes an SSH connection outward to attacker infrastructure.

Reverse SSH is chosen because it inverts the direction of the connection. Perimeter controls are built to inspect what comes in; a host that dials out on a protocol it legitimately uses passes most of them.

QUIRSO adds a caution that deserves repeating:

> The presence of reverse_ssh should not, by itself, be treated as proof of malicious activity

It is a legitimate administration tool. Finding it means investigate, not conclude — a distinction that gets lost when an IoC list travels without its context.

## A second vCenter flaw is being scanned for

**Defused Cyber** separately reported increased scanning against **CVE-2026-59309** (**CVSS 9.8**), an authentication bypass in **vmdir**.

Two 9.8s in the same product in the same window, one confirmed exploited and one being scanned, means vCenter is having the kind of month that ends with a KEV entry and a mandatory-patch directive.

## Why five days is the real finding

The disclosure-to-exploitation interval is the number that should change behaviour. A patch cycle built around monthly maintenance windows assumes attackers need weeks. Here they needed five days, on a management plane.

And vCenter is a management plane. It is not a workload; it is the thing that controls the workloads, holds credentials to them, and can create, clone or destroy them. Compromising vCenter is closer to compromising a domain controller than to compromising a server.

We have made this point about [the Cisco FMC zero-day](/article/cisco-fmc-zero-day-cve-2026-20316) and about [Kemp LoadMaster reaching CISA's KEV catalogue](/article/kemp-loadmaster-cve-2026-8037-escape-quotes-kev), and the shape does not change: internet-reachable management interfaces get exploited fast, because the payoff justifies the effort.

## What to do

- **Patch CVE-2026-59310 now** if you have not. Late July's release; check the build number rather than assuming.
- **Check for cron jobs on vCenter appliances.** You should be able to account for every entry. Anything invoking an SSH client outward is worth an investigation.
- **Hunt outbound SSH from vCenter to anything that is not yours.** This is the highest-value single detection here.
- **Check whether vCenter is reachable from the internet at all.** For most estates the honest answer is that it should not be, and the reason it is dates to a migration nobody revisited.
- **Track CVE-2026-59309 too.** Scanning is the stage before exploitation, not a separate event.`,
  },
];

/**
 * Pass --update to rewrite drafts that already exist. Without it an existing
 * slug is left alone, so re-running after adding one entry is safe. Published
 * articles are never touched either way — a correction to something live is a
 * deliberate act, not a side effect of re-running a draft script.
 */
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
    if (!UPDATE) {
      console.log(`skip (exists): ${draft.slug}`);
      continue;
    }
    if (existing.status === "published") {
      console.log(`skip (published): ${draft.slug}`);
      continue;
    }
    await payload.update({
      collection: "articles",
      id: existing.id,
      data: { ...draft },
    });
    console.log(
      `updated: ${draft.slug} (${draft.body.split(/\s+/).length} words)`,
    );
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
