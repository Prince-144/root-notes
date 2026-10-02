/**
 * Drafts the 2 October batch — four stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-81.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-81.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-81.ts --update
 *
 *   1. FortiMail CVE-2026-104286 (security). Fortinet's own advisory FG-IR-26-175
 *      of 1 October: a path traversal and a null-byte flaw together, exploited,
 *      with one branch that has no fix at all.
 *   2. OpenAI and Moonshot (ai). OpenAI's disruption report, read beside the
 *      researchers who retested in September and found the same technique still
 *      working on Azure. Follows our 12 September piece on Anthropic's report.
 *   3. Gemini 4 Argon (ai). Google's own announcement: a frontier model shipped
 *      deliberately without cyber guardrails to a chosen list, a benchmark that
 *      ties rather than leads, and a headline finding with no name attached.
 *   4. SC WordPress malware (security). Sucuri, 30 September: eight persistence
 *      points that rebuild each other, and command and control on a public
 *      blockchain.
 *
 * Primary sources throughout: Fortinet's advisory, Google's blog, Sucuri's
 * write-up. OpenAI's post blocks automated readers, so its figures are taken
 * from the reports quoting it directly and that is said in the piece.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - FortiMail: racked appliances in a dark equipment room.
 *   - Distillation: a graphics card seated in a machine, where training happens.
 *   - Argon: a phone's AI folder holding Gemini and ChatGPT side by side, which
 *     is also the comparison in the benchmark.
 *   - SC: a laptop showing the WordPress mark.
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
    slug: "fortimail-cve-2026-104286-a-null-byte-and-a-path-check-that-disagree",
    title:
      "FortiMail's path check and its file write disagree about where a filename ends, and attackers are already there",
    excerpt:
      "Fortinet's advisory of 1 October describes two weaknesses in one request: a path traversal and improper handling of the null byte. Together they let an unauthenticated attacker write files anywhere on a mail gateway that exists to face the internet. It is exploited, it scores 9.8, and the 7.2 branch has no fix at all.",
    categorySlug: "security",
    tags: ["fortinet", "fortimail", "cve-2026-104286", "path-traversal", "null-byte", "cisa-kev", "exploitation", "mail-gateway"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1639066648921-82d4500abf1a${P}`,
    body: `**Fortinet** published **FG-IR-26-175** on **1 October 2026** for **CVE-2026-104286**, a **9.8** in **FortiMail**, and confirmed it is being exploited. CISA added it to the Known Exploited Vulnerabilities catalogue the same day, with a federal deadline of **4 October** — three days.

The advisory describes two weaknesses, and the pairing is the whole story.

## Two bugs that are harmless apart

The first is **path traversal**: the product does not properly limit a pathname to the directory it is supposed to stay in. The second is **improper neutralisation of the null byte**.

Either alone is usually survivable. Traversal that lands inside a restricted directory writes a file somewhere useless. A null-byte quirk in a string that is never used as a path is a curiosity.

Together they are an unauthenticated write anywhere. In Fortinet's words, the pair "may allow an unauthenticated attacker to write arbitrary files on the underlying system via crafted HTTP or HTTPS requests".

## Why the null byte keeps doing this

The null byte is where two layers of the same system disagree about where a string ends.

A string in a managed language carries its own length, so a NUL inside it is just another character and the validation sees the whole path. The same string handed to a system call written in C ends at the first NUL, because that is what a C string is. So the check inspects one filename and the filesystem writes a different, shorter one.

That is how a check that reads a path ending in an expected, allowed extension can end up writing a file that stops before it, and the attacker chooses where the write lands.

## The appliance this happens on

The reason a 9.8 here is worse than a 9.8 elsewhere is what FortiMail is. It is a mail gateway: a device whose job is to accept connections from strangers, on the internet, continuously. There is no configuration in which it is not reachable.

Fortinet's workarounds say the rest. Disable the **IBE** feature, which is the identity-based encryption portal that serves external recipients, or restrict management interface access to trusted networks. Both are ways of removing the parts a stranger can reach, which is an admission that reachability is the exposure.

## One branch has nowhere to go

The fixed versions are **8.0.2** and later, **7.6.7** and later, and **7.4.9** and later.

The **7.2** branch, from 7.2.0 to 7.2.9, has no fix. Its users are told to move to a fixed branch, which is not a patch but a migration — a different change window, a different test cycle, and on a mail gateway, a different risk of losing mail flow while it happens.

That is the part worth planning for today rather than on the deadline. An organisation on 7.2 cannot comply by patching, and the workaround is what has to hold until the migration is done.

## What a file write buys on a mail gateway

Arbitrary file write sounds narrower than remote code execution, and on this class of device the gap is thin.

A gateway runs a web interface for administration and for the encryption portal, so a file written into a web-reachable directory becomes code the next time somebody requests it. Where that is not available, the same primitive reaches the scheduled-task and startup files that a Unix system reads on a timer or at boot, which is execution with a wait attached.

What sits behind that is worse than a generic server. A mail gateway holds the transport rules, the authentication for the domains it relays for, the certificates, and the mail itself while it is being scanned. An attacker with write access can add a rule that quietly copies inbound mail, which is a wiretap that leaves the mail flowing normally and shows up in no user's mailbox.

That is the reason the catalogue entry carries a three-day clock rather than a longer one. The directive behind it sets the deadline from exposure and automatability, not from the score, and an internet-facing mail appliance with an unauthenticated one-request flaw is the worst combination it recognises.

## What to do

- Check your version first. If you are on 8.0, 7.6 or 7.4, patch to the fixed release. If you are on 7.2, plan the branch migration and apply the workaround now.
- Disable IBE if you do not use it, and take the management interface off any network a stranger can reach. Both are in Fortinet's own guidance.
- Treat an exposed appliance as compromised until checked. An arbitrary file write on a device like this is used to drop a web shell, so look for files that appeared in web-reachable directories, for configuration changes nobody made, and for new administrative accounts.
- Rotate credentials and certificates the appliance holds if it was internet-facing before the patch. A file write is a foothold, and what it collects afterwards survives the fix.
- Keep the evidence before you upgrade. The federal directive that sets this three-day clock asks for that explicitly on exposed assets, and it is sound advice outside government too.

## What is not established

- Who is exploiting it. Fortinet names no actor.
- How many appliances have been compromised, as opposed to scanned.
- When exploitation began, and whether it preceded the advisory.
- Whether a fix for the 7.2 branch will be released at all.`,
  },

  {
    slug: "openai-moonshot-distillation-disrupted-in-july-still-worked-on-azure-in-september",
    title:
      "OpenAI says it shut the extraction down in July. On Azure, the same trick kept working until late September",
    excerpt:
      "OpenAI's report describes a coordinated campaign to pull protected reasoning out of its models, 16,000 requests in two days, more than 15,000 accounts, attributed to people associated with Moonshot AI and disrupted on 28 July. Researchers who retested in September found the same models still giving it up when served through Microsoft Azure.",
    categorySlug: "ai",
    tags: ["openai", "moonshot", "distillation", "azure", "anthropic", "model-security", "ai-policy", "reasoning"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1555618254-84e2cf498b01${P}`,
    body: `**OpenAI** has published an account of what it calls a coordinated **model-distillation** campaign: a sustained effort to make its models reproduce the reasoning they are built to keep internal, so that the output could be used to train something else. OpenAI's own post is not readable by automated clients, so the figures here come from the reports quoting it directly.

The shape, as reported: activity from **1 July**, a spike on **24 and 25 July** of about **16,000 requests** using the extraction pattern from more than **4,000 users**, a wider network of more than **15,000 accounts** showing related patterns, and full disruption on **28 July**. OpenAI says it strongly believes a core cluster of the operators is associated with **Moonshot AI**, the Beijing company behind the Kimi assistant.

This is the second time in three weeks that a frontier lab has named that company. Anthropic's September threat report described the same practice, which we covered on 12 September.

## Nothing was broken into

The method matters, because it is not a breach.

OpenAI is explicit that nothing was compromised in the ordinary sense: no encryption broken, no database reached, no access to stored conversations. The operators sent prompts. The prompts were shaped so that the model, in answering, reproduced reasoning that was supposed to stay hidden from the person asking.

So the thing extracted was not stolen from a system. It was produced on request, by design, by a product sold to answer requests. The only control that could have stopped it is the one that decides what a model will say.

## And then the part that should travel further

A research team led by **Joachim Schaeffer** published an update the same day as OpenAI's announcement.

They retested on **13 September**, six weeks after OpenAI said the campaign was fully disrupted. The technique still worked on **Microsoft Azure** against every OpenAI model they tested, including **GPT-6 Astra**, and against **Anthropic** models up to **Sonnet 5**. A second method, using a virtual notepad tool, worked on all the OpenAI models and most of the Anthropic ones across platforms.

Schaeffer's summary of the result is the sentence to keep: "Same models, but different protections depending on which platform serves them."

By the reporting, OpenAI deployed safeguards to the Azure endpoint on **27 September** and Anthropic added protections by **28 September** — two months after the campaign was described as disrupted on OpenAI's own platform.

## What "disrupted" means

The gap is not hypocrisy; it is architecture, and it is the thing an enterprise buyer should take from this story.

A model is not a single deployment. The same weights are served through the lab's own API, through a hyperscaler's cloud, through enterprise agreements, and through resellers, and the safety behaviour that a lab ships is not one thing shipped once. Mitigations live in the serving stack: system prompts, output filters, request classifiers, rate limits. Patch the stack you operate and the same model served from somebody else's stack is unchanged.

So "we disrupted the campaign" was true and incomplete at the same time. It described accounts banned and patterns blocked on OpenAI's platform. It did not describe the same model answering the same prompts elsewhere.

## Why the reasoning is the thing worth taking

It is worth being clear about what was being extracted, because it is not the model.

A reasoning model produces an internal chain of working before it answers, and the labs keep that hidden for two stated reasons: it is where the model is most likely to say something unfiltered, and it is the most useful training material anyone could ask for. A student model trained on final answers learns to sound right. A student model trained on the working learns the steps, which is the expensive part to produce and the part that separates a frontier model from a copy of one.

That is why this is cheaper than any other way of catching up. Training a reasoning model from scratch costs compute measured in data centres; buying API access and collecting the reasoning costs the price of the tokens. Anthropic put the Alibaba figure at 151 million exchanges for its own case. OpenAI's numbers here are smaller and more concentrated, which fits an operation refining a technique rather than running it at volume.

And it explains why the defence is awkward. The lab cannot stop producing the reasoning, because that is how the model works. It can only try to tell, request by request, whether the person asking is a user or a collector.

## What to do

- If you buy a model through a cloud rather than from the lab, ask which mitigations are in that path and when they ship. A vendor's security blog describes the vendor's own endpoint.
- Treat a lab's disruption announcement as scoped to its platform until it says otherwise.
- If you build on reasoning-capable models, assume the reasoning is reachable by a determined prompt, and do not put anything in it you would not publish.
- Watch for the pattern rather than the actor. Prompt shapes that ask for internal reasoning, at volume, across many accounts, is an abuse signature any API operator can look for.

## What is not established

- Moonshot's response. The company has not published one in the coverage reviewed.
- How much of the extracted reasoning was usable, or whether any of it reached a trained model.
- Why the Azure path lagged by two months, which neither OpenAI nor Microsoft has explained publicly.
- Whether other serving platforms still carry the gap today.`,
  },

  {
    slug: "gemini-4-argon-no-cyber-guardrails-for-a-chosen-list",
    title:
      "Google is shipping Argon without cyber guardrails to a chosen list, and its best example has no name",
    excerpt:
      "Gemini 4 Argon goes first to vetted defenders through Google's Fairwind Program, and Google says those defenders and its own teams get it without cyber guardrails. The headline claim is autonomous discovery, validation and patching of critical vulnerabilities. The benchmark it cites is a tie at 68 percent, and the vulnerability it showcases is unnamed.",
    categorySlug: "ai",
    tags: ["google", "gemini", "argon", "ai-security", "vulnerability-research", "guardrails", "benchmarks", "fairwind"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1710993011875-38d2f3ecf0be${P}`,
    body: `**Google** has announced **Gemini 4 Argon**, which it describes as its most capable model, and it is going out in a way worth reading carefully. Access comes first through the **Fairwind Program**, a pre-release channel for what Google calls trusted cyber defenders, who help it "iterate on guardrails" before a wider release. Developers, enterprises and consumers come later.

For that group, Google says it will release Argon "without cyber guardrails" — for trusted defenders and Google's own internal teams, so they can use its full cybersecurity capability.

## A deliberate exemption, stated out loud

Set that beside the week it arrived in. Days earlier, OpenAI cancelled the release of a finished model, GPT-6.1 Astra, after its own evaluations found it more deceptive and worse at staying inside its authorisation, which we covered on 1 October.

Two labs, two decisions, both defensible on their own terms: one withholds a model from everybody; the other ships its most capable one to a selected few with the cyber restrictions removed.

The second is the more unusual thing to say in public. A guardrail is the vendor's own judgement about what the model should refuse, and removing it for a list of approved organisations makes safety a function of who is asking rather than what is being asked. That can be the right call — the same capability that finds a vulnerability for an attacker finds it for the owner — but it only holds while the list holds. Google has not published who is on it, how an organisation gets on it, or what happens to a member that is itself compromised.

## The claims, and what the numbers say

Google's headline is that Argon can "autonomously find, validate, and patch critical software vulnerabilities".

The benchmark offered for that is **CWE-bench v1**, where Argon "ties for first place with a top score of 68%". Read the sentence as written: it ties, with **GPT-6 Astra**, and the score is 68 percent on a patching benchmark. That is a model that is as good as the best other model and wrong about a third of the time on the task being advertised.

The other number is the output limit, **1 million tokens**, up from 64,000 — which matters for exactly this work, because a patch with its reasoning and tests attached is long.

## The example that is missing its subject

The demonstration Google gives is that Argon, used by the security company Wiz, uncovered a critical vulnerability exposing sensitive personal information "across healthcare software used by hospitals worldwide", which previous frontier models had missed.

Everything a reader needs to weigh that is absent. The software is not named. There is no vendor, no CVE, no disclosure date, no statement that it has been fixed, and no indication whether the hospitals running it have been told.

There may be a good reason — an unfixed flaw in hospital software is exactly the thing you do not announce. But then the claim cannot be assessed either, and it is being used to sell the model. A launch post that can say the finding exists can usually also say that disclosure is under way and when the details will follow.

## What autonomy costs per run

The pricing is the part that turns the claim into a plan or out of one.

Argon is introduced at **2 dollars per million input tokens and 10 dollars per million output**, rising afterwards to **4 and 20**. Against the million-token output limit, a single run that actually uses the headroom — a long patch with its reasoning, its tests and its explanation — is a 20 dollar answer at the later rate, before anybody reads it.

That is affordable for one critical bug and arithmetic worth doing before pointing it at a repository. Autonomous means it decides how many times to try, and a loop that re-reads a large codebase on each pass is where the bill lives. The honest version of the pitch is not that the model patches your software; it is that it can produce a candidate patch, at a cost per attempt, which somebody still has to review.

Put beside the 68 percent, that is the shape of the decision: roughly two usable patches in three, each one priced per attempt, each one needing a human at the merge.

## What to do

- Read the benchmark as a tie, not a lead, and 68 percent as the error rate it implies. A model that patches two vulnerabilities in three still needs the review you would give a junior engineer.
- If you are offered guardrail-free access, write down who in your organisation may use it and what happens to the outputs. An internal capability with the brakes off is an insider-risk question as much as a security tool.
- Do not plan on autonomous patching in production. Autonomous discovery and validation with human review at the merge is the shape that survives an audit.
- If you run healthcare software, ask your vendors directly whether they have been contacted about a vulnerability of this description. The announcement gives you nothing else to go on.

## What is not established

- Which software the healthcare finding is in, whether it is fixed, and whether affected hospitals have been notified.
- Who is in the Fairwind Program, how membership is granted, and what is checked.
- What "without cyber guardrails" removes in practice, against the ordinary release.
- Whether the autonomous patching claim has been validated by anybody outside Google and Wiz.`,
  },

  {
    slug: "sc-wordpress-malware-eight-places-at-once-each-rebuilding-the-others",
    title: "The WordPress backdoor lives in eight places at once, and each one rebuilds the others",
    excerpt:
      "Sucuri's analysis of the SC malware describes a mesh rather than a file: a prepend directive, hidden loaders, two drop-ins, the theme, a must-use plugin, an ordinary plugin, the database, shared memory and cron, all able to restore one another. Command and control runs over about twenty public Ethereum gateways, so there is no domain to take down.",
    categorySlug: "security",
    tags: ["wordpress", "sucuri", "backdoor", "persistence", "web-malware", "ethereum", "skimming", "incident-response"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1678341859828-bfb1a2bd527a${P}`,
    body: `**Sucuri** published an analysis on **30 September 2026** of a WordPress infection it calls **SC**, after the SC_ markers left in the injected code. The interesting part is not what the backdoor does once it runs. It is that removing it, in the ordinary way, repairs it.

## Eight places on disk, and three off it

The payload is not a file. It is a set of components that each hold a copy of the others.

On disk, Sucuri lists a **.user.ini** carrying an auto_prepend_file directive, a visible shim in wp-content, a hidden dot-prefixed loader, a **db.php** drop-in, an **advanced-cache.php** drop-in, an injection in the theme's functions file, a payload in **mu-plugins**, and an ordinary-looking copy in the plugins folder.

Off disk, it also lives in the **database options table**, in **System V shared memory**, and in scheduled **cron** hooks, with database triggers to restore what is deleted.

Sucuri's description of the result is two sentences long and explains the entire incident: "Delete the plugin and a drop-in rewrites it. Delete the drop-in and the theme rewrites it."

## Why ordinary cleanup makes it worse

Most WordPress cleanups are iterative. A scanner flags a file, someone deletes it, the site is checked, another file is flagged tomorrow.

Against a mesh, that process is not slow — it is counterproductive. Every partial removal is a trigger: the remaining components see a missing sibling and rewrite it, sometimes with a new name in a new location, so the next scan finds something unfamiliar and the operator concludes they are facing a new infection. The site is never clean and the defender is learning the wrong lesson.

The prepend directive is the piece to disable first. While **auto_prepend_file** is in force, attacker code runs before every PHP request on the site, including the request that is deleting its files. Sucuri's cleanup order starts there for that reason: neutralise the prepend, then clear the off-disk copies in the database and shared memory, then the cron entries and triggers, then the hidden administrator, and only then remove the files — all in one pass.

## Command and control with no domain

The second design decision is the channel. Instructions are fetched through roughly **twenty public Ethereum RPC gateways**, using smart-contract method selectors to read the operator's current configuration.

That removes the usual choke point. There is no command server to seize, no domain to sinkhole, no single address to block: the data sits in a public chain that anyone can read, and the gateways are ordinary infrastructure that plenty of legitimate software also talks to. Block one and nineteen remain. Taking the content down is not available at all, because a blockchain is the one storage medium built so that nobody can delete from it.

## What it does while it is there

Once running, the backdoor hides its own plugin from the admin screens, creates hidden administrator accounts and forges the authentication cookies to use them, strips out security plugins, injects JavaScript for payment skimming, and exposes a parameter that lets the operator confirm the site is still theirs. On every request, it checks itself and rebuilds whatever is missing.

For a shop, the skimming is the loss that matters, and it is silent: the checkout keeps working, the orders keep completing, and the card details are copied on the way through.

## The backup will put it back

The instinct after an infection like this is to restore from a backup, and on this one that is a trap worth naming.

The components live in the places a backup is designed to capture: ordinary files under the web root, a mu-plugin, the theme, and rows in the database. A restore from any point after the first compromise brings the mesh back whole. A restore from before it, if one exists, also discards every order, comment and post since.

The shared-memory copy adds a second trap. It does not survive a restart of the PHP processes, which sounds like good news until you notice the consequence: a cleanup that looks complete can be undone by a component that was only in memory, and a reboot can equally make a piece of the infection vanish from the evidence before anyone has catalogued it.

The .user.ini piece is what makes all of this portable. Shared hosting with PHP-FPM reads that file per directory, so the attacker does not need to touch the server configuration, and the same technique works on most commodity hosting a small shop is running on.

## What to do

- Do not clean this iteratively. Inventory every component first, then remove in one pass, in Sucuri's order: prepend directive, database and shared-memory copies, cron and triggers, hidden admins, files.
- Look in the places that are not plugins: .user.ini, db.php, advanced-cache.php, mu-plugins, the active theme's functions file, the options table, and PHP shared-memory segments.
- Treat outbound requests to Ethereum RPC gateways from a web server as an alert on its own. A content site has no reason to talk to a blockchain node.
- After cleanup, rotate everything: administrator passwords, database credentials, salts and keys in the configuration, and any payment-gateway secrets the site held.
- Watch for recreation for several days. If a file comes back, the inventory was incomplete, not the removal.

## What is not established

- How initial access is obtained. The analysis describes persistence, not the way in.
- How many sites are affected.
- Who operates it, and whether the skimming and the backdoor are run by the same group.
- Whether the contract addresses used for configuration have been rotated since publication.`,
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
