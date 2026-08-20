/**
 * Draft — checking a viral claim that Google "quit the AI race on purpose".
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Sourcing note: two of the five claims check out exactly, one is true but
 * omits the structure that reverses its meaning, one could not be found, and
 * one is framing the evidence works against. The piece says which is which
 * rather than reaching a single verdict, because the claims do not share one.
 *
 * Pass --update to rewrite an existing draft; published articles are skipped.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "../payload-types";

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

const DRAFTS: Draft[] = [
  {
    slug: "google-quit-the-ai-race-claim-checked-tpu-anthropic-backstop",
    title:
      "Google is not selling picks and shovels — it is underwriting the miner",
    excerpt:
      "The claim going round is that Google quietly left the AI race and now profits from everyone else's: Cloud up 82%, TPUs sold to Anthropic, no risk taken. The growth figure is exactly right. The risk part is not — Google took roughly 20% of an Anthropic data centre and agreed to cover the lease and power if Anthropic defaults.",
    categorySlug: "ai",
    tags: [
      "google",
      "anthropic",
      "tpu",
      "cloud",
      "fact-check",
      "ai-infrastructure",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1697952431907-8542919a16b3${P}`,
    body: `A widely shared version of Google's position runs like this: it lost its best AI people, it stopped trying to win, and it is now quietly making more money than OpenAI or Anthropic by selling them the infrastructure instead.

Parts of that are exactly right. The part everyone repeats — that Google is taking the safe side of the trade — is the part that does not survive reading the contracts.

## The departures happened, and the detail everyone leaves out

On **5 August 2026**, four people left Google in one day: **Jeff Dean**, employee number **30**, after more than **27** years; **Sanjay Ghemawat**, a senior fellow; **Oriol Vinyals**, a vice president at DeepMind; and **Quoc Le**, a co-founder of Google Brain. Between them they hold somewhere between **60** and **90** years of Google tenure and their names are on a large share of the infrastructure the industry runs on.

They are building **Discovery Loop**, an independent public benefit corporation aiming to automate scientific and engineering research.

Here is what the viral version omits: **Google is a founding investor and the cloud partner.**

That single fact changes the story from an exodus into something closer to a spin-out. The same day, **Demis Hassabis** moved to Chair of Google DeepMind and **Koray Kavukcuoglu** became SVP — a reorganisation, not an evacuation. Alphabet stock fell about **5%** on the news, which tells you how the market read it at the time, not whether the market was right.

## The 82% is real

Google Cloud revenue rose **82%** to about **$24.8 billion** in Q2 2026. Operating income reached **$8.8 billion**, up from **$2.8 billion** a year earlier, on a backlog reported at **$514 billion**. Alphabet's total revenue grew **24%**.

The margin line is the more interesting one. Tripling operating income while revenue does not quite double is what vertical integration looks like — Google designs the chips, so it is not paying somebody else's margin on the most expensive component in the building.

That claim checks out without qualification. It is the strongest thing in the viral version and it is stated accurately.

## The TPU claim is true and materially incomplete

Google does sell its own **TPUs** to competitors, Anthropic among them. The arrangement is real and it is enormous — roughly **$35 billion** of Google chips reaching Anthropic through a structure built with **Broadcom** and **Morgan Stanley**, inside a web of contracts reported at around **$200 billion** that depend on Anthropic's revenue continuing to grow. Broadcom's own filings list **$128 billion** in purchase commitments through **2028**, nearly all of it tied to Google TPUs.

Now the part that reverses the conclusion.

**Morgan Stanley** is leading a **$15 billion** debt package for an Anthropic data centre in **Hubbard, Texas**. Google is providing a financial backstop. It takes roughly **20%** equity in the project, and it has committed to covering billions in lease and power costs **if Anthropic defaults**.

That is not a picks-and-shovels position. The whole appeal of selling shovels in a gold rush is that you get paid whether or not the miner finds anything. Google has agreed to pay some of the miner's bills if the mine comes up empty.

## So what is Google actually doing

Something more deliberate and more exposed than "quit the race".

It is engineering where the risk sits — moving some off its own balance sheet through Broadcom and the banks, while accepting concentrated counterparty exposure to one customer elsewhere. Both moves are in the reporting, and they are not contradictory: you can shift risk off a balance sheet and still be the party that pays when things go wrong.

What that buys is demand certainty for a chip programme that only pays back at enormous volume. A TPU generation needs customers committed years ahead to justify the fabrication, and there are very few buyers on earth at that scale. Underwriting one of them is how you make sure the order does not evaporate.

It is a strategy with a genuine failure mode, and it is the opposite of risk-free.

## The Morgan Stanley figure we could not find

The claim is that Morgan Stanley projects Google Cloud past **$300 billion** by **2028**.

We could not locate that projection. What Morgan Stanley has published is about the market rather than one company: roughly **$3 trillion** of AI-related infrastructure investment flowing through the global economy by **2028**, AI capital expenditure forecasts raised to **$1.4 trillion** by **2028**, and GenAI semiconductor spending reaching **$280 billion** in **2028** from **$115 billion** in 2024.

That last figure is close to the number in the claim and describes something entirely different — the whole industry's chip spend, not one company's cloud revenue. We are not going to assert that is where the claim came from. We are noting that we cannot find the projection as stated, and that anyone repeating it should be able to point at it.

## Where that leaves the five claims

| Claim | Verdict |
| --- | --- |
| Four senior AI people left on 5 August, Dean after 27 years | **Correct**, and Google funds their startup |
| Google Cloud grew 82% | **Correct** |
| Google sells TPUs to rivals including Anthropic | **Correct**, but omits the backstop |
| Morgan Stanley projects Cloud past $300bn by 2028 | **Not found** |
| Google quit the AI race on purpose | **Not supported** |

Two out of five stated accurately is a better record than most viral business analysis manages. The two that fail are the two carrying the argument.

## Why this shape of claim keeps working

Because a counter-intuitive frame — *everyone thinks this is a loss, actually it is a win* — is more shareable than the accurate version, which is that a very large company is making a very large, very concentrated bet and has arranged the financing so the exposure is hard to see from outside.

We made the same point about [a criticism of Anthropic that a government lab answered a day later](/article/too-dangerous-to-release-mythos-claim-checked-aisi), and about [the thirty-minutes-to-exploit figure](/article/thirty-minutes-to-exploit-tracing-the-claim). The reflex worth building is not scepticism about any particular creator. It is checking whether the number quoted describes the thing it is being used to prove.

## What is not established

- **Whether the strategy works.** The contracts depend on Anthropic's revenue continuing to grow, and that has not happened yet.
- **Google's total exposure.** The backstop obligations are reported, not itemised publicly.
- **Why the four left.** Nobody has given a reason beyond the new company's stated purpose.
- **Whether Google is de-emphasising Gemini.** Nothing in the reporting says so, and the reorganisation is not evidence of it.`,
  },
];

const UPDATE = process.argv.includes("--update");
const payload = await getPayload({ config });

for (const draft of DRAFTS) {
  const { docs: clash } = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
  });

  if (clash.length > 0) {
    const existing = clash[0] as { id: number | string; status: string };
    if (!UPDATE || existing.status === "published") {
      console.log(`skip (${existing.status}): ${draft.slug}`);
      continue;
    }
    await payload.update({ collection: "articles", id: existing.id, data: { ...draft } });
    console.log(`updated: ${draft.slug} (${draft.body.split(/\s+/).length} words)`);
    continue;
  }

  const created = await payload.create({
    collection: "articles",
    data: {
      ...draft,
      author: "Prince Baruwala",
      publishedAt: new Date().toISOString(),
      status: "draft",
      featured: false,
      views: 0,
    },
  });

  console.log(
    `drafted: ${draft.slug} (id ${created.id}, ${draft.categorySlug}, ${draft.body.split(/\s+/).length} words)`,
  );
}

process.exit(0);
