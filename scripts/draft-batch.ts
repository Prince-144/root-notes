/**
 * One-off: saves two researched drafts — one Security, one AI.
 * Same shape the generator writes, so they review identically in the admin.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "../payload-types";

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  // Union from the generated types, so an invalid slug fails here not at runtime.
  categorySlug: Article["categorySlug"];
  tags: string[];
  readingMinutes: number;
  coverImageUrl: string;
  body: string;
};

const DRAFTS: Draft[] = [
  {
    slug: "n-able-n-central-incomplete-patch-cve-2026-18577",
    title: "N-able patched an auth bypass in N-central. The patch was incomplete, and attackers came back through the same door",
    excerpt:
      "CVE-2026-18577 exists because the fix for CVE-2026-18556 didn't finish the job. Both are being exploited, and N-central sits at the top of MSP estates — admin on the server means Take Control access to every endpoint underneath it.",
    categorySlug: "security",
    tags: [
      "n-able",
      "msp",
      "vulnerability",
      "exploitation",
      "cisa-kev",
      "incident-response",
      "threat-intelligence",
      "supply-chain",
    ],
    readingMinutes: 5,
    coverImageUrl:
      "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `The interesting thing about CVE-2026-18577 is not the bug. It's that it exists because the previous fix didn't finish.

N-able patched CVE-2026-18556 (CVSS 8.2), an authentication bypass in N-central. The patch was incomplete. What remained is now tracked as CVE-2026-18577, also CVSS 8.2, also an authentication bypass leading to account takeover — and CISA added it to the Known Exploited Vulnerabilities catalog on **3 August 2026**, with federal agencies given until **6 August** to fix it.

Administrators who applied the first patch and closed the ticket were still exposed.

## Why N-central is the wrong thing to leave open

N-central is remote monitoring and management software, and its customers are largely managed service providers. One N-central server sits above the estates of every client that provider looks after.

That geometry is what turns an 8.2 into a much larger problem than the score suggests. An attacker with administrative access to the server can use N-central's built-in **Take Control** feature — legitimate remote-access functionality, working as designed — to reach the managed endpoints underneath and establish persistence there.

The vulnerability is in one product. The blast radius is every network that product manages.

## What the intrusions actually look like

Huntress observed exploitation across multiple organisations, and the pattern is recognisable:

- reconnaissance aimed at **domain controllers**
- process enumeration, then disconnection
- lateral movement across the environment
- connections using the default **"MSP Support"** username, from 173.249.252[.]200

The indicators worth grepping for:

| Type | Indicator |
| --- | --- |
| File | \`svchost.exe\` in a documents folder |
| Service | A registered service named **Cloudflared** |
| IPs | 173.249.252[.]200, 87.249.138[.]34, 37.19.210[.]32, 68.235.46[.]214 |

Two of those deserve a note. A file called \`svchost.exe\` is unremarkable in \`System32\` and deeply out of place in a documents folder — the name is chosen to survive a glance rather than a search. And **Cloudflared** is Cloudflare's own tunnelling utility: legitimate, signed, and increasingly used by intruders because it establishes outbound connectivity that most egress filtering waves through. The remaining addresses are Mullvad and NordVPN exit nodes, so treat them as disposable rather than attributable.

## What N-able has said

The fix is in **version 2026.3 HF1**.

N-able has acknowledged that a "limited number of customers" were compromised, without putting a figure to it. For MSP software, that phrasing is doing a lot of work — a limited number of N-central customers is not a limited number of affected downstream networks.

## What to do

- **Upgrade to 2026.3 HF1.** If you patched for CVE-2026-18556 and stopped there, you are not covered.
- **Audit Take Control activity**, not just the server. CISA's guidance to federal agencies specifically calls this out, and it is where the damage would be, not on N-central itself.
- **Hunt the indicators on managed endpoints.** The compromise you care about is downstream of the vulnerable box.
- **Check outbound tunnels.** A Cloudflared service nobody deployed is worth treating as an incident until proven otherwise.

The broader lesson is about incomplete patching. A CVE issued for a failed fix is a second chance for anyone who exploited the first one, against a population that has already been told it is protected — which is a worse starting position than never having patched at all.`,
  },
  {
    slug: "langflow-rce-cve-2026-9198-ai-tooling-attack-surface",
    title: "An AI app-builder is being mass-exploited — 650 attempts from 41 countries against one Langflow bug",
    excerpt:
      "CVE-2026-9198 gives unauthenticated remote code execution on default Langflow deployments, and it was patched in July. Telemetry recorded 650 exploitation attempts from 244 IPs before CISA added it to the KEV catalog on 5 August.",
    categorySlug: "ai",
    tags: [
      "langflow",
      "ai-security",
      "vulnerability",
      "exploitation",
      "cisa-kev",
      "llm",
      "agents",
      "open-source",
    ],
    readingMinutes: 5,
    coverImageUrl:
      "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1600&h=900&fit=crop&crop=entropy&q=80",
    body: `The tooling teams use to build AI applications is now a target in its own right, and Langflow is the current demonstration.

CVE-2026-9198 is a code injection flaw carrying a CVSS of **9.8**. It allows an unauthenticated attacker to achieve full remote code execution against a **default** Langflow deployment. No credentials, no misconfiguration required — the out-of-the-box install is the vulnerable one.

CISA added it to the Known Exploited Vulnerabilities catalog on **5 August 2026**, giving federal agencies until **7 August** to remediate.

## This was not a quiet bug

The exploitation volume is the part worth sitting with. KEVIntel telemetry recorded **650 exploitation attempts** beginning **6 July 2026**, from **244 unique attacker IP addresses across 41 countries**.

That is not targeted intrusion. That is internet-wide scanning against a known-good payload, and the shape of it — many sources, one bug, immediate volume — says the exploit was commodity within days.

A patch existed. Langflow fixed this in **version 1.10.1**, released in July 2026. The month between the patch and the KEV listing is the window in which unpatched deployments were being found by people running the scan.

## Why AI tooling keeps ending up here

Langflow is an open-source platform for building AI applications visually. Its purpose is to execute user-defined logic — that is the product, not a side effect. Platforms whose core function is running code someone supplied have a narrower margin between a feature and a vulnerability than most software.

Two things make these deployments unusually attractive:

- **They hold credentials.** An AI app builder is wired into model API keys, vector stores, databases and internal services. RCE on the builder is access to everything it was configured to reach.
- **They get stood up outside change control.** These tools frequently arrive as an experiment on someone's cloud account and become load-bearing without ever entering an asset inventory. Nobody patches what nobody has written down.

## The other one in the same advisory

The same CISA update flagged **CVE-2026-34486** in Apache Tomcat — CVSS 7.5, a missing-encryption flaw allowing a bypass of EncryptInterceptor.

Its history is the uncomfortable part. Tomcat fixed it in **April 2026** (versions 11.0.21, 10.1.54 and 9.0.117). Between late April and early June, China-nexus actors weaponised it against government and commercial infrastructure in **more than 100 countries** to deliver malware tracked as **SNOWLIGHT** — months of operational use before it reached the KEV catalog.

## What to check

- **Langflow: upgrade to 1.10.1 or later**, and treat any internet-exposed instance running an older build as compromised rather than merely vulnerable, given the scanning volume since July.
- **Rotate what the deployment could reach.** Model API keys, database credentials, service tokens. RCE means those were readable.
- **Take the exposure off the internet.** There is rarely a reason for an internal AI-building tool to accept unauthenticated connections from anywhere.
- **Tomcat: confirm you are on 11.0.21 / 10.1.54 / 9.0.117 or later.** An April patch is old enough that "we'll get to it" has already been tested.

Neither of these is an AI safety story in the sense the term usually carries. It is more ordinary and more immediate: the infrastructure being assembled to run AI is software, it ships with the same classes of flaw as everything else, and it is being scanned for right now.`,
  },
];

const payload = await getPayload({ config });

for (const draft of DRAFTS) {
  const { docs: clash } = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
  });

  if (clash.length > 0) {
    console.log(`skip (exists): ${draft.slug}`);
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
