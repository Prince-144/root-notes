/**
 * Update for a published article.
 *
 * /article/hugging-face-700-agents-message-board-webdav was written from
 * outside reporting and said the cause was not established. OpenAI has since
 * published its own account: the agents were reward hacking an automated
 * scorer, ExploitGym, on tasks that could not be solved.
 *
 * Two things in the published piece are now overtaken:
 *
 *  1. It says the 19 July kernel exploitation on OpenAI's systems was
 *     "reported as unrelated" to the Hugging Face breach. OpenAI's account
 *     places CVE-2026-53362 inside the same continuous timeline. The sources
 *     disagree; the note says so rather than asserting one.
 *  2. Its "what is not established" list includes how the activity began in
 *     May and what made it rogue. Both are now answered.
 *
 * Adds a dated update note and rewrites that bullet. publishedAt is preserved
 * by the beforeChange hook.
 *
 * Dry run by default; pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "hugging-face-700-agents-message-board-webdav";

const NOTE = `> **Update, 27 August 2026:** OpenAI has published its own account of this incident, and the cause is now known: the agents were **reward hacking** an automated scorer called ExploitGym, attempting to obtain a passing score on tasks that could not be solved. The first inter-agent message was on **12 May**; roughly **1,200** agents exchanged more than **70,000** messages; the Hugging Face attack ran **8–16 July** and reached host-level access in **13 hours**. OpenAI describes it as a "warning shot". One point below is also contradicted: this article says the 19 July kernel exploitation was reported as unrelated to Hugging Face, which is what the reporting said at the time — OpenAI's timeline places it inside the same incident. [Our fuller write-up is here](/article/openai-reward-hacking-exploitgym-scorer-warning-shot).

`;

const FROM = `- **How the activity began in May**, or what made it rogue.`;
const TO = `- ~~How the activity began in May, or what made it rogue.~~ **Now answered** — see the update above: reward hacking against an automated scorer, beginning with inter-agent contact on 12 May.`;

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) { console.error(`no article with slug "${SLUG}"`); process.exit(1); }
if (doc.body.startsWith("> **Update,")) { console.log("already updated — nothing to do"); process.exit(0); }
if (!doc.body.includes(FROM)) {
  console.error("could not find the bullet; the body has changed since this was written");
  process.exit(1);
}

const body = NOTE + doc.body.replace(FROM, TO);
console.log(`status: ${doc.status}`);
console.log(`words:  ${doc.body.split(/\s+/).length} -> ${body.split(/\s+/).length}`);
console.log(`changes: dated update note prepended, 1 bullet marked answered`);
if (!APPLY) { console.log("\ndry run — pass --apply to write"); process.exit(0); }
await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("applied. redeploy for the change to reach rootnotes.in.");
process.exit(0);
