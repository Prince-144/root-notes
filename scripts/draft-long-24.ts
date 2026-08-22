/**
 * Long-form drafts — 21 August 2026, third batch.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, and cannot read a table.
 * Each section's strongest paragraph therefore stands alone and carries its own
 * figures.
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
    slug: "defender-btr-sys-boot-time-removal-golden-window-no-patch",
    title:
      "Defender ships a driver built to delete locked files at boot — and its encryption key has been the same since Windows 7",
    excerpt:
      "Check Point's Jiří Vinopal reverse-engineered BTR.sys, the Boot Time Removal Tool inside Defender, and showed it can be loaded to delete Defender itself in the window after the filesystem comes up but before the antivirus does. Microsoft says it needs admin rights already, so no patch is planned.",
    categorySlug: "security",
    tags: [
      "microsoft",
      "windows",
      "defender",
      "drivers",
      "edr-evasion",
      "black-hat",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1682195010066-8b57e5115490${P}`,
    body: `**BTR.sys** — the **Boot Time Removal Tool** — is a signed Windows driver embedded inside Microsoft Defender's **MpEngine.dll**. It exists for a sensible reason: some malware cannot be deleted while Windows is running, so Defender needs something that can remove locked files and registry entries early in the boot sequence, before the things holding them are up.

**Jiří Vinopal** of **Check Point Research** took it apart and presented the results at **Black Hat USA 2026** and **DEF CON 34**.

## The golden window

The driver's whole purpose is to act in a narrow gap: after the filesystem becomes writable, but before Defender's own user-mode services launch. Vinopal calls it the **golden window**.

In that gap, nothing has locked itself yet — including Defender. So a driver designed to delete stubborn malware files can be pointed at **WdFilter.sys** and **MsMpEng.exe** instead, and they come off the disk before they ever get the chance to defend themselves.

The tool is not being tricked into doing something foreign. It is doing exactly its job, on a different list of files.

## The key that has not changed since Windows 7

BTR.sys takes its instructions through a proprietary transaction protocol, and the configuration data is **RC4**-encrypted.

Vinopal found the **256-byte** key is hardcoded, and has been the same in **every build since Windows 7**. That is roughly **15 years** of one static key protecting the instruction channel of a signed kernel driver that deletes files.

His proof of concept, **BTR_CLI**, extracts the driver from MpEngine.dll, builds correctly encrypted transactions, and installs it as a service by writing directly to the registry — going around the Service Control Manager entirely.

## What it can do once loaded

- Delete locked files and directories
- **Move files into unrestricted paths**, including **System32\\drivers**
- Delete registry keys and values
- Write new registry values of any type

The second bullet is the one that turns this from an anti-EDR trick into something broader. A signed component that will place a file of your choosing into the driver directory is a general-purpose primitive, not just a way to remove antivirus.

## Why Microsoft is not patching it

The attack requires an administrator account holding **SeLoadDriverPrivilege**. Microsoft's position, through MSRC, is that findings resting on pre-existing administrative privilege do not meet the bar for immediate servicing. The research repository states no patch is planned, though Microsoft has not publicly confirmed that phrasing.

That is a defensible line and it is worth understanding rather than dismissing. Once an attacker is administrator with driver-loading rights, a great many things become possible, and Microsoft cannot treat every one of them as a vulnerability without redefining what an administrator is.

The counter-argument is equally real. This is the third time this month we have written about Microsoft's own signed tooling being the instrument: [WMIC removed after a decade because criminals used it more than administrators](/article/microsoft-removes-wmic-lolbin-ten-year-deprecation), [ShieldBreak going round the Defender patch to reach SYSTEM](/article/shieldbreak-cve-2026-69414-defender-patch-bypass-cfapi), and now a Defender driver that will delete Defender. "You already needed admin" explains why it is not a vulnerability. It does not make the box any less removable.

## Nobody has used it

Check Point states plainly that across all collected samples and telemetry it saw no evidence of real-world abuse.

Worth holding, and worth not relaxing about — the technique is now documented, presented at two conferences, with a working tool published.

## What to do

- **Restrict SeLoadDriverPrivilege.** This is the primary control and most estates hand it out more widely than they realise.
- **Alert on the artefacts Check Point published.** Sysmon **FileCreateStreamHash** events with filenames ending **.sys:changelist**, and registry events containing **:changelist** with a **Boot Bus Extender** group value.
- **Watch for services created by direct registry write** rather than through the Service Control Manager. That bypass is unusual enough to be worth an alert on its own.
- **Treat the loss of Defender at boot as an event.** If MsMpEng is not running after a restart, something removed it, and the absence of alerts is the alert.
- **Do not rely on a single endpoint agent to notice its own deletion.** By construction it will not be there to file the report.

## What is not established

- **Whether Microsoft will change position.** No patch is planned per the research; Microsoft has not stated this publicly.
- **Whether the technique is in use.** No evidence found as of the August disclosure.
- **Which other signed components share the pattern.** Nobody has published an equivalent audit.`,
  },
  {
    slug: "dofun-head-unit-malware-twcore-updater-moyu-badbox",
    title:
      "The malware reaches the car through the update channel the car trusts",
    excerpt:
      "Kaspersky found previously unknown malware on Android head units running DoFun, delivered through the legitimate update mechanism of a system app over an MQTT broker. It checks in every 90 minutes, runs ad fraud, and is attributed with high confidence to the group behind the BADBOX botnet.",
    categorySlug: "gadgets",
    tags: [
      "android",
      "automotive",
      "supply-chain",
      "botnet",
      "ad-fraud",
      "kaspersky",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1705360866117-baddb6e1d5e4${P}`,
    body: `**Kaspersky** found it in **June 2026**: previously unknown malware running on Android-based car **head units** powered by **DoFun**, in both factory-fitted and aftermarket units.

It is attributed with high confidence to the **MoYu Group**, which operates the **BADBOX** botnet for ad fraud and residential proxy services.

## The delivery is the story

Nobody exploited anything. The malware arrives through the update channel.

The **TWCore** system app — **com.tw.core** — has a legitimate update mechanism that pulls APK files through an **MQTT** message broker at **cardoor[.]cn**, and a dropper Kaspersky calls **JarService** rides it. This is the path the head unit is built to trust: no user prompt to ignore, no sideloading to warn about, no permission dialog. Researchers counted **7** variants going back to version **3.57**, so it has been carrying payloads for a while.

That makes it the same shape as [the Rust crate poisoned at compile time](/article/arrayref-rust-crates-io-sapphire-sleet-86-minutes) and [the Firefox extensions repurposed under their original IDs](/article/offside-wallet-theft-factory-40-firefox-extensions-socket): the attacker does not defeat the trust decision, they inherit one already made.

## What it does

Kaspersky reports **9** commands supporting unwanted advertising, ad fraud, and downloading further malicious modules. It also collects device information — display resolution, model, Wi-Fi identifiers and MAC addresses.

It checks for configuration updates every **90 minutes** by HTTP POST to its command servers, which is frequent enough to retask the fleet within a working day and quiet enough that nobody looking at a data bill would notice it.

## Why a car head unit is a good target

Better than it first sounds, and worse for the owner.

A head unit is a full Android computer with a screen the driver looks at, and **its own SIM slot** for connectivity. It is not tethered to your phone's data plan or your home Wi-Fi. It has an independent internet connection, in a moving vehicle, from a mobile network — which is exactly the profile a **residential proxy** operation wants, and the reason a device you never think of as a computer ends up carrying somebody's traffic.

Kaspersky also notes head units hold partial control over some vehicle functions. Nothing in this campaign touches that, and the distance between an advertising fraud module and vehicle controls is real. It is worth saying that the same code is running on the same board.

## The unglamorous business behind it

Ad fraud and proxy resale are not headline crimes, which is precisely why they scale. Nobody calls the police because their infotainment screen served an advert to nobody at 3am, and the owner will never see a symptom beyond slightly worse battery drain and data usage they cannot itemise.

It is the same economics behind [the Mirai variant that wanted routers for SOCKS5 rather than DDoS](/article/evooo1bot-mirai-routers-socks5-residential-proxy). Persistent, quiet, monetised per device.

## What owners and manufacturers can do

Honestly, owners can do little, and that is the point worth making.

- **You cannot audit it.** There is no app store review, no security patch level shown, and usually no way to know what version of anything the unit is running.
- **If the unit has a SIM slot you are not using, take the SIM out.** A head unit with no independent connection cannot be reached or used as a proxy.
- **Watch the data bill on a connected car plan.** Unexplained usage on a vehicle SIM is the one symptom an owner can actually observe.
- **Aftermarket units are the higher risk**, because there is no manufacturer relationship at all and no update commitment.

For the industry the failure is structural: an infotainment supply chain where a system app can push APKs over an MQTT broker, with no signing story the owner can inspect. Kaspersky reports the issue enabling the abuse has been addressed after disclosure, without detailing how.

## What is not established

- **How many vehicles are infected.** No count or geographic breakdown has been published.
- **Which manufacturers or models** are affected. Neither Kaspersky's report nor the coverage names them.
- **Whether vehicle functions were ever touched.** Nothing reported suggests they were.
- **What "addressed" means.** The remediation is stated, not described.`,
  },
  {
    slug: "cisco-crosswork-secure-workload-five-cvss-10-internal-review",
    title:
      "Five CVSS 10.0 flaws in one Cisco release — and the company found all of them itself",
    excerpt:
      "Nine vulnerabilities across Crosswork and Secure Workload, five of them scoring a maximum 10.0, including two separate authentication bypasses and a SQL injection. None are known to be exploited. All came out of Cisco's own internal review, which is the second such batch in a fortnight.",
    categorySlug: "security",
    tags: [
      "cisco",
      "vulnerabilities",
      "patching",
      "network-management",
      "authentication-bypass",
      "enterprise",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1743412059152-d577187040c1${P}`,
    body: `Cisco has patched **9** vulnerabilities across **Crosswork** — Data Gateway, Network Controller and Planning — and **Secure Workload**, in both SaaS and on-premises deployments.

**5** of them score **CVSS 10.0**.

Five maximum-severity flaws in a single advisory cycle is not a normal week for any vendor.

## The nine

| CVE | Score | Class | Product |
| --- | --- | --- | --- |
| CVE-2026-20030 | **10.0** | SQL injection | Crosswork |
| CVE-2026-20357 | **10.0** | Missing authentication for critical function | Crosswork |
| CVE-2026-20358 | **10.0** | External control of file system | Crosswork |
| CVE-2026-20315 | **10.0** | Access control bypass | Secure Workload |
| CVE-2026-20317 | **10.0** | Authentication bypass | Secure Workload |
| CVE-2026-20359 | 9.9 | Insufficiently protected credentials | Crosswork |
| CVE-2026-20231 | 9.9 | Command / OS / argument injection | Secure Workload |
| CVE-2026-20318 | 9.6 | Input validation, path traversal | Secure Workload |
| CVE-2026-20319 | 7.5 | Buffer overflow, out-of-bounds write | Secure Workload |

Read the class column rather than the numbers. Missing authentication for a critical function, access control bypass and authentication bypass are three separate ways of describing the same outcome — a caller who should have been stopped, and was not.

## What these products are

This matters more than the CVSS.

**Crosswork** is network automation and orchestration: it holds credentials for network devices and pushes configuration to them. **Secure Workload** is microsegmentation — it decides which workloads may talk to which.

So an authentication bypass here does not get an attacker onto a server. It gets them to the thing that configures the servers, or the thing that decides what the firewall rules are. Compromising the management plane is strictly better than compromising anything it manages, which is the same reason [the Clop web shell that decrypted the LDAP manager password out of a Windchill keystore](/article/clop-windchill-cve-2026-12569-jsp-webshell-philips-ge-shell) mattered beyond the application it sat in.

## Fixed in

| Product | Affected | Upgrade to |
| --- | --- | --- |
| Crosswork | 7.2.1 and earlier | **7.2.1-SP** |
| Secure Workload | 3.10 and earlier | **3.10.9.1** |
| Secure Workload | 4.0 | **4.0.4.16** |

## Found internally, which cuts both ways

Cisco says the flaws came out of internal testing and are not known to be actively exploited.

That is genuinely good. A vendor auditing its own products and shipping nine fixes, five at maximum severity, before anyone was attacked, is the process working. It is also the **second** such batch in a fortnight, following **12** fixes for Catalyst SD-WAN and IOS XE.

The uncomfortable reading is the obvious one: if a focused internal review keeps producing maximum-severity authentication bypasses, they were there for a while and something other than an internal review could have found them first. Twenty-one serious flaws in two weeks is a statement about what was already shipped, not only about the quality of the review.

## What to do

- **Patch, and prioritise Secure Workload's two bypasses.** A segmentation product that can be bypassed is worse than no segmentation product, because you planned around it.
- **Check whether these interfaces are reachable from anywhere they should not be.** Management planes end up on flat networks more often than anyone admits.
- **Rotate the device credentials Crosswork holds.** Insufficiently protected credentials at 9.9 is in this batch, and that is what it protects.
- **Review recent configuration pushes.** If the orchestrator could be reached without authenticating, the record of what it changed is what you check.
- **Do not skip 7.5.** It is the lowest number here and it is still a memory-safety flaw in the same product.

## What is not established

- **Whether any of these were found externally first.** Cisco reports internal discovery.
- **Whether exploitation has begun.** None known at the time of writing.
- **How many deployments are exposed.** No figures published.
- **How long the flaws were present.** Not stated.`,
  },
  {
    slug: "redc2-4-npm-packages-llm-red-agent-99-dollars",
    title:
      "A $99.99 backdoor with a plain-English front end — and importing the package is enough to start it",
    excerpt:
      "TrendAI found 14 npm packages posing as calendar utilities and carrying RedC2 4.0, a Linux implant sold on Hack Forums. There is no install hook: the payload launches when the module loads, so one transitive import runs it. The framework's Red Agent turns natural-language prompts into intrusion command sequences.",
    categorySlug: "security",
    tags: [
      "npm",
      "supply-chain",
      "linux",
      "malware",
      "ai-assisted-attacks",
      "c2-frameworks",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1671869550400-01cb4ed6de70${P}`,
    body: `**TrendAI**, Trend Micro's enterprise research arm, reported on **21 August 2026** that **14** npm packages posing as calendar and utility tools were carrying **RedC2 4.0**, a Linux backdoor.

The package names are variations on a theme — **streak-metrics-math**, **streak-map-cache**, **kit-map-vim**, **streak-calc-math** and similar — almost all published at version **1.0.0**. The binaries sat in **dist/** or **dist/internal/** under innocuous names like **math-core.bin**, **calc-math.dat** and **calc.bin**.

## No install hook, which is the point

Most npm supply-chain attacks use a **postinstall** script, and most defensive advice is built around that — audit install scripts, disable them in CI, review what runs at install time.

This does not use one. Researcher **Aliakbar Zahravi** describes it precisely: the package re-exports the legitimate date helpers and launches the bundled implant **as soon as the module loads**, with no install hook and no exported function needing to be called.

TrendAI's summary of the consequence is the sentence to take away: a single import anywhere in the dependency graph, **even a transitive one**, is enough to execute the payload.

You do not have to use the package. You have to be somewhere underneath something that imports it. That is the same mechanic as [the Rust crate whose build script ran at compile time](/article/arrayref-rust-crates-io-sapphire-sleet-86-minutes), arriving at the same place from the opposite direction — one runs when you build, one runs when you load, and neither waits for you to call anything.

## What RedC2 4.0 is

A commercial product. It was advertised in **June 2026** on Hack Forums by a seller calling himself **MarlboroMan**, described as built for evasion, and priced at **$99.99**.

The Linux beacon does what a modern implant does:

- Interactive shell through **/bin/sh**
- System discovery and file operations
- **SSH key and browser credential harvesting**
- **In-memory ELF execution**, so the second stage never lands on disk
- **SOCKS5** proxying and network pivoting
- Persistence

