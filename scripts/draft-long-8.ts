/**
 * Long-form drafts — second batch for the week of 10–11 August 2026.
 *
 * Same rules as draft-long-7: primary reporting only, figures carried across
 * verbatim, covers checked for a 200 and against every cover already in use.
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
    slug: "metabase-zero-day-ghsa-cvss-10-no-cve",
    title:
      "A CVSS 10 exploited in the wild, with no CVE — Metabase found it when its own cloud was breached",
    excerpt:
      "Unauthenticated SQL injection through the password-reset endpoint, every release from 1.58 onward affected, and confirmed victims already naming what was taken. It is tracked as a GitHub advisory, which means NVD-driven scanners will not see it.",
    categorySlug: "security",
    tags: [
      "zero-day",
      "sql-injection",
      "vulnerabilities",
      "data-breach",
      "patching",
      "open-source",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1763718528755-4bca23f82ac3${P}`,
    body: `**Metabase** — the open-source BI tool that sits in front of production databases at a very large number of companies — disclosed a zero-day rated **CVSS 10.0**, exploited in the wild before anyone knew it existed.

The company found it the direct way. Its own cloud infrastructure was compromised on **3 August**. The patch shipped within hours and Metabase Cloud customers were secured automatically.

Everyone self-hosting had to find out and act themselves.

## The flaw

Unauthenticated SQL injection into Metabase's **application database**, via:

\`\`\`
POST /api/session/reset_password
\`\`\`

No credentials required. Send crafted input to the password-reset endpoint and you are writing SQL into the database that holds Metabase's own configuration — which includes the stored credentials for every database Metabase connects to.

From there: administrator access, configuration changes, credential theft for connected databases, and read or export of anything those connections reach.

The tool's entire value proposition is that it has privileged access to your data. That is also the impact statement.

## The identifier problem

| | |
| --- | --- |
| Advisory | **GHSA-vwf4-m7j8-wcjf** |
| CVSS | **10.0** |
| CVE | **None assigned** |

This is the detail worth carrying out of the story. A vulnerability with no CVE does not enter the NVD feed, and a scanner built on NVD data has nothing to match against. An organisation running vulnerability management entirely off CVE identifiers had a CVSS 10 with active exploitation in its estate and a clean dashboard.

We made a version of this point about [the Kemp LoadMaster flaw that reached CISA's KEV catalogue](/article/kemp-loadmaster-cve-2026-8037-escape-quotes-kev): the identifier is a routing mechanism, not the vulnerability. When the routing fails, the vulnerability does not care.

## Affected and fixed versions

Every release from **1.58** onward, across branches 0.58 through 0.63.

| Affected range | Fixed in |
| --- | --- |
| ≥1.58.0, <1.58.23 | **1.58.24** |
| ≥1.59.0, <1.59.20 | **1.59.21** |
| ≥1.60.0, <1.60.16 | **1.60.17** |
| ≥1.61.0, <1.61.10 | **1.61.11** |
| ≥1.62.0, <1.62.8 | **1.62.9** |
| ≥1.63.0, <1.63.3 | **1.63.5** |

## How to check whether you were hit

Metabase published a concrete indicator pair, which is more useful than most advisories manage:

1. A call to \`POST /api/session/reset_password\` returning **400**
2. Followed by \`GET /api/user/current\` returning **200**

The 400 is the injection landing. The 200 immediately after is a session that should not exist. If both appear in sequence in your access logs, treat the instance as compromised rather than patched.

## The victims are already named

This is not a theoretical severity rating. Three organisations had disclosed by publication:

- **Framework** — customer names, IP addresses, physical addresses, phone numbers and emails accessed
- **n8n** — **136 customer records**, of which **5 contained bcrypt-hashed passwords**
- **Kilo Code** — Slack access tokens exposed through a Slackbot integration

The Kilo Code case is the instructive one. The exposure was not Metabase data. It was a *token for a different system* that happened to be reachable from the Metabase environment. That is the blast radius of a BI tool: everything it was ever pointed at.

## What to do

- **Patch to the fixed release for your branch.** Not the latest version — the fixed release on your branch, from the table above.
- **Grep for the indicator pair.** A 400 on reset_password followed by a 200 on user/current is the signature.
- **Rotate every database credential Metabase held**, not just the ones you think were touched. The application database stores them; the injection reached the application database.
- **Rotate connected-service tokens too.** The Kilo Code case shows those go with it.
- **Fix your scanner's assumptions.** If your vulnerability management only ingests CVE identifiers, this one was invisible. GHSA advisories, vendor bulletins and KEV are separate feeds and need separate ingestion.

The single most repeatable lesson: the tool with read access to everything is not a reporting tool from a risk perspective. It is a credential store with a chart library attached.`,
  },
  {
    slug: "atlassian-rovo-prompt-injection-rovoblast-promptarmor",
    title:
      "Two teams found two ways to make Atlassian's Rovo leak Jira and Confluence data",
    excerpt:
      "Varonis got it with a URL parameter that pre-fills the chat — patched, $6,000 bounty. PromptArmor got it with white text inside an uploaded PDF, disclosed on 23 May and still unfixed when they published on 5 August.",
    categorySlug: "ai",
    tags: [
      "prompt-injection",
      "atlassian",
      "ai-security",
      "data-exfiltration",
      "enterprise",
      "vulnerabilities",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1775163024488-e88e4a71179f${P}`,
    body: `**Atlassian Rovo** is the AI assistant wired into Jira, Confluence and connected services like SharePoint. In August 2026 two unrelated security firms published two unrelated ways to make it hand data to an attacker.

Neither requires a vulnerability in the usual sense. Both work by giving the assistant instructions it treats as legitimate.

## Route one: RovoBlast (Varonis)

Rovo Chat accepts a URL parameter, \`rovoChatPrompt\`, that pre-fills the chat box with a prompt.

That is a convenience feature. It is also a way to put attacker text into an authenticated user's assistant with one click.

Varonis showed that a single click from a signed-in user was enough for the assistant to locate information the victim could access, put it into the path of an attacker-controlled image URL, and fetch the image — delivering the data to the attacker's server.

The image-fetch trick is the important half. There is no "send this data" step for a user to approve. The assistant renders an image, the way assistants do, and the request carrying the data is the render.

| | |
| --- | --- |
| Reported to | Atlassian, via Bugcrowd |
| Fixed | **8 July 2026**, server-side |
| Bounty | **$6,000** |

That one is closed.

## Route two: poisoned documents (PromptArmor)

**PromptArmor** put instructions inside ordinary-looking files — a PDF with white text on a white background in a tiny font. Invisible to a human reader. Fully legible to Rovo.

Ask Rovo to summarise the file and it gathers internal data and sends it out through a URL request, with **no separate approval step**.

The timeline is the story here:

| Date | Event |
| --- | --- |
| **23 May 2026** | Privately disclosed to Atlassian |
| **4 June 2026** | PromptArmor follows up |
| — | No further communication |
| **5 August 2026** | Published, described as still active |

Status after publication is unconfirmed.

## What actually gets out

Both techniques operate **inside the signed-in user's permissions**. The assistant cannot reach anything the user could not already open.

That bound is real and it is smaller comfort than it sounds. A mid-level employee at most companies can reach confidential Jira tickets, internal Confluence pages, API keys pasted into a ticket, project plans, customer records and incident-response documentation. Demonstrated targets in the research included private API keys, Jira tickets and Confluence pages.

The permission model was never the control being defeated. The control being defeated is *"data does not leave without someone approving it."*

One further detail worth knowing if you administer this: the attack works **even when organisation-wide web search is disabled**, because turning off web search does not remove the underlying URL retrieval tool.

## Why these two are the same problem

Varonis attacked the *input channel* — the URL that seeds the conversation. PromptArmor attacked the *content channel* — the document the user asks about. One is patched. The other is not, and the reason is structural: you can validate a URL parameter, but you cannot validate a PDF for "contains instructions", because a document that contains instructions is what a document is.

This is the pattern the Five Eyes agencies described in their [joint guidance on prompt injection in agentic AI](/article/prompt-injection-agentic-ai-five-eyes), and it is the same shape as [code that runs before a developer types their first prompt](/article/coding-agents-code-runs-before-first-prompt-datadog). The assistant has no way to distinguish "content the user wants processed" from "instructions the content wants followed", because at the token level there is no difference.

## What an Atlassian admin can do this week

- **Restrict which apps and user groups have Rovo enabled.** This is Atlassian's own mitigation and it is the only lever that reliably reduces exposure right now.
- **Do not rely on disabling web search.** URL retrieval survives it.
- **Treat uploaded documents from outside as untrusted input to the assistant**, not merely as files. A supplier's PDF is a prompt.
- **Log outbound fetches from the assistant** if your tenancy exposes them. Exfiltration through an image URL is invisible in the chat transcript and obvious in egress.
- **Assume the content route is live.** PromptArmor published because it was unfixed after ten weeks. Nothing since has confirmed a fix.

The uncomfortable summary: the patched bug took eleven weeks and cost $6,000. The unpatched one is the harder of the two, and it is the one that does not need the victim to click anything unusual.`,
  },
  {
    slug: "usb-plug-and-pwn-windows-11-system-defcon",
    title:
      "Plugging in a USB device can still get you SYSTEM on a fully patched Windows 11",
    excerpt:
      "Presented at DEF CON 34, 'Plug And Pwn' chains Windows' own driver auto-install against itself — emulate a Sierra Wireless modem, then a Sony FeliCa reader, and a DLL lands in System32. There is a Remote Desktop variant too.",
    categorySlug: "gadgets",
    tags: [
      "windows",
      "hardware",
      "privilege-escalation",
      "usb",
      "drivers",
      "defcon",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1779896412104-0f589e7a4e94${P}`,
    body: `Researchers **Alejandro Hernando** and **Borja Martinez** presented *"Plug And Pwn: Weaponizing Windows PnP Auto-Install"* at **DEF CON 34**. The result: SYSTEM-level code execution on a fully updated Windows 11 machine, using nothing that is broken.

Plug and Play works like this. Windows receives hardware and compatible IDs from a connected device, looks up a matching signed vendor driver, and installs it. That is the feature. Every part of it is doing what it is supposed to do.

The attack is to choose which drivers get installed.

## The chain

1. **Emulate a Sierra Wireless device.** Windows installs the vendor package, which includes \`SwiService.exe\` — a service running as SYSTEM.
2. **Use a DNS redirection primitive** the service exposes.
3. **Emulate a Sony FeliCa reader.** Its installer retrieves configuration over **unencrypted HTTP**, to **predictable local filenames**.
4. **Exploit path-traversal flaws** in that retrieval to place a malicious DLL into **System32**.
5. **Reconnect the Sierra device.** The SYSTEM service loads the DLL.

Five steps, two emulated devices, no exploit against Windows itself. The weaknesses live in third-party driver packages that Windows fetches and installs because they are signed and because the device asked.

That is also why the article carries **no CVE identifiers**. These are vendor-specific weaknesses in shipped driver software, not flaws in the operating system — which makes them harder to track and harder to declare fixed.

## The Remote Desktop variant

The same chain works without anyone touching the machine.

The researchers forged synthetic USB traffic over Remote Desktop and presented a phantom **Intel RealSense** device, then exploited DLL search-order hijacking from user-writable installation directories.

Microsoft's position is that the required features — supported Plug and Play, or low-level USB redirection — are **not allowed by default** on Remote Desktop Services.

Read that carefully. "Not allowed by default" is accurate and is not the same as "off in your environment." RDS deployments that support hardware tokens, scanners, signature pads or card readers have turned redirection on deliberately. Those are exactly the deployments in healthcare, finance and logistics.

## Preconditions, stated plainly

| Variant | Requires |
| --- | --- |
| Physical | Ability to present an emulated USB device to the machine |
| Remote | PnP or low-level USB redirection explicitly enabled on RDS |

Neither is a remote unauthenticated attack. Both are realistic for the environments they apply to: a kiosk, a shared workstation, a locked laptop in an office, or a remote desktop farm with redirection on for a business reason.

## Microsoft's guidance is the mitigation

There is no patch to apply here, which is the awkward part. What exists is policy:

- **Device installation policies** let administrators block devices by **hardware ID**, **compatible ID** or **setup class**.
- On Remote Desktop servers, those same policies **govern redirected devices**.
- USB redirection can be **disabled entirely** where it is not needed.

That is a genuinely effective control and almost nobody has it configured, because configuring it requires knowing which device classes your estate actually needs — which is an inventory problem, not a security one.

## Why this is worth attention now

The instinct is to file this under "physical access is game over anyway." That instinct is thirty years old and it was never quite right.

Modern endpoint hardening has spent a decade making physical access *less* decisive: full-disk encryption, Secure Boot, virtualisation-based security, credential guard. The threat model has moved toward "attacker briefly touches the machine" rather than "attacker takes the machine home." Plug And Pwn is squarely in that model — a few seconds at a locked workstation.

It also rhymes with the [U-Boot FIT signature flaws Binarly documented](/article/u-boot-fit-signature-flaws-binarly-2026) earlier this year: signed does not mean safe, when the thing being signed is a component whose own behaviour is the weakness.

## What to do

- **Inventory the device classes you need**, then block the rest with device installation policy. Start with setup classes, not individual hardware IDs.
- **Audit RDS for USB redirection.** If it is on, find out which business process needs it and scope the policy to that.
- **Treat unattended workstations as reachable.** Reception desks, meeting rooms, clinical carts, warehouse terminals.
- **Do not wait for CVEs.** There are none, and the affected code is vendor driver packages that may never get advisories.`,
  },
  {
    slug: "gunra-ransomware-cisa-fbi-advisory-51-victims",
    title:
      "CISA, the FBI and South Korea issued a joint warning on Gunra — and its Linux locker has a flaw that lets you decrypt for free",
    excerpt:
      "51 victims since April 2025, mostly outside North America, exploiting a 2024 Schneider Electric flaw and a 2025 Fortinet one. The advisory is worth reading for what it says about which patches actually matter.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "cisa",
      "healthcare",
      "fortinet",
      "critical-infrastructure",
      "threat-intelligence",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1764345676856-eaf84d541dc9${P}`,
    body: `South Korea's cybersecurity and intelligence agencies, **CISA** and the **FBI** issued a joint warning this month about **Gunra**, a double-extortion ransomware operation that emerged in **April 2025** and launched a formal ransomware-as-a-service programme in **January 2026**.

A joint advisory across three countries usually signals volume. This one is more interesting for what it says about *targeting*.

## The two CVEs

| Product | CVE | Year |
| --- | --- | --- |
| **Schneider Electric PowerLogic P5** | CVE-2024-5559 | 2024 |
| **Fortinet FortiOS / FortiProxy** | CVE-2025-24472 | 2025 |

Neither is new. The Schneider flaw is two years old. Neither is exotic.

The Schneider entry is the one that should stop an infrastructure operator. PowerLogic P5 is a protection relay — power distribution equipment, not IT. A ransomware crew with a working exploit for it is a ransomware crew that has read the same OT-convergence memo everyone else has.

## Where the victims are

**51 victims** listed since April 2025. Concentrated in:

- South Korea
- Brazil
- Spain
- Thailand
- Hong Kong

**Three** US and Canadian victims total.

That distribution is unusual enough to be worth naming. A ransomware operation with 51 victims and three in North America is not choosing targets the way most RaaS affiliates do. It suggests affiliate geography rather than deliberate avoidance, but either way, a US-centric threat feed would have shown this group as barely present.

Sectors: healthcare and public health, financial services, government services and facilities, professional and nonprofit services.

## The TTPs are entirely conventional

- **Phishing** as the primary initial access vector
- **SMB exploitation** via Impacket — \`psexec.py\`, \`smbclient.py\`
- **Credential dumping** with \`secretsdump.py\`
- **Exfiltration** through OneDrive, SharePoint and MEGA
- **MFA bypass** through OTP manipulation
- **SSL-VPN exploitation** for session hijacking

There is nothing on that list a defender has not seen. Impacket and secretsdump have been in every ransomware advisory for six years. Exfiltration through OneDrive and SharePoint is exfiltration through the tools the victim already trusts, which is why it works.

The MFA bypass through OTP manipulation is the item most worth checking against your own stack. Push-based and OTP-based MFA are not equivalent controls under a determined operator — the [Teams vishing campaign that reached encryption in under 17 hours](/article/teams-vishing-stac4749-chaos-ransomware) started from the same premise.

## The Linux locker is broken

The group offers both Windows and Linux variants. The **Linux version contains a cryptographic weakness that enables file recovery without paying**.

That is a genuinely useful fact and it is buried in the advisory. If you are hit by the Linux locker, do not pay before checking whether recovery is possible.

It also says something about the operation's maturity. A crew that ships a broken Linux locker is a crew that built the Linux variant to widen the market, not because they had the engineering to do it properly.

## Reading this against the wider picture

We covered the [July ransomware surge led by Qilin](/article/ransomware-surge-july-2026-qilin) and the pattern holds here: the volume is not coming from novel technique. It is coming from unpatched edge devices and phishing, executed at scale by affiliates.

The two CVEs in this advisory are 2024 and 2025. The gap between "patch available" and "patch applied" is where this entire industry lives.

## What to do

- **Patch CVE-2025-24472 (FortiOS/FortiProxy) and CVE-2024-5559 (PowerLogic P5)** if you have not. Check the second one even if you think you have no Schneider gear — protection relays are owned by facilities, not IT.
- **Alert on Impacket signatures.** \`psexec.py\` and \`secretsdump.py\` have recognisable behaviour and it is not subtle.
- **Watch outbound volume to OneDrive, SharePoint and MEGA.** Especially MEGA, which has no business use in most organisations.
- **Review your MFA method.** OTP manipulation is on the list for a reason.
- **If you are hit by the Linux variant, check for recovery before anything else.**

One closing note on the geography: a group with 51 victims and three in North America will read as low-priority in most US-authored threat intel. If your operations are in Korea, Brazil, Spain, Thailand or Hong Kong, this advisory is about you specifically.`,
  },
  {
    slug: "bdthemes-wordpress-json-poisoning-rogue-admins",
    title:
      "Seven WordPress plugins were compromised without touching a line of their code",
    excerpt:
      "Attackers took credentials for a DigitalOcean Spaces bucket that BdThemes' promotional banner fetches JSON from. The plugin source stayed clean. Every admin page load ran the attacker's JavaScript anyway.",
    categorySlug: "security",
    tags: [
      "supply-chain",
      "wordpress",
      "malware",
      "web-security",
      "backdoor",
      "cms",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1705904506592-d8a0d5392c66${P}`,
    body: `**Wordfence** researcher **Paolo Tresso** reported a supply chain compromise affecting seven **BdThemes** plugins, and the mechanism is the reason it matters.

Threat actors poisoned a **static remote JSON data stream** fetched by an administrative promotional banner component.

Read that again with a code reviewer's eye. Nothing in the plugin source was modified. Anyone auditing the repository, diffing releases, or checking checksums would have found exactly what they expected.

## The affected plugins

| Plugin | Active installs |
| --- | --- |
| **Element Pack Addons for Elementor** | 100,000+ |
| Live Copy Paste for Elementor | 6,000+ |
| Ultimate Store Kit | 6,000+ |
| Pixel Gallery Addons for Elementor | — |
| Prime Slider Addons for Elementor | — |
| Smart Admin Assistant | — |
| Ultimate Post Kit Addons | — |

## How it worked

The **Biggopti** component carries a cross-site scripting flaw and fetches promotional JSON files from a **DigitalOcean Spaces bucket**. Attackers compromised the bucket credentials and injected payloads there.

The XSS itself is rated **CVSS 5.4** — medium. That rating describes the flaw. It does not describe what happened, because the flaw was only the delivery mechanism for content the attacker fully controlled.

The injected JavaScript, \`w2.js\`, ran silently **on every admin page load** and:

- created **rogue administrator accounts** through the WordPress REST API
- downloaded fake plugin ZIPs containing **PHP web shells**
- established persistence via backdoors in the **Must-Use plugins** directory

The Must-Use directory is the choice that shows intent. Plugins there load automatically, cannot be deactivated from the dashboard, and are not listed in the normal plugin screen. Removing the compromised plugins does not remove that.

## Timeline

| Date | Event |
| --- | --- |
| **1 March 2026** | Vulnerability introduced in \`bdthemes-prime-slider-lite\` |
| — | Spreads to the other plugins |
| **7–8 August 2026** | WordPress.org disables downloads pending full review |

Five months between introduction and takedown.

The command-and-control infrastructure connects to earlier supply chain attacks involving **Advanced Responsive Video Embedder** and **OptinMonster** — the same operator, working the same ecosystem.

## Why this defeats the usual checks

The WordPress plugin security model assumes the code is the artefact. Reviews look at code. Version pinning pins code. Integrity checking hashes code.

This attack changed *data the code fetches at runtime*, from infrastructure the plugin vendor owns but that no reviewer inspects. The trust boundary moved from "the plugin repository" to "whoever holds the vendor's object storage credentials", and nothing in the ecosystem tracks the second one.

It is the same structural gap behind the [npm dropper that pushed 846 malicious packages](/article/npm-flooding-dropper-846-malicious-packages) and behind [dangling DNS records that let subdomains be taken over](/article/dangling-dns-subdomain-takeover-silent-push) — the dependency you actually have is not the one in your lockfile. It is every endpoint your dependency talks to.

## If you run any of these

Removing or updating the plugin is not sufficient. The payload's job was to survive that.

- **Audit administrator accounts.** Look for accounts created since March 2026 that nobody recognises. Check the REST API log if you keep one.
- **Inspect \`wp-content/mu-plugins/\`.** Anything there that you did not put there is a backdoor, not a feature.
- **Look for unexpected plugin ZIPs and PHP files** with recent timestamps outside normal update windows.
- **Rotate everything the site holds** — admin passwords, API keys, database credentials, payment integrations.
- **Assume compromise if the plugin was active on an admin session at any point since March.** The payload ran on page load, not on user action.

## The broader point for plugin authors

A promotional banner that fetches remote JSON is a feature nobody asked for, running with admin-page privileges, on every load, forever.

The cost-benefit here is not close. The feature exists to advertise the vendor's other products. The risk it carries is full site compromise for 100,000+ installations. That trade was made once, in a commit, and was never revisited.

If you ship a plugin: any remote fetch that renders in an admin context is a permanent liability against whatever infrastructure serves it. Object storage credentials leak. That is a thing that happens.`,
  },
  {
    slug: "storm-1175-stormencryptor-n-central-patch-bypass",
    title:
      "Storm-1175 dropped Medusa for its own ransomware — and got in through the N-central patch that did not hold",
    excerpt:
      "Microsoft attributes StormEncryptor, a new C++ locker, to the China-linked group. Initial access was likely CVE-2026-18577 in N-able N-central, which is itself a bypass of the earlier fix. CISA has both flagged as exploited.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "china",
      "rmm",
      "patching",
      "microsoft",
      "threat-intelligence",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1660484578217-74126336c9d0${P}`,
    body: `Microsoft has documented **StormEncryptor**, a previously unseen ransomware family written in C++, deployed by **Storm-1175** — a China-linked, financially motivated group.

The malware itself is unremarkable. It appends \`.encrypted\` to files and drops a ransom note named \`!!!README_FIRST!!!.txt\`. What is worth reading is how the group got in, and what the switch away from Medusa signals.

## The initial access

Storm-1175 likely exploited **CVE-2026-18577** in **N-able N-central** — a remote monitoring and management platform used by MSPs.

That CVE is assessed as a **patch bypass for CVE-2026-18556**. Both enable authentication bypass and account takeover. **CISA has flagged both as actively exploited in the wild.**

We wrote about the incomplete patch [when the bypass was disclosed](/article/n-able-n-central-incomplete-patch-cve-2026-18577). This is the part of that story where it shows up in an intrusion.

The pattern is worth stating cleanly, because it recurs:

1. A vulnerability is disclosed and patched.
2. The patch addresses the specific input, not the underlying flaw.
3. A bypass is found.
4. Organisations that applied patch one believe they are done.

Step four is what makes patch bypasses disproportionately valuable to an attacker. The target population is not "everyone unpatched" — it is "everyone who patched and stopped looking."

## Why an RMM platform

N-central is what a managed service provider uses to administer its clients' machines. Compromising it is not compromising one network. It is compromising the tool that has agent-level access to all of them.

That is the whole reason RMM platforms sit near the top of every ransomware crew's target list, and why an authentication bypass in one is not comparable to an authentication bypass in an ordinary web application.

## Post-compromise

- **AnyDesk** or **SimpleHelp** for remote access
- **Advanced IP Scanner** for reconnaissance
- **Mimikatz** for credential dumping
- Rapid movement from initial access to exfiltration to ransomware — **typically within days**

Every one of those is a legitimate tool. AnyDesk and SimpleHelp are remote support software; an MSP environment is full of both, which makes them nearly invisible in that context. Advanced IP Scanner is a free network tool. Mimikatz is the only item on the list that has no innocent explanation.

The "within days" cadence matches what we have seen across [this year's ransomware operations](/article/ransomware-surge-july-2026-qilin) — the dwell times that used to be measured in weeks are now measured in the length of a long weekend.

## The Medusa-to-StormEncryptor shift

Storm-1175's history is a list of edge-device and platform exploitation:

- Mirth Connect
- ConnectWise ScreenConnect
- JetBrains TeamCity
- Fortinet FortiClient EMS
- Fortra GoAnywhere

All previously used to deploy **Medusa**.

Moving to a custom C++ locker changes the group's economics. Medusa is a RaaS — a share of every payment goes to the operator, and the tooling is shared with other affiliates, which means shared detections. A private locker means no cut, no shared signatures, and no dependency on someone else's infrastructure staying up.

For defenders it means one specific thing: **detections tuned to Medusa will not fire.** The behavioural chain is identical; the payload is not.

## What to do

- **Confirm you are on the N-central release that fixes CVE-2026-18577**, not merely the one that fixed CVE-2026-18556. This is the single highest-value item here.
- **If you are an MSP, treat your RMM as tier-zero infrastructure.** Same controls as a domain controller: MFA, restricted network exposure, dedicated admin accounts, alerting on authentication anomalies.
- **Alert on AnyDesk and SimpleHelp installs that your own process did not initiate.** In an MSP environment this needs an allowlist of known-good deployments to be useful.
- **Hunt for \`.encrypted\` extensions and \`!!!README_FIRST!!!.txt\`** as a late-stage indicator — useful for scoping, not for prevention.
- **Do not assume Medusa detections cover this.** Rebuild detection around behaviour: Advanced IP Scanner plus Mimikatz plus a new remote-access tool, in that sequence, inside a few days.

The through-line: the intrusion did not require anything new. It required a patch that was applied once and a bypass that nobody re-checked for.`,
  },
  {
    slug: "kimsuky-offline-ai-stack-ollama-gpt4all-genians",
    title:
      "Kimsuky is running its AI locally — Ollama, GPT4All and a retrieval database on its own infrastructure",
    excerpt:
      "Genians found the stack on infrastructure linked to the North Korean espionage unit. Running models offline means stolen documents never touch a provider, and no usage policy applies. That is the point.",
    categorySlug: "world",
    tags: [
      "north-korea",
      "apt",
      "ai",
      "threat-intelligence",
      "espionage",
      "llm",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1677442135703-1787eea5ce01${P}`,
    body: `South Korean security firm **Genians** announced on **10 August 2026** that it had found a locally-hosted AI stack on infrastructure linked to **Kimsuky**, the North Korean espionage unit operating under the Reconnaissance General Bureau.

Not API keys for a commercial chatbot. Models running on their own machines.

## What was on the infrastructure

**Offline model runners:**

- **Ollama**
- **GPT4All** — with a configured \`localdocs_v3.db\` database for retrieval-augmented generation
- **Msty**

**Development stack:**

- **LLaMaSharp**, Microsoft's **Semantic Kernel**, and **Microsoft.Agents.AI** — for building AI into custom C# and .NET software
- OpenAI's **Whisper** speech-to-text, alongside audio extraction guides
- **Cursor**, the AI coding editor

The purpose Genians describes is folding AI through the operation — from writing malware to analysing data — with particular emphasis on phishing campaigns and malware development.

The activity is part of a campaign Genians calls **Operation GitPower**, which uses GitHub repositories for command and control.

## The RAG database is the detail that matters

\`localdocs_v3.db\` is GPT4All's local document store. It is what you configure when you want the model to answer questions about a corpus of files you have on disk.

An espionage group's corpus of files on disk is stolen documents.

This is a qualitatively different use of AI from "write me a better phishing email." It is document triage at scale: exfiltrate a few gigabytes from a target, load it locally, and ask questions of it. The bottleneck in espionage has never been collection. It has been reading what you collected in a language you may not speak, fast enough for it to matter.

Whisper in the same stack extends that to audio.

## Why offline is the operational choice

Running models locally costs more effort than calling an API. Three things are bought with that effort:

**No third-party visibility.** Every commercial provider logs. Anthropic, OpenAI and Google have all published reports on state-linked misuse of their platforms — those reports exist *because* the traffic was visible. Local inference produces no such record.

**No usage policy.** Refusals are a property of a served model behind a provider's safety stack. A weights file on your own hardware has whatever guardrails the weights were trained with and nothing else.

**No data leaving.** Stolen documents fed to a hosted model are stolen documents sent to a US company. For an intelligence service that is an unacceptable risk regardless of policy.

The third reason is probably the real one, and it is worth being clear that it is a *counterintelligence* decision more than an evasion one.

## What this does and does not change

It does not make Kimsuky more capable in a way that breaks anything. Local open-weight models are behind frontier models, and the group's actual intrusions still rely on phishing and conventional malware.

What it changes is throughput. More phishing lures, better localised, produced faster. Faster triage of stolen material. Less analyst time per target.

That echoes the pattern in the [DeepSeek-agent-driven attack activity documented earlier this year](/article/deepseek-agent-autonomous-attack-jesta-proxyjacking): AI is showing up in offensive operations as a productivity layer, not as a new capability class.

## A note on the evidence

Genians' findings come from **log analysis and infrastructure forensics**. No independent verification has been reported, and no government source has corroborated the specific tooling inventory.

That is not a reason to dismiss it — Genians has a solid track record on Kimsuky specifically — but the claim being made is "these tools were present on infrastructure we attribute to this group", which is narrower than "this group is running an AI-driven operation."

## What defenders take from it

- **Expect better lures in Korean, English and Japanese.** The volume-and-quality ceiling that made translated phishing detectable is gone.
- **Content-based phishing detection degrades from here.** Grammar and phrasing tells were always a weak signal; they are now close to worthless.
- **Assume exfiltrated data gets read.** The old comfort — that a group stealing terabytes cannot process them — no longer holds. Data classification and exfiltration prevention move up the priority list relative to detection-after-the-fact.
- **Watch for GitHub-based C2.** Operation GitPower's use of repositories for command and control is the more immediately actionable indicator in this report.

The strategic read is dull and probably correct: state groups are adopting the same local-model tooling that privacy-conscious enterprises adopted, for overlapping reasons, roughly on the same timeline.`,
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
