/**
 * Drafts the 10 September pair on Apple's 9 September 2026 announcements.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-66.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-66.ts --update
 *
 *   1. iPhone 18 Pro. The headline battery figure is a regional build. Apple's
 *      US page says 45 hours, its UK page says 43, the chassis is identical at
 *      8.75 mm and 249 g, and the footnote says why: the SIM tray's volume is
 *      now cell volume. Plus the C2 modem finishing the Qualcomm exit and a
 *      vapor chamber quoted in sustained rather than peak terms.
 *   2. iPhone Duo. The foldable ships with Touch ID and no Face ID anywhere,
 *      which is geometry rather than cost — and by Apple's own published
 *      figures that is a 20x larger random-unlock probability on the most
 *      expensive iPhone ever sold.
 *
 * Everything cited is from apple.com — the two newsroom releases, the US and
 * UK spec pages, and the Platform Security guide. Pre-launch reporting is kept
 * in its own section and labelled.
 *
 * Covers supplied by the editor, checked at full size.
 *
 * No backticks and no angle brackets in the bodies.
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

/**
 * Apple press images rather than stock, because the subject is a specific
 * product and a stock phone photo would be a picture of something else. Both
 * assets were checked at full size: the 18 Pro tile is 1312x738 and the Duo
 * one 1960x1102, so both land in the 16:9 cover slot without a crop.
 *
 * www.apple.com/newsroom/images is allowlisted in next.config.ts (image
 * remotePatterns and the CSP img-src) for exactly this.
 */
const NEWSROOM = "https://www.apple.com/newsroom/images/2026/09";
const UPDATE = process.argv.includes("--update");

