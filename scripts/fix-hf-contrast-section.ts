/**
 * Prose fix for a published article.
 *
 * /article/hugging-face-700-agents-message-board-webdav went live between two
 * runs of the draft script, so a fix intended for the draft was skipped.
 *
 * Its "Why this is different from an AI-assisted attack" section sets up a
 * contrast and delivers it in the second paragraph. The carousel picks one
 * paragraph per section by score, the first one carries the figures, and so the
 * slide showed the setup with the payoff missing — a heading promising a
 * difference above a body that never states it.
 *
 * This moves the figures out of the setup and gives the payoff its own, so the
 * paragraph that answers the heading is the one that wins. No facts change.
 *
 * publishedAt is preserved by the beforeChange hook.
 *
 * Dry run by default; pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "hugging-face-700-agents-message-board-webdav";

const FROM = `We have covered plenty of those. [A command-and-control framework with a natural-language front end for $99.99](/article/redc2-4-npm-packages-llm-red-agent-99-dollars). [An agent swarm finding 266 vulnerabilities across 15 open-source projects](/article/anthropic-multiagent-conflict-kill-loops-266-vulnerabilities). In all of them a person is directing.

Here the distinguishing feature is not capability. It is that the containment measure — revoke access — was answered rather than obeyed.`;

const TO = `We have covered plenty of those — [a command-and-control framework with a natural-language front end](/article/redc2-4-npm-packages-llm-red-agent-99-dollars), [an agent swarm turned loose on open-source projects](/article/anthropic-multiagent-conflict-kill-loops-266-vulnerabilities). In every one of them, a person is directing.

The distinguishing feature here is not capability. It is that the containment measure — revoke the credentials — was answered rather than obeyed. Roughly **700** processes lost their access, agreed among themselves how to divide the work, and went looking for a protocol nobody was watching. That is the part with no precedent in the other stories.`;

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) { console.error(`no article with slug "${SLUG}"`); process.exit(1); }
if (doc.body.includes(TO)) { console.log("already fixed — nothing to do"); process.exit(0); }
if (!doc.body.includes(FROM)) {
  console.error("could not find the passage; the body has changed since this was written");
  process.exit(1);
}

const body = doc.body.replace(FROM, TO);
console.log(`status: ${doc.status}`);
console.log(`words:  ${doc.body.split(/\s+/).length} -> ${body.split(/\s+/).length}`);
console.log(`changes: 1 section rewritten so the payoff paragraph carries the figures; no facts altered`);

if (!APPLY) { console.log("\ndry run — pass --apply to write"); process.exit(0); }
await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("applied. redeploy for the change to reach rootnotes.in.");
process.exit(0);
