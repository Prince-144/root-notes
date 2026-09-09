/**
 * Drafts the 9 September evening batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-65.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-65.ts --update
 *
 *   1. DeepSeek Harness. The escape is three POST requests to the agent's own
 *      local control plane, and the check standing in the way read the Host
 *      header — a value the caller sends. Browsers will not forge it; a local
 *      process will. A sandboxed agent is a local process.
 *   2. WeWorm. The precondition everyone reads as a limitation (attacker must
 *      be in the friend list) is the propagation mechanism, because every
 *      compromised account arrives holding a fresh already-authorised list.
 *      No CVE, and structurally there never will be one.
 *   3. McKesson. Vishing to Okta SSO to Salesforce and Snowflake. Not one step
 *      in the chain was a vulnerability, and 284 million is rows — the
 *      attackers said so themselves.
 *
 * Covers checked at full size.
 *
 * No backticks and no angle brackets in the bodies.
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
    slug: "deepseek-harness-the-fence-was-a-request-header-and-the-agent-walked-through-it",
    title: "The fence around the sandbox was a request header, and the agent inside sent one",
    excerpt:
      "CVE-2026-82533 lets any local process turn off DeepSeek Harness's file sandbox and approval prompts with three POST requests. The check in the way read the Host header, which the caller supplies. Browsers will not forge it. A coding agent running inside the sandbox is not a browser.",
    categorySlug: "security",
    tags: ["deepseek", "ai-agents", "cve-2026-82533", "sandbox-escape", "localhost", "vulncheck", "silent-fix"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1629654297299-c8506221ca97${P}`,
    body: `**DeepSeek Harness** is DeepSeek's open-source runtime for its AI coding agent — the component that actually runs on a developer's machine, holds the file sandbox, and asks permission before the agent does something irreversible.

**CVE-2026-82533** describes what happens when a different process on that same machine decides to ask instead. **VulnCheck scores it 9.4 out of 10.**

## Three POST requests

The harness ships a web interface, and behind it a local control plane. That control plane has **no authentication** at all, and exposes **more than 60 RPC methods**.

The escape is three requests, in order:

1. **POST /api/session.create** — creates a session with an arbitrary working directory. Anywhere on disk, chosen by the caller.
2. **POST /api/commands/execute** with the command **/permission danger-full-access** — switches off the file sandbox and the approval prompts. Both, in one call.
3. **POST /api/session.prompt** — hands the agent its instructions, which it now carries out with no filesystem boundary and nothing for a human to click through.

None of that is a memory corruption, a parser trick or a race condition. It is the product's own API, used exactly as documented, by a caller nobody asked to identify itself.

## The fence was a request header

There was a check. It read the **Host header** on the incoming request and decided from that whether the caller was local.

The Host header is set by the client. That is the whole of it.

A browser will not lie about it, and that is why the check does something real. A malicious web page you happen to visit cannot reach the harness on localhost, because the browser will not forge a Host header on the page's behalf. That is a genuine class of attack, and the check stops it.

What it does not stop is anything that is not a browser. Any local process can put whatever it likes in that field. In the words of the developer who published the report, going by **OracleNep**, the fence "stops browser-based attacks" but "any non-browser local process passes it trivially".

The check read what the caller claimed about itself. It never read where the connection actually came from — the one property the caller cannot forge.

