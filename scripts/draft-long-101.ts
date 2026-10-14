/**
 * Drafts the 14 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-101.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-101.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-101.ts --update
 *
 *   1. October Patch Tuesday (security). More than fourteen hundred fixes and
 *      five different totals across five vendors. CISA's KEV entry names the
 *      exploited flaw differently from every write-up of it, which this
 *      session read out of the feed directly.
 *   2. Ivanti Connect Secure (security). Volexity's chain: two links patched
 *      under one identifier, the third still open, against an appliance that
 *      was fully patched when it was broken into — and the vendor's own
 *      integrity checker cannot see it.
 *   3. iRhythm (world). Told the SEC in June, told patients in October, and
 *      has still published no company-wide total.
 *
 * Primary sources: Volexity's UTA0576 write-up, CISA's KEV feed read
 * directly, and iRhythm's 8-K as reported alongside state filings.
 *
 * KEV read this morning, catalog 2026.10.13: CVE-2026-96951 and
 * CVE-2026-104935 both added 13 October with a 16 October due date, and
 * neither CVE-2026-108398 nor CVE-2026-92707 is listed — which settles a
 * disagreement in the coverage about the third zero-day.
 *
 * Deliberately not repeated: a claim that a partial fix shipped in July 2026
 * and exploitation happened during the backport. It is in secondary coverage
 * and not in Volexity's post, so it is not attributed to them here.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - Patch Tuesday: an open-plan office, which is the estate being patched.
 *   - Ivanti: the back of a network device, for the edge.
 *   - iRhythm: a monitor showing ECG traces, which is the business.
 *
 * Rejected on the way: four screen close-ups whose entropy crop came back
 * blank, black or a corner of plastic.
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
    slug: "patch-tuesday-october-2026-fourteen-hundred-fixes-and-five-totals",
    title:
      "Microsoft shipped more than fourteen hundred fixes, and five vendors counting them got five different numbers",
    excerpt:
      "October's Patch Tuesday is the largest on record by a wide margin. One flaw is being exploited and carries a three-day federal deadline — and CISA's own catalogue describes it differently from every write-up of it.",
    categorySlug: "security",
    tags: [
      "patch-tuesday",
      "microsoft",
      "cve-2026-96951",
      "cisa-kev",
      "zero-day",
      "windows",
      "vulnerability-counts",
      "patching",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1774494168068-0f716c3aafcf${P}`,
    body: `Microsoft's **October Patch Tuesday** landed on the 13th and it is enormous. A normal month is sixty to a hundred and thirty fixes. This one is more than **fourteen hundred**.

How many more than fourteen hundred depends on who is counting.

## Five vendors, five totals

- Rapid7: **1,413**, of which 1,102 are in Windows.
- Dark Reading: **1,413**, of which 80 are critical.
- BleepingComputer: **1,411**, described as a record.
- Action1: **1,409**.
- Security Online: **1,414**, of which 78 are critical.

A five-CVE spread across five counts, and a two-CVE spread on the critical total. The likely explanation is boring — whether Edge is folded in, whether third-party CVEs republished by Microsoft are included, where the cutoff for the month sits — and none of the five publishes its method.

This is a small thing that matters for a specific reason. The number in the headline is the number that reaches a board, and "a record 1,411" is going to be quoted in risk reports for a year by people who cannot check it. We have written about [a ransomware count that is mostly unverified claims](/article/comparitech-q3-2026-the-record-is-2627-claimed-and-247-confirmed) and [a victim figure that was really a database's row count](/article/dtu-breach-200000-is-the-size-of-the-database-not-the-victim-count). The security industry publishes a great many numbers and explains the construction of very few.

One write-up is an outlier worth flagging separately. At least one write-up reports **114** vulnerabilities and three actively exploited zero-days, with CVE identifiers that appear in no other source. That is not a rounding difference, and a reader who lands on it will come away with a completely different picture.

## The one that is being exploited

**CVE-2026-96951**, scored **8.8**. CISA added it to the Known Exploited Vulnerabilities catalogue on **13 October** with a due date of **16 October** — a three-day federal deadline, which is as short as CISA sets.

Here is the part worth checking yourself. Every write-up we read describes it as a **Windows Shell security feature bypass**, several tying it to Mark of the Web — the marker Windows puts on downloaded files so they open with a warning.

CISA's catalogue entry calls it a **Microsoft Windows Command Injection Vulnerability**.

Those are not the same description. A security feature bypass gets a file past a prompt; a command injection runs something. They may be two framings of one chain, and CISA's vulnerability names are often terse. But if you are triaging on the strength of a one-line description, the two lines point at different things, and the authoritative text for everything downstream is the catalogue entry.

Dark Reading reports that the flaw was found by **Anthropic's Claude**. We should say, as we do whenever this comes up, that this site is written with Claude's assistance — noted on our [editorial policy](/editorial-policy) page. It is a reason to report the claim plainly and attribute it, not to leave it out.

## The other two, and what the catalogue says about them

Two more are publicly disclosed: **CVE-2026-108398**, a .NET Framework security feature bypass, and **CVE-2026-92707**, a denial of service in MessagePack-CSharp.

One outlet lists the second as exploited; others describe both as disclosed without confirmed exploitation. We read CISA's feed directly: **neither is in the catalogue**. That is not proof nothing is happening, but it is the authoritative statement about what has been confirmed, and it sides with the second reading.

## What a fourteen-hundred-CVE month actually means

It does not mean Windows got fourteen hundred times worse in a month.

A number this size is mostly a statement about discovery and process: more automated analysis, more fuzzing, more findings batched into one release, and a vendor choosing to issue identifiers at a finer grain than it used to. Several of this year's large months have been driven by tooling that finds variants of the same defect in bulk.

What it does change is triage. A patch cycle a team could read in a morning is now one nobody will read. The practical consequence is that the three identifiers above — one exploited, two disclosed — matter more than the total, and the total is the part that will be reported.

## What to do

- **CVE-2026-96951 by 16 October** if you are a federal agency, and treat the same date as sensible for everyone else. Exploited plus a three-day clock is the whole signal.
- Do not triage from the headline count. Pull the exploited and publicly-disclosed entries and start there.
- Check Microsoft's own Security Update Guide for exploitation status rather than a summary of it, including this one. The summaries disagree.
- If a number from this release ends up in a report you write, say which vendor's count it is.

## What is not established

- The actual total. Five sources give five figures and none explains its counting.
- Whether CVE-2026-96951 is better described as a shell bypass or a command injection. CISA and the write-ups differ.
- Whether CVE-2026-92707 has been exploited. One outlet says so; the catalogue does not list it.
- The provenance of the outlier report, which gives figures and identifiers nothing else corroborates.
- What the Claude attribution means in practice — which part of the finding was automated, and which was a person.`,
  },

  {
    slug: "ivanti-connect-secure-uta0576-a-patched-appliance-and-an-unpatched-link",
    title:
      "The appliance was fully patched when they got in, and one link in the chain still is not fixed",
    excerpt:
      "Volexity documented a three-stage zero-day chain against Ivanti Connect Secure. Two stages were patched on 13 October under one identifier. The third, a privilege escalation to root, is still open — and Ivanti's own integrity checker does not see any of it.",
    categorySlug: "security",
    tags: [
      "ivanti",
      "cve-2026-104935",
      "volexity",
      "uta0576",
      "zero-day",
      "vpn",
      "anti-forensics",
      "cisa-kev",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1554098415-4052459dc340${P}`,
    body: `**Volexity** has published an analysis of attacks on **Ivanti Connect Secure** by an actor it designates **UTA0576**, previously unknown to it. Ivanti released patches on **13 October** for **CVE-2026-104935**, and CISA added it to the exploited catalogue the same day with a **16 October** deadline.

The detail that frames everything else: Volexity began investigating on **5 October** and found the appliance **fully patched** and running the latest available build.

## Three links, two patched

The intrusion is a chain, and the identifier covers only part of it.

**One — authentication bypass.** Requests to a public login script could be routed to protected internal scripts using a particular HTTP header. Patched.

**Two — remote code execution.** A race condition in an upload handler let a script run before the handler deleted it. Patched.

**Three — privilege escalation.** A separate component in Ivanti Connect Secure is abused to run commands as **root**, and this is the link that is **not patched**. Volexity says Ivanti is working on a fix, to arrive in a future release.

So CVE-2026-104935 closes the front door and the hallway. The staircase is still there. That matters because a privilege escalation outlives the entry point it was paired with: any future bug that gets code running on the appliance can be chained to the same unpatched component to reach root.

## Nothing to find afterwards

The post-exploitation is the part defenders should read twice, because it is built to leave nothing behind.

Volexity found **no backdoor and no web shell**. Commands and their output travelled over the **exploit's own HTTPS requests** — the same channel used to break in. There is no implant to discover, no beacon to spot, no second connection to a strange address.

The anti-forensics are thorough: selective removal of individual entries from the debug and audit logs rather than wiping them, payloads that delete themselves, in-memory patches restored after use, command output suppressed, and a renamed copy of **tcpdump** disguised as a system daemon.

And the vendor's own tooling does not help. Volexity states that the **Integrity Checker does not detect any modifications** in this case, because the chain patches memory and restores configuration data, and that the tool **may not be able to identify device compromise**. Its guidance is that forensic investigation is required to find evidence of exploitation.

That is a hard message for anyone running these appliances. The reassurance mechanism returns a clean result on a compromised device.

## Why it is always the appliance

Edge appliances keep ending up in these stories, and the reasons are structural rather than coincidental.

They are the one device every remote user authenticates through, which makes credentials stolen there credentials for everything behind them. They run vendor-controlled operating systems that customers cannot inspect, so there is no endpoint agent watching and no familiar log to read. They are exempted from patch windows precisely because taking them down disconnects the workforce. And the diagnostic tooling a customer is given is written by the vendor, which is why the Integrity Checker result above is worth so little here.

The result is a class of device that is maximally exposed, minimally observable and slowest to update. An attacker choosing where to spend a zero-day is not picking at random.

## What they took

Once at root, the activity is credential-focused and fast: **LDAP credentials**, **LAPS passwords**, **BitLocker recovery keys**, Active Directory attributes that carry passwords, Kerberoasting tooling, password spraying, LDAP packet capture, and exfiltration of Active Directory and configuration data.

That is not reconnaissance for a later ransomware deployment in the usual shape. It is a sweep for the keys to everything the VPN fronts.

## Attribution, at Volexity's confidence

Two assessments, and Volexity is careful about both.

It assesses with **low confidence** that the motivation is criminal rather than espionage, based on the target.

It assesses with **medium confidence** that the actor uses **large language models for exploit development and post-exploitation**.

That second one is worth sitting with. It is the third operation this month where researchers have reported AI tooling inside an intrusion — [an access broker running agents beside Cobalt Strike](/article/cyberxero-the-third-operation-this-month-found-through-an-open-directory), the ARTEX campaign against South Korean finance, and now this. In every case the assessment is hedged, and in every case it is an inference from artefacts rather than an observation of a tool. The pattern is real and the evidence for each instance is thinner than the headlines.

## What to do

- Patch now. The deadline CISA set is **16 October**, and exploitation began on 3 October.
- Do not treat a clean Integrity Checker result as clearance. Volexity says plainly that it may not detect this.
- Assume credential compromise if the appliance was internet-facing before patching. Rotate LDAP service accounts, re-issue LAPS passwords, and treat BitLocker recovery keys as exposed.
- Hunt in your own network rather than only on the box. With no implant to find, the evidence is in what the stolen credentials did next.
- Watch for the privilege escalation fix and apply it when it ships. The chain is only two-thirds closed.

## What is not established

- How many organisations were affected. Volexity describes its investigation, not a count.
- Who UTA0576 is. The actor was previously unknown and the motivation assessment is low confidence.
- What role language models actually played, beyond a medium-confidence assessment.
- Whether the activity observed completed successfully. Volexity notes the extent of each operation is not fully established.
- When the privilege escalation will be fixed.`,
  },

  {
    slug: "irhythm-told-the-sec-in-june-and-told-patients-in-october",
    title:
      "The company told the SEC in June and started telling patients in October",
    excerpt:
      "iRhythm filed a material cybersecurity incident disclosure in June after attackers downloaded patient data and demanded payment. Notifications began on 2 October. Four months on, the only public measure of scale is state-by-state regulatory filings, and they do not agree.",
    categorySlug: "world",
    tags: [
      "irhythm",
      "data-breach",
      "healthcare",
      "sec-disclosure",
      "breach-notification",
      "extortion",
      "medical-devices",
      "regulation",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1770836037704-44bd8c7b6978${P}`,
    body: `**iRhythm** makes wearable cardiac monitors. In June it told the **Securities and Exchange Commission** that it had been breached. On **2 October** it began telling the patients.

## The June filing

The company filed an **8-K** under Item 1.05, the rule requiring disclosure of material cybersecurity incidents.

The sequence in the filing is tight. Unauthorised activity on **8 June**. Contact from the threat actor on **9 June**. On **10 June**, the company determined the incident was **material in light of the volume of the potentially affected data**.

Data was accessed and downloaded from **third-party-hosted business applications** between **3 and 8 June**. The actor demanded payment in exchange for not disclosing it. iRhythm has not said whether it paid.

Read the materiality sentence again, because it does a lot of work. On 10 June the company knew enough about the **volume** to call the incident material to investors. Patient notification began on 2 October.

## Four months

The stated reason for the four-month gap is the completion of a forensic investigation, and that is a real constraint rather than an excuse. Establishing which individuals are in a dataset pulled from multiple business applications is genuinely slow, and notifying the wrong people is its own harm.

But the two audiences got very different service. Investors were told in two days, on the basis of volume. Patients were told in sixteen weeks, on the basis of certainty.

That asymmetry is written into the rules rather than into this company. Securities disclosure is triggered by materiality to the business and runs on a four-day clock. Health breach notification is triggered by identification of individuals and runs on a sixty-day clock from discovery, with the usual arguments about when discovery is complete. Both were probably followed. The patient still finds out last.

## The number nobody has published

iRhythm has not released a company-wide total.

What exists instead is state regulatory filings, and they have to be assembled by hand:

- **Texas: 298,647**
- **South Carolina: 69,526**

Those two states alone come to **368,173**. One trade outlet describes the breach as affecting "at least 360,000". A separate aggregation of regulatory filings arrives at **8,179,772** nationwide — a figure the company has not confirmed and which comes from a tracker rather than a disclosure.

Between 368,000 confirmed in two states and an unconfirmed 8.2 million nationwide there is an enormous amount of room, and the only party able to close it is the one that has not.

This is the third time in a fortnight we have had to write a paragraph like this. [A university breach where the headline number was the size of the database](/article/dtu-breach-200000-is-the-size-of-the-database-not-the-victim-count), [a ransomware quarter where nine in ten entries were unverified claims](/article/comparitech-q3-2026-the-record-is-2627-claimed-and-247-confirmed), and now a count that exists only as a sum of state filings. The scale of a breach is routinely the least reliable fact reported about it.

## The data was not on iRhythm's systems

One line in the filing is easy to read past: the data was taken from **third-party-hosted business applications**.

So this is not a breach of a medical device company's clinical systems. It is a breach of software iRhythm buys, holding data iRhythm put there — which is why the company can say its products, device systems and manufacturing were unaffected and be entirely accurate while hundreds of thousands of patient records are gone.

Two things follow. The first is that the organisation naming the incident is not necessarily the organisation that was broken into, and the public record will carry iRhythm's name rather than the vendor's. The second is that other customers of the same applications may be in the same position and may not know, because nothing obliges the party in the middle to say which product it was.

Neither the filing nor the notification names the applications.

## What was taken, and what that is worth

Names, contact details, dates of birth, **insurance numbers**, **device serial numbers** and dates of service. The company says it does not store individual financial account or payment card data.

The device serial number is the unusual entry. Combined with a name and a date of service, it identifies not just a person but a person who wore a cardiac monitor on a particular date — which is a medical fact about them, inferable without any clinical record being taken.

iRhythm says it has no evidence the information has been or will be used to commit identity theft, and that the incident did not affect its products, medical device systems, manufacturing or patient safety.

## What to do

- If you have worn one of these monitors, the exposure to act on is **targeted phishing**. Someone with your name, date of birth, insurance number and date of service can sound exactly like the clinic.
- Insurance numbers are the item to watch for medical identity fraud, which shows up as claims rather than as credit activity.
- For anyone running breach response: the gap between what you can tell investors and what you can tell affected people is a reputational problem even when both timelines are lawful. Saying publicly why the second is slower costs nothing.

## What is not established

- How many people were affected in total. The company has published no figure.
- Whether the 8.2 million aggregation is accurate.
- Whether a ransom was paid.
- Who the attackers were.
- Which third-party applications were involved, and whether other customers of those applications were affected.`,
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
