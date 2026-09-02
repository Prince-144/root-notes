/**
 * Drafts the Forescout AI-assisted PLC exploit-porting piece.
 *
 *   npx tsx --env-file=.env.local scripts/draft-long-43.ts
 *   npx tsx --env-file=.env.local scripts/draft-long-43.ts --update
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
    slug: "claude-ported-plc-exploit-8-hours-536-dollars-forescout",
    title:
      "An AI ported a PLC exploit in 8 hours for $536. The researchers say they would have been faster on their own",
    excerpt:
      "Forescout gave Claude a terminal, Ghidra and a live industrial controller, and it adapted a pre-auth RCE from one WAGO model to another. It also bricked the device. The lab's own conclusion is that a human would have done it quicker and cheaper today — which makes the finding a statement about a slope, not a capability.",
    categorySlug: "security",
    tags: [
      "forescout",
      "plc",
      "ics",
      "wago",
      "ai-assisted-attacks",
      "nucleus",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1780034766312-73825064806c${P}`,
    body: `**Forescout's Vedere Labs** gave **Claude Code** a terminal, the reverse-engineering tool **Ghidra**, a firmware image and a physical industrial controller, and asked it to move a working exploit from one programmable logic controller to a different model.

It worked. That is the headline everyone will run, and it is the least interesting sentence in the report.

## What was actually done

The target is **CVE-2021-31886**, a stack-based buffer overflow in the FTP server of Siemens' **Nucleus** real-time operating system. The FTP server does not check the length of the username supplied to the **USER** command. It is **pre-authentication**, reachable on **TCP port 21**, and carries a CVSS of **9.8**.

A working exploit already existed for the **WAGO 750-852**. The researchers asked Claude to make it work against the **WAGO 750-831** running firmware **V01.04.16** — same bug, same stack, different device.

The obstacle was specific and real. On the 750-831, the firmware **zeroes 256 bytes** at the attacker-controlled buffer, wiping the shellcode before it can run. Claude's answer was to change the FTP command sequence from **USER/QUIT** to **USER/CWD** and then **omit the CRLF terminator**, so the processing path that does the zeroing never completes and the payload survives.

That is a genuinely non-obvious piece of work. It is also, in the end, the kind of thing a competent exploit developer does on a Tuesday.

## The numbers the researchers published

- **8 hours 32 minutes** and **$535.74** in API usage to reach remote code execution.
- Progress stalled on **Claude Sonnet 4.6**; the work completed after switching to **Claude Opus 4.6**.
- Once execution was established, the model went from NOP sleds to **two working payloads in 12 minutes** — an ICMP echo to an attacker host, and a UDP packet containing the string "PWNED".
- **Sustained researcher steering** throughout. It was not autonomous.

Publishing the cost and the failed model attempt is worth crediting. Most write-ups in this genre report the win and omit the meter.

## The lab's own verdict

This is the part to read twice, because it is the opposite of the framing the story will attract:

> One could argue that the [researcher guiding the AI] could have achieved the initial RCE port without AI in less time and at lower cost while also keeping the PLC alive. That is true right now, but the more important question is what happens as the amount of expert intervention required continues to fall.

Today, the AI made this **slower and more expensive** than the expert supervising it. The researchers say so themselves.

Their actual claim is narrower and much more serious: humans can parallelise this work, but AI "has the potential to reduce the marginal cost of doing so **across many related targets at once**".

That is a statement about a slope, not a capability. It deserves to be reported as one.

## Why porting is the task that matters

The marginal-cost argument has a concrete denominator here, and it is why this particular demo was chosen.

Nucleus is not one product. When Forescout disclosed **NUCLEUS:13** on **9 November 2021** — thirteen flaws in the Nucleus NET TCP/IP stack, this CVE among them — the stack was described as shipping in over **three billion devices**, across Siemens' **APOGEE**, **Desigo**, **TALON** and **Nucleus ReadyStart** families and far beyond. Forescout's own scanning at the time found **1,169** internet-exposed devices running the Nucleus FTP server, and roughly **5,500** devices from **16 vendors** across **127** customers in its own telemetry.

One bug, one stack, many vendors, many models — and each model needs its own port because the memory layout differs. That is exactly the shape of repetitive expert work where a cost reduction compounds. The demo is not "AI can find bugs". It is "AI might make the boring part cheap".

## It bricked the device

In a later session aimed at building command-and-control capability, one of the payloads wrote to a region mapped to the PLC's **flash memory** and **permanently bricked** the controller.

Sit with that for a second in an OT context. This was a lab bench with a spare device. The same mistake against a controller running something — a turbine, a pump, a production line — is not a failed experiment, it is an outage, and possibly a safety event.

There is a reason [an industrial process that stopped in Poland took four days to restart](/article/polish-chp-plant-private-apn-wago-turbine-shutdown). Physical processes do not roll back.

The lesson is not about Claude specifically. It is that handing any autonomous agent write access to live industrial hardware includes the risk of destroying it, and that risk does not announce itself in advance.

## What it could and could not do

The working payloads run in the **Ethernet receive callback context**, and the demonstrated capability stops at sending network packets. An ICMP echo and a UDP string are proof of execution, not control of a process. The gap between "code runs" and "I can manipulate the physical output" was not crossed here.

Claude also flagged something the researchers did not ask for: a possible **second, previously unidentified flaw** in the FTP command extraction loop, distinct from CVE-2021-31886. Manual review suggested it may be real. It has **no CVE** and needs separate work — so treat it as an open thread, not a finding.

## The unpatched part is the actual problem

Strip out the AI and this is the story: a **CVSS 9.8 pre-authentication remote code execution flaw, disclosed in 2021, still has no fix** for this controller in 2026. CERT@VDE's advisory states plainly that there are no updates available for this version.

We checked the **CISA KEV** catalogue — 1,687 entries as of **1 September 2026** — and CVE-2021-31886 is **not** in it. Neither is any other Nucleus or WAGO entry. There is no public evidence of this being exploited in the wild. The exposure is latent, not active, and that distinction matters when you are prioritising.

But "no patch will ever come" is a different situation from "patch not yet applied", and it is the situation a lot of OT is actually in. This is the same category of problem as [the flaws CISA calls unforgivable because they have been exploited since 2007](/article/cisa-most-exploited-flaws-unforgivable-since-2007) — except here there is nothing to apply.

## What to do

- **Disable FTP on port 21** on affected controllers. It is the vendor and CERT@VDE recommendation, and for most deployments the service is not needed.
- **Segment.** If the exposure cannot be patched, the answer is that it should not be reachable. [The Minnesota water-utility incidents needed no exploit at all](/article/minnesota-water-plc-attacks-no-exploit-needed) — reachability was the vulnerability.
- **Inventory by stack, not by vendor.** A Nucleus flaw crosses brand boundaries; an asset list organised by manufacturer will miss it.
- **Treat "no fix available" as an architectural decision**, not a ticket. It does not age out of the backlog.
- **Do not give an agent write access to production hardware.** The bricking in this research was on a bench. Yours would not be.

## What is not established

- **Whether the technique generalises.** One port, between two models of one product line, with an expert steering it throughout.
- **Whether the cost falls.** The marginal-cost argument is a forecast. Nothing in this experiment measures it.
- **Whether the second suspected flaw is real.** Flagged by the model, plausible on manual review, unconfirmed and uncredentialed.
- **Any in-the-wild exploitation** of CVE-2021-31886. None reported, and it is absent from KEV.
- **What WAGO says.** No vendor response is reported beyond the CERT@VDE advisory stating no updates exist.`,
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
