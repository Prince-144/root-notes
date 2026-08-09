/**
 * One-off: saves the researched Zomato piece as a draft.
 *
 * Written by hand rather than through lib/article-generator.ts — that pipeline
 * researches a breaking story from web search on its own, and this one came out
 * of a directed research session. It writes the same shape the generator does
 * so the draft is indistinguishable in the admin panel.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "zomato-founding-story-rejection-myth";

const BODY = `The founder-struggle template is well worn: pitch fifty investors, collect forty-nine rejections, build a billion-dollar company anyway. It gets attached to Zomato often enough that it reads as fact.

It isn't. There is no documented record of Zomato being turned away by a wall of investors. What actually happened is the more useful story — harder to romanticise, easier to learn from.

## It started as scanned menus in an office

In 2008, Deepinder Goyal and Pankaj Chaddah were analysts at Bain & Company in Delhi. The office had one recurring annoyance: everyone queued for the same paper menu cards at lunch.

Goyal scanned them and put them on the company intranet. Colleagues started using it. Traffic grew. That was the entire insight — no market sizing, no deck.

It went public on 10 July 2008 as FoodieBay. Within nine months it was the largest restaurant directory in Delhi NCR.

## They kept their jobs for eighteen months

This is the part the myth skips. FoodieBay launched in July 2008, but the founders didn't leave Bain until November 2009 — roughly eighteen months running it alongside full-time consulting work. The company was formally incorporated in January 2010 as DC Foodiebay Online Services.

The first institutional cheque didn't arrive until August 2011: $1 million from Sanjeev Bikhchandani's Info Edge, the company behind Naukri.com.

That is around two and a half years with no outside capital. By the time they asked for money, they weren't selling an idea. They were selling a directory that already owned a city.

The investor did rather well out of it. By the 2021 IPO, Info Edge held roughly 15.9% at an average cost of ₹1.16 a share — about ₹144 crore in, worth some ₹9,455 crore at the listing price band.

## The cheapest decision they nearly made

The rename from FoodieBay came in November 2010, partly to avoid a naming clash with eBay, partly because the founders didn't want to be locked into food forever. That left two domain options.

| Domain | Price |
| --- | --- |
| ForkWise.com | $10 |
| Zomato.com | $10,000 |

Goyal wanted the ten-dollar one. In [his own account](https://officechai.com/stories/how-investors-made-deepinder-goyal-pay-10000-for-zomato-com-domain/): "Forkwise accha hai for $10... I'm not paying $10,000 for Zomato.com."

Bikhchandani and Info Edge CFO Ambarish Raghuvanshi refused to let it go. "They lost it on me," Goyal said. "They're like, okay, take the money from me... But take Zomato, don't take ForkWise." The investors covered the $10,000 themselves.

## Food delivery wasn't the idea

Zomato spent seven years not doing the thing it is known for. It was a restaurant discovery product — menus, reviews, ratings. Delivery launched in March 2015 on third-party logistics, and only got its own fleet through the Runnr acquisition in 2017.

The business now driving the company arrived later still: Blinkit, bought in June 2022 for roughly $568 million in stock. In February 2025 the parent renamed itself Eternal Limited — the same reasoning as the FoodieBay rename, fifteen years on.

## The real crisis came after the money

Zomato's worst funding moment wasn't a rejection. It was a markdown.

In May 2016, [HSBC cut its valuation](https://www.medianama.com/2016/05/223-zomato-vs-hsbc-securities-valuation/) from $1 billion to $500 million — a 50% haircut that earned it the label "demicorn." The stated concerns were an advertising-heavy model, rising competition, and the overseas businesses.

Goyal fought it in public, writing to 2,100 staff with a point-by-point rebuttal: "Nobody who knows our business has marked down our valuations... our existing investors are bullish about us, and are willing to back us further, if needed."

The overseas bet did turn out to be the mistake. Zomato acquired Seattle-based Urbanspoon in January 2015 and shut it by June. By November 2021 it was withdrawing from every market except India and the UAE.

## Where the rejection story actually lives

If the wall-of-rejections narrative is what you came for, it exists — just not here.

Airbnb has the best-documented version. On 26 June 2008, Brian Chesky pitched seven investors for $150,000 at a $1.5 million valuation. Five sent rejection emails, two never replied, and Chesky later [published the emails](https://medium.com/@bchesky/7-rejections-7d894cbaa084). The reasons ranged from "not in our area of focus" to "we've not been able to get excited about travel related businesses."

In India, OYO's Ritesh Agarwal has [said plainly](https://yourstory.com/2021/07/oyo-ritesh-agarwal-vc-rejection-entrepreneurs) that "nearly 80% of the VCs I wrote to rejected me." He was nineteen at the time.

Both are sourced and attributable to the founders themselves. Zomato's version isn't, because it didn't happen.

The distinction matters more than it sounds. A rejection story teaches persistence, which is comforting but hard to act on. Zomato's teaches something less romantic and considerably more actionable: fund yourself long enough that you are negotiating from traction rather than from hope.`;

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
    title: "Zomato was never rejected by 50 investors — and the real story is more useful",
    slug: SLUG,
    excerpt:
      "The wall-of-rejections narrative gets attached to Zomato often enough to read as fact. It never happened: the founders ran it as a side project for eighteen months, bootstrapped for two and a half years, and nearly bought a $10 domain instead.",
    body: BODY,
    categorySlug: "startups",
    tags: ["zomato", "eternal", "startup-funding", "india"],
    author: "Prince Baruwala",
    publishedAt: new Date().toISOString(),
    readingMinutes: 5,
    status: "draft",
    featured: false,
    views: 0,
    coverImageUrl: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=1600&q=80",
  },
});

console.log(`drafted: ${SLUG} (id ${created.id}, ${BODY.split(/\s+/).length} words)`);
process.exit(0);
