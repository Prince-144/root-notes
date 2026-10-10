/**
 * Drafts the second 10 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-97.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-97.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-97.ts --update
 *
 *   1. MonsterCloud indictment (security). Charges, not findings. Every claim
 *      attributed, the not-guilty plea and the contract defence both carried.
 *   2. Flax Typhoon seizures and the five KEV additions (world). The five
 *      identifiers are not named in any coverage we found; they came out of
 *      CISA's own feed, and three of them are from 2015 and 2016.
 *   3. Comparitech Q3 (security). A record 2,627 — of which victims confirmed
 *      247. The counting method is the story, and our own Azazel piece is the
 *      reason to doubt it.
 *
 * Primary sources: the indictment as reported by The Record and
 * BleepingComputer, the DOJ and FBI announcements as reported, CISA's KEV
 * feed read directly, and Comparitech's Q3 roundup as reported.
 *
 * The five CVEs were obtained by querying the KEV JSON for entries added on
 * 2026-10-08 — exactly five, all due 2026-10-11, which matches what coverage
 * describes without naming. The piece says that is a match rather than an
 * attribution, because CISA's catalog entries name no actor.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - MonsterCloud: a courthouse, which is where this currently is.
 *   - Flax Typhoon: an airport apron, one of the target types in the affidavit.
 *   - Comparitech: a supermarket aisle, retail being the standout sector.
 *
 * Rejected on the way: a control tower at dusk that rendered as a black frame.
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
    slug: "monstercloud-indictment-prosecutors-say-the-decryption-was-a-ransom-payment",
    title:
      "Prosecutors say the proprietary decryption technology was a payment to the people holding the keys",
    excerpt:
      "The owner of MonsterCloud, a firm that sold ransomware recovery as an alternative to paying, has been charged with wire fraud. The indictment alleges he paid the attackers 8 million dollars for keys and billed victims 19 million. He has pleaded not guilty.",
    categorySlug: "security",
    tags: [
      "monstercloud",
      "ransomware",
      "indictment",
      "wire-fraud",
      "incident-response",
      "doj",
      "ransom-payments",
      "united-states",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1764760505443-39d3e33df39a${P}`,
    body: `Everything below is an allegation. **Zohar Pinhasi**, owner of the Florida firm **MonsterCloud**, was indicted by a federal grand jury in the Eastern District of New York on **23 September** and arraigned in Brooklyn on **7 October**, on two counts of wire fraud and one count of wire fraud conspiracy. He **pleaded not guilty** and was released on a two million dollar bond. Each count carries a maximum of twenty years.

None of it has been proved, and we are writing about it because of what the charges describe rather than because they are true.

## What the indictment alleges

MonsterCloud sold ransomware recovery. The pitch, according to prosecutors, was that the firm had its **own decryption technology** — that a victim could get their files back without funding the people who had taken them.

Prosecutors allege there was no such technology. They say Pinhasi and others contacted the ransomware operators, paid them for decryption keys, and used those keys on customers' files.

The money, as the indictment has it: roughly **eight million dollars** paid to ransomware groups, against **nineteen million** billed to victims, across hundreds of clients in the United States and Canada. One example cited is a 2023 case where a client was charged around 150,000 dollars and the ransom paid was around 8,200.

The US Attorney's office framed it as re-victimising clients while taking a profit. That is a prosecutor's characterisation of a case it has to prove.

## The defence that is already visible

The indictment itself acknowledges something that matters: some MonsterCloud contracts **did disclose** that the company might communicate with or pay cybercriminals.

The government's answer to that disclosure is a qualifier. Those same contracts allegedly said MonsterCloud would contact attackers only if it **could not decrypt a customer's files by other means** — which, if there were no other means, makes the disclosure describe a last resort that was in fact the only resort.

That is the hinge of the case, and it is a question about what the contracts said and what the firm could actually do. A reader should expect the defence to live there.

## This was reported seven years ago

In 2019 **ProPublica** published an investigation into firms selling ransomware recovery that paid the ransom instead. MonsterCloud was one of two companies named. The researcher **Fabian Wosar** helped run a sting: ransom notes carrying email addresses the researchers controlled, posing as the gang, so they could see who got in touch.

Pinhasi's answer at the time was that the firm's recovery methods were a **trade secret** and that it did not mislead clients.

Put that beside the indictment's alleged period, which prosecutors give as **June 2018 to June 2023**. If the government is right about those dates, the conduct ran for four years after it was publicly reported, and the grand jury that returned this indictment did so on **23 September 2026** — seven years after the journalism.

Whatever the case decides, that gap is its own finding about how long a disputed practice can continue once the dispute is in print.

## Why this matters past one firm

Set the specific allegations aside. The structure they describe is one the whole incident-response market has to answer for.

A victim calling a recovery firm is buying an outcome — files back — and is in no position to audit the method. The expertise gap is total: that is why they called. If the firm says it has proprietary tooling, the customer has no way to check, and the only observable is whether the files come back.

Which means a firm that quietly pays and bills a markup produces exactly the same observable as a firm that genuinely decrypts. The market cannot distinguish them on results.

And the second-order effect is the one that reaches people who never hired anybody. Ransomware is a business whose revenue is the proportion of victims who pay. A market segment that pays quietly, at scale, while telling the public that paying is unnecessary, inflates that proportion and conceals it at the same time. The gangs learn the real payment rate. Everyone else reads the advice.

This connects to something we wrote about [an affiliate who diverted his gang's victims to his own leak site](/article/azazel-gentlemen-mcp-as-a-command-channel-and-the-affiliate-who-kept-the-money). The common thread is that almost everything known about ransomware economics is reported by parties with an interest in the number.

## What to ask a recovery firm

Not as a response to this case, which is unproven, but because these are answerable questions and most contracts do not answer them:

- Will you pay a ransom on my behalf, under any circumstances, and will you tell me **before** you do it rather than after?
- What specifically is your recovery method for this family? A firm with real capability can name the flaw or the tool.
- Does your fee change depending on whether a payment is made? If not, ask why not.
- Will you give me the decryptor and its provenance, or only the restored files?

A firm that answers those plainly is a different proposition from one that does not, regardless of what any court decides here.

## What is not established

- All of it, in the legal sense. These are charges. Pinhasi has pleaded not guilty and no case has been proved.
- What MonsterCloud's contracts actually said, in full, and how many customers saw which version.
- Whether the firm ever had any decryption capability, as opposed to none.
- Whether any client would have objected had they known. The indictment's theory is that the deception is the harm, which does not require that they would have.
- Whether other firms in the same market operate the same way. Nothing here establishes that, and the question is worth asking rather than assuming.`,
  },

  {
    slug: "flax-typhoon-seizures-and-the-five-kev-additions-from-2015-and-2016",
    title:
      "Three of the five vulnerabilities added to the exploited catalog this week were disclosed in 2015 and 2016",
    excerpt:
      "The FBI seized seven domains behind scanning and malware-delivery platforms run by a Chinese contractor, and CISA added five identifiers to its exploited-vulnerabilities catalog the same week. No coverage we found named them. They are in CISA's own feed, and most of them are a decade old.",
    categorySlug: "world",
    tags: [
      "flax-typhoon",
      "fbi",
      "domain-seizure",
      "cisa-kev",
      "critical-infrastructure",
      "china",
      "legacy-vulnerabilities",
      "espionage",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1764449320749-cf3baba99ce8${P}`,
    body: `The **FBI** and the **Justice Department** seized **seven domains** on the authority of a federal magistrate's order dated **6 October**. The domains supported two platforms operated by **Integrity Technology Group**, a Chinese cybersecurity company with government contracts, and a remote-access tool. The activity is associated with the espionage cluster commonly called **Flax Typhoon**.

One platform, **MicroScan**, searched exposed systems for weaknesses. The other, **FishHub**, delivered malware after targeted phishing and gave remote access and selective file theft. A seventh domain was tied to **SoftEther VPN** software installed on compromised systems to keep access alive.

According to an FBI affidavit, MicroScan was paired with a **Mirai botnet** of infected devices to probe targets including a South Carolina power company, airports in Japan and Poland, Taiwanese gas and electricity firms, and universities. The Justice Department says confirmed FishHub victims include around **twenty Taiwanese universities**. The FBI has not said whether the named power company, airports or energy providers were actually breached.

This is the second US action in two years against this company's infrastructure. In September 2024 the FBI dismantled a Flax Typhoon botnet built from more than 200,000 compromised consumer devices.

## The part nobody printed

Reporting of this noted that **CISA added five identifiers** to its Known Exploited Vulnerabilities catalog in the same week, on the strength of exploitation tied to this activity. None of the coverage we read named them.

They are in CISA's own feed, which is public. Exactly five entries were added on **8 October**, all with a remediation deadline of **11 October**:

- **CVE-2015-5477** — ISC BIND
- **CVE-2016-3081** — Apache Struts, command injection
- **CVE-2015-3306** — ProFTPD, improper access control
- **CVE-2021-3199** — ONLYOFFICE Docs, path traversal
- **CVE-2023-22894** — Strapi, cleartext storage of sensitive information

A note on those five: CISA's catalog entries do not name an actor. Five additions on the day, all sharing the deadline, matches what reporting describes, and that is a match rather than an attribution. We are naming the identifiers, not assigning them.

## Three of them predate the campaign by a decade

Look at the years. **2015. 2016. 2015.** The newest is from 2023.

A state-linked contractor built an internet-scale scanning platform, pointed it at power companies, airports and universities, and the things it was worth scanning for included a BIND flaw from 2015 and a Struts command injection from 2016.

That is not a statement about the attacker's sophistication. It is a statement about what is reachable. A scanning platform exists to find the cheapest way in across a very large number of hosts, and it found that the cheapest way in, in 2026, is frequently software that was patched eleven years ago and never updated.

The three-day deadline CISA attached is the other half of the signal. An agency does not give federal bodies seventy-two hours to patch something from 2015 unless it expects to find it installed.

## What the seizure actually achieves

Seven domains and a scanning platform's access point. That is real and it is bounded.

The seized domains now serve FBI notices. The platform's operators lose the infrastructure named in the order and keep everything else — the code, the target lists, the knowledge of which hosts answered. Infrastructure is the cheapest thing to replace in an operation like this, which is why the same company appears in two US actions two years apart.

What a seizure does well is impose cost, document attribution publicly, and break the current campaign's tooling mid-flight. What it does not do is end the capability. Reading it as a defeat of the actor rather than a disruption of one deployment sets up the wrong expectation for the next one.

Seven governments — the US, UK, Australia, Canada, Japan, New Zealand and Spain — issued a joint advisory the same week warning that China-linked actors are targeting critical infrastructure.

## What to do

- Patch the five. Three of them are old enough that the honest first step is finding out whether you are running the software at all, which for BIND, Struts and ProFTPD is often a question about something nobody owns any more.
- Treat the deadline as the signal it is. CISA set three days because it expects these to be present.
- Look for **SoftEther VPN** on systems that have no reason to run it. That is the persistence mechanism named here, and it is legitimate software, which is why it survives.
- Inventory what is internet-facing and old. A scanning platform does not care how long ago you deployed something.

## What is not established

- Whether the five KEV additions are formally tied to this campaign. CISA's entries name no actor; the timing and the shared deadline match the reporting.
- Whether the named power company, airports and energy firms were breached, as opposed to probed.
- Who directed the activity. Integrity Technology Group holds government contracts, which is not the same as a tasking relationship being documented.
- What happens to the company. A domain seizure is not a charge.
- How much of the infrastructure was actually taken. Seven domains is what the order covers, not necessarily what exists.`,
  },

  {
    slug: "comparitech-q3-2026-the-record-is-2627-claimed-and-247-confirmed",
    title:
      "The record quarter counts 2,627 attacks, and the victims confirmed 247 of them",
    excerpt:
      "Comparitech's third-quarter ransomware count is the highest it has recorded. Nine out of ten entries in it are unconfirmed claims posted by the gangs themselves, which makes the number a measure of how much they are claiming as much as how much they are doing.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "comparitech",
      "statistics",
      "leak-sites",
      "qilin",
      "the-gentlemen",
      "retail",
      "threat-intelligence",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1604719312566-8912e9227c6a${P}`,
    body: `**Comparitech** counted **2,627 claimed ransomware attacks** in the third quarter of 2026 — July to September — the highest quarterly figure it has recorded. August alone was **997**, a monthly record, beating 988 from February 2025.

Against the second quarter's 2,030 that is a rise of about **29 percent**. Against the third quarter of 2025, at 1,636, about **61 percent**. One outlet reports the quarterly rise as 27 percent; the arithmetic on the two published totals gives 29, and we are going with the arithmetic.

Now the number that should travel with all of those and usually does not.

## 247

Of the 2,627, **247 were confirmed by the organisations affected**. The other **2,380 are unconfirmed**.

That is not a criticism of the methodology, which is transparent about this. It is a point about what the figure measures. Counts like this are assembled largely from **gang leak sites** — the pages where ransomware operations post the names of organisations they say they have hit, to pressure them into paying.

A leak-site post is a claim by an interested party. It can be true. It can also be a re-post of an old victim, a victim who was never encrypted, an organisation reached through a supplier and counted as a direct hit, or a name added for leverage. Nine out of ten entries in a record quarter are claims of that kind.

So the headline reads as a measure of attacks and is also, unavoidably, a measure of **how much the gangs are claiming** — which is a function of how many leak sites exist, how aggressively they post, and how many groups are competing for attention.

## Our own reporting is a reason to doubt the count in the other direction

The count can miss in the other direction too. We wrote this week about [a Gentlemen affiliate who published his victims on his own leak site rather than the group's](/article/azazel-gentlemen-mcp-as-a-command-channel-and-the-affiliate-who-kept-the-money), keeping the proceeds. More than two dozen organisations across six countries, and by CloudSEK's account none of them appeared where a counter would look.

Which lands awkwardly beside this quarter's list of the most prolific groups: **Qilin** and **The Gentlemen**. The Gentlemen are near the top of a count assembled from leak-site postings, during a period when at least one of their affiliates was routing victims away from the group's leak site entirely.

The honest conclusion is not that the number is too high or too low. It is that it is a measurement of leak-site activity, and leak-site activity is a choice attackers make.

## What the confirmed subset says

The 247 confirmed cases are the firmer ground, and the breakdown is worth more than the headline: **138 businesses, 53 government entities, 36 healthcare organisations, 20 educational institutions**.

On sectors, retail is the standout in the full dataset — **199 attacks**, up from 154 the previous quarter and nearly double the 101 in the third quarter of 2025. Finance, technology, education and healthcare are also reported as rising significantly.

## The average and the median are 450,000 apart

Average demand for the quarter: **602,400 dollars**. Median: **150,000**.

That gap is the most useful pair of numbers here. A mean four times the median means a small number of very large demands are pulling the average up, and that the typical victim is facing something far smaller than the headline figure suggests.

For anyone sizing a risk, the median is the number that describes the likely case and the mean is the number that describes the tail. Reporting that quotes only the average — most of it — describes an experience most victims will not have.

## What to take from it

- The direction is real. Three independent framings — quarter on quarter, year on year, and a record single month — all point up, and that is harder to explain away as counting artefacts than any single figure.
- The magnitude is soft. Treat 2,627 as an upper bound on claimed incidents, not a count of successful encryptions.
- The sector movement is the actionable part. Retail nearly doubling year on year is a reason for retailers to look at their own exposure regardless of what the total says.
- Quote the median alongside the mean, or neither.

## What is not established

- How many of the 2,380 unconfirmed claims are real.
- Whether the rise reflects more attacks, more claiming, more groups, or better collection by the researchers. All four would produce this shape.
- How many victims paid. Demand figures are not payment figures, and the payment rate is not in this data.
- How the double-counting of supply-chain victims is handled, where one intrusion produces many affected organisations.
- Whether the groups near the top of the list are the most active or the most public. On this quarter's evidence those are not the same question.`,
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
