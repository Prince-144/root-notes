import crypto from "crypto";
import { getPayload } from "payload";
import { Resend } from "resend";
import config from "@payload-config";
import { siteConfig } from "@/site.config";
import { getArticles } from "@/lib/articles";

function resendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

/**
 * Sends, and says whether it actually sent.
 *
 * resend.emails.send() does not throw when the API rejects a message — it
 * resolves with { data: null, error }. Every call site here used to await it
 * and discard the result, so a rejected send was indistinguishable from a
 * delivered one: subscribers got "Check your inbox to confirm", the logs said
 * nothing, and not one of the six addresses in the table had confirmed since
 * August because none of them had ever received the email.
 *
 * The failure that was hiding behind it: the sender was onboarding@resend.dev,
 * Resend's shared testing address, which may only send to the account owner
 * — so every other recipient was rejected with a validation error.
 */
async function send(
  resend: Resend,
  message: { from: string; to: string; subject: string; html: string },
): Promise<boolean> {
  const { error } = await resend.emails.send(message);
  if (error) {
    console.error(
      `[newsletter] send to ${message.to} failed: ${error.name} ${error.statusCode ?? ""} ${error.message}`,
    );
    return false;
  }
  return true;
}

const RESEND_COOLDOWN_MS = 60_000;

/**
 * One reply for every outcome — already subscribed, newly created, or held
 * back by the cooldown.
 *
 * Returning "You're already subscribed." for a known address and something
 * else for an unknown one turned this endpoint into a subscriber checker:
 * post an address, read the message, learn whether that person reads Root
 * Notes. Nobody has to be told which branch they hit, so nobody is.
 */
const NEUTRAL_REPLY = { ok: true, message: "Check your inbox to confirm." } as const;

export async function subscribe(email: string): Promise<{ ok: boolean; message: string }> {
  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "subscribers",
    where: { email: { equals: email } },
    limit: 1,
  });

  let token: string;
  if (existing.docs.length > 0) {
    const doc = existing.docs[0];
    if (doc.confirmed) {
      return { ...NEUTRAL_REPLY };
    }
    // Without this, repeatedly POSTing someone else's email address would
    // email-bomb them with confirmation emails on every request.
    const msSinceLastSend = Date.now() - Date.parse(doc.updatedAt);
    if (msSinceLastSend < RESEND_COOLDOWN_MS) {
      return { ...NEUTRAL_REPLY };
    }
    token = doc.confirmToken;
    // Touch the doc so updatedAt resets the cooldown window for next time.
    await payload.update({
      collection: "subscribers",
      id: doc.id,
      data: { confirmToken: token },
    });
  } else {
    token = crypto.randomBytes(24).toString("hex");
    await payload.create({
      collection: "subscribers",
      data: {
        email,
        confirmToken: token,
        confirmed: false,
        subscribedAt: new Date().toISOString(),
      },
    });
  }

  const confirmUrl = `${siteConfig.url}/api/newsletter/confirm?token=${token}`;
  const unsubscribeUrl = `${siteConfig.url}/api/newsletter/unsubscribe?token=${token}`;
  const resend = resendClient();

  if (resend) {
    const ok = await send(resend, {
      // Must be an address on a domain verified in Resend. The default here
      // only reaches the account owner, which is why nobody else ever got one.
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to: email,
      subject: `Confirm your ${siteConfig.name} subscription`,
      html: `<p>One click to confirm your subscription to ${siteConfig.name}:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p><p style="color:#888;font-size:12px">Didn't request this? Ignore this email, or <a href="${unsubscribeUrl}">unsubscribe</a>.</p>`,
    });

    // Telling someone to check an inbox nothing was sent to is how this went
    // unnoticed for two months. The message is the same whoever asks, so it
    // still says nothing about whether the address was already on the list.
    if (!ok) {
      return { ok: false, message: "We could not send the confirmation email. Please try again shortly." };
    }
  } else {
    console.warn(
      `[newsletter] RESEND_API_KEY not set — would have emailed ${email}. Confirm link: ${confirmUrl}`,
    );
  }

  return { ...NEUTRAL_REPLY };
}

export async function confirmSubscription(token: string): Promise<boolean> {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "subscribers",
    where: { confirmToken: { equals: token } },
    limit: 1,
  });

  const doc = result.docs[0];
  if (!doc) return false;

  await payload.update({
    collection: "subscribers",
    id: doc.id,
    data: { confirmed: true },
  });

  return true;
}

export async function unsubscribe(token: string): Promise<boolean> {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "subscribers",
    where: { confirmToken: { equals: token } },
    limit: 1,
  });

  const doc = result.docs[0];
  if (!doc) return false;

  await payload.update({
    collection: "subscribers",
    id: doc.id,
    data: { unsubscribedAt: new Date().toISOString() },
  });

  return true;
}

/** Called by the daily cron (app/(frontend)/api/cron/daily-digest). */
export async function sendDailyDigest(): Promise<{
  sent: number;
  articleCount: number;
  note: string;
}> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const newArticles = (await getArticles()).filter((a) => a.publishedAt >= since);

  if (newArticles.length === 0) {
    return { sent: 0, articleCount: 0, note: "no articles published in the last 24h" };
  }

  const payload = await getPayload({ config });
  const { docs: subscribers } = await payload.find({
    collection: "subscribers",
    where: {
      confirmed: { equals: true },
      unsubscribedAt: { exists: false },
    },
    limit: 0,
  });

  if (subscribers.length === 0) {
    return { sent: 0, articleCount: newArticles.length, note: "no confirmed subscribers" };
  }

  const resend = resendClient();
  if (!resend) {
    console.warn(
      `[newsletter] RESEND_API_KEY not set — would have sent a ${newArticles.length}-story digest to ${subscribers.length} subscriber(s).`,
    );
    return { sent: 0, articleCount: newArticles.length, note: "RESEND_API_KEY not set" };
  }

  const itemsHtml = newArticles
    .map(
      (a) =>
        `<li style="margin-bottom:18px"><a href="${siteConfig.url}/article/${a.slug}" style="font-weight:600;color:#111;text-decoration:none">${a.title}</a><br/><span style="color:#666;font-size:14px;line-height:1.5">${a.excerpt}</span></li>`,
    )
    .join("");

  let sent = 0;
  let failed = 0;
  for (const sub of subscribers) {
    const unsubscribeUrl = `${siteConfig.url}/api/newsletter/unsubscribe?token=${sub.confirmToken}`;
    const ok = await send(resend, {
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to: sub.email,
      subject: `${siteConfig.name} — ${newArticles.length} new ${newArticles.length === 1 ? "story" : "stories"} today`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="margin-bottom:2px">${siteConfig.name}</h2>
        <p style="color:#888;font-size:13px;margin-top:0">${siteConfig.tagline}</p>
        <ul style="list-style:none;padding:0;margin-top:24px">${itemsHtml}</ul>
        <p style="color:#aaa;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px">
          <a href="${unsubscribeUrl}" style="color:#aaa">Unsubscribe</a>
        </p>
      </div>`,
    });
    if (ok) sent += 1;
    else failed += 1;
  }

  return {
    sent,
    articleCount: newArticles.length,
    note: failed > 0 ? `${failed} send(s) rejected by the mail provider` : "",
  };
}
