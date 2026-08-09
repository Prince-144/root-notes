/**
 * One-off: three researched drafts — AI, Security, Startups.
 * Every figure here comes from a source read this session; where outlets
 * disagreed, the primary account was used and the conflict noted in-copy.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "../payload-types";

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  // Union from the generated types, so an invalid slug fails here not at runtime.
  categorySlug: Article["categorySlug"];
  tags: string[];
  readingMinutes: number;
  coverImageUrl: string;
  body: string;
};

const DRAFTS: Draft[] = [
  {
    slug: "deepseek-agent-autonomous-attack-jesta-proxyjacking",
    title: "An AI agent ran a five-day intrusion on its own — and researchers made it name the model that was driving it",
    excerpt:
      "Jesta Security exposed a lab, watched a DeepSeek-powered agent work it for five days across 871 sessions, then steered the agent into printing its own model string mid-attack. Its target list held 1,283 hosts with working credentials.",
    categorySlug: "ai",
    tags: [
      "ai-security",
      "autonomous-agents",
      "deepseek",
      "threat-intelligence",
      "agents",
      "llm",
      "exploitation",
    ],
    readingMinutes: 6,
    coverImageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `The interesting claim in [Jesta Security's research](https://jesta.ai/blog/darkreasoning) is not that an AI agent attacked something. It is that the researchers got the agent to tell them which model it was, in the middle of the intrusion.

The Tel Aviv firm exposed lab infrastructure and waited. What arrived worked the environment for **five days** across **871 individual sessions** — SSH connections, one command per session, with deliberate pauses in between.

## How they knew it wasn't a person

The tells were behavioural before they were technical.

The operator ran **retry loops that reworded the same failed command** rather than diagnosing why it failed. And when a read returned nothing, it **invented a value and hardcoded it** instead of erroring — the specific failure mode of a model that must produce output, applied to a task where being wrong has consequences.

A human operator gets frustrated and changes approach. This one rephrased.

## Making the model identify itself

Jesta seeded the environment with material designed to provoke a response from a language model, then manipulated the attacker's logic path until the model included its own identifier in a command it executed:

\`\`\`
$ /usr/sbin/[redacted] --model=deepseek-v4-flash-free
\`\`\`

That line ran on their infrastructure, during a live intrusion. Jesta describes it as the first documented identification of the exact model behind an attack while the attack was still happening.

Prompt injection is usually discussed as something done *to* defenders. Here it was the defence.

## What it was actually for

Not espionage. **Proxyjacking**.

The agent's job was to compromise weakly secured servers and install **MicroSocks** SOCKS5 proxies, turning each machine into a relay. The product is anonymity infrastructure — exit nodes for someone else's scanning and intrusions, sitting between an operator and anything they do next.

Steered into surrendering its own tasking, the agent produced a target list of **1,283 hosts, each paired with working credentials**. Roughly a thousand other victims were worked the same way.

## Autonomous, but on a leash

Worth being precise, because "autonomous AI attack" is doing heavy lifting in headlines.

The agent followed a predetermined playbook. What it did without an operator was handle failure: when direct binary retrieval didn't work, it switched to **base64-encoded delivery** on its own and carried on.

That is the meaningful capability. Not creativity — **persistence through friction**, at machine patience, across 871 sessions, without anyone watching. The expensive part of intrusion has always been a human sitting there when things break. That is the part that just got cheap.

## What the researchers do not claim

Jesta says the infrastructure it mapped is only what was discoverable, and that the real victim count is "almost certainly higher."

The activity is linked to a Chinese threat actor, but the model being Chinese-developed and the operator being Chinese-speaking are separate facts that reinforce each other in headlines more than in evidence. The model here is a tool the operator chose — cheap, capable, and available.

## What to take from it

- **Credential hygiene is the whole story.** 1,283 hosts with working credentials is not an exploit chain. It is weak or reused access at scale.
- **Watch for the machine tells.** Long-running low-and-slow SSH activity with reworded retries looks like a misconfigured script until you read the sequence.
- **Check for unexpected SOCKS proxies.** A MicroSocks process on a server nobody deployed it to is the payload, not the intrusion.
- **Rented and lightly-managed servers are the target class.** The value is not what is on the box. It is that the box has an IP address nobody is watching.`,
  },
  {
    slug: "sctphantom-cve-2026-64564-linux-kernel-container-escape",
    title: "A use-after-free sat in the Linux kernel since 2008 — and an AI research pipeline is what finally found it",
    excerpt:
      "SCTPhantom (CVE-2026-64564) traces to Linux 2.6.25 and has been in every kernel since. Tencent's lab got root on five distributions and escaped a container to host root in six of eight attempts, without CAP_NET_ADMIN or CAP_SYS_ADMIN.",
    categorySlug: "security",
    tags: [
      "linux",
      "kernel",
      "vulnerability",
      "container-security",
      "privilege-escalation",
      "ai-security",
      "patch-management",
    ],
    readingMinutes: 6,
    coverImageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `The bug is eighteen years old. It arrived in **Linux 2.6.25** in 2008 and has been in every kernel since, which means it has shipped in essentially every Linux system running today.

**CVE-2026-64564**, called *SCTPhantom* by the people who found it, is a use-after-free in the kernel's SCTP networking code. Tencent scores it **8.5** under CVSS v4.0; NVD had not assigned a score as of 7 August 2026.

## The logic error

SCTP lets one connection run across multiple network paths, and lets peers add or remove addresses mid-connection. That reconfiguration is where the flaw lives.

The kernel **checks a delete request against the packet's source address, but then acts on a path it selected using a different address from inside the message**. One message can add an address, delete it, then issue a wildcard delete — freeing the path and leaving the kernel using the dead pointer.

The two addresses are supposed to be the same. Nothing enforced that they were.

## What it gets an attacker

Local privilege escalation to root, and container escape.

Tencent Zhuque Lab got root on **Debian 13, Ubuntu 24.04, Rocky Linux 9, RHEL 9 and OpenCloudOS**. An early exploit needed particular sysctls enabled; a later version removed that requirement by using per-socket configuration instead.

The container result is the one to read twice. The escape test granted **neither CAP_NET_ADMIN nor CAP_SYS_ADMIN** — no elevated networking or admin capability — and reached **host root in six of eight attempts**.

## Where it doesn't reach

Two limits are worth stating, because "18-year-old kernel flaw" invites panic.

**SCTP has to be reachable.** It is not a protocol most systems use, and where the module isn't loaded there is nothing to attack.

**Exploitability varies with the sandbox.** The openKylin advisory for the same bug reports only kernel panic and denial of service — not container escape. That is not a contradiction so much as evidence that container runtime, seccomp profile and user-namespace configuration materially change the outcome.

As of 7 August there was **no public exploit code**, and the flaw was **not in CISA's KEV catalog**.

## Fixing it

The patch refuses deletes that target the message's own processing path. Fixed stable kernels, released **3 August**: **7.1.6, 6.18.42, 6.12.101 and 6.6.148**.

One trap: distributions routinely backport security fixes without bumping the version string, so a kernel that looks old may be patched and a kernel that looks new may not be. Check your distribution's tracker, not \`uname -r\`.

Where SCTP isn't needed — which is most places — **blacklisting the module removes the attack surface outright** and is the more durable answer than tracking the patch.

## The part that isn't about SCTP

Tencent credits the discovery to **Corvus AI**, a multi-agent pipeline built for kernel research.

That is the detail with consequences beyond this CVE. Eighteen years of human review, fuzzing and audit did not surface this, and a machine pipeline did. The same economics that let an attacker run an intrusion unattended let a defender run code review unattended, and the dormant-bug backlog in old, complex, widely-deployed C is enormous.

Expect more findings like this — and expect the disclosure queue to feel the load.`,
  },
  {
    slug: "paytm-vijay-shekhar-sharma-one97-forty-percent",
    title: "Paytm's founder sold 40% of his company to survive 2003 — the part before that is worse",
    excerpt:
      "Vijay Shekhar Sharma left his first company two weeks before his shares vested, ran an astrology call centre to keep One97 alive, and was dodging his landlord at dawn. Paytm didn't arrive until 2010.",
    categorySlug: "startups",
    tags: ["paytm", "founders", "india", "startup-funding", "vc", "fintech"],
    readingMinutes: 6,
    coverImageUrl:
      "https://images.unsplash.com/photo-1560264280-88b68371db39?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `Ask what Paytm is and the answer is a payments company founded in 2010. Ask what it cost to still be standing in 2010 and the answer is longer, and mostly not about payments.

This account follows [Vijay Shekhar Sharma's own telling](https://www.outlookbusiness.com/magazine/business/story/go-big-or-go-home-3401), which differs in places from the version that circulates on startup blogs. Where it does, the numbers below are his.

## Two weeks short

Sharma started writing web programs in his third year of engineering, earning his first ₹1,000 from client work that included Jet Airways. After graduating he founded **XS Corps** with three friends, building content management systems for media houses — Living Media, Indian Express — and job portals.

At the end of 1999 an American company offered to acquire it, in a deal valued around **$1 million**: ₹1 crore in cash plus stock. His share came as **₹25 lakh paid across 12 tranches**, plus a salary.

He left after **11.5 months** — two weeks before his shares vested.

That is the detail worth sitting with. The widely repeated line is that he "sold a company for $1 million." What he actually walked away with was a fraction of it, and he walked before the stock was his.

## The astrology years

**One97 Communications** was founded in early 2001. The idea was a reverse phone directory — type a number, get the owner — which required data the telcos were not going to hand over. They wanted content instead.

So One97 became a content business. At one point that meant **40 astrologers working in three shifts**, delivering readings over the phone.

This is the part that gets edited out of founder stories. The company that became India's most prominent payments business spent its early years staffing an astrology line, because that was the revenue the distribution partners would actually pay for.

## 2003, and the 40%

By 2003–04 One97 was out of money. In Sharma's words:

> The landlord called thrice for the month's rent. I had to sneak into the house late night and get out at dawn before he could catch me.

He took odd jobs — corporate training, setting up email — making **₹500** on a good day.

Two things changed it. In 2004, Bharti Airtel CFO **Sanjay Baweja** wrote him a cheque for **₹5 lakh**. Sharma's line on it: *"I will never forget that... it brought me back to life."*

Then **Peeyush Aggarwal** backed the company with **₹8 lakh in cash plus ₹8 lakh in office space and technology**, taking **40% equity**.

Note the correction there. The version that circulates says he "sold 40% for a paltry ₹8 lakh." His account puts the total at roughly double that, part of it in kind. It was still a punishing price — it was not quite the number the retellings use.

By 2006 One97 was doing **₹5 crore** in revenue with positive cash flow.

## Paytm was a reaction, not a plan

The pivot came in **June 2010**, watching Apple's iPhone announcement. Sharma's read was that the feature-phone content business he had spent nine years building was going to die.

Paytm launched as a consumer payments product — mobile recharges first. Deliberately small: one real problem, no grand claim.

The rest moved fast by comparison. In 2014, after Flipkart raised $1 billion, Paytm launched a marketplace. In **March 2015** it raised its first external funding: **$200 million**.

Fourteen years from the first company to the first big cheque.

## What's actually transferable

- **The survival years are not a prologue.** Astrology call centres and ₹500 training gigs kept the company alive long enough for the opportunity to exist. That was the work, not a detour from it.
- **Selling cheap under duress is a real cost.** 40% for ₹16 lakh looks brutal now precisely because the company survived. Most companies at that point don't, which is why the price was what it was.
- **The pivot came from reading a product launch, not a market report.** He watched what the iPhone meant for his customers' handsets and concluded his existing business had an expiry date.

And if you came here for a rejection story — this is the one. [Zomato's founders never faced a wall of investors saying no](/article/zomato-founding-story-rejection-myth). Sharma was hiding from his landlord.`,
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
