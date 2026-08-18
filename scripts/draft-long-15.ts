/**
 * Long-form drafts — 14–16 August 2026.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
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
    slug: "macos-screen-sharing-cve-2026-65400-monero-miner",
    title:
      "A CVSS 9.8 in macOS Screen Sharing let anyone on the network in without a password — and the payload was a crypto miner",
    excerpt:
      "CVE-2026-65400 bypasses credential validation on Apple's remote desktop service. The Dutch NCSC confirmed exploitation against internet-exposed Macs with port 5900 open, and what turned up was root access and a Monero miner.",
    categorySlug: "gadgets",
    tags: [
      "apple",
      "macos",
      "vulnerabilities",
      "cryptojacking",
      "remote-access",
      "patching",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1588200908342-23b585c03e26${P}`,
    body: `**CVE-2026-65400** is an authentication flaw in Apple's **Screen Sharing** component, rated **CVSS 9.8**. It lets an attacker on the network authenticate to the remote desktop service **without valid credentials**.

Apple shipped emergency patches on **6 August 2026**. The **Netherlands National Cyber Security Centre** has confirmed active exploitation across multiple internet-exposed systems.

## Affected and fixed

| macOS | Fixed in |
| --- | --- |
| Tahoe | **26.6.1** |
| Sequoia | **15.7.9** |
| Sonoma | **14.8.9** |

Reported to Apple by **Alfredo Pesoli** of **Bynario**. Three related flaws in the same component were fixed alongside it — **CVE-2026-43779**, **CVE-2026-43777** and **CVE-2026-43760**.

## What the exploitation looked like

The precondition is **port 5900 exposed to the internet**. Where that was true, per the reporting:

> root had gained access to the affected system and placed a Monero crypto miner

Root access on a Mac, used to mine Monero.

There is a temptation to read cryptojacking as the harmless outcome. It is better read as a **capability indicator**. Whoever ran this had unauthenticated root on every exposed machine they touched. Mining is what they chose to do with it; it is not the ceiling of what they could have done.

It is also the loudest possible use of that access. A miner pegs the CPU and shows up in fan noise and battery life. An operator interested in the data would have been quieter, and might still be there.

## Why 5900 is open at all

Screen Sharing is macOS's built-in VNC service. Nobody deliberately publishes it to the internet — it gets there through:

- A router with UPnP enabled, forwarding automatically
- A port-forward set up years ago for remote access from home
- A Mac on a cloud or colocation host with no firewall in front of it
- A small office where "let me just get in from outside" was solved once and never revisited

That is the same population as [the water systems reached through exposed controllers](/article/minnesota-water-plc-attacks-no-exploit-needed) and [the Android TV boxes with ADB open](/article/kimwolf-v7-android-botnet-http2-browser-fingerprints): devices nobody administers, with a service enabled by default or turned on once for convenience.

## What to do

- **Update now.** 26.6.1, 15.7.9 or 14.8.9 depending on your line. This is an emergency patch and the flaw is being exploited.
- **Turn Screen Sharing off if you do not use it** — System Settings, then General, then Sharing. This is the complete fix and most people will never notice it is gone.
- **Check whether 5900 is reachable from outside.** If you have any Mac on a public IP, or a router doing UPnP, assume it might be until you have checked.
- **Look for a miner before assuming you were fine.** Sustained high CPU with no explanation, an unfamiliar launch agent or daemon, outbound connections to mining pools. A patched machine that was exposed last week was not necessarily patched in time.

## What is not established

- **How many systems were hit.** NCSC-NL confirmed exploitation across multiple internet-exposed systems and gave no count.
- **Whether this was exploited as a zero-day.** NCSC-NL did not say, and the timing relative to the 6 August patch is not public.
- **Who is behind it.** No attribution has been offered, and cryptojacking rarely produces one.
- **Whether mining was the only payload.** Nothing rules out something quieter alongside it.`,
  },
  {
    slug: "patchcord-apt36-afghan-telecom-india-nic-browser-hijack",
    title:
      "The backdoor persists by rewriting your browser shortcut — and it is aimed at India's government IT networks",
    excerpt:
      "Acronis attributes PATCHCORD to APT36 with moderate confidence. It arrives as a fake Afghan Telecom transport app, hides its console window, and survives reboots by hijacking the Chrome, Edge and Firefox shortcuts on the desktop.",
    categorySlug: "world",
    tags: [
      "apt36",
      "india",
      "afghanistan",
      "espionage",
      "backdoor",
      "critical-infrastructure",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1625838144804-300f3907c110${P}`,
    body: `**Acronis Threat Research Unit** — Darrel Virtusio, Santiago Pontiroli and Subhajeet Singha — has documented **PATCHCORD**, a C/C++ implant deployed since **at least March 2026** against **Afghan Telecom** and, more consequentially for readers here, **Indian government IT networks including the National Informatics Centre**, plus **energy sector** organisations in India.

Attribution is to **APT36 (Transparent Tribe)**, a Pakistan-aligned group, at **moderate confidence** — based on overlapping targeting, malware similarities, shared infrastructure and tradecraft.

Moderate confidence is the analyst's way of saying the pattern fits and nothing proves it. Worth carrying as stated rather than upgraded.

## The persistence is the interesting part

Most Windows implants persist through a registry Run key, a scheduled task or a service. Defenders know all three and monitor them.

PATCHCORD **hijacks browser shortcuts** — Chrome, Edge and Firefox.

It rewrites the thing on your desktop and taskbar that you click twenty times a day. The browser still opens. Nothing looks wrong. The implant runs because you wanted to check your email.

That sidesteps the persistence detections most estates actually have, and it survives a reboot without touching anything an EDR is watching closely.

It also leaves a marker: PATCHCORD checks for a registry value named **BeaconBrowserHijack** to avoid reinfecting a machine it already owns. That string is the single most useful indicator in the report — it is unique, it is cheap to hunt for, and it is present on every compromised host.

## What it does once running

- Hides its console window on execution
- Fingerprints the host
- Takes tasking from C2, and can **adjust its beacon interval**
- Enumerates running processes
- Decodes and executes **shellcode**
- Runs arbitrary commands through **cmd.exe**
- Controls its own browser-hijack persistence

Adjustable beaconing matters for detection: an implant that can slow itself down defeats rules keyed to a fixed callback rhythm.

## How it arrives

A ZIP containing an **Inno Setup** installer. The named example is **Telecom_TMS.zip**, holding **TMS_AfghanTelecom.exe** — impersonating Afghan Telecom's Transport Management System, the internal tool for tracking corporate vehicle requests.

That is a precise lure. Not a generic invoice, not a fake update: an internal logistics application that employees of one specific state telecom would recognise and expect. Somebody did the homework.

## Two siblings, and a staging server left open

Acronis found two related families:

**SHEETCORD** — a Go backdoor using **Google Sheets** for command and control, combining functionality from SHEETCREEP and PATCHCORD, adding PowerShell execution, and extending browser targeting to **Brave, Opera and Vivaldi**.

**HACKERAI C2** — uses **GitHub Gists** for C2, with dedicated upload and download.

Both pick a C2 channel that is a legitimate service. Blocking Google Sheets or GitHub across an enterprise is not an option, which is precisely why they were chosen — the same reasoning behind [DeadLock putting its leak site on Polygon](/article/deadlock-ransomware-polygon-smart-contracts-session) and [Kimwolf resolving C2 through ENS](/article/kimwolf-v7-android-botnet-http2-browser-fingerprints).

An **exposed staging server** revealed the operator's toolkit: open-source C2 frameworks **antnium**, **GateSentinel** and **SuperShell**, exploits for **CVE-2024-6387**, and AI-assisted malware projects.

## Indicators

- C2: **46.30.188[.]13**
- Registry value: **BeaconBrowserHijack**
- Domains impersonating Afghan telecom operators, plus **hijacked legitimate healthcare domains**

That last one deserves attention if you run a healthcare domain. Being used as attacker infrastructure does not require you to be the target.

## What to do

- **Hunt for the BeaconBrowserHijack registry value.** One string, high confidence, trivial to query across an estate.
- **Baseline your browser shortcut targets.** A shortcut for Chrome whose target is not Chrome is the whole technique, and almost nobody checks.
- **Alert on Inno Setup installers arriving in ZIPs**, particularly ones named after internal tools.
- **Treat Google Sheets and GitHub Gist traffic as a C2 channel worth profiling**, not as trusted-by-default.
- **Patch CVE-2024-6387** if it is still open anywhere. The operator has an exploit for it.

## What is not established

- **Victim counts.** Not published.
- **Attribution beyond moderate confidence.** Acronis does not claim more and neither do we.
- **What was taken.** The report describes capability and infrastructure, not outcomes.`,
  },
  {
    slug: "evooo1bot-mirai-routers-socks5-residential-proxy",
    title:
      "The botnet does not want your router for a DDoS — it wants to sell your address as a residential proxy",
    excerpt:
      "Fortinet has tracked Evooo1Bot since July 2026 across Alcatel, NETGEAR, Tenda, Mitsubishi Electric, Telesquare and D-Link gateways. It picks one of twelve builds to match your CPU, clears Bash history, and turns the device into a SOCKS5 node.",
    categorySlug: "security",
    tags: [
      "botnet",
      "routers",
      "iot",
      "proxies",
      "mirai",
      "consumer-devices",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1750710583720-8b3bdd0f658a${P}`,
    body: `**Fortinet** has been tracking **Evooo1Bot**, a Mirai-based modular botnet hitting internet-facing gateway devices since at least **July 2026**.

The device list is the usual crowd: **Alcatel, NETGEAR, Tenda, Mitsubishi Electric, Telesquare** and **D-Link** routers and gateways, with further exploitation aimed at **Hikvision** cameras, **Atlassian Confluence**, **Zyxel** firewalls, **TP-Link** routers and **D-Link NAS** devices.

What it does with them is the part worth reading.

## Not a DDoS cannon

Mirai's descendants are usually described as DDoS botnets, and that framing is a decade old.

Evooo1Bot turns each compromised router into a **SOCKS5 proxy node**. The uses Fortinet lists:

- Concealing malicious traffic
- Circumventing geographic restrictions
- Reaching networks through compromised systems
- **Monetisation through residential proxy services**

That last item is the business model. A residential IP address — one belonging to a real home broadband line — is worth money, because it defeats the reputation checks that block datacentre IPs. Fraud, scraping, credential stuffing and ad fraud all pay for clean residential exit nodes.

So your router is not being conscripted into an attack. It is being **rented out**, and the traffic that leaves your line is somebody else's.

This is the supply side of a market we wrote about from the demand side: [UNC6671 authenticating through residential broadband pools to look like a normal employee](/article/unc6671-blackfile-rebrand-vishing-passkey-enrollment), and [Sable Squirrel buying aged domains for the same reputation reason](/article/sable-squirrel-seven-million-expired-domains-reputation). Reputation is the scarce commodity, and it is being farmed.

## The mechanics

Exploitation uses **known vulnerabilities** — no zero-days. Then:

> a script downloads one of the 12 available malware builds that match the host's CPU architecture, then clears Bash history to wipe traces of the attack

Twelve architecture-specific builds is a maintenance commitment. Somebody is deliberately covering the long tail of consumer gateway hardware — MIPS, ARM variants, whatever the cheap boxes run.

Clearing shell history is the tell that this is aimed at devices where a human might one day log in and look.

## Why nobody notices

A compromised router shows no symptom the owner would recognise. No slow machine, no popups, no ransom note. Slightly more upstream traffic, and an IP address that starts turning up on blocklists.

The one consequence most people eventually feel is the second-order one: **sites start treating your connection as suspicious.** Captchas everywhere, blocked sign-ups, failed card payments. Almost nobody traces that back to the router.

## What to do

Fortinet's guidance, in the order that actually matters:

- **Disable remote access panels.** Web administration reachable from the internet is how nearly all of these start. This single change removes most of the exposure.
- **Change default admin credentials.** Still the most common way in.
- **Update firmware** — and check, because most consumer routers do not do it automatically and never tell you.
- **Replace unsupported devices.** A gateway that stopped getting firmware three years ago is not going to be patched, and it is on the target list precisely because of that.

If you manage an estate: cheap gateways in branch offices, retail sites and remote workers' homes are the ones on this list, and they are usually owned by nobody in particular.`,
  },
  {
    slug: "brightly-software-insider-extortion-cameron-curry-sentence",
    title:
      "His contract ended on 10 December. The extortion emails started on the 11th.",
    excerpt:
      "Cameron Curry emailed dozens of Brightly Software employees demanding $2.5 million in crypto, with a $100,000 monthly escalation. The company paid $7,540 before reporting it. He got two years.",
    categorySlug: "security",
    tags: [
      "insider-threat",
      "extortion",
      "offboarding",
      "law-enforcement",
      "data-theft",
      "saas",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1570553205083-56e0a16842bf${P}`,
    body: `**Cameron Curry**, 27, of North Carolina, has been sentenced to **two years in prison** after a guilty verdict in **March 2026**.

He had worked as a data analyst at **Brightly Software** — formerly SchoolDude, a SaaS firm with **700+ employees** serving **12,000+ clients**. His contract ended on **10 December 2023**.

The extortion emails began on **11 December**.

## What he took, and what he asked for

Payroll information, corporate data, and employee personal data — names, dates of birth, home addresses and compensation details.

Between **11 December 2023 and 24 January 2024** he emailed dozens of employees from **lootsoftware@outlook.com**, using the alias **Loot**, demanding **$2.5 million** in cryptocurrency. He threatened to release salary data and to report the company to the SEC.

> If you wish to reclaim your data, we recommend doing so promptly at 2.5 million USD in order to save your company and stocks, as each subsequent month will incur a $100,000 USD increase.

Note the escalation clause. This is ransomware negotiation language written by someone who has read ransomware negotiations, applied to a spreadsheet of colleagues' salaries.

Note also who he emailed: **dozens of employees**, not the executive team. Extorting a company through its own staff — people who can see their own home address in the leak — is a pressure tactic that does not need any infrastructure at all.

## The company paid, then reported

Brightly paid **$7,540 in Bitcoin** to Curry's wallet before reporting the incident.

Two things about that number.

It is **0.3% of the demand**. This looks like a partial or test payment rather than a settlement — the sort of thing done to verify a channel or buy time.

And it was traceable. Reporting followed, and the FBI searched Curry's residence on **24 January 2024**, seizing devices that carried the evidence. Six weeks from first email to search warrant.

## The offboarding question

His contract ended on the 10th. He had the data on the 11th.

Nothing in the reporting says how it left, and we are not going to guess. But the shape is the same one in [Apple's complaint against OpenAI](/article/apple-openai-trade-secrets-tata-leak-siri-gemini), where an engineer allegedly kept a company laptop after leaving and downloaded confidential documents from it: **the gap between the last day and the moment access actually ends.**

That gap is where insider incidents live, and it is almost always procedural rather than technical:

- Contractor accounts disabled on a schedule rather than on the day
- Data exports that were legitimate while employed and never reviewed after
- Personal devices that synced a share and were never wiped
- A laptop return that nobody chased

A data analyst has bulk access to exactly the data that makes a good extortion package. That is the job.

## Two years, and what it says

Two years for a $2.5 million demand against 700 employees' personal data is a light sentence by the standards of external ransomware prosecutions — but external ransomware operators are rarely in a jurisdiction where prosecution is possible at all.

We wrote about [the €30m Commerzbank fraud that took three years to reach arrests across four countries](/article/operation-klonen-commerzbank-30-million-four-days-arrests). This one took six weeks to a search warrant, because the offender was a former employee in the same country, using an Outlook address, receiving Bitcoin to a wallet he controlled.

Insider cases get solved. That is the one genuinely reassuring thing here, and it is worth telling staff.

## What to actually change

- **Revoke on the last day, not the next cycle.** Contractors especially — they are the ones whose end date is a calendar entry rather than an HR process.
- **Alert on bulk export in the notice period.** Not to accuse anyone; to have a record.
- **Chase the device.** An unreturned laptop is an open door with a timestamp on it.
- **Decide now who takes an extortion email.** Brightly's staff received these directly. Whether an employee forwards it, replies, or panics is determined by whether they were ever told what to do.
- **Do not pay to test the channel.** The $7,540 bought nothing and is now a line in a court record.`,
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
