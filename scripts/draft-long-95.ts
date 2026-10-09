/**
 * Drafts the second 9 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-95.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-95.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-95.ts --update
 *
 *   1. Midnight Mimosa (security). Bitdefender finds ad-fraud malware in the
 *      system partition of cheap Android handsets. Carries Bitdefender's own
 *      caveat that the signing key identifies a key holder, not a culprit.
 *   2. MATCHBOIL (security). ESET on UAC-0099's downloader, in development a
 *      year before CERT-UA documented it. Keeps the two-minute C&C timer and
 *      the seven-minute scheduled task separate, which coverage conflates,
 *      and keeps ESET's medium confidence as medium.
 *   3. FakeGit (security). 17,610 repositories, and almost none of them new —
 *      the operator edited READMEs on repos that already existed.
 *
 * Primary sources: Bitdefender Labs on Midnight Mimosa, ESET Research on
 * MATCHBOIL, and Apiiro's count as reported by BleepingComputer.
 *
 * One claim dropped in research: a search summary said Island had tested
 * chatbots and found they relayed these repos' install steps. It is not in
 * the reporting, so it is not in the piece.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - Midnight Mimosa: a fan of phone backs with no legible brand on any of
 *     them, which matters here more than usual.
 *   - MATCHBOIL: a refinery, for the energy-sector victim ESET names.
 *   - FakeGit: code on a dark screen, which is what the lure is dressed as.
 *
 * Rejected on the way: two phone photographs with SAMSUNG and vivo legible on
 * the devices. Neither company is in this story, and the counterfeits in it
 * spoof Samsung's model names, which makes that logo actively misleading.
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
    slug: "midnight-mimosa-the-malware-is-in-the-system-partition-before-the-first-boot",
    title:
      "The malware sits in the system partition, which means the first owner was infected before the first boot",
    excerpt:
      "Bitdefender found an ad-fraud component shipped inside the firmware of low-cost Android handsets, posing as a core system app with permissions to install and remove software silently. Thousands of devices in more than 150 countries, and no way for the owner to uninstall it.",
    categorySlug: "security",
    tags: [
      "midnight-mimosa",
      "bitdefender",
      "android",
      "supply-chain",
      "firmware",
      "ad-fraud",
      "mediatek",
      "residential-proxy",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1721686602598-005825cce7c8${P}`,
    body: `**Bitdefender Labs** has published research on a family it calls **Midnight Mimosa**: malware that arrives in the firmware of cheap Android phones, before anyone has installed anything.

The component poses as a core part of the operating system. It is a platform-signed system app named **com.android.system.lite**, labelled simply "System", with sibling builds under similar names. Bitdefender found it on low-cost, multi-brand handsets built on **MediaTek** chipsets.

## What it can do, and why the position matters

Being in the system partition is not a detail of where the file sits. It is the whole capability.

The component holds **INSTALL_PACKAGES**, **DELETE_PACKAGES**, **GRANT_RUNTIME_PERMISSIONS** and **WRITE_SECURE_SETTINGS**. In plain terms, it can install software, remove software, and grant that software whatever permissions it wants, without asking and without appearing to.

Bitdefender describes one touch that is almost comic in its directness: before installing a payload, the malware **disables the Play Store**, and re-enables it afterwards. Installer records were also found falsely attributing apps to Google Play, so a user checking where something came from is told it came from the store.

The payloads run **ad fraud** — fabricated impressions and clicks — and turn the handset into a **residential-proxy relay node**, which is rentable infrastructure and usable for denial-of-service traffic. The component also declares Accessibility, Notification Access and SMS permissions, and switches the first two on itself. Bitdefender says it did not observe those being used, which is worth stating precisely: the capability is present and the use is not evidenced.

## The owner cannot remove it

This is the part with no good answer.

The component ships in the system partition, so there is no uninstall. Bitdefender's own assessment is that clearing it needs firmware-level work or disabling the component over ADB, and that this is not realistic for most people.

A factory reset restores the firmware, which is where the malware is. The remedy for a compromised phone is, for almost every owner of one, not to own it.

## Who is responsible, and the caveat Bitdefender puts on its own finding

Bitdefender traced the platform signing key to a named Shenzhen manufacturer, and then did something coverage of this kind often does not: it said what that does and does not mean.

Bitdefender states plainly that identifying the holder of a signing key **does not constitute proof** that the company wrote the malware, distributed it, or knew about it. It also says it **cannot determine where in the supply chain** the code is added — it could be an ODM, a firmware integrator, a logistics partner, or someone else entirely. And it notes the infection is not confined to firmware signed with that key.

We are not naming the key holder here for the same reason. A signing key identifies who signed a build, and builds pass through hands.

Two handset models are named as the highest-volume ones, associated with two budget brands. Many of the other device strings Bitdefender saw are **counterfeit flagship names** — spoofed versions of well-known Samsung and Apple model numbers — which the firm describes as spoofing indicators rather than a list of affected devices. Anyone reading a device name out of this dataset is reading what the firmware claims, not what the phone is.

## Scale, and the thirteen apps in the store

Bitdefender reports **thousands of unique devices across more than 150 countries** over roughly a two-year window, led by Mexico, France and Italy, then the United States, Germany, Brazil and Spain.

Separately, thirteen apps on **Google Play** carry the same ad-fraud family markers and talk to the same servers, loading and displaying ads outside the app. The thirteen packages use thirteen different signing certificates across at least two developer accounts, with the rest unresolved — which is what deliberate separation looks like rather than a careless developer.

Bitdefender does not say whether Google has removed them.

Bitdefender keeps two questions apart in its attribution: whoever inserts the code into firmware, and whoever operates the ad-fraud payloads, are tracked as different actors. The payload operator is linked through shared domains to families other vendors have tracked since 2021.

## What to do

- For detection, Bitdefender's advice is to key on the shared core — a particular native library, a common class path and one command server domain — rather than on package names, which rotate.
- For buyers: a handset sold far below the cost of its components is a handset whose margin is coming from somewhere. That is not a moral judgement about cheap phones; it is a question worth asking about a specific one.
- For organisations with any bring-your-own-device policy: this is the category that policy cannot inspect. A phone that arrived compromised passes every check that assumes a clean baseline.
- The durable fix is not a user action. It sits, as Bitdefender says, with the vendors and marketplaces shipping and selling the firmware.

## What is not established

- Where in the supply chain the code is inserted, and by whom.
- Whether the company whose signing key appears on the builds knew anything about it. Bitdefender explicitly declines to claim this.
- The real number of affected devices. Thousands is what one vendor's telemetry saw, not a census.
- Whether Google has removed the thirteen Play apps, or acted on the developer accounts.
- Whether the declared Accessibility, notification and SMS permissions have ever been used for anything.`,
  },

  {
    slug: "matchboil-uac-0099-in-development-a-year-before-anyone-documented-it",
    title:
      "The downloader's compile dates run a year earlier than the first public report of it",
    excerpt:
      "ESET's samples of MATCHBOIL, a downloader used by the Russia-aligned group UAC-0099 against Ukrainian targets, carry timestamps from April 2024 — more than a year before CERT-UA first documented the tool. Newer builds poll for a fresh payload every two minutes and refuse to run under analysis.",
    categorySlug: "security",
    tags: [
      "matchboil",
      "uac-0099",
      "eset",
      "ukraine",
      "espionage",
      "downloader",
      "sandworm",
      "sandbox-evasion",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1786532852011-443cba5dc9fe${P}`,
    body: `**ESET** has published an analysis of **MATCHBOIL**, a custom C# downloader used by the group it tracks as **UAC-0099**. The useful finding is not what the tool does, which is ordinary. It is how long it has been doing it.

**CERT-UA** first documented MATCHBOIL in **August 2025**. ESET's collection of samples carries compile timestamps running from **April 2024 to April 2026**, and it reads CERT-UA's own samples as built in mid-2024. The conclusion is that the group was developing this a year or more before anyone wrote about it.

That gap is the finding. Public documentation of a tool marks the date somebody noticed, not the date it started working.

## What it is and how it arrives

The delivery is unglamorous and effective. A spearphishing email carries a link, the link fetches an archive, the archive holds a **VBScript**, and the victim has to run it. No exploit, no zero-day — a person opening a file.

The VBScript fetches and runs MATCHBOIL and sets up persistence for a loader that will run it again. MATCHBOIL's own job is narrow: check for a marker directory under the local application data folder, exit if it is already there, otherwise pull a payload from the command server, install it, and persist it with a scheduled task or a registry value.

The payload is usually **MATCHWOK**, a C# backdoor ESET describes as used exclusively by this group.

## Two timers, frequently confused

One detail is worth separating, because the numbers travel badly.

The **2024** builds ran once. Fetch, install, done.

By **late 2025**, MATCHBOIL sets a timer that runs its command-server logic **every two minutes**, so the operator can swap in a new payload and have it picked up almost immediately. That is a meaningful change: it turns a one-shot dropper into something closer to a standing channel.

The **seven-minute** interval that also appears in ESET's write-up is the **scheduled task used for persistence** — a different mechanism doing a different job. The two get reported as one figure, and they are not.

## The analyst checks

The later builds are built to be boring to a researcher.

Through 2024 the obfuscation was homemade: class and method names renamed with unprintable Unicode symbols, strings encrypted with a custom routine. By late 2025 the group had moved to a commercial .NET obfuscator with code virtualisation and control-flow obfuscation, which is a different class of nuisance.

The evasion is more interesting than the obfuscation. Late-2025 builds read Windows uptime events and require **at least three events with an uptime value of at least 7,200 seconds** before deciding they are on a real machine — a two-hour floor that a disposable sandbox rarely clears. They also check for an attached debugger.

In **April 2026** a check appeared that compares the operating system's install date against the date the sample is running. ESET's description reads as refusing to run when the install predates execution by ten days or more, which would exclude most genuine targets — so either the check is narrower than it sounds or the description compresses it. We are flagging it rather than explaining it.

## Who, and how confident

ESET observed every victim in **Ukraine**: transport companies in **July and August 2025**, a manufacturer in **December 2025**, an energy-sector company in **June 2026**. Three sectors over eleven months, all of them infrastructure.

On the group itself, ESET says it believes with **medium confidence** that UAC-0099 is aligned with Russian interests. Medium confidence is not a formality, and it does not become high confidence by being repeated.

ESET also says UAC-0099 **can act as an initial access broker for Sandworm** — the group associated with destructive attacks in Ukraine. That phrasing is careful. It describes a capability and a relationship, not a chain of command, and the distance between "can act as" and "acts on behalf of" is the distance between a supplier and a subordinate.

The group's other tool is **LONEPAGE**, a PowerShell downloader named for a string in its command-server URLs.

## What to do

- The entry point is a script a person runs from an emailed archive. Blocking script execution from archive and download paths closes this specific chain regardless of what the payload becomes.
- Look for the marker directory pattern under local application data, and for scheduled tasks and run keys created shortly after an archive was opened.
- A two-minute poll to a fixed host is a visible pattern in outbound logs. Regularity is the signal here, not volume.
- If you are in transport, manufacturing or energy in or adjacent to Ukraine, treat this as current. The June 2026 victim is the most recent ESET names.

## What is not established

- What MATCHWOK actually does once installed. ESET names it and does not describe its capabilities in this write-up.
- Whether the April 2026 install-date check works the way its description reads.
- How the group selects targets, and how many victims exist outside ESET's telemetry.
- Whether any of the observed intrusions led to Sandworm activity, as opposed to UAC-0099 having the capability to hand one over.
- Who UAC-0099 is. Medium confidence on alignment with Russian interests is the most ESET says.`,
  },

  {
    slug: "fakegit-17610-repositories-and-almost-none-of-them-new",
    title:
      "Nobody had to create a single new repository — the operator edited the README on the ones that already existed",
    excerpt:
      "Apiiro counts 17,610 GitHub repositories in the revived FakeGit campaign, more than double July's figure. The scale did not come from mass registration: in about 34 hours the operator re-pointed repos that were already there, and in 97 percent of sampled commits the only thing touched was the README.",
    categorySlug: "security",
    tags: [
      "fakegit",
      "github",
      "smartloader",
      "stealc",
      "apiiro",
      "supply-chain",
      "infostealer",
      "mcp",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1524666643752-b381eb00effb${P}`,
    body: `**FakeGit** restarted on **4 October**. **Apiiro** now counts **17,610 GitHub repositories** in the campaign, against roughly 7,600 that Island reported in July.

The number is not the story. How it was reached is.

## The repositories were already there

In about **34 hours**, whoever runs FakeGit touched more than **13,000 repositories**, peaking near three thousand an hour. Apiiro's summary of what that took is one sentence: nobody had to create a single new repo.

In **97 percent** of sampled commits, the only file changed was the **README**. The repositories existed. What changed was where their download button pointed.

This is a different economy from mass registration. A newly created repository has nothing — no age, no history, no inbound links, nothing in a search index, and every signal a platform uses to spot bulk abuse pointed straight at it. A repository that has been sitting there has all of those for free, and editing one file does not look like abuse at all. It looks like a commit.

It also explains the speed. Three thousand an hour is not a rate you reach by provisioning accounts; it is a rate you reach when the expensive part was done months ago.

## The chain

The path from a repository page to a stolen password is short. A download button in **88 percent** of sampled commits leads to a **ZIP archive**. The archive installs **SmartLoader**, which exists to deliver other things. In this wave it is delivering **StealC**, an infostealer.

Apiiro reports that **71 percent** of the fleet was absent from URLhaus before it published — so roughly three in ten were known, and seven in ten were not, at a point when the campaign had been running for days.

## The account detail that should worry people

Most of the repositories sit on throwaway accounts, which is expected.

But researchers found **at least 700 accounts that appear to belong to real developers**. That is a different problem from a spam wave. An account with a history, contributions and followers is not only harder to spot — it is more persuasive, and the cost of blanket-blocking it falls on a person who did nothing.

How those accounts were obtained is not stated. Credential stuffing, stolen tokens and malicious workflow actions are all live possibilities, and the campaign is distributing an infostealer, which closes the loop neatly enough to be worth noting without asserting it.

## What the payload is for

SmartLoader is a delivery mechanism, which makes the interesting question what it delivered this time. **StealC** is an infostealer: browser-stored passwords, session cookies, cryptocurrency wallet data, and the credential files that developer tooling leaves on disk.

That last category is why this campaign reads as circular rather than merely large. The people most likely to open a GitHub repository, click a download in a README and run what comes out are developers — and a developer's machine holds cloud keys, package-registry tokens, signing material and the credentials to their own repositories.

Which is one answer to how a campaign ends up with seven hundred accounts that look like they belong to real people. We are not asserting that is how it happened; Apiiro does not say. But a campaign that steals developer credentials and a campaign that needs credible developer accounts are, at minimum, well matched.

## Where the AI angle actually is

Island's July research found about **800** of the repositories dressed as **AI skills or MCP servers**, listed in public AI registries and catalogs.

That is the part worth sitting with. We wrote this week about [an MCP endpoint being used as a live command channel inside victim networks](/article/azazel-gentlemen-mcp-as-a-command-channel-and-the-affiliate-who-kept-the-money). This is the other side of the same immaturity: a new category of component, a set of registries assembled quickly to list them, and an installation step that is usually a copied command. Nothing in that chain has the review a package registry grew over fifteen years, and the attackers arrived while it was being built.

Apiiro's advice on this is narrow and correct: install AI skills and MCP servers from the official registry or the vendor's own repository, not from a search result.

## GitHub as the host nobody blocks

This is the second campaign in three days running on the same reasoning. [A botnet resolved its command-server address out of a poem in a GitHub repository](/article/poellm-canto-incognito-the-c2-address-is-four-words-in-a-poem), because a request to a code host raises nothing. Here the code host is the distribution channel itself, and a developer visiting a repository is doing their job.

There is no statement from GitHub, and no confirmed removals. What makes removal partial even where it happens is that copies survive the repository: **forks, releases and issue attachments** remain reachable after the original goes. Blocklists covering a third of a fleet, against a campaign that can re-point the rest with a README edit, is not a contest.

## What to do

- Treat a README's download button as an untrusted link, because the repository's age tells you nothing about where that button pointed this morning.
- Prefer release artefacts you can verify over a ZIP from a link, and check what the repository's history actually contains rather than that it has one.
- Install AI skills and MCP servers from official registries or vendor repositories only.
- If you maintain repositories, check your own commit history for changes you did not make. Seven hundred accounts in this campaign look like they belong to someone.

## What is not established

- How the roughly 700 legitimate-looking accounts were obtained.
- Whether the 17,610 figure holds. It rests on a single vendor's count, as July's 7,600 did.
- How many people ran the payload. Download counts quoted for this campaign measure activity, not compromise.
- What GitHub has done, if anything.
- Whether the same operator is behind the July wave and this one, beyond the shared name and chain.`,
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
