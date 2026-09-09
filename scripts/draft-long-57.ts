/**
 * Drafts the 7 September batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-57.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-57.ts --update
 *
 *   1. Trezor / ShipMonk. Trezor did the procedurally correct thing — contract,
 *      retention policy, repeated requests, written assurances received — and
 *      the data was still there five to seven years later. The point is that an
 *      assurance is a promise, not a control, and nobody downstream can verify
 *      deletion at a third party.
 *   2. JetBrains Cadence. CISA put CVE-2026-63077 in KEV on 5 August; the
 *      intrusion into JetBrains' own Cadence server, through JetBrains' own
 *      unpatched TeamCity, started on the 8th. Written without gloating: three
 *      days is not egregious for a large fleet, the asymmetry is that they make
 *      the product.
 *   3. MikroTik. CERT Polska says two flaws are chained for unauthenticated
 *      admin over SSH and will not say which two. Both sides of that argued
 *      rather than just the complaint.
 *
 * Covers checked at full size before use, after a payment terminal got picked
 * off a thumbnail for a story about ID scanners.
 *
 * No backticks in the bodies: inline code spans inside these template literals
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
    slug: "trezor-shipmonk-deletion-was-confirmed-in-writing-and-did-not-happen",
    title: "The deletion was contractual, confirmed in writing, and did not happen",
    excerpt:
      "Trezor says it repeatedly asked its logistics provider to delete customer data and repeatedly received written confirmation that it had been. On 5 September it disclosed that 67,000 US customers' names, phone numbers and home addresses from 2019 to 2021 were in a breach at that provider — matched, in every case, to the purchase of a hardware wallet.",
    categorySlug: "security",
    tags: ["trezor", "shipmonk", "breach", "third-party-risk", "data-retention", "crypto"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1672552226380-486fe900b322${P}`,
    body: `On **5 September 2026**, Trezor disclosed that a breach at **ShipMonk** — the logistics provider that fulfils orders from its eShop — exposed the data of **67,000 US customers**. A separate disclosure the previous month covered **13,689** more.

The records are names, email addresses, phone numbers, **shipping addresses** and order numbers, covering orders placed between **November 2019 and August 2021**.

ShipMonk told Trezor on **10 August 2026**. Trezor disclosed on **5 September**.

## The part that should not have been possible

Trezor's own account of the retention arrangement:

> Throughout our entire relationship with ShipMonk, we repeatedly requested and received written assurance confirming the deletion of the data, in line with our contract, data policy, and past communications.

And its stated policy: customer addresses and phone numbers are deleted or anonymised after **90 days**.

Read those two facts against the date range. The oldest exposed records are from **November 2019**. Against a 90-day policy, that is data retained roughly **twenty-eight times longer** than the policy allowed, at a company that had confirmed in writing, more than once, that it no longer held it.

Trezor did the things a company is supposed to do here. There was a contract. There was a retention policy. There were repeated requests. There were written confirmations in response.

None of it was a control. **A written assurance is a promise about a state of affairs, not a mechanism that produces it**, and no customer of a third party can verify deletion from the outside. You can ask, you can contract, you can audit on a schedule — and between audits you are trusting a sentence in an email.

That is not a Trezor failure of process. It is the outer limit of what process can do, and it is worth being precise about, because the lesson people will take is "Trezor should have asked harder".

## "Physical security risks" is not boilerplate here

Trezor's warning:

> The leaked information could be used for scam emails, fraudulent calls or letters, and could potentially expose affected individuals to physical security risks.

Most breach notices contain a sentence like that and most of the time it is legal padding. This one is not.

Reconstruct what the list actually is. Every person on it is someone who bought a **hardware wallet** — a device whose entire purpose is holding cryptocurrency offline — and every record pairs that person's name with their **home address** and phone number.

That is a target list for physical coercion. The pattern has a name in the industry and a growing case history, and it does not require the attacker to know how much anyone holds. It requires believing they hold something, which the purchase itself implies.

Phishing is the likely first use. It is not the worst one.

## Two disclosures, one month apart, five times larger

13,689 in August. 67,000 in September. That progression usually means the scope assessment is still running, and it is a reason to treat the current number as a floor rather than a total.

The date range is also worth sitting with from the other direction. Records from 2019 to 2021 are **five to seven years old**. Many of those addresses are stale, which blunts the list. It also means people who have long since moved on from crypto — or who never told anyone they were in it — are on a document that says otherwise.

## ShipMonk has said nothing

The company that held the data has made no public acknowledgement. Trezor, its customer, is doing the disclosing, the notifying and the explaining.

[The same shape turned up last week in the Thomson Reuters C-Track notice](/article/c-track-sealed-records-order-did-not-travel-with-the-backup), where the exposed material was described by one court as database copies handed to the vendor for troubleshooting. Different sector, identical failure: the breach was not at the company whose name is on the relationship, and the copy nobody governed is the one that leaked.

## What to do

- **If you bought a Trezor between November 2019 and August 2021, assume your address is out.** Not your keys, not your seed phrase, not your funds — Trezor holds none of those and this breach does not touch them. Your address.
- **Treat unsolicited contact about your wallet as hostile by default.** The attacker now knows your name, your address, and that you own the device. That is enough to build a convincing letter.
- **Nobody legitimate will ever ask for your recovery seed.** Not Trezor, not support, not a courier, not a "security check". This is the phishing that this list enables and it will arrive.
- **If you are a company: your vendors' deletion confirmations are not evidence.** Ask when they were last verified rather than last asserted. Most organisations will find the answer is never.
- **Reconsider what you send to fulfilment.** A shipping label needs a name and an address. It does not need to persist for six years.

## What is not established

- **When the breach actually occurred.** ShipMonk told Trezor on 10 August; the intrusion date has not been published.
- **How long the data was exposed** before discovery.
- **What failed at ShipMonk.** No technical detail has been released.
- **Why the data still existed.** Whether it was never deleted, deleted from one system and not another, or restored from a backup, is not stated.
- **Whether the total is final.** Two disclosures in, it is growing.`,
  },
  {
    slug: "jetbrains-cadence-teamcity-kev-on-the-fifth-breached-on-the-eighth",
    title: "The flaw entered CISA's catalogue on 5 August. JetBrains' own server was breached through it on the 8th",
    excerpt:
      "CVE-2026-63077 is a 9.8 unauthenticated RCE in TeamCity. CISA listed it as actively exploited on 5 August. Three days later, attackers used it against api.cadence.jetbrains.com — JetBrains' own hosted service, running JetBrains' own unpatched product — and left with a 2024 server backup, AWS IAM credentials and users' source code.",
    categorySlug: "security",
    tags: ["jetbrains", "teamcity", "cve-2026-63077", "kev", "supply-chain", "aws", "breach"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2${P}`,
    body: `**Cadence** is a JetBrains-hosted cloud service that plugs into PyCharm and runs machine learning and other heavy workloads on cloud GPUs, straight from the IDE.

Its server, **api.cadence.jetbrains.com**, was running an unpatched TeamCity.

## The three dates

**5 August 2026** — CISA adds **CVE-2026-63077** to the Known Exploited Vulnerabilities catalogue. It is a deserialization flaw, **CVSS 9.8**, allowing an unauthenticated attacker to bypass authentication and run arbitrary OS commands with the privileges of the TeamCity server process.

**8 August 2026** — attackers exploit it on the Cadence server. The intrusion runs to **24 August**.

**23 August 2026** — JetBrains discovers it.

Three days from public confirmation of in-the-wild exploitation to compromise. Fifteen days from compromise to detection.

## Be fair about the three days

Three days is not, on its own, a scandal. Patching a real estate takes change windows, dependency checks and someone to do it, and plenty of competent organisations were still working through this one on 8 August.

The asymmetry is what makes it worth writing about. **JetBrains makes TeamCity.** During those three days the company was telling its customers to patch this flaw urgently, and its own hosted service was running the unpatched version. The knowledge was not the constraint; nobody had to wait for an advisory to reach them.

JetBrains has not said why the server was not patched, and that is the single most useful thing it could still publish. Most organisations that get caught this way have the same answer — the box belonged to a team that did not know it was in scope — and hearing a vendor say so out loud would help more people than another advisory.

## What left the building

This is where it stops being an embarrassment and starts being a problem for other people.

- **Personal data**: usernames, real names, email addresses, login timestamps, IP addresses
- **A full 2024 Cadence server backup**, containing credentials, configuration, artifacts and logs
- **Multiple AWS IAM users and their credentials and secrets**, including some belonging to JetBrains employees
- **Files from S3 buckets** inside JetBrains AWS accounts
- **Source code synchronised from users' PyCharm projects**

Two of those deserve to be pulled out.

**The backup is the real damage.** A 2024 server backup is a time capsule of secrets, and a secret in it is live unless somebody has rotated it since. Most organisations rotate on incident, not on schedule, which means the useful assumption is that anything in that backup still works.

**Users' source code was taken.** People pointed their IDE at a GPU service and their projects went with it. If your organisation used Cadence, your code was in scope of somebody else's breach and you would have had no way to know.

## Read the advice JetBrains gave

> Cadence users should immediately revoke or rotate all credentials and secrets that may have been used to run their Cadence executions. They should also treat all executions, including their inputs and outputs in your Cadence project, as potentially untrusted.

The first sentence is a normal credential rotation notice.

The second is a supply-chain warning inside a breach notice. **Treat your outputs as potentially untrusted** means: an attacker had command execution on the machine that produced your results, so anything that came back from it — model artifacts, generated code, computed data — might have been altered. Anyone who took a Cadence output and shipped it needs to reason about that, and there is no tooling that will tell them.

[The PaperCut intrusions last week ended in exactly the same place](/article/papercut-attackers-went-for-the-ldap-bind-credentials): the interesting thing about a compromised server is rarely the server, it is the credential material sitting on it that reaches somewhere else.

## What to do

- **If you used Cadence, rotate everything that touched it**, and do not scope that to the credentials you deliberately configured. The backup predates whatever you think you exposed.
- **Check your AWS accounts for access originating from JetBrains-associated credentials.** IAM users in the backup are the pivot.
- **Treat any artifact produced by a Cadence execution as suspect** if it went anywhere near production. JetBrains said so; take it literally.
- **Then go and find your own TeamCity servers.** CVE-2026-63077 is in KEV, it is unauthenticated, and it is 9.8. The lesson from this incident is not about JetBrains — it is that the inventory of who runs your build servers is usually wrong.
- **Ask where your CI backups live and who can read them.** That is the asset that turned a server compromise into a credential compromise here.

## What is not established

- **Who did it.** No attribution has been published.
- **Why the server was unpatched.** JetBrains has not said.
- **The full extent of AWS access** achieved with the extracted credentials.
- **Whose source code was taken**, or how much. JetBrains has described the category, not the scope.
- **Whether anything was modified**, as opposed to read. The advice to treat outputs as untrusted implies the question is open, not that the answer is known.`,
  },
  {
    slug: "cert-polska-two-flaws-chained-against-mikrotik-nobody-will-say-which-two",
    title: "The MikroTik chain has names now, and the first flaw checks the wrong half of the key",
    excerpt:
      "CERT Polska and MikroTik have named the chain MikroTrick. CVE-2026-67276 validates only an SSH key's type and modulus, so anyone who knows an authorised user's public modulus can forge a key without the private half. CVE-2026-86060 then turns a crafted username into a command-line argument and hands over administrator.",
    categorySlug: "security",
    tags: ["mikrotik", "routeros", "cert-polska", "ssh", "edge-devices", "disclosure"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1682559736721-c2e77ff4c650${P}`,
    body: `**CERT Polska** published a warning on **5 September 2026**: attackers are gaining **full administrative control of MikroTik routers without authentication**, against devices with SSH reachable from the internet. The observed attacks date to at least **2 September**.

The mechanism is described as a combination of **two vulnerabilities**. Which two is not stated.

## The affected versions

- **6.0.0** to below **6.49.21**
- **7.0.0** to below **7.23.4**
- **7.24** to below **7.24.2**
- **7.25beta3**

MikroTik has published fixed releases across those branches.

Note where that list starts. **RouterOS 6.0.0** shipped in 2013. The affected range covers essentially every 6.x device that has not been kept current, which in this product's installed base is a great many — MikroTik hardware is cheap, durable, and frequently deployed by people who set it up once.

## The two flaws have names

When this article first ran, neither CERT Polska's warning nor the surrounding disclosure identified the vulnerabilities or explained how they combined, and that gap was the story. It has since been filled.

CERT Polska and MikroTik disclosed **6** RouterOS vulnerabilities on **5 September**, **2** of which chain into the attack now called **MikroTrick**:

**CVE-2026-67276**, **CVSS 9.2** — the SSH authentication bypass. During public key authentication RouterOS validates only the **key type and the modulus**, not the whole key. An RSA public key is a modulus and an exponent, and the modulus is public by definition: it is sitting in the authorized key. So an attacker who can read an authorised user's public key can present something that matches on the fields RouterOS checks, **without ever holding the private key**.

**CVE-2026-86060**, **CVSS 9.2** — the escalation. From that pre-authentication state, a **crafted username** is misread by RouterOS's SSH login helper as a **command-line argument**, which yields full administrative privileges.

A third, **CVE-2026-67277** at **8.8**, is a memory disclosure and denial-of-service issue not part of the chain.

## Two textbook classes, one after the other

Worth naming what these are, because both are old and both are avoidable.

The first is **incomplete verification**. The check exists, runs, and returns success — it simply verifies the wrong thing. Validating that a key has the right shape is not the same as validating that the presenter holds the private half, and the whole point of public key authentication is the second one.

The second is **argument injection**: attacker-controlled text reaching a program's argument list, where a leading dash turns data into an instruction. It is the same class as the shell-metacharacter bugs of the 1990s, moved one layer along.

Neither required a novel technique. What made this severe is that they sit next to each other in the one service organisations deliberately leave reachable.

## The timeline is tighter than it looked

Fixes shipped in RouterOS **7.25beta3**, **7.24.2**, **7.23.4** and **6.49.21** on **3 September**. Exploitation has been observed since at least **2 September** — so the fix landed a day after attacks began, and the public warning two days after that.

Reporting puts roughly **122,500** routers exposed.

And the account attackers create is named **ops**, which is a more useful thing to search for than the log string below, because it is what appears in the user list rather than in a log the device owner may no longer have.

## The detection surface is one string

The published indicator for compromise is account-creation log entries containing **ssh:-2@**, alongside general advice to look for suspicious accounts.

That is a genuinely useful string and it is also the entire published detection surface. It catches an attacker who created an account and did not clean up. It does not catch one who used existing credentials afterwards, cleared the log, or persisted through a script or scheduler entry instead of an account — and on RouterOS there are several places to persist that are not the user list.

If you find nothing, you have found nothing. On these devices that is worth stating plainly, because the log is on the device the attacker controlled. [The same problem showed up in the HAProxy implant last week](/article/ted-implant-haproxy-2-8-12-not-a-haproxy-vulnerability), where the compromised process was also the one writing the record of what it had done.

## What to do

- **Patch to 6.49.21, 7.23.4 or 7.24.2 or later**, matching your branch. This is the whole mitigation and everything else is a stopgap.
- **Take SSH off the internet regardless.** Management interfaces on edge devices do not belong on the public side, before or after this.
- **Search account-creation logs for ssh:-2@**, and enumerate every account on every device against what you expect to be there.
- **Do not treat a clean log as clearance.** Compare configuration exports against a known-good baseline instead — scheduler entries, scripts, firewall rules, DNS settings and any tunnel configuration you did not create.
- **Check what the router was doing on the network**, not just what is on it. A compromised edge device is useful as a pivot and as a traffic vantage point, and neither leaves an account behind.

## What is not established

- **Which two vulnerabilities form the chain**, or whether CVEs have been assigned.
- **Whether either was a zero-day** at the time of the first observed attacks. That remains unverified.
- **How many devices are compromised**, or how many are exposed. No count has been published.
- **Who is behind it**, or what the routers are being used for.
- **Whether the published indicator is complete.** One string is what has been released; nothing says it is the only artefact.`,
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
