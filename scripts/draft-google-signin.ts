/**
 * "Sign in with Google" — three failure modes, only one of which the viral
 * advice addresses.
 *
 * Pass --update to rewrite if the draft exists; published articles are skipped.
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
    slug: "sign-in-with-google-three-failure-modes-domain-takeover",
    title:
      "Backup codes will not save you: two of the three ways 'Sign in with Google' fails are not yours to fix",
    excerpt:
      "The viral advice is recovery codes and a backup email. That covers losing your own account. It does nothing about someone buying your dead employer's domain and inheriting your Slack, or about accounts an admin cannot deprovision at all.",
    categorySlug: "security",
    tags: [
      "oauth",
      "identity",
      "google",
      "single-sign-on",
      "saas",
      "account-security",
    ],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1762330474120-71b4057a8b40${P}`,
    body: `A video doing the rounds makes a reasonable point: a business owner lost their Google account and, with it, email, cloud documents, websites, subscriptions and business tools. The advice that follows is the standard list — review connected apps, turn on MFA, save recovery codes, add a backup email and phone, use separate logins for critical services.

All sensible. It addresses the least interesting of the three ways this goes wrong, and the only one you control.

## Failure one: you lose the account (the one the advice covers)

This is real and it is not rare. Through 2026 there has been a wave of Google Business Profile suspensions, and the process around them is worth knowing before you need it:

- **Two appeals**, then the profile is permanently disabled
- Once you open the evidence form you have **60 minutes** to submit it or it is not attached to your appeal
- A restriction applied at the **account** level automatically suspends **every** profile that account manages

Reported cost of a suspension: an average of **$12,400** in lost revenue during recovery, plus **15–25 hours** of management time.

The 60-minute window is the detail that catches people. You do not get to open the form, gather documents over a couple of days, and come back.

Recovery codes and a backup email genuinely help here. Take the advice.

## Failure two: someone buys your dead employer's domain

This is the one nobody in the viral thread mentions, and it is not fixable by anything you do to your own account.

**Truffle Security** demonstrated that when a startup shuts down and its domain is sold, the buyer can recreate email addresses for former employees — and **"Sign in with Google" hands the new owner the same OAuth claims the old employees had.**

The mechanism is that services receive the **hd** (hosted domain) and **email** claims, and those claims do not change when the domain changes hands. To the downstream service, nothing looks different.

What Truffle reached in testing: **ChatGPT, Slack, Notion, Zoom**, interview platforms with candidate feedback, and **HR systems containing social security numbers, tax documents and pay stubs**.

The scale they estimate:

| | |
| --- | --- |
| Americans working at tech startups | 6 million |
| Startups that eventually fail | ~90% |
| Failed startups on Google Workspace | ~50% |
| Defunct startup domains currently purchasable | **over 100,000** |
| Accounts potentially exposed | **10+ million** |

The last figure is an estimate built from 10 employees × 10 SaaS services per failed startup, and should be read as an order of magnitude rather than a count.

**Why services cannot just fix it themselves.** OAuth includes a **sub** claim — a unique user identifier that would solve this. Truffle found it unreliable:

> The sub claim changes in about 0.04% of logins from Log in with Google. For us, that's hundreds of users last week

A identifier that occasionally changes is an identifier that occasionally locks out legitimate users, so services fall back to email and domain. Slack and Notion cannot fix this without Google changing something.

**Google's handling**, per Truffle's timeline: reported **30 September 2024**, closed as "won't fix" on **2 October** and classified as fraud/abuse rather than an OAuth issue, then reopened on **19 December 2024** with a **$1,337** bounty and a statement that development was underway. No implementation details were given.

**We could not establish whether this has been fixed.** The reporting we could reach is from early 2025 and says "at the time of writing, there is no fix." Nothing we found confirms a 2026 resolution either way. Treat the status as unknown, not as unfixed.

## Failure three: accounts your admin cannot delete

A separate Truffle finding, from **December 2023**, and also unresolved at the time it was published.

Anyone can create a **non-Gmail Google account** using a corporate address with plus-addressing — **user+alias@company.com**. That Google account is **not a member of the Google organisation**, which means a Workspace administrator **cannot deprovision it**.

A former employee holding one keeps working access to services that trust Google login — Slack and Zoom were named — indefinitely after being removed from the organisation.

Google awarded another **$1,337** bounty. Disclosure ran from **4 August 2023** to public release on **16 December**, 134 days.

If your offboarding checklist is "remove from Workspace, done", this is the gap in it.

## What the three have in common

Notice what each one is really about.

Failure one is **availability** — you lose access. Failures two and three are **authorisation** — someone else gains it. The advice circulating addresses the first and is silent on the other two, which is backwards from a security standpoint: losing your own account is recoverable in principle, and a stranger reading your HR files is not.

And there is a structural point underneath all three. "Sign in with Google" makes your Google account the **root of trust** for everything downstream, but the downstream services have no reliable way to check whether the human behind that account is still the same human. They receive an email address and a domain, and they trust both.

## What to actually do

**Things you control:**

- **Recovery codes and a backup email/phone**, stored somewhere that is not itself behind the same Google account. This is the failure-one fix and it is worth doing today.
- **Do not use Google login for anything you cannot afford to lose.** Domain registrar, payment processor, primary bank, and the account you use to recover other accounts should have their own passwords.
- **Set a password on services where you currently only have Google login.** Most SaaS platforms allow it. This decouples the downstream account from the Google account entirely, and it is the single highest-value action here.
- **Review connected apps** — at myaccount.google.com, third-party access. Most people have dozens they have forgotten.

**Things for whoever runs your company's identity:**

- **Enforce SAML rather than Google login** where the option exists. That is Truffle's own recommendation and it closes failure three.
- **Audit for plus-addressed Google accounts** on your domain. They will not appear in your Workspace user list, which is exactly the problem.
- **If your company shuts down, do not let the domain lapse.** Renewing a domain for a decade costs less than the incident that follows selling it.
- **Ask your SaaS vendors whether they implement Google's Cross-Account Protection (RISC)**, which lets Google notify a service when an account is disabled or compromised. It exists; adoption is the question.

## What is not established

- **Whether the domain-takeover issue has been fixed.** Google said development was underway in December 2024. We found no confirmation either way for 2026.
- **Whether the plus-addressing issue has been fixed.** Same position.
- **The 10 million figure** is an estimate from a chain of assumptions, not a measurement.
- **The business owner in the video.** No verifiable case is attached to it. The underlying risk is documented; that particular anecdote is not.`,
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
