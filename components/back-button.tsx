"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="link-underline font-mono text-xs text-fg-subtle"
    >
      &larr; back
    </button>
  );
}
