/**
 * Drafts the second 3 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-84.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-84.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-84.ts --update
 *
 *   1. Antino and UAT-11587 (security). Cisco Talos, 2 October. The backdoor
 *      never contacts attacker infrastructure: it polls an Outlook mailbox and
 *      drops files in OneDrive, both through Microsoft Graph, so the traffic
 *      goes to a host every Microsoft 365 customer already allows.
 *   2. GitLab AI Gateway CVE-2026-90970 (security). Fixed 2 October. A prompt
 *      template that escapes into the host, which is server-side template
 *      injection with a new place to live.
 *   3. Operation KillSwitch (security). The Hamburg-led takedown of KillSec.
 *      The age of the administrator is the headline; the service model is the
 *      reason a 16-year-old could hold that job at all.
 *
 * Primary sources: Talos's own write-up, GitLab's advisory as reported with
 * the NVD classification, and the Europol and Hamburg police account. The
 * arrested are suspects and are not named here.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - Antino: a Microsoft 365 launcher with Outlook and OneDrive on it.
 *   - GitLab: code on a dark editor, with no other company's product in frame.
 *   - KillSec: a police light bar at night, carrying no force's name.
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
    slug: "antino-uat-11587-the-backdoor-polls-outlook-every-ten-seconds-and-leaves-its-files-in-onedrive",
    title:
      "The backdoor never calls home: it checks an Outlook mailbox every ten seconds and leaves what it steals in OneDrive",
    excerpt:
      "Cisco Talos has published a China-nexus campaign that put a Rust backdoor on roughly 350 machines across eight Asian countries. Antino's command channel is Microsoft Graph — commands arrive as mail, stolen files go to OneDrive. Every packet it sends goes to a host the victim's own allow-list already trusts.",
    categorySlug: "security",
    tags: [
      "cisco-talos",
      "uat-11587",
      "antino",
      "microsoft-graph",
      "onedrive",
      "dll-sideloading",
      "espionage",
      "living-off-trusted-sites",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1649433391420-542fcd3835ea${P}`,
    body: `**Cisco Talos** published research on **2 October 2026** on a cluster it tracks as **UAT-11587**, which it assesses with high confidence to be **China-nexus**. Between **September 2025 and July 2026** the group reached at least **16 institutional environments** across **eight Asian countries** — Taiwan, India, the Philippines, Cambodia, Pakistan, Thailand, Myanmar and Syria — and compromised roughly **350 endpoints**.

The targets are governments, policy bodies and national security organisations. The tool is a Rust Windows backdoor called **Antino**. The interesting part is not what it can do, which is ordinary. It is where it sends its traffic.

## The command channel is Microsoft

Antino communicates exclusively through the **Microsoft Graph API**, authenticating with an OAuth 2.0 client-credentials flow. It has two halves.

**OneDrive** is the dead drop. On first execution the implant writes a heartbeat JSON file into a path under its own name, and resends it **every minute**. Stolen files go into a separate downloads folder in the same account.

**Outlook** carries the conversation. The implant pulls commands from a mailbox folder the operator controls **every ten seconds**, matching messages by a subject line that embeds the session identifier, and writes its replies back the same way.

Ten seconds is the number to sit with. A dead drop is normally a slow channel — check in hourly, take what is there. At ten seconds the operator types a command and sees output before they have finished reading the last one. It behaves like a shell while looking like a mailbox.

## Why this defeats network detection

Most intrusion detection at the network layer answers one question: is this host talking to somewhere it should not be? Reputation lists, newly registered domains, unusual destinations, traffic to a server in a country with no business relationship.

Antino never triggers any of it. Its traffic goes to Microsoft's Graph endpoint over TLS — the same destination used by Outlook, Teams, the file sync client and every other part of Microsoft 365. An organisation that uses Microsoft 365 cannot block it, cannot treat it as anomalous by destination, and cannot inspect it without breaking the rest of the platform.

The same thinking runs through the delivery. The final stage sideloads the backdoor by launching **GatherOsState.exe**, a legitimate Microsoft-signed binary from the Windows ADK, which loads a malicious DLL sitting beside it. The process that starts is signed by Microsoft. The network destination is Microsoft. The storage is Microsoft.

Nothing here is a vulnerability. It is a campaign built entirely out of the things a defender has already decided to trust.

## The way in was still a phishing email

For all the sophistication downstream, the front door is familiar.

Talos describes spear-phishing with decoys tailored to geopolitical topics the recipient cares about, sent from addresses exploiting sender-domain misalignment to look like trusted organisations. One detail stands out: the attackers reproduced **Gmail's attachment interface** inside the message using base64-encoded images, so the recipient saw what looked like a native attachment and clicked through to a file hosted on **Cloudflare Pages**.

That is a picture of a button, not a button. The staging then runs through Cloudflare and Amazon CloudFront — more infrastructure nobody blocks.

Microsoft's own figures this week put [user execution at 30 percent of observed initial access](/article/microsoft-digital-defense-2026-under-a-day-to-weaponise-and-up-to-sixty-to-patch). This campaign is what that statistic looks like from the inside: five stages of staging, in-memory loading and signed-binary abuse, all of it waiting on one person clicking a picture of an attachment.

## What Antino does once it is there

The capability list is deliberately unremarkable: command execution through cmd and PowerShell, host reconnaissance, file upload, download and listing, and in-memory shellcode loading. Persistence is a registry Run key. Evasion comes from hooking Sleep and VirtualAlloc, which is aimed at memory scanners rather than at the network.

An espionage implant does not need more than this. It needs to stay, read, and send — for eleven months, in this case, across 350 machines.

## What to do

- Treat Graph API traffic as data, not as background noise. Sign-in and audit logs for the tenant will show an application authenticating with client credentials, and that is the detection surface this campaign actually leaves.
- Alert on the sideload, not the destination. A Microsoft-signed binary from the Windows ADK running outside its install path, loading a DLL from the same folder, is abnormal on an ordinary workstation.
- Check for the registry Run persistence and for the folder structure Talos documents in the implant's OneDrive paths. Those are specific, and Talos published them.
- Reconsider what your allow-list means. Cloudflare Pages, CloudFront and graph.microsoft.com are all permitted on the assumption that the destination implies the content. In this campaign the destination is the disguise.

## What is not established

- Who UAT-11587 works for. Talos assesses China-nexus with high confidence and intelligence gathering with moderate-to-high confidence, and names no sponsor.
- Whose OneDrive and Outlook tenant was used, and whether those accounts were created by the actor or stolen.
- What was taken from the 350 endpoints, and whether the 16 environments knew before the publication.
- Whether the shared infrastructure overlaps Talos notes connect this to another known group. It puts low confidence on those links.`,
  },

  {
    slug: "gitlab-ai-gateway-cve-2026-90970-a-prompt-template-that-escapes-into-the-host",
    title:
      "GitLab's AI gateway let a prompt template run commands on the server, which is server-side template injection with a new place to live",
    excerpt:
      "CVE-2026-90970 scores 9.9. A user with access to GitLab Duo's agent platform could write a flow configuration that broke out of the prompt-template sandbox and executed commands on the host. The bug class is twenty years old. What is new is that letting users write templates is now a product feature.",
    categorySlug: "security",
    tags: [
      "gitlab",
      "cve-2026-90970",
      "gitlab-duo",
      "template-injection",
      "jinja2",
      "ai-security",
      "self-hosted",
      "remote-code-execution",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1732017968601-f46d9badf229${P}`,
    body: `**GitLab** shipped fixes on **2 October 2026** for **CVE-2026-90970**, a **9.9** in the **AI Gateway** — the service that sits behind GitLab Duo and talks to the models. An authenticated user with access to the **Duo Agent Platform** could supply a crafted flow configuration, escape the prompt-template sandbox, and run arbitrary commands on the machine hosting the gateway.

Fixed releases are **19.2.4**, **19.3.2** and **19.4.1**. Affected are **18.1.6** up to 19.2.4, **19.3** up to 19.3.2, and **19.4** up to 19.4.1. GitLab's own hosted gateway was never exposed; this is a self-hosted problem.

## The bug is older than the product

The NVD files it under **CWE-1336**: improper neutralisation of special elements used in a template engine. That is server-side template injection, and it has been a known class since long before anyone built an AI gateway.

The mechanism is always the same. A template engine exists to evaluate expressions and substitute values. If a string an attacker controls reaches the engine as template source rather than as data, the attacker is no longer supplying a value — they are supplying code the engine will run. Jinja2, the engine family involved here, is particularly rich in ways to walk from an innocuous object back to the Python runtime, which is why it ships a sandbox and why that sandbox has a long history of being escaped.

GitLab's flow configuration is user-supplied and was not sufficiently sanitised before reaching the engine. From there the path to command execution on the host is a well-trodden one.

## What is new is where it lives

The reason to write about this rather than file it is that the condition which makes template injection possible has gone from an implementation mistake to a product requirement.

Letting users write prompt templates is the feature. An agent platform that does not let teams define their own flows, with their own placeholders filled from their own context, is not an agent platform. So the product deliberately accepts user-authored template source, deliberately evaluates it on the server, and places a sandbox between the two.

Which means the sandbox is now load-bearing in a way it was not when template injection was simply a bug. Every AI platform offering custom prompts, custom flows or user-defined agents has made the same architectural bet, and most of them are betting on the same handful of engines with the same escape literature behind them.

## Authenticated is not reassuring here

The score stops at 9.9 rather than 10 because the attacker needs an account with Duo Agent Platform access. On a self-hosted GitLab that is a weaker constraint than it sounds.

Self-hosted GitLab is where an organisation's source code lives, and its user list is every developer, plus contractors, plus whatever automation holds a token. Duo access tends to be granted broadly, because the point of buying it is that people use it.

What sits on the other side matters more. The AI Gateway runs inside the environment that holds repositories, CI runners and the secrets those runners inject. Command execution there is not a foothold on a peripheral service. It is a foothold in the build system, which is the shortest path from one compromised developer account to everything that organisation ships.

This is the second GitLab flaw we have covered in weeks, after [the request that read any file on the server](/article/gitlab-cve-2026-85706-one-request-reads-any-file-on-the-server). Different mechanism, same lesson about where the platform sits.

## No exploitation reported, which is the window

Nothing published says this is being exploited. That is the useful part of the timing rather than a reason to wait.

Microsoft's report this week puts the median time from a vulnerability being discovered to being weaponised [well below 24 hours](/article/microsoft-digital-defense-2026-under-a-day-to-weaponise-and-up-to-sixty-to-patch), against 30 to 60 days of typical enterprise remediation. A 9.9 with a public advisory, a named bug class and a well-documented exploitation path for that class is not a flaw anyone should expect to stay theoretical for a month.

## What to do

- Upgrade the gateway to 19.2.4, 19.3.2 or 19.4.1 depending on your branch. If you run GitLab's hosted AI Gateway, there is nothing to do.
- Until you have, review who holds Duo Agent Platform access and remove what is not being used. The vulnerability needs an account, and that is the one variable you control today.
- Check what the gateway host can reach. If it shares a network with CI runners or can read runner secrets, the blast radius of a command execution bug there is your whole pipeline, and that is worth fixing independently of this CVE.
- Look at your own custom flow configurations. The patch fixes the sanitisation; it does not tell you whether anyone wrote something unusual before it landed.

## What is not established

- Whether the flaw has been exploited. No reporting says so, and GitLab has not described any.
- Who found it and how, which GitLab has not detailed publicly in what has been reported.
- The exact escape technique used against the sandbox, which has not been published.
- Whether the same pattern affects other parts of the Duo stack that accept user-authored templates.`,
  },

  {
    slug: "killsec-operation-killswitch-110-terabytes-five-servers-and-a-sixteen-year-old-administrator",
    title:
      "Police took five servers and 110 terabytes from KillSec, and the administrator they arrested is sixteen",
    excerpt:
      "Operation KillSwitch, led by Hamburg police with Europol and Eurojust, searched eight properties in four countries on 30 September and made three arrests. The suspected administrator is a 16-year-old Romanian national detained in Alicante. The age is the headline; the service model is why that job could be held by a teenager.",
    categorySlug: "security",
    tags: [
      "killsec",
      "ransomware",
      "europol",
      "law-enforcement",
      "double-extortion",
      "takedown",
      "ransomware-as-a-service",
      "data-leak-site",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1631312704318-6158658746cc${P}`,
    body: `On **30 September 2026**, officers searched **eight properties** across **Greece, Romania, Spain and the United Kingdom** and provisionally arrested **three people**. The investigation, **Operation KillSwitch**, was led by **Hamburg police and prosecutors** with support from **Europol** and **Eurojust**, and involved ten agencies across Europe and the United States.

The target was **KillSec**, an extortion operation linked to around **1,000 suspected attacks** worldwide, of which roughly half are assessed as successful. Authorities took control of **five servers**, seized the group's leak site, secured at least **110 terabytes** of stolen data, and redirected its domains to a seizure notice.

The suspected administrator is **sixteen**, a Romanian national arrested in Alicante.

## The age is not the interesting part

It is the part every headline led with, and it is worth getting past quickly.

A 16-year-old can run an extortion brand because running an extortion brand is largely administrative work. KillSec operated on the familiar service model: a platform, a leak site, a negotiation process, and affiliates who carry out the intrusions and share the proceeds. The person at the centre approves victims, manages the site, handles payments and keeps the affiliates in line.

None of that requires the skills the word hacker implies. It requires availability, nerve and a tolerance for administering a business whose customers are criminals. That job description has been within reach of a capable teenager for years, and this is not the first case to show it.

What the age does tell you is something about recruitment. A group founded in late 2023 that reached a thousand attempts in under three years did not need a state, a budget or a decade of tradecraft. It needed a website and people willing to use it.

## Why the arrests matter more than the servers

Takedowns that seize infrastructure and stop there have a poor record. Hosting is rented, domains are cheap, and a leak site is a static page with a payment flow behind it. Groups have come back within weeks.

Group-IB's chief executive put the distinction plainly after this operation: servers can be replaced in weeks, and the people who build the platform cannot. That is the argument for an operation that spends its effort on identification across four jurisdictions rather than on a single hosting provider.

Three arrests against a group linked to a thousand attacks still leaves most of its affiliates working, and that is where the honest uncertainty sits. An affiliate model distributes the people along with the revenue, so the ones who carried out the intrusions are not the ones now in custody.

## 110 terabytes is the uncomfortable number

The seizure of 110 terabytes reads as a win, and in the narrow sense it is: that data is no longer being sold or published, and the leak site that was pressuring victims with it is gone.

It is also a measurement of how much had already been taken. Every one of those bytes left somebody's network. Each organisation in that pile was extorted, whether or not it paid, and whether or not it ever told anyone.

KillSec's targets were concentrated in **financial services** and **healthcare**, with government bodies and large enterprises alongside. Those are the sectors where stolen records have the longest useful life to a buyer and the longest consequence for the person the record describes. Group-IB has documented stolen data from this ecosystem offered between five thousand and five hundred thousand dollars.

The data being in police custody does not undo the breach. It changes who holds the copy.

Our reading of [Zscaler's figures on data theft this year](/article/zscaler-threatlabz-2026-attacks-up-275-percent-named-victims-down-3-percent) describes the same shift from a different angle: extortion has moved away from encryption and towards taking the files, because taking the files works on organisations that have good backups.

## What to do

- If you were a KillSec victim, the seizure changes your disclosure position, not your obligations. The data left your network, and notification duties run from that, not from whether it was ever published.
- Check whether your organisation appears in the seized material through the usual national CERT channels rather than by searching for the leak site, which is now a law-enforcement page.
- Do not read a takedown as a reduction in risk. The affiliates who carried out these intrusions used ordinary access routes, and those routes are unchanged this week.
- Treat the service model as the thing to defend against, not the brand. KillSec's name is gone; the affiliates, the tooling and the double-extortion playbook are not attached to it.

## What is not established

- What the three arrested people will be charged with, and in which jurisdictions. They are suspects, and two of the three have not been described beyond nationality and age.
- How many affiliates operated under KillSec, and whether any are among those detained.
- Which organisations are in the 110 terabytes, and whether all of them have been told.
- Whether the operation has ended the group or displaced it. That is answered in months, not in a press release.`,
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
