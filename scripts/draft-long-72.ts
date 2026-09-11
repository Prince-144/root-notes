/**
 * Drafts the 11 September news batch — six stories from the last 48 hours,
 * each checked against what the site already covers.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-72.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-72.ts --update
 *
 *   1. PaperCut. GreyNoise's AI-agent campaign: 440 instances, 395 orgs, and
 *      a 28-country exclusion list the agents half ignored — every country hit
 *      sits in the back twelve places of the list. Same two CVEs the site
 *      covered on 7 September.
 *   2. Check Point. Two 9.8s in VPN certificate handling, both pre-auth. The
 *      management server is reachable without a VPN blade, and R80 to R81.10
 *      are listed affected with no fix.
 *   3. Gigabud. Group-IB: the bank's malware check fired in the personal
 *      profile; the transfer came from a cloned app in a work profile, which
 *      the bank sees as a clean new device.
 *   4. OpenAI and antitrust. H.R. 9914 would permit coordinated delays for
 *      loss-of-control risks — if "not more than an insubstantial part" of the
 *      reason is anything else. Read from the bill text, not the press release.
 *   5. Fluidstack. A roughly 5 billion dollar Office of Strategic Capital loan,
 *      about six times its previous largest commitment, for components rather
 *      than a facility.
 *   6. Anthropic's September report. Alibaba's 151 million exchanges tied by one
 *      fixed prompt; Moonshot and DeepSeek accused of routing their own users'
 *      requests to Claude.
 *
 * Primary sources read directly: GreyNoise, Check Point sk1000117 and
 * sk1000118, Group-IB, the H.R. 9914 text on GovInfo, and Anthropic's report.
 * Covers checked at full 1600x900 and reuse-checked; six candidates were
 * rejected for carrying another vendor's branding.
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
    slug: "papercut-ai-agents-were-told-to-skip-28-countries-and-hit-six-of-them",
    title: "The attacker told the agents which 28 countries to leave alone. They hit six of them",
    excerpt:
      "GreyNoise watched a likely Russian-speaking operator point hundreds of AI agents at PaperCut and compromise 440 instances across 395 organisations. The operator's exclusion list held only partly: 18 victims sit in countries the agents were told to skip, every one of them from the back half of the list.",
    categorySlug: "security",
    tags: ["papercut", "greynoise", "ai-agents", "codex", "deepseek", "cve-2026-81578", "cve-2026-82078", "active-directory"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1650094980833-7373de26feb6${P}`,
    body: `**GreyNoise** has published research on a campaign against **PaperCut NG and MF** that it calls, with some justification, **Agents Gone Wild**.

A likely Russian-speaking operator used hundreds of AI agents — run through **OpenAI's Codex** as the harness, with a **DeepSeek** model, and a conventional offensive toolkit including Mimikatz, SharpHound, Certipy, Rubeus and Impacket — to compromise **440** PaperCut instances belonging to **395** identified organisations in **48** countries.

The flaws are not new to readers here. The agents exploited **CVE-2026-81578**, an authentication bypass, and **CVE-2026-82078**, an unsafe-reflection remote code execution bug — [the same pair we covered when attackers first went after PaperCut's LDAP bind credentials](/article/papercut-attackers-went-for-the-ldap-bind-credentials).

What is new is the operator, and the part of the operation the operator did not control.

## The numbers, and what each one counts

Three counts, three different units, and they will be blurred together:

- **440** is PaperCut *instances* — servers.
- **395** is *organisations* GreyNoise could identify behind them. Some own more than one server.
- **48** is *countries*. The Register's breakdown of the same data puts the United States at **98** organisations and the UK at **59**.

Deeper in, the numbers get more serious and much smaller. GreyNoise records credential harvesting on **280** instances, operating-system or domain secrets taken from **147**, and full **domain administrator** reached in **12** organisations.

That last figure is the one that matters. A compromised print server is a foothold. Domain admin is the organisation.

## How fast

The timings GreyNoise reconstructed are the point of the research:

- Target lists were built with the internet-scanning service **Netlas.io**, using an identified API key.
- One of the operator's addresses was first tracked attacking in **early July 2026**; the orchestrated campaign launched on **31 August**.
- From the operator's lab to the first remote code execution took **under four hours**, and a further **two hours** to reach domain admin.
- Against real victims, the fastest escalation to domain admin took **five minutes** — at a US high school. The slowest took **144 minutes**.

The Register, reporting GreyNoise's data, put the campaign's peak pace at **11 organisations in 26 seconds**. There is no human in that loop. Nobody reads output at that speed; they read summaries afterwards.

## The list the agents did not finish reading

The operator gave the agents a list of **28 countries** to leave alone — a list GreyNoise says had carried over from the operator's previous campaigns. Exclusion lists are an old habit among Russian-speaking operators, traditionally built around the former Soviet states. This one is broader.

In GreyNoise's printed order it runs: Russia, China, Hong Kong, Thailand, Iran, Venezuela, Belarus, Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, Uzbekistan, Armenia, Azerbaijan, Moldova, Ukraine, Brazil, Vietnam, Indonesia, Pakistan, Tanzania, Bangladesh, Afghanistan, Turkey, South Africa, Namibia, Nigeria and Zimbabwe.

The agents hit organisations in six of them anyway: **South Africa (9)**, **Brazil (5)**, and one each in **Namibia**, **Nigeria**, **Zimbabwe** and **Pakistan**. Eighteen victims in countries the operator had explicitly excluded.

GreyNoise, which calls the operator an MCA — a malicious cyber actor — is honest about the limits of what it knows: **"It's currently uncertain why the MCA's agents deviated, but it is a good example of Agents Gone Wild."**

There is a pattern in the data worth stating carefully. None of the first sixteen countries on the list — including every one an operator like this would presumably care about most — appear among the victims. All six that were hit sit in positions 17 to 28. One reading is that a long instruction degrades towards its end. Another is simply that the scan data held fewer exposed PaperCut servers in the countries at the top. Nothing published distinguishes the two, and it should not be reported as a finding.

What can be stated is this: the operator wrote a rule, delegated its enforcement to software running faster than anyone could supervise, and the rule held imperfectly. That is the failure mode every organisation deploying its own agents is designing against, observed for once on the other side.

## The old bugs did the heavy lifting

The tooling that got the attention is new. The escalation path that made it dangerous is not.

GreyNoise's defensive recommendations open with patching **CVE-2021-42278** and **CVE-2021-42287** — the 2021 Active Directory flaws usually known together as **noPac**. The research also notes that **"Fundamental hardening of environments still matters against AI-enabled threats"**, and that in at least one case **Cloudflare's web application firewall defeated the adversary** outright.

The same week, Anthropic's own threat intelligence report put the trend in one line: **"Sophisticated attacks no longer require sophisticated attackers."** GreyNoise is the view of that sentence from the sensor side.

## What to do

- **Patch PaperCut NG and MF** against CVE-2026-81578 and CVE-2026-82078 if you have not. This campaign is the reason not to wait.
- **Patch noPac** — CVE-2021-42278 and CVE-2021-42287 — on every domain controller. Five-year-old privilege escalation is still the shortest route from a print server to domain admin.
- **Put print management behind a web application firewall, or off the internet entirely.** It has no business being findable in an internet scan.
- **Watch LSASS and registry access**, enable Credential Guard, and alert on unexpected account creation — GreyNoise flags names like **Administrator17**.
- **Block and hunt for the published indicators**, including command-and-control addresses **45.142.193.132** and **45.158.196.75** and the tunnelling tool **ligolo-agent.exe**.

## What is not established

- **How GreyNoise obtained the operator-side detail** — the exclusion list and the Codex and DeepSeek tooling. Its sensors observe attacks; the source of the configuration detail is not described.
- **Why the agents ignored part of the list**, and whether the position pattern means anything at all.
- **Which DeepSeek model** was used.
- **Attribution beyond "likely Russian-speaking"** — a language assessment, not an identified group.
- **What was done with domain access** in the 12 organisations where it was reached.`,
  },
  {
    slug: "check-point-vpn-certificate-flaws-run-before-anyone-is-trusted",
    title: "Check Point's two 9.8s are in the code that reads the certificate before deciding whether to trust it",
    excerpt:
      "CVE-2026-85102 and CVE-2026-85103 both sit in VPN certificate handling on Check Point gateways and management servers, and both run before authentication. Check Point found them itself and has seen no exploitation. The end-of-support releases it lists as affected get no fix at all.",
    categorySlug: "security",
    tags: ["check-point", "vpn", "cve-2026-85102", "cve-2026-85103", "asn-1", "edge-devices", "firewall", "end-of-support"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1544197150-b99a580bb7a8${P}`,
    body: `**Check Point** disclosed two critical vulnerabilities on **9 September 2026** and began shipping fixes the same day. Both score **9.8**. Both can let an **unauthenticated** remote attacker run code. And both live in the same place: the code that handles **VPN certificates**.

The company says its own research team found them, and that it has no indication either has been used in an attack. There is no public proof of concept.

## Two flaws, one path

**CVE-2026-85102** is described in Check Point's advisory sk1000117 as **"Improper validation of certificate data during VPN negotiation may allow an unauthenticated remote attacker to execute arbitrary code on the Security Gateway."** It affects the **Security Gateway** and **Spark** firewalls, and requires a **Site-to-Site VPN** or **Remote Access VPN** blade to be enabled. Exploitation happens during certificate negotiation — before authentication.

**CVE-2026-85103**, in sk1000118, is **"A heap overflow in the VPN certificate ASN.1 decoding flow may allow a remote attacker to remotely execute arbitrary code."** Its reach is wider: the **Security Management Server** as well as gateways and Spark.

One is a logic failure in deciding whether a certificate should be trusted. The other is a memory-safety failure in merely reading it. Between them they cover both halves of certificate handling.

## The credential is read before anyone has proved anything

This is the structural point, and it applies well beyond Check Point.

A certificate is what a VPN peer presents to prove who it is. To evaluate that proof, the gateway has to receive the certificate, decode it and check it — all before it knows whether the sender is anyone at all. By design, certificate processing is pre-authentication attack surface. The mechanism that establishes trust is, necessarily, code that runs on untrusted input.

And the decoding step is **ASN.1**, a data format with a long record of parser bugs across the industry, precisely because it is flexible, deeply nested and length-prefixed in ways that reward a careful attacker.

[F5's BIG-IP web shell showed the same class of device from another angle](/article/f5-big-ip-web-shell-never-exists-on-disk-and-the-cve-was-filed-as-dos): the edge appliance is where unauthenticated input arrives first, and one parsing mistake there is a way in rather than a crash.

## The management server does not need the VPN turned on

The detail most likely to be missed is in CVE-2026-85103.

Asked about environments without the VPN blade, a Check Point staff member said, as reported by The Hacker News, that the issue **"is about certificate processing, so it could, in theory, be triggered in an environment without a VPN but with VPN certificates present."**

That matters most for the **Security Management Server** — the console that holds policy for every gateway it manages. It is not a VPN endpoint, but it handles VPN certificates. The attack surface here is not the feature you enabled. It is material that exists on the box because of features enabled somewhere else.

## Which versions, and which ones get nothing

Affected and supported: **R81.20**, **R82** and **R82.10**. Fixed in Jumbo Hotfix Accumulator **R82.10 Take 44**, **R82 Take 126** and **R81.20 Take 166** or later. Spark fixes are **R82.00.10 build 2325** and **R81.10.17 build 4968** or later. **R82.20 is not affected.**

Customers with **LivePatch** enabled were protected automatically as the rollout began on 9 September — the best possible outcome, requiring no action. Everyone else has a manual patch window.

Then the uncomfortable line. Both advisories also list **R80, R80.10, R80.20, R80.30, R80.40, R81 and R81.10** as affected. Those are **end-of-support** releases. There is no hotfix for them. The remediation is an upgrade.

Firewalls are exactly the class of device that stays on an old release for years, because it works and nobody wants the outage. If yours is one of them, this is the notice that it is no longer a stable choice.

## The workaround, and where it does not help

For Site-to-Site VPN, Check Point's mitigation is to **disable the implied VPN rules** and manually allow **UDP/500** and **UDP/4500** only from the specific peer IP addresses you expect. That narrows who can reach the certificate parser to peers you already know.

It does nothing for Remote Access VPN, where the entire point is that peers arrive from anywhere.

## What to do

- **Check whether LivePatch is enabled.** If it is, confirm the rollout reached every gateway; if not, install the Jumbo Hotfix for your branch.
- **Patch the Management Server too.** CVE-2026-85103 reaches it, and it may not need a VPN blade to be exposed.
- **Treat R80 to R81.10 as permanently unpatched** and schedule the upgrade.
- **Apply the implied-rules workaround for Site-to-Site VPN** where patching has to wait, restricting UDP/500 and UDP/4500 to known peers.
- **Watch for exploitation reports.** Check Point found these itself, but fixes are now public, and fixes can be compared against what came before.

## What is not established

- **The full conditions** under which CVE-2026-85103 is reachable without a VPN blade. "In theory" is the only public statement.
- **Whether exploitation follows** now that fixes are available to study.
- **How many gateways still run end-of-support releases.** Check Point has not said.
- **Whether LivePatch coverage** is complete across every affected branch and appliance model.`,
  },
  {
    slug: "gigabud-the-bank-app-caught-the-malware-and-the-money-left-from-the-work-profile",
    title: "The bank's app caught the malware. The money left from the work profile, where the bank could not see it",
    excerpt:
      "Group-IB found GoldFactory's Gigabud trojan using a Shelter fork called Vwork to create an Android work profile and clone a banking app into it. The bank's malware check had already fired in the personal profile. The fraudulent transfer came from the other side of the wall, looking like a clean new device.",
    categorySlug: "security",
    tags: ["gigabud", "goldfactory", "group-ib", "android", "work-profile", "banking-trojan", "accessibility-abuse", "indonesia"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1616077168712-fc6c788db4af${P}`,
    body: `**Group-IB** has documented a new technique from **GoldFactory**, the group behind the **Gigabud** banking trojan, and it is one of the more elegant abuses of a legitimate Android feature published this year.

Gigabud installs a second app, **Vwork**, which creates an Android **work profile** on the victim's phone and clones a banking app into it. Then the operator moves the victim's money from inside that profile.

The clever part is not hiding from the victim. It is hiding from the bank.

## What a work profile is for

A **work profile** is the mechanism Android uses so one phone can serve two masters. An employer's apps live inside it; the owner's personal apps live outside it. The two sides are deliberately walled off, so the company cannot see the employee's personal data and personal apps cannot reach corporate ones.

Any app can start the setup, and Android explains what a work profile is before one is created. Vwork is a fork of the open-source cloning tool **Shelter** — but where Shelter walks a user through several screens, Vwork reduces it to a single prompt, in Chinese: **"Welcome to Vwork. Tap 'Activate now' and it will guide you through setting up the work profile."**

## How the wall gets used

The chain, as Group-IB lays it out:

- Victims install a fake app posing as a **national airline**, a **tax office** or a **government portal**.
- It asks for **Accessibility** access, which hands the operator live read, tap and type control of the screen.
- An overlay presents a fake login over the real banking app and captures the credentials. A second overlay, **invisible to the user**, captures the phone's lock-screen code.
- Gigabud instructs Vwork to clone a specific app into the hidden work profile — in one confirmed case, **a fake version of a real Indonesian bank's app**.
- The operator runs the transaction through Accessibility while **a black screen covers what is happening**.

## Why the bank's defences were looking the wrong way

Here is the mechanism that makes this worth writing about.

Banking apps increasingly carry their own malware detection. Group-IB's explanation of why that stops working: **"Applications installed in one Android profile are generally isolated from those in another profile, especially for signature-based malware detection."**

Picture both sides. In the **personal profile**, the bank's real app is present, and so is Gigabud. The bank's check does its job and flags the infection. In the **work profile**, a copy of the banking app runs with no trojan beside it, because the trojan is on the other side of the wall.

Group-IB describes what the bank then sees: **"From the bank's perspective, the transaction originates from a new device and may appear unrelated to the previously detected malware activity. Meanwhile, the malware detection alert has already been triggered in the victim's personal profile but will not fire in the newly created work profile due to a lack of infection signals."**

The detection worked. It fired on the side where nothing was lost, so it may prompt no action at all. The loss happened on the side that looked clean.

Android built that wall to protect an employee's privacy from an employer. Gigabud puts the bank where the employer would be, and the wall protects the malware from the bank. [NFC relay fraud on Android](/article/windrelay-ghost-tap-nfc-relay-spynote-android) abused a payment path; this abuses the phone's own rules about which apps are allowed to see each other.

## The scale, with Group-IB's own caveat

The confirmed chain is in **Indonesia**, between **February and July 2026**:

- About **1,469** compromised devices
- **1,281** potentially compromised logins
- Estimated losses of **960,939 dollars**

Group-IB says these figures **"should be considered indicative rather than representative."** Samples compatible with Vwork targeted Brazil, Colombia, Egypt, Indonesia, Laos, Mexico, Morocco, the Philippines, Thailand, Türkiye and one Gulf state, but Vwork itself has been seen in the wild only in the Indonesian campaign.

Attribution to GoldFactory rests on code references to Gigabud package names, overlapping network indicators and developer logs written in Chinese.

## What to do

**If you run a bank or wallet:**

- **Tie sessions to a trusted device**, and treat a work profile appearing on a non-enterprise phone as a risk signal in its own right.
- **Link sessions server-side.** The same account arriving from a "new device" on the same network shortly after a malware alert is not a new customer.
- **Block transactions from devices with active Accessibility access** granted to an unrecognised app, as Group-IB recommends.

**If you are a user:**

- **Install apps only from official stores.** Every step in this chain starts with a sideloaded fake.
- **Refuse Accessibility access** to anything that is not genuinely an accessibility tool.
- **Use a second factor that is not SMS** for banking and crypto.
- **If a work profile appears that no employer created**, remove it.

## What is not established

- **Whether Google Play Protect or Android itself flags** a third-party app creating a work profile. Group-IB does not address it.
- **Losses outside Indonesia**, where only samples have been found.
- **Which banks** were impersonated or cloned, beyond "a real Indonesian bank".
- **Whether any bank's fraud engine** already links a work-profile instance back to an earlier detection on the same handset.`,
  },
  {
    slug: "openai-asked-congress-whether-slowing-down-is-legal",
    title: "OpenAI asked Congress whether slowing down is legal. The bill on the table says yes, if almost nothing else is the reason",
    excerpt:
      "Sam Altman told staff OpenAI could pace frontier development alongside other labs, and OpenAI asked lawmakers whether that would breach antitrust law. The bipartisan bill that would answer it permits coordinated delays for loss-of-control risks — if not more than an insubstantial part of the reason is anything else. That week, OpenAI stopped selling its top tier for lack of compute.",
    categorySlug: "world",
    tags: ["openai", "antitrust", "ai-safety", "congress", "hr-9914", "sam-altman", "ai-policy", "competition-law"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1679403766665-67ed6cd2df30${P}`,
    body: `**OpenAI** chief executive **Sam Altman** told staff at a company-wide meeting this week that OpenAI could **pace** its frontier AI development — possibly alongside several other labs, while acknowledging that some would not agree. Bloomberg reported it on **11 September 2026**. Altman was candid that slowing down could cost short-term revenue in exchange for long-term viability.

A day earlier, **Wired** reported that OpenAI had asked members of Congress for guidance on whether orchestrating an industry-wide slowdown would even be legal under antitrust law. OpenAI's chief scientist **Jakub Pachocki** has separately argued in a blog post for **"coordinating to slow down future development"**.

The legal question is not a technicality. It is the whole obstacle.

## Why a safety pact looks like a cartel

Competition law exists largely to stop rivals agreeing among themselves to do less. When competing companies coordinate to limit what they produce, that is the textbook concern the law is built around, whatever the stated motive.

An agreement between frontier labs to hold back development or delay releases has that shape. As analysis published by Just Security puts it, such coordination **"could resemble an output restraint, potentially a per se violation of antitrust law."**

The guidance labs might have leaned on has also got thinner. The Department of Justice and the Federal Trade Commission **withdrew** their 2000 guidelines on collaborations among competitors in late 2024. The 2015 Cybersecurity Information Sharing Act gives an antitrust exemption for sharing cyber-threat information — but it does not reach AI-specific risks, and it covers sharing information, not agreeing to slow down.

So in-house lawyers at every major lab have had a simple answer for years: don't.

## The bill that would change the answer

The **Collaboration on Adversarial Threats and Security Risks Act** — introduced in July 2026 by Senators **Jim Banks** and **Adam Schiff**, with Representatives **Bob Latta** and **George Whitesides**, and numbered **H.R. 9914** in the House — was drafted mainly with foreign distillation and espionage in mind. [The joint NSA, CISA and FBI advisory on Chinese distillation](/article/distillation-advisory-six-companies-and-a-defence-that-alters-the-answers) describes the problem it was written for.

But the text goes further than threat sharing. Section 3(a)(2) would let companies **"coordinate or enter into agreements for the exclusive purpose of reducing covered artificial intelligence security risks via delaying or otherwise limiting the release, deployment, use, development, training, testing, or evaluation of artificial intelligence."**

And the covered risks are not only about China. Section 2(6) includes AI's potential to substantially reduce the ability of developers and others **"to oversee, evaluate, monitor, control, contain, restrict access to, disable, or terminate such artificial intelligence"**, and its potential to **"autonomously improve"** in ways that create substantial risk.

That is, very nearly word for word, the loss-of-control concern that researchers at OpenAI and Anthropic have been citing this month when they argue for slowing down.

So the bill would permit roughly the agreement Altman described. The condition attached is where it gets interesting.

## Not more than an insubstantial part

Protection is an **affirmative defence**. Under Section 3(c), a company claiming it **"shall bear the burden of proving by a preponderance of the evidence"** that it acted **"in good faith and for the exclusive purpose"** of addressing a covered risk.

Section 2(7) defines exclusive purpose tightly: **"with not more than an insubstantial part of the relevant action being for other purposes."**

Before coordinating a delay, companies would also have to give the Assistant Attorney General written notice of the specific risk and the scope of the restriction. Section 3(d)(1) still bars price-fixing, dividing markets, monopolising, boycotts and exchanging price or cost information. And Section 4 lets the Attorney General seek an injunction, including where an arrangement is **"reasonably likely to result in an overall increase in covered artificial intelligence security risks."**

Now set that standard against the same week's facts.

On **10 September**, OpenAI paused new sign-ups for its **200 dollar Pro** plan because demand for GPT-6 Astra, launched a week earlier, was, in the words of Codex and ChatGPT head Tibo Sottiaux, **"really unprecedented."** It could not serve the customers it already had. And Altman himself framed slowing down in terms of revenue and long-term viability.

None of that makes the safety motive insincere. It does mean commercial considerations are demonstrably present, on both sides of the ledger, inside the very company proposing the slowdown. A pact to slow development among labs that are capacity-constrained and compete for the same customers is precisely the arrangement where "not more than an insubstantial part" would be fought over. [OpenAI drew its own line on GPT-6 Astra's cyber capability](/article/gpt-6-astra-critical-cyber-threshold-openai-wrote-the-line); the exclusive-purpose test asks whether any line was drawn for any other reason at all.

## What to watch

- **Whether H.R. 9914 moves.** It is introduced, not law. Without it, the per se risk stands.
- **Whether any slowdown is framed around a named covered risk**, because that is the only framing the bill protects.
- **Whether labs that decline to join** turn the proposal into a competitive argument, which is its own signal.
- **Whether the Department of Justice comments** before any notice is ever filed.

## What is not established

- **What pacing would concretely mean** — paused training runs, delayed releases, compute caps. Altman has not specified publicly.
- **Which labs OpenAI approached**, and which declined.
- **What guidance members of Congress gave**, if any.
- **Whether the exclusive-purpose standard** could be met by any real agreement between commercial rivals. It has never been tested.`,
  },
  {
    slug: "pentagon-fluidstack-5-billion-loan-would-not-build-a-data-centre",
    title: "The Pentagon's biggest loan yet would not build a data centre. It would build the parts",
    excerpt:
      "The Office of Strategic Capital is in talks to lend Fluidstack about 5 billion dollars — roughly six times its previous largest commitment — for manufacturing capacity in data-centre components, not a facility. A defence industrial-base lender now files AI infrastructure alongside rare earths and drone parts.",
    categorySlug: "startups",
    tags: ["fluidstack", "pentagon", "office-of-strategic-capital", "ai-infrastructure", "data-centres", "jane-street", "anthropic", "google"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1776888732941-6de4402bd128${P}`,
    body: `The **Pentagon** is in talks to lend about **5 billion dollars** to **Fluidstack**, the AI data-centre company, according to the **Wall Street Journal**, which reported it on **10 September 2026** citing people familiar with the matter. The Department of Defense and Fluidstack did not immediately respond to requests for comment.

The money would come from the Pentagon's **Office of Strategic Capital**, and two details make it more interesting than a large number attached to a fast-growing startup.

It would be the largest loan the office has ever made. And it would not pay for a data centre.

## Not a building — the supply chain behind one

According to the reporting, Fluidstack would use the loan to **"shore up the U.S. supply chain and manufacturing capacity for certain data center-related components."** Not a new facility.

The reports do not name the components. The context offered alongside them points in a direction without settling it: an executive order last month declared a national emergency and restricted certain foreign equipment in the US electrical grid that data centres depend on.

The distinction matters. The binding constraint on AI infrastructure has been moving steadily upstream — from GPUs, to power, to the physical equipment that connects buildings to power. A loan aimed at manufacturing capacity is a bet about where the next shortage is, placed by a lender whose job is exactly that kind of bet.

## The office, and the size of the jump

The Office of Strategic Capital lends into the parts of the economy the Pentagon considers strategically necessary and commercially underfunded. Its track record is short and specific:

- Its **first direct loan**, in **August 2025**, was **150 million dollars** to **MP Materials** for heavy rare-earth separation.
- In **July 2026** it signed a **conditional commitment of up to 820 million dollars** with **Performance Drone Works** for domestic drone component manufacturing.

Five billion dollars would be roughly **six times** the drone commitment. It would also put AI data-centre components in the same category as rare-earth separation and drone parts: things the defence establishment does not trust the market to supply at the speed it wants.

## Who Fluidstack is

Fluidstack builds and operates data-centre capacity for the largest AI customers:

- It closed a **1.5 billion dollar** round led by **Jane Street** at an **18 billion dollar** valuation, reported in early September 2026 — more than double the **7.5 billion** it was valued at earlier in the year.
- **Anthropic** named Fluidstack as its partner for a **50 billion dollar** build-out of US data centres in Texas and New York, announced in November 2025.
- **Google** has backstopped Fluidstack's lease obligations at sites run by former crypto miners, including **TeraWulf's Lake Mariner** campus in New York, where Fluidstack has contracted roughly **360 megawatts** under ten-year agreements.

The Jane Street name recurs. [The same trading firm signed a 13 billion dollar compute contract with Crusoe](/article/crusoe-the-raise-is-the-smaller-number-a-trading-firm-signed-for-13-billion) shortly before that company's raise. A proprietary trading firm leading rounds and signing multi-year compute contracts across two infrastructure providers in the same season is its own story about who is financing this build-out.

## Why a defence lender

Worth being careful here, because the reporting does not explain the government's reasoning.

What can be said is that the pattern is consistent. Private capital has been abundant at the top of the AI infrastructure stack — valuations, rounds, compute contracts. It has been slower to fund the unglamorous manufacturing capacity that everyone's plans depend on and no single company wants to own. That is the gap industrial-policy lenders exist to fill, and it is where this loan is reportedly aimed.

A startup valued at 18 billion dollars borrowing from a Pentagon office says less about Fluidstack's need for cash than about who is now willing to underwrite the parts of AI infrastructure that are hardest to finance.

## What to watch

- **Whether a deal is actually reached.** These are talks, reported by one outlet.
- **Which components** the capacity would produce, and where.
- **Whether the commitment is conditional**, as the drone commitment was, and on what.
- **Whether other infrastructure companies** follow into the same office.

## What is not established

- **The terms** — rate, tenor, security, conditions.
- **Which components**, beyond "certain data center-related components".
- **Any statement from Fluidstack or the Pentagon.**
- **How the loan would interact** with Google's existing backstop of Fluidstack's leases.
- **Whether the executive order on foreign grid equipment** is connected to this loan, or merely coincident.`,
  },
  {
    slug: "anthropic-distillation-one-fixed-prompt-tied-3500-accounts-together",
    title: "One fixed prompt tied 3,500 accounts together, and Kimi's users were reading Claude without knowing",
    excerpt:
      "Anthropic's September threat report attributes nearly 200 million exchanges to five distillation campaigns. Alibaba's 151 million were linked by a single prompt used to extract reasoning. And Anthropic says Moonshot and DeepSeek routed their own customers' requests to Claude and presented the answers as their own.",
    categorySlug: "ai",
    tags: ["anthropic", "distillation", "alibaba", "moonshot", "deepseek", "kimi", "threat-intelligence", "ai-privacy"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1775441031103-1d559a6f91cd${P}`,
    body: `**Anthropic** published its **September 2026 threat intelligence report** on **10 September**, covering misuse of Claude it identified and disrupted between **December 2025 and August 2026** across seven areas, from cyber operations and influence campaigns to biological misuse and fraud. The full report runs to **154 pages**, according to the South China Morning Post.

The section that drew the headlines is illicit **distillation** — using a stronger model's outputs, without permission, to train a competing one. Anthropic attributes **nearly 200 million exchanges** to **five separate campaigns**.

Everything that follows is Anthropic's account. None of the companies named had responded publicly in the coverage reviewed for this piece.

## The fingerprint was the efficiency

The largest single number belongs to **Alibaba**. As reported by TechCrunch, Anthropic observed **151 million exchanges** between **May and July 2026**, peaking at **nearly three million a day**, spread across about **3,500 accounts**.

What tied those accounts together was **a single fixed prompt used to extract the chain of thought** — the model's reasoning, which is the most valuable thing to copy if you want a student model to reason rather than merely answer.

That is worth dwelling on, because it is the central problem with extraction at scale. Spreading traffic over 3,500 accounts hides volume. But the reason to run 151 million exchanges is to industrialise a technique, and industrialising a technique means using the same prompt every time. The template that makes extraction cheap is the signature that makes it attributable. An operation cannot be both maximally efficient and unrecognisable.

## Moonshot's traffic was not synthetic

**Moonshot AI**, the maker of the **Kimi** chatbot, is attributed a smaller volume — **nearly 300,000 requests** over one ten-day window, from around **5,000 accounts**, aimed at Claude **Opus**.

The detail is in what the requests contained. TechCrunch reports that one involved **"a cache of closed-circuit surveillance footage"**, and that the traffic **"seemed to route requests directly from the Chinese military."**

Those are not the prompts of a training pipeline generating synthetic questions. They look like real users doing real work.

## Kimi's users were talking to Claude

Which leads to the claim with the widest consequence. As reported by the South China Morning Post, Anthropic accused Moonshot and DeepSeek of **"covertly routing customer requests to its Claude models, then showing users the responses as if they were from their own models."**

More specifically: **"Kimi model developer Moonshot secretly showed its users Claude model outputs and passed them off as Kimi's, then used those exchanges to improve their own models."** Anthropic said the practice raised **"concerns about the misuse of user data by PRC AI labs."**

If that account is accurate, Kimi's users were exposed twice without being told.

Their prompts — whatever they typed or uploaded — went to a foreign AI company they had no relationship with. And the answers they received, and trusted as Kimi's, came from a different model entirely. Their data then became training material for the model they believed they were already using.

[The joint US advisory on Chinese distillation](/article/distillation-advisory-six-companies-and-a-defence-that-alters-the-answers) described this practice from the targeted lab's side, as extraction. This is the same practice seen from the end user's side, and from there it is a privacy breach.

## What the report says about its own limits

Two lines in the report bound how far its conclusions reach, and both should travel with the numbers.

On Anthropic's newest models: **"None of the misuse cases involved the use of Claude Fable or Mythos-class models, with the exception of one illicit distillation case."**

On what Anthropic can observe: **"Our visibility into these operations ends once it's live."** Anthropic sees traffic arriving at its API. It does not see what a distilled model later does, how a routed answer was presented to a user, or anything that happens off its platform. The claim that users were shown Claude's outputs as Kimi's is, necessarily, reasoned from that position.

The report's broader framing is the one GreyNoise's PaperCut research illustrated from the other end this week: **"Sophisticated attacks no longer require sophisticated attackers."**

## What to do

- **If you use a third-party AI product for sensitive work**, ask in writing which models actually process your requests, and where. "Our own model" is a claim, not a guarantee.
- **If you operate an AI API**, look for uniformity rather than volume. Fixed templates across many accounts are the pattern that surfaced here.
- **If you build on opaque or distilled models**, treat their provenance as unknown until the vendor documents it.

## What is not established

- **Responses from Alibaba, Moonshot or DeepSeek.** None in the coverage reviewed.
- **How Anthropic established that user requests were being routed**, rather than generated, beyond the content of the traffic.
- **DeepSeek's volumes**, which the coverage reviewed does not specify.
- **Which of the five campaigns** involved the one Fable or Mythos-class exception.
- **Independent verification** of any of it. This is a vendor reporting on its own platform — credible, and self-reported.`,
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
