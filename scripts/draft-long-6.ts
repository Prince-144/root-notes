/**
 * Long-form drafts — Security, World, Startups.
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
    slug: "interlock-ransomware-volatility3-ir-tool-abuse",
    title: "Interlock used a memory forensics tool to steal the credentials it was built to investigate",
    excerpt:
      "A March 2026 Interlock intrusion used Volatility3 — a legitimate incident-response tool — to pull domain credentials, NTLM hashes and account information out of memory. The rest of the chain was a ClickFix lure and PowerShell.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "threat-intelligence",
      "credential-theft",
      "incident-response",
      "social-engineering",
      "exploitation",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1555529902-5261145633bf${P}`,
    body: `**Volatility3** is a memory forensics framework. Incident responders use it to analyse a memory image after a compromise — to find what was running, what was injected, and what credentials were resident when the machine was captured.

In a March 2026 Interlock ransomware intrusion, the attackers used it for that last part.

Volatility3 was deployed to extract **domain credentials, NTLM hashes and user account information from memory** — the same capability, pointed the other way.

## Why this is worse than it sounds

Credential dumping from memory is not new. What is notable is the tool.

An attacker running Mimikatz is running something every endpoint product on the market knows by name. An attacker running Volatility3 is running a legitimate, open-source, widely-used forensics framework that a security team might have installed deliberately — and that a detection rule flagging it would flag every time the incident response team did their job.

This is living-off-the-land applied to the defensive toolkit itself. The same logic that makes attackers use PowerShell, PsExec and Cloudflared: pick something that is already trusted, already present, or already unremarkable.

And there is a particular sting in this one. A tool for understanding a compromise is being used to deepen it.

## The rest of the chain was ordinary

Around that one interesting step, the intrusion is a standard sequence:

1. **Drive-by compromise**, then a **ClickFix lure** — the pattern where a page instructs the visitor to paste something into a terminal or Run dialog to "fix" a problem
2. **PowerShell** delivering a RAT payload
3. **Persistence**
4. **Discovery**
5. **Privilege escalation**
6. **Lateral movement**

ClickFix deserves the attention it gets. It works because it does not exploit anything — it asks the user to run the command, and the user does, because the page has framed it as a repair.

Interlock has [pushed fake IT tools through ClickFix before](https://www.bleepingcomputer.com/news/security/interlock-ransomware-gang-pushes-fake-it-tools-in-clickfix-attacks/), which suggests it is a reliable enough entry point for them to keep using it.

## Interlock is not a small operation

The group has been active since mid-2024 and has grown into a multi-skilled operation willing to adapt and go after large targets.

The most relevant marker for anyone tracking them: Interlock was **exploiting the Cisco Secure FMC vulnerability CVE-2026-20131 from 26 January 2026** — zero-day exploitation of a firewall management platform, which is a different tier of capability from phishing lures.

That combination is worth noting. The same group runs commodity social engineering at the front door and zero-day exploitation of security appliances. Those are usually different actors. Here they are the same one, choosing whichever is cheaper for the target in front of them.

We covered [a separate Cisco Secure FMC zero-day](/article/cisco-fmc-zero-day-cve-2026-20316) earlier; the pattern of ransomware crews reaching for security-appliance vulnerabilities is now well established rather than exceptional.

## What to do about the specific technique

- **Alert on forensics tooling appearing outside IR.** Volatility3 on a machine where no investigation is running should be an alert. The rule has to be scoped by context rather than by binary, which is more work than a blocklist and the only version that works.
- **Reduce what is resident in memory.** Credential Guard, LSA protection and limiting where domain admin accounts log in shrink what any memory-dumping technique yields, regardless of the tool used.
- **Detect ClickFix at the paste, not the page.** The observable moment is a user pasting an encoded command into Run or a terminal. That telemetry exists on most endpoints and is not widely alerted on.
- **Watch for the sequence, not the tools.** Every individual step here is legitimate software. The order is what is not.

## The pattern worth internalising

Interlock did not need a novel capability. It needed a user to paste a command, PowerShell to run, and a forensics tool to do exactly what it was designed to do.

Detection built around "is this program malicious" struggles with all three. Detection built around "should this program be doing this, here, now, in this order" is the harder thing to build and the only thing that catches this.`,
  },
  {
    slug: "apple-uk-icloud-technical-capability-notice-second",
    title: "Britain asked Apple for a way into encrypted iCloud again — and Apple is fighting it again",
    excerpt:
      "The UK dropped its first secret order in 2025 after American pushback. It issued a second. Apple has now filed a complaint with the Investigatory Powers Tribunal, and the underlying demand is unchanged: access to backups that are end-to-end encrypted by design.",
    categorySlug: "world",
    tags: [
      "encryption",
      "regulation",
      "privacy",
      "policy",
      "united-kingdom",
      "big-tech",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1615842978998-54a9182892b2${P}`,
    body: `Apple has filed a complaint with the UK's **Investigatory Powers Tribunal** over a government **technical capability notice** — a secret legal order compelling access to user data, including data that is encrypted.

This is the **second** such notice. The first was issued in January 2025, and the sequence since is worth laying out, because the individual headlines have made it look more resolved than it is.

## The sequence

| When | What happened |
| --- | --- |
| Jan 2025 | UK issues a secret technical capability notice to Apple |
| Feb 2025 | Reported publicly; critics call it a global emergency |
| Feb–Mar 2025 | **Apple withdraws Advanced Data Protection for UK users** |
| Mar 2025 | Apple challenges the order; IPT refuses the Home Office's attempt to hear the case in secret |
| Aug 2025 | UK **drops** the order following US civil-liberties pushback; the US spy chief confirms it |
| Oct 2025 | UK **tries again** |
| Aug 2026 | Apple files a complaint with the IPT over the latest notice |

The August 2025 resolution was widely read as the end of it. It was not. It was the end of the first notice.

## What is actually being demanded

The technical detail matters, because "backdoor" is doing a lot of work in the coverage.

**Advanced Data Protection** makes iCloud backups end-to-end encrypted — the keys sit with the customer, and Apple cannot read the contents. That is the property the order collides with.

An order to provide access to ADP-protected backups is not a request for data Apple holds. It is a request that Apple **change the system so the data becomes readable**, because in the current design there is nothing to hand over.

And the reported scope was not limited to UK users. The demand was framed as access to cloud-stored data of Apple customers **worldwide** — one government's order reaching accounts in every other jurisdiction.

## Apple's answer the first time was to remove the feature

When the first notice landed, Apple did not build a mechanism. It **turned Advanced Data Protection off for UK users**.

That response is the clearest statement of the company's position: if the choice is between weakening end-to-end encryption and not offering it in a market, it will not offer it. UK users lost a security feature, and Apple avoided building the thing it says cannot be built safely.

The argument underneath is not new and does not depend on trusting Apple: a mechanism that lets one government read encrypted backups is a mechanism, and mechanisms do not check passports. Whoever finds it, or is later granted it, gets the same access.

## Why the secrecy fight mattered

One of the more consequential rulings came early. The IPT **refused the Home Office's attempt to keep the case secret**.

That is procedurally significant. Technical capability notices are secret by design — a company receiving one is generally barred from disclosing it, which means the public cannot know their government has demanded a capability, and cannot object to something they are not told about.

A public hearing does not decide the substance. It does mean the substance can be argued about.

## What to watch

- **Whether ADP returns to the UK.** That is the observable signal on whether the second notice is resolved.
- **Whether the second case stays public.** The precedent was set once; it is not automatic.
- **Whether the US intervenes again.** American pressure ended the first notice, which makes this less a UK-Apple dispute than a question about whose rules apply to a global service.
- **Whether other governments follow.** The reason this matters beyond Britain is precedent. A working template for compelling access to end-to-end encrypted data does not stay in one country.

## The structural point

This is the same question sitting under the [EU's DMA enforcement](/article/google-dma-fine-890-million-search-play-steering) and [India's DPDP regime](/article/india-dpdp-enforcement-timeline-november-2026), in a harder form: a global service, a national rule, and no mechanism for reconciling them except one side giving way.

With market conduct there is usually a compromise available — change a default, add a screen, pay a fine. With encryption there is not. Either the data is readable by someone other than the user or it is not, and there is no version that is a bit readable for one government.`,
  },
  {
    slug: "microsoft-bug-bounty-20-million-562-researchers",
    title: "Microsoft paid $20m to 562 researchers — which is about $8,000 a report",
    excerpt:
      "Between July 2025 and June 2026 Microsoft awarded more than $20 million across 2,531 eligible reports from 562 researchers. The averages are the interesting part, and so is what they say about who can actually make a living this way.",
    categorySlug: "startups",
    tags: [
      "bug-bounty",
      "security-research",
      "market-data",
      "big-tech",
      "vulnerability",
      "careers",
    ],
    readingMinutes: 6,
    coverImageUrl: `https://images.unsplash.com/photo-1614064548237-096f735f344f${P}`,
    body: `Microsoft's bug bounty numbers for **July 2025 to June 2026**: more than **$20 million** awarded, across **2,531 eligible reports**, from **562 researchers**.

Three numbers, and the arithmetic between them says more than any of them alone.

## The averages

| Measure | Figure |
| --- | --- |
| Total awarded | **$20m+** |
| Eligible reports | **2,531** |
| Researchers paid | **562** |
| Average per report | **~$7,900** |
| Average per researcher | **~$35,600** |
| Average reports per researcher | **~4.5** |

Averages hide distributions, and bug bounty distributions are famously skewed — a handful of researchers will account for a disproportionate share of both reports and payouts, and a long tail will have submitted one thing that landed.

But even taking the averages at face value, the picture is specific: **$35,600 a year is not a salary in most of the markets these researchers live in**, and 4.5 eligible reports a year is not a full-time output.

For the overwhelming majority of the 562, this is not a job. It is a supplement.

## What the per-report figure tells you

**~$7,900 per eligible report** is a genuinely high average by industry standards, and it reflects Microsoft's scope: the programme covers products where a serious vulnerability has consequences at national-infrastructure scale, and the top awards run far above the average.

That number is also the recruitment mechanism. A researcher choosing where to spend a weekend is comparing expected value, and a programme paying an average approaching five figures per accepted report competes well against the alternatives — including the ones that are not bug bounty programmes.

That comparison is the part vendors think about most. The market for a working exploit has other buyers, and they pay more. A bounty programme does not have to beat them to be worth running; it has to be a good enough option for enough researchers that a meaningful share of findings arrive through the front door.

## What 2,531 reports means operationally

Set aside the money for a moment. Someone triaged 2,531 eligible reports in a year — roughly ten per working day, and that is only the ones that qualified. The volume of submissions that did not qualify is not in this figure and is invariably much larger.

Bug bounty programmes are often discussed as a cheap alternative to hiring. The triage load is the reason that framing is wrong. Every report needs a human to reproduce it, assess it, decide whether it is in scope and route it, and the marginal cost of a bad report falls entirely on the vendor.

Running a programme at this scale is a staffed function, and the $20m is the visible part of the cost.

## For anyone building a security business

Two observations that generalise past Microsoft.

**The talent pool is broad and part-time.** 562 people found something worth paying for in a year, at an average of 4.5 findings each. That is a large, distributed, mostly non-professional workforce — which is exactly the shape that suits crowdsourced models and does not suit a hiring plan.

**Trust is the moat.** Researchers submit where they expect to be paid fairly, quickly, and credited. Programmes that dispute severity, downgrade aggressively or move slowly lose access to the same pool. That reputation compounds in both directions and is very hard to rebuild.

## The number that is not here

What none of these figures show is how many serious vulnerabilities were found and **not** reported — sold, kept, or used.

That number does not exist in any dataset, which is precisely why bounty programmes are structured as a competing offer rather than a complete solution. $20 million buys visibility into the portion of the market that chose to sell to the vendor. It says nothing measurable about the rest.`,
  },
];

const payload = await getPayload({ config });

for (const draft of DRAFTS) {
  const { docs: clash } = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
  });

  if (clash.length > 0) {
    console.log(`skip (exists): ${draft.slug}`);
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
