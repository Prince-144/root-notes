import { NextRequest, NextResponse } from "next/server";
import { cronAuthorised } from "@/lib/cron-auth";
import { sendDailyDigest } from "@/lib/newsletter";

// Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` — without this
// check, anyone who found this URL could trigger an email blast to every
// confirmed subscriber on demand.
export async function GET(req: NextRequest) {
  if (!cronAuthorised(req.headers.get("authorization"))) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await sendDailyDigest();
  return NextResponse.json({ ok: true, ...result });
}
