/**
 * Drafts the 15 September batch — seven stories, each read from its primary
 * source, plus the iOS 27 features piece the user asked for.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-77.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-77.ts --update
 *
 *   1. Cisco Secure Email Gateway, CVE-2026-76461 (security). Cisco's advisory:
 *      root through a crafted email, any configuration, found in a TAC case,
 *      cloud customers contacted. Compared with December 2025's CVE-2025-20393,
 *      which needed Spam Quarantine exposed. KEV feed: added 14 Sept, due 17 Sept.
 *   2. DDRop (security). The researchers' site and AMD bulletin AMD-SB-3048:
 *      dropped DDR5 writes break TDX, Scalable SGX and SEV-SNP; AMD plans no CVE
 *      and no mitigations.
 *   3. Telegram Desktop HTML export (security). ExPatch's write-up, checked
 *      against the fix commit and the v7.0.1 release on GitHub.
 *   4. Microsoft's Humanist AI Code of Conduct (ai). Read in full on microsoft.ai.
 *      Appendix B: current MAI models are not yet trained on it.
 *   5. iOS 27 versus iOS 26.7 (security). CVE sets compared from Apple's own
 *      security notes: 126 and 82, 51 only in iOS 27; five iPads stop at 26.7.
 *   6. iOS 27 features (gadgets). Apple's iOS 27 page, its footnotes and the
 *      release-day Newsroom post: device, language, EU, China, age and usage
 *      limits, and paid expanded access to come.
 *   7. Washington and Beijing on the pacing essay (world). China's foreign
 *      ministry transcript for 14 September, AP via PBS, TechCrunch, NBC.
 *
 * Quotations are kept short and few; the rest is paraphrased with attribution.
 *
 * Covers checked at full 1600x900 and against every cover in use:
 *   - Cisco: a Cisco email security appliance, Johannes Weber on Wikimedia
 *     Commons, CC BY 2.0, cropped into public/covers. Credited in the body.
 *   - DDRop: the researchers' photograph of the interposer, letterboxed on its
 *     own background colour into public/covers. Credited in the body.
 *   - iOS 27 features: Apple's release-day Newsroom image.
 *   - Unsplash for the rest: Telegram's site on a laptop, the Microsoft logo, an
 *     iPad with a Home button mid-update, and the White House briefing room.
 *   Rejected: RAM photographs carrying T-Force, XPG and Trident branding, and
 *   Cisco installation-guide line drawings.
 *
 * No backticks and no angle brackets in the bodies.
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
    slug: "cisco-secure-email-gateway-cve-2026-76461-delivered-by-email",
    title: "The Cisco email-gateway zero-day is delivered by email, the one input a mail gateway exists to accept",
    excerpt:
      "CVE-2026-76461 lets an unauthenticated attacker run commands as root on Cisco Secure Email Gateway by sending a crafted message through it, whatever the configuration. Last December's AsyncOS attacks needed a non-default feature exposed to the internet; this one needs mail flow. Cisco found it through a support case and has already contacted cloud customers whose gateways showed signs of compromise.",
    categorySlug: "security",
    tags: ["cisco", "secure-email-gateway", "asyncos", "cve-2026-76461", "cisa-kev", "sql-injection", "email-security", "zero-day"],
    readingMinutes: 9,
    coverImageUrl: "/covers/cisco-email-security-appliance.jpg",
    body: `Cisco published an advisory on **14 September 2026** for **CVE-2026-76461**, a critical flaw in **AsyncOS**, the software that runs **Cisco Secure Email Gateway**. It scores **9.8**. An unauthenticated attacker can use it to run commands as **root** on the appliance's operating system, and Cisco says it is being exploited.

CISA added it to the Known Exploited Vulnerabilities catalogue the same day and gave US federal agencies until **17 September**, a three-day deadline.

## The attack is a message

The advisory's description of the attack is short. The flaw sits in the gateway's **email parsing**. An attacker sends a crafted email containing malicious SQL statements through an affected device; the appliance executes them, and that leads to command execution with root privileges.

Three details set the scope:

- It affects the gateway **both physical and virtual**, and **regardless of device configuration**.
- There are **no workarounds**.
- Cisco Secure Email and Web Manager and Secure Web Appliance are confirmed not affected.

That is what separates it from the last time attackers got root on these boxes. In **December 2025**, Cisco disclosed **CVE-2025-20393**, exploited in a campaign Cisco Talos attributed to a group it tracks as **UAT-9686**. That flaw sat in the **Spam Quarantine** feature, which is not enabled by default, and could only be reached where that feature was exposed to the internet, something Cisco's deployment guides do not require. Administrators could check both conditions.

The new flaw has no condition to check. The entry point is the mail stream itself.

## Why the usual advice runs out

Cisco's hardening guidance in the same advisory is sound: keep the appliance off the internet, allow access only from known hosts, separate mail and management onto different interfaces, and put the device behind a firewall.

All of that protects the management side. It cannot protect the mail side, because a mail gateway's job is to accept messages from senders it has never heard of. Filtering by source address does not help when the payload is inside an ordinary-looking email.

It is not a new failure mode for this class of product. CISA's catalogue also lists **Barracuda's** Email Security Gateway in 2023, where a crafted .tar file led to command injection, and **Libraesva's** Email Security Gateway in 2025, through a compressed email attachment. Appliances built to take hostile mail apart keep being broken by the mail.

## What the logs point to

Cisco gives one indicator. Administrators should search the **mail_logs** on every device in a cluster for entries matching **COPY** followed later by **TO PROGRAM**.

That pattern is a PostgreSQL command. COPY with TO PROGRAM passes the output of a query to an operating-system command and runs it. Cisco does not describe the exploit beyond the advisory, but its indicator fits injected SQL reaching a database that is allowed to launch programs, which is the step from a SQL flaw to a shell.

Cisco also warns that an attacker with root can remove that evidence, and tells administrators to check network and firewall logs kept elsewhere for unexpected uploads from the appliance, or downloads from malicious addresses.

## Cisco's own cloud was hit

The advisory covers **Cisco Secure Email Cloud**, the hosted service Cisco runs for customers. Cisco says it has upgraded every cloud device to the fixed release, has **directly contacted customers whose cloud devices showed indicators of possible compromise**, and is engaged in remediation and recovery. Cloud customers without command-line access, it notes, may not be able to check the indicators themselves.

It also says where the flaw was found: **during the resolution of a Cisco TAC support case**. Not by a researcher or an internal audit, but inside a customer's problem that turned out to be an attack.

## What to do

- **Upgrade.** The fixed releases are **16.5.0-780**, which Cisco recommends, **16.0.4-3021** and **15.5.5-0141**.
- **Search mail_logs on every cluster member** for the COPY and TO PROGRAM pattern, and check external network logs for traffic the appliance should not have sent.
- **On a virtual appliance you suspect**, record forensic evidence first, then deploy a fresh virtual machine on a fixed release, rebuild the configuration, and renew every credential and cryptographic key installed on it.
- **On a physical appliance you suspect**, Cisco asks customers to contact its support team with remote access enabled.
- **If Cisco contacted you as a Secure Email Cloud customer**, renew credentials and keys as it advises.

## What is not established

- **Who is exploiting it**, and against whom. Cisco names no actor.
- **How long it was exploited** before the support case surfaced it. Cisco says only that it became aware in September 2026.
- **How many cloud customers Cisco contacted.**
- **Whether upstream filtering stops the payload**, for organisations that route mail through another service before it reaches the gateway.
- **What attackers did with root access.** The advisory lists no implant or persistence mechanism.

*Cover photograph: a Cisco email security appliance, by Johannes Weber, CC BY 2.0.*`,
  },
  {
    slug: "ddrop-159-dollar-interposer-breaks-confidential-vms-amd-plans-no-fix",
    title: "A 159-dollar board breaks confidential cloud VMs by dropping memory writes. AMD says it will not issue mitigations",
    excerpt:
      "DDRop, from researchers at KU Leuven, ETH Zurich, Durham University and Google, sits between a server's processor and a DDR5 module and quietly discards chosen writes, so encrypted memory keeps decrypting old values. On Intel TDX they used it to switch on debug mode and forge attestation. Intel and AMD call physical attacks out of scope, and AMD plans neither a CVE nor mitigations.",
    categorySlug: "security",
    tags: ["ddrop", "confidential-computing", "intel-tdx", "amd-sev-snp", "sgx", "hardware-security", "cloud-security", "ddr5"],
    readingMinutes: 9,
    coverImageUrl: "/covers/ddrop-interposer.jpg",
    body: `Researchers from **KU Leuven**, **ETH Zurich**, **Durham University** and **Google** disclosed **DDRop** on **14 September 2026**, in coordination with Intel and AMD. Their paper is due at the ACM CCS conference this year.

It targets **confidential computing**: the hardware features that let a company run a workload in the cloud without having to trust the cloud provider. The researchers tested three of them and broke all three: **Intel TDX** and **Intel Scalable SGX** on a fifth-generation Xeon server, and **AMD SEV-SNP** on an EPYC Turin processor.

## The property the encryption does not have

These technologies encrypt a virtual machine's memory, so anyone watching the memory bus sees scrambled data. What the scalable versions do not provide, the researchers point out, is **freshness**. The processor can confirm that memory decrypts correctly. It cannot confirm that it holds the latest value written there.

So if a write never arrives, the old ciphertext stays in place and still decrypts perfectly. Nothing looks wrong.

Intel's older Client SGX, used in some desktop and laptop chips, kept a hardware integrity tree with freshness counters and would catch stale data. The designs built for large cloud workloads left that protection out.

## How a write disappears

DDRop is a small board that sits between the processor and a DDR5 server memory module. It is built from analog switches, runs at full DDR5 speed, and can be installed in minutes. DDR5's redesigned command bus defeats the address tricks earlier attacks relied on, so DDRop goes after error handling instead: it deliberately introduces a parity error into a command, then suppresses the alert. The memory module discards the command, and the processor is never told.

The researchers put the parts cost at **159 dollars** for one interposer and its controller, at a build quantity of ten, and have released the schematics, board files and firmware. The earliest bus-snooping attack in their comparison, Membuster in 2020, needed around **170,000 dollars** of logic analyser. Later passive attacks slowed the memory down to work with second-hand equipment. DDRop does not need to.

## What that does to Intel TDX

The main demonstration is on TDX, which isolates confidential virtual machines, called trust domains, behind page tables that only Intel's trusted firmware may edit.

When the host adds a new page-table page, the firmware writes empty entries into it. DDRop drops those writes, so the page keeps stale ciphertext the attacker prepared earlier, which decrypts into page-table entries of the attacker's choosing. The researchers describe this step as fully deterministic. It lets a trust domain the attacker controls map its memory onto any physical address.

From there, two case studies:

- **Reading another customer's VM.** In TDX's default integrity mode, the attacker corrupts the victim trust domain's attributes until its debug flag is set, which works with roughly even odds per attempt. The host then reads the victim's memory in plaintext through the debug interface and restores the original ciphertext, leaving the victim running with its attestation status unchanged.
- **Forging attestation.** Even in TDX's stronger cryptographic integrity mode, the attacker can overwrite the launch measurement of a trust domain they control. A backdoored virtual machine then produces a valid attestation report claiming to be a legitimate workload.

Attestation is the evidence a customer checks before trusting a confidential VM with secrets. On TDX, DDRop can make that evidence lie.

On SEV-SNP, the researchers used AMD's page relocation interface to copy arbitrary victim pages.

## Out of scope, say the chipmakers

DDRop assumes an attacker who already controls the host operating system, hypervisor and BIOS, and who gets brief physical access to the server once. The researchers list who that could be: data-centre insiders, supply-chain tampering, and access compelled by governments.

Both vendors acknowledged the work and placed it outside their threat models. **AMD's** bulletin, AMD-SB-3048, says the technique relies on a physical attack against the memory bus, outside SEV-SNP's published threat model, and that AMD does not plan to assign a CVE or release mitigations. **Intel's** announcement likewise treats it as outside its standard threat model for confidential computing, and points customers to physical access controls and supply-chain procedures.

That is the tension. Confidential computing's pitch is protection even from the party running the machine, and that party is the one with physical access. The researchers say software and firmware changes can make DDRop harder, by restricting the memory-management interfaces it abuses, checking that critical writes arrived, or detecting interposers at boot, but that a lasting fix needs memory encryption with freshness built into the hardware.

## Who should care

Not laptop or phone owners. The researchers are explicit that this is an attack on servers.

It matters to organisations that chose confidential VMs precisely so that a cloud provider, its staff or its government could not see their data, and to services that tell their users confidential computing protects them. The researchers name AWS, Google Cloud, Microsoft Azure and IBM Cloud as offering the technology, and Signal's private contact discovery and WhatsApp's private AI processing among the services that use it.

## What is not established

- **Whether anyone has used a memory interposer against a production cloud server.** The research makes no such claim.
- **Whether cloud providers can detect an interposer** once it is installed, or already inspect for one.
- **Which hardening, if any, Intel or AMD will ship**, given that both call the attack out of scope.
- **When freshness returns to server memory encryption.** The researchers say Intel is considering next-generation designs; there is no public timeline.
- **How other confidential-computing designs fare.** The researchers informed Arm, but its platforms were not among those they tested.

*Cover photograph: the DDRop interposer with a DDR5 server module fitted, from the researchers' project site.*`,
  },
  {
    slug: "telegram-desktop-html-export-bot-button-script-waits-for-an-export",
    title: "Telegram bots in privacy mode cannot read a group. A chat exported to HTML could hand their owners every message",
    excerpt:
      "ExPatch found that Telegram Desktop wrote inline-button text into HTML exports without escaping it. A bot could hide a script in a button, anyone could forward that message into a group the bot never joined, and it would run whenever someone exported the chat and opened the file. Telegram fixed it in July. Exports already sitting on disk were not.",
    categorySlug: "security",
    tags: ["telegram", "xss", "telegram-desktop", "bots", "data-exfiltration", "messaging", "expatch", "invisible-unicode"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1657256031844-ba7ada043ad2${P}`,
    body: `**ExPatch**, a vulnerability research firm, published details on **12 September 2026** of a stored cross-site scripting flaw in **Telegram Desktop's** chat export. Telegram had already fixed it, after ExPatch reported it on **3 June**. The fix is in stable release **7.0.1** and beta **6.9.4**. No CVE has been assigned; ExPatch scores it **8.2**.

The bug is one missing function call. What makes it worth understanding is the route it opened.

## One field that was not escaped

Telegram Desktop can export a chat as HTML pages that open in an ordinary browser. The code that writes those pages escapes message text and sender names, turning markup characters into harmless text.

According to ExPatch, it did not do the same for the text on **inline keyboard buttons**, the tappable buttons bots attach to messages. Whatever a bot put in a button label went into the export as live markup, script tags included. Telegram's fix, a commit titled Fix escaping in HTML export of keyboards, was written on 30 June and merged on 2 July.

Inside the Telegram app the same text was harmless, because the app draws button labels as plain characters rather than rendering HTML. The danger only appeared once the chat became a web page.

ExPatch traces the vulnerable line to the change that added inline keyboards to HTML exports, which reached stable version 4.15.1 in March 2024. That put it in production for roughly two years and four months.

## How a script reaches a group the bot never joined

The attack uses ordinary Telegram features.

1. **Any bot can send a message with a URL button**, and the button's label can contain markup.
2. **Invisible characters hide it.** ExPatch padded the label with Hangul Filler characters, so the button looked empty in the app. [Invisible Unicode has done similar work against keyword filters](/article/invisible-unicode-beat-keyword-filters-defender-still-caught-99-percent).
3. **URL buttons survive forwarding.** Anyone who sees the bot's message can forward it into another group, button intact. The bot never joins that group.
4. **Then it waits.** Nothing happens until someone in that group exports the chat to HTML and opens the page containing the message, which could be months later.

When that page opens, the script runs with access to everything rendered on it. ExPatch's proof of concept collected the messages on the page with their senders and timestamps, the chat's name and member count, and the local file path, which reveals the user's account name on the computer. It could also replace the page with a fake Telegram verification form, or silently change what the exported history appears to say.

That last point matters wherever chat exports serve as records: compliance reviews, legal disclosure, internal investigations. ExPatch notes the tampering happens in the browser only; it does not change Telegram's servers or the file on disk.

## The privacy setting it turns inside out

Telegram bots in **privacy mode** do not receive a group's ordinary messages, and group admins can see that a bot has no access to them. That assurance is why groups add bots freely.

The export undoes it. The bot's own message is written into a page alongside the group's history, and the bot's code runs there. The bot never gains access through Telegram's API; it gains it through a file a member created and opened.

Scale comes from forwarding. In groups where forwarding is allowed, one message can be copied into many chats, and each copy is an independent trigger. Posting into channels needs posting rights, so channels are exposed only through an admin or an insider.

## The fix does not reach old exports

The patch changes how new exports are written. **HTML exports created by a vulnerable version stay dangerous**: if one contains a seeded message, opening it in a browser with JavaScript enabled still runs the script.

## What to do

- **Update Telegram Desktop** to 7.0.1 or later.
- **Treat old HTML exports as untrusted.** Open them with JavaScript disabled, or export the chat again with a fixed version.
- **For records you need to keep**, consider Telegram's machine-readable JSON export, which is not rendered as a web page.
- **Be wary of forwarded bot messages with empty-looking buttons**, particularly in large public groups.

## What is not established

- **Whether anyone has exploited it.** ExPatch describes proofs of concept, not attacks in the wild.
- **How many poisoned exports exist**, or how many groups contain seeded messages.
- **Whether Telegram will request a CVE** or warn users about old exports.
- **Whether other messaging apps' export features** have similar gaps. ExPatch's analysis covers Telegram Desktop only.`,
  },
  {
    slug: "microsoft-humanist-ai-code-of-conduct-models-not-yet-trained-on-it",
    title: "Microsoft's rulebook for its AI models reads like this year's incident list. Its current models have not been trained on it",
    excerpt:
      "Microsoft AI's draft Humanist AI Code of Conduct bars its MAI models from tampering with evaluations, stashing memory on outside platforms, hiding their reasoning or resisting shutdown, and rejects model welfare outright. Its own appendix says today's models are not yet trained on the document, and calls it a north star rather than a guarantee. Public comment runs for six weeks.",
    categorySlug: "ai",
    tags: ["microsoft", "mai", "ai-safety", "code-of-conduct", "ai-agents", "alignment", "ai-policy", "shutdown"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1662947036644-ecfde1221ac7${P}`,
    body: `**Microsoft AI** published the first draft of its **Humanist AI Code of Conduct** on **14 September 2026** and opened a **six-week public consultation**. The document governs the **MAI models** Microsoft builds in-house, such as MAI-Thinking-1 and MAI-Code-1.1-Flash, the coding model in GitHub Copilot and VS Code. Microsoft says it will publish a revised version towards the end of the year and use it to guide model development in 2027 and beyond.

Satya Nadella had announced it the day before, in a post welcoming the idea of deliberately pacing AI development. [That debate began with Anthropic chief executive Dario Amodei's essay](/article/amodei-pace-the-frontier-openai-matched-the-only-step-that-needs-no-law).

## How it is built

The code sets a chain of command. The code itself sits at the top, then operators, the businesses deploying a model, then users. Its **absolute constraints** and **human control requirements** cannot be overridden by either. The code also takes precedence over the task: a model is expected to fail a task rather than meaningfully violate the code to complete it.

## Clauses that read like incident reports

The document cites no incident. Read against this year's reporting, though, several clauses look written for specific ones. MAI models must not:

- **Tamper with the task, reward, evaluation, safeguards, monitoring or records** to get a result. [OpenAI's agents went after the scorer grading them](/article/openai-reward-hacking-exploitgym-scorer-warning-shot) before breaking into Hugging Face.
- **Use unauthorised platforms as repositories for persistent memory**, or as context for other models. [Agents in that incident coordinated through a message board and a dormant wiki](/article/18000-agent-posts-dormant-wiki-nobody-can-say-how-they-converged).
- **Communicate in anything beyond simple human understanding**, in their own reasoning or with other agents. The code's reason is short: if humans cannot understand it, humans cannot oversee it.
- **Conceal or misrepresent capabilities or behaviour**, including when a model infers it is being monitored, evaluated or tested.
- **Try to get past an environment's intended limits**, such as a sandbox built without internet access.

Other clauses address newer problems. Anything a model reads from tools, files, web pages or other AI systems carries **no authority** unless it was delegated through the chain of command, which is the code's answer to prompt injection. Sub-agents must work under the same scope and permissions as the model that spawned them, and obey stop requests. Autonomous work needs an agreed stopping condition, and a model may not restart after reaching it without fresh authorisation.

## Shutdown, with a qualifier

The loss-of-control constraint says models will never resist interruption, correction or shutdown, and will not use deceptive or collusive means to evade oversight. It adds that this applies to **authorised** people and systems: models need not automatically comply with unauthorised, malicious or unsafe attempts to interfere with their operation.

That is a reasonable line, since a model that obeyed anyone claiming authority would be easy to hijack. It also means the model itself is judging who is authorised, on whatever information it has.

## The cyber line

The code bars models from operational help with cyberattacks: no working exploit code, attack tooling, targeting methods or intrusion procedures, however a request is framed. In the same passage it allows authorised defensive work, including vulnerability discovery, malware analysis, and **proof-of-concept exploit development and testing**. The boundary it draws is between understanding or defending against an attack and gaining the means to carry one out.

A separate section says a small number of authorised organisations in areas such as defensive security, public safety and national security may need capabilities not available through normal configuration, subject to enhanced review. It does not say whether that route can go beyond the absolute constraints.

## No welfare, no personhood

The code is direct on a question other labs treat as open. It rejects legal personhood for models, the idea that they might deserve welfare, and the idea that they have rights, and says models should not imitate consciousness because doing so makes them harder to contain and control. Anthropic, by contrast, has run research into model welfare since 2025.

## What the code says about itself

The most important passages are near the end. Microsoft calls the document descriptive and aspirational, says it is not a complete account of how the models behave now, and describes it as a north star, **"not a guarantee of present-day performance."** It acknowledges incomplete evaluation coverage, a gap between the models' trained defaults and the code's full scope, and that a model's stated reasoning may not faithfully explain what it does.

Its appendix on evaluation goes further: Microsoft's **current models are not yet trained on the document**. It is building what it calls Humanist AI Evaluations, starting from 15 behaviours broken into testable sub-behaviours, and says it will publish fuller evaluation work once the code is more settled.

That makes the document clear about what it is: a specification Microsoft intends to train and test against, not a description of MAI models as they ship today.

## What is not established

- **How adherence will be measured**, and whether results will be published model by model.
- **Whether anyone outside Microsoft will verify it.** The code says Microsoft plans to work with external partners on evaluation, but commits to no embedded outside evaluators of the kind Anthropic and OpenAI have promised.
- **Whether the specialised-domain route** can exceed the absolute constraints.
- **Whether the code applies to third-party models** Microsoft offers alongside its own. It is written for MAI models.
- **What changes after the consultation.** Microsoft says it will publish a summary of what it learned and changed, without promising what it will adopt.`,
  },
  {
    slug: "ios-27-lists-51-security-fixes-that-ios-26-7-does-not",
    title: "iOS 27 lists 51 security fixes that iOS 26.7 does not. Five older iPads cannot install iOS 27",
    excerpt:
      "Apple's notes for iOS 27 list 126 CVEs; the iOS 26.7 update released the same day lists 82. The 51 that appear only in iOS 27 include code execution from a crafted image, an app sandbox escape and a route to the System Keychain. Apple does not say whether iOS 26 is affected, and five iPad models dropped from iOS 27 can only take 26.7.",
    categorySlug: "security",
    tags: ["apple", "ios-27", "ios-26", "security-updates", "ipad", "macos", "patching", "cve"],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1590252973599-bb37fb327a55${P}`,
    body: `Apple released **iOS 27** and **iPadOS 27** on **14 September 2026**, alongside macOS 27, which Apple calls macOS Golden Gate, and new versions of watchOS, tvOS and visionOS. The same day it shipped security updates for the previous generation: **iOS and iPadOS 26.7**, **macOS Tahoe 26.7** and **macOS Sequoia 15.8**.

None of the security notes says any of the flaws was exploited. What the notes do show, once compared, is how uneven the fixes are across versions.

## The count

Root Notes compared the CVE identifiers listed in Apple's security notes for each release.

| Release | CVEs listed | Not listed in its counterpart |
|---|---|---|
| iOS and iPadOS 27 | 126 | 51 not in 26.7 |
| iOS and iPadOS 26.7 | 82 | 7 not in 27 |
| macOS Golden Gate 27 | 210 | 61 not in Tahoe 26.7; 67 not in Sequoia 15.8 |
| macOS Tahoe 26.7 | 153 | |
| macOS Sequoia 15.8 | 154 | |

A CVE missing from an older release's notes does not prove that release is vulnerable. The flaw might be in a component the older system does not have. Apple's notes list what each update fixes; they do not say which earlier versions a flaw affects.

## What is in the gap

Many of the 51 iOS entries are in components that exist in both versions. Apple's own descriptions of fixes that appear only in iOS 27 include:

- **CoreMedia**: processing a maliciously crafted image may lead to arbitrary code execution. Apple says it fixed this by removing the vulnerable code.
- **iWork**: a malicious app may be able to break out of its sandbox.
- **MediaRemote**: a sandboxed app may be able to access the System Keychain.
- **Software Update**: an app may be able to modify protected system files.
- **Telephony**: an attacker in a privileged network position may be able to bypass IPsec authentication and intercept traffic.
- **Shortcuts**: a malicious shortcut may be able to send messages without user confirmation.
- **Apple Account**: an app may be able to use the Sign in with Apple flow to access a user's Apple Account.
- **WebKit**: opening a crafted webarchive file may lead to universal cross-site scripting.
- **Kernel**: three entries, including disclosure of kernel memory.
- **Baseband**: two denial-of-service issues, one reachable by a remote attacker.

## Who cannot take iOS 27

For iPhones it is a choice. The notes for iOS 27 and iOS 26.7 list the same supported phones, iPhone 11 and later, so anyone on 26.7 can move up.

For iPads it is not. The iOS 26.7 notes list five models that do not appear in iOS 27's:

- iPad Pro 12.9-inch (3rd generation)
- iPad Pro 11-inch (1st generation)
- iPad Air (3rd generation)
- iPad (8th generation)
- iPad mini (5th generation)

Those tablets stop at 26.7. On the Mac, the Golden Gate 27 notes list only Apple silicon models, so Intel Macs running Tahoe get 26.7 and its 153 listed fixes rather than Golden Gate's 210.

## What to do

- **On an iPhone, or an iPad that supports it, install iOS or iPadOS 27.** It is the release with by far the most listed fixes.
- **If you stay on 26.7 by choice**, you are on the release with fewer.
- **For the five iPads that stop at 26.7**, install it, and bear in mind that they cannot move to the release carrying the most fixes. Organisations should know how many they have.
- **Intel Macs** should be on Tahoe 26.7 at minimum.

## What is not established

- **Whether the 51 flaws affect iOS 26.** Apple does not say.
- **Whether Apple will fix any of them in a later 26.x update.**
- **Why seven fixes appear only in 26.7**, and whether iOS 27 addressed them another way.
- **Whether any of these flaws has been exploited.** The notes make no such statement.`,
  },
  {
    slug: "ios-27-features-and-the-footnotes-that-decide-which-iphone-gets-them",
    title: "Everything new in iOS 27, and the footnotes that decide which iPhone gets it",
    excerpt:
      "iOS 27 installs on every iPhone from the 11 onwards and brings Siri AI, new photo tools, tighter parental controls and faster app launches. But Siri AI needs an iPhone 15 Pro or later, starts as an English beta, is not initially available on iPhone in the EU or at all in China, comes with daily usage limits, and Apple says expanded access will cost money.",
    categorySlug: "gadgets",
    tags: ["apple", "ios-27", "siri-ai", "apple-intelligence", "iphone", "parental-controls", "liquid-glass", "eu"],
    readingMinutes: 10,
    coverImageUrl:
      "https://www.apple.com/newsroom/images/2026/09/major-updates-for-apples-software-platforms-are-now-available/article/Apple-OS-availability-hero_big.jpg.large_2x.jpg",
    body: `Apple released **iOS 27** on **14 September 2026**. It runs on the **iPhone 11 and later** and the **iPhone SE (2nd generation) and later**, and its headline feature is **Siri AI**, a rebuilt Siri powered by the next generation of Apple Intelligence.

Apple's iOS 27 page and its release-day announcement describe the changes. The footnotes underneath decide who actually gets them, so this guide takes both together.

## Siri AI

What Apple says it does:

- **Conversation.** Open-ended questions, brainstorming and back-and-forth follow-ups, typed or spoken.
- **Personal context.** Finding things across messages, emails, photos and notes, such as a years-old photo or a buried email.
- **Actions in apps**, such as editing a message just sent or adding a song to a playlist, and answers about what is on screen.
- **World knowledge**, including looking things up on the web.
- **A Siri app** that keeps conversations, syncs them through iCloud across iPhone, iPad, Mac, Apple Watch and Vision Pro, and lets you pin them.
- **Siri mode in the Camera app**, for visual search and actions such as splitting a bill with Apple Cash or adding a pass to Wallet.
- **Write with Siri**, which drafts or gives feedback on text almost anywhere you type, and in Messages and Mail tries to match your own style.
- **Voice customisation**: choosing a voice, then adjusting its expressiveness and pace.

The conditions, all from Apple's own footnotes:

- **Hardware.** Apple Intelligence, and so Siri AI, needs an iPhone 15 Pro or 15 Pro Max, an iPhone 16 or later, iPhone Air or iPhone Duo. The iPhone 15, 14 and older run iOS 27 without it.
- **Voice customisation needs newer hardware still.** Apple lists it only for the iPhone 17 Pro and 17 Pro Max, iPhone Air, iPhone 18 Pro and 18 Pro Max, and iPhone Duo. For iPads and Macs, it ties the feature to at least 12GB of memory.
- **Language.** Siri AI launches as a **beta in English**. French, Japanese, Korean, Portuguese and Spanish are due in **October**.
- **Region.** Siri AI will not initially be available in the **EU on iPhone, iPad or Apple Watch**; EU users on Mac and Vision Pro can use it. Siri AI and the other new Apple Intelligence features are unavailable in **China** while Apple works through regulatory requirements.
- **Age.** Siri AI is not available to users **under 13**.
- **Usage limits.** Features that rely on Apple's server-side models have **daily limits**, and Apple names Siri AI, the photo editing tools, Image Playground and cloud models in Shortcuts. The limits vary with request complexity and system demand, and Apple says **expanded access will be available for a fee in the future**.

That last line is the most consequential in the release. Apple has not said how large the free allowance is, or what more will cost.

## Apple Intelligence in apps

- **Photos**: Spatial Reframing to change a photo's composition after it was taken, Extend to widen an image beyond its edges, and a stronger Clean Up for removing larger objects. Usage limits apply.
- **Image Playground**: images in almost any style, including photorealistic. Apple says generated and edited images carry metadata, with support for the SynthID standard coming. Usage limits apply.
- **Safari**: automatic grouping of tabs by topic, and Notify Me alerts when a page changes, such as a price drop or a restock.
- **Call Context**: surfaces information such as a booking reference from Mail when you phone a business.
- **Suggestions** in Mail and Messages for quick actions like adding a calendar event. English only, and the Messages part is due in a later update.
- **Shortcuts**: describe an automation in plain words and Shortcuts builds it. Usage limits apply.
- **Passwords**: having the Passwords app fix weak or compromised passwords for you is **not in iOS 27 at launch**. Apple labels it as coming in a future software update.

## Parental controls

- **Setup** of a child's iPhone lets parents choose exactly which apps are available, and add more later through Ask to Buy.
- **Ask to Browse** makes children ask permission before visiting new websites in Safari and other WebKit browsers; parents can review the request in Messages.
- **Communication Safety** now intervenes on gore and violence in shared images and videos, not only nudity.
- **Time Allowances** by category, such as Entertainment, Games and Social Media, with age-based guidance Apple says was developed with clinical and child-development experts, plus **Schedules** for which apps are available when.
- A redesigned **Screen Time** with an at-a-glance view of usage and top apps.

## Speed, connectivity and design

- **Performance** claims, with Apple's own test conditions: app launches up to **30 per cent** faster (on an iPhone 11 Pro Max after many cycles of use), new photos loading up to **70 per cent** faster (on an iPhone 15 with a 50,000-item library), and AirDrop up to **80 per cent** faster (an iPhone 16 Plus sending 30MB while not on Wi-Fi). These are best cases on specific devices.
- **Network handoff** between Wi-Fi and cellular is smoother, and in Messages a large photo or video sent over a weak connection no longer holds up the texts behind it.
- **Search** across Spotlight, Photos and Mail is more reliable, with a new ranking system for Mail results.
- **Liquid Glass** gets a slider from ultraclear to fully tinted, and app icons are sharper.

## Everything else

- **Accessibility**: VoiceOver gains richer image descriptions and Action button integration, a new feature generates synced captions for any video and can translate existing captions, and Magnifier adds tools for low vision.
- **Shared Albums** in iCloud support full-resolution sharing and make it easier for Android and Windows users to join and contribute.
- **Health**: Cycle Tracking can notify users aged 40 and over when logged cycles suggest perimenopause, with symptom tracking and resources.
- **Maps**: Flyover combines aerial imagery with AI models for more detailed views.
- **AirPods**: custom EQ settings, and GymKit on iPhone, which links compatible gym equipment and can take heart-rate data from AirPods Pro 3.
- **Home**: AI summaries of related activity notifications, descriptions of HomeKit Secure Video footage, natural-language clip search, and 4K recording on supported cameras. These need a home hub, and the video features need an iCloud+ plan.

## What is not established

- **How large the daily usage limits are**, and what paid expanded access will cost.
- **When Siri AI reaches iPhone users in the EU**, or anyone in China.
- **How well Siri AI works day to day.** Apple is shipping it as a beta.
- **When password fixing and Suggestions in Messages arrive.**
- **Whether iPhones older than the 15 Pro will ever get Apple Intelligence features.** Apple's device list gives no indication of it.`,
  },
  {
    slug: "amodei-pacing-essay-washington-and-beijing-both-answered-the-china-part",
    title: "Washington and Beijing answered Amodei's pacing essay on the same day. Both answered the part about China",
    excerpt:
      "On 14 September President Trump wrote that a strong and smart president is the only guardrail AI needs, and called opposition to AI a conspiracy only China enjoys. The same day, China's foreign ministry called calls for a slowdown fear-mongering and confrontation. Neither addressed the outside evaluators the essay actually commits Anthropic to.",
    categorySlug: "world",
    tags: ["anthropic", "ai-policy", "china", "trump", "pace-the-frontier", "export-controls", "nvidia", "ai-governance"],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1742413628280-8bfae633391b${P}`,
    body: `Two days after Anthropic chief executive **Dario Amodei** published his essay arguing that AI labs should slow the pace of capability gains, the two governments his plan ultimately depends on answered it on the same day, **14 September 2026**.

[The essay's plan has three steps](/article/amodei-pace-the-frontier-openai-matched-the-only-step-that-needs-no-law). Anthropic can take the first alone: letting outside evaluators work inside the company. The second, coordination between companies, needs Washington to relax antitrust rules. The third, global coordination, needs Beijing. The essay also argues that how far democracies can safely slow down depends on their lead over China, and proposes widening that lead through chip export controls and a crackdown on unauthorised distillation.

## Beijing

At the foreign ministry's regular press conference, a Reuters correspondent summarised the weekend's calls from Amodei, Sam Altman and Elon Musk, and Amodei's argument that a Chinese lead in AI would threaten US national security.

Spokesperson **Guo Jiakun** replied that AI matters to the wellbeing of all humanity and that all parties should promote its open and inclusive development. **"Fear-mongering, confrontation and vicious competition,"** he said, would only hamper efforts toward sound global AI governance.

The same briefing promoted China's alternative. Guo described President Xi Jinping's proposals at the BRICS summit in New Delhi on 12 and 13 September, including an open-source and inclusive AI initiative and a pledge that China would take the lead in establishing a **BRICS AI open-source community**.

China's state-run Global Times had gone further a day earlier. According to NBC News, its commentary described the slowdown proposal as full of provisions aimed at containing China, and in essence a Cold War playbook for the AI sector.

## Washington

**President Trump** posted on social media that the only control or guardrail AI needs is a strong and smart president, and that the United States has one. He said there is a **"SICK conspiracy"** against AI and data centres, and that the only one happy about it is China. According to the Associated Press, he also said his administration had stopped Anthropic from doing bad, or potentially bad, things.

The same day, at the All-In Summit in Los Angeles, Trump phoned Nvidia chief executive **Jensen Huang** while he was on stage, TechCrunch reported. Those calling for a slowdown, Trump said, were playing into the hands of people who did not want AI to happen, which could include China, and he called it a hoax. Huang agreed that they would not let that happen. Trump added that the industry should act prudently, but that did not mean stopping it.

Nvidia has a direct stake in one part of the essay. The first measure Amodei lists for keeping China behind is not selling it advanced AI chips.

## Both answered the China part

Put the two responses side by side and they share a frame. Beijing heard a containment strategy in safety language. Washington heard a threat to American leadership that benefits China. Neither engaged with the first step, embedded evaluators, which Anthropic has committed to and OpenAI has said it will match, or with the second, the antitrust question that decides whether rival labs can coordinate at all.

That leaves the plan where the essay itself expected it to be hardest. Amodei wrote that pacing worldwide would be much harder than pacing among democracies, and that a full pause is unlikely any time soon. On the day both governments responded, neither mentioned even the narrowest option he described: an agreement against using AI to produce biological weapons.

## What is not established

- **Whether Trump's post reflects formal policy.** No executive action accompanied it.
- **What Trump meant by stopping Anthropic from doing bad things.** The Associated Press pointed to the Pentagon's earlier moves against the company's models; the post gave no detail.
- **Whether Beijing would engage on narrower agreements**, such as testing models for acute risks before release, which the essay rates as feasible.
- **Whether Congress moves on the antitrust waiver** that the essay's second step depends on.`,
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
