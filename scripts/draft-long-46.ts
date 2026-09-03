/**
 * Drafts the Apple leadership-transition piece, framed on encryption policy
 * rather than corporate succession.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-46.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-46.ts --update
 *
 * Two things the common framing gets wrong and this piece corrects: Cook did
 * not resign, and the announcement was not on 31 August.
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

const P = "?w=1600&h=900&fit=crop&crop=entropy&q=80";
const UPDATE = process.argv.includes("--update");

const drafts: Draft[] = [
  {
    slug: "tim-cook-executive-chairman-encryption-succession-uk-tribunal",
    title:
      "Tim Cook did not resign. He became executive chairman, and the job description names policymakers",
    excerpt:
      "31 August was Cook's last day as Apple CEO after about 15 years, but the transition was announced on 20 April and he has not left the company. He moves to executive chairman with a remit that explicitly includes engaging with policymakers — in the same month Apple's encryption fight with the UK Home Office reaches a tribunal.",
    categorySlug: "security",
    tags: ["apple", "tim-cook", "john-ternus", "encryption", "uk", "policy"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1602475063211-3d98d60e3b1f${P}`,
    body: `The version of this story travelling fastest is that Tim Cook resigned from Apple on 31 August after 15 years. Two parts of that are wrong, and the second one is the interesting one.

## What actually happened

Apple announced the transition on **20 April 2026**, not in August. The handover took effect on **1 September 2026**, which made **31 August** Cook's last day as chief executive — a date, not an announcement.

And he did not resign. **Cook became Apple's executive chairman.** He is still at the company, on the board.

**John Ternus**, previously senior vice president of Hardware Engineering, is the new chief executive. **Arthur Levinson** moved from non-executive chairman to **lead independent director**. Apple describes the process as "a thoughtful, long-term succession planning process", approved unanimously by the board.

Cook had been CEO since 2011, so roughly 15 years is right.

## The job description is the story

Apple's own wording for what Cook does next is narrow and specific. His responsibilities include **"assisting with certain aspects of the company, including engaging with policymakers around the world"**.

Companies do not usually name one function in a chairman's remit. When they do, it is the function they think needs a particular person.

For Apple, the policy relationship has never been an ordinary government-affairs job. It is the one where the company has repeatedly told states that it will not build what they are asking for, and that position has always been carried by the chief executive personally.

## What Cook made non-negotiable

On **16 February 2016**, in response to a court order to help the FBI unlock an iPhone recovered after the San Bernardino attack, Cook published **"A Message to Our Customers"**.

He wrote that the government had demanded **"an unprecedented step which threatens the security of our customers"**, and that Apple opposed the order because it had **"implications far beyond the legal case at hand"**.

That letter did something more durable than win a case. It converted a technical position — we do not hold the key, and we will not build a way to hold it — into an institutional commitment made in public by a named person. Every subsequent demand has had to be argued against that.

The question a succession raises is whether the commitment survives the person. Cook's new title suggests Apple has decided not to find out yet.

## The handover lands on a live case

The timing is worth laying out plainly, without implying more than the record supports.

In **2025**, the UK government secretly ordered Apple to provide access to data protected by **Advanced Data Protection**, the end-to-end encrypted iCloud tier — and the order reached beyond British users. Apple's response was to **stop new UK users enabling ADP at all**, and to challenge the order at the **Investigatory Powers Tribunal**. That first notice was dropped after American pushback.

The Home Office issued a **second** one. Apple filed a fresh complaint with the tribunal on **13 July 2026**, and [the underlying demand has not changed](/article/apple-uk-icloud-technical-capability-notice-second): access to backups that are end-to-end encrypted by design.

A hearing is set for **September**.

So the month Apple changes chief executive is also the month its encryption position is argued in front of a British tribunal, and the outgoing chief executive's new job is the one that deals with governments.

**Nothing published connects those facts.** Apple announced the succession in April, gave product and continuity reasons, and has not linked it to the litigation. Treat the sequence as a sequence.

## What we do not know about Ternus

Ternus joined Apple's product design team in **2001**, became vice president of Hardware Engineering in **2013**, and joined the executive team in **2021**. He holds a mechanical engineering degree from the **University of Pennsylvania** and worked at Virtual Research Systems before Apple.

That is 25 years of building hardware. It is also, for our purposes, a public record with almost nothing in it about encryption policy, lawful access, or how far he would go in a standoff with a government.

Cook's position was not knowable in 2011 either. It became knowable in 2016, when he was asked.

## Why this is a security story and not a business one

Apple is not an ordinary vendor in this argument. Because iMessage, iCloud backups and device encryption are deployed at consumer scale, where Apple sets the line effectively sets a global floor — and a precedent won against Apple is a precedent available against everyone smaller.

The company also runs one of the few large-scale [state-actor targeting notification programmes](/article/apple-mercenary-spyware-notifications-110-countries), which only makes sense in a company that has decided its adversary model includes governments.

Both of those are policy commitments, not features. Features survive a change of chief executive automatically. Commitments do not.

## What is not established

- **Whether Cook's remit relates to the UK case.** Apple says "policymakers around the world" and nothing more specific.
- **What Ternus thinks about lawful access.** No public statement exists that we could find.
- **Whether the September hearing will be public**, or how much of it will be. Investigatory Powers Tribunal proceedings are frequently closed.
- **Whether the second notice is identical in scope to the first.** It has not been published; the reporting describes the demand, not the text.
- **How long Cook stays.** Executive chairman is a role, not a term.`,
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
