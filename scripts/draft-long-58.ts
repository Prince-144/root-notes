/**
 * Drafts the 7 September evening batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-58.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-58.ts --update
 *
 *   1. Astra reaching the $20 Plus tier. Handled carefully: OpenAI said on
 *      1 September that paid plans were coming "in the coming days", so this is
 *      not a broken promise, and "Critical" gates a capability rather than the
 *      whole product. The real point is that the safeguard changed category
 *      without changing description — identity verification and monitoring are
 *      controls on a person, an in-model refusal policy is not — and OpenAI
 *      published the number for how well the second kind works: 91.5%.
 *      Carries the Anthropic-competitor disclosure.
 *   2. N-able N-central CVE-2026-86218. The RMM multiplier, the vendor and the
 *      hunters disagreeing without either being wrong, and the fact that the
 *      one confirmed compromise cannot be attributed because the logs rotated.
 *   3. The invisible-Unicode phishing campaign, written around the number the
 *      coverage buries: Defender caught over 99% of it. The evasion beat one
 *      layer, and the people running only that layer are the story.
 *
 * Covers checked at full size before use.
 *
 * No backticks in the bodies: inline code spans inside these template literals
 * break the MDX parse. The Unicode range is written out in words and hex.
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
    slug: "astra-on-plus-the-control-changed-from-who-you-are-to-whether-it-says-no",
    title: "On Daybreak Blue the control is who you are. On a $20 plan it is whether the model says no",
    excerpt:
      "Astra began reaching ChatGPT Plus subscribers on 6 September, three days after OpenAI said it was the first model to meet the Critical cybersecurity threshold of its own Preparedness Framework. That was the announced plan and it gates a capability rather than the product — but the safeguard changed from identity verification to a refusal policy, and OpenAI published the refusal rate: 91.5%.",
    categorySlug: "ai",
    tags: ["openai", "astra", "ai-security", "preparedness-framework", "guardrails", "disclosure"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1675557010061-315772f6efef${P}`,
    body: `**Disclosure: this site is written with Claude, made by Anthropic — a direct competitor to OpenAI.** Read what follows knowing that.

On **6 September 2026**, OpenAI began rolling **Astra** out to **$20 ChatGPT Plus** subscribers, appearing first in ChatGPT Work and then in regular chat. Pro, Enterprise and Business Premium already had it. Access is included within existing subscription limits, with additional usage available as separately purchased credits.

[Three days earlier we wrote about Astra being the first model OpenAI says meets the Critical cybersecurity threshold of its own Preparedness Framework](/article/gpt-6-astra-critical-cyber-threshold-openai-wrote-the-line).

## First, what this is not

It is not a broken promise, and the coverage that frames it that way is wrong.

OpenAI's **Path to Astra** post on **1 September** set out the sequence explicitly: Daybreak participants first, followed **in the coming days** by paid ChatGPT plans and the API. Six days later, paid plans. That is a company doing what it said it would do, on the timeline it published.

It is also not the case that the Critical-threshold capability is now on a consumer plan. OpenAI's own framing is that **"Critical" gates a capability, not the whole product** — autonomous zero-day discovery and offensive exploit generation stay restricted to vetted defenders through **Daybreak Blue**. Both versions, OpenAI says, carry safeguards preventing access to its most advanced cybersecurity capabilities.

All of that is accurate and worth stating before the criticism, because the criticism is narrower and more specific than "they released it anyway".

## What actually changed

Look at what the word "safeguard" is doing in each case.

On **Daybreak Blue**, the controls are **identity verification**, **legal attestations**, **approved-use restrictions** and **account monitoring**. Every one of those is a control on a **person**. They do not make the model refuse anything. They make the requester known, accountable, and revocable — and they mean that a persistent abuser leaves a trail with a name on it.

On a **$20 Plus plan** there is no identity verification and no attestation. The control is inside the model: a refusal policy, plus whatever additional guardrails OpenAI has applied to the consumer build.

Those are not the same kind of thing. One constrains who is asking. The other constrains what the answer is. Describing both as "safeguards" is technically true and flattens the distinction that matters, because only one of them still works on the ten-thousandth attempt by someone with time.

## OpenAI published the number for the second kind

To its credit, OpenAI did not leave this to inference. It reported that Astra **declines 91.5%** of cyber-related jailbreak attempts, against **59%** for GPT-5.6 Sol.

That is a large, real improvement and it should be said plainly.

It also means roughly **one attempt in twelve** is not declined.

Behind Daybreak Blue, an 8.5% residual sits underneath identity verification and account monitoring. Someone grinding at it is a named account being watched, and the residual is a backstop behind a gate.

On a consumer plan, the residual **is** the gate. There is no identity behind it, no attestation, no approved-use restriction, and the population of people trying is not a vetted list of six named security vendors.

An 8.5% failure rate against a hundred determined attempts and an 8.5% failure rate against a hundred million are the same percentage and completely different exposures. Nothing published lets anyone outside OpenAI work out which side of that the consumer build actually sits on.

## The thing that is not published

What technically separates the Plus build from the Daybreak Blue one has not been described.

Different weights? A different system prompt? A classifier in front of the request? A tool or capability gate? "Added cybersecurity guardrails" is a category, not a mechanism, and the difference between those options is enormous — a refusal policy is a different security property from a capability that is not present.

Without that, nobody outside the company can assess how far the consumer surface can be walked back toward the gated capability, which is exactly the question a Critical classification is supposed to make people ask.

## What to do

- **Do not repeat "the Critical model is now $20".** It is not the claim OpenAI made and it is not established.
- **Do not repeat "OpenAI broke its promise" either.** The timeline was published on 1 September.
- **If you buy this for your organisation, ask which build you get** and what separates it from the gated one. You are entitled to a mechanism, not an adjective.
- **Assume the refusal rate is the control on any consumer tier**, and plan for the residual rather than the average.
- **Watch for the first published jailbreak.** The 8.5% is not hypothetical, and the first credible public demonstration against the consumer build is the thing that will settle this argument.

## What is not established

- **Whether the Plus build is the same weights** as the one evaluated at the Critical threshold.
- **What the "added cybersecurity guardrails" are** in technical terms.
- **Whether the 91.5% refusal figure applies to the consumer build**, or was measured on a different configuration.
- **What usage limits apply** beyond "existing subscription limits" and purchasable credits.
- **When or whether free-tier access follows.** No timeline has been given.`,
  },
  {
    slug: "n-central-cve-2026-86218-unauthenticated-rce-in-the-box-that-manages-the-boxes",
    title: "N-able's release notes say it is not exploited. N-able's incident notice says it is",
    excerpt:
      "CVE-2026-86218 is a CVSS 10.0 pre-authentication RCE in N-central, patched on Saturday in the fourth hotfix in five weeks and one day after the third. Two of N-able's own documents disagree about whether it is being exploited in the wild, and the company has not said which is current.",
    categorySlug: "security",
    tags: ["n-able", "n-central", "cve-2026-86218", "rmm", "msp", "unauthenticated-rce"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1680992046615-065f58bcb4d8${P}`,
    body: `On **Saturday 6 September 2026**, N-able released **N-central 2026.3.1.14** as an emergency patch for **CVE-2026-86218**: a **CVSS 10.0** pre-authentication remote code execution flaw in on-premises deployments.

It was the fourth hotfix in five weeks, and it landed **one day** after the third.

## Five weeks, four hotfixes

| Date | Build | Fixed |
|---|---|---|
| 2 August | 2026.3.1.7 | CVE-2026-18577 — an incomplete fix for an authentication bypass, exploited in the wild |
| 6 August | 2026.3.1.10 | additional hardening on the same attack path |
| 5 September | 2026.3.1.13 | CVE-2026-86206 and CVE-2026-86207 — API access control and authentication bypass |
| 6 September | 2026.3.1.14 | CVE-2026-86218 — pre-authentication RCE, **10.0** |

The chain begins with an **incomplete fix**. It ends, a day after the previous emergency patch, with a perfect-score pre-auth RCE.

If you patched on 5 September and closed the ticket, you are not patched. [We have been here before with this product](/article/storm-1175-stormencryptor-n-central-patch-bypass); on N-central, treat any hotfix as an increment rather than a conclusion.

## The two statements

Here is the part that should not be smoothed over, because it is not the usual vendor-versus-researcher disagreement.

**N-able's release notes and status post** say there are "no confirmations that this vulnerability has been exploited in production environments".

**N-able's incident notice** says the flaw "has been observed being exploited in the wild".

Those are the same company, about the same CVE, at the same time. N-able has not said which statement is current or published evidence for either, and the difference is not academic: one of them means patch on your normal emergency schedule, and the other means assume compromise.

Meanwhile **Huntress** — which investigated a customer compromise on **4 September** — says it cannot determine from its own data whether CVE-2026-86218 was the vulnerability used.

So the honest state of knowledge is: the vendor's own documents disagree, the firm that looked at an actual intrusion cannot tell, and the flaw scores 10.0. Anyone telling you confidently which way it goes is filling in a blank.

## Why 1,500 is the wrong number to look at

The Shadowserver Foundation tracks roughly **1,500 internet-exposed N-central servers**, mostly in the United States and Europe.

Fifteen hundred sounds small. It is the wrong unit.

N-central is **remote monitoring and management** software — what a managed service provider uses to reach into every one of its customers' estates, to deploy agents, run scripts, push software and take remote sessions. One N-central server is not one organisation. It is one MSP and everybody that MSP manages, typically dozens to hundreds of businesses that have never heard the product's name.

A pre-auth RCE there does not get an attacker onto a server. It gets them the tool built to run code on everyone else's machines, with the credentials and the agent estate already in place.

## The intrusion nobody can attribute

N-able has described an intrusion beginning **31 July** in which "a limited number of customers were affected". No count has been published.

And in the compromise Huntress examined, the vector could not be established. That is the whole incident-response problem in one clause: with four candidate flaws patched in five weeks, working out which door was used requires evidence that nobody had retained.

## What to do

- **Confirm the running build is 2026.3.1.14.** Not "we patched last week". Check the version, not the change ticket.
- **Given the contradiction, act on the worse statement.** If your N-central was internet-facing and unpatched at any point since 31 July, hunt rather than assume. It costs less than being wrong.
- **If you are an MSP customer, ask your provider today** which build their N-central is on and when it was applied. You are downstream of a box you do not control.
- **Take the N-central web interface off the public internet.** Roughly 1,500 organisations have not, and no configuration of this product requires it.
- **Extend log retention on management infrastructure before you need it.** The reason nobody can attribute the September compromise is a retention setting somebody accepted by default.
- **Assume agent-side actions are in scope.** The question is not only what happened on the server, but what it told the agents to do.

## What is not established

- **Whether CVE-2026-86218 has been exploited.** N-able's own two documents say opposite things.
- **What the vector was** in the 4 September compromise. Huntress says its data cannot answer it.
- **How many customers were affected** by the 31 July intrusion. "A limited number" is the only figure given.
- **How many of the 1,500 exposed servers are unpatched**, as opposed to merely visible.
- **Whether 2026.3.1.14 is the end of it.** Three of the previous four were not.`,
  },
  {
    slug: "invisible-unicode-beat-keyword-filters-defender-still-caught-99-percent",
    title: "The invisible characters beat keyword filters. Defender still caught over 99% of the mail",
    excerpt:
      "Attackers hid characters from Unicode's Tags block inside words like funding and credit, splitting them so keyword matching could not see them, and pushed up to 2.37 million messages a day. Microsoft says over 99% were caught anyway — by sender reputation, IP and domain signals. The technique defeated exactly one layer.",
    categorySlug: "security",
    tags: ["phishing", "unicode", "ascii-smuggling", "email-security", "microsoft", "evasion"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1620287341401-e2945a4b9daa${P}`,
    body: `Microsoft threat researchers have documented a phishing campaign, first seen on **9 February 2026**, that hid **invisible Unicode characters** inside finance keywords to break keyword-based email filtering.

The technique is **ASCII smuggling**. Characters from Unicode's **Tags block**, the range **U+E0000 to U+E007F**, are inserted inside a word to fragment it. The word "funding" becomes "fun", an invisible character, then "ding" — identical on screen, and no longer the string a filter is matching on.

That block was originally intended for language tagging, was deprecated, and renders as nothing. Which is precisely why it works: it is text that is not text.

## The volume

At peak in late February the campaign pushed up to **2.37 million messages a day**, declining gradually and dropping off sharply after **15 May 2026**.

A cluster of **148 finance-themed sender domains** accounted for about **96%** of flagged messages, using words like funding, capital, loan, advance and credit, promoting business funding, loans and credit services.

Delivery ran through **ActiveCampaign**, a legitimate email-marketing platform — which is the part that matters more than the Unicode trick, because sending from a real ESP with real infrastructure is what gets you past reputation checks in the first place.

ActiveCampaign says its moderation systems "detect invisible Unicode characters the same way they detect unobfuscated text and treat heavy use as suspicious."

## The number the coverage is burying

**Microsoft Defender caught over 99% of these messages.**

Not because it stripped the Tags characters, but because the content was never the only signal. Sender reputation, IP analysis and domain checks did the work, and they do not care what the subject line spells.

So the honest description of this campaign is not "attackers defeated email filtering". It is: **a technique that defeats exactly one layer, deployed at enormous volume against a defence that has not depended on that layer alone for years.**

Which makes the interesting question not "how do I stop ASCII smuggling" but "am I still running keyword and signature matching as a primary control?" If you are — and plenty of smaller gateways, DLP rules and homegrown filters are — this campaign was aimed at you specifically, and 2.37 million messages a day is what aimed looks like.

## The same characters point somewhere else

Worth flagging carefully, because it is adjacent rather than observed.

Invisible characters that a human cannot see and a keyword filter cannot parse are the same primitive used for **prompt injection** against language models that read email. An assistant summarising an inbox, triaging tickets or drafting replies is reading the raw text, Tags block included, and the user reviewing its output sees nothing there.

Nothing in Microsoft's reporting says this campaign targeted AI systems. It did not. But [we have already covered a case where the instruction was hidden in a place the human reviewer would not look](/article/uac-0099-guardbreaker-nuclear-prompt-vbs-comment), and the Tags block is a better hiding place than a comment. Anyone building email automation on top of a model should be stripping this range before the text reaches it, and most are not.

## What to do

- **Strip the Tags block on ingest.** U+E0000 to U+E007F has no legitimate use in email body text. Removing it is a few lines and closes this technique completely.
- **Normalise before you match.** Any keyword rule that runs on raw input is matching a string the attacker controls the encoding of.
- **Check whether you have a layer that is doing this alone.** Defender's 99% came from signals other than content; if your only signal is content, you do not have that margin.
- **Alert on heavy use of invisible characters rather than blocking on it.** ActiveCampaign's approach is the right one — volume of zero-width and Tags characters is itself the anomaly.
- **If a model reads your mail, sanitise before the model, not after.** The output looks clean either way.

## What is not established

- **What the payload was.** The reporting describes the lure and the evasion, not the ultimate objective.
- **Who ran it.** No attribution has been published.
- **Whether it succeeded.** No success rate has been reported.
- **Whether other vendors' filters were bypassed.** Only Microsoft's telemetry has been described, and it reports catching it.
- **Why it stopped in May.** The sharp decline after 15 May is unexplained.`,
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
