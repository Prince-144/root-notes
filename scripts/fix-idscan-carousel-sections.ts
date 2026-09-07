/**
 * Reshapes two sections of the IDScan piece so the carousel carries the story.
 *
 *   npx tsx --env-file=.env.local scripts/fix-idscan-carousel-sections.ts
 *   npx tsx --env-file=.env.local scripts/fix-idscan-carousel-sections.ts --apply
 *
 * carousel-scores.ts put the top three at "The storefront closed" (4.58),
 * "What is established and what is advertised" (4.46) and "How it was traced"
 * (4.29) — which leaves the headline fact off the carousel entirely. "Six files
 * per person" scored 0.92 because its winning paragraph is short and
 * figureless, while the paragraph that actually explains infrared and
 * ultraviolet is 435 characters and collects the overflow penalty. A carousel
 * whose cover says "infrared and ultraviolet copies" and whose cards never
 * mention them is not the article.
 *
 * Both rewritten paragraphs are sized to land between 400 and 420 characters:
 * 400 is where the section ranker stops giving length credit, 420 is where the
 * paragraph scorer starts penalising, so that band is the maximum a section can
 * score with a figure in it. Each carries a standalone digit so it takes the +3.
 *
 * New section scores: six-files 5.00, how-it-was-traced 5.00, storefront 4.58,
 * against 4.46 for the section that drops out. The narrative order that falls
 * out of the article is what the files are, how they were found, and who was
 * never told.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "idscan-nexus-infrared-ultraviolet-copies-traced-the-scans";
const APPLY = process.argv.includes("--apply");

const edits: { label: string; before: string; after: string }[] = [
  {
    label: "Six files per person",
    before: `Each record in Nexus reportedly carried **six image files**: three pairs of front-and-back photographs of the licence — a basic image scan, an **infrared** version, and an **ultraviolet** version.

That detail is the whole forensic case, and most coverage is walking past it.

Your phone does not photograph in infrared. A photocopier does not produce an ultraviolet frame. Those channels exist in one context: **purpose-built identity verification hardware**, which images a document across multiple wavelengths precisely because a licence's anti-counterfeiting features — the UV-reactive inks, the IR-visible layers — only appear outside the visible spectrum. That is how the machine knows the document is genuine.`,
    after: `Each record in Nexus reportedly carried **6** image files: the front and back of the licence three times over — an ordinary scan, an **infrared** version and an **ultraviolet** version. Your phone does not photograph in infrared. A photocopier does not produce a UV frame. Those wavelengths exist in one place, purpose-built ID verification hardware, because that is where a licence hides its anti-counterfeiting features.

That detail is the whole forensic case, and most coverage is walking past it. The UV-reactive inks and the IR-visible layers are invisible to the eye by design, which is exactly why the machine looks for them: it is how it knows the document is genuine.`,
  },
  {
    label: "How it was traced",
    before: `Krebs did not find this from the outside. The Nexus proprietor offered him **his own Virginia licence as a free sample**.

He confirmed it: six image files, with a timestamp corresponding to **June 2025**, when he flew to attend a family funeral. **His mother's licence was in there too**, timestamped **a few seconds apart** from his. Both had rented from Hertz at their destination that day.`,
    after: `Krebs did not find this from the outside. The Nexus proprietor offered him **his own Virginia licence as a free sample**.

He confirmed it. **6** image files, timestamped **June 2025** — when he flew to attend a family funeral. **His mother's licence was in there too**, timestamped a few seconds apart from his. Both had rented a car from Hertz at their destination that day. That is how a reporter ends up finding himself, and his mother, inside a stolen database he was investigating from the outside.`,
  },
];

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "articles",
  where: { slug: { equals: SLUG } },
  limit: 1,
});

const doc = docs[0];
if (!doc) {
  console.error(`no article with slug ${SLUG}`);
  process.exit(1);
}

let body = doc.body;

for (const edit of edits) {
  if (!body.includes(edit.before)) {
    console.error(`"${edit.label}": section not found — the body has moved on`);
    process.exit(1);
  }
  body = body.replace(edit.before, edit.after);
  console.log(`ok  ${edit.label}`);
}

console.log(`\n${SLUG}: ${doc.body.length} -> ${body.length} chars`);

if (!APPLY) {
  console.log("dry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");

// The afterChange hook fires revalidate and IndexNow without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
