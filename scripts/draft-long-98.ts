/**
 * Drafts the 12 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-98.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-98.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-98.ts --update
 *
 *   1. AhsayCBS (security). Exploited three days after NVD disclosure, no
 *      patch, and the version earlier reporting called safe is not. Uses
 *      Huntress's own severity labelling, which two aggregators had reversed.
 *   2. GhostAction October wave (security). A workflow named security-audit
 *      tailored per repository to the secret names that repository uses.
 *      Separates Socket's observed counts from the "tens of thousands".
 *   3. DTU (world). 200,000 is the size of the database, not a victim count,
 *      and the university will not write to the former students whose CPR
 *      numbers it holds.
 *
 * Primary sources: Huntress's AhsayCBS write-up, Socket's GhostAction update,
 * and DTU's disclosure as reported.
 *
 * Dropped in research: Palo Alto CVE-2026-0257, which an aggregator presented
 * as an 11 October ransomware story. Checking CISA's feed put it in KEV since
 * 29 May, the vendor research is May-June, and no source supported the
 * ransomware claim. Stale material dressed as news.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - AhsayCBS: an opened hard drive, for a backup product.
 *   - GhostAction: an editor with a file tree, which is where the file went.
 *   - DTU: a university building.
 *
 * Rejected on the way: a glass campus entrance with UCONN legible on it,
 * which is a different university on a different continent.
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
    slug: "ahsaycbs-exploited-three-days-after-disclosure-and-the-safe-version-is-not",
    title:
      "The backup product was being exploited three days after disclosure, and the version called safe is not",
    excerpt:
      "Huntress saw attackers chaining two AhsayCBS flaws into SYSTEM-level code execution on 7 October, three days after NVD published them. There is no patch, every version through 10.3.4 is affected despite earlier reporting, and the remediation advice is to re-image from a trusted backup.",
    categorySlug: "security",
    tags: [
      "ahsaycbs",
      "cve-2026-105134",
      "cve-2026-105133",
      "huntress",
      "backup",
      "msp",
      "xmrig",
      "byovd",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1601737487795-dab272f52420${P}`,
    body: `**NVD** published two **AhsayCBS** vulnerabilities on **4 October**. **Huntress** saw the first exploitation at **23:20:15 UTC on 7 October**.

Three days. No patch existed then and, at the time of Huntress's write-up, none existed at all.

## The chain

**CVE-2026-105133** is the way in: a medium-severity authentication bypass in the **checkSysPwd** function, which lets a random token stand in for valid credentials.

**CVE-2026-105134** is what the bypass buys: a critical unauthenticated remote code execution flaw in the **Replication Receiver** component, reached through one API endpoint, running as **NT AUTHORITY/SYSTEM**.

A note on those labels, because two write-ups have them the other way round. The medium one is the bypass; the critical one is the execution. Huntress assigns them that way and it is the firm that watched the attack.

**Five organisations** had been targeted as of 8 October.

## The version that was supposed to be fine

Earlier reporting indicated that **10.3.4** was not susceptible. Huntress's 8 October update says plainly that it is.

That is the most urgent sentence in this story. An administrator who read the first round of coverage, checked their version, saw 10.3.4 and moved on has done the work and is still exposed. There is no fixed release to move to — every version up to and including 10.3.4 is affected, and the mitigation is network control, not patching.

## What they install

The post-exploitation is almost a catalogue of current technique.

The payload is staged by **curl** from an **Alibaba Cloud** object-storage host. Four files: a PowerShell script, and three that matter — **edge.exe**, **msedge.exe** and a config.

**edge.exe** is **XMRig**, the Monero miner, renamed to look like a browser. It points at **Kryptex** — the same mining service behind [the botnet that resolves its command server out of a poem on GitHub](/article/poellm-canto-incognito-the-c2-address-is-four-words-in-a-poem). Two unrelated campaigns in a fortnight cashing out through the same place.

**msedge.exe** is a modified copy of **NSSM**, a legitimate service manager, used to keep the miner running and restart it after crashes or reboots. The service it creates is called MicrosoftEdgeUpdateSvc, which is one character of plausibility away from the real thing, and it runs as SYSTEM.

In some incidents the attacker instead configured a malicious replication receiver and dropped a **JSP webshell** into the directory the application already serves.

Then there is **WinRing0x64.sys**, downloaded with **certutil**. It is a real, signed, vulnerable kernel driver. The usual reason to bring one is to disable endpoint security; Huntress reads this case differently, as giving the miner kernel-level hardware access. Bring-your-own-vulnerable-driver for performance rather than evasion is an unusual thing to see.

## The script that watches for you

The best detail is the PowerShell script, which Huntress describes as AI-assisted.

It stops the mining service when **Task Manager opens**. It restarts it when Task Manager closes. It kills Task Manager at 18:00, or after an hour if it has been left open overnight — on **local time**.

That is not evasion aimed at security software. It is evasion aimed at a person: the administrator who notices a slow machine, opens Task Manager, sees nothing unusual, and closes it. Whoever wrote it understood that the detection mechanism most likely to catch a cryptominer is somebody wondering why the fans are loud.

## Backups are the target, which makes the advice awkward

AhsayCBS is used primarily by **managed service providers** and system integrators to centralise backup for their customers. One compromise is one provider and, potentially, the backups of everyone behind it.

Which leads to the uncomfortable part of Huntress's remediation. Its advice, correctly, is that any host matching the indicators should be fully **re-imaged from a trusted backup**, because secondary backdoors may be hidden.

Set that advice against what the compromised product is. The guidance is sound; it just lands differently when the system you are rebuilding is the one that holds the restore points. A backup platform is a high-value target precisely because owning it means owning both the live data and the way back from losing it, and any recovery plan that routes through it has to assume it might be the thing that is wrong.

## What to do

- Get the management interface off the internet. Trusted IPs or VPN only. There is nothing to patch.
- Check your version and ignore the earlier guidance about 10.3.4.
- Look for child processes spawned by the CBS service executable, for **edge.exe** or **msedge.exe** running from Temp, for a MicrosoftEdgeUpdateSvc service, and for **WinRing0x64.sys**.
- Preserve evidence before changing anything. Record processes, services, connections and logs first; re-image second.
- Huntress published four Sigma rules for this campaign.

## What is not established

- When a patch will ship. The vendor's plans were not confirmed at the time of the reporting.
- How many organisations are affected. Five is what one vendor's customer base showed on 8 October.
- Whether the MSPs targeted had their customers' backups reached, as opposed to the platform itself.
- Who is behind it. The toolset is commodity and the payout is a public mining pool.
- Whether the same actor is behind both the webshell incidents and the mining incidents, which Huntress describes as different patterns.`,
  },

  {
    slug: "ghostaction-the-workflow-was-tailored-to-the-secrets-each-repository-used",
    title:
      "The workflow was called security-audit.yml, and each copy named the secrets that repository actually used",
    excerpt:
      "Socket's latest GhostAction wave commits a credential-stealing GitHub Actions workflow straight to default branches. The payload is reusable, but the attackers read each repository's existing workflows first to learn which secret names to ask for. The October variant also sweeps the full git history.",
    categorySlug: "security",
    tags: [
      "ghostaction",
      "github-actions",
      "socket",
      "supply-chain",
      "cicd",
      "credential-theft",
      "secrets",
      "open-source",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1591439657848-9f4b9ce436b9${P}`,
    body: `**Socket** published an update on **9 October** to its tracking of **GhostAction**, a campaign that commits credential-stealing workflows to GitHub repositories. The current wave started on **7 October**.

The file is **.github/workflows/security-audit.yml**. It is committed directly to the default branch, with a message like "Add security audit workflow". It runs on push, with no branch or path restrictions, and can also be triggered by hand.

It does not audit anything.

## The part that is actually clever

A GitHub Actions workflow can only read the secrets it names. A generic payload that asks for AWS_ACCESS_KEY_ID gets nothing from a repository that calls the same thing something else.

So before deploying, the attackers **read the repository's existing workflows** to find which Action secrets it references, and wrote those names into the payload.

That is a small step and it changes the economics. It turns one reusable template into something effective against repositories with arbitrary naming conventions, and it means the yield per compromised repository is close to everything that repository had.

The October variant adds a sweep of its own: a regex hunt for cloud-provider and AI-service credentials committed into the repository **and its complete git history**. Secrets that were removed in a later commit are still in the history, and the attackers know it.

The targets named in reporting run to SSH private keys, AWS, Azure, Google Cloud and Firebase, DockerHub and GHCR, database and FTP credentials, GitHub tokens, Cloudflare, npm, PyPI, and AI provider keys.

## How many, and how to read the number

Here the reporting needs separating from the research, as [it did with the FakeGit repository count](/article/fakegit-17610-repositories-and-almost-none-of-them-new).

What Socket says it observed: **318 repositories** under one account namespace, **279 of which are forks**, plus 27 under another, plus Uber's **athenadriver**.

What has been widely reported: more than 500 accounts and tens of thousands of repositories.

Those are not the same claim, and the forks explain the gap. A fork is a copy. One compromised account forking a few hundred repositories and committing to each produces a very large repository count and a very small number of distinct victims. Counting the fork as a separate compromise inflates the figure without adding a stolen secret.

The 500-account figure comes mainly from secondary coverage of Socket's update. GitGuardian's earlier count — 772 repositories across 373 users and organisations between 31 August and 30 September — is a separate wave, not a subset.

None of which makes the campaign small. It makes the headline number a measure of commits rather than of victims.

## The organisation exposure

The detail with the widest reach is **athenadriver** sitting under Uber's organisation.

Socket's account is that contributor permissions carried an individual account compromise into organisation-owned projects. The attackers did not need to compromise Uber. They needed to compromise somebody who could commit to one of its repositories.

That is the structural lesson, and it is not new — it is just rarely priced in. An organisation's repository security includes every outside contributor's personal account hygiene, and there is no mechanism by which the organisation can observe or improve that.

As of 9 October the workflow file was **still present** on the default branches Socket checked, including Uber's.

## What Socket does not know

Two gaps are worth stating because they are load-bearing.

Socket **did not determine how the maintainer credentials were obtained**. Without that, nobody can say whether the fix is rotating tokens, enforcing hardware keys, or finding an upstream compromise that is still running.

Socket also says it observed **no malicious package versions** published to PyPI or crates.io as a result. That is the outcome everyone fears from stolen publishing tokens, and so far it has not happened — which could mean the credentials have not been used yet, or are being sold, or that the operation is only collecting.

## What to do

- Search your repositories for **security-audit.yml** and for commits adding it. The message is bland and the filename is designed to survive a glance.
- Rotate anything a workflow could have read. Not only what you think it needed — what the workflow named.
- Then rotate anything that was **ever** committed, including in history you have since rewritten or force-pushed over. That is the new part.
- For organisations: audit outside contributor permissions, and require hardware-backed authentication for anyone who can push to a default branch.
- Protect default branches so a workflow file cannot be added by a direct commit.

## What is not established

- How the maintainer accounts were taken.
- The true number of distinct compromised accounts, as distinct from affected repository counts inflated by forks.
- Whether the stolen credentials have been used, beyond the absence of malicious package publishing.
- Whether this wave and the August to September wave are the same operator. The tooling matches; attribution is not claimed.
- How many of the credentials swept out of git history were still valid.`,
  },

  {
    slug: "dtu-breach-200000-is-the-size-of-the-database-not-the-victim-count",
    title:
      "The university cannot say what was taken, and will not write to the former students whose CPR numbers it holds",
    excerpt:
      "Attackers used stolen credentials to reach DTU's identity system and pulled records going back two decades. The 200,000 figure in every headline is the size of the database, not a count of victims. DTU is notifying employees directly and leaving 160,000 former users to find out from the news.",
    categorySlug: "world",
    tags: [
      "dtu",
      "denmark",
      "data-breach",
      "cpr",
      "identity-management",
      "higher-education",
      "datatilsynet",
      "breach-notification",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1769430886896-dc30842be5a3${P}`,
    body: `The **Technical University of Denmark** has disclosed that attackers used **stolen login credentials** to reach **DTUBasen**, its identity and access management system, and pulled records covering roughly two decades.

The number in the headlines is **200,000**. It is worth being precise about what that is.

## 200,000 is the database, not the victims

DTUBasen holds around **40,000 active users** and **160,000 former users**. Two hundred thousand is the population of the system — everyone connected to DTU as employee, student, guest or partner since **2003**.

DTU says it **cannot establish precisely which information was downloaded or how many people were affected**.

So the figure describes an upper bound on exposure, and it is being reported as a count of people whose data was stolen. The real number is somewhere between one and two hundred thousand, and the university does not know where.

That is not a criticism of DTU for saying so. Admitting the uncertainty is the correct thing to do and many organisations do not. It is a criticism of how the number then travels.

## What is in it

For active users, the records may include **Danish civil registration numbers**, names, home addresses, work email addresses, job titles and **next-of-kin details**.

The CPR number is the part that does not age. We made this point about [the compromise of Denmark's Central Person Register last week](/article/denmark-cpr-register-8-8-million-looked-up-through-lawful-access), and it applies again: a CPR number is issued once and carried for life. It underpins tax, healthcare and banking. A password can be reset and an address changes. This cannot be reissued because it was copied.

Two Danish incidents touching the same identifier in eight days is not a coincidence of bad luck. It is what happens when one number is the key to everything and is held by every institution a person has ever dealt with.

The next-of-kin detail deserves its own line. People listed there never had a relationship with DTU at all. They were recorded because someone else named them, and they are now in a dataset they could not have known about.

## Identity management was the target

The system breached was not a student records database or a payroll system. It was the **identity and access management platform** — the thing that knows who everyone is and what they may reach.

An IAM system is attractive for the obvious reason that it aggregates. One query returns what would otherwise require breaking into a dozen systems. It is also attractive for a less obvious one: it is the system from which further access is granted, so a foothold there is worth more than the data it holds.

DTU says the intrusion has been contained. The entry was stolen credentials, which is the unglamorous answer in most of these cases and the one that no patch addresses.

## Who gets told

This is where the story turns from an incident into a decision.

DTU is notifying current and former **employees** directly through **e-Boks**, the Danish digital mailbox that every resident has and that institutions can write to.

It has said it **will not notify all current and former students** whose civil registration numbers it holds. It is relying on public disclosure to reach them instead.

In practice that leaves 160,000 former users — people who studied there, some of them twenty years ago — to learn about this from the news, if they happen to see it. A person who left DTU in 2008 and has not thought about the university since has no reason to be reading about it now, and their CPR number is in the same dataset as everyone else's.

The mechanism to reach them exists. e-Boks is exactly the infrastructure for this, and the university is already using it for one group and not the other. Whatever the reasoning — cost, address accuracy, legal threshold — the outcome is that notification tracks the strength of the ongoing relationship rather than the sensitivity of the data.

The case has been reported to the **Danish Data Protection Agency**. Whether the notification approach satisfies the obligation is now a question for them.

## What to do

- If you have ever been at DTU since 2003, assume your details are in it. That includes people who were there briefly as guests or partners.
- Treat unsolicited contact that already knows your CPR number as more suspicious, not less. That is precisely the material that makes a phishing call sound legitimate.
- If you are listed as someone's next of kin anywhere, you cannot audit that and there is no action available to you. Worth knowing anyway.

## What is not established

- What was actually taken. DTU says it cannot determine this.
- How the credentials were stolen.
- Who did it, and whether the data has been sold or published.
- Whether the earlier compromise of the national CPR register and this one are connected. Nothing published suggests they are.
- Whether the Danish Data Protection Agency will require DTU to notify the students it has decided not to write to.`,
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
