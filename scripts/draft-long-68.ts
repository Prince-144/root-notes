/**
 * Drafts the 10 September piece on the iPhone Duo hinge and repairability.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-68.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-68.ts --update
 *
 * The spine of it: Johny Srouji described, on stage, a manufacturing process
 * that is per-unit — AI matches each hinge to its best-fit housing, a confocal
 * laser scans that individual unit's topology, and up to 25 micro layers of
 * photopolymer are printed onto it to cancel that unit's measured waviness.
 * That is the opposite of a part. A spare hinge assembly out of a box cannot
 * carry a correction that was computed from the housing it is not going into.
 *
 * And Apple does not get to leave it there, because EU 2023/1670 puts "hinge
 * assemblies and display folding mechanisms" on the mandatory spare parts list
 * for seven years, and its display exemption covers rollables only — the text
 * is "a flexible main display which the user can unroll and roll up", which a
 * fold is not. The regulation names foldables separately in the drop tests, so
 * the drafters had them in mind and covered them.
 *
 * Apple published no fold-cycle rating. Competitors quote 200,000 or 400,000.
 *
 * Sources: Apple's newsroom release and spec page, Srouji at the Surprise and
 * Shine event via TechCrunch, and the regulation text on EUR-Lex.
 *
 * Cover: the folded Duo in both colours, hinge spine visible on each. Already
 * 1960x1102, so the 16:9 header crop takes nothing off it.
 *
 * No backticks and no angle brackets in the body.
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

const NEWSROOM = "https://www.apple.com/newsroom/images/2026/09";
const UPDATE = process.argv.includes("--update");

const drafts: Draft[] = [
  {
    slug: "iphone-duo-every-hinge-is-matched-to-one-housing-and-a-spare-cannot-carry-the-fit",
    title: "Every Duo hinge is fitted to one housing, and a spare part cannot carry the fit",
    excerpt:
      "Apple's hardware chief described a hinge assembled per unit: AI matches each hinge to its best-fit housing, a laser scans that individual body, and photopolymer is printed onto it to cancel that body's measured waviness. EU law puts hinge assemblies on the seven-year spare parts list anyway. Both things are true, and they do not fit together.",
    categorySlug: "gadgets",
    tags: ["apple", "iphone-duo", "foldable", "hinge", "repairability", "right-to-repair", "eu-ecodesign", "manufacturing"],
    readingMinutes: 11,
    coverImageUrl: `${NEWSROOM}/apple-unveils-iphone-duo/article/Apple-iPhone-Duo-colors-260909_big.jpg.large_2x.jpg`,
    body: `Apple said a great deal about the **iPhone Duo** hinge on **9 September 2026**, and almost none of it was marketing padding. It is one of the more genuinely interesting pieces of manufacturing anyone has described on a consumer stage in years.

It also has a consequence Apple did not mention, and a regulator in Brussels has already written down the opposite requirement.

## What Apple actually described

The published detail, from Apple's own release: the hinge is **"engineered from more than 100 components"**, in Grade 5 titanium, with a **3D-printed hinge cover** in **100 percent recycled titanium** and a micro-blasted finish. Inside the frame, **"support ribs reinforce the structure for added stiffness, while antenna splits with ceramic fiber inserts enhance the frame's rigidity."**

Then, on stage, Apple's chief hardware officer **Johny Srouji** described how it is put together:

**"During manufacturing, we use AI algorithms to precisely match each individual hinge with its best-fit housing to ensure perfect alignment, and a confocal laser progressively scans the topology of every single unit and 3D prints up to 25 micro layers of a custom photopolymer to eliminate residual waviness."**

Read that again slowly, because every clause is per-unit.

The hinge is not fitted to *the* housing. It is matched to **its best-fit housing** — chosen, from a population, for that one body. Then a laser measures **every single unit** individually. Then a photopolymer is printed, up to **25 micro layers**, to cancel out the waviness that measurement found *in that unit*.

This is not how phones are built. This is how telescope optics and turbine blades are built: you accept that your parts have tolerances you cannot economically eliminate, you measure each assembly, and you correct each one individually.

The result is presumably very good. A folding display fails at the fold, and flatness across the fold is the whole game.

## The correction does not travel with the part

Here is the problem, and it is structural rather than a criticism of the engineering.

A repair replaces a part. The part comes out of a box. It has never met the housing it is about to go into, no laser has scanned that pairing, and no photopolymer has been printed to cancel the waviness of that specific assembly.

Everything Srouji described is information that exists only at the moment of original manufacture — a measurement of one body and a correction computed from it. Ship the hinge separately and you ship the metal without the fit. [The same shape turned up in the C-Track case](/article/c-track-sealed-records-order-did-not-travel-with-the-backup), where what mattered was not the data but the instruction attached to it, and the instruction did not survive the copy.

So a Duo hinge is not really a component. It is half of a matched pair, and the other half is a specific phone.

That does not make repair impossible. It does mean a serviced Duo is not straightforwardly the same object it was, and that the tolerance budget a replacement works within is not the one the factory worked within. Apple has said nothing about how service handles this — whether hinges are replaced as a hinge-plus-housing module, whether the display goes with it, or whether there is a field calibration step at all.

## The display is designed to slide, not to open

The stack has the same property.

Apple's description: **"High-strength glass sits above and below the folding display panel, with custom adhesives that allow the layers to glide past one another like the pages of a book, relieving bend stress."** Above that sits a scratch-resistant coating and a **nano-textured cover layer** made from a custom polymer with **up to 40 percent higher stiffness** than industry alternatives.

That is an elegant answer to bend stress: rather than resisting the fold, let the layers shear against each other. But an adhesive tuned so that laminated layers slide in a controlled way is not an adhesive designed to be separated and re-formed on a bench. The property that makes the fold survivable is the property that makes the stack a single serviceable unit rather than several.

The nano-texture is its own small problem. On Macs, nano-texture displays need specific handling and cannot simply be wiped with whatever is to hand. That surface is now on the inside of a device that closes against itself.

## The number Apple did not give

Apple published no **fold-cycle rating**. Not on the spec page, not in the release, not on stage.

Every competing foldable ships with one — the industry convention is a figure like **200,000** or **400,000** open-and-close cycles, with the test method usually named. Apple said the hinge is **"rigorously tested for long-term reliability"** and left it there.

The omission is conspicuous rather than damning. Apple rarely quotes cycle counts for anything mechanical, and a number without a method is close to meaningless anyway. But it is the single figure a person spending **1,999 dollars** — or **3,199 dollars**, which is what a 2TB Duo costs — would most like before committing.

## Brussels has already written the requirements down

This is where it gets interesting, because Apple's silence has a deadline.

**Commission Regulation (EU) 2023/1670** sets ecodesign requirements for smartphones. It has a display exemption, and the exact wording is:

**"mobile phones and tablets with a flexible main display which the user can unroll and roll up partly or fully"**

A fold is not an unroll. Rollables are exempt; foldables are not. And this is not an oversight — the regulation names foldables explicitly elsewhere, giving devices **"designed to be used with a protective foil on the foldable display"** a modified drop test of **35 falls** unfolded and **15** in the extended state, against the standard **45**. The drafters knew foldables existed and chose to cover them.

Which means the Duo carries the full set of obligations. Two of them matter here.

**Spare parts, for seven years after the last unit is placed on the market.** The mandated list includes batteries, cameras, charging ports, buttons, microphones, speakers — and, named specifically, **hinge assemblies and display folding mechanisms**. Whatever a Duo hinge is, Apple must sell one to a professional repairer in the EU, on a five-working-day delivery for the first five years and ten working days for the remaining two.

**Battery endurance of at least 800 cycles at 80 percent remaining capacity.** The Duo has **two** batteries, one on each side of the fold, because a cell cannot span a hinge. Whether the requirement is read against the pack or each cell, there are now two components ageing independently inside one device, and the one that degrades first sets the experience.

Separately, the EU energy label regime requires a published **repairability class from A to E** on the label itself. Apple does not get to decline to grade this phone.

[EU regulators have shown they will actually enforce](/article/cnil-500000-euro-fine-hospital-no-vpn-no-mfa-teenager), so the interesting question is not whether the numbers appear but what they say when they do.

## What it costs to fix is not published either

As of now, **iPhone Duo does not appear on Apple's repair pricing page.** There is no listed out-of-warranty screen price, no hinge service price, no battery price.

Pre-orders open **16 October** and the phone ships **23 October**. On the current state of publication, a buyer commits before the repair economics of the most mechanically complex phone Apple has ever sold are knowable.

That is normal for Apple — pricing typically lands with availability — but it is more consequential here than usual, because on a conventional iPhone a buyer can reason from last year's numbers, and there is no last year for this.

## What to do

- **Buy AppleCare+ or decide deliberately not to.** With no published out-of-warranty hinge or display pricing, the alternative is an unbounded number.
- **Wait for the EU label if you are in Europe.** The repairability class and battery endurance figures are compelled disclosures, and they will be more informative than anything in the marketing.
- **Do not assume third-party repair will fill the gap.** A per-unit-calibrated hinge and a shear-tuned adhesive stack are not a screen swap.
- **Treat the nano-textured inner panel as a surface with rules**, not as glass.
- **If you want a cycle rating, ask before you buy**, and note that not having one is itself an answer about what Apple is willing to commit to.

## What is not established

- **The fold-cycle rating.** Apple has published none, and no independent testing exists yet.
- **How Apple services a matched hinge** — as a module with the housing, with a calibration step, or by whole-unit replacement.
- **Repair pricing** for the display, the hinge, or either battery.
- **The EU repairability class and battery endurance figures**, which are not published yet for a phone that is not yet on sale.
- **Whether the 800-cycle requirement is assessed per cell or per pack** on a dual-battery device.
- **Whether Self Service Repair will cover it**, and if so which parts.
- **Crease behaviour over time.** Apple makes no claim, and three demonstration handsets is not a data set.`,
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
