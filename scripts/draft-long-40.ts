/**
 * Long-form drafts — 1 September 2026.
 *
 * Correction note on the Aurora piece: the source article describes Cursor as
 * "SpaceX's AI-powered coding assistant". It is not. Cursor's own terms of
 * service name Anysphere, and SpaceX appears on cursor.com as a customer logo,
 * which is the likely origin of the mistake. A summariser then offered a third
 * answer, Anthropic, also wrong. Verified against Cursor's own site before
 * writing, and the article states the correct maker and flags the error,
 * because that description is going to be syndicated.
 *
 * Disclosure note on the Compliance API piece: this session is a Claude Code
 * local session. Its transcript is exactly what those endpoints expose. The
 * article says so.
 *
 * Provenance note on the same piece: the source reads as vendor-contributed —
 * it carries one company's product framing and its discovery statistic. That is
 * said plainly rather than laundered into neutral reporting.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts picks one paragraph per section
 * by score — standalone digits and length win, opening on a back-reference
 * loses. The paragraph that answers each heading is written to win.
 *
 * Cover note: all three downloaded and viewed. An aurora photograph was
 * rejected for the Aurora piece — the name matches, but a pretty sky over a
 * ransomware story is a tonal mismatch.
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
    slug: "aurora-ransomware-cursor-planning-cis-exclusion",
    title:
      "The ransomware crew wrote its targeting rule into a prompt: plan the attack, skip anything in the CIS",
    excerpt:
      "Aurora used the AI coding assistant Cursor to plan intrusions in Russian — AD CS exploitation, NTLM relay, domain enumeration — while instructing it to exclude CIS address ranges and domains. More than 20 organisations across nine countries between April and July. Also: Cursor is made by Anysphere, not SpaceX, whatever you are about to read elsewhere.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "aurora",
      "cursor",
      "ai-assisted-attacks",
      "active-directory",
      "cloudsek",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1757820470004-fe7d9f6d57a9${P}`,
    body: `**Aurora**, also written **Aur0ra**, is a Russian-speaking ransomware-as-a-service operation. Per **CloudSEK**, it targeted more than **20** organisations across **nine** countries between **April and July 2026**. Four appear on its leak site. **Gambit Security** separately documented **10** targets between **8 April** and **21 May**.

What makes it worth writing about is how the operators worked.

## The targeting rule lives in a prompt now

Aurora used **Cursor**, an AI coding assistant, to plan attacks **in Russian** — and instructed it to **exclude CIS address ranges and CIS-country domains**.

Read that as an operational document. Avoiding targets in the Commonwealth of Independent States is the oldest rule in Russian-speaking cybercrime, because prosecution follows victims at home and does not follow victims abroad. It has historically been implemented in code: a keyboard-layout check, a locale check, a hardcoded list of country codes that makes the ransomware exit quietly.

The rule did not change; its **medium** did — from a compiled check a reverse engineer can find in the binary, to a sentence typed to an assistant in a chat log nobody outside ever sees. For **10 years** the CIS check has been one of ransomware analysis's most reliable classification signals, and it is now moving out of the artefact.

That is a quiet loss for defenders, and not one that shows up in a detection rule.

## What they had it do

The agent was tasked with **network scanning**, **domain enumeration**, **NTLM relay** attempts, certificate attacks and planning **Active Directory Certificate Services** exploitation. None of that is novel tradecraft. What the assistant changes is the floor: an affiliate who could not previously chain those steps together now can, because the planning has been delegated.

AD CS abuse is well documented — [CISA's red team used the same class of misconfiguration against a government organisation this month](/article/cisa-tale-of-two-socs-aa26-237a-red-team).

The pattern matches [the command-and-control framework with a natural-language front end that sells for $99.99](/article/redc2-4-npm-packages-llm-red-agent-99-dollars). The capability is not new. The number of people who can operate it is.

**Reuters** has named victims including Christeyns, Teckentrup, the Helideck Certification Agency and Bayou Title, alongside an Argentine pharmaceutical distributor and an Italian manufacturer.

## A correction you are going to need

Widely-syndicated coverage of this story describes Cursor as **SpaceX's** AI-powered coding assistant. It is not: **Cursor is made by Anysphere**, the company named throughout Cursor's own terms of service. SpaceX appears on cursor.com as a **customer**, on the logo wall, which is almost certainly where the error came from.

A separate summary of the same article offered a third answer, Anthropic, which is also wrong. Two independent descriptions of one fact, both incorrect, on a detail anyone can verify in thirty seconds.

We checked before writing, because that sentence is about to be copied into a lot of articles, and a ransomware story that misattributes the tool to a rocket company is the kind of error that outlives the reporting.

## What to do

- **Do not treat CIS exclusion as a reliable classifier any more.** If the check has moved into the planning stage, it may not appear in the sample at all.
- **Prioritise AD CS.** Misconfigured certificate templates are among the most reliably abused paths into a domain, and they are fixable.
- **Assume the floor has dropped.** Defences calibrated to what an unsophisticated affiliate could previously manage are calibrated to the wrong thing.
- **Watch for NTLM relay** and disable NTLM where you can.

## What is not established

- **How Cursor was obtained or accessed**, or whether any terms were circumvented.
- **Whether the AI planning materially improved outcomes**, as distinct from being used.
- **Which sectors** were targeted. Not stated.
- **Why the CloudSEK and Gambit Security counts differ** — different windows and methodologies, but the overlap is not described.
- **Any response from Anysphere.** None reported.`,
  },
  {
    slug: "valleyrat-signed-adware-antivirus-exclusion-list",
    title:
      "The malware did not disable your antivirus. You did, to stop it complaining about the wallpaper app",
    excerpt:
      "ValleyRAT is hiding inside QN Wallpaper, a genuine signed Chinese desktop app that bundles adware. Because the adware trips antivirus, users add it to the exclusion list — and the backdoor rides in through the hole they made. Kaspersky counted over 100,000 detections across 1,500-plus users, mostly in China and India.",
    categorySlug: "security",
    tags: [
      "valleyrat",
      "silver-fox",
      "kaspersky",
      "dll-side-loading",
      "antivirus",
      "adware",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1758799011811-15607e91e9fa${P}`,
    body: `**Kaspersky** has documented a campaign delivering **ValleyRAT** — also tracked as **Winos 4.0** — through **QN Wallpaper**, a real Chinese desktop application that bundles partner software and shows advertising banners.

Over **100,000** detections, affecting more than **1,500** unique users, predominantly in **China** and **India**, across 2026.

## The delivery mechanism is a decision the victim made

QN Wallpaper is adware. Not malware — adware. It is annoying, it bundles things nobody asked for, and antivirus products flag it accordingly.

So users **add it to their exclusion list** to stop the warnings. Kaspersky's own advice is the direct inverse: avoid adding such software to your security solutions' exclusion lists, because that is the pathway.

This is the sixth version of the same story this site has written in a month, and it is the worst one. [SPECTRE unlinked EDR callbacks](/article/uat-10147-spectre-implant-170000-urls-old-cves). [A signed driver could delete Defender at boot](/article/defender-btr-sys-boot-time-removal-golden-window-no-patch). [Weedhack set its own Defender exclusions](/article/weedhack-fake-minecraft-clients-seo-poisoning-defender-exclusions). [PaperCut attackers deleted the logs](/article/papercut-zero-day-missing-logs-are-the-indicator).

In every one of those the attacker had to do something. Here the attacker does nothing. **The user removes the protection themselves, in advance, for a good reason** — the alert was genuinely a false positive about genuinely annoying software — and the malicious payload arrives later through the exemption already granted.

You cannot patch that, and awareness training that says "do not add exclusions" collides with a user whose machine keeps interrupting them.

## How it runs

The signed **QnWallpaper.exe** loads a malicious **libcef.dll** placed in the same directory — **DLL side-loading**, the same technique behind [Sleepwalker](/article/sleepwalker-backdoor-magic-packet-no-outbound-traffic) and [TerminalFix](/article/terminalfix-clickfix-windows-terminal-reverse-tunnel) this month.

The signature on the executable is genuine. The application is genuine. Only the library beside it is not, and the operating system will happily let a trusted process load it.

## What ValleyRAT does once in

- Captures **keystrokes and clipboard contents**, takes screenshots
- Delivers additional malicious modules
- **Disables Windows Defender** through registry modification
- Persists via autorun entries
- Escalates privilege using **runas**
- **Flags itself as a critical process**, so that terminating it crashes the machine

That last one is the detail worth noticing. It is not a defence against detection — it is a defence against **removal**. An analyst who finds it and kills the process takes the system down, which buys the operator time and makes a nervous administrator hesitate.

**Silver Fox** is the attributed actor, based on geographic distribution and payload analysis. Kaspersky has previously tracked the group in tax-themed operations against organisations in India and Russia.

## What to do

- **Audit your exclusion lists.** Not for malware — for software somebody excluded to stop the noise. That list is an inventory of your intentional blind spots.
- **Do not exclude an application; exclude nothing.** If a program cannot run without an exemption, that is information about the program.
- **Remove bundled adware rather than silencing the alert.** The alert was correct.
- **Check for libcef.dll in unexpected directories**, and for a QN Wallpaper install nobody remembers.
- **If a process cannot be terminated without a crash, treat that as the finding**, not as an obstacle.

## What is not established

- **How many of the 1,500 users came in through this specific route**, as distinct from other ValleyRAT delivery.
- **Whether the signing certificate was compromised or fraudulently obtained.** Kaspersky does not say.
- **Attack success rates.**
- **Whether QN Wallpaper's publisher is aware or involved.** Nothing reported either way.`,
  },
  {
    slug: "claude-code-compliance-api-what-it-cannot-see",
    title:
      "Anthropic will now hand your security team the transcript — including every page the agent read",
    excerpt:
      "Three new Compliance API endpoints expose Claude Code local session metadata and full transcripts: prompts, bash commands, file reads and writes, MCP calls. It closes a real visibility gap. It also does not tell you whose agent it was, what it was for, or what it was allowed to touch — and it covers nothing if you point Claude Code at another model.",
    categorySlug: "ai",
    tags: [
      "claude-code",
      "anthropic",
      "compliance",
      "ai-governance",
      "logging",
      "identity",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1784482267781-8f09c82a67f4${P}`,
    body: `Disclosure first, as with [the prompt-injection piece](/article/claude-code-prompt-injection-refusal-became-the-exploit): **this site's research runs in a Claude Code local session**. The transcript these endpoints expose is, for us, the record of every page fetched and every command run to produce these articles.

## What shipped

On **11 August 2026**, Anthropic added three Compliance API endpoints covering local sessions: one listing session metadata, one returning a single session's metadata, and one returning **the transcript**.

The transcript logs three block types — **text**, **tool_use** and **tool_result** — which is to say, whatever is communicated to the model. In practice that means user prompts, **bash commands**, file reads and writes, and MCP calls.

Parsed, it also reveals which **MCP servers** were used (the tool names carry the server), which **Skills** were loaded (inferred from SKILL.md reads) and which **plugins** are present (from path conventions).

Before this, organisations running Claude Code on developer machines had limited visibility into what those agents were actually doing.

## Why local was the gap

Because that is where the agents are. One vendor puts local agents at **68.6%** of the AI agents it discovers in customer environments.

A cloud-hosted assistant is somebody else's audited surface. An agent on a developer laptop runs bash locally, holds whatever credentials that laptop holds, and reaches third-party services through MCP servers the organisation may never have inventoried. That was previously invisible to everyone except the developer.

## What it still does not tell you

The honest part, and the source is unusually clear about it: even with managed settings, the Compliance API and endpoint collection together, none of them captures the context of the enterprise.

Concretely:

- **A transcript is not an identity.** It does not connect the activity to the agent's owner, its purpose, its credentials, its permissions, or its access paths.
- **A static policy cannot tell legitimate from malicious.** A bash command that reads a secrets file looks the same either way, and only context distinguishes them.
- **Point Claude Code at a non-Anthropic model and you get no Compliance API coverage at all.** The visibility is a property of the vendor relationship, not of the tool.

That last one is worth dwelling on. The control is not a control on the software; it is a control on the service. It disappears the moment the software is used the way it also supports being used.

## The transcript is itself sensitive

Local session transcripts are stored on the endpoint for **30 days** by default.

That is a log containing prompts, file contents the agent read, and command output — on the same laptop the agent is running on, retained for a month. It is a useful audit trail and it is also a concentrated target, and it deserves the handling you would give any credential store.

For this site, that record would include every fetched page and every draft. Nothing dangerous, but it is not nothing, and anyone deploying this across an engineering team should think about who can read those files.

## Where the framing comes from

Worth flagging: the write-up that surfaced this reads as vendor-contributed. It carries a single company's product framing — identity as the control plane that turns endpoint and session data into enforceable AI agent security — and its own discovery statistic.

That does not make the technical description wrong; the endpoints exist and do what is described. It does mean the conclusion that you need an identity governance layer is the argument of a company selling one. The gaps it identifies are real. Whether the answer is a product is a separate question.

## What to do

- **Turn it on if you run Claude Code at any scale.** Visibility you do not have cannot be reasoned about.
- **Decide who can read the transcripts** before they accumulate, and shorten the retention if 30 days is longer than you need.
- **Do not mistake logging for control.** It records what happened; it prevents nothing, which is the same point [the prompt-injection research made about the Auto Mode classifier](/article/claude-code-prompt-injection-refusal-became-the-exploit).
- **Inventory your MCP servers.** The transcripts will tell you which ones are actually being used, which is likely to differ from what you approved.

## What is not established

- **Availability by plan or tier.** Not specified in the material available.
- **What the endpoints cost**, in rate limits or otherwise.
- **Whether transcripts can be centralised** by default or require endpoint collection.
- **How this interacts with local privacy expectations** for developers whose prompts are now readable by a security team.`,
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
