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
    slug: "entra-id-cve-2026-69836-cvss-10-no-action-for-users-to-take",
    title:
      "A CVSS 10 in Entra ID was exploited and fixed without you — and there is nothing on your side to check",
    excerpt:
      "CVE-2026-69836 is a deserialization flaw in Microsoft Entra ID allowing unauthenticated remote code execution. Microsoft says it has been exploited in the wild and is already fully mitigated service-side, with no action for customers. That last sentence is the uncomfortable one: you cannot patch it, and you cannot audit whether your tenant was touched.",
    categorySlug: "security",
    tags: [
      "microsoft",
      "entra-id",
      "identity",
      "cloud",
      "remote-code-execution",
      "vulnerabilities",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1585914641050-fa9883c4e21c${P}`,
    body: `On **21 August 2026** Microsoft disclosed **CVE-2026-69836**, a **CVSS 10.0** flaw in **Entra ID** — the cloud identity service formerly called Azure Active Directory, and the thing that decides who is allowed into most corporate Microsoft estates.

It is a **deserialization of untrusted data** issue allowing an unauthorised attacker to execute code over a network. Microsoft says it has been **exploited in the wild**. It was reported by **Robert Fitzpatrick**, a principal security engineer.

Microsoft also says the issue is fully mitigated service-side, and that there is no action for users of the service to take.

## Read that last sentence again

"No action for users to take" is written as reassurance. It is also a complete description of your position, and the position is: you were not involved.

You did not patch this, because there was nothing on your side to patch. You cannot verify the fix, because you cannot see the service. You cannot check whether your own tenant was among those touched during the exploitation window, because you do not have logs of the layer where it happened. And you were told after it was over.

None of that is Microsoft behaving badly. It is the normal, correct operation of a managed cloud service, and it is the trade every customer accepted when identity moved off their own hardware. It is just worth naming plainly, because it is the opposite of how most organisations describe their security posture to auditors.

## Why a 10.0 here is different from a 10.0 elsewhere

CVSS 10 means unauthenticated, remote, and total. Those appear a few times a year.

What makes this one specific is where it sits. Entra ID is not an application. It is the thing applications trust. Every Microsoft 365 sign-in, every Conditional Access decision, every token issued to every SaaS product wired into it — all of that rests on the identity layer being sound.

We have written repeatedly about attacks that work by going around the login rather than through it: [ADFS signing keys extracted to forge assertions](/article/adfs-signing-keys-machine-dpapi-golden-saml-ghost-certificate), [passkey attack paths in Entra](/article/passkey-attacks-2026-synced-keys-entra-windows-hello), and [an OAuth grant with no interactive prompt to attach MFA to](/article/password-spraying-155x-huntress-ropc-azure-cli-mfa-gaps). A flaw in the identity provider itself is the same category with the intermediate steps removed.

## What Microsoft has not said

The advisory is thin, and the gaps are the story:

- **When exploitation started**, and for how long it ran
- **Who was exploiting it**, or with what objective
- **How many tenants were affected**, or whether any were
- **Whether affected customers will be notified individually**
- **What, if anything, an attacker achieved** with code execution in that environment

Publishing after mitigation is standard for a cloud provider — you do not describe a live hole in your own service. But it means the exploitation window is a period customers cannot examine, and the only account of what happened inside it is the provider's.

## What you can actually do

Not patch. The useful actions are all downstream, on the assumption that identity assurance was briefly not guaranteed.

- **Review sign-in and audit logs for the last few weeks** for anything anomalous — unusual token issuance, new service principals, consent grants you do not recognise, role assignments nobody remembers making.
- **Enumerate your service principals and app registrations.** Persistence in a Microsoft tenant usually looks like a legitimate application with more permission than it needs, not a login.
- **Check for new or modified federation and credential objects.** Added certificates and secrets on an existing app are the quiet version of a backdoor.
- **Ask Microsoft, in writing, whether your tenant was affected.** You may not get an answer. Asking creates a record that you asked.
- **Do not treat this as closed because the CVE is closed.** The vulnerability is fixed. Anything an attacker established during the window is not.

## The part worth arguing about

There is a reasonable position that cloud providers should disclose more, later being better than never but not by much, and a reasonable position that publishing details of an identity-layer flaw before every tenant is protected would be worse for everyone.

Both are defensible. What is not defensible is the version many organisations tell themselves — that moving identity to a managed service removed this risk rather than transferring it somewhere they cannot see. It transferred it. That is the deal, and it is mostly a good deal, and today is the day it is visible.

## What is not established

- **Everything about the exploitation.** Timing, actor, scale and impact are all unpublished.
- **Whether any customer data was reached.** Not stated either way.
- **Whether other identity providers share the pattern.** Deserialization flaws are not Microsoft-specific and nobody has published equivalent findings elsewhere.`,
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
