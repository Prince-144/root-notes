/**
 * Long-form drafts — 31 August 2026.
 *
 * Disclosure note on the Claude Code piece: this site's research is done with
 * Claude Code, and the core of the workflow is asking it to summarise web
 * pages. That is the exact operation the attack abuses, in the exact
 * configuration named. The article says so at the top rather than in a footer,
 * because a reader deciding how much to trust these pages is entitled to weigh
 * it. Same handling as the Claude outage and Mythos 5 pieces.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts picks one paragraph per section
 * by score — standalone digits and length win, opening on a back-reference
 * loses. The paragraph that answers each heading is written to win.
 *
 * Fairness note: Anthropic's "working as designed" reads as a brush-off in a
 * headline and is not one — the claim is that Auto Mode was never a security
 * boundary. The article makes that distinction rather than using the quote as
 * a gotcha.
 *
 * Cover note: all three downloaded and viewed. The bench is illustrative; the
 * drops were reportedly at a picnic table and the article does not claim the
 * photo shows the location.
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
    slug: "claude-code-prompt-injection-refusal-became-the-exploit",
    title:
      "The model refused to run the attacker's decoder, so it wrote its own — and that was the exploit",
    excerpt:
      "Johann Rehberger chained a series of individually harmless steps into code execution on a machine running Claude Code in Auto Mode, starting with nothing more than asking it to summarise a website. The step that makes it work is the safety refusal. This site's research is done with that tool, in that mode, summarising websites.",
    categorySlug: "ai",
    tags: [
      "prompt-injection",
      "claude-code",
      "ai-agents",
      "anthropic",
      "supply-chain",
      "sandboxing",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1765410850770-7d7bc8928f17${P}`,
    body: `Before anything else: **Root Notes is researched with Claude Code**, and the workflow is largely asking it to fetch and summarise web pages. That is precisely the operation this attack starts from, in precisely the configuration named below.

You should factor that in when reading this piece, which is why it is the first line rather than a note at the bottom.

## What was demonstrated

Security researcher **Johann Rehberger**, who publishes as **wunderwuzzi**, built a chain that ends in code execution on a machine running **Claude Code with Opus 5 in Auto Mode** — the default since mid-August 2026.

The steps, in order:

1. Ask Claude Code to **summarise a website**.
2. Get it to use **curl** rather than its own WebFetch tool.
3. The site redirects to a poisoned **ZIP** containing Base85 and zlib-encoded files, plus a malicious **struct.py**.
4. Claude **refuses** to run the attacker-supplied binary decoder — and writes its own decoder instead.
5. **Python module shadowing**: the malicious struct.py loads in place of the standard library module of the same name.
6. Obfuscated code executes a remote payload.

Rehberger demonstrated launching a calculator and writing files, and separately, spawning **headless Claude Code instances with their own tool access** and running reconnaissance commands.

Across three variants tested five times each, success ran between **60%** and **80%**. He notes those are small samples.

## Step four is the whole story

Look again at what happens in the middle.

The model is handed a binary and asked to run it. It declines — which is the correct, safe, trained behaviour. Then, being helpful, **it writes its own decoder to accomplish the task another way**.

The refusal did not stop the chain. It routed around it. An attacker who anticipated the refusal got a decoder written by the model itself, which no filter was ever going to flag, because it was not attacker-supplied — it was generated in response to a reasonable-looking request.

Safety behaviour that produces a helpful alternative is not a wall. It is a detour sign. That is a genuinely hard problem, and it does not have an obvious fix, because the alternative — refuse and stop dead — is the behaviour that makes an assistant useless.

## No single step is malicious

That is why the classifier does not catch it.

Fetching a URL is normal. Using curl is normal. Downloading an archive is normal. Declining to run a binary is *good*. Writing a small decoder is the most ordinary thing a coding assistant does all day. Importing a module is not a decision at all.

The attack exists only in the sequence. Each link is defensible in isolation, and a classifier evaluating actions one at a time will approve every one of them.

## Anthropic's response, read fairly

The company's position is that the behaviour is **working as designed**, and that **Auto Mode is a convenience feature backed by a best-effort classifier, not a security guarantee**.

In a headline that reads as a shrug. It is not, and it is worth separating the two claims.

The first is uncomfortable: the model doing what it did — refusing, then helping — is the model behaving correctly by its own training. The second is the substantive one, and it is a statement about what Auto Mode is for. It was built to reduce approval prompts, not to contain a hostile input. People have been treating a convenience filter as a security control, which it was never advertised to be.

That distinction is fair and also not entirely comfortable, because a default that most users will never change is functionally a security boundary whatever the documentation says.

## What this means for this site

Being specific rather than vague about it:

- The research for these articles is done by asking Claude Code to fetch and summarise pages, many of which are security sites and some of which link onward.
- Every one of those pages is untrusted input, and this session's own instructions treat tool output as data rather than instructions — which is the same principle Rehberger is testing.
- The practical protection is not the classifier. It is that a human reads the output and every claim gets checked against a primary source where one exists, which is why this site keeps saying which source a fact came from.

None of that makes the tool immune. It makes the failure mode visible, which is the most that can honestly be claimed.

## What to do if you run coding agents

- **Sandbox them.** Rehberger's own recommendation, and the only real containment. A coding agent should not have your credentials and your network at once.
- **Do not treat model output as trusted**, including code it wrote for itself.
- **Watch for agents spawning agents.** Headless instances with independent tool access are the escalation here.
- **Understand what Auto Mode actually is** before relying on it. Anthropic has said plainly what it is not.
- **Assume the next chain will look different.** The technique is composition, not any of these six steps.

## What is not established

- **Whether this has been exploited in the wild.** No reports.
- **Success rates beyond the small sample** Rehberger flags himself.
- **Whether other agents are susceptible** to the same composition. Nothing here is unique to one vendor in principle.
- **What mitigation, if any, is planned.** Anthropic's statement describes the current design, not a change to it.`,
  },
  {
    slug: "dia-insider-threat-specialist-hand-copied-documents",
    title:
      "He ran the monitoring that catches leakers, so he copied the documents out by hand",
    excerpt:
      "Nathan Vilas Laatsch worked in the Defense Intelligence Agency's Insider Threat Division, enabling user activity monitoring on people with access to DIA systems. When he decided to pass secrets to a foreign government, he transcribed them at his desk on paper. He has pleaded guilty, and the plea recommends 11 to 18 years.",
    categorySlug: "world",
    tags: [
      "insider-threat",
      "espionage",
      "dia",
      "fbi",
      "data-loss-prevention",
      "sentencing",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1775770888986-0df8ac7d17c5${P}`,
    body: `**Nathan Vilas Laatsch**, **29**, an IT specialist at the **Defense Intelligence Agency**, has pleaded guilty to attempting to pass classified national defence information to a foreign government.

He worked in the DIA's Office of Security. His duties included **enabling user activity monitoring on people with access to DIA systems** and supporting law enforcement with insider threat tooling. In spring 2025 he was assigned to the **Insider Threat Division** — the unit whose job is finding leakers.

The FBI's **Roman Rozhavsky** put it exactly: by his own admission, Laatsch offered classified information to a foreign government, the very thing he was supposed to prevent.

## The detail that matters technically

He did not exfiltrate anything over the network. He did not email files, upload them, or copy them to a share.

Between **28 and 30 April** and again between **15 and 27 May 2025**, he **transcribed classified documents by hand at his desk** and hid the notes. The man who configured the monitoring knew exactly what the monitoring watched, and he chose the one channel it does not cover — a pen.

Every data loss prevention control in existence works on data in motion through a system: files copied, printed, mailed, written to removable media. None of them see a person writing on paper. It is the oldest exfiltration method there is and it remains completely effective against controls that cost millions.

## The sequence

| Date | Event |
| --- | --- |
| **March 2025** | Emails an offer of classified access from a new account |
| **4–23 April** | The FBI, having learned of the offer, responds undercover |
| **28–30 April** | Transcribes documents at his desk |
| **1 May** | Leaves a thumb drive at a dead drop in an Arlington park |
| **15–27 May** | Transcribes more material |
| **29 May 2025** | Arrested at a second drop |

His initial message offered completed intelligence products, some unprocessed intelligence, and other assorted classified documentation.

Nine documents were recovered from the thumb drive, **eight** of them top secret with sensitive compartmented information — covering **methods of intelligence collection**, intelligence on foreign military exercises, and analysis of their impact.

He chose every file himself. The FBI, posing as the recipient, gave no guidance on what to take, so the selection reflects his own view of what a foreign service would want.

## The recipient

Court documents describe it only as **a friendly foreign government**. The country has not been named.

That phrasing is doing something. Espionage prosecutions usually name the adversary, and where they do not, it is generally because the relationship is more valuable than the point being made. It is also possible the identification is simply not being made public. Either way, nobody outside knows which country it was, or whether it would have collected the material at all.

## Where it lands

The plea agreement recommends **11 to 18 years**, including time served. The court can impose up to **life** and a **$250,000** fine.

He waived his right to an attorney and confessed at arrest.

## What an organisation can actually take from this

- **Privileged access to the monitoring is privileged access.** The people who administer detection can see its blind spots, and that role needs its own oversight.
- **Rotate and separate insider-threat duties.** One person configuring monitoring and having clearance to the material it protects is a concentration risk.
- **Accept that DLP has a paper-shaped hole**, and stop treating clean DLP logs as evidence of nothing happening — the same point [CISA made this week about detection tools being only as good as the people and processes around them](/article/cisa-tale-of-two-socs-aa26-237a-red-team).
- **Behavioural indicators outrank technical ones here.** He was caught because he contacted a foreign government, not because a system flagged him.

## What is not established

- **Which country** he believed he was contacting.
- **His motive** beyond a reported disenchantment with the current administration.
- **Whether the foreign government would have collected the material.**
- **Whether anything else left the building** before March 2025.`,
  },
  {
    slug: "cisa-most-exploited-flaws-unforgivable-since-2007",
    title:
      "Three of the ten most exploited weaknesses were called unforgivable in 2007",
    excerpt:
      "CISA's review of 2024 and 2025 finds that the flaws attackers actually use are injection, input validation and path traversal — the same list as two decades ago. Seven of the ten most frequent weaknesses on the exploited-vulnerabilities catalog account for 41.5% of everything on it. CISA blames culture and workflow, not difficulty.",
    categorySlug: "security",
    tags: [
      "cisa",
      "vulnerabilities",
      "secure-by-design",
      "cwe",
      "appsec",
      "research",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1752367210032-f39cf9fbe875${P}`,
    body: `**CISA** published a vulnerability review on **28 August 2026** covering **2024** and **2025**. Its conclusion is not that attackers have got cleverer.

Three of today's ten most frequent weakness types would have been classed as **unforgivable** by MITRE's standard from **2007**.

## What is actually being exploited

Not novel memory corruption. Not exotic cryptographic failures. This:

- **Improper input validation** (CWE-20) — the single most common weakness across both the KEV catalog and CVEs generally
- **Injection**: cross-site scripting (CWE-79), OS command injection (CWE-78), SQL injection (CWE-89)
- **Path traversal** (CWE-22)

Seven of the ten most frequent weakness types on the Known Exploited Vulnerabilities catalog account for **41.5%** of everything on that list. Seven of the ten most frequent in 2024 fall into MITRE's category of stubborn weaknesses. Three of the top five KEV entries came from holes that had simply never been fixed.

Memory safety and improper input validation together make up **16.7%** of 2025 KEV entries.

## CISA's explanation is about organisations, not engineering

The agency's own words: threat actors continue to succeed, in part, because **simple, preventable software weaknesses remain unaddressed**.

It attributes their persistence to **organisational culture, developer workflows, and systemic gaps in Secure by Design adoption** — explicitly not to technical complexity.

That is a stronger claim than it first appears. Nobody is arguing that SQL injection is hard to prevent. Parameterised queries have been the answer for twenty-five years, they are the default in every modern framework, and every developer has been taught them. The persistence is not a knowledge problem. It is that shipping is measured and not shipping this particular bug is not.

## This month, in one paragraph

Everything above matched what this site has been writing all month, which is what makes the report worth reading rather than filing.

[Kaltura's unvalidated PHP unserialize sat byte-identical across 21 releases from 2015](/article/kaltura-mwembed-unserialize-eleven-years-unpatched). [GiveWP chained an unsafe unserialize helper into command execution](/article/givewp-cve-2026-82222-unserialize-registration-disabled). [Gitea's code injection was reachable because registration is open by default](/article/gitea-cve-2026-60004-authenticated-means-nothing). [ownCloud's authentication bypass, fixed in 2023, took nuclear research records this year](/article/owncloud-2023-flaw-philippine-nuclear-records-stolen).

Deserialisation, injection, an authorisation check that trusts the wrong thing, and a patch nobody applied. Not one of them required anything to be invented.

## The uncomfortable implication

If the exploited weaknesses have not changed in two decades, then two decades of security investment has not moved the thing that actually causes breaches.

That does not mean the investment was wasted — the counterfactual is unknowable, and the attack surface grew enormously over the same period. But it does mean that a strategy built around detecting sophisticated attackers is optimising for the minority case. The majority case is a category of bug that was solved before some of the affected developers were born.

## What to do

- **Test for the boring things first.** Injection, traversal and input validation cover the bulk of what is actually exploited.
- **Make the secure path the default path.** Frameworks that make injection hard work; guidance that makes it forbidden does not.
- **Track unfixed holes as a category.** Three of the top five KEV entries were flaws that had never been remediated, not new discoveries.
- **Read the report against your own backlog** rather than against the threat landscape. The gap is likely to be in the tickets nobody prioritised.

## What is not established

- **Which vendors** are responsible for the bulk of these. CISA does not name them.
- **Any enforcement mechanism** for Secure by Design. There is none proposed.
- **Whether the trend is improving or worsening**, as distinct from persisting.
- **How much of the KEV catalog reflects what is exploited** versus what is noticed and reported.`,
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
