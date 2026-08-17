/**
 * Long-form drafts — four pieces in the same shape as the Suno one: a claim
 * that travelled further than its evidence, checked against the record.
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
    slug: "nyt-openai-sanctions-motion-project-giraffe-discovery",
    title:
      "The publishers are not arguing about fair use any more — they are arguing that OpenAI lied about what it could search",
    excerpt:
      "For two years OpenAI told the court it could not search its own training corpus. A court-ordered deposition in April produced a database of 78 million conversations and a tool built to log regurgitation. The sanctions motion asks the court to decide the fact question without the evidence.",
    categorySlug: "ai",
    tags: [
      "openai",
      "copyright",
      "litigation",
      "discovery",
      "training-data",
      "media",
    ],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1711003596872-aa68f08a4b8e${P}`,
    body: `On **9 July 2026** the New York Times, the New York Daily News and other news plaintiffs asked a Manhattan federal court to impose **serious sanctions** on OpenAI, alleging that the company concealed for more than two years that it could search its own training data and output logs.

This is not a fair-use argument. It is a discovery-conduct argument, and those are decided on a different standard and can end a case without anyone reaching the copyright question at all.

## What OpenAI said it could not do

Throughout the case OpenAI's position was that it **lacked the ability to search its own training corpus**, and that searching or producing its collection of ChatGPT conversations would be technically burdensome and would raise user-privacy concerns.

That position shaped years of discovery. It is the reason the plaintiffs' requests were narrowed, and the reason the fight over chat logs took the shape it did.

## What the deposition produced

In a **court-ordered deposition in April 2026**, OpenAI data privacy engineer **Vinnie Monaco** testified — per the plaintiffs' motion — that OpenAI had already run internal searches and evaluations of its training corpus looking for copyrighted journalism.

The motion describes two things in particular:

**A database of roughly 78 million de-identified ChatGPT conversations**, maintained internally and used to assess how much the company was infringing others' works.

**"Project Giraffe"** — a set of tools including a **Bloom filter** built to detect and keep a record of regurgitation in model outputs, implemented **shortly after the lawsuit was filed**.

A Bloom filter is an ordinary data structure — a compact way to test whether an item is probably in a set. There is nothing sinister about the technique. The allegation is about timing and disclosure: a tool built to answer the exact question in the litigation, stood up after the suit was filed, while the company was telling the court it could not answer that question.

## The chat log fight

The sequence the plaintiffs describe:

| Step | What happened |
| --- | --- |
| Request | **120 million** chat logs |
| Negotiated down to | **20 million** |
| Sample delivered (December) | Redacted so heavily the court deemed it **"unusable"** |
| Also alleged | **Billions** of outputs deleted after the suit was filed, and millions of logs substituted in the requested sample |

The deletion and substitution allegations are the serious ones. Spoliation — destroying evidence you are on notice to preserve — is what produces the harshest sanctions available.

## What they are asking for

The motion asks the court to:

- **Preclude OpenAI from using the 20 million-log sample** as evidence
- **Deem it established** that the logs would have shown substantial regurgitation
- **Bar OpenAI from arguing** the sample does not show major regurgitation
- **Order OpenAI to pay** the plaintiffs' legal fees

Read the middle two together. That is an **adverse inference** request: a ruling that the destroyed or withheld evidence would have proved the plaintiffs' case, so the court should proceed as though it did.

If granted, the central factual question — does ChatGPT reproduce Times journalism at scale — stops being contested. OpenAI would be barred from arguing the negative, and would have to win on fair use with the fact of substantial regurgitation already established against it.

That is an enormous ask, and courts grant it rarely. But it is the ask.

## OpenAI's response

Spokesperson **Drew Pusateri**:

> As the Times' case weakens and they've been forced to drop claims against us, they're persisting with their efforts to invade the privacy of people who have nothing to do with this case.

The company says it is defending its users' privacy and long-established principles of fair use.

Note what that answer does and does not do. It contests the plaintiffs' motive and frames the dispute as a privacy question. It does not, in the quote on record, address whether the search tools existed or whether the company's earlier representations were accurate.

## Why this matters beyond one case

The pattern across AI copyright litigation so far is that **conduct loses cases, not concept**.

In **Bartz v. Anthropic**, Judge Alsup held that training on lawfully acquired books was fair use — and that keeping pirated copies in a central library was not. Only the piracy class proceeded, and it settled for **$1.5 billion**. The model training was fine. The acquisition was not.

The same shape is visible in the [music-industry case against Suno](/article/suno-leak-what-the-viral-version-gets-wrong), where the labels' strongest theory is not that training is infringement but that the recordings were obtained by circumventing YouTube's protections.

A discovery-misconduct finding would be the third variant of the same lesson: what decides these cases is how the defendant behaved, not whether machine learning is transformative.

## What is not established

Being precise, because this is a motion and not a ruling:

- **These are allegations.** The characterisation of Monaco's testimony is the plaintiffs'. We have not seen the deposition transcript.
- **No ruling has issued.** No court has found spoliation, concealment or bad faith.
- **The reporting we relied on does not name the presiding judge** or give dates beyond the April deposition and the December sample.
- **"Deleted billions of outputs"** is the plaintiffs' characterisation. Routine log rotation and deliberate destruction look different in a technical record and identical in a press summary.

## What to watch

- **Whether the court orders the deposition transcript unsealed.** That converts allegation into record.
- **Whether any adverse-inference relief is granted, even partially.** A narrow version — say, precluding the 20m sample — would still be significant.
- **Whether OpenAI's earlier representations get characterised by the court**, as opposed to by the plaintiffs.
- **Whether other AI defendants' burden objections get re-examined.** "We cannot search our training data" has been a common position across this litigation. If it fails once on the facts, it becomes harder to assert elsewhere.`,
  },
  {
    slug: "ai-vulnerability-reports-surge-hackerone-valid-rate-held",
    title:
      "AI did not flood bug bounty with garbage — submissions rose 76% and the valid rate did not move",
    excerpt:
      "The 'AI slop' story says quality collapsed. HackerOne's own figures say the confirmed-exploitable rate held at about 25% through a record surge, and the share of critical and high findings went up. The problem is not slop. It is that finding got cheap and fixing did not.",
    categorySlug: "security",
    tags: [
      "bug-bounty",
      "ai",
      "vulnerability-management",
      "hackerone",
      "disclosure",
      "security-operations",
    ],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1774352724311-ba2694681e83${P}`,
    body: `The story everyone is telling about AI and vulnerability disclosure is that generative models made it free to file a report, so maintainers are drowning in confident, plausible nonsense. Curl's public frustration with AI-written reports made the term "slop" stick.

The numbers do not support the strong version of that story.

## What HackerOne published

Alongside its **h1 Validation** launch in **April 2026**, HackerOne released figures from its own platform:

| Metric | Figure |
| --- | --- |
| Submission growth | **+76% year over year** |
| Peak | Record high, **March 2026** |
| Confirmed exploitable | **~25%** — *unchanged* through the surge |
| Critical + high severity | **32%**, up from a 26–28% baseline |
| Remediation improvement | **+19% year over year** |

The third row is the one that breaks the narrative. If AI were mostly producing garbage, the valid rate would fall as volume rose — that is what dilution looks like. It held.

And the fourth row goes the other way entirely: the proportion of **critical and high** findings went **up**, from a long-run baseline of 26–28% to 32%.

So the surge is not disproportionately junk. A quarter of a much larger number is still a quarter, and a larger share of it is serious.

## The actual problem is arithmetic

Put rows one and five together.

Submissions up **76%**. Remediation up **19%**.

That gap is the whole story. AI reduced the cost of *finding* and did nothing to the cost of *fixing*. A vulnerability programme is a pipeline, and one stage just got four times faster relative to the one after it.

The consequence is not a quality crisis. It is a **backlog** crisis — more real, more severe findings arriving than the engineering organisation on the other end can absorb.

That is a materially different problem, and it has different fixes. Slop is solved by filtering. Backlog is solved by prioritisation, by fixing classes rather than instances, and by deciding — explicitly — which real vulnerabilities you are choosing not to fix this quarter.

## Where the slop story is still right

Two things save the popular narrative from being simply wrong.

**Triage cost is real and it is not evenly distributed.** HackerOne is a platform with paid triage. An unpaid open-source maintainer receiving AI-generated reports has no such buffer, and their valid rate is not HackerOne's valid rate. Curl's experience is not contradicted by platform-wide statistics; it is a different population.

**A 25% valid rate means 75% is not valid**, and reviewing those still costs analyst hours. The rate holding steady is good news about quality and neutral news about workload.

## The conflict of interest, stated plainly

These figures come from a **vendor press release announcing a product that solves the problem the figures describe**. HackerOne's Chief Product Officer **Nidhi Aggarwal** is quoted saying AI is accelerating both the volume and sophistication of vulnerabilities, and that h1 Validation helps organisations reduce the time from find to fix.

That does not make the numbers wrong. HackerOne has better platform data than anyone, and a vendor with a book of business does not benefit from inflating a valid rate — if anything the marketing incentive runs the other way.

But it means: unaudited, self-reported, and released in service of a launch. Treat accordingly.

One further caution. A specific submission count for March 2026 — **46,947** — is in circulation. It does not appear in the press release we read, and we could not trace it to a primary HackerOne document. Use the 76% figure, which is sourced, rather than the absolute number, which is not.

## What this changes for a security team

- **Stop budgeting triage as a fixed cost.** If submissions are up 76% and your intake process is unchanged, the queue is where your risk now lives.
- **Measure your own valid rate.** If it is far below 25%, you have a scope or a signal-to-noise problem specific to you, not an industry one.
- **Watch the severity mix, not just the count.** 32% critical-and-high on a much larger base is a real change in exposure.
- **Fix classes, not instances.** The only response that scales against a 76% increase is remediating the pattern that produced the finding.
- **Be honest about the remediation number.** 19% is what your engineering capacity actually grew by. Everything above that accumulates.

The uncomfortable conclusion is that the "AI slop" framing has been comforting. It says the extra work is fake and can be filtered away. The data says most of the extra work is real, more of it is serious than before, and it is arriving faster than anyone can fix it.`,
  },
  {
    slug: "thirty-minutes-to-exploit-tracing-the-claim",
    title:
      "\"Exploit time dropped from 30 days to 30 minutes\" — the 30 minutes was one researcher, one patch, and a denial-of-service proof of concept",
    excerpt:
      "The claim is everywhere and the argument behind it is good. The number is not a measurement. It comes from a single blog post in May 2026 describing a local experiment on React, and the industry statistics stacked around it come from different vendors counting different things.",
    categorySlug: "security",
    tags: [
      "vulnerability-disclosure",
      "ai",
      "patching",
      "exploitation",
      "research",
      "metrics",
    ],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1704265586142-db3e17d0dea0${P}`,
    body: `You have seen the line. Exploit development used to take thirty days; now it takes thirty minutes. It appears in vendor decks, conference abstracts and newsletter subject lines, usually with no source attached.

It has a source. It is one person, one afternoon, and one experiment — and the person who did it is more careful about it than most of the people quoting him.

## What was actually done

Security researcher **Himanshu Anand** published *"The 90 day disclosure policy is dead"* in **May 2026**.

He took React's published security patches — **CVE-2026-23870**, **CVE-2026-44575** and others — and worked from the patch back to an exploit with a language model doing, in his words, most of the heavy lifting on understanding and exploitation.

> 30 minutes. From reading the patch to having a working exploit

The caveats are his own, and they matter:

- The result was a **denial-of-service proof of concept**, not remote code execution
- It was a **local experiment on test applications**
- He notes his own recommendation — treat every critical issue as P0 immediately — sounds extreme, and acknowledges production complexity

So the honest version of the headline is: *an experienced researcher, using an LLM, turned a published patch into a working DoS PoC against a test app in half an hour.*

That is genuinely notable. It is not the same sentence as "attackers weaponise patches in thirty minutes", which is what it has become.

## The stronger evidence is the part nobody quotes

Anand's post has three arguments and the weakest one went viral.

**Duplicate convergence.** He reported a critical e-commerce vulnerability in April and found he was **reporter number eleven** for the same bug, discovered over roughly six weeks.

> Eleven Freaking people found the same critical bug in roughly six weeks.

This is the more consequential claim, because it attacks the other assumption underneath 90-day disclosure: that the finder is rare. If eleven independent people find the same bug in six weeks, the vendor's embargo is not protecting a secret. It is protecting a rumour.

**Copy Fail (CVE-2026-31431).** Discovered by the Xint Code/Theori team — described as a *"732-byte Python script that gives you root on every single Linux distribution"*. AI-assisted discovery took about an hour. Exploitation by Iranian threat actors was observed within days.

**Dirty Frag (CVE-2026-43284, CVE-2026-43500).** Reported by Hyunwoo Kim on 29–30 April. The embargo was broken within hours by an unrelated third party, at a moment when, as Anand puts it, *"zero Linux distributions had a patch available."* Microsoft Defender confirmed active exploitation within 24 hours of disclosure.

Those three are about real vulnerabilities, real attackers and real timelines. They carry the argument. The React number is the one on the slides.

## The statistics stacked around it

Once the claim travelled, other numbers attached themselves to it. The ones in circulation:

| Claim | Note |
| --- | --- |
| 2018: mean time-to-exploit ~2.3 years | Different vendor, different methodology |
| 2024: ~56 days | Different vendor again |
| 2025: ~23 days | |
| 2026: ~10 hours | |
| "Mean time to exploit has gone negative" | A separate vendor blog |

Read down that column and it looks like a trend line. It is not one. These are separate measurements, by separate organisations, of different populations — some measuring all CVEs, some only exploited ones, some only KEV entries, some counting from disclosure and some from patch availability.

Chaining them produces a curve that no single dataset supports. "Gone negative" in particular means exploitation *before* disclosure, which is a different phenomenon from fast exploit development and cannot be plotted on the same axis.

We made the same point about [an August Patch Tuesday that three outlets counted three different ways](/article/microsoft-august-2026-patch-tuesday-398-afd-zero-day). A number without a stated method is a vibe.

## What is nonetheless true

Do not over-correct. The direction is not in dispute, and there is independent evidence for it in this very story:

- The **Copy Fail** timeline — AI-assisted discovery in about an hour, state-linked exploitation within days — is not from a marketing blog
- The **Dirty Frag** embargo collapse, with confirmed exploitation inside 24 hours and no distribution patched, is a documented failure of the coordinated model
- The [vCenter flaw exploited five days after public disclosure](/article/vmware-vcenter-cve-2026-59310-exploited-reverse-ssh) is an independent data point from a different vendor entirely

Anand's core argument stands on those: the 90-day model assumed rare finders and slow exploit development, and both assumptions are weaker than they were.

## What to do with this

- **Stop quoting "30 minutes" as an industry statistic.** It is one experiment producing a DoS PoC on a test application. Cite it as that, or cite Copy Fail instead.
- **Do not build a trend line from vendor numbers with different methods.** If you must present one, present each figure with its source and its definition, and let the gaps show.
- **Take the duplicate-convergence point seriously.** It is the strongest and least-quoted finding here, and it argues for shorter embargoes on the same evidence that argues for faster patching.
- **Measure your own window.** Time from vendor patch to your deployment is a number you actually own, and it is the only one in this discussion you can act on.

The irony of a claim about AI-accelerated exploitation is that it spread the way it did for entirely pre-AI reasons: a good round number, an alarming comparison, and nobody clicking through to the caveats the author put in his own post.`,
  },
  {
    slug: "shai-hulud-2-npm-worm-secrets-outlive-the-cleanup",
    title:
      "The npm worm's real payload was 27,000 public repositories full of other people's secrets",
    excerpt:
      "Shai-Hulud's second wave hit somewhere between 600 and 800 packages depending on who counted. The packages were pulled within days. The credentials it published to public GitHub repos are what produced breaches months later — including Suno's.",
    categorySlug: "security",
    tags: [
      "supply-chain",
      "npm",
      "malware",
      "credentials",
      "open-source",
      "worm",
    ],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1777672683584-8b8ee646d644${P}`,
    body: `**Shai-Hulud 2.0** compromised npm packages uploaded between **21 and 23 November 2025**. The registry cleaned up within days. Nine months later it is still producing breaches, and the reason is that the packages were never the payload.

## Nobody agrees how big it was

| Source | Packages compromised |
| --- | --- |
| One analysis | **796** unique packages backdoored |
| Another | "over 700" |
| Another | **600–800** |

Malicious GitHub repositories created: **over 25,000** by one count, **more than 27,000** by another.

We are reporting the range rather than picking a number, because the counts were taken at different moments during an actively spreading incident and none of the published figures states its cutoff. Anyone quoting a single precise figure for this campaign is quoting one vendor's snapshot.

Named organisations affected include **Zapier**, **PostHog** and **Postman**. The campaign also spread from npm into **Maven**.

## How it worked

The malware executed during npm's **preinstall** phase — before any of your own code ran, and before most tooling was watching — via a script named \`setup_bun.js\`, which dropped a heavily obfuscated payload, \`bun_environment.js\`.

What it collected:

- **GitHub Personal Access Tokens**
- **npm authentication tokens**
- Cloud credentials for **AWS, GCP and Azure**

And then it did the thing that makes this campaign different from every other registry compromise: it **published the stolen secrets to a public GitHub repository under the victim's own account**.

Not to attacker infrastructure. To a public repo, in the victim's name, indexed and readable by anyone.

## Why that choice is the whole story

Exfiltrating to attacker-controlled infrastructure gives defenders something to work with — a domain to block, a server to seize, an IOC to distribute. Publishing to the victim's own GitHub gives them none of that.

It also converts a time-limited theft into a permanent public dataset. The worm's operator does not need to hold the credentials. Nobody needs to. They are simply *available*, to anyone who thought to look, for as long as they remain valid.

**GitGuardian** measured exactly this. Analysing **4,645** of the repositories, it found **11,858 unique secrets**, of which **2,298 were still valid and publicly exposed** as of **24 November 2025** — days into the incident, with the industry already responding.

That is roughly a **19% survival rate** on secrets that everyone knew were public.

## Nine months later

The clearest illustration is a breach nobody initially connected to this campaign.

The AI music company **Suno** was compromised in November 2025 when a single employee's machine was infected by Shai-Hulud and their GitHub and cloud credentials were harvested and auto-published. A person using the handle "ellie.191" used those credentials to reach Suno's repositories and customer records — and **Socket's analysis is explicit that it cannot determine whether that person deployed the worm or simply found the credentials in a public repo.**

The second possibility is the one that should worry you. It means the intrusion required no relationship with the malware campaign at all. Someone read a public repository.

We covered [what that breach did and did not show](/article/suno-leak-what-the-viral-version-gets-wrong): 55 million customer records, and a company that told nobody for eight months.

That is what an incomplete rotation costs. The same pattern produced [the poisoned LiteLLM releases](/article/litellm-poisoned-releases-cloudsek-2500-organisations), where a publishing token survived the cleanup after a different compromise and was used a week later against an unrelated project.

## The lesson people took, and the one they should have

The lesson taken from Shai-Hulud was about **npm**: pin versions, audit dependencies, disable install scripts. All correct, all worth doing.

The lesson available is about **rotation**.

A registry compromise is over when the packages come down. A credential compromise is over when every credential is rotated — and "every" includes the ones no human logs in with: publishing tokens, deploy keys, CI service accounts, machine identities. Those are the ones that get missed, because nothing breaks when they are left alone, and nothing alerts when they are used.

## What to do, if you have not already

- **Assume any credential present on a developer machine or in CI between 21–23 November 2025 is public.** Not "possibly compromised" — public.
- **Rotate machine identities, not just user ones.** Publishing tokens, deploy keys, CI service accounts, webhook secrets.
- **Search GitHub for repositories under your own org's accounts that you did not create.** The worm published under victim identities; the evidence may be sitting in your own namespace.
- **Disable npm lifecycle scripts by default** (\`npm config set ignore-scripts true\`) and allow them per-package where genuinely needed. The payload ran at preinstall.
- **Treat "we rotated after that incident" as a claim to verify, not a fact to record.** The LiteLLM case turned on a rotation everyone believed was complete.

The uncomfortable arithmetic: 2,298 secrets were still valid and public *during* the response, with maximum attention on the problem. Nobody has published a figure for how many are still valid now.`,
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
