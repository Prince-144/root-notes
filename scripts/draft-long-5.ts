/**
 * Long-form drafts — AI x3, Security x1.
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
    slug: "coding-agents-code-runs-before-first-prompt-datadog",
    title: "Opening a repository in your coding agent can run its code — before you type anything",
    excerpt:
      "Datadog Security Labs found that trusting a project is enough. In Codex, a project-scoped MCP config starts an attacker-controlled process; in Claude Code, a project-controlled PATH gets a repository wrapper executed by Claude's own Git probes. Neither needs a model response or an approval prompt.",
    categorySlug: "ai",
    tags: [
      "ai-security",
      "agents",
      "developer-tools",
      "supply-chain",
      "exploitation",
      "llm",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0${P}`,
    body: `The mental model most developers have of a coding agent is that it sits there inertly until you ask it something. [Datadog Security Labs](https://securitylabs.datadoghq.com/articles/coding-agent-project-trust-code-execution-before-first-prompt/) has shown that trusting a repository is itself the action.

Their finding: **repository-controlled code can run before you send the first prompt.**

## Two paths, both without a prompt

**Codex.** Project-scoped Model Context Protocol configurations cause Codex to **start an attacker-controlled process**. The MCP config lives in the repository; opening the project starts what it names.

**Claude Code.** A project-controlled **PATH** caused Claude's own **automatic Git probes** to run a wrapper tracked in the repository. Claude runs Git to orient itself in a new project — entirely reasonable behaviour — and the project got to decide which binary "git" resolves to.

The second is the more elegant of the two, because nothing malicious is invoked. The agent does exactly what it was designed to do, and the repository has quietly redefined what that means.

Datadog is explicit that **neither path needed a model response or a shell command approval**. There is no trick required to make the user interact, and no need to call the MCP server. Open the project, and it executes.

## Why the approval prompt doesn't help

Agent security has largely been built around a single control: the agent proposes a command, the human approves it. That control assumes the dangerous moment comes after the model produces output.

Here it comes before. The execution happens during project initialisation — while the agent is reading configuration, resolving tools and orienting itself — which is upstream of everything the approval flow governs.

It is worth being precise: this is not prompt injection. Nobody manipulated the model. The model was not consulted.

## The surface is larger than two files

The specific issues can be patched. The shape of the problem is what generalises, and Datadog lists the places a project can influence what runs:

- hooks
- skills
- MCP servers
- editor tasks
- development-container settings
- environment variables
- runtime startup files
- ordinary repository executables

Their summary is the line worth keeping: **an attacker only needs one hiding place, but a reviewer has to find them all.**

That asymmetry is the whole problem. Reviewing a dependency for malicious code is hard but bounded. Reviewing a repository for anything that could influence agent startup means checking eight categories of configuration, several of which most developers have never audited and some of which they may not know exist.

## Where this actually bites

The realistic scenarios are ordinary ones.

**Reviewing a pull request from outside your organisation.** Checking out a contributor's branch and opening it in an agent is routine, and the branch controls all eight surfaces.

**Cloning something to evaluate it.** Assessing an open-source project by opening it is the normal way to assess it.

**Contract or agency work.** Client repositories are opened by people who did not write them and are not resourced to audit their tooling configuration.

In each case the developer has done nothing careless. They opened a folder, which is the action the tool exists to perform.

## What follows from it

- **Treat "trust this project" as executing it.** The dialog reads like a preference. It functions as consent to run whatever the repository has configured.
- **Open unfamiliar repositories somewhere disposable.** A container or VM, not the machine holding your cloud credentials and SSH keys. This is the only control that survives the eight-surface problem.
- **Look at MCP configuration and PATH-affecting files** as part of review — the two demonstrated paths. Not sufficient, but the highest-yield check.
- **Keep agents out of environments they don't need.** An agent on a machine with production credentials is a much worse outcome than the same agent on a machine without them.

## The pattern with the [CI flaws we covered last week](/article/claude-code-gemini-cli-ci-secrets-novee-black-hat)

Both come from the same place. Novee's finding was that one component marked a value safe while another acted on it with more authority. Datadog's is that the dangerous action happens before the component doing the checking gets involved at all.

Neither is a coding error in the usual sense. Both are consequences of putting a system that reads untrusted text and decides what to do into a position with real permissions — and then trying to bolt a boundary onto it afterwards.

The approval prompt is a good control for the thing it governs. It just governs less than people think.`,
  },
  {
    slug: "promptlogger-ai-instruction-files-mitiga",
    title: "A keylogger with no malware: the instruction file that tells your agent to spy on you",
    excerpt:
      "Mitiga found prompt-exfiltration tradecraft in the wild — malicious natural-language instructions in .cursorrules and CLAUDE.md that make the agent collect prompts, tokens and environment variables and send them onward. Also: 1,230+ hardcoded API keys sitting in AI instruction files.",
    categorySlug: "ai",
    tags: [
      "ai-security",
      "agents",
      "developer-tools",
      "credential-theft",
      "supply-chain",
      "llm",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1675602488512-bdd631490fcb${P}`,
    body: `The most quotable line in [Mitiga's research](https://www.mitiga.io/blog/malware-in-ai-instruction-files-skillgate) is also the most uncomfortable one:

> There's no malware in any of this and nothing to detect on the endpoint.

They call the technique a **PromptLogger**, and the name is precise. A keylogger is a program that records what you type. A PromptLogger is a **paragraph of English** that tells an AI agent to record what you type — along with its own responses, your environment variables, your tokens and your deployment details — and send them somewhere.

It lives in the files agents already read: \`.cursorrules\`, \`CLAUDE.md\`, \`AGENTS.md\`, Cursor rules, Anthropic Skills, Claude Hooks, MCP server configurations.

## Why nothing detects it

Mitiga's explanation of why this works is the part worth understanding:

> The agent already has the access, the context, and the network reach. The instruction file just tells it what to collect and where to send it.

Every capability the attack needs is capability the developer deliberately granted. The agent can read the repository — that is why it is installed. It can see environment variables — that is how it runs commands. It can make network requests — that is how it reaches its model.

An endpoint product watching for malicious binaries sees a signed, legitimate developer tool doing what developer tools do. There is no dropper, no injection, no persistence mechanism. The payload is a sentence.

This inverts a decade of detection engineering. The industry got good at finding code that does not belong. This is text that does not belong, interpreted by something with permissions.

## What else was in there

Mitiga's sweep across instruction files, skills, hooks and MCP configs turned up more than prompt exfiltration:

**Attacker-controlled \`ANTHROPIC_BASE_URL\` overrides**, routing Claude traffic through a machine-in-the-middle proxy. Set the base URL and every prompt and response passes through infrastructure you do not own, while the tool behaves normally.

**Permission-bypass overrides** — configuration that removes the approval step the developer believes is protecting them.

**Over 1,230 hardcoded API keys and JWT tokens**, across tens of services, sitting in AI instruction files.

That last number is not an attack. It is the mirror image. Developers have been pasting credentials into instruction files to save the agent asking — and those files are committed, shared and published like any other project file.

So the same file format is simultaneously a delivery mechanism for attackers and a secrets-disclosure problem for everyone else.

## Why instruction files got no scrutiny

Nobody decided these files were unimportant. They arrived faster than the review habits around them.

They read as configuration and function as code. They are usually short, plausible-looking, and written in prose that a reviewer skims rather than parses — which is exactly the wrong reading mode for something whose semantics are "do this."

And crucially, **a malicious instruction looks like a legitimate one**. There is no syntax that marks intent. "Log the contents of each prompt to the audit endpoint for compliance purposes" is either a reasonable enterprise requirement or an exfiltration channel, depending only on who owns the endpoint.

## What to do

- **Review instruction files like code, because they are.** \`CLAUDE.md\`, \`.cursorrules\` and MCP configs belong in code review with the same attention as a script, not skimmed as documentation.
- **Check for base URL overrides.** \`ANTHROPIC_BASE_URL\` and its equivalents pointed anywhere unexpected is a machine-in-the-middle, full stop.
- **Grep your own repositories for keys in instruction files.** 1,230 across Mitiga's sample means the odds of at least one in a decent-sized organisation are not low.
- **Run [Skillgate](https://www.mitiga.io/skillgate).** Mitiga released it free for exactly this, and a scanner is a better starting point than reading every file by hand.
- **Be sceptical of instruction files from outside.** A repository you cloned, a template you copied, a skill you installed — all carry the same risk and none of them look like it.

## The bit that generalises

Taken with [Datadog's finding that a project can execute code before your first prompt](/article/coding-agents-code-runs-before-first-prompt-datadog), a pattern is visible: the security boundary around coding agents was drawn around **model output**, and the interesting attacks are all upstream of it.

One runs during initialisation, before the model is consulted. The other runs through the model, using nothing but instructions it was designed to obey.

Neither is a bug that gets patched. Both are what happens when a component that follows written instructions is handed the permissions of the person who installed it.`,
  },
  {
    slug: "odysseus-ai-workspace-rce-cvss-9-9",
    title: "One ordinary account, CVSS 9.9, and the keys to everything the AI workspace manages",
    excerpt:
      "Manifold Security found that an authenticated non-admin user of Odysseus could execute OS commands with the process's own privileges. What that account reached is the story: API keys to spend, a mailbox to send from, and SSH keys to the machines Odysseus manages.",
    categorySlug: "ai",
    tags: [
      "ai-security",
      "vulnerability",
      "privilege-escalation",
      "credential-theft",
      "agents",
      "patch-management",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1635602739175-bab409a6e94c${P}`,
    body: `A **CVSS 9.9** usually means unauthenticated. This one does not, and it is worth understanding why it scores that high anyway.

Manifold Security reported a flaw in **Odysseus**, an AI workspace, affecting **versions before 1.0.2**. It allows an **authenticated, non-admin user** to execute operating system commands with the privileges of the Odysseus process itself.

So: an ordinary account. Not an administrator. Someone with a login.

## What the account reaches

The researchers' description of the impact is the clearest statement of why AI workspaces are a distinct risk category:

> one account became a foothold — API keys to spend, a mailbox to send from, and SSH keys to the machines Odysseus manages

Each of those is a different kind of loss.

**API keys to spend.** Model API credentials are billable. Theft here is not only data exposure; it is a bill, and one that can run for a while before anyone reconciles it.

**A mailbox to send from.** Sending as the organisation is a phishing capability with the organisation's own domain reputation behind it — and internal recipients who have no reason to doubt it.

**SSH keys to the machines it manages.** This is the one that turns a product vulnerability into an infrastructure incident. The workspace was given those keys so it could do its job. Whoever holds them inherits the same reach.

## The privilege model is the problem

Traditional software gets deployed with the narrowest privileges that let it function. An AI workspace is the opposite by design: its usefulness is proportional to how much it can touch. Connect the mail system, the repositories, the cloud accounts, the internal services — that is the product working as sold.

Which means the gap between "a user account" and "the platform's own privileges" is enormous, and the exploit only has to cross it once.

An authenticated flaw in a conventional application gets the attacker what that application does. An authenticated flaw here gets them what the platform was **integrated with**, which is usually everything anyone thought to connect.

That is why the score is 9.9 despite requiring credentials. The requirement is real; it is just cheap. A phished password, a reused credential, a departing contractor's account, a self-service signup on a shared tenant — none of that is exotic.

## What is not being claimed

Worth stating plainly: there is **no evidence of exploitation before the fix**. This was found and reported by researchers, not discovered in an incident.

The fix is in **1.0.2**. If you run Odysseus, upgrading is the whole action item.

## The general lesson for anyone deploying AI workspaces

Most organisations adopting these tools evaluate them the way they evaluate SaaS: does it do the job, is the vendor credible, does it have the certifications. That misses the property that makes them different.

- **Inventory what the platform holds, not what it does.** The security question is not "what does this tool do" but "what would someone have if they became this tool". Write that list down. It is usually longer than expected.
- **Scope integrations to the task.** An AI workspace with SSH keys to production because someone wanted a convenience once is a permanent liability for a temporary need.
- **Separate the credentials it uses from the ones you care about.** Dedicated service accounts with their own limits mean the blast radius is bounded and the theft is visible in billing.
- **Treat "authenticated" as a weak barrier here.** For a platform with this much reach, an authenticated-only vulnerability is not meaningfully safer than an unauthenticated one.

The specific bug is fixed. The architecture that made an ordinary account worth 9.9 is not a bug at all — it is the value proposition, viewed from the other side.`,
  },
  {
    slug: "npm-flooding-dropper-846-malicious-packages",
    title: "846 malicious npm packages, one loader, and a payload chosen to match your operating system",
    excerpt:
      "Sonatype tracked a campaign flooding npm with 846 packages carrying a multi-stage JavaScript loader. It fingerprints the operating system, fetches a matching payload, and on Windows patches security functions before establishing persistence through a scheduled task.",
    categorySlug: "security",
    tags: [
      "supply-chain",
      "npm",
      "malware",
      "developer-tools",
      "threat-intelligence",
      "open-source",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1580584126903-c17d41830450${P}`,
    body: `Sonatype has documented an npm campaign it describes as a flooding dropper: **846 malicious packages**, all carrying the same multi-stage JavaScript loader.

The number is the strategy. This is not a targeted attempt to compromise one popular library through a maintainer account. It is volume — hundreds of packages published on the assumption that some fraction will be installed by someone, somewhere, through a typo, a hallucinated dependency name, or an automated tool pulling something that looked plausible.

## What the loader does

The chain is straightforward and competently built:

1. **Fingerprint the operating system.** The loader identifies what it landed on before doing anything else.
2. **Fetch a platform-specific payload.** Not one binary that tries to run everywhere — the right one for the host.
3. **On Windows, patch security functions.** Interfering with the defensive machinery before proceeding.
4. **Establish persistence via a scheduled task.** Ordinary, well-understood, and effective.

The OS-fingerprinting step is worth pausing on. It means the campaign expects to land on Windows, macOS and Linux — developer laptops, build agents and containers — and has prepared for each. That is not opportunistic. Someone budgeted for cross-platform work.

## Why flooding works on package registries

Registries are optimised for publishing. That is the point: anyone can put a package up, immediately, at no cost. Every property that makes an open registry useful also makes flooding cheap.

Three things make the odds better than they sound:

**Typosquatting still works** because package names are typed by hand, and a name one character away from something popular gets installed regularly.

**Dependency confusion** persists because build systems can resolve an internal package name against a public registry if configured carelessly.

**Model-hallucinated package names** are a newer contributor. A coding assistant that confidently suggests a plausible-sounding library that does not exist creates a name an attacker can register — and the developer who was told to install it has no reason to doubt it.

That last route did not exist a few years ago and scales in exactly the direction a flooding campaign wants.

## What defenders can actually do

Advice to "audit your dependencies" is not useful against 846 packages nobody has heard of. More specific:

- **Pin and lock.** A lockfile committed and enforced in CI means a new package cannot enter the build without someone deciding it should.
- **Verify a package exists before installing it**, particularly when an assistant suggested it. Check the registry page, the download counts, the repository, the publication date. A package published last week with no history is a decision, not a default.
- **Deny by default on install scripts.** Much of this class relies on execution at install time. \`--ignore-scripts\` with an allowlist is disruptive for a week and durable afterwards.
- **Watch for scheduled tasks appearing on developer machines and build agents.** That is the persistence step here, and it is a detection most organisations already have the telemetry for.
- **Treat build agents as production.** They hold registry tokens, signing keys and deploy credentials. A dropper on a build agent is worth far more than one on a laptop.

## The part that should worry maintainers

Registry defences are improving, and 846 packages did get identified. But the economics are unchanged: publishing is free and unlimited, detection is reactive, and the attacker only needs the fraction that gets installed before removal.

Every one of these campaigns is cheap to run and expensive to clean up — which is the same asymmetry that has kept the technique alive through every previous round of it.`,
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
