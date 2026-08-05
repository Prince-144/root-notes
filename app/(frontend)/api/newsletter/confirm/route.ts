import { NextRequest, NextResponse } from "next/server";
import { confirmSubscription } from "@/lib/newsletter";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const ok = token ? await confirmSubscription(token) : false;
  return NextResponse.redirect(new URL(`/newsletter/confirmed?ok=${ok ? 1 : 0}`, req.url));
}
