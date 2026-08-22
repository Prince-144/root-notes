/**
 * Long-form drafts — 22 August 2026.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, cannot read a table, and
 * truncates past ~460 characters. Each section's strongest paragraph is written
 * to stand alone, carry its own figures, and stay under that limit.
 *
 * Cover note: every image below was downloaded and looked at before use. The
 * previous process — take an Unsplash id from a search result, check it returns
 * 200, never view it — put a Porsche badge on a story naming no manufacturer
 * and an unrelated Arabic sign on the Facebook piece.
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
    slug: "iauthflow-v2-passkey-enrollment-survives-password-reset",
    title:
      "The phishing kit adds its own passkey — so resetting the password does not remove the attacker",
    excerpt:
      "Abnormal found iAuthFlow V2 selling for $10,000 on Russian-language forums. During the phishing flow it silently registers an attacker-controlled passkey on the victim's account. Passkeys are independent of the password, so the standard remediation — reset, revoke sessions — leaves the intruder logged in.",
    categorySlug: "security",
    tags: [
      "phishing",
      "passkeys",
      "identity",
      "incident-response",
      "phaas",
      "gmail",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1636956026491-86a9da7001c9${P}`,
    body: `**Abnormal** has analysed **iAuthFlow V2**, a phishing-as-a-service kit sold on Russian-language cybercrime forums for **$10,000**, with modules priced separately.

It does what adversary-in-the-middle kits have done for years — relays a victim's login through a browser the attacker controls — and then does one thing more. During the flow, it silently registers **an attacker-controlled passkey** on the victim's account.

## Why that one step changes the incident

Every mailbox compromise runbook says the same thing: reset the password, revoke the active sessions. Abnormal's framing is exact — when an attacker's access is limited to captured session cookies, those two actions normally end it.

A passkey is not a session and not derived from the password. It is a separate credential on the account. So the victim resets the password, kills every session, tells everyone it is handled, and the attacker signs back in with a credential the reset never touched.

The remediation is not weak here. It is aimed at the wrong object.

## How the enrolment happens

The victim never approves anything they understand as approving.

- The victim lands on the attacker's phishing page
- The attacker's server runs a parallel browser session against the real service
- Credentials and authentication responses relay between the two
- The kit applies a device fingerprint and logs everything typed
- An attacker-controlled passkey is added to the account
- The victim completes what looks like an ordinary login, and in doing so authorises it

**Gmail** is the service in Abnormal's analysis.

## This is not an argument against passkeys

Worth being clear, because the headline invites the wrong conclusion.

Passkeys defeat credential phishing properly — the private key never leaves the device and cannot be relayed. Nothing here breaks that. What is being attacked is the **enrolment** step, which is a different problem: the strength of a credential says nothing about the strength of the process that adds one.

We saw the manual version of this in [UNC6671 talking targets through enrolling an attacker's passkey by phone](/article/unc6671-blackfile-rebrand-vishing-passkey-enrollment). What is new is that it is now productised, automated, and on sale at a fixed price.

The pattern to carry forward: as authentication gets harder to defeat, attackers move to the surrounding processes — enrolment, recovery, and the help desk. Those are usually the least monitored parts of an identity system.

## What to do

- **Add passkey enrolment to the compromise checklist.** After a reset, list the account's registered credentials and remove anything not recognised. This is the single change that matters.
- **Alert on new passkey registration**, particularly within hours of a suspicious sign-in. It is a rare event, so the alert is cheap.
- **Tell users what enrolment looks like**, so an unexpected prompt during a normal login registers as wrong rather than as friction.
- **Treat "we reset the password" as an incomplete report.** The follow-up question is which credentials were enumerated afterwards.
- **Review recovery paths at the same time.** An attacker who could not add a passkey will try to add a phone number.

## What is not established

- **How widely it is deployed.** Abnormal describes the kit, not a victim count.
- **Which services beyond Gmail work.** The analysis covers Gmail; the technique is not Gmail-specific.
- **Who is buying it.** Phishing-as-a-service has many customers by design.
- **Whether the providers can detect the enrolment pattern.** No vendor has said so publicly.`,
  },
  {
    slug: "cryptographic-context-injection-grok-gemini-adversa",
    title:
      "The safety filter read the ciphertext and the sandbox ran the plaintext",
    excerpt:
      "Adversa AI encrypted its instructions so guardrails saw only harmless-looking ciphertext, then let the model's own code sandbox decrypt and execute them. It reported the technique to xAI on 3 June, chased twice, got no reply, and published. Grok still falls to it, including zero-click exfiltration through tool use.",
    categorySlug: "ai",
    tags: [
      "prompt-injection",
      "ai-security",
      "grok",
      "gemini",
      "guardrails",
      "disclosure",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1614850523011-8f49ffc73908${P}`,
    body: `**Adversa AI** has published a technique it calls **Cryptographic Context Injection**, tested against **Grok** and **Gemini**.

The idea is simple enough to state in a sentence. Encrypt the instruction. The safety filter inspects it and sees ciphertext, which does not look like anything it was trained to refuse. The model's own code execution sandbox then decrypts it and runs what comes out.

## The gap it exploits

Between what gets checked and what gets executed.

A guardrail evaluates the text of a prompt. A code sandbox evaluates the result of running code. When the model can do both, an instruction can enter as one and leave as the other, and nothing in the middle re-examines it.

Adversa's framing of the effect is the sharp part: the attacker's payload inherits a credibility that the same text would never get if it were pasted straight into the prompt. It arrives as output from a trusted internal step rather than as input from an untrusted user.

Readers of this site have seen this shape twice this week already — [MLflow validating a URL and then re-resolving it after a redirect](/article/mlflow-cve-2026-64849-ssrf-redirect-dns-rebinding), and [Elementor checking a file extension in one loop while a second loop moved the file](/article/elementor-pro-cve-2026-32475-two-loops-php-upload). Same defect, three very different systems: the thing inspected and the thing acted on are not the same thing.

## Two ways to deliver it

**Direct.** A user pastes the encrypted prompt into the chat.

**Indirect.** An encrypted JSON object sits in a web page. An agent asked to analyse that page picks it up and the payload fires. Adversa describes this reaching zero-click exfiltration of private session data on Grok, through the model's own autonomous tool invocation.

The second is the one that matters. It needs no cooperation from the victim beyond pointing an assistant at a page, which is what assistants are for.

## The results, with the caveat

On **Grok**, the attack remained successful, including the zero-click exfiltration path.

On **Gemini**, the success rate declined by August. Adversa attributes that to possible filter updates or model changes and states the uncertainty plainly — nobody outside Google can see which. That honesty is worth noting, because "it stopped working" and "they fixed it" are different claims and the researchers did not conflate them.

Restricted content was produced during testing, of a kind Gemini's filters normally suppress. We are not going to describe it further.

## The disclosure timeline is its own story

| Date | What happened |
| --- | --- |
| 3 Jun 2026 | Reported to xAI |
| 4 Aug 2026 | Coordination attempted again |
| 10 Aug 2026 | And again |
| 21 Aug 2026 | Published, with no response received |

That is roughly **11 weeks** and **3** attempts to reach a vendor before going public, on a technique that still works. Researchers publishing after silence is a normal and defensible end to that process. It is also a description of how one company handled a report.

## What to take from it

- **A guardrail that inspects prompts is not a guardrail on what the model does.** If the model can execute code, the execution result needs its own check.
- **Treat any content an agent reads as potentially instruction-bearing.** This is the point [the Five Eyes guidance made about agentic AI](/article/prompt-injection-agentic-ai-five-eyes), and encryption makes the content unreadable to filters while staying readable to the model.
- **Autonomous tool invocation is the multiplier.** Without it this is a jailbreak. With it, it is exfiltration.
- **Ask vendors what happens after decryption**, not what happens at the prompt.

## What is not established

- **Whether Gemini is fixed.** The success rate fell; the cause is not confirmed.
- **Whether xAI is working on it.** No response has been reported.
- **How broadly it generalises.** Two model families were tested.
- **Real-world use.** No campaign has been tied to the technique.`,
  },
  {
    slug: "isolated-vm-externalcopy-toctou-getter-host-rce",
    title:
      "The sandbox read the array twice and trusted the first answer — a getter was enough to reach the host",
    excerpt:
      "isolated-vm is how a lot of Node applications run untrusted JavaScript without a container. EndorLabs found its ExternalCopy path iterates a transfer list twice and trusts the earlier pass, so a JavaScript getter returning different values each time can point the native layer at attacker-chosen memory. Fixed in 6.2.0 and 7.0.1.",
    categorySlug: "security",
    tags: [
      "nodejs",
      "sandbox-escape",
      "v8",
      "toctou",
      "vulnerabilities",
      "developer-tools",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1683064325134-3acfdef9c6d7${P}`,
    body: `**isolated-vm** gives Node.js access to V8's Isolate interface, so an application can run untrusted JavaScript in a separate heap without spinning up a container or a virtual machine. Plenty of platforms that let customers write code use it, precisely because it is cheaper than the alternatives.

**EndorLabs** found a critical flaw in it. No CVE has been assigned yet. It is fixed in **6.2.0** and **7.0.1**.

## The bug

It lives in **ExternalCopy**, the function that copies data between Isolates.

The native C++ binding iterates the **transfer_list** array twice while optimising the transfer, and the second pass trusts what the first pass saw. In JavaScript, an array element can be defined as a **getter** — a function that runs on access — and a getter is free to return something different every time it is called.

So guest code defines a getter, lets the first pass see something safe, and hands the second pass something else. The native layer then dereferences a pointer the attacker chose. The route into the host's own objects is **ivm.Reference**, which is the mechanism by which the host deliberately exposes things to the sandbox.

Outcome: a crash, or control-flow hijack in the host process, which is remote code execution outside the sandbox.

## Why this keeps happening

EndorLabs' own description is the general lesson: this layer is written in a memory-unsafe language, manipulates raw V8 handles and backing-store pointers, and re-reads attacker-controlled JavaScript objects in the middle of a security-sensitive operation.

Every word of that is a hazard, and the last clause is the one that generalises. **If you read attacker-controlled data twice, you have to assume it changed in between.** That is the same defect as [MLflow validating a URL and then resolving it again after a redirect](/article/mlflow-cve-2026-64849-ssrf-redirect-dns-rebinding), and as [Elementor checking a file extension in one loop while a second loop moved the file](/article/elementor-pro-cve-2026-32475-two-loops-php-upload).

The fix taken here is the right shape: prevent user JavaScript from executing at all during the copy. Remove the opportunity to change the answer rather than trying to detect that it changed.

## The uncomfortable part about isolates as a boundary

This is the second time this week that V8 isolates have appeared as a security boundary that needed reinforcement. [Cloudflare's own researchers pulled a JWT across isolates in the same process using Spectre](/article/cloudflare-workers-spectre-jwt-12-bits-per-second-mpk), and closed it with hardware memory protection rather than software.

Isolates are a **performance** construct that the industry has widely adopted as a **security** construct, because processes are expensive and isolates are nearly free. That trade is often correct. It is not free, and the failures show up in the native glue rather than in V8 itself.

## What to do

- **Upgrade to 6.2.0 or 7.0.1.** Anything earlier is affected.
- **Work out whether you actually run untrusted code.** If your isolates only ever run your own JavaScript, this is not urgent. If customers write the code, it is.
- **Audit any host function passing caller-influenced arrays as a transfer list.** That is the direct exposure EndorLabs names.
- **Review what you expose through ivm.Reference.** Every reference handed into the sandbox is part of the attack surface, and most are added for convenience.
- **Decide whether an isolate is the right boundary at all.** For genuinely hostile code, a process or a microVM costs more and fails differently.

## What is not established

- **A CVE identifier.** Not yet assigned at the time of writing.
- **Exploitation in the wild.** None reported.
- **How many deployments are affected.** No usage figures have been published alongside the advisory.`,
  },
  {
    slug: "trueconf-cve-2026-72529-head-mare-phantomcore-kev",
    title:
      "CISA gave three days for one flaw and two weeks for the other — both are in the same video server",
    excerpt:
      "Two critical bugs in TrueConf Server, patched in June, are being used by Head Mare to plant PhantomCore. Kaspersky says the attackers replaced a server file with a web shell and pushed malicious client installers. CISA added both to its exploited catalogue on 20 August with two different deadlines.",
    categorySlug: "security",
    tags: [
      "trueconf",
      "kev",
      "cisa",
      "head-mare",
      "web-shells",
      "supply-chain",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1637665662134-db459c1bbb46${P}`,
    body: `**TrueConf Server** is on-premises video conferencing — the kind an organisation runs itself rather than buying as a service, often for exactly the reason that it keeps meetings off somebody else's cloud.

Two critical flaws affect every version since **2022**:

- **CVE-2026-72529** — calling an undocumented function to execute arbitrary scripts
- **CVE-2026-72530** — escaping the isolated environment to execute scripts on the host

Both are reachable by a remote attacker with access to the server on **port 4307/TCP**. Both were patched in **June 2026**, in versions **5.3.9**, **5.4.9** and **5.5.5**.

## Two deadlines in one listing

**CISA** added both to its Known Exploited Vulnerabilities catalogue on **20 August 2026** — and gave federal agencies **3 days** for CVE-2026-72529 and **2 weeks** for CVE-2026-72530.

That split is unusual and it is informative. KEV deadlines are normally uniform, so two different clocks in one listing is CISA saying something about the two flaws that the CVSS scores do not: one is being used harder, or more easily, than the other. If you are triaging with limited hands, the 3-day one is the answer.

## What the attackers do with it

Kaspersky attributes the exploitation to **Head Mare**, a hacktivist group, deploying malware called **PhantomCore**.

The sequence, per Kaspersky: replace one of the server's own files with a **web shell**, then use that position to gather infrastructure information and reach databases.

Then the part that changes the shape of the incident — the attackers **distribute malicious client installers**.

A conferencing server hands software to the endpoints that connect to it. Compromise the server and you inherit that channel, and the installer arrives from the internal address staff have been told to trust. That is the same mechanic as [the car head units taking malware through their own update path](/article/dofun-head-unit-malware-twcore-updater-moyu-badbox): the attacker does not defeat a trust decision, they inherit one already made.

## The bit that should sting

The patch has existed since **June**. The exploitation is happening in **August**.

This is not a zero-day story. It is a two-month story, on a product bought specifically by organisations who wanted to control their own infrastructure — and controlling it includes patching it. The same gap produced [8,500 SharePoint servers still exposed after ransomware started on theirs](/article/cisa-sharepoint-cve-2026-45659-ransomware-8500-exposed).

## What to do

- **Patch to 5.3.9, 5.4.9 or 5.5.5.** Available since June.
- **Do not stop at patching.** A web shell placed before the patch survives it. Compare the server's files against a known-good install.
- **Rotate credentials for anything the server could reach**, especially the databases Kaspersky says were accessed.
- **Check what clients downloaded and when.** If installers were served during the exposure window, the endpoints are in scope, not just the server.
- **Restrict port 4307/TCP** to the networks that need it. A conferencing server does not need to accept that port from the internet.

## What is not established

- **How many servers were compromised.** No count has been published.
- **Who Head Mare works for.** Described as hacktivist; attribution beyond that is not established here.
- **Whether malicious installers reached any confirmed victim.** The capability is documented; outcomes are not.
- **Why the two deadlines differ.** CISA does not explain its reasoning publicly.`,
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
