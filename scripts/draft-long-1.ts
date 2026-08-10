/**
 * Long-form drafts, batch 1 of 2 — AI, Security, Startups.
 * Every figure is from a source read this session.
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
    slug: "claude-code-gemini-cli-ci-secrets-novee-black-hat",
    title: "A GitHub issue can reach your CI secrets through the AI agent you gave repo access to",
    excerpt:
      "Novee Security took Claude Code, Gemini CLI and OpenAI Codex to Black Hat and found the same structural bug in all three: one component marks a value safe, a later component acts on it with more authority. Gemini CLI's carries a CVSS 4.0 of 10.0.",
    categorySlug: "ai",
    tags: [
      "ai-security",
      "agents",
      "vulnerability",
      "supply-chain",
      "developer-tools",
      "anthropic",
      "exploitation",
    ],
    readingMinutes: 8,
    coverImageUrl:
      "https://images.unsplash.com/photo-1782918843144-920ff238efc5?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `Most teams adopted AI coding agents the same way: install it, point it at the repository, wire it into CI so it can respond to issues and pull requests. That last step is the one worth revisiting.

Novee Security presented findings at Black Hat USA on **5 August 2026** covering Claude Code, Gemini CLI and OpenAI Codex. Two produced CVEs. All three shared the same underlying shape, and it is a shape worth understanding rather than a list of bugs worth patching and forgetting.

## The Gemini CLI flaw is the worse one

**CVE-2026-12537** carries a **CVSS 4.0 score of 10.0** — the top of the scale.

It is an OS command injection in the container launcher, reached through a crafted \`.gemini/.env\` file. The consequence is the part that matters: an **unprivileged** GitHub user can get code running on the host of a headless CI platform, **before the sandbox starts**.

Read that sequence again, because it inverts the assumption the whole design rests on. The sandbox is the control. It is what makes it acceptable to let an agent process input from strangers. If an attacker can execute on the host during the launcher's own startup, the sandbox never enters the picture — it is not bypassed so much as pre-empted.

The requirement to exploit it is a file in a repository. Not a maintainer's credentials, not a compromised dependency, not social engineering. A pull request from an account that opened yesterday.

Fixed in **Gemini CLI 0.39.1** and **run-gemini-cli 0.1.22**.

## The Claude Code flaw is the more inventive one

**CVE-2026-54316** is rated **9.1 under CVSS v3.1**. Anthropic scores it **6.0 under CVSS v4**, which is a notable gap and worth stating plainly rather than picking whichever number suits the headline. Different versions of the scoring standard weigh exploitability and scope differently, and vendor self-scoring naturally sits at the lower end of a defensible range. Both numbers describe the same bug.

It affects **every version from 0.2.54 through 2.1.163**, and is fixed in **2.1.163**.

The mechanism is where it gets interesting. The vulnerability allows **API key exfiltration through Hugging Face download counters, one character at a time**.

That deserves unpacking, because it is a genuinely elegant piece of work. Hugging Face publishes download counts for models. Those counters are public, they increment when a model is fetched, and they are observable by anyone. An attacker who can induce the agent to fetch a model chosen by the *value of a character in a secret* — one model per possible character — can then read the secret back by watching which counters moved.

No outbound connection to attacker infrastructure. No unusual domain in the egress logs. The traffic goes to Hugging Face, which is exactly where an AI coding agent is supposed to be talking. The data leaves through a side channel built out of a legitimate service's public metrics.

Detection controls that look for exfiltration to suspicious hosts see nothing at all.

## What actually links the three

Novee's framing is the useful takeaway. Across the tools, the researchers found a recurring pattern:

> one part marked a value safe, and a later part acted on that value with more authority

Two concrete instances:

**Claude Code's command validator strips single-quoted text before running its security checks.** So the validator inspects a version of the command with content removed, pronounces it safe, and the shell then executes the original — including a payload sitting inside a git flag value. The check and the execution disagreed about what the command was.

**Gemini CLI parsed its tool allowlist only at registration time, with no runtime enforcement.** The allowlist described what should be permitted. Nothing consulted it at the moment a tool actually ran. A control that exists in configuration and not in the execution path is documentation.

**OpenAI Codex** received no CVE. Its issue was that the first of two sequential passes could modify the instructions for the second — an agent editing its own downstream tasking. OpenAI addressed it through workflow separation and documentation changes rather than code, which is a reasonable response to a design property rather than a memory-safety error, though it does mean the fix depends on users reading the documentation.

## Why this class will keep recurring

These are not careless bugs. They are the predictable result of a specific architecture: a system that takes untrusted natural-language input, decides what actions it implies, and then executes those actions with the permissions of whoever installed it.

Traditional security boundaries assume you can separate code from data. An agent's entire function is to erase that separation — it reads text and turns it into commands. Every validation layer is therefore trying to classify something whose meaning is not fixed until execution.

Add CI, and three things stack unfavourably:

- **CI hosts hold the credentials.** Deploy keys, registry tokens, cloud roles, signing material. It is where the valuable secrets live because it is where the automation needs them.
- **CI runs on other people's input.** Issues, comments and pull requests from anyone. That is the point of a public repository.
- **CI runs unattended.** Nobody is watching the output at 3am.

An agent placed at that intersection is processing hostile input, with production credentials, with no human in the loop.

## What to do

- **Update both tools now.** Gemini CLI to **0.39.1** (and run-gemini-cli to **0.1.22**), Claude Code to **2.1.163**. The Claude Code window covers essentially the tool's entire release history, so "we installed it a while ago" means affected.
- **Audit every workflow an external user can trigger.** The exposure is specifically in agents reacting to issues, comments and pull requests from outside the organisation. An agent that only runs on pushes to a protected branch is a different risk profile entirely.
- **Scope CI credentials to the job.** If a workflow only needs to read a repository, it should not hold a deploy key. This is standard advice that agents make considerably more urgent, because the blast radius of an injection is exactly the set of credentials in scope.
- **Rotate what was reachable.** For the Claude Code issue in particular, the exfiltration is silent by design. Absence of alerts is not evidence that nothing left.
- **Watch the egress you consider normal.** The Hugging Face channel works because traffic to Hugging Face is unremarkable from a machine running an AI agent. Anything an agent is expected to talk to is a candidate carrier.

## The thing worth internalising

The instinct after a disclosure like this is to patch and move on. The more useful reading is that the sandbox, the allowlist and the validator were all present in these products, and all three were defeated by ordering — a check performed against one version of a value while a different component acted on another.

That is not a bug you fix once. It is a property of gluing a probabilistic component into a system that expects deterministic boundaries, and it will keep surfacing in new tools until the boundary is enforced at the point of execution rather than asserted somewhere upstream.`,
  },
  {
    slug: "kemp-loadmaster-cve-2026-8037-escape-quotes-kev",
    title: "A load balancer's input-sanitising function is the reason it can be owned without a password",
    excerpt:
      "CVE-2026-8037 is a CVSS 9.6 command injection in Progress Kemp LoadMaster, traced to its escape_quotes() routine. 792 exploitation attempts over 41 days from 65 IPs across 18 countries — and the federal remediation deadline is today.",
    categorySlug: "security",
    tags: [
      "vulnerability",
      "exploitation",
      "cisa-kev",
      "network-security",
      "edge-devices",
      "patch-management",
      "threat-intelligence",
    ],
    readingMinutes: 7,
    coverImageUrl:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `There is a particular kind of vulnerability that is worse than its score suggests, and this is one: an unauthenticated command injection in a device whose job is to sit in front of everything else.

**CVE-2026-8037** carries a CVSS of **9.6** and affects **Progress Kemp LoadMaster**. CISA added it to the Known Exploited Vulnerabilities catalog on **7 August 2026**, with a Federal Civilian Executive Branch remediation deadline of **10 August 2026** under Binding Operational Directive 26-04.

That is a three-day window. CISA does not set those casually.

## The flaw is in the sanitiser

The technical detail is the part worth dwelling on. The injection stems from improper processing in a function called **\`escape_quotes()\`**, with unsanitised input reaching multiple command endpoints.

A function named \`escape_quotes()\` exists for one reason: to make untrusted input safe to place into a command. It is the control. And the control is the vulnerability.

This is a recognisable failure mode rather than an unusual one. Escaping is deceptively hard because correctness depends on the exact grammar of whatever consumes the output, and that consumer is often several layers away from the code doing the escaping. An escaping routine that handles one quoting context correctly will mangle another. The gap between "we escaped it" and "it is safe in the specific shell that will run it" is where these bugs live.

The practical consequence: an attacker with **no credentials at all** can execute arbitrary commands on the appliance.

## Why a load balancer is the wrong thing to lose

LoadMaster is a load balancer. Consider where that puts it.

It terminates TLS, which means it holds private keys and sees plaintext for every session it fronts. It sits at the network edge with a public interface, because being reachable is its function. And it is trusted by the servers behind it — traffic arriving from the load balancer is, in most architectures, traffic that has already passed whatever inspection exists.

An attacker with command execution there is not on the perimeter looking in. They are the thing everything else was configured to trust.

There is also the operational reality that appliances like this are patched on a slower cadence than servers. They are load-bearing, downtime is visible, and change windows are scarce. That is precisely why edge appliances have become such a productive target class over the last few years — the same pattern that produced the [SonicWall credential harvesting we covered](/article/sonicwall-attacks-uta0533-inc-ransomware) and the [Cisco firewall manager zero-day](/article/cisco-fmc-zero-day-cve-2026-20316).

## What the exploitation data actually shows

Here the numbers deserve care, because the headline figure and the honest reading differ.

| Measure | Value |
| --- | --- |
| Exploitation attempts | **792** |
| Period | **41 days** |
| Unique source IPs | **65** |
| Countries | **18** |
| Last recorded activity | 4 August 2026 (5 attempts) |

Sample source addresses include 192.42.116.58, 192.42.116.105 and 146.70.139.154.

Sixty-five IPs across eighteen countries — Australia, China, Indonesia, Japan, Poland, the US among them — describes broad, opportunistic scanning rather than a targeted campaign. That is the signature of a public exploit being run by many uncoordinated parties.

**But eSentire, reporting in July 2026, characterised the attempts as largely unsuccessful.**

That qualifier gets dropped in most coverage, and dropping it changes the story. 792 successful compromises would be an emergency. 792 attempts that mostly failed is a different thing: it means the exploit is circulating, people are trying it at scale, and either the payloads are unreliable or most reachable instances are already patched.

Neither reading is comfortable. Widespread attempts against a KEV-listed unauthenticated RCE means the window is open and being probed continuously. But it is worth being accurate about what has been observed versus what has been achieved.

The disclosure timeline is relevant too: **watchTowr Labs published analysis in June 2026**, and exploitation attempts followed. That sequence — public analysis, then broad scanning — is the ordinary lifecycle of an edge-device vulnerability, and it is why the interval between a technical writeup and a patch deployment is the number that matters operationally.

## What to do

- **Patch, today if you are federal.** The BOD 26-04 deadline is 10 August. Everyone else should treat that date as a strong signal about urgency rather than a boundary that excludes them.
- **Assume compromise if you were exposed and unpatched.** Attempts have been running for at least 41 days against internet-facing appliances. An appliance that was reachable during that window and is only being patched now has been in scope the whole time.
- **Rotate the TLS material.** This is the step that gets skipped. Command execution on a device that terminates TLS means the private keys were readable. Patching closes the door; it does not un-copy what was taken.
- **Audit configuration, not just version.** Injection on a load balancer permits backend pool changes, rule modification and traffic redirection that survive a firmware update. Compare the running configuration against what it is supposed to be.
- **Check what the appliance can reach.** A load balancer usually has network paths to the systems it fronts. Those paths are the second stage.

## The broader point about escaping

The lesson generalises past this appliance. Whenever the answer to "how do we make this input safe" is a function that transforms the input, the security of the system depends on that function being correct for every downstream consumer, forever, including consumers added later by someone who never read it.

Parameterisation — keeping data as data rather than making it safe to concatenate into a command — removes the class rather than the instance. It is more work up front and it is the only version of this that stays fixed.

\`escape_quotes()\` did its job as written. The job was the problem.`,
  },
  {
    slug: "ai-cited-tech-layoffs-2026-framing",
    title: "Nineteen companies blamed AI for layoffs in 2026 — read how they worded it",
    excerpt:
      "Nearly 140,000 US tech jobs went this year, and AI keeps appearing in the explanation. But only four employers said anything specific, and the Financial Times found firms citing AI underperformed the Nasdaq by around 10% in the following 30 trading days.",
    categorySlug: "startups",
    tags: [
      "layoffs",
      "ai",
      "market-data",
      "founders",
      "tech-industry",
      "employment",
    ],
    readingMinutes: 8,
    coverImageUrl:
      "https://images.unsplash.com/photo-1560264280-88b68371db39?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `Nearly **140,000** US tech jobs have been cut since the start of 2026. In a growing share of the announcements, AI appears somewhere in the explanation.

[TechCrunch has been maintaining a running list](https://techcrunch.com/2026/07/06/the-running-list-major-tech-layoffs-in-2026-where-employers-cited-ai/) of the major cuts where employers name-checked AI. Reading it in one sitting is more informative than any individual announcement, because the interesting variable is not whether AI is mentioned. It is **how precisely** it is mentioned — and for most of these companies, the answer is not very.

## The list

| Company | Cut | Date | How AI was framed |
| --- | --- | --- | --- |
| Amazon | 16,000 | Jan 2026 | Vague — "we will need fewer people" as AI adoption rises |
| Dell | ~11,000 (10%) | Jan/Mar 2026 | Vague — savings redirected to AI-optimised servers |
| Salesforce | <1,000 | Feb 2026 | **Explicit** — fewer support cases; Agentforce handles the work |
| Block | ~4,000 (40%) | Feb 2026 | Vague — "intelligence tools" enabling a new way of working |
| Atlassian | 1,600 (10%) | Mar 2026 | Vague — and says AI "doesn't change... the number of roles required" |
| Snap | ~1,000 (16%) | Apr 2026 | Vague — reduce repetitive work, increase velocity |
| Coinbase | ~700 (14%) | May 2026 | Vague — engineers ship in days what took weeks |
| PayPal | 4,500+ (20%) | May 2026 | Vague — "aggressively adopt AI" |
| Cloudflare | 1,100 (20%) | May 2026 | **Explicit** — the majority were "measurers"; middle management made obsolete |
| GM | 500–600 | May 2026 | Vague — AI played "a role", not the sole cause |
| Meta | 8,000 (10%) | May 2026 | Mixed — moved 7,000 into AI roles simultaneously |
| Intuit | ~3,000 (17%) | May 2026 | Vague — "reallocating resources toward AI" |
| Cisco | ~4,000 (5%) | May 2026 | Vague — realigning around silicon, optics, security, AI |
| Google | 1,500–3,000+ | through May 2026 | Vague — rolling performance reviews, no official figures |
| GitLab | ~350 (14%) | Jun 2026 | Vague — restructuring for "100x growth requirements" |
| Oracle | 21,000 (13%) | Jun 2026 | **Explicit** — AI adoption "resulted in reductions to our workforce" |
| Microsoft | 4,800 (2.1%) | Jul 2026 | Contradictory — roles "not being replaced by AI", but AI "changing how work gets done" |
| Monday.com | ~600 (20%) | Jul 2026 | Vague — co-founder denied it was to replace people with AI |
| IBM | 3,000–9,000 | rolling | Mixed — ~200 HR roles to AI agents, while tripling entry-level AI hiring |

## Four companies actually said something

Strip out the language that could describe any restructuring in any year and very little remains.

**Oracle** is the clearest: AI adoption and deployment "have resulted in reductions to our workforce." That is a causal claim, in a filing-adjacent register, about 21,000 people.

**Cloudflare** is the most specific about *who*. The majority of the 1,100 were "measurers" — middle management whose function was tracking and reporting on work — described as made obsolete. That is a claim about a category of job rather than a headcount target, and it is falsifiable.

**Salesforce** named the product. Fewer support cases require humans because Agentforce handles them. Under 1,000 roles, and a mechanism you could audit.

**IBM** is precise in a smaller way: roughly 200 HR roles replaced by AI agents — while simultaneously tripling entry-level AI hiring.

Everything else is compatible with a company that would have cut costs regardless and reached for the available vocabulary.

## The tell is in the contradictions

Two entries undermine the framing from inside.

**Atlassian** cut 1,600 people while stating that AI "doesn't change the mix of skills we need or number of roles required." Both things were said. Only one of them explains a layoff.

**Microsoft** managed both positions in one announcement: the roles were "not being replaced by AI", but "AI is changing how work gets done." That is a sentence engineered to be quoted either way.

**Meta** cut 8,000 and moved 7,000 people into AI roles at the same time. That is not AI eliminating work. It is a company reallocating its workforce toward a bet — and saying out loud that "success isn't a given in AI".

## The market read it too

This is the most useful data point in the whole picture, and it is not a matter of opinion.

Financial Times analysis found that **companies citing AI as layoff justification underperformed the Nasdaq by nearly 10% over the 30 trading days following the announcement**.

That is the opposite of what the framing is meant to achieve. "We are cutting costs because our AI works" is supposed to read as a company getting more efficient. Investors priced it as something else — either as an admission that demand is soft and AI is the cover story, or as scepticism that the claimed productivity exists.

The market, in aggregate, does not appear to believe these companies.

## Why founders should care about the vocabulary

If you are building something, three things follow.

**The talent market is not what the headlines imply.** 140,000 cuts alongside aggressive hiring at Anthropic and OpenAI, and IBM tripling entry-level AI hiring, is not a labour surplus. It is a violent reallocation. The people you can now hire are not necessarily the people the AI-labs are competing for, and that cuts both ways.

**"AI made us efficient" is a claim you will be asked to substantiate.** The FT data suggests sophisticated audiences already discount it. If you use that line in a fundraise, expect to be asked which function, by how much, and measured how — which is exactly the question Oracle, Cloudflare, Salesforce and IBM can answer and the other fifteen cannot.

**Middle layers are where the pressure lands first.** Cloudflare's "measurers" formulation is worth taking seriously precisely because it is specific. The roles most exposed are the ones whose output is coordination and reporting rather than the work itself. That is a structural observation about org design, and it applies to a 40-person company as much as an 11,000-person one.

## What this list does not tell you

It is worth stating the limits.

Being on this list means the employer mentioned AI, not that AI caused anything. Attributing a layoff to AI is a communications decision, made by people who know it sounds better than "we over-hired" or "revenue missed."

Companies with genuine AI-driven efficiency gains who chose not to say so are absent entirely. So the list measures *the willingness to attribute*, and the FT's market data measures *whether that attribution was believed*.

On current evidence, the attribution is common and the belief is not.`,
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
