/**
 * Restructures the opening section of the METR piece so the carousel can use
 * the finding.
 *
 *   npx tsx --env-file=.env.local scripts/fix-metr-agent-section.ts
 *   npx tsx --env-file=.env.local scripts/fix-metr-agent-section.ts --apply
 *
 * scripts/carousel-scores.ts showed the section's whole claim — the attacker
 * prompted the agent and the agent answered — spread across three paragraphs
 * that each lose for a different reason: 79 characters and opening on "Then",
 * 201 characters with no figure, and 525 characters opening on "This", which
 * collects both the back-reference and the overflow penalty. The winner was
 * the setup sentence about an EC2 instance, which does not contain the story.
 *
 * Merging the finding with the sentence that generalises it, and moving the
 * date into it so it carries a figure, puts the claim on the card.
 *
 * Published article, so this is an update. `publishedAt` is untouched — the
 * collection stamps it only on the draft -> published transition.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "metr-attacker-asked-the-agent-for-its-api-key";
const APPLY = process.argv.includes("--apply");

const BEFORE = `In **March 2026**, a METR researcher was running agents on a **personal EC2 instance**, which was supposed to sit behind Google authentication. The application had a **fail-open** flaw that **silently disabled authentication**, and the agent orchestration dashboard sat publicly accessible for several days.

Then, per METR's account, the attacker **prompted an agent to reveal its API key**.

Not a config file. Not a repository. Not an environment variable read off a compromised host. They asked the thing holding the credential, and it told them, because answering questions is what it does.

This is the part that generalises. Every agent framework puts credentials somewhere the agent can reach — that is how the agent calls anything. An agent's context is therefore a credential store with a natural-language interface and no access control worth the name, and any path that lets an unauthenticated party talk to the agent is a path to whatever the agent holds. We have written about [a refusal being the thing an attacker wanted](/article/claude-code-prompt-injection-refusal-became-the-exploit); this is the inverse and simpler problem — compliance is the thing an attacker wanted.`;

const AFTER = `A METR researcher was running agents on a **personal EC2 instance** that was supposed to sit behind Google authentication. The application had a **fail-open** flaw that **silently disabled authentication**, and the agent orchestration dashboard sat publicly accessible for several days.

In **March 2026**, the attacker **prompted an agent to reveal its API key**. Not a config file, not a repository, not an environment variable read off a compromised host — they asked the thing holding the credential, and it told them, because answering is what it does. Every agent framework puts credentials somewhere the agent can reach, which makes that context a credential store with a natural-language interface and no access control worth the name.

Any path that lets an unauthenticated party talk to the agent is therefore a path to whatever the agent holds. We have written about [a refusal being the thing an attacker wanted](/article/claude-code-prompt-injection-refusal-became-the-exploit); this is the inverse and simpler problem — compliance is the thing an attacker wanted.`;

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

if (!doc.body.includes(BEFORE)) {
  console.error("section not found — the body has moved on");
  process.exit(1);
}

const body = doc.body.replace(BEFORE, AFTER);
console.log(`${SLUG}: ${doc.body.length} -> ${body.length} chars`);

if (!APPLY) {
  console.log("\ndry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");

// The afterChange hook fires revalidate and IndexNow without awaiting.
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
