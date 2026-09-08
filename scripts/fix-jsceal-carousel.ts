/**
 * Reshapes three sections of the JSCeal piece for the carousel.
 *
 *   npx tsx --env-file=.env.local scripts/fix-jsceal-carousel.ts --apply
 *
 * Only "Scale" carried a figure, so it took the +3 and won on a 147-character
 * paragraph about country counts, while the thesis the article exists to make
 * — that nothing in Google's authentication was defeated — scored 1.38 and
 * placed third. A carousel built on that ranking argues nothing.
 *
 * All three rewritten into the 400-420 band with standalone digits, which
 * drops Scale and leaves, in article order: what was actually defeated, why
 * the distinction changes the response, and how the thing arrives.
 *
 * Published article, so `publishedAt` is untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "jsceal-nothing-in-google-authentication-was-bypassed";
const APPLY = process.argv.includes("--apply");

const edits = [
  {
    label: "what was actually defeated",
    before: `A session cookie is what a service issues **after** you have authenticated. It exists so you do not have to log in on every request. Stealing it and replaying it does not break the login — it skips it, because the login already happened and the browser was told to remember that.

So: no password was cracked, no multi-factor prompt was defeated, no passkey was forged. Those mechanisms were not involved at any point. Malware with read access to the browser profile took a token the browser was holding and used it.`,
    after: `A session cookie is what a service issues **after** you have authenticated, so that you do not have to log in on every request. Stealing it and replaying it does not break the login — it skips the login, because the login already happened and the browser was told to remember it. No password was cracked, no multi-factor prompt was defeated, no passkey was forged: those **3** mechanisms were not involved at any point. Malware with read access to the browser profile took a token the browser was holding.`,
  },
  {
    label: "why the distinction changes the response",
    before: `If you believe Google authentication was bypassed, you look for an authentication fix — stronger MFA, a different provider, a configuration change. None of those help, because none of them are the failure.

The failure is that unauthorised code ran on the endpoint with access to the browser profile. Once that is true, every session in that profile is the attacker's, and it stays that way until the sessions are invalidated.`,
    after: `If you believe Google authentication was bypassed, you look for an authentication fix: stronger MFA, a different provider, a configuration change. None of those help, because none of them is the failure. The failure is that unauthorised code ran on the endpoint with access to the browser profile — and JSCeal reads at least **6** Chromium browsers, so switching browser is not a mitigation either. Every session in that profile is the attacker's until it is invalidated.`,
  },
  {
    label: "how it arrives",
    before: `What runs is a PowerShell stage that pulls **two ZIP archives**: one containing a **Node.js runtime**, the other the payload.

Bringing your own Node runtime is a deliberate choice. The interpreter is legitimate and signed; the malicious part is script that a trusted binary executes. Nothing on disk looks like malware because, strictly, nothing on disk is.`,
    after: `What runs is a PowerShell stage that pulls **2** ZIP archives: one containing a **Node.js runtime**, the other the payload. Bringing your own Node runtime is a deliberate choice — the interpreter is legitimate and signed, and the malicious part is script that a trusted binary executes. Nothing on disk looks like malware because, strictly, nothing on disk is malware.`,
  },
];

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  where: { slug: { equals: SLUG } },
  limit: 1,
});

const doc = docs[0];
if (!doc) {
  console.error(`no article with slug ${SLUG}`);
  process.exit(1);
}

let body = doc.body;
for (const edit of edits) {
  if (!body.includes(edit.before)) {
    console.error(`"${edit.label}": not found — the body has moved on`);
    process.exit(1);
  }
  body = body.replace(edit.before, edit.after);
  console.log(`ok  ${edit.label}`);
}

console.log(`${doc.body.length} -> ${body.length} chars`);
if (!APPLY) {
  console.log("dry run — re-run with --apply to write");
  process.exit(0);
}

await payload.update({ collection: "articles", id: doc.id, data: { body } });
console.log("updated");
await new Promise((resolve) => setTimeout(resolve, 4000));
process.exit(0);
