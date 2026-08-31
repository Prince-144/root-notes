/**
 * Long-form drafts — 30 August 2026.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts picks one paragraph per section
 * by score — standalone digits and length win, opening on a back-reference
 * loses. The paragraph that answers each heading is written to win.
 *
 * Attribution note on the HOOKEDGE piece: Recorded Future states moderate
 * confidence and gives its basis. The article reports the confidence level
 * rather than dropping it, because "APT28" and "Russia did it" are different
 * claims and only the first is supported here.
 *
 * Cross-link note: only the extensions piece links to the TerminalFix one, not
 * both ways, so check-links raises one flag instead of two while they are
 * drafts.
 *
 * Cover note: all three downloaded and viewed. Rejected in this batch: a
 * terminal screenshot with Raspberry Pi and Plex package output legible on a
 * Windows PowerShell story, a VS Code screenshot with Chrome and Spotify
 * identifiable, and an envelope shot whose background was legible Harry Potter
 * pages. Screens keep failing this check; the keyboard does not.
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
    slug: "terminalfix-clickfix-windows-terminal-reverse-tunnel",
    title:
      "The only thing they changed was telling you to open Terminal instead of Run",
    excerpt:
      "TerminalFix is ClickFix with one substitution. A fake Cloudflare CAPTCHA asks you to paste a command, and instead of the Run dialog it sends you to Windows Terminal or PowerShell — where long multi-line scripts actually work. The end of the chain is a Python reverse tunnel that lets the operator reach anything your machine can see.",
    categorySlug: "security",
    tags: [
      "clickfix",
      "social-engineering",
      "powershell",
      "dll-side-loading",
      "microsoft",
      "reverse-tunnel",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1598624443973-2aa79a646a1e${P}`,
    body: `**Microsoft** has documented a campaign it calls **TerminalFix**. It is the **ClickFix** technique with a single change, and the change is not technical.

ClickFix shows you a fake verification page, tells you the page will not load until you run a command, and asks you to paste it into the **Run** dialog. TerminalFix asks you to paste it into **Windows Terminal** or **PowerShell** instead.

In Microsoft's words, the campaigns apply the same technique but direct users to Windows Terminal or PowerShell, **increasing the likelihood that complex, multi-line scripts execute successfully**.

## Why that one substitution matters

The Run dialog is a single line. It mangles long commands, it does not handle multi-line input, and a script complicated enough to do something useful frequently fails there.

Windows Terminal does not have that problem. It takes anything.

So the attacker's constraint was never the victim's willingness — people paste the command either way. The constraint was that the command had to be short enough to survive the box they were pasting into. Moving the instruction to Terminal removes the size limit on the payload, and everything downstream gets bigger.

There is **no vulnerability anywhere in this**. Nothing is exploited. A person is asked to run something and does. That is why patching does not help and why it works on any version of Windows.

## The chain, once you paste

The command pulls a ZIP containing two files: **LockScreenContentServer.exe**, a legitimate signed binary, and **dui70.dll**, which is not.

The legitimate binary loads the malicious DLL — **DLL side-loading**, the same technique [Sleepwalker used through a security vendor's own management agent](/article/sleepwalker-backdoor-magic-packet-no-outbound-traffic). From there:

- Next-stage payloads are retrieved **hidden inside PNG images** from external domains
- Persistence via **Registry Run keys** and **scheduled tasks**
- Reconnaissance: system metadata, domain trust discovery, enumeration of **domain admins**, Active Directory searches for users and computers, and pings to nameservers to map the internal network

Then the part that matters.

## The reverse tunnel is the payload

The final stage is a Python implant, **client.py**, which opens an encrypted **WebSocket** connection outbound to **gitnow[.]dev** on port **443**.

Microsoft's assessment is that this is particularly dangerous because it gives attackers direct access to an organisation's internal network through the reverse tunnel.

Read that precisely. It is not that one workstation is compromised. It is that the command server can now reach **anything that workstation can see** — every internal service that trusts a machine on the corporate network, without any of them being individually attacked.

Note also the direction of travel: outbound, on 443, to a domain that reads like developer infrastructure. There is no inbound connection to block and no unusual port to notice.

## What to do

- **Tell people the rule, not the indicators.** No legitimate website, CAPTCHA or error page ever asks you to paste a command into a terminal. That single sentence defeats the entire technique and does not expire when the lure changes.
- **Restrict who can run PowerShell interactively.** Most staff have no reason to.
- **Enable PowerShell script block logging** if it is off. This chain is invisible without it.
- **Watch for LockScreenContentServer.exe outside its normal path**, and for dui70.dll loaded from a user-writable directory.
- **Look for outbound WebSocket connections to unfamiliar developer-sounding domains.** The tunnel is the thing worth catching, because it is the thing that scales.
- **Do not rely on the CAPTCHA looking wrong.** It is a copy of a real Cloudflare page.

## What is not established

- **How the websites serving the fake CAPTCHAs were compromised.**
- **Who is behind it.** No attribution.
- **How many organisations were infected.** No figure.
- **Which sectors were actually hit**, beyond "multiple".
- **The campaign's timeline.** Not specified.`,
  },
  {
    slug: "19-browser-extensions-bought-then-turned-malicious",
    title:
      "Five of the 19 malicious extensions were bought from their original developers",
    excerpt:
      "Socket found 19 Chrome and Edge extensions draining wallets, harvesting hardware wallet seed phrases and stealing credentials. The operators wrote 14 of them and purchased the other five from previous owners — complete with existing users. Then they pushed an update, and Chrome installed it automatically.",
    categorySlug: "security",
    tags: [
      "browser-extensions",
      "chrome",
      "supply-chain",
      "cryptocurrency",
      "socket",
      "auto-update",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1605712916066-e143c317df72${P}`,
    body: `**Socket** researcher **Karlo Zanki** has identified **19** malicious browser extensions — **18** on Chrome, one on Edge — running what may be the same campaign since **February 2024**.

The largest, a right-click-unlocking utility, has around **80,000** users.

## The acquisition detail

**14** of the extensions were created by the operators. The other **5** were **purchased from their previous owners**.

Buying is the efficient half of the model. Building an extension and growing it to **80,000** users takes years of work that has nothing to do with crime, and buying one that already has them takes an email and a payment. Every existing user comes with it — along with the permissions they granted, the reviews they trusted, and the install base that makes the listing look safe to the next person.

There is no mechanism in any extension store that tells a user their extension changed hands.

## Then the update ships

The pattern is two-phase: publish something clean, or buy something clean, and push the malicious version later.

Socket's point about why this works is the important one — Chrome's default extension settings enable auto-updates, which gives the operator a powerful vector to maximise impact.

The user's security decision happened at install time. They read the description, checked the reviews, considered the permissions, and decided. The code that decision applied to was then replaced, automatically, by design, without anything being shown to them.

Auto-update is a genuinely good default. It is how security patches reach people who would never apply them. It is also, here, the delivery mechanism.

## What the extensions do

Sixteen distinct code modules, covering:

- **Multi-chain wallet draining**
- **Hardware wallet seed-phrase harvesting**
- Cryptocurrency exchange account theft
- Universal credential and form grabbing
- Social account theft, specifically **Facebook** and **LinkedIn**
- Browser history theft
- **ClickFix-style operating-system lures**

The seed-phrase item deserves attention. The entire premise of a hardware wallet is that the recovery phrase never exists on the computer. It does exist there for a few seconds during setup or recovery, and that is what this targets — the one moment the design assumes is safe.

The last item connects this to [the TerminalFix campaign documented this week](/article/terminalfix-clickfix-windows-terminal-reverse-tunnel): the same paste-this-command technique, delivered from inside a browser extension the victim installed themselves.

## What to do

- **Audit your extensions today** and remove anything you do not actively use. Every one is code running on every page you visit.
- **Check what each one can do**, not what it claims to do. Read on all sites is the permission that matters.
- **Treat a change of ownership as a reinstall decision** — except you will not be told, so the practical version is to re-audit periodically.
- **Never enter a recovery phrase into anything on a computer** that is not the hardware wallet's own interface.
- **On a machine holding crypto, run a separate browser profile** with no extensions at all.
- **If you had any of these installed, assume credentials are gone.** Rotate, and move funds from any wallet touched.

## What is not established

- **Who is behind it.** Explicitly unknown.
- **Whether the extensions have been removed** from the Chrome Web Store and Edge Add-ons.
- **How many users were actually affected**, as distinct from installed counts.
- **How much was stolen.** No figure.
- **Whether the February 2024 start date is firm** — Socket says the campaign *may* have been active that long.`,
  },
  {
    slug: "hookedge-batch-script-backdoor-webhook-site",
    title:
      "A state-linked backdoor for diplomats, written as a Windows batch file",
    excerpt:
      "HOOKEDGE polls webhook.site for command files, runs them, and posts the output back as HTML. No custom infrastructure, no compiled binary, no exotic protocol — a .cmd script and a free service anyone can sign up for. Recorded Future ties it to APT28 with moderate confidence, and says so.",
    categorySlug: "security",
    tags: [
      "apt28",
      "espionage",
      "backdoor",
      "recorded-future",
      "attribution",
      "diplomacy",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1638864616275-9f0b291a2eb6${P}`,
    body: `**HOOKEDGE** is a Windows backdoor used against government and diplomatic organisations in **Romania**, **Spain** and **Türkiye** between late **September 2025** and early **April 2026**.

It is a **batch script**.

## What it actually does

It polls. At intervals it fetches a **.cmd** payload from a staging webhook, executes it, and returns the output by writing an **HTML** file back to a webhook URL.

That is the entire command-and-control design. No custom protocol, no encrypted beacon format, no compiled implant — a scheduled fetch of a text file from **webhook[.]site**, a free service anyone can sign up for in a browser.

**Recorded Future's Insikt Group** notes that abusing webhook.site for staging, command-and-control and exfiltration lets the activity blend with regular traffic while removing the need to stand up dedicated infrastructure at all.

## Why boring is the point

There is a persistent assumption that state-sponsored means technically elaborate. This is the counter-example, and it is more instructive than a clever one would be.

A batch file is not scanned like an executable. Traffic to a legitimate webhook service is not blocked, because plenty of real software uses it. There is no attacker-controlled domain to add to a blocklist, no infrastructure to seize, and nothing to reverse-engineer beyond a few lines of readable script.

Sophistication here means **choosing the thing that generates no signal**. Every design decision trades capability for invisibility, and against a diplomatic target that trade is obviously correct.

## The operational tells

Three details show a team paying attention:

- **Two-stage targeting.** High-value victims receive a second-stage payload with beaconing intervals as short as **five minutes**, keeping initial-access infrastructure separate from active collection.
- **Anti-forensics.** The installer deletes itself, its launcher files and the task definitions once installed.
- **Adaptation.** Operators **removed the document-open canaries** that had been capturing victim IP addresses, apparently to reduce network-visible indicators.

That last one means somebody read the detection writeups and changed the tooling in response. The canary was useful to them and they gave it up because it was noisy.

## The delivery is a macro. In 2026.

HOOKEDGE arrives as a **macro-enabled Word document** with a diplomatic lure. The victim clicks **Enable Content** to see the contents, and the macro writes **six** files into the user profile directory and starts the chain. Early variants impersonated **Spanish government** material.

Macro-enabled documents from the internet have been blocked by default in Office for years. This still works, which means the documents are reaching people through channels where that block does not apply, or being opened by people who cleared the warning.

## On the attribution, and the word Recorded Future used

Insikt Group attributes this to **APT28** — also called Fancy Bear or Forest Blizzard, and tracked internally as **BlueDelta** — with **moderate confidence**.

That qualifier is doing real work and most coverage will drop it. The basis given is significant code and tradecraft overlap between HOOKEDGE and **HEADLACE**, a modular Windows backdoor deployed against diplomats since April 2023, with both sharing core architecture and identical webhook.site abuse patterns.

Shared code and shared tradecraft are good evidence. They are not proof, because tooling is shared, sold and copied, and this site has spent the month arguing that [attribution offered early and confidently is exactly what a false flag is designed to exploit](/article/uk-power-plant-four-day-shutdown-attribution-not-confirmed). Recorded Future has stated its confidence level honestly. Reporting it as "Russia did it" would be a claim the researchers did not make.

## What to do

- **Block macro-enabled documents from external sources**, and check that the policy actually applies to the paths documents arrive by.
- **Alert on outbound traffic to webhook.site** and similar request-bin services. Legitimate use exists; it should be a known, short list.
- **Hunt for unexpected .cmd execution** and for scheduled tasks created and then deleted.
- **Look at the user profile directory** for clusters of files written together.
- **Do not tune detections to the file format.** The technique survives the batch script being replaced with anything else that polls.

## What is not established

- **Initial infection vectors** beyond the macro-enabled documents.
- **What was actually taken** from any target.
- **Whether any victim detected or stopped the intrusion.**
- **The full capability set** beyond command execution and data return.
- **Encryption and obfuscation details** of the communications.`,
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
