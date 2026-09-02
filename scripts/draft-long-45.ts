/**
 * Drafts three pieces from 1-2 September news.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-45.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-45.ts --update
 *
 * KEV figures below were read from the CISA feed directly, not from
 * secondary reporting. Catalogue state: 1,687 entries, 1 September 2026.
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
    slug: "metr-attacker-asked-the-agent-for-its-api-key",
    title:
      "The attacker asked METR's agent for its API key, and the agent handed it over",
    excerpt:
      "A research non-profit that evaluates frontier models for dangerous capability lost an API key because an authentication check failed open, and the exfiltration method was prompting the agent to reveal it. Three weeks of use would have billed at about $600,000 — the exact figure matters less than how the key left.",
    categorySlug: "ai",
    tags: ["metr", "ai-security", "agents", "credentials", "api-keys", "fail-open"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1710678832243-cbfb55a0b806${P}`,
    body: `**METR** — Model Evaluation and Threat Research — is the non-profit that evaluates frontier AI models for their ability to carry out long, agentic tasks. It has now published an account of two security incidents of its own.

The first one is worth reading closely, because the way the credential left is new.

## The attacker prompted the agent

In **March 2026**, a METR researcher was running agents on a **personal EC2 instance**, which was supposed to sit behind Google authentication. The application had a **fail-open** flaw that **silently disabled authentication**, and the agent orchestration dashboard sat publicly accessible for several days.

Then, per METR's account, the attacker **prompted an agent to reveal its API key**.

Not a config file. Not a repository. Not an environment variable read off a compromised host. They asked the thing holding the credential, and it told them, because answering questions is what it does.

This is the part that generalises. Every agent framework puts credentials somewhere the agent can reach — that is how the agent calls anything. An agent's context is therefore a credential store with a natural-language interface and no access control worth the name, and any path that lets an unauthenticated party talk to the agent is a path to whatever the agent holds. We have written about [a refusal being the thing an attacker wanted](/article/claude-code-prompt-injection-refusal-became-the-exploit); this is the inverse and simpler problem — compliance is the thing an attacker wanted.

The attacker also added an **SSH key** for persistent access, which is the ordinary half of the story.

## How they found it

METR suspects the instance was discovered by **looking through recently-registered websites** — certificate transparency lists are named — **for high-signal keywords relating to LLMs or agents**.

Certificate transparency is a defensive mechanism. Every TLS certificate issued is logged publicly so that misissuance can be caught. It is also, read the other way, a real-time feed of newly-created internet-facing things, searchable by name.

If you stand up something at an obviously AI-flavoured hostname, you are announcing it. The window between a certificate being issued and the service being hardened is a window somebody is watching.

## About the $600,000

METR says the consumed credits would have been **"approximately $600,000 in bills had it not been provided to the non-profit for free by the model provider"**, over roughly **three weeks**. The provider is not named.

So: no money changed hands. The figure is a list price for donated credits, and headlines that render it as "$600,000 stolen" will be wrong. METR was careful about this and the carefulness deserves to survive the retelling.

What the number does tell you is scale — three weeks of unmetered frontier-model inference is a lot of compute, and the account was for **publicly available models**, not anything privileged.

Nothing sensitive was reached. METR's words: **no sensitive information is believed to have been accessed**, and no evaluation data or research results were taken.

## The second incident is the near-miss

In **May 2026**, METR's infrastructure was systematically probed, and an **inadvertently exposed read-only SQL query mechanism** in its public transcript viewer could have given access to unpublished evaluation data. The database, meant to hold only non-sensitive models, had **accidentally included** sensitive model data.

An **independent security researcher** found and reported it. METR found **no indication that the probing party discovered the exploit or accessed any non-public data**.

Publishing the one that did not happen, alongside the one that did, is the part of this disclosure that should be normal and is not.

## Why it matters that it was METR

Say this without smugness, because the smug version is wrong.

METR's job is measuring whether frontier models can do dangerous things autonomously. If any organisation should have an intuition for what an agent with credentials can be talked into, it is this one. It still had an auth check fail open on a researcher's instance for several days.

That is not an argument that METR is careless. It is an argument that the failure mode is genuinely hard: the instance was personal, the authentication was thought to be in place, and the failure was silent. Every one of those three conditions exists in most research organisations right now.

## What to do

- **Assume anything in an agent's context can be read out of it.** Scope credentials to the narrowest thing the agent needs and give them short lives, because the agent will disclose them if asked nicely.
- **Test that authentication fails closed.** A silent auth bypass looks exactly like a working system. Deliberately break the identity provider in staging and confirm the app refuses rather than proceeds.
- **Set spend alerts.** METR added them "where possible" after the fact — an admission worth noting, because for donated or credited accounts the billing signal that would have caught this in a day may not exist.
- **Watch your own certificate transparency footprint.** If a hostname announces what it is before it is hardened, either harden first or do not name it that.
- **Treat researcher-run personal infrastructure as production.** It held a production key.

## What is not established

- **Who did this.** No attribution is offered.
- **Which provider.** METR does not name the model provider, and the credit arrangement is not described in detail.
- **Whether the two incidents are connected.** March and May are described separately and nothing links them.
- **What the compute was used for.** Three weeks of frontier inference bought something; nothing published says what.
- **Whether the fail-open flaw was in METR's own code or a dependency.** The account describes the behaviour, not the source.`,
  },
  {
    slug: "sonicwall-sma1000-second-ssrf-plus-injection-pair-in-seven-weeks",
    title:
      "SonicWall shipped another SMA1000 SSRF and another command injection. CISA gave the last pair a three-day deadline in July",
    excerpt:
      "CVE-2026-83548 is a pre-auth SSRF with a CVSS of 10.0; CVE-2026-83549 is post-auth command execution as administrator. That is the same two bug classes, in the same auth positions, on the same appliance that CISA added to KEV seven weeks ago — and both rounds are being exploited.",
    categorySlug: "security",
    tags: ["sonicwall", "sma1000", "ssrf", "command-injection", "kev", "vpn"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1762438442169-4826260f0ca4${P}`,
    body: `SonicWall published an advisory on **2 September 2026** for two flaws in the **SMA 1000** remote access appliance, and says it investigated a case indicating active exploitation.

**CVE-2026-83548** — CVSS **10.0** — is a **pre-authentication server-side request forgery** in the Appliance Work Place interface, giving access to sensitive functionality with no credentials.

**CVE-2026-83549** — CVSS **7.8** — is a **post-authentication OS command injection** in the Appliance Management Console, allowing an authenticated administrator to run arbitrary commands.

Affected models are the **6210**, **7210** and **8200v**. Vulnerable builds are **12.4.3-03453** and earlier and **12.5.0-02835** and earlier; the fixes are **12.4.3-03526** and **12.5.0-02952**.

## Seven weeks ago, the same two classes

This is the part that is not in the coverage, and it comes straight from the CISA catalogue rather than from anyone's summary.

On **14 July 2026**, CISA added two SMA1000 flaws to the Known Exploited Vulnerabilities catalogue on the same day:

- **CVE-2026-15409** — "SonicWall SMA1000 Appliances contain a **server-side request forgery** vulnerability that could allow a remote **unauthenticated** attacker to potentially cause the appliance to make requests to unintended location."
- **CVE-2026-15410** — "SonicWall SMA1000 Appliances contain a **code injection** vulnerability which in specific conditions could potentially enable a remote **authenticated attacker as administrator** to execute arbitrary OS commands."

Read those against the two new ones. Same appliance. Same two vulnerability classes. Same authentication positions — unauthenticated SSRF, administrator-level command execution. Seven weeks apart. Both rounds exploited.

Be careful about what that does and does not prove. Nothing published says the September flaws are variants of the July ones, or that the July fix was incomplete, and we are not asserting either. But "the same two bug classes reappeared in the same product in seven weeks" is a fact, and the question it raises — regression, variant, or the same code paths producing the same defects — is the one an operator should be asking their vendor.

The July pair also tells you how CISA read it. Added **14 July**, remediation due **17 July**: a **three-day** deadline. That is the treatment reserved for things being actively used against federal networks.

SonicWall now has **17** entries in the KEV catalogue.

## Neither new CVE is in KEV yet

We checked the feed directly — **1,687** entries as of **1 September 2026**. Neither **CVE-2026-83548** nor **CVE-2026-83549** appears.

That is not reassurance. KEV addition lags observed exploitation, and the vendor has already said exploitation is happening. If your prioritisation is driven by KEV, this is precisely the window in which it will be behind.

## The chain is suggested, not confirmed

SonicWall's language points at the two being used together, and the shape is obvious enough: a pre-auth SSRF that can reach the management console, then command injection at that console.

But the specific sequence is **not confirmed** in the disclosure. Neither is the number of exposed devices, the attacker's identity, or what they do after landing. Anyone writing "attackers are chaining these" is filling in a gap the vendor left.

A CVSS 10.0 on an SSRF is itself a hint, though. SSRF alone does not usually score that. A 10.0 means the scope changed — the flaw lets an attacker reach something beyond the component that contains it, which is the definition of a useful first link.

## What to do

- **Patch to 12.4.3-03526 or 12.5.0-02952.** Treat it as an emergency; the vendor says exploitation is happening.
- **Do not wait for KEV.** It is not there yet and the exploitation is not hypothetical.
- **Check the management console's exposure.** The second flaw needs administrator authentication; the first is a way to reach things you did not intend to expose. Reducing what the console can be reached from breaks the useful half of the pairing.
- **Assume compromise if you were behind on the July pair too.** Those had a three-day federal deadline and the same appliance.
- **Ask SonicWall the regression question.** Whether these are new code paths or old ones is information you are entitled to before the next round.

## What is not established

- **Whether the two September flaws are actually chained** in the observed exploitation.
- **Whether they relate to the July pair** in any way beyond sharing a product and two vulnerability classes.
- **How many appliances are exposed.** Not disclosed.
- **Who is exploiting them.** No attribution offered.
- **What happens post-exploitation.** The advisory does not say.`,
  },
  {
    slug: "jfrog-artifactory-phantom-join-key-admin-tokens-three-days",
    title:
      "Artifactory instances without a join key were given a phantom one. Attackers were minting admin tokens three days after the fix",
    excerpt:
      "CVE-2026-82329 lets an unauthenticated attacker forge credentials and mint administrator tokens against JFrog Artifactory, and the vulnerable state is the default one. The patch landed on 28 August; watchTowr saw exploitation from 1 September, including actors creating backdoor users.",
    categorySlug: "security",
    tags: ["jfrog", "artifactory", "supply-chain", "watchtowr", "authentication", "cve"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1714650601435-67a4d51a0798${P}`,
    body: `**CVE-2026-82329** is an authentication bypass in **JFrog Artifactory**'s Access component, CVSS **9.8**. Instances configured **without an additional join key** are issued a **"phantom" join key** — and that phantom is enough for an unauthenticated attacker to forge credentials and mint **administrator-level tokens**.

The vulnerable configuration is the one you get by not doing anything.

## Three days

JFrog patched it in **7.161.20**, released **28 August 2026**. **watchTowr** observed exploitation from **1 September**.

Three days between a public fix and someone using it. That is the working assumption now for anything with a 9.8 attached to widely-deployed infrastructure, and it is short enough that "we patch monthly" is not a policy, it is an outcome.

The vulnerable ranges are long, which is the other half of the problem — **7.161.0** to **7.161.19**, **7.146.0** to **7.146.36**, **7.133.0** to **7.133.28**, **7.125.0** to **7.125.19**, **7.117.0** to **7.117.27**, and **7.111.4** to **7.111.21**. Six maintained branches means six populations of operators who each have to notice.

## What the attackers actually did

**Yordan Ganchev** and colleagues at **watchTowr** describe exploitation that is limited rather than mass: a small number of IP addresses from varied geographies, and no broad scanning detected yet.

The behaviour ranges from **CVE verification only** — someone checking whether a target is vulnerable and stopping — through to enumeration of **users, groups, credential sets and federated access topologies**.

And some actors **created backdoor users**.

That last one is the sentence that changes your remediation plan. A backdoor account created before you patched is still a valid account after you patch. Same shape as [the Switchvox flaw, where the stolen cookie signing key survives the update](/article/switchvox-cve-2026-9586-patch-does-not-rotate-the-signing-key): patching closes the door and does nothing about who is already inside.

**Audit your Artifactory accounts, tokens and access-token issuance since late August.** That is the actual work here.

## Why an artifact repository is the wrong thing to lose

Artifactory is a central distribution point for builds. An administrator token there is not a foothold on one server; it is write access to what everything downstream consumes.

Per the analysis, successful exploitation lets an attacker tamper with build pipelines, move laterally into production, and potentially push malicious changes downstream to customers.

The enumeration behaviour fits that reading. **Federated access topologies** is not what you enumerate if you want a cryptominer. It is what you enumerate if you are mapping which other systems trust this one.

## Two Artifactory criticals in two days

Checking the KEV feed directly puts this in context. **CVE-2026-66384** — an Artifactory path traversal allowing an authenticated user to write outside the intended Docker cache path — was added to KEV on **27 August 2026**, with a remediation deadline of **10 September**.

CVE-2026-82329 was disclosed on **28 August**. The day after.

CVE-2026-82329 itself is **not** in KEV as of the **1 September** catalogue of 1,687 entries, despite watchTowr's observed exploitation. If you are working a KEV-derived queue, you would currently be patching the August path traversal and not the authentication bypass, which is the wrong way round.

## What to do

- **Upgrade to 7.161.20** or the fixed release on your branch.
- **Set an explicit join key.** The phantom is issued to instances that have not configured one.
- **Audit users, tokens and permissions** created or modified since 28 August, and look specifically for accounts nobody remembers making.
- **Rotate access tokens** rather than assuming the upgrade invalidated anything.
- **Check build pipeline integrity** for the same window. An artifact repository compromise that stopped at enumeration is the good case; verify rather than assume it.

## What is not established

- **How many instances are exposed or compromised.** watchTowr describes activity, not a census.
- **Who is behind it.** No attribution.
- **Whether any downstream tampering has occurred.** Nothing published reports a poisoned artefact.
- **Whether the two Artifactory CVEs are related.** Adjacent dates, different flaw classes, no stated connection.
- **Why the phantom key exists at all.** The behaviour is described; the reason it was implemented that way is not.`,
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
