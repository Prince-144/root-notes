/**
 * A small fixed-window rate limiter held in module memory.
 *
 * What it is for: `/api/newsletter` sends an email to any address posted to
 * it. There was a 60-second cooldown per *existing* unconfirmed subscriber,
 * which stops one address being bombed — but nothing stopped a script posting
 * ten thousand *different* addresses, each of which got a real confirmation
 * email from our sending domain. That is a spam complaint problem before it is
 * anything else: the cost lands on Resend's reputation for rootnotes.in, and a
 * blocked sending domain takes the newsletter down for everyone.
 *
 * What it is not: durable. Vercel runs this on serverless instances, so the
 * counters live per instance and reset on cold start — a distributed flood
 * spread across many instances is only partly slowed. It is deliberately kept
 * this simple because the alternative is a Redis dependency for a blog. The
 * durable version of this control is a Vercel Firewall rate-limit rule on the
 * route, configured in the dashboard rather than in code; this is the floor,
 * not the ceiling.
 *
 * Entries are swept on write so the map cannot grow without bound.
 */
type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) return false;

  existing.count += 1;
  return true;
}

/**
 * Best-effort client address.
 *
 * `x-forwarded-for` is trivially spoofable in general, but on Vercel the proxy
 * overwrites it, so the leftmost entry is the real peer for requests that
 * actually reach the function. Requests with no usable address share one
 * bucket rather than each getting a free pass.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || "unknown";
}
