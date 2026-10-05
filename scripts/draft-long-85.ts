/**
 * Drafts the 5 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-85.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-85.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-85.ts --update
 *
 *   1. Microsoft Titan (security). A 16-year-old sent a token with no
 *      signature and the word admin in it, and reached 17 trillion rows.
 *      The alg none bug, in 2026, at Microsoft.
 *   2. Truffle Security's scan of The Stack v3 (security). 543,699 live
 *      credentials. The survival table is the article: npm left one alive out
 *      of 101,886, Postgres left 11,465 out of 12,985.
 *   3. Unsloth Studio (ai). Selecting a model in a picker ran its code, and
 *      the maintainers declined an advisory because the product was in beta,
 *      so there is no CVE for anything to alert on.
 *
 * Primary sources: Truffle Security's own write-up for the figures and the
 * survival table, Talos-style reporting of Faav's disclosure for the Titan
 * timeline, and the Unsloth fix notes. The Titan researcher is a minor and is
 * referred to only by the handle he publishes under.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - Titan: an analytics dashboard, which is what Titan is.
 *   - Credentials: dense public code on a dark editor.
 *   - Unsloth: a config file open in a terminal, which is where its bug lives.
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
    slug: "microsoft-titan-a-token-with-no-signature-and-the-word-admin-reached-seventeen-trillion-rows",
    title:
      "A token with no signature and the word admin in it reached seventeen trillion rows of Microsoft's own data",
    excerpt:
      "Titan, Microsoft's internal analytics service, checked a login token's tenant, audience, application and user — and never checked that it was signed. A 16-year-old researcher set the algorithm to none, typed admin into the user field, and was one. Microsoft blocked the endpoint in four days and paid 5,000 dollars.",
    categorySlug: "security",
    tags: [
      "microsoft",
      "jwt",
      "alg-none",
      "authentication-bypass",
      "bug-bounty",
      "msrc",
      "analytics",
      "responsible-disclosure",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1551288049-bebda4e38f71${P}`,
    body: `A 16-year-old researcher publishing under the handle **Faav** found that **Titan**, Microsoft's internal data analytics service, would accept an access token that carried no signature at all. With it he reached administrator privileges and the ability to run SQL queries against **17 connected analytics databases** holding roughly **17.3 trillion rows**.

Microsoft blocked the endpoint four days after the report and paid a **5,000 dollar** bounty.

## What the token looked like

JSON Web Tokens carry a header that names the algorithm used to sign them. The specification permits the value **none**, for tokens that are deliberately unprotected because something else in the system guarantees integrity. A token using it ends with a trailing dot where the signature would be, and there is nothing after it.

Faav built exactly that: a header declaring the none algorithm, and in the field that normally holds the user's email address, the string **admin**. Titan read it and resolved him as a local administrator.

The service was not careless in general. It checked the tenant. It checked the audience. It checked the application identifier. It checked the user identity. What it did not check was whether any of that had been signed by anyone — which is the check that makes the other four mean something. Without it, every field in the token is a claim the attacker wrote.

## This bug has been on the checklist since 2015

The none-algorithm bypass is not obscure. It has been the first item in JWT security guidance for a decade, every mature library refuses it by default, and it appears in the introductory module of every web security course that covers tokens.

Which raises the more useful question: not how the bug existed, but where. Titan is internal. Access is restricted to Microsoft employees, and an internal analytics tool is not the system anyone assigns to a penetration test ahead of the products customers pay for.

That is the pattern worth taking from this. The authentication on internal tooling tends to be written once, early, by the team that needed the tool, and then inherited. It is rarely re-reviewed, because nothing about it is customer-facing and nothing about it changes. The data behind it grows for years regardless.

## Seventeen trillion rows behind a four-field check

The scale is what makes the finding more than a trivia item. Titan holds employee records, organisational data and Bing analytics. The researcher reports reaching 17 connected databases through the same interface.

One detail says something about how the surface was mapped. He recovered **56 archived table names** from a **2023 snapshot of Titan's login pages on the Wayback Machine**. A login page from three years ago, preserved by a public archive, was part of the reconnaissance — which is a reminder that taking something down does not take it out of circulation.

The work was done with an AI tool of his own called **Antares**, which found the Titan API on **25 August**. The admin token worked on **5 September**, and he reported it the same day.

## Microsoft's handling was the good part

The timeline after the report is short. **5 September**: reported to the Microsoft Security Response Center. **9 September**: the endpoint blocked. **17 September**: a 5,000 dollar award.

MSRC also asked him to stop testing and for his IP address, so it could confirm that the activity it saw in its logs was his research and nothing else. That is the correct request, and it is only answerable because the researcher reported rather than continued.

Whether 5,000 dollars is the right price for unauthenticated administrative access to 17 trillion rows of internal data is a separate argument, and a reasonable one to have.

## Two sixteen-year-olds in a week

It is worth putting this beside the other teenager in the news this week — the [16-year-old arrested in Alicante as the suspected administrator of the KillSec extortion brand](/article/killsec-operation-killswitch-110-terabytes-five-servers-and-a-sixteen-year-old-administrator).

Same age, comparable technical reach, entirely different outcome. The difference is not capability. It is that one found a bug and sent an email, and the other ran a leak site. The bounty programme is the thing that makes the first choice available, which is most of the argument for funding them properly.

## What to do

- Audit token validation on internal services, not just external ones. The specific test is trivial: send a token with the algorithm set to none and see what happens.
- Reject the none algorithm explicitly rather than relying on a library default. Defaults change, and a library pinned years ago may not have the one you assume.
- Treat the claims in a token as untrusted until the signature is verified. Checking tenant, audience and user before verifying the signature is checking the attacker's own writing.
- Remember that archived copies of your interfaces are public. A login page you replaced in 2023 is still describing your API to anyone who looks.

## What is not established

- Whether anyone else found or used the flaw before the report. Microsoft asked for the researcher's IP to check its logs; what it concluded has not been published.
- How long the gap existed in Titan.
- What the 17.3 trillion rows contain in detail, beyond the general categories described.
- Whether other internal Microsoft services share the same validation code.`,
  },

  {
    slug: "truffle-543699-live-credentials-revocation-not-push-protection-is-what-kills-a-leaked-key",
    title:
      "npm had one live token left out of 101,886. Postgres had 11,465 out of 12,985. The difference is not push protection",
    excerpt:
      "Truffle Security scanned 224.6 million public GitHub repositories from an AI training dataset and found 543,699 credentials that still worked. The survival rate by provider is the finding: where a provider scans for its own leaked tokens and kills them, almost nothing survives. Where it does not, almost everything does.",
    categorySlug: "security",
    tags: [
      "truffle-security",
      "github",
      "secrets-management",
      "credential-leak",
      "push-protection",
      "the-stack",
      "training-data",
      "revocation",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1518773553398-650c184e0bb3${P}`,
    body: `**Truffle Security** scanned **224.6 million public GitHub repositories** — **58.5 billion files** — taken from **The Stack v3**, the code corpus assembled to train large language models. On **27 and 28 July 2026** it tested what it found against the real services, and **543,699 credentials still authenticated**.

They appeared **1.1 million times** in total, because a leaked key in a forked repository is leaked again in every fork.

## The numbers that describe the delay

The crawl behind the dataset closed on **7 August 2025**. The validation happened eleven months later, and the credentials were still working.

The median one had been sitting in a public default branch for **784 days**. The ninetieth percentile was **6.3 years**. A quarter of the findings predate 2022. The oldest still-working credential was last modified on **13 June 2009** — database credentials in an Erlang configuration file, live for seventeen years.

That is not a story about anyone failing to notice a breach. Nobody breached anything. The credentials were published, in public, by their owners, and then nothing happened for years.

## Push protection works, and it is not the thing that matters

GitHub turned on push protection by default on **29 February 2024**, which blocks a commit containing a credential shape it recognises from more than 180 providers.

It works. Truffle's figures put the reduction in new credential commits at roughly **53 percent** for the patterns it covers.

And it is not where the outcome is decided, for two reasons.

The first is arithmetic: **199,843** of the live credentials — **36.8 percent** — were committed *after* push protection went on by default, and were still valid more than two years later. Protection at push time does nothing for what is already public, and does nothing for a repository whose owner turned it off.

The second is coverage: **51.8 percent** of every live credential in the corpus is a shape that a default-configured public repository will accept without complaint. Among those are **51,067** live MongoDB connection strings and **33,343** live Google API keys. A connection string is not a token with a recognisable prefix. It is a URL, and it looks like every other URL.

## The table that settles it

The comparison that makes this research worth reading is what happens to the same exposure under different providers.

| Credential | Committed | Still live | Survival |
| --- | --- | --- | --- |
| npm tokens | 101,886 | 1 | 0.001% |
| GitHub tokens | 73,048 | 260 | 0.36% |
| Google Cloud service accounts | 126,963 | 69,041 | 54% |
| MySQL connection strings | 2,421 | 1,806 | 75% |
| Postgres connection strings | 12,985 | 11,465 | 88% |

npm had more than a hundred thousand tokens published to public GitHub. One of them still works.

Nothing about npm's users is more careful than Postgres users. The difference is downstream: npm, GitHub and Slack operate scanning partnerships that take a leaked token and revoke it without asking. A Postgres connection string has nobody to tell. There is no central authority that owns it, no pipeline that can invalidate it, and the only person who can turn it off is the person who already published it by accident and did not notice.

Truffle's conclusion is the one the table forces: what keeps a leaked credential alive is the absence of revocation, not the absence of a block at push time.

## The dataset is the second problem

Where this corpus came from matters as much as what is in it.

The Stack v3 exists to train models. These 543,699 credentials were not merely public — they were training data, read by every model built on that corpus, in a form the model may reproduce when asked for an example configuration.

That changes the shape of the exposure. A secret in a public repository is findable by someone who searches for it. A secret in training data is reachable by someone who asks a model to write a connection string and gets a real one. We have written before about [an agent whose indicator list included an AI config file](/article/shai-hulud-searches-469-places-now-and-one-of-them-is-your-ai-config); this is the same collision from the other direction.

## What to do

- Rotate first, delete second. Removing the file does not help: the credential is in the fork, in the archive, and in the training set. Only invalidating it at the provider ends the exposure.
- Audit what cannot be auto-revoked. Database connection strings, internal service URLs with embedded passwords and self-hosted API keys are the shapes with no revocation pipeline behind them, and they are where the survival rates are worst.
- Do not treat push protection as the control. It halves new leaks of recognised shapes and does nothing for the half of this corpus it does not recognise.
- Scan history, not just the current tree. A quarter of these findings predate 2022, which means the file in your working directory today says nothing about what is in your commit log.
- If you publish a service with API keys, build the revocation pipeline. The npm column is what that is worth.

## What is not established

- Who, if anyone, has used these credentials. Truffle validated that they authenticate; it does not report abuse.
- Whether the owners have been notified, and by whom.
- How many of the 543,699 remain live now, after publication.
- How much of this corpus is reproduced by the models trained on it, which the research does not test.`,
  },

  {
    slug: "unsloth-studio-picking-a-model-ran-its-code-and-there-is-no-cve-to-tell-you",
    title:
      "Choosing a model in Unsloth Studio ran that model's code, and because the product was in beta there is no CVE to tell anyone",
    excerpt:
      "Unsloth Studio checked a model's configuration with remote code trusted, so selecting an attacker-controlled model in the picker downloaded and executed Python from its Hugging Face repository. No weights loaded, no training started, no prompt to approve. Fixed in 2026.6.9, with no advisory and no identifier.",
    categorySlug: "ai",
    tags: [
      "unsloth",
      "hugging-face",
      "ai-supply-chain",
      "remote-code-execution",
      "trust-remote-code",
      "config-json",
      "cve-2026-93348",
      "machine-learning",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1789805142339-f070a351b8a8${P}`,
    body: `**Unsloth** is a widely used open-source library for fine-tuning and quantising large language models. **Unsloth Studio**, its browser interface, had a flaw in the component people use to browse models: **selecting one ran code that the model's author had written**.

Not loading it. Not training on it. Selecting it in a list.

## The dangerous moment was looking

The mechanism is a one-line decision with a long shadow. While checking a model's configuration, Studio called into the Transformers library with **trust_remote_code** set to true.

That flag exists for a legitimate reason: some models ship custom Python that defines an architecture the library does not know, and loading them requires running it. It is documented, it is opt-in, and the usual advice is to set it only for models whose authors you trust.

Here it was set during a **configuration check**, before the model was loaded at all. The library duly fetched and executed the Python referenced from the model's **config.json** on the attacker's Hugging Face repository.

So the exploit path is: an attacker publishes a model with a crafted config.json, a Studio user selects it in the picker, and attacker code runs in the Studio backend process. The victim did not load weights, did not start training, did not begin inference, and was never asked to approve anything.

Every piece of advice about trust_remote_code assumes the user makes a decision at load time. This removed the decision and moved it earlier than anyone looks.

## Inspection is supposed to be the safe operation

What makes this worth more than a line in a patch log is which operation became dangerous.

Every workflow for handling untrusted artefacts has the same shape. You look at the thing before you run it. You read the manifest, check the author, inspect the metadata, and then decide. That order is the control.

A model picker is the inspection step of the machine learning supply chain. It is where a practitioner is supposed to be able to look at a model safely and decide whether to trust it. Collapsing inspection into execution does not just add a vulnerability — it removes the step where the user was going to apply judgement.

It is the same shape as [the GitLab AI gateway flaw this week](/article/gitlab-ai-gateway-cve-2026-90970-a-prompt-template-that-escapes-into-the-host), where a prompt template escaped into the host. In both cases the product feature is that users supply something expressive, and the security depends entirely on a boundary nobody can see.

## No advisory, no identifier, no alert

Unsloth fixed it in **2026.6.9**, which stopped loading arbitrary models directly from Hugging Face and stopped trusting remote code from local model files on Studio's inspection path.

The maintainers declined to publish an advisory, on the grounds that Studio was in beta. No CVE was assigned.

Without an identifier there is no entry in a vulnerability database, so dependency scanners do not flag it, software composition analysis does not report it, automated upgrade bots do not raise it, and nobody's patch management process produces a ticket. The fix exists and is shipped; the mechanism that would tell an organisation to apply it does not.

Beta is a statement about product maturity and feature stability. It is not a statement about whether people are running the software, and in the machine learning tooling ecosystem, beta software is what most of the work is done with.

There is a separate identifier nearby: **CVE-2026-93348**, a code injection flaw in **unsloth-zoo** affecting versions from 2025.9.9 before 2026.8.14. That one is tracked. Teams checking their exposure should look for both, and only one of them will appear in a scan.

## What to do

- Upgrade Unsloth to 2026.6.9 or later. Nothing will prompt you to, so this is a manual check.
- Separately check unsloth-zoo against CVE-2026-93348. That one your scanners will see.
- Treat trust_remote_code as a privilege, not a convenience. Grep your own pipelines for it, and confirm every place it is true is a place where a human decided to trust that specific publisher.
- Run model inspection somewhere disposable. If browsing a model registry can execute code, the machine doing the browsing should not be a workstation with cloud credentials on it.
- Do not use the presence of a CVE as a proxy for whether a fix matters. This one had no identifier and a real exploit path, and that combination is more common in fast-moving tooling than in mature software.

## What is not established

- Whether anyone exploited this. No reporting says so, and a model picker leaves little evidence behind.
- How many Studio installations were affected, which is unknown because beta installs are not counted.
- Whether any model currently on Hugging Face carries a config crafted for this.
- Whether other model-management tools call into the same configuration path with remote code trusted. The flag is widely used, and this report covers one product.`,
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
