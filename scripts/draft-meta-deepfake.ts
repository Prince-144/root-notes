/**
 * Instagram account takeovers via deepfake + Meta's AI support bot.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Pass --update to rewrite if the draft exists; published articles are skipped.
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
    slug: "instagram-deepfake-selfie-meta-ai-support-bot-takeover",
    title:
      "The deepfake is not the interesting part — Meta's support bot added the attacker's email without asking a human",
    excerpt:
      "Attackers took over Instagram accounts using photos from the target's own public profile, a public deepfake generator and a VPN. Better liveness detection would not have stopped it, because the bot could be talked into the rest.",
    categorySlug: "security",
    tags: [
      "deepfakes",
      "account-takeover",
      "meta",
      "identity-verification",
      "social-engineering",
      "ai-security",
    ],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1637059880830-59a90102de77${P}`,
    body: `Over the weekend of **31 May – 1 June 2026**, attackers took over high-profile Instagram accounts with three things: a **publicly available deepfake video generator**, **photographs taken from the target's own public profile**, and **a VPN subscription**.

The framing going around is that one AI generated a face and another AI accepted it. That is accurate and it stops one step too early. The identity check was not the only control that failed, and it was not the one that mattered most.

## The chain

1. Start a **password-recovery flow** on the target account
2. Choose the **AI support** option
3. Tell the bot to associate a **new email address** with the account, citing the target's username
4. The bot asks for identity verification — the attacker supplies an **AI-generated video** built from photos scraped off the target's public profile, in place of the live selfie the system expected
5. The deepfake passes
6. The attacker then **talks the chatbot into adding a fraudulent recovery email**, and the bot complies **without escalating to a human agent**

Step six is the story.

## Why step six matters more than step four

Suppose Meta ships perfect liveness detection tomorrow. Deepfakes stop passing.

The bot that added a recovery address on request, without escalation, is still there — and that is a control failure that has nothing to do with AI-generated video. Account recovery has always been the soft underbelly of account security, which is why every large platform routes it through humans and delays and out-of-band confirmations.

Replacing that with a conversational agent removes the friction that *was* the control. A human support agent who is asked to add an unfamiliar recovery email to a verified account has an instinct about it. A chatbot optimised for resolving tickets does not.

The Cloud Security Alliance filed this under **AI support bot identity bypass**, which is the right name for it. The deepfake got the attacker to the counter. The bot handed over the keys.

## The technical distinction worth knowing

There are two ways to defeat a face check, and they are not equally hard.

**Presentation attack** — hold a screen, photo or mask in front of the real camera. This is what liveness detection was built to catch, and it catches it reasonably well.

**Injection attack** — never use the camera. Feed video directly into the stream the app reads.

The common method: run the mobile app inside a **desktop emulator**, and the emulator presents the host machine's **virtual camera** as the phone's camera. Add UI automation and one operator can run many attempts in parallel.

Liveness detection is largely irrelevant against injection, because the "liveness" signal is whatever the attacker generated. The check is asking the camera a question and the attacker owns the camera.

## The numbers say this is not new, just newly cheap

| Source | Finding |
| --- | --- |
| **Group-IB**, Weaponized AI (Jan 2026) | **8,065** biometric injection attempts against digital KYC loan onboarding at **one** financial institution, Jan–Aug 2025 |
| **iProov** | Native virtual camera attacks up **2,665%** across 2024 |
| iProov | Face-swap injection up **704%** between H1 and H2 2023 |
| iProov 2026 report | Injection attacks against iOS up **1,151%** in H2 2025 alone; **741%** annual rise |
| One benchmark, early 2024 – early 2026 | Injection attacks up **ninefold** year over year — the fastest-rising vector tracked |

And the price: real-time face-swap, camera injection and voice cloning sold as **fraud-as-a-service for under $50 a month**.

Eight thousand attempts against a *single* bank in eight months tells you this was industrialised in financial fraud well before it reached social media. What changed in 2026 is distribution — the technique moved from specialist fraud rings into Telegram-distributed playbooks aimed at account takeover.

## What we could not verify

The viral version says this has been running **since February** and went mass-scale overnight.

We found documented reporting of the **31 May – 1 June** weekend campaign and nothing establishing a February start date. That does not mean it is wrong — early activity is usually invisible — but treat the timeline as unverified.

"Verified accounts, locked-down accounts, accounts active since 2010" is directionally consistent with reporting that described **high-profile accounts** being targeted. Nobody has published a victim count.

The unsettling part of the target selection is that it inverts the usual advice. An old, verified, well-secured account is a *better* target here, because it has more public photographs to build a face from and it is worth more to steal. Your security hygiene is not what is being attacked.

## What actually protects an account

Ordered by how much difference each one makes against **this specific chain**:

- **Two-factor authentication with an authenticator app or a hardware key**, not SMS. This is the one control that sits outside the recovery conversation entirely.
- **Check your registered email addresses and phone numbers now**, and again after any support interaction. Instagram lists recent account changes under security settings — an unfamiliar recovery email is the first and often only visible sign.
- **Turn on login alerts** and read them. The attacker's email addition generates an account-change notification; the whole campaign depends on nobody looking.
- **Reduce the face material on a public profile** if you are a plausible target. This will not appeal to anyone whose account exists to show their face, which is exactly the tension — the raw material for the attack is the content.
- **Treat any inbound "support" contact as hostile.** Meta does not initiate account recovery with you.

For anyone building verification rather than using it: **liveness detection is not an anti-deepfake control against injection.** The controls that work are device attestation, detecting emulators and virtual cameras, and — the one Meta skipped — keeping a human in the loop for changes to recovery credentials.

## The uncomfortable conclusion

Every platform is replacing support staff with agents right now, and the economics are compelling. This is what the failure mode looks like: a system that verifies identity with a check the attacker controls, and then acts on the result without anyone reviewing it.

We wrote last week about [an AI agent that executed instructions hidden in a log line](/article/ghostjacking-ai-agents-poisoned-logs-cursor-cli). Same shape. The agent was given authority to act, given input it could not authenticate, and had no step where a person looked at the outcome.`,
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
