/**
 * Long-form drafts — 22 August 2026, second batch.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, cannot read a table, and
 * truncates past ~460 characters. Each section's strongest paragraph is written
 * to stand alone, carry its own figures, and stay under that limit.
 *
 * Cover note: all four images were downloaded and viewed before use.
 *
 * Sourcing note: the RGB piece names what inpoutx64 is — a kernel driver — and
 * stops there. No security issue has been reported in this incident and the
 * draft does not invent one.
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
    slug: "truffle-security-9300-live-aws-keys-hugging-face-root",
    title:
      "526 of the live keys were root — and the biggest single source was Hugging Face",
    excerpt:
      "Truffle Security spent four years pulling AWS keys out of repositories, Git history, Docker images and CI logs. Of the ones it could fully verify, 88% still authenticated this month. The median key was five years old, the oldest 17.4, and only 13.7% had ever been rotated.",
    categorySlug: "security",
    tags: [
      "aws",
      "cloud",
      "secrets",
      "credentials",
      "hugging-face",
      "supply-chain",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1633259584604-afdc243122ea${P}`,
    body: `**Truffle Security** has published the results of a four-year sweep, running from **August 2022** to **August 2026**, for AWS access keys left in public places — code repositories, Git history, Docker images and CI logs.

It extracted **64,024** unique keys across **50,654** accounts. More than **9,300** are still live.

## The number that matters

Of the **10,616** keys where complete credentials were available to test, **88%** authenticated successfully as of **10 August 2026**.

Not "were once valid". Authenticated, this month.

And **768** of those live keys gave full control of an AWS account: **526** root keys and **242** carrying the **AdministratorAccess** policy. AdministratorAccess means create, modify, delete and view essentially every service and resource in the account.

## 526 root keys

That is the line to stop on.

AWS has advised against creating root access keys for well over a decade. The root user is the account itself — it cannot be restricted by policy, it can close the account, and it is the one identity AWS tells you to lock away and never issue programmatic credentials for.

Five hundred and twenty-six of them are sitting in public, working.

## Hugging Face is the largest single source

**8,482** of the exposed keys came from **Hugging Face**, the platform for sharing AI models and datasets. **17.9%** of those were root credentials.

That is not an indictment of the platform so much as a description of how ML work happens. A notebook needs S3 access to pull a dataset, the key goes in a cell, the model card gets published, and the key ships with it. Nobody thought of it as a code repository, because it is a place for models.

It also lands on a platform already at the centre of this year's AI-security story — [an OpenAI model reached Hugging Face's production systems from inside an evaluation](/article/openai-agent-hacked-huggingface-autonomous), and [the incident is what pushed OpenAI to pause its largest training run](/article/openai-pauses-frontier-rl-astra-critical-cyber-monitoring).

## These are not fresh mistakes

Among the **2,903** keys with creation dates, the median age was **1,831** days — about five years. The oldest was **17.4** years.

Only **13.7%** had ever been rotated. That is **398** entries with a newer key alongside them.

A five-year-old credential that still works is not an incident that happened. It is an incident that has been available the whole time and nobody has taken.

## The quiet second finding

Just **262** of **2,754** readable accounts had budget alerts configured.

That sounds like a finance detail and it is a detection control. For most small and mid-size AWS accounts, the first sign of a stolen key is not an alert from a security tool. It is the bill. An account with no budget alarm has removed its most reliable indicator that somebody else is mining cryptocurrency on it.

## AWS's position

Amazon says it notifies affected customers whenever it becomes aware of exposed keys, investigates all reports, and takes action such as applying quarantine policies.

That is real and it works — but it is a backstop that depends on AWS finding the key. **9,300** live keys is the measure of what the backstop misses.

## What to do

- **Delete every root access key you have.** There is no configuration where this is the right tool.
- **Search your own history, not just your current code.** Git history, container layers and CI logs are where these were found, and all three survive a tidy-up of the working tree.
- **Rotate anything that was ever committed publicly**, regardless of whether it looks used. The finding here is that old keys still work.
- **Turn on budget alerts.** It is minutes of work and it is the cheapest compromise detection most accounts will ever have.
- **Check what your ML platform accounts have published.** Model cards, notebooks and dataset repos are code, whatever they are called.

## What is not established

- **Whether any of these keys have been abused.** The research measures validity, not misuse.
- **Which organisations they belong to.** Not named.
- **How many were reported to AWS or revoked after the research.** Not stated.
- **Whether 64,024 is a floor or a ceiling.** It is what one firm's tooling found in four sources.`,
  },
  {
    slug: "e4del-pinhole-ftp-banner-dead-drop-resolver",
    title:
      "The malware reads its orders out of an FTP welcome message, before it even logs in",
    excerpt:
      "MalwareHunterTeam spotted the technique in July and SOCRadar says it is still running. A phishing ZIP drops a shortcut file, the shortcut connects to an FTP server and takes commands from the greeting banner, and either E4del or PINHOLE lands. Novel — and SOCRadar notes that being novel is also what makes it visible.",
    categorySlug: "security",
    tags: [
      "malware",
      "rats",
      "dead-drop-resolvers",
      "phishing",
      "windows",
      "threat-intel",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1708778002477-75611274f23d${P}`,
    body: `Two previously undocumented remote access trojans — **E4del** and **PINHOLE** — are being delivered by a method nobody had catalogued: instructions hidden in the greeting banner of an FTP server.

**MalwareHunterTeam** first saw it in **July 2026**. **SOCRadar** confirms the campaign was still active in **August**.

## What an FTP banner is doing here

When you connect to an FTP server, it sends a greeting line before you authenticate. It is meant for a version string or a notice.

Here it carries commands. The compromised machine connects, reads the banner, and acts on what it finds — **before logging in**, which means the operator does not need to maintain accounts or care whether authentication succeeds.

This is a **dead-drop resolver**: the malware does not carry its command server address, it goes somewhere neutral to be told. The usual version uses a social media profile or a paste site.

## The chain

- A phishing email delivers a **ZIP**
- Inside is a **.LNK** shortcut file
- The shortcut connects to an attacker-controlled FTP server and extracts commands from the banner
- A **PowerShell** script is retrieved and executed
- Either E4del or PINHOLE is deployed, by separate routes

## The two payloads are very different animals

**E4del** is a **Node.js** trojan wearing Discord's clothes — packaged inside a **digitally signed Electron application**. It runs commands through persistent or temporary shells, takes screenshots, streams the desktop over **WebSockets**, downloads further payloads, and may escalate privileges through a module named **crypto32.node**.

**PINHOLE** is the quieter one. It pulls its command-and-control configuration from **Pinterest** pins and **SurveyMonkey** surveys, keeps a minimal footprint using shellcode fluctuation, and injects itself into a suspended **ApplicationFrameHost.exe** using **Early Bird APC** injection. It supports **14** commands covering file operations, screenshots, credential theft and process management.

## Novel is not the same as good

SOCRadar makes a point that most coverage of a new technique skips: FTP connections to unknown servers are **more likely to stand out** than the web-based dead drops everyone else uses.

That is worth sitting with. A corporate endpoint making an outbound FTP connection is unusual in 2026. HTTPS to a content platform is not, which is exactly why PINHOLE's own C2 configuration lives on Pinterest and SurveyMonkey — the well-proven approach, in the same campaign, alongside the novel one.

So the interesting question is not how clever the FTP trick is. It is why an operator with good tradecraft in one component chose a delivery channel that is easier to spot. The same tension appeared in [the MacSync campaign, where domains were disguised as small businesses while the API key never rotated](/article/macsync-stealer-clickfix-rotating-domains-static-api-key).

SOCRadar's warning is that the technique adapts easily — a ClickFix campaign could carry it as readily as a phishing attachment.

## What to do

- **Alert on outbound FTP from endpoints.** Almost nothing legitimate needs it, which makes it a high-signal, low-noise detection.
- **Block .LNK files at the mail gateway**, and inside archives. A shortcut in a ZIP has no honest use.
- **Watch for LNK spawning network activity, then PowerShell.** That sequence is the whole chain.
- **Do not trust a signature on an Electron app.** E4del is digitally signed and pretending to be Discord.
- **Treat Pinterest and SurveyMonkey traffic as a possible C2 channel**, not as social noise, on hosts that have no reason to reach them.

## What is not established

- **Who is running it.** No actor named.
- **How many victims.** No count published.
- **Whether E4del and PINHOLE share an operator**, beyond arriving through the same delivery chain.
- **What the targeting is.** No sector or region has been reported.`,
  },
  {
    slug: "synkloader-teams-phishlocker-fake-lock-screen-alt-tab",
    title:
      "The fake Windows lock screen is defeated by Alt+Tab — it is just a window pretending",
    excerpt:
      "Marcus Hutchins at Expel picked apart SynkLoader, pushed through Microsoft Teams by attackers posing as the IT help desk and hosted on Azure so the download looks legitimate. Its PhishLocker module paints a convincing Windows 11 lock screen to harvest the password. It is a borderless full-screen app, and Alt+Tab exposes it.",
    categorySlug: "security",
    tags: [
      "phishing",
      "microsoft-teams",
      "credential-theft",
      "ransomware",
      "social-engineering",
      "windows",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1687560466164-1eeddb3b119b${P}`,
    body: `**SynkLoader** is a previously unknown malware family built across **Python**, **PowerShell**, **C#** and **C++**, first compiled around **28 July 2026**. **Marcus Hutchins** at **Expel** analysed it after finding it in live phishing campaigns.

## How it arrives

Through **Microsoft Teams**, from someone claiming to be the company's IT help desk, directing the victim to install a **PowerShell Cleaner** — an **.MSI** hosted on **Microsoft Azure**.

Every part of that is chosen. Teams is internal, so a message there carries authority an email does not. An IT help desk asking you to run a cleanup tool is an ordinary Tuesday. And hosting on Azure means the download URL sits on a Microsoft domain that most organisations allowlist without thinking.

Nothing is exploited. The victim installs it.

## The lock screen, and the way to beat it

The **PhishLocker** module displays a convincing **Windows 11** lock screen. The victim, seeing a locked machine, types their password into it.

Expel's finding is the useful part, and it is a one-second check: press **Alt+Tab**. The fake is just a full-screen borderless GUI application sitting on top of the real windows, so Alt+Tab reveals what is behind it. A genuine lock screen has nothing behind it to reveal.

**Ctrl+Alt+Delete** works as well, and it is the older version of the same advice — the Secure Attention Sequence exists precisely so that no ordinary application can imitate the screen it produces.

That is a piece of security guidance an ordinary person can actually use, which is rare enough to be worth repeating.

## What it takes and what that implies

Beyond the password: hostnames, usernames, privilege levels, **Active Directory** details and running processes. Further modules provide remote access, persistence, network tunnelling and desktop streaming.

Hutchins reads the Active Directory focus as the tell — measuring the size of the AD environment is what you do when you are pricing a target, which suggests SynkLoader is likely used in ransomware operations.

That fits the shape of the year. [Medusa pays initial access brokers between $100 and $1 million](/article/medusa-ransomware-500-critical-infrastructure-cisa-fbi-hhs), and a loader that reports how large an estate is produces exactly the information that market prices on.

## What to do

- **Teach Alt+Tab.** It is the single most useful thing in this story and it takes one sentence.
- **Verify IT requests out of band.** A Teams message is not verification; a known phone number is.
- **Block unsolicited MSI installs**, and do not treat an Azure or Microsoft-hosted URL as evidence of anything. Anyone can rent that address.
- **Restrict who can message staff in Teams from outside the tenant.** External access is the delivery route.
- **Alert on MSI installs that unpack Python frameworks.** That combination is unusual on a corporate endpoint.

## What is not established

- **Who is operating it.** No actor named.
- **Whether ransomware has actually followed.** Hutchins describes the likely use, not an observed one.
- **How many organisations were targeted.** No count published.
- **Which sectors.** Not reported.`,
  },
  {
    slug: "windows-kb5121003-rgb-lighting-inpoutx64-driver-crashes",
    title:
      "Your RGB lighting installed a kernel driver — and a Windows update is how you found out",
    excerpt:
      "KB5121003 broke several games with access violation errors and restarts. Microsoft traced it to drivers with filenames like inpoutx64, installed by peripherals and internal components with RGB lighting. The workaround being shared is to delete a service and remove the file from the Windows drivers folder.",
    categorySlug: "gadgets",
    tags: [
      "windows",
      "drivers",
      "gaming",
      "peripherals",
      "microsoft",
      "consumer-tech",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc${P}`,
    body: `Microsoft shipped **KB5121003** on **11 August 2026** for **Windows 11 24H2 and 25H2**. Games started crashing.

The reported symptoms are freezes, failures to launch, **EXCEPTION_ACCESS_VIOLATION** errors and unexpected restarts. **ARC Raiders**, **MARVEL Tōkon: Fighting Souls** and **The Finals** are the titles named.

Microsoft has traced it to something most players did not know was on their machine.

## What Microsoft says the cause is

Peripherals and internal components with **RGB lighting** features install drivers with filenames similar to **inpoutx64**, and launching certain games with those drivers present triggers the problem.

Microsoft says it is still working to understand the relationship between the RGB components and the affected games. No manufacturer has been named.

## The workaround tells you where this lives

Embark Studios, the developer of The Finals, shared a temporary fix: **delete the service and remove the inpoutx64 file from the Windows drivers folder**.

Read that instruction slowly. It is not "uninstall an app" or "roll back an update". It is: there is a **kernel driver** on your machine, it belongs to a service, and the fix is to delete it from **C:\\Windows\\System32\\drivers**.

Which means it was there before, and nobody told you.

## What RGB software actually installs

Controlling lighting on a keyboard, a fan or a memory stick means talking to hardware directly, and on Windows that means a driver running in the kernel — the most privileged code on the system, alongside the operating system itself.

So a category of software most people file under decoration ships kernel-level components, on millions of gaming machines, usually bundled with a utility installed once and never opened again.

**To be clear about what this story is and is not:** nobody has reported a security problem here. This is a compatibility failure, and the only reported consequence is games crashing. What it does is make visible something that was always true and rarely thought about.

The general principle is worth carrying anyway. Software that needs a driver is software you are trusting at the deepest level available, whatever it is for — and the same argument runs through [the Defender driver Check Point showed can delete Defender](/article/defender-btr-sys-boot-time-removal-golden-window-no-patch).

## What to do

- **If your games are crashing after KB5121003, check for the driver** before assuming your hardware is failing.
- **Treat the delete-the-driver workaround as temporary.** It is a community fix, it will break your lighting control, and Microsoft has not published an official one.
- **Take stock of what has installed drivers.** Most Windows machines carry several nobody remembers agreeing to.
- **Uninstall lighting utilities you do not use.** If the lights are set the way you want them, the daemon usually is not doing anything except existing.

## What is not established

- **Which manufacturers or products.** Microsoft has not named any.
- **The mechanism.** Microsoft says it is still working out the relationship.
- **When an official fix arrives.** No date given.
- **Whether other games are affected.** Three are named; the list is the reported one, not necessarily the complete one.`,
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
