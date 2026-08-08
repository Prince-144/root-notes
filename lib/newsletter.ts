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

const RESEND_COOLDOWN_MS = 60_000;

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
      return { ok: true, message: "You're already subscribed." };
    }
    // Without this, repeatedly POSTing someone else's email address would
    // email-bomb them with confirmation emails on every request.
    const msSinceLastSend = Date.now() - Date.parse(doc.updatedAt);
    if (msSinceLastSend < RESEND_COOLDOWN_MS) {
      return { ok: true, message: "Check your inbox to confirm." };
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
    await resend.emails.send({
      // Swap for a verified-domain sender once siteConfig.url is a real domain.
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to: email,
      subject: `Confirm your ${siteConfig.name} subscription`,
      html: `<p>One click to confirm your subscription to ${siteConfig.name}:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p><p style="color:#888;font-size:12px">Didn't request this? Ignore this email, or <a href="${unsubscribeUrl}">unsubscribe</a>.</p>`,
    });
  } else {
    console.warn(
      `[newsletter] RESEND_API_KEY not set — would have emailed ${email}. Confirm link: ${confirmUrl}`,
    );
  }

  return { ok: true, message: "Check your inbox to confirm." };
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
  for (const sub of subscribers) {
    const unsubscribeUrl = `${siteConfig.url}/api/newsletter/unsubscribe?token=${sub.confirmToken}`;
    await resend.emails.send({
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
    sent += 1;
  }

  return { sent, articleCount: newArticles.length, note: "" };
}
