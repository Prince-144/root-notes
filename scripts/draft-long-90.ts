/**
 * Drafts the 7 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-90.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-90.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-90.ts --update
 *
 *   1. Chrome 155 (security). 247 fixes in one release is the story, and the
 *      credits are the explanation: a visible share of them are AI-assisted
 *      reports. Reported flatly — the vendors named are named because the
 *      release notes name them, and nothing here is an endorsement.
 *   2. Handlebars.js (security). Two RCEs in a library with 172 million
 *      monthly downloads. The validator checked the node types it expected
 *      and compiled everything else straight into JavaScript.
 *   3. Atlassian CVE-2026-21589 (security). The stated limit — you must know
 *      the exact path — is not a limit on an off-the-shelf product whose
 *      paths the vendor documents.
 *
 * Primary sources: Google's release notes as reported, the Handlebars
 * advisories, and Atlassian's advisory of 5 October. Where a detail comes
 * only from reporting of release notes, the piece attributes it that way.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - Chrome: the browser's own listing, which is the product being patched.
 *   - Handlebars: a JavaScript project with its lockfile open, which is where
 *     a dependency like this actually lives.
 *   - Atlassian: a developer screen, which is what these servers hold and serve.
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
    slug: "chrome-155-247-security-fixes-and-what-the-credits-say-about-who-is-finding-bugs",
    title:
      "Chrome shipped 247 security fixes in one release, and the credits show where that number is coming from",
    excerpt:
      "Chrome 155 went to Stable on 7 October with 247 security fixes, four of them critical use-after-free bugs. None were exploited. The interesting part is the attribution list: a visible share of the reports are credited to researchers working with AI assistants, which is the mechanism behind the CVE numbers everyone has been quoting.",
    categorySlug: "security",
    tags: [
      "google-chrome",
      "browser-security",
      "use-after-free",
      "vulnerability-disclosure",
      "ai-assisted-research",
      "bug-bounty",
      "patch-management",
      "cve",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1762330916606-535dbcfd4a57${P}`,
    body: `Google promoted **Chrome 155** to the Stable channel on **7 October 2026** with **247 security fixes**. Four are critical use-after-free bugs scored **9.6**, in Chromecast, the browser process and navigation, alongside an incorrect-authorisation flaw in Site Isolation. At least **53** more are rated high.

None of them is reported as exploited in the wild.

## 247 is not a normal number

A Chrome release usually carries somewhere between ten and forty security fixes. This one carries 247.

That is not a statement about Chrome getting worse. Nothing in the advisory suggests a collapse in code quality, and the absence of any in-the-wild exploitation is the tell: these are bugs found by people looking, not bugs found by victims.

Something changed on the finding side, and the release notes say what.

## What the credits show

Reporting on Google's attribution list describes a pattern worth reading carefully: **twelve entries** are credited to a single researcher at **Anthropic** working with assistance from the company's model, and two more come from **OpenAI Codex Security**. Google found one of the critical use-after-free bugs internally.

Twelve findings in one release from one researcher-and-tool pairing is the detail. It is not a claim that a model found bugs unaided — the credit is to a person, assisted — and it is one release's notes rather than a study. Taken at that altitude, it still says something: AI-assisted research now accounts for a visible, countable share of what reaches a major vendor's security queue.

This is the second time in a week we have written about it from a different direction. Horizon3 used a model to find [the Rejetto HFS flaw where a weak generator and a leaky code path only mattered together](/article/rejetto-hfs-cve-2026-61500-math-random-signed-the-session-and-the-login-leaked-the-seed) — and what the tool contributed there was the connection between two distant parts of a codebase, which is exactly what a human reviewer runs out of attention for.

## The number everyone quoted, explained

Microsoft's report last week put [nearly 40,000 CVEs in the first half of 2026, on a pace to roughly double previous annual totals](/article/microsoft-digital-defense-2026-under-a-day-to-weaponise-and-up-to-sixty-to-patch). That figure was widely read as the world getting more dangerous.

Chrome 155 is what the figure looks like at the level of one product. The software is not newly broken. Finding flaws in it got cheaper, and the output of cheaper finding is a larger number of published vulnerabilities.

Which direction that cuts depends entirely on who is doing the finding. A bug reported to Google and fixed before anyone uses it has been removed from the world. The same capability pointed the other way produces a bug nobody reports.

## Where it lands badly

For a vendor, 247 fixed bugs is an unambiguously good release. For everyone downstream, the consequences are more awkward.

Vulnerability feeds, scanners and compliance processes consume CVEs at whatever rate they are produced, and the people triaging them are the same number of people as last year. A tenfold increase in published flaws with no increase in triage capacity means prioritisation stops being a discipline and starts being a lottery — and the thing most likely to be missed is the ordinary high-severity bug buried under 200 others.

The largest bounty listed in this release is **5,000 dollars**. When finding a bug was expensive and rare, it was worth a great deal more than that. A price is a measure of scarcity, and scarcity is the thing that changed.

## What to do

- Update Chrome and restart it. The fix is in 155.0.8059.39 and later; a browser left open for days has not applied it.
- Check the fleet, not your own machine. Managed estates lag, and four critical use-after-free bugs in the browser process is not a lag worth carrying.
- Do not read the count as risk. Two hundred and forty-seven fixes with no exploitation is a healthy release, and treating volume as severity will exhaust whoever is doing your triage.
- If you run a vulnerability programme, plan for the rate rather than this release. The thing to fix is the process that assumed a few dozen CVEs a week.

## What is not established

- Exactly how the AI-assisted findings were produced, which neither Google nor the researchers have detailed.
- What share of the 247 are AI-assisted overall, as opposed to the entries that name it.
- Whether this release size is the new normal for Chrome or an unusually large batch.
- Whether any of these flaws were independently known to anyone who did not report them.`,
  },

  {
    slug: "handlebars-cve-2026-106446-the-validator-checked-the-shapes-it-expected-and-emitted-the-rest",
    title:
      "Handlebars checked the parts of the template it expected to see, and compiled everything else into JavaScript",
    excerpt:
      "Two flaws in Handlebars.js, scored 9.8 and 9.2, with public proof-of-concept code. The library is downloaded about 172 million times a month. The first lets anything that can pass an object instead of a template string place expressions into the generated code; the second walks a deny list that runs one step too late.",
    categorySlug: "security",
    tags: [
      "handlebars",
      "cve-2026-106446",
      "cve-2026-106445",
      "javascript",
      "template-injection",
      "supply-chain",
      "npm",
      "remote-code-execution",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1653387300291-bfa1eeb90e16${P}`,
    body: `**Handlebars.js** is a templating library downloaded roughly **172 million times a month**. Two vulnerabilities have been disclosed in it with public technical detail and proof-of-concept code: **CVE-2026-106446**, scored **9.8**, and **CVE-2026-106445**, scored **9.2**. Both affect **4.0.0 up to 4.7.10**, and both are fixed in **4.7.10**.

Both end in code execution on the server, and each is a precise, instructive mistake.

## A validator that only knew what it was looking for

Handlebars does not interpret templates. It **compiles** them — turning a template into JavaScript source that is then run. That is why it is fast, and it is the fact everything else here depends on.

Its compile and precompile functions accept not only a template string but a pre-parsed syntax tree, so that an application can parse once and compile later. When they receive a tree, they validate it — but only selected node types: path expressions, number literals and boolean literals.

Everything else passes through and is written into the generated JavaScript as-is.

So an attacker who can hand the library an object where it expected a string can put JavaScript expressions in the fields nobody checks. The advisory lists them: the length on a program's block parameters, a parameter depth that is not a path expression, a string literal whose value is not a string, a path expression whose original is not a string. None of those is validated, all of them are emitted, and what is emitted runs — in the server process when the compiled template renders, or wherever precompiled output is later loaded.

The validation was not wrong about the things it checked. It simply assumed the input was well-formed, which is a reasonable assumption for a parser's own output and the wrong one for anything an attacker can supply.

## A deny list that runs one step late

The second flaw is smaller and sharper.

Handlebars keeps a deny list to stop templates from reaching through an object's prototype into the JavaScript runtime — the standard defence for this class of library, because getting hold of the Function constructor means getting arbitrary code.

Its property lookup returns the value **before** applying that deny list in one case: the constructor property, because constructor is an own property of Function.prototype rather than something inherited. The deny list never sees it.

Given a template the attacker controls, a configuration that allows prototype methods, and any function reachable in the template's data, a template can walk from that function to its prototype, from there to Function.prototype, and take the constructor out through the gap.

Two mistakes, one shape: a check that is correct about what it inspects and silent about everything it does not.

## The third one this week

This is now the third template engine we have written about in a week.

GitLab's AI Gateway shipped a 9.9 where [a prompt template escaped its sandbox and ran commands on the host](/article/gitlab-ai-gateway-cve-2026-90970-a-prompt-template-that-escapes-into-the-host). That was Jinja2 and a sandbox. This is Handlebars and a deny list. The engines differ; the position does not.

A template language is a programming language that someone has decided to make safe by subtraction — start with something expressive, then forbid the dangerous parts. Every such defence is a list of what is not allowed, and every list is a statement that the author thought of everything. The Handlebars deny list missed one own property. The Jinja2 sandbox missed a path back to the runtime. These are the same bug written twice.

## Why 172 million downloads matters more than the score

A 9.8 in an application is a problem for that application. A 9.8 in a library at this volume is a problem for software nobody is thinking about.

Handlebars is a dependency of dependencies. It arrives inside frameworks, build tools, documentation generators, email systems and content pipelines, pulled in by something a developer chose for an unrelated reason. The number of teams running it deliberately is small. The number running it is enormous.

And the exploitable conditions are narrower than the score suggests — the first flaw needs an attacker-supplied object reaching compile, and the second needs a non-default configuration plus a controlled template. Whether a given application is reachable depends on how it feeds the library. Most will not be. The ones that are will not know, because nobody audits the call sites of a transitive dependency.

With proof-of-concept code public, the time to find out is now rather than after someone else does.

## What to do

- Upgrade to 4.7.10. It is a patch release of a library you are probably already carrying.
- Find out whether you carry it at all, and where from. The dependency tree, not the package file, is the thing to search.
- Check your call sites. Anywhere compile or precompile is handed something derived from a request, rather than a template string your code wrote, is the exposure.
- If you set the option that allows prototype methods, turn it off unless you know why it is on. That is the precondition for the second flaw.

## What is not established

- Whether either flaw has been exploited. Nothing published says so.
- How many downstream packages pass attacker-influenced input into compile, which is what decides real-world exposure.
- Who reported the flaws, which the advisories as reported do not make clear.
- Whether other paths into the compiler share the same missing validation.`,
  },

  {
    slug: "atlassian-cve-2026-21589-knowing-the-path-is-not-a-barrier-when-the-vendor-documents-it",
    title:
      "Atlassian says an attacker has to know the exact filename, which for an off-the-shelf product everybody does",
    excerpt:
      "CVE-2026-21589 scores 9.3 and lets an unauthenticated attacker read files from the web application root across eight Data Center products. The advisory notes they cannot list directories and must know the exact path. For software anyone can download and install, that is a description of the attack, not a limit on it.",
    categorySlug: "security",
    tags: [
      "atlassian",
      "cve-2026-21589",
      "confluence",
      "bitbucket",
      "jira",
      "path-traversal",
      "self-hosted",
      "file-disclosure",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1489875347897-49f64b51c1f8${P}`,
    body: `**Atlassian** published an advisory on **5 October 2026** for **CVE-2026-21589**, an arbitrary file access flaw scored **9.3**. An unauthenticated attacker can read specific files inside the web application root directory.

It affects **all versions** of eight Data Center products: **Bitbucket**, **Confluence**, **Jira Service Management**, **Jira Software**, **Bamboo**, **Crowd**, **Crucible** and **Fisheye**.

Atlassian says there is no evidence of exploitation, and that its cloud products are already patched.

## The limitation that is not one

The advisory carries a qualifier that has travelled with every write-up: the attacker has to know the exact name and path of the file, and cannot list or enumerate directory contents.

That sounds like a serious constraint. For bespoke software it would be. For these products it is close to meaningless.

Bitbucket, Confluence and Jira are off-the-shelf products that anyone can download and install. An attacker who wants to know where the configuration file lives does not guess — they install a copy and look, or read the vendor's own documentation, which describes the directory layout because administrators need it. The paths are the same on every installation because that is what shipping a product means.

Not being able to enumerate matters when the filesystem is unknown. Here the filesystem is published.

## What is in the web application root

The scope is files within the deployed application's root directory, which is a narrower target than the whole disk and not a comforting one.

That is where an application keeps what it needs to run: configuration, the settings that tell it how to reach its database, properties files, and whatever an administrator put beside them during an installation that was meant to be temporary. Read access to that region of a Confluence or Bitbucket server is read access to the credentials that server uses.

The product list sharpens it further. Bitbucket is where an organisation's source code lives. Confluence is where it writes down how everything works, including, routinely, things that should never have been typed into a wiki. Crowd is the identity component several of the others authenticate against.

Crucible and Fisheye are on the list too, and they are the ones worth a second thought — code review and repository browsing tools that plenty of organisations installed years ago, still run, and no longer think about.

## Cloud is fine, which is the recurring shape

Atlassian's cloud customers need do nothing. Self-hosted Data Center deployments stay exposed until an administrator upgrades, and most exposed if they face the internet.

That split is the same one we described two days ago when [Exchange Online was mitigated before the advisory existed while on-premises servers had to wait for an administrator](/article/exchange-cve-2026-96940-one-mailbox-credential-and-the-authorisation-check-gave-up). It is becoming the standard structure of a vendor advisory, and it has a consistent consequence: the population still running software itself is the population that spends the window between disclosure and patching exposed.

Who that is is not random. Organisations keep Atlassian on their own infrastructure for the reasons you would expect — regulated industries, government, defence work, anyone whose source code is not allowed to live in someone else's tenancy. The exposure concentrates where the data is most sensitive, every time.

## What to do

- Upgrade every affected installation now. All versions are affected, so there is no safe older release to stay on.
- Find the forgotten ones first. Crucible and Fisheye instances, a Bamboo server left running for one pipeline, a Crowd node nobody owns — those are the installs this advisory will not reach.
- Take them off the public internet. There is no reason for a self-hosted Bitbucket or Confluence to accept connections from everywhere, and that single change outlives this CVE.
- Rotate what the application root holds. If an instance was exposed, treat the database credentials and any integration tokens in its configuration as read.

## What is not established

- Whether it has been exploited. Atlassian says it found no evidence, which covers its own visibility and not yours.
- Exactly which files are reachable, which the advisory does not enumerate.
- Who found and reported the flaw.
- How long it has existed, beyond that all versions are affected.`,
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
