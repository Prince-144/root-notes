/**
 * Long-form drafts — 28 August 2026.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts picks one paragraph per section
 * by score — standalone digits and length win, opening on a back-reference
 * loses. The paragraph that answers each heading is written to win.
 *
 * Numbers note on the McKesson piece: the 284 million figure will be reported
 * everywhere as patients. It is not, and the correction comes from the group
 * making the claim — they say it counts records, not people. That distinction
 * is the article.
 *
 * Shared-thesis note: the Gitea and GiveWP pieces are separate because readers
 * search by product, but they share one observation — an advisory saying
 * "authenticated" means nothing when anyone can register. It is argued in the
 * Gitea piece and referenced from the GiveWP one rather than written twice.
 *
 * Cover note: all three downloaded and viewed. Nothing legible beyond currency
 * denomination on a banknote, nobody identifiable, no company implicated.
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
    slug: "mckesson-284-million-records-is-not-284-million-people",
    title:
      "It is not 284 million patients — and the people who stole the data are the ones saying so",
    excerpt:
      "McKesson has confirmed a breach involving third-party applications. ShinyHunters claims a terabyte and 284 million records including Social Security numbers and medical histories, and demanded $55.236 million. The group has also clarified that the figure counts records, not individuals. Nobody knows how many people are affected, including them.",
    categorySlug: "security",
    tags: [
      "mckesson",
      "shinyhunters",
      "healthcare",
      "data-breach",
      "extortion",
      "okta",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1776900976077-f90f854e0f69${P}`,
    body: `**McKesson**, one of the largest pharmaceutical distributors in the world, discovered a breach on **25 August 2026** and disclosed it three days later. Its statement is that the incident involved **third-party applications** and the unauthorised access and exfiltration of data.

It has not said which applications, or what data.

**ShinyHunters** has said a great deal more, and the most useful thing the group has said is a correction.

## The number, and what it actually counts

The claim is roughly **1 terabyte** and about **284 million records**, taken between **21 and 25 August**.

Every headline will render that as 284 million patients. ShinyHunters has clarified that the figure counts **records or lines, not unique individuals**.

That is not a quibble. A single patient generates a row for each prescription, each appointment, each allergy, each physician association. One person with a chronic condition can account for dozens of records across a decade. **Nobody currently knows how many people are in that data — including the group that took it.**

When the party with every incentive to inflate a number volunteers that the number means less than it appears to, the rest of us have no excuse for reporting it the other way.

## What is claimed to be in it

Per ShinyHunters: names, addresses, dates of birth, **Social Security numbers**, patient IDs, phone numbers, email addresses, **Medicaid numbers**, medical record numbers, medication and allergy information, illnesses, disabilities, appointment information and physician information.

If accurate, that is the most sensitive combination available — identity documents plus clinical history. Social Security numbers do not rotate. A medication list is a diagnosis by inference.

McKesson has not confirmed any of it. **BleepingComputer has not independently verified the claims**, and the company has not disclosed what was taken.

## The route in, as claimed

ShinyHunters says the compromise involved **Okta** single sign-on accounts, which gave access to **Salesforce** and **Snowflake** environments.

That is the same shape as [the ReliaQuest incident earlier this week, where the same group phoned employees, took one identity and reached an Okta dashboard](/article/reliaquest-shinyhunters-vishing-okta-dashboard-view-only) — except there, authorisation held and the attackers were denied at every application.

Here, on the group's account, it did not. One identity provider, two data platforms behind it, and the thing that decides the outcome is what sits between them.

## The ransom figure is a technique

**$55.236 million**, within **72 hours**.

Nobody arrives at that by valuing anything. A precise-looking figure implies a calculation has been done, which implies the demand is considered rather than arbitrary, which makes it feel negotiable in a way that fifty million does not. The deadline does the rest.

It is worth naming because the same reflex applies to the volume claims. Precision reads as credibility, and here the precision is decoration.

## The pattern this week

Three incidents, three different relationships between claim and evidence:

| Case | Claim | Evidence |
| --- | --- | --- |
| McKesson | Detailed, from the attacker | Company confirms a breach, not the contents |
| [Berlin](/article/berlin-refuses-to-pay-rhysida-only-attacker-numbers) | Detailed, from the attacker | Government publishes no figures at all |
| [Boston Scientific](/article/boston-scientific-cannot-ship-orders-what-is-not-known) | None — nobody claimed it | Company confirms serious disruption |

In two of the three, the only numbers in public come from the people who benefit from the numbers being large.

## What to do if you are a patient

Realistically, nothing yet — and be wary of anyone who tells you otherwise this week.

- **Do not act on emails about this breach.** Notification fraud follows disclosure faster than actual notification does.
- **A credit freeze is the one useful step** if Social Security numbers were genuinely involved, and it is free.
- **Wait for McKesson's own notification** for the scope. The attacker's inventory is not it.

## What is not established

- **How many people are affected.** Not known to anyone, including ShinyHunters.
- **Which third-party applications** were involved. McKesson has not said.
- **What data was actually taken**, as opposed to claimed.
- **Whether the Okta, Salesforce and Snowflake account is accurate.**
- **Whether McKesson will pay.** No public statement.`,
  },
  {
    slug: "gitea-cve-2026-60004-authenticated-means-nothing",
    title:
      "8,393 Gitea servers are exposed, and the flaw needs an account anyone can make",
    excerpt:
      "CVE-2026-60004 lets a user with ordinary write access to a repository run shell commands as the Gitea system user. That reads as an authenticated flaw until you notice that Gitea ships with open registration, so a visitor can sign up, create a repository, and qualify. The fix has been out since 27 July. Miners are already running.",
    categorySlug: "security",
    tags: [
      "gitea",
      "cisa-kev",
      "exploitation",
      "self-hosted",
      "cryptomining",
      "shadowserver",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1631375937044-6dd5beac01d2${P}`,
    body: `**Shadowserver** counted **8,393** internet-facing Gitea instances still vulnerable to **CVE-2026-60004** on **27 August 2026**.

The fix shipped in **1.27.1** on **27 July**. That is a month.

## The word doing the damage is "authenticated"

The vulnerability is a code injection reachable through the **diffpatch** API endpoint. In the researchers' description, an attacker with ordinary write access to a repository can execute arbitrary shell commands as the **Gitea OS user**.

Read on its own, that is a post-authentication bug, and post-authentication bugs get triaged accordingly — you need an account, so the blast radius is your own users.

Then read the next sentence: with **default open registration**, an unauthenticated visitor can obtain the required write access by registering an account and creating a repository.

Registration is open by default. So the precondition is: be a person with a web browser.

## Why this keeps happening

"Authenticated" is doing two different jobs in security advisories, and only one of them is honest.

Where obtaining an account is genuinely hard — an internal system, an approved-domain SSO, an invite — it meaningfully reduces exposure. Where the product ships a public sign-up form, it reduces nothing, and describing the flaw as authenticated actively misleads the person deciding what to patch this week.

The same thing happens in [the GiveWP donation plugin patched this week](/article/givewp-cve-2026-82222-unserialize-registration-disabled), where an unauthenticated registration action creates accounts even on sites that turned registration off. Different product, same category error: the barrier that makes "authenticated" meaningful was never there.

This site made the same point about [Citrix describing an unauthenticated RCE as a denial-of-service issue](/article/citrix-cve-2026-8452-advisory-said-dos-it-is-rce). The engineering was fine in all three cases. The sentence was the problem.

## What is being done with it

Attackers are deploying **cryptocurrency mining** malware on unpatched servers.

That is worth sitting with rather than dismissing as low-severity. Mining is what you deploy when you have code execution and no better idea yet — it monetises access immediately while costing nothing to abandon. The access itself is the same access that would let someone modify a repository, and a Gitea instance holds an organisation's source code and CI credentials.

Nobody has reported the second thing yet. That does not mean the first is the ceiling.

**CISA** added the flaw to its Known Exploited Vulnerabilities catalog on **26 August**, with a federal deadline of **28 August** — three days, which is now the routine interval for this catalog.

## What to do

- **Upgrade to 1.27.1 or later.** It has been available since 27 July.
- **Turn off open registration** unless you have a specific reason for it. This is the setting that converts an authenticated flaw into an internet-facing one.
- **Check for miners** — sustained CPU on a git server is not subtle, and it is the observed payload.
- **Then check the repositories**, not just the host. Code execution as the Gitea user is code execution over what Gitea stores.
- **Rotate CI tokens and deploy keys** held on the instance if you find anything.
- **Get it off the public internet.** Self-hosted git is usually reachable because it was easier, not because it needed to be.

## What is not established

- **The CVSS score.** Not published.
- **Who is exploiting it.** No attribution.
- **How many of the 8,393 have been compromised**, as distinct from being vulnerable.
- **Whether anything beyond mining** has been deployed.`,
  },
  {
    slug: "givewp-cve-2026-82222-unserialize-registration-disabled",
    title:
      "The donation plugin lets strangers register on sites where registration is off — then run commands",
    excerpt:
      "CVE-2026-82222 in GiveWP chains three weaknesses into unauthenticated command execution on the hosting server: an unsafe PHP unserialize helper, a donation flow that stores attacker-controlled objects, and a gadget chain in bundled libraries. Over 100,000 sites run it, and most of them belong to organisations with no security budget.",
    categorySlug: "security",
    tags: [
      "wordpress",
      "givewp",
      "php",
      "deserialization",
      "nonprofits",
      "patchstack",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1783227610905-fda5920a9eab${P}`,
    body: `**CVE-2026-82222** is a maximum-severity flaw in **GiveWP**, a WordPress donation plugin with more than **100,000** installations. It gives an unauthenticated attacker arbitrary command execution on the hosting server.

Versions up to **4.16.7.1** are affected. **4.16.7.2**, released **27 August 2026**, fixes it. It was reported on **28 July** by **Udin Chan** through **Patchstack**.

## Three weaknesses, one outcome

None of the three would do much alone:

1. **An unsafe helper that unserialises PHP data** — the classic sink.
2. **A donation-processing flow that stores attacker-controlled serialised objects** — the source, reachable by anyone making a donation.
3. **A gadget chain in libraries bundled with the plugin** that can invoke arbitrary system commands — the thing that turns deserialisation into execution.

That is the standard PHP object injection shape, and it is the **second unserialise story this week**. The [Kaltura mwEmbed flaws](/article/kaltura-mwembed-unserialize-eleven-years-unpatched) were also an unvalidated unserialise, in a call that had sat byte-identical since 2015.

PHP's unserialize on untrusted input has been known-dangerous for well over a decade. It persists because the sink is convenient, the source is often several files away, and the gadget chain usually lives in a dependency nobody on the project chose.

## The detail that makes it unauthenticated

Exploitation normally requires an account. GiveWP supplies one.

An unauthenticated registration action — **give_action=user_register** — creates accounts **even on sites where registration is disabled**.

So an administrator who turned off user registration, reasonably believing that closed the door, still has it open. The setting in the WordPress admin and the behaviour of the plugin are two different things, and only one of them is enforced.

This is the same failure as [the Gitea flaw this week, where an "authenticated" bug is reachable by anyone because registration is open by default](/article/gitea-cve-2026-60004-authenticated-means-nothing). There, the door was open by design. Here it is open despite being shut.

## Who actually runs this

GiveWP is a donation plugin. Its install base is charities, religious organisations, community groups, mutual aid funds, small nonprofits.

That population has the least capacity to respond of anyone in the WordPress ecosystem: no security staff, often no maintenance contract, frequently a volunteer who built the site years ago and moved on. And the plugin sits directly in the payment flow, which is where the useful data is.

It is worth being blunt that the standard advice — patch promptly, monitor, have a response plan — assumes an organisation that does not exist here.

## What to do

- **Update to 4.16.7.2 immediately.** It is the whole fix.
- **Check your user list** for accounts you did not expect, particularly recent ones, and particularly if you believe registration is disabled.
- **Look for unexpected files** in the WordPress directory and for scheduled tasks you did not create.
- **If you run a site for an organisation that cannot maintain it, turn on automatic plugin updates.** The risk of an update breaking something is smaller than this.
- **Rotate database credentials and any payment API keys** if you find evidence of access.

## What is not established

- **The CVSS numeric score.** Not published.
- **Whether it is being exploited.** No in-the-wild activity reported.
- **How many of the 100,000-plus installations have updated.**
- **Which bundled library supplies the gadget chain.**
- **Whether the affected condition applies to every configuration**, or only some.`,
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
