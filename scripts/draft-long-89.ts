/**
 * Drafts the third 6 October batch — two stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-89.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-89.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-89.ts --update
 *
 *   1. Cling and ClingSTUN (security). Fortinet and Nozomi on a botnet whose
 *      command channel is public STUN infrastructure. Third campaign this
 *      fortnight to put its C2 somewhere nobody can block, after Microsoft
 *      Graph and smart contracts.
 *   2. ZachXBT and the Lazarus laundering network (security). He paid the
 *      five percent to find out what the five percent buys. The fee is the
 *      finding, and so is who ended up funding the investigation.
 *
 * Primary sources: Fortinet's ClingSTUN analysis for the protocol detail and
 * Nozomi's for the exploitation spike; ZachXBT's own account as reported. His
 * claims are attributed to him throughout — he is pseudonymous, the figures
 * are his, and the piece says so rather than laundering them into fact.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - Cling: a consumer router in the dark, which is the device being taken.
 *   - ZachXBT: Telegram on a phone, which is where the network traded.
 *
 * No backticks, angle brackets or braces in the bodies.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
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

export const drafts: Draft[] = [
  {
    slug: "cling-botnet-stun-c2-the-protocol-that-exists-to-tell-you-your-own-address",
    title:
      "The botnet's command channel is the protocol that exists to tell a machine its own public address, and nobody can block it",
    excerpt:
      "Cling takes routers and DVRs through vulnerabilities going back to 2014, then talks to its operator over STUN — the NAT-traversal service every video call depends on. Its traffic looks like a device keeping a connection alive, because that is literally what the packets are. It is the third campaign this fortnight to put its command channel somewhere undeletable.",
    categorySlug: "security",
    tags: [
      "cling",
      "stun",
      "botnet",
      "iot",
      "fortinet",
      "nozomi-networks",
      "command-and-control",
      "realtek",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1745847768408-b7b83796cae6${P}`,
    body: `**Nozomi Networks** noticed a spike in exploitation attempts against an old Realtek SDK flaw in early **September 2026** and found a botnet behind some of it. **Fortinet** published its own analysis of the same malware on **5 October**, under the name **ClingSTUN**.

The interesting part is not how it gets in. It is how it talks once it is there.

## A command channel made of NAT traversal

**STUN** is the Session Traversal Utilities for NAT. Its entire purpose is to let a device behind a home router discover what its public address and port look like from the outside, so that two machines behind two routers can find each other. Every video call, every VoIP phone and most peer-to-peer software depends on it, and there are public STUN servers run by large providers for anyone to use.

Cling uses it as its command channel.

The implant opens a UDP socket on a random local port and sends standard **20-byte STUN binding requests** to a list of public STUN endpoints. Fortinet traced the list tightening across versions: an earlier build used **24 endpoints** and accepted the result if at least half answered; a later one cut to **13** and required every one to succeed. The replies tell the implant its externally mapped ports, and the repetition keeps the router's NAT mapping alive.

Then it sends its group identifier and its list of mapped ports back to those same endpoints, and waits. A 20-byte packet from the operator triggers the rest: one command opens an outbound TCP connection over which remote commands arrive and run.

Every packet in that description is a legitimate STUN exchange, going to legitimate public servers, from a device that has an ordinary reason to do exactly this.

## Why that is hard to filter

Network detection works by asking whether a host is talking to somewhere it should not be. Cling's answer is no.

The destinations are public infrastructure operated by large providers, including Google's. Blocking them breaks video calling. The protocol is UDP on a well-known port that is already permitted outbound in almost every network, because it has to be. And the traffic shape — short binding requests at an interval, keeping a mapping warm — is precisely what an uninfected VoIP handset does all day.

Fortinet is careful about one gap, and it is worth repeating because it is the hinge: how the operator learns the device's external mapping in order to send that trigger packet is **not verified**. The researchers describe what the implant does and stop short of claiming they have seen the other half.

## The third one this fortnight

This is now a pattern we have written about three times in two weeks, and it is worth naming as one idea rather than three incidents.

The Antino backdoor [polls an Outlook mailbox and leaves files in OneDrive](/article/antino-uat-11587-the-backdoor-polls-outlook-every-ten-seconds-and-leaves-its-files-in-onedrive), so every packet goes to Microsoft. North Korean operators [put payloads in smart contracts](/article/etherhiding-unc5342-the-payload-is-on-chain-and-the-chokepoint-is-the-api-provider) and fetch them with read-only calls that leave no transaction. Cling puts its rendezvous in STUN.

Three different actors, three different substrates, one shared conclusion: a command channel is only as durable as the willingness of someone to take it down, so build it out of something nobody will. The era of a C2 being an IP address on a blocklist is ending, and the detections that depend on destination reputation are ending with it.

## Old holes, new tenant

The way in is the opposite of novel.

Nozomi's spike was against a Realtek SDK flaw scored 9.8 and patched years ago. Fortinet lists initial access through vulnerabilities in Hytec routers, EnGenius devices and D-Link UPnP, and seven more hardcoded for spreading — including a Realtek bug from **2014** and an MVPower CCTV flaw from 2016. TP-Link, Tenda, AVTECH, Linksys and others appear in the target list.

Persistence is equally plain: the binary copies itself to two hidden paths and appends itself to the boot scripts of SysV and BusyBox init, which is what you do when your victims are devices nobody logs into.

That combination is the story of consumer and small-business network gear. The sophistication goes into the channel, because the entry never needs any — the twelve-year-old vulnerability is still there, on a device with no update mechanism and no owner who thinks of it as a computer.

## What to do

- Inventory what is actually on your edge. Routers, DVRs, cameras and access points bought by someone who has left, installed by a contractor, or inherited with the building.
- Take management interfaces off the internet, and turn off UPnP where it is not needed. Several of the entry points here are exposed device administration.
- Look for the persistence rather than the traffic. Hidden files named for the malware in the root and local binary directories, and unexpected entries appended to the boot scripts, are far easier to find than STUN packets are.
- If you can, baseline which hosts legitimately speak STUN. A camera or a DVR doing NAT traversal has no business reason to; a desk phone does.
- Replace anything whose vendor stopped shipping firmware. For a device carrying a 2014 flaw, there is no patch to apply.

## What is not established

- How the operator obtains the external mapping needed to reach an infected device. Fortinet explicitly does not claim to have verified it.
- How large the botnet is.
- Who operates it, which neither analysis attributes.
- Whether the three operational phases Fortinet describes are one actor iterating or a tool passing between hands.`,
  },

  {
    slug: "zachxbt-lazarus-laundering-he-paid-the-five-percent-to-find-out-what-it-buys",
    title:
      "He sent 349,700 dollars to a laundering service to find out how it worked, and the five percent fee is the finding",
    excerpt:
      "The blockchain investigator ZachXBT says he posed as a client of a Chinese network he alleges laundered more than a billion dollars for North Korea's Lazarus Group, including most of the 1.5 billion taken from Bybit. He funded a wallet, placed orders, lost about five percent each time, and traced a cluster that led to a freeze.",
    categorySlug: "security",
    tags: [
      "zachxbt",
      "lazarus-group",
      "north-korea",
      "money-laundering",
      "bybit",
      "cryptocurrency",
      "blockchain-analysis",
      "sanctions",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1751459422184-e0554bb8db0b${P}`,
    body: `**ZachXBT**, the pseudonymous blockchain investigator, has published an account of posing as a customer of a Chinese organised crime network he alleges launders stolen cryptocurrency for North Korea's **Lazarus Group**.

Everything that follows is his account. He works under a pseudonym, the figures are his, and no court or agency has tested them. That is worth stating once at the top rather than hedging every sentence afterwards.

## How he found it

He says he started after noticing a pattern: more than **15 accounts** across Telegram and Discord groups asking for help with orders tied to stolen funds, in the period after the **February 2025 Bybit exploit** that took about **1.5 billion dollars**.

Rather than watch, he became a client. He funded a new Ethereum address with **349,700 USDC** and placed orders through a vendor using the pseudonym **Jimmy Green**, with, in his words, no guarantee the counterparty would not simply disappear with the money.

That is the part worth pausing on. The intelligence here was bought, at personal risk, by one person with their own capital.

## The fee is the finding

He reports losing roughly **five percent per order**.

Five percent is the price of turning stolen cryptocurrency into clean cryptocurrency at volume, and it is the single most useful number in the account, because it describes an industry rather than an incident.

Run it against the figures. If the network handled the amounts he alleges — more than a billion dollars across multiple Lazarus operations, including most of the 1.5 billion from Bybit — then the laundering service earned something in the order of tens of millions of dollars in fees. Not a favour between criminals. A business with a margin, a customer service channel and a rate card.

It also sets the recovery problem. Freezing stolen funds competes with a counterparty who is paid promptly, in volume, to move them faster. Five percent is what the defenders are bidding against.

## What the access produced

He says the orders let him map a cluster of more than **12 million dollars** in Bybit-linked funds, swapped across Bitcoin, Ethereum, Solana and Tron, and that the information contributed to freezing **442,000 dollars in USDT** from it. He puts the total frozen in connection with North Korean incidents since 2022 at around **75 million**.

One detail carries the credibility of the rest: he describes the vendor saying a day in advance that funds would move to Solana, and the funds moving to Solana the next day. Knowing the route before it happens is the difference between watching a chain and being inside the operation.

Set the two numbers beside each other, though. He fronted 349,700 dollars. The freeze attributed to this work was 442,000. The margin between what an investigator risks and what the public recovers is thin enough to be uncomfortable, and nothing about that arrangement is funded by anyone with a mandate.

## Who is doing this work

That is the uncomfortable finding underneath the headline.

The capability on display — noticing a pattern in chat groups, posing as a buyer, funding it personally, tracing across four blockchains, and getting an exchange to act — belongs to a pseudonymous individual rather than to an agency. It is unpaid and self-financed, it accepts legal and personal risk that an institution would never sign off, and it is not reproducible by anybody with a compliance department.

It also sits in genuinely awkward territory. Paying a laundering service, even to understand it, is transacting with the thing being investigated, and nothing in the account suggests a legal authority sanctioned it. Those questions do not make the findings less real; they make the model unrepeatable.

What this all funds is the same machinery we wrote about last week, when Google documented North Korean operators [hiding malware in smart contracts to steal from developers and crypto firms](/article/etherhiding-unc5342-the-payload-is-on-chain-and-the-chokepoint-is-the-api-provider). The theft and the laundering are one pipeline, and the second half is a commercial service with a published rate.

## What to do

- If you run an exchange or a custodian, the actionable part is speed. Freezes work when they arrive before the next hop, and this account describes a counterparty that moves within a day.
- Treat chat-group intelligence as a real source. The network advertised itself in Telegram and Discord, which is where it was found.
- Do not copy the method. Funding a laundering service to study it is not a technique anyone with an employer should imitate.
- For everyone else, the lesson is upstream. This service exists because the thefts succeed, and the thefts mostly start with a developer being phished.

## What is not established

- Whether any of it is accurate beyond ZachXBT's own reporting. None of it has been tested in court, and no agency has confirmed his figures.
- Who the network actually is. Jimmy Green is a pseudonym attached to a vendor, not an identified person or organisation.
- Whether the alleged billion-plus is one network or several he has grouped together.
- What law enforcement has done with the information, beyond the freezes he describes.`,
  },
];

const isMain =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const UPDATE = process.argv.includes("--update");
  // Imported here, not at the top, so check-drafts-offline.ts can import this
  // module without loading the Payload config or needing a database.
  const { getPayload } = await import("payload");
  const { default: config } = await import("@payload-config");

  const payload = await getPayload({ config });

  for (const draft of drafts) {
    const existing = await payload.find({
      collection: "articles",
      where: { slug: { equals: draft.slug } },
      limit: 1,
      depth: 0,
      select: { status: true },
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
}
