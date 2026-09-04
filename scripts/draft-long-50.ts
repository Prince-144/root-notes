/**
 * Drafts three pieces from 1-3 September news.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-50.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-50.ts --update
 *
 * KEV figures read from the CISA feed directly: 1,694 entries as of
 * 2026-09-02T16:54:39Z. Cisco has 96 entries in it; exactly one is Nexus.
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
    slug: "cisco-nexus-9000-cve-2026-20212-no-fixed-release",
    title:
      "A CVSS 9.8 root RCE in Cisco Nexus switches, and the advisory lists no fixed release",
    excerpt:
      "CVE-2026-20212 is a service bound to an unrestricted address, leaving TCP 43210 and 43211 reachable in the default VRF on Silicon One Nexus 9000 switches. Unauthenticated code execution as root. Ten models, every NX-OS release from 10.3(1) to 10.6(3s), and the only remedies on offer are an ACL and a temporary shield.",
    categorySlug: "security",
    tags: ["cisco", "nexus", "nx-os", "rce", "network", "cve"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1784118335089-09285eb70d58${P}`,
    body: `**CVE-2026-20212** carries a CVSS of **9.8**: unauthenticated remote code execution **as root** on **Silicon One**-based **Cisco Nexus 9000** switches.

The cause is not exotic. The **S1HAL** process **binds to an unrestricted IP address**, which leaves TCP ports **43210** and **43211** reachable in the **default Layer 3 VRF**. Anyone who can route to the switch on those ports talks straight to the service.

That is the whole bug: a listener that listens too widely.

## There is no fixed release

Affected models are the **N9324C-SE1U**, **N9348Y2C6D-SE1U**, **N9364E-SG2-O**, **N9364E-SG2-Q**, **N9396T12C-SE1**, **N9348Y12C-SE1**, **N9396Y12C-SE1**, **N9336C-SE1**, **N9K-C9804** and **N9K-C9808** — ten of them.

Affected NX-OS runs from **10.3(1)** through **10.6(3s)**. That is every release in the range, and the advisory lists **no fixed release**.

What is on offer instead:

- An **infrastructure ACL** blocking 43210 and 43211.
- **Cisco Live Protect shield lp00031** — described as temporary, and **unsupported on the N9804 and N9808**.

Read that last clause again. The two largest chassis in the affected list get the ACL and nothing else. For those operators the mitigation is entirely their own network design, on a flaw that grants root without credentials.

## Why the exposure is smaller than 9.8 suggests, and why that is cold comfort

A CVSS 9.8 assumes network reachability. In practice a data-centre switch's management and control interfaces are usually not reachable from anywhere an attacker starts, which is why the practical risk here is lower than the number implies.

But "usually not reachable" is doing the work, and the default VRF is precisely where the assumption tends to be wrong — that is the routing instance that carries production traffic on a lot of estates, not a segregated management plane.

The honest question is not "is my switch on the internet". It is "can anything that gets a foothold anywhere on my network reach TCP 43210 on this box". For a flat network the answer is yes, and the flaw then converts any foothold into root on the switch that moves everyone else's packets.

## Not in KEV, and Nexus rarely is

We checked the feed directly. As of the **2 September 2026** catalogue — **1,694** entries — **CVE-2026-20212 is not in KEV**, and neither are the two CVSS 9.8 flaws Cisco shipped alongside it in the IOS XR hardening release, **CVE-2026-20274** and **CVE-2026-20279**.

Cisco says it is **not aware of any malicious use**.

Some context from the same feed, because it changes how you should read that. **Cisco has 96 entries in KEV** — more than any vendor this site checks regularly. Exactly **one** is Nexus or NX-OS: **CVE-2024-20399**, added in July 2024. Everything else clusters in firewalls, VPN and management software: ASA and FTD, Firewall Management Center, Unified Communications Manager, Catalyst SD-WAN Manager.

Switches are not where Cisco's exploited flaws have historically been. That is a reason to think this one may stay unexploited — and it is also the reason nobody is watching switch telemetry with the attention they give the edge.

One entry in that list is worth noticing on its own: **CVE-2008-4128**, an IOS flaw, added to KEV on **13 July 2026**. An eighteen-year-old vulnerability, catalogued as known-exploited this year.

## What to do

- **Apply the ACL now.** Block 43210 and 43211 at the infrastructure boundary. It is the only remedy available to every affected model.
- **Deploy lp00031** if you are not on a 9804 or 9808 — and treat it as temporary, because Cisco does.
- **Check which VRF your management traffic actually uses.** The flaw is exposed in the default L3 VRF; if that is also your production routing instance, your blast radius is the whole fabric.
- **Do not wait for a fixed release to plan.** There is no date attached to one.
- **Patch the IOS XR batch too.** Two more 9.8s shipped the same day and they will get less attention than this one.

## What is not established

- **When a fixed release arrives.** The advisory does not say.
- **Whether the flaw is being exploited.** Cisco says it is unaware of any malicious use; absence of evidence, as always.
- **Who found it.** No researcher credit is given.
- **How many affected switches are reachable** from an untrusted network. Nobody has published a scan.
- **Whether lp00031 fully mitigates**, as distinct from reducing exposure. "Temporary" is the vendor's word, not a technical description.`,
  },
  {
    slug: "brazetsu-profiles-your-machine-to-price-it-at-5-dollars-80",
    title:
      "The malware profiles your machine so it can be priced. The going rate is $5.80",
    excerpt:
      "Group-IB documented BraZetsu, a Python framework that reads ERP directories, banking keywords in window titles and digital certificates — not to steal them, but to write a listing. The AI in this story is not in the payload. It is doing triage and pricing in the back office of a marketplace.",
    categorySlug: "security",
    tags: ["brazetsu", "group-ib", "initial-access-broker", "brazil", "python", "marketplace"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1579800790234-cb5bd473ebe7${P}`,
    body: `**Group-IB** analysts **Julio Guapo Menezes** and **Miguel Salazar** documented **BraZetsu**, a Python malware framework for Windows first seen in the wild in **early May 2026**. The actor, **Exilware**, was first identified on **2 February 2026**.

What makes it worth reading is not the capability list. It is what the capability list is *for*.

## The reconnaissance is a product listing

BraZetsu profiles a compromised host across hardware, installed software, network ports and running processes. Then it collects the things that are not about the machine at all:

- **Browser history** from Chrome, Edge, Brave, Vivaldi and Opera
- **Digital certificates**
- **Recently opened files**
- The location of **ERP directories**
- **Banking keywords appearing in active application window titles**
- Screen captures

Read that as an intake form rather than a theft. ERP directory present? This is a business, not a home PC. Banking keywords in the window title? Somebody here moves money. Certificates? Things can be signed. Browser history? Here is what this person has access to.

Each field maps to a price, and the framework exists to fill them in.

## The price is $5.80

The profile feeds the **Infected Marketplace**, also called **Banco de Infects**, at **infect[.]online** — an access-as-a-service operation. Initial access to a compromised host costs around **$5.80**.

Buyers can execute further payloads on what they have bought, which Group-IB describes as a **threat-multiplier effect**: one compromise, resold, becomes whatever the buyer already had planned.

Five dollars eighty is the number to sit with. It is not a ransom, it is not a wire transfer — it is the wholesale cost of standing inside a company. Every downstream incident that starts "initial access was obtained by an unknown means" has a price like this at the front of it, and [renting compromised routers as residential proxies runs on the same economics](/article/evooo1bot-mirai-routers-socks5-residential-proxy).

## Where the AI actually is

This will be reported as AI-powered malware. That framing is wrong in a specific and interesting way.

Group-IB describes generative AI used for malware development, and then for **backend data triage and target prioritisation** — automatically evaluating a compromised machine's **commercial potential**.

So the model is not in the payload. It is in the **back office**, doing inventory management: reading profiles, sorting them, deciding what is worth listing and at what price. That is a far more mundane use of the technology and a far more durable one, because it scales the part of the business that used to need a person reading each victim.

We wrote this week that [three labs shipped cyber models and graded their own homework](/article/three-labs-shipped-cyber-models-and-graded-their-own-homework). This is the other end of the same market: no frontier capability required, just enough automation to price stock.

## Delivery and evasion

The loader **masquerades as Microsoft Edge** and comes from **caixaentradas1inboxshop[.]site**, with VBScript files pulling later stages. Group-IB says social engineering is the most likely delivery route.

Persistence and control run over **WebSocket** straight to the marketplace, with C2 details pulled from **Pastebin** URLs. Some samples were **fully undetected on VirusTotal** at the time of analysis.

**Five distinct versions** have appeared since **9 February 2026**. The third generation narrowed to Brazilian corporate targets, though access to two US-based hosts was advertised at the same time.

Targeting spans Iberian and Latin American e-commerce, corporate, financial, industrial and law enforcement organisations. The malware specifically hunts Brazilian **CNAB** remittance files, the fixed-width format used for financial data interchange.

## On the attribution

Group-IB assesses with **high confidence** that BraZetsu and the earlier **AgenteV2** backdoor are the same framework, on shared codebase, infrastructure and capability — with the C2 address **38.242.246[.]176** appearing in both.

The operators are described as **believed to be native Portuguese speakers**. That is a language assessment, not an identification, and it should not be read as more.

## What to do

- **Alert on ERP directory enumeration** by non-administrative processes. Profiling that specific is not something normal software does.
- **Watch for outbound WebSocket to non-business destinations**, and for Pastebin fetches from servers.
- **Treat "initial access by unknown means" as purchasable.** When you reconstruct an intrusion, the entry point may have been bought rather than earned, which changes what you look for in the weeks before.
- **Undetected on VirusTotal is the normal case, not the alarming one.** Detection-by-hash was never going to catch a framework at five versions in seven months.

## What is not established

- **How many hosts are listed** on the marketplace, or how many have sold.
- **Which generative model or service** is being used, or whether the AI claims are anything more than the researchers' inference from artefacts.
- **Who Exilware is.** Language is not identity.
- **Whether the two advertised US hosts** indicate a shift in targeting or an opportunistic listing.
- **The full delivery chain.** Social engineering is described as most likely, not confirmed.`,
  },
  {
    slug: "breeze-comet-attacked-the-payment-rails-not-the-customers",
    title:
      "Breeze Comet did not phish bank customers. It got inside Pix, STR and Boleto and pushed hundreds of transactions",
    excerpt:
      "Google's threat group documented a Brazilian crew that needs RSFN network access and mTLS credentials to operate — the requirements of a payments engineer, not a fraudster. The way in was a WhatsApp message impersonating IT support and a remote-access tool.",
    categorySlug: "security",
    tags: ["breeze-comet", "mandiant", "brazil", "pix", "financial", "e-crime"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1780652227326-384c2b995311${P}`,
    body: `**Google Threat Intelligence Group** and **Mandiant** published on **1 September 2026** on **Breeze Comet**, previously tracked as **UNC5669**, a financially motivated group operating from **Brazil** and active since at least 2024 — CrowdStrike, which calls it **Plump Spider**, dates it to September 2023. Trend Micro tracks overlapping activity as **SHADOW-AETHER-064**.

Four names for one problem is its own small scandal, and we will come back to it.

## They went for the rails

Most financial crime targets account holders. This targets the machinery.

Breeze Comet pursues organisations with transaction permissions on **Pix**, Brazil's instant payment system, on **STR**, the settlement system, and on **Boleto**. Google's description of what the group needs is the part that reframes it:

- Access to the **National Financial System Network (RSFN)**
- **mTLS credentials** for authenticated transaction payloads
- Privileged **Active Directory and cloud accounts**
- An understanding of transfer procedures and anti-fraud systems

That is not a fraudster's shopping list. It is a payments engineer's job description. Google calls it **direct intrusion into core financial switch and instant payment infrastructure**, and the distinction matters: you cannot defend the rails with the controls built to spot a customer being tricked.

Once inside, the group reaches core financial applications, executes **hundreds of fraudulent transactions**, and deletes the event logs. Google reports at least one heist of **tens of thousands of US dollars** in assets — a figure worth flagging as the confirmed floor rather than the scale of the campaign.

## The way in is not sophisticated at all

For a group operating inside national payment infrastructure, the entry points are ordinary:

- **Password spraying**
- **WhatsApp messages impersonating IT support**, to talk someone into installing a remote monitoring tool like **AnyDesk**
- **Vulnerable JBoss AS servers**, for web shells
- **Compromised Brazilian government websites**, used to stage RMM tools, infostealers and backdoors

The last one is quietly clever. A payload hosted on a government domain inherits the trust of that domain — in filtering, in reputation systems, and in the mind of whoever clicks it.

But the headline entry method is a WhatsApp message. The most capable part of this operation begins with the oldest trick in the file.

## The tooling is custom and the pattern is escalation

**COBALTSPIN** is a Rust network tunneler that stands up a reverse **SOCKS5 proxy over WebSocket**, routing between command-and-control and internal targets through the firewall rather than past it.

The backdoors are written in four different languages, which is a hiring signal as much as a technical one:

- **LIGHTPAINT** — Java, installs SoftEther VPN
- **MILDFROST** — passive Java JAR, DNS tunnelling
- **KICKPLATE** — Nim, impersonates Windows Update
- **BOATBEAM** — Go, fake IIS HTTPS server

Persistence has escalated year on year: commercial RMM tools in 2024, **malicious Kubernetes pods** in 2025, custom backdoors now. And the operation has spread beyond Brazil to **Nigeria**, **Paraguay**, **Ghana** and **Venezuela**.

## The LLM claim is thinner than it will be reported

Google indicates LLM-assisted development, and the evidence given is **verbose code comments** that read like descriptions of self-reasoning and autonomous decision-making.

That is an inference from commenting style. It is plausible — those comments are a recognisable artefact — and it is not proof, and it belongs in the same category as [attributing a group by the timezone in its commit metadata](/article/nimbus-manticore-coding-test-says-do-not-use-ai). Worth reporting, worth labelling.

## Four names, one group

Breeze Comet, UNC5669, Plump Spider, SHADOW-AETHER-064.

Every vendor has reasons for its own naming scheme, and the cost lands entirely on defenders, who have to work out whether three advisories describe three problems or one. If you are searching your logs against a threat name, you are searching against a quarter of the available reporting.

## What to do

- **Treat payment-operations staff as your highest-risk identity group.** Their credentials are the objective, not a stepping stone.
- **Alert on RMM installs** — AnyDesk and equivalents — on any host with access to financial systems. That is the documented first move.
- **Verify IT support contact out of band.** The WhatsApp lure works because there is no channel to check it against.
- **Protect mTLS material like signing keys**, because that is what it is here.
- **Alarm on event log clearing**, which is the group's documented cleanup step and one of the few noisy things it does.
- **Patch or retire JBoss AS.** It is the non-social entry point in this campaign.

## What is not established

- **The total stolen.** One heist of tens of thousands is confirmed; the campaign total is not published.
- **How many organisations were compromised**, or which.
- **Whether the LLM assistance is real**, beyond an inference from code comments.
- **Whether the four vendor names describe exactly the same set of activity**, or overlapping ones.
- **Any nation-state connection.** Google characterises this as financially motivated e-crime and nothing more.`,
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
