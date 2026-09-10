/**
 * Drafts the 10 September cross-category batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-70.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-70.ts --update
 *
 * Written to fill the category gaps rather than the news cycle. The site is
 * 63 percent security by volume and startups had three published pieces in
 * thirty days, so this batch is 2 startups, 1 ai, 1 world, 1 gadgets.
 *
 *   1. Nvidia buying Hugging Face. Confirmed by Nvidia's own blog and an SEC
 *      8-K, not by rumour. The company that sells the compute now owns the
 *      shelf the weights sit on.
 *   2. Claude Fable 5.1 pricing. Headline rates unchanged at 10 and 50 dollars
 *      per million; cache reads went from 1.00 to 0.25. On agentic workloads,
 *      where the same context is re-read every turn, cache reads are most of
 *      the input bill, so a static headline hides a real cut.
 *   3. Red Sea cable cuts. Four systems, and the internet stayed up. The scarce
 *      resource is not bandwidth, it is the repair fleet.
 *   4. Failing the Fix 2026. The grades moved because PIRG changed rulers -
 *      from the French index to EPREL, which weights disassembly properly.
 *   5. Crusoe. The 3 billion raise is the smaller number; the 13 billion
 *      five-year contract that preceded it was signed by a trading firm.
 *
 * Covers are Unsplash, each checked at full 1600x900 and reuse-checked. The
 * first datacentre pick was discarded at full size because it carried another
 * company's branding on every rack.
 *
 * No backticks and no angle brackets in the bodies.
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
    slug: "nvidia-hugging-face-bought-the-shelf-the-models-sit-on",
    title: "Nvidia bought the shelf the models sit on",
    excerpt:
      "The 12.93 billion dollar deal for Hugging Face is confirmed in an SEC filing, not a rumour. The company that already sells the hardware models train and run on now owns the place 3 million of them are distributed from — and a hub is not storage, it is the default resolver.",
    categorySlug: "startups",
    tags: ["nvidia", "hugging-face", "acquisition", "open-weights", "ai-infrastructure", "sec-filing", "supply-chain"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1716967318503-05b7064afa41${P}`,
    body: `**Nvidia** is buying **Hugging Face** for **12.93 billion dollars**.

This is not a report of talks. Nvidia entered a definitive agreement on **2 September 2026**, announced it on its own blog, and filed it with the **SEC**. The structure: roughly **11.9 billion dollars** to Hugging Face stockholders, plus an equity retention program of up to about **1.0 billion dollars** for employees joining Nvidia. It is expected to close in the **first half of 2027**, subject to regulatory approvals.

Nvidia says Hugging Face will remain **"an open platform for the entire AI ecosystem"** and that it will continue supporting open-weight and open-source models.

## What is actually being bought

The numbers Nvidia published about the thing it is buying:

- More than **18 million** developers, researchers and creators
- More than **3 million** models shared on the platform
- More than **200,000** companies using it to discover and deploy AI

Notice what is not in that list: revenue. This is not an acquisition priced off a P&L. It is priced off a position.

## A hub is not storage. It is the default resolver.

The instinct is to read Hugging Face as a file host — a big shelf where open weights happen to sit. That undersells what the asset is.

A package hub is the thing that answers the question *where does this come from*. It resolves a name to an artefact. It decides what the default version is, what appears when you search, what is featured, what is deprecated, what is quietly hard to find. It sees every download, from which organisation, of which model, at what rate.

That last property is the one worth sitting with. Whoever runs the hub has the highest-resolution view in existence of what the world is actually running — not what the benchmarks say, not what the launch posts claim, but what gets pulled. Nvidia sells the hardware those models run on. It has just acquired the demand signal for its own product, ahead of the purchase orders.

None of that requires anyone to behave badly. The defaults do the work whether or not anyone touches them.

## The supply-chain shape is already familiar

There is a second reading, and security people will get to it faster than markets will.

Hugging Face is to model weights roughly what npm is to JavaScript packages: the place a name gets resolved to a binary artefact that then executes inside your environment. [The Shai-Hulud worm's newer variant went looking through AI tool configuration for exactly this class of credential](/article/shai-hulud-searches-469-places-now-and-one-of-them-is-your-ai-config), because that is where the leverage is.

Model weights carry the same properties as packages and one worse one: they are large, they are opaque, and there is no established practice of reading them. A diff is not available to you. Provenance is whatever the hub asserts.

Consolidating that under a single owner is not automatically bad — a well-resourced owner can fund signing, scanning and provenance work that a startup could not. It does concentrate a dependency that a great many organisations did not previously think of as a dependency at all.

## The open-platform commitment is the thing to watch

Nvidia's statement that the platform stays open is the load-bearing claim, and it will be tested in dull ways rather than dramatic ones.

The question is not whether Nvidia bans competitors' models — that would be visible and costly. It is whether the platform's roadmap continues to serve the case where the model runs on hardware Nvidia does not sell. Optimised paths, default formats, the quality of first-party integration, which runtimes get engineering attention: these are the levers, and none of them looks like a decision when it happens.

## What to do

- **Treat model provenance as a supply-chain question**, with the same seriousness you would apply to a package registry. Pin versions, record hashes, and know where your weights came from.
- **Do not read the deal as closed.** Regulatory review runs into 2027, and the reviewing authorities have shown appetite for exactly this shape of vertical integration.
- **If you depend on the hub in production**, mirror what you actually need. This is ordinary practice for package registries and rare for model hubs.
- **Watch the defaults, not the announcements.** Format support and integration quality will tell you more than any statement of principle.

## What is not established

- **Whether it closes.** Regulatory approvals are pending and the window is long.
- **Hugging Face's revenue or the multiple** implied by the price. Neither has been published.
- **What governance the platform keeps** after close, and who decides it.
- **Whether any condition or undertaking** gets attached by a regulator.
- **What happens to the open-source projects** Hugging Face maintains outside the hub itself.`,
  },
  {
    slug: "claude-fable-5-1-headline-price-did-not-move-and-the-bill-fell",
    title: "The headline price did not move, and the bill fell by a quarter",
    excerpt:
      "Claude Fable 5.1 costs exactly what Fable 5 cost per token: 10 dollars in, 50 dollars out. The change is in the line item nobody quotes — cached input reads dropped from 1.00 to 0.25 per million. On agentic workloads, that is most of the input bill.",
    categorySlug: "ai",
    tags: ["anthropic", "claude", "llm-pricing", "prompt-caching", "agents", "inference-cost", "api"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1516259762381-22954d7d3ad2${P}`,
    body: `**Claude Fable 5.1** shipped on **1 September 2026**, and its per-token price is identical to the model it replaces: **10 dollars per million input tokens**, **50 dollars per million output tokens**. Same as Claude Fable 5. Nothing to report, if that is where you stop reading.

The number that moved is the one that does not appear in any headline: **cached input reads went from about 1.00 dollars per million tokens to 0.25**.

For most people that is a rounding detail. For anyone running an agent, it is the bill.

## Why cache reads are the bill

A cached read is what you pay when the model re-reads context it has already seen — the system prompt, the tool definitions, the accumulated transcript. Standard cache-read pricing is roughly a tenth of the input rate, which on a 10 dollar model puts it near 1.00 per million. Writing to the cache costs more than plain input, about 1.25 times, because the cache has to be built.

Now consider the shape of an agentic workload. The agent reads a large stable prefix, calls a tool, gets a result, and goes round again. Every turn re-sends everything that came before. The volatile part — the new tool result — is tiny. The stable part is enormous and grows.

So across a long-running task, the overwhelming majority of input tokens are cache reads. Not fresh input. Not output. Reads of the same prefix, over and over, once per turn.

Cut that rate by four and you have cut the dominant term. Anthropic's own framing puts typical workloads around **25 percent** cheaper and highly agentic ones as much as **45 percent** cheaper, on unchanged headline rates.

## The headline number is the wrong instrument

This is a recurring shape, and it is worth naming because it keeps catching people out.

A price list has one number everyone quotes and several that actually determine what you pay. Which one dominates depends entirely on the shape of your usage. [Apple's iPhone price rise had the same structure](/article/every-iphone-went-up-100-dollars-including-the-ones-that-did-not-change) in the opposite direction: a flat headline increase, with the real movement in a sub-line — there, the storage ladder; here, the cache rate.

If you benchmark models by comparing input and output rates in a table, this change is invisible to you. Fable 5.1 and Fable 5 are the same row. The workloads where the difference shows up are exactly the ones that are hardest to model on a spreadsheet, because their cost depends on turn count and prefix stability rather than on request count.

[The measured cost of agentic work keeps being the surprising number in every write-up](/article/claude-ported-plc-exploit-8-hours-536-dollars-forescout) — and the cache rate is a large part of why.

## The condition attached to it

Cache pricing only helps if you actually get cache hits, and caching is a **prefix match**. Any byte change anywhere in the prefix invalidates everything after it.

The usual silent invalidators:

- A timestamp or a generated request ID inside the system prompt
- Tool definitions serialised in non-deterministic order
- A tool list that varies between requests
- Volatile content placed before stable content

The diagnostic is direct: check whether cache-read token counts are non-zero across repeated requests with the same prefix. If they are zero, the rate cut is worth nothing to you, and something in your prefix is moving.

Order matters too. Stable content first, volatile content after the last cache breakpoint. That is the whole discipline.

## The other changes are breaking ones

Worth knowing before anyone upgrades on the strength of the price alone. Fable 5.1 is not a drop-in for every harness:

- **Forced tool use is gone.** Requesting a specific tool, or requiring that some tool be called, returns an error. The replacement is automatic tool choice plus an instruction naming the tool, strict schemas, or structured outputs.
- **Thinking blocks are bound to the model that produced them.** Other models drop them silently.
- **Editing earlier turns invalidates thinking blocks.** Harnesses that rewrite history need to become append-only.

So the honest summary is a cheaper model for long-running agent work, with a small amount of harness work to collect it.

## What to do

- **Check your cache-read token counts before assuming you benefit.** Zero reads means zero saving.
- **Move volatile content after your stable prefix.** Timestamps and per-request identifiers in a system prompt are the classic reason a cache never warms.
- **Re-measure cost per completed task, not per request.** Turn count is what this change acts on.
- **Audit the harness for forced tool use and history rewriting** before switching.

## What is not established

- **Independent verification of the 25 and 45 percent figures.** They are the vendor's characterisation of typical and agentic workloads, and your prefix stability decides where you land.
- **Whether the cache rate holds** across the tier over time.
- **How the change interacts with effort settings** in practice, since a mid-conversation effort change can itself reset a cache.`,
  },
  {
    slug: "red-sea-four-cables-cut-and-the-scarce-thing-is-the-repair-ship",
    title: "Four cables were cut and the internet stayed up, because the scarce thing is the repair ship",
    excerpt:
      "Four submarine systems carrying Europe to Asia traffic were damaged in the Red Sea on 6 September. Rerouting absorbed it within the hour. The repair will take weeks to months, and the reason is a global fleet of specialised vessels that is very small.",
    categorySlug: "world",
    tags: ["submarine-cables", "red-sea", "internet-infrastructure", "resilience", "azure", "outage", "shipping"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1518181835702-6eef8b4b2113${P}`,
    body: `On **6 September 2026**, four submarine cable systems in the **Red Sea** were damaged: **SEA-ME-WE-4**, **IMEWE**, **FALCON GCX** and **Europe India Gateway**. Between them they carry a large share of the traffic between Europe, the Middle East and Asia.

Microsoft recorded the start at **05:45 UTC** and told customers that traffic crossing the Middle East might see elevated latency. It also said the thing that matters most about this incident: **traffic was not interrupted**, because it had been rerouted onto other paths.

Slow speeds and intermittent access were reported in **Saudi Arabia**, **Pakistan**, the **United Arab Emirates** and **India**. Indian operators said there was no noticeable impact on domestic networks, which have redundancy across many routes.

So four cables were cut and the internet did not go dark. The interesting question is why not — and the second, less comfortable question is what happens next.

## The cause is mundane, and that is the point

The **International Cable Protection Committee**'s early analysis points at commercial shipping: most likely a vessel dragging its anchor across the cables.

That is not exotic. Anchors and fishing account for the large majority of cable damage worldwide, and anchor incidents alone are put at roughly **30 percent** of global cable faults annually. Cables are cut somewhere in the world routinely — the figure usually quoted for all causes is over a hundred faults a year — and almost none of it reaches the news, because almost none of it is noticed by users.

What made this one visible was concentration. The Red Sea is a chokepoint: a narrow corridor that a great many separate cable systems transit because geography leaves no alternative. Systems that are independent everywhere else are neighbours there. One anchor can therefore reach several at once, which is a different risk from any one cable's reliability.

## Rerouting is instant and nearly free. Repair is neither.

Here is the asymmetry the incident exposes.

Rerouting happens in software, in seconds, at a cost of some latency. Networks are built with alternate paths precisely so a fibre cut becomes a routing event rather than an outage. That worked, visibly, at scale, on the day.

Repair happens in the physical world. A cable ship has to be located and contracted, sail to the site, locate the fault, grapple the cable off the seabed, lift it, splice it, test it, and lay it back. Estimates for this incident run from **weeks to several months**, and the constraints named are not technical:

- **Very few specialised cable repair vessels exist globally.** They are a small fleet, contracted across many operators, and they are not idle.
- **Permitting and security clearance**, in a region where both are difficult.
- **Weather and sea state.**
- **Geopolitical constraints** on operating in those waters at all.

So the system is elastic in software and scarce in hardware. You can reroute a packet in milliseconds; you cannot reroute a ship. [The datacentre capacity numbers had the same property](/article/china-3x-capacity-2x-electricity-which-number-runs-a-datacentre) — the figure that governs is rarely the one in the headline, and here it is not bandwidth, it is berths.

## What redundancy actually bought

Worth being precise, because "the internet is resilient" is both true and lazy.

Redundancy did not make the loss free. It converted a hard failure into a degraded one, and it moved the cost from users to operators — who are now paying for more expensive transit on longer paths, and will keep paying until the splices are done. Latency rose. Capacity headroom fell. The next fault, on the remaining paths, now lands on a system with less slack than it had on 5 September.

That is the real exposure. Not this incident, but the window after it.

## What to do

- **Ask your providers which physical paths they actually use**, not how many. Two carriers can be one cable.
- **Expect elevated latency on Europe to Asia routes for weeks**, and treat performance regressions in that corridor as expected rather than as faults to chase.
- **Test failover now, while capacity is reduced**, rather than assuming headroom you no longer have.
- **If you run anything latency-sensitive across this corridor**, this is the quarter to have a second region.

## What is not established

- **Confirmation of the cause.** The anchor explanation is the ICPC's early analysis, not a finding.
- **Which vessel**, if any, was responsible, and whether it was accidental.
- **A repair timeline.** Nobody has committed to one, and the honest answer is that it depends on ship availability and permissions.
- **Whether all four cuts share a single cause**, or whether they merely coincide.
- **Total capacity lost**, which operators generally do not publish.`,
  },
  {
    slug: "failing-the-fix-2026-the-grades-changed-because-the-ruler-changed",
    title: "Apple came last on repairability, and the grades moved because the ruler changed",
    excerpt:
      "Motorola B+, Google C-, Samsung D, Apple D-. The scores come from PIRG's fifth Failing the Fix report, across 105 phones — and the reason they look different from previous years is that the scoring switched to the EU's EPREL criteria, which weight disassembly properly.",
    categorySlug: "gadgets",
    tags: ["repairability", "right-to-repair", "pirg", "eprel", "apple", "samsung", "motorola", "eu-regulation"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1746005718004-1f992c399428${P}`,
    body: `The US PIRG Education Fund's fifth **Failing the Fix** report grades **105 smartphones** on how repairable they are. The headline result:

| Manufacturer | Grade |
|---|---|
| Motorola | B+ |
| Google | C- |
| Samsung | D |
| Apple | D- |

The most valuable company in the world finished last, and the company most people would struggle to name a current model from finished first.

But the more interesting sentence in the report is not about any manufacturer. It is about the ruler.

## The methodology changed, and the change is the story

Previous editions leaned on the **French repairability index**. This one uses the criteria behind the EU's **EPREL** labelling regime, and PIRG says why: EPREL **"correctly prioritizes disassembly in its methodology, fixing a problem we identified with the French scoring method."**

That is a precise complaint. Under a scoring system that weights, say, documentation availability and spare part pricing heavily, a manufacturer can score well while still building a device that is genuinely hard to open. Publish good manuals, sell parts at a fair price, and the index rewards you — even if getting to the battery means heat, solvent and forty minutes.

Weight disassembly properly and that arbitrage closes. What the new grades measure is closer to the thing anyone actually cares about: how hard is it, in the physical world, to get the broken part out.

The parameters in the new index:

- **How many steps** it takes to reach commonly replaced parts, the battery first among them
- Whether the device uses **standard or proprietary tools and fasteners**
- **Spare part availability** to consumers and to independent repair shops, not just to authorised ones
- The length of the **software support** commitment
- The accessibility of **repair documentation**

Four of those five are things a manufacturer can fix with policy. The first one is a consequence of how the product was designed, years earlier, and cannot be retrofitted.

## Why a score that moves when the ruler moves is still worth reading

There is an obvious objection: if the grades changed because the method changed, the grades are not really telling you the phones got worse.

Correct — and that is not a reason to discount them. It is a reason to read what the change corrected.

A repairability score is not a measurement of a physical constant. It is a statement about which properties we have decided count. When the statement changes, it is usually because the previous one was being gamed, or because it was measuring the reachable proxy rather than the thing itself. That is what happened here, and the direction is toward the harder-to-fake property.

The same regime is now doing real work elsewhere: EPREL sits alongside the EU ecodesign rules that require spare parts for seven years and set a minimum battery endurance, and it applies to devices whose designs make compliance genuinely awkward — including folding ones. [Apple's own foldable arrived with a per-unit calibrated hinge and no published fold-cycle rating](/article/iphone-duo-has-no-face-id-and-that-is-geometry-not-cost), into exactly this regulatory environment.

## What a D- actually reflects

Worth being fair about what is and is not being measured.

Apple has a Self Service Repair program, publishes manuals, and sells parts. On the policy parameters it is not the worst in the industry, and it has moved considerably in five years.

Where it loses is structural: parts held in with adhesive rather than fasteners, assemblies that come out as units rather than components, and design decisions that trade serviceability for thinness, water resistance and structural rigidity. Those are real engineering tradeoffs, not laziness — an IP68 phone that survives a drop is genuinely harder to open than one that does not.

That is the honest framing. The grade is not an accusation of bad faith. It is a statement that when Apple has traded repairability against something else, it has consistently chosen the something else, and the new methodology stops crediting the policy work for making up the difference.

Motorola's B+ reflects the opposite set of choices, on phones that mostly compete on price.

## What to do

- **If repairability matters to you, it is a purchase-time decision.** No amount of policy fixes a glued assembly after you own it.
- **Look at the battery specifically.** It is the part that will definitely fail, and step count to reach it is the parameter that most separates these grades.
- **Check the software support window**, which is in the score for good reason: a phone that cannot receive updates is unrepairable in the way that matters most.
- **Do not read a D- as "unfixable".** Read it as "expensive and slow to fix, mostly through an authorised channel".

## What is not established

- **Per-model scores** for most of the 105 devices, beyond the manufacturer-level grades.
- **How the grades would look under the old methodology**, which would isolate how much of the movement is the ruler.
- **Whether manufacturers will design toward the new criteria**, which is the only outcome that would matter.
- **Any manufacturer response** to the grades at time of writing.`,
  },
  {
    slug: "crusoe-the-raise-is-the-smaller-number-a-trading-firm-signed-for-13-billion",
    title: "The 3 billion raise is the smaller number, and a trading firm signed the bigger one",
    excerpt:
      "Crusoe raised over 3 billion dollars at a 30 billion valuation, roughly tripling in eleven months. The catalyst reported days earlier was a 13 billion dollar, five-year contract for GPU capacity — signed not by an AI lab but by Jane Street.",
    categorySlug: "startups",
    tags: ["crusoe", "ai-infrastructure", "venture-capital", "jane-street", "datacenters", "gpu", "valuation"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1564457461758-8ff96e439e83${P}`,
    body: `**Crusoe** has raised over **3 billion dollars** in a Series F at roughly a **30 billion dollar** post-money valuation, co-led by **Atreides Management** and **Valor Equity Partners**, with **Mubadala Capital** participating.

Eleven months earlier, its Series E valued it at a little over **10 billion**. So the valuation roughly tripled inside a year.

The raise is the number that will get quoted. It is the smaller one.

## The contract came first

Days before the round was reported, **Bloomberg** reported that Crusoe had signed a **13 billion dollar, five-year** cloud contract to supply GPUs and AI infrastructure — to **Jane Street**.

Read that customer name again, because it is the whole story.

Crusoe's existing customers are the names you would expect from an AI infrastructure company: **OpenAI**, **Microsoft**, **Meta**. Labs and hyperscalers, buying compute to train and serve models. That demand is well understood, and it is what every valuation in this sector has been underwritten against.

Jane Street is a proprietary trading firm. It is not building a foundation model. It is buying five years of GPU capacity at a scale comparable to a national research programme because that capacity is now an input to something else entirely.

A 13 billion dollar contract from outside the AI industry says the compute buildout has a second demand curve that nobody has been modelling. It also explains the valuation more honestly than the raise does: a company with a signed multi-year contract worth four times its previous valuation is a different risk object, and the equity repriced accordingly. The round follows the contract, not the other way around.

## The company started by burning waste gas

Worth knowing where this came from, because it is unusual.

Crusoe began as an energy business. Its original product, Digital Flare Mitigation, burned natural gas that was being flared and wasted at oil and gas sites and turned it into power for GPU servers placed nearby. The insight was that stranded energy and portable compute solve each other's problem: the gas cannot economically reach a market, and the computation does not care where it happens.

That is a genuinely good idea, and it is now a footnote. The company is valued at 30 billion as a datacentre developer and cloud provider, not as an energy-arbitrage play. The constraint it was built around — energy that cannot find a buyer — has inverted completely into the constraint the industry now has, which is buyers who cannot find energy.

## Where the money is going, and where it is coming from

The pattern this sits inside: AI infrastructure fundraising has been running at roughly **17.77 billion dollars** across 37 disclosed deals, with an average round near **480 million** and a median near **275 million**. Those are not startup numbers. A median round of a quarter of a billion dollars describes an industry building physical plant, not software.

And that capital has to be pulled from somewhere. It is the same force that has been showing up in places consumers notice — [every iPhone in the lineup went up 100 dollars because AI datacentres outbid consumers for memory](/article/every-iphone-went-up-100-dollars-including-the-ones-that-did-not-change). Capital, memory, power and land are all being competed for by the same buildout, and the infrastructure layer is where the competition is priced first.

The counterweight worth stating: mega-rounds concentrating at the infrastructure layer means seed and Series A money for ordinary AI application companies has become harder to raise, not easier. A record year for AI funding and a difficult year for AI founders are the same year.

## What to do

- **Read the contract, not the round.** In infrastructure, a signed multi-year offtake agreement tells you more about a valuation than the raise does.
- **Watch who else is buying compute at scale outside the AI industry.** If trading firms are signing at this size, other capital-rich, latency-sensitive industries are doing the arithmetic too.
- **If you are raising below the infrastructure layer**, price in that the capital in your sector's headline numbers is mostly not available to you.

## What is not established

- **The Jane Street contract's terms.** Reported by Bloomberg; neither party has published it, and 13 billion over five years is a headline figure, not a payment schedule.
- **Crusoe's revenue or margins.** Not disclosed.
- **How much of the round is primary capital** versus secondary.
- **Whether the power to serve these commitments is contracted**, which is the binding constraint on every datacentre plan of this size.
- **What Jane Street intends to run on it.** No public statement.`,
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
