/**
 * Drafts three pieces from 3 September news.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-49.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-49.ts --update
 *
 * The FalconFlank piece deliberately reports the disclosure and its
 * evidentiary position rather than the technique. There is no vendor
 * advisory, no CVE, no patch and no public reproduction, and the source
 * material contains one sentence of mechanism — inflating that into a
 * how-it-works would be inventing it.
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
    slug: "pegasus-serbia-student-activist-patched-eight-months-earlier",
    title:
      "The Pegasus exploit that hit a Serbian student activist was patched eight months before the infection",
    excerpt:
      "Citizen Lab and the SHARE Foundation confirmed an iMessage zero-click delivered Pegasus to a member of Serbia's student protest movement between December 2025 and January 2026. Apple fixed the flaw in iOS 18.4.1, in April 2025. The tool is identified; the operator is not.",
    categorySlug: "security",
    tags: ["pegasus", "nso-group", "citizen-lab", "serbia", "spyware", "ios"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1736435873430-7be0b5bd5a17${P}`,
    body: `**Citizen Lab**, working with Serbia's **SHARE Foundation**, has confirmed that an **iMessage zero-click exploit** was used to install **NSO Group's Pegasus** spyware on the iPhone of a member of Serbia's **student protest movement**.

The infection ran from **December 2025 into January 2026**. It was made public on **3 September 2026**.

## The fix was already eight months old

Apple patched the vulnerability in **iOS 18.4.1**, released in **April 2025**.

So the sequence is: a fix ships, eight months pass, and the exploit still lands. Whatever else this is, it is not a story about an unstoppable capability. It is a story about a phone that was not updated, and an operator who knew that population exists.

That is the second time this week we have written the same sentence. [Thirteen PHP packages ended at an iPhone kernel using a chain where every flaw was already patched](/article/packagist-themes-ios-exploit-chain-every-flaw-already-patched), targeting iOS 18.4 through 18.6.x. Different operator, different budget, identical dependency: someone who did not install the update.

For a commercial spyware vendor this is the economically rational position. A zero-day is expensive and perishable; an n-day against an activist's phone is cheap and works for as long as the phone stays behind.

## What is confirmed, and what is not

Citizen Lab says it found **high-confidence indicators of Pegasus infection**, and adds that this **does not preclude the possibility of additional infections**.

That identifies the **tool**. It does not identify the **operator**, and no CVE is named in the reporting.

NSO sells to governments. That is a fact about the vendor's business model and it is not evidence about who ran this particular operation, and the report as published names nobody. No statement from NSO Group or from the Serbian government appears in it.

We have held this line on weaker signals and it applies to stronger ones too: "Pegasus was used" and "the government used Pegasus" are different claims, and only the first one is supported here.

## The wider pattern in Serbia

At least **14 people** in Serbia have been targeted with advanced spyware since early 2026, around the **29 March 2026** local elections.

One detail from that set sits apart from the rest. Another student activist's device was compromised with **NoviSpy** Android spyware **while they were in police detention** — which is not a remote exploit at all. It is physical access to a seized phone.

Those are different capabilities with different evidentiary weight, and they should not be summed into one number without saying so.

## The notification gap

Apple sent threat notifications in **August 2026** to people in over **110 countries** — [we covered that round when it went out](/article/apple-mercenary-spyware-notifications-110-countries), including the point that Apple deliberately attributes nothing.

Put the dates together. Infection: December 2025 to January 2026. Apple notification: August 2026. Public forensic confirmation: September 2026.

That is roughly **seven to eight months** from compromise to notification, and another month to a published finding. None of that is a failure by Apple or by Citizen Lab — detection of a zero-click infection is genuinely hard and forensics take time — but it is the actual operational reality for anyone in this position. If you are a plausible target, the alert arrives long after the access did.

## What to do

- **Update.** It is the whole defence in this case and it is free.
- **Turn on Lockdown Mode** if you are an activist, journalist, lawyer or opposition figure. It removes attack surface that ordinary users need and targets do not.
- **If you get an Apple threat notification, treat the device as compromised from months earlier**, not from the date on the message.
- **Get forensics done by people who do this** — Citizen Lab, Amnesty's Security Lab, Access Now's helpline — rather than wiping first and asking later. A wipe destroys the evidence that would establish what happened.

## What is not established

- **Who operated the spyware.** The tool is identified. The customer is not.
- **Which CVE was used.** The reporting names the patch level, not the identifier.
- **How many of the 14 Serbian cases involve Pegasus specifically**, as distinct from other tooling including NoviSpy.
- **Whether NSO or the Serbian government dispute any of this.** Neither is quoted.
- **Whether this device was infected more than once.** Citizen Lab explicitly leaves that open.`,
  },
  {
    slug: "falconflank-crowdstrike-claim-single-source-no-patch-no-cve",
    title:
      "A researcher dropped a CrowdStrike Falcon privilege-escalation PoC with no vendor notice, no CVE, and no independent reproduction",
    excerpt:
      "FalconFlank claims local privilege escalation against Falcon Sensor by abusing its malicious-macro remediation. There is no advisory, no patch and no second source — the claim rests entirely on its author. The suggested workaround is advice on evading detection, which tells you what kind of publication this is.",
    categorySlug: "security",
    tags: ["crowdstrike", "edr", "disclosure", "zero-day", "poc", "unverified"],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1622295023368-8d348ed7140e${P}`,
    body: `A researcher going by **Chaotic Eclipse** — also **INFINITE NIGHTMARE**, **MSNightmare** and **Nightmare-Eclipse** — published a proof of concept on GitHub called **FalconFlank**, claiming a local privilege escalation in **CrowdStrike Falcon Sensor**.

Before anything else, here is the evidentiary position, because it is the story.

## What is actually established

- The PoC exists and is public.
- The researcher says it **abuses the Office malicious-macro remediation** in Falcon Sensor, and says it works on a fully updated **Windows 11 25H2** machine or **Windows Server 2025**.
- That is the extent of the published mechanism. One sentence.

And here is what does not exist: **no CVE, no CrowdStrike advisory, no patch, no affected-version list, and no public reproduction by anyone other than the author.**

The claim is single-sourced to the person selling it as a finding. That is not an accusation — plenty of real vulnerabilities start exactly this way — but it is the correct label to put on it until someone else runs the code.

We are also not going to reconstruct the technique from a one-line description. There is nothing to reconstruct it from, and guessing at exploit mechanics is how "researcher claims" becomes "confirmed" without anybody doing any work.

## The disclosure was a drop, not a report

There is no indication the researcher notified CrowdStrike before publishing. The stated reasoning is that the vendor "may already have detections for the flaw by now" — an assumption, offered in place of a notification.

The Hacker News says it contacted CrowdStrike for comment and had not received a response at publication.

So defenders currently have: working exploit code in public, no fix, and no vendor guidance. That is the worst configuration of those three variables, and it is a choice somebody made.

## The workaround is evasion advice

The researcher's own suggestion for getting the PoC to run is to add it to the exclusions, or obfuscate it and change how the DLL is loaded.

Read that again as a security document. It is not mitigation. It is instruction on getting past the product — offered to the reader of a vulnerability disclosure, where a mitigation section normally goes.

That inversion is worth naming, because it settles what kind of publication this is. A disclosure written for defenders tells you how to detect or contain the thing. This one tells you how to make it work.

Exclusion lists keep showing up in that role. [Users added them voluntarily to silence adware and got ValleyRAT](/article/valleyrat-signed-adware-antivirus-exclusion-list); [malware set them and locked the ACLs so nobody could remove them](/article/fake-installers-rename-windows-update-dlls-icacls-defender-exclusions). Here they are the recommended setup step.

## Why an EDR LPE matters if it is real

Take the claim at face value for a moment. Endpoint detection agents run with the highest privilege on the host by design — that is what lets them see everything. A local privilege escalation *in the agent* converts the most privileged process on the machine into the attacker's ladder, and it does it inside a process that security teams have specifically told their controls to trust.

That is the same structural problem as [a signed driver being used to remove Defender at boot](/article/defender-btr-sys-boot-time-removal-golden-window-no-patch) and [Akira using Safe Mode to get out from under EDR](/article/akira-safe-mode-edr-bypass-encryption-failed-data-gone): the defensive component is the highest-value target on the box precisely because it is the most trusted one.

Which is exactly why the claim deserves verification rather than amplification.

## What to do

- **Do not change anything yet.** There is no patch to apply and no configuration guidance from the vendor.
- **Watch for a CrowdStrike advisory.** If this is real, that is where the affected versions and the fix will appear.
- **Do not add exclusions on the strength of a PoC's README.** That is the one action this document actively encourages and the one you should not take.
- **Treat "researcher claims 0-day in security product" as unverified** until a second party reproduces it, including when the product is one you do not use.

## What is not established

- **Whether the vulnerability is real.** Nobody outside the author has published a reproduction.
- **Which Falcon Sensor versions are affected**, if any.
- **Whether CrowdStrike considers it a vulnerability.** No statement has been issued.
- **Whether it is being exploited.** No detections or incidents are reported.
- **Whether a CVE will be assigned.** None exists at the time of writing.`,
  },
  {
    slug: "nimbus-manticore-coding-test-says-do-not-use-ai",
    title:
      "The fake coding test tells candidates not to use AI, and says the backend is bug-free. Both sentences are the attack",
    excerpt:
      "Kaspersky documented Nimbus Manticore sending trojanised technical assignments to software engineers via LinkedIn. The instructions give a three-hour clock, forbid AI assistance, and state that the backend component is already correct — which is where the malicious code is.",
    categorySlug: "security",
    tags: ["nimbus-manticore", "iran", "kaspersky", "npm", "social-engineering", "developers"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1761446812511-d976288e33e9${P}`,
    body: `**Kaspersky** researcher **Omar Amin** documented a campaign by **Nimbus Manticore**, also tracked as **Iranian Dream Job**, targeting software engineers across the **Middle East** and **Africa**. Confirmed sightings are in **Afghanistan**, **Egypt** and **Ethiopia**.

The approach is a recruiter on **LinkedIn** offering a role at a major technology company, followed by a technical assignment. The assignment is a ZIP archive of real-looking project source.

The interesting part is the instruction sheet.

## Two sentences do the work

The **NodeRabbit** archive — "Front-Technical-Challenge.zip", containing a project management tool called Taskflow — tells the candidate to debug the **frontend** within **three hours**, **without AI assistance**, and states that the **backend server component is bug-free**.

Read those as attacker instructions rather than exam rules.

**"The backend is bug-free"** is scoping. It tells a candidate on a **3**-hour clock not to read the one directory where the malicious code lives, and it sounds like a considerate examiner narrowing the task rather than misdirection. **"Without AI assistance"** is the anti-analysis control: it forbids the action most likely to catch this — pasting unfamiliar code into an assistant — and reads as an ordinary hiring rule.

Plenty of real technical assessments say both of those things, which is exactly why neither raises an eyebrow.

We wrote last week about [a Russian group planting a nuclear-weapon prompt in a script to derail AI analysis](/article/uac-0099-guardbreaker-nuclear-prompt-vbs-comment) — a technical attempt to stop a model reading malware, with no evidence it works. This is the social version of the same goal, and it does not need to defeat a model at all. It just asks the human not to open one.

The **PollCat** variant uses a different pressure: a CTF-style React platform and a PDF tutorial that has the target enter attacker-supplied **six-digit codes that refresh every 30 seconds**. Manufactured urgency, with the attacker controlling the clock.

## The dependency never touches a registry

The NodeRabbit archive ships a trojanised npm package — **colorized_terminal 2.1.0** — **inside node_modules**, rather than declaring it so npm fetches it. Registry-side defences, package reputation, install-time scanning and lockfile review never engage, because there is no install: the code is already on disk when the candidate unzips the archive, and importing it launches the payload as a background process.

Supply-chain thinking that stops at "audit your dependencies" does not cover a dependency that was handed to you pre-installed.

## What lands

**NodeRabbit** is a cross-platform RAT in Node.js and JavaScript running on **Windows**, **Linux** and **macOS**, with 11 commands in early samples and more later: host and process reconnaissance, arbitrary shell execution, file read and write, directory listing, network adapter and DNS enumeration, and beacon interval changes. Command and control runs through three **Azure**-hosted domains.

The advanced variant is built for developers specifically. It harvests **Outlook OST/PST** credentials, installs a fake VS Code extension called **"GitHub Copilot Helper"**, injects **git hooks** for persistence, and supports **WSL** with daily scheduled tasks.

Git hook persistence is the one to sit with. A hook survives in the repository, and it runs on ordinary developer actions — so the compromise follows the work rather than the machine.

**PollCat** carries 22 commands across seven endpoints, and does something more pointed: it searches for **24 hard-coded vendor folders** — Microsoft, Google, Palo Alto Networks, Cisco, VMware, Fortinet, Citrix, Check Point, CrowdStrike, SentinelOne, Kaspersky, ESET, Sophos and others — inventories what it finds and reports it back.

That is not reconnaissance of the machine. It is reconnaissance of the defender, performed before deciding what to do next.

Persistence is per-platform and unremarkable: registry Run keys or scheduled tasks on Windows, cron on Linux, launch agents on macOS, some variants posing as Microsoft Edge or Intel driver updates.

## On the attribution

Kaspersky **assessed** the link to Nimbus Manticore from structural similarities, command-fetching patterns, beacon timing, resemblance to previously attributed malware (**MiniFast**, **MiniUpdate**, **Retrograde**), and shared Azure Websites and Cloudflare-backed C2.

That is a reasonable basis and it is an assessment, not a confirmation, and no other agency has corroborated it publicly. The campaign is also consistent with [the North Korean fake-applicant operation we covered last week](/article/north-korean-fake-applicants-healthcare-sales-sixty-a-day) in shape while being a different actor with a different objective — there the goal was employment, here it is access.

## What to do

- **Treat every take-home assignment as untrusted code.** Run it in a disposable VM with no credentials, no SSH keys and no repository access.
- **Check node_modules in anything you were sent.** A dependency directory arriving inside an archive is not normal.
- **Ignore "do not use AI" on unsolicited assignments.** A real employer's assessment rule does not survive contact with an unknown ZIP file; read the code however you like.
- **Read the part you were told was fine.** The instruction narrowing your attention is the instruction to distrust.
- **Audit git hooks** in repositories on any machine that ran an assignment, and check for VS Code extensions nobody installed deliberately.

## What is not established

- **Attribution.** Assessed by Kaspersky on behavioural and infrastructure overlap; not independently confirmed.
- **How many engineers were targeted or compromised.** No figures are published.
- **Which companies were impersonated.** Described as major technology companies, not named.
- **Whether the unimplemented PollCat commands** — WS_DOWNLOAD, REQUEST_ELEVATION, PERSIST — indicate work in progress or abandoned features.
- **Whether the two malware families are operated by the same team**, as distinct from sharing tooling and infrastructure.`,
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
