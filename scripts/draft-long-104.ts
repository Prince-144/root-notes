/**
 * Drafts the second 15 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-104.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-104.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-104.ts --update
 *
 *   1. Chrome full chain (security). XBOW's $250,000 bounty, reported
 *      everywhere this week. The part nobody reported: Google's own tracker
 *      records what it paid for the same three bugs separately, and it comes
 *      to $4,500. Read out of the Chromium issue tracker directly, including
 *      the VRP panel bot's comments, the per-bug rewards, the severity
 *      labels and the CVE fields.
 *   2. GhostAction (security). The 30,000-repository figure is repositories
 *      targeted. The only wave with a measured outcome gave up 26 secrets
 *      from 13 repositories, which is GitGuardian's own number.
 *   3. Operation Lonestar Roundup (world). The DOJ release, read directly.
 *      The unusual part is the eleven email addresses it published, which
 *      moves the detection surface to HR records.
 *
 * Primary sources read directly rather than through coverage:
 *   - Chromium issues 547965190, 547819997, 548509153 and 545820931, which
 *     are public but render only in a browser. The CVE fields and the reward
 *     comments are not in any write-up of this story.
 *   - Chrome release notes for 152.0.7977.64 (25 August) and 152.0.7977.82
 *     (3 September), which carry the credit lines. Secondary sites credited
 *     CVE-2026-85045 to the wrong researcher by confusing it with
 *     CVE-2026-85046, a different bug on a different issue.
 *   - GitGuardian's GhostAction post, checked specifically for which wave
 *     each statistic belongs to.
 *   - justice.gov's own release for the indictment detail.
 *
 * The DOJ published eleven Gmail addresses as indicators. This batch
 * deliberately does not reprint them: they are built around plausible
 * American names, the scheme ran on stolen identities of real people, and
 * the list is one click away at the source. The article says so and why.
 *
 * Covers checked at full 1600x900 and against every cover in the scripts:
 *   - Chrome: the Chrome icon as a 3D render, nothing else in frame.
 *   - GhostAction: the GitHub mark, because the campaign is about what runs
 *     inside GitHub Actions, and GitHub is also what stopped it on 9 October.
 *   - Lonestar: a stack of identical laptops, no legible brand, which is
 *     what 187 seized machines look like.
 *
 * Rejected on the way: a Windows desktop showing Chrome beside Edge,
 * Firefox, Opera and Brave, because this piece says plainly that whether
 * other Chromium browsers inherited the bugs is not established, and the
 * cover would have implied the opposite. Also every generic laptop photo
 * with a vendor logo across the lid.
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
    slug: "chrome-full-chain-the-parts-were-priced-at-4500-the-chain-at-250000",
    title:
      "Google paid $250,000 for a Chrome chain whose three bugs it had separately priced at $4,500",
    excerpt:
      "XBOW's six-day, AI-assisted Chrome exploit chain was reported everywhere this week. Google's own issue tracker carries the part that was not: what the Vulnerability Rewards Program paid for each of the three bugs on its own, and which of them never got a CVE at all.",
    categorySlug: "security",
    tags: [
      "chrome",
      "google",
      "cve-2026-85045",
      "cve-2026-78952",
      "v8",
      "xbow",
      "bug-bounty",
      "exploit-chain",
      "ai",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1649006865574-8d077cefec17${P}`,
    body: `**XBOW** says it built a working **Chrome** exploit chain in six days using a publicly available **OpenAI GPT-5.6 Sol** model, and that **Google** paid **$250,000** for it. Both halves are true, and both were reported widely this week.

The part that was not reported is on Google's own issue tracker. The three bugs that make up the chain were each rewarded separately by the Chrome Vulnerability Rewards Program panel, and those three awards come to **$4,500**.

## The chain, in Google's words rather than XBOW's

Chromium issue **547965190** is titled "Full chain exploit from ordinary web content on Chrome Beta 152.0.7977.42 for Windows". It is a **P0**, filed from an xbow.com address on **18 August 2026**, and it is marked Fixed.

The chain ran in "signed stock Google Chrome Beta 152.0.7977.42 on Windows x64", and ends by making "the existing unsandboxed Crashpad handler create cmd /k calc.exe through its normal CreateProcessW path". Launching Calculator is the traditional way to prove code execution without doing anything with it.

Three separate issues are recorded as blocking that one. They are the three links.

## What each link actually crossed

**Issue 547819997** is the first. Maglev, one of V8's compilers, built a single mutable number object and handed the same one to every object it later reconstructed, so two different JavaScript objects could share one box. The issue's own impact line is careful in a way the coverage was not: "Arbitrary read/write within the V8 cage from ordinary web content. The V8 heap sandbox contains this primitive; native renderer code execution requires a separate sandbox escape." The first link is not an escape at all. It is **CVE-2026-85045**, described by Google as a race condition in V8, fixed in Chrome **152.0.7977.82** on **3 September**.

**Issue 548509153** is the second, and it is the one that escapes the V8 sandbox. Blink's animated WebP decoder kept the frame geometry it had measured from one image and used it against bytes that had since been replaced with a different one, which produced a single chosen write outside V8's pointer cage.

**Issue 545820931** is the third, and the only one that crosses an operating-system boundary. Crashpad, the crash handler, inferred how much memory it could read from a read that had already failed, and a renderer thread that was still running changed the memory protections between the two attempts. It is **CVE-2026-78952**, an out-of-bounds write in Crashpad, fixed in Chrome **152.0.7977.64** on **25 August**.

## The middle link has no CVE, and is rated as having no security impact

Issue 548509153 carries the label **Security_Impact-None**, is rated **P2** and **S2**, and its CVE field is empty. A Chromium engineer explained the rating on the issue the day after it was filed: "It is a V8 sandbox escape, hence S2 (not the OS sandbox, but the pointer cage that v8 implements)."

That is the V8 sandbox's actual status, stated plainly. It is a mitigation that makes corruption inside V8 harder to turn into code execution, not a boundary Chrome commits to defending, which is why escaping it alone is not a critical finding. XBOW says the team exploited a property the V8 sandbox deliberately does not enforce and that Blink wrongly assumed it could trust.

It is also the bug that earned the **largest** individual reward of the three: **$2,500**. The two bugs that did get CVEs earned **$1,000** each.

## $4,500 in parts, $250,000 assembled

The chain issue carries a comment from the program's own bot: "Chrome Vulnerability Rewards Program (VRP) Panel has decided to issue a reward of $250000." An earlier comment records a Chrome engineer adding a hotlist "ensuring the VRP panel will take the full chain into account for reward consideration".

This is not Google underpaying and then correcting itself. It is the program working exactly as designed, and the arithmetic is the clearest statement anyone has published of what it is buying. A memory-safety bug, priced as a bug, is worth a four-figure sum. The same bug, demonstrated as one link in a path from a web page to the machine, is worth more than fifty times the three of them together. The program pays for **demonstrated exploitability**, not for bug count.

The $1,000 figures are familiar. We wrote in September about [a Chrome V8 zero-day that was paid $1,000 when the program's published floor for that class was $7,000](/article/chrome-v8-zero-day-paid-1000-dollars-published-floor-is-7000). Both XBOW bugs appeared in Chrome's release notes with the reward listed as "TBD", and the amounts landed on the tracker later.

## Six days, measured against what

XBOW's sprint ran from **2 to 7 August** in Las Vegas, during Black Hat and DEF CON. The three bug reports are dated **13, 17 and 19 August**, so the week produced the exploit and the fortnight after it produced the filings and the retargeting.

The compute is XBOW's figure: "roughly $40,000 in API charges", reconstructed from archived Codex logs rather than billed as a line item. The comparison that made the headlines is also XBOW's, and carries no source: "Pre-LLMs a Chrome full chain would take a team of four around 6-9 months to be produced, our first submission took 2 months. The awarded one? six days."

The first chain did not win. Its V8 sandbox escape turned out to duplicate an existing report, which is why the animated WebP bug is in the chain at all. XBOW builds each stage with a spare for exactly this reason, and says of the result that "this does not mean that anyone can get a Chrome chain".

Agents searched the source, tested ideas and wrote the first drafts. People picked the targets, read the output and decided what to join to what. That division is XBOW's own description, and it is the least surprising part of the story.

## What to do

- Check your Chrome version. Anyone on a current release has had all three fixes for weeks, the last of them on 3 September, but Chrome does not apply an update until the browser restarts.
- If you manage a fleet, the versions that matter are 152.0.7977.64 and 152.0.7977.82.
- Do not treat the V8 sandbox as a boundary in your own threat model. Google does not.
- If you run a bounty programme, the lesson here is the pricing rather than the AI.

## What is not established

- Whether other Chromium-based browsers inherited the same code. Nobody has published an answer, and the third stage is Windows-specific.
- Whether the animated WebP bug will ever receive a CVE. Its CVE field is empty, while the other two issues carry a label indicating a CVE description has been submitted.
- Whether the per-bug awards sit below the programme's published minimums for their classes. We have reported that pattern before; Google does not publish the panel's reasoning.
- The one-billion-user figure, which is XBOW's estimate of scope rather than a count of anything.
- The six-to-nine-month baseline the six days is measured against. It is asserted without a source, and the six days followed months of prior work by the same team.
- Whether any of the three bugs was ever used against real users. XBOW says none were, and no telemetry has been published either way.`,
  },

  {
    slug: "ghostaction-30000-repositories-and-the-26-secrets-anyone-has-counted",
    title:
      "GhostAction reached 30,000 repositories in two days. The only wave anyone has measured gave up 26 secrets",
    excerpt:
      "GitGuardian's update records about 1,900 compromised GitHub accounts and more than 30,000 repositories targeted on 8 and 9 October. The number missing from every headline is how many secrets the campaign actually took, and the one wave with a published answer makes the gap look enormous.",
    categorySlug: "security",
    tags: [
      "ghostaction",
      "github",
      "github-actions",
      "supply-chain",
      "gitguardian",
      "secrets",
      "ci-cd",
      "credentials",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1654277041218-84424c78f0ae${P}`,
    body: `**GitGuardian** reported this week that the **GhostAction** campaign reached more than **30,000 repositories** across about **3,000** users and organisations on **8 and 9 October**, pushed there from roughly **1,900 compromised GitHub accounts**. It tried to extract **3,174 secrets**.

Tried is the operative word, and it is the word doing the most work in every headline about this campaign. Nobody has published how many it got.

## The one wave with a measured outcome

There is an answer for the earlier wave, and GitGuardian published it. Between **31 August and 30 September**, the same operator pushed its workflow into **772 public repositories** belonging to **373** users and organisations, aimed at **2,577 secrets**.

What happened next is the part worth reading twice. Of **3,669** workflow runs collected across **605 repositories**, only **499 executed**, in **32 repositories**. Of those, **336 runs completed successfully, exfiltrating 26 secrets from 13 repositories**.

Twenty-six. From a campaign that put malicious code into seven hundred and seventy-two repositories.

## Why the gap is that wide

GitHub Actions does not run a workflow pushed by an arbitrary account the way a script runs when you type it. Most of the collected runs were held for approval and never executed. Many of the ones that did execute were triggered later, by a legitimate push from a real maintainer who had no idea the workflow was sitting there.

The October wave ran into something more direct. **GitHub started preventing the malicious workflow from running on 9 October**, which is the day after it began. GitGuardian records waves on **10 and 12 October** that could not extract any secrets at all.

So the thirty-thousand figure describes how many repositories the operator reached, over roughly two days, before the platform shut the execution path. It is a measure of **write access**, not of loss.

## What it actually is, and what it is not

There is no vulnerability here and no patch, which is the thing most worth saying plainly. The operator already had the ability to push to these repositories, using stolen personal access tokens and credentials from infostealer logs and old dumps, some of them compromised months or years earlier. Every commit was made under the victim's own identity.

The payload is a workflow file with a reassuring name — **security-audit.yml** in October, **github_actions_security.yml** and **security-check.yml** earlier — that reads the repository's secrets and posts them to an address with a single curl call. GitGuardian tracked three versions of the October payload: the first scanned the working tree and git history against eleven secret-detection patterns and went to about 1,800 repositories, the second added case-insensitive matching and context around AWS key identifiers, and the third scanned up to 200,000 lines of git log.

The targets, from the earlier wave's haul, were ordinary infrastructure credentials: 446 SSH keys and deployment credentials, 218 Azure credentials, 142 container registry logins, 112 database credentials, 106 AWS access keys.

## The number that should worry people is the cleanup one

As of **5 October**, GitGuardian found that only **124 repositories**, about **16 percent**, had been effectively cleaned in observed public history.

That is the figure with a real consequence attached. A malicious workflow left in a branch or a fork runs the next time something triggers it, and the twenty-six successful exfiltrations from the earlier wave happened largely because legitimate pushes set off workflows that had been sitting dormant. The campaign's yield is low per repository and the repositories stay loaded.

The counts also disagree, as they usually do. **Socket** reported 346 repositories hit in two automated sweeps lasting minutes, and more than 500 accounts committing the workflow since 7 October. GitGuardian does not reconcile the two, and the gap most likely reflects different detection methods and different windows. We have written before about [a ransomware count that is mostly unverified claims](/article/comparitech-q3-2026-the-record-is-2627-claimed-and-247-confirmed) and [a victim figure that turned out to be a database's row count](/article/dtu-breach-200000-is-the-size-of-the-database-not-the-victim-count); this is the same shape of problem, with the added difficulty that the only honest answer for October is that the yield has not been published yet.

This is also the second campaign in a fortnight that turns on package and repository identity rather than on a flaw. We covered [an npm trusted publishing flow that checked the package name and not the identity behind it](/article/slugfest-npm-trusted-publishing-checked-the-name-not-the-id) earlier this month.

## What to do

- Search every branch and every fork for security-audit.yml, github_actions_security.yml and security-check.yml, and treat any repository that has carried one since 31 August as compromised. Removing it from the default branch is not removing it.
- Rotate every secret the workflow could read, then revoke the GitHub credential that allowed the push. GitGuardian is explicit that rotation on its own is not enough, because the access that put the file there is still valid.
- Check commit history for workflow changes made under your own identity that you did not make. That is what this looks like from the inside.
- Review Actions run history for held or approved runs you did not expect, and for runs triggered by ordinary pushes against workflows you do not recognise.
- Audit CI images for cryptominers while you are in there. GitGuardian found thirteen GhostAction victim repositories also used for mining, across at least four separate campaigns, and says it is not convinced the same operator is behind both.

## What is not established

- How many secrets the October wave actually took. No figure has been published, and GitHub's block on 9 October cut it short.
- How the GitHub credentials were obtained in the first place. GitGuardian does not establish the initial access method for either wave.
- Who is behind it, or whether one operator or several are sharing the same stolen credentials.
- Why GitGuardian's October figures and Socket's are so far apart.
- Whether the cryptomining activity found in the same repositories shares an operator with GhostAction. GitGuardian says it is not convinced it does.`,
  },

  {
    slug: "operation-lonestar-roundup-eleven-addresses-and-forty-laptop-farms",
    title:
      "The Justice Department published eleven ordinary Gmail addresses and asked employers to go and look",
    excerpt:
      "Fourteen people charged, two arrested, more than forty Texas residences searched and about 187 laptops seized. The most useful thing in the announcement is a list of email addresses, and it tells you where this threat is actually detected: in hiring records, not in network logs.",
    categorySlug: "world",
    tags: [
      "north-korea",
      "dprk",
      "it-workers",
      "doj",
      "fbi",
      "famous-chollima",
      "insider-threat",
      "sanctions",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1654782360217-158d9b8aab89${P}`,
    body: `The **US Justice Department** announced on **13 October** an indictment charging fourteen people over a North Korean remote IT worker scheme, two arrests, searches of more than forty suspected laptop farms in Texas, and the seizure of approximately **187 laptops and KVM devices**.

The searches, run as **Operation Lonestar Roundup**, happened between **21 and 25 September**. The announcement came almost three weeks later.

At the end of the release is a list of **eleven fraudulent email accounts** identified during the investigation, published so that companies can check their own records against them. That list is the most immediately useful thing in the document, and it says something about this threat that the seizure totals do not.

## What the indictment alleges

The case is captioned **Sun Sheng Ming, et al.**, in the Northern District of Ohio, and it is a four-count wire fraud, money laundering and identity theft indictment. The alleged conduct runs **from 2019 to in or around July 2025**.

Two of the fourteen are US nationals and both have been arrested: **Michael James Bostelle** of Pennsylvania and **Juan Cecilio Pena Carrillo** of Texas. Ten more are described as China-based and named in the release. Two defendants' identities remain under seal.

The scheme allegedly reached **more than 70 US company employers**, across Ohio, sixteen other states and the District of Columbia, in health care, communications, cyber support, retail and manufacturing. It generated **more than $3 million in revenue**, which the department says is believed to have been sent to sanctioned entities controlled by the DPRK. The release cites a May 2022 advisory noting that such workers "have been known individually to earn up to $300,000 annually".

CrowdStrike tracks the group behind this category of activity as **Famous Chollima**.

The charges are allegations. The release states it plainly: "All defendants are presumed innocent until proven guilty beyond a reasonable doubt in a court of law."

## Why the email addresses are the interesting part

We are not reprinting the eleven addresses. They are ordinary Gmail accounts built around plausible American names, the whole scheme runs on stolen and fabricated identities of real people, and the list sits one click away in the department's own release for anyone who needs to run it against their records. Reproducing it here would spread eleven name-shaped strings with no way for a reader to tell which are inventions and which are the identities of people who were themselves victims.

What matters is what the list implies. There is no malware in this announcement. No CVE, no intrusion, no exploited appliance. The access was granted through a hiring process, the equipment was shipped to a residential address in Texas by the employer, and a KVM device let somebody overseas use it as though they were sitting in front of it.

That means the detection surface is not the security team's. It is **recruitment records, payroll, equipment shipping addresses and remote access patterns**. An email address is a useful indicator here precisely because the thing being searched is an applicant tracking system rather than a firewall log.

We covered the other end of this in July, when [a fake crypto startup turned out to have hired North Korean IT workers](/article/fake-crypto-startup-hired-north-korean-it-workers) without realising it. The pattern has not changed. The scale of the response has.

## The timing is worth noticing

The conduct charged ends in **July 2025**. The searches happened in **late September 2026**. The announcement came in **October 2026**.

None of that is unusual for a federal case, and all of it is worth holding in mind when reading the seizure figures. One hundred and eighty-seven machines is a snapshot of what was in forty-odd houses on four days in September, not a measure of how many are running now. The FBI's own assistant director described it as nearly 190 devices; the release gives approximately 187 in one place and approximately 187 laptops and KVM devices in another. These are counts of hardware in rooms, not of compromised employers.

The department has not named the victim companies, and more than seventy of them exist.

## What to do

- Run the eleven published addresses against your applicant tracking system, HR records, payroll and contractor onboarding, going back several years. The release exists so that you can.
- Check whether any employee or contractor's company equipment ships to an address that does not match where they say they work, and whether more than one person's equipment goes to the same one.
- Look for remote access that arrives through commercial VPNs or residential proxies, and for hardware-level remote control such as an unexplained KVM on the network path to a laptop.
- Treat identity verification at hire as a security control, not an HR formality. This scheme defeats everything downstream of it.
- If you find something, the relevant point of contact is the FBI field office, not a takedown request. There is an open case.

## What is not established

- Which companies were affected. The department has not named them.
- Whether any of the roles involved access to source code, customer data or production systems. The release describes employment and payment, not what the workers touched.
- How much of the more than $3 million has been recovered or traced beyond the allegation that it went to DPRK-controlled entities.
- How many of the seized devices were active, and how many employers are still running one.
- What happens to the two sealed defendants, and whether the ten named China-based defendants will ever be in a US court.
- Whether the eleven published addresses are the full set known to investigators or the subset they chose to release.`,
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
