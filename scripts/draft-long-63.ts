/**
 * Drafts the 9 September batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-63.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-63.ts --update
 *
 *   1. Microsoft's 974. The number is the story everyone will write; the useful
 *      story is that the two exploited flaws are both local privilege
 *      escalation, and that a 70% jump over the previous record is more likely
 *      a change in counting than a collapse in code quality — stated as an open
 *      question with candidates, not asserted. Also flags that the reporting's
 *      own July figures disagree with each other.
 *   2. SAP OVERPASS. The line that matters is Onapsis's: authorizations and
 *      Segregation of Duties do not help, because the code runs before
 *      authentication. That is the control SAP customers spend the most on.
 *   3. ShieldCrash. Direct follow-up to the Nightmare Eclipse piece, and it
 *      answers the Kaspersky question that article left open.
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
    slug: "974-flaws-and-the-two-that-matter-are-both-privilege-escalation",
    title: "974 flaws, and the two that matter are both privilege escalation",
    excerpt:
      "Microsoft patched 974 vulnerabilities in September, a 70% jump over the previous record, with 723 of them in Windows and more than 110 rated critical. Two are being exploited. Both are CVSS 7.8 local privilege escalation, which means the attacker is already on the machine — and that is the whole triage.",
    categorySlug: "security",
    tags: ["microsoft", "patch-tuesday", "windows", "zero-day", "privilege-escalation", "cve-2026-85880"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1778940936081-b2186c71718a${P}`,
    body: `Microsoft's September 2026 Patch Tuesday fixed **974** vulnerabilities, plus **25** non-Microsoft CVEs routed through the same release — **999** in total.

By product: **723** in Windows, **111** in Office, **62** in SQL, **22** in developer tools. More than **110** rated critical. Roughly **90%** fall into three classes: privilege escalation, remote code execution and information disclosure.

## Start with the two

Everything above is context. Two of the 974 are being exploited right now, and both are the same shape:

**CVE-2026-85880** — **CVSS 7.8**, a heap-based buffer overflow in the Windows **Advanced Local Procedure Call** subsystem, letting an authorised attacker elevate to SYSTEM.

**CVE-2026-81963** — **CVSS 7.8**, an improper link resolution flaw in the **Windows Update Stack**, allowing local privilege escalation.

Neither is remote. Both require the attacker to already be executing code on the machine as some user. That is not a reason to relax — it is a description of where they sit in a chain, and it tells you exactly what to prioritise.

If an attacker has a foothold, these are what turn it into ownership of the host. [The browser toolkit we covered this week needed precisely this](/article/peep-forges-chromium-secure-preferences-integrity-values) — prior administrative or code execution access, which it does not supply itself. Local privilege escalation is the missing half of a great many post-compromise toolkits, and September shipped two working ones.

Patch those two first. The other 972 can follow your normal cycle.

## The number is a counting event, not a security event

**974** against a previous record of **569** is a **70%** jump in one month, and against 2026's earlier months — **457** in August, **220** in June, **161** in May — it is not a trend, it is a discontinuity.

Software does not get four times worse in four months. Something about how these are found, counted or disclosed changed, and Microsoft has not said what. The candidates, none of them established:

- **Automated discovery at scale.** Fuzzing and AI-assisted analysis produce findings faster than triage historically did, and a backlog eventually ships.
- **A change in what gets a CVE.** Components that previously shipped fixes silently — cloud-side, edge, service code — being issued CVEs would move the number without changing anything about risk.
- **A batch release** of accumulated internal findings.

The distinction matters for one practical reason: if the number rose because counting changed, then next month's number is the new normal and nobody should draw a conclusion from it. If it rose because discovery genuinely accelerated, the backlog on every other vendor is about to become visible too.

Worth noting a wrinkle in the reporting itself: the figures circulating give July as both **663** and **569**, the latter as the previous record. Those cannot both be the same measurement, and nobody has reconciled them. Treat the exact comparison loosely and the direction as clear.

## What to do

- **Patch CVE-2026-85880 and CVE-2026-81963 on an emergency cycle.** Exploited, local, SYSTEM.
- **Then treat the rest as a normal month.** 974 is not 974 emergencies, and an organisation that tries to treat it as one will do nothing well.
- **Rank the remaining critical items by exposure, not by CVSS.** More than 110 critical ratings cannot all be first.
- **Expect your scanner to be noisy for a fortnight.** A near-thousand-CVE release moves every dashboard, and the movement is not information.
- **Do not read the total as a signal about Windows.** Nobody has established why it jumped.

## What is not established

- **Why the number rose so sharply.** Microsoft has not explained it.
- **Who is exploiting the two zero-days**, or against whom.
- **Whether the previous record was 569 or 663.** The reporting gives both.
- **Whether any of the 974 are publicly disclosed but not yet exploited.** Not broken out.`,
  },
  {
    slug: "sap-overpass-segregation-of-duties-does-not-apply",
    title: "The SAP flaw runs before authentication, so Segregation of Duties does not apply",
    excerpt:
      "CVE-2026-44756 is a CVSS 10.0 memory corruption bug in the SAP kernel's Extended Passport handling, reachable with a single malformed header. Onapsis puts the consequence plainly: SAP authorizations and Segregation of Duties will not help, because the vulnerable code runs before any authentication step.",
    categorySlug: "security",
    tags: ["sap", "cve-2026-44756", "onapsis", "erp", "memory-corruption", "unauthenticated-rce"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1504384308090-c894fdcc538d${P}`,
    body: `SAP's September 2026 patch cycle fixes **CVE-2026-44756**, rated **CVSS 10.0**, found by **Onapsis** and named **OVERPASS**.

It is a memory corruption flaw in the SAP kernel's handling of **Extended Passport**, the header SAP uses to trace a request across systems for diagnostics and performance monitoring. Boundary validation is missing during deserialization of EPP data, so an **externally supplied length field** produces a memory safety violation.

The attack is a network request carrying a **malformed EPP header**. That is the whole precondition.

## The sentence that should stop an SAP team

From Onapsis:

> SAP authorizations and Segregation of Duties controls will not help. The vulnerable code runs before any authentication step.

Consider what that removes.

Segregation of Duties is the centre of SAP security. It is what the authorization design exists to enforce, what external auditors test every year, what a GRC deployment costs, and what most SAP security work in a large organisation actually consists of. Roles, derived roles, critical combinations, the whole apparatus.

None of it is in the path here. The vulnerable code executes before SAP has any idea who is talking to it, which means every control built on the answer to "who is this and what may they do" is downstream of the problem and cannot see it.

That is not a criticism of SoD, which does the job it was designed for. It is a warning about assuming your investment covers a class of risk it was never aimed at. An SAP estate can be immaculately governed and still fall to a header.

## The attack surface is a diagnostic feature

Extended Passport exists so that operators can follow a transaction across an SAP landscape and work out where time went. It is observability.

Which puts it in familiar company. [The Telerik chain last week ran through a file upload control's convenience path](/article/telerik-radasyncupload-the-chain-needs-the-hardening-step), and the VMware escapes ran through the paravirtualised network adapter and the shared-folders implementation. The pattern is consistent enough to plan around: the code most likely to be reachable before authentication, and least likely to have been reviewed as security-relevant, is the code somebody added to make operations easier.

Nobody threat-models the tracing header.

## The rest of the cycle

The same release carries **CVE-2026-58240** in S4GET at **CVSS 9.8**, **CVE-2026-76969** at **9.4**, and **CVE-2026-66768** at **9.0**.

That is four flaws at 9.0 or above in one month, which for SAP is a heavy cycle by any standard, and OVERPASS is the one with no authentication in front of it.

None of them has been exploited to date.

## What to do

- **Apply the September SAP Security Notes**, prioritising the kernel update for CVE-2026-44756.
- **Do not let the SoD conversation absorb this.** The people who own authorization design are not the people who can fix it; the ones who patch the kernel are.
- **Restrict who can reach SAP application servers on the network.** With authentication out of the picture, reachability is the only remaining control.
- **Check what is exposed beyond the obvious.** SAP kernel code is shared across components and protocols, so the surface is wider than the interfaces you think of as public.
- **Ask your SAP partner for the specific version mapping.** The advisory describes the flaw as kernel-level without naming affected releases in the reporting, and your basis team needs the exact numbers.

## What is not established

- **Which SAP product versions and kernel releases are affected.** Not specified in the reporting.
- **Whether it has been exploited.** None to date.
- **Whether a proof of concept exists** outside Onapsis.
- **How the flaw interacts with SAP Cloud deployments.**`,
  },
  {
    slug: "shieldcrash-the-defender-patch-missed-a-spot",
    title: "The researcher says Microsoft's Defender patch missed a spot, and published the proof",
    excerpt:
      "ShieldBreak was CVE-2026-69414 in Defender's Malware Protection Engine, patched in engine 1.1.26080.3. Chaotic Eclipse has released ShieldCrash, a proof of concept that reaches the same bug through a path the fix did not close, giving arbitrary file read as SYSTEM on every supported Windows desktop.",
    categorySlug: "security",
    tags: ["microsoft-defender", "patch-bypass", "chaotic-eclipse", "cve-2026-69414", "windows", "proof-of-concept"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1763568258439-de52f4b4e7f9${P}`,
    body: `**ShieldBreak** was **CVE-2026-69414**, **CVSS 7.8**, in Microsoft Defender's **Malware Protection Engine**. Microsoft fixed it in engine version **1.1.26080.3**, distributed automatically, no customer action required.

A researcher publishing as **Chaotic Eclipse** has now released **ShieldCrash**, a proof of concept that reaches the same bug anyway.

In their words:

> Microsoft has failed to properly patch ShieldBreak CVE-2026-69414. Under specific conditions it is still possible to trigger the exact same problem.

Microsoft closed several exploitable paths, the researcher says, and **missed a spot**. The demonstration reads an arbitrary file with **SYSTEM** privileges, on **all supported Windows desktop versions**.

There is **no new CVE**. It is filed as a patch bypass against the original, which means a scanner checking whether you have engine 1.1.26080.3 will report you fixed, and you will be.

## Why a partial fix is its own category

A vulnerability everybody knows about gets attention. A vulnerability everybody believes is fixed gets none.

The engine version check passes. The advisory is closed. The dashboard is green. Whatever process an organisation has for tracking unpatched issues will not surface this, because by every mechanical definition it is patched — and the only thing saying otherwise is a researcher's post.

That is the same shape as the [four N-central hotfixes in five weeks](/article/n-central-cve-2026-86218-unauthenticated-rce-in-the-box-that-manages-the-boxes), the first of which was itself an incomplete fix for an authentication bypass. Incomplete patches are not rare and they are systematically under-tracked, because the tracking systems key on identifiers and an incomplete fix reuses the old one.

## The same researcher, and an answer to an open question

Chaotic Eclipse is one of the names behind the **Nightmare Eclipse** releases — PrettyPrague against Avast, FalconFlank against CrowdStrike Falcon, GreenSection against NVIDIA's display driver.

[When we covered that set](/article/nightmare-eclipse-three-exploits-one-fix), one loose end was flagged: **Kaspersky** appeared in Kevin Beaumont's confirmation that the exploits worked, but was not among the three named releases, and nobody had explained why.

The reporting on ShieldCrash lists this researcher's recent output as CrowdStrike Falcon Sensor, **Kaspersky**, Avast and NVIDIA. So Kaspersky was a target, not a reporting artefact. That closes the question this site left open, and it is worth saying rather than quietly dropping.

Five vendors in about a fortnight: Avast, CrowdStrike, Kaspersky, NVIDIA, Microsoft. Four of the five are security products. That is not a coincidence of interest — it is where the privilege is.

## Microsoft has not responded

No Microsoft statement on the bypass has been published, and no new CVE has been assigned.

Until one is, there is nothing for a patch process to consume. The practical position is that Defender on a fully updated Windows desktop has a known, publicly demonstrated arbitrary-file-read-as-SYSTEM, and the vendor has not said whether it agrees.

## What to do

- **Do not treat "engine 1.1.26080.3" as closure.** The version is correct and the bug is reachable.
- **Watch for a Microsoft response or a second engine update**, and check the engine version rather than the Windows build — the engine updates on its own schedule.
- **Assume arbitrary file read as SYSTEM is available on your desktops** while this stands, and consider what that reads: credential material, configuration, anything a user cannot normally open.
- **This needs local code execution first.** It is an escalation, not an entry point, which puts it in the same bracket as the two exploited flaws in this month's Patch Tuesday.
- **If you track vulnerabilities by CVE, you will miss this class entirely.** Patch bypasses do not get new identifiers, so somebody has to be reading rather than querying.

## What is not established

- **Whether Microsoft agrees it is unfixed.** No response published.
- **Whether it has been exploited.** No evidence of real-world use.
- **The specific conditions** under which the original bug is still reachable. The researcher describes the result, not the trigger.
- **Whether a new CVE will be assigned**, and therefore whether it will ever appear in a scanner.`,
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
