/**
 * Long-form drafts — 27 August 2026, fifth batch.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts picks one paragraph per section
 * by score — standalone digits and length win, opening on a back-reference
 * loses. The paragraph that answers each heading is written to win.
 *
 * Dating note: the sources for the Cosmos and Berlin pieces carry some
 * timestamps that run ahead of the date this was written, and the Cosmos
 * post-mortem coverage contains hour-level timings that contradict its own
 * day-level dates. Both pieces therefore use only the day-level sequence,
 * and the Cosmos piece says outright that the finer timings in circulation do
 * not reconcile rather than reproducing one of them.
 *
 * Attribution note on the ownCloud piece: the reporting attributes the tooling
 * to a Chinese-speaking actor on the basis of simplified Chinese in source
 * comments, docstrings and folder names. That is evidence about who wrote the
 * tooling. It is not evidence of nationality or of state direction, and the
 * article draws that line explicitly — the same discipline applied to the UK
 * power plant piece.
 *
 * Cover note: all three downloaded and viewed. The cooling tower is a generic
 * European one; the article does not claim it depicts the affected facility,
 * which has not been named.
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
    slug: "cosmos-evm-silent-patch-six-chains-drained",
    title:
      "They knew every chain was at risk on 13 August. They shipped the fix quietly anyway",
    excerpt:
      "A Cosmos EVM flaw let attackers underflow account balances to roughly 2^256. Cosmos Labs learned on 13 August that every chain running its software was affected, patched on the 19th without private notification, and a public pull request in a fork spelled out the exploitation path on the 20th. Six chains were drained.",
    categorySlug: "security",
    tags: [
      "blockchain",
      "cosmos",
      "vulnerability-disclosure",
      "silent-patching",
      "defi",
      "supply-chain",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1675518350231-b63a9b94e9bf${P}`,
    body: `**Six blockchains** were drained between **20 and 25 August 2026** through a critical flaw in **Cosmos EVM**, tracked as **GHSA-7g4w-cg88-2cq2**. No CVE was assigned.

The bug is a balance reconciliation failure between the EVM StateDB and the Cosmos SDK's bank module. Where a vesting account delegates more than its spendable balance, an unchecked subtraction underflows to roughly **2 to the power of 256** — after which an attacker can move funds out of wrapped accounts or force reconciliation to burn someone else's holdings.

Affected versions are below **0.6.2**, and **0.7.0** up to **0.7.2**.

## The decision this turns on

**25 April**: reported through the bug bounty programme.

Cosmos Labs then, by its own account, **incorrectly concluded that the flaw affected only non-18-decimal networks** and posed no risk to live networks.

**13 August**: the team confirms that **all** Cosmos EVM chains are affected regardless of decimal configuration.

**19 August**: patches ship as v0.6.2 and v0.7.2 — through the ordinary release process.

**20 August**: a public pull request in a fork of the code discloses the vulnerability details and the exploitation path.

**20–25 August**: six chains are drained. **MANTRA** is the one named publicly.

So the sequence is: learn that user funds on every live network are at risk, then publish the fix in a way that tells attackers what to look for before it tells operators to hurry.

## Their own policy says otherwise

Cosmos Labs' published policy reads that when an issue presents an immediate or network-wide risk, it **will initiate emergency mitigations, private fix distribution, or coordinated upgrades before any public disclosure occurs**.

The post-mortem acknowledges the same standard, noting that for a vulnerability known to threaten user funds in production networks the team would typically use secure channels to distribute a patch privately.

It used the silent patch process instead. The gap between the written policy and what happened is the finding, and it is Cosmos Labs' own document that establishes it.

## Why silent patching fails here specifically

Silent patching — fix quietly, describe vaguely, let downstream upgrade before anyone works it out — depends on two things. Downstream operators must upgrade promptly, and nobody must reverse the fix before they do.

Neither held. A public pull request in a fork laid out the exploitation path the day after release. And Cosmos Labs **holds no complete registry of the networks running its software**: during the incident it discovered **11** Cosmos EVM deployments that had never registered a security contact.

You cannot privately notify people you cannot enumerate. That is the structural problem underneath the process failure, and it is not fixed by choosing better next time.

For context on how routine the approach is: Cosmos Labs has released patches for **37** vulnerabilities silently in the last **13** months.

## The patches themselves were incomplete

Three related fixes exist. Only one appears in the official release notes.

| Fix | Date | Status |
| --- | --- | --- |
| PR #1176, SubBalance underflow guard | 15 May | backported 13 August |
| PR #1187, snapshots locked balance | 20 May | backported same day |
| Commit 3524ebc, rejects module account balance changes | — | never formally backported |

A **ZetaChain** contributor reported that the cherry-picked patches left live code paths unpatched, because duplicate unexported helpers existed that the cherry-pick did not cover.

Two of those fixes were written in **May** — before the August reassessment — and sat unbackported while the team believed the issue was not live-network relevant.

## What was actually lost

Roughly **$2.87 million** sold on decentralised exchanges and **$2.85 million** on centralised ones, at 19 August prices — about **$5.72 million** total.

Cosmos Labs states these figures were supplied by the affected chains and **have not been independently audited**, which is worth carrying with the number.

Exploitation also required permissionless vesting-account creation, which is a configuration choice rather than a property of the software. Chains that did not allow it were not exposed by that path.

## A note on the timeline

Hour-level timings for the first attack are circulating that do not reconcile with the day-level dates in the same accounts — one figure implies the attack preceded a notification that other figures place after it. We have used only the day-level sequence, which is consistent, and are not reproducing an interval we cannot make add up.

## What is not established

- **Why the patch was not distributed privately** after 13 August. The question has been put to Cosmos Labs; no answer published.
- **Which five other chains** were drained. Only MANTRA is named.
- **Whether the figures are accurate.** Self-reported, unaudited.
- **Who carried out the exploitation.** No attribution.
- **How many of the 37 prior silent patches carried comparable risk.**`,
  },
  {
    slug: "owncloud-2023-flaw-philippine-nuclear-records-stolen",
    title:
      "A 2023 flaw with a 2023 fix was used to take nuclear-material records this year",
    excerpt:
      "CVE-2023-49105 lets anyone read, change or delete files on an ownCloud server without authenticating, if they know a username and the default configuration is in place. It was fixed in November 2023. It has now been used against a Philippine nuclear research body, and CISA added it to its exploited-vulnerabilities list on 27 August.",
    categorySlug: "security",
    tags: [
      "owncloud",
      "cisa-kev",
      "espionage",
      "philippines",
      "nuclear",
      "attribution",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1786998336193-020748a49058${P}`,
    body: `**CVE-2023-49105** is a **9.8** severity authentication bypass in the **ownCloud** WebDAV API. It lets an attacker access, modify or delete any file **without authenticating**, provided they know the victim's username and the victim has no signing key configured.

No signing key is the **default** configuration.

ownCloud disclosed it in **November 2023**. Versions **10.6.0 through 10.13.0** are affected; **10.13.1** fixes it. That patch has been available for nearly three years.

## What it was used to take

A nuclear research body in the **Philippines** was compromised, along with a marine engineering and shipbuilding company that provides services to the **Philippine Navy**.

From the nuclear entity, the intruders took **nuclear-material account records**, draft strategic plans covering **2023 to 2028**, material on research reactor core components, **historical fuel inventories**, presentation material and employee personal information.

They also took a **192 MB** SQL dump of a ZKTeco BioTime attendance and personnel database, and credential stores — **BitLocker keys**, a **KeePass** database, and **AxCrypt**-encrypted files.

In total, an estimated **176 files**, roughly **372 MB**, staged across **five** directories.

Nuclear-material accounting records and fuel inventories are the documents by which a state demonstrates that fissile material is where it is supposed to be. Whatever the motive, that is a materially different category of theft from a customer database.

## Why a three-year-old flaw still works

Because patching an internally-facing file server is nobody's priority, and because the exploitable condition is the default.

The vulnerability needs a known username, and usernames at a research institution are usually predictable from published staff lists. It needs no signing key configured, which is what you get if you never changed anything. And ownCloud instances tend to be departmental rather than central — stood up by a team, never inventoried, never in the patch cycle.

**Hunt.io** found **five custom Python scripts** implementing exploits for this CVE on an open directory at a single IP address. Five purpose-built tools for a 2023 flaw is not opportunistic scanning; it is somebody maintaining a capability because it keeps working.

CISA added the CVE to its **Known Exploited Vulnerabilities** catalog on **27 August 2026**, with a federal deadline of **30 August**. It is the second entry this week where the listing arrived long after the exploitation.

## On the attribution, carefully

The reporting attributes this to a **Chinese-speaking** threat actor, identified in part through simplified Chinese in source code comments, docstrings, log output, and the folder names used to sort stolen data.

That evidence supports a specific claim: whoever wrote the tooling writes in simplified Chinese. It does not by itself establish nationality, employer, or state direction, and it is the sort of artefact that is trivially planted by anyone who wants an investigation to reach that conclusion.

We wrote the same caution about [the UK power plant attack, where the CEO of Dragos warned publicly that people jumping to conclusions on attribution are susceptible to false flag operations](/article/uk-power-plant-four-day-shutdown-attribution-not-confirmed). It applies identically here. Language in comments is a lead, not a finding.

The targeting — nuclear research and naval shipbuilding in one country — is more informative than the language, because it indicates an interest rather than an author.

## What to do

- **Find your ownCloud instances.** The ones that matter are the ones nobody remembers standing up.
- **Upgrade to 10.13.1 or later.** The fix is nearly three years old.
- **Configure a signing key.** The exploit condition is the default state.
- **Do not expose file servers to the internet** without a compelling reason and a maintenance owner.
- **Treat credential stores on file shares as already lost** if you find evidence of access. BitLocker keys and password databases were among what was taken here.

## What is not established

- **How initial access to the ownCloud instances was obtained.**
- **How valid usernames were obtained**, which the exploit requires.
- **Who directed the operation.** Language artefacts are not attribution.
- **What has been done with the material** since.
- **Whether other institutions were hit** by the same tooling.`,
  },
  {
    slug: "berlin-refuses-to-pay-rhysida-only-attacker-numbers",
    title:
      "Berlin will not pay — and the only figures for what was taken come from the people who took it",
    excerpt:
      "Berlin's state network was breached on 7 August and data flowed out until departments were disconnected on the 14th. The governing mayor says the state is being blackmailed and will not pay. The attackers claim 5.79 terabytes and 1.44 million files. Berlin has published no figures of its own, which leaves one source for every number in circulation.",
    categorySlug: "world",
    tags: [
      "ransomware",
      "berlin",
      "germany",
      "rhysida",
      "extortion",
      "public-sector",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1641135762202-ba1e0e14bfe8${P}`,
    body: `Berlin's state administrative network was breached on **7 August 2026**. Data left the Senate Department for Mobility, Transport, Climate Protection and Environment that day and continued flowing until affected departments were disconnected on **14 August**.

Governing Mayor **Kai Wegner** has put it plainly: **the state of Berlin is being blackmailed**. The city will not pay.

## The sequence

| Date | Event |
| --- | --- |
| **7 August** | Breach; first data outflow detected |
| **7–12 August** | Further exfiltration |
| **14 August** | Affected departments isolated from the network |
| **17 August** | Public disclosure |
| **19 August** | Press conference |
| **23 August** | All Senate departments reconnected |

Housing benefit applications and payments were unavailable while departments were disconnected — a week in which people who needed money from the state could not apply for it. That is the real cost of the response, and it was the correct decision anyway.

The attackers have since published stolen data to a leak site.

## Every number comes from the attacker

This is the part to hold onto.

The figures in circulation — **5.79 terabytes**, **12,076 individuals**, **1.44 million files** across **11** categories, of which **124,823** are maps and geodata — are the **attackers' claims**. Berlin has not published its own accounting of what was lost.

The Senate Chancellery's position is only that personal or other non-public data **cannot be excluded** from what was taken.

An extortion group's inventory of its own haul is marketing. It is produced by the party whose leverage increases with the number, published on a site whose purpose is to pressure a victim into paying, and it is not audited by anyone. It may well be accurate. It is not evidence.

We made the same point about [a viral scam where every circulating total traced back to the people promoting it](/article/25-august-telegram-scam-numbers-do-not-agree). The principle does not change because the victim here is a government: when only one party publishes figures, and that party benefits from the figures being large, the figures are a claim.

## The geodata detail is the odd one

**124,823** maps and geodata files is the largest single category claimed, which is not what anyone expects from a city administration breach.

If accurate, it reflects what a state government actually holds — cadastral records, utility routing, planning data, infrastructure surveys. That is unglamorous material with a long shelf life and obvious value to anyone doing physical reconnaissance, and it does not expire the way credentials do.

## Attribution and what it rests on

**Der Spiegel** attributed the attack to **Rhysida**, corroborated through leak-site monitoring. It has not been officially confirmed.

The joint **CISA/FBI** advisory on Rhysida describes its usual routes in: valid accounts on external-facing services — particularly VPNs without multi-factor authentication — exploitation of **Zerologon**, and phishing. None of those has been confirmed as the route here.

Interior Senator **Iris Spranger** has said no sensitive data relevant to the **20 September** elections was compromised.

## On refusing to pay

Berlin has given no detailed public reasoning, and it does not really need to. Payment buys a promise from a criminal group not to publish data it has already copied, and the data has been published regardless.

What refusal costs is visible and immediate; what it saves is diffuse and never attributable. A government that pays creates a budget line for the next group, and the only way that calculus ever changes is if enough victims absorb the visible cost. Berlin has.

## What is not established

- **How much data was actually taken.** Berlin has published nothing.
- **The ransom amount.** No figure disclosed by either side.
- **How they got in.**
- **Official attribution.** Rhysida is widely reported, not confirmed.
- **The full extent of personal data exposure**, which remains under examination.`,
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
