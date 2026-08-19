/**
 * Long-form drafts — 20 August 2026, second batch.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, and cannot read a table.
 * Each section's strongest paragraph therefore stands alone and carries its own
 * figures rather than leaving them in a table above it.
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
    slug: "windows-ike-cve-2026-33824-kev-three-day-deadline",
    title:
      "CISA gave agencies three days, not the usual three weeks — the Windows flaw was patched in April and is being exploited now",
    excerpt:
      "CVE-2026-33824 is a double free in the Windows IKE Service Extensions, reachable by anyone who can send a UDP packet to port 500 or 4500. Microsoft fixed it in April without flagging exploitation. CISA added it to the exploited catalogue on 18 August and set a three-day patch deadline, which is not what that directive normally allows.",
    categorySlug: "security",
    tags: [
      "microsoft",
      "windows",
      "kev",
      "cisa",
      "remote-code-execution",
      "vpn",
      "patching",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1758073519996-6d3c63b4922c${P}`,
    body: `**CVE-2026-33824** is a critical remote code execution flaw in the **Windows Internet Key Exchange (IKE) Service Extensions**, the component behind IPsec VPN negotiation. It affects all supported releases of **Windows 10**, **Windows 11** and **Windows Server**.

It is a **double free**, reachable by an unauthenticated attacker sending crafted packets to **UDP port 500 or 4500**. No credentials, no privileges, no user action. Microsoft's advisory puts the precondition simply: a Windows machine with IKE version 2 enabled.

## The bit that should move your week

**CISA** added it to the Known Exploited Vulnerabilities catalogue on **18 August 2026** and gave federal civilian agencies **3 days** to patch under Binding Operational Directive 26-04.

Three days is not the normal figure. KEV additions typically carry around **21 days**, and the shortened deadline is the clearest signal CISA has for "this is being used right now and it is not hard". Nobody compresses a government-wide patch mandate by a factor of seven for something theoretical.

You are not a federal agency, and the deadline is still the useful number. It is CISA telling you what it thinks of the risk in the only unit that cannot be spun.

## Patched in April, exploited in August

Microsoft shipped the fix in **April 2026** Patch Tuesday, and did not mark it as exploited at the time.

That gap is the ordinary shape of this now. A vulnerability is disclosed and patched quietly, sits in the pile with the hundred-odd other CVEs from that month — [April's neighbour, August, carried 398 by Microsoft's count](/article/microsoft-august-2026-patch-tuesday-398-afd-zero-day) — and four months later somebody works out how to use it against everyone who never got round to it.

The same sequence produced [the Kemp LoadMaster flaw landing in KEV](/article/kemp-loadmaster-cve-2026-8037-escape-quotes-kev) and [8,500 SharePoint servers still exposed after ransomware started using theirs](/article/cisa-sharepoint-cve-2026-45659-ransomware-8500-exposed). The patch existing has never been the same thing as the patch being applied.

## Why this one is worse than most

Because of where IKE sits.

The component listens on the edge. UDP 500 and 4500 are how IPsec VPN endpoints find each other, which means the vulnerable service is, by design, exposed to the internet on exactly the boxes you least want compromised: VPN concentrators, RRAS servers, gateway machines. These are not workstations behind three layers of segmentation. They are the layer.

And a double free is a memory-corruption bug, so successful exploitation lands as code execution in the service's context — on a machine whose whole job is terminating trusted tunnels.

## What to do

- **Patch, and check you actually did.** The fix is from April, so this may already be applied — verify rather than assume, particularly on servers that are excluded from the normal ring because they are load-bearing.
- **Block inbound UDP 500 and 4500 where IKE is not used.** Most Windows servers are not VPN endpoints and have no reason to answer on those ports at all.
- **Where IKE is used, restrict it to known peers.** Firewall the two ports to your actual VPN peer addresses rather than to the world. This is a config change, not a project.
- **Inventory what is listening.** The uncomfortable version of this task is finding out which machines have IKEv2 enabled that nobody meant to enable it on.
- **Treat a VPN endpoint compromise as a credential incident too.** Code execution on the box that terminates tunnels is not a contained event.

## What is not established

- **Who is exploiting it.** CISA confirms exploitation without naming an actor.
- **How it is being used.** No campaign, payload or victim has been publicly tied to it.
- **How many systems are exposed.** No scan count has been published.
- **Why the reclassification took until August.** Microsoft did not flag exploitation in April; what changed between April and CISA's listing has not been explained publicly.`,
  },
  {
    slug: "medusa-ransomware-500-critical-infrastructure-cisa-fbi-hhs",
    title:
      "Medusa has gone from 300 critical infrastructure victims to more than 500 — and it pays up to $1 million for a way in",
    excerpt:
      "A joint CISA, FBI and HHS advisory puts Medusa past 500 US critical infrastructure organisations as of April 2026, up from 300-plus in March 2025. The number that explains the growth is not the victim count: it is the $100 to $1 million the operation pays initial access brokers.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "medusa",
      "cisa",
      "critical-infrastructure",
      "healthcare",
      "initial-access-brokers",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1776883700432-1df0abe9fc18${P}`,
    body: `**CISA**, the **FBI** and the **Department of Health and Human Services** have issued a joint advisory on **Medusa**, and the headline figure is that the operation has hit more than **500** US critical infrastructure organisations as of **April 2026**.

The comparison is what makes it worth reading. The previous joint advisory, in **March 2025**, counted more than **300**.

## Where the victims are

The advisory names Healthcare and Public Health, the Defense Industrial Base, Critical Manufacturing, Government Services and Facilities, Information Technology, and Financial Services — with further victims across medical, education, legal, insurance, technology and manufacturing.

HHS co-signing it is the tell. A health department does not join a ransomware advisory over data theft; it joins when hospitals are the sector taking the hits, and when the outcome being managed is care delivery rather than confidentiality.

## The number that actually explains the growth

Medusa recruits **initial access brokers** on criminal forums, and the advisory puts the payments at **$100 to $1 million** for exclusive access.

Read that range rather than the top of it. The floor is **$100** — the price of a single valid credential from an infostealer log, bought in bulk by someone who will sort out later whether it leads anywhere. The ceiling is seven figures for exclusive access into an organisation worth that much.

This is what a mature criminal supply chain looks like, and it is why patching advice keeps missing. Medusa's affiliates frequently are not breaking in. Somebody else already did, months ago, and sold the result. The intrusion you are defending against may have started with a laptop infected by something like [the macOS stealer taking Keychain material and AWS keys](/article/macsync-stealer-clickfix-rotating-domains-static-api-key), harvested by an entirely different crew.

## Not a gang, a business model

Medusa appeared in **January 2021** as a closed operation, and accelerated in **2023** when it launched a leak site and adopted data-theft extortion alongside encryption.

Then it became ransomware-as-a-service with an affiliate structure, which is the same arc [Gunra followed to its own CISA and FBI advisory](/article/gunra-ransomware-cisa-fbi-advisory-51-victims) and the reason [Qilin drove July's surge](/article/ransomware-surge-july-2026-qilin). The brand is a franchise. The people executing intrusions rent it, and — as [the Ransom Busters research showed](/article/ransom-busters-fake-recovery-service-guidepoint-grit) — the same affiliate frequently works under several brands at once, which makes victim counts by brand a weaker signal than they look.

## The advisory is four months behind

The count is current as of **April 2026** and is being published in **August**.

That lag is not a criticism of the agencies — verifying 500 victims across six sectors takes what it takes — but it does mean the number is a floor, not a total. Whatever Medusa did between April and now is not in it.

## What the agencies recommend

The advisory's own list is short and unglamorous: patch operating systems, software and firmware; segment networks to restrict lateral movement; block untrusted access to internal remote services.

Two of those three are about limiting what an intruder can do *after* they are in, which is the correct emphasis for a threat whose entry point was bought rather than found. If the initial access is a valid credential someone else stole, the perimeter was never the control.

## What to do beyond the advisory

- **Assume valid credentials, not exploits.** Alert on impossible travel, new device enrolments and first-time-seen admin actions, because those are what a purchased login looks like.
- **Segment, then test the segmentation.** Most networks are segmented on a diagram.
- **Restrict internal remote services** — RDP, SSH, RMM and management interfaces — to jump hosts. This is the specific control the advisory calls out.
- **Rehearse the healthcare version of the question.** If you are a hospital, the plan that matters is how you keep treating patients for a week without the systems, and that is not an IT plan.
- **Check your own infostealer exposure.** If a staff credential is in a log being sold, you are already in someone's inventory.

## What is not established

- **The current victim count.** The number is a snapshot from April.
- **How many paid.** Not reported, and leak sites list the ones who did not.
- **Who the affiliates are.** The advisory describes the structure, not the people.
- **How much of the 300-to-500 growth is new activity** rather than better visibility into activity that had already happened.`,
  },
  {
    slug: "xfinity-wifi-motion-shield-router-sensing-privacy",
    title:
      "Your router can already tell when someone walks past it — Comcast now offers that as a feature",
    excerpt:
      "Xfinity WiFi Motion turns the radio link between your gateway and a smart speaker into a movement sensor, with no camera and no hardware to buy. It is opt-in and off by default, which most of the alarm about it gets wrong. The real question is what a log of when your home was occupied becomes once your ISP is holding it.",
    categorySlug: "gadgets",
    tags: [
      "privacy",
      "wifi",
      "smart-home",
      "isp",
      "surveillance",
      "consumer-tech",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1769117549887-d7ab37279060${P}`,
    body: `**Comcast** is promoting **WiFi Motion**, part of a home-protection bundle called **Xfinity Shield**. It detects movement inside your home using nothing but the WiFi you already have — no camera, no motion sensor, no extra hardware.

Before the alarm: it is **opt-in and disabled by default**, and it has existed since at least **August 2024**. What changed is the marketing, not the switch.

## How it works

You nominate stationary WiFi devices around the house — a smart speaker, a thermostat — and the gateway treats the radio link to each one as a tripwire.

Xfinity's own explanation is the plain one: when a person moves through the space between the gateway and one of those devices, their body changes how the radio signals travel. The system watches for those disturbances and pushes a notification to the app.

This is not a Comcast invention. It is **WiFi sensing**, a well-established physics result — a human body is mostly water and water absorbs and reflects 2.4 and 5 GHz radio — and it has been in research papers for over a decade. What is new is that it now ships to millions of homes as a product, at **no additional cost** on compatible plans, with a **$15/month** tier above it.

## What it is genuinely good at

Worth saying, because the privacy conversation tends to skip it.

There is no camera, so there is no footage to leak, subpoena or have a support agent look at. Radio-based sensing sees *that* something moved, not who or what. For an elderly relative living alone, "no movement detected since yesterday morning" is a useful signal with far less intrusion than a camera in the hallway. For a holiday home, so is "movement at 3am".

Comcast also states it does not monitor the motion or the notifications the feature generates.

## The question that is actually interesting

Not whether Comcast is watching. Whether the record exists, and who else can ask for it.

A WiFi Motion deployment produces something that did not previously exist: **a timeline of when your home was occupied**, held by your internet provider. Not content, not video — a pattern of presence and absence, which is one of the more revealing things about a household. When you leave. When you come back. Which nights nobody is home.

Comcast's documentation reserves the right to disclose information to third parties without further notice in connection with law-enforcement requests or court orders. That is standard telecoms language and it is not sinister on its own. It becomes interesting because it now applies to a new category of record. And the documentation does not say what is retained or for how long, which is the one answer that would settle the question.

The pattern is familiar from [Apple's fight over a UK technical capability notice](/article/apple-uk-icloud-technical-capability-notice-second): the argument is never about the feature, it is about what compelled access to the resulting data looks like later.

## The practical limits

Three, all acknowledged or obvious:

- **It cannot tell a child from a large dog.** Sensitivity is a signal threshold, not a classifier.
- **Radio does not respect walls.** In a flat, the neighbour's movement is a plausible source of a notification.
- **It only covers the paths between the gateway and the devices you nominate.** Coverage is a set of lines, not a volume.

## What to do

- **Know that it is off unless you turn it on.** If you did not enable it, you do not have it.
- **If you want it, ask the retention question first.** Support can be asked how long motion events are kept and whether they are stored on Comcast's systems or only on the device. Get that in writing before enabling.
- **Think about who lives there.** Housemates, tenants and guests are inside the coverage of a feature one person enabled. A record of when someone is home is not only about the account holder.
- **If you rent, remember the router is often not yours.** A landlord-supplied or building-supplied gateway is a different consent conversation entirely.
- **For elderly-care use, weigh it against the alternative honestly.** Compared with a camera, this is the less intrusive option, and that comparison is the fair one.

## What is not established

- **What is retained, and for how long.** Comcast's documentation does not say.
- **Whether events are processed locally or in the cloud.** Not specified.
- **Whether any law-enforcement request has been made for this data.** None reported.
- **How accurate it is.** No independent testing of false positive or negative rates has been published.`,
  },
  {
    slug: "dgfip-france-tax-breach-678000-zerobytes-cadastral",
    title:
      "Two million records were reachable and 252,149 were taken — France's tax authority is writing to the people in between",
    excerpt:
      "A seller calling himself ZeroBytes listed DGFiP data on 12 August. The French finance ministry says 678,000 individuals and professionals had data extracted, that a property-registry platform exposed around two million more, and that of those only 252,149 were actually stolen. No passwords or online accounts were touched — which matters less than it sounds.",
    categorySlug: "world",
    tags: [
      "data-breach",
      "france",
      "government",
      "tax",
      "privacy",
      "regulation",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1682347186611-083900cf4fe1${P}`,
    body: `On **12 August 2026** a threat actor using the handle **ZeroBytes** put a database from the **Direction générale des Finances publiques** — France's tax authority — up for sale on a criminal forum.

The **Ministry of the Economy and Finance** has since confirmed the breach, shut the affected systems down, and opened an investigation with **ANSSI**, France's national cybersecurity agency.

## The three numbers, kept separate

The ministry's account distinguishes between what was reachable and what was taken, and the distinction is the story:

| | |
| --- | --- |
| Individuals and professionals whose data was extracted | **678,000** |
| Records potentially accessible through a property-registry platform | around **2,000,000** |
| Of those, actually stolen | **252,149** |

That middle figure is the one that would have led every headline if the ministry had not published the third alongside it. Two million *accessible* and 252,149 *taken* are different facts about the same weakness, and an organisation that publishes both is doing something most do not.

We spent last week on [3.6 million Entra records where the only thing independently checked was the shape of the data](/article/thehatman-azure-entra-directory-36-million-records-claim). This is the opposite posture: the victim counted, and told you which number is which.

## What was in it

Not credentials. Something arguably worse for the people affected.

The exposed data includes tax information — reference tax income, the **quotient familial** that encodes household composition, and withholding tax rates — plus business identifiers including company names and **SIREN** numbers, and cadastral data giving addresses and property sizes.

The ministry has been explicit that user IDs, passwords and online accounts were not compromised, and that is worth stating plainly rather than burying: your impots.gouv.fr login is not in this.

## Why "no passwords" is thinner comfort than it reads

A password can be changed. Your income cannot, and neither can your address or the size of your house.

What this dataset gives an attacker is the ability to be convincing. Someone who knows your reference tax income, your household composition and your property already sounds like the tax office when they call, and the single most effective French-language phishing lure of the last decade has been a tax refund. Combine an accurate income figure with a refund amount and the usual advice — "the tax office will never ask you for this" — stops carrying the weight it needs to.

The cadastral component adds a second, less discussed risk: a list of addresses with property sizes, tied to income brackets, is a target list for offline crime as much as online.

## The third major French public breach this year

Context the ministry did not supply, and it matters:

- **France Travail**, the employment agency — **43 million** records
- **FICOBA**, the national bank account registry — **1.2 million** accounts
- **DGFiP** — **678,000** individuals and professionals

Those are three separate central government systems in a single year, holding employment, banking and tax data on overlapping populations. Any individual breach is an incident. Three is a pattern, and the pattern is that the highest-value citizen databases in the country are being reached one after another.

For readers in India this is the near future of the same question. The [DPDP Act's notification duties come into force in November 2026](/article/india-dpdp-enforcement-timeline-november-2026), and the French response — count precisely, publish the distinction between accessible and taken, write to the affected individually — is roughly what "reasonable" will end up meaning in practice.

## What the ministry is doing

Affected individuals are being contacted directly, by email or letter, with detail on what was exposed and what precautions to take. Systems were taken offline on discovery.

Direct notification with specifics is the part worth crediting. "We were breached, change your password" is what most disclosures amount to, and it is useless here, because the password is not the problem.

## What to do if you are in France

- **Treat any tax communication about a refund as hostile.** Especially one that quotes a figure correctly. That accuracy is now available to anyone who bought this data.
- **Verify by going to the site yourself.** Never through a link, never through a number in the message.
- **Read the ministry's letter when it arrives.** It is supposed to say what was exposed in your specific case, which changes what you should watch for.
- **Watch for correspondence that references your property.** Cadastral data was in this, and address-plus-income is a distinctive combination.

## What is not established

- **How the attacker got in.** The ministry has not described the intrusion route.
- **Whether the data has been sold.** It was listed for sale; no buyer is known.
- **Whether ZeroBytes acted alone**, or is a reseller of someone else's access.
- **Whether the 2 million exposure was reachable for long enough for anyone else to have used it.** Only the 252,149 figure is attributed to this actor.`,
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
