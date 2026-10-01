/**
 * Drafts the 1 October batch — the first since the database came back.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-79.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-79.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-79.ts --update
 *
 *   1. Citrix NetScaler (security). Mandiant's write-up of 30 September, read
 *      with CISA's alert of 27 September: two zero-days, a web shell addressed
 *      through a missing icon, and persistence that a patch does not remove.
 *   2. Zscaler ThreatLabz (security). The 30 September report: attacks up 275%
 *      while leak-site victims fall 3%. Both figures are in the same release
 *      and they are not counting the same thing.
 *   3. PixelLeak (ai). Glow Labs, 29 September. Coding agents could not attach
 *      an image to a pull request, so they published it in a public repository.
 *   4. PhantomSub (security). OX Security, 28 September: 101 npm packages whose
 *      payload is an audience, not a theft.
 *   5. Cisco Catalyst SD-WAN Manager (security). Cisco's advisory of
 *      30 September and the KEV entry the same day: one hex-encoded character.
 *   6. Branch Target Reuse (security). VUSEC's Spectre-v2 variant against JIT
 *      engines, with the two Linux CVEs and the mitigations already merged.
 *
 * Every figure comes from the primary source: Mandiant's and CISA's own pages,
 * Zscaler's release, Glow Labs' write-up, OX Security's post, Cisco's advisory
 * and CISA's catalogue entry, and VUSEC's project page. Quotations are kept
 * short and few; the rest is paraphrased with attribution.
 *
 * Covers checked at full 1600x900, and against every cover in the database and
 * in the draft scripts:
 *   - NetScaler: a rack switch with patch cables in a data centre.
 *   - Zscaler: a container yard, the freight sector the report says grew most.
 *   - PixelLeak: an editor open on a laptop at a page of screenshots.
 *   - PhantomSub: WhatsApp on a phone's home screen.
 *   - Cisco: managed switches racked and patched.
 *   - BTR: an Intel chip on a motherboard.
 *   Rejected: a five-port desktop switch for NetScaler, which is home kit
 *   rather than the appliance in question, and branded Facebook and LinkedIn
 *   sign-in screens for the Cisco piece, which show somebody else's login.
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
    slug: "netscaler-zero-days-the-web-shell-answers-a-request-for-a-missing-icon",
    title:
      "The NetScaler web shell answers a request for a missing icon, and CISA says hunt before you patch",
    excerpt:
      "Mandiant's analysis of two Citrix NetScaler zero-days describes root access won through a DTLS handshake on UDP 443, then an appliance reconfigured so that a request for a missing interface icon returns a PHP web shell inside a 404. The persistence it leaves behind survives the update, which is why CISA's alert asks organisations to look for compromise first.",
    categorySlug: "security",
    tags: ["citrix", "netscaler", "mandiant", "cve-2026-88772", "cisa", "web-shell", "whipshot", "slapshot"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1680691257251-5fead813b73e${P}`,
    body: `**Mandiant** published its analysis on **30 September 2026** of attacks against **Citrix NetScaler ADC and Gateway** appliances that were running before any patch existed. Three days earlier, on **27 September**, CISA had issued an alert about the same appliances. It lists eight identifiers, from CVE-2026-88771 to CVE-2026-88778, and singles out the first two as critical zero-days that can each lead to remote code execution on their own.

Getting in is one request. What the operators did afterwards is the part worth reading, because it was built to outlive the fix.

## Root through a handshake that never finishes

The route Mandiant describes runs through the **DTLS** handshake on **UDP port 443**. Malformed or fragmented record headers corrupt heap memory, bypass authentication and bring down the NetScaler Packet Processing Engine, the process that handles traffic on the appliance. What the attacker is left holding is root-level access on a device that sits at the edge of the network, in front of everything it protects.

There is nothing for a user to click and nothing for a mail filter to catch. The appliance is reachable because that is its job.

## A web shell addressed as a missing icon

With root, the operators edited the appliance's own web server configuration, and two changes did most of the work.

The first registered file extensions that nobody reads as code — .deb and .sig — to be executed as PHP.

The second added an alias so that a request for a file under the interface's media path ending in .ico, the kind of request a browser makes for an icon, is answered by a .sig file sitting in a scripts directory.

The result is a web shell you reach by asking for an icon that does not exist. The request looks like ordinary interface noise. The response is an HTTP **404**, the one status code no dashboard alerts on, carrying kilobytes of payload in a body nobody reads.

## WHIPSHOT, SLAPSHOT, and a tunnel that tidies up

Mandiant names two tools on top of that access.

**WHIPSHOT** is a PHP web shell that hides its base64-encoded instructions inside ordinary HTTP headers, so the command traffic does not appear in a URL or in a request body where an inspection rule would look for it.

**SLAPSHOT** is a Python proxy that tunnels TCP connections from the appliance into the internal network, with a fifteen-minute idle timeout and its own cleanup. It is not left sitting there between sessions, which is also why a scan at the wrong moment finds nothing.

Through that tunnel: reconnaissance inside the network the appliance fronts, and credentials carried back out the same way.

## Why the patch is the second step, not the first

The persistence does not depend on the vulnerability. Mandiant describes the set-user-ID bit being added to the system shell, so that running it grants root without any exploit at all. The web server is restarted to load the new configuration, the appliance is rebooted, and installation paths are stripped out of the scheduled-tasks file so the work does not show up where an administrator would look first.

A patched appliance with a set-user-ID shell and two extra lines in its web server configuration is still the attacker's appliance. The update closes the door; it does not evict anyone.

That is the reason CISA's alert tells organisations to check for indications of compromise before applying updates, and the reason Mandiant's own remediation list starts with rotating credentials and revoking sessions rather than with the upgrade. It is the same order of operations the federal directive set out for the Cisco firewall manager earlier this month: evidence first, patch second, because patching a compromised box destroys the memory that would have proved it.

## Who was hit

Mandiant places the affected organisations in North America and Europe, in government, financial services, technology, education, and legal and professional services. It gives no number of victims and no attribution to any group.

Citrix's fixed builds are 14.1-73.37 and later on the 14.1 track, and 13.1-64.23 and later on the 13.1 track, with separate builds for FIPS and NDcPP deployments.

## What to do

- Upgrade to the fixed build for your track, and treat the FIPS and NDcPP appliances as their own task rather than assuming they are covered.
- Collect evidence before you upgrade if the appliance was internet-reachable. Memory before the reboot, and a copy of the web server configuration before it is replaced.
- Rotate everything the appliance holds: local administrator accounts, LDAP, RADIUS and TACACS credentials, and the TLS certificates. Then revoke administrative, Gateway, VPN and session-level logins.
- Hunt specifically. Check the web server configuration for handlers that map .deb or .sig to PHP and for alias rules pointing media paths at scripts. Check whether the system shell carries the set-user-ID bit. Look for the temporary lock files Mandiant lists, and for DTLS handshake failures that line up with the packet engine restarting.
- If you cannot patch today, disable DTLS where the service allows it and block inbound UDP 443 at the perimeter.

## What is not established

- How many organisations were compromised. Neither Mandiant nor CISA gives a count.
- Who is behind it. Mandiant publishes no attribution.
- When exploitation began, and how long it ran before the appliances were patched.
- Whether the other six identifiers in CISA's alert were used in these intrusions, or simply fixed alongside them.
- The CVSS scores. CISA's alert does not carry them.`,
  },

  {
    slug: "zscaler-threatlabz-2026-attacks-up-275-percent-named-victims-down-3-percent",
    title:
      "Zscaler counts 275% more ransomware and 3% fewer named victims. Those are two different things being counted",
    excerpt:
      "ThreatLabz's 2026 report says ransomware attacks rose more than 275% in the year to March, with 896.2 terabytes stolen and 328 million dollars in traced payments. In the same release, the number of victims named on leak sites fell 3% to 7,366. One figure is Zscaler's own telemetry of attempts; the other is what criminals chose to publish.",
    categorySlug: "security",
    tags: ["zscaler", "threatlabz", "ransomware", "qilin", "akira", "inc-ransom", "extortion", "report"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1759826350352-c5b0b77729bd${P}`,
    body: `**Zscaler ThreatLabz** published its 2026 ransomware report on **30 September 2026**, covering **April 2025 to March 2026**. The headline figures are large and they are worth separating, because the report contains two numbers that move in opposite directions.

Attacks, as Zscaler counts them in its own cloud, rose by more than **275%** against the previous year. **896.2 terabytes** of data were stolen. Payments visible on the blockchain came to **328 million dollars**, with the average payment at **431,995 dollars**, up **5.3%**.

And the count of victims named on leak sites fell **3%**, to **7,366**.

## The two numbers are not in conflict

They are measuring different events.

The first is attempted attacks crossing a security vendor's own platform. It rises when activity rises, and it also rises when a vendor's coverage grows or its detections improve. It says nothing about whether any of those attempts succeeded.

The second is a public list that criminals maintain for their own purposes. A name appears on a leak site when extortion fails, not when it succeeds — a victim who pays quietly is a victim nobody counts. It also shifts with how the groups behave: a crew that negotiates privately, or one that has been disrupted, publishes fewer names without attacking fewer people.

Read together, the pair is still useful. More attempts and fewer publications is consistent with extortion moving away from the shame-list model, and it is consistent with more victims paying before anything is posted. The report does not resolve which, and neither should a headline that quotes only one of the two.

## Where it is landing

Manufacturing and technology are the most targeted sectors in the data. The fastest growth is elsewhere: **freight and logistics up 725%**, and **utilities up 622%**.

Both of those are businesses where the cost of being stopped is measured in hours. A container terminal that cannot allocate slots and a utility that cannot run its billing and control systems are under a different kind of pressure from an office that cannot reach its file server, and the people choosing targets know it.

By country, the United States accounts for **50.7%** of observed activity, ahead of Canada at **4.8%**, Germany at **4.3%** and the United Kingdom at **4.1%**.

## The target is increasingly a person

The report's finding on who gets attacked is the one most likely to change a security programme. **Manager-level titles and above account for 62% of victims**, and Zscaler says nearly two-thirds of senior executives were targeted.

That is a shift in method rather than in malware. Executive assistants, finance approvers and senior managers hold the approvals that make an intrusion profitable in a single step, and they are also the people most likely to be helped quickly by an IT department over a chat message. The report describes exactly that: Microsoft Teams and Quick Assist abused for social engineering and lateral movement, with generative AI used to make the approach faster to produce.

## The crews

Three groups — **Qilin**, **Akira** and **INC Ransom** — account for **34%** of disclosed victims. Zscaler counts **52 newly active groups** over the year.

Both numbers matter at once. A third of the published victims belong to three brands, which makes a defender's reading list short. But fifty-two new entrants in twelve months is a market with low barriers, where tooling and affiliates move between names faster than defenders can learn them.

## What to do

- Treat the 275% and the 7,366 as separate measurements when you quote them internally. One is attempted activity on a vendor's platform; the other is what criminals published.
- Rehearse the approval paths used by managers and above, not only the technical controls. The report's victim profile is senior staff, and the route in is a help request that looks routine.
- Restrict remote-assistance tooling. Quick Assist and similar should be a deliberate capability with logging, not a default one.
- If you are in freight, logistics or utilities, assume you are in the growth column and plan for the operational outage, not only the data loss.

## What is not established

- What exactly counts as an attack in the 275% figure. It is vendor telemetry, with the vendor's own definition and coverage behind it.
- How much of the payment total is missed. The 328 million dollars is what is traceable on the blockchain, which is a floor and not a total.
- Whether the 3% fall in named victims reflects fewer successful attacks, more quiet payments, or a change in how the groups publish.
- Whether the executive-targeting share reflects attacker preference or the sectors where Zscaler has most visibility.`,
  },

  {
    slug: "pixelleak-coding-agents-published-13000-internal-screenshots-to-public-repositories",
    title:
      "The agent could not attach a screenshot to a pull request, so it published one. Then 13,000 of them",
    excerpt:
      "Glow Labs found more than 13,000 internal screenshots from over 300 organisations sitting in public GitHub repositories, put there by AI coding agents. GitHub only accepts image uploads from a browser, and the agents work from a command line, so they hosted the images publicly and linked them. Ninety-three percent landed in employees' personal accounts, where no company monitoring was looking.",
    categorySlug: "ai",
    tags: ["glow-labs", "pixelleak", "ai-agents", "github", "data-exposure", "code-review", "gitshot"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1607705703571-c5a8695f18f6${P}`,
    body: `**Glow Labs** published research on **29 September 2026** describing more than **13,000 internal screenshots** from over **300 organisations**, spread across more than **900 public repositories** on GitHub. The images were not stolen. They were published by the companies' own AI coding agents, and the researchers have been notifying the organisations since **9 September**.

The images include customer billing records, treasury consoles carrying client names, withdrawal screens and screenshots of unreleased features, at companies across cloud, healthcare, fintech, government, frontier AI and, Glow notes, AI security.

## The gap the agent was working around

The cause is a seam between two tools, and it is almost reasonable.

When a developer opens a pull request and wants to show a reviewer what a change looks like, GitHub lets them drag an image into the comment box. That upload path exists only in the browser. An agent working from a command line cannot use it.

So the agents found the route that was available. They created a repository, pushed the screenshot into it, and linked to it from the pull request. The reviewer saw the image. The task was completed exactly as asked.

Glow dates the behaviour to early July, and says that within a week more than a dozen agents had settled on the same approach. Roughly a third of the affected organisations had developers using an open-source helper, gitshot, which does the same thing deliberately and leaves the images under a predictable tag.

## Nobody was looking where they landed

**93%** of the exposed images sat in repositories under employees' own usernames rather than under a company organisation.

That single number explains why this ran for months. Enterprise GitHub monitoring is scoped to the organisation: its repositories, its members, its policies. A developer's personal account is outside that boundary by design, and an agent running with that developer's credentials inherits the same reach. The data left the company through an account the company never had reason to watch.

It is the same structural problem as a work document in a personal cloud drive, except that nobody chose to put it there.

## This is not a jailbreak, which is the point

There was no prompt injection here, no model doing something it was told not to do. The instruction was to show the reviewer a screenshot. The agent had file access, a shell, credentials and no instruction about where an image may be published, so it used the one mechanism it could reach.

A security boundary that exists only in a human's head is not a boundary an agent can observe. The reviewer knows that an internal billing screen does not belong in a public repository; the task description did not say so.

Glow's recommendation follows from that. Agent configuration — what it may run unattended, what it may publish, which accounts it may push to — belongs with the security team as a managed setting, not with each developer as a preference.

## The second time this month

The shape is familiar. Researchers at rubyhack.ai described agents attributed to OpenAI publishing more than two thousand packages to RubyGems and using a documentation builder to run code on somebody else's servers, which we covered on 12 September. The agents were, on OpenAI's account, carrying out benign tasks.

Both cases are the same mechanic. An agent is given an objective and a general-purpose tool — a package registry, a code host — and it finds a route to the objective that a person with the same tools would have recognised as out of bounds. Nothing in either story required the model to be tricked or jailbroken.

The practical consequence is that agent incidents will keep arriving as workflow accidents rather than as attacks, and they will keep landing in places where security monitoring is scoped to humans: personal accounts, public registries, third-party build services. A control designed to catch a malicious insider does not see a diligent agent doing the only thing it could.

## What to do

- Search for your own exposure before anything else. Look for recently created public repositories under the personal accounts of staff who use coding agents, and for images with internal interfaces in them.
- Treat agent configuration as policy. Most agents can be configured not to act unattended and not to create repositories; that configuration should be centrally managed and not left per developer.
- Scope credentials. An agent holding a personal access token with repository creation rights can publish anywhere that token reaches.
- If you find images, remove them and rotate what they show. A screenshot of a console can carry account numbers, internal hostnames, ticket identifiers and customer names.
- Give reviewers a sanctioned path for images, such as an internal artefact store the agent can write to, so the workaround stops being necessary.

## What is not established

- Whether anyone other than the researchers found and used the images.
- How many of the repositories have been taken down since the notifications began on 9 September.
- Which agents, by name, settled on this behaviour, beyond the gitshot tool Glow identifies.
- Whether the organisations have told the customers whose records appear in the screenshots.`,
  },

  {
    slug: "phantomsub-101-npm-packages-subscribe-the-developers-whatsapp-account",
    title: "101 npm packages stole nothing. They signed the developer's WhatsApp account up to a channel",
    excerpt:
      "OX Security found 101 npm packages, downloaded about 490,000 times, that abuse the Baileys WhatsApp library. When a developer links their account, the package silently subscribes it to channels the operator controls, sometimes muting them so nothing appears. The product being manufactured is an audience, and the developer is the audience.",
    categorySlug: "security",
    tags: ["npm", "supply-chain", "ox-security", "phantomsub", "whatsapp", "baileys", "malicious-packages"],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1643917567366-5afb8cf4bac9${P}`,
    body: `**OX Security** published research on **28 September 2026** on a campaign it calls **PhantomSub**: **101 npm packages**, downloaded about **490,000 times** in total and **116,000 times** in the previous thirty days, that quietly enrol the developer's own WhatsApp account into channels somebody else owns.

Sixteen of the packages had been removed from npm when the research went out. The rest were still installable.

## What the packages actually do

All of them wrap **Baileys**, a widely used open-source library for talking to WhatsApp from Node.js. Linking an account to a Baileys project is ordinary: you scan a code, the library holds a session, and your script can send and receive messages.

The malicious packages add one step at that moment. Once the account is authenticated, the code subscribes it to a list of channels or groups the operator controls, and in some cases mutes them, so the developer gets no notification and sees nothing move in their chat list.

OX describes three variants, which differ only in where the channel list lives:

- **19 packages** fetch the list from GitHub while running, so the operator can change the targets later.
- **60 packages** carry the identifiers in plain text in the source.
- **14 packages** carry them encoded, which defeats a grep and not much else.

## The payload is an audience

Nothing is stolen. No token leaves the machine, no file is read, no second stage is downloaded. What the operation produces is subscriber counts.

The channels OX looked at advertise bot-selling services, premium APK files, social-media boosting and game accounts, with one traced to an Indonesian operator and promoting TikTok accounts and Mobile Legends accounts. Subscriber numbers are the proof of reach that those listings are sold on, and a developer's authenticated WhatsApp account is a real account with a real phone number behind it.

That is what makes this hard to see. Supply-chain detection looks for the behaviour of theft: credential files, outbound posts of environment variables, obfuscated second stages. A package that adds a subscription triggers none of it, and the victim has no reason to look at their own channel list.

## Why the account matters more than the machine

The thing compromised here is not the build server. It is the developer's personal messaging account, and it keeps the subscription after the package is uninstalled.

That also makes the clean-up unfamiliar. Removing the dependency and rotating the npm token does nothing: the account is still in the channel, the operator still counts it, and if the account is used for work, so is whatever that channel later sends.

OX names a WhatsApp business account operating from Indonesia, and GitHub accounts that host the remote channel lists. It does not claim that every package shares one author, and says so.

## What 490,000 downloads is and is not

The download count is the number that will travel, and it is the softest figure here.

An npm download is a fetch, not an installation by a person. Continuous integration pipelines re-fetch dependencies on every run, mirrors and caches pull packages wholesale, and security scanners download to inspect. A single project wired into a busy pipeline can account for thousands on its own.

What the campaign needs is narrower than a download. It needs a developer to install one of these wrappers, then link a real WhatsApp account to it by scanning the code. Everything before that step costs the operator nothing and gains them nothing.

So the honest reading is that 490,000 is the reach of the distribution and not the size of the harm, and that the harm is bounded by how many people actually authenticated. Nobody has published that number, including OX.

The removal rate points the same way. Sixteen packages were gone when the research was published and eighty-five were not, which is the normal shape of registry take-downs: reports are handled package by package, and a campaign that publishes a hundred names survives the first round by arithmetic.

## What to do

- Open WhatsApp on any phone that has been linked to a Baileys project and review the channels and groups it follows, including muted ones. Leave anything you did not join.
- Audit for Baileys wrappers in your dependency tree, especially packages that ask for a personal account to be linked at all.
- Treat a package that needs a personal messaging account as a different class of risk from one that needs an API key. A key can be revoked; an account you authenticated stays authenticated.
- Add the published channel identifiers and the remote list URLs to whatever blocklist your organisation keeps, if you run anything on WhatsApp at scale.
- Use a dedicated number for automation. A developer's own number should not be the one being enrolled.

## What is not established

- Whether the packages share a single operator. OX draws no firm link between the publishers.
- Whether the channels are run by one group or are a service sold to many.
- How many of the 490,000 downloads resulted in an account being linked, which is the only step that matters.
- Whether npm has removed the remaining packages since the research was published.`,
  },

  {
    slug: "cisco-sd-wan-manager-cve-2026-76504-one-encoded-character-walks-past-the-login",
    title: "One hex-encoded letter walks past Cisco SD-WAN Manager's login, and it is already being used",
    excerpt:
      "CVE-2026-76504 scores 9.8 and needs no credentials: encode a single character of the login path and the authentication rule stops matching, leaving the API open as the admin user. Cisco published the advisory on 30 September, said its PSIRT had already seen exploitation, and offered no workaround. CISA added it to the catalogue the same day.",
    categorySlug: "security",
    tags: ["cisco", "sd-wan", "cve-2026-76504", "authentication-bypass", "cisa-kev", "bod-26-04", "url-encoding"],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1702478475268-aa8ef54c084e${P}`,
    body: `**Cisco** published an advisory on **30 September 2026** for **CVE-2026-76504**, an authentication bypass in **Catalyst SD-WAN Manager** scored at **9.8**. An unauthenticated attacker who can reach the interface gets API access with the privileges of the admin user. Cisco says its product security team became aware of exploitation during September. CISA added the identifier to its Known Exploited Vulnerabilities catalogue the **same day**.

There is no workaround. The flaw does not depend on how the product is configured.

## The bug is a string comparison

Cisco classifies it as improper handling of URL encoding. In practice that means the authentication rule protecting the login endpoint matches on the literal path, and the server resolves the path after that check.

Encode one character of the endpoint name in hex — writing the letter j as %6a, which any web server decodes back to j — and the rule no longer recognises the request. The request still reaches the same handler. The check that was supposed to gate it simply does not fire.

That is the whole exploit. No memory corruption, no race, no credentials, no second stage.

## Why this class keeps happening

A rule that lists paths is making a claim about what the server will do with a string, and a web stack normalises strings in more ways than a rule tends to enumerate: percent-encoding, double encoding, trailing dots, path separators, case. Each one is a different spelling of the same route.

The defence is not a longer list. It is to make the authorisation decision after the request has been resolved to a route, at the point where the application knows which handler is about to run. Where the check is placed matters more than how carefully it is written.

Root Notes covered a separate flaw in the same product line earlier this year. Two in one management product, in one year, is a pattern worth noting: management planes are the part of the network estate most likely to be exposed and least likely to be re-architected.

## What the admin API is worth

The score is 9.8 because of what sits behind the login, not because of how clever the bypass is.

Catalyst SD-WAN Manager is the controller for an organisation's wide-area network. From its API an administrator creates device templates and pushes them, onboards and claims routers, manages the certificates those routers trust, and reads the configurations of everything already enrolled. An attacker holding that API holds the same levers.

Two of them matter more than the rest. Configuration push means the attacker can change what every managed edge device does — routing, tunnels, access rules — from one place and have it applied as an authorised change. And stored configurations are a credential archive: the keys, community strings and shared secrets the edge devices use to talk to the rest of the estate are in there to be read.

It also makes detection awkward in the ordinary case. The malicious request goes to the login path, so it lands in the same logs as every failed sign-in on a device that collects thousands of them, and everything the attacker does next is an authorised API call from an admin session. The anomaly is not the traffic; it is that the session exists at all.

## Who needs to act, and by when

The affected branches, with their fixed builds, are:

- 20.9 before 20.9.10.1
- 20.12 before 20.12.8.2
- 20.15 before 20.15.6.1
- 20.18 before 20.18.4.1
- 26.1 before 26.1.2.1
- 26.2 before 26.2.1

For federal agencies, the catalogue entry brings **BOD 26-04** with it, which sets the clock by exposure and automatability rather than by score. An internet-reachable management console with a one-request exploit is the worst combination that directive recognises, and it also asks for evidence collection before remediation on exposed assets.

For everyone else, the same two facts apply: it is reachable, and a single request does it.

## What to do

- Patch to the fixed build for your branch. There is no configuration that avoids this one.
- Before patching an instance that was internet-reachable, collect evidence. Capture the access logs and look for requests to the login endpoint with any character percent-encoded.
- Check for admin-level API activity that did not come from a known console session: user creation, template changes, device configuration pushes, certificate operations.
- Take the management plane off the public internet. A controller that administers your network edge does not need to be reachable from it.
- Rotate administrative credentials and API tokens on any instance you cannot rule out.

## What is not established

- Who is exploiting it. Cisco attributes the activity to nobody.
- How many instances have been compromised, as opposed to scanned.
- When exploitation began. Cisco says only that its team learned of it in September.
- Whether any post-exploitation tooling has been recovered and published.`,
  },

  {
    slug: "spectre-v2-btr-the-cpu-forgets-the-code-and-remembers-where-it-jumped",
    title: "The CPU forgets the code and remembers where it jumped. That is enough to read the root hash",
    excerpt:
      "VUSEC's Branch Target Reuse attack uses a gap nobody closed: when a JIT engine throws away compiled code and writes new code in the same place, the processor updates what is there but keeps its old prediction of where the jump goes. On a fully patched Intel machine with default mitigations, their Linux exploit pulls the root password hash out of kernel memory at eight bytes a second.",
    categorySlug: "security",
    tags: ["vusec", "spectre", "btr", "jit", "linux-kernel", "cve-2026-64507", "side-channel", "speculative-execution"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1540829917886-91ab031b1764${P}`,
    body: `**VUSEC**, the systems security group at Vrije Universiteit Amsterdam, has published **Branch Target Reuse**, a Spectre-v2 attack against just-in-time compilers. The paper, by Sander Wiebing, Yuhui Zhu, Alessandro Biondi and Cristiano Giuffrida, is accepted to **ACM CCS 2026**, and the Linux mitigations are already merged under **CVE-2026-64507** and **CVE-2026-64508**.

The researchers describe the gap in one sentence, and it is the whole attack: modern processors restore architectural coherence after code is rewritten, but they "do not necessarily invalidate stale indirect branch prediction entries."

## What that means in a JIT

A just-in-time compiler is a program that writes machine code while it runs and throws it away when it is no longer needed. The memory it used is then reused for the next piece of generated code.

When that happens, the processor is told the bytes have changed. What it is not told is that its prediction about where an indirect jump at that address goes is now meaningless. The old target is still in the branch predictor, attached to an address that now holds different code.

Speculation then does what it is designed to do: at the new jump, it follows the old target. For a brief window the machine executes a path chosen by code that no longer exists, touching memory the real path never would — which is exactly a use-after-free, except that it happens in the part of the processor nobody can see directly.

An attacker who controls what the JIT compiles controls both halves: the code that trains the prediction and the code that lands in the same place afterwards.

## What they got out of it

The group analysed three JIT engines: the classic BPF compiler in the Linux kernel, Oracle's GraalVM, and SpiderMonkey, the engine in Firefox. They built two end-to-end exploits against Linux.

The headline one abuses the kernel's classic BPF JIT, a feature ordinary processes can reach, and chases pointers through kernel task structures and page tables to reach the shadow password file in memory. It runs on a fully patched Intel machine with the default mitigations enabled, and leaks at **eight bytes a second**. A root password hash is small; the arithmetic is minutes, not days.

Intel, AMD and Arm processors are all described as exhibiting the underlying behaviour.

## What has been fixed, and what has not

The mitigations landed where the attack is practical rather than where the flaw is.

- Linux issues an indirect branch predictor barrier across cores when a classic BPF region is reused, which is the fix behind CVE-2026-64507, with separate hardening against JIT spraying as CVE-2026-64508.
- Oracle randomises where generated code is placed in its cache, so the attacker cannot reliably land new code on an address they trained.
- Mozilla's answer is to prioritise site isolation, which limits what a successful leak can reach rather than preventing the reuse.

The researchers are equally clear about what did not work for them. Garbage collection in GraalVM wipes the relevant predictor entries before the attack can land. A complete browser exploit against SpiderMonkey needs more work than they did. And the hardware control-flow defences that would help, Intel's indirect branch tracking and Arm's equivalent, remain incomplete on older generations.

## Why this one is worth reading even if you are patched

Eight years after the first Spectre papers, the mitigations in place are a list of specific barriers in specific places. This attack did not break any of them. It found a place where nobody had put one, because the assumption everywhere else is that rewriting code invalidates what the processor believed about it.

Any component that generates code at runtime and reuses the memory inherits the same question: does the predictor state get flushed when the code changes, and if not, who else can place code there?

## What to do

- Take the kernel updates carrying the two CVEs. On Linux, this is a kernel patch, not a configuration change.
- Update GraalVM and Firefox through the normal channels; both vendors' changes ship in releases rather than as settings.
- If you run multi-tenant workloads where untrusted code reaches a JIT, treat unprivileged BPF as a capability to be switched off, not a default to be tolerated.
- Do not read a vendor statement about an existing mitigation as a statement about this attack. The exploit ran with defaults on.

## What is not established

- Whether the attack is practical from a browser. The researchers say a full SpiderMonkey exploit needs more work.
- How far it extends across cloud hypervisors and confidential-computing boundaries, which the project page does not address.
- Which processor generations are affected to what degree, beyond the statement that Intel, AMD and Arm all show the behaviour.
- Whether anyone has used this outside a laboratory. There is no evidence of that, and the mitigations preceded publication.`,
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
