/**
 * One-off: broadens tagging across the published articles.
 *
 * Tags only earn their keep when they connect pieces — a tag carried by one
 * article is a page that duplicates that article. So the additions here are
 * chosen for overlap as well as accuracy, and every one is grounded in what
 * the piece actually covers rather than added to pad the list.
 *
 * Drafts are left alone: those are the retired seed articles.
 */
import { getPayload } from "payload";
import config from "@payload-config";

/** Same idea spelled two ways splits one tag page into two half-empty ones. */
const CANONICAL: Record<string, string> = {
  "threat-intel": "threat-intelligence",
};

const ADDITIONS: Record<string, string[]> = {
  "memory-shortage-2026-device-prices-ram": [
    "semiconductors",
    "supply-chain",
    "pricing",
    "laptops",
    "smartphones",
  ],
  "zomato-founding-story-rejection-myth": ["founders", "vc", "quick-commerce"],
  "sonicwall-attacks-uta0533-inc-ransomware": [
    "vulnerability",
    "threat-intelligence",
    "credential-theft",
    "edge-devices",
  ],
  "top-trending-cyber-attacks-2026": ["identity", "social-engineering"],
  "anthropic-inference-hooks-enterprise-dlp": [
    "claude",
    "ai-security",
    "compliance",
    "data-protection",
  ],
  "prompt-injection-agentic-ai-five-eyes": [
    "ai-security",
    "llm",
    "autonomous-agents",
    "threat-intelligence",
  ],
  "cisco-fmc-zero-day-cve-2026-20316": [
    "vulnerability",
    "network-security",
    "exploitation",
    "patch-management",
  ],
  "ransomware-surge-july-2026-qilin": ["extortion", "incident-response", "europe"],
  "dhs-hsin-breach-world-cup-false-positive": [
    "data-breach",
    "incident-response",
    "public-sector",
  ],
  "openai-astra-solves-decade-old-math-problems": ["llm", "research", "benchmarks"],
  "openai-agent-hacked-huggingface-autonomous": [
    "vulnerability",
    "zero-day",
    "agents",
    "exploitation",
  ],
};

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "articles",
  where: { status: { equals: "published" } },
  limit: 0,
  depth: 0,
});

const tally = new Map<string, number>();

for (const doc of docs as any[]) {
  const current: string[] = (doc.tags ?? []).map((t: string) => CANONICAL[t] ?? t);
  const merged = [...new Set([...current, ...(ADDITIONS[doc.slug] ?? [])])];

  const changed =
    merged.length !== (doc.tags ?? []).length ||
    merged.some((t, i) => t !== (doc.tags ?? [])[i]);

  if (changed) {
    await payload.update({ collection: "articles", id: doc.id, data: { tags: merged } });
    console.log(`${doc.slug}\n  ${(doc.tags ?? []).length} -> ${merged.length}: ${merged.join(", ")}`);
  }

  for (const t of merged) tally.set(t, (tally.get(t) ?? 0) + 1);
}

const shared = [...tally.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
console.log(`\ntotal distinct tags: ${tally.size}`);
console.log(`tags shared by 2+ articles: ${shared.length}`);
console.log(shared.map(([t, n]) => `  ${n}  ${t}`).join("\n"));

process.exit(0);
