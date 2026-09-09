/**
 * Drafts the 9 September batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-62.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-62.ts --update
 *
 *   1. FreeIPA. Two flaws that are unremarkable alone and devastating together:
 *      an ACI that lets unauthenticated users write their own OTP token, and a
 *      directory-server ownership check that compares names as plain text, so
 *      an anonymous client's empty name matches an empty stored value. Carries
 *      the Anthropic disclosure, because one of the three CVEs was reported by
 *      a firm working with Anthropic and Anthropic makes the model this site is
 *      written with.
 *   2. BengalSEO. The attribution here is unusually strong — commit-history
 *      email addresses across 84 GitHub accounts — which is worth saying
 *      plainly, since this site spends most of its time downgrading weak
 *      attribution.
 *   3. The APIS leak. 220 million is travel records, not travellers, and the
 *      cluster was not an open database: it answered 401 on the front door and
 *      fell to default credentials on a second path.
 *
 * Covers checked at full size.
 *
 * No backticks and no angle brackets in the bodies: inline code spans and
 * anything shaped like a JSX tag break the MDX parse.
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
    slug: "freeipa-anonymous-client-passes-the-ownership-check-by-being-nobody",
    title: "The anonymous client passes the ownership check by being nobody",
    excerpt:
      "Two flaws in FreeIPA and 389 Directory Server are unremarkable on their own. Together they let an unauthenticated client write a token entry with blank ownership, satisfy the check for whether it owns that entry, and attach a Kerberos identity with administrative group membership. Nobody has published how to tell whether it already happened to you.",
    categorySlug: "security",
    tags: ["freeipa", "389-directory-server", "identity", "kerberos", "ldap", "cve-2026-76578", "disclosure"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1658479657379-e0adb7cb91e8${P}`,
    body: `**Disclosure: this site is written with Claude, which is made by Anthropic. One of the three vulnerabilities below was reported by a firm working with Anthropic.** Read the credit lines knowing that.

On **8 September 2026**, three vulnerabilities were disclosed across **FreeIPA** and **389 Directory Server**:

- **CVE-2026-76578** — FreeIPA, critical, **CVSS 9.8** (preliminary)
- **CVE-2026-76560** — 389 Directory Server, **7.5**
- **CVE-2026-79678** — FreeIPA idp-add, important, **8.1**

FreeIPA is what decides who may log in across a Linux domain. It keeps every identity in a 389 Directory Server database reached over LDAP, and Red Hat ships it as Identity Management.

So this is not a flaw in an application. It is a flaw in the thing the applications ask.

## Two bugs that are only dangerous together

Take them separately first, because separately neither looks like much.

**In FreeIPA**, there is an access control instruction permitting **unauthenticated users to manage their own one-time-password token**. That sounds reasonable — enrolling a token is something you do before you have credentials. The rule does not restrict what else can be written alongside it.

**In 389 Directory Server**, the access rule that enforces "only the authenticated owner of this entry may modify it" compares names **as plain text**.

Now put them together.

An unauthenticated client has an **empty name**. The entry it just created has an **empty stored owner**. The check compares one against the other, finds them equal, and permits the write.

The attacker passes the ownership test by being nobody. The empty string is the empty string.

From there the same write attaches a **Kerberos identity and a password** to the entry, and puts it in an **administrative group**. An anonymous client with no login history now has domain credentials it can reuse.

That is a very elegant bug, and elegant is exactly the wrong thing for it to be.

## What "anonymous" means here

Worth being precise, because the word does a lot of work.

It does not mean an attacker who guessed a password, or one with a low-privilege account, or one who phished a user. It means a client that has never authenticated, has no account, and has no login history — reaching the directory service over the network.

The only precondition is being able to talk to it. That is what makes this a 9.8 rather than a 7.

## The patch matrix has holes in it

Upstream FreeIPA is fixed in **4.13.4**, and the chain was reproduced on **4.13.1**. Which earlier versions are affected has not been stated.

Downstream, as of disclosure:

| Component | Status |
|---|---|
| FreeIPA upstream | fixed in 4.13.4 |
| 389-ds on RHEL 10 | 3.2.0-10.el10_2, via RHSA-2026:64785 |
| 389-ds on RHEL 9 | not listed |
| 389-ds on Fedora | in testing |
| ipa packages on RHEL | not listed |

If you run Red Hat Identity Management on RHEL 9, there is currently nothing to install for either half.

And nobody has published whether the **389-ds update alone** stops the attack on a host still running an outdated ipa package. That is the single most useful question for anyone in the middle of this, and it is open.

## The question nobody has answered

Patching closes the door. It does not tell you whether somebody already came through it.

The attack **creates an identity**. An identity created before the patch survives the patch, because it is now a legitimate row in your directory with legitimate administrative group membership. There is nothing structurally wrong with it any more.

No detection rules have been published. No indicators of compromise have been published. No guidance exists on whether patching removes attacker-created entries or how an administrator would find them.

So for an identity system — the one place where "who is allowed in" is the entire product — the state of the art this week is: install the update, and hope.

[The pattern is familiar from the Entra ID flaw earlier this month](/article/entra-id-cve-2026-69836-cvss-10-no-action-for-users-to-take), where the severity was maximal and the customer-side action was nothing. Here there is something to install, and still nothing to look for.

## Credit, and the disclosure

**Gia Bui of Calif** reported the FreeIPA chain and the directory-server flaw. **Calif, working with Anthropic**, reported the idp-add vulnerability.

That second credit is why the disclosure sits at the top of this article. Anthropic makes the model this site is written with, so a piece that praises research Anthropic contributed to is not a neutral document, and you should be able to see that rather than work it out.

For what it is worth, the finding stands on its own: two access rules that each look defensible, combining into anonymous domain administration, is good work regardless of who paid for it.

## What to do

- **Update FreeIPA to 4.13.4** where you run it upstream.
- **Apply RHSA-2026:64785 on RHEL 10.** On RHEL 9 and Fedora, watch for it — there is nothing yet.
- **Do not assume the 389-ds fix alone is sufficient** if your ipa packages are behind. Nobody has confirmed that either way.
- **Audit your administrative groups by hand.** Not for indicators, because there are none — for members you cannot account for. This is the only detection available.
- **Check for OTP token entries with empty or unexpected ownership**, which is the artefact the chain leaves behind.
- **Restrict who can reach the directory service on the network.** The precondition is reachability, so that is the compensating control.

## What is not established

- **Which versions before 4.13.1 are affected.** Not stated.
- **Whether 389-ds updates alone stop the attack** on outdated ipa packages.
- **Whether patching removes attacker-created identities**, or how to find them.
- **Any indicator of compromise or detection rule.** None published.
- **Whether it has been exploited.** None of the advisories or bug reports describe a real attack.`,
  },
  {
    slug: "bengalseo-attribution-came-from-github-commit-emails",
    title: "The attribution came from commit emails across 84 GitHub accounts",
    excerpt:
      "The DFIR Report traced a decade-old Bing poisoning operation — fake activation portals, tech support scams, a custom bot and a Monero miner — to two named companies in Rajasthan, using email addresses left in GitHub commit history. That is a far stronger evidentiary chain than most attribution, and it is worth saying so.",
    categorySlug: "security",
    tags: ["seo-poisoning", "bing", "tech-support-scam", "mayabot", "xmrig", "attribution", "dfir-report"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1762330471769-47ffee22607f${P}`,
    body: `The DFIR Report has documented **BengalSEO**, a financially motivated operation running since at least **2015** that poisons **Bing** search results to deliver tech support scams and malware. It found the campaign in **March 2026** and published in **August**.

The mechanics are ordinary black-hat SEO: backlinks, keyword stuffing, forums flooded with links, DOM injection, and **DOM shuffling** — randomising a page's HTML structure with JavaScript so that detection built on structural fingerprints stops matching. One Vizio setup page had **2,000 backlinks from 167 unique external domains** pointed at it.

What arrives at the other end is a fake activation portal impersonating a streaming service, an antivirus product, gaming software or a tax utility. Some redirect to a contact page telling the visitor to phone a number about fraudulent account activity. Others deliver **MayaBot**, a custom implant in use since **2022** that handles command and control, monitors the system, and drops the **XMRig** Monero miner.

## The part worth dwelling on is the attribution

This site spends most of its time doing the opposite of this. Last week it was pointing out that Chinese-language artifacts in source code tell you about a developer and not an operator, and that three threat clusters cited for three components is a sign of shared tooling rather than confident attribution.

So consistency requires saying the reverse when the evidence is good. Here it is good.

The DFIR Report links the operation to two entities: **WeConnect Solutions LLC** (formerly iConnect Soft Solutions LLC) and **Garage2Global**, based in **Rajasthan, India**, the latter publicly advertising website design and SEO services.

The link is not inferred from language, timezone or tooling overlap. It is **email addresses in GitHub commit history**, matching Garage2Global domains, across **84 GitHub accounts** identified between January 2024 and March 2026. Account names include activate-uhc-com-ucard, capitalonecredit and help-line-center; associated addresses end in @wc.ci or are Gmail addresses containing "g2g".

Commit metadata is written by the developer's own git configuration. It is not a behavioural signal that requires interpretation — it is a name somebody typed once and then forgot was being recorded, repeated across dozens of accounts over two years. That is about as direct as public-source attribution gets.

Neither company appears to have responded, and no law enforcement action has been reported.

## Why Bing, and an honest guess

Nothing in the reporting explains why Bing rather than Google, and it is the most interesting unanswered question here.

The obvious inference — and it is an inference, not a finding — is that Bing is the default search engine in Edge and in Windows, which is where a tech support scam finds people who will actually pick up the phone, and that its spam defences have historically had less adversarial pressure applied to them than Google's. Neither half of that is established by the report, so treat it as reasoning rather than evidence.

Microsoft has not commented.

## Ten years is the other number

An operation running since **2015**, with a custom implant since **2022**, an infrastructure surge around **August 2025**, and activity continuing into 2026.

Ten years of the same business model, and it is a business model — the tracking domain **stats.us3[.]org** returns **1,112** urlscan.io results, which is what deliberate campaign measurement looks like. This is not opportunistic. Somebody was watching conversion rates.

[The EtherHiding campaign we covered this week](/article/etherhiding-on-a-free-testnet-bulletproof-hosting-at-zero-cost) is the same shape from the other direction: compromise the path a person takes to find something, and you never have to break into anything.

## Indicators

Payload delivery: **ustechnio[.]com**, **tax.dll[.]lat**, **u320[.]my**, **reficon[.]pro**, **pltechoo[.]pro**

Tracking: **stats.us3[.]org**

Example poisoned query: a search for "bitdefender central how to login" redirecting to a fraudulent readthedocs[.]io page.

## What to do

- **Block the domains above** and search historic DNS for them.
- **Treat search results as untrusted input for support and activation pages.** The lure works because the victim went looking. Type vendor domains rather than searching for them.
- **Tell your users the shape of it**, not the domains: a real vendor never asks you to call a number displayed on a page you found in search results.
- **Watch for XMRig**, which is the noisiest thing in this chain and the easiest to catch.
- **If you run a forum or accept user-generated content, you are infrastructure here.** Link spam is a delivery mechanism, not a nuisance.

## What is not established

- **Initial access to the poisoned sites.** The mechanism is not described.
- **Why Bing specifically.**
- **Whether the operation is currently disrupted.**
- **Any law enforcement action.**
- **A response from either named company.**`,
  },
  {
    slug: "220-million-apis-records-is-travel-records-not-travellers",
    title: "220 million is travel records, not travellers. The passport numbers are real either way",
    excerpt:
      "Kinryū Labs found an Elasticsearch cluster holding nine years of Advance Passenger Information: names, dates of birth, nationalities, passport numbers and expiry dates, flight and seat details. It was not an open database — the front door returned 401, and a second path answered to default credentials.",
    categorySlug: "security",
    tags: ["apis", "aviation", "breach", "elasticsearch", "passports", "vietnam", "privacy"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1664190426381-5f2cf0ea4ef4${P}`,
    body: `On **3 June 2026**, while surveying exposed databases during ransomware research, **Kinryū Labs** found an Elasticsearch cluster holding **Advance Passenger Information**.

APIS is the data airlines are required to send to a government before passengers and crew arrive or depart. Not data you agreed to share — data your airline is obliged to hand over so that you can be permitted to fly.

The cluster held **210,318,069 passenger records** and **10,465,631 crew records** across **29 indices**, about **107 GB**, spanning **January 2017 to April 2026**.

## The number first, because it will be misused

**220,783,700 is a count of travel records, not of people.**

One person who flew twelve times is twelve records. A crew member is a record per rotation. Nobody has published a distinct-person figure and it would be far smaller than the headline, though still very large.

Kinryū Labs says this plainly. It will be dropped within a news cycle, and "220 million travellers exposed" is the sentence that will circulate instead.

## What was in each record

Names, dates of birth, sex, nationalities. **Passport or travel-document numbers with expiry dates and issuing countries.** Flight numbers and dates, airline, departure, destination and transit airports, seat assignments, baggage references, and scheduled, estimated and actual times.

That is a complete identity document plus a nine-year movement history. [It is the same category of harm as the licence scans sold through Nexus last week](/article/idscan-nexus-infrared-ultraviolet-copies-traced-the-scans) — a government-issued number you cannot rotate, attached to a person who never chose the system holding it.

The travel history is the part that is different, and worse in a specific way. Where somebody was, on which date, sitting next to whom, is not identity theft material. It is targeting material.

## It was not an open Elasticsearch

This is the detail that separates it from the usual story, and it deserves care.

The endpoint returned **HTTP 401 Unauthorized** when accessed directly. The front door was locked.

The researchers reached the data through **a cloud-based path using default credentials**.

So the failure was not somebody putting a database on the internet with no password. It was a second route to the same data, secured with credentials that shipped in the box. That is a much more common failure and a much harder one to find, because every external scan of the primary endpoint comes back clean.

Nobody has established when that second path became reachable.

## Whose it is, and who answered

The cluster was hosted in **Viettel-assigned IP space in Hanoi**, which points to Vietnamese operation. Which Vietnamese organisation ran it has **not been confirmed** — BleepingComputer could not establish it.

Vietnamese authorities were contacted in advance and **did not respond**.

**Singapore Airlines** coordinated the response. **Changi Airport Group** investigated and declined to comment. Access was **remediated on 8 June**, five days after discovery.

Read that list again. The data is passenger information collected under one government's border requirements, and the people who actually did something about it were an airline and an airport in a different country.

## Whether anyone took it is unknowable

No ransom notes. No suspicious indices. No sign of tampering.

Also no server logs, which means Kinryū Labs could not determine whether anyone had copied the data, and neither can anybody else. "No evidence of exfiltration" here means "no evidence either way", and those are very different sentences that get printed identically.

## What to do

This is another section where honesty means admitting individuals have almost nothing.

- **You cannot check whether you are in it**, and no notification scheme covers this. APIS data has no consumer-facing controller to ask.
- **A passport number is not a secret you can change on demand.** If yours is close to expiry, renewing rotates the number — that is the only lever, and it is a slow and expensive one.
- **Be alert to travel-themed phishing that knows your itinerary.** A message quoting a real past flight, seat and date is far more convincing than the usual attempt, and this dataset supports exactly that.
- **If you operate an Elasticsearch cluster, enumerate every path to it**, not just the one your scanner tests. The front door here was fine.
- **Change default credentials on management and cloud access paths.** That is the actual finding, under the headline number.

## What is not established

- **Which organisation operated the cluster.** Not confirmed.
- **How many distinct people are represented.** Only the record count is published.
- **When the second access path became exploitable.**
- **Whether the data was copied, sold or ransomed.** No logs survive to say.
- **Whether Vietnamese authorities have taken any action.** No response was received.`,
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
