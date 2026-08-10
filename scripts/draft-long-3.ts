/**
 * Long-form drafts — Security x3.
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
    slug: "minnesota-water-plc-attacks-no-exploit-needed",
    title: "Thirty water systems were disrupted without exploiting a single vulnerability",
    excerpt:
      "Attackers changed passwords and IP addresses on controllers that were already reachable from the internet, locking operators out and triggering boil-water notices. Forescout then found 4,407 exposed Rockwell PLCs worldwide — most of them on mobile carrier networks.",
    categorySlug: "security",
    tags: [
      "critical-infrastructure",
      "operational-technology",
      "vulnerability",
      "exposure",
      "incident-response",
      "threat-intelligence",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1533077162801-86490c593afb${P}`,
    body: `On **26 and 27 July 2026**, a coordinated attack hit the operational technology behind **more than 30 community water systems in Minnesota**. Nine more were hit in Michigan.

The detail that matters most is what the attackers did *not* do. Forescout's assessment is blunt: they **changed IP addresses and set passwords on controllers that were already reachable**, causing operators to lose visibility and, in some cases, control — **requiring no vulnerability exploit at all**.

There was nothing to patch. The devices were simply on the internet, and someone logged in.

## What that looked like on the ground

Braham, Plymouth, South St. Paul and Maple Plain publicly described plant outages, communications failures or affected automated controls. Braham's water plant went offline and the city asked residents to minimise water use until treatment resumed.

Across the affected systems the pattern produced **boil-water notices and sustained manual operations** — staff running a treatment process by hand because the automation had been locked away from them.

Locking an operator out of a PLC is not subtle sabotage. It is closer to changing the locks. The plant still works; the people responsible for it can no longer see or steer it, and the fallback is manual control for as long as it takes to regain access.

Utilities in **at least seven states** have reported incidents since 27 July. The Hacker News noted Forescout's analysis referenced at least twelve.

## The exposure numbers

Two counts were published days apart, using different methods, and it is worth keeping them separate rather than picking whichever is larger.

| Source | Date | Finding |
| --- | --- | --- |
| Forescout | 3 Aug 2026 | **4,407** exposed Rockwell controllers globally, **2,844** in the US |
| Censys | 30 Jul 2026 | **4,148** exposed hosts |

Different methodologies, so they are not directly comparable — but they agree on the order of magnitude, which is the part that should worry anyone.

Of those, **22 exposed controllers sat in cities targeted by the attacks**, and **19 of the 22 ran firmware vulnerable to CVE-2017-16740**.

## The CVE is a distraction

That last figure invites the obvious conclusion, and the obvious conclusion is wrong.

**CVE-2017-16740** is a Modbus TCP buffer overflow affecting MicroLogix 1400 Series B and C on firmware **21.002 and earlier**, with a CVSS of **8.6**. Rockwell fixed it in revision **21.003** — in 2017.

But the attacks did not need it. Forescout's own framing is that firmware updates address specific bugs and **do not make direct public exposure of PLCs acceptable**. A fully patched controller reachable from the internet with a settable password is still a controller someone else can set a password on.

The nine-year-old CVE is a symptom of the same underlying condition — devices nobody has looked at in a long time — rather than the mechanism of the attack.

For context on device mix: **MicroLogix 1400 accounted for 50%** of Forescout's findings and the MicroLogix 1100 for **8%**.

## The cellular modem blind spot

This is the finding with the widest implications, and it explains how a utility can be confident its OT is segmented and still be listed here.

- **Over 70% of exposed US controllers** are on large mobile carrier networks
- Censys data showed **Verizon Business, AT&T Mobility and T-Mobile USA accounted for 59%** of exposed EtherNet/IP hosts
- **19 of the 22 controllers in the water-attack cities used the same mobile carrier network**

These devices are not behind the corporate firewall because they are not on the corporate network. They reach the internet through a cellular modem — often installed by an integrator for remote support, often undocumented, and invisible to every control that assumes traffic flows through the site's own perimeter.

A network diagram can be accurate and still omit them entirely. Nobody drew the modem because nobody in the room knew it was there.

The protocol detail completes it: **EtherNet/IP exposed on port 44818** offers an unauthenticated path that, depending on configuration, lets an attacker identify a controller or write settings to it.

## What the agencies have said

**CISA** urged the water and wastewater sector to protect OT against activity targeting PLCs, in an alert dated **30 July 2026**. A separate CISA advisory covers **Iranian-affiliated actors exploiting PLCs across US critical infrastructure**, and Iranian involvement has been suspected in the Minnesota incidents — **suspected, not confirmed**, and worth holding loosely.

The **FBI and EPA alert of 30 July** is the more actionable document. Its recommendations are specifically about the cellular path: **strong authentication, updates and logging for cellular modems**, with remote access isolated through a **private APN, VPN or equivalent**.

## What to do

- **Find the modems first.** Inventory every cellular connection at every site, including ones installed by integrators years ago. This is the control that would have prevented these incidents, and it is not a firewall rule.
- **Get EtherNet/IP off the public internet.** Port 44818 reachable from anywhere is the exposure. Private APN or VPN, not port forwarding with a password.
- **Change default and shared credentials on controllers** — and record where they are. An attacker setting a password only works where a password could be set remotely.
- **Patch anyway**, but do not mistake it for the fix. 21.003 has been available since 2017 and would not have stopped this.
- **Rehearse manual operation.** Several of these utilities ran manually for a sustained period. That is a resilience capability, and it is better practised than discovered.

## The uncomfortable general lesson

Most OT security discussion is about sophisticated adversaries and specialised malware. This was neither. It was a scan for reachable controllers, followed by a password change.

The defensive question that follows is not "are we patched" but "what of ours can be reached, by whom, over which path" — and for a large number of organisations the honest answer is that nobody has checked, because the path in question was installed by somebody else and never written down.`,
  },
  {
    slug: "teams-vishing-stac4749-chaos-ransomware",
    title: "The IT helpdesk calling you on Teams may not work there — one campaign went from call to ransomware in 17 hours",
    excerpt:
      "Sophos tracked STAC4749 across dozens of North American organisations between February and June 2026. Attackers used external Teams accounts and IT-themed personas to talk their way into remote access, then deployed a modular backdoor and, in at least three cases, Chaos ransomware.",
    categorySlug: "security",
    tags: [
      "social-engineering",
      "ransomware",
      "threat-intelligence",
      "incident-response",
      "identity",
      "exploitation",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1553775282-20af80779df7${P}`,
    body: `Phishing awareness training has spent a decade teaching people to distrust email. This campaign does not use email.

Sophos tracks it as **STAC4749**. Between **February and June 2026** it targeted dozens of organisations, and the initial contact came through **Microsoft Teams** — external accounts impersonating IT helpdesk staff, opening a chat and then placing a voice call.

## Why the channel is the attack

Teams occupies a different position in a user's head than an inbox does.

Email is where strangers arrive. Everybody knows this. Teams is where colleagues are — it is the internal tool, the one with the org chart behind it, and a message there carries an implicit assurance that whoever sent it belongs.

That assurance is mostly false. In a default configuration, external accounts can initiate contact with your staff. The interface does mark them, but a marker on an interface people use forty times a day is not the same as a warning anybody reads.

Add a voice call and the remaining friction disappears. A phishing email asks someone to click a link on their own. A voice call asks them to follow instructions from a person who is talking to them, who sounds like IT, who is waiting.

Sophos notes the operators used a **consistent set of IT-themed cloud domains and personas** — this was infrastructure built for the purpose, not opportunistic.

## What happened after they were let in

Once remote access was granted, the operators deployed a **modular post-exploitation toolset**, including a **custom loader and backdoor** for persistent access.

Then a second step worth noting: they installed **DWAgent or AnyDesk** as backup access.

That is not a technical necessity — they already had a backdoor. It is an operational choice about resilience. Legitimate remote-support software is signed, often already present in enterprise estates, and frequently allowlisted precisely because IT uses it. If defenders find and remove the custom implant, the commercial tool survives, and it survives because it looks like something the organisation installed itself.

## The 17-hour number

At least **three** of these intrusions ended in **Chaos ransomware**.

In one, the time from initial access to file encryption was **under 17 hours**.

That figure is the operational point of the whole article. Seventeen hours means one overnight. It means the detection happened, if it happened, while nobody was reading the alerts, and the response began the following morning against an environment that was already encrypted.

Playbooks written around a dwell time of days do not fit here. Neither does an escalation path that depends on someone noticing a ticket during business hours.

## Who was hit

| Dimension | Detail |
| --- | --- |
| Geography | ~**95%** North America — Canada **50%**, US **45%** |
| Sectors | Services, manufacturing, energy, construction and engineering |
| Period | February–June 2026 |
| Scale | Dozens of organisations |

The sector list is worth reading carefully. Manufacturing, energy, construction and engineering are not industries with large security teams as a rule. They are industries with distributed sites, contractor-heavy workforces, and genuine reasons for an unfamiliar IT person to call — which is exactly the environment in which this pretext is plausible.

## What to change

- **Restrict external Teams contact.** Most organisations do not need arbitrary outside accounts initiating chats with staff. Where federation is genuinely required, allowlist the domains rather than permitting all.
- **Make the helpdesk verifiable in one direction only.** Establish, and communicate, that IT never initiates a remote-access request over Teams — and give staff a number to call back on. A pretext survives on the target having no way to check.
- **Alert on remote-access tooling appearing.** DWAgent and AnyDesk showing up on a machine that had neither should generate an alert regardless of signature or reputation. This is the highest-yield detection in the whole chain, precisely because the tools are legitimate.
- **Plan for overnight.** If seventeen hours is achievable, out-of-hours coverage is not a maturity milestone, it is the difference between an incident and an outage.
- **Tell people the specific story.** "Be careful of phishing" does not inoculate against this. "IT will never call you on Teams and ask for remote access, and if someone does, hang up and call this number" does.

## The pattern underneath

Every element here is legitimate software behaving as designed. Teams allowing external contact. Voice calls. Commercial remote-support tools. Nothing was exploited.

What was attacked was the trust boundary a user carries in their head — the assumption that the internal tool contains internal people. That boundary is not enforced by the software, and no patch is coming for it.`,
  },
  {
    slug: "dangling-dns-subdomain-takeover-silent-push",
    title: "Researchers took over 4,000 subdomains automatically — starting from 12,500 domains",
    excerpt:
      "Silent Push counts roughly three million dangling DNS records worldwide. In one exercise across 12,500 apex domains they isolated 16,000 dangling subdomains and automated the takeover of 4,000 of them. The worst outcome isn't defacement — it's session cookies.",
    categorySlug: "security",
    tags: [
      "dns",
      "attack-surface",
      "identity",
      "exposure",
      "threat-intelligence",
      "incident-response",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1680992044138-ce4864c2b962${P}`,
    body: `A dangling DNS record is one that points somewhere that no longer exists. Someone spun up a cloud resource, created a CNAME to it, and later deleted the resource without deleting the record. The name still resolves. What it resolves to is now available for anyone to claim.

Silent Push's counts give a sense of how common that is:

| Record type | Dangling worldwide |
| --- | --- |
| CNAME | **2.7 million** |
| NS | **300,000+** |
| MX | 3.9 million (less readily taken over) |

Roughly **three million** records that are, in their phrasing, ripe for the picking.

## The number that makes it concrete

Aggregate figures are easy to skim past. This one is not.

Across **12,500 apex domains**, Silent Push isolated **16,000 dangling subdomains** and **automated the takeover of 4,000 of them**.

Automated. Not "identified as theoretically vulnerable" — actually claimed, by a script, at a rate of roughly one subdomain successfully taken over for every three apex domains examined.

A further **7,000** required additional steps to determine whether they met the conditions for takeover. On review, **5,000 of those were safe**, because the cloud provider had safeguards in place preventing a stranger from claiming a previously-used name.

That provider-side detail is worth holding on to: whether an abandoned record is exploitable depends heavily on which service it pointed at, and some providers have closed this off while others have not.

## Why the real risk is cookies, not defacement

The obvious harm is the boring one: an attacker serves phishing or malware from a hostname that genuinely belongs to your organisation, with your name in the URL and, depending on setup, a valid certificate.

That is bad. It is not the worst case.

The worst case is **session cookies**. Cookies are frequently scoped to a parent domain rather than a single host, which means a cookie set for \`example.com\` is sent to \`anything.example.com\` — including a subdomain an attacker now controls.

Silent Push's framing is that compromised session cookies can let an adversary use hashed credentials stored in cookies to **authenticate as a user**, with exposure potentially reaching **company-wide SSO**.

Follow that through. The attacker did not phish anyone, did not exploit a vulnerability in your application, and did not need to touch your infrastructure. They claimed a name you abandoned, and the browser handed them a session on the way past.

The other consequences on the list — cross-site scripting, email spoofing, traffic redirection — are all real, and all secondary to that one.

## Why this keeps happening

Dangling records are not a failure of skill. They are a failure of sequence.

Creating a DNS record and creating a cloud resource are two actions in two systems, usually with two owners. Deleting the resource is a single action, and it is the one that gets taken when a project ends, a campaign finishes, or an experiment is abandoned. Deleting the record is a separate action, in a separate console, that nothing forces and nobody is reminded about.

The asymmetry is structural: creation is deliberate, deletion is partial. And the resulting record is invisible in normal operation, because nothing points to it and nobody visits it. It sits there resolving quietly for years.

Marketing campaign subdomains, staging environments, retired products, acquisitions whose DNS was never fully reconciled — that is where the three million live.

## What to do

- **Enumerate your own DNS, not your website.** The exposure is in records nothing links to. An attack-surface exercise that starts from your homepage will not find them.
- **Look for CNAMEs pointing at cloud services**, then verify each target still exists and still belongs to you. That is the specific check.
- **Scope cookies to hosts where you can.** If a session cookie does not need to be valid across every subdomain, the takeover of one becomes an inconvenience rather than an authentication bypass.
- **Make record deletion part of decommissioning.** The reason these accumulate is that nothing in the teardown checklist mentions DNS. Adding one line is the whole fix, prospectively.
- **Check what your providers do.** Five thousand of the seven thousand ambiguous cases were safe because the provider prevented reclaiming a used name. That is worth knowing per-service rather than assuming either way.

## The framing worth keeping

Most attack-surface work asks what is exposed. This asks something narrower and more awkward: **what did we point at, and is it still ours?**

Those are different questions, and only the second one finds a subdomain that has been quietly resolving to somebody else's server since a project ended three years ago.`,
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
