/**
 * Drafts the 10 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-96.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-96.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-96.ts --update
 *
 *   1. ccTLD registry hijacks (security). Three registries taken, HTTPS
 *      certificates issued correctly on the strength of DNS records the
 *      attacker controlled. Google's own post is far more cautious than the
 *      coverage of it, so the piece separates what Google says from what
 *      secondary reporting adds.
 *   2. LMCache CVE-2026-105192 (security). Unpickles the message before it
 *      checks the message type. Unpatched, public proof of concept, and a
 *      9.8 whose assumptions do not match the default binding.
 *   3. ARTEX against South Korean finance (ai). CrowdStrike's write-up, with
 *      the three things coverage gets wrong: Claude Code in the logs is not
 *      the backend, the victim counts come from different outlets and do not
 *      add up, and the confidence is moderate.
 *
 * Primary sources: Google's Chrome security post of 6 October, JFrog's
 * advisory JFSA-2026-001694382 as reported, and CrowdStrike's 7 October
 * write-up.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - ccTLD: fibre into network equipment, the nearest honest referent for
 *     registry infrastructure.
 *   - LMCache: a dark GPU close-up, which is what inference runs on.
 *   - ARTEX: Seoul at dusk, for the sector that was hit.
 *
 * Rejected on the way: a modular synthesizer that a cable search returned as
 * network gear, and a motherboard with GEFORCE RTX and AORUS legible on it.
 * Neither Nvidia nor Gigabyte is in the LMCache story.
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
    slug: "cctld-registry-hijacks-the-certificates-were-issued-correctly",
    title:
      "The certificates were issued correctly — the attackers controlled the DNS, which is all the check asks for",
    excerpt:
      "Three country-code registries were compromised and unauthorized HTTPS certificates were obtained for Google domains and others. No certificate authority broke a rule. Domain control validation proves control of a name, and for a while the attackers had it.",
    categorySlug: "security",
    tags: [
      "cctld",
      "dns-hijack",
      "certificate-transparency",
      "tls",
      "google",
      "chrome",
      "caa",
      "pki",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1624965439943-09e0238644e2${P}`,
    body: `On **6 October**, Google's Chrome security team published a short post about something larger than its length suggests. Attackers compromised the registries behind three country-code domains — **.gh**, **.sl** and **.as** — modified authoritative DNS records, and obtained **unauthorized HTTPS certificates** covering several Google domains and domains belonging to other organisations.

Google's framing is the part worth starting with, because it is more careful than most of what has been written since.

## Nobody broke a rule

Google says it has **no reason to believe the certificate authorities that issued the certificates did anything wrong**. It also says the incidents **did not involve a compromise of Google's systems**.

Both statements are true and together they describe the problem.

A public certificate authority issues on **domain control validation**. The applicant proves they control the name — usually by placing a record in its DNS or a file on its web server — and the certificate follows. That check was designed to answer one question, and it answers it correctly: does whoever is asking control this name right now.

It does not ask whether they are the rightful owner. It cannot. There is no registry of who deserves a domain, only a registry of who has one, and when the registry is the thing that has been taken, the answer the check returns is accurate and useless at the same time.

So the certificates here were not forged. They were issued, properly, to someone who had satisfied the requirement.

## What a certificate buys, and what it does not

A certificate alone does not impersonate anything. It has to be paired with traffic.

But the same compromise supplies both halves. An attacker holding the DNS can point the name at a server they run, and then present a certificate that every browser accepts for that name. At that point the padlock is accurate: the connection really is encrypted, and really is to the server the DNS says is authoritative. It is just not the one the reader meant.

The window matters more than the certificate count. A certificate is valid for months; DNS control can be lost in days. Which is why Google's advice includes restricting issuance to specific accounts and validation methods — to stop an attacker **reusing cached validation to mint new certificates after the hijack has ended**.

## What Google says, and what it does not

This is worth separating carefully, because the distinction has collapsed in most coverage.

**Google says:** three namespaces, authoritative DNS records modified, certificates covering several Google domains and other organisations. Chrome blocked the certificates for Google properties through **CRLSets**, its emergency blocking mechanism, and worked with the issuing CAs to revoke them for everything that is not Chrome. Certificate Transparency data later surfaced **additional organisations, including several leading global brands and widely used online services**, which Google does not name and says it contacted where it could.

**Google does not say:** how many certificates were issued, which authorities issued them, how the attackers passed validation, how the registries were compromised, who did it, or when it started.

Secondary reporting has supplied some of what Google withheld: a count of at least a dozen certificates for Google and YouTube names issued between 22 and 27 September, and named authorities including two that issue free certificates. Those figures come from reading the public Certificate Transparency logs, not from Google. They are plausible and they are not the vendor's account, and a reader should know which is which.

Google also states plainly that it **cannot guarantee its analysis identified every affected domain**.

## The defence lives in the thing that was taken

The standard recommendation after an incident like this is **CAA records** — a DNS record that tells authorities which of them may issue for your domain.

Google recommends it, and then says the quiet part: CAA **cannot prevent certificate issuance during an active DNS hijack**.

Of course it cannot. CAA is a DNS record. An attacker who has taken the registry can change it, or remove it, along with everything else in the zone. Every control in this stack — the validation record, the CAA record, the nameserver delegation — is published through the same system, and that system is what failed.

The one control that does not live in DNS is **Certificate Transparency**. CT is why anyone knows this happened at all. It is a public, append-only log of issued certificates, and it does not prevent a single thing — it only makes issuance impossible to hide. In this incident that was enough to find victims Google had not known about.

The other sentence worth keeping from Google's post is about its own fix: browser-side intervention **should not be relied on to protect your users**. Chrome blocked these certificates for Chrome. That is not the same as them not working.

## What to do

- Search **crt.sh** for your own domains, including the parked ones and the regional variants nobody looks at. That is where this would show up.
- Publish **CAA records**, with account binding where your authority supports it. It will not help during a hijack. It helps afterwards, which is when the second wave of certificates would otherwise be minted.
- Monitor CT logs continuously rather than after a news story. The logs are public and the tooling is free.
- If you hold domains under a smaller ccTLD, understand that your name's security is your registry's security, and that you have no visibility into it.

## What is not established

- How the three registries were compromised, and whether by the same route.
- Who did it, and what they wanted. No actor has been named.
- How many certificates were issued in total, and for how many organisations. Google's own count is not published and it says its analysis may be incomplete.
- Whether any of the certificates were used to intercept traffic, as opposed to merely being obtained.
- When the campaign began. The Certificate Transparency dates show when certificates appeared, not when the registries fell.`,
  },

  {
    slug: "lmcache-cve-2026-105192-unpickled-before-the-type-check",
    title:
      "The cache unpickles the message before it checks what kind of message it is",
    excerpt:
      "A critical flaw in LMCache, the key-value cache layer used in front of vLLM inference servers, lets an unauthenticated attacker run code with a single crafted message. There is a public proof of concept, no patched release, and the container images run as root.",
    categorySlug: "security",
    tags: [
      "lmcache",
      "cve-2026-105192",
      "vllm",
      "ai-infrastructure",
      "deserialization",
      "jfrog",
      "rce",
      "kubernetes",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1605876516612-a04e21021ead${P}`,
    body: `**LMCache** is a distributed key-value cache that sits in front of LLM inference engines, **vLLM** chief among them. It exists to stop a model recomputing attention state it has already computed, which is why it ends up in production serving stacks rather than in experiments.

**JFrog** published an advisory on **7 October** for **CVE-2026-105192**, scored **9.8**. The bug is in its multiprocess transport, and it is the kind that gets taught.

## The order of operations is the bug

The transport accepts connections without authentication. When a message arrives, it **deserialises it with pickle before checking what type of message it is**.

Python's pickle is not a data format. It is a small instruction set for reconstructing objects, and reconstructing an object can mean calling things. Unpickling attacker-controlled bytes is executing attacker-controlled code, which is why the module's own documentation warns against it in the first paragraph.

So the sequence is: receive bytes from anyone, run them, then decide whether they were a message you wanted. One crafted message is remote code execution as whatever user the LMCache process runs as.

Affected builds run from **0.3.9** onward, including the **0.5.5** stable release, the 0.5.6 release candidates and the development branch.

## The score and the default disagree

The 9.8 assumes network reachability, no privileges and no user interaction. Two of those are right and the first deserves an asterisk.

By default LMCache binds to **loopback**, so a stock single-node install is not exposed to the internet. The exposure appears when somebody sets a routable host value — which is exactly what multi-node and Kubernetes deployments do, because that is the point of a distributed cache.

This is a 9.8 that is either unreachable or trivially reachable depending on one flag, and the flag is set by the deployments most likely to matter. Reading the number without the binding gets you the wrong answer in both directions.

We made a related point about a different vendor this week, where [a researcher's speculation about grid impact ended up quoted inside the official CVE description](/article/sungrow-isolarcloud-cve-2026-107194-one-field-set-to-five-ignores-the-password). A severity score is a model with assumptions in it. It is not a measurement of your environment.

## Root in the container

The container images ship with the process running as **root**.

That turns a compromise of the cache into a compromise of the host rather than something contained to a namespace. It is a packaging decision rather than a vulnerability, and it is the difference between the two outcomes here.

## No patch, and a proof of concept the same day

As of the advisory there is **no fixed release**, no vendor security bulletin and no published timeline. Exploit code was posted publicly on the day of disclosure.

Two further identifiers have appeared against the same project: another **9.8** for remote Python execution through a script-submission route, and a **9.4** for an unauthenticated route that returns environment variables — which, in a serving deployment, is where the API keys are. Their patch status is unclear.

The mitigations available now are network ones. Keep the port off routable addresses, restrict it to local or trusted-cluster traffic, and treat any host allowed to connect as a host allowed to run code, because that is what it is. A durable fix means not unpickling untrusted input at all and adding cryptographic peer authentication — a redesign of the transport, not a patch to it.

## Why this keeps happening to AI infrastructure

Exposed inference infrastructure is the second story of its kind here in three days. [A botnet has been sweeping ports 3000 and 4000 for exposed LiteLLM and Gotenberg instances](/article/poellm-canto-incognito-the-c2-address-is-four-words-in-a-poem) and turning what it finds into miners.

The pattern is not that AI software is written badly. It is that this layer is young, it is being deployed fast by teams measured on inference throughput, and a great deal of it was written when the assumption was a trusted cluster network. Pickle over an unauthenticated socket is a perfectly reasonable choice inside a single process boundary and an indefensible one across a cluster, and the code did not change when the deployment did.

## What to do

- Find out whether your LMCache instances bind to anything other than loopback. That single answer is most of your risk assessment.
- Put the transport behind network policy now. A fix is not available to wait for.
- Check whether your images run the process as root, and stop doing that regardless of this bug.
- Rotate anything an environment-variable leak would have exposed if your deployment also exposes that route.

## What is not established

- When a fix will ship. No timeline has been published.
- Whether this is being exploited. We have seen no report of it, and a public proof of concept on day one is not evidence of use.
- The patch status of the two related identifiers.
- Which downstream platforms actually run the vulnerable mode. Several large serving stacks are named in coverage as LMCache users, which is not the same as being configured this way.
- Whether moving to a newer vLLM release addresses this. That claim appears in secondary coverage without confirmation.`,
  },

  {
    slug: "artex-south-korean-finance-the-open-directory-held-the-operators-own-cv",
    title:
      "The server running the intrusions had a browsable folder, and what was in it looked like the operator's CV",
    excerpt:
      "CrowdStrike traced a data-theft campaign against South Korean financial firms to an operator driving ARTEX, an open-source agentic pentesting tool, across several large language models. The research exists because the attacker left their own working directories readable.",
    categorySlug: "ai",
    tags: [
      "artex",
      "crowdstrike",
      "south-korea",
      "ai-assisted-attacks",
      "agentic",
      "deepseek",
      "opsec",
      "financial-sector",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0${P}`,
    body: `**CrowdStrike** published research on **7 October** into a data-theft campaign against South Korean financial organisations, running from late September into early October. The operator drove **ARTEX**, an open-source agentic penetration-testing tool from China, across several large language models.

As with [the ransomware affiliate whose staging server had an unauthenticated file listing](/article/azazel-gentlemen-mcp-as-a-command-channel-and-the-affiliate-who-kept-the-money), the research exists because of what the attacker left readable. Browsable folders on the operator's servers held session logs, configuration files and the model's memory notes — and, among the exposed prompts, personal details that CrowdStrike believes probably identify the operator, without saying so outright.

## ARTEX is not a model

The distinction matters for reading any of this correctly.

ARTEX is an **orchestration layer**. It plans and sequences the steps of an intrusion and routes the reasoning-heavy parts out to external language models. It supplies the loop; somebody else's model supplies the thinking.

In this campaign the model stack was led by **DeepSeek**, with two other models in supporting roles. The operator also had **Claude Code** session logs and memory notes on the server.

That second sentence is the one being misreported, so it is worth being exact. Claude Code appearing in a toolset shows it was on the operator's machine. It does not show that Anthropic's models performed the intrusions, and CrowdStrike's own account puts DeepSeek at the centre of the stack. An attacker who uses four tools has used four tools.

There is a disclosure to make here: this site is written with Claude's assistance, which is noted on our [editorial policy](/editorial-policy) page. That is a reason to be careful with this particular detail, not a reason to leave it out.

## What it actually was

CrowdStrike describes a person steering AI tooling, not an autonomous attack. The argument it makes is narrower and more interesting than "AI did the hacking": that tooling of this kind let **one financially motivated actor run multiple intrusions in a short span**.

That is a claim about throughput, not capability. Nothing here required a technique that a competent human could not perform. What changed is how many targets one person could work in a fortnight.

Attribution is given at **moderate confidence**: a financially motivated Chinese speaker, on the basis of tool choice and Chinese-language prompts. No named group. The infrastructure ran from a machine in Hong Kong, with a second server hosting the ARTEX instance.

## The numbers, and why not to add them

Reported victims include named South Korean banks, and public reporting counts at least nine financial institutions targeted since late September.

The record counts need handling. Different outlets, citing different sources, give different figures: roughly 25,000 affected customers at one bank, 119 at another, 40,000 at a third, and a separate figure of around 68,000 records across a wave of bank incidents that South Korean authorities are investigating for AI involvement.

Those come from separate reports about overlapping but not identical events. They are not components of a total, and anyone adding them is inventing a number. The honest summary is that several institutions were hit, the largest disclosed figure is in the tens of thousands of customers, and the full scope is not public.

## The tool is gone, which changes less than it sounds

ARTEX's maintainer, who goes by a handle online, moved the project to **closed source on 8 October**, citing misuse, and stopped updating it.

That is a defensible response and a limited one. The code has been public; anyone who wanted a copy has one. What closing it changes is the supply of future updates and the ease of casual adoption, which is not nothing — a tool that is one clone away from working gets used by people who would not otherwise build one.

The broader question is the one that keeps arriving in different shapes. An agentic pentest tool is useful for the same reason it is dangerous: it automates the part of an intrusion that used to need an experienced person. Whether access is gated by a vendor's verification, by a licence, or by a maintainer's decision to close the repository, the gate is somebody's judgement about who is asking — and we [wrote recently about how little is behind that judgement](/article/anthropic-cyber-verification-tiers-fewer-refusals-and-who-checks-the-badge).

## What to do

- For financial-sector defenders in the region, CrowdStrike's indicators are the immediate item. The campaign window is recent and the infrastructure is documented.
- Do not reach for AI-specific detection. The intrusions used ordinary techniques faster; what catches them is what catches those techniques.
- Plan for throughput rather than novelty. If one actor can now run nine intrusions where they used to run one, the thing under strain is triage capacity, not the detection logic.
- Treat the OPSEC failure as a reminder, not a reassurance. Two campaigns in a week were documented because the operator left a directory listing enabled. The ones that do not are the ones nobody writes about.

## What is not established

- Who the operator is. CrowdStrike's confidence is moderate, and the personal details in the prompts are described as probably, not certainly, theirs.
- How many organisations were actually compromised, as opposed to targeted.
- Whether the separate incidents being investigated by South Korean authorities are the same campaign.
- What role each model in the stack played, beyond DeepSeek being central.
- Whether any connection exists to incidents reported in Japan. Nothing published establishes one.`,
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
