import { NextRequest, NextResponse } from "next/server";
import { unsubscribe } from "@/lib/newsletter";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const ok = token ? await unsubscribe(token) : false;
  return NextResponse.redirect(new URL(`/newsletter/unsubscribed?ok=${ok ? 1 : 0}`, req.url));
}
