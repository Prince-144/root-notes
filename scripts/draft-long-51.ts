/**
 * Drafts three pieces from 2-3 September news.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-51.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-51.ts --update
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
    slug: "coder-registry-cdn-origin-pool-modules-never-modified-at-source",
    title:
      "Nobody tampered with Coder's modules. They added IP addresses to the CDN pool so some requests went somewhere else",
    excerpt:
      "For 14 hours on 31 August, registry.coder.com served Terraform modules from servers the attacker had inserted into Coder's Cloudflare origin pool. The packages at source were never touched, which defeats every control built around checking that an artifact is what the publisher published.",
    categorySlug: "security",
    tags: ["coder", "supply-chain", "terraform", "cloudflare", "cdn", "credentials"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1784401930662-b9e573c8d79e${P}`,
    body: `**Coder** provides self-hosted cloud development environments. Its customer list includes **Dropbox**, **Palantir**, **Square**, **Mercedes-Benz** and US government agencies.

On **31 August 2026**, between **07:35** and **21:45 UTC**, some requests to **registry.coder.com** — where developers pull Terraform modules for workspace templates — were answered by servers the attacker controlled.

## The packages were never modified

This is the part that makes it different from an ordinary supply-chain compromise.

Attackers got into **Coder's Cloudflare infrastructure** and **added unauthorised IP addresses to the origin pool** for the module registry. Cloudflare then did exactly what it is supposed to do: it routed requests to origins in the pool. Some of those origins were not Coder's.

Nothing at source changed. The repository is intact. Version numbers are intact. Whatever integrity you could verify about the published artifact would have verified correctly, because the published artifact was never the problem — **the thing you received was never the published artifact**.

That defeats a whole category of controls. Signature checks, hash pinning, package reputation, "did the maintainer publish this" — all of them answer a question about the publisher. None of them answers "did this byte stream actually come from the publisher's server".

[Poisoned LiteLLM releases reaching 2,500 organisations](/article/litellm-poisoned-releases-cloudsek-2500-organisations) worked the old way, by changing what was published. This is the layer underneath.

## "Some" requests

The word to sit with is *some*. Routing to an origin pool is load balancing, so which requests hit the attacker's servers was not deterministic.

You therefore cannot check whether you were affected by looking at a version number, and neither can Coder. Two engineers on the same team, pulling the same module in the same hour, could have received different bytes.

## What it took

The injected code was an information stealer, and the target list is a good description of what a developer workstation actually holds:

- Provisioner environment variables and secrets
- Cloud infrastructure and AI tooling **API keys**
- **CI/CD credentials**
- **SSH keys and terminal history**
- **OIDC tokens**
- Database passwords and configuration secrets

Exfiltration went to **coder-infra[.]com**, a lookalike domain.

**Terminal history** is the entry worth pausing on. It is where people paste a token once to test something, where a one-off credential gets typed with a password on the command line, where the thing that never made it into a secret manager is nonetheless written down. It is rarely rotated because it is rarely thought of as a credential store.

## Coder cannot tell you if you were hit

The company says it lacks **crucial logs** from the attacker's infrastructure, and therefore cannot definitively identify which deployments were affected. It has not published which modules were touched or how many users pulled them.

Read the guidance in that light. "Rotate all credentials and check your network logs for connections to the lookalike domain" is not caution — it is the only instruction available when the incident cannot be scoped.

Patched versions are **2.37.0**, **2.36.4**, **2.35.7** and **2.34.9**.

## What to do

- **Rotate everything a Coder provisioner could see**, on the assumption you were affected. There is no way to establish that you were not.
- **Search outbound logs for coder-infra[.]com** across 31 August. That is the one hard indicator published.
- **Treat shell history as a credential store.** Clear it on build agents, and rotate anything you know was ever typed rather than referenced.
- **Ask where your artifacts are actually served from.** Registry integrity is usually reasoned about at the repository; this incident happened between the repository and you.
- **Check whether your CDN account has the same protections as your source control.** Origin pool membership is a deployment primitive, and on most teams it is guarded far less carefully than a signing key.

## What is not established

- **Which modules were affected**, or how many downloads.
- **How the Cloudflare account was compromised.** Not disclosed.
- **Whether any credentials were used** after exfiltration.
- **How many of the named customers pulled modules in the window.** Nobody has said.
- **Whether the missing logs will ever be recovered.** Coder describes them as absent, not delayed.`,
  },
  {
    slug: "dropbox-lenovo-id-federated-trust-no-password-needed",
    title:
      "Someone registered a Lenovo ID with your email, then used it to open your Dropbox. No password required",
    excerpt:
      "A weakness in Lenovo's email verification let an attacker claim an address they did not control. Dropbox's account linking accepted Lenovo's word for it without asking for the Dropbox login. About 5,000 accounts were reachable that way between 4 and 21 August.",
    categorySlug: "security",
    tags: ["dropbox", "lenovo", "identity", "federation", "sso", "account-takeover"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1707924962886-12ad20367315${P}`,
    body: `An issue in **Lenovo's** email verification process allowed an unauthorised party to register a **Lenovo ID** using an email address they did not control. They then used that Lenovo ID to sign in to the **Dropbox** account belonging to that address.

**No Dropbox password was involved at any point.**

Roughly **5,000** Dropbox accounts were affected between **4 and 21 August 2026** — seventeen days — and content was viewed and downloaded from some of them. Lenovo's own customers are reported as unaffected.

## Neither company's bug, on its own, loses your files

Lenovo's flaw is that its verification did not verify. That is bad, and by itself it gets you a Lenovo ID with somebody else's email on it, which is worth very little.

Dropbox's flaw is subtler and more consequential. Its identity linking **trusted Lenovo's assertion that the attacker controlled the email address, without requiring confirmation through the existing Dropbox login**. So the question "is this the same person who owns the Dropbox account" was never asked of the Dropbox account.

Put them together and a weak signup form at a laptop manufacturer becomes read access to somebody's documents.

This is the failure mode of federated identity generally: **you inherit the account-recovery quality of every provider you accept.** Adding a sign-in option is usually treated as a product decision about convenience. It is an authentication decision, and it delegates part of your security to a company whose incentives around signup friction are not yours.

We have written about [the three ways "Sign in with Google" fails](/article/sign-in-with-google-three-failure-modes-domain-takeover). This is a fourth, and it is the cleanest illustration yet, because both companies are competent and the flaw lives entirely in the seam between them.

## The fix names the design error

Dropbox expired every session authenticated through a Lenovo ID, and now **requires the Dropbox password when authenticating with one**.

Read that backwards and you have the original defect stated plainly: before, an external identity provider could hand you an existing account with no local proof of ownership at all. The remedy is not a patch — it is a change to what an assertion from a third party is allowed to buy.

## Seventeen days, and how it ends

The window ran 4 to 21 August; disclosure came in early September. As with [the METR incident where the credential left through the agent](/article/metr-attacker-asked-the-agent-for-its-api-key), the interesting number is not the count of affected accounts but the gap between access and knowledge.

Both companies say they worked together to mitigate. The investigation is described as ongoing, and the technical mechanism of the Lenovo verification failure has not been published.

## What to do

- **Check your Dropbox security page** for sessions or linked accounts you do not recognise, and for file activity between 4 and 21 August.
- **Unlink identity providers you do not use.** Every linked provider is an additional way in, and most people have accumulated several without deciding to.
- **If you run a service that accepts third-party sign-in, require a local factor when linking to an existing account.** That is precisely the control Dropbox has now added.
- **Do not assume the big name is the risky one.** The weak link here was the laptop vendor's account system, not the storage provider's.

## What is not established

- **The technical detail of the Lenovo flaw.** Neither company has described the verification failure.
- **Who did this**, or whether the accounts were chosen or opportunistic.
- **How many of the 5,000 had content accessed**, as distinct from being reachable.
- **How the issue was discovered**, or by whom.
- **Whether other services accepting Lenovo ID were exposed the same way.** Only Dropbox is named.`,
  },
  {
    slug: "cnil-500000-euro-fine-hospital-no-vpn-no-mfa-teenager",
    title:
      "The attacker asked €2,000 for the data. The regulator fined the hospital €500,000",
    excerpt:
      "CNIL penalised Hôpital privé de la Loire over a 2025 breach reaching 524,867 patients and 202,246 family members and carers. External physicians could reach the record system with no VPN and no MFA, and nobody was watching. The data was never sold.",
    categorySlug: "security",
    tags: ["cnil", "gdpr", "healthcare", "france", "breach", "regulation"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1747668053694-0876900e7db7${P}`,
    body: `France's data protection authority, **CNIL**, has fined **Hôpital privé de la Loire** — a Saint-Étienne hospital operated by **Ramsay Santé**, treating around **60,000** patients a year — **€500,000** over a breach in the summer of **2025**.

An attacker reached the electronic patient record system and took data on **524,867 patients** and **202,246 trusted third parties**: the family members and carers patients had named as their contacts. **727,113 people** in total.

A teenager using the alias **Marak** claimed responsibility and offered the data for **€2,000 to €5,000**. It was never sold and never published.

## The failures CNIL cited are ordinary

Under **GDPR Articles 32 and 34**, the regulator found:

- **External users, including private-practice physicians, could access the record system without a VPN and without multi-factor authentication.**
- Access controls were inadequate, allowing broad access across patient records.
- There was **no real-time monitoring**, so the attacker operated undetected for days.
- The hospital notified patients, but **did not directly contact the 202,246 third parties**.

Nothing on that list is advanced. There is no zero-day, no supply chain, no nation-state. A teenager walked into a system that had no second factor in front of it and nobody watching it.

That is the useful part of a regulator's finding: it describes what was missing rather than what the attacker was clever at.

## The people nobody told

The Article 34 finding deserves more attention than it will get.

The 202,246 third parties are in that database because a patient wrote their name down as a person to contact. They never signed up for anything. They have no account, no relationship with the hospital, and no reason to be watching for a notification.

They are also the group the hospital did not tell.

That is a structural problem, not an oversight by one organisation. Systems routinely hold data about people who are not the customer — emergency contacts, dependants, referrers, next of kin — and breach notification processes are built around the customer list. If your notification plan is "email the account holders", you have already decided not to tell everyone else.

## €2,000 asked, €500,000 fined

The gap between those numbers is the whole economics of this in one line.

The attacker valued 727,000 people's medical records at somewhere between two and five thousand euros. The regulator valued the failure to protect them at half a million — **a hundred to two hundred and fifty times** the asking price — and did so for a breach where **nothing was sold and nothing was published**.

CNIL is not pricing the harm that happened. It is pricing the absence of controls, which is the only thing a regulator can price reliably, because whether stolen medical data surfaces later is not something anyone can know at the time.

The comparison worth making is with [the Dutch DPA's €825 million against Uber](/article/uber-825-million-dutch-dpa-automated-driver-suspensions). Different scale, same logic: the penalty attaches to the practice, not to the outcome.

## And a number that is a number

**727,113 records is 727,113 records.** Unlike [the McKesson figure, where the attacker's count of records was reported as a count of people](/article/mckesson-284-million-records-is-not-284-million-people), CNIL's numbers come from the regulator, split into two named populations, and describe individuals.

CNIL notes the hospital strengthened its security during the proceedings. It has not published how the fine was calculated.

## What to do

- **Find the external access paths into your clinical or customer systems.** Private-practice physicians, contractors, partner clinics — the accounts that belong to people not on your payroll are the ones least likely to have MFA.
- **Count the people in your data who are not your customers**, and check whether your breach notification plan can reach them. If it cannot, that is the finding, before anyone breaches you.
- **Real-time monitoring is a regulatory expectation, not a maturity goal.** "Undetected for days" was cited as a failing, not as context.
- **Do not calibrate risk to whether data gets sold.** In this case it did not, and the fine was €500,000 anyway.

## What is not established

- **How the fine was calculated.** CNIL has not published the methodology.
- **Whether the hospital is appealing.** No response is reported.
- **What happened to Marak**, or whether charges followed.
- **Whether the data still exists** anywhere outside the hospital.
- **What specifically was exposed** per record, beyond that it was patient data and named contacts.`,
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
