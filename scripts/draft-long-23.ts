/**
 * Long-form drafts — 21 August 2026, second batch.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, and cannot read a table.
 * Each section's strongest paragraph therefore stands alone and carries its own
 * figures.
 *
 * Sourcing note: the Viasat piece is an announcement with a Pentagon
 * endorsement and no published measurement, so it is written as what was
 * claimed against what was shown, rather than repeating the claim.
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
    slug: "arrayref-rust-crates-io-sapphire-sleet-86-minutes",
    title:
      "A crate in three quarters of Rust builds was poisoned and pulled in 86 minutes — compiling was enough to run it",
    excerpt:
      "arrayref has over 245 million downloads. On 20 August a malicious 0.3.7 appeared on crates.io with a dependency impersonating proc-macro2, whose build script fetched a second stage over TLS with certificate validation switched off. Wiz attributes it to a North Korean actor on infrastructure overlaps with two earlier campaigns.",
    categorySlug: "security",
    tags: [
      "rust",
      "supply-chain",
      "crates-io",
      "north-korea",
      "developer-tools",
      "malware",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1697577418970-95d99b5a55cf${P}`,
    body: `On **20 August 2026** somebody published a malicious version **0.3.7** of **arrayref** to **crates.io**.

That name will mean nothing to most readers and everything to Rust developers. arrayref has more than **245 million** downloads and is reported to be present in roughly **75%** of Rust environments — a small utility crate that ended up underneath an enormous amount of software.

The **Rust Security Response Team** removed it about **86 minutes** after publication.

## Compiling is enough

The mechanism is the part worth understanding, because it is not how most people picture a supply-chain attack.

The poisoned arrayref took a dependency on **proc-macro1** — a package impersonating the entirely legitimate and extremely common **proc-macro2** — and that package carried a malicious **build.rs**.

In Rust, **build.rs** is a build script. It runs **at compile time**, on the machine doing the compiling, before anything ships and before anyone runs the program. You do not have to execute the application to be compromised. Running **cargo build** is the execution.

That is why the window matters so much more here than in a normal dependency attack. Every CI runner, every developer laptop, every container image build that pulled dependencies during those 86 minutes ran the script.

## What the script did

It fetched a platform-specific second-stage binary over TLS **after disabling certificate validation**.

Turning off certificate checking in malware is a small detail with a large tell inside it. It means the operator did not want to manage a valid certificate on the delivery host, and it also means the download could be intercepted or replaced by anyone positioned on the path. Whoever wrote this was optimising for convenience rather than for operational security, which is not the profile of a careful long-term implant.

Two more crates from the same maintainer — **internment** and **append-only-vec** — got the same treatment about **20 minutes** later. The Rust team's assessment is that the maintainer's credentials were likely compromised, and that it found no evidence the malicious packages were actually used.

## The attribution, and how firm it is

**Wiz** attributes the attack to **Sapphire Sleet**, a North Korean threat actor, on the basis of infrastructure overlaps:

- Command-and-control endpoints identical to those in the **Mastra** npm attack of **June 2026**
- C2 traffic routed through an IP address used in the **Axios** campaign of **April 2026**
- Shared **Hostwinds LLC** infrastructure across all three incidents

Infrastructure overlap is real evidence and it is not the same as proof. Reused endpoints and hosting can indicate the same operator, a shared service, or one crew borrowing another's infrastructure. Wiz's confidence is its own; we are reporting the basis rather than adopting the conclusion.

What the overlap does establish more firmly is that this is the third package-ecosystem attack from a connected set of infrastructure in five months, across **npm** and now **crates.io**.

## Rust was supposed to be the safe one

The reason this stings is cultural.

Rust's entire pitch is memory safety — a language that makes an enormous category of vulnerability impossible by construction. And it does. None of that has anything to do with this. Memory safety governs what your code can do wrong; it says nothing about whether the code you pulled in is yours.

crates.io has also been comparatively quiet while [npm absorbed the Shai-Hulud worm](/article/shai-hulud-2-npm-worm-secrets-outlive-the-cleanup) and [846 malicious packages in a flooding campaign](/article/npm-flooding-dropper-846-malicious-packages). A smaller ecosystem is a smaller target until it is worth attacking, and 245 million downloads is worth attacking.

## What to do

- **Check whether any build pulled arrayref 0.3.7, internment or append-only-vec on 20 August.** CI logs and lockfile diffs are where the answer is.
- **If a build did, treat that runner as compromised**, not the artefact. The payload ran on the builder.
- **Rotate whatever that builder could reach.** Registry tokens, cloud credentials, signing keys — the standard [CI secrets problem](/article/claude-code-gemini-cli-ci-secrets-novee-black-hat).
- **Pin dependencies and commit your lockfile.** This attack required a build to resolve a new version inside a 86-minute window. A committed lockfile closes that.
- **Use vendored or mirrored registries for production builds.** A cache that lags the upstream by a day would have missed this entirely.
- **Look at typo-adjacent dependency names in your tree.** proc-macro1 against proc-macro2 is the whole trick and it is legible to a human reading a diff.

## What is not established

- **Whether anyone was actually compromised.** The Rust team reports no evidence of malicious use.
- **The attribution.** Wiz's Sapphire Sleet assessment rests on infrastructure overlap.
- **How the maintainer's credentials were taken.** Assessed as compromised; the route is not published.
- **What the second stage did.** The delivery mechanism is described; the payload's behaviour is not.`,
  },
  {
    slug: "citrix-netscaler-cve-2026-19490-auth-bypass-patch-now",
    title:
      "A CVSS 9.3 authentication bypass in NetScaler, no exploitation yet, and every reason to treat that as temporary",
    excerpt:
      "CVE-2026-19490 lets a remote unauthenticated attacker walk past authentication on NetScaler appliances configured as a gateway or AAA virtual server. Nothing has been seen in the wild. Rapid7's advice is to patch on an emergency basis anyway, and NetScaler's history is the argument.",
    categorySlug: "security",
    tags: [
      "citrix",
      "netscaler",
      "vpn",
      "authentication-bypass",
      "patching",
      "perimeter",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1645047573426-8d013c071193${P}`,
    body: `**CVE-2026-19490** is an authentication bypass in **Citrix NetScaler ADC and Gateway**, rated **CVSS 9.3**. It works by an alternative path, requires no credentials and no user interaction, and can be triggered remotely.

A second flaw, **CVE-2026-19489**, a high-severity memory overflow affecting **SIP ALG** configurations, was patched at the same time.

No exploitation has been observed yet.

## Which boxes

Only appliances in particular roles are affected, and they are the roles NetScaler is usually bought for:

- Configured as a **gateway** — SSL VPN, ICA Proxy, CVPN, RDP Proxy
- **AAA virtual servers**

In other words: the configurations whose entire job is authenticating people from the internet.

## Fixed in

| Branch | Upgrade to |
| --- | --- |
| 14.1 | **14.1-73.32** |
| 13.1 | **13.1-63.21** |
| 14.1 FIPS | **14.1-73.32** FIPS |
| 13.1 FIPS / NDcPP | **13.1-37.277** |

Check the exact build rather than the branch. Citrix's affected list spans versions both above and below specific point releases, which is the kind of thing that gets misread at 6pm on a Friday.

## Why "not exploited yet" is not the useful sentence

**Rapid7**'s guidance is to patch on an emergency basis regardless, on the grounds that Citrix products are high-value targets that tend to see exploitation quickly.

That is not caution for its own sake. It follows from where the device sits. A NetScaler in gateway mode is, by design, publicly reachable and holds the authentication decision for everything behind it. There is no segmentation in front of it, because it *is* the front.

And the interval between disclosure and exploitation keeps compressing. [GitLab's CVSS 9.4 went from patch to in-the-wild exploitation in days](/article/gitlab-cve-2026-19478-graphql-directive-delete-public-projects), with watchTowr reproducing it in minutes. [MLflow's SSRF was being scanned for within hours of the CVE being assigned](/article/mlflow-cve-2026-64849-ssrf-redirect-dns-rebinding). "Nothing yet" describes the past.

## The specific danger of an auth bypass here

Most perimeter flaws give an attacker code execution and a foothold. An authentication bypass on a gateway gives them something quieter: **a session**.

A session looks like an employee. It carries whatever entitlements that path grants, it appears in logs as a successful connection, and it does not trip the detections built for exploitation. That is the same reason [the ADFS signing key work matters](/article/adfs-signing-keys-machine-dpapi-golden-saml-ghost-certificate) — anything that lets an intruder arrive already authenticated skips the part of your monitoring that is actually good.

## What to do

- **Patch to the specific fixed build**, this week, not this quarter.
- **After patching, look backwards.** Review gateway session logs for authentications that do not match a known user, device or location. A bypass leaves successful logins, not errors.
- **Rotate session material** and force reauthentication once patched, on the assumption that anything established before the fix survives it.
- **Check whether SIP ALG is configured**, for the second CVE. Most estates do not use it and should not have it enabled.
- **Confirm the appliance is not also serving a management interface to the internet.** It is the recurring finding in every NetScaler incident review.

## What is not established

- **Whether exploitation has begun.** None reported at the time of writing, which is a statement about visibility.
- **Who found it.** Not named in the advisory.
- **How the bypass works.** Citrix describes the class, not the mechanism, which is standard while estates are unpatched.
- **How many appliances are exposed.** No scan count has been published.`,
  },
  {
    slug: "microsoft-removes-wmic-lolbin-ten-year-deprecation",
    title:
      "Microsoft spent ten years removing one command, because criminals used it more than administrators did",
    excerpt:
      "WMIC is not vulnerable. It is a signed Microsoft binary that does exactly what it says, which is why ransomware uses it to delete shadow copies, uninstall antivirus and add Defender exclusions. Deprecated in 2016, finally gone from Windows 11 24H2 and 25H2 — a decade, because you cannot patch a tool that works.",
    categorySlug: "security",
    tags: [
      "microsoft",
      "windows",
      "lolbins",
      "ransomware",
      "detection",
      "hardening",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1678648943658-3ebfeab77d23${P}`,
    body: `Microsoft has removed **WMIC** — the Windows Management Instrumentation Command-line tool — from Windows 11 **24H2** and **25H2**.

There is no CVE. WMIC was never vulnerable. It is a Microsoft-signed executable that has always done precisely what its documentation says, which is exactly the problem.

## What a LOLBin actually is

A **living-off-the-land binary** is a legitimate tool that ships with the operating system and is useful to an attacker.

It defeats several defences at once. It is signed by Microsoft, so signature checks pass. It is already present, so nothing needs to be downloaded and nothing crosses the network for an EDR to inspect. And it is genuinely used by administrators, so its presence in a process tree is not by itself suspicious.

There is nothing to patch. The tool is not broken.

## What WMIC was used for

The three that appear most often in incident reports:

- **Deleting Shadow Volume Copies**, so a ransomware victim cannot restore from them
- **Querying and uninstalling security software**
- **Adding exclusions to Microsoft Defender**, so the payload lands in a folder nothing scans

Every one of those is a legitimate administrative capability. The shadow copy deletion is the one that has cost the most money — it is a standard step in the ransomware playbook, executed with a command Microsoft shipped and signed, seconds before encryption begins.

## Ten years is the story

| Year | Step |
| --- | --- |
| 2016 | Deprecated in Windows Server 2012 |
| 2021 | Deprecated in Windows 10 21H1 |
| 2022 | Made a Feature on Demand in Windows 11 22H2 |
| 2024 | Complete removal announced |
| 2026 | Removed from Windows 11 24H2 and 25H2 |

**A decade** between "we advise against this" and "it is gone".

That is not incompetence, and it is worth understanding why rather than complaining about it. WMIC is in scripts. Not modern scripts — scripts written in 2009 by someone who left, running on a schedule nobody has opened since, in an environment where the person who could tell you what it does retired. Removing a built-in command breaks those silently, and Microsoft's customers are the ones holding them.

The gradual path — deprecate, then make optional, then announce, then remove — is what removing anything from a platform with that much inertia actually looks like.

## Do not expect a quiet quarter

Removing WMIC removes one binary, not the technique.

The replacements Microsoft points to for legitimate work — **PowerShell**, the WMI COM API, .NET libraries — are the same tools already used by attackers who moved on from WMIC years ago. **vssadmin** still deletes shadow copies. The underlying WMI service is untouched, because it is load-bearing.

What this changes is one convenient, heavily-signatured path. Detections written against WMIC command lines will go quiet, and the correct read of that silence is not that the behaviour stopped.

The durable version of the control was never "watch for WMIC". It is watching for **the behaviour** — something deleting shadow copies, something modifying Defender exclusions, something uninstalling security software — regardless of which signed binary asked.

## What to do

- **Find your WMIC dependencies before 24H2 reaches your fleet.** Search scripts, scheduled tasks, SCCM packages and monitoring agents for the string. This is the practical work and it takes longer than you think.
- **Re-express your detections in terms of outcomes**, not tool names. Shadow copy deletion is the alert; the binary that did it is a field in it.
- **Check whether anything in your estate re-enables it.** It was a Feature on Demand before removal, and some builds may still allow installation.
- **Treat this as a template.** The same reasoning applies to every other LOLBin you have not audited, and the list is long.

## What is not established

- **Whether removal is final across all editions and channels.** The reporting covers Windows 11 24H2 and 25H2.
- **What proportion of estates still depend on it.** No figures have been published.
- **Whether attackers see any real cost from this.** The alternatives are documented and already in use.`,
  },
  {
    slug: "viasat-atalanta-argo-software-understanding-what-was-shown",
    title:
      "The Pentagon's CTO wants it as the gold standard — but nobody has published what the tool found",
    excerpt:
      "Four years after AcidRain wiped thousands of satellite modems on the day Russia invaded Ukraine, Viasat says it has spent a year with Atalanta validating that its network is more resilient. The technique is mathematical software analysis. The announcement contains an endorsement, an ambition, and no measured result.",
    categorySlug: "ai",
    tags: [
      "satellite",
      "formal-methods",
      "ai-security",
      "defence",
      "viasat",
      "assurance",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1526666923127-b2970f64b422${P}`,
    body: `On the day Russia invaded Ukraine in **2022**, operatives disabled thousands of satellite modems across Ukraine and other European countries. The malware is known as **AcidRain**, and it hit **Viasat**'s network.

It remains one of the clearest examples of a cyber operation timed to a military one, and of civilian infrastructure being the thing that breaks.

Four years on, Viasat says it has spent the past year working with a company called **Atalanta** on a product named **Argo**, to validate that its network is now more resilient.

## What is being claimed

Argo is described as an AI-assisted tool that combines mathematics with machine learning to analyse software and internet-connected systems for weaknesses more comprehensively than earlier approaches. Atalanta's chief executive, **Anjana Rajan**, frames the underlying capability as **software understanding**, and argues the tools and techniques of yesterday do not scale for today.

Viasat's **Nick Saunders** describes the outcome as a capability to develop an understanding of how their systems are more resilient against attacks, with mathematical backing behind the claim.

The Pentagon's chief technology officer, **Emil Michael**, has said he wants the underlying mathematics to become the Department of Defense's gold standard for cybersecurity.

## What is actually behind the words

"Mathematical backing" is not marketing filler, and it is worth explaining because it is the substantive part.

Conventional security testing is empirical. You scan, you fuzz, you attack, and what you learn is that you did not find anything — which is different from there being nothing. Formal and mathematical methods aim at the other kind of statement: proving that a property holds for **all** inputs rather than the ones you tried.

That is a genuinely stronger claim when you can get it, and it is why defence agencies care. It is also expensive, historically limited to small critical components, and dependent on the model of the system being faithful to the system. The interest in AI here is about scale — using models to do the work of building and checking those representations across code bases too large to handle by hand.

## What has not been published

Everything that would let anyone else evaluate it.

No vulnerability count. No description of what Argo examined or what it found. No statement of what property was proved, over what part of the system, under what assumptions. No independent review. The announcement contains an endorsement from a customer, an endorsement from a government official, and an ambition.

That is not an accusation. It is a description of the evidence available, and it is the same standard we applied to [OpenAI publishing its own safety overhaul](/article/openai-pauses-frontier-rl-astra-critical-cyber-monitoring) and to [Anthropic's account of its evaluation incidents](/article/ai-safety-evaluations-sandbox-escapes-pattern) — a company's account of its own security work is worth reading and is not verification.

The contrast worth holding is [the UK AI Security Institute publishing its own numbers on a model's cyber capability](/article/too-dangerous-to-release-mythos-claim-checked-aisi), methodology included, six days after the vendor's announcement. That is what an outside check looks like when somebody does one.

## Why it still matters

Because the alternative framing — that satellite operators learned nothing from 2022 — is not true either, and the direction is right.

AcidRain worked because modems could be reached and wiped at scale. Any serious work on proving resilience properties of that estate is better than another year of penetration tests finding nothing in particular. If the mathematics is real, it is the correct approach.

The reasonable position is to want the result published.

## What is not established

- **What Argo found.** Nothing has been disclosed.
- **What was proved, and about what.** No property, scope or assumption set has been stated.
- **Whether AI is central or incidental** to the method.
- **Whether anyone outside Viasat and Atalanta has assessed it.** No independent evaluation has been reported.`,
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
