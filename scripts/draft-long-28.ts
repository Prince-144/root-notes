/**
 * Long-form drafts — 25 August 2026, second batch.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, cannot read a table, and
 * truncates past ~460 characters. Each section's strongest paragraph is written
 * to stand alone, carry its own figures, and stay under that limit. The Uber
 * piece in the last batch shipped with a section whose only self-contained
 * paragraph was an aside, and the slide promised a point the body never made.
 *
 * Sourcing note: the Oracle piece is built from CISA's own KEV JSON feed and
 * the text of BOD 26-04, both read directly rather than through coverage. The
 * three-day due date and the revocation of BOD 22-01 come from those primary
 * sources. Table 1 of the directive is published as an image, so the general
 * remediation timelines are described, not quoted.
 *
 * Disclosure note: the Anthropic piece is written with an Anthropic model about
 * an Anthropic announcement. Same handling as the Claude outage piece — every
 * fact from published material, no inside knowledge, conflict stated in the
 * article itself.
 *
 * Cover note: all four downloaded and viewed. Rejected during this batch: an
 * audio stage box with "MIDAS" legible (searched as a server rack), a bright
 * abstract that the entropy crop had rendered meaningless, and an identifiable
 * person on a phone — on a story about an employee who was phished, a real
 * face implies that is the person.
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
    slug: "cve-2026-21962-weblogic-seven-months-kev-three-day-deadline",
    title:
      "Exploited since January, added to CISA's list in August, due in three days",
    excerpt:
      "CVE-2026-21962 is a CVSS 10.0 flaw in Oracle's HTTP Server and WebLogic proxy plug-in. Oracle patched it on 20 January. Exploit code appeared on 22 January and a honeypot logged attacks the same day. CISA added it to the Known Exploited Vulnerabilities catalog on 24 August with a due date of 27 August — and under a directive nobody noticed replacing the old one, agencies now have to check whether they were already breached.",
    categorySlug: "security",
    tags: [
      "oracle",
      "weblogic",
      "cisa-kev",
      "patching",
      "vulnerability-management",
      "bod-26-04",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1594915440248-1e419eba6611${P}`,
    body: `**CISA** added exactly one vulnerability to its Known Exploited Vulnerabilities catalog on **24 August 2026**. The catalog's own feed gives it a due date of **27 August** — three days.

The vulnerability was patched seven months earlier.

## What it is

**CVE-2026-21962**, CVSS **10.0**, in **Oracle HTTP Server** and the **Oracle WebLogic Server Proxy Plug-in**. CISA's catalog classifies it as **CWE-284**, improper access control, and describes the result as unauthorized creation, deletion or modification access to critical data, as well as complete access to all data those components can reach.

No authentication. Network access over HTTP is enough.

The affected component matters as much as the score. Proxy plug-ins sit in front of the application server, frequently in a DMZ, which is to say on the part of the estate that is deliberately reachable from the internet.

## The timeline is the story

- **20 January 2026** — Oracle ships the fix in its January Critical Patch Update.
- **22 January 2026** — exploit code is published. A **CloudSEK** honeypot running WebLogic **14.1.1.0.0** logs the first exploitation attempt the same day.
- **February 2026** — a single address, **193.24.123[.]42**, is seen trying this flaw alongside **CVE-2020-14882**, **CVE-2020-14883**, **CVE-2020-2551** and **CVE-2017-10271**.
- **25 March 2026** — CloudSEK publishes the honeypot study.
- **24 August 2026** — CISA adds it to the KEV catalog.
- **27 August 2026** — the federal due date.

Seven months of public exploit code and documented attacks, then a three-day deadline.

That is not a criticism of the deadline. It is the observation that the deadline is the part of the process that moves fast, and the listing is the part that does not. An organisation waiting for KEV to tell it what to patch was, in this case, waiting from January to August.

The company alongside it in that February traffic tells you who else was interested: **CVE-2017-10271** is nine years old. That is the same pattern as [UAT-10147, which selected 170,000 targets by machine and then fired old CVEs at them](/article/uat-10147-spectre-implant-170000-urls-old-cves).

## The directive nobody wrote about

The KEV entry cites **BOD 26-04**, issued **10 June 2026**. It is worth knowing what that is, because it quietly replaced the regime most people still describe as current.

BOD 26-04 **supersedes and revokes BOD 22-01** — the November 2021 directive that created the KEV catalog — and also revokes **BOD 19-02** from 2019. Both are now marked *Revoked* on CISA's own site.

Urgency under the new directive is set by four questions rather than a flat clock:

| Variable | Question |
| --- | --- |
| Asset Exposure | Is the vulnerable asset publicly exposed? |
| KEV Status | Is the CVE in the KEV catalog? |
| Exploit Automation | Can an adversary automate every step of exploitation? |
| Technical Impact | Does exploitation give partial or total control? |

CVE-2026-21962 answers badly on all four, which is how a listing on Monday becomes a deadline on Thursday.

## The requirement that should change your incident plan

BOD 26-04 does not stop at patching. It establishes expectations for **forensic triage** — when agencies must check whether threat actors compromised the system *before* the patch was applied.

For a flaw with public exploit code since January and a listing in August, that is not a formality. Patching now closes the door; it says nothing about the preceding seven months. The KEV entry's notes link to CISA's forensic triage requirements alongside the patch link, which is the directive working exactly as designed.

The reasoning CISA gives for the new approach names the cause directly: cyber threat actors exploit unpatched vulnerabilities, and their use of AI may further narrow the time defenders have to react between patch release and possible exploitation.

That is a US federal directive citing AI as the reason the old timelines no longer hold — the same force that took Spring from **16** disclosed vulnerabilities in 2025 to over **200** this year, read from the other side.

## One oddity worth flagging

The catalog's required action for this entry still reads: apply mitigations per vendor instructions, follow applicable **BOD 22-01** guidance for cloud services, or discontinue use of the product.

BOD 22-01 was revoked in June. The reference is almost certainly standing boilerplate rather than a substantive instruction, and nothing about the remediation changes because of it. It is still a stale pointer in the authoritative feed, and if you are automating against KEV, that field is not a reliable guide to which directive governs you.

## What to do

- **Check whether you run the proxy plug-in**, not just WebLogic. The Apache HTTP Server and Microsoft IIS plug-ins are the affected components, and they are often installed by a different team than the one that owns the app server.
- **Patch to the January 2026 CPU or later.** The fix has existed for seven months.
- **Then look backwards.** Public exploit code since 22 January means a patch is not an all-clear. Pull what logs you have for that window.
- **Do not treat KEV listing as the start of exposure.** This entry is the clearest possible demonstration that it is not.
- **Read BOD 26-04 if you benchmark against federal practice.** A lot of private-sector policy still cites BOD 22-01 by name.

## What is not established

- **Victim counts.** None published.
- **Attribution.** No actor named.
- **Ransomware use.** The KEV entry records it as *Unknown*, which means undetermined rather than ruled out.
- **Why the gap was seven months.** CISA has not explained the timing, and the criteria for addition are not the same as the criteria for noticing.`,
  },
  {
    slug: "reliaquest-shinyhunters-vishing-okta-dashboard-view-only",
    title:
      "They phoned a security company, used real employees' names, and got in",
    excerpt:
      "ShinyHunters registered a fake ReliaQuest SSO page and rang staff one by one, each time impersonating a named colleague from the security team. One person typed their password and approved the push. ReliaQuest says the attackers got view-only access to an Okta dashboard and nothing else — and the interesting part is which controls held.",
    categorySlug: "security",
    tags: [
      "social-engineering",
      "vishing",
      "shinyhunters",
      "okta",
      "mfa",
      "identity",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1773946870146-269941c80bdb${P}`,
    body: `**ReliaQuest** sells detection and response. Over the weekend before **24 August 2026**, it became the story instead of covering one.

The group **ShinyHunters** registered a domain hosting a fake ReliaQuest single sign-on page, then telephoned multiple ReliaQuest employees. On each call the attacker posed as a named security employee and directed the target to the fraudulent site.

One employee entered their credentials and approved a push notification.

## What the attackers got

Per ReliaQuest: **view-only** access to its **Okta** identity dashboard, and one user's login credentials.

The company says attempts to move from there into applications were **consistently denied**. It states that no additional identities were accessed, no business applications were reached, no customer or company data was accessed beyond those login credentials, and no persistence was established. It calls claims of ransomware involvement **false**.

ShinyHunters posted screenshots said to show the Okta dashboard, with taunting messages.

## Read the controls, not the embarrassment

The obvious take is that a security company got phished. It did, and it is not a good look.

The more useful read is that this incident splits cleanly into a control that failed and a set that held, and the split is instructive for anyone running the same stack.

**What failed:** the human check, and MFA. A push notification is an approval prompt, and a person who has just typed their password into what they believe is their own login page will approve the push that follows. Push-based MFA is not a defence against a live relay — it is a defence against a stolen password used later, which is a different attack.

**What held:** authorisation. Getting one identity did not get applications. Whatever ReliaQuest has behind Okta — conditional access, device posture, per-application policy — refused the attacker at every door. That is the control that turned a compromised employee into a screenshot rather than an incident.

Blast-radius containment is unglamorous and it is what worked here.

## The technique is the trend

Calling people is back, and it works because it inverts the training.

Employees are drilled to distrust unexpected email. A phone call from a colleague whose name is real — who knows the internal team structure well enough to pick one — arrives through a channel most awareness programmes barely cover. It also creates time pressure that email cannot: someone is waiting on the line.

That the caller used **real employees' names** is the operationally significant detail. It means reconnaissance preceded the calls, and staff directories, LinkedIn, or a prior data set were enough to build a credible script.

We have written this month about attacks that remove a defender's visibility — [an implant that unlinks EDR callbacks in the Windows kernel](/article/uat-10147-spectre-implant-170000-urls-old-cves), [a Defender driver that can delete Defender at boot](/article/defender-btr-sys-boot-time-removal-golden-window-no-patch). This is the low-technology member of the same family. Nothing is bypassed. A person is asked, and says yes.

## The deleted post

ReliaQuest's original post on X warning about the phishing campaign was later deleted.

We do not know why, and there are ordinary reasons — a legal review, a correction, an incident-communications process taking over from an individual. It is recorded here because it is a fact of the public record, not because it implies anything. Where a company's own timeline of disclosure matters to readers, it is worth noting that part of it is no longer visible.

## What to do

- **Treat inbound calls claiming to be internal staff as unauthenticated.** Hang up, call back on a number from your own directory. This is the single control that defeats the whole technique.
- **Move the accounts that matter off push approval.** Phishing-resistant MFA — passkeys, FIDO2 security keys — does not relay, because the credential is bound to the real domain. Push and one-time codes both do.
- **Assume one identity will fall.** ReliaQuest's outcome was decided by what sat behind Okta, not by whether anyone clicked.
- **Watch for newly registered look-alike domains** of your own SSO. That registration was the first observable step here.
- **Rehearse the call.** Staff who have heard the pretext once are dramatically harder to run it on.

## What is not established

- **How many employees were called**, or how many resisted before one did not.
- **How the attackers built their list of names.**
- **The exact dates** of the calls beyond the weekend before the 24 August statement.
- **Whether ShinyHunters' screenshots show anything beyond what ReliaQuest describes.** The company's account and the attackers' claims disagree, and only one side has been independently checked — which is to say neither.`,
  },
  {
    slug: "anthropic-mythos-5-defenders-findings-not-the-model-35m-fund",
    title:
      "Anthropic will give defenders what its strongest security model finds — but not the model",
    excerpt:
      "Claude Security now scans code with Mythos 5, the model Anthropic keeps most tightly restricted. Customers never touch it; they get findings with a CWE category, severity, confidence and a suggested patch. Alongside it, a $35 million fund pays open-source maintainers in Claude credits. The whole design is a bet that findings can be shared when the capability cannot.",
    categorySlug: "ai",
    tags: [
      "anthropic",
      "mythos-5",
      "ai-security",
      "open-source",
      "vulnerability-discovery",
      "dual-use",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1706101299176-292d8c5e470e${P}`,
    body: `**Anthropic** has put **Mythos 5** — the model it restricts most tightly — to work scanning customer code, without letting anyone talk to it.

That sentence is the whole design, and it is worth taking seriously rather than reading as marketing.

## What was announced

**Claude Security**, in public beta for Claude Enterprise customers, now runs its scans on Mythos 5. The scan connects to a **GitHub** repository, traces data flows across files, and returns each finding with a **CWE** category, **confidence** and **severity** ratings, and a **suggested patch**. A human approves before anything is deployed. It is billed as ordinary token usage rather than a separate product.

Customers do not interact with Mythos 5. Access runs through purpose-built security interfaces that return defined outputs — patches, alerts — and nothing else.

Alongside it: the **Defender Advantage Fund**, **$35 million** in Claude credits for organisations helping open-source maintainers secure their projects. Grants target patching live vulnerabilities, building scanning and patching processes other projects can reuse, and approaches that make a project resistant to whole classes of attack. Anthropic says it is beginning with selected pilot grants and will name recipients later.

The company has previously put **$4 million** into direct donations and support through Project Glasswing.

## The disclosure

This piece was researched and written with an Anthropic model, about an Anthropic announcement. That is a conflict and we handle it the way we handled [the Claude outage in this same week](/article/claude-outage-24-august-2026-opus-5-elevated-errors): every fact here comes from published material, there is no inside knowledge in it, and the questions we would ask any other vendor are asked below.

## The asymmetry bet

The interesting claim is structural. If a model is good enough at finding vulnerabilities to be genuinely dangerous released, but its *findings* can be handed to defenders safely, then you can give away the output of a capability you will not give away.

That is a real distinction, and it may well hold. A CWE-tagged finding with a suggested patch tells an attacker nothing they could not learn by reading the patch once it ships. The model that produced it, in an attacker's hands, is a general-purpose discovery engine pointed at everyone else's code.

It is also a bet on one thing being true: that Anthropic reaches each codebase first. [Broadcom pointed AI at Spring and took the count from 16 disclosed vulnerabilities in 2025 to over 200 this year](/article/spring-91-cves-200-this-year-broadcom-ai-discovery). [Anthropic's own agent swarm surfaced 266 vulnerabilities across 15 open-source projects](/article/anthropic-multiagent-conflict-kill-loops-266-vulnerabilities). Every one of those is a bug now fixed rather than available — but only because a defender got there first.

The advantage is not in the model existing. It is in the order of arrival. And [a command-and-control framework with a natural-language front end already sells for $99.99](/article/redc2-4-npm-packages-llm-red-agent-99-dollars), which is the other side of the same race.

## Why credits and not money

**$35 million** in Claude credits is not **$35 million**.

That is not an accusation — credits are the natural unit when the thing you are funding is model usage, and a maintainer who needs scanning needs tokens more than they need a cheque. It is also, plainly, a structure where the cost to the provider is marginal compute and the benefit is adoption. Both readings are true at once, and the honest position is to say so rather than pick one.

The harder question for open-source maintainers is what happens when credits run out. A project that has restructured its security process around a scanning tool it did not pay for has a dependency, and the fund's own framing — build processes other projects can reuse — suggests Anthropic knows it. Whether the grants produce portable practice or vendor lock-in will not be visible for a year.

## The other half: fewer safeguards for vetted defenders

Less discussed and arguably more consequential: the **Cyber Verification Program** is expanding. Vetted organisations already operating with reduced safeguards on Claude Opus and Sonnet get broader dual-use capabilities, including vulnerability triaging and validation, with Mythos-class access to follow.

So there *is* a path to the model itself. It runs through a vetting process, and the question that decides whether this is a defender advantage or a new gatekeeper is who passes it. A national CERT will. A two-person team maintaining a library that half the internet imports may not.

## What is not established

- **How many vulnerabilities Claude Security has found.** No figures released.
- **Who receives the fund's grants.** Recipients are to be named later.
- **The rollout timeline** for Mythos-class access under the verification programme.
- **The false-positive rate.** Findings carry a confidence rating; no accuracy data has been published, and at scan volume that number decides whether this saves maintainers time or costs it.
- **What vetting requires.** The criteria for the Cyber Verification Program are not public.`,
  },
  {
    slug: "weedhack-fake-minecraft-clients-seo-poisoning-defender-exclusions",
    title:
      "The fake Minecraft client outranked the real one — and the first thing it does is exclude itself from Defender",
    excerpt:
      "McAfee blocked more than 6,300 attempts to reach sites distributing Weedhack, malware posing as popular Minecraft clients. SEO poisoning put the fake pages above the official projects in Google, Bing, Brave and DuckDuckGo, and nearly half the malicious links were hosted on Discord. The payload sets Microsoft Defender exclusions before doing anything else.",
    categorySlug: "security",
    tags: [
      "malware",
      "seo-poisoning",
      "gaming",
      "minecraft",
      "discord",
      "mcafee",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1615869442320-fd02a129c77c${P}`,
    body: `**McAfee Labs** has documented **Weedhack**, malware distributed through websites impersonating popular **Minecraft** clients. McAfee blocked more than **6,300** attempts to reach them.

The delivery is the interesting half.

## The search results were the attack

**SEO poisoning** put the fake download pages **above the official projects** in Google, Bing, Brave and DuckDuckGo.

A user who did everything right — searched for the tool by name, did not click an ad, took the top organic result — landed on the attacker's site. There was no phishing email and no fake link in a chat. The search engine handed it over.

Nine fake domains were identified, impersonating **Glazed Client**, **Radium Client**, **SeedCrackerX**, **Meteor Client**, **22qq Client**, **Krypton Client**, **Nova Client** and **Xenon Client**, on domains such as glazed-client[.]com and radium-client[.]com.

## Where the files actually lived

The hosting split, per McAfee, is the part worth memorising:

| Platform | Share of malicious URLs |
| --- | --- |
| Discord | 49.6% |
| MediaFire | 23.4% |
| GitHub | 8.2% |

Nearly half the malicious URLs were **Discord** links. McAfee's researchers make the point directly: attackers use familiar platforms alongside fake websites to distribute malware.

That is the same structural problem as every campaign we have covered this month. A download from Discord or GitHub is indistinguishable at the network layer from the thousands of legitimate ones an organisation makes daily, and blocking the domain is not available to you. Distribution also ran through file hosts Planet Minecart and EndMods, YouTube redirect channels, and Reddit.

## Then it blinds the defender

Once running, Weedhack collects system information, **configures Microsoft Defender exclusions**, steals sensitive data, and deploys **JAR** payloads in a multi-stage sequence.

The Defender exclusions step is the one to notice, and it is the third time this month the same move has appeared in a different form. [SPECTRE unlinks EDR callbacks in the Windows kernel](/article/uat-10147-spectre-implant-170000-urls-old-cves). [A signed Defender driver can delete Defender at boot](/article/defender-btr-sys-boot-time-removal-golden-window-no-patch). Here the malware simply tells Defender not to look at the folder it lives in.

None of these defeat the product. They remove its ability to see, which produces the same silence as a clean machine — and that is the harder problem, because an absent alert is indistinguishable from safety.

Setting an exclusion requires administrator rights, which means a user who clicked through an elevation prompt for what they believed was a game mod.

## Why the target matters

Minecraft clients are installed by people who are used to sideloading — the entire modding culture involves downloading executables from small independent projects, and antivirus warnings on legitimate mods are common enough that users are trained to click past them.

That is a population where "this is unsigned, continue anyway" is a normal Tuesday, and a large share of it is young.

The security advice that works for an enterprise — only install signed software from vendor sites — is close to unusable here, because the legitimate clients are unsigned software from small sites. Which is exactly why the technique was chosen.

## What to do

- **Type the project's URL or use a saved bookmark.** Do not search for a client by name. The search result was the compromise in this campaign.
- **Check Defender exclusions on any machine used for modding.** They are in Virus & threat protection settings. An exclusion nobody remembers adding is a finding, and it is checkable in a minute.
- **Treat a UAC prompt from a game mod as the decision point.** A client does not need administrator rights to run.
- **Do not trust a Discord link because a community trusts the poster.** Half the malicious URLs here were Discord links.
- **If you administer a household or a school**, this is the campaign to explain in person. The population it targets does not read advisories.

## What is not established

- **How many devices were infected.** McAfee reports blocked attempts, not victims — 6,300 blocks is a measure of one vendor's telemetry, not the campaign's reach.
- **Which countries were affected.** Not enumerated.
- **Who operates it.** No attribution.
- **What data is stolen.** Described as sensitive data; no specific targets named.
- **Whether the fake sites are still ranking.** The takedown status was not reported.`,
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
