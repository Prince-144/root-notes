/**
 * Drafts the IDScan / Nexus piece.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-56.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-56.ts --update
 *
 * The forensic detail is the part the coverage is skipping: each record carried
 * six images including infrared and ultraviolet versions, which no phone camera
 * or photocopier produces. That is what places the source at ID-verification
 * hardware rather than at a photo database, and it is the strongest link in
 * Krebs's chain.
 *
 * Care taken throughout on what is established: 153 million is the criminal
 * service's advertised inventory, Krebs verified samples including his own
 * record, and IDScan has confirmed no breach. Hertz did not respond and its
 * role is a timestamp coincidence in one person's account, not a proven path —
 * the piece says so rather than implying otherwise.
 *
 * No backticks in the body: inline code spans inside the template literal
 * break the MDX parse.
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
    slug: "idscan-nexus-infrared-ultraviolet-copies-traced-the-scans",
    title: "The stolen licence scans include infrared and ultraviolet copies. That is what traced them to a scanner",
    excerpt:
      "A dark web service called Nexus advertised more than 153 million US and Canadian driver's licence scans, six image files each. Brian Krebs found his own licence in it, and his mother's, timestamped seconds apart on a day they both rented a car. The infrared and ultraviolet frames are the detail that says where the images came from.",
    categorySlug: "security",
    tags: ["idscan", "breach", "identity", "krebs", "dark-web", "fbi", "privacy"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1726137569906-14f8079861fa${P}`,
    body: `On **1 September 2026**, Brian Krebs reported that a new identity theft service on the Russian cybercrime forum Exploit, calling itself **Nexus**, was advertising digital scans of more than **153 million** US and Canadian driver's licences — along with more than **10 million** ID cards, more than **3 million** travel documents and international IDs, and at least **579,000** medical cards.

By **2 September** the service had vanished, replaced with "This service is no longer available". The **FBI's New Orleans field office** has opened an investigation. Several US law firms have begun class action work.

**IDScan.net** — the New Orleans identity verification company whose technology the data is attributed to — has confirmed nothing.

## Six files per person

Each record in Nexus reportedly carried **six image files**: three pairs of front-and-back photographs of the licence — a basic image scan, an **infrared** version, and an **ultraviolet** version.

That detail is the whole forensic case, and most coverage is walking past it.

Your phone does not photograph in infrared. A photocopier does not produce an ultraviolet frame. Those channels exist in one context: **purpose-built identity verification hardware**, which images a document across multiple wavelengths precisely because a licence's anti-counterfeiting features — the UV-reactive inks, the IR-visible layers — only appear outside the visible spectrum. That is how the machine knows the document is genuine.

So the images did not come from a database of photographs somebody uploaded. They came out of the equipment at the counter. The apparatus that existed to prove your licence was real is the apparatus that produced the file.

## How it was traced

Krebs did not find this from the outside. The Nexus proprietor offered him **his own Virginia licence as a free sample**.

He confirmed it: six image files, with a timestamp corresponding to **June 2025**, when he flew to attend a family funeral. **His mother's licence was in there too**, timestamped **a few seconds apart** from his. Both had rented from Hertz at their destination that day.

His own recollection, which he publishes rather than smoothing over: "I don't recall if the rental car representative inserted our licenses into any kind of machine, but I remember they held onto them for several minutes."

Interviews turned that single data point into a pattern — licences appearing with timestamps matching **car rentals and visits to marijuana dispensaries**. IDScan.net counts Hertz among its clients and has a partnership with Planet13 dispensaries, and its technology performs the infrared and ultraviolet scanning that matches the Nexus image types.

Three independent things converge: the image types, the customer sectors, and the timestamps. That is a strong chain. It is still a chain of inference, and Krebs writes it as one, saying the operation "appears to be siphoning images" and noting he cannot tell what timezone the timestamps are in.

## What is established and what is advertised

Worth separating carefully, because the number will be repeated everywhere without its qualifier.

**153 million is Nexus's claim about its own inventory.** Criminal marketplaces inflate. Krebs verified specific records, including two he could check personally against his own memory of a specific day — which is unusually strong verification for a sample, and no verification at all of a total.

**IDScan has not confirmed unauthorised access.** Its only on-record words come from Jillian Kossman: "At this point I'm not able to share any additional information, but the updates you have provided have been welcome, and helpful to our team's investigation."

**Hertz did not respond to Krebs.** Its role is a coincidence of timestamps in one person's account, not a demonstrated path, and nobody has shown how images moved from any customer's counter to Nexus.

The lawsuits are allegations. The FBI investigation is an investigation.

## Nobody enrolled in this

Here is what makes it different from an ordinary breach.

You did not sign up for IDScan. You almost certainly have never heard of it. You handed your licence to a rental desk, a dispensary counter, a gun shop, a bank or a hotel — to prove you were who you said you were, for thirty seconds — and a machine you did not choose read it in three wavelengths and kept the result.

You cannot list which businesses you visited that used this. There is no account to close, no setting to change, and no relationship to end.

And unlike a password, **you cannot rotate a driver's licence.** The photograph is your face. The number is issued by the state and changes when the state says so. The address was your address. Everyone in that database is stuck with it for years. [We wrote last week about malware that profiles a machine so it can be priced as inventory](/article/brazetsu-profiles-your-machine-to-price-it-at-5-dollars-80); this is the same logic applied to people, at a resolution that makes the output usable for opening accounts in their names.

## The storefront closed. The data did not.

Nexus disappearing the day after Krebs published is not good news, and reading it as a win would be a mistake.

A shut storefront means one seller stopped taking public orders. It says nothing about copies already sold, copies retained, or the same inventory reappearing under another name — which is the normal life cycle of this business.

Meanwhile IDScan began notifying **business customers** around 1 September. The 153 million people whose faces are in the files have been notified by nobody, and under most US state breach laws the obligation to tell them sits with whoever is determined to have held the data — which is exactly the question still open.

## What to do

This is a section where honesty means admitting the options are thin.

- **Freeze your credit** at all three US bureaus, and in Canada at Equifax and TransUnion. It is free, and it is the one control that meaningfully blocks the main downstream use.
- **Expect synthetic identity fraud, not card fraud.** A licence image supports opening accounts, not draining existing ones. The signal is an unexpected credit inquiry or a letter about an account you never opened.
- **Do not wait for a notification.** You are unlikely to receive one, because the entity that would send it has not confirmed it holds the data.
- **If you are a business that scans IDs: ask your vendor what it retains and for how long.** Almost every deployment of this technology needs to verify a document, not to keep an image of it afterwards. Retention is a setting, and someone chose it.
- **Treat this as a policy failure rather than a personal one.** No individual precaution would have changed the outcome for anyone in that database.

## What is not established

- **Whether IDScan was breached.** The company has confirmed nothing and the FBI investigation is open.
- **How the images were obtained**, if they came from IDScan at all.
- **The real number of affected people.** 153 million is a seller's advertisement.
- **Whether Hertz, Planet13 or any named business is implicated** in the mechanism, as opposed to being a customer of the technology.
- **What the 579,000 "medical cards" are.** The category is not defined in the reporting.
- **Where the data went before Nexus closed**, or whether it reappears.`,
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
