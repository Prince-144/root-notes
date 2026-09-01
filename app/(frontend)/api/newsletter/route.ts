import { NextRequest, NextResponse } from "next/server";
import { subscribe } from "@/lib/newsletter";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Five signup attempts per address per 10 minutes. A person subscribing
// once needs one; a script working through a list of other people's addresses
// needs thousands, and every one of those would have sent a real email from
// our domain.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  if (!rateLimit(clientKey(req.headers), MAX_ATTEMPTS, WINDOW_MS)) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let email: string | undefined;

  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email : undefined;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const result = await subscribe(email.toLowerCase().trim());
    return NextResponse.json(result);
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Try again." },
      { status: 500 },
    );
  }
}
