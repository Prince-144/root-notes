/**
 * Suno breach / source-code leak — long-form.
 *
 * Built from a six-angle research pass with adversarial verification. The
 * central finding is that the viral framing does not survive checking, and the
 * genuinely serious part of the story is the one nobody is running.
 *
 * Pass --update to rewrite if the draft already exists.
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
    slug: "suno-leak-what-the-viral-version-gets-wrong",
    title:
      "The Suno leak did not prove what the industry couldn't — and the part that matters is the 55 million accounts nobody was told about",
    excerpt:
      "The viral version says a hacker exposed 2 million stolen songs. The number is one line item from one of ten sources, it is ten times smaller than what Suno told a court in 2024, and the labels had the real figure in discovery two months earlier. Underneath it is a breach Suno described as involving no sensitive personal information.",
    categorySlug: "ai",
    tags: [
      "suno",
      "ai-music",
      "copyright",
      "data-breach",
      "litigation",
      "training-data",
    ],
    readingMinutes: 14,
    coverImageUrl: `https://images.unsplash.com/photo-1535406208535-1429839cfd13${P}`,
    body: `The version going around is compact and satisfying: a hacker breached the AI music company **Suno**, leaked its source code, and proved it had scraped **over 2 million songs** from YouTube, Deezer and Genius without permission or payment — proving in one stroke what the music industry had failed to prove in two years of litigation.

Almost every load-bearing part of that is wrong, and the parts that are right were already on the public record, mostly from Suno's own filings.

There is a serious story here. It is not the one being shared.

## Start with the number

The **2,013,545** figure is real. It is also not what people think it is.

Per **404 Media**'s 15 July 2026 report — the only newsroom that has seen the material — it is a count in a file named \`youtube_music\`, and it counts **"music clips"**, a unit nobody has defined. It is one line in a list of ten sources:

| Source | Reported figure |
| --- | --- |
| \`youtube_music\` | **2,013,545 clips** / 113,879 hours |
| \`ytm_tagged\` | 152,162 hours |
| \`pond5_music\` | 62,117 hours |
| \`imslp\` | 19,514 hours |
| \`genius_hq\` | 17,615 hours |
| \`deezer\` | 12,287 hours |
| \`jamendo\` | 3,726 hours |
| \`free sound\` | 410 hours |
| \`musescore_lyrics\` | 103 hours |

Three things follow immediately.

**"Songs" is an assumption.** The unit is clips. 113,879 hours across 2,013,545 clips averages about 3.4 minutes, which is consistent with full tracks — but no source states that, and we are not going to do the arithmetic and call it a finding.

**It is one platform, not the corpus.** Only hours were reported for Deezer and Genius. Any article giving you a song count for Deezer is extrapolating.

**A "12 million songs" figure is circulating and is unsupported.** It appears in at least one music-trade outlet and in no other source, and it cannot be reconciled with the per-source figures above. Treat it as an error until someone produces the file.

## Suno already said something bigger, in court, two years ago

Here is the part that collapses the whole frame.

In its **1 August 2024** answer to the major labels' suit, Suno told the court its training data:

> includes essentially all music files of reasonable quality that are accessible on the open internet, abiding by paywalls, password protections, and the like

and conceded the model was trained on **"tens of millions of recordings"**, which presumably included recordings owned by the plaintiffs.

A headline reading "2 million songs" is therefore reporting a number roughly **an order of magnitude smaller** than the company's own public admission, filed on a public docket, two years earlier.

The leak did not reveal the scale. It undersold it.

## "Hacked" is doing a lot of work

The intrusion, as described by the person who claims to have done it, is not a targeted attack on an AI company.

A self-replicating npm supply-chain worm called **Shai-Hulud** — second wave detected **24 November 2025**, affecting 700+ packages — infected a **single Suno employee's machine** and harvested GitHub and cloud credentials. Shai-Hulud's known behaviour is to publish stolen secrets to a public GitHub repository under the victim's own account.

A person using the handle **"ellie.191"** then used those credentials.

**Socket**'s analysis is explicit that it cannot tell whether that person deployed the worm or simply found the exfiltrated credentials sitting in a public repo — and notes the second scenario fits their described motive of opportunism rather than any interest in Suno specifically. The only motive on record is a single line: *"I like to hack anything and everything."*

So the accurate description is credential reuse following automated mass credential harvesting. Closer to *Suno's keys were left in a public repository by a worm and somebody picked them up* than to *a hacker went after Suno*.

Suno has never confirmed the vector. The worm account comes from the hacker, relayed through one outlet.

## The industry was not waiting to be rescued

The claim that a hacker proved what the labels couldn't is the part most worth demolishing, because the record is unambiguous.

**19 September 2025** — ten months before the leak — the three majors' amended complaint in the District of Massachusetts alleged Suno acquired its training recordings

> by illicitly downloading them from YouTube using a notorious method of music piracy known as "stream ripping"

and added a **DMCA §1201** claim that Suno **circumvented YouTube's rolling cipher encryption**. The specific technical theory the leak is credited with revealing was pleaded, in public, in 2025.

**21 May 2026** — UMG and Sony moved to expand the complaint from **560 works to 61,026**, having run audio-fingerprinting service **Audible Magic** against Suno's actual training data, produced under discovery obligation and authenticated.

**5 June 2026** — the labels urged the court to reject Suno's bid to seal the **"Model Training Figure"**: the total number of audio files they allege Suno used. Suno wanted it sealed on competitive-harm grounds; the labels argued it speaks directly to the nature and extent of the copying.

That is a party fighting to keep a number secret because the other side already has it. The industry was not missing evidence. It was arguing about whether the public would be allowed to see it.

The hack changed the publicity. It did not change the record.

## Suno never denied stream-ripping

A related claim — that the code catches Suno in a lie — has nothing to catch.

Suno's **3 October 2025** opposition did not deny stream-ripping. It argued the conduct was lawful: that the DMCA prohibits circumventing *access controls* but not *copy controls*, and that since YouTube music videos are publicly accessible the provision does not apply. It called the allegations a gambit to evade fair use.

You cannot contradict a denial that was never made.

Suno's response to the leak follows the same pattern. It did not dispute that the code is its own. It said the incident

> primarily involved outdated source code that is no longer in use at Suno

and restated that its models

> have been trained on publicly available music files and related metadata accessible on third-party websites on the open Internet.

That non-denial is the strongest corroboration the documents have — and it is worth noting that no third party has forensically authenticated the archive. Socket analysed the intrusion path, not the files.

## What is actually new

Two details, and they are about **method**, not scale.

The code reportedly shows scraping routed through **Bright Data** commercial proxies, to rotate source IPs and sustain high request volumes. And it reportedly shows searches run specifically for **a cappella** recordings, to obtain isolated vocal tracks.

If this story has a legitimate news core, that is it.

Proxy rotation is not how you collect publicly available files. It is how you collect files from a platform that is trying to stop you. That goes to intent, and intent is the hinge of the §1201 claim and of willfulness.

Caveat, stated plainly: these details trace to the same single outlet, and at least one downstream publication that reviewed the account reports no named tooling at all. No fetched source confirms \`yt-dlp\` or any specific ripping utility appears in the code.

## Why intent is worth billions

Under **17 U.S.C. §504(c)(2)**, statutory damages rise to **$150,000 per work** for willful infringement.

| Works in play | Theoretical statutory ceiling |
| --- | --- |
| 560 (original complaint) | ~$84 million |
| **61,026** (proposed) | **over $9 billion** |

Evidence that a defendant knowingly routed collection to evade a platform's defences is classic willfulness proof. That is why internal records about *how* data was acquired matter disproportionately.

The precedent is direct. In **Bartz v. Anthropic**, Judge Alsup held in June 2025 that training on lawfully acquired books **was** fair use — and that retaining pirated copies in a central library was not. Anthropic had no entitlement to use pirated copies for a central library. Only the pirated-acquisition class proceeded, and it settled for **$1.5 billion**.

Acquisition, not use, is what has produced every large adverse outcome so far.

And the §1201 theory is live: on **15 April 2026** Judge Hellerstein in the Southern District of New York declined to dismiss the labels' anti-circumvention claim against Suno's competitor **Udio**, holding that allegations the rolling cipher regulates access and was circumvented to download in bulk sufficed to state a claim — while cautioning that whether YouTube's measures ultimately qualify needs a fuller record.

One more thing worth knowing: **no US court has ruled on fair use for music training data.** Both governing decisions — Bartz and Kadrey v. Meta — are book cases. Suno is arguing by analogy.

## Now the part nobody is sharing

On **20 July 2026**, Have I Been Pwned loaded the Suno breach: **55,282,226 accounts**. Breach date **25 November 2025**. Verified, not fabricated.

Data classes: email addresses, names, phone numbers, **physical addresses**, purchases, and **partial credit card data** — including, in tens of thousands of Stripe records, card type, expiry date and last four digits.

Set that against Suno's statement:

> no sensitive personal information was compromised

Home addresses and partial payment card data are in the dataset. HIBP is a primary record, machine-readable, marked verified. The company's characterisation and the evidence do not agree.

Two further facts:

**Nobody was told.** Suno concluded that individual notifications were not warranted under applicable privacy laws. It has published nothing about the breach on its own site — we checked. Customers found out when a journalist contacted them, **eight months** after the incident.

**The first number was 100× too small.** The 15 July reports said "hundreds of thousands" of customers. The correction to 55.3 million came five days later from Have I Been Pwned counting the corpus — not from any company disclosure. Outlets that ran the original figure and never updated are still carrying it.

Two proposed class actions have been filed in the District of Massachusetts — **Pilavian** on 24 July 2026 and **Rugnetta** — and both are about the **non-notification**, not the scraping.

No reporting establishes any law enforcement or regulatory involvement. For a 55-million-account breach that absence is itself notable, though it must be read as "nothing has been reported", not as "nothing exists."

## The commercial reality

If you assume this was damaging, check the scoreboard.

- **June 2026** — Suno raised **$400m+ at a $5.4bn post-money valuation**, six weeks before the leak
- **November 2025** — **Warner** settled and signed a licensing deal, exiting the case
- **29 June 2026** — **Jamendo**, one of the sources in the leaked list, sued
- **12 August 2026** — Suno announced a **global licensing deal with BMG**, covering recorded music and publishing, settling prior unauthorised use of BMG works

That last one is today. A month after the leak, the company signed its second major-rightsholder deal.

No investor has publicly commented. The valuation is unchanged.

The one genuine legal setback is unconnected: on **31 July 2026** Munich Regional Court I ruled against Suno in **GEMA v. Suno** (42 O 763/25), holding that memorisation of protected works in model parameters is unauthorised reproduction under §16 UrhG even where training occurs abroad, and rejecting US fair use. The docket number is a 2025 filing and the case was decided on GEMA's own evidence. Anyone linking that ruling to the leak is guessing.

## What is still unknown

Being explicit, because most coverage is not:

- **Whether the per-source figures are completed downloads or pipeline configuration.** One outlet describes them as appearing in source code and dataset comments; another calls them internal logs. Those carry very different evidentiary weight and the distinction is unresolved.
- **The actual size of the training corpus.** The Model Training Figure was still sealed as of June 2026. Suno's own "tens of millions" from 2024 remains the only public order of magnitude.
- **What a "clip" is.**
- **Whether the archive is authentic.** Suno has not disputed the contents, which is suggestive and is not verification.
- **Whether ellie.191 deployed the worm or scavenged its output.** Socket leaves it open.
- **Whether any filing cites the leaked code.** None has been confirmed.

And one sourcing fact that should sit over the whole story: **exactly one newsroom has seen this material.** TechCrunch, Engadget, Music Business Worldwide, heise, Socket, MusicRadar and Crypto Briefing all credit 404 Media and all state they did not independently review it. The customer database is verified and demonstrably out of the hacker's exclusive control. The source code is not known to be public anywhere.

## What to take from it

The viral framing inverts the story. It treats a smaller-than-admitted number as a revelation, describes worm fallout as a targeted hack, and credits an anonymous individual with proving something three record labels had already pleaded, fingerprinted and put before a judge.

Meanwhile the actual news — a company holding 55 million accounts' worth of names, addresses and partial card data, breached in November 2025, telling nobody for eight months, and describing it as involving no sensitive personal information — is the part that got compressed into a subordinate clause.

If you want the version that will matter in a year: **acquisition method is what loses these cases**, the Bright Data and a cappella details are the only genuinely new evidence of it, and they are single-sourced. Everything else was already in the docket.`,
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
    `drafted: ${draft.slug} (id ${created.id}, ${draft.body.split(/\s+/).length} words)`,
  );
}

process.exit(0);
