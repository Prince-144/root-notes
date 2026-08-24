/**
 * Draft — UAT-10147 and the SPECTRE implant, from Cisco Talos.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Sourcing note: Talos states it did not confirm exploitation of the
 * vulnerabilities its AI scanner found in victim environments, and infers
 * AI-assisted authorship of the rootkit from code style. Both are reported as
 * stated rather than firmed up, because they are the two claims a reader would
 * most want firmed up.
 *
 * Naming note: this SPECTRE is a malware implant and has nothing to do with the
 * 2018 speculative-execution vulnerability. The piece says so, because we
 * published a Cloudflare Spectre story three days ago.
 *
 * Cover note: image downloaded and viewed before use.
 *
 * Pass --update to rewrite an existing draft; published articles are skipped.
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
    slug: "uat-10147-spectre-implant-170000-urls-old-cves",
    title:
      "The AI picked 170,000 targets — every break-in used a bug from years ago",
    excerpt:
      "Cisco Talos found an exposed directory belonging to UAT-10147 and pulled out target lists of roughly 170,000 URLs, AI tooling across the whole attack lifecycle, and a cross-platform implant called SPECTRE that unlinks EDR callbacks in the kernel using two vulnerable drivers from 2019 and 2021.",
    categorySlug: "security",
    tags: [
      "cisco-talos",
      "ai-assisted-attacks",
      "byovd",
      "edr-evasion",
      "rootkits",
      "threat-intel",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1591912046924-b10112411591${P}`,
    body: `**Cisco Talos** has published a two-part report on **UAT-10147**, a Chinese-speaking cybercrime group hitting Windows and Linux web servers.

The research started the way a lot of the best research does — with somebody's mistake. Talos found an **exposed directory** on a server at **139.180.197[.]150** that was talking to compromised machines, and read what was in it.

One quick disambiguation before anything else: the implant is called **SPECTRE**, and it has nothing to do with [the speculative-execution attack we wrote about on Cloudflare Workers](/article/cloudflare-workers-spectre-jwt-12-bits-per-second-mpk). Same word, unrelated things.

## The scale is the AI part

The target lists in that directory held roughly **170,000** URLs, organised into **17** files of about **10,000** each.

Sectors: education, media, technology and gaming. The bulk of the victims sit in **Brazil**, **Bolivia**, **China**, **Canada** and **Vietnam**, with more in the US, India, the UK, Germany and the Netherlands.

That is the shape of the whole story. A hundred and seventy thousand targets is not a list a person compiles and works through. It is a list a machine builds and a machine grinds.

## What "uses AI" means here, precisely

The group runs **Metasploit** and **ysoserial** alongside two AI tools: **PentestGPT**, deployed on its command servers to scan web servers and fire proof-of-concept exploits, and **DeepAudit**, an AI-driven vulnerability scanning framework. Beyond that, **AI-generated Python** handles post-exploitation diagnostics, ViewState deserialization payloads, web shell deployment and traffic obfuscation.

Now the caveat Talos includes and most coverage will drop: it found **no confirmed exploitation** of the vulnerabilities DeepAudit discovered in victim environments.

Read that carefully. The AI scanner ran. Whether anything it found was ever used to break in is not established. So even in a report headlined around AI, the AI's own discoveries are the part that stayed theoretical.

## Every CVE they actually used is old

This is the line to take away.

| Target | CVE | Year |
| --- | --- | --- |
| Zimbra | CVE-2022-27925 | 2022 |
| AjaxPro | CVE-2021-23758 | 2021 |
| Telerik UI for ASP.NET AJAX | CVE-2019-18935 | 2019 |
| Alibaba Nacos | CVE-2021-29441 / 29442 | 2021 |
| Linux privesc | CVE-2022-0847, CVE-2022-0995, CVE-2021-3156 | 2021-22 |
| Linux privesc | CVE-2015-5287, CVE-2015-3246, CVE-2010-3904 | 2010-15 |

Not one zero-day. The Linux privilege escalation set runs back to **CVE-2010-3904**, which is **16 years** old. The AI is doing reconnaissance, targeting, scripting and obfuscation at a scale no team could staff — and then every actual intrusion walks through a door that has had a lock available for years.

That matches what we found in [the five-agency advisory on Siemens PLCs](/article/siemens-s7-plc-ai-written-snap7-tooling-five-agency-advisory) and in [the $99.99 C2 framework with a natural-language front end](/article/redc2-4-npm-packages-llm-red-agent-99-dollars). In all three, AI removes the requirement for expertise or headcount. In none of them does it produce a new way in.

## SPECTRE, and the kernel

The implant is cross-platform: **45** commands on Windows, **29** on Linux.

The Windows build does file operations, keylogging, screenshots, process injection, process hollowing, **Early Bird APC injection**, shell execution and self-deletion. The Linux build adds a kernel module rootkit — reported as **Specter** — for persistent kernel-level control that survives reboots, plus anti-sandbox checks that terminate the malware if its suspicion score passes **50** points.

Talos describes it as a significant evolution in commodity intrusion tooling, and the word doing the work there is **commodity**. This is not bespoke state tooling. It is a general-purpose product.

## How it blinds the EDR

The part that should worry defenders most is deliberate and specific.

SPECTRE runs a **BYOVD** attack — bring your own vulnerable driver — loading two legitimately signed drivers with known flaws: MSI's **RTCore64.sys** (**CVE-2019-16098**) and Dell's **DBUtil_2_3.sys** (**CVE-2021-21551**).

With kernel write access it then performs targeted writes to **unlink EDR callbacks from the kernel's doubly-linked lists**. Not disable the product, not kill the process — remove the notification hooks. The security agent keeps running and simply stops being told about process creation, thread creation and image loads.

Talos names the effect plainly: kernel-callback-dependent products including **CrowdStrike Falcon**, **SentinelOne** and **Microsoft Defender** are rendered completely blind.

An EDR that has been unhooked reports nothing, which looks identical to an environment where nothing is happening. That is the same uncomfortable property as [the Defender driver that deletes Defender before it can defend itself](/article/defender-btr-sys-boot-time-removal-golden-window-no-patch) — the tool you would use to detect the problem is the thing being removed.

## The tell that the rootkit was AI-assisted

Talos suspects the Linux rootkit combines AI-generated code with human expertise, and its evidence is stylistic: **descriptive comments**, **decorative function separators**, and **redundant implementations of the same thing**.

That is inference from code style, not proof, and it should be held as such. It is also a genuinely new category of forensic signal — reading authorship from the shape of the code rather than from strings or infrastructure — and it will get better or be defeated, probably both.

## The exfiltration route

Data leaves through a **legitimate cloud-based configuration management service**. Talos's own framing is that this blends the traffic with normal administrative operations.

Same reasoning as every other campaign this month choosing Cloudflare Workers, Supabase, Pinterest or GitHub Gists: the destination is a service you cannot block, so the traffic is unremarkable by construction.

## What to do

- **Patch the old things first.** Every intrusion here used a public CVE, several of them years old. An asset with Telerik from 2019 on it is the target.
- **Block unsigned and known-vulnerable drivers.** Microsoft's vulnerable driver blocklist covers RTCore64 and DBUtil; make sure it is actually enforced rather than merely available.
- **Monitor for driver loads, not just malware.** A server loading an MSI overclocking driver is the anomaly, and it is legible without knowing anything about SPECTRE.
- **Test that your EDR still reports.** Periodic verification that telemetry is arriving catches unhooking; waiting for an alert does not.
- **Watch for Defender exclusions being added.** It is step three of the documented chain and it is the same move [WMIC was removed for](/article/microsoft-removes-wmic-lolbin-ten-year-deprecation).
- **Treat outbound traffic to SaaS configuration services as worth profiling** on servers that have no reason to use them.

## What is not established

- **Whether the AI-discovered vulnerabilities were ever exploited.** Talos says no confirmation.
- **How many of the 170,000 URLs were actually compromised.** The list is a target list.
- **That the rootkit was AI-generated.** Suspected from code style.
- **Who UAT-10147 works for, if anyone.** Described as a Chinese-speaking cybercrime group; no state link is claimed.`,
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
