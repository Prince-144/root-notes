import { NextRequest, NextResponse } from "next/server";
import { generateAndSaveDraft } from "@/lib/article-generator";

// Research + drafting runs well past the default limit; this is the ceiling
// Vercel allows on the Hobby plan.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, message: "ANTHROPIC_API_KEY not set" },
      { status: 500 },
    );
  }

  try {
    const slug = await generateAndSaveDraft();
    return NextResponse.json(
      slug
        ? { ok: true, drafted: slug }
        : { ok: true, drafted: null, note: "no publishable story found this run" },
    );
  } catch (err) {
    console.error("[cron/generate-articles]", err);
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : "generation failed" },
      { status: 500 },
    );
  }
}
