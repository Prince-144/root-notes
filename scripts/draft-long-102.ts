/**
 * Drafts the second 14 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-102.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-102.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-102.ts --update
 *
 *   1. SlugFest (security). npm's Trusted Publishing identified repositories
 *      by name rather than by their permanent id, so a name somebody gave up
 *      could be claimed and used to publish to an existing package.
 *   2. MarkLogic (security). Thirty-one flaws, and a patch that deliberately
 *      removes access customers are using — because that access was never
 *      correct. No workaround, and the 12.0 line has no fix at all.
 *   3. P7 DarkSword (security). What happens after an exploit chain is
 *      disclosed and its source leaks: it stops being espionage and starts
 *      arriving in adverts.
 *
 * Primary sources: GitHub's changelog entry of 2 October and Bloom Security's
 * research as reported, Progress's October bulletin as reported, and iVerify's
 * P7 research as reported.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - SlugFest: an editor with a repository file tree, which is the thing
 *     being named.
 *   - MarkLogic: server rack components, for an enterprise database.
 *   - P7: a phone in a hand, which is the device.
 *
 * Rejected on the way: a "database server" search that returned a parking
 * garage, a whale skeleton and a staircase.
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
    slug: "slugfest-npm-trusted-publishing-checked-the-name-not-the-id",
    title:
      "npm checked the repository's name, and a name is something somebody else can claim",
    excerpt:
      "Trusted Publishing was the thing everyone was told to adopt because it removes long-lived tokens. It verified publishers by GitHub repository name rather than by the repository's permanent id, so a renamed or deleted repo could be taken over and used to publish to an existing package.",
    categorySlug: "security",
    tags: [
      "npm",
      "slugfest",
      "trusted-publishing",
      "supply-chain",
      "github-actions",
      "bloom-security",
      "package-registry",
      "open-source",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1724166551426-77aa7328d053${P}`,
    body: `**Trusted Publishing** is the good advice. Instead of keeping a long-lived npm token in a secret store where it can be stolen, a package trusts a specific GitHub repository, and a workflow in that repository gets a short-lived credential when it publishes. No token to leak.

Researchers at **Bloom Security** found that npm was identifying that repository by its **name**.

## Names are not identifiers

A GitHub repository has a permanent numeric id and a human-readable name. The id never changes. The name is a label the owner can rename, transfer, or release by deleting the repository — and once released, **anyone can take it**.

npm's Trusted Publishing checked the name.

So the attack is: find a package whose trusted publisher points at a repository that has been renamed, transferred away, or deleted. Create a repository with that old name. Add a GitHub Actions workflow matching what the trust relationship expects. Publish.

Claiming a released repository name this way yields a valid publishing credential for **somebody else's existing npm package**, obtained without stealing a single maintainer credential. Nothing was phished and no token leaked. The trust relationship simply pointed at a label, and the label had changed hands.

The researchers call it **SlugFest**.

## What it could and could not do

Precision matters here because the headline reads worse in one direction and better in another.

It could not create new packages under someone else's name. It could **publish new versions of existing packages** — which is worse, because an existing package has installs, a dependency graph, and automation that will fetch the new version without anyone looking at it.

More than **1,500 packages** configured for Trusted Publishing were exposed, with over **10 million combined downloads**.

Bloom reports no observed exploitation in the wild, and confirmed the technique worked under its own controlled test. Whether anyone used it before the fix is unknown and, given the mechanism leaves no trace of theft, may stay unknown.

## This is the dangling-pointer problem again

A name that outlives the thing it pointed at is a pattern this site keeps arriving at from different directions. [A DNS record left pointing at infrastructure nobody owns any more is the version that gets written about most](/article/dangling-dns-subdomain-takeover-silent-push), and it is the same failure: a reference held by label rather than by identity, and a label that can be re-registered.

The uncomfortable part is where it turned up. Trusted Publishing exists **because** credentials get stolen; it is the hardened replacement. The flaw was not in the thing security people warned about. It was in the thing they recommended instead.

That is not an argument against adopting it. It is an argument for reading what a new trust mechanism actually trusts.

## The binding breaks at the moment nobody is looking

Think about when a repository gets renamed, transferred or deleted.

A maintainer hands a project to somebody else. A company is acquired and its repositories move into a new organisation. A team restructures and tidies its namespace. Somebody archives a side project from four years ago and deletes it.

Every one of those is a moment when the publishing trust relationship is the last thing anybody checks, and several of them are moments when the person who now owns the package was not there when the binding was made. They inherited a package that trusts a name they have never heard of.

That is why the exposure is not a handful of careless maintainers. It is the ordinary lifecycle of open-source projects, applied to a mechanism that assumed names are stable.

## The fix, and what it does not cover

GitHub's change, published on **2 October**: an unvalidated Trusted Publishing configuration now **expires 48 hours after creation** and can no longer authorise publishing. A configuration stops expiring once it has successfully published at least once. If yours expires, recreate it for a fresh window.

npm also now rejects Trusted Publishing tokens from GitHub Actions **issue_comment** events, alongside the existing restriction on pull_request_target.

The limit is in the word "new". The expiry closes the window for configurations created from now on. It does not retroactively re-bind the ones that already exist, and GitHub's statement does not say whether configurations that had already published were bound to a repository id after the change.

So maintainers still have to check their own.

## What to do

- Run **npm trust list** for your packages and confirm every repository listed still resolves to one you control.
- If a repository has been **renamed, transferred, or had its owner change**, delete the trust binding and create it again. The old one may be pointing at a name you no longer hold.
- Before deleting a repository that publishes a package, remove its Trusted Publisher configuration first. Deleting the repo releases the name while the trust relationship is still live.
- If you maintain something with meaningful install counts, this is worth doing today rather than at the next audit.

## What is not established

- Whether anyone exploited this before the fix. No in-the-wild use has been reported, and the mechanism would not leave obvious evidence.
- Whether existing configurations that had already published are now bound by repository id. GitHub has not said.
- How many of the 1,500 exposed packages had a trust binding pointing at a genuinely claimable name, as opposed to one still held by the maintainer.
- Whether other registries that adopted the same pattern verify by name or by id.`,
  },

  {
    slug: "marklogic-31-flaws-and-a-patch-that-removes-access-on-purpose",
    title:
      "Thirty-one flaws, and the patch takes away access people are using today",
    excerpt:
      "Progress published 31 MarkLogic vulnerabilities at once, five of them critical, and the theme running through the worst is delegated administrators reaching full control. There is no workaround, the 12.0 line has no fix, and the upgrade notes warn that privileges will disappear.",
    categorySlug: "security",
    tags: [
      "marklogic",
      "progress-software",
      "database",
      "privilege-escalation",
      "xquery",
      "saml",
      "patching",
      "enterprise-software",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1759836096317-e746643cc277${P}`,
    body: `**Progress** published a critical security bulletin for **MarkLogic Server** on **12 October** covering **31 vulnerabilities** — by the National Vulnerability Database's count, filed by Progress itself: five critical, twenty-four high, two medium.

Thirty-one at once is a batch, not an incident. What makes it worth reading is what the worst of them have in common, and what the fix costs.

## The theme is delegated administrators

MarkLogic has a granular privilege model: you can give somebody forest management, or database administration, or user management, without making them an administrator. Four of the serious flaws end the same way — that person becomes one.

- **CVE-2026-85947** — a holder of forest-management privileges can create a **persistent unauthorised administrator account**.
- **CVE-2026-85948** — an XQuery injection in a deprecated Management API path gives a manage-user-level account **persistent administrative control**.
- **CVE-2026-85956**, scored **9.6** — delegated database-administrator privileges can back up or restore forests **outside the attacker's own database**.
- **CVE-2026-85954**, scored **8.6** — passing values to certain XQuery functions yields more privilege than was granted.

That is not four unrelated bugs. It is a privilege model that did not hold at four separate boundaries, and the practical reading is that on an unpatched instance, a delegated role should be treated as equivalent to an administrator.

Three more in the batch are worth naming. **CVE-2026-85955** lets query-execution access invoke an evaluation function without the privilege that was supposed to gate it. **CVE-2026-85962** is a SAML flaw letting unauthenticated attackers submit assertions that should have been rejected. **CVE-2026-85960** is predictable CSRF tokens in the Query Console.

## The patch takes things away, and says so

Here is the sentence that makes this unusual. Progress warns that after upgrading, **you may no longer have privileges you previously had, because that access was incorrect**.

Vendors do not normally say that. The fix is not only closing holes; it is withdrawing access that people are using today, in production, because the privilege model was wrong and the correction is visible.

The rest of the upgrade notes carry the same warning in other forms. Older versions of the content-pump tool fail with an isolation error. The Kerberos login fix requires a keytab file. Existing log files keep their old permissions until they are rotated.

So this is a project, not a patch window. Somebody has to find out which jobs run under which delegated role, and which of those stop working on purpose.

## No workaround, and one line with no fix at all

Progress lists **no workaround** for customers who cannot upgrade yet. The fixes are in **11.3.7** and **12.1.0**.

The **12.0 line has no patch**. Remediation there means moving to 12.1.0 — a minor-version move rather than a point release, with whatever testing that implies.

And the August releases, 11.3.6 and 12.0.3, are affected by the new flaws, so being current as of two months ago is not a defence.

Progress also notes that an affected instance **may operate normally with no prior sign of exploitation**, which is a polite way of saying that nothing in your monitoring will tell you.

## What the reporting disagrees about

Two things worth checking against the bulletin rather than any summary, this one included.

Coverage differs on **which** flaws are the headline persistent-administrator pair — some name CVE-2026-85947 and CVE-2026-85948, others point at CVE-2026-85956 as the delegated-DBA issue. All three are real; the ranking is not consistent.

And the dates do not line up. One account says the fixed builds shipped on **10 September**, a month before the 12 October bulletin. If that is right it is its own story, and it is the same shape as a pattern we have written about elsewhere: a fix that exists for weeks before anyone is told what it fixes. We have not been able to confirm it, so it stays here rather than in the body.

## What to do

- Upgrade to **11.3.7** or **12.1.0**. If you are on 12.0, plan the move to 12.1.0; there is nothing else.
- Before upgrading, inventory **who holds delegated roles** — forest management, database administration, user management — and what automation runs under them. Some of it will stop.
- Treat delegated roles on an unpatched instance as administrator-equivalent until it is patched.
- Rotate the Query Console sessions and anything that could have been reached through the SAML path.
- Read Progress's bulletin for the authoritative CVE list. Thirty-one is too many to triage from coverage.

## What is not established

- Whether any of the 31 has been exploited. Progress does not say.
- When the fixed builds actually shipped. Accounts differ by a month.
- Which of the privilege-escalation flaws is the most serious in practice, as distinct from by score.
- How many deployments run a 12.0 release with no patch available to them.
- What proportion of real deployments actually use delegated roles, which is what decides how much of this matters.`,
  },

  {
    slug: "p7-darksword-the-exploit-chain-leaked-and-now-it-arrives-in-an-advert",
    title:
      "The exploit chain was disclosed, the source leaked, and now it arrives in an advert",
    excerpt:
      "iVerify found a new variant of the DarkSword iOS chain that steals keychain contents and cryptocurrency wallet data. The original was documented in March as targeted tooling. This one is delivered by malicious ads to whoever visits the page.",
    categorySlug: "security",
    tags: [
      "darksword",
      "p7",
      "iverify",
      "ios",
      "spyware",
      "malvertising",
      "crypto-wallet",
      "keychain",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1664482828500-b4c2341cbfd2${P}`,
    body: `**iVerify** disclosed a new variant of the **DarkSword** iOS exploit chain on **8 October**, having first seen it in **August**. It calls the variant **P7**, after a variable prefix the operator left through its modifications to the original code.

The technical changes are real but ordinary. The interesting part is how it is being delivered.

## From targeted tooling to an advert

The original DarkSword chain was documented in **March 2026** by Google's Threat Intelligence Group, working with Lookout and iVerify. That is the shape of a targeted capability: a zero-click browser chain, found on specific people's phones, written about by the organisations that investigate state-aligned intrusions.

Then, iVerify says, the **source code was leaked by a third party** after the chain was publicly disclosed.

P7 is what came next. It is distributed through **malicious adverts** as part of watering-hole attacks — meaning the victims are not necessarily individually chosen. They visited a page. iVerify first saw it on the iPhone of an employee at a financial institution.

That is the whole story in one line: a capability that existed to surveil selected people is now being sprayed at whoever loads an ad, and what it takes is money.

The infection needs no tap and no download beyond the visit itself.

## What it takes off the phone

The payload has been rebuilt around a different goal.

Rather than copying the keychain database off the device for later processing, P7 **extracts keychain data into JSON on the phone** before exfiltrating it — a smaller footprint and less to notice. It adds **two-way command and control**, where the earlier version mostly reported.

The command set, as iVerify describes it: poll for instructions every **15 seconds**, send a heartbeat, send the list of installed applications, and transmit iCloud Keychain contents along with data from Apple Notes, Photos, and cryptocurrency wallets.

Two commands are specifically about wallets. One checks **which wallet apps are installed**. The other extracts data from **imToken**.

A chain that cost real money to develop, pointed at the contents of a phone's keychain and whatever wallet happens to be on it. That is a change of business model, not of capability.

This is the second time in a fortnight we have written about tooling built to harvest recovery material from crypto users — [sixteen Firefox extensions that were the real wallet's code with the import function hooked](/article/firefox-wallet-extensions-the-real-wallet-code-with-one-function-hooked) was the other. Different platform, same target.

## Patched phones appear to be fine

The actionable fact, and iVerify is clear about it: **no evidence that P7 can compromise patched devices**.

Most coverage puts the targeted range at **iOS 18.4 through 18.7**, with one account describing P7 as extending compatibility to 18.7 from 18.6 in the variant previously tracked. One outlet names specific builds as unaffected; we have not been able to check that against iVerify's own report, so we are not repeating the numbers.

The practical version is unglamorous and complete: this is a chain against versions that have been superseded. Update the phone.

## The advert is the part that scales

Malvertising is worth looking at on its own, because it is the piece that turns a capability into a business.

The operator does not pick targets. They buy or compromise a placement, and the network delivers it to whoever the network decides should see it. Targeting, such as it is, comes from the ad platform's own audience segments — which means an attacker can approximate "people who read cryptocurrency sites" without ever identifying a person.

For a defender that breaks the usual advice. You cannot train somebody out of visiting a page they had every reason to visit, and the malicious code did not come from that page's publisher. It came from an ad slot the publisher sold to a network that resold it onward, through a chain that nobody in the transaction audits end to end.

It also explains the victim here. A financial institution's employee was not chosen. They loaded a page.

## What this says about disclosure

Nobody did anything wrong in the sequence that produced P7. A chain was found, investigated, written up and patched — which is how it is supposed to work, and the write-up is why defenders could detect it at all.

But publication is also a specification. Once the chain is described and the code is loose, the remaining barrier is not knowledge; it is the cost of building, and that has already been paid. What was a tool for a handful of targets becomes a commodity for whoever rents the ad slot.

That is an argument for patching faster rather than for publishing less. The window between disclosure and commodity use is the thing that keeps shortening, and the only part of it a defender controls is their own update cycle.

## What to do

- Update iOS. On the reported evidence that is sufficient, and nothing else here is.
- If a phone was on an affected version and used for cryptocurrency, treat **wallet credentials and the iCloud Keychain as exposed**. Move the assets from a clean device and reissue what was stored.
- Content blockers reduce exposure to malvertising, which is the delivery route here rather than a link somebody sent.
- For organisations: this reached a financial-sector employee's phone through an advert. Mobile device compliance that only checks for jailbreaks will not see it.

## What is not established

- Which vulnerabilities make up the chain. CVE identifiers appear in some coverage; we have not verified them against iVerify or Google.
- The exact unaffected build numbers.
- How many devices were infected, and over what period.
- Who is operating P7, and whether they are the same party that leaked the source.
- Whether wallet applications other than the one named are targeted by builds not yet seen.`,
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
