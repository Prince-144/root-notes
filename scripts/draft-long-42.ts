/**
 * Drafts the US/China AI-electricity piece.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-42.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-42.ts --update
 *
 * Researched from a viral reel making a tidy engine/fuel argument. The
 * argument turns on one number, and the number is the wrong kind.
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
    slug: "china-3x-capacity-2x-electricity-which-number-runs-a-datacentre",
    title:
      "China has 3x America's generating capacity and 2.3x its electricity. A data centre runs on the second number",
    excerpt:
      "A viral explainer says China makes about three times America's electricity, so the AI race comes down to power. China's installed capacity is about 3x. Its actual electricity is 2.3x. The gap between those two figures is wind and solar nameplate, and it is the difference between a number that sounds decisive and a number that runs a training cluster overnight.",
    categorySlug: "ai",
    tags: [
      "ai-infrastructure",
      "electricity",
      "china",
      "xai",
      "data-centres",
      "fact-check",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1781527835816-e8dcb12f226c${P}`,
    body: `A short video doing well right now makes an argument that is genuinely good: America has the best AI chips and cannot get the power to run them, China has the power and cannot make the chips, and whoever fixes their weakness first wins. One has the engine, the other has the fuel.

It is a clean frame. It rests on one number, and the number is the wrong kind.

## What Musk actually said

On **25 July 2026**, in an interview with **Zanny Minton Beddoes**, editor-in-chief of *The Economist*, Musk said there is a **"good chance"** China becomes the world leader in AI. He named the condition himself: **"The only thing now preventing it is China's lower computing power. But that could change."**

He cited two supporting figures — a **3-to-1 electricity capacity** advantage, and roughly **half** the world's top AI researchers.

The reel's on-screen headline is "Elon admitted China Will Win the AI Race". *Admitted* is carrying the weight there. A conditional probability offered by someone who is simultaneously building his own power plants is a forecast about a bottleneck, not a concession of defeat.

Worth saying plainly: the underlying observation is Musk's, it is on the record, and it is not silly. What travels is the compression.

## Capacity is not electricity

Musk said **capacity**. The reel says China "makes ~3x America's electricity". Those are different quantities, and the substitution is where the argument quietly breaks.

**Installed capacity** is nameplate — the maximum a fleet could produce with everything running flat out. China's total generating capacity reached **3.89 TW** at the end of 2025, up **16.1%** year on year. The most recent comparable US figure is **1.28 TW** at the end of 2024. That is roughly **3 to 1**, and Musk's number is fair.

**Generation** is what actually arrives. Per Ember, China's 2025 electricity demand was **10,573 TWh**; the United States' was **4,536 TWh**. That is **2.33 to 1**.

The gap between 3x and 2.33x is not a rounding difference. It is composition. China added more than **430 GW** of wind and solar in 2025 alone, pushing combined wind and solar past **1.8 TW**. Those technologies carry enormous nameplate and modest capacity factors, so China's nameplate outruns its delivered energy by design.

Which means the 3x figure — the one the reel leads with — is the measure **least** relevant to the thing being argued about. A frontier training run is a constant load. Solar nameplate at two in the morning is zero. The number that matters for a data centre is firm, round-the-clock generation, and on that measure the ratio is 2.33, not 3.

## The gap is also not closing quickly

China grew electricity demand **+503 TWh (+5.0%)** in 2025. The US grew **+131 TWh (+3.0%)**. China added more demand in one year than most countries generate in total — that part of the story is real and underappreciated.

But run the two growth rates forward. The ratio widens by about **1.9% a year**. Getting from 2.33 to 3.0 at that pace takes roughly **13 years**, not one. Any version of this claim that puts a 3x *generation* advantage in the present tense is describing something that has not happened yet.

## America's problem is the queue, not the generator

"America cannot get enough power" is true in effect and wrong in mechanism, and the mechanism is the whole point.

The United States is not short of people wanting to build generation. In early 2025, **PJM** — one grid operator, covering 13 states and 65 million people — had more than **2,600 GW** of pending interconnection requests. That is **more than twice the entire installed capacity of the US grid**, waiting in a single queue.

Only about **20%** of projects in US interconnection queues ever reach operation, with a **five-year median wait**.

So the constraint is not generation. It is connection: a process bottleneck, not a physical one. That distinction matters because the two have completely different fixes, and building more national capacity does nothing for a project that cannot get an interconnection agreement.

It also explains the turbines.

## What the turbines cost, and who paid

The reel's cheerful line is that Musk "gave up waiting and runs his own turbines". He did. That is the correct response to a queue problem, and it is the part of the story with a bill attached.

At **Colossus I** in Memphis, xAI runs **15** methane gas turbines. The Shelby County Health Department issued an air permit on **2 July**; the Southern Environmental Law Center appealed it on behalf of the **NAACP** and **Young, Gifted & Green**. The department had earlier treated the turbines as exempt from the federal Clean Air Act under a **"nonroad engines"** provision — which, SELC argues, does not cover turbines of that size. The NAACP filed a notice of intent to sue over the unpermitted period in **June 2025**.

At **Colossus 2** in **Southaven, Mississippi**, the NAACP sued xAI and its subsidiary MZX Tech in **April 2026** over **27** gas turbines operated **without an air permit** — in practice, a power station built beside a data centre.

None of that is in the reel, and it is not a footnote. "Build your own generation" is presented as a clever workaround. What it actually did was move an emissions cost onto specific neighbourhoods, and the legality of that is being contested in court right now. Whether the suits succeed is not for us to predict — but the case exists, and a story about AI's power problem that ends at "so he built his own" has stopped one sentence early.

## China's constraint is not only chips

The other half of the frame — China has fuel but no engine — is the half with the most evidence against it.

Writing for **ASPI** in **May 2026**, Angela Glowacki and Cartus Bo-Xiang You documented the opposite problem: China's AI compute is **overbuilt and underused**. Some data centres in the western provinces run at **20-30%** utilisation against a policy target of **more than 60%**. By 2024 the national programme had produced **633** hyperscale and large data centres and **268 EFLOPS** of capacity.

The reasons are unglamorous and have nothing to do with export controls: western sites lacked the fibre for real-time data movement, struggled to attract skilled staff and local customers, and sit far from the eastern demand that needs low latency. Renewable curtailment in the west still exceeds **30%** — power generated where nobody can use it.

Beijing's response is the tell. The government restated a **60%** minimum utilisation rule and **banned new large data-centre construction in cities where existing facilities run below 50%**. In **November 2025** it introduced electricity subsidies of up to **50%** for data centres using **domestically produced** semiconductors.

You do not subsidise demand for a thing that is scarce. Both of those are interventions against a glut.

And the scale check: data centres account for about **1.68%** of China's total electricity consumption, forecast to reach **3%** by 2030. A country using under two percent of its power on data centres is not a country whose electricity advantage is currently the operative variable. For comparison, US data centres were around **4%** of national consumption in 2024, heading for a projected **9-17%** by 2030.

The engine/fuel picture predicts China straining against a chip ceiling while its grid idles. What the evidence shows is a country that built the halls before the demand arrived.

## How to check the next version of this claim

This one will be back, because it is a good story and the underlying trend is real. Three questions do most of the work:

- **Capacity or generation?** If a comparison is in GW it is nameplate; if it is in TWh it is delivered energy. For anything running 24/7, only the second one counts.
- **Which year, for which country?** The cleanest-looking ratios in this debate compare one country's newest figure with another's older one.
- **Is the constraint physical or procedural?** "Cannot generate" and "cannot connect" both look like a power shortage from outside and need opposite responses.

## What is not established

- **Whether China's utilisation problem persists.** The ASPI figures describe 2024-2026 and the subsidies are new; a glut can be absorbed.
- **How much advanced compute China actually has.** Domestic accelerator output and yields are not publicly verifiable, and everyone quoting a number is estimating.
- **The outcome of the xAI litigation.** Claims have been filed; nothing is proven, and xAI disputes the allegations.
- **Whether power stays the binding constraint at all.** Efficiency gains, better utilisation, or a change in model scaling could move the bottleneck somewhere else entirely.
- **The US installed-capacity figure for end-2025.** The comparison above uses end-2024 for the US against end-2025 for China, because that is what is published. It flatters the ratio slightly.`,
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
      // Every other article on the site carries this byline; "Root Notes"
      // would render as a second, non-existent author on the article page.
      author: "Prince Baruwala",
      publishedAt: new Date().toISOString(),
      status: "draft",
    },
  });
  console.log(`drafted: ${draft.slug} (id ${created.id}, ${draft.categorySlug}, ${words} words)`);
}

await new Promise((resolve) => setTimeout(resolve, 3000));
process.exit(0);
