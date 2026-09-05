/**
 * Drafts the 5 September batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-53.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-53.ts --update
 *
 * Three pieces, three different failures:
 *
 *   1. Rapid7's "ted" implant, which every headline is calling an HAProxy
 *      backdoor. It is not an HAProxy vulnerability — Rapid7 says installation
 *      needs code execution plus the ability to replace the binary — so the
 *      instinct it provokes (go patch HAProxy) does nothing.
 *   2. The Thomson Reuters C-Track breach, where the sharp fact is sealed
 *      court records and the vendor's statement answers availability.
 *   3. PostgreSQL CVE-2026-6471, twelve years old, turning a privilege most
 *      shops hand to service accounts into code execution as the postgres user.
 *
 * No backticks in the bodies: inline code spans inside these template literals
 * break the MDX parse. Identifiers are bold instead.
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
    slug: "ted-implant-haproxy-2-8-12-not-a-haproxy-vulnerability",
    title: "The backdoor was compiled into HAProxy. That is not an HAProxy vulnerability",
    excerpt:
      "Rapid7 found a Linux implant built into the HAProxy binaries of two South Korean organisations, intercepting traffic and erasing its own requests from the proxy's own logs. Every headline calls it an HAProxy backdoor. Installing it requires already owning the host, which makes patching HAProxy the one response that changes nothing.",
    categorySlug: "security",
    tags: ["haproxy", "linux", "backdoor", "north-korea", "rapid7", "attribution", "detection"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1774799888329-b049c091461e${P}`,
    body: `Rapid7 Labs published findings on **Friday 4 September 2026** on a previously undocumented Linux toolkit found compiled into the HAProxy load balancers of two South Korean organisations, one in automotive and one in media.

The implant calls itself **ted** — the name comes from debug strings left in the binary — and ships alongside a second component Rapid7 tracks as **curlRAT**.

The coverage is calling it an HAProxy backdoor. It is worth being precise about what that does and does not mean, because the phrase points defenders at the wrong action.

## It is not an HAProxy bug

Rapid7 is explicit: this is not a vulnerability in HAProxy. Installing the implant requires two things the attacker must already have — **code execution on the host**, and **the ability to replace the running HAProxy binary**.

So there is no CVE, no advisory, and no patch. If you read the headline and went to upgrade HAProxy, you did something worth doing for other reasons and nothing at all about this.

What it actually is: a decision about **where** to put a backdoor once you are already root. The attacker chose the process that sees every request, terminates every connection and writes the access log. That choice is the story.

## The proxy is also the witness

The implant activates on a request to a specific image path. Once the channel is open the operator can beacon, upload and download files, run shell commands and replace the implant's own configuration.

The part worth sitting with: **the C2 requests are erased from HAProxy's connection counters and from the backend logs**. The proxy is the thing that counts your traffic and writes down what passed through it. Compromise it and you have not just added a listener — you have taken over the record of what happened.

Every detection strategy that starts with "look at the proxy logs" is now reading a document the attacker edits.

## The version pin is the tell

Both victims ran **HAProxy 2.8.12**, released **8 November 2024**. The implant reads HAProxy's internal structures at offsets fixed to that exact build, which is why it works at all — and which means it is welded to a binary the victims had not updated in roughly 21 months.

The 2.8 branch is now at **2.8.28**, released 27 August 2026. Between 2.8.12 and current, HAProxy fixed **529 known bugs**, including **1 critical** and **16 major**.

None of that is the attack. It is the condition the attack depended on. An implant compiled against fixed offsets survives exactly as long as the target does not rebuild, and these targets were not going to.

And the recompiled binary reports an **identical version string** to a clean build. Your inventory tool sees 2.8.12 and moves on.

## Four filters decide who gets the altered page

The implant does not tamper with traffic indiscriminately. A visitor receives a modified page only when the request clears all of:

- a User-Agent header is present
- the URL and referer match the operator's pattern rule
- the client address is whitelisted, by exact match or by /24
- unless an operator key in the **Accept-Language** header overrides the address filter entirely

That last clause is what makes the whole thing usable in the field: the operator can reach the implant from any address by sending the right header. The address whitelist is for everyone else.

Rapid7 also found trojanised **crond**, **sshd**, **agetty**, **atd** and **polkitd** on the hosts, with the sshd variant capturing plaintext passwords. The HAProxy implant is the interesting one; it was not the only one.

curlRAT beacons every **12 hours** by default, or at **30-second** intervals when an operator flags the host, and aborts when it does not find a virtualisation marker. That is the inverse of the usual sandbox check, which aborts when it *does* find one — worth noting as reported rather than explained, because Rapid7 does not say why.

## Attribution: medium confidence, three clusters

Rapid7 attributes the toolkit **with medium confidence** to North Korean state-sponsored actors. Read the components of that assessment:

- a domain list resembling **APT37**
- a delivery model compared to **Lazarus**
- an initial-access hypothesis built on **Kimsuky**, citing ENKI research on a groupware vendor compromised through a mail server flaw

Three different clusters supplying three different parts of one judgment is not three times the confidence. Rapid7 says so itself, noting that overlapping tooling across North Korean clusters complicates precise attribution.

Medium confidence is the number they published. It is the number to repeat. [We have written before about DPRK operations that are easier to describe than to attribute](/article/north-korean-fake-applicants-healthcare-sales-sixty-a-day) — the pattern holds here.

On how the attackers first got in, Rapid7's own words are that the evidence "was not enough to establish a timeline or determine how the attackers first got in". The groupware portal is a hypothesis, and is labelled one.

## The IOCs are for hunting, not blocking

All six C2 domains Rapid7 lists were **NXDOMAIN** when checked on 4 September:

img.monderhouse[.]space, img.smartnords[.]site, img.darklights[.]store, img.responsive.pstatic[.]autos, img.socialteams[.]store, img.worksongo[.]store

Blocking dead domains protects nobody. Search backwards through your resolver logs instead. The file paths are more durable: **~/cache/haproxy-1000.cache**, **/var/lib/sshd/c8c68e629bba773a10ac80012d10bf19**, **/var/lib/snapd/g580** and **/tmp/jasper-log**.

