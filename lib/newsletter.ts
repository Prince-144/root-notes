import crypto from "crypto";
import { getPayload } from "payload";
import { Resend } from "resend";
import config from "@payload-config";
import { siteConfig } from "@/site.config";

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
