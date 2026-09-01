import crypto from "crypto";

/**
 * Checks the `Authorization` header Vercel Cron sends against CRON_SECRET.
 *
 * Both cron routes used to compare against a template literal:
 *
 *     if (auth !== `Bearer ${process.env.CRON_SECRET}`)
 *
 * With CRON_SECRET unset that expands to the literal string
 * "Bearer undefined", which anyone can send. The variable is set in
 * Production today, but it is set *only* in Production — a preview
 * deployment, a new environment, or a rotation that lands empty would open
 * `/api/cron/daily-digest` (an email blast to every confirmed subscriber)
 * and `/api/cron/generate-articles` (paid model calls) to the internet, with
 * nothing in the logs to suggest anything had changed.
 *
 * A missing secret now denies every request instead of accepting a guessable
 * one. The comparison is constant-time so a wrong secret cannot be recovered
 * byte by byte from response timings.
 */
export function cronAuthorised(header: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !header) return false;

  const provided = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${secret}`);

  // timingSafeEqual throws on a length mismatch, and the length itself is not
  // a useful secret, so compare it first.
  return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
}
