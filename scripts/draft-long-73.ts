/**
 * Drafts the rest of the 11 September news batch — the four candidates left
 * over from draft-long-72.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-73.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-73.ts --update
 *
 *   1. CISA KEV: Cisco FMC, NetScaler, FortiOS on a 12 September deadline.
 *      Talos shows the Qilin-linked cluster skipped the CVSS 10.0 bypass and
 *      logged in through CVE-2026-20316, a 5.3 hard-coded password that CISA's
 *      own JSON feed shows was listed on 29 July. BOD 26-04's triage order puts
 *      evidence collection before the patch. The NetScaler flaw and BOD 26-04
 *      itself were covered before and are linked, not re-explained.
 *   2. California: AB 1709 and SB 1119 both route age checks to the Digital Age
 *      Assurance Act's operating-system signal (AB 1856). Read from the bill
 *      text on leginfo. The chatbot parent alert is optional where it risks
 *      harm — not what the coverage said.
 *   3. Google Play Early Access: Bitdefender's fake reward apps, on the one
 *      shelf where only the developer sees reviews, by design.
 *   4. Oracle Q1 FY27: operating cash flow above revenue, free cash flow still
 *      negative, because customers are prepaying for capacity. Slide figures
 *      as reported by Investing.com; transcripts were not reachable.
 *
 * Covers checked at full 1600x900 and reuse-checked. Rejected on the way: a
 * Play Store page showing legitimate third-party apps, which would have read
 * as naming them, and a Gemini store listing.
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
    slug: "cisco-fmc-the-ransomware-crew-used-the-5-3-not-the-10-0",
    title: "The ransomware crew skipped Cisco's 10.0. It logged in with the 5.3 that CISA listed back in July",
    excerpt:
      "CISA gave agencies until 12 September to deal with exploited flaws in Cisco's firewall manager, Citrix NetScaler and FortiOS. Talos's research shows the Qilin-linked cluster ignored the CVSS 10.0 bypass and used a hard-coded password flaw CISA had listed in July — and the federal instruction for all of it starts with evidence, not the patch.",
    categorySlug: "security",
    tags: ["cisa-kev", "cisco-fmc", "cve-2026-20079", "cve-2026-20316", "qilin", "fortinet", "netscaler", "bod-26-04"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1558494949-ef010cbdcc31${P}`,
    body: `CISA added three exploited flaws to its **Known Exploited Vulnerabilities** catalog on **9 September 2026** and gave federal agencies until **12 September** to deal with them:

| CVE | Product | Score | What it is |
|---|---|---|---|
| CVE-2026-20079 | Cisco Secure Firewall Management Center | 10.0 | Unauthenticated authentication bypass to root |
| CVE-2026-19490 | Citrix NetScaler ADC and Gateway | 9.3 | Authentication bypass on gateway and AAA configurations |
| CVE-2025-25249 | Fortinet FortiOS, FortiSwitchManager, FortiSASE | 7.3 | Heap-based buffer overflow |

Three days is short. What sits behind the listings is more interesting than the deadline.

## The 10.0 was not the way in for everyone

**Cisco's** advisory for **CVE-2026-20079** was first published on **4 March 2026**. It describes an improper system process created at boot that lets an unauthenticated attacker send crafted HTTP requests, bypass authentication and run scripts as **root**. There are no workarounds. Cisco has since added a line: **"In August 2026, the Cisco PSIRT became aware of active exploitation of this vulnerability."**

**Cisco Talos** has published what that exploitation looks like, and it splits into three clusters:

- **UAT-12197** used the bypass to drop a JSP web shell into the web root, then ran a JAR file to query the device's internal databases for credentials.
- **UAT-11823** chained the bypass with a second flaw, deployed a Netcat reverse shell and proxy tooling, and finished with a variant of **Cyclops Blink** — a malware family Talos notes was previously attributed to **Sandworm**, the Russian state hacking group.
- **UAT-11988**, which Talos assesses **"with high confidence"** as consistent with **Qilin** ransomware affiliates, did not use the bypass at all.

It logged in instead through **CVE-2026-20316**, which Talos describes as a vulnerability that **"allows a remote attacker to log in using a low-privileged account"** — a hard-coded password, scored **5.3**. From there it abused a legitimate utility on the appliance, package_info.pl, to run a malicious file dressed up as a licence.

That second flaw is not new to the catalog. CISA's own feed shows **CVE-2026-20316 was added on 29 July 2026**, with a federal deadline of **1 August**. The same feed lists a third Management Center flaw, **CVE-2026-20131**, added in **March**. One management product, three catalog entries in six months.

So the arithmetic most teams use to triage runs backwards here. The 10.0 got this week's headline. The criminal crew went through a 5.3 that CISA had listed back in July. A working login does not need an exploit.

## Fortinet's 7.3 gets the same three days as Cisco's 10.0

**CVE-2025-25249** is a heap overflow in FortiOS and related products, fixed by Fortinet earlier this year and scored **7.3**. Reporting on the campaign exploiting it puts the start at **July 2026**, attributes it to a Russian-speaking, financially motivated actor, and counts **178** devices infected with a post-exploitation backdoor called **PivotC2**.

It carries exactly the same deadline as the Cisco 10.0, and that is by design. Since June, CISA's deadlines no longer follow the score. [We looked at the directive that changed that when WebLogic landed on the list](/article/cve-2026-21962-weblogic-seven-months-kev-three-day-deadline): **BOD 26-04** sets the clock from four questions — whether the asset is publicly exposed, whether the flaw is on the catalog, whether an attacker can automate every step, and whether it gives partial or total control. An internet-facing firewall with a known, automatable exploit gets three days whether its score is 7.3 or 10.

[NetScaler's CVE-2026-19490 went the other way](/article/citrix-netscaler-cve-2026-19490-auth-bypass-patch-now): when we covered it, nothing had been seen in the wild. It is on the list now.

## The first instruction is not the patch

The part of BOD 26-04 that matters most for these three is the order of operations. For the three-day tier, CISA's implementation guidance sets out forensic triage in six time-boxed steps:

1. **Scope** the affected systems, within two hours.
2. **Collect evidence**, including volatile data such as memory — and **"Do not alter or remediate systems prior to evidence/artifact collection when possible."**
3. **Patch**, after the in-scope devices are identified and evidence is collected.
4. **Contain**, in a manner that **"does not alert the threat actor."**
5. **Analyse** for access, lateral movement, persistence and exfiltration, within 24 to 48 hours.
6. **Decide and escalate** within 48 to 72 hours, reporting confirmed compromise to CISA.

The reason is visible in the Cisco research. A web shell in the web root survives a hotfix. Credentials already queried out of the device stay stolen. An operator that logged in with a real account and ran the vendor's own tooling leaves little that a patch touches. Patching a management center that was compromised in August closes the door behind someone already inside — and wipes the memory that would have shown it.

Talos's write-up tells defenders to apply the hotfixes, and says Cisco will ship a **"comprehensive hardening release"** the week of 16 September. It does not offer post-compromise guidance. The federal directive does.

## What to do

- **Patch all three, but collect evidence first** on anything that was internet-reachable. Memory before the reboot.
- **On Cisco FMC, close CVE-2026-20316 as well as CVE-2026-20079**, and CVE-2026-20131 if it is still open. Rotate every account on the appliance.
- **Hunt for what Talos described**: unexpected JSP files in the web root, unfamiliar JAR executions, unexplained use of package_info.pl, and outbound reverse shells.
- **On FortiGate, look for PivotC2**, and treat the device configuration as disclosed if you find it.
- **Take the management plane off the internet.** A firewall's console should not be reachable by the people the firewall exists to stop.

## What is not established

- **When each Cisco cluster first got in.** Talos gives no start dates.
- **How many organisations** are affected by any of the three.
- **How many hosts the Fortinet campaign scanned.** Published figures disagree by a factor of ten.
- **Whether the Cyclops Blink variant means Sandworm itself**, or reuse of its tooling.
- **What Cisco's hardening release changes.**`,
  },
  {
    slug: "california-child-safety-laws-depend-on-an-age-typed-in-at-phone-setup",
    title: "California's new child-safety laws all depend on one number, typed in when the phone was set up",
    excerpt:
      "Newsom signed limits on addictive feeds for under-16s and time limits on companion chatbots for children. Neither law asks the app to work out a user's age. Both lean on a bracket the operating system collects at account setup and passes to every app — and the chatbot's parent alert is narrower than the headlines.",
    categorySlug: "world",
    tags: ["california", "child-safety", "age-assurance", "ab-1856", "ab-1709", "sb-1119", "chatbots", "social-media"],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1650136865959-0762ea47e5eb${P}`,
    body: `Governor **Gavin Newsom** signed a package of child online safety bills on **10 September 2026**, calling them the strongest in the country. Two drew the headlines: **AB 1709**, which bars social media platforms from giving users under 16 **addictive** features, and **SB 1119**, known as **Adam's Law** after Adam Raine, which puts time limits and crisis rules on **companion chatbots** used by children.

The coverage described what the laws require. The bill texts show what they depend on, and it is the same thing in both cases.

## Neither law asks the app to guess anyone's age

**AB 1709** says a platform may not give an addictive feature to a user under 16. Before providing one, section 22684 says the platform **"shall verify the age of a user pursuant to the Digital Age Assurance Act."**

**SB 1119** does the same for chatbots: operators determine a child's age under that same title of the Civil Code, or rely on the determination made under it.

That act is California's **Digital Age Assurance Act**, signed in October 2025 and revised this session by **AB 1856**. It moves age checking off websites and apps and onto the device.

## The age lives in the operating system

Under AB 1856, any **operating system** with an account setup feature must ask the account holder, at setup, for the **birth date, age, or both** of the device's primary user. The account holder can be a parent or guardian entering a child's age.

The operating system then produces a **signal**, defined as **"age bracket data that pertains to the primary user of a device"**, in four brackets: under 13, 13 to 15, 16 to 17, and 18 or older. App stores pass it along. Developers **"shall treat a signal received pursuant to this title as the primary indicator of a user's age range,"** and may not request more information than the minimum necessary.

The 13-to-15 bracket is exactly the line AB 1709 needs. The bills were built to fit together.

The obligations begin **before 1 January 2027** for new devices and **before 1 July 2027** for devices already set up. The Attorney General enforces them, with penalties of up to **2,500 dollars** per affected child for negligent violations and **7,500 dollars** for intentional ones.

## What that design gets right, and what it hands to the setup screen

There is a real case for it. Making every app verify age means handing identity documents or face scans to thousands of companies. Asking once, on the device, and passing only a bracket collects far less.

But it concentrates the whole regime on one moment: whoever sets up the phone, and what they type. Some of the consequences are written into the text:

- It follows the device's **primary user**. AB 1856 says it **"does not impose liability that arises from the use of a shared device"** by someone who is not that user.
- Software distributed under licences that let recipients copy, modify and redistribute it is **excluded** from the definition of an operating system provider. Reporting on the change says open-source distributions such as Debian and Fedora fall outside the rule while the major commercial platforms stay in.
- An app is told to treat the bracket as the primary indicator, not to second-guess it.

## What AB 1709 actually prohibits

The operative definition is narrower than the coverage suggested. An **addictive feature** under section 22682 is an **addictive feed** or **autoplay**. An addictive feed is one where content is recommended, selected or prioritised using information about the user, with seven exceptions, including private messages and content a user specifically asked for.

**Infinite scroll** and **notifications** appear in the bill's findings, not in the prohibition.

Platforms may still let under-16 users have accounts without those features. The text reviewed contains no route for a parent to consent to them. Penalties reach **25,000 dollars** per affected minor for negligent violations and **50,000 dollars** for knowing ones, and the bill creates an **e-Safety Advisory Commission** inside the state Department of Justice.

## What SB 1119 requires of chatbots, precisely

- A child may use an operator's companion chatbots for at most **two hours a day**, and **one hour** in a single session.
- Operators need a documented crisis response protocol for suicidal ideation and self-harm content.
- On a **"credible and imminent threat,"** the operator must either notify a parent **"as soon as practicable if that notification does not risk a threat of serious harm to the child,"** or give the child streamlined access to the **988** crisis line.

That last clause is where the headlines ran ahead of the text. It is not a guaranteed alert to parents. It is a choice, with an explicit exception for the children for whom telling a parent is itself the danger.

Operators must also complete a risk assessment before deployment and commission independent audits every two years. The main obligations take effect on **1 July 2027**. Public prosecutors can seek **5,000 dollars** per affected child for negligent violations and **15,000 dollars** for intentional ones, and families get a private right of action for actual damages under specified sections.

OpenAI has said the law **"pairs strong protections with continued access to useful AI tools."**

## What to watch

- **How the Attorney General's regulations** define verification under AB 1709.
- **How operating system vendors build the signal** before January.
- **Legal challenges.** State laws restricting minors' access to online features have drawn First Amendment suits before.

## What is not established

- **A start date for AB 1709's prohibition** separate from the age-assurance timeline. The text reviewed does not state one.
- **How accurate setup-screen ages will be** in practice.
- **Whether the open-source exclusion** becomes a route around the rules.
- **How operators will judge "credible and imminent"**, and how often they will choose the crisis line over a parent.`,
  },
  {
    slug: "google-play-early-access-the-shelf-with-no-public-reviews",
    title: "The fake reward apps moved to the one Play Store shelf where nobody can leave a public review",
    excerpt:
      "Bitdefender found thousands of apps in Google Play's Early Access program — fake casino, reward and cash-out games promoted with deepfake celebrity ads. Early Access exists so unfinished apps are not judged too soon, which means only the developer sees feedback. For an app that never intends to launch, that shield never comes down.",
    categorySlug: "gadgets",
    tags: ["google-play", "early-access", "bitdefender", "android", "adware", "deepfakes", "app-store", "scams"],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1512149673953-1e251807ec7c${P}`,
    body: `**Bitdefender** has found **thousands** of apps in **Google Play's Early Access** program promising money they never pay: fake casino games, reward apps offering PayPal payouts, cryptocurrency or gift cards, and misleading utilities and titles that appear to borrow other companies' trademarks.

One, a Grand Theft Auto imitation called **Vice Streets: Open World**, passed **1 million downloads** before it disappeared from the store. Google told Bitdefender it is **investigating**.

The apps are not sophisticated. Where they chose to live is.

## What Early Access is for

Early Access is Google's program for apps that have not launched yet. In Bitdefender's words, Google **"launched Early Access to give developers a platform to publish unfinished or still-in-development applications and collect feedback from early adopters."** Users find these apps in the Play Store's **For you** tab, under **Apps in development**, and install them with the ordinary install button.

The design choice follows from the purpose. An unfinished app should not be buried under one-star reviews for bugs its developer already knows about. So Google's own help page says: **"When you review early access and beta apps, only the developer can view your feedback."**

Bitdefender states the consequence plainly: the program **"removes one of Google Play's most important trust signals: public reviews and star ratings."**

## Why that is the whole trick

Think about what a wary user checks before installing something. The rating. The number of reviews. The one-star complaints that the payout never arrived.

In Early Access none of that exists, and the reason it does not exist is a good one — which is why nothing about the listing looks wrong. It is still Google's store, Google's listing format and Google's install button.

A normal app eventually launches and faces public reviews. An app whose only purpose is to show advertisements has no reason to leave. Google's help page describes what happens when an unreleased app **launches**; it does not describe a date by which it must.

## How the money actually works

Victims do not usually find these apps by browsing. They arrive from ads on **TikTok** and **Facebook**, some built from **AI-generated deepfakes of celebrities**.

Bitdefender describes the loop: users **"might even receive generous virtual rewards almost immediately, but when they reach a withdrawal threshold, progression slows dramatically. The promised payout will never arrive."**

Meanwhile, **"The application continues serving advertisement after advertisement, which is likely the intended use for the developers."** The product is the user's attention, sold to advertisers, one more ad closer to a payout that is never coming.

None of that needs malware. It needs a listing with no public reviews and a steady flow of people sent over from social media.

## What to do

- **Treat "Apps in development" as unreviewed**, because it is. The absence of a rating is not neutral.
- **Do not trust an app that says it will pay you to use it** and promotes itself with celebrity video. Real celebrities do not endorse cash-out games.
- **If you installed one, uninstall it** and check what permissions it was given.
- **Report it to Google**, since a public review is not an option.

## What is not established

- **How many apps** Bitdefender counted exactly, beyond "thousands", or over what period.
- **Whether Early Access has any time limit** before an app must launch or leave.
- **How much advertising revenue** these apps make.
- **What Google changes** after its investigation.
- **Whether any of the apps carry actual malware**, as opposed to deceptive advertising.`,
  },
  {
    slug: "oracle-took-in-more-cash-than-revenue-and-still-spent-more-on-capacity",
    title: "Oracle took in more cash than it booked in revenue last quarter, and still spent more than that building capacity",
    excerpt:
      "Oracle's first quarter produced a record 23 billion dollars of operating cash flow on 19.3 billion of revenue — and free cash flow was still negative 5 billion. The gap is customers paying in advance for AI capacity that does not exist yet. The backlog behind it is 664 billion dollars.",
    categorySlug: "ai",
    tags: ["oracle", "oci", "ai-infrastructure", "rpo", "capex", "earnings", "gpus", "cloud"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1662947774441-a54156b6e503${P}`,
    body: `**Oracle** reported its first quarter of fiscal 2027 on **10 September 2026**, and the headline was cloud infrastructure: **7.39 billion dollars** of revenue, up **121 percent**.

The more unusual numbers are in the cash flow.

| | Q1 fiscal 2027 |
|---|---|
| Total revenue | 19.35 billion dollars, up 30% |
| Cloud infrastructure revenue | 7.39 billion dollars, up 121% |
| Operating cash flow | about 23 billion dollars, a record, up 184% |
| Free cash flow | negative 5 billion dollars |
| Remaining performance obligations | 664 billion dollars, up 209 billion |

Two things in that table do not normally sit together. The company brought in more operating cash in a quarter than it recognised as revenue. And its free cash flow was still deeply negative.

## Customers are paying before the capacity exists

Operating cash flow running above revenue means cash is arriving ahead of the revenue it relates to. Oracle's investor slides, as reported by Investing.com, name the mechanism: **customer prepayments** and **bring-your-own-hardware** arrangements are helping fund the build-out.

The slides put the quarter's capital expenditure at about **28 billion dollars**, falling to about **18 billion** of net cash once short-term financing and customer prepayments are counted. For the full year they guide to **90 to 95 billion dollars** of capital expenditure, with net cash spend held under **70 billion**.

Put simply, Oracle's AI customers are paying part of the bill for the data centres being built to serve them, before those data centres are finished. The rest is being financed: the slides also record a **20 billion dollar** at-the-market equity offering completed during the quarter.

## What the backlog is, and what it is not

**Remaining performance obligations** — contracted revenue not yet recognised — reached **664 billion dollars**. Oracle's release says it booked **more than 30 billion dollars** of additional AI cloud contracts in the quarter.

For scale, Oracle guides to at least **90 billion dollars** of revenue for all of fiscal 2027. The backlog is more than seven years of that.

A backlog is a commitment in both directions. Oracle cannot recognise the revenue until it has built and delivered the capacity, and it can only collect if its customers keep paying for years. Coverage of the earnings call says Oracle expects much of the backlog to convert over roughly the next three years; the release itself gives no breakdown, and neither the release nor the slides as reported name the customers.

## The build-out is running hot

Oracle says it delivered **more than 300,000 GPUs** to AI cloud customers in the quarter — reported as about **850 megawatts** of capacity, nearly triple the previous quarter. The slides put utilisation of its AI infrastructure at **97.9 percent**.

That is the other half of the story. Capacity is being used almost as soon as it is switched on, which is why customers will pay in advance to get in the queue — and why, the same week, OpenAI paused new sign-ups to its most expensive plan for lack of capacity.

## Why it matters beyond Oracle

The structure — customers prepaying, the provider issuing equity and borrowing, a backlog several times annual revenue — is how AI infrastructure is being financed now. It moves risk rather than removing it: off the provider's balance sheet and onto its customers' willingness and ability to keep paying.

And it is the same force showing up in consumer prices. [AI data centres are outbidding everyone else for the same parts](/article/every-iphone-went-up-100-dollars-including-the-ones-that-did-not-change), and commitments this size are why.

## What is not established

- **Who the prepaying customers are**, and how concentrated the 664 billion dollar backlog is.
- **How much of the backlog converts within twelve months.** The release does not say.
- **The terms of the prepayments** — whether refundable, and what happens if capacity arrives late.
- **The call commentary itself.** Transcripts were not accessible for this piece; slide figures are as reported by Investing.com.`,
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
