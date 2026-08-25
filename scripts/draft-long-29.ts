/**
 * Long-form drafts — 25 August 2026, third batch.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits, penalises ones opening on a back-reference, cannot read a table, and
 * truncates past ~460 characters. Each section's strongest paragraph is written
 * to stand alone, carry its own figures, and stay under that limit.
 *
 * Sourcing note: the Veracode figures come from Veracode's own report page, not
 * from the aggregators. A widely repeated claim that 74% of AI patches fail to
 * fix the bug is deliberately omitted — it appears only in secondary write-ups
 * and is not on Veracode's own page.
 *
 * Cover note: all four downloaded and viewed. Rejected during this batch: a
 * close-up router with a vendor's brand mark embossed on it, on a story about a
 * different vendor's flaw — the same error as putting a Porsche badge on a car
 * malware story that named no manufacturer, and worse here because it would
 * implicate an uninvolved company. Cables carry no brand, so cables it is.
 *
 * Pass --update to rewrite existing drafts; published articles are skipped.
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
    slug: "calix-cve-2026-75501-upnp-wan-port-5000-no-patch",
    title:
      "The router's UPnP service is listening on the internet side — and anyone can use it to open a door into the house",
    excerpt:
      "A Calix fibre gateway exposes its UPnP control endpoint on the WAN interface on TCP 5000 with no access control. Unauthenticated requests can create port-forwarding rules that survive a reboot. The researcher reported it on 7 June, got no answer, and went to CERT/CC. There is still no patch, and the device is supplied by ISPs.",
    categorySlug: "security",
    tags: [
      "upnp",
      "routers",
      "calix",
      "nat-bypass",
      "unpatched",
      "cert-cc",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1683322499436-f4383dd59f5a${P}`,
    body: `**UPnP** exists so that a game console inside your home can ask the router to open a port for it. The entire security model of that protocol rests on one assumption: only devices on the local network can ask.

On the **Calix GS5239XG** — sold as the **GigaSpire 7u10txg** — that assumption does not hold.

## What the flaw is

**CVE-2026-75501** is missing authentication on the **MiniUPnPd** control endpoint. On firmware **EXOS/6.6.47**, that endpoint is exposed on the **WAN** interface, on **TCP port 5000**, with no access controls.

An unauthenticated **SOAP** request from the internet can therefore:

- **Create** port-forwarding rules
- **Delete** existing mappings
- **Enumerate** what is currently mapped
- **Retrieve** the router's public IP address

Creating a port-forwarding rule from outside means selecting any device inside the home network and publishing it to the internet. The NAT boundary that most household devices depend on for their entire security posture is not bypassed by an exploit — it is reconfigured by asking politely.

Security researcher **Brian Khan Quintana** demonstrated it by creating permanent forwarding rules from outside his own network. They **survived power cycles**.

## Why the device matters

This is a **Wi-Fi 7** residential gateway with an integrated **XGS-PON** fibre terminal — the box a fibre installer leaves behind, not something a customer chose.

It is deployed by **Cox Communications**, **Brightspeed**, **ALLO**, **CityFibre** and **Conexon**.

That changes the shape of the problem completely. A consumer who buys their own router can patch it, replace it, or throw it away. A subscriber with an ISP-supplied gateway usually cannot do any of the three, and in many cases does not have full administrative access to it. The people exposed here are the ones with the fewest options.

## The disclosure timeline is the other story

Quintana contacted the vendor on **7 June**. He did not get a useful response.

He escalated to the **CERT Coordination Center** at Carnegie Mellon, and the eventual public disclosure was coordinated by CERT/CC after vendor non-response. Calix has not responded to press questions about the flaw, the affected devices, or a patch timeline.

There is still **no patch**.

Coordinated disclosure only works if the coordinating happens on both ends. When a vendor does not engage, the researcher is left choosing between silence — which protects nobody, since the flaw exists whether or not it is published — and disclosure without a fix, which at least lets people apply a workaround. CERT/CC exists precisely to make that second option orderly rather than reckless.

## What to do

- **Turn UPnP off.** In the gateway's administrative interface: **Advanced → Security → UPnP**. This is the researcher's recommended mitigation and it is the only one available.
- **Expect something to break.** UPnP is what lets consoles, some VoIP handsets and peer-to-peer applications open their own ports. If a game's multiplayer stops working after you disable it, that is the trade, and manual port forwarding is the fix.
- **Check what is currently mapped before you disable it.** If rules exist that you did not create, that is a finding, not a curiosity.
- **If your ISP supplied the box, ask them.** They are the only party who can push firmware, and volume of customer contacts is the mechanism that produces one.
- **Consider putting your own router behind it** if the gateway can run in bridge mode. That moves the NAT boundary to a device you control.

## The wider point

We have written this month about attackers who need [an old CVE and a list of 170,000 targets](/article/uat-10147-spectre-implant-170000-urls-old-cves), or [a private APN to reach a plant's controllers](/article/polish-chp-plant-private-apn-wago-turbine-shutdown).

Here the requirement is a SOAP request to a port that should never have been listening. No exploit, no memory corruption, no authentication to defeat — a management interface pointed the wrong way. It is the same class of failure as [the Minnesota water systems, which were disrupted without exploiting anything at all](/article/minnesota-water-plc-attacks-no-exploit-needed).

## What is not established

- **A CVSS score.** None published at the time of writing.
- **How many devices are affected.** No figure from Calix or the ISPs.
- **Whether it is being exploited.** No in-the-wild activity reported. That is not reassurance — a scan for TCP 5000 across an ISP's address range is trivial.
- **When a patch will arrive.** No timeline given.
- **Whether other Calix models or firmware are affected.** Only GS5239XG on EXOS/6.6.47 is named.`,
  },
  {
    slug: "miniorange-saml-two-cves-chained-paid-editions-no-advisory",
    title:
      "The plugin used the identity provider's public key as a shared secret — and only the free edition got told",
    excerpt:
      "Two flaws in miniOrange's SAML SSO plugin for WordPress chain into a full authentication bypass, and attacks are already underway. One lets an attacker sign assertions with a key everybody has. The other treats an OpenSSL verification error as a pass. Fixes exist for all seven editions; the vendor's advisory covered one.",
    categorySlug: "security",
    tags: [
      "wordpress",
      "saml",
      "authentication-bypass",
      "miniorange",
      "exploitation",
      "patchstack",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1775057154553-0f3e8902fea3${P}`,
    body: `Two vulnerabilities in the **miniOrange SAML 2.0 Single Sign On** plugin for WordPress chain together into an authentication bypass. They are being exploited.

Both are textbook, which is what makes them worth reading rather than just patching.

## Bug one: the public key as a shared secret

**CVE-2026-61979** lets an attacker choose **HMAC-SHA1** as the signature algorithm. When they do, the plugin takes the **RSA public key** belonging to the identity provider and uses it as the **shared secret** for the HMAC.

A public key is public. That is its entire job.

So the attacker supplies a value that anybody can obtain, computes a signature that verifies against it, and the plugin accepts the assertion as genuine. This is algorithm confusion — the same shape as the JWT attack where a token signed with **alg=RS256** is replayed as **alg=HS256** — and it has been a known class of bug for over a decade.

The defence is one line of logic: the verifier, not the token, decides which algorithm is acceptable.

## Bug two: minus one is not zero

**CVE-2026-15981** is simpler and somehow worse. The plugin treats an **OpenSSL verification error** — a return value of **-1** — as a **successful** result.

OpenSSL's verification functions return **1** for valid, **0** for invalid, and **-1** for an error. Code that checks whether the result is *not zero*, or that treats anything truthy as success, turns every internal failure into a pass. A malformed signature that OpenSSL cannot even process comes back as approved.

That is the whole bug. It is a comparison.

## Chained, they are a front door

Either flaw alone is serious. Together they mean an attacker can forge a SAML assertion asserting they are any user — including an administrator — and the plugin will accept it.

For a WordPress site using SAML for single sign-on, the plugin *is* the authentication. There is nothing behind it to catch this.

## It is already happening

On **16 August**, **DigitalOcean** blocked an anomalous WordPress administrator session originating from an unauthorised network. That was live exploitation, against the **Standard** edition at version **16.1.9**.

The traffic came from **six** IP addresses across Europe, Africa and the United States. A proof-of-concept for the free edition is publicly available, and **Patchstack** reports that exploitation attempts and opportunistic scanning are underway.

Six addresses on three continents is not a targeted operation. It is scanning.

## The part that should not have happened

Fixes exist for **all seven** editions:

| Edition | Fixed version |
| --- | --- |
| Free | 5.4.5 |
| Premium (single) | 13.0.4 |
| Standard (single) | 17.06 |
| Enterprise / All-Inclusive (multi) | 20.2.8 |
| Enterprise (single) | 26.0.3 |
| VIP (single) | 32.0.8 |
| VIP (multi) | 35.0.7 |

The vendor's advisory covered only the **free** edition. Six paid editions had a fix available and no alert telling anyone to apply it.

The customers who paid the most were the ones least likely to hear about it — and the exploitation that has been confirmed so far hit a **paid** edition. A patch nobody is told about is, from the perspective of an unpatched site, indistinguishable from no patch.

## What to do

- **Check your edition and version now.** The fixed version differs for each of the seven, and the numbering is not comparable between them.
- **Update immediately.** This is remote, unauthenticated, and being scanned for.
- **Then check for accounts you did not create**, and for administrator sessions from addresses you do not recognise. A successful bypass leaves a logged-in admin, not a crash.
- **Rotate the identity provider's certificate** after patching if you believe you were exposed.
- **Do not rely on vendor advisories as your only patch signal.** This incident is the argument for a feed that watches the CVE, not the newsletter.

## What is not established

- **How many sites were compromised.** One blocked session is confirmed; the total is unknown.
- **Who is behind it.** No attribution.
- **Whether the six addresses are related** or independent opportunists working from the same public proof-of-concept.
- **Why the advisory omitted the paid editions.** miniOrange has not explained it publicly.
- **Total install count** across the seven editions.`,
  },
  {
    slug: "veracode-2026-ai-code-56-percent-xss-15-percent",
    title:
      "AI writes code that compiles almost every time and is secure just over half the time — and that number has not moved",
    excerpt:
      "Veracode's 2026 report puts the security pass rate for AI-generated code at 56%, against 55% a year ago, while syntax correctness sits near 100%. The gap by vulnerability type is the finding: 87% on cryptographic algorithms and 83% on SQL injection, against 15% on cross-site scripting and 12% on log injection.",
    categorySlug: "ai",
    tags: [
      "ai-generated-code",
      "veracode",
      "appsec",
      "owasp",
      "software-supply-chain",
      "developer-tools",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1734792314921-e2ab82d18921${P}`,
    body: `**Veracode's** 2026 GenAI Code Security Report gives AI-generated code a security pass rate of **56%**.

Last year's figure was **55%**. Over the same period the models got substantially better at almost everything else.

## The two numbers that matter together

Modern models produce **syntactically correct** code close to **100%** of the time. They produce **secure** code **56%** of the time.

Roughly **44%** of code-generation tasks introduced a real vulnerability.

A model that always compiles and is safe half the time is not a partially reliable engineer. It is a tool that has learned the part of the job with immediate feedback — a compiler error is instant, unambiguous and everywhere in the training data — and not the part whose feedback arrives months later in an incident report.

There is no error message for an injection flaw. There is a breach, eventually, somewhere else.

## Where it fails is the real finding

Broken out by vulnerability type, the results are not uniformly mediocre. They are excellent in some places and close to useless in others:

| Vulnerability type | Security pass rate |
| --- | --- |
| Cryptographic algorithms | 87% |
| SQL injection | 83% |
| Cross-site scripting | 15% |
| Log injection | 12% |

**87%** and **83%** against **15%** and **12%**. That is not a model that is bad at security. It is a model that is good at the *famous* vulnerabilities and bad at the rest.

SQL injection has been the canonical example in every tutorial, framework guide and code review checklist for twenty-five years. Cryptography has strong, repeated, well-documented conventions. Cross-site scripting is just as old and just as serious, but the correct handling depends on output context in a way that resists a memorable rule — and log injection barely appears in the popular material at all.

The pattern fits what these systems are: the security knowledge in the training data, reproduced in proportion to how much of it there is.

## The levers do not work

The obvious responses have been measured, and none of them move the number much:

- **Reasoning models: 56%.** Non-reasoning: **51%**.
- **Large models: 53%.** Medium and small: **51%** each.
- **Coding-specialised models: 51%.** General-purpose: **52%** — the specialists are marginally *worse*.
- **Best single model, GPT-5.5: 68%.** More than half of those tested land between **50%** and **53%**.

Scale gives two points. Reasoning gives five. Specialising for code gives nothing. If this improved with the usual levers it would have improved already.

## Why this lands now

Because in organisations that have adopted AI coding tools, AI now authors roughly **half of all committed code**.

Half the codebase, from a source that ships a vulnerability in about **44%** of tasks, at a rate that has not improved in a year. Veracode notes that software vulnerabilities are now the top breach entry point at **31%**, and that **82%** of organisations are carrying security debt.

Put this next to the other half of the story. [Broadcom pointed AI at Spring and took the count from 16 disclosed vulnerabilities in 2025 to over 200 this year](/article/spring-91-cves-200-this-year-broadcom-ai-discovery). [Anthropic is putting its most restricted model into defender tooling](/article/anthropic-mythos-5-defenders-findings-not-the-model-35m-fund). [An agent swarm found 266 vulnerabilities across 15 open-source projects](/article/anthropic-multiagent-conflict-kill-loops-266-vulnerabilities).

The same technology is writing the bugs and finding them. Whether that nets out positive depends on a race between two rates, and this report is the first hard measurement of the writing side.

## What to do

- **Treat generated code as untrusted input** until it has been through security testing. That is Veracode's own conclusion and it is the right one.
- **Weight your review toward what the models are worst at.** Output encoding and anything that reaches a log deserve more scrutiny than the parameterised query the model got right.
- **Do not assume a newer or bigger model fixed it.** The measured gain from scale is two points.
- **Put scanning in the pipeline, not at the end.** At half of committed code, manual review does not scale to the volume.
- **Measure your own rate.** An industry average is not your codebase, and this is checkable.

## What is not established

- **The exact model and task counts** behind the aggregate are not on Veracode's own page.
- **Language-by-language results.** Not published there.
- **Whether the 56% figure generalises** beyond the specific task set used.
- **How much human review catches** before these defects reach a repository. The report measures the model's output, not the finished product.`,
  },
  {
    slug: "atm-jackpotting-record-sentence-119-charged-nebraska",
    title:
      "The longest US sentence yet for ATM jackpotting — an attack that starts with taking the machine's cover off",
    excerpt:
      "A 27-year-old Venezuelan national got 96 months in federal prison for a scheme that pried open ATM casings, plugged in a laptop, and told the machine to dispense everything. Over $3.5 million is attributed to him. He is one of 119 people charged in Nebraska alone, and roughly 1,900 of these attacks have been reported since 2020.",
    categorySlug: "world",
    tags: [
      "atm",
      "jackpotting",
      "financial-crime",
      "malware",
      "sentencing",
      "organised-crime",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1778085285953-3840c86c3b74${P}`,
    body: `On **24 August 2026** the US Justice Department announced a **96-month** federal prison sentence — eight years, plus five years of supervised release — for **Juan Manuel Gouveia-Aguilera**, **27**, a Venezuelan national.

The DoJ describes it as the longest federal sentence imposed for an individual's role in **ATM jackpotting**. Over **$3.5 million** in losses is attributed to him.

## How the attack works

Remove the ATM's exterior casing. Connect a laptop. Install malware. Instruct the machine to dispense all of its cash.

That is the technique. There is no network intrusion, no credential theft, and no card data involved. The attacker gets physical access to the machine's internals and speaks directly to the cash dispenser.

It works because of an architectural assumption that predates the threat: the computer inside an ATM trusts the dispenser and the dispenser trusts the computer, and the security boundary protecting that conversation is the metal box around both of them. Once the box is open, the software has no way to tell a criminal's laptop from the machine's own controller.

## The charges are the giveaway

Gouveia-Aguilera was convicted of **bank fraud**, **bank burglary**, and **cyber-enabled fraud**.

**Burglary.** That word is doing real work in a story people file under cybercrime. This is a physical break-in with a software payload, and the sentence reflects the physical half as much as the technical one.

## The scale nobody sees

He is one of **119** individuals charged with ATM jackpotting **in Nebraska alone**, allegedly working for the Venezuelan organisation **Tren de Aragua**. Two other Venezuelan nationals received **78-month** sentences weeks earlier for similar offences.

Nationally, roughly **1,900** jackpotting attacks have been reported since **2020**, and 2025 incidents alone caused losses exceeding **$20 million**.

One hundred and nineteen defendants in one state is not a hacking crew. It is a labour force. The malware and the technique are built once; what scales is the number of people willing to stand at a machine at three in the morning with a screwdriver, and the ability to move them.

That is the same economic shape as the ransomware affiliate model and as [a command-and-control framework selling for $99.99](/article/redc2-4-npm-packages-llm-red-agent-99-dollars): the technical work is centralised and cheap, and the operation scales by recruiting people who do not need to understand it.

## Why the sentence is the news

**Eight years** is not the largest financial-crime sentence handed down this year. It is the largest for this offence, and that is a signal about how prosecutors have decided to treat it.

Jackpotting has historically been charged as theft or burglary and sentenced accordingly. Adding **cyber-enabled fraud** and pushing the term to 96 months reframes it as something closer to an intrusion offence. Whether that deters anyone is a separate question — deterrence assumes the person at the machine is weighing sentencing guidelines, and the recruitment model this depends on suggests many of them are not the ones capturing the money.

Two others at **78 months**, this one at **96**, and 116 more cases still moving through one state's courts. The trend line in the sentences is easier to read than the trend line in the attacks.

## For banks and ATM operators

The defences are physical and procedural, not clever:

- **Alarms on the top-box or fascia.** The attack requires opening the enclosure, which is a detectable event.
- **Full-disk encryption and secure boot on the ATM PC**, so an attacker's code cannot simply be loaded.
- **Authenticated communication between the PC and the dispenser** — the control that would defeat the technique outright, and the one that legacy fleets most often lack.
- **Cash-level and dispense-rate alerting.** A machine emptying itself in minutes is an anomaly that can be detected in real time.
- **Prioritise standalone machines.** Retail and off-premises ATMs are chosen because nobody is watching them.

## What is not established

- **Which states** the offences occurred in, beyond the Nebraska charging venue.
- **The exact dates** of the offences.
- **How many machines** he personally targeted.
- **How the malware reached the group**, or who wrote it.
- **The status of the other 118 defendants.** Charged is not convicted.`,
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