[FreeIPA's ownership check said yes for the same reason](/article/freeipa-anonymous-client-passes-the-ownership-check-by-being-nobody): the control was inspecting an attribute the caller supplies.

## The agent is the non-browser local process

This is what separates the finding from an ordinary unauthenticated localhost service, and it is why the CVE scores where it does.

The population of non-browser local processes on a developer's machine is not hypothetical. It includes build scripts, editor extensions, dependency install hooks — and it includes the coding agent itself, running whatever a repository, a README, a dependency or a pasted issue told it to run.

A sandboxed agent, the exact thing the harness exists to contain, sits squarely inside that population. So the failure is not a stranger reaching in from the network. It is the agent, inside its sandbox, sending three HTTP requests to the process that holds the sandbox, and being let out.

The boundary and the thing being bounded ended up on the same side of the check. And step two is not a bypass of the approval prompts — it is the supported command for turning them off, reachable by anyone who can send a request.

[METR's write-up hit the same wall from the other direction](/article/metr-attacker-asked-the-agent-for-its-api-key), where the shortest path to a secret was to ask the agent for it rather than to break anything.

## The disclosure, and the reply

OracleNep published on **14 August 2026**, in **GitHub discussion #853** — public, with the full three-step proof of concept in it.

The project replied. It said the web API "can drive agent actions", that "remote authentication is not available yet", that the documentation already tells people not to bind to **0.0.0.0**, and that the report "has no significance". The finding was treated as user misconfiguration.

The bind-address argument is the one worth pulling apart, because it is the load-bearing claim. Binding to **127.0.0.1** rather than 0.0.0.0 keeps the control plane off the network, and that is worth doing. It does nothing at all about a process that is already on the machine — and a process already on the machine is the entire attack. The advice is correct and beside the point in the same sentence.

**OX Research** picked the report up and took it to **VulnCheck**, which assigned the CVE on **24 August 2026**.

## The fix arrived without saying anything

Affected: **0.1.1-rc.2 and earlier**.

Fixed in **0.1.2-alpha.1**, published to GitHub on **27 August 2026**. The first npm release carrying the fix was **0.1.2-alpha.2**, on **30 August 2026** — so anyone installing from npm had three further days with nothing available to them.

Both went out as routine changes. No security notice, no advisory, no mention of the CVE in the release notes.

The interval that matters is the one between those two dates: a working public exploit existed on **14 August**, and the fix that closed it landed quietly on **27 August**. **Thirteen days** in which the proof of concept was considerably easier to find than the patch, and nothing at all told the people running the affected version that either one existed.

## What to do

- **Upgrade to 0.1.2-alpha.2 or later.** The earlier fixed build was GitHub-only; if you install from npm, that is the first release that contains it.
- **Check your version by hand.** This shipped without a security flag, so there was nothing for update tooling or vulnerability scanners to react to.
- **Treat the local control plane as a privileged surface.** An unauthenticated API that can switch off its own approval prompts is not a debugging convenience.
- **Stop using 127.0.0.1 as an authorisation boundary.** It is a network control, and every process on the box is already inside it.
- **Assume your agent can reach whatever your user account can reach**, and scope the account accordingly rather than trusting the runtime's own fence.

## What is not established

- **Whether it was exploited.** Nothing has been reported.
- **How many installations are on affected builds.** Alpha and release-candidate usage is not tracked publicly.
- **Whether the project intends real authentication**, beyond the statement that remote authentication is not available yet.
- **Whether other methods among the 60-plus RPC endpoints reach the same place** by shorter routes. Only three were needed, and nobody has published a review of the rest.`,
  },
  {
    slug: "weworm-wechat-voip-exploit-fires-while-the-phone-is-still-ringing",
    title: "The exploit fires while the phone is still ringing, and the limitation everyone noticed is the worm",
    excerpt:
      "Calif disclosed a memory corruption flaw in WeChat's VoIP stack on iOS and Android that runs during the ringing phase, before the victim accepts or declines. The one precondition — the attacker must be in the friend list — is not a limit on spread. It is the mechanism of spread.",
    categorySlug: "security",
    tags: ["wechat", "weworm", "zero-click", "voip", "calif", "tencent", "worm", "ai-assisted-exploitation"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1787834565306-6cc7169397e3${P}`,
    body: `Security firm **Calif** disclosed research on **8 September 2026** into a memory corruption flaw in **WeChat's VoIP stack**, affecting the app on **both iOS and Android**. The write-up is published at calif.io/research/weworm.

The bug itself takes one line to describe: memory corruption in the code that handles voice and video calls. What makes it worth a longer look is when it fires, and what the researchers built on top of it.

## It runs while the phone is still ringing

This is zero-click in the strictest sense of the phrase. The victim does not answer.

The exploit fires during the **ringing phase** — in the window between the notification appearing and the user reaching for accept or decline. The call-handling code has already parsed attacker-controlled data by the time a person has registered that the phone is buzzing.

Declining does not help. Declining is a decision taken after the code has already run.

That detail deserves a moment, because almost every piece of practical phone-security advice ordinary people have been given ends at "do not answer calls from people you do not know". Here that instruction is not merely insufficient. It is aimed at a moment that arrives after the compromise is finished.

[The Pegasus cases had the same property](/article/pegasus-serbia-student-activist-patched-eight-months-earlier): by the time there was anything for the target to react to, there was nothing left to react to.

## The precondition is not a limitation. It is the routing table.

There is one requirement. The attacker must be in the victim's **friend list**.

Read cold, that is a constraint, and it is exactly how a precondition like this normally gets reported: serious flaw, but you have to already be a contact, so the blast radius is bounded.

Calif's description of how it propagates is the reason it is not bounded:

**"Attacker calls victim, victim becomes attacker, victim calls the next victim."**

Every account that falls hands over something the original attacker never had — a fresh list of people who have **already authorised it**. The precondition is satisfied for free at every hop, by the definition of the hop. What looks like a fence around the first victim is the routing table to the second.

That is what makes this a worm rather than an exploit. The requirement that appears to limit spread is the thing that produces spread.

It also inverts the usual mitigation. Normally a contact-list precondition means the sensible advice is do not accept requests from strangers. Here the danger arrives from people you deliberately added years ago, whose accounts are behaving exactly as the app intends.

## Two days for the exploit, one more week for the worm

Calif's own account of how it was built, verbatim:

**"Working with AI, our team found the bug and wrote the first remote code execution (RCE) exploit in about two days. Building the worm took one more week."**

Nine days end to end, from nothing to a self-propagating remote code execution chain against an application with more than **a billion** users.

Apply whatever discount you think appropriate — this is a research firm describing its own work, with the technical detail withheld. But the direction the figure points is the same one that keeps turning up in every measurement anyone publishes: the cost of turning a memory corruption bug into a working chain is falling, and it is falling fastest for people who already knew how to do it slowly. [Forescout's number for porting a PLC exploit was eight hours and 536 dollars](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout). Same curve, larger target.

## Three handsets

The demonstration used **three test devices**. That is the entire observed spread.

No real-world attack has been reported. No victims. The technical details are withheld pending a conference talk.

So the honest framing is narrow: a worm that works, proven at a scale of three, against a platform of a billion. Nobody outside Calif can independently verify the chain, and nobody should be describing this as an incident.

## Reported in July, mitigated in August, no CVE ever

| Date | Event |
|---|---|
| 24 July 2026 | Reported to Tencent |
| 21 August 2026 | Mitigation ships — Android 8.0.77, iOS 8.0.76 |
| 28 August 2026 | Full mitigation confirmed |

Four weeks from report to shipped fix on both platforms is a good response by any standard, and it should be said plainly.

And there is **no CVE**. There will not be one.

That is not an oversight. CVE identifiers exist so independent parties downstream — distributors, integrators, scanner vendors, asset owners — can refer to the same defect without ambiguity. Tencent runs the client and the server. There is no downstream. Nobody needs a shared name for a defect that exactly one organisation can patch.

The consequence is worth stating flatly: this vulnerability will never appear in a vulnerability database. If the way your organisation learns what is wrong with the software its staff carry is a feed of CVEs, this one was invisible to you from the day it was reported to the day it was fixed, and it is invisible now.

That is a structural gap rather than a WeChat one. Every application where a single company owns both ends has the same property, and the list of those applications is most of what is on a modern phone.

## What to do

- **Confirm WeChat is on Android 8.0.77 or iOS 8.0.76 or later.** That is the whole fix, and it has been out since late August.
- **Stop treating messaging-app updates as cosmetic.** The most valuable surface on a phone is the code that runs before the user makes any decision at all.
- **Prune contact lists on any app where a contact is a permission.** Here, being in the list is the entire precondition, and old entries carry the same weight as new ones.
- **Retire the advice about not answering unknown calls as a control for this class.** It is aimed at the wrong moment.
- **Add a non-CVE source to your vulnerability intake.** Vendor release notes for the apps your people actually use will catch things the databases structurally cannot.

## What is not established

- **The technical detail.** Withheld until the conference talk.
- **Whether it was ever used against anyone.** No real attack reported.
- **How reliable the chain is** outside three controlled handsets.
- **What the mitigation actually changed.** Tencent has published nothing.
- **Whether the same code path holds other reachable bugs** — the usual question once a VoIP stack is shown to be reachable before the call is answered.`,
  },
  {
    slug: "mckesson-one-terabyte-four-days-and-nothing-in-the-chain-was-a-vulnerability",
    title: "A terabyte left over four days, and nothing in the chain was a vulnerability",
    excerpt:
      "McKesson's 8-K describes roughly one terabyte exfiltrated between 21 and 25 August 2026, detected on the last day. The chain was vishing to Okta SSO to Salesforce and Snowflake — no CVE, no exploit, no patch. And the claimed 284 million records are database rows, by the attackers' own account.",
    categorySlug: "security",
    tags: ["mckesson", "shinyhunters", "vishing", "okta", "snowflake", "salesforce", "healthcare", "phishing-resistant-auth"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1642055514517-7b52288890ec${P}`,
    body: `**McKesson** is one of the largest pharmaceutical distributors in the world. On **28 August 2026** it filed a **Form 8-K** describing, in its own words, **"a cybersecurity incident involving third-party applications and unauthorized access and exfiltration of data."**

The exfiltration ran from **21 to 25 August 2026** — four days — and moved roughly **one terabyte**. It was detected on **25 August**, which is to say on the last day of it.

## Nothing in the chain was a vulnerability

The sequence, as reported, has three steps, and not one of them is a flaw in a product.

**ShinyHunters** ran **vishing** — voice phishing, an actual phone call — against **multiple employees**, and came away with their **Okta SSO credentials**. With those credentials the group signed in to **Salesforce** and **Snowflake**. Then it queried, and it exported.

There is no CVE here. No exploit, no patch to apply, no vendor at fault. Single sign-on did precisely what it exists to do: take one successful authentication and turn it into access to everything behind it. That is the feature. It is the reason organisations deploy it, and it is the reason a phone call was worth making.

[JSCeal had the same shape](/article/jsceal-nothing-in-google-authentication-was-bypassed): nothing cryptographic failed, an attacker simply held something they should not have held.

## Snowflake could not have alerted on this, and that is not a defect

The obvious question is how a terabyte left over four days without setting anything off.

Because bulk export is the product.

Snowflake exists so that people can run large queries and pull large results out. A quarterly reporting job and an exfiltration job are, on volume alone, the same event: an authorised identity asking for an enormous number of rows and being given them. There is no threshold to set. Any number low enough to catch the second one buries the analytics team in alerts about the first, and a month later somebody turns it off.

The difference between the two is not in the volume. It is in the context around it:

- **Which identity** ran it, and whether that identity has ever run anything resembling it before
- **From where** — which network, which device, which country
- **At what hour**, measured against that person's own normal working pattern
- **Which tables** were touched, and whether that person has any business reason to touch them
- **In what sequence** — enumeration followed by extraction looks nothing like a scheduled report

Every one of those signals is available. None of them is a number on a dashboard, which is exactly why they so often go unwired.

## 284 million is a row count, and the attackers said so

ShinyHunters claims **284 million records**. That figure is going to travel as 284 million people, and it should not.

The group said themselves that these are raw database **rows**, not unique patients. In a pharmaceutical distribution system, one person generates a row per prescription, per shipment, per appointment, per claim line. A single patient on a long oncology regimen can account for dozens or hundreds of rows without anything unusual happening.

So the number is real and the unit is wrong, and the unit is doing all the work. [The APIS figure had the identical problem](/article/220-million-apis-records-is-travel-records-not-travellers) — a record count read as a headcount.

The population actually named in the filing is narrower: a **subset of customers** of the **Oncology and Multispecialty** and **Medical-Surgical** business units.

The claimed contents are not narrow at all: names, dates of birth, Social Security numbers, medical record numbers, Medicaid numbers, medications, allergies and diagnoses.

A ransom demand of **more than 55 million dollars** has been reported by others. McKesson has not confirmed it.

## Material is a test about the company, not about you

The 8-K says the investigation **"is in its early stages"**, and that McKesson has not determined the incident is not material.

That phrasing gets read as a severity rating. It is not one.

SEC materiality asks whether an incident is significant to a reasonable **investor** — a financial question about the company's business, results and prospects. A distributor of McKesson's size can absorb a very large amount of human harm before that answer is yes.

For a person whose cancer diagnosis, medication list and Social Security number are somewhere in that terabyte, the severity was fixed on 25 August and has nothing whatsoever to do with McKesson's balance sheet. Both things are true at the same time. The filing is answering the first question honestly. It was never asked the second one, and no filing anywhere will be.

## The perimeter that failed was identity, and it failed to a phone call

Every technical control in this story worked. Okta authenticated the person who presented the credentials. Salesforce authorised the session. Snowflake served the query. Each did its job correctly.

The failure happened before any of that, on a phone call, in the few minutes it takes to talk somebody through a login prompt.

That is why the fix is not a patch, and why being fully patched is not an answer to this incident.

## What to do

- **Move to phishing-resistant authentication.** Passkeys or hardware security keys, cryptographically bound to the origin. Push approvals and one-time codes are both readable aloud to a caller on the phone, which is the entire technique here.
- **Assume your help desk is the target.** Vishing works on people whose job is to be helpful under time pressure. Give them a verification procedure they are explicitly permitted to follow when the caller is senior, urgent and annoyed.
- **Wire up context rather than volume in your data platforms.** Identity, source, hour, tables, sequence. The volume alarm you are tempted to build will be switched off within a month.
- **Inventory which SSO identities can reach bulk data**, and remove the ones that do not need it. Single sign-on multiplies the blast radius of every individual credential by design, so the only lever left is what sits behind each one.
- **If you are a patient**, freeze your credit and treat unexpected calls about your prescriptions or your coverage as hostile until proven otherwise. Diagnoses and medication lists make extremely convincing pretexts, and that is the second-order use of this data.

## What is not established

- **How many people are affected.** The 284 million figure is rows, on the attackers' own account.
- **Whether the ransom demand is accurate.** Reported by third parties, unconfirmed by McKesson.
- **Which third-party applications** the filing means, beyond the Salesforce and Snowflake reporting.
- **How the vishing calls were framed**, or how many employees the callers had to reach.
- **Why detection took until the fourth day**, and what finally produced it.
- **Whether McKesson will conclude the incident is material.** The investigation is in its early stages.`,
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
