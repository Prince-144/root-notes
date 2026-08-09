/**
 * One-off: saves the researched memory-shortage piece as a draft.
 * Same shape the generator writes, so it reviews identically in the admin.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "memory-shortage-2026-device-prices-ram";

const BODY = `The phone you buy this year will probably cost more than last year's and ship with the same amount of RAM. Not because the industry ran out of ideas, but because the memory that would have gone into it was sold to a data centre instead.

Samsung, SK Hynix and Micron between them make more than 95% of the world's DRAM. All three have been shifting wafer capacity toward high-bandwidth memory — the stacked DRAM that feeds AI accelerators — and away from the conventional memory that goes into laptops and phones. IDC puts it plainly: a wafer allocated to an HBM stack for an Nvidia GPU is a wafer denied to a mid-range smartphone.

## The price part

Contract prices moved violently. TrendForce put global DRAM contract prices up an estimated 90–95% quarter-on-quarter in Q1 2026, followed by a projected 58–63% in Q2.

That lands on device makers, and they have said so. Lenovo, Dell, HP, Acer and ASUS have all warned of PC price rises, with vendors confirming hikes in the 15–20% range.

Memory is a bigger share of a device than most buyers assume — [IDC](https://www.idc.com/resource-center/blog/global-memory-shortage-crisis-market-analysis-and-the-potential-impact-on-the-smartphone-and-pc-markets-in-2026/) reckons it accounts for 15–20% of the total bill of materials on a mid-range handset. When that line doubles, there is nowhere quiet to absorb it.

## The part nobody announces

The more interesting response isn't the price rise. It's the spec sheet.

Rather than pass the whole increase on, manufacturers are holding configurations still. IDC expects new flagship models in 2026 to skip the usual RAM bump — Pro-tier phones staying at 12GB rather than moving to 16GB. The yearly increase that buyers had come to treat as automatic simply doesn't happen this cycle.

You are not told this. The price looks similar, the model number goes up, and the memory doesn't. It is the electronics version of shrinkflation, and it is harder to notice than a bigger number on the sticker.

## What IDC actually forecasts

The shipment numbers doing the rounds are worth checking. IDC's own scenarios are more conservative than some of the figures being quoted:

| Market | Moderate | Pessimistic |
| --- | --- | --- |
| Smartphone volume | −2.9% | −5.2% |
| PC volume | −4.9% | −8.9% |
| Smartphone ASP | +3–5% | +6–8% |
| PC ASP | +4–6% | +6–8% |

Supply isn't collapsing either — IDC projects DRAM and NAND supply still growing 16% and 17% year-on-year. It's growing below historical norms while demand from AI infrastructure grows far above them. A shortage doesn't require production to fall; it only requires someone else to want the output more.

## The awkward bit for AI PCs

There's a circularity here that the industry has not fully reckoned with.

AI PCs — the category vendors have spent two years marketing — need a practical minimum of 16GB of RAM to run local models at all. That is exactly the configuration the shortage has made expensive. The demand for AI in data centres is pricing AI out of the laptops sold to run it locally.

## What this means if you're buying

- **Check the memory, not the model year.** The upgrade you assume is there may not be. Compare the actual RAM and storage figures against last year's equivalent rather than trusting the tier name.
- **Buy the memory you need up front.** On sealed devices there is no later. On the machines where RAM is still socketed, that flexibility is worth more this year than it has been in a decade.
- **Expect the squeeze to sit in the middle.** Flagships have margin to absorb costs and budget devices were already thin; mid-range is where specs quietly get trimmed.

None of this is a supply chain failure in the usual sense. Nothing broke, no factory burned down, no ship blocked a canal. The industry simply found a customer willing to pay more for the same wafers, and consumer devices are what that customer outbid.`;

const payload = await getPayload({ config });

const { docs: clash } = await payload.find({
  collection: "articles",
  where: { slug: { equals: SLUG } },
  limit: 1,
  depth: 0,
});

if (clash.length > 0) {
  console.log(`already exists: ${SLUG} (id ${clash[0].id}) — nothing written`);
  process.exit(0);
}

const created = await payload.create({
  collection: "articles",
  data: {
    title: "Your next phone won't get more RAM — the memory went to AI data centres",
    slug: SLUG,
    excerpt:
      "DRAM contract prices nearly doubled in a quarter as Samsung, SK Hynix and Micron moved capacity to the stacked memory that feeds AI accelerators. Device makers are responding with higher prices — and, more quietly, by holding RAM configurations still.",
    body: BODY,
    categorySlug: "gadgets",
    tags: ["dram", "memory-shortage", "hardware", "ai-infrastructure"],
    author: "Prince Baruwala",
    publishedAt: new Date().toISOString(),
    readingMinutes: 5,
    status: "draft",
    featured: false,
    views: 0,
    coverImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=900&fit=crop&crop=entropy&q=80",
  },
});

console.log(`drafted: ${SLUG} (id ${created.id}, ${BODY.split(/\s+/).length} words)`);
process.exit(0);
