/**
 * Long-form drafts — the GTA VI leak, 25 August 2026.
 *
 * Three articles: the leak itself, the subpoenas Take-Two filed to unmask the
 * leaker, and the fake ISO that followed. The subpoena is arguably the bigger
 * story and is written to stand alone.
 *
 * Editorial boundaries held throughout: the leaker's site is not named or
 * linked, nothing describes how to obtain the build or the ISO, and no leaked
 * content is reproduced or described beyond what the news turns on.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead. The Windows drive letter is
 * written without a trailing backslash for the same reason.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, cannot read a table, and
 * truncates past ~460 characters. Each section's strongest paragraph is written
 * to stand alone, carry its own figures, and stay under that limit.
 *
 * Cover note: the lead piece uses Rockstar's official key art, downloaded from
 * rockstargames.com, cropped to 16:9 and hosted locally at
 * public/covers/gta-vi-key-art.jpg rather than hotlinked. This is the site's
 * first cover that is not Unsplash-licensed or an original photo — it is
 * publisher key art used to illustrate news reporting about that publisher's
 * own game, which is ordinary practice, but it is a different licensing basis
 * from every other cover here and worth knowing. The other two pieces use
 * Unsplash images deliberately: official art on a story about malware or about
 * a subpoena would imply Rockstar's involvement in things it is not part of.
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
    slug: "gta-vi-cyberleek-leak-working-build-protest-demand",
    title:
      "The GTA VI leaker has a playable build — and is holding it hostage until Rockstar apologises",
    excerpt:
      "Someone using the name Cyberleek has released gameplay clips and the full map from what appears to be a complete, unreleased build of Grand Theft Auto VI, three months before launch. They say it is a protest against digital-only selling, and that the releases continue until Rockstar issues a public apology. That demand has no definition of being met.",
    categorySlug: "security",
    tags: [
      "rockstar-games",
      "gta-vi",
      "leaks",
      "extortion",
      "dmca",
      "gaming",
    ],
    readingMinutes: 8,
    coverImageUrl: "/covers/gta-vi-key-art.jpg",
    body: `Someone calling themselves **Cyberleek** has been publishing footage from **Grand Theft Auto VI** — a game that does not come out until **19 November**.

The significant detail is not that footage exists. It is what the footage shows them doing.

## It is a playable build, and they proved it

Early leaks could plausibly have been internal capture — recordings made by someone inside, passed along. Those, reportedly, were around a year old.

The recent material is different. In one clip the player shoots the word **LEEK** into a wall.

You cannot do that with a video file. Spraying letters onto a surface with gunfire is something a person does while playing, in real time, choosing where to aim. It is a signature that could only be produced by someone holding a working, unreleased build of the game and running it.

Alongside the clips, the entire map of **Leonidas** has been published.

## What is being demanded

Cyberleek frames this as a protest. The stated grievance is Rockstar's pre-selling of digital copies and the industry's move away from physical releases, which they characterise as anti-gamer.

The stated condition for stopping is a public apology from Rockstar with, in their words, **"a concrete commitment to be better."**

Read that as a demand rather than as a slogan, because that is what it is, and notice its shape: there is no test for whether it has been met. An apology can always be judged insufficient, a commitment can always be judged insufficiently concrete. Whoever holds that condition decides when it is satisfied, and can decide never.

That is not a campaign with an objective. It is leverage with a moral vocabulary attached, and the threatened escalation — releasing the game's ending — is aimed at the audience the protest claims to represent.

## The consumer argument is real; this is not how it is made

The underlying complaint is not silly. There is a genuine dispute about digital-only distribution, ownership and preservation, and it is being argued seriously elsewhere — including by people organising boycotts and by [the wider backlash that has already blocked or delayed billions in industry projects](/article/altman-home-attack-moreno-gama-charges-not-proven).

None of that requires stolen property. And the cost of this particular method falls first on several hundred developers, artists and writers whose work is being published without their consent, years before they intended anyone to see it, in the least flattering form possible — out of order, out of context, unfinished.

## Rockstar's position is bad in an unusual way

The company is issuing **DMCA** takedowns, heavily on YouTube. Clips persist on X. The leaker's site remains up, sometimes buckling to a 502 under its own traffic.

Takedowns work against a distribution point. They do not work against a person who holds the source material and has decided the releases are principled.

The obvious counter-move — release official footage and drown the leak — is reportedly constrained by a deal with **Netflix**, which is showing the third trailer from **27 August**. So the marketing calendar, built to control attention, is currently preventing the company from responding to somebody else controlling it.

This is not the company's first incident this year: it was hit by a hack in **April** with threats to publish confidential data unless it paid.

## What is not established

- **How Cyberleek obtained the build.** No account, no vector, nothing confirmed.
- **Whether they are one person or several.**
- **Whether the material is genuinely the full game.** It looks like a working build; nobody outside can verify what else it contains.
- **Any connection to the April incident.** Both involve the same company; nothing links them.
- **Whether the leaker's stated motive is their actual one.** Stated motives in leak cases frequently are not.
- **What Rockstar or Take-Two will say publicly.** Beyond takedown activity and legal filings, little.

## Why this is on a security site

Because the interesting question is not what the game looks like.

It is that a complete pre-release build of the most anticipated product in its industry left the building, and nobody has explained how. Whatever the answer turns out to be — an insider, a compromised contractor, a supply chain, a breach — it is the same question every organisation with valuable unreleased material should be asking about itself.

The rest of it, [the fake copies now circulating with malware inside](/article/gta-vi-fake-iso-113gb-zeroes-defender-whitelist) and [the subpoenas demanding data on thousands of uninvolved people](/article/take-two-dmca-subpoena-onedrive-discord-device-ids), is what happens next.`,
  },
  {
    slug: "take-two-dmca-subpoena-onedrive-discord-device-ids",
    title:
      "To find one leaker, Take-Two has asked for the OneDrive contents of everyone in three Discord servers",
    excerpt:
      "Two DMCA subpoenas filed in New York on 20 August demand that Microsoft and Discord hand over device identifiers, IP addresses, phone numbers, linked accounts and OneDrive contents — for every account that spoke in three named servers since 1 June. One of those servers belongs to a streamer who says he knows nothing about it. The deadline is 4 September.",
    categorySlug: "security",
    tags: [
      "privacy",
      "dmca",
      "discord",
      "microsoft",
      "legal",
      "surveillance",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1743207820696-6ea16d63177f${P}`,
    body: `**Take-Two Interactive** filed two subpoenas in the **Southern District of New York** on **20 August 2026**, seeking to identify whoever is behind the **Cyberleek** persona leaking Grand Theft Auto VI footage.

The target is one person, or a small number of people. The request is not scoped that way at all.

## What is being demanded

From **Microsoft** and **Discord**, for **every account that communicated** in three named Discord servers **since 1 June**:

- **MachineGuid** values and Microsoft account device identifiers
- **Registration and last-login IP addresses**
- **Phone numbers**
- **Linked Google and Xbox connections**
- **OneDrive contents**

The filings were made by **Dale Cendali** and **Joshua Simmons** of **Kirkland & Ellis**. Microsoft and Discord have until **4 September** to respond.

## Read that list again

**OneDrive contents.**

Not metadata. Not filenames. The contents of people's personal cloud storage — the tax documents, the photographs, the coursework, the things a person puts in a folder because it is theirs — for everyone who happened to type a message in a chat server since the start of June.

**MachineGuid** is worth understanding too. It is an identifier Windows generates when the operating system is installed. It is not a cookie you can clear or an account you can abandon; it persists across logins and applications and ties a physical machine to everything that machine does. Handing it over is closer to a fingerprint than to an IP address.

## The scale problem

One of the three named servers belongs to **DarkViperAU**, an Australian streamer with a large GTA community. He has posted on X that he had nothing to do with the leak and knew nothing about it.

His server, and the others, contain **hundreds or thousands** of people with no known connection to any leak. All of them are in scope. The criterion is not suspicion; it is having spoken in a room.

That is a dragnet. Not a description of one — the actual thing, defined by presence rather than conduct.

## The mechanism is the point

A **DMCA subpoena** lets a copyright holder demand identifying information from a service provider **without filing a lawsuit first**. There is no judge weighing evidence, no defendant, no adversarial hearing. A clerk issues it.

The design intent is narrow: a rights holder who can point at infringing material gets the identity of the person who posted it, so a real case can then be brought.

What is happening here is a different thing wearing that mechanism. The infringer is unidentified, so the request covers everyone who might be near them — and it reaches for categories of data, particularly private file contents, that have nothing to do with establishing who uploaded a video.

If a police force wanted the contents of thousands of people's cloud storage, it would need a warrant, particularity, and a judge. A corporation pursuing a copyright claim has filed paperwork and set a two-week deadline.

## This is the year's pattern, from the other direction

We have spent this month writing about regulators discovering that penalties needed to be larger — [Uber's €825 million](/article/uber-825-million-dutch-dpa-automated-driver-suspensions), [TikTok's $400 million](/article/tiktok-400-million-coppa-settlement-vacating-musically-decree) — each one about a company holding data it should not have held, or using it in ways it should not have.

Here a company is asking two of the largest data holders in the world to hand over other people's personal files, and the legal instrument requires nobody to ask whether that is proportionate. The privacy regime that fines Uber €825 million for automated decisions has no equivalent gatekeeping on this.

Neither Microsoft nor Discord has publicly said what it will do. Both can object. Whether either does is the thing to watch, because a subpoena of this scope becomes normal the first time it is complied with quietly.

## If you are in one of those servers

- **You do not need to have done anything.** The criterion is having posted since 1 June.
- **Review what is in your OneDrive**, and understand that the request covers contents, not just the fact of an account.
- **Check your linked accounts** — Google and Xbox connections are explicitly named.
- **Watch for Microsoft's or Discord's notification.** Providers often notify affected users when they can; whether that happens here is unknown.
- **This is not legal advice**, and anyone genuinely worried should get some.

## What is not established

- **Whether Microsoft or Discord will comply**, object, or narrow the request.
- **Whether either will notify affected users.**
- **How many accounts are actually in scope.** Nobody outside has the server member counts as of 1 June.
- **Whether a court will review the subpoenas.** DMCA subpoenas do not require it unless someone moves to quash.
- **Whether Cyberleek was ever in any of those servers.** That appears to be the theory; it has not been demonstrated publicly.`,
  },
  {
    slug: "gta-vi-fake-iso-113gb-zeroes-defender-whitelist",
    title:
      "The fake GTA VI download is 113GB of nothing wrapped around a 50KB payload",
    excerpt:
      "Days after the leak, an ISO began circulating claiming to be the leaked build. Testers report it is 99.99% empty zeroes padded around roughly 50KB of malware, and that the installer whitelists the entire C: drive in Windows Defender before it runs. The file size was the disguise: 113GB is what a real game looks like.",
    categorySlug: "security",
    tags: [
      "malware",
      "gta-vi",
      "defender-bypass",
      "torrents",
      "social-engineering",
      "ransomware",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1708264956658-857b9deae115${P}`,
    body: `Within days of the Grand Theft Auto VI leak, a **113GB** ISO appeared claiming to be the leaked build.

Testers who examined it report that roughly **99.99%** of the file is empty zeroes, padded around a payload of about **50KB**.

## The padding is the disguise

Work out the ratio and it stops being a curiosity. **113GB** is about **118 million kilobytes**. To hide **50KB** inside it, the attacker generated roughly **2.4 million times** more filler than payload.

Nobody does that by accident, and nobody does it to evade a scanner — zeroes compress to nothing and hide nothing. They did it because **113GB is what a modern AAA game weighs**.

A 50KB download claiming to be Grand Theft Auto VI is obviously a lie. A 113GB download is credible, takes hours, and by the time it finishes the victim has invested enough that they will run it. The file size is not a technical property here. It is the social engineering.

## Then it blinds Defender

The installer disables **Windows Defender** by whitelisting the **entire C: drive** — an exclusion covering everything, after which the payload runs unimpeded unless some other antivirus is present. Researchers note it could be ransomware.

This is the fourth time this month we have written the same paragraph in a different costume. [SPECTRE unlinks EDR callbacks in the Windows kernel](/article/uat-10147-spectre-implant-170000-urls-old-cves). [A signed Defender driver can delete Defender at boot](/article/defender-btr-sys-boot-time-removal-golden-window-no-patch). [Weedhack sets its own Defender exclusions](/article/weedhack-fake-minecraft-clients-seo-poisoning-defender-exclusions). Here it is one exclusion covering the whole disk.

None of these defeat the product. They remove its ability to look, which produces exactly the silence of a clean machine — and a missing alert is indistinguishable from safety.

Adding a Defender exclusion needs administrator rights, so somewhere in this a person clicked through an elevation prompt for an installer they knew was pirated.

## The leak manufactured the demand

This is the part worth generalising, because it will happen again with the next release.

An enormous number of people suddenly want a file that does not legitimately exist, know it is circulating, and have no way to authenticate it. That is a near-perfect market for malware: verified demand, no reference copy, and a population that already accepts it is doing something dodgy and therefore will not report the outcome.

The leaker did not distribute this ISO. They created the conditions in which it works — which is worth weighing against a [protest framed as being on gamers' behalf](/article/gta-vi-cyberleek-leak-working-build-protest-demand).

It is the same structure as the fake Minecraft clients: a real thing people want, an unofficial channel they already use, and a file nobody can verify.

## What to do

- **There is no legitimate copy.** The game is not out. Any download claiming to be it is either useless or hostile, with no third option.
- **Treat file size as marketing, not evidence.** A plausible size is trivially manufactured, and here it was the entire trick.
- **A pirated installer asking for administrator rights is the decision point.** Nothing that unpacks a game needs to modify your antivirus settings.
- **Check your Defender exclusions** if you have run anything like this — Virus and threat protection settings, exclusions list. A whole-drive exclusion you did not add is a compromise indicator, and it takes a minute to look.
- **If you find one, assume the machine is dirty.** Remove the exclusion, then rebuild rather than clean, particularly if ransomware is on the table.
- **Wait for 19 November.** It is three months.

## What is not established

- **What the payload actually does.** Described as possible ransomware; no family named in the reporting we have seen.
- **How many people downloaded it.** No figure.
- **Who is distributing it.** No attribution, and no reason to think it is connected to the leaker.
- **Whether other fake builds are circulating** with different payloads. Likely, but unconfirmed.
- **Whether any genuine build is circulating publicly at all.** Claims about leaked builds cannot be independently verified from outside.`,
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
