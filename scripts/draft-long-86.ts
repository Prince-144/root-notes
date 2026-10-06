/**
 * Drafts the second 5 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-86.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-86.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-86.ts --update
 *
 *   1. EtherHiding and UNC5342 (security). Google Threat Intelligence on the
 *      first nation-state use of blockchain-hosted payloads. The angle is
 *      GTIG's own quieter finding: the attackers reach permissionless chains
 *      through a handful of permissioned API providers, which is the
 *      chokepoint the takedown-proof framing misses.
 *   2. Apple CVE-2026-86950 (gadgets). A font bug used against specific
 *      individuals, now with a public proof of concept that crashes any
 *      unpatched device.
 *   3. Pentagon DMDC (security). Nine months of access to unencrypted Social
 *      Security numbers, and a category of data that cannot be rotated.
 *
 * Primary sources: GTIG's own write-up for the EtherHiding figures, Apple's
 * advisory wording as quoted, and DMDC's notification as reported. Indicators
 * and contract addresses are deliberately left out of the body — they belong
 * in the research, not in a five-minute read.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - EtherHiding: a video call on a laptop, which is where the lure lands.
 *   - Apple: the boot screen with its progress bar, which is the only fix.
 *   - DMDC: a service dress uniform with ribbons, whose wearer's record is
 *     the thing that leaked.
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
    slug: "etherhiding-unc5342-the-payload-is-on-chain-and-the-chokepoint-is-the-api-provider",
    title:
      "North Korea put its malware somewhere nobody can take down, and reaches it through a handful of companies that can",
    excerpt:
      "Google Threat Intelligence has documented the first nation-state use of EtherHiding: a DPRK group storing its downloader in smart contracts on two blockchains, updated for about a dollar a time. The coverage calls it takedown-proof. GTIG's own report points at the part that is not — the attackers do not run nodes, they call three API companies.",
    categorySlug: "security",
    tags: [
      "google-threat-intelligence",
      "unc5342",
      "north-korea",
      "etherhiding",
      "contagious-interview",
      "smart-contracts",
      "clickfix",
      "cryptocurrency-theft",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1766074903112-79661da9ab45${P}`,
    body: `**Google Threat Intelligence Group** has published research on **UNC5342**, a **North Korean** cluster that since **February 2025** has been storing malware payloads inside smart contracts on the **BNB Smart Chain** and **Ethereum**. GTIG describes it as the first time a nation-state actor has adopted the technique, known as **EtherHiding**.

The framing everywhere is that this is infrastructure nobody can seize. That is true, and it is not the most useful sentence in the report.

## How a contract becomes a dead drop

The malicious payload sits in a smart contract. The implant retrieves it with a **read-only call** — the kind of query that reads contract state without writing to the chain.

Three things follow from that choice. It creates no transaction, so there is no visible history of the retrieval. It costs no gas, so there is no fee trail. And it leaves nothing for a defender to find on-chain afterwards, because nothing was recorded.

A second mechanism works the same way in reverse. The implant reads the data field of transactions sent to the well-known burn address — the one everyone uses to destroy tokens — and takes its configuration from there. Writing to a burn address looks like nothing in particular on a block explorer.

The economics are the detail worth repeating. GTIG puts the average fee to update the contract at about **1.37 dollars**, and counts **more than 22 updates** in the first four months. Changing the payload, or the command server, or the whole campaign's configuration, costs roughly the price of a coffee and takes one transaction.

## The part that is not takedown-proof

Here is the finding the headlines skipped.

The attackers do not run their own blockchain nodes. They reach these contracts through ordinary commercial API services — GTIG names Blockchair, Blockcypher and Ethplorer, and notes the use of a free developer key, with several queried at once as a failsafe.

GTIG's phrasing is precise: UNC5342 is using permissioned services to interact with permissionless blockchains. The chain cannot be taken down. The route to it runs through companies that answer the phone.

GTIG says that when it contacted responsible API providers, they acted quickly — and that several other platforms remained unresponsive. That sentence is the actionable part of this entire report, and it describes a policy problem rather than a technical one.

## The lure is a job offer

None of the blockchain machinery matters without the first step, and the first step is a fake recruiter.

UNC5342 runs its delivery through the **Contagious Interview** campaign: invented companies with websites and social accounts, recruiter profiles on LinkedIn and job boards, and an approach to developers in crypto and technology. Conversations move to Telegram or Discord, where one of two things happens.

Either the candidate is asked to run a coding exercise and downloads a repository that carries the first stage, often pulled through npm. Or the candidate joins a video interview, hits a fabricated error, and is told to install a fix — which is [the ClickFix pattern we covered on the Custom GPT campaign](/article/malicious-custom-gpts-clickfix-rat-hosted-on-chatgpt-com), wearing an interview instead of a CAPTCHA.

The chain that follows is a downloader, then an information stealer, then a Python and JavaScript backdoor for persistence. What it takes is specific: browser passwords, session cookies and stored cards from Chrome and Edge, wallet data from MetaMask and Phantom, and password manager contents. It compresses the lot and uploads it to attacker servers and private Telegram chats.

## Why a developer is the target

The victim selection is not incidental. A developer in a crypto company is two things at once: a person with a wallet, and a person with credentials to systems that hold other people's wallets.

That is why GTIG describes the campaign as serving both revenue and espionage. It is also why the technique keeps resurfacing: the same smart contract has been tied to a 2025 supply-chain compromise of npm packages, which is what happens when the person you phish publishes code other people install.

GTIG also notes something odd — using two separate blockchains is unusual, and may indicate different North Korean teams working in compartments rather than one operation.

## What to do

- Treat an unsolicited recruiter who moves you to Telegram and then sends a coding exercise as hostile by default. Run nothing from it on a machine that holds credentials or a wallet.
- Enforce the rule about pasted commands. A video call that fails and tells you to run something to fix it is the same attack as a CAPTCHA that asks the same, and neither is ever legitimate.
- Watch for workstation traffic to blockchain API services. A developer laptop querying Blockchair or Ethplorer is not normal, is easy to alert on, and is the one network signal this design does not hide.
- If you operate a blockchain API service, this is your problem too. GTIG's report distinguishes the providers that acted from the ones that did not, and that distinction is the only real pressure point in the design.

## What is not established

- How many people have been compromised through this campaign, which GTIG does not quantify.
- How much cryptocurrency has been taken through it.
- Whether the compartmentalisation GTIG suspects between blockchains reflects separate teams, which it offers as a possibility rather than a finding.
- Which API providers did not respond, which GTIG does not name.`,
  },

  {
    slug: "apple-coregraphics-cve-2026-86950-a-targeted-zero-day-with-a-public-proof-of-concept",
    title:
      "Apple's font bug was used against a handful of people, and the proof of concept now crashes any unpatched iPhone",
    excerpt:
      "CVE-2026-86950 is an out-of-bounds write in CoreGraphics font rendering, reported by Meta and patched after what Apple calls an extremely sophisticated attack on specific individuals. A public proof of concept has since appeared: a PDF with a crafted font that reliably corrupts memory on anything not updated.",
    categorySlug: "gadgets",
    tags: [
      "apple",
      "cve-2026-86950",
      "coregraphics",
      "zero-day",
      "ios",
      "macos",
      "spyware",
      "proof-of-concept",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1705596486400-32591895d196${P}`,
    body: `**Apple** has patched **CVE-2026-86950**, an out-of-bounds write in **CoreGraphics**, the framework that draws everything on every Apple operating system. Processing a maliciously crafted file can lead to arbitrary code execution.

Apple's own wording is the part that tells you what this was: the company is aware of a report that the issue may have been exploited in an extremely sophisticated attack against **specific targeted individuals**. **Meta Product Security** reported it.

The fixes are **iOS 26.7.1**, **iPadOS 26.7.1**, **macOS Tahoe 26.7.1** and **macOS Sequoia 15.8.1**, with iOS 27 unaffected.

## The bug is in font rendering

The flaw is in how CoreGraphics handles fonts embedded in a document. A PDF carrying a crafted font is enough to reach it.

Font parsing is a recurring source of this class of bug for a structural reason. A font file is not data in the simple sense; it is a small program describing how to draw glyph outlines, with its own tables, instructions and edge cases, parsed by code written for speed. And it is reachable from almost anywhere — a document, a web page, a message preview, anything that renders text it did not write.

Because the flaw lives in the operating system's graphics layer rather than in an app, no application-level hardening helps. A browser's sandbox, a mail client's attachment handling and a messaging app's preview restrictions all end up calling the same renderer. The update is the mitigation; there is no configuration that substitutes for it.

## What changed this week

Apple's advisory describes targeted use, which is the normal shape of a bug like this. Exploits that reach code execution on a current iPhone are expensive, scarce and spent carefully on a small number of people — journalists, dissidents, officials. For almost everyone else, the practical risk on the day of the patch is close to zero.

A public proof of concept changes that arithmetic.

Researchers have now published one: a PDF with a crafted embedded font that crashes unpatched iPhones and Macs. It demonstrates **memory corruption**, not code execution — which is a real and important distinction, because turning a reliable crash into a working exploit on a modern Apple device is a serious piece of work against pointer authentication, memory tagging and the rest.

But it is also the hard half of the problem published for free. Finding a reachable memory-safety bug in a hardened renderer is the part that takes a team and a budget. Weaponising a known one is the part that takes a skilled individual and time.

## The window that is now open

The population at risk changes shape. Before the proof of concept, it was whoever a well-funded operator had chosen. After it, the risk reaches anyone who has not installed the update, in front of anyone willing to do the remaining work.

That matters most for devices that do not update themselves promptly: older iPhones kept on a release train, Macs on the previous major version, and the fleet of devices in organisations where updates wait for a maintenance window. A targeted spyware chain was never going to touch those users. A commodity exploit built from a public crash eventually will.

This is the second Apple story we have covered this week, after [the iCloud mail flaws that let a free account forge any icloud.com sender](/article/icloud-mail-spoofing-apple-signed-the-forgery-and-all-three-checks-passed). Different severity, same lesson about where the trust sits.

## What to do

- Update now, on everything. iOS and iPadOS 26.7.1, macOS Tahoe 26.7.1, macOS Sequoia 15.8.1. This is not a wait-for-the-window patch.
- Check the devices that do not ask. Older iPhones and iPads in a drawer, a secondary Mac, anything managed by a policy that defers updates.
- If you are plausibly a target — journalist, activist, anyone handling sensitive sources — turn on Lockdown Mode. It restricts exactly the rendering paths this class of bug lives in.
- Do not rely on not opening suspicious files. Font rendering is reached by previews and automatic rendering as readily as by a deliberate open.

## What is not established

- Who was targeted, who did the targeting, and with what. Apple describes the attack only as extremely sophisticated and aimed at specific individuals.
- Whether the public proof of concept has been developed into working code execution by anyone.
- How long the flaw was exploited before Meta reported it.
- Whether this is linked to any named commercial spyware vendor, which nothing published says.`,
  },

  {
    slug: "pentagon-dmdc-breach-nine-months-of-access-and-data-that-cannot-be-rotated",
    title:
      "Nine months of access to unencrypted Social Security numbers, and the Pentagon says it has no indication of misuse",
    excerpt:
      "A file-sharing system at the Defense Manpower Data Center let unauthorised users reach files from October 2025 until it was found on 16 July 2026. The records cover 2.76 million living people and about 294,000 dead ones, and pair Social Security numbers with names, dates of birth and military job specialties.",
    categorySlug: "security",
    tags: [
      "pentagon",
      "dmdc",
      "data-breach",
      "social-security-numbers",
      "file-sharing",
      "unencrypted-data",
      "breach-notification",
      "government",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1682623764632-d92c4891fbc7${P}`,
    body: `The **Defense Manpower Data Center** — the Pentagon office that has held the personnel records of the US military since **1974** — has told **2.76 million living people** and the next of kin of roughly **294,000 deceased** ones that their records were reachable by unauthorised users.

The access ran from **October 2025** until DMDC found the flaw on **16 July 2026**. That is nine months. The system was a file-sharing service, the vulnerability in it was unpatched, and the personally identifiable information sitting on the server was **not encrypted**.

## What was in the files

The exposed data varies by person, and the combination is the problem rather than any single field.

**Social Security numbers**, paired with names, dates of birth, contact information, race, sex, and **military job specialties**.

A Social Security number is the one identifier in American life that cannot be reissued on request. A date of birth does not change. Put them together with a name and you have the basis for opening credit, filing a fraudulent tax return, or passing the knowledge-based checks that still gate access to accounts.

The job specialty field is what makes this different from a retail breach. It converts a list of identities into a list of identities sorted by what each person did — linguists, cryptologic technicians, intelligence analysts, medical personnel — which is a targeting aid for anyone building a social engineering campaign or an approach to a cleared individual.

## No indication of misuse is not the same as no misuse

DMDC says it has no indications of misuse of the accessed information. It has not said who accessed the files, or whether anything was copied.

Those two statements sit badly together. Misuse of a Social Security number surfaces when a credit application is filed or a tax return is rejected, often months or years later and at the victim's end rather than the agency's. An organisation that does not know what left cannot have evidence that it is being used, and the absence of evidence here is a description of visibility, not of safety.

That is the same shape as the French tax agency breach we covered, where [the agency learned of the theft from the thief](/article/anssi-dgfip-report-the-tax-agency-learned-of-the-theft-from-the-thief). Government bodies hold the records that matter most and tend to find out last.

## The timeline is the finding

Set the dates out and the shape is clear. Access begins in October 2025. It is discovered in July 2026. Letters reach people in September 2026.

Nine months of exposure, then roughly two more before the people affected could act. For a breach involving credentials, that delay is survivable because credentials can be changed during it. For identity data, the delay is the harm: the window in which someone could have opened an account in your name is a window you did not know to watch.

The remedy offered is twelve months of credit monitoring. For a Social Security number, twelve months is a fraction of the useful life of the stolen item. Credit monitoring also only reports what has already happened.

## The ordinary failure underneath

Nothing exotic caused this. A file-sharing system with an unpatched vulnerability, serving files that held unencrypted personal data.

File transfer products have been the reliable source of mass data breaches for several years now, for a plain reason: they are built to be reachable from outside, they are given large volumes of exactly the data worth stealing, and they tend to be owned by whoever installed them rather than by a security team.

The second half is the avoidable part. Encryption at rest would not have stopped the access, but it would have changed what the access was worth. Three million Social Security numbers were sitting in a form that could simply be read.

## What to do

- If you got a letter, freeze your credit rather than only monitoring it. A freeze prevents new accounts; monitoring tells you after one was opened.
- Treat unexpected contact referencing your service history as hostile. The job specialty field means an approach can be convincingly specific.
- File your tax return early. Return fraud is one of the first uses of a stolen number and the position goes to whoever files first.
- If you run a file transfer service, find out today what is sitting on it, how long it has been there, and whether it is encrypted at rest. Those three answers are the entire lesson here.

## What is not established

- Who accessed the files. DMDC has not said, and has not attributed the activity.
- Whether any data was copied, which DMDC also does not state.
- How the vulnerability was introduced, and why it was unpatched for nine months.
- Why personally identifiable information on that system was stored unencrypted.`,
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
