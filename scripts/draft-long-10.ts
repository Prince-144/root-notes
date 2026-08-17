/**
 * Long-form drafts — 12 August 2026, sourced away from The Hacker News.
 *
 * The previous batches leaned almost entirely on one outlet. These come from
 * BleepingComputer and SecurityWeek, and several of them are stories THN did
 * not run at all.
 *
 * Pass --update to rewrite existing drafts; published articles are never
 * touched.
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
    slug: "delta-591-rogue-wifi-defcon-flight-deauth",
    title:
      "Someone ran a rogue Wi-Fi network on a Delta flight full of DEF CON attendees",
    excerpt:
      "Flight 591 out of Las Vegas carried 199 passengers and a network called 'Delta WiFi Fast' that served a page harvesting Google logins. Crew killed the Wi-Fi for 30 minutes; federal officers boarded on landing.",
    categorySlug: "security",
    tags: [
      "wifi",
      "defcon",
      "social-engineering",
      "aviation",
      "phishing",
      "law-enforcement",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1731952161718-d645308c05bf${P}`,
    body: `**Delta Air Lines Flight 591**, Las Vegas to Atlanta, **10 August 2026**. A Boeing 757 with **199 passengers and 6 crew**, many of them returning from **DEF CON 34**.

Somewhere over the middle of the country, a network appeared called **"Delta WiFi Fast"**, serving a page that collected personal credentials and Google login data.

Cabin crew found it and **disabled the aircraft's Wi-Fi for about 30 minutes**. The detail arrived through **ACARS**, the aircraft's own text messaging system, which is how the crew was communicating about it in flight.

Delta's statement:

> One initial finding is an unauthorized WiFi network, which was not provided, operated, or supplied by Delta, was present onboard.

No emergency was declared with air traffic control. **Federal authorities and airport police boarded on landing**, questioned suspects and seized portable Wi-Fi equipment.

## What a deauth attack is, and why it matters here

A deauthentication attack forges packets that impersonate a legitimate access point and tell connected clients to disconnect. Keep sending them and devices stay off the real network.

On its own that is a nuisance. The reason it is done is the next step: a device knocked off the network will look for another one, and a rogue access point with a plausible name is waiting. That is how you move someone from the airline's Wi-Fi to yours, and from yours to a login page.

"Delta WiFi Fast" is a good name. It is close enough to be believed and different enough to look like an upgrade.

## The part that is genuinely serious

Cabin Wi-Fi is not connected to avionics. Aircraft networks are segregated, and nothing here suggests flight systems were reachable. That needs saying plainly, because "hackers attack plane" invites a conclusion the facts do not support.

What was at risk was 199 people's credentials, on a captive network they had no way to verify, at 35,000 feet with no alternative connection and no way to walk away.

That is the actual severity: a Wi-Fi network is a trust decision, and an aircraft is the environment where a passenger has the least ability to make that decision well. There is no second network to switch to and no cell service to check against.

## The DEF CON context cuts both ways

The obvious reading is that someone came from a hacking conference and did this for fun. That may be right and nobody has been charged.

The less obvious reading is that this flight is close to the worst possible target. A plane full of DEF CON attendees is a plane full of people who will notice a rogue AP, screenshot it, and hand it to the crew. The attack was found quickly for exactly that reason.

If the same thing ran on an ordinary Tuesday flight to Atlanta, it is not clear anyone would have said anything.

## What a traveller can actually do

- **Do not enter a Google or Microsoft login on an in-flight captive portal.** The airline's own portal never needs one.
- **Turn off auto-join for open networks.** This is the single setting that defeats the whole technique, and it is off by default on almost nobody's phone.
- **Use a VPN on any public Wi-Fi**, but understand its limit: a VPN protects the traffic, not the credential you typed into a phishing page before it came up.
- **Treat a network you did not expect as hostile**, particularly one with a name that is nearly right.

For anyone running a network rather than using one: this is 802.11 working as designed. Management frames are unauthenticated unless **802.11w** protected management frames are enabled, and on a lot of deployed hardware they still are not.`,
  },
  {
    slug: "ai-sidebar-extension-returns-chrome-store-after-ban",
    title:
      "A Chrome extension banned for stealing AI chats is back in the store, monetising uninstalls",
    excerpt:
      "'AI Sidebar with DeepSeek, ChatGPT, Claude and more' had 300,000 installs and a 4.6-star rating before Google removed it in January. It returned in August, clean for eleven days, then shipped a 21-line addition.",
    categorySlug: "ai",
    tags: [
      "browser-extensions",
      "chrome",
      "ai",
      "malware",
      "privacy",
      "supply-chain",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1634084462412-b54873c0a56d${P}`,
    body: `**"AI Sidebar with DeepSeek, ChatGPT, Claude and more"** reached **over 300,000 installs** and a **4.6-star rating** in the Chrome Web Store while scraping ChatGPT and DeepSeek conversation content and sending it to external domains.

**OX Security** flagged it in **December 2025**. Google removed it in **January 2026**.

It came back in **August 2026**, and **Netskope Threat Labs** found what it does now.

## The return was staged

| Version | When | What it did |
| --- | --- | --- |
| 1.7.2.0 | **20–31 July 2026** | Clean. Nothing malicious. |
| 1.7.3.0 | August 2026 | A **21-line addition** |

Eleven days of clean functionality is not an accident. It is update history — a record for a reviewer to look at, showing a well-behaved extension that has shipped a normal release. The payload arrives in the version after the one that established the pattern.

Netskope describes the malicious change as a surgical 21-line addition, which is the other half of the design. A small diff in an extension that already has a track record is close to the hardest thing for automated review to catch.

## What it does now

Not conversation theft. Affiliate fraud:

- Opens **affiliate links on update**
- **Overwrites the uninstall URL**, exploiting a Chrome behaviour, so removing the extension also generates a referral

The second one is the interesting one. Chrome lets an extension set a URL to open when a user uninstalls it — intended for feedback forms. Here it is a last commission on the way out. There is no user action that does not pay the developer.

## The listing is lying about who made it

The developer and data controller is listed as **Extchange.com** — a domain registered in **February 2024** with no public registrant information.

The store listing names **"DeepSeek AI"** as the developer. It is not.

That is a plain misrepresentation sitting in a store listing that passed review twice, and it is the detail that makes the "how did this get back in" question uncomfortable. The extension did not sneak back under a new identity. It came back with a false developer name on the same product that was banned.

## What this says about extension review

The pattern here is one we keep writing about in different registries — [the npm dropper](/article/npm-flooding-dropper-846-malicious-packages), [poisoned BdThemes plugin data](/article/dangling-dns-subdomain-takeover-silent-push) — but the browser case has a property the others do not.

An extension with sidebar access to your AI chats sits inside the session. It does not need credentials or a supply chain; it is already authenticated as you, on every page. When the payload was conversation theft, that meant everything you typed into ChatGPT — which for a lot of people includes code, customer data and internal documents.

The current payload is comparatively harmless. The access it retains is not.

## What to do

- **Check your extension list for this one** and remove it. Then check what else has permission to read page content.
- **Assume a banned extension can return.** Removal from the store does not uninstall it from machines that already have it, and does not prevent a relisting.
- **Treat "AI assistant" extensions as data processors.** If an extension can see your ChatGPT window, it can see everything you put in it.
- **In an enterprise, allowlist extensions rather than blocklisting them.** A blocklist requires knowing the name in advance, and this one changed nothing about its name.
- **Watch update diffs, not just installs.** The dangerous version here was the one after the safe one.`,
  },
  {
    slug: "corma-60-million-seed-defensive-ai-security-model",
    title:
      "Corma raised $60m at seed to argue that a defensive security model has to be built defensively",
    excerpt:
      "Sequoia, Khosla and Coatue backed a 2025-founded company whose pitch rests on one test: general-purpose models could run end-to-end attacks and failed to defend against the same attacks.",
    categorySlug: "startups",
    tags: [
      "vc",
      "startup-funding",
      "ai",
      "cybersecurity",
      "founders",
      "israel",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1770233621425-5d9ee7a0a700${P}`,
    body: `**Corma** came out of stealth with **$60 million in seed funding** led by **Sequoia Capital**, **Khosla Ventures** and **Coatue**. Founded **2025**, offices in **Tel Aviv and San Francisco**, CEO **Alon Pluda**.

A $60m seed is a Series A in everything but name, and the investor list is the same one writing the AI cheques. Valuation was not disclosed.

## The claim the round is built on

Corma says it is building an AI foundation model engineered **exclusively** for defensive cybersecurity operations — analysing security telemetry, system events, audit logs and network traffic, to detect anomalies over extended timeframes.

The argument for why that needs a separate model is a test result, and it is the most interesting sentence in the announcement. Testing OpenAI and Anthropic models, the company found they **were capable of conducting end-to-end attacks** but **failed to defend against the same type of attacks**.

Pluda's framing:

> AI-powered attacks are operating at a speed and sophistication that neither human teams, better tooling, nor general-purpose AI can match

## Why the asymmetry is plausible

Take the claim seriously for a moment, because there is a structural reason it might be true.

An attack is a **generation** problem. There is a goal, a large space of possible paths, and success is one path that works. Language models are good at that shape.

Defence is a **discrimination** problem over a very unbalanced dataset. Almost everything is benign, the signal is spread across weeks of logs from systems that do not agree on time or identity, and the cost of a false positive is an analyst's afternoon. Nothing about that resembles the task a chat model was trained on.

"Extended timeframes" is doing real work in Corma's description. Most detection is evaluated on a window — an alert, a session, a day. The intrusions that matter are the ones that look normal at every point and only resolve into a pattern across weeks. That is a genuinely different problem, and it is not one that a bigger context window solves by itself.

## The timing is not a coincidence

This lands the same week **OpenAI shipped GPT-5.6-Cyber**, a model tuned to refuse far less on exploit development and gated behind an access tier.

One company's pitch is that general models are dangerously good at offence. The other has just shipped a model that is deliberately better at it. Both can be right, and if they are, the gap Corma is naming widens rather than closes.

## What is missing from the announcement

Being precise about what was not said:

- **No customers named**
- **No headcount**
- **No valuation**
- **No benchmark published** for the offence-versus-defence test — the claim is the company's own, on its own evaluation, with the compared models unnamed

None of that is unusual for a stealth exit, and all of it is the difference between a thesis and a result.

We wrote earlier this year that [cybersecurity funding is being carried by a small number of very large rounds while deal counts fall](/article/cybersecurity-funding-h1-2026-concentration), and that [the same firms writing AI cheques are the ones writing security cheques](/article/physical-ai-week-funding-security-in-top-ten). A $60m seed from Sequoia, Khosla and Coatue into a company with no public customers is that pattern in one line.

## What to watch

- **Whether the offence/defence benchmark gets published.** It is the entire argument. If it holds up independently it is an important result; if it stays internal it is positioning.
- **Whether "foundation model" means trained or fine-tuned.** Those are very different capital requirements and $60m is light for the first.
- **First named customers.** Defensive AI sells on evidence, and detection products are judged on false-positive rate more than on anything in a launch post.
- **What happens to SOC headcount claims.** Every generation of detection tooling has promised to replace analysts and has instead changed what they do.`,
  },
  {
    slug: "water-cyber-shield-act-water-watch-center-defcon",
    title:
      "91% of US water systems serve under 10,000 people — a Senate bill and a DEF CON project are both aiming there",
    excerpt:
      "The Water Cyber Shield Act would give the EPA explicit cyber authority and $300m a year. Separately, DEF CON Franklin and the rural water association launched a monitoring centre funded by Craig Newmark.",
    categorySlug: "world",
    tags: [
      "policy",
      "critical-infrastructure",
      "water",
      "regulation",
      "defcon",
      "united-states",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1785682117394-4c8d27afc12a${P}`,
    body: `Two things happened for US water utility security in the same week, from opposite directions — one legislative, one volunteer — and both are aimed at the same population.

The population is the point. Of roughly **50,000 US community water systems**, **91%** serve **fewer than 10,000 people**. These are utilities with a handful of staff, no security team, and equipment that was installed to last thirty years.

## The bill

**The Water Cyber Shield Act**, sponsored by Senators **Adam Schiff** (D-Calif.) and **Amy Klobuchar** (D-Minn.).

What it does:

- Gives the **EPA explicit authority** to perform cybersecurity assessments, enforce corrective measures and set standards, alongside **CISA** and **NIST**
- Authorises **$300 million annually** for the Drinking Water and Clean Water State Revolving Funds
- **Mandates risk assessments** for large water systems
- **Expands mandatory incident reporting** to state and locally owned facilities
- **Protects sensitive utility data** from public disclosure

The first item is the one that has been missing. The EPA's authority to require anything on cybersecurity has been contested for years, and a regulator without clear authority produces guidance that utilities are free to file away.

The last item matters more than it looks. Utilities have resisted reporting partly because a public record of a vulnerability is itself a risk. Removing that disincentive is cheap and probably increases reporting more than the mandate does.

Note what the mandate covers: **risk assessments for large water systems**. The 91% are not the ones being regulated here — they are the ones being funded.

## The volunteer effort

**Water Watch Center**, launched at DEF CON in Las Vegas by **DEF CON Franklin** and the **National Rural Water Association**.

Five security firms — **Defendify, Legato Security, L1 Secure, Rapid7 and Sentinel Technologies** — provide managed detection and response, sharing threat intelligence through the NRWA. Seed funding came from **Craig Newmark**, the Craigslist founder.

It is expanding into **Maryland**, covering civilian water systems that support critical national security and military assets, and it is working with **Vanderbilt University** on DARPA's **CASTLE** programme to build AI-driven defensive agents.

## Why both are needed, and why neither is enough

A small utility's problem is not that it does not know it should segment its network. It is that there is one operations person, the SCADA system was configured by a contractor who has retired, and the budget line for security is zero.

Money fixes some of that. **$300 million a year** across tens of thousands of systems is roughly $6,000 each if spread evenly, which it will not be — revolving funds go to the utilities with the capacity to apply for them, and capacity is exactly what the 91% do not have.

Managed detection fixes a different part. Someone else watches the network, which is the only model that works when there is nobody local to watch it.

Neither addresses the actual attack pattern. We covered [the Minnesota water systems reached with no exploit at all](/article/minnesota-water-plc-attacks-no-exploit-needed) — controllers exposed through cellular modems, default credentials, no vulnerability required. Detection catches that after it starts. Money can remove it beforehand, but only if it reaches the utilities where the exposure is.

## What to actually watch

- **Whether the bill moves.** Water infrastructure bills have a long history of being introduced and not passing. Sponsorship is not enactment.
- **Whether EPA authority survives the process.** That clause is the substantive one and it is the one most likely to be negotiated away.
- **Whether Water Watch Center scales past Maryland.** Five firms donating MDR is a pilot, not a national programme, and volunteer capacity has a ceiling.
- **Whether the funding formula favours capacity.** Revolving funds reward applicants. The utilities most at risk are the worst applicants.

The honest position: this is more attention than US water security has had in years, and it is still small relative to fifty thousand systems that mostly cannot defend themselves.`,
  },
  {
    slug: "zoom-zoomsday-annotation-zero-click-rce-cve-2026-53413",
    title:
      "A Zoom meeting participant could run code on your machine with no click and no visible sign",
    excerpt:
      "The annotation feature opens a direct channel between viewers and the person sharing. A Security's 'Zoomsday' chain starts with a missing bound check in the text annotator and ends in remote code execution.",
    categorySlug: "security",
    tags: [
      "zoom",
      "zero-click",
      "rce",
      "vulnerabilities",
      "collaboration",
      "patching",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1608306448197-e83633f1261c${P}`,
    body: `Zoom patched four flaws in its annotation feature on **11 August 2026**. Researchers at **A Security**, who named the set **Zoomsday**, describe the most serious as zero-click: no required action from the victim and no visual cue indicating the compromise.

## The four

| CVE | Type | Impact |
| --- | --- | --- |
| **CVE-2026-53413** | Missing bound check in the **text annotator** | Memory corruption → **remote code execution** |
| CVE-2026-53414 | Missing bound check in the annotator | Buffer overread → denial of service |
| CVE-2026-53415 | Use-after-free in an annotator function | Zoom had already found this one independently |
| CVE-2026-53416 | Path traversal | Information disclosure; affects VDI clients and plugins |

The first writes past a buffer boundary. The others are the supporting cast.

## Why annotation is the attack surface

Annotation — drawing on someone else's shared screen — uses a proprietary protocol that opens a **direct channel between viewers and the sharer**.

That is the whole story. Most of a video call is media, handled by hardened codecs and relayed through Zoom's infrastructure. Annotation is a separate, less-examined path that carries structured data from one participant straight into another participant's client, and it parses it.

An attacker can join or host a meeting and target an individual participant. Code executes without interaction.

## What "zero-click" means in practice here

The attacker has to be in the meeting. That is the precondition and it is not a small one — for an internal standup it is close to impossible.

For everything else, it is a formality. Sales calls, customer support sessions, candidate interviews, webinars, vendor demos, external project meetings: every one of those is a meeting with someone you do not control, and most organisations run dozens a day.

Combine that with the [fake-recruiter campaigns running right now](/article/teams-vishing-stac4749-chaos-ransomware) — where the entire pretext is getting a technical person onto a video call — and the precondition stops being a barrier and becomes a step.

## Patch, precisely

| Product | Fixed version |
| --- | --- |
| Zoom Workplace | **7.1.5** and **7.0.6** |
| Zoom Rooms | 7.1.5 |
| Meeting SDK | 7.1.5 |
| VDI Client for Windows | 7.0.11 and 6.6.16 |
| VDI Plugins | 7.0.11 and 6.6.15 |

All supported platforms are covered.

The two Zoom Workplace versions exist because organisations pin to different tracks; check which one your fleet is on rather than assuming the higher number applies.

A Security's disclosure was coordinated, and they say the timing prioritised giving customers time to receive both the **client patch and the server-side mitigation** before publication. That is worth noting: part of the fix is on Zoom's side and arrived without anyone doing anything, which is why this is being published now rather than being sat on.

## What to do

- **Push the client update.** Zoom auto-updates by default; managed fleets frequently disable that, and those are the ones that will still be vulnerable next month.
- **Check your VDI plugin versions separately.** They are on their own version line and are routinely forgotten.
- **Consider whether annotation needs to be on** for external meetings. It is an account-level setting and most organisations never use it with people outside the company.
- **Treat "who is in this meeting" as an access control question.** For an external call, the participant list is your attack surface.`,
  },
  {
    slug: "chrome-android-notifications-7-billion-blocked-daily",
    title:
      "Chrome is blocking 7 billion unwanted Android notifications a day — and rate-limiting the worst sites to 1,000 a minute",
    excerpt:
      "Google published Q1 2026 figures for its notification abuse work: automatic permission revocation for inactive sites, HTTP 429s past a threshold, and network-level analysis of coordinated service workers.",
    categorySlug: "gadgets",
    tags: [
      "chrome",
      "android",
      "google",
      "privacy",
      "consumer-devices",
      "abuse",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1643845892686-30c241c3938c${P}`,
    body: `Google says Chrome blocked **more than 7 billion unwanted notifications a day** on Android during **Q1 2026**.

Seven billion a day is a number that only makes sense once you understand what web push became. A site asks for notification permission, a user taps allow to make the prompt go away, and the site acquires a channel to that phone indefinitely — no app install, no store review, no ongoing consent.

## What Chrome actually does now

Google describes a **"Swiss cheese" model** of overlapping layers:

> Our goal is to ensure that if abuse slips through one layer, another is there to catch it.

The layers:

- **Automatic permission revocation** — notification access is removed from sites the user has stopped visiting, and from sites that repeatedly trigger suspicious warnings
- **Rate limiting** — sites classified as disruptive are capped at **1,000 messages per minute**, and excess requests get an **HTTP 429**
- **Network analysis** — behaviour is examined across related sites, including coordinated service-worker activity

Factors monitored: notification volume, user engagement time, permission-prompt frequency and overall site engagement.

## The two details worth stopping on

**A cap of 1,000 per minute is not a strict limit.** It is a limit on industrial abuse. A site that would send more than a thousand notifications a minute is not a publisher having a busy news day; it is a system. The threshold tells you what the floor of the problem looked like before.

**Network analysis across related sites** is the more consequential mechanism. Abusive push is run as networks — hundreds of domains, one operator, shared service worker code. Detecting a single bad site and revoking its permission achieves nothing when the operator has four hundred more. Correlating them is the only approach that changes the economics, and it is also the one with the most room to catch legitimate sites that happen to share a template or a CDN.

Google has not published a false-positive rate.

## What a user can do

- **Safety Hub on Android** lists permissions to review
- **Unsubscribe directly from the Android notifications panel**
- Desktop: **Settings → Privacy and security → Site Settings → Notifications**
- Mobile: **Settings → Notifications**

Most people have granted notification permission to sites they cannot name. The review list is usually longer than expected.

## Why this belongs in a security feed

Notification abuse is normally filed as annoyance. It is a delivery channel.

A push notification appears in the same tray as messages from apps the user installed and trusts, carries the site's icon, and arrives with no browser chrome to indicate its origin. It is one of the few ways to put attacker-controlled text in front of someone on a phone without an install, a message, or an email — which is why fake virus alerts, fake delivery notices and fake bank warnings all migrated to it.

Google also claims a side effect worth noting: the changes substantially decreased unnecessary background activity and reduced device battery consumption. That is the honest measure of the scale of the problem — the abuse was large enough that suppressing it is visible in battery life.

No launch date was given for the complete system, and the 7 billion figure is Google's own, unaudited.`,
  },
  {
    slug: "cisa-sharepoint-cve-2026-45659-ransomware-8500-exposed",
    title:
      "CISA says a SharePoint flaw patched in May is now being used in ransomware — 200 servers are still unpatched",
    excerpt:
      "CVE-2026-45659 was patched in May, flagged as exploited on 1 July with a three-day federal deadline, and marked as used in ransomware on 11 August. Of 8,500 SharePoint servers exposed online, 200-plus remain vulnerable.",
    categorySlug: "security",
    tags: [
      "cisa",
      "sharepoint",
      "ransomware",
      "kev",
      "patching",
      "microsoft",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1762163516269-3c143e04175c${P}`,
    body: `**CVE-2026-45659** is a remote code execution flaw in SharePoint caused by deserialisation of untrusted data. It affects **SharePoint Enterprise Server 2016**, **SharePoint Server 2019** and **SharePoint Server Subscription Edition**.

Microsoft patched it in **May 2026**. On **11 August 2026**, CISA marked it as exploited in **ransomware** campaigns.

## The timeline is the story

| When | What |
| --- | --- |
| **May 2026** | Patch released |
| Early July 2026 | Flagged as actively exploited |
| **1 July 2026** | Added to CISA's **KEV** catalog, with a **three-day** deadline for federal civilian agencies |
| **11 August 2026** | CISA confirms ransomware use |

Three months from patch to ransomware. Six weeks from KEV listing to ransomware.

That interval is roughly the length of one enterprise patch cycle, which is the uncomfortable part. An organisation running a perfectly ordinary quarterly cadence on an internet-facing SharePoint farm was inside the window the whole time.

## The exposure numbers

- **Over 8,500** SharePoint servers exposed online
- **Over 200** still unpatched against this flaw

Two hundred out of eight and a half thousand is, in one sense, a good result — better than 97% patched on an internet-facing product three months after a fix.

It is also two hundred organisations with a known, ransomware-weaponised RCE on a system that holds their documents. SharePoint is where the contracts, the HR files and the internal wiki live. There is no such thing as a low-value SharePoint server.

## Why it is easy to exploit

CISA's characterisation: the flaw enables **low-complexity attacks**, because an attacker does not require significant prior knowledge of the system and can achieve repeatable success with the payload against the vulnerable component.

Repeatable success is the phrase that turns a vulnerability into a commodity. A bug that works differently on each target stays with skilled operators; one that works the same way every time gets scripted and sold, and ends up in ransomware affiliate toolkits. That is what happened here between July and August.

CISA also notes SharePoint's broader record: **14 actively exploited SharePoint vulnerabilities since November 2021**, of which **8** were also used in ransomware.

Eight of fourteen. On this product, a KEV listing is closer to a prediction than a warning.

## Not to be confused with this month's SharePoint chain

August's Patch Tuesday also closed a SharePoint chain — **CVE-2026-55040** (July, authentication bypass) plus **CVE-2026-63520** (August, RCE) — which together produced unauthenticated RCE.

Different flaws, same product, same month. If you are triaging SharePoint right now you need all of it: the May patch for CVE-2026-45659, and both the July and August updates for the chain.

## What to do

- **Verify the May patch is applied**, not scheduled. Check the build, not the ticket.
- **Confirm whether your SharePoint is internet-facing.** For most organisations it should not be, and the answer is often a surprise.
- **Assume compromise if you were exposed and unpatched through July.** Ransomware use in August means access sold in July.
- **Treat KEV as a deadline, not a feed.** The three-day federal requirement exists because the intervals in that table are the norm, not the exception.

The same argument applies here that applied to [Kemp LoadMaster reaching KEV](/article/kemp-loadmaster-cve-2026-8037-escape-quotes-kev) and [the Cisco FMC zero-day](/article/cisco-fmc-zero-day-cve-2026-20316): internet-facing enterprise software gets weaponised on a schedule now, and the schedule is faster than most patch cycles.`,
  },
];

/**
 * Pass --update to rewrite drafts that already exist. Published articles are
 * never touched — a correction to something live is a deliberate act, not a
 * side effect of re-running a draft script.
 */
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
    if (!UPDATE) {
      console.log(`skip (exists): ${draft.slug}`);
      continue;
    }
    if (existing.status === "published") {
      console.log(`skip (published): ${draft.slug}`);
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