Additional infrastructure appears in maltrail but not on Rapid7's list — primgs[.]lol, grip-cdns[.]space, cleanos[.]online and subdomains — and whether it belongs to the same operation is not established.

## What to do

- **Compare your proxy binary against the package you think you installed.** Hash it against the distribution's, or rebuild and diff. The version string will not help you; it is the same.
- **Stop treating the proxy's own logs as evidence about the proxy.** Log to somewhere the proxy host cannot rewrite, and reconcile counts between the proxy and whatever sits in front of it.
- **Then update HAProxy anyway.** 529 bugs, 1 critical, 16 major. Not because of this implant — because 21 months is 21 months, and [this is the same neglect that makes every other advisory land harder than it should](/article/fake-installers-rename-windows-update-dlls-icacls-defender-exclusions).
- **Check crond, sshd, agetty, atd and polkitd on the same hosts.** The proxy was one of six.
- **Hunt the paths, not the domains.**

## What is not established

- **How the attackers got in.** Rapid7 says the evidence does not support a conclusion.
- **When.** No timeline was established.
- **Whether other HAProxy 2.8 builds are affected.** The offsets are pinned to 2.8.12; whether the operators maintain builds for other versions is unknown.
- **Whether the additional maltrail infrastructure is the same operation.**
- **Detection.** No rules have been published, and the trojanised binary is version-identical to a clean one.`,
  },
  {
    slug: "c-track-sealed-records-order-did-not-travel-with-the-backup",
    title: "A court seals a record by order. The order did not travel with the backup copy",
    excerpt:
      "West Publishing says an intruder sat in Thomson Reuters' cloud from 1 March to 29 June, and that confidential, redacted or sealed court information may have been affected. Thomson Reuters' reassurance is that C-Track had no operational disruption and is safe to keep using — which answers a question nobody asked.",
    categorySlug: "security",
    tags: ["thomson-reuters", "breach", "courts", "third-party-risk", "sealed-records", "disclosure"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1590247813693-5541d1c609fd${P}`,
    body: `On **2 September 2026**, West Publishing Corporation — the Thomson Reuters unit behind the **C-Track** court case management platform — issued a breach notice covering courts in a dozen US jurisdictions, the US Virgin Islands and three courts in Ontario.

The dates are the first thing to read. Unauthorised access ran from **1 March to 29 June 2026**. West Publishing discovered it on **30 June**. The notice went out on **2 September**.

That is roughly **120 days** inside before anyone noticed, and another **64 days** between noticing and telling anyone.

## What the notice says was taken

In the notice's own words, the records could contain "names along with one or more of the following: Social Security numbers, driver's license numbers, medical information, dates of birth, and health insurance information."

And then the sentence that makes this different from the week's other breaches:

**"Confidential, redacted, or sealed court information may also have been affected."**

## Credit monitoring cannot re-seal a record

West Publishing is offering **12 months** of credit monitoring — Experian IdentityWorks in the US, TransUnion myTrueIdentity in Canada — with enrolment open until **31 December 2026** and a hotline on 1-833-918-5294.

For the Social Security numbers, that is the standard remedy and it is fine as far as it goes.

For the sealed records it is not a remedy at all. A court seals a record by **order**: to protect a domestic violence complainant's address, an informant's identity, a juvenile's history, a defendant whose charges were dropped. The seal is a legal instrument enforced against people who can be reached by a court. It has no effect on a copy in someone else's hands.

You can freeze a credit file. You cannot un-disclose an address that a court ordered withheld, and no amount of monitoring tells you whether it has been used.

The exact scope of the sealed material has not been published.

## Two courts describe two different things

Here the public record disagrees with itself, and it is worth naming rather than smoothing over.

**Montana's** court statement describes the intrusion as reaching **backup data stored on Thomson Reuters servers, drawn from database copies supplied to Thomson Reuters for the purpose of troubleshooting the applications.**

**Ohio** reported the breach occurred on **the production platform itself**.

Those are not the same incident description. They may both be true — a single cloud environment can hold production data for one customer and troubleshooting copies for another — but nobody has said so, and the difference matters enormously for any given court trying to work out what of theirs was exposed.

If Montana's characterisation is the general case, the sharper problem is the copy: a database handed to a vendor to debug an application is a full-fidelity duplicate that exists outside whatever controls the court applies to production, retained for as long as the ticket stayed open and possibly longer. [We keep arriving at the same shape from different directions](/article/dropbox-lenovo-id-federated-trust-no-password-needed) — the thing that gets breached is rarely the system anybody drew on the architecture diagram.

## The list disagrees with itself too

Named in the notice: Alabama appellate courts, Kentucky appellate courts, the Montana Supreme Court, Nevada appellate courts, the New Hampshire Supreme Court, the North Dakota Supreme Court, Ohio's district courts of appeals (First through Twelfth), multiple Pennsylvania courts, South Carolina's Supreme Court and Court of Appeals, the Tennessee Appellate Court Clerk's Office, the entire Wyoming judicial branch, the US Virgin Islands Supreme and Superior Courts, and the Court of Appeal for Ontario, Ontario Superior Court of Justice and Ontario Court of Justice.

Two things about that list.

**Oregon's appellate courts** were confirmed separately rather than in the notice. **Minnesota** reported exposure despite not appearing in it at all. Different outlets have counted 11 states and 12 states from the same document.

A notice that jurisdictions have to correct by hand is a notice that is still being assembled in public. If your court is not on it, that is not yet evidence of anything.

The other thing: this is overwhelmingly **appellate** courts and state supreme courts. Appellate records carry the full trial history — the sealed exhibits, the suppressed evidence, the sentencing material — which is the part of the file that was never meant to be read outside the courtroom.

## What Thomson Reuters chose to say

The company's public reassurance is that there has been "no operational disruption to C-Track as a result of this incident" and that it considers the platform "safe to keep using". It says it has found no evidence of fraud or misuse.

Both statements are probably accurate. Neither is responsive.

Nobody asked whether the docket system stayed up. The incident is a confidentiality failure, and "no operational disruption" is an availability answer. "No evidence of misuse" is the standard formula, and for sealed records misuse does not look like a fraudulent credit application — it looks like a name reaching a person who was ordered not to have it, and it generates no evidence at all.

Several affected courts have terminated Thomson Reuters' access. North Dakota has confirmed an active criminal investigation.

## What to do

- **If you are a court on that list, treat the sealed material as a separate incident.** The identity-theft response and the sealed-records response are different problems with different affected people and different legal obligations.
- **If you are a court not on the list, ask anyway.** Minnesota and Oregon are the reason.
- **Inventory the copies, not the systems.** Ask every vendor what production data they hold outside production, why, and when it gets deleted. Montana's description is the entire lesson.
- **If you were a party to a sealed proceeding, you will not be told directly.** No individual notification scheme covers "the fact of your sealing may be known".
- **Enrolment closes 31 December 2026.** That is a real deadline on the one remedy actually offered.

## What is not established

- **How the intruder got in.** Not stated.
- **Who.** Not stated, and under active investigation.
- **How many people.** No total has been published.
- **Which sealed records, and how many.** The notice says the category was affected and does not scope it.
- **Whether Montana's description or Ohio's applies to any given court.**`,
  },
  {
    slug: "postgresql-cve-2026-6471-replication-was-never-read-only",
    title: "REPLICATION was never a read-only privilege. For twelve years it was a shell",
    excerpt:
      "CVE-2026-6471 lets any account holding PostgreSQL's REPLICATION attribute load an arbitrary library as a logical decoding plugin and run code as the postgres user. It has been there since logical decoding shipped in 9.4 in 2014, and REPLICATION is the privilege every CDC pipeline in your estate already has.",
    categorySlug: "security",
    tags: ["postgresql", "cve-2026-6471", "privilege-escalation", "databases", "replication", "patching"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1762144525323-68615d50484e${P}`,
    body: `PostgreSQL shipped the fix on **13 August 2026**. Cyera published the technical detail on **1 September**, naming it **PostGREShell**. The gap between those two dates is what responsible disclosure is supposed to look like, and it is worth saying so before the criticism starts.

The flaw is **CVE-2026-6471**, and the project's own summary is admirably blunt:

> Missing authorization in PostgreSQL logical decoding allows a non-superuser holding REPLICATION privilege to dlopen any file visible to the operating system account running the server, via the choice of logical decoding plugin. This in turn runs arbitrary code as that account.

Versions before **18.6**, **17.11**, **16.15**, **15.19** and **14.24** are affected. It has been present since logical decoding arrived in **PostgreSQL 9.4, in 2014** — around **12 years**.

## What actually goes wrong

PostgreSQL already restricts where libraries can be loaded from. The ordinary **LOAD** command enforces a path restriction, and that restriction works.

The replication protocol parser is a second door into the same machinery, and it accepts what the first door rejects: path separators and directory traversal sequences. Point a logical decoding plugin at a path outside the plugin directory and PostgreSQL will dlopen it.

The result is arbitrary code running as the operating system account that runs the server — normally the **postgres** user. Cyera's proof of concept went from there to modifying the role catalogue to grant itself superuser, and established three persistence mechanisms that survive a server restart.

So the protection existed. It was just attached to one of two paths that reach the same function, and nobody checked the other one for twelve years.

## Two preconditions, and you should state both

This is where reporting will go wrong, so let us be exact.

Exploitation requires:

1. an account carrying the **REPLICATION** attribute, and
2. the server running with **wal_level = logical**

This is a **post-authentication privilege escalation**. It is not a pre-auth remote code execution, and any headline that says "PostgreSQL server takeover" without the second half of the sentence is describing the impact while hiding the precondition.

PostgreSQL's own CVSS reflects that honestly: **7.2**, with the vector **AV:N/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:H**. Note **PR:H** — privileges required, High.

## But PR:H is doing a lot of work

Here is why the score understates the practical exposure, and this is the actual story.

**REPLICATION is not superuser, and that is exactly why it gets handed out.** It reads as a narrow, plumbing-level grant. In a normal estate it is held by:

- logical replica connections
- backup tooling
- change-data-capture pipelines — Debezium, Fivetran, Airbyte and everything that follows the write-ahead log
- managed-service connectors and analytics sync jobs
- whatever a platform team set up years ago and nobody has audited since

Every one of those is an account, usually with credentials in a config file or a CI secret store, usually not treated as an administrative principal, often shared. **PR:H** describes the privilege level. It does not describe how many hands hold it.

And **wal_level = logical** is not an exotic setting. If you run any CDC at all, it is on.

## Windows is the easy case

The exploitation path is materially different by platform, and this is worth knowing before you rank your fleet.

On **Windows**, an attacker can fetch the library over **SMB** from a machine they control. No file-write on the database host needed — just outbound 445 and a UNC path.

On **Linux and macOS**, they need somewhere to put the file first: existing file-write capability on the host, or NFS automounting enabled.

That difference is the whole risk assessment. A Windows PostgreSQL host with outbound SMB allowed and a CDC account in use is a materially worse position than the same setup on Linux.

## The fix does not finish by itself

The patch introduces a new server parameter, **output_plugin_libraries**, which whitelists what may be loaded as a logical decoding output plugin. It defaults to **pgoutput, test_decoding**.

If you use any non-default output plugin — **wal2json** is the common one — the default whitelist will not include it, and your replication will break on restart until you add it. Update, set the parameter, then restart, in that order.

This is the second time in a week that a patch has needed a step after installation to actually help. [The Switchvox fix had the same shape](/article/switchvox-cve-2026-9586-patch-does-not-rotate-the-signing-key): shipping the update is not the same as being finished.

## What to do

- **Patch to 18.6, 17.11, 16.15, 15.19 or 14.24.** Then set **output_plugin_libraries** for any non-default plugin before you restart.
- **Enumerate who holds REPLICATION right now.** Query **pg_roles** for **rolreplication**. Most estates will find accounts nobody can account for.
- **Strip it from anything that does not need it.** This is the mitigation with the longest shelf life; the next flaw in this area will need the same privilege.
- **Restrict replication entries in pg_hba.conf to known addresses.** REPLICATION plus an open host rule is the combination that matters.
- **Block outbound SMB (445) and NFS (2049) from database servers**, and disable autofs where it is not needed. On Windows especially, that outbound path is the exploit.
- **Rank Windows hosts first.**

Worth noting alongside this: [two of the seven flaws CISA added to KEV this week were improper authentication in infrastructure nobody files under security software](/article/kev-seven-additions-litellm-starlette-fail-open-auth). The database is in that category too.

## What is not established

- **In-the-wild exploitation.** None confirmed as of 4 September, and CVE-2026-6471 is not in CISA's KEV catalogue.
- **How the two doors diverged.** Nothing published explains why the replication parser skipped the LOAD path restriction in 2014.
- **Whether any of the three persistence mechanisms in Cyera's PoC have been seen outside the lab.**
- **Whether managed PostgreSQL services are patched.** Every provider is on its own schedule and most have not said.

Credited discovery: Vladimir Tokarev and Yu Kunpeng.`,
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
