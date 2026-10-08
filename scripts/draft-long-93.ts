/**
 * Drafts the second 8 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-93.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-93.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-93.ts --update
 *
 *   1. PoeLLM / Canto Incognito (security). The C2 address is four words in a
 *      GitHub-hosted poem, resolved through a dictionary in the binary. Lumen
 *      publishes two different victim counts; the piece says so rather than
 *      quietly picking one.
 *   2. Denmark's CPR register (world). 8.8 million people looked up through a
 *      private company's lawful access, inside the limits that access allows.
 *      Nothing was broken into, which is the story.
 *   3. Azazel / The Gentlemen (security). MCP operationalised as a command
 *      channel, initial access from CI/CD secrets, and an affiliate who kept
 *      the proceeds from the operator whose tooling he used.
 *
 * Primary sources: Lumen Black Lotus Labs' Canto Incognito write-up, the
 * Danish Ministry of Research, Education and Digitalisation's disclosure as
 * reported by Help Net Security and The Copenhagen Post, and CloudSEK's
 * "Caught in 4K: The Gentlemen Files".
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - PoeLLM: a data hall of server cabinets, which is what 3,400 conscripted
 *     servers look like.
 *   - Denmark: Christiansborg, seat of the Danish state whose register this is.
 *   - Azazel: source in a dark editor, which is where the CI/CD secrets that
 *     opened every victim were sitting.
 *
 * Rejected on the way: a server bezel reading DELL EMC, and a terminal shot
 * with a real person's username in it — neither party has anything to do with
 * these stories.
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
    slug: "poellm-canto-incognito-the-c2-address-is-four-words-in-a-poem",
    title:
      "The command server's address is four words in a poem, and moving the botnet means editing the poem",
    excerpt:
      "Lumen's Black Lotus Labs tracked a malware family that does not carry its command-and-control address. It fetches a poem from GitHub, pulls four words out of fixed positions, and looks them up in a dictionary compiled into the binary. The operator has rewritten the poem eleven times since April.",
    categorySlug: "security",
    tags: [
      "poellm",
      "canto-incognito",
      "lumen",
      "black-lotus-labs",
      "botnet",
      "cryptomining",
      "litellm",
      "cve-2026-42271",
      "command-and-control",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1784652852605-6945598f2af3${P}`,
    body: `**Lumen's Black Lotus Labs** has published research on a malware family it names **PoeLLM**, in a campaign it tracks as **Canto Incognito**. The victim count is large and the payload is a cryptocurrency miner, which on its own would make this an ordinary story.

What makes it worth reading is the step in the middle: how an infected machine finds out where to report.

## The address is in a poem

The malware does not carry a command-and-control address. It carries instructions for reading one.

Those instructions point at a poem titled **On the Nature of Connection**, hosted in a **GitHub repository**. The binary fetches it and pulls four pieces of text from fixed positions — what follows "In the silent hum of", what sits between "each pulse of" and "threading", what follows "Beyond the wall of", and the word before "of distant servers".

Each of those four words is then looked up in a **dictionary compiled into the malware**, which maps words to numbers. Lumen gives two entries as examples: "driver" is 92, "diode" is 119. The four resulting numbers, in order, are the four octets of an IPv4 address.

To move the botnet, the operator edits the poem. Black Lotus Labs counts **eleven rewrites since the first commit on 13 April**, each one sending every infected machine somewhere new.

## Why this is more than a flourish

Strip away the poetry and what is left is a resolution step that produces nothing worth alerting on.

An infected host fetching a text file from GitHub over HTTPS looks like any build server, any package manager, any developer laptop. There is no domain to seize, because there is no domain. There is no DNS record to sinkhole. The address never crosses the network as an address — it crosses as four English words in a poem, and is assembled on the victim.

It is also cheap to rotate. Changing a hardcoded C2 means shipping a new binary to every infected machine. Changing this one means a commit.

This is now a familiar shape rather than a novelty. [The npm registry carried the MALFEX operator's payloads for three years](/article/malfex-npm-three-years-37000-downloads-and-three-packages-still-installable), because a package registry is not a thing an organisation blocks. Neither is a code host. The list of services that every network must allow out to is short, well known, and being worked through.

## What it breaks into

PoeLLM goes after exposed services rather than people, and the target list is specific: **LiteLLM** and **Ollama**, **Gotenberg**, **Gitea**, and **Ivanti Sentry** appliances. Scanning concentrates on **port 4000** for LiteLLM and **port 3000** for Gotenberg.

The named entry point is **CVE-2026-42271**, a command injection in LiteLLM reached through its connection-test endpoint. Lumen also lists two 2018 flaws in the Boa web server used by some routers, which suggests the operator is not fussy about the age of what it exploits.

A successful request tells the target to fetch its payload from the C2 on **port 81**. The payload is an ELF binary that installs itself as **libgcrypt**, borrowing the name of a real cryptographic library.

## Mining is only half of it

The payload runs **XMRig** and a second miner called **Iron**, pointed at **Kryptex**, a Russian mining service. That is the revenue.

The other job is growth. Infected servers are turned into **scanners and exploit servers**: they go looking for the next victim and hand it back. The botnet recruits using the machines it already holds, which is how a campaign aimed at a handful of niche products reached the numbers it did.

Lumen notes that the most recent activity has moved on to **SSH ports and other login portals**, and reads it as the operator experimenting with distributed brute forcing. That would be a different business from mining.

## The two numbers do not agree

Black Lotus Labs gives two victim counts, and they are not the same.

One sentence says that since it emerged in April, PoeLLM has impacted **almost 2,200 victim servers**. Another says **more than 3,400 victim servers**, with peak activity exceeding 800 active per day. A third describes the mid-June peak as almost 2,200 affected servers with nearly 800 active daily.

The natural reconciliation is that one figure counts a moment and the other counts cumulatively, but the research does not say which is which. Both appear in the same post. We are carrying both rather than reporting the larger one as the finding.

## Attribution, at the confidence it was given

Lumen assesses that PoeLLM is associated with an **Italian-speaking threat actor**, on the basis of Italian-language artefacts, netflow data and the services hosted on one particular server.

The stated confidence attaches to something narrower than the headline implies: Lumen says it assesses **with moderate confidence** that the server in question is the operator's administrative interface. Moderate confidence on the infrastructure, language artefacts on the actor. That is a reasonable thing to publish and a thin thing to build on.

Black Lotus Labs says it has **null-routed traffic to and from the C2 servers** across its backbone, and has published indicators.

## What to do

- If **LiteLLM, Ollama, Gotenberg or Gitea** is reachable from the internet, that is the exposure. Ports 3000 and 4000 are being swept for it specifically.
- Patch LiteLLM for CVE-2026-42271, and check whether the connection-test endpoint answers without authentication.
- Log outbound fetches from servers to raw file hosts. This campaign resolves its C2 through one, and it will not be the last to do so.
- Look for a process called libgcrypt that is not the library.

## What is not established

- Which victim figure is correct, and what each of the two counts.
- How much was mined, and what it was worth.
- Whether the repository hosting the poem is still live, and whether GitHub was notified or acted.
- Which flaws were used against Gitea and Ollama. Only the LiteLLM and Ivanti Sentry identifiers are named.
- Whether the Italian-language artefacts point to the operator or to code borrowed from someone else.`,
  },

  {
    slug: "denmark-cpr-register-8-8-million-looked-up-through-lawful-access",
    title:
      "Nobody broke into Denmark's population register — a company allowed to search it looked up 8.8 million people",
    excerpt:
      "Danish authorities say unidentified parties misused a private company's legitimate access to the Central Person Register and stayed inside the limits that access permits. Names, addresses and CPR numbers for 8.8 million people, roughly four fifths of the register, were retrieved over about ten days in September.",
    categorySlug: "world",
    tags: [
      "denmark",
      "cpr",
      "data-breach",
      "datatilsynet",
      "national-registry",
      "third-party-access",
      "gdpr",
      "identity-data",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1788610830548-288ea6d296a8${P}`,
    body: `Denmark's **Central Person Register**, the CPR, is the spine of Danish public life. The ten-digit number it issues follows a person through tax, healthcare, banking and almost every interaction with the state.

On **5 October** the Danish Ministry of Research, Education and Digitalisation disclosed that names, addresses and CPR numbers for **8.8 million people** had been retrieved from it. The register holds around eleven million records, so that is roughly four fifths of it. The figure covers people living in Denmark, people who have died, and citizens who have moved abroad. Records carrying registered name and address protection were excluded.

There is no intrusion in this story. That is the story.

## What actually happened

Unidentified parties **misused a private Danish company's legitimate access** to search the register.

Danish authorities are explicit about the shape of it: the lookups **stayed within the limits of the information that private companies are allowed to retrieve**. No control was defeated. No system was broken into. Somebody used a door that was built, deliberately, and left open to the company holding the key.

The activity ran for roughly ten days during **September**. The CPR administration learned of irregular activity on the evening of **Friday 2 October**, established the extent over the weekend, notified the **Danish Data Protection Agency** on **Sunday 4 October**, and the ministry made it public on the **Monday**.

The company's access has been cut off. Police are involved. The company has not been named, and authorities say they cannot yet identify who was responsible.

Minister **Christina Egelund** called it "a deeply serious incident", and said that "together with all relevant authorities, we are in the process of mapping the full extent of the incident".

## Why delegated access is the whole system

It is tempting to read this as a failure of access control. It is closer to the opposite: the access control worked exactly as designed, and the design is the exposure.

A national identity register is only useful if other parties can query it. Banks verify customers. Insurers check addresses. Employers confirm identity. Every one of those lookups is legitimate, and each one requires that a private company hold a credential that reaches into the register.

That credential is a bearer of trust in the state's own system. Whoever holds it can ask the questions the company is permitted to ask — and nothing in the design distinguishes the company asking them from someone who has taken the company's place.

The number of organisations with that kind of access is not small, and the state's exposure is the weakest security posture among all of them. Denmark did not have one register to defend. It had every company with a lookup agreement.

## What a CPR number is and is not

A CPR number alone is not a password. Danish institutions generally require more to act on an identity, and the country's electronic ID is a separate system that this disclosure does not touch.

But the combination that was taken — name, address and the number that ties them together, for most of a population — is the raw material for identity fraud rather than the act of it. It makes impersonation plausible at scale: the caller who already knows your address and your number sounds like the bank, because that is what the bank knows.

The part that does not age is the number itself. An address changes. A password can be reset. A CPR number is issued once and carried for life, which means this data does not expire the way a credential dump does.

## Detection came late, and from volume

The sequence is worth sitting with. The activity ran through September. It was noticed on 2 October.

Reporting elsewhere has described a surge in automated queries as the trigger, and that is plausible — pulling 8.8 million records is not a quiet operation. But we have not found that detail in the official account, so it is listed below rather than stated here.

What the official timeline does establish is that the detection was not instant, and that once the administration started looking it took a weekend to understand the scale. Both of those are facts about monitoring at the register, not about the sophistication of whoever did it.

## What this means elsewhere

Most countries with a national identity number run some version of this arrangement, and the lesson generalises past Denmark.

- The register's security is the security of every delegated holder of access to it, and that set is usually larger than the register's operators think.
- Rate limiting and volume alerting on a lookup API are not a nice-to-have. Here they were, on the public record, the detection mechanism of last resort.
- Access granted to an organisation is used by systems, not by people. Suspending a company's access after the fact is remediation; knowing which of its systems was using the access, and when, is prevention.
- Disclosure can be fast when the register is public infrastructure. Three days from detection to public statement is quicker than most corporate breaches of this size.

## What is not established

- Which company's access was misused, and whether the company was itself compromised or an insider was involved.
- How the lookups were detected. The surge-in-automated-queries explanation appears in secondary reporting, not in the official account we have seen.
- Whether the retrieved data has been sold, published or used.
- Exactly which days in September the activity covered.
- How many other organisations hold comparable access to the register, and what monitoring applies to them.
- Whether anyone will be identified. Danish authorities say they cannot name a responsible party at this stage.`,
  },

  {
    slug: "azazel-gentlemen-mcp-as-a-command-channel-and-the-affiliate-who-kept-the-money",
    title:
      "The ransomware affiliate ran his commands through an AI assistant's tool protocol, then scanned the internet for more of them",
    excerpt:
      "CloudSEK documents a Gentlemen ransomware affiliate who wired Model Context Protocol into his attack chain as an execution channel, reached every victim through stolen CI/CD secrets, and published the proceeds on his own leak site rather than the gang's. The investigation started with an open directory he left unauthenticated.",
    categorySlug: "security",
    tags: [
      "azazel",
      "the-gentlemen",
      "ransomware",
      "mcp",
      "model-context-protocol",
      "cloudsek",
      "cicd",
      "gitlab",
      "ssrf",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1591206246042-2ed5fec8f27e${P}`,
    body: `**CloudSEK** has published an investigation into an affiliate of **The Gentlemen** ransomware operation, who used the handle **Azazel**. The report is titled Caught in 4K: The Gentlemen Files, and the title is earned — the researchers got their view because the operator left an **open directory** with an unauthenticated file listing on his own staging server.

Two things in it are worth separating. One is a technical first. The other is a story about crime economics.

## MCP as the command channel

**Model Context Protocol** is the interface that lets an AI assistant call tools — run a command, read a file, query a service. It exists so an assistant can act rather than only answer.

Azazel wired it into the attack chain. CloudSEK describes a script that made authenticated calls to a local MCP endpoint using a fixed bearer token, invoking the protocol's session-execution function to run checks across **six internal hosts** inside a victim network. The researchers call this the confirmed operational use of MCP as an attack execution channel.

What makes this more than a curiosity is the second half. Azazel built **dedicated internet-wide scanning infrastructure**, under its own scanner fingerprint, hunting for **exposed MCP server ports** globally — and CloudSEK says he treated them as a general-purpose initial access vector, independent of the credential chain that opened everything else.

That is the part to take seriously. Not that an attacker used an AI tool, which is unremarkable by now, but that the tool interface itself is being swept for as an exposed service in its own right. MCP endpoints are a new category of thing that answers on a port, and they are being catalogued by someone who is not a researcher.

There is also a smaller detail with a long shadow: the staged output includes responses consistent with an AI assistant answering **infrastructure planning questions** — backup capacity, disk throughput, scan performance over large datasets. He was using it to run his own operation, not only his victims'.

We wrote last week about [the question of who checks the badge when a model is told to refuse less for verified defenders](/article/anthropic-cyber-verification-tiers-fewer-refusals-and-who-checks-the-badge). This is the other end of the same problem: the assistant here was not persuaded to do anything. It was handed a tool interface and used as plumbing.

## Every victim came through a pipeline

For all the novelty above, the way in was ordinary and should be the part that worries most readers.

Every confirmed victim outside the AI sector was reached through **GitLab CI/CD variable stores and git repository history**. Not phishing. Not a perimeter exploit. Secrets that were sitting in the place teams put secrets.

A single exposed GitLab instance hosted pipelines for **two unrelated organisations**, and yielded Oracle and PostgreSQL credentials, shipping API credentials, and SSH private keys for three separate cloud-hosted servers. One instance, two companies, three servers.

The high-value target in the AI sector was reached differently: through an **AI medical imaging API that fetched user-supplied URLs server-side without validating them**, giving server-side request forgery into the internal network. A feature that retrieves a URL on the server's behalf is a doorway, and it keeps being built without one.

## What a CI/CD token is worth

The cascade numbers are the argument for treating pipeline secrets as crown jewels.

One compromised SaaS platform extended to **more than a dozen of that platform's own client companies**. CloudSEK reports a single CI/CD token that reached **more than 150 databases, payment gateways and hundreds of source code repositories**. A government-linked financial registry lost **more than 120,000 records**.

In total: **more than two dozen organisations across six countries** — logistics, insurance, pharmaceuticals, medical devices, AI and government-adjacent infrastructure. Roughly **6TB** of stolen data was staged across two dozen victim directories, with the AI target alone exceeding 6TB and still growing by hundreds of gigabytes between observations. The operator's own storage, across a staging server and an archive box, came to **more than 50TB**.

## The affiliate robbed the gang

The second story is about money, and it is unusual.

Azazel operated as a Gentlemen affiliate, using the group's tooling. He also ran **his own leak site**, and that is where his victims appeared. CloudSEK is direct about the consequence: none of the victims he compromised using Gentlemen's tooling showed up on the Gentlemen group's own leak site. They showed up on his.

The extortion proceeds did not go back to the ransomware-as-a-service operator. The report notes this is not a common pattern in the affiliate ecosystem, and it is worth understanding why it matters. RaaS works because affiliates accept a revenue split in exchange for tooling and a brand. An affiliate who takes the tooling and keeps the money is a defection against the business model, not against the victims.

For defenders it has a practical edge: the absence of an organisation from a known group's leak site is not evidence it was not hit by that group's tooling.

## Attribution

CloudSEK points to a **Russian-speaking operator**, on evidence that is more careful than usual — not borrowed words but, in its description, fluent Russian prose in script comments, full grammatical sentences. Infrastructure naming supports it: one server is named with a colloquial Russian word for newsman. The handle Azazel is a character from Bulgakov's The Master and Margarita.

## What to do

- Treat **CI/CD variable stores and git history** as the credential store they are. Rotate what is in them, and check whether a single instance serves more than one organisation.
- Audit any API that **fetches a user-supplied URL server-side**. That is the pattern that opened the highest-value victim here.
- Find out whether you are exposing an **MCP endpoint** to the internet, deliberately or otherwise. Somebody is scanning for them at internet scale.
- Treat an assistant's tool interface as a privileged execution path, with the authentication and logging you would give a remote shell, because that is what it is.

## What is not established

- Which AI assistant or client was wired to the MCP endpoint. The report describes the protocol and the call, not the product.
- The dates and duration of the campaign. CloudSEK's report does not give an operational timeline.
- Whether any victim paid, and how much.
- Whether The Gentlemen operators knew about LEAKNED, and what followed if they did.
- The identities behind the handle. The language evidence points to a region, not a person.`,
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
