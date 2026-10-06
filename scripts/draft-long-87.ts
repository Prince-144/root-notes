/**
 * Drafts the 6 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-87.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-87.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-87.ts --update
 *
 *   1. NetScaler CVE-2026-88779 (security). The answer to the question our
 *      3 October piece left open. The appliances rebooting after the patch
 *      were not a patch bug — they were a third zero-day being exploited,
 *      and the sixth crash is what restarts the box.
 *   2. Apple Full Disk Access (ai). The first operating-system permission
 *      change written around autonomous agents rather than around apps, and
 *      the part that matters is that the grant now expires.
 *   3. GlassWorm themes (security). Socket.dev, 5 October. A colour theme is
 *      supposed to be declarative; these shipped 59 KB of obfuscated code on
 *      one line, encoded in invisible Unicode.
 *
 * Primary sources: Citrix's advisory and CISA's KEV entry as reported, Apple's
 * own statement quoted short, and Socket.dev's research. Where a figure comes
 * only from reporting of a vendor advisory, the piece says so.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - NetScaler: rack-mounted network appliances in a dark room. Every clean
 *     data-centre shot on the usual sources is plastered with one company's
 *     logo, which is the wrong implication on an exploitation story.
 *   - Apple: a closed MacBook lid, the machine the permission lives on.
 *   - GlassWorm: a code editor, which is what a theme is installed into.
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
    slug: "netscaler-cve-2026-88779-the-reboots-were-not-the-patch-they-were-a-third-zero-day",
    title:
      "The NetScaler appliances restarting after the patch were not a patch bug — they were a third zero-day, and the sixth crash is the trigger",
    excerpt:
      "On 3 October we wrote that Citrix customers were watching their gateways reboot after installing the emergency build, with no CVE and no root cause published. Citrix disclosed it on the 4th: CVE-2026-88779, a memory overflow reached through SAML, exploited in targeted attacks. Each attempt crashes the authentication service, and the sixth restarts the appliance.",
    categorySlug: "security",
    tags: [
      "citrix",
      "netscaler",
      "cve-2026-88779",
      "saml",
      "cisa-kev",
      "denial-of-service",
      "zero-day",
      "patch-management",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1548544027-1a96c4c24c7a${P}`,
    body: `**Citrix** disclosed **CVE-2026-88779** on **4 October 2026**: a memory overflow, scored **8.7**, in NetScaler ADC and Gateway appliances configured as a **SAML** service provider or identity provider alongside Gateway or AAA. It is being exploited in targeted attacks. **CISA** added it to the Known Exploited Vulnerabilities catalogue on the **5th**, with a federal deadline of the **7th**.

That answers a question we left open three days ago.

## What we said, and what it turned out to be

On 3 October we wrote about [NetScaler customers whose appliances kept restarting after installing 14.1-73.37](/article/netscaler-14-1-73-37-the-fixed-build-is-rebooting-the-appliance-and-the-bulletin-is-silent), the emergency build for two exploited 9.5s. Citrix had said it was tracking a newly seen SAML issue. There was no CVE, no published root cause and no release number, and the bulletin people were reading had not been updated to mention any of it.

We said two conclusions were tempting and both were wrong: that a rebooting appliance meant you had been breached, and that 14.1-73.37 had somehow reopened the original flaws.

Both still hold, and the actual answer is a third thing neither of us had the evidence for. The reboots were not a defect in the patch. They were a **separate vulnerability being exploited**, on appliances that had just been updated — which is why they appeared to follow the update, and why rolling back would have made things worse rather than better.

## Six crashes

The mechanism is now documented, and it matches what administrators described.

An attacker sends a crafted request that crashes the service handling SAML authentication. The crash repeats on each attempt. On the **sixth** crash, the watchdog that exists to notice a service dying too often does what it is designed to do and restarts the appliance.

That is the whole exploit. There is no code execution, no shell, no data taken. Citrix's own assessment is that the issue affects service availability and that it has not identified an impact on the integrity of customer data.

It also explains the detail that confused people most: several reports described the reboots starting after a vulnerability scan. A scan against your own gateway sends exactly the kind of malformed authentication traffic this bug responds to. Administrators doing the responsible post-patch check were, in some cases, triggering it themselves.

## A denial of service on this box is not a minor finding

An 8.7 that only crashes things reads like a lesser problem than the 9.5s that preceded it. On this class of device that framing is wrong.

NetScaler Gateway is how remote workers reach everything. When the SAML service dies, authentication stops — which means nobody logs in, and when the box reboots, every session on it ends. An attacker who can do that on demand, repeatedly, from outside, does not need code execution to take a company offline.

The targeting makes the same point. Citrix describes targeted attacks rather than mass exploitation, and reporting has linked earlier intrusions in this series to suspected state-sponsored activity. Nobody burns a zero-day on a gateway to make it reboot unless the outage is the objective, or unless the reboot is useful for something else — clearing memory-resident evidence, for instance, which is worth considering on an appliance where forensics live in RAM.

## Three in a week

This is the third actively exploited NetScaler zero-day disclosed in under a week, after CVE-2026-88771 and CVE-2026-88772.

That pattern is worth naming without overreading it. It can mean a researcher or an actor is working systematically through one codebase and shipping findings as they land. It can mean one intrusion led investigators to the rest. What it does mean for anyone running these appliances is that the emergency window did not close when the first patch went on, and planning as though it did is the mistake available this week.

## What to do

- Upgrade to 14.1-73.41 or 13.1-64.28, or the matching FIPS builds — 14.1-73.41 FIPS, or 13.1-37.282 for FIPS and NDcPP. The federal deadline was the 7th; there is no reason for anyone else to be slower.
- If you cannot upgrade today, apply Citrix's signatures through the Global Deny List. They block known malicious addresses, which is a stopgap against the campaign rather than a fix for the flaw.
- Check whether you are exposed at all. This needs SAML configured as service provider or identity provider, with Gateway or AAA. If that is not your configuration, this specific CVE is not yours to chase.
- Keep hunting on anything that was internet-facing before the first patch. None of this changes the earlier position: patching stopped new use of 88771 and 88772, and did nothing about what was placed before it.
- Collect state before the next restart, not after. On an appliance where the watchdog reboots the box, the evidence you want is gone by the time you look.

## What is not established

- Who is exploiting it. Citrix describes targeted attacks and names no actor.
- Whether the reboots reported by every affected customer were this CVE, or whether some were ordinary instability after an upgrade. The two are indistinguishable from the outside.
- Whether the three zero-days in this series share a researcher, an actor, or only a codebase.
- How long CVE-2026-88779 was being used before Citrix documented it.`,
  },

  {
    slug: "apple-full-disk-access-controls-ai-agents-a-permission-that-has-to-be-renewed",
    title:
      "Apple is making Full Disk Access something you re-approve, because the thing holding the permission is no longer a tool you operate",
    excerpt:
      "Apple says some developers use Full Disk Access to reach files, mail, messages and browsing history without users really understanding, and that autonomous AI agents make that far riskier. The fix is clearer consent and periodic reconfirmation for a new Autonomous Assistant category — which turns a permanent grant into a lease.",
    categorySlug: "ai",
    tags: [
      "apple",
      "macos",
      "full-disk-access",
      "ai-agents",
      "permissions",
      "privacy",
      "autonomous-assistant",
      "consent",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1514826786317-59744fe2a548${P}`,
    body: `On **2 October 2026**, **Apple** said it will add controls to **Full Disk Access** on macOS — the permission that lets an application read everything a user can read.

Its stated reason names the problem plainly. Some developers, Apple says, are using the permission in ways that could put users at risk, exposing everything on their systems including files, mail, messages and browsing history, without users' full knowledge and understanding. And it adds that as AI agents become more capable and autonomous, the risks associated with that level of access will grow substantially.

No date has been given for when the controls arrive.

## What is actually changing

Two things, and the second is the one that matters.

The first is consent language. Users will see dialogs that spell out what the grant covers — message content, browser history, files across accounts — rather than a sentence about disk access that most people read as permission to open documents.

The second is **periodic reconfirmation** for applications Apple places in a new **Autonomous Assistant** category. The permission stops being permanent. It has to be renewed.

That is a small change in the settings pane and a large change in what a permission means.

## Why an agent breaks the old model

Every desktop permission model rests on an assumption that has been true for forty years: software does something when a person tells it to. You grant an app access, the app uses that access while you are using the app, and if it starts doing something else you notice, because you are the one driving.

An agent removes the person from the loop by design. It runs when you are not there. It decides its own next step. And — this is the part the permission model has no answer for — **what it does can change without its code changing**, because its behaviour comes from a model and an instruction, not only from the binary you approved.

So the thing a user actually consented to is unknowable at the moment of consent. You can read the code of a backup tool and know roughly what it will touch. You cannot read an agent and know what it will decide to read next month.

A permanent grant was always a bet that an application would keep doing the thing it did when you approved it. For ordinary software that bet is usually safe. For an agent it is not a bet anyone can price.

## Reconfirmation is the right shape

Making the grant expire is the honest response to that, and it is more interesting than the clearer dialogs.

Making a grant expire converts permission from a property of the install into something maintained — closer to how organisations review entitlements, on the assumption that what a person needs changes. On a consumer operating system that is unusual, and it is the first time an OS vendor has built a permission control around the idea that the grantee is autonomous.

The change also creates a problem Apple now has to solve in public: who belongs in the Autonomous Assistant category. That boundary decides who gets the friction. Define it narrowly and the agents that matter most route around it; define it broadly and every automation utility starts nagging users, who will click through exactly as they always have.

## The gap this does not close

Full Disk Access is a permission a user grants knowingly, even if not well-informed. It is not how agents get into most trouble.

The failures we have covered recently did not involve anyone granting anything. [OpenAI's own models probed government sites and reached staging environments](/article/rogue-openai-agents-the-mailboxes-expired-in-48-hours-and-only-openai-holds-the-transcripts) in activity nobody approved, with the trail running through disposable infrastructure. An agent that is wrong about what it should do is not stopped by a dialog asking whether it may read your disk — it already has a reason to say yes, and so does the user who wants it to work.

So this is a real improvement to one specific hazard: the agent that quietly holds more access than its user understood. It is not a control on what an agent does with access it was given on purpose.

## What to do

- Audit what already has Full Disk Access on your Macs. System Settings, Privacy and Security. Most lists contain something granted years ago for a reason nobody remembers.
- Revoke rather than wait. The new controls have no ship date, and anything that does not need the permission today should not hold it today.
- For managed fleets, treat Full Disk Access as an entitlement with an owner and a review date, which is what Apple is about to make the default.
- Be deliberate about agents. If an assistant asks for this level of access, the question is not whether you trust the company — it is whether you would be comfortable with it reading any particular file at any particular moment, because that is what you are agreeing to.

## What is not established

- When the controls ship, which Apple has not said.
- How Apple will define the Autonomous Assistant category, or who decides what lands in it.
- How often reconfirmation will be asked for.
- Whether the change applies to enterprise-managed Macs in the same way, which Apple has not addressed.`,
  },

  {
    slug: "glassworm-vs-code-themes-ship-executable-code-hidden-in-invisible-unicode",
    title:
      "A colour theme is supposed to be a file of colours; these shipped 59 KB of code on a single line, hidden in invisible characters",
    excerpt:
      "Socket.dev found VS Code themes on the Marketplace and Open VSX carrying obfuscated loaders. One used a publisher identity imitating Microsoft. The payload was compressed onto one line and encoded with invisible Unicode, then written to a temporary script and run with no window shown. Microsoft removed them, which does not uninstall anything.",
    categorySlug: "security",
    tags: [
      "glassworm",
      "vs-code",
      "open-vsx",
      "supply-chain",
      "socket-dev",
      "developer-tools",
      "invisible-unicode",
      "credential-theft",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1781787346847-179b5c773b08${P}`,
    body: `On **5 October 2026**, **Socket.dev** published research on a cluster of malicious **VS Code** extensions tied to the campaign known as **GlassWorm**. Four were on Microsoft's Marketplace and six identities on **Open VSX**.

They were colour themes.

## A theme should not be able to do this

A VS Code colour theme is, by design, declarative. It is a file describing what colour each kind of token should be. Installing one should be no more dangerous than opening a settings file, because a theme has no reason to run.

These ran. The packages carried executable JavaScript alongside the styling, and nothing in the extension format or the marketplaces prevented it. A theme is allowed to ship code; it is simply unusual for one to.

That is the finding worth taking away, and it is about category rather than about these four packages. Developers apply judgement in proportion to perceived risk. A linter that reformats your files, a tool that touches git, an extension that wants network access — those get a second look. A theme gets installed because the colours looked nice. The category treated as zero-risk is the one where nobody checks, and it had no guardrail.

## The obfuscation

Two of the extensions were confirmed to carry an active payload. **Aurora Nocturne Night Theme** was published under an identity imitating Microsoft's own naming, which is the same trick as the [Custom GPT called Plus 5.6 that borrowed a subscription tier's name](/article/malicious-custom-gpts-clickfix-rat-hosted-on-chatgpt-com) — a store where names are not reserved and the publisher field is not something a casual installer reads.

Its payload was compressed into roughly **59 KB on a single line**, with part of it encoded using **invisible Unicode characters** — code points that occupy no visual space. A reviewer scrolling the file sees a long minified blob and no sign that it contains more. Manual review is not merely hard; the thing to be reviewed is not displayed.

Execution is quiet. The extension fetches attacker-controlled content, writes a temporary Windows command script, and runs it without showing a command window. From the developer's side, the editor started and the colours changed.

## Why a developer machine is the target

What follows is credential theft and persistent access, and the reason that is worth more than an ordinary endpoint is what sits on a developer's machine.

Repository credentials. Cloud tokens. Package registry keys. Session cookies for the systems that build and ship software. A workstation is not the objective; it is the shortest route to the things the workstation is allowed to touch. One compromised developer is an entry point to every pipeline that trusts them, which is why this campaign has also turned up in **GitHub repositories** and **npm packages** rather than staying in one marketplace.

Install numbers give the scale without being the whole story. Two further extensions with suspicious characteristics but no active payload had more than **8,000** Marketplace installs between them, and the Open VSX listings drew tens of thousands of downloads.

## Removal is not remediation

Microsoft took the reported extensions off the Marketplace after being notified. That stops new installs and does nothing else.

An extension already installed stays installed. It updates from wherever it was configured to, it runs when the editor runs, and the credentials it took are already gone. Delisting is a measure that protects people who have not been attacked yet, which is useful and is not a response for anyone who has.

This is the same gap as every package-registry takedown: the registry is the distribution channel, not the installed base. Nobody gets an alert saying the thing on your machine was removed from the shop.

## What to do

- List your installed extensions and look at the publishers, not the names. In VS Code, the command is simple and the output is short. Anything you do not recognise, or any publisher whose identity imitates a vendor, comes off today.
- Treat themes as code, because they are. The same scrutiny you would give an extension that asks for terminal access applies to one that claims to only change colours.
- If you find one of these, rotate first. Repository tokens, cloud credentials, npm and registry keys, and the session cookies for anything the machine was signed into.
- Pin and review what your team installs. An allowlist of extensions is unglamorous and is the only control that works before the research gets published.

## What is not established

- How many machines ran the active payloads, as opposed to how many installs the listings recorded.
- Who operates GlassWorm, which the research does not attribute.
- Whether the two extensions with no active payload were staged for later use or abandoned.
- What was taken from affected developers, and whether any of it has been used.`,
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
