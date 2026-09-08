/**
 * Drafts the 8 September batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-61.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-61.ts --update
 *
 *   1. Nightmare Eclipse. This is the follow-up to article 223, which said
 *      FalconFlank was a single-source claim with no patch and no CVE. That has
 *      changed — CrowdStrike has published a workaround and Kevin Beaumont has
 *      independently confirmed the exploits work — and the piece leads with
 *      that update rather than burying it.
 *   2. VMware Workstation and Fusion guest-to-host escapes. The guest-admin
 *      precondition is real and also weaker than it sounds, which is the part
 *      worth explaining.
 *   3. Wordfence's 440,000. Written around what the number measures: blocked
 *      attempts seen by one vendor's WAF, which is not a compromise count and
 *      is not even separated into scanning versus successful exploitation.
 *
 * Covers checked at full size.
 *
 * No backticks and no angle brackets in the bodies: inline code spans and
 * anything shaped like a JSX tag break the MDX parse.
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
    slug: "nightmare-eclipse-three-exploits-one-fix",
    title: "One researcher dropped three exploits. Only Gen Digital has shipped a fix",
    excerpt:
      "PrettyPrague, FalconFlank and GreenSection target Avast's sandbox, CrowdStrike Falcon's macro remediation and NVIDIA's display driver. Gen Digital has patched. CrowdStrike's advice is to turn the affected protection off. NVIDIA is still investigating. And the FalconFlank claim this site called single-source last week now has independent confirmation.",
    categorySlug: "security",
    tags: ["nightmare-eclipse", "crowdstrike", "nvidia", "avast", "zero-day", "disclosure", "privilege-escalation"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1591488320449-011701bb6704${P}`,
    body: `A researcher publishing under the names **Nightmare Eclipse**, **Chaotic Eclipse**, **Infinite Nightmare** and **MSNightmare** released three exploits within a short window, targeting **Avast**, **CrowdStrike** and **NVIDIA**. SecurityWeek reported the set on **7 September 2026**.

## First, an update to what we wrote

On **3 September** this site [covered FalconFlank as a single-source claim with no patch and no CVE](/article/falconflank-crowdstrike-claim-single-source-no-patch-no-cve), and said it should be treated as unverified until somebody other than the researcher confirmed it.

Somebody has. **Kevin Beaumont has confirmed that the Avast, CrowdStrike and Kaspersky exploits work**, and CrowdStrike has published customer guidance, which is itself an acknowledgement that there is something to guide customers about.

That is a real change in the evidence and it belongs at the top rather than in a correction note. The caution was right at the time; it is no longer the right posture.

Two things still have not changed: there is still **no CVE** for any of these, and CrowdStrike still has no patch.

## The three

**PrettyPrague** — privilege escalation to full system privileges from inside the **Avast sandbox**. Gen Digital says it may affect a subset of its products, which would take in AVG and Norton. Proof-of-concept code is on GitHub.

**FalconFlank** — privilege escalation through a bug in **CrowdStrike Falcon Sensor's** feature for remediating malicious Office macros.

**GreenSection** — an out-of-bounds memory write in **NVIDIA's user-mode GPU display driver** components, in a shared global memory section on Windows, with the potential for **cross-user compromise**.

## What the three have in common

Look at the list and the pattern is not subtle.

An antivirus sandbox. An endpoint agent's cleanup routine. A graphics driver's shared memory.

All three are software that runs above the user in order to serve or protect them, which is exactly why a flaw in any of them escalates. Security software in particular buys its usefulness with privilege: it has to see everything and touch everything, and the cost of that bargain is that its bugs are never ordinary bugs.

The Falcon case is the sharpest version. The affected feature exists to **remove malicious macros**. The cleanup mechanism is the attack surface.

## The mitigation is losing a protection

CrowdStrike's guidance:

> We advise customers to disable the Microsoft Office File Suspicious Macro Removal Windows policy setting... Customers remain protected through Cloud Anti-malware for Microsoft Office Files settings.

Read both halves. The first is turn the feature off. The second is you still have a different control covering the same ground.

That is a reasonable interim position and it is not free — it is a defence-in-depth layer being removed while the vendor works, and the second sentence exists because CrowdStrike knows customers will ask what they lose. Whether the remaining control is equivalent is a question only the customer can answer for their own estate.

Gen Digital's position is simpler:

> Gen was recently made aware of a security vulnerability affecting a subset of Gen products... We immediately initiated our security response procedures and have fixed the issue.

NVIDIA's:

> NVIDIA is reviewing the reported behavior... NVIDIA takes reports of this nature seriously and is actively investigating.

One fix, one workaround, one investigation, from one week's work by one person.

## On the disclosure

These were published without coordinated disclosure. It is worth putting both sides down rather than only the one that flatters the reader's instinct.

Against: three vendors learned about flaws in privileged software at the same time as everyone else, and defenders have **no CVE** to key a scanner on, which means asset management tooling cannot tell you whether you are affected.

For: Gen Digital fixed it inside a week under exactly these conditions, and the public proof of concept is why CrowdStrike customers have guidance today rather than after a quiet backlog. Coordinated disclosure is better when it works; it does not always work, and the argument that it always does is made mostly by people who have never had a report ignored.

What is not defensible is pretending the trade does not exist.

## The fourth product

**Kaspersky** appears in Beaumont's confirmation and is not among the three named exploits.

Nobody has explained that. It may be a fourth release, an older piece of work, or a reporting artefact. Treat it as an open question rather than a fourth zero-day.

## What to do

- **If you run Falcon, decide about the macro removal policy deliberately.** Disabling it is CrowdStrike's advice; understand what Cloud Anti-malware does and does not replace before you do it.
- **Update Avast, AVG and Norton.** Gen Digital says it is fixed; make sure your fleet actually has it.
- **On NVIDIA, there is nothing to do yet.** GreenSection is unfixed and under investigation. Cross-user compromise potential matters most on shared and multi-user Windows hosts, which is where to look first when a fix lands.
- **Do not wait for CVEs to inventory this.** There are none, so your scanner will stay quiet regardless of exposure.
- **Assume proof-of-concept code will be reused.** PrettyPrague is on GitHub.

## What is not established

- **Whether any of these have been exploited in real attacks.** No evidence of that has been published.
- **CVE assignments.** None have been issued.
- **The full product range affected by PrettyPrague.** Gen Digital says "a subset".
- **Whether Kaspersky is a fourth target**, and what the exploit against it was.
- **The researcher's motive.** Not stated anywhere.
- **When CrowdStrike or NVIDIA will ship a fix.**`,
  },
  {
    slug: "vmware-workstation-fusion-two-guest-to-host-escapes",
    title: "Two guest-to-host escapes in Workstation and Fusion, and guest admin is the whole precondition",
    excerpt:
      "CVE-2026-59346 is an integer overflow reached through the VMXNET3 adapter, rated 9.3. CVE-2026-59347 is a stack buffer overflow in HGFS, rated 8.1. Both let someone with administrator rights inside a virtual machine run code on the host. Broadcom has patched; there are no workarounds.",
    categorySlug: "security",
    tags: ["vmware", "broadcom", "cve-2026-59346", "cve-2026-59347", "vm-escape", "virtualisation"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2${P}`,
    body: `Broadcom has patched two vulnerabilities in **VMware Workstation** and **VMware Fusion**, both of which allow code execution on the host from inside a guest virtual machine.

**CVE-2026-59346** — **CVSS 9.3**, an integer overflow reached through the **VMXNET3** virtual network adapter. In VMware's words, "a malicious actor with local administrative privileges on a virtual machine with VMXNET3 virtual network adapter may exploit this issue to execute code on the host."

**CVE-2026-59347** — **CVSS 8.1**, a stack-based buffer overflow in **HGFS**, the Host Guest File System component that implements shared folders.

Affected: Workstation and Fusion **25H2** and **26H1**. Fixed in **26H1u1** for both products. There are **no workarounds**.

## What a guest-to-host escape actually breaks

The point of a virtual machine is the boundary. Whatever happens inside the guest is supposed to stay inside the guest, and that assumption is what makes it safe to open a suspicious file in a VM, run untrusted code in a sandbox, or give a contractor a disposable environment.

An escape does not weaken that boundary. It removes it. Code that was contained is now running on the machine that was doing the containing, with access to everything the host user has — including, very often, the other virtual machines.

## The precondition, and why it is weaker than it sounds

Both flaws require **local administrative privileges inside the guest**.

That sounds like a serious constraint and in many contexts it is. It also happens to be the normal state of affairs in exactly the situations where people rely on VM isolation most:

- **Malware analysis.** The sample is administrator inside the VM by design, because that is what you are trying to observe.
- **Developer sandboxes.** People run their own VM as administrator without thinking about it.
- **CI and build runners.** Ephemeral VMs where the job has full rights over its own environment.
- **Disposable browsing or testing environments**, where the whole point is to do risky things with elevated rights somewhere that does not matter.

In every one of those, "attacker has admin in the guest" is not a barrier the attacker has to overcome. It is the starting position the workflow hands them.

Anyone reading the precondition as reassurance should check which of those four they are actually doing.

## The two components are both old surface area

VMXNET3 and HGFS are the paravirtualised network adapter and the shared folders implementation. Both exist to make the guest faster and more convenient by giving it a more direct path to host resources than strict emulation would.

That convenience is the attack surface. Every VM escape of the past decade has come out of the same place — the parts deliberately built to be less isolated. [The vCenter flaw we covered earlier](/article/vmware-vcenter-cve-2026-59310-exploited-reverse-ssh) sat in different code with the same underlying trade.

## What to do

- **Update to Workstation 26H1u1 or Fusion 26H1u1.** There is no workaround, so this is the only option.
- **If you cannot patch immediately, remove the reachable surface.** Disabling shared folders takes HGFS out of play. Changing the network adapter type away from VMXNET3 takes the other out. Both cost functionality and both are better than nothing.
- **Prioritise malware analysis hosts first.** If you detonate samples in Workstation, the sample already has the precondition.
- **Then prioritise anything multi-tenant.** A build runner escaping to its host reaches every other job on that host.
- **Stop treating a VM as a security boundary you can be careless with.** It is a good boundary. It is not a guarantee, and this is the second reminder this month.

## What is not established

- **Whether either flaw has been exploited.** No evidence of in-the-wild exploitation has been published.
- **Whether public proof-of-concept code exists.**
- **Exploitation complexity.** Neither advisory describes how hard the overflows are to drive reliably.
- **Whether ESXi or other VMware products share the affected code.** Only Workstation and Fusion are named.`,
  },
  {
    slug: "440000-blocked-attempts-is-a-waf-metric-not-a-compromise-count",
    title: "440,000 blocked attempts is a WAF metric, not a compromise count",
    excerpt:
      "Wordfence blocked more than 250,000 attempts against Super Forms and more than 190,000 against Elementor Pro. Both flaws are unauthenticated file upload, both are patched, and the Super Forms campaign has been running since 14 July. What nobody has published is how many sites actually fell.",
    categorySlug: "security",
    tags: ["wordpress", "wordfence", "super-forms", "elementor", "file-upload", "mass-exploitation"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc${P}`,
    body: `Wordfence has documented sustained exploitation of two WordPress plugin flaws:

- **Super Forms**, **CVE-2026-14894**, **CVSS 9.8** — missing file type validation in the upload handler. Fixed in **6.3.314**.
- **Elementor Pro**, **CVE-2026-32475** — an unauthenticated file upload bypass. Fixed in **4.2.2**. [We covered the flaw itself when it was disclosed](/article/elementor-pro-cve-2026-32475-two-loops-php-upload).

Wordfence blocked more than **250,000** attempts against the first and more than **190,000** against the second: **440,000** combined.

## What that number measures

It measures **requests Wordfence blocked**, on sites running Wordfence, over the reporting period.

It does not measure compromises. It does not measure vulnerable sites. It does not measure attacks on the far larger population of WordPress installations that do not run Wordfence at all, and it says nothing about what happened on those.

The reporting also does not separate **scanning** from **successful exploitation** — a distinction that matters enormously, because a single automated scanner sweeping a plugin path across a large host will generate tens of thousands of blocked requests without a single site falling over.

None of this is a criticism of Wordfence, which is reporting what it can see and is one of very few sources with any visibility here at all. It is a caution about the sentence "440,000 attacks" that is going to circulate this week, because that sentence will be read as 440,000 attempts on 440,000 targets, and it is not that.

The honest version: **a lot of automated traffic, aimed at two known flaws, sustained over weeks, and nobody has published how many sites were actually taken.**

## The timeline is the part worth acting on

Super Forms exploitation began on **14 July 2026** and peaked at over **40,000 requests on 18 August**. Elementor Pro attacks started on **19 August**.

So the Super Forms campaign has been running for close to two months. That is long enough that "we patched when we heard about it" is not the same as "we were never exposed", and any site running the vulnerable version through July and August should be checked rather than assumed clean.

## The mechanics

Both are the same class of flaw and both end in a PHP web shell.

Against **Super Forms**, attackers post Base64-encoded payloads to **/wp-admin/admin-ajax.php**. The upload handler did not validate file type, so a PHP file goes where an attachment was supposed to.

