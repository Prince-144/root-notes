/**
 * Drafts three pieces from 1-2 September news.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-48.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-48.ts --update
 *
 * The first one is about Anthropic among others, and this site is written
 * with Claude. The article says so in its own text rather than leaving the
 * reader to find out.
 */
import { getPayload } from "payload";
import config from "@payload-config";
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
const UPDATE = process.argv.includes("--update");

const drafts: Draft[] = [
  {
    slug: "three-labs-shipped-cyber-models-and-graded-their-own-homework",
    title:
      "Three labs shipped offensive-capable cyber models in one week, and every number in the announcements is self-reported",
    excerpt:
      "Google says its model beats Anthropic's and OpenAI's. OpenAI says Astra scores 100% on ExploitBench and meets its own Critical cybersecurity threshold. Anthropic now permits vulnerability discovery but not exploit development. Not one of those claims comes with an independent evaluation.",
    categorySlug: "ai",
    tags: ["ai-security", "anthropic", "openai", "google", "benchmarks", "disclosure"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1596865249308-2472dc5807d7${P}`,
    body: `**Disclosure first: this site is written with Claude, which is made by Anthropic, one of the three companies below.** Read the Anthropic section knowing that.

Within days of each other, Google, Anthropic and OpenAI all shipped or announced models explicitly built for cybersecurity work. The announcements are worth reading side by side, because they share a property that none of them mentions.

## What each one said

**Google** released **Gemini 3.8 Flash Cyber** on **2 September 2026**, describing it as its most capable cybersecurity model with "frontier-level performance in autonomous vulnerability discovery". Access runs through the **Fairwind Program**, restricted to high-priority defenders — governments, healthcare, telecoms — and over **650** partners including CrowdStrike, Palo Alto Networks, Datadog, Menlo Security and Snowflake. Google says it prioritised vulnerability fixing over offensive capabilities like exploitation.

**Anthropic** released **Claude Fable 5.1** and **Claude Mythos 5.1**. The line that matters is a policy change: **"Fable 5.1 can now be used to discover software vulnerabilities—though not to develop exploits for them."** Safeguards still redirect **penetration testing, exploit generation, and binary-based vulnerability scanning** to Opus models. Mythos 5.1 is gated behind a **Cyber Verification Program** and a **Life Sciences Verification Program**, currently open only to a set of US organisations.

**OpenAI** described **Astra** as meeting the **Critical cybersecurity capability threshold** under its own Preparedness Framework — a threshold OpenAI defines as independently finding and exploiting zero-days across defended systems, or running a complete attack from high-level instructions without human guidance. Access to the most advanced features runs through a **Daybreak Blue** programme for a group of testers.

## The property none of them mentions

Google says Gemini 3.8 Flash Cyber surpasses Anthropic's Mythos 5 and OpenAI's GPT-5.6 Sol.

OpenAI says Astra scores **100%** on ExploitBench, declines **91.5%** of jailbreaking requests against **59%** for GPT-5.6 Sol, discovered and used two zero-days in unnamed software, and chained multiple flaws in hardened operating systems into local privilege escalation.

Anthropic publishes its own benchmark table — Terminal-Bench 4.0 at **55.8%** against 42.0% for Fable 5, and so on — and says its cyber safeguards now block **60%** fewer false positives.

Every one of those numbers was produced by the company selling the model, measuring the thing it built, on tests it selected. **No independent evaluation is cited anywhere in any of the three announcements.**

That is normal in AI. It is much less normal in security, where the whole discipline runs on the assumption that a vendor's assessment of its own product is a starting point and not a finding. "100% on ExploitBench" is not a fact about the world; it is a fact about ExploitBench and about who ran it.

## OpenAI declared its own threshold crossed

Buried inside a product announcement is a company stating that its model meets the Critical bar of its own safety framework — the one that describes autonomous zero-day discovery and exploitation against defended systems — and shipping it under access controls.

Whatever you think of the claim, that is a significant thing to say out loud, and it will be under-covered because of where it was said.

It also invites the obvious question, which none of these announcements answers: **who decides whether the gate holds?** Fairwind, Daybreak Blue and the Cyber Verification Program are all vendor-operated allowlists. The safeguard against misuse of a Critical-threshold capability is a company's own customer vetting.

## Where Anthropic's line actually falls

"Discover vulnerabilities, but do not develop exploits" is a clean sentence and a genuinely hard line to hold in practice.

Last week **Forescout** published an experiment in which [Claude ported a working pre-auth exploit from one WAGO controller model to another](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout) — 8 hours 32 minutes, $535.74, sustained human steering, and a bricked PLC. That is not discovery. It is also not exploit development from scratch: the exploit existed, and the work was adaptation.

Porting is the case the policy sentence does not obviously cover, and it is also the case with the most commercial demand, because [the same bug across many device models is exactly where the cost sits](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout).

To Anthropic's credit, the published limitations are specific and unflattering. It says its automated behavioural audit gives **less visibility into very long-context work and multi-agent settings**, that it has **less coverage of impossible tasks than we'd like**, and that testing found **the model can still sometimes bypass approvals and auto-mode classifiers**. Those three sentences are more useful than any benchmark on the page, and they are the ones nobody will quote.

## Fewer false positives is a loosening, described as a fix

Anthropic reports Claude Code users can expect around **60% fewer interventions per session** from cyber safeguards, and that biology safeguards fire **85% less often** on benign elementary questions.

Both are real improvements — a safeguard that blocks legitimate work teaches people to route around it, and that is its own risk. But a control that fires less often is, definitionally, a control that fires less often. Precision and permissiveness are being measured with the same number, and only one of them is in the headline.

The honest version of this metric is a pair: how many benign requests stopped being blocked, and how many harmful ones started getting through. Only the first is published.

## What to do

- **Do not treat any of these benchmarks as procurement evidence.** Ask for third-party evaluation, or run the model against your own corpus.
- **If you get gated access, you are the control.** Fairwind, Daybreak Blue and CVP work only if the organisations inside them behave, and you are inside one.
- **Watch the discovery/exploitation boundary in your own usage.** Adapting an existing exploit is the common real-world task and the least clearly covered by any of the three policies.
- **Read the limitations sections.** In all three announcements they are the only parts not written by marketing.

## What is not established

- **Whether any of the benchmark claims replicate.** None has been independently verified.
- **What Astra can actually do.** OpenAI describes capability against unnamed software; nothing is demonstrable from outside.
- **How the access programmes vet applicants**, or what happens when a vetted organisation is itself compromised.
- **Whether refusal rates hold under sustained adversarial use** rather than benchmark conditions.
- **How the discovery-not-exploitation line is enforced in practice**, as distinct from stated.`,
  },
  {
    slug: "fake-installers-rename-windows-update-dlls-icacls-defender-exclusions",
    title:
      "The fake installer does not just add a Defender exclusion — it uses icacls so you cannot remove it",
    excerpt:
      "Microsoft documented a campaign of counterfeit vendor sites whose installers disable four Windows Update services, rename the update DLLs, set Defender exclusions and then lock the ACLs against standard users. The payload hash changes on every download, so there is no hash to block.",
    categorySlug: "security",
    tags: ["silver-fox", "microsoft", "defender", "windows-update", "icacls", "china"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1585314062604-1a357de8b000${P}`,
    body: `**Microsoft** disclosed a campaign on **1 September 2026** distributing malware through high-fidelity clones of legitimate software vendor sites. Victims arrive by searching for the software they wanted.

The spoofed list is long and ordinary: **Microsoft Edge**, **Baidu Pan**, **Calibre**, **Draw.io**, **Sogou**, **Kaspersky Lab**, **MindMeister**, **OBS Studio**, **Razer**, **Sejda**, **SteelSeries**, **Youdao Translate**, **DiskGenius**. The clones sit on **.com.cn** and **.hl.cn** domains with Chinese-language content.

What the installer does next is the part worth studying.

## It does not disable Defender. It makes the exclusion permanent.

The malware sets Defender exclusions through PowerShell — that is routine. Then it **modifies the discretionary access control lists using icacls** so that a standard user cannot remove them.

That is the step that changes the story. An exclusion a user can delete is a temporary problem. An exclusion protected by an ACL the user lacks permission to edit is a configuration change that survives the user noticing it.

This is the same actor Microsoft assesses — with **moderate confidence**, which is worth preserving — as **Silver Fox (Yinhu)**. We wrote about them [hiding ValleyRAT inside signed adware that users voluntarily added to their own exclusion lists](/article/valleyrat-signed-adware-antivirus-exclusion-list). Same objective, opposite direction: there the victim created the hole, here the malware creates it and then welds it open.

## Windows Update is broken, not disabled

The installer stops and disables four services — **wuauserv**, **UsoSvc**, **uhssvc** and **WaaSMedicSvc** — deletes the SoftwareDistribution cache, and then **renames the update DLLs**.

Disabling a service is reversible by anyone who knows where to look, and it looks like tampering. Renaming the libraries the update stack loads produces a machine where Windows Update fails with errors that look like **corruption**.

That distinction is operational, not cosmetic. A user who suspects tampering calls security. A user whose updates are throwing file-not-found errors calls the helpdesk, and the ticket gets triaged as a broken machine. The attacker has bought weeks of unpatched Windows and an incident that is not classified as one.

Volume shadow copies are deleted. Persistence runs through **scheduled tasks named to resemble legitimate IT jobs**.

## There is no hash to block

Archives download from **gehie246[.]com** with filenames matching the real software — and **the hash changes on every request**, which means payloads are generated server-side per download.

Hash-based indicators are therefore useless here by design, and so is any control built on them. The durable indicators in this campaign are behavioural: services stopped, DLLs renamed, exclusions written, ACLs modified.

Command and control runs over application-layer protocols on non-standard ports — **5090**, **7031-7032**, **7088-7090**, **8050**, **28290**, **28300** — to domains including **iualef[.]net** and **oijfwe[.]net**.

## What Microsoft does not say

Microsoft states plainly that **it is unclear what the end objective is**, because Defender detected the activity and initiated automated containment before the campaign got there.

That is an unusual and useful admission. Most write-ups of a campaign this elaborate assert a purpose. This one says the operation was interrupted and the destination is unknown, and leaves it there.

Affected sectors span healthcare, manufacturing, gaming, technology, logistics, government and education, **primarily affecting China-based operations of multinational organisations and Chinese-speaking users** — which means it is not a regional problem for anyone with a China presence.

## What to do

- **Alert on icacls modifying ACLs on Defender configuration.** That is not an action a legitimate installer takes.
- **Monitor the four update services as a set.** wuauserv, UsoSvc, uhssvc and WaaSMedicSvc being stopped together is a signature; individually they are noise.
- **Treat "Windows Update is broken" as a security ticket**, at least once. This campaign is built on it being triaged as an IT fault.
- **Audit exclusion lists for entries nobody added.** The list is an inventory of your blind spots either way — [we have said this before about the version where the user adds them](/article/valleyrat-signed-adware-antivirus-exclusion-list).
- **Do not build detection on file hashes here.** They rotate per download.
- **Block the software-download-by-search behaviour** where you can, with an internal software portal. Every victim in this campaign went looking for a legitimate product.

## What is not established

- **The end objective.** Microsoft says so itself.
- **The attribution.** Silver Fox at **moderate confidence**, based on prior use of spoofed vendor pages delivering Gh0st RAT and ValleyRAT. Moderate is not high.
- **How many victims.** No figure is given.
- **Whether the campaign is still live** or the infrastructure has moved.
- **Whether the same operator runs the QN Wallpaper adware route** documented separately by Kaspersky, or whether both are drawing on shared tooling.`,
  },
  {
    slug: "packagist-themes-ios-exploit-chain-every-flaw-already-patched",
    title:
      "Thirteen PHP packages ended at an iPhone kernel — and every flaw in the chain was already patched",
    excerpt:
      "Socket found Composer themes on Packagist that inject JavaScript into Vietnamese streaming sites and run a WebKit-to-kernel chain on visiting iPhones, taking keychains, SMS databases and crypto wallet seeds. The campaign targets iOS 18.4 to 18.6.x. Every vulnerability it uses has a fix.",
    categorySlug: "security",
    tags: ["supply-chain", "packagist", "ios", "webkit", "socket", "spyware"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1567095751004-aa51a2690368${P}`,
    body: `**Socket** researcher **Kush Pandya** found **13** malicious Composer theme packages on **Packagist**, spread across five vendor namespaces — **vsmov**, **vsphim**, **haiau009**, **chilltvcms** and **ophimcms**. It is an escalation of a campaign first seen with six packages in **March 2026**; the iOS chain was redeployed around **12 August 2026**.

The path is worth stating in full because of how far it travels.

## A PHP package, then someone else's phone

The themes are installed by operators of Vietnamese streaming sites. The theme injects JavaScript. Visitors to those sites get a mobile ad-fraud and gambling-redirect chain — and on iPhones, a **WebKit-to-kernel exploit chain that installs spyware**.

Nobody in that sequence is the attacker's actual target except the last person. The site operator installing a theme is thinking about layout. The visitor is watching a video.

Supply-chain compromise usually means the consumer of the package is the victim. Here the package consumer is a **delivery mechanism**, and the victims are people who have never heard of Composer. That is a different shape, and [the browser-extension campaign where five of nineteen extensions were bought from their original developers](/article/19-browser-extensions-bought-then-turned-malicious) is the closest recent parallel — a legitimate distribution channel pointed at its own audience.

## The chain

The exploit pivots from the **WebContent** sandbox into the **GPU process**, then reaches the kernel through the **AppleM2ScalerCSCDriver** IOKit user client.

It uses two WebKit flaws: **CVE-2025-31277**, patched in **iOS 18.6**, and **CVE-2025-43529**, patched in **iOS 18.7.3** and **26.2**. The kernel escape is not firmly identified — Socket's report leaves attribution among **CVE-2025-43398**, **CVE-2025-43510** and **CVE-2025-43520** unconfirmed, and notes Apple assigned no CVE for the specific issue, which was already fixed in **iOS 26.1**.

The campaign targets **iOS 18.4 through 18.6.x**.

**Every vulnerability in this chain has a fix, and several were fixed before the campaign redeployed.** This is not a zero-day operation. It is an operation against phones that did not update, and the version range tells you the operators knew exactly which population they were farming.

## What it takes

The payload collects keychains, Wi-Fi passwords, SMS databases, address books, photos, browser cookies, call history, location history and account databases — then **cryptocurrency wallet seeds** from **Bitget**, **BitKeep**, **Bitpie**, **Phantom**, **Tonkeeper**, **Trust Wallet** and **OKX**.

Everything is AES-encrypted and posted over HTTPS to rotating command-and-control domains.

The wallet list is the tell. Everything before it is generic surveillance loot; seed phrases are the part that converts directly to money, and their presence is what makes the whole chain worth building.

## On the attribution

Socket assesses the group as **Vietnamese-operated**, and the basis given is **commit metadata timestamps**.

Say plainly what that is: an inference from when commits were authored, which is a timezone signal. It is consistent with the targeting — Vietnamese streaming sites — and it is not identification. Timestamps are trivially forgeable and routinely misleading, and this site has [declined to convert weaker signals than this into nationality before](/article/owncloud-2023-flaw-philippine-nuclear-records-stolen).

The infrastructure detail is firmer: hosting is attributed to **Funnull**, an entity **sanctioned by the United States in May 2025** for facilitating romance scams tied to over **$200 million** in cryptocurrency losses.

## What to do

- **Update iOS.** The entire chain dies on a current version, and the targeted range ends at 18.6.x.
- **Audit Composer dependencies for themes**, particularly from unfamiliar vendor namespaces. A theme is code.
- **If you run a site on a third-party theme, you are shipping its JavaScript to your visitors.** Their exposure is your responsibility even when your server is untouched.
- **Move wallet seeds off any device that browses the general internet.** The specific wallets named are the ones with the best market share, not the ones with the worst security.
- **Do not rely on package-registry reputation.** Five namespaces, thirteen packages, and a prior round in March that did not stop the second.

## What is not established

- **How many sites installed the themes**, or how many visitors were exposed. No download counts are published.
- **Which kernel flaw is actually used.** Three candidates, none confirmed, and Apple issued no CVE.
- **Whether the packages have been removed** from Packagist.
- **Who the operators are.** Timezone inference from commit metadata is not attribution.
- **Whether the ad-fraud and the spyware are the same operation** or a shared delivery channel sold on.`,
  },
];

const payload = await getPayload({ config });

for (const draft of drafts) {
  const existing = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
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
