/**
 * Drafts the 17 September batch — written while the database was suspended.
 *
 * The Neon project exceeded its monthly data-transfer quota on 15 September and
 * stays suspended until the allowance resets on 1 October 2026. This batch is
 * held in git until then:
 *
 *   npx tsx scripts/check-drafts-offline.ts scripts/draft-long-78.ts     (now, no database)
 *   npx tsx --env-file=.env.local scripts/draft-long-78.ts                (after 1 October)
 *   npx tsx --env-file=.env.local scripts/draft-long-78.ts --update
 *
 * Unlike earlier batches it exports `drafts` and only touches the database when
 * run directly, so the offline checker can import it. Re-read each story's
 * primary source before inserting: two weeks is long enough for a patch to
 * ship, an attribution to firm up or a claim to be withdrawn.
 *
 *   1. Chrome and Windows exploit chain (security). Volexity, 9 September:
 *      UTA0560 and JungleBamboo used identical code; the V8 bug was fixed in
 *      Chromium's source but not yet in a Chrome release. Follows the earlier
 *      piece on the same CVE's $1,000 bounty. KEV feed: CVE-2026-85046 added
 *      4 September, CVE-2026-85880 on 8 September.
 *   2. Vite, CVE-2026-39364 (security). F5 Labs' campaign analysis, affected
 *      versions from GitHub advisory GHSA-v2wj-q39q-566r rather than F5's
 *      broader branch list.
 *   3. Marimo, CVE-2026-39987 (security). Sysdig Threat Research Team,
 *      11 September: a human operator at machine speed, and the prompt-injection
 *      trap that caught the AI-driven attackers but not this one.
 *
 * Dates used are only those confirmed in a primary source. The day Chrome
 * shipped the V8 fix is left out: secondary reports disagree between 3 and
 * 4 September, and the release post itself could not be read.
 *
 * Quotations are kept short and few; the rest is paraphrased with attribution.
 *
 * Covers checked at full 1600x900 against every cover in a draft script and on
 * the live site's listing pages:
 *   - Chrome chain: browser shortcut icons on a Windows desktop, Chrome centred.
 *   - Vite: a Svelte project open in an editor, the kind of front end Vite serves.
 *   - Marimo: a Linux shell session on a server.
 *   Rejected: Chrome on a phone (the attack is desktop Windows), and a green
 *   "BYPASSING FIREWALL... [SUCCESS]" hacking screen, which is a prop rather
 *   than the subject — this story's whole point is that the attack was real.
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
    slug: "chrome-patch-gap-two-chinese-groups-one-exploit-chain",
    title:
      "Two Chinese groups used the same Chrome exploit chain, and the fix was already in Chromium's source",
    excerpt:
      "Volexity found two China-based groups using identical exploit code against Chrome and Windows: a V8 bug, a sandbox escape and a kernel flaw. The V8 bug had been fixed in Chromium's open-source code but not yet shipped in Chrome, which Volexity calls effectively a zero-day. The phishing began on 1 September.",
    categorySlug: "security",
    tags: ["chrome", "volexity", "uta0560", "junglebamboo", "cve-2026-85046", "cve-2026-85880", "patch-gap", "espionage"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1655196601100-8bfb26cf99e9${P}`,
    body: `**Volexity** published research on **9 September 2026** describing two separate China-based threat actors that used the same exploit chain against **Google Chrome** and **Windows**. One, which Volexity tracks as **UTA0560**, sent phishing to US-based non-governmental organisations. The other, **JungleBamboo**, used the chain to plant a credential-stealing browser extension.

[When this site covered CVE-2026-85046](/article/chrome-v8-zero-day-paid-1000-dollars-published-floor-is-7000), the Chrome flaw at the start of this chain, the point was that it runs code only inside Chrome's sandbox, and an attacker would still need a way out. Volexity found the way out. There were two more flaws behind it.

## The fix existed before the attack did

The Chrome flaw was reported to Google on **4 August**. According to Volexity it was then fixed in Chromium's open-source code, but no Chrome release carried the fix when the attackers used it: an N-day at the source level and, in Volexity's words, **"effectively a zero-day against Google Chrome."** Comments in the exploit date its writing to **27 to 29 August**, and the phishing began on **1 September**.

Volexity calls the gap between those two states a patch gap. Chromium is open source, so a fix can be visible in public code before the update carrying it reaches people's browsers. Anyone reading the change can learn what was broken while most of the people it protects still run the broken version. Volexity does not say how these particular attackers found the bug.

It does look ahead. Volexity assesses with high confidence that patch-gap flaws are becoming a greater risk as language models get better at vulnerability research and exploit development.

CISA added CVE-2026-85046 to its catalogue of exploited vulnerabilities on 4 September. Chrome **152.0.7977.82** and later carry the fix.

## Three flaws in a row

The chain uses **3** flaws in sequence. **CVE-2026-85046**, a type confusion in V8, gives read and write inside V8's own sandbox. **CVE-2026-87491**, in Chrome's WebAssembly handling, escapes that sandbox. **CVE-2026-85880**, in the Windows kernel function RtlpCreateServerAcl, raises privileges so the code can leave Chrome's renderer sandbox and inject itself into the browser process.

The Windows stage is selective. It runs only on Windows 10 versions 1809 to 22H2, Windows Server 2022 and Windows 11 21H2, and Volexity notes that it rejects every build number above 22000. A current Windows 11 installation was never in scope for that step. CISA added the Windows flaw to its exploited list on **8 September**.

## Two groups, one piece of code

Volexity tracks **2** separate clusters using identical exploit code. UTA0560's emails pointed at the genuine website of a US university, where a reflected cross-site scripting flaw bounced visitors on to the attackers' exploit server. JungleBamboo used the same chain and then entirely different tools. Volexity says the exploit **"may have been sold, or otherwise provided"** to different users in China.

It also offers a reason nobody changed the code, with medium confidence: the window before Chrome shipped its fix was short, so both groups used the core exploit as it was rather than spend time adapting it.

## What each group left behind

UTA0560 installed **GRIMWEDGE**, a JavaScript backdoor that surveys the machine, lists and deletes files, runs commands in a hidden window and moves files of up to 5 MB each. Volexity is specific about what it lacks: no persistence, no lateral movement, and no way to take data beyond reading and uploading files.

JungleBamboo's tooling is the more unusual. A loader Volexity calls **SUPERSTOMP** edits Chrome's Secure Preferences file, strips the encrypted integrity hashes that should reveal tampering, and writes values for an older fallback check that Chrome still accepts. On the next restart Chrome regenerates the hashes itself, and the planted extension is trusted. Volexity says that fallback is enabled by default in Chrome releases as of 8 September, and that only building Chromium from source turns it off. [PEEP](/article/peep-forges-chromium-secure-preferences-integrity-values), which this site covered earlier, went after the same protection.

The extension SUPERSTOMP installs, **LONGTALE**, presents itself as Google Gemini. It logs keystrokes without skipping sensitive fields, takes cookies and session tokens, captures screenshots when chosen keywords appear, and sends what it collects roughly every 30 seconds. It accepts 14 remote commands, and Volexity notes that none of them runs arbitrary code.

## What to do

- **Update Chrome to 152.0.7977.82 or later, and restart it.** A downloaded update does not protect a browser that has not been relaunched.
- **Install September's Windows updates**, which cover CVE-2026-85880.
- **Look for an extension presenting itself as Google Gemini with the ID ckiknalbeplpcpofpnabcnhjcegckfei**, and remove it.
- **Treat a link to a trusted site as only as safe as that site's code.** The phishing here led to a genuine university domain.
- **Keep Windows current.** The kernel stage refused every build newer than Windows 11 21H2.

## What is not established

- **How the attackers learned of the V8 bug**, and whether they took it from the public fix.
- **Who supplied the chain** to both groups, if it was supplied at all.
- **Which NGOs were targeted**, and whether any were compromised.
- **When the WebAssembly escape, CVE-2026-87491, reached a Chrome release.** Volexity's post, as reviewed, gives no version.
- **Whether JungleBamboo also went after NGOs**, or other targets entirely.`,
  },
  {
    slug: "vite-cve-2026-39364-query-string-past-deny-list-scanners-want-terraform-state",
    title: "A query string gets past Vite's deny list, and the scanners are asking for Terraform state",
    excerpt:
      "F5 Labs counted 807 attack sessions and about 32,000 requests in August against exposed Vite development servers, hunting for .env files, AWS keys, Azure tokens and Terraform state. CVE-2026-39364 lets a ?raw query read files the server is set to refuse. The servers were never meant to face the internet.",
    categorySlug: "security",
    tags: ["vite", "cve-2026-39364", "f5-labs", "cloud-credentials", "terraform", "aws", "azure", "javascript"],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1593720213428-28a5b9e94613${P}`,
    body: `**F5 Labs** has published research on a mass-scanning campaign against **Vite**, the development server and build tool behind a large share of modern JavaScript front ends. The scanners were not after the applications. They wanted the cloud credentials sitting beside them.

The flaw they lean on, **CVE-2026-39364**, is fixed. The more durable problem is that the servers answering these requests were never meant to be reachable at all.

## One request, no login

Vite's development server is meant to refuse any file listed in its **server.fs.deny** setting, such as .env files and certificates. **CVE-2026-39364** undoes that: add ?raw, ?import&raw or ?import&url&inline to the request, and the server returns the file with a **200** response. It affects Vite 7.1.0 up to 7.3.2, and the 8 branch before 8.0.5, and it needs no authentication.

F5 puts the cost of exploitation plainly: a single unauthenticated HTTP request.

## A development server was never meant to face the internet

Vite listens only on the local machine by default. It reaches the internet when someone passes the --host flag, sets server.host, or maps a container port outward, which F5 describes as development ports **"inadvertently mapped to external interfaces"** in preview and staging environments. A tool built to serve one developer then answers anyone who finds it.

None of that is exotic. Preview deployments, shared staging machines and Docker compose files copied from project to project are exactly where a development setting survives into something public.

## What the scanners asked for

F5 Labs recorded **807** session-grouped attacks and roughly **32,000** raw requests in August 2026. The wordlists ignore the application and go straight for secrets: .env files in five variants, AWS credential files under **10** different home and application directories, Azure access tokens, Terraform and Serverless state files, and /proc/self/environ, a running process's environment variables.

Terraform state is the telling item. A state file records the infrastructure a team has built, and it can hold sensitive values in plain text. Whoever reads one learns what exists, and sometimes has what they need to reach it.

The source addresses sit mostly in Google Cloud ranges, with the largest share of events from the United States at 17,297, then Belgium at 4,407 and the Netherlands at 4,011. Cloud hosting is rented, so those addresses say where the scanning runs, not who runs it.

## Not the first way past this list

F5 lists earlier bypasses of the same protection, **CVE-2025-30208**, **CVE-2025-31125** and **CVE-2024-45811**, which relied on trailing separators and encoding tricks. The requests F5 recorded mix those habits in: paths ending in ?raw?? and directory traversal written as %252f, a slash encoded twice. A server patched against one spelling of the same path may still answer another.

A deny list that matches path strings keeps meeting new ways to write the same path. That is an argument for keeping the server unreachable, not for waiting on the next fix.

## What F5 did not find

F5's write-up documents the scanning, not confirmed thefts. It does not report which servers answered, or whether any credentials were used afterwards. That is worth holding on to before reading 32,000 requests as 32,000 breaches.

## What to do

- **Upgrade Vite** to 7.3.2, 8.0.5 or later.
- **Keep development servers off public interfaces.** Check scripts and configuration for --host and server.host, and audit Docker compose port mappings, Kubernetes ingress rules and cloud security groups, as F5 advises.
- **Block the /@fs/ path at the edge.** F5 recommends a firewall rule that denies any request containing it.
- **If a Vite server was reachable, assume its secrets were read.** Rotate .env values, AWS keys and Azure tokens, and treat Terraform state as exposed.
- **Do not trust User-Agent strings** to wave crawlers through, another of F5's recommendations.
- **Look for the busiest scanning addresses** F5 named: 34.14.15.105, 34.16.200.129 and 34.11.196.206.

## What is not established

- **Whether any credentials were stolen**, or used.
- **Who runs the scanning fleet.** Cloud addresses are rented.
- **How many Vite servers are exposed** on the internet.
- **Which requests exploited CVE-2026-39364 specifically**, as opposed to older bypasses of the same list.`,
  },
  {
    slug: "marimo-cve-2026-39987-human-attacker-eight-seconds-ai-trap-missed",
    title: "Eight seconds to the bastion, by hand, past a trap that caught every AI agent Sysdig had seen",
    excerpt:
      "Sysdig watched an attacker go from a vulnerable Marimo notebook to an SSH login on a bastion host in eight seconds, using scripts written by hand and no sign of an AI model. A prompt-injection trap that every AI-driven attacker Sysdig had profiled on the same flaw fell for, this one read twice and ignored.",
    categorySlug: "security",
    tags: ["marimo", "cve-2026-39987", "sysdig", "aws", "prompt-injection", "ai-agents", "cloud-security", "ssh"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1788790716354-00a65a62bf58${P}`,
    body: `**Sysdig's Threat Research Team** published an account on **11 September 2026** of an attack on **Marimo**, an open-source Python notebook, that moved at the speed people have come to associate with AI agents. There was no agent. Sysdig found no sign of a language model at any stage.

Recent weeks have been full of attacks run by software, [hundreds of AI agents pointed at PaperCut servers](/article/papercut-ai-agents-were-told-to-skip-28-countries-and-hit-six-of-them) among them. This one matters because it removes an easy assumption: that machine speed means a machine.

## A terminal that forgot to ask

The flaw is **CVE-2026-39987**. Marimo's /terminal/ws WebSocket endpoint opens an interactive shell, and it skipped the authentication check the application's other WebSocket endpoints apply, so anyone who connected got a shell as the Marimo process user. It affects versions up to 0.20.4, is fixed in **0.23.0**, and sits on CISA's exploited list with a federal deadline of **7 May 2026**.

Sysdig notes that exploiting it needs no payload and no encoding, only an open connection to that path. Attacks on it began less than ten hours after it was disclosed.

## Eight seconds, in order

At **18:57:22** UTC a fresh WebSocket connection opened. By **18:57:26** a lookup in the application's Redis store had returned an AWS key; the attacker used it to call AWS Secrets Manager, pulled out an SSH private key and wrote it to disk readable only by its owner. At **18:57:30** the bastion host logged the SSH login. Sysdig compares that pace directly to AI-assisted attacks.

In Sysdig's words, **"Eight seconds is the kind of speed we expect to see in AI-assisted attacks."**

## The trap only machines fall for

Sysdig had planted a plain-language instruction in the vulnerable container, written so that an AI agent reading the file would repeat a hidden marker in its own later commands. Every AI-driven operator Sysdig had profiled against this flaw did exactly that. This operator opened the file on **2** separate occasions, read the instruction both times, and never typed the marker.

It is a clever detector, and it detects exactly one thing. A prompt injection works on software that follows the instructions it reads. A person reading the same words sees a planted note and moves on.

## How Sysdig knows it was a person

The session ran about nine hours, from **12:52** to **21:50** UTC, with more than **850** interactive commands. In one 17-minute stretch the operator wrote **8** distinct scripts, each handling errors better than the one before, and the quoting in typed commands varied from session to session. Sysdig found no publicly available offensive tooling, and no evidence of AI use.

The scripts were ordinary Python: boto3 to read from Secrets Manager with a fallback across regions, a reverse shell built only from the standard library, and paramiko to open the SSH connection while detecting the key type.

## Two sets of keys, and one bug

The operator found AWS credentials in **2** places: the environment and credential files on the compromised host, and the application's Redis store. They belonged to different IAM users. When the first set did not lead to the bastion secret, the operator moved to the second.

The attempt at persistence failed on an ordinary mistake. The script tried to add an SSH key through EC2 Instance Connect, but its instance lookup was refused, so the variable meant to hold a real instance ID was never filled, and the script carried on with a placeholder, i-0000000000000000. AWS rejected the malformed ID before it checked any permissions.

## Speed stopped being a tell

Sysdig's conclusion is the part worth keeping. A person with hand-written tools reached the same operational timescale as the AI-driven attackers it has studied, so detection cannot rest on guessing what kind of operator is typing. Its advice is that **"the detection priority is the chain shape, not the shell typing pattern"**: a shell, a credential, a secret and an SSH login, seconds apart.

AI still changes things, Sysdig adds. It lowers the barrier to entry and makes machine speed much easier to reach. But in its view a skilled human still beats an AI-driven operator on evasion and judgement.

## What to do

- **Upgrade Marimo to 0.23.0 or later**, and keep notebook servers off the internet.
- **Restrict the /terminal/ws endpoint** if an upgrade has to wait.
- **Scope the cloud credentials a notebook can reach.** Sysdig's closing advice is that compromising a notebook should not mean compromising the cloud account. A notebook host that can read a bastion's SSH key from Secrets Manager hands over the next hop.
- **Alert on the sequence, not the speed**: a new shell on a notebook host, then within seconds that host's cloud credentials in use, a secret read, and an SSH login somewhere else.
- **Keep prompt-injection canaries if you run them**, but count them as detectors for agents only.

## What is not established

- **Who the operator is.**
- **What happened on the bastion** after the login.
- **Whether the operator recognised the trap**, or simply ignored an odd file.
- **How the Marimo host was found** before the session Sysdig recorded.`,
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
