"use client";

/**
 * Builds the URL next/image asks for, without Vercel's optimizer.
 *
 * Covers are stored at 1600x900 because that is the size the article hero and
 * the Instagram carousel need. The feed rows display them at 112 or 224
 * pixels wide, and with optimization switched off every one of those rows was
 * downloading the full 1600px file — around a quarter of a megabyte each, a
 * page of them on the homepage, most of it below the fold and all of it on
 * whatever connection the reader has.
 *
 * Unsplash serves any width from the same photo, so the fix is to ask it for
 * the width the layout actually uses. next/image calls this once per candidate
 * width and assembles the srcset; the browser then picks one. Nothing passes
 * through Vercel's image optimization, so the quota that broke every cover on
 * the site in September 2026 is not involved.
 *
 * Hosts with no resizing endpoint — uploaded covers in blob storage, files in
 * public/, Apple's newsroom assets — come back unchanged, which is what they
 * did before.
 */
/**
 * Covers are produced and reviewed at 1600x900, so asking for more returns a
 * larger file of the same picture. Without this, a high-density screen on the
 * article page requested 2048 or 3840 and the hero got heavier than it was
 * before any of this.
 */
const MAX_WIDTH = 1600;

export default function coverLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.startsWith("https://images.unsplash.com/")) return src;

  const url = new URL(src);
  width = Math.min(width, MAX_WIDTH);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));

  // The stored URL crops to 16:9. Keep that ratio at the requested width, or
  // Unsplash returns a 1600x900 crop scaled to a different shape.
  if (url.searchParams.has("h")) {
    url.searchParams.set("h", String(Math.round((width * 9) / 16)));
  }

  return url.toString();
}
