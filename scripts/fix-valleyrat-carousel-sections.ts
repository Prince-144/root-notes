/**
 * Rewrites three paragraphs in the ValleyRAT piece so each section's strongest
 * paragraph stands on its own.
 *
 *   npx tsx --env-file=.env.local scripts/fix-valleyrat-carousel-sections.ts
 *   npx tsx --env-file=.env.local scripts/fix-valleyrat-carousel-sections.ts --apply
 *
 * The carousel builds each slide from a section heading and the best paragraph
 * under it, so a paragraph that leans on the one above it becomes a fragment on
 * a card. Three did:
 *
 * - "The delivery mechanism is a decision the victim made" won on a paragraph
 *   opening "In every one of those" — pointing at a list of four other stories
 *   that is not on the slide.
 * - "How it runs" won on "The signature on the executable is genuine", which
 *   never says how it runs. The side-loading is the paragraph above.
 * - "What ValleyRAT does once in" opens with a bullet list, which is
 *   ineligible, and the follow-up opens "That last one" — so the section fell
 *   through to the Silver Fox attribution paragraph, which is not what the
 *   section is about.
 *
 * All three read better in the article too: a paragraph that carries its own
 * referent is not a worse paragraph. The article is already published, so this
 * is an update rather than a change to the drafting script. `publishedAt` is
 * untouched — the collection's beforeChange hook only stamps it on the
 * draft -> published transition.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "valleyrat-signed-adware-antivirus-exclusion-list";
const APPLY = process.argv.includes("--apply");

const EDITS: [string, string][] = [
  [
    `In every one of those the attacker had to do something. Here the attacker does nothing. **The user removes the protection themselves, in advance, for a good reason** — the alert was genuinely a false positive about genuinely annoying software — and the malicious payload arrives later through the exemption already granted.`,
    `Every comparable case this month needed the attacker to do something. Here the attacker does nothing: antivirus flags the adware, **the user adds it to the exclusion list for a perfectly good reason** — the alert was correct about genuinely annoying software — and the backdoor arrives later through the hole already made.`,
  ],
  [
    `The signed **QnWallpaper.exe** loads a malicious **libcef.dll** placed in the same directory — **DLL side-loading**, the same technique behind [Sleepwalker](/article/sleepwalker-backdoor-magic-packet-no-outbound-traffic) and [TerminalFix](/article/terminalfix-clickfix-windows-terminal-reverse-tunnel) this month.

The signature on the executable is genuine. The application is genuine. Only the library beside it is not, and the operating system will happily let a trusted process load it.`,
    `The signed **QnWallpaper.exe** loads a malicious **libcef.dll** dropped beside it — **DLL side-loading**. The signature on the executable is genuine. The application is genuine. Only the library next to it is not, and Windows will happily let a trusted process load it.

It is the same technique behind [Sleepwalker](/article/sleepwalker-backdoor-magic-packet-no-outbound-traffic) and [TerminalFix](/article/terminalfix-clickfix-windows-terminal-reverse-tunnel) this month.`,
  ],
  [
    `That last one is the detail worth noticing. It is not a defence against detection — it is a defence against **removal**. An analyst who finds it and kills the process takes the system down, which buys the operator time and makes a nervous administrator hesitate.`,
    `**ValleyRAT** captures keystrokes and clipboard, takes screenshots, disables Windows Defender through the registry, and **flags itself as a critical process** — so terminating it crashes the machine. That last trick is not a defence against detection but against **removal**: an analyst who kills the process takes the whole system down, which buys the operator time and makes a nervous administrator hesitate.`,
  ],
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
let applied = 0;

for (const [before, after] of EDITS) {
  if (!body.includes(before)) {
    console.error(`\nparagraph not found — the body has moved on:\n  ${before.slice(0, 90)}...`);
    process.exit(1);
  }
  body = body.replace(before, after);
  applied += 1;
  console.log(`\n--- ${applied} ---`);
  console.log(`-  ${before.split("\n")[0].slice(0, 100)}...`);
  console.log(`+  ${after.split("\n")[0].slice(0, 100)}...`);
}

console.log(`\n${applied} paragraph(s) rewritten, ${doc.body.length} -> ${body.length} chars`);

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log(`\nupdated: ${SLUG}`);

// The afterChange hook fires its revalidate and IndexNow work without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