const drafts: Draft[] = [
  {
    slug: "iphone-18-pro-battery-number-depends-on-which-country-page-you-read",
    title: "The 45-hour battery figure is a regional build, and Apple's own two spec pages disagree by two hours",
    excerpt:
      "Apple's US page gives iPhone 18 Pro Max 45 hours of video playback. Its UK page gives the same phone 43. Same 8.75 mm chassis, same 249 grams — the difference is the SIM tray, and Apple says so in a footnote while marketing the larger number.",
    categorySlug: "security",
    tags: ["apple", "iphone-18-pro", "esim", "c2-modem", "qualcomm", "vapor-chamber", "apple-reference-image", "hardware"],
    readingMinutes: 10,
    coverImageUrl: `${NEWSROOM}/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/tile/Apple-iPhone-18-Pro-2up-260909-lp.jpg.landing-big_2x.jpg`,
    body: `Apple announced **iPhone 18 Pro** and **iPhone 18 Pro Max** on **9 September 2026**, at an event it called Surprise and shine — the first since the change at the top that [we covered a week earlier](/article/tim-cook-executive-chairman-encryption-succession-uk-tribunal).

Prices are **1,199 dollars** and **1,299 dollars**. Pre-orders opened **12 September**, general availability is **18 September** across more than 65 countries, with about 20 more on **25 September**. Storage runs 256GB, 512GB, 1TB and 2TB. Colours are black, silver, glacier and burgundy.

That is the press release. The more interesting reading is the spec sheet, and specifically the fact that there is more than one of it.

## Apple's US page and Apple's UK page disagree about the battery

From **apple.com/iphone-18-pro/specs**, the US page:

| Model | Video playback | Streamed video | Typical use |
|---|---|---|---|
| iPhone 18 Pro | Up to 36 hours | Up to 33 hours | Up to 24 hours |
| iPhone 18 Pro Max | Up to 45 hours | Up to 40 hours | Up to 30 hours |

From **apple.com/uk/iphone-18-pro/specs**, the same two phones:

| Model | Video playback |
|---|---|
| iPhone 18 Pro | Up to 34 hours |
| iPhone 18 Pro Max | Up to 43 hours |

Two hours apart, on both models. And the physical specifications on the two pages are identical: **8.75 mm** deep, **211 grams** for the Pro and **249 grams** for the Pro Max, same display, same chip.

The reason is on the SIM line. The US page says the phone "uses advanced eSIM technology" and is "not compatible with physical SIM cards". The UK page says **"Dual SIM (nano-SIM and eSIM)"**.

Apple states the mechanism plainly in the press release footnote:

**"eSIM-only models of iPhone 18 Pro Max feature the largest increase in battery life on an iPhone by taking advantage of the space formerly occupied by the physical SIM."**

So the tray is not merely absent. Its volume has been given to the cell. Two hours of video playback is what a nano-SIM tray costs, measured by the vendor, in a chassis whose external dimensions did not change.

## Why this is worth more than a footnote

The number that will be repeated for the next year is **45 hours**. It is Apple's own figure and it is not wrong. It describes a build sold in roughly a dozen countries and regions, including the United States, Canada and Japan.

Most of the world — the UK, the rest of Europe, and elsewhere — buys the 43-hour phone. In China the device supports two nano-SIMs, one nano-SIM plus an eSIM, or two eSIMs, which is a third configuration again.

Nothing here is concealed. Both figures are published, on Apple's own domain, by the same company, and either page is one click away. But only one of them is the marketing number, and no regional page carries a footnote explaining that the phone next to it in another country lasts longer. You have to already know to compare.

This is the practical form the eSIM transition now takes: not an announcement, but a divergence in the spec sheet that follows the tray around the map.

## The modem is Apple's now, and the energy figure is the one to keep

The Pro line ships with the **Apple C2 cellular modem**. Apple's wording:

**"C2 delivers meaningfully faster uploads when compared to C1X while consuming 15 percent less energy, and now supports mmWave in the U.S."**

Two things in that sentence.

The first is **15 percent less energy** than C1X. A cellular modem is close to the top of the list of things that drain a phone that is sitting in a pocket doing nothing, because it is the part that never stops. A cut there compounds with the extra cell volume rather than competing with it — two independent improvements pushing the same figure.

The second is **mmWave in the US**, which matters because of what was reported before launch and did not happen. Through July 2026, reporting held that C2 would lack mmWave and that US iPhone 18 Pro units would therefore keep a Qualcomm modem while the rest of the world got Apple silicon. Apple shipped C2 with mmWave, in the US, across the line. Whatever the internal history, the split that was widely expected is not in the product.

Alongside it: the **N1** wireless chip for Wi-Fi 7, Bluetooth 6 and Thread, and Apple's second-generation Ultra Wideband chip. The radio stack on this phone is now overwhelmingly Apple's own design.

## The thermal number is quoted in sustained terms, which is unusual

**"With new materials and three times more surface area than the previous generation on iPhone 17 Pro, the redesigned vapor chamber dramatically improves sustained performance and enables up to a 40 percent gain over the previous generation."**

Note what is being claimed. Not a peak benchmark — **sustained** performance. Phone silicon has been thermally limited rather than clock limited for years: the interesting question has long been not how fast the chip goes but how long it stays there before it throttles.

A vapor chamber with three times the surface area is a straightforward answer to that, and quoting the result as a sustained gain is the honest way to quote it. The A20 Pro underneath is built on a **2-nanometer** process, with a 6-core CPU, a 7-core GPU and a dual 16-core Neural Engine.

Apple does not publish the RAM figure, and it does not publish battery capacity in milliamp-hours. Any number you see for either is somebody else's teardown, not Apple's specification.

## Apple Reference Image signs the sensor, and then phones home

The camera feature with the longest tail is not the variable aperture, though that is real — six laser-cut blades giving **ƒ/1.48, ƒ/1.8, ƒ/2.8 and ƒ/4.0** on the 24 mm Main camera, alongside a 13 mm ƒ/2.2 Ultra Wide and a 100 mm ƒ/2.8 4x Telephoto.

It is this:

**"When a photo is taken in the new Reference mode, the camera captures signed sensor data that Private Cloud Compute develops into an unalterable reference image."**

The signing happens at the sensor, at capture. Verification does not happen on the device: the raw image, the sensor signatures, the capture timing and the sensor's hardware identifiers go to Apple's **Private Cloud Compute**, which decides whether the camera really took the picture and returns an authenticated version.

That is a deliberate architectural choice, and it is the opposite of the usual one. [Chromium's Secure Preferences integrity values were forgeable precisely because the check was local](/article/peep-forges-chromium-secure-preferences-integrity-values) — anything a device can verify by itself is something an attacker with that device can eventually learn to satisfy. Moving the check to a server the attacker does not hold closes that.

It also means image provenance now depends on Apple's servers being reachable and willing. And Apple has not joined **C2PA Content Credentials**, the standard Nikon, Canon and Google's Pixel line use, so a Reference image is verified by Apple or not at all.

## What Apple confirmed, and what is only claimed

Confirmed by Apple: everything above with a figure attached to it, all of it from the two newsroom releases and the US and UK spec pages.

Not from Apple: the RAM figure, battery capacities, the pre-launch reporting on a Qualcomm and C2 regional split, and every teardown-derived number that will appear over the next fortnight.

## What is not established

- **Battery capacity in milliamp-hours** for either build, so the two-hour delta cannot be converted into a volume.
- **Whether the eSIM-only footprint expands** at the next revision, or stays where the regulators leave it.
- **What Reference mode costs** in capture latency, storage, or availability when Private Cloud Compute cannot be reached.
- **Whether any third party will be able to verify a Reference image**, or whether verification stays inside Apple.
- **Sustained performance in independent testing.** The 40 percent figure is Apple's, against its own previous generation, under conditions it has not described.`,
  },
  {
    slug: "iphone-duo-has-no-face-id-and-that-is-geometry-not-cost",
    title: "The most expensive iPhone ever made ships with the weaker biometric, and Apple publishes both numbers",
    excerpt:
      "iPhone Duo is Apple's first foldable: 7.6 inches unfolded, 5.2 mm thick, 1,999 dollars. It has Touch ID in the side button and no Face ID anywhere. By Apple's own published figures that is a twenty-fold larger chance a stranger can open it — and the reason is not cost, it is what fits under a folding panel.",
    categorySlug: "security",
    tags: ["apple", "iphone-duo", "foldable", "touch-id", "face-id", "biometrics", "secure-enclave", "hardware"],
    readingMinutes: 10,
    coverImageUrl: `${NEWSROOM}/apple-unveils-iphone-duo/article/Apple-iPhone-Duo-display-sizes-260909_big.jpg.large_2x.jpg`,
    body: `Apple introduced **iPhone Duo** on **9 September 2026** — the first foldable iPhone, and at **1,999 dollars** for the 256GB model the most expensive iPhone the company has ever sold. Pre-orders open **16 October**, availability is **23 October** in more than 70 countries, with 28 more regions on **30 October**. Two colours: star white and night sky.

The hardware is genuinely difficult work. Unfolded it is **5.2 mm** thick with a **7.6-inch** inner display; folded it is **11.3 mm** with a **5.4-inch** outer display; it weighs **254 grams**. The hinge is Grade 5 titanium, mirror-polished, and Apple says it is **"engineered from more than 100 components"**, supporting the centre of the display with an integrated magnet array. The inner panel has a nano-texture finish to cut glare, which is a first on an iPhone.

And it authenticates you with a fingerprint.

## There is no Face ID on it. Anywhere.

The spec sheet lists **"Touch ID"** and a **"Fingerprint sensor built into the side button"**. Face ID does not appear on the page. The alternative Apple offers is unlocking with an Apple Watch.

This is the first flagship iPhone since 2017 without Face ID, and it is worth being precise about why, because the obvious explanation is the wrong one.

It is not cost. A phone with a hundred-component titanium hinge did not lose a sensor array to save money.

It is what fits. Face ID is not a camera — Apple's spec line calls it **"enabled by TrueDepth technology"**, and TrueDepth is an array: a dot projector that throws a structured-light pattern, a flood illuminator, and an infrared camera reading the pattern back. The depth map depends on those elements sitting at known, fixed distances from each other and from the subject.

The Duo's front camera is under the inner display — Apple's phrasing is that the new FaceTime camera **"stays hidden when not in use"**. You can put one camera under an OLED panel and accept the loss in light transmission. You cannot put a structured-light projector under a folding panel and still read the dot pattern back cleanly, because the panel is between the projector and the face on the way out and between the face and the sensor on the way back, and it is a panel designed to bend.

So Touch ID in the side button. The constraint is optical, and it lands on the security model.

## Apple publishes both numbers, and they are twenty times apart

From Apple's own Platform Security documentation:

| Biometric | Probability a random person can unlock |
|---|---|
| Face ID | Less than 1 in 1,000,000 |
| Touch ID | Less than 1 in 50,000 |

Those are Apple's figures, for random-person false acceptance, and the gap is **twentyfold**.

It gets narrower under real use, in the wrong direction. Apple states that enrolling multiple fingerprints raises the Touch ID probability to as much as **1 in 10,000** with five fingers registered. Face ID with two appearances enrolled goes to 1 in 500,000. Most people with a fingerprint phone enrol more than one finger, because that is the point of having them.

Both stop after **five** failed attempts and demand the passcode, which is the control that actually bounds an attacker in a hurry.

Two honest qualifications. First, these are random-match figures and not a model of a determined attacker; neither number describes how hard the sensor is to spoof deliberately. Second, 1 in 50,000 is a perfectly serviceable number for a phone, and Touch ID has protected hundreds of millions of devices without incident.

But it is the weaker of the two mechanisms the same company sells, on the more expensive of the two devices, and there is no configuration in which a Duo buyer can choose otherwise. [Fingerprint and document capture have a long history of being reproduced by people who bothered](/article/idscan-nexus-infrared-ultraviolet-copies-traced-the-scans); a face with a live depth map is harder to hand somebody than a finger is.

The Secure Enclave still holds the template, still never lets it leave, and still does the matching. What changed is what is being matched.

## What the fold costs, itemised from Apple's own pages

Setting the Duo against the iPhone 18 Pro Max, which costs **700 dollars less**:

| | iPhone Duo | iPhone 18 Pro Max |
|---|---|---|
| Price from | 1,999 dollars | 1,299 dollars |
| Biometric | Touch ID, 1 in 50,000 | Face ID, 1 in 1,000,000 |
| Main camera | 48MP, fixed ƒ/1.6, 26 mm | 48MP, variable ƒ/1.48 to ƒ/4.0, 24 mm |
| Telephoto | None. 2x is a sensor crop | 100 mm 4x ƒ/2.8, 3D sensor-shift OIS |
| Zoom range | 2x optical quality | 16x optical quality |
| Video playback, large screen | 31 hours | 45 hours |

The telephoto line deserves the emphasis. Apple describes an **"integrated optical-quality 2x Telephoto"** on the Duo, which is a crop from the middle of the 48MP sensor rather than a lens. The 18 Pro has an actual 100 mm telephoto with its own stabiliser. Depth is the reason: a folding half 5.2 mm thick has nowhere to put a folded optical path.

The battery line is the same story from the other side. The Duo carries a **dual-battery architecture, one high-energy cell on each side**, because a single cell cannot span a hinge. It delivers **44 hours** of video on the small outer screen and **31 hours** on the large inner one — the same pair of cells lighting very different areas. Apple's mixed figure is 24 hours.

## What the fold buys, and what Apple did not say

The case for it is the thing itself. A **7.6-inch** display in a body that is **5.2 mm** thick unfolded, at 254 grams, with ProMotion at 120Hz and 3000 nits of peak outdoor brightness on both panels, is hard engineering, and the closed device still gives you a normal 5.4-inch phone. It is **IP68** to 6 metres for 30 minutes, which no foldable had a right to be, and the front is Ceramic Shield 2 with a claimed 3x scratch resistance.

What is missing from the spec sheet is the number every foldable buyer actually wants: **Apple has not published a hinge fold-cycle rating.** Competitors quote 200,000 or 400,000 folds. Apple quotes a component count and a material, and says the device is built to last.

That is the one place where a spec sheet this detailed goes quiet, and it is the mechanism most likely to decide whether a 1,999-dollar phone is still a phone in three years.

## What is not established

- **Hinge durability.** No fold-cycle figure from Apple, and no independent testing yet.
- **Crease visibility** on the inner panel. Apple makes no claim either way.
- **What the under-display camera costs** in image quality against a conventional front camera.
- **RAM and battery capacities.** Apple publishes neither.
- **Whether Face ID returns** on a later foldable, which is really a question about under-panel structured light rather than about Apple.
- **Repairability.** A folding display, a titanium hinge and two batteries have no published service pricing yet.`,
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
