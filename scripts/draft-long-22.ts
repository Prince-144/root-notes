/**
 * Long-form drafts — 21 August 2026.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * The GitLab piece is a follow-up to an article we already published, which
 * stated there was no known exploitation as of 18 August. That is no longer
 * true. The published article needs a dated correction line — see
 * scripts/correct-gitlab-exploitation.ts.
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
    slug: "entra-id-cve-2026-69836-advisory-said-exploited-then-it-did-not",
    title:
      "Microsoft's advisory said the CVSS 10 was exploited — by evening it said it was not, and the headlines had already gone",
    excerpt:
      "CVE-2026-69836 is a real maximum-severity flaw in Entra ID, and Microsoft fixed it cloud-side with nothing for customers to do. For most of 21 August its own bulletin marked it exploited in the wild. Microsoft corrected that field to No after a reporter asked. The correction has not travelled the way the original did.",
    categorySlug: "security",
    tags: [
      "microsoft",
      "entra-id",
      "identity",
      "cloud",
      "vulnerabilities",
      "disclosure",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1585914641050-fa9883c4e21c${P}`,
    body: `On **21 August 2026** Microsoft disclosed **CVE-2026-69836**, a **CVSS 10.0** flaw in **Entra ID** — the cloud identity service formerly called Azure Active Directory, and the thing that decides who gets into most corporate Microsoft estates.

It is a **deserialization of untrusted data** issue allowing an unauthorised attacker to execute code over a network. It was reported by **Robert Fitzpatrick**, a principal security engineer. Microsoft fixed it on its own infrastructure: no update package, no KB, no configuration change, and in Microsoft's words no action for users of the service to take.

All of that is still true. One thing about it is not.

## The field that changed

Microsoft's bulletin originally marked the **Exploited** entry in its exploitability assessment table as **Yes**.

On the same day, after **The Hacker News** contacted the company for comment, Microsoft corrected that field to **No**. The vulnerability was not exploited in the wild.

Between those two states, the first version went everywhere. BleepingComputer, The Register, Help Net Security and a long tail of aggregators all carried it as a maximum-severity identity flaw under active attack — accurately, because that is what the vendor's own advisory said at the time they wrote.

We were about to publish it that way too. This piece exists because we checked the source again before we did.

## Why one table cell moved the whole industry

Because **Exploited: Yes** is not a description. It is an instruction.

It is the field that decides whether something is a Tuesday ticket or a Friday night. It drives KEV listings, emergency change approvals, out-of-hours pages, and the sentence a security lead uses to interrupt a board meeting. Nobody re-derives it; everybody forwards it. That is what makes the machinery efficient and it is what makes a single wrong cell expensive.

And corrections do not inherit the original's velocity. The first version had a headline, a severity and urgency behind it. The correction is a line appended to articles most people have already read, in a story that has stopped being new.

## What this does not change

The vulnerability was real and its severity was real. **CVSS 10.0** means unauthenticated, remote and total, and the location matters more than the number: Entra ID is not an application, it is the thing applications trust. Every Microsoft 365 sign-in, every Conditional Access decision, every token issued to a SaaS product wired into it depends on that layer holding.

We have written repeatedly about attacks that work by going around the login rather than through it — [ADFS signing keys extracted to forge assertions](/article/adfs-signing-keys-machine-dpapi-golden-saml-ghost-certificate), [passkey attack paths in Entra](/article/passkey-attacks-2026-synced-keys-entra-windows-hello), [an OAuth grant with no interactive prompt to attach MFA to](/article/password-spraying-155x-huntress-ropc-azure-cli-mfa-gaps). A flaw in the identity provider itself is that category with the intermediate steps deleted. It being unexploited is luck, not architecture.

## The part that should still bother you

Strip out the exploitation question and look at the position customers were in.

You did not patch this, because there was nothing on your side to patch. You cannot verify the fix, because you cannot see the service. You could not evaluate the exploitation claim, because you have no logs from the layer where it would have happened. You were told after it was over, and then told something different.

None of that is Microsoft behaving badly. It is the ordinary, correct operation of a managed cloud service, and it is the deal every customer accepted when identity moved off their own hardware. It is worth naming plainly because it is the opposite of how most organisations describe their security posture to an auditor — and because for one day, the only account available of what had happened was wrong, and there was no second source to check it against.

## What is actually worth doing

Nothing urgent. But the exercise is free and the answers are useful whenever you next need them:

- **Know where you would look.** If Microsoft had said your tenant was affected, which log would you open? Most organisations discover the answer is none.
- **Enumerate service principals and app registrations.** Persistence in a Microsoft tenant looks like a legitimate application with more permission than it needs, not a login.
- **Check for credentials added to existing applications.** A new certificate or secret on an app nobody has touched in a year is the quiet version of a backdoor.
- **Decide now how you treat a vendor advisory that changes.** This one changed within a day. The next one may change after you have already spent a weekend on it.

## What is not established

- **Why the field was set to Yes.** Microsoft has not explained whether it was an error in the assessment or in publication.
- **Whether any exploitation attempt occurred at all**, as distinct from successful exploitation.
- **How many organisations acted on the original version**, or what that cost them.
- **Whether the correction reached everyone who read the original.** On the evidence of the headlines still standing, no.`,
  },
  {
    slug: "gitlab-cve-2026-19478-exploited-forged-merge-records-watchtowr",
    title:
      "Attackers can forge a merge record so it looks like the fix landed — GitLab's flaw went from patch to exploitation in days",
    excerpt:
      "watchTowr reproduced CVE-2026-19478 within minutes of disclosure and then saw it used against its own honeypots. Beyond deleting repositories, it lets an attacker fabricate merge records and ban maintainers — which means the log that says a security fix was applied can itself be the lie.",
    categorySlug: "security",
    tags: [
      "gitlab",
      "graphql",
      "exploitation",
      "developer-tools",
      "supply-chain",
      "patching",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1696013910376-c56f76dd8178${P}`,
    body: `We covered [CVE-2026-19478 when GitLab patched it off-schedule](/article/gitlab-cve-2026-19478-graphql-directive-delete-public-projects) and noted there was no known exploitation at the time. That has changed, and faster than the piece anticipated.

**watchTowr** reports reproducing the vulnerability **within minutes** of disclosure, and subsequently observing in-the-wild exploitation against its honeypot network.

## What an attacker can actually do

The original advisory described modifying or deleting public projects. watchTowr's analysis extends that, and the extension is worse than the original:

- Delete entire repositories
- **Forge merge records**, so it appears a fix landed when it did not
- Ban project maintainers

The middle one deserves its own paragraph.

Destroying a repository is loud. Somebody notices within the hour, the backups come out, and the incident begins. Fabricating a merge record is silent, and it corrupts the thing every downstream process trusts: the record of what was changed and when. A team looking at its own history to confirm a security patch was merged would see the merge. Auditors would see the merge. The fix would not be there.

That inverts the usual relationship with a version control system. Git history is what everyone falls back on to establish ground truth after an incident. Here the history is the artefact under attack.

Banning maintainers is the operational companion to it — remove the people who would notice, then edit the record.

## The timeline is the argument

| Date | What happened |
| --- | --- |
| 17 Aug 2026 | GitLab ships patches outside its normal release schedule |
| 18 Aug 2026 | GitLab reports no known exploitation, no public exploit code |
| Within days | watchTowr reproduces in minutes; in-the-wild exploitation observed |

**Jake Knott**, principal security researcher at watchTowr, puts the general point directly: this is the new reality of vulnerability reproduction, where AI-enabled attackers compress the time from disclosure to exploitation.

Treat that as a claim about a trend rather than a measurement — nobody has published evidence that AI specifically produced this exploit. What is measurable is the interval, and the interval is days.

The practical consequence is that GitLab's **90-day** technical-disclosure convention protects nothing here. It was designed for a world in which reverse-engineering a patch took longer than deploying it. The patch diff is public the moment the release ships.

## What to do now

- **Patch to 19.2.4, 19.1.6, 19.0.8 or 18.11.11.** This is no longer a scheduled task.
- **If you cannot patch today, restrict unauthenticated access to /api/graphql**, or remove public repository access entirely. Either breaks the precondition.
- **Hunt your logs for requests containing @gl_introduced.** watchTowr names this specifically. It is a cheap, precise search and you should run it before you finish reading.
- **Verify your recent merges against a source that is not the instance.** Developers' local clones, CI build records and artefact registries were not editable through this flaw. If the instance says a fix merged, check that the code is in a build.
- **Check whether any maintainer lost access recently** and nobody could explain why.
- **Confirm a restore works.** Deletion is the other half of this, and an untested backup is not a backup.

## What is not established

- **How many instances have been hit.** watchTowr reports honeypot observation, not a victim count.
- **Whether any real project's history has been forged.** The capability is demonstrated; no confirmed case has been published.
- **Whether AI was involved in building the exploit.** That is an assessment of a trend, not a finding about this exploit.
- **Whether it is in CISA's exploited catalogue.** Not at the time of writing.`,
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
