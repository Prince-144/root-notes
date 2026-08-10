/**
 * Long-form drafts, batch 2 of 2 — World and Gadgets.
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

const DRAFTS: Draft[] = [
  {
    slug: "india-dpdp-enforcement-timeline-november-2026",
    title: "India's data law stops being polite in November — and most companies are treating it as 2027's problem",
    excerpt:
      "The DPDP Rules were notified on 14 November 2025 with an 18-month runway to May 2027. But the soft-enforcement phase ends on 13 November 2026, legacy data must be revalidated by then, and penalties reach ₹250 crore.",
    categorySlug: "world",
    tags: [
      "regulation",
      "india",
      "data-protection",
      "compliance",
      "policy",
      "privacy",
    ],
    readingMinutes: 8,
    coverImageUrl:
      "https://images.unsplash.com/photo-1636652966850-5ac4d02370e9?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `Most coverage of India's Digital Personal Data Protection regime quotes one date: **May 2027**, when the 18-month transition ends and full enforcement begins. That is accurate and it is the wrong date to be planning around.

The date that should be on the wall is **13 November 2026**. That is three months away, and it is when the comfortable part ends.

## The actual timeline

The DPDP Rules were notified by MeitY on **14 November 2025**, starting an 18-month phased window.

| When | What happens |
| --- | --- |
| **Jun–Aug 2026** | Consent Manager framework operationalised |
| **13–14 Nov 2026** | Soft enforcement ends. **Legacy data revalidation deadline.** Board shifts from awareness to supervision |
| **Q1 2027** | First mandatory independent audits and DPIAs for Significant Data Fiduciaries |
| **13–14 May 2027** | Transition complete. Full adjudicatory and penalty powers |

The Data Protection Board of India was established by notification dated **13 November 2025**. It exists. It has spent the first year building awareness rather than issuing penalties, which is a policy choice, not a limitation — and it is a choice with an expiry date.

## The November deadline has teeth the May one doesn't

Two things land in November, and the second is the expensive one.

**The Board changes posture.** It moves from awareness-building to active regulatory supervision. That is not the same as penalty authority, which arrives in May 2027, but it is the point at which enquiries start.

**Legacy data must be revalidated with valid notice and consent.** This is the requirement people underestimate, and it is worth being precise about what it means.

Every personal data record you already hold — collected before the DPDP framework, under whatever terms applied at the time — needs to sit on a lawful basis under the new regime. In practice that means going back to the people whose data you hold, issuing a compliant notice, and obtaining consent that meets the standard.

That is not a policy document you write in a fortnight. It is a data inventory exercise, a notice-drafting exercise, a consent-capture mechanism, and an outreach campaign to an existing user base — running in sequence, against a fixed date, on data you may not have catalogued.

If you have not started, three months is tight. If you do not know what personal data you hold or where it sits, three months is not enough.

## What the Consent Manager framework changes

The mid-2026 milestone gets less attention than it deserves because it sounds administrative.

Consent Managers are interoperable platforms through which individuals manage, review or **withdraw** consent across multiple services from one place. The word doing the work is *withdraw*.

Today, withdrawing consent means finding the setting in each service, one at a time, and most people never do. A functioning Consent Manager collapses that into a single interface. Withdrawal stops being a friction-limited act.

For anyone whose data practices depend on consent that was technically granted but practically never revisited, that is a structural change to the base rate — and it arrives before the enforcement date, not after.

## Are you a Significant Data Fiduciary?

The SDF classification carries materially heavier obligations, and the thresholds are lower than many assume. An entity qualifies on **any** of:

- personal data of **5 million or more** Indian residents
- annual turnover of **₹250 crore or more**
- processing of sensitive data — health or finance — **or use of AI for significant decision-making**

That third clause is the one to read twice. It is not scoped by size. A company well under both numeric thresholds that uses a model to make consequential decisions about people — lending, hiring, eligibility, pricing — can land in the SDF category on that basis alone.

Given how many products now route a decision through a model somewhere, this is a wider net than the headline "5 million users" framing suggests.

SDF obligations, operational by Q1 2027:

1. an **India-based Data Protection Officer** reporting to the board
2. an **independent data auditor** engaged for compliance review
3. **Data Protection Impact Assessments** for high-risk processing

A DPO who reports to the board is a hiring decision with a lead time. An independent auditor is a procurement cycle. Neither is arranged in the quarter they are due.

## The penalties

The Board can impose penalties of up to **₹250 crore** — roughly **US$26 million** — for major violations.

Two things about that number. It is large enough that it is not a cost-of-doing-business line for most Indian companies. And it becomes available in May 2027, which is why the temptation is to treat everything before that as optional.

The flaw in that reasoning is that the work required to comply cannot be compressed into the gap between the Board acquiring penalty powers and using them. The audits are Q1 2027. The legacy revalidation is November 2026. By the time penalties are live, the evidence of whether you did the work already exists.

## How this sits next to the EU

Worth noting for anyone operating in both, because the instinct is to assume GDPR compliance carries over.

It partly does — the concepts rhyme. But India layers **sectoral regulators on top**: SEBI, the RBI, IRDAI and TRAI each impose additional obligations on customer data processing in their domains. A fintech in India is answerable to the DPDP framework *and* to the RBI's requirements, which are not harmonised into it.

And [as we covered with the EU AI Act](/article/eu-ai-act-high-risk-deadline-deferred-2027), European deadlines have proven movable — the high-risk obligations slipped to December 2027 six days before they were due. Indian deadlines have so far held. Planning on the assumption that a deferral will arrive is planning on a pattern that has not been established here.

## What to do in the next three months

- **Inventory first.** You cannot revalidate consent for data you have not located. This is the step that determines whether November is achievable, and it is usually the one deferred because it is unglamorous.
- **Check the SDF thresholds honestly**, especially the AI clause. Being an SDF and discovering it in Q1 2027 means missing the audit requirement by definition.
- **Design the withdrawal path now.** Consent Managers make withdrawal easy. Systems that cannot cleanly honour a withdrawal will fail visibly and at volume rather than quietly.
- **Do not wait for the Board to act first.** Supervision starts in November. The organisations that get attention early are the ones with nothing to show.

The May 2027 date is real. It is also the deadline for having finished, not for starting.`,
  },
  {
    slug: "u-boot-fit-signature-flaws-binarly-2026",
    title: "Six flaws sit in the code that checks whether firmware is genuine — and it has been there since 2013",
    excerpt:
      "Binarly found six vulnerabilities in U-Boot's FIT signature verification. Two allow code execution during verification itself. The code dates to U-Boot 2013.07, and the devices running it mostly update through vendors who may never ship a patch.",
    categorySlug: "gadgets",
    tags: [
      "firmware",
      "hardware-security",
      "vulnerability",
      "iot",
      "supply-chain",
      "patch-management",
    ],
    readingMinutes: 7,
    coverImageUrl:
      "https://images.unsplash.com/photo-1746005514011-ea00280f3b6e?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `Secure boot rests on a simple promise: before the device runs a firmware image, it checks that the image is signed by someone it trusts. Binarly Research has published six vulnerabilities in the code that performs that check in **U-Boot**, and two of them allow code execution during the check itself.

That is a specific and awkward category of failure. The verification step is not being bypassed. It is being used as the entry point.

## The six

Binarly tracks them under its own advisory identifiers:

| ID | Class | Effect |
| --- | --- | --- |
| BRLY-2026-037 | Crash, potentially code execution | Denial of service; arbitrary execution under some conditions |
| BRLY-2026-038 | Memory corruption | **Arbitrary code execution during verification** |
| BRLY-2026-039 | Out-of-bounds read | Device crash from a malformed image |
| BRLY-2026-040 | Null pointer dereference | Bootloader crash from a crafted image |
| BRLY-2026-041 | Improper validation | Crash when processing a malicious image |
| BRLY-2026-042 | Unbounded recursion | Stack exhaustion, crash |

All six are in the **FIT (Flattened Image Tree) signature verification** path. FIT is the container format U-Boot uses to bundle a kernel, device tree and other components, together with the signatures that prove they are authentic.

Four of the six produce crashes. That matters less on a phone than on an embedded device that is expected to boot unattended in a location nobody visits — a crash at boot on a remote system is an outage requiring physical access.

The two that allow code execution are the serious ones, and they run **before the operating system loads**, which means before any of the security machinery people usually rely on exists.

## Why "since 2013.07" is the number that hurts

The vulnerable code dates to **U-Boot 2013.07**. More than fifty stable releases have shipped since.

Take a moment with the implication. Any device whose firmware was built on U-Boot in the last twelve years is a candidate. Not because vendors were careless, but because they used the standard bootloader and inherited its verification code, as intended.

U-Boot runs in places most people never think about as computers:

- **Baseboard management controllers** in enterprise servers — the out-of-band management processor that has power over the host and its own network interface
- **Networking equipment** — routers, switches, gateways
- **Industrial systems**
- **IoT devices** generally

The BMC case is worth isolating. A BMC exists to manage a server independently of its operating system. It can power-cycle the machine, mount virtual media and access the console. Code execution in a BMC's bootloader is control of the server underneath, below anything the server's OS can see or defend.

## What an attacker needs

This is where the honest framing matters, because "flaws in secure boot" invites more alarm than the situation warrants for most readers.

To exploit these, an attacker must get a crafted firmware image in front of the verification routine. Reaching that point generally means one of:

- an **update mechanism** that fetches images over a channel you can influence
- **physical or local access** to write to the boot medium
- an existing foothold with enough privilege to stage an image for the next boot

So this is not remote, unauthenticated compromise of every device running U-Boot. It is a **privilege-escalation and persistence** capability — the step that turns access you already have into something that survives reinstallation and sits below the operating system.

That is precisely what makes it valuable to anyone who has already got in. Firmware persistence outlives disk wipes and OS reinstalls, and it is invisible to endpoint tooling that starts after the boot process.

Binarly's stated concern reflects this: attackers could disable firmware security features, modify the boot process, and install persistent firmware malware.

## The patching problem is the real story

Patches have been accepted into U-Boot's upstream codebase. If you build your own firmware, the fix is available.

Almost nobody reading this builds their own firmware.

The chain from an upstream U-Boot fix to a device in service runs: upstream commit → silicon vendor's board support package → device manufacturer's firmware build → release, testing and distribution → an administrator or owner applying it. Each link is a company with its own priorities and its own product lifecycle.

For a device still under active support, that chain works, slowly. For a router bought four years ago, a controller in a factory, or a server generation the vendor has moved past, **the chain is broken at some link and the fix will never arrive**.

Binarly's own note is blunt about it: older, unsupported devices may never receive patches.

This is the structural condition of embedded security. The vulnerability is fixed and the population is not, and the gap between those two facts is measured in device lifetimes — which for industrial and networking hardware is a decade or more.

## What to actually do

- **Ask vendors specifically about FIT verification.** "Are you affected by the Binarly U-Boot advisories?" is answerable. "Is your firmware secure?" is not. Get the advisory IDs into the ticket.
- **Inventory what runs U-Boot**, starting with BMCs. Most organisations cannot answer this, which is why it is worth doing before it is urgent.
- **Isolate management interfaces.** BMCs on a routable network are the highest-value instance of this. They should be on a management network reachable from a small set of hosts, which is good practice independent of this advisory.
- **Control the update path.** Since exploitation requires getting an image in front of the verifier, the integrity of how images reach devices is the practical control — signed transport, restricted write access to boot media, no unauthenticated update endpoints.
- **Treat end-of-support hardware as a decision, not a state.** If a device will never receive this fix, the choice is to accept the risk explicitly or to replace it. Drifting is the option most organisations take by default, without deciding.

## The pattern worth noticing

This lands in the same week as [an eighteen-year-old use-after-free in the Linux kernel's SCTP code](/article/sctphantom-cve-2026-64564-linux-kernel-container-escape), found by an AI research pipeline. Both are old code in widely deployed infrastructure, both sat unexamined for over a decade, and both were found by researchers deliberately going looking rather than by an incident.

The unglamorous conclusion is that the security-critical parts of foundational open-source infrastructure have received far less scrutiny than their deployment footprint would justify — and the backlog is being worked through now, by people with better tools, faster than the ecosystem can ship the fixes.`,
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
