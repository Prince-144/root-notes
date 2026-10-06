/**
 * Drafts the second 6 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-88.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-88.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-88.ts --update
 *
 *   1. Rejetto HFS CVE-2026-61500 (security). Horizon3 found it with a model,
 *      and what the model found was the pairing: a signing key from
 *      Math.random, and a separate unauthenticated path leaking the same
 *      generator's output. Scanning started days after the PoC.
 *   2. TA419 (security). Proofpoint on China-aligned phishing against US AI
 *      policy circles. The first message carries no link, and the browser
 *      window the target checks is drawn inside the page.
 *   3. Exchange CVE-2026-96940 (security). Any one mailbox credential reads
 *      everyone else's mail. Exchange Online was fixed before the advisory;
 *      on-premises has to act.
 *
 * Primary sources: Horizon3's write-up as reported, Proofpoint's own blog,
 * and Microsoft's out-of-band advisory. The two people TA419 impersonated are
 * named because Proofpoint named them, and the piece is explicit that they
 * are the impersonated party.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - HFS: a terminal on a dark screen, where the server process runs.
 *   - TA419: the Capitol, standing for the US policy community targeted.
 *   - Exchange: an Outlook window, which is the mailbox in question.
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
    slug: "rejetto-hfs-cve-2026-61500-math-random-signed-the-session-and-the-login-leaked-the-seed",
    title:
      "A model found the weak random number generator and, in the same pass, the unauthenticated path that leaks its output",
    excerpt:
      "Rejetto HFS signed its session cookies with a key from JavaScript's Math.random, and handed out numbers from the same generator to anyone who started a login. Either alone is survivable. Together they let a stranger forge an admin session and run code. Horizon3 found it with Anthropic's Mythos, published a proof of concept, and scanning began within days.",
    categorySlug: "security",
    tags: [
      "rejetto-hfs",
      "cve-2026-61500",
      "prng",
      "math-random",
      "session-forgery",
      "horizon3",
      "ai-assisted-research",
      "remote-code-execution",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1640552435845-d65c23b75934${P}`,
    body: `**Rejetto HFS** is a small HTTP file server that a lot of people run to share files without standing up anything larger. Versions **3.0.0 to 3.2.0** carry **CVE-2026-61500**, scored **9.8** under CVSS 3.1 and **9.3** under CVSS 4.0, filed under **CWE-338** — use of a cryptographically weak random number generator.

It is fixed in **3.2.1**. The current stable release is **3.3.4**.

## Two mistakes, one generator

The session cookies that say who you are signed in as are signed with a secret key. HFS generated that key with JavaScript's **Math.random**.

That is a known mistake on its own. Node's V8 engine implements Math.random with **xorshift128+**, which is fast, not cryptographic, and — the part that matters — reversible. Given enough consecutive outputs, the generator's internal state can be reconstructed, and from the state every past and future number follows.

The second mistake is what makes the first one usable. HFS's login handshake, which anyone can start without credentials, hands back values drawn from **that same generator**.

So the attack writes itself. Start logins, collect the numbers, recover the state, derive the signing key, and mint a cookie that says the user is **admin** — signed exactly the way the server signs its own. Point it at an admin-only endpoint and the server returns a clean response to someone who never had an account.

Either mistake alone is survivable. A weak key nobody can observe is a bad idea that holds; leaked random numbers with nothing depending on them are noise. The vulnerability is the pairing, which is the same shape as [FortiMail's path check disagreeing with its file write](/article/fortimail-cve-2026-104286-a-null-byte-and-a-path-check-that-disagree) and the iCloud parsers disagreeing about where a header ends.

## From admin session to code execution

Forging the session is the whole flaw. What follows is a documented product feature.

HFS lets an administrator register a JavaScript snippet that the server runs. It is there so operators can extend behaviour, and it is perfectly reasonable to offer an administrator. An attacker holding a forged administrator session writes a configuration containing their own snippet, and it executes with the privileges of the server process — which, on plenty of installations, is root.

No memory corruption, no exploit chain, no bypass of any hardening. The attacker becomes an administrator and then uses the feature administrators have.

## What the model actually contributed

**Horizon3** found this, and found it using **Anthropic's Mythos** model. Its researchers published the technical write-up and a proof of concept on **30 September 2026**.

The claim worth looking at is not that a model found a bug. It is what Horizon3 says the model connected. In its own words, Mythos did not just flag the insecure generator in isolation — it simultaneously identified that the application leaked raw Math.random outputs through a separate code path.

That is the real work here. Flagging Math.random used for a secret is something a static analyser does and a reviewer does on sight; it is on every checklist. Noticing that a different, unauthenticated function elsewhere in the codebase hands an attacker the observations needed to exploit it requires holding both halves in mind at once, and that is where human review fails on a codebase nobody has time to read end to end.

So this is a narrow and real capability claim: not invention, but reach across a whole program. It is also one data point from one vendor on its own tool, and worth reading as that.

## Days, not months

The write-up and proof of concept went out on 30 September. Within days, **VulnCheck** reported active probing — reconnaissance from a China Telecom address, aimed at deployments in Japan and the United States.

Nobody has reported a confirmed compromise or post-exploitation activity yet. Scanning is not exploitation, and the gap between them is where defenders still live.

But set the dates beside the figure from [Microsoft's report last week, which put the median time from discovery to weaponisation well below 24 hours](/article/microsoft-digital-defense-2026-under-a-day-to-weaponise-and-up-to-sixty-to-patch), against 30 to 60 days of enterprise remediation. This is that arithmetic in one case: a tool that compressed finding, a public proof of concept that removed developing, and the only slow step left is the one the defender owns.

## What to do

- Upgrade to 3.2.1 at minimum, 3.3.4 for current. There is no workaround worth running instead.
- Take exposed instances off the internet while you do it. HFS is frequently stood up for one transfer and then forgotten, so the risk is not what you run deliberately but what somebody started in 2023.
- Treat an HFS reachable from outside as suspect. Check the configuration for a server_code snippet nobody added, and look for admin-only endpoints answering requests with no preceding login.
- If you build software, the lesson is narrower than do not use Math.random. It is that any value an unauthenticated caller can observe has to come from a different generator than anything you sign with.

## What is not established

- Whether anyone has successfully exploited this. Only scanning has been reported.
- How many internet-facing HFS instances are on affected versions.
- Who is behind the probing. An address in one country is a starting point, not an attribution.
- How much of the finding was the model and how much was the researchers framing the question, which only Horizon3 can say.`,
  },

  {
    slug: "ta419-ai-policy-phishing-the-first-email-had-no-link-and-the-browser-window-was-a-picture",
    title:
      "The first email carried no link at all, and the browser window the target checked was drawn inside the page",
    excerpt:
      "Proofpoint has tied a China-aligned group to credential phishing against US AI policy researchers. The approach opens as an ordinary conversation with no link in it, and only once the target replies does a URL arrive — ending at a fake sign-in window rendered inside the real browser, which collects the password, the MFA code and the session cookie.",
    categorySlug: "security",
    tags: [
      "proofpoint",
      "ta419",
      "phishing",
      "browser-in-the-browser",
      "mfa-bypass",
      "espionage",
      "ai-policy",
      "credential-theft",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1637034199786-5942ff56b480${P}`,
    body: `**Proofpoint** has published research on **TA419**, a China-aligned espionage group it has tracked running targeted credential phishing since at least **April 2025** against think tanks, defence contractors, universities and law firms in the United States and Japan.

The campaigns it describes this year went after one community in particular: the people who shape **US AI policy**.

## Borrowed credibility

The group's method is to be someone the target would be pleased to hear from.

From **8 July 2026** it impersonated **Lynne Edwards Parker**, former Principal Deputy Director of the White House Office of Science and Technology Policy, and then **Heidi Crebo-Rediker**, an economist and foreign policy expert. Both were impersonated; neither had anything to do with the campaign.

In a separate campaign in **February**, the group posed as a senior employee of **Anthropic** and asked an AI policy analyst at a US think tank for feedback on the military's use of Anthropic's Claude models.

Read that last one as a piece of social engineering rather than as a detail. A policy analyst is asked, by someone from the company itself, for their view on the most contested question in their field. The message is not asking the target to do anything unusual. It is offering them exactly the thing their job consists of.

## The first message has nothing in it

The mechanical innovation is restraint.

The opening email carries no link and no attachment. It is a note asking for an opinion, and it survives every control that exists to catch a malicious link, because there is not one. Mail filtering sees correspondence.

Only after the target replies does the URL arrive, and by then it is arriving inside a conversation the target is already part of — one they chose to join, from a person they believe they know, on a subject they volunteered to discuss. Every instinct about unsolicited mail has been disarmed by the target's own participation.

This is the same patience the [China-nexus campaign Talos documented last week](/article/antino-uat-11587-the-backdoor-polls-outlook-every-ten-seconds-and-leaves-its-files-in-onedrive) showed in a different form, where the delivery was dressed as a native Gmail attachment. Spear-phishing against this class of target is no longer about the lure looking plausible. It is about the lure arriving after trust exists.

## A browser window that is a drawing

The link runs through a shortened URL, a multi-stage redirection chain and a Cloudflare Turnstile check — which looks like a bot test and functions as a filter against automated analysis — before landing on a fake loading screen for a familiar file-sharing service.

What appears next is a sign-in window. It has a title bar, an address bar, a padlock, and a URL that reads correctly.

The window is not a window at all. **Browser-in-the-Browser** is HTML drawn inside the page to look like a separate browser window, built here with a customised version of the open-source tool Frameless BitB. The address bar is a picture of an address bar. You cannot click into it, you cannot read the certificate, and dragging it outside the page is impossible because there is nothing to drag.

The advice everyone has been given for twenty years — check the URL before you type your password — is answered by the attack, because the URL being checked is part of the attack.

What the page collects is the password, the multifactor code and the session cookie, in real time. The cookie is the serious part: it is proof of a completed login, and replaying it needs no password and no second factor at all.

## Why MFA did not help

It is worth being precise, because the lesson gets mangled.

Nothing here broke multifactor authentication. The code was real, the user typed it, and the service accepted it. An adversary-in-the-middle page simply stands between the two and passes everything through, keeping what comes back.

The defence that does hold is the one that binds the credential to the site. A passkey or a hardware security key will not authenticate to a domain it was not registered for, so the relay has nothing to relay. That is a different control from an app that shows you a six-digit number, and the distinction is the whole thing.

## What to do

- Move the people who are targeted to phishing-resistant authentication. Passkeys or hardware keys for policy researchers, executives and anyone whose opinion is publicly valuable. Codes in an app do not survive this.
- Treat an unexpected request for your professional opinion as an approach, not a compliment. The flattery is the payload, and the link comes in the second message.
- Expect the conversation. Train people that a clean first email followed by a link is a pattern, not a reassurance.
- Alert on session cookie reuse from new locations. When the credential is replayed rather than re-entered, that anomaly is often the only signal left.

## What is not established

- Whether anyone was successfully compromised. Proofpoint does not identify victims or say whether accounts fell.
- Who TA419 works for. Proofpoint describes it as China-aligned and espionage-motivated, and names no sponsor.
- What the group did with any access it obtained.
- Whether the February campaign impersonating an Anthropic employee and the July ones are the same operators or a shared toolkit.`,
  },

  {
    slug: "exchange-cve-2026-96940-one-mailbox-credential-and-the-authorisation-check-gave-up",
    title:
      "One working mailbox password let an Exchange user read everyone else's mail, and the cloud was fixed before anyone was told",
    excerpt:
      "Microsoft published an out-of-band advisory for CVE-2026-96940, an authorisation flaw scored 8.8. An attacker needs valid credentials for any mailbox in the organisation; from there they can read other people's messages and attachments. Exchange Online was mitigated server-side. On-premises stays exposed until an administrator installs the update.",
    categorySlug: "security",
    tags: [
      "microsoft",
      "exchange-server",
      "cve-2026-96940",
      "authorisation",
      "privilege-escalation",
      "on-premises",
      "mailbox",
      "patch-management",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1649433391719-2e784576d044${P}`,
    body: `On **2 October 2026**, Microsoft published an out-of-band advisory for **CVE-2026-96940**, an elevation of privilege flaw in **Exchange Server** scored **8.8**.

The flaw is in Exchange's authorisation logic. A user who is already authenticated can, under certain conditions, reach other users' mailboxes and read their messages, including bodies and file attachments.

Microsoft found it internally and says it is not aware of active exploitation.

## The bar is one account

The requirement is valid credentials for **any mailbox in the organisation**. Not an administrator. Not a privileged service account. Any one.

In an organisation of a thousand people, that is a thousand chances for someone to reuse a password, fall for a phish, or leave a token in a repository. The attacker does not need to pick a target; they need any employee, and then they choose the target afterwards.

This is what makes an 8.8 that needs authentication worth more attention than the score suggests. Authentication as a prerequisite is a meaningful barrier when the credential has to belong to someone specific. When it can belong to anyone at all, it is closer to a formality — and the recent work on [credentials that stay live for years in public repositories](/article/truffle-543699-live-credentials-revocation-not-push-protection-is-what-kills-a-leaked-key) is a reminder of how large the pool of anyone is.

## What it is not

The limits matter and Microsoft states them.

There is no cross-tenant access, so this does not reach other organisations. There is no unauthenticated remote code execution. And the access is read-only: no writing, no deleting, no administrative control over the mailboxes reached.

Read-only sounds like the mild version. For a mailbox it is most of the harm. Mail is where contracts, credentials, legal advice, personal matters and password reset links live. An attacker who can read the chief executive's mail and nobody else's inbox has what they came for, and read-only access leaves far less evidence than anything that writes.

## Two populations, two experiences

The part of this advisory worth sitting with is the split in who had to do anything.

Microsoft applied a service-side mitigation to **Exchange Online**. Microsoft 365 customers had nothing to do, and for most of them the fix was already in place when the advisory appeared.

**On-premises Exchange** stays exposed until an administrator installs the cumulative update. Learning about it and fixing it are separate events, days or weeks apart depending on the change window.

Who is still on-premises is the uncomfortable part. Government bodies. Regulated industries. Defence suppliers. Organisations in jurisdictions with data residency rules, and organisations that made a deliberate decision not to put their mail in somebody else's infrastructure. The population carrying the exposure is disproportionately the one with the most sensitive mail, and that is structural rather than accidental — it is the same asymmetry every hybrid Exchange advisory produces.

Mail infrastructure has been the recurring target this month, from [the FortiMail flaw CISA gave agencies three days to fix](/article/fortimail-cve-2026-104286-a-null-byte-and-a-path-check-that-disagree) to the iCloud parsing bugs. The common thread is not a shared bug class. It is that mail is where the valuable text is.

## What to do

- Install the cumulative update on every on-premises Exchange server, including the one nobody has touched since the migration that was never finished.
- If you are hybrid, confirm which servers are actually yours to patch. Organisations part-way through a migration routinely keep a server for mail flow and stop counting it as a mail server.
- Look at mailbox access logs for the exposure window. The flaw is read-only, which means the only trace is an access pattern, not a change.
- Reduce the pool of anyone. This needs one working credential, so the controls that matter are the ordinary ones — phishing-resistant MFA, and getting rid of accounts that should not still work.

## What is not established

- Whether it has been exploited. Microsoft says it is not aware of any, which is not the same as none.
- The specific conditions under which the authorisation check fails, which Microsoft has not detailed.
- How long the flaw existed in Exchange Server.
- Whether Exchange Online was ever exploitable before the service-side mitigation went in.`,
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
