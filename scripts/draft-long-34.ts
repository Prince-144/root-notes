/**
 * Long-form drafts — 27 August 2026, third batch.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts picks one paragraph per section
 * by score — standalone digits and length win, opening on a back-reference
 * loses. The paragraph that answers each heading is written to be the one that
 * wins.
 *
 * Dating note on the ATF piece: the source carries a 28 August timestamp while
 * this was written on the 27th, which is probably a timezone artefact but is
 * not something to assert either way. The piece anchors to the date Qilin
 * listed the agency, which is consistent across sources, and describes the
 * confirmation as following rather than pinning a day to it.
 *
 * Restraint note on the Boston Scientific piece: almost nothing is established
 * two days in. The article says that plainly instead of padding it out, and
 * does not speculate about patient impact, which none of the reporting
 * addresses.
 *
 * Cover note: all three downloaded and viewed. Rejected a macro shot with
 * "MADE IN CHINA" legible — on a Citrix story with no attribution, that implies
 * something the reporting does not say.
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
    slug: "citrix-cve-2026-8452-advisory-said-dos-it-is-rce",
    title:
      "Citrix called it a denial of service. Researchers showed it was unauthenticated code execution",
    excerpt:
      "CVE-2026-8452 was patched on 30 June with an advisory describing unpredictable behaviour and DoS. WatchTowr published proof it gives unauthenticated remote code execution, and attackers were dropping web shells within days. CISA added it to KEV on 26 August with a three-day deadline. The patch existed for two months.",
    categorySlug: "security",
    tags: [
      "citrix",
      "netscaler",
      "exploitation",
      "cisa-kev",
      "vulnerability-disclosure",
      "patching",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1704737825853-39fcae15d0f6${P}`,
    body: `**Citrix** patched **CVE-2026-8452** in **NetScaler** on **30 June 2026**. Its own description of the flaw was that it can lead to unpredictable or erroneous behaviour and denial-of-service attacks.

Researchers at **WatchTowr** later demonstrated that the same memory overflow gives **unauthenticated remote code execution**.

Those are not the same vulnerability class, and the difference decides whether anybody patches it in June.

## What the gap cost

Line the dates up:

| Date | Event |
| --- | --- |
| 30 June 2026 | Citrix ships the patch, described as DoS |
| 14 August 2026 | Public proof-of-concept published |
| shortly after | **Previdian** and **Defused** observe in-the-wild exploitation |
| 26 August 2026 | CISA adds it to the KEV catalog |
| 29 August 2026 | Federal remediation deadline |

Attackers seen exploiting it deployed **web shells** and ran discovery commands — the ordinary opening moves of someone establishing a foothold, not of someone crashing a box.

Affected builds include **14.1-72.61 (FIPS)**, **13.1-63.18** and **13.1-37.272**.

Note what this is not: it is not a zero-day. It was patched before public disclosure. Every organisation exploited through it had a fix available for six weeks or more.

## Why the wording matters more than it should

Patch triage is a queue, and the queue is sorted by whatever the advisory says.

An engineer with forty pending updates and an appliance that cannot be rebooted during business hours reads "denial of service" and schedules it. The same engineer reads "unauthenticated remote code execution on an internet-facing gateway" and does it that night. The technical facts were identical on 30 June. Only the description differed.

NetScaler is the worst possible product for this to happen to, because it is the front door. It terminates remote access for the organisation, which means pre-auth code execution on it is not a foothold in the environment — it is the environment.

The precedent is right there: **CVE-2026-8451**, the CitrixBleed-like flaw, was exploited within **24 hours** of disclosure.

## The third advisory failure this week

This is a pattern rather than an incident, and it is worth naming.

[The Kaltura flaws had no vendor response at all](/article/kaltura-mwembed-unserialize-eleven-years-unpatched) — five months, five escalation routes, and CERT/CC could not reach the company either. [miniOrange shipped fixes for all seven editions of its SAML plugin and published an advisory covering one](/article/miniorange-saml-two-cves-chained-paid-editions-no-advisory), while the exploitation that was confirmed hit a paid edition. And here Citrix shipped a good patch on time and described it in terms that told people not to hurry.

In none of the three was the engineering the problem. The fix existed, or could have. What failed was the sentence explaining it — and a patch nobody applies is indistinguishable from a patch nobody wrote.

## What to do

- **Patch now**, and treat the deadline as real. CISA's is 29 August; the exploit is public and being used.
- **Then hunt.** A patch does not evict a web shell. Look for unexpected files in web-accessible paths and for processes spawning shells from the appliance.
- **Do not rely on vendor severity language alone** for internet-facing appliances. Where a researcher has published a working proof-of-concept, that is the better signal.
- **Rank by exposure and function, not just by score.** Anything terminating remote access should sit at the top of the queue whatever the advisory calls it.
- **Assume credentials passing through it are exposed** if you find evidence of compromise, and rotate accordingly.

## What is not established

- **The CVSS score.** Not specified.
- **How many organisations were compromised.** No figure.
- **Who is exploiting it.** No attribution reported.
- **Whether Citrix will revise its description**, or why it characterised the flaw as it did.
- **What the attackers did after the web shells.** Only discovery activity has been described.`,
  },
  {
    slug: "boston-scientific-cannot-ship-orders-what-is-not-known",
    title:
      "A medical device maker cannot ship customer orders, and almost nothing else is established",
    excerpt:
      "Boston Scientific detected a cyberattack on 25 August that has disrupted its ability to process and ship orders globally. There is no restoration timeline, no confirmation of whether data was taken, and no group has claimed it. This is what a serious incident honestly looks like two days in.",
    categorySlug: "security",
    tags: [
      "boston-scientific",
      "healthcare",
      "manufacturing",
      "incident-response",
      "supply-chain",
      "disclosure",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1715783058283-2e31a1cb7684${P}`,
    body: `**Boston Scientific** detected a cyberattack on **25 August 2026**. It has disrupted the company's ability to process and ship customer orders, globally.

That sentence contains everything currently known that matters, and this article is mostly about resisting the urge to write more than that.

## What the company has said

The incident affected certain operating systems and business applications. The investigation is ongoing, and in the company's own words the full scope, nature and impacts — operational and financial — are not yet known.

There is no restoration timeline.

## Why the shipping detail is the whole story

Boston Scientific makes implantable and interventional medical devices: cardiac rhythm management, stents, catheters, neuromodulation.

A company that cannot process and ship orders in that business is not experiencing an IT inconvenience. Hospitals order consumables against scheduled procedures, and the buffer between order and use is measured in days rather than months. The failure mode of a long outage is not lost revenue in a quarterly filing. It is a hospital calling a distributor.

None of the reporting addresses whether patient care or implanted devices have been affected, and we are not going to imply it either way. Devices already in patients are not connected to the manufacturer's order system. What an extended outage touches is supply, and supply is enough of a problem on its own.

## What nobody knows yet

Plainly, because the gaps are the honest content of this story:

- **Whether data was stolen.** The company says it is unclear whether the incident has also resulted in a data breach.
- **Who did it.** No known cybercrime group has claimed it.
- **Whether it is ransomware.** Not stated.
- **Whether a ransom was demanded.**
- **When systems come back.** No timeline.
- **The financial impact.** Explicitly not yet known.

## The absence of a claim is not information

It is tempting to read "no group has claimed it" as meaning something. It does not, yet.

Extortion groups routinely wait — sometimes weeks — before listing a victim, because the leverage is in the private negotiation and publication is what happens when that fails. An unclaimed incident at day two is the normal state of an incident that may be claimed at day thirty, and equally the normal state of one that never will be.

This is worth holding in mind against [the ATF incident this week, where a group claimed an attack but posted no proof](/article/atf-qilin-standalone-system-major-incident). Claims without evidence and silence without explanation are both weak signals, in opposite directions.

## What to take from it if you are a customer

- **Check your stock levels against scheduled procedures now**, rather than when an order fails.
- **Ask your distributor about alternate sourcing** for anything with a short buffer.
- **Do not wait for a company statement to plan around**, because the company does not have a timeline to give you.

## What we will do

Wait. When the scope is established, that is a story. Speculating about it now would produce something that reads like reporting and is not.`,
  },
  {
    slug: "atf-qilin-standalone-system-major-incident",
    title:
      "The ATF says it was a standalone system. Senior officials called it a major incident",
    excerpt:
      "Qilin listed the Bureau of Alcohol, Tobacco, Firearms and Explosives on its leak site on 26 August. The ATF confirmed an intrusion into a standalone system it disconnected, and says its mission is unaffected. It also confirmed that senior Justice Department officials designated the event a major incident — a federal threshold with a definition.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "qilin",
      "government",
      "atf",
      "extortion",
      "incident-disclosure",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1773580995632-9033a7085476${P}`,
    body: `The ransomware group **Qilin** added the **Bureau of Alcohol, Tobacco, Firearms and Explosives** to its leak site on **26 August 2026**.

The ATF has confirmed a cybersecurity incident. Two things it said sit oddly next to each other, and that tension is the story.

## The two statements

The agency describes the incident as affecting **a standalone system, which was disconnected after the intrusion was discovered**, and states that it **has not impacted ATF's ability to perform its missions**.

It also confirms that **senior Department officials have designated the event a "major incident" under applicable federal guidelines**.

## Why those do not obviously fit together

"Standalone system" and "no mission impact" describe something contained and peripheral.

**Major incident** is not a vibe. It is a defined federal designation that triggers mandatory notifications and requires coordination with the **Justice Department**, which is now investigating jointly with the ATF. Agencies do not reach for it to describe a compromised machine in a corner.

We are not suggesting anyone is being untruthful. Both statements can be accurate: a system can be genuinely standalone and genuinely hold something whose exposure clears the threshold — the designation turns on the sensitivity of what was reached, not on how many systems were touched or whether operations continued.

But of the two, only one has a written definition. When an agency's own framing and its own designation point in different directions, the designation is the more informative signal, because somebody had to meet a standard to apply it.

## Qilin has not shown anything

The group has been active since at least **2022**, originally as **Agenda**, and runs a double-extortion model: encrypt the files, steal the data, threaten publication.

Its usual practice is to post screenshots of stolen documents when it lists a victim. In the ATF's case it has not — no sample, no description of what was taken, no publication date.

So the claim is currently unevidenced. That cuts both ways: it may mean the group is mid-negotiation and holding proof back, or that it has less than the listing implies. Listing a federal law enforcement agency is worth attention on a leak site whether or not the haul justifies it, and that incentive is worth remembering when reading any leak-site entry.

## The pattern worth noting

A criminal group's claim and a government's confirmation arrived within days of each other, and neither has produced the detail that would settle what happened.

This week has had the mirror image of that too, in [Boston Scientific's global outage, where the company has confirmed serious disruption and nobody has claimed it at all](/article/boston-scientific-cannot-ship-orders-what-is-not-known). Between them the two incidents cover the full range of what early disclosure looks like: a claim without evidence, and evidence without a claim.

## What is not established

- **What data was taken**, if any. Qilin has not specified and the ATF has not described it.
- **How they got in**, or when.
- **Which system it was**, beyond "standalone".
- **Whether a ransom was demanded**, or any response to it.
- **Why the major incident threshold was met.** The designation is confirmed; the reasoning is not public.
- **Whether Qilin will publish.** No date given.`,
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
