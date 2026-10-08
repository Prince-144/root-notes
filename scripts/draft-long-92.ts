/**
 * Drafts the 8 October batch — three stories.
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-92.ts   (no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-92.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-92.ts --update
 *
 *   1. Atlassian CVE-2026-21589 (security). Two hours between watchTowr's
 *      proof of concept and the first attempt in a honeypot. Direct follow-up
 *      to our 7 October piece, which argued the stated limitation was not one.
 *   2. wolfSSH CVE-2026-16516 (security). The host key check ran and passed
 *      on a curve the attacker chose. Carries the precondition the coverage
 *      mostly drops: it needs a lax key-check callback.
 *   3. Kibana CVE-2026-102406 (security). One tenant claims another's data
 *      stream because ownership was never checked, and removing the package
 *      does not undo it.
 *
 * Primary sources: watchTowr's research and Previdian's honeypot timing as
 * reported, the wolfSSH 1.6.0 release and its advisory, and Elastic's
 * ESA-2026-25 security announcement.
 *
 * Covers checked at full 1600x900 and against every cover in the database:
 *   - Atlassian: a dark monitoring console of timestamped rows, which is the
 *     shape of the honeypot data the two-hour figure comes from.
 *   - wolfSSH: a circuit board, which is where this library runs.
 *   - Kibana: a dashboard, which is what the product is.
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
    slug: "atlassian-cve-2026-21589-two-hours-from-proof-of-concept-to-the-first-attempt",
    title:
      "Two hours passed between the proof of concept going public and the first attempt landing in a honeypot",
    excerpt:
      "watchTowr published technical detail and working exploit code for the Atlassian file-read flaw. Previdian's honeypots saw exploitation attempts within two hours. Yesterday we argued the advisory's stated limitation was not one; what has changed since is that nobody even has to work the path out.",
    categorySlug: "security",
    tags: [
      "atlassian",
      "cve-2026-21589",
      "exploitation",
      "proof-of-concept",
      "watchtowr",
      "honeypot",
      "confluence",
      "bitbucket",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1698087908802-baae881e41e6${P}`,
    body: `**watchTowr** published its technical research and a working proof of concept for **CVE-2026-21589**, the unauthenticated file-read flaw in eight Atlassian Data Center products. **Previdian's** honeypot network recorded exploitation attempts **within two hours**.

The flaw scores **9.3**, needs no authentication, and reaches files in the application's web root with a single request. All versions of Bitbucket, Confluence, Jira Software, Jira Service Management, Bamboo, Crowd, Crucible and Fisheye Data Center are affected.

## Two hours

That is the number to carry out of this.

Not two days. Not the next maintenance window. Two hours is shorter than a change-approval process, shorter than a working morning, and shorter than the night that was in progress for most of the people who needed to act.

Set it beside the figure from Microsoft's report: enterprises take [30 to 60 days to remediate critical externally facing vulnerabilities](/article/microsoft-digital-defense-2026-under-a-day-to-weaponise-and-up-to-sixty-to-patch). Those two numbers describe the same event from opposite ends. The gap is not a few days of risk. It is weeks during which the exploit is public, automated and already running against anything reachable.

Nothing about this is specific to Atlassian. It is what publishing a proof of concept for an internet-facing enterprise product now means, and the planning assumption has to move with it: the moment detail becomes public, exposure is immediate rather than imminent.

## What we said two days ago

[Yesterday we wrote about this advisory](/article/atlassian-cve-2026-21589-knowing-the-path-is-not-a-barrier-when-the-vendor-documents-it) and argued with its most-quoted qualifier — that an attacker must know the exact name and path of the file, and cannot enumerate directories.

For bespoke software that is a real constraint. For an off-the-shelf product it is not, because anyone can install a copy and look, and the vendor documents the layout for administrators who need it.

The proof of concept has now removed even that small effort. The paths are in the exploit. The qualifier was never protecting anybody, and it has stopped being even theoretically relevant.

## A read primitive is as serious as what is readable

File read tends to be filed below code execution — information disclosure, a tier down, a lower priority on the board.

The ranking is a habit rather than an analysis. What is in the web root of a Confluence or Bitbucket server is configuration: the credentials the application uses to reach its database, integration tokens, keys. Reporting on the exploitation makes the point directly — what comes out is authentication material, and authentication material is how the next step happens.

So the correct way to read a 9.3 file-read on this class of product is as an unauthenticated credential disclosure with extra steps. The attacker does not need code execution on the Confluence box if the Confluence box hands over the keys to everything it talks to.

## What to do

- Patch now if you have not. Every version of all eight products is affected, so there is no older release to sit on.
- Assume reading, not just scanning. If an instance was internet-facing between 5 October and your patch, treat the contents of its web root as disclosed.
- Rotate on that assumption. Database credentials, integration tokens and any keys in the application configuration, before you finish reading the logs.
- Then read the logs. Requests for specific files in the web root, from addresses with no other history, in the window since the advisory.
- Find the instances nobody owns. Crucible and Fisheye are on this list, and they are exactly the sort of thing that has been running untouched since a migration that finished years ago.

## What is not established

- How many organisations have actually been compromised, as opposed to probed. Honeypot traffic measures attempts.
- Who is behind the attempts, which nothing published attributes.
- Whether any specific data has been taken.
- Whether exploitation predates the public proof of concept, which the honeypot timing cannot answer either way.`,
  },

  {
    slug: "wolfssh-cve-2026-16516-the-host-key-check-passed-on-a-curve-the-attacker-picked",
    title:
      "The host key check ran, and passed, on a curve the attacker chose for it",
    excerpt:
      "wolfSSH never verified that the elliptic curve in a server's host key matched the algorithm both sides had just negotiated. A machine-in-the-middle could swap in a key on a different curve, sign with its own private key, and be accepted with no error. Fixed in 1.6.0 — and it needs one more condition that is common in embedded code.",
    categorySlug: "security",
    tags: [
      "wolfssh",
      "cve-2026-16516",
      "ssh",
      "host-key",
      "ecdsa",
      "machine-in-the-middle",
      "embedded",
      "cryptography",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1651340550839-3b295d930048${P}`,
    body: `**wolfSSH 1.6.0** shipped on **6 October 2026** with fixes for five flaws. The one worth reading about is **CVE-2026-16516**, scored **9**, filed under insufficient verification of data authenticity, and present in everything up to **1.5.0**.

The library did not check that the elliptic curve named in a server's host key matched the algorithm the two sides had just agreed to use.

## What SSH is actually protecting

Everything SSH does against a machine-in-the-middle rests on one step. The client and server negotiate, the server presents a host key, and the client checks that this is the key it expects. If that holds, nobody in the middle can impersonate the server, because nobody in the middle has the matching private key.

Here the check ran. It did not fail. It passed — on the wrong object.

During the key exchange the server sends a reply containing its host key. An attacker sitting in the middle replaces that blob with one declaring a **different curve** from the one negotiated. wolfSSH did not reject the mismatch. It imported the substituted key on the curve the attacker named, verified the signature against it, and found it valid — because the attacker holds that key's private half and signed with it.

No error. No warning. A successful verification of something that was never the server.

From there the attacker is the server: it can read the traffic, inject commands into the session, and pass everything through to the real host so neither end notices.

## The precondition most coverage drops

There is a second condition, and leaving it out makes this sound worse than it is.

The substitution only works if the application's public key check callback is lax. If that callback compares the **full expected key** — the thing a known-hosts file does — the substituted key does not match, and the attack stops there.

So the flaw is not that wolfSSH will accept any server. It is that wolfSSH removed one of the two independent checks, leaving everything resting on the other, and on an implementation detail the library does not control.

That is still a serious finding. Defence in depth means the system survives one layer failing. Here one layer was silently absent for every version up to 1.5.0, and nobody using it knew they were down to a single check.

## Where this lands, and why that is the problem

wolfSSH is an embedded SSH library. It is chosen for small footprint and for running on hardware where OpenSSH will not fit — routers, industrial controllers, point-of-sale terminals, medical and automotive systems.

Two things follow, and together they are the real story.

The first is that a lax key check callback is **more likely** in exactly this software. Distributing and maintaining a known-hosts file across a fleet of devices with no filesystem to speak of, no user to answer a prompt, and a provisioning process that happens once in a factory is genuinely awkward. A callback that accepts the key it is given is the shortcut everyone reaches for, and it is precisely the configuration this flaw requires.

The second is that these devices do not update. A library fix published on 6 October reaches a product when the manufacturer picks it up, cuts a firmware release, and the operator installs it — which for a lot of this hardware means never. The population most exposed to this is the population least able to act on it.

It is the same shape as the Rejetto flaw we covered last week, where [a weak generator and a leaky code path were each harmless and lethal together](/article/rejetto-hfs-cve-2026-61500-math-random-signed-the-session-and-the-login-leaked-the-seed). Cryptographic code fails at the joins, not usually in the mathematics.

## What to do

- Upgrade to wolfSSH 1.6.0. It carries five fixes, not only this one.
- Audit your public key check callback first, because it decides whether you were ever exposed. If it accepts an unknown key, or compares only part of one, fix that regardless of the version you run.
- If you ship hardware, work out which products embed this and what your route to a firmware update is. That answer is more useful than the CVE.
- If you operate equipment you cannot patch, treat its SSH sessions as untrusted on hostile networks and put a layer underneath them.

## What is not established

- Whether this has been exploited. Nothing published says so, and a successful attack here leaves no error behind.
- How many products embed wolfSSH at an affected version.
- How common lax key check callbacks actually are in deployed firmware, which nobody has measured.
- Whether the other four flaws fixed in 1.6.0 are independently serious, which the release does not detail.`,
  },

  {
    slug: "kibana-cve-2026-102406-one-tenant-could-claim-anothers-data-stream",
    title:
      "Kibana let one tenant claim another's data stream, and removing the package does not give it back",
    excerpt:
      "A Kibana user with delegated package-management rights, and no Elasticsearch administrative privileges, could install a package that claimed a data stream identifier already belonging to someone else. Ownership was never checked, so another tenant's telemetry could be redirected through infrastructure the attacker controlled.",
    categorySlug: "security",
    tags: [
      "elastic",
      "kibana",
      "cve-2026-102406",
      "multi-tenancy",
      "authorization-bypass",
      "fleet",
      "observability",
      "log-pipeline",
    ],
    readingMinutes: 5,
    coverImageUrl: `https://images.unsplash.com/photo-1686061593213-98dad7c599b9${P}`,
    body: `**Elastic** published fourteen security advisories across Elasticsearch, Kibana and its agent products. The one that stands out is **CVE-2026-102406**, scored **8.8**, in **Kibana's Fleet** package installation.

It is filed as an authorization bypass through a user-controlled key, which is an accurate and rather dry description of the problem: Fleet let a user name something that already belonged to somebody else, and never checked.

## What the flaw is

A user holding **delegated Fleet package-management privileges** — not an Elasticsearch administrator, just someone allowed to install integrations — could upload a package that claimed a **data stream identifier already in use by another tenant**.

Fleet did not verify ownership of that identifier before applying the package's generated index and ingest-pipeline settings. And it applied them to infrastructure that **already existed**, belonging to the other tenant.

The result is that another tenant's data stream can be routed through configuration the attacker wrote. Elastic's own description of the consequences covers all three directions: the data can be disclosed, it can be tampered with, and it can be stopped from reaching where it was meant to go.

Affected versions run up to **8.19.21**, **9.4.6** and **9.5.3**. The fixes are **8.19.22**, **9.4.7** and **9.5.4**.

## The third consequence is the one that matters

Disclosure and tampering are the obvious harms, and they are the ones a severity score captures.

The third is the interesting one, because of what this product is. Elasticsearch and Kibana are where organisations put their logs — application events, authentication records, network telemetry, the output of their security tooling. A data stream is the pipe that carries it.

An attacker who can redirect that pipe does not only get a copy. They also decide what arrives at the other end. The records that would have shown the intrusion can be read, altered, or simply never delivered — and the dashboards keep rendering, because a data stream that has been quietly re-pointed does not look like an outage.

That is a different class of problem from stealing data. It is a flaw in the instrument you would use to notice you were being attacked.

## Deleting the package does not fix it

The detail with the longest tail is in Elastic's own remediation note: the effect **persists after the malicious package is removed**, and the affected infrastructure needs separate attention.

That follows from how the flaw works. The damage was not done by the package sitting there; it was done by the settings the package wrote onto infrastructure that already existed. Remove the package and those settings stay where they were applied.

We have now written this sentence about three different ecosystems in a fortnight. [The npm packages in the MALFEX campaign were pulled from the registry, which does not uninstall them from anyone's machine](/article/malfex-npm-three-years-37000-downloads-and-three-packages-still-installable). GlassWorm's extensions were delisted with the same non-effect. Here the package can be deleted and the redirection survives it.

Removal is a step in remediation. It keeps being mistaken for the whole of it.

## What to do

- Upgrade Kibana to 8.19.22, 9.4.7 or 9.5.4, and read the other thirteen advisories rather than only this one.
- Review your Fleet integrations and who installed them. The privilege this needs is delegated package management, which organisations hand out precisely because it is not administrative.
- Check your data streams against their expected index and ingest-pipeline settings. Patching stops new claims; it does not revert one already applied.
- Reconsider who holds delegated Fleet rights. This flaw is a reminder that package installation on a shared observability platform is a privileged operation even when the permission model says otherwise.

## What is not established

- Whether it has been exploited. Elastic reports no exploitation.
- How a defender distinguishes a legitimately reconfigured data stream from a hijacked one after the fact.
- Whether a single-tenant deployment is meaningfully exposed, since the described attack turns on crossing a tenant boundary.
- Who found and reported it.`,
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
