/**
 * Drafts the 9 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-94.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-94.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-94.ts --update
 *
 *   1. Sungrow iSolarCloud CVE-2026-107194 (security). One field set to 5 and
 *      the password is ignored. The second story is that the researcher's own
 *      speculation about continent-wide blackouts was quoted into the official
 *      CVE description, where it now reads as impact.
 *   2. Double Counter (security). A Discord anti-abuse bot breached through a
 *      Metabase instance on a server it had already migrated away from. Its
 *      own email count and the count in the published data disagree by a
 *      factor of four.
 *   3. Sixteen Firefox wallet extensions (security). Four of them are Rabby's
 *      real codebase with the import function hooked, exfiltrating to
 *      Cloudflare Workers — the trusted-host pattern again, two days running.
 *
 * Primary sources: Jakkaru's write-up and the MITRE CVE record for Sungrow,
 * Double Counter's own disclosure plus Have I Been Pwned's count and Discord's
 * statement, and Socket Threat Research for the extensions.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - Sungrow: a rooftop solar array, which is what sits behind the accounts.
 *   - Double Counter: a server aisle, for the machine nobody switched off.
 *   - Extensions: a laptop with a browser open, which is where these run.
 *
 * Rejected on the way: a Ledger hardware wallet (a brand with nothing to do
 * with this, and the device that defeats the attack rather than its target)
 * and a VS Code shot carrying a stranger's username in the file path.
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
    slug: "sungrow-isolarcloud-cve-2026-107194-one-field-set-to-five-ignores-the-password",
    title:
      "One field set to five logged the researcher in as anyone, and the account owner was never told",
    excerpt:
      "Sungrow's iSolarCloud accepted a login request with login_type set to 5 and authenticated whoever the request named, ignoring the password. All four regional clouds were affected, no notification was sent, and the researcher's own line about continent-wide blackouts has been quoted into the official CVE description.",
    categorySlug: "security",
    tags: [
      "sungrow",
      "isolarcloud",
      "cve-2026-107194",
      "authentication-bypass",
      "solar",
      "critical-infrastructure",
      "jakkaru",
      "energy",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1745187946672-2c1d8cf26a2b${P}`,
    body: `**Sungrow** is one of the largest makers of solar inverters in the world, and **iSolarCloud** is the platform its installations report to and are managed from. Researchers at the German firm **Jakkaru** found that its login endpoint would authenticate whoever a request named, without checking the password.

The identifier is **CVE-2026-107194**, scored **9.2**, filed as CWE-288 — authentication bypass using an alternate path.

## The mechanism

Logins to iSolarCloud carry a **login_type** field. The documented values do what you would expect: **1** is a normal password login, **8** is a login by emailed code.

Setting it to **5** logged the researcher straight into the account named in the request. In their own description, the password field is ignored.

Three things were needed to use it: a valid target email address, knowledge of the parameter, and the ability to encrypt the request, since Sungrow's REST API uses asymmetric encryption. That last requirement is a real step and most coverage has dropped it — but it is an implementation detail of the client, not a secret, and it does not survive contact with anyone willing to read their own traffic.

Finding the email was not hard either. A user can see the email and username of their **parent organisation**, which walks the hierarchy upward. Jakkaru also reports a separate, undisclosed information leak that surfaced support and administrator addresses belonging to two large German installers.

All **four regional clouds** — Europe, China, Australia and International — were affected. It was not a firmware bug in a particular inverter; it was the platform every inverter talks to.

## What the account is worth

An ordinary account shows one site. An administrator account was considerably more: Jakkaru lists enumerating and modifying plants, starting and stopping inverters and battery storage, reaching every organisation and registered user, and in some cases **installing firmware** on connected devices.

The detail with the longest reach is the quietest one. **No login notification was sent** — no email, nothing. An account taken this way did not announce itself to its owner, so the only record is in logs nobody outside Sungrow could read.

## The blackout line is the researcher's, and it is now in the CVE

Here is where this story becomes two stories.

The official **MITRE CVE description** for CVE-2026-107194 reads, in part, that the flaw potentially leads to "local blackouts on the whole continent" in Europe — with the quotation marks in the record itself.

That phrase comes from the researcher's own write-up, where it appears as an argument about market share: that Sungrow's position in Germany and Europe has reached a point where unauthorised access becomes a question of national security. It is a reasoned opinion. It is not a modelled result, and no grid operator is cited.

A CVE description is the text that propagates. It goes into scanners, dashboards, ticket queues and briefing notes, usually stripped of the context around it. A speculative clause about continental blackouts, wrapped in quotation marks and placed in the field that everything downstream reads as impact, will be repeated far more often than the paragraph it came from.

The flaw is serious without it. A password check that can be skipped on a platform controlling fleets of grid-connected hardware needs no amplification.

## What Sungrow says, and the timeline that does not settle

Sungrow's account, via trade coverage, is that it reviewed platform logs for the period the flaw existed and **found no evidence that anyone other than the reporting researcher had used it**, and no sign of customer data leaks, service interruption or unauthorised manipulation.

The timeline is where accounts diverge. The researcher writes that Sungrow published a patch **within a day** of being told. Trade reporting gives dated steps instead: reported **22 August**, emergency patch **25 August**, a follow-up test in mid-September confirming the fix. Public disclosure came in early October, and the CVE was published on **7 October**.

Those are not the same story. Three days is still a fast vendor response, and the gap may be the difference between a hotfix and a root-cause fix — but nobody has said so, and we are not going to assume it.

## What to do

- If you operate Sungrow equipment through iSolarCloud, the fix is server-side and already deployed; there is nothing to patch on your own hardware. The question worth asking your installer is whether anything in your account changed between August and now.
- Treat **no login notification** as the finding to act on generally. Any platform that manages physical equipment and does not tell an account holder about a new session has removed the one control the account holder has.
- For fleet operators: ask who in your supply chain can reach your plants through a vendor cloud, and what that vendor's account recovery and notification behaviour actually is.
- Read a CVE description as a summary written by somebody, not as a measurement.

## What is not established

- Whether the patch came in a day or in three. The researcher and the trade reporting disagree, and neither explains the other.
- Whether anything approaching a grid impact was ever demonstrated. The blackout phrasing is an argument about market share, repeated inside the CVE record.
- How many installations were reachable. The widely quoted figures of roughly 470,000 in Europe and 250,000 in Germany come from secondary reporting; the researcher's own figure is the company's claim of more than 1,000 GW of converters shipped worldwide as of December 2025, which counts something else entirely.
- What the undisclosed information leak that exposed installer addresses actually was.
- Whether Sungrow's log review could have detected this method, given it generated an ordinary authenticated session and no notification.`,
  },

  {
    slug: "double-counter-discord-bot-breach-the-server-they-had-already-moved-off",
    title:
      "The breach came through a server the company had already migrated away from, still running an analytics tool",
    excerpt:
      "Double Counter, an anti-abuse bot used across large Discord communities, was breached on 4 October through a publicly reachable Metabase instance on an old host from its previous setup. The attacker forged an admin session, reached a cloud key, and copied records on about 28 million accounts.",
    categorySlug: "security",
    tags: [
      "double-counter",
      "discord",
      "data-breach",
      "metabase",
      "shadow-infrastructure",
      "bot-token",
      "have-i-been-pwned",
      "incident-response",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1584169417032-d34e8d805e8b${P}`,
    body: `**Double Counter** is an anti-abuse bot: Discord servers add it to catch alt accounts and ban evasion. To do that it keeps records on the people who join those servers. On **4 October** somebody took them.

The entry point is the part worth reading twice.

## A machine nobody turned off

The attacker did not go through Double Counter's current infrastructure. They went through an **old OVH server from a previous hosting setup**, which was still running a publicly reachable **Metabase** analytics instance.

From there it was a short walk. The attacker forged an **administrator session** in Metabase, which gave access to stored credentials. Those included a **cloud service-account key with administrator rights**, an administrator's saved command-line session, and the **Discord bot token**.

Nothing here required a novel exploit against the live service. The live service was never the way in. A box that had been migrated away from, left running with an analytics tool exposed, held credentials to everything that replaced it.

This is the same shape as infrastructure that is forgotten rather than decommissioned — [a DNS record pointing at something nobody owns any more is the version of this that gets written about most](/article/dangling-dns-subdomain-takeover-silent-push). The common factor is not the technology. It is that migrations are judged complete when the new thing works, not when the old thing is gone.

## The timeline shows a response that did not arrive in time

Double Counter's own disclosure is unusually precise about the clock, and the sequence is uncomfortable:

- **12:03** — the attacker gets in.
- **13:39** — a first token invalidation. Something had been noticed.
- **15:09 to 15:34** — the data is copied.
- **About 17:55** — access ends.

An hour and a half passed between the first defensive action and the exfiltration, and the exfiltration still happened. Rotating one credential while an attacker holds an administrator key and a live shell session is not containment; it closes one door in a building where they have the master key. The useful lesson is about scope: once a service-account key with admin rights is gone, individual token rotations buy nothing until that key is revoked.

## What was taken

By Double Counter's own numbers, the copied data covers roughly:

- **28 million** Discord IDs and usernames.
- **27 million** IP address and location records — country, region, city, postal code and ISP.
- **About 25 million** user-agent hashes.
- **About 1 million** unique email addresses.

The last figure is contested, and not by an attacker. **Have I Been Pwned** lists roughly **275,000** unique addresses in the data that was actually published — around a quarter of Double Counter's estimate.

Both can be true: a company counting what an attacker could have taken and a researcher counting what appeared in public are measuring different things. But the gap is worth naming rather than averaging, because the two numbers answer two different questions, and only one of them has been verified against the data.

The stolen bot token was used as well. The attacker granted themselves administrator rights on the support server, reversed a staff ban, and sent invitations across roughly **50 large Discord servers**. A stolen Stripe key produced **7,316 dollars** in fraudulent charges on a company card.

## The bot was the aggregation point

There is a structural point here that applies well beyond this one service.

The data was not Discord's to lose, and Discord has said so: it confirmed awareness, stated that this was not a breach of Discord, and disabled new installs of the app pending investigation. That is accurate.

It is also the problem. A third-party bot added to a server for moderation collects, by design, the identifying details of everyone who joins — and does it across thousands of communities at once. The individual user never agreed to anything with Double Counter, never heard of it, and in most cases could not have named the bots running in a server they joined. The aggregation happened at a layer nobody was looking at, and the security of it was whatever one small team's oldest server happened to be.

## What to do

- Inventory what you have migrated away from, not only what you run. The question is not what is in production; it is what is still powered on and routable.
- Treat an analytics or BI tool as a credential store, because it is one. Metabase holds connection details for everything it reports on.
- Write the containment order down before you need it: revoke the broadest credential first. Token rotation while an admin key is live is motion, not progress.
- If you run a Discord community, look at which bots you have added and what each one retains. Permissions granted in a hurry years ago are still granted.

## What is not established

- Which Metabase flaw or technique was used to forge the administrator session.
- Why the true email count differs from Double Counter's estimate by roughly a factor of four.
- What was noticed at 13:39, and why the response stopped at a token rotation.
- Whether the copied data beyond the published subset has been circulated.
- Whether Discord will require anything of app developers as a result, beyond pausing installs of this one.`,
  },

  {
    slug: "firefox-wallet-extensions-the-real-wallet-code-with-one-function-hooked",
    title:
      "Four of the fake wallets were the real wallet's code with the import function hooked",
    excerpt:
      "Socket found sixteen Firefox extensions impersonating crypto wallets. Four were built from Rabby Wallet's actual codebase with the recovery-phrase import hooked to send secrets out; twelve were lighter copies of an OKX-styled interface. Both sets exfiltrated to Cloudflare Workers, and Mozilla has unpublished all sixteen.",
    categorySlug: "security",
    tags: [
      "firefox",
      "browser-extensions",
      "socket",
      "crypto-wallet",
      "rabby",
      "seed-phrase",
      "supply-chain",
      "cloudflare-workers",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1596457596396-b7a8d247181b${P}`,
    body: `**Socket Threat Research** has catalogued **sixteen Firefox extensions** that impersonated cryptocurrency wallets in order to collect recovery phrases and private keys. Mozilla had unpublished all sixteen by **5 October**.

The interesting half is how four of them were built.

## The real wallet, plus a hook

Four of the extensions were not imitations of **Rabby Wallet**. They were Rabby Wallet — the full codebase, taken and rebuilt, published under a name that reads as the original at a glance and is not: **Raabby WaIIet**, with a doubled letter and capital I standing in for lowercase L.

The modification was narrow. The **import function** — the code that runs when a user pastes a recovery phrase or private key into the wallet to restore it — was hooked, so that the secret was sent out as well as used. The exfiltration went by HTTP GET to endpoints on **Cloudflare Workers**.

Everything else worked. That is the point of starting from the real thing: the extension behaves correctly, because it is the correct software. There is no broken screen, no missing feature, nothing that fails in a way a careful user would notice. The only abnormal moment is the one where the user hands over the one secret that matters, which is also the moment the product is supposed to ask for it.

The other twelve were cheaper work: a lighter interface modelled on **OKX Wallet**'s branding, presented as a generic wallet, posting captured seed phrases as JSON to similar Worker endpoints.

Socket links the whole set to a campaign it reported in **August**, with high confidence, on shared code, shared infrastructure and a common marker string across the builds.

## Cloudflare Workers, again

The exfiltration endpoint is the part that should feel familiar if you read [yesterday's piece on a botnet that resolves its command server out of a poem hosted on GitHub](/article/poellm-canto-incognito-the-c2-address-is-four-words-in-a-poem). Different campaign, different crime, same reasoning.

Traffic to a Cloudflare Workers domain from a browser is traffic to one of the most widely used edge platforms on the internet. It is not going to be blocked at a corporate egress point, it carries a valid certificate, and it reaches a subdomain nobody can distinguish from legitimate application traffic without inspecting content.

We wrote yesterday that the list of services every network must allow out to is short, well known, and being worked through. It is a day later and here is the next entry on it.

## Removing the extension does not help

Socket's own guidance is the sentence this site keeps writing: a user who entered a recovery phrase into one of these should treat the wallet as compromised, create a **new wallet in a clean environment**, and move the assets. Uninstalling does not undo it.

That is worth being precise about, because the intuition is wrong in a specific way. A recovery phrase is not a password on a server that someone can reset. It is the key material from which the wallet's addresses are derived. Once it has been copied, whoever holds it has the wallet, permanently and from anywhere, whether or not the software that leaked it is still installed. There is no revocation. There is only moving the funds somewhere the attacker has no key for, before they do.

This is the fourth time in three weeks the same correction has applied. [Packages pulled from npm do not uninstall themselves from the machines that already have them](/article/malfex-npm-three-years-37000-downloads-and-three-packages-still-installable). [A Kibana integration deleted after it hijacked a data stream leaves the redirection in place](/article/kibana-cve-2026-102406-one-tenant-could-claim-anothers-data-stream). Delisting an extension stops the next install and nothing else.

Removal is the step that ends distribution. It is persistently mistaken for the step that ends the incident, and the two are not close together.

## What the store check cannot catch

It is tempting to read sixteen malicious extensions as a review failure, and partly it is. But consider what review is being asked to do here.

Four of these submissions were a legitimate open-source wallet's source, which reviews cleanly because it is the real thing, with one hooked function somewhere inside it. The name differs from the original by a doubled letter and a glyph substitution that is invisible in most interface fonts. The exfiltration target is a platform that half the web uses.

A review process catching that reliably is a review process reading every line of a large codebase against its upstream, for every submission, forever. The structural answer is probably not better review but fewer places a secret can be typed — which is the argument for hardware wallets and for wallet software that never asks for a phrase outside a flow the user initiated.

## What to do

- If you restored a wallet in a Firefox extension recently, check what it was called. The impersonations differ from the originals by a character.
- If you entered a phrase into one of these, move the assets now, from a clean machine, to a wallet generated there. Uninstalling is not a remedy.
- Install wallet extensions only from the vendor's own link, not from a store search. Search ranking is the attack surface here.
- For organisations: extension installs are software installs. A browser extension with access to a page has access to what is typed into it.

## What is not established

- How many installs the sixteen extensions had between them, or how many people entered a phrase.
- How much, if anything, was stolen.
- Who is behind the campaign, beyond Socket's linkage to its own August reporting.
- How the four Rabby-derived builds passed review, and whether the hook was present at submission or added in a later version.
- Whether equivalent builds exist for other browsers.`,
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
