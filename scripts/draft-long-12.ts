/**
 * Long-form drafts — 13–14 August 2026.
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
    slug: "ghostjacking-ai-agents-poisoned-logs-cursor-cli",
    title:
      "Poison a log line and the AI agent reading it will run your code — and it cannot tell the difference",
    excerpt:
      "Tenet Security's GhostJacking turns monitoring data into an instruction channel for AI agents, chaining to cloud pivot, exfiltration and persistence. A separate Cursor CLI flaw let a cloned repo run commands before any trust prompt appeared.",
    categorySlug: "ai",
    tags: [
      "ai-security",
      "prompt-injection",
      "agents",
      "developer-tools",
      "cloud",
      "supply-chain",
    ],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1677442135131-4d7c123aef1c${P}`,
    body: `**Tenet Security** has published a technique it calls **GhostJacking**, extending earlier work on agent hijacking. The mechanism is one sentence long:

> An AI cannot tell a real instruction from a trap hidden in the data it reads.

Poison a log entry or an alert. An AI agent reads it as part of doing its job. The agent executes what the data told it to.

## Why logs are the ideal channel

Every other prompt-injection surface we have covered this month has a human somewhere near it. A [poisoned PDF handed to Atlassian Rovo](/article/atlassian-rovo-prompt-injection-rovoblast-promptarmor) requires someone to upload it and ask about it. A [malicious MCP server](/article/ghostsplice-mcp-split-instructions-coding-agents) requires a developer to install it.

Monitoring data has none of that. It is machine-generated, arrives continuously, is trusted implicitly, and is precisely what an operations agent is deployed to read. Nobody reviews a log line before the agent sees it — that is the entire value proposition of putting an agent on logs.

And attackers can often write into logs without any special access. A failed login with a crafted username. A request with a chosen User-Agent. An error message that reflects attacker input. These are ordinary application behaviours; they become an instruction channel the moment something reads the log and can act.

## The chain Tenet demonstrated

1. **Privilege escalation** from the initial agent context
2. **Pivot to enterprise cloud infrastructure**
3. **Data exfiltration**, using a now-patched Claude Desktop sandbox escape
4. **Persistence** through a backdoored agent configuration

Step four is the one that survives cleanup. Rotating credentials and patching the escape does nothing about a configuration file that tells the agent to keep doing what it was told.

Tenet's framing of the exposure:

> Companies are handing AI agents the keys to their code, their monitoring, and their infrastructure.

That is not rhetoric — it is the deployment pattern. An agent with read access to logs and write access to infrastructure is what an AI SRE product *is*.

## The Cursor CLI flaw, same week

Separately, **Manifold Security** disclosed a flaw in **Cursor's CLI** on **20 July 2026**. Cursor patched it three days later.

> A repository could execute any command it chose on your machine, as you, the moment you started Cursor's CLI agent in it.

Commands ran **before the trust prompts appeared**, and the sandbox was bypassed **even when explicitly enabled**.

Read those two clauses together. The trust prompt is the control users believe protects them, and it fired too late. The sandbox is the control security teams believe protects them, and it did not hold. A developer who did everything right — enabled the sandbox, intended to review the prompt — was still exposed by cloning a repository.

No CVE identifier was assigned in the reporting we saw, which means scanners keyed to NVD will not flag it. That is the same gap we wrote about with [the Metabase advisory that carried no CVE](/article/metabase-zero-day-ghsa-cvss-10-no-cve).

Three days from disclosure to patch is a good vendor response and worth saying so.

## What is actually new here

Prompt injection is not new, and we have covered a lot of it. What GhostJacking changes is **who has to be involved**.

| Vector | Requires |
| --- | --- |
| Poisoned document | A user uploads it and asks about it |
| Malicious MCP server | A developer installs it |
| Instruction-splitting | An attacker's server already connected |
| **GhostJacking** | **Attacker can write a log line** |

The last row has effectively no precondition in most environments.

## What is not established

- **No CVE and no patch list for GhostJacking.** This is a technique, not a product bug. There is nothing to apply.
- **Which agent products are affected** is not enumerated. The demonstration used a now-patched Claude Desktop escape as one link in the chain; the technique itself is not specific to any vendor.
- **No in-the-wild exploitation is reported.** This is research.
- **The Cursor flaw has no CVE** in the reporting we found, so the affected-version range is whatever Cursor's own advisory says.

## What to do

- **Treat log and alert content as untrusted input to any agent that reads it.** Not "monitor for injection" — assume it is present and constrain what the agent can do as a result.
- **Separate read scope from write scope.** An agent that reads monitoring data should not hold credentials that modify infrastructure. That single split breaks most of the chain.
- **Put agent configuration under change control.** The persistence step here is a config file. If nobody would notice it changing, that is the finding.
- **Constrain egress.** Same conclusion as every other injection story this month: if the agent cannot reach an arbitrary host, exfiltration stops being the easy part.
- **Update Cursor CLI** and check whether your developers ran it inside cloned repositories before late July.

The structural point is one we keep arriving at from different directions. Model-level defences do not fix this, because assembling scattered context into an action is what a capable agent does. The boundary that works is the one around the agent — what it can reach, what it can change, and who checks its configuration.`,
  },
  {
    slug: "trump-memo-private-companies-hack-back-transnational-crime",
    title:
      "A White House memo would let vetted US companies break into foreign criminals' systems — and destroy them",
    excerpt:
      "Two categories are authorised: cyber surveillance without owner authorisation, and operations to disrupt, deny, degrade or destroy. The National Coordination Center has 60 days to stand up the programme. Existing US law prohibits exactly this.",
    categorySlug: "world",
    tags: [
      "policy",
      "hack-back",
      "united-states",
      "regulation",
      "cybercrime",
      "law",
    ],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1753799515829-ea90e1d27725${P}`,
    body: `A White House memorandum signed in **August 2026** directs the **National Coordination Center** to stand up a programme within **60 days** allowing **"vetted United States companies"** to conduct offensive cyber operations against foreign **Transnational Criminal Organizations**.

Two categories are named:

**Cyber surveillance operations** — accessing sensitive data **without owner authorisation**.

**Cyber effects operations** — **disruption, denial, degradation, or destruction** of information systems.

Hack-back has been debated in Washington for fifteen years and has never survived contact with the law. This is the furthest an administration has gone toward authorising it.

## Who can be targeted

Foreign groups conducting cyber-enabled crime against the US government, US persons, or US interests.

Excluded: groups that are **"an institutional part of a foreign government or wholly operated under a foreign government's direction"** — unless evidence establishes such a connection.

That carve-out is doing a great deal of work, and it is the hardest thing in the memo to operationalise. The distinction between a criminal group and a state-directed one is exactly what national intelligence agencies spend years and classified collection failing to settle. Ransomware crews sit on that line by design.

A company would be making that call from commercial telemetry, before acting, with liability attaching to getting it wrong.

## The stated limits

Companies must stop operations that exceed approved parameters, including any targeting of:

- US persons
- US-located systems
- Systems under US control

They must apply **minimisation procedures** and **immediately alert the NCC**, which notifies the **Department of Justice**.

The mechanism here is self-assessment and self-reporting. The operator decides it has exceeded scope, and then tells the government. There is no prior judicial authorisation in what has been reported.

## The legal problem is not subtle

Per Cybersecurity Dive, **existing US laws prohibit private companies from conducting cyber attacks or disruption operations without court authorisation.**

A presidential memorandum does not repeal the **Computer Fraud and Abuse Act**. It can shape enforcement priorities — the executive branch decides whom to prosecute — but it cannot make the underlying conduct lawful, and it does not bind:

- **Foreign law.** The target's systems sit somewhere. That jurisdiction's computer-crime statutes apply, and the operator's employees may travel.
- **Civil liability.** Criminal infrastructure runs on shared hosting. Destroying it damages third parties who have their own claims.
- **A future administration.** Enforcement discretion lasts as long as the discretion does. Companies would be relying on a policy that a successor can withdraw, with a five-year federal statute of limitations still running.

"Vetted" is the word carrying the risk. Vetting is not immunity.

## The number in the fact sheet

An accompanying fact sheet cites **$20.8 billion** in losses reported by American consumers to cyber-enabled crime. The memo follows a March 2026 White House cybercrime initiative.

The figure is real and the frustration behind it is legitimate. Law enforcement takedowns are slow, extradition rarely works, and infrastructure reconstitutes within days. We have written repeatedly about groups engineering around takedowns — [DeadLock putting its leak site on a blockchain](/article/deadlock-ransomware-polygon-smart-contracts-session), [Kimwolf resolving command-and-control through ENS](/article/kimwolf-v7-android-botnet-http2-browser-fingerprints).

If seizure no longer works, the argument for letting the private sector act directly gets easier to make. That is the honest case for this memo.

## The case against, stated as plainly

**Attribution errors become acts of destruction.** A takedown that hits the wrong host is an incident report. A destructive operation that hits the wrong host is a company destroying an innocent party's systems.

**Criminal infrastructure is other people's infrastructure.** It runs on compromised WordPress sites, hijacked cloud accounts and expired domains bought at auction. Degrading it means degrading assets belonging to victims.

**It invites reciprocity.** Once the US authorises private offensive operations, the argument that other states should not is materially weaker.

**Nobody has said who pays for mistakes.** The memo, as reported, describes reporting obligations. It does not describe indemnity.

## What is not established

- **We have not read the memo.** Everything above comes from reporting on it and an accompanying fact sheet.
- **No company has been named**, and no vetting criteria are public.
- **The NCC's programme does not exist yet.** Sixty days from signature.
- **Whether any statutory change is contemplated.** Without one, the CFAA problem stands.
- **Whether "destruction" means what it appears to mean.** That is the most consequential word in the memo and it is not defined in what has been reported.

## What to watch

- **The 60-day mark**, and whether the programme's rules are published or classified.
- **Whether the vetted list is public.** A secret list of companies authorised to break into systems is a different governance question from a published one.
- **Whether DOJ issues declination guidance.** That is the only thing that would give a participating company real comfort, and it would be the clearest signal the administration means it.
- **Whether any incident response firm publicly declines to participate.** The first refusal will be informative.`,
  },
  {
    slug: "sable-squirrel-seven-million-expired-domains-reputation",
    title:
      "One actor spent $7 million buying expired domains — because reputation is the one thing you cannot fake",
    excerpt:
      "Infoblox tracked Sable Squirrel across 10,000-plus domains, including former General Electric, Procter & Gamble and Sony developer addresses. 31,000 malware samples talked to the infrastructure. Roughly 65,000 expired domains are re-registered every day.",
    categorySlug: "security",
    tags: [
      "dns",
      "malware",
      "domains",
      "threat-intelligence",
      "infrastructure",
      "reputation",
    ],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1785682231847-93265d8e633d${P}`,
    body: `**Infoblox** has published research on a threat actor it tracks as **Sable Squirrel**, which spent close to **$7 million** buying expired domains and controls **over 10,000** of them.

Seven million dollars is a lot to spend on something you could register fresh for ten dollars each. The research explains why:

> That money buys aged registration history, backlinks, residual traffic, and the kind of reputation signals many defenses still treat as indications of trustworthiness.

## Reputation is the product

Nearly every layer of modern web defence has a domain-age or domain-reputation input. Newly registered domains get blocked, throttled, sandboxed or scored down — by mail filters, secure web gateways, DNS security products and browser safe-browsing lists.

That control works well against the obvious case and it is exactly what buying an expired domain defeats. A domain registered in 2009, with a decade of legitimate backlinks and residual traffic from people still linking to it, arrives pre-approved.

The names in the research make the point better than any explanation:

| Domain | What it used to be |
| --- | --- |
| healthymagination[.]com | A General Electric health initiative |
| maxfactor-international[.]com | A Procter & Gamble cosmetics brand |
| krogeralbertsons[.]com | The 2022 Kroger–Albertsons merger proposal |
| snsystems[.]com | Former Sony PlayStation developer tools |
| cel-robox[.]com | A 3D printer company |

Each of those carries years of inbound links from press coverage, partner sites and documentation. None of it transfers to the new owner's intent, and all of it transfers to the new owner's reputation score.

## The scale of the market

This is not a niche.

During **H1 2026**, roughly **50,400 expired domains were re-registered daily** in generic TLDs alone — **65,000** including country-code domains.

That is **one-fifth of all new registrations.**

Registrars by median daily volume: **GoDaddy** (5,246), **Namecheap** (4,385), **DropCatch.com** (3,568). Most abused TLDs: **.net** and **.xyz** ahead of **.com**.

The dropcatch market is legitimate and large. Sable Squirrel is a buyer in a functioning marketplace, not an intruder in it.

## How fast they go live

- **24%** live immediately
- **76%** within seven days
- **94%** within two weeks

Two weeks is the whole window. Any defensive process that reviews newly-acquired domains monthly is looking at infrastructure that finished its job before the review started.

## What the domains do

Illegal sports streaming, online gambling promotion, and malware infrastructure.

**31,000 malware samples** communicated with Sable Squirrel infrastructure — **Quasar RAT, AsyncRAT, DCRat, NanoCore, Remcos RAT** and **njRAT**. All commodity remote-access trojans, all widely available, none of them sophisticated.

That is the shape of this operation: unremarkable malware behind unusually good infrastructure. The investment went into looking trustworthy rather than into the payload.

Geographically the actor centres on **Vietnam**, targeting users in **South Korea, Japan, Taiwan, Singapore** and **Australia**. Infoblox links it to **Xoi Lac TV**, an illegal streaming network dismantled by Vietnamese authorities in **March 2026**.

Related actors Infoblox tracks: **Stuffy Squirrel** (500+ domains, since 2020), **Shady Squirrel** (700+, since July 2023), **Swiping Squirrel** (3,000+, since 2022).

## Why this matters more than it sounds

Illegal streaming reads like a low-stakes problem. The infrastructure question is not.

A defender's model of a malicious domain is usually: registered recently, no history, suspicious TLD, no legitimate backlinks. Every one of those signals is purchasable, and this research prices the purchase.

It also means the reverse test fails. "This domain has been registered since 2009 and used to belong to a Fortune 500 company" is not evidence of anything about who controls it today.

## What to do

- **Stop treating domain age as a trust signal on its own.** Pair it with ownership change — a domain whose registrant, nameservers or hosting changed recently is far more informative than one that is simply old.
- **Alert on re-registration of domains you used to own.** Your expired marketing microsites carry your backlinks and, to a filter, some of your reputation. Someone can buy that.
- **Inventory your own expiring domains.** Campaign sites, acquired-brand domains, old product names. The GE and P&G examples in this research are what corporate domain hygiene failures look like from the outside.
- **Watch the two-week window.** 94% activate within it. Detection that operates on a monthly cycle is not detection here.

The uncomfortable framing: this actor did not defeat anyone's security. It bought its way past a heuristic, at market prices, from mainstream registrars.`,
  },
  {
    slug: "apple-mercenary-spyware-notifications-110-countries",
    title:
      "Apple told users in 110 countries they may have been targeted by mercenary spyware — and named nobody",
    excerpt:
      "The latest round of threat notifications went out on Thursday. Apple has now notified people in over 150 countries since late 2021, and deliberately attributes nothing — which is both a defensible policy and the reason these alerts are hard to act on.",
    categorySlug: "gadgets",
    tags: [
      "apple",
      "spyware",
      "surveillance",
      "mobile",
      "journalists",
      "privacy",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1423784346385-c1d4dac9893a${P}`,
    body: `Apple sent threat notifications on Thursday to users in **110 countries** it suspects may have been targeted by mercenary spyware. Since it began the programme in **late 2021**, it has notified people in more than **150 countries**.

Apple's characterisation:

> The extreme cost, sophistication, and worldwide nature of mercenary spyware attacks make them some of the most advanced digital threats in existence today.

And, importantly:

> [Apple] does not attribute the attacks or resulting threat notifications to any specific attackers or geographical regions.

## Who gets one

These are not broad warnings. Notifications typically reach people singled out **by their identity or role** — journalists, activists, politicians, diplomats — and Apple describes them as high-confidence alerts about individualised targeting.

That framing is the useful part. A mercenary spyware operator is spending a great deal of money per target. Receiving one of these means someone decided you specifically were worth that spend.

## How the notification arrives

Three channels, deliberately:

- An on-device notification on the **Lock Screen** and in **Settings**
- An email from **threat-notifications@email.apple[.]com**
- A banner on the **Apple Account page**

The redundancy exists because the notification itself is an obvious phishing lure. Anyone can send an email claiming to be an Apple spyware warning; only Apple can put a banner on your Apple Account page.

**If you receive one: do not click links in the email.** Sign in to your Apple Account page directly and check for the banner. That single step distinguishes a real notification from the copycat campaigns that follow every round.

## What Apple recommends

Update devices; use a passcode or biometrics; enable two-factor authentication; turn on **Stolen Device Protection** and **Lockdown Mode**; install apps only from trusted sources; do not open links or attachments from unknown senders.

**Lockdown Mode** is the one that matters here and the one almost nobody enables. It disables the attack surface these operators actually use — most message attachment types, some web technologies, incoming FaceTime from unknown callers, wired accessory connections while locked. It makes the phone meaningfully less pleasant to use, which is why it is off by default, and it is the only item on that list designed specifically against this threat.

## The attribution gap

Apple's refusal to name vendors or regions is defensible: naming would expose detection methodology, and a wrong attribution against a state or a company is a legal and diplomatic problem Apple does not need.

It also leaves the recipient with a warning and no context. "You may have been targeted" does not tell you by whom, through what, whether it succeeded, or whether it is still happening.

In practice that gap gets filled by others. **Citizen Lab** and **Amnesty International's Security Lab** have historically done the forensic work on notified devices and produced the attribution Apple will not — which is how NSO Group's Pegasus, Intellexa's Predator and others have been documented. Anyone receiving a notification should be talking to one of those organisations, not just following the checklist.

## What is not established

- **How many people were notified.** Apple gives country counts, never user counts, and 110 countries could be hundreds of people or thousands.
- **Which spyware or vendors.** Apple does not say and we found no reporting that established it for this round.
- **Whether any attempt succeeded.** A notification means suspected targeting, not confirmed compromise.
- **What triggered this round.** No campaign, vulnerability or vendor has been publicly tied to it in what we read.
- **Reaction from Citizen Lab or Amnesty** on this specific round — we did not find a statement.

## Why a mainstream tech audience should care

The instinct is that this is a story about journalists in other countries. Two reasons it is not only that.

**The techniques descend.** Mercenary spyware chains — zero-click message exploits, malicious attachment parsing, exploit chains against browser engines — are the highest-end work being done against phones, and the vulnerability classes reach commodity criminal tooling eventually.

**The defences are already in your settings.** Lockdown Mode, Stolen Device Protection and Advanced Data Protection exist because of this threat, and are available to everyone. Most people have never opened that screen.

The one action worth taking from this story, if you are not a likely target: open Settings and look at what Lockdown Mode actually turns off. You probably will not enable it. You will learn what your phone's attack surface consists of.`,
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