Against **Elementor Pro**, the bypass works on array validation, and the resulting PHP files land in **/wp-content/uploads/elementor/forms/**.

That second path is the useful detail. A PHP file inside an uploads directory is not ambiguous — nothing legitimate puts executable code there — and it is the single easiest thing to search for on a site you are worried about.

Ten distinct IP addresses are associated with each campaign.

## Why it is always file upload

Unauthenticated file upload is the most reliable path to remote code execution in the WordPress ecosystem, and it recurs because of what these plugins are for.

A form builder exists to accept files from strangers. That is the product. Which means every one of them has an endpoint that takes attacker-controlled bytes and writes them to disk on the web server, and the entire security of the arrangement rests on validation code that a developer has to get right on every path, forever.

The two flaws here are a missing check and a bypassable one. Those are the only two options for how this fails.

## What to do

- **Update Super Forms to 6.3.314 and Elementor Pro to 4.2.2.** Both fixes exist.
- **Search your uploads directory for PHP files.** Start with /wp-content/uploads/elementor/forms/ and then widen. Nothing legitimate needs to be there.
- **If you were running a vulnerable version at any point since 14 July, assume you were reached** and look, rather than patching and closing the ticket.
- **Block PHP execution in the uploads directory at the web server.** This is a configuration change that neutralises an entire class of flaw, including the next one, and most WordPress hosts do not do it.
- **Do not repeat "440,000 attacks" without the qualifier.** It is a blocked-request count from one vendor.

## What is not established

- **How many sites were successfully compromised.** No figure has been published.
- **Whether the attempts were scanning or successful exploitation.** The reporting does not separate them.
- **What the attackers did after a successful upload** — account creation, data theft, full takeover. None is documented.
- **Whether exploitation is continuing** now that patches are available.
- **How many vulnerable installations remain.**`,
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
