import { NextRequest, NextResponse } from "next/server";
import { subscribe } from "@/lib/newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
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