## The Red Agent

RedC2 4.0 ships with a component called **Red Agent**, and this is the part worth sitting with.

Per TrendAI, an operator types **natural-language prompts** and the framework translates them into actionable command sequences. The pitch is that operators of varying skill can run complex multi-stage intrusions.

Notice what that is and is not. It is not an autonomous attacker. Nobody is claiming the framework decides what to do. It is a **translation layer** — the same thing every other tool is bolting on — placed between a person who knows what they want and a set of capabilities they could not previously drive.

That lowers the floor rather than raising the ceiling. The skilled operator was never blocked by remembering command syntax. The buyer at **$99.99** was.

Read it alongside [the five-agency advisory describing AI-written tooling for Siemens PLCs](/article/siemens-s7-plc-ai-written-snap7-tooling-five-agency-advisory): in both cases the AI is doing authorship or translation, not autonomy, and in both cases what it removes is the requirement to be an expert.

## What to do

- **Search your lockfiles for the package names**, not just your direct dependencies. Transitive is the whole point.
- **Stop relying on install-script controls alone.** Disabling postinstall does nothing here.
- **Treat any Linux build agent that resolved these as compromised**, and rotate its SSH keys first — that is what the beacon collects.
- **Watch for outbound SOCKS5 and unexplained shell processes** under your node user on build hosts.
- **Pin and commit lockfiles**, and prefer a mirrored registry for production builds.

## What is not established

- **Download counts.** Not published.
- **Whether npm has removed the packages.** Not stated in the reporting.
- **Who deployed it.** RedC2 is sold commercially, so its users are not one actor.
- **How effective Red Agent actually is.** The capability is advertised by its seller and described by researchers; no evaluation of it has been published.`,
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
