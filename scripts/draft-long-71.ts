/**
 * Drafts the 10 September news batch — what actually landed in the last 48
 * hours, checked against what the site already covered.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-71.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-71.ts --update
 *
 * Four stories survived the "is this new and is it uncovered" filter. Dropped:
 * the Anthropic evaluation-misconfiguration story (late July, six weeks stale),
 * plus Chrome V8, cPanel, F5, ShieldBreak, SAP, the 974-flaw Patch Tuesday and
 * N-central, all already published here.
 *
 *   1. LiteLLM. 9.6 percent of 3,074 internet-facing instances accept the
 *      master key from the project's own quickstart. The example became the
 *      credential, and a gateway holds every provider key behind it.
 *   2. BlueMoon. Four espionage clusters, one exploit kit, twelve days, and
 *      nobody can say how they all got it. One link in the chain has no CVE.
 *   3. Infostealer AI tokens. MFA guards the login; the token is issued after
 *      MFA succeeds, and the token is what was stolen.
 *   4. NSA/CISA/FBI advisory AA26-251A. Six named Chinese AI companies, and a
 *      recommended countermeasure that asks providers to subtly alter what
 *      suspected accounts get back rather than block them.
 *
 * Covers checked at full 1600x900 and reuse-checked; two candidates were
 * discarded as already in use.
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
    slug: "litellm-the-example-key-in-the-docs-is-the-production-secret",
    title: "The example key in the documentation is the production secret on one gateway in ten",
    excerpt:
      "Researchers scanned 3,074 internet-facing LiteLLM instances and found 9.6 percent accepted the master key printed in the project's own quickstart, or required no authentication at all. Nothing here is a vulnerability. It is a placeholder that nobody replaced.",
    categorySlug: "security",
    tags: ["litellm", "ai-gateway", "default-credentials", "api-keys", "shodan", "llmops", "exposure"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1607706189992-eae578626c86${P}`,
    body: `Researchers scanned internet-facing **LiteLLM** deployments and found that of **3,074** public instances, **9.6 percent** either accepted the default master key or required no authentication at all.

The default master key is **sk-1234**. It is not a secret anybody guessed. It is the value LiteLLM's own documentation uses as the example, in the quickstart, in the Docker Compose samples, and in configuration tutorials throughout the docs.

Roughly one exposed gateway in ten is running with the placeholder still in place.

## What a gateway is holding

The reason this matters more than an ordinary default-credential finding is what sits behind an LLM gateway.

A gateway exists to be the single place your organisation's model traffic passes through. To do that job, it holds the **provider credentials** — the keys for the model APIs your organisation pays for — so that individual applications do not have to. That is the entire value proposition, and it is also the entire problem.

With master-key access to a LiteLLM instance, an attacker can:

- **Mint unlimited API keys** on the instance
- **Read the stored provider credentials** for the upstream model APIs
- **Run inference billed to the victim**, at whatever volume they like
- **Read spend logs**, which describe what the organisation is doing and how much of it
- **Alter or delete model configurations**

So it is not one credential. It is the credential that dispenses credentials, plus a metered billing relationship with somebody else's account.

[We covered the poisoned LiteLLM releases in August](/article/litellm-poisoned-releases-cloudsek-2500-organisations), which reached the same asset by a much harder route. This one requires reading the documentation.

## It is not a vulnerability, and that is the point

There is no CVE to apply here, because nothing is broken. The software does exactly what it is configured to do. The documentation is not wrong either — it has to put *something* in the example, and a memorable placeholder is a reasonable choice for a quickstart whose purpose is to get you to a working instance in five minutes.

The failure is in the seam between those two correct things: a quickstart optimised for speed, and a deployment path where "it works" and "it is finished" look identical from the outside. Nothing in the system tells you the placeholder is still there. The gateway starts, serves traffic, and reports healthy.

This is a design problem with a known answer. Software that ships with a default credential can refuse to start until it is changed, or generate a random one on first run and print it once. Both are common practice. Neither is what happened.

## Somebody is already looking

This is not theoretical exposure. Honeypot telemetry collected between **February and June 2026** recorded roughly **3,900 requests** aimed at LiteLLM administrative APIs, from **73** distinct IP addresses.

That is a modest number in absolute terms and a significant one in shape: it means the class is being swept for, continuously, by more than a handful of parties, months before this research was published.

And the **9.6 percent** figure only describes what a search engine for exposed services can see. Instances behind a load balancer, on a non-standard port, or otherwise not indexed are not in the denominator or the numerator. The true count is unknown and is not smaller.

## What to do

- **Check your master key right now.** If it is sk-1234, you are in the 9.6 percent. This takes one command and no planning.
- **Do not expose the gateway to the internet at all** unless you have a specific reason. This is an internal service by function.
- **Rotate every provider credential the instance holds**, not just the master key, if it has ever been internet-facing with the default. You cannot tell from the outside whether anyone used it.
- **Read the spend logs before you rotate.** Unexplained inference volume is the cheapest evidence available that someone else was there.
- **Treat every AI gateway as a credential store**, because that is what it is, and apply whatever controls you apply to your secret manager.

## What is not established

- **How many of the 9.6 percent were actually compromised.** The scan measured what would answer, not what had been used.
- **The true exposed population.** 3,074 is what one index could see.
- **Whether the honeypot traffic and the exposed instances overlap** — the scanning and the telemetry are separate datasets.
- **Whether LiteLLM will change the default behaviour**, which is the only fix that closes the class rather than the instances.`,
  },
  {
    slug: "bluemoon-four-spy-groups-one-exploit-kit-twelve-days",
    title: "Four spy groups had the same exploit kit inside twelve days, and nobody can say how",
    excerpt:
      "Proofpoint disclosed BlueMoon on 9 September: a kit chaining a Chrome V8 flaw, a sandbox escape with no CVE at all, and a Windows ALPC bug. APT31 used it first on 28 August. Three more espionage clusters were running it within days. The chain is not the story. The distribution is.",
    categorySlug: "security",
    tags: ["bluemoon", "apt31", "proofpoint", "exploit-kit", "chrome", "v8", "shadowpad", "espionage"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1762330917439-78d1a00e3fe5${P}`,
    body: `**Proofpoint** disclosed a previously undocumented exploit kit called **BlueMoon** on **9 September 2026**. It chains three flaws to get from a visited web page to code running on a Windows machine:

- **CVE-2026-85046**, in Chrome's **V8** JavaScript engine
- A **V8 sandbox escape that carries no CVE at all**
- **CVE-2026-85880**, in the Windows **ALPC** subsystem

The delivery is phishing with request-for-quotation lures aimed at defence organisations, linking to attacker-controlled domains that spoof US aerospace companies. Those sites serve the kit, which ultimately loads the **ShadowPad** backdoor.

All of that is a competent, expensive, unremarkable espionage operation. The part that is not unremarkable is who was using it.

## Four groups, twelve days

First in-the-wild use is attributed to **APT31**, a China-aligned state-sponsored group, on **28 August 2026**.

Within days, three further espionage clusters were deploying the same kit — four in total between **28 August and 3 September**, the majority with a suspected China nexus.

Proofpoint's stated position on how that happened is the most interesting sentence in the research: **it is currently unknown how multiple distinct threat actors obtained access to the exploit kit.**

That is worth dwelling on, because it inverts the usual economics.

A working browser exploit chain is among the most expensive things in offensive security. It takes specialist labour, it is perishable — one patch and it is worthless — and its value depends on scarcity. The conventional behaviour is to hoard it: use it narrowly, against targets that justify burning it, and keep it away from anyone who might get caught and expose it.

Four separate groups running the same chain inside two weeks is the opposite of hoarding. It means either a **shared supplier** selling or distributing to multiple customers, a **common quartermaster** inside one apparatus servicing several units, or a **leak** that put the kit into more hands than intended.

Each of those has different implications, and nobody has established which one it is. But all three describe exploitation as a supply chain with a distribution layer, rather than as a craft practised in isolation by each group. The interesting artefact here is not the code. It is the fact that it travelled.

## One link has no CVE

The middle of the chain deserves separate attention: the **V8 sandbox escape has no CVE identifier**.

Practically, that means there is nothing to track it by. It will not appear in a vulnerability feed, it cannot be looked up, it will not show up in a scanner's output, and an organisation cannot ask "are we affected" in the normal way. The only handle anyone has on it is the kit's name.

It also means patching status is harder to reason about than usual. Two of the three links are identified and fixable. The third is a component of a chain that a vendor may or may not have addressed, described publicly only as part of somebody else's malware analysis.

## The Windows half is one we already wrote about

**CVE-2026-85880** — the ALPC elevation of privilege — is not new to readers here. It is one of the two zero-days already being exploited when Microsoft shipped its record September update. [We covered that Patch Tuesday, and specifically the point that the two flaws that mattered were both privilege escalation](/article/974-flaws-and-the-two-that-matter-are-both-privilege-escalation).

This is what "already being exploited" looked like in practice. The bug was in a kit, in the hands of at least four espionage groups, being fired at defence contractors, while the patch was still being written.

The general lesson is worth keeping: when a vendor marks something as exploited in the wild, that phrase is doing a lot of work. It rarely means one actor probing quietly. Increasingly it means a productised capability already in circulation.

## What to do

- **Patch Chrome and the September Windows update, in that order and immediately.** Two of the three links close.
- **Prioritise the ALPC fix specifically** if you are staging the Windows rollout. It is the privilege escalation the chain depends on.
- **Hunt for ShadowPad**, which is the payload and the most durable indicator here.
- **Look at request-for-quotation phishing against defence and aerospace suppliers.** The lure is specific and the spoofed domains impersonate real US aerospace firms.
- **Do not treat a patched browser as sufficient.** One link in this chain has no identifier and no confirmed fix.

## What is not established

- **How four groups obtained the same kit.** Proofpoint says it does not know, and speculation is not evidence.
- **Whether the V8 sandbox escape is patched.** It has no CVE and no published fix status.
- **Whether the four clusters are genuinely distinct actors** or overlapping units under one apparatus.
- **Victim count and success rate.** Neither has been published.
- **Whether BlueMoon is sold**, shared, or leaked, which is the question that determines how much more of this to expect.`,
  },
  {
    slug: "infostealer-ai-tokens-mfa-protects-the-login-not-the-session",
    title: "Multi-factor authentication guards the login, and the thing being stolen is issued afterwards",
    excerpt:
      "A 7GB infostealer dump from 5,871 machines across 162 countries held 44,791 unique JSON web tokens, 555 of them for AI services. A replayed token logs an attacker in without logging in — no password, no second factor. The MFA worked. It was never in the path.",
    categorySlug: "security",
    tags: ["infostealer", "session-tokens", "jwt", "mfa-bypass", "ai-accounts", "credential-theft", "telegram"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1762330462912-68614f3b9141${P}`,
    body: `An identity services provider analysed a **7GB** infostealer dump posted to a Telegram channel on **2 August 2026**. It came from **5,871** infected machines across **162** countries.

Inside were **44,791** unique JSON web tokens. **555** of them were authentication tokens for AI services — Anthropic, Character.ai, Cursor, Poe, Pika AI among them, alongside the expected Google, Microsoft, Amazon and Notion.

The tokens were unexpired. That is the whole finding.

## Why a token beats a password and a second factor at the same time

Authentication and authorisation are different steps, and almost all consumer security advice is about the first one.

When you log in, you prove who you are — password, then a second factor. Having satisfied the service, you are issued a **session token**. From then on, every request carries the token, and the service checks the token rather than re-running the login. That is not a shortcut or a weakness; it is how every web service works, because re-authenticating on every request is unusable.

The consequence is that the token is a bearer credential. It does not identify you. It proves that *somebody* completed a login at some point. Replay it from another machine and the service does what it is designed to do: it serves the session.

So the password does not help — it is not being used. The second factor does not help — it was consumed before the token existed. Multi-factor authentication is not bypassed in any meaningful sense. It ran, it succeeded, and it produced the artefact that was later stolen off the machine.

[This is the McKesson shape again](/article/mckesson-one-terabyte-four-days-and-nothing-in-the-chain-was-a-vulnerability): every control performed correctly, and the attacker simply held something they should not have held.

## Read the 555 carefully

Five hundred and fifty-five is worth stating precisely, because it will get inflated.

It is the count of **tokens in one dump** that appeared to relate to AI services — about **1.2 percent** of the JWTs in that dataset. It is not a count of compromised accounts, not a count of organisations, and not a measure of how many were successfully replayed. Nobody has published that.

What it does establish is direction. AI service tokens are now a category present in ordinary commodity stealer output, mixed in with the email and cloud tokens that have been there for years. The malware was not built to target AI accounts. It swept a machine, and this is what was on the machine.

The market has noticed faster than defenders have. Black market listings now sell bundles of stolen tokens alongside anti-detect browsers — tooling whose entire purpose is to make a replayed session look like it is coming from the original device. Access to Claude, Cursor, ChatGPT and Gemini accounts is offered at a discount to the legitimate subscription price.

## Why AI accounts are worth stealing

Two reasons, and the second is the one organisations underestimate.

The obvious one is **compute**. A hijacked account is metered inference somebody else pays for, which is directly resellable — hence the discount listings.

The less obvious one is **history**. An AI account is a searchable record of what its owner has been working on: pasted source code, internal documents, draft strategy, customer data, debugging sessions containing production credentials. For anybody doing reconnaissance against an organisation, a senior engineer's conversation history is a richer target than their inbox, and far less likely to be monitored.

## What to do

- **Shorten session lifetimes and bind tokens to a device or client** where the platform supports it. This is the only control that acts on the actual attack.
- **Make sign-out actually revoke server-side.** A token invalidated only in the browser is still valid in a stealer log.
- **Treat any infostealer detection as a session compromise, not a password compromise.** Forcing a password reset while leaving live sessions intact fixes nothing.
- **Add AI platforms to the account inventory you monitor.** Most organisations have session monitoring for email and cloud and none for the tools their engineers now paste code into.
- **Assume conversation history is exposed** if an account is compromised, and treat what was in it as disclosed.

## What is not established

- **How many of the 555 were actually replayed.** No figure published.
- **Which organisations were affected.** The dump is machine-level, not employer-level.
- **Whether any provider has revoked them.** No provider statement at time of writing.
- **How representative one 7GB dump is** of stealer output generally.
- **Attribution.** A Telegram dump has no author for these purposes.`,
  },
  {
    slug: "distillation-advisory-six-companies-and-a-defence-that-alters-the-answers",
    title: "Three agencies named six companies, and the defence they recommend is to change the answers",
    excerpt:
      "NSA, CISA and the FBI accuse six Chinese AI firms of extracting billions of tokens from Claude, GPT, Gemini and Grok since late 2024. No system was breached — the models were queried through the front door. The recommended countermeasure is to subtly alter what suspected accounts get back.",
    categorySlug: "world",
    tags: ["nsa", "cisa", "fbi", "distillation", "deepseek", "alibaba", "ai-policy", "china"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1535356795203-50b2eb73f96c${P}`,
    body: `The **NSA**, **CISA** and the **FBI** issued a joint cybersecurity advisory, **AA26-251A**, accusing six China-based AI companies of running industrial-scale distillation campaigns against American frontier models.

The six named: **DeepSeek**, **Moonshot AI**, **Alibaba**, **MiniMax**, **StepFun** and **Z.AI**.

The scale, in the agencies' words: **"extracted billions of tokens across millions of exchanges"**, from late 2024 through mid-2026, likely with Chinese government awareness. The targets included variants of **Claude**, **GPT**, **Gemini** and **Grok**, with the advisory describing extraction feeding the training of DeepSeek's R1 and V3.

## Distillation is not hacking, and that is the difficulty

It is worth being clear about what is being alleged, because the word "advisory" from three security agencies primes you to expect an intrusion, and there was not one.

Distillation means querying a capable model at volume and training a smaller one on its outputs — using the teacher's answers as the student's training data. It requires no access to weights, no breach, no vulnerability. It requires an API key and a budget.

So the conduct described is: paying customers used a product as sold, in enormous quantity. The evasion described is about **identity**, not access — requests routed through cloud providers, VPNs, third-party aggregators that obfuscate user metadata, and automated agents to bypass geographic restrictions. That is a terms-of-service problem wearing a national security jacket.

Which is precisely why it is hard. There is no patch. There is no indicator to block. The activity is indistinguishable, request by request, from a large legitimate customer.

[The site covered DeepSeek's own agent runtime this week](/article/deepseek-harness-the-fence-was-a-request-header-and-the-agent-walked-through-it), where the security failure was a genuine engineering one. This is the opposite category: nothing failed.

## The recommended countermeasure is the remarkable part

The advisory tells US AI companies to **"implement comprehensive detection and mitigation measures, subtly alter responses for suspected malicious distillation attempts, and correlate activity across model providers."**

Read the middle clause again. The recommendation is not to block suspected accounts. It is to keep serving them, and to quietly change what they get.

The logic is sound on its own terms. Blocking teaches the adversary your detection threshold: they lose the account, adjust, and come back through a different aggregator. Degrading does not. If the extracted outputs are subtly wrong, the student model trains on corrupted data, and the damage compounds silently through a training run rather than being caught at the door. Poisoning the well is a more durable defence than locking it.

It is still a striking thing for three government agencies to recommend to private companies: deliberately serve a paying customer a worse product without telling them.

The problems arrive immediately after the principle:

- **False positives are invisible to the victim.** A legitimate high-volume customer flagged in error receives quietly degraded output and has no way to know. They will experience it as the model getting worse.
- **It cannot be disclosed without defeating itself.** Any published threshold or method is a specification for evading it.
- **Contracts and consumer law** generally assume a provider serves what it advertises.
- **"Correlate activity across model providers"** asks competitors to share customer behaviour data with one another, which has its own set of regulators.

None of that makes the advice wrong. It does mean the countermeasure is being recommended in a space with no established norms, and the people most likely to encounter it first are ordinary heavy users.

## What this says about where model value sits

The strategic reading is short. If capability can be extracted through the API at a cost far below the cost of building it, then a frontier model's advantage is not the weights. It is the lead time before the outputs have been harvested.

That reframes the whole competitive picture. Guarding the weights is well understood and largely solved. Guarding the *behaviour* of a model that is exposed to the public by design is not, and may not be solvable — you cannot sell answers and also keep them.

## What to do

- **If you are a high-volume API customer, expect scrutiny.** Predictable, attributable, contractually clear usage is now worth having.
- **If output quality drops without explanation**, ask your provider directly. That is a reasonable question to put in writing.
- **If you build on these APIs, log and version model outputs** so you can evidence a change rather than argue about a feeling.
- **Do not read the advisory as an intrusion warning.** There is nothing to patch and no indicator to block.

## What is not established

- **Evidence.** The agencies assert scale and intent; the underlying telemetry is not public.
- **Whether any provider has implemented response alteration**, or would confirm it.
- **Company responses.** None of the six had publicly responded at time of writing.
- **What "likely with Chinese government awareness" rests on**, which is doing significant work in the advisory.
- **Whether distillation at this scale is unlawful** anywhere, as opposed to a terms-of-service breach.`,
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
