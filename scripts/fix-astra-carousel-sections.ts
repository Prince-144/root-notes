/**
 * Reshapes three sections of the Astra piece so the carousel picks the right
 * paragraphs.
 *
 *   npx tsx --env-file=.env.local scripts/fix-astra-carousel-sections.ts
 *   npx tsx --env-file=.env.local scripts/fix-astra-carousel-sections.ts --apply
 *
 * scripts/carousel-scores.ts ranked the sections and the top three would have
 * produced a carousel that argues the opposite of the article:
 *
 *   - "Every step of that is OpenAI's" was won by the concession paragraph
 *     ("Give credit where it is due: OpenAI published the framework in
 *     advance..."), which on a standalone card reads as praise. The
 *     enumeration that carries the actual argument scored 2.97 and lost to it
 *     at 4.00, because it had no figure.
 *
 *   - "What the evidence looks like on the ground" won on the Forescout
 *     paragraph, whose framing sentence lived in the paragraph above it. On a
 *     card with no surrounding article, a reader of an OpenAI post sees a
 *     bricked PLC and $535.74 with no stated reason for being there.
 *
 *   - "What was demonstrated" — the section carrying the actual news — did not
 *     place at all, because its figures are in a bullet list, which is
 *     ineligible, and its prose paragraph carried none.
 *
 * Each fix moves a figure into the paragraph that should win and makes that
 * paragraph self-contained. New section scores: demonstrated 4.53, every-step
 * 4.61, evidence 4.55, against 1.70 for the next section down.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "gpt-6-astra-critical-cyber-threshold-openai-wrote-the-line";
const APPLY = process.argv.includes("--apply");

const edits: { label: string; before: string; after: string }[] = [
  {
    label: "What was demonstrated",
    before: `Taken at face value that is a serious capability, and the defensive reading is real: a model that turns advisories into working exploits is also a model that finds your bugs before somebody else does.`,
    after: `Taken at face value that is a serious capability: **100%** on a benchmark of turning advisories into working exploits, plus **2** vulnerabilities nobody had reported. The defensive reading is real — a model that does that to disclosed flaws is a model that finds yours first. The offensive reading is the same sentence.`,
  },
  {
    label: "Every step of that is OpenAI's",
    before: `OpenAI **wrote** the Preparedness Framework. OpenAI **defined** the Critical threshold. OpenAI **ran** the evaluations. OpenAI **judged** that the threshold was met. OpenAI **decided** the safeguards "sufficiently minimize the risk of severe harm for release". And OpenAI **operates the list** of who gets the capability.

No external body signed any of that off, and none is quoted. [We made the same observation about all three labs last week](/article/three-labs-shipped-cyber-models-and-graded-their-own-homework) — this is the sharpest instance of it, because the judgment being self-made is not a benchmark score but a safety determination about a capability the company itself classifies as Critical.`,
    after: `OpenAI wrote the Preparedness Framework, defined the Critical threshold, ran the evaluations, judged the threshold met, cleared the safeguards for release, and operates the allowlist that gates access. That is **6** decisions and every one belongs to the company shipping the model. No external body signed any of it off, and none is quoted.

[We made the same observation about all three labs last week](/article/three-labs-shipped-cyber-models-and-graded-their-own-homework) — this is the sharpest instance of it, because what is being self-judged is not a benchmark score but a safety determination about a capability the company itself classifies as Critical.`,
  },
  {
    label: "What the evidence looks like on the ground",
    before: `Set the launch claims beside the one public, independent, costed experiment this site has covered.

Last week Forescout published an attempt to have a frontier model [port a working pre-auth exploit from one industrial controller to another](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout). It took **8 hours 32 minutes** and **$535.74**, needed sustained human steering, and bricked the device. The lab's own conclusion was that the researcher would have been faster and cheaper alone.

That is a different model from a different vendor, and it is a year of capability behind. It is also the only number in this discussion produced by someone with nothing to sell, and the honest position is that the gap between it and "can do anything a human can do with a computer" has not been independently measured by anybody.`,
    after: `Set against "anything a human can do with a computer": Forescout had **Claude** [port a working pre-auth exploit between two industrial controllers](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout). It took **8 hours 32 minutes** and **$535.74**, needed constant human steering, and bricked the device. The lab concluded its own researcher would have been faster and cheaper alone.

That is a different model from a different vendor and a year of capability behind, and it is still the only number in this discussion produced by someone with nothing to sell. Nobody has independently measured the distance between it and what was claimed on Thursday.`,
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
