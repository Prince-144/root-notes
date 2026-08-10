/**
 * One-off: gives each article its own cover.
 *
 * Four pairs were sharing an image. In each case the article published first
 * keeps what it had — a cover people have already seen is part of how the
 * piece is recognised — and the later one moves.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const PARAMS = "?w=1600&h=900&fit=crop&crop=entropy&q=80";

const REASSIGN: Record<string, string> = {
  // was sharing with sonicwall-attacks — a network switch suits the MSP/RMM story
  "n-able-n-central-incomplete-patch-cve-2026-18577": "photo-1691435828932-911a7801adfb",
  // was sharing with openai-agent-hacked — server internals for a kernel bug
  "sctphantom-cve-2026-64564-linux-kernel-container-escape": "photo-1614508569207-3295ac89d75f",
  // was sharing with openai-astra — a developer at terminals, for CI tooling
  "claude-code-gemini-cli-ci-secrets-novee-black-hat": "photo-1763128516808-785e80c1dd68",
  // was sharing with dhs-hsin-breach — racks and patching, for a load balancer
  "kemp-loadmaster-cve-2026-8037-escape-quotes-kev": "photo-1629837093109-11325d6e7afd",
  // was sharing with coldcard — a board close-up, for a bootloader flaw
  "u-boot-fit-signature-flaws-binarly-2026": "photo-1592659762303-90081d34b277",
  // was sharing with doj-xai-colorado — an Indian legislative building, not a circuit
  "india-dpdp-enforcement-timeline-november-2026": "photo-1709967884183-7ffa9d168508",
  // was sharing with prompt-injection
  "ai-safety-evaluations-sandbox-escapes-pattern": "photo-1667670778881-537035257bd8",
  // was sharing with anthropic-inference-hooks
  "deepseek-agent-autonomous-attack-jesta-proxyjacking": "photo-1617839625591-e5a789593135",
};

const payload = await getPayload({ config });

for (const [slug, photo] of Object.entries(REASSIGN)) {
  const { docs } = await payload.find({
    collection: "articles",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });

  const doc = docs[0] as any;
  if (!doc) {
    console.log(`skip (not found): ${slug}`);
    continue;
  }

  const next = `https://images.unsplash.com/${photo}${PARAMS}`;
  await payload.update({ collection: "articles", id: doc.id, data: { coverImageUrl: next } });
  console.log(`${slug}\n  -> ${photo}`);
}

// Confirm nothing is shared any more, ignoring the retired seed drafts.
const SEED = new Set([
  "openai-agent-pricing-shakeup", "npm-supply-chain-attack-postmortem",
  "seed-round-drought-2026", "arm-laptops-benchmark-roundup",
  "eu-ai-act-enforcement-begins", "self-hosting-comeback",
]);

const { docs: all } = await payload.find({ collection: "articles", limit: 0, depth: 0 });
const seen = new Map<string, string[]>();
for (const d of all as any[]) {
  if (SEED.has(d.slug)) continue;
  const key = (d.coverImageUrl ?? "(none)").split("?")[0];
  seen.set(key, [...(seen.get(key) ?? []), d.slug]);
}

const stillShared = [...seen.entries()].filter(([, v]) => v.length > 1);
console.log(`\nlive articles: ${[...seen.values()].flat().length}`);
console.log(`distinct covers: ${seen.size}`);
console.log(`still shared: ${stillShared.length}`);
for (const [cover, slugs] of stillShared) console.log(`  ${cover}\n    ${slugs.join("\n    ")}`);

process.exit(0);
