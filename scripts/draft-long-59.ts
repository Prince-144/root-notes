/**
 * Drafts the 7 September late batch.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-59.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-59.ts --update
 *
 *   1. Telerik RadAsyncUpload. The counterintuitive fact is that the chain
 *      needs an explicit non-default encryption key — a hardening setting
 *      Telerik itself recommends. Written so that does not become "hardening
 *      is bad": AES-CBC without integrity checking is the bug, the key setting
 *      only reaches the code path.
 *   2. Rogue ScreenConnect clients. Not a code execution vulnerability — it
 *      abuses file transfer — so the mitigation is a permission change, and
 *      ConnectWise says a patch is not available yet. The three-bit state
 *      machine that picks a payload per host is the part worth explaining.
 *   3. EtherHiding on the BSC *testnet*, which is the detail the coverage
 *      skips: the testnet is free, so bulletproof hosting costs nothing.
 *
 * No backticks in the bodies: inline code spans inside these template literals
 * break the MDX parse. Paths and identifiers are bold.
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
    slug: "telerik-radasyncupload-the-chain-needs-the-hardening-step",
    title: "The Telerik exploit chain needs the hardening step Telerik recommends",
    excerpt:
      "TantoSec released a working exploit on 7 September for a padding-oracle chain in Telerik's RadAsyncUpload control that ends in unauthenticated code execution. Its precondition is an explicit, non-default encryption key — the setting administrators were told to configure. Roughly 127,000 requests and an hour in a lab.",
    categorySlug: "security",
    tags: ["telerik", "asp-net", "padding-oracle", "deserialization", "cve-2026-13181", "exploit"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6${P}`,
    body: `On **7 September 2026**, TantoSec's **Marcio Almeida** published a working exploit for a four-flaw chain in **RadAsyncUpload**, the file upload control in **Telerik UI for ASP.NET AJAX**. The chain ends in unauthenticated code execution on the web server.

The affected range is **2010.1.309 through 2026.2.519**, fixed in **2026.2.708**. That first version number is from **2010**.

## The four flaws

- **CVE-2026-13181** — a type-resolution flaw, **CVSS 8.1**
- **CVE-2026-13182** — the padding oracle
- **CVE-2026-13183** — a timing-based variant of the same oracle
- **CVE-2026-13184** — a predictable default encryption key

Only the first has a published CVSS.

## How the chain works

The control encrypts client-side upload configuration using **AES-CBC with no integrity checking**. That is the root cause, and everything else follows from it.

Because there is no MAC, an attacker can tamper with the ciphertext and watch how the server reacts. The responses differ depending on whether the tampered data produced valid padding or failed JSON parsing afterwards — two distinguishable outcomes, which is all a padding oracle needs. Given enough queries, the attacker decrypts the configuration and forges a new one **without ever learning the key**.

The forged configuration can name arbitrary **.NET types**, which the control then deserializes **without an allowlist**. That reaches gadgets capable of loading an attacker-supplied DLL, and the uploaded **mixed-mode assembly** runs native code the moment it loads.

Encrypt-then-MAC has been the known-correct construction for two decades. This is what its absence costs.

## The precondition is the hardening step

Here is the part that will be misread, so it is worth being exact.

The exploit does **not** work against a default installation. It needs two things:

1. The RadAsyncUpload control rendered on a page, with a server-side handler that reads upload results
2. An **explicit, non-default encryption key** configured

The second is a hardening measure **Telerik recommends**. Administrators who followed the vendor's own guidance are the ones in scope.

That is not an argument against hardening, and anyone drawing that conclusion has the causality backwards. Setting a key was the right thing to do — the predictable default key is itself CVE-2026-13184. The problem is that the key was put to work in a cipher mode with no integrity check, which means configuring it correctly moves you from one broken state into a different broken state. The lever the vendor gave administrators was never attached to the thing that needed fixing.

If you set that key because you were told to, you did your job. The construction underneath it did not do its.

## 127,000 requests

The end-to-end attack in TantoSec's write-up took roughly **127,000 oracle requests** — about **an hour** against a lab target.

That number is the good news, and it is the most actionable thing in this story.

A padding oracle is not stealthy. It is a hundred and twenty-seven thousand requests to one endpoint, from an attacker who needs every single response. Any rate limiting, any per-endpoint anomaly threshold, any WAF that counts requests rather than inspecting them, changes this from an hour into something impractical — and generates an alert while doing it.

TantoSec explicitly does not know how far rate limiting extends the attack, so treat this as a strong lead rather than a measured mitigation. It is still the cheapest control available to anyone who cannot patch today.

## The disclosure timeline was handled well

- **22 May 2026** — TantoSec reports to Progress
- **8 July** — Progress patches
- **22 July** — CVEs published
- **7 September** — public exploit released

Two months between the patch and the working exploit. That is a defensible interval and worth saying, because the same site will criticise vendors who get this wrong.

There are **no confirmed reports** of these 2026 flaws being exploited in the wild, and none of them is in CISA's KEV catalogue as of 7 September. That will not survive contact with a public CLI tool for long. [Last week's Chrome zero-day is a reminder of how little time there usually is between a working exploit existing and it mattering](/article/chrome-v8-zero-day-paid-1000-dollars-published-floor-is-7000).

## What to do

- **Upgrade to 2026.2.708 or later.** This is the fix and everything below is a stopgap.
- **Find your RadAsyncUpload instances.** The version range starts in 2010; the control is embedded in a great many internal ASP.NET applications nobody has looked at in years.
- **Rate-limit the upload handler.** 127,000 requests is the attack. Something has to count them.
- **Do not remove your encryption key as a mitigation.** The default is CVE-2026-13184. Removing the key does not close the chain, it opens a different one.
- **Alert on repeated malformed upload configurations.** That is what an oracle looks like in a log.

## What is not established

- **CVSS for three of the four CVEs.** Only CVE-2026-13181 has a published score.
- **Real-world exposure.** No count of vulnerable instances has been published.
- **How much rate limiting actually helps.** Explicitly unmeasured.
- **Whether it is being exploited.** No confirmed reports as of 7 September, and a public tool now exists.`,
  },
  {
    slug: "screenconnect-clients-infect-the-hosts-that-connect-to-them",
    title: "The rogue ScreenConnect clients infect the hosts that connect to them",
    excerpt:
      "Huntress found ScreenConnect clients that write a four-stage VBScript chain onto machines as they connect, profile each host, and then request a different payload depending on how much RAM it has and which EDR is installed. There is no code execution vulnerability to patch — it abuses file transfer, and ConnectWise says the fix is to turn the permission off.",
    categorySlug: "security",
    tags: ["screenconnect", "connectwise", "rmm", "huntress", "vbscript", "clickfix", "xmrig"],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3${P}`,
    body: `Huntress has documented three unrelated incidents from **August 2026** involving rogue **ScreenConnect** clients that carry a four-stage VBScript chain and spread it to machines as they connect.

The clients arrive three ways: a **Quick Assist tech-support scam** that talks the user into running the tool, a phishing email carrying **ScreenConnect.ClientSetup.msi**, and a **fake Geek Squad refund form**.

## There is no vulnerability to patch

This is the first thing to be clear about, because it changes what you do this morning.

The propagation abuses **file transfer behaviour** in ScreenConnect sessions — legitimate functionality, working as designed. It is not a code execution flaw, there is no CVE to look up, and no patch exists yet.

ConnectWise's advisory is a **permission change**: disable **TransferFiles** under Administration, Security, Roles, for all session groups, until a patch is available.

If you run ScreenConnect, that is the action. It does not wait for a maintenance window.

## The worm behaviour

A compromised client writes its VBS files to **C:\\Users\\Public\\Libraries\\Default\\Lib\\Lib1**. When that client sees a **new host connect**, the four-stage chain executes on the connecting system.

The operators track **ConnectionIDs** so they do not re-target the same host — and delete the record after disconnect, which means a machine that reconnects gets infected again.

The trust relationship being abused is the one the product exists to create. A support tool's whole purpose is that many machines connect to it and accept what it sends. [This is the third remote-management product in two days to end up in the same place](/article/n-central-cve-2026-86218-unauthenticated-rce-in-the-box-that-manages-the-boxes), and the pattern is not coincidence: the software that legitimately reaches everything is the most useful thing on the network to compromise.

## The three-bit state machine

The chain is worth walking through, because the design is the interesting part.

**1.vbs** profiles the host. It checks system resources — whether RAM is over **5 GB** — and enumerates installed security products: **Cisco AMP, CrowdStrike, Huntress, Malwarebytes, SentinelOne, Sophos, Symantec**. It writes a **three-bit state variable** to **%TEMP%\\value.txt**.

**2.vbs** waits for that file, and if no abort flag is set, downloads a payload from **Dropbox**, decoding it to **%TEMP%\\map.txt**.

**3.vbs** waits for map.txt and downloads a **state-specific** file to **%TEMP%\\out.enc**.

**4.vbs** runs PowerShell to decrypt it into **sys_cache.zip** under the user's AppData Templates directory, and executes **PyTorchFix.ps1**.

What arrives depends on the bits:

| State | Payload |
|---|---|
| 000 / 001 | user-level ScreenConnect backdoor |
| 010 | UAC bypass tooling and persistence |
| 011 | tunnelling utilities and the **XMRig** miner |

Read that table backwards and you have the operator's business logic. A host with EDR and modest resources gets a quiet backdoor or nothing. A host where privilege escalation looks viable gets escalation tooling. A fat, unmonitored machine gets turned into a miner.

That is triage. The malware is doing inventory grading before deciding what the machine is worth, which is the same economic logic [we described in the BraZetsu piece](/article/brazetsu-profiles-your-machine-to-price-it-at-5-dollars-80) — except here the grading happens on the endpoint, before the operator has to spend anything.

The filename **PyTorchFix.ps1** is a small, deliberate touch: it is meant to look like something a developer or an IT team would run.

## Indicators

- **45.13.237[.]190**, resolving tele-sync.opik[.]net
- **131.123.40[.]98** on port 8041
- **borertors92.anondns[.]net**
- Persistence: **WindowsServiceHost.vbs** in the user's AppData directory
- Staging path: **C:\\Users\\Public\\Libraries\\Default\\Lib\\Lib1**
- **%TEMP%\\value.txt**, **map.txt**, **out.enc**

The Dropbox URLs stopped resolving on **2 September**, so those are for retrospective hunting rather than blocking.

## What to do

- **Disable TransferFiles for all session groups now.** There is no patch, and this is the mitigation ConnectWise named.
- **Inventory your ScreenConnect instances**, including ones you did not deploy. Two of the three delivery routes install a client the victim believes is legitimate support software.
- **Hunt the staging path and the temp files.** value.txt, map.txt and out.enc in %TEMP% alongside a Public\\Libraries path is not ambiguous.
- **Search for WindowsServiceHost.vbs** across user AppData.
- **Treat reconnection as re-exposure.** The operators delete their ConnectionID record on disconnect, so a cleaned machine that reconnects to an unclean server is back where it started. Clean the server first.
- **Tell your help desk about the Quick Assist and Geek Squad lures.** The initial access is a conversation, not an exploit.

## What is not established

- **What the 2.vbs Dropbox payload actually was.** The URLs are offline.
- **How widely this spread.** Three incidents have been described; no victim count or sector breakdown has been published.
- **Whether a patch is coming**, or when.
- **Who is running it.** No attribution has been offered.`,
  },
  {
    slug: "etherhiding-on-a-free-testnet-bulletproof-hosting-at-zero-cost",
    title: "The payloads sit on a blockchain testnet, which is free",
    excerpt:
      "Netskope found over 5,400 compromised WordPress and PrestaShop sites pulling their next stage from smart contracts on the BNB Smart Chain testnet. EtherHiding is not new. Putting it on the testnet is, because the testnet costs nothing, behaves like the real chain, and has no abuse desk to write to.",
    categorySlug: "security",
    tags: ["etherhiding", "clickfix", "wordpress", "blockchain", "netskope", "webrtc"],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1603899122361-e99b4f6fecf5${P}`,
    body: `Netskope reported on **5 September 2026** that more than **5,400 compromised websites**, mostly **WordPress** and **PrestaShop**, are injecting scripts that fetch their next stage from smart contracts on the **BNB Smart Chain testnet**.

Around **300** of those sites contact the endpoints on any given day, peaking at **536 daily calls in August**.

## EtherHiding, and the word that matters

**EtherHiding** — storing malicious code or configuration inside a blockchain smart contract — has been around for a while. The technique is not the news.

The word that matters is **testnet**.

A testnet exists for developers. It behaves like the production chain, and it is **free**. No gas costs, no funding, no wallet to top up.

Every property that made EtherHiding attractive on mainnet is present here: the contract is not hosted by anyone you can email, there is no registrar to file with, no host to notify, no takedown to serve, and the operator can rewrite the payload in-contract whenever they like. What the testnet removes is the only thing that was ever a friction — the cost of updating it.

That is bulletproof hosting with a marginal cost of zero, running on infrastructure maintained by the chain's own developers for the benefit of people building software.

There is genuinely very little defenders can do at the source. The realistic control is at the network edge: block or alert on your users' machines and servers reaching blockchain **RPC endpoints** they have no business reaching. For most organisations that is a short list of destinations nobody needs.

## The lure is a fake CAPTCHA

The payload chain ends in **ClickFix**: the compromised page shows a fake CAPTCHA, and tells the visitor to complete verification by pasting a command into the Windows **Run dialog** and pressing Enter.

The reason this pattern keeps working is that it never downloads and executes anything on its own. The user types the command. That routes around a great deal of automated control, and the fake CAPTCHA supplies the reason — everybody has clicked a verification box, and being asked to do one more step to prove you are human does not feel like an attack.

[We covered a variant of this that ran through Windows Terminal](/article/terminalfix-clickfix-windows-terminal-reverse-tunnel); the wrapper changes, the "you are doing this yourself" mechanic does not.

## The stager avoids the other takedown target

The payload has changed over the campaign. It began as ClickFix malware and was later replaced with a **WebRTC data-channel stager**.

The interesting detail is how it establishes the channel. Rather than negotiating through a signalling server the way a legitimate WebRTC application does, the stager **writes its own answer and feeds it straight back into the connection**, standing up an encrypted channel without a handshake against third-party infrastructure.

Put that beside the blockchain hosting and a pattern appears. Both choices remove a thing defenders can seize. No hosting provider for the payload, no signalling server for the channel — the operator has systematically deleted the intermediaries that a takedown normally targets.

## The numbers deserve care

**5,400 compromised sites** and **300 daily active** are different measurements and both are real. The infection footprint is the larger number; the number actually calling home on a given day is much smaller.

Neither tells you how many people saw a fake CAPTCHA, and none of the reporting says how many ran the command. Nobody should convert 5,400 into an implied victim count.

## What to do

- **If you run WordPress or PrestaShop, assume you are in the candidate pool.** The initial compromise method has not been identified, which means nobody can tell you which plugin to check. Update everything and audit for injected script tags.
- **Block outbound access to blockchain RPC endpoints** from workstations and web servers. This is the highest-value control available and almost nobody needs those destinations.
- **Look for script injections that fetch from an RPC URL**, not for a specific domain. The contract address is stable; the fetching code is what is on your site.
- **Alert on Run dialog usage.** ClickFix depends on it, and legitimate use of the Run dialog to paste a long encoded command is close to nonexistent in a managed estate.
- **Teach the fake CAPTCHA specifically.** A real CAPTCHA never asks you to open a dialog and paste something.

## What is not established

- **How the 5,400 sites were compromised.** Not identified.
- **Who is behind it.** No attribution.
- **How many people executed the command.** No figure published.
- **What the WebRTC stager ultimately delivers.**
- **Whether the operators pay anything at all.** No transaction costs have been reported, which is consistent with the testnet being free.`,
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
