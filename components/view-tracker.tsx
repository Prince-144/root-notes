"use client";

import { useEffect } from "react";

/**
 * Counts one view per article per browser session.
 *
 * Article pages are statically generated, so the count can't come from the
 * server render — that would only ever run at build time. Firing from the
 * client also keeps the write off the critical path.
 *
 * sessionStorage caps a reader at one view per article per session, so a
 * refresh or a back-navigation doesn't inflate the number. This is a civility
 * measure, not a security one: the endpoint is public and nothing stops a
 * determined script from calling it repeatedly. That's an acceptable trade at
 * this scale — the counts feed a trending list, not anything load-bearing —
 * but it means the numbers should be read as approximate.
 */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed:${slug}`;

    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Private mode or storage disabled — count it and move on.
    }

    // keepalive so the request survives the reader navigating away instantly.
    fetch(`/api/articles/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // A missed count is not worth bothering the reader about.
    });
  }, [slug]);

  return null;
}
