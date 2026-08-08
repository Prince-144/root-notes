import { NextRequest, NextResponse } from "next/server";
import { recordView } from "@/lib/views";

// A slug is the only input; anything that isn't one is rejected before it
// reaches the database rather than being parameterised and looked up.
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!SLUG_RE.test(slug) || slug.length > 200) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const counted = await recordView(slug);
    // Same response either way: whether a slug exists is already public via
    // the article page, but an unpublished one shouldn't be distinguishable.
    return NextResponse.json({ ok: counted }, { status: 200 });
  } catch (err) {
    console.error("[views]", err);
    // A failed count is not worth surfacing to the reader.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
