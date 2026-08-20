/**
 * Long-form drafts — 21 August 2026.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, and cannot read a table.
 * Each section's strongest paragraph therefore stands alone and carries its own
 * figures rather than leaving them in a table above it.
 *
 * Sourcing note: the Facebook piece is the most mythologised subject on the
 * site, so it asserts only what is documented — the settlement structure, the
 * domain prices, the Facemash traffic — and says plainly where the popular
 * version is a screenwriter's invention rather than guessing at motives.
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
    slug: "siemens-s7-plc-ai-written-snap7-tooling-five-agency-advisory",
    title:
      "Five US agencies say the tooling aimed at Siemens PLCs was written with AI — and it is disguised as monitoring software",
    excerpt:
      "The NSA, CISA, FBI, Department of Energy and EPA issued a joint advisory on Siemens S7 controllers. The exploitation scripts are Python built on snap7, they masquerade as legitimate OT monitoring tools, and they give read and write access to PLC memory and ladder logic. The assessed purpose is not disruption yet — it is being ready for it.",
    categorySlug: "security",
    tags: [
      "ics",
      "operational-technology",
      "siemens",
      "cisa",
      "critical-infrastructure",
      "ai-assisted-attacks",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1717386255773-1e3037c81788${P}`,
    body: `On **19 August 2026** five US agencies — the **NSA**, **CISA**, the **FBI**, the **Department of Energy** and the **EPA** — issued a joint advisory about an active threat to **Siemens S7 series** programmable logic controllers.

Five signatures is the part to read first. An advisory co-signed by the energy department and the environmental agency alongside three intelligence and law-enforcement bodies is not a routine vulnerability note. It is a statement about which sectors are considered at risk.

## What "AI-powered" actually means here

The phrase gets attached to almost anything, so it is worth being precise about what the agencies describe.

Threat actors are using AI to write **Python** exploitation scripts built on the **snap7.dll** and **python-snap7** libraries — the standard open-source way to talk to Siemens controllers. The resulting tools are then dressed up as legitimate **operational technology monitoring software**, and they provide read and write access to PLC memory, configuration data and **ladder logic** programs over the **S7comm** protocol.

So the AI part is authorship, not autonomy. Nothing here is a model running an attack by itself. What it removes is the specialist barrier: writing OT tooling used to require someone who knew both industrial protocols and the target hardware, and that person was rare. The libraries were always public. The knowledge of how to use them was the scarce part, and that is what has been commoditised.

Read alongside [the Minnesota water systems disrupted with no exploit at all](/article/minnesota-water-plc-attacks-no-exploit-needed), the direction is consistent: the skill required to reach into an industrial process keeps falling.

## Which controllers and which sectors

| Affected | Named sectors |
| --- | --- |
| S7-200, S7-300, S7-400 | Critical Manufacturing, Energy |
| S7-1200, S7-1500 | Water and Wastewater, Chemical |
| | Food and Agriculture, Commercial Facilities |
| | Defense Industrial Base |

That is not a niche product line. The S7 family spans controllers installed over decades, including generations designed long before anyone assumed they would be reachable from the internet.

## How the targets are found

Not by scanning, necessarily. By searching.

The advisory describes attackers using **Censys** and **ZoomEye** — public internet scanning services — to locate exposed devices, then exploiting critical and high-severity vulnerabilities, outdated software and weak authentication.

Every one of those is a service any defender can also query, which is the practical takeaway: if your PLCs are findable this way, you can find them the same way, today, before anyone else does.

## The assessed intent is the uncomfortable part

The agencies characterise the activity as **persistent reconnaissance**, potentially preparing for disruption to critical infrastructure — including stealing sensitive data, damaging equipment, causing extended downtime, or leading to safety incidents.

Nobody is claiming a plant has been stopped. What is being claimed is that somebody is mapping the ability to stop one, and that read-write access to ladder logic is not something an intruder acquires for intelligence value alone. Ladder logic is the program that decides what a physical process does. Write access to it is the difference between watching a pump and controlling it.

That is also why the safety framing appears in a cyber advisory. In an IT breach the worst case is data. Here it is equipment and people, which is what [the Polish CHP plant turbine shutdown](/article/polish-chp-plant-private-apn-wago-turbine-shutdown) demonstrated in practice.

## What to do

- **Inventory your S7 controllers.** The advisory's first recommendation, and the one most organisations cannot complete, because nobody holds a current list.
- **Take them off the internet.** Not "restrict" — remove. A PLC has no reason to accept connections from arbitrary hosts.
- **Check Censys and ZoomEye for your own addresses.** The reconnaissance step is public. Use it.
- **Patch, then accept that some cannot be.** An S7-300 in a running plant may have no supported update path, which makes network isolation the control rather than a supplement to it.
- **Alert on S7comm traffic from anything that is not your engineering workstation.** The protocol is the signal; unexpected sources speaking it are the finding.
- **Treat OT monitoring software as a supply-chain surface.** The tooling here impersonates exactly that category, so provenance matters more than the name in the window title.

## What is not established

- **Who is behind it.** No actor or country has been named in the advisory.
- **Whether any physical impact has occurred.** The activity is described as reconnaissance and pre-positioning.
- **How many devices are affected.** No count has been published.
- **Which AI tools were used.** The advisory describes AI-assisted development without naming a model or service.`,
  },
  {
    slug: "password-spraying-155x-huntress-ropc-azure-cli-mfa-gaps",
    title:
      "Fifteen of the twenty-three had MFA — and it did not apply to the door the attacker used",
    excerpt:
      "Huntress reports password spraying up 155x in the first half of 2026, driven by a campaign against Azure CLI that abuses ROPC, a deprecated OAuth grant which posts your username and password straight to the token endpoint with no interactive MFA prompt. In two weeks it made 81 million login attempts.",
    categorySlug: "security",
    tags: [
      "microsoft",
      "azure",
      "mfa",
      "identity",
      "password-spraying",
      "conditional-access",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1742094561291-069d8f61a34a${P}`,
    body: `**Huntress** published research on **19 August 2026** reporting a **155x** increase in password spraying attacks over the first half of 2026.

Take that multiple with some care — the firm does not state the baseline it is measured against, and a very large multiple of a very small number is a different story from a very large multiple of a large one. What the rest of the research contains is more useful than the headline figure anyway.

## The campaign

Huntress tracks it as **LSHIY**, and the target is Microsoft's **Azure CLI**.

In the peak fortnight in **mid-June 2026** it generated more than **81 million** login attempts and produced **78** account compromises. Infrastructure ran through an IPv6 range on a bring-your-own-IP service, later shifting to the providers **FranTech** and **3xK Tech**.

Note the ratio. **81 million** attempts for **78** accounts is a hit rate close to zero, and it did not need to be better than that. Spraying is a volume business, and the cost of an attempt is now effectively nothing.

## The mechanism: a grant that was designed without MFA

The interesting part is not the volume. It is the door.

**ROPC** — Resource Owner Password Credentials — is a deprecated **OAuth 2.0** grant type. It sends the username and password straight to the token endpoint, with no interactive prompt. That is the entire design: it exists for legacy applications that cannot open a browser window.

No interactive prompt means no place to put an MFA challenge. So an authentication path built for a world before MFA is still there, still accepted, and still hands out tokens to whoever has the right password.

That is a general pattern worth naming: **a security control only covers the authentication paths it can be inserted into.** The same shape appears in [the passkey attack paths in Entra](/article/passkey-attacks-2026-synced-keys-entra-windows-hello) and in [the ADFS signing keys that make the login irrelevant](/article/adfs-signing-keys-machine-dpapi-golden-saml-ghost-certificate).

## Why MFA did not save most of them

Huntress analysed **23** affected organisations. **8** had no MFA at all.

The other **15** are the story. They had MFA, and it did not apply to the attacker's sign-in attempts — because the policies were scoped to certain applications or user groups, because they relied on trusted locations, or because they were still in **report-only** mode.

Report-only is the one to sit with. It is the intended way to test a Conditional Access policy before enforcing it, and it is also a policy that logs what it would have blocked and blocks nothing. An organisation in that state has a dashboard showing MFA working and an authentication path where it is not.

"Do you have MFA" is the wrong question. "Which sign-ins does your MFA policy actually evaluate, and is it enforcing or reporting" is the question.

## What to do

- **Disable ROPC.** It is deprecated, most estates have no application that needs it, and it is the specific path used here.
- **Check every Conditional Access policy for report-only.** Then check when it was put there. Report-only is a test state, not a destination.
- **Require MFA across all users and all applications**, not a named list. Scoped policies fail exactly where the scope ends.
- **Stop treating trusted locations as an exemption.** An IP range is not an identity, and a bring-your-own-IP service is what this campaign used.
- **Restrict Azure CLI to administrators.** Most users have no reason to authenticate to it.
- **Alert on volume, not just success.** 81 million attempts is loud. The failures are the detection, and they arrive long before the compromise does.

## What is not established

- **The baseline behind 155x.** Huntress does not state what the increase is measured from.
- **Who runs LSHIY.** No attribution has been published.
- **What happened after the 78 compromises.** The research covers the access, not the outcome.
- **Whether the 23 organisations are representative.** They are Huntress customers where the campaign was observed, not a survey.`,
  },
  {
    slug: "offside-wallet-theft-factory-40-firefox-extensions-socket",
    title:
      "They shipped sports-score add-ons, waited, then turned them into wallet stealers under the same extension ID",
    excerpt:
      "Socket found 40 malicious Firefox extensions posing as OKX, Rabby Wallet and TronLink, inside a wider set of 77 sharing code and infrastructure. The clever part is not the theft — it is that many started life as harmless utilities and were repurposed later, keeping the ID, the listing and whatever trust it had accumulated.",
    categorySlug: "security",
    tags: [
      "browser-extensions",
      "firefox",
      "crypto",
      "wallets",
      "supply-chain",
      "socket",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1748348713828-12035b2d0a57${P}`,
    body: `**Socket**'s threat research team has documented **40** malicious **Firefox** extensions impersonating Web3 products, inside a broader set of **77** add-ons that share source code and infrastructure. Researcher **Kirill Boychenko** describes the remaining **37** as a coordinated operation built around score-shell add-ons.

The campaign is called the **Offside Wallet Theft Factory** and has been running since **March 2026**. Mozilla has removed the malicious extensions from its marketplace. No group has claimed responsibility.

## What they pretended to be

Counterfeits of **OKX**, **Rabby Wallet**, **TronLink** and other cryptocurrency wallets.

A fake wallet extension is a near-perfect crime. The victim installs it expecting to type a recovery phrase into it, because that is what wallet software legitimately asks for. There is no moment where the request looks out of place.

## Four different ways of stealing the same thing

Socket's breakdown is unusually specific, and it shows a group iterating rather than shipping one payload:

- **15** captured recovery phrases and private keys, exfiltrating through **Cloudflare Workers**
- **13** modified legitimate **Rabby Wallet** builds to steal serialised keyrings **before encryption**
- **7** used attacker-controlled **Supabase** projects to serve phishing or decoy content dynamically
- **5** captured credentials and clipboard data through hard-coded command-and-control

The thirteen that patched a real Rabby build are the technically sharpest. Taking the keyring before encryption means the software behaves correctly, the wallet works, and the encryption the user is relying on happens after the secret has already left. Nothing looks broken, which is the point.

Note also where the stolen data goes: **Cloudflare Workers** and **Supabase**. Both are legitimate developer platforms, which makes the outbound traffic unremarkable — the same reasoning behind [DeadLock hosting its leak site on Polygon](/article/deadlock-ransomware-polygon-smart-contracts-session) and Google Sheets being used for command and control.

## The part worth learning from

Many of these extensions did not start as malware.

They shipped as sports score utilities and other benign tools, and were repurposed into wallet stealers later — **under the same Firefox ID**. The listing keeps its history, its install base, its reviews and whatever trust the store's ranking gives it.

That inverts how most people assess an extension. Checking reviews and install counts tells you about the software as it was, not as it is, because an update can replace the code entirely while every trust signal stays put. It is [dependency confusion](/article/npm-flooding-dropper-846-malicious-packages) and [the Shai-Hulud npm worm](/article/shai-hulud-2-npm-worm-secrets-outlive-the-cleanup) moved into the browser: the identity persists, the contents do not.

Boychenko's framing of the economics explains why the effort is worth it — a single successful install can expose a recovery phrase or private key worth far more than repeatedly publishing disposable extensions.

## What to do

- **Audit the extensions you already have.** This is the action. An extension installed two years ago from a developer you trusted is exactly the profile being exploited.
- **Remove anything you do not actively use.** Every installed extension is standing code with page access, whether or not you opened it this year.
- **Never type a recovery phrase into a browser extension you did not install from the wallet vendor's own site.** Go to the vendor, follow their link. Do not search the store.
- **Use a hardware wallet for anything that matters.** The seed never reaches the browser, which removes this entire class.
- **Treat install counts and reviews as historical.** They describe a version that may no longer be the one you are running.

## What is not established

- **How many people installed them.** Socket has not published install figures.
- **How much was stolen.** No loss total has been reported.
- **Who is behind it.** No actor named, no claim made.
- **Whether other browsers are affected.** The research covers Firefox; the technique is not Firefox-specific.`,
  },
  {
    slug: "facebook-founding-story-what-the-film-invented",
    title:
      "The girl who supposedly started Facebook never existed — and the twins spent years fighting the best deal in the case",
    excerpt:
      "Almost everything people know about Facebook's founding comes from a film, and the film's opening premise is fiction: Erica Albright was written for the screenplay. What is documented is stranger — 450 visitors in four hours, a handwritten settlement, $200,000 for a domain name, and a legal fight to escape a payout that later multiplied.",
    categorySlug: "startups",
    tags: [
      "facebook",
      "founders",
      "startup-history",
      "litigation",
      "myths",
      "silicon-valley",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1780395280398-183f5c444cbd${P}`,
    body: `Most people's knowledge of how Facebook started comes from **The Social Network**, a film with a screenwriter, a dramatic structure and a deadline. It is a very good film. It is not a source.

The documented version has better details in it anyway.

## The opening scene is invented

The film begins with Zuckerberg being dumped by Erica Albright, and builds its whole thesis on that: he made the thing out of wounded pride, to get at women who would not have him.

**Erica Albright is a fictional character, written for the film.** There is no real person behind her.

Zuckerberg's own account is that he built the site out of boredom, and that the goal of the bigger version was to let people around the university connect. You do not have to take a founder at his word about his motives. You do have to notice that the popular explanation rests on a character who was made up.

## Facemash was real, and worse than the myth

The cruel bit is not the invented part.

In **October 2003** Zuckerberg built **Facemash**, which put photographs of two female Harvard students side by side and asked visitors to vote on which was more attractive. It drew **450** visitors in its first **4** hours. Harvard shut it down and he faced charges including breach of security and violating individual privacy.

That is the actual origin story, and it is not flattering. It also has nothing to do with a break-up.

## The Winklevoss settlement, and the irony inside it

**Cameron** and **Tyler Winklevoss**, with **Divya Narendra**, said Zuckerberg had agreed to build their site, **ConnectU**, and built Facebook instead.

After a single day of negotiation the parties signed a **handwritten** settlement: the plaintiffs gave up ConnectU in exchange for **$20 million** in cash and **$45 million** in Facebook stock, the shares valued at **$19** each at the time. That is where the widely quoted **$65 million** comes from.

Then they tried to undo it, arguing the stock had been misvalued. The Ninth Circuit refused. They dropped the case in **June 2011**.

By Facebook's **2012** IPO that stock was worth a large multiple of its settlement value — reported at close to **$500 million**. The twins spent years in court trying to escape the most valuable part of the deal they had signed. The cash was the small half.

Divya Narendra is the third name in that case, and the one almost nobody can recall, which tells you something about how these stories get compressed.

## Eduardo Saverin

The film's other central relationship is the one it handles most loosely, by consolidating several separate legal disputes into one courtroom.

What is on the record: Saverin's stake was diluted, he sued, the two sides settled, and he was reinstated as a co-founder in Facebook's own account of its history. The exact percentages that circulate — a fall from roughly a third to a fraction of a percent — are widely repeated and not confirmed by either party, so we are not going to state them as fact.

## Two prices that say more than the drama

The company was **thefacebook.com** before it was facebook.com.

In **August 2005** it bought the **facebook.com** domain for **$200,000**. In **November 2010** it paid the **American Farm Bureau Federation** **$8.5 million** for **fb.com**.

Those two numbers, five years apart, are a cleaner measure of what happened to the company than any scene in the film. The same organisation, buying the same category of asset, at a price **42 times** higher.

## Why the myth is worth correcting

Because founding stories are used as instructions.

We have written about [the Zomato rejection myth](/article/zomato-founding-story-rejection-myth) and [what Paytm's founder actually gave up in 2003](/article/paytm-vijay-shekhar-sharma-one97-forty-percent) for the same reason. A tidy origin story teaches a lesson — persist, be rejected fifty times, build it out of heartbreak — and the tidiness is usually the part that was added.

The real Facebook story teaches something less quotable and more useful: the founder was already in a dispute over ownership before the product existed, the paperwork that settled it was handwritten, and the party that felt cheated later fought to get out of the piece of the settlement that made them rich.

## What is not established

- **Zuckerberg's actual motive.** He has given his account. Nobody else can verify it.
- **Saverin's exact stake before and after dilution.** Widely quoted, not confirmed.
- **Who contributed what to the original code.** The court settled the claim without establishing a technical record.
- **What the settlement stock was ultimately worth to each party.** Reported figures vary with when you measure and what was sold.`,
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
