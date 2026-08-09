"use client";

import { useState } from "react";

export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message ?? "Something went wrong. Try again.");
        setState("error");
        return;
      }

      setState("done");
    } catch {
      setError("Network error. Try again.");
      setState("error");
    }
  }

  return (
    /* Laid out as a wide band, not a column. This used to live in a 280px
       sidebar where a stacked input and full-width button made sense; across
       the full page that shape stretches into a large empty slab. */
    <div className="rounded-md border border-line bg-panel p-5 sm:px-7 sm:py-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <div className="min-w-0">
          <p className="font-mono text-xs text-fg-subtle">
            <span className="mr-2 text-accent" aria-hidden>
              $
            </span>
            subscribe --daily
          </p>
          <h2 className="mt-2 text-base font-semibold text-fg">
            One email each morning. No filler.
          </h2>
        </div>

        {state === "done" ? (
          <p className="shrink-0 font-mono text-xs text-[var(--color-sig-green)]">
            ✓ Check your inbox to confirm.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex w-full gap-2 sm:w-auto">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full rounded border border-line bg-canvas px-3 py-2.5 font-mono text-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none sm:w-64"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="shrink-0 rounded bg-accent px-6 py-2.5 font-mono text-xs font-medium tracking-wider text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {state === "sending" ? "SENDING…" : "SUBSCRIBE"}
            </button>
          </form>
        )}
      </div>

      {state === "error" && (
        <p className="mt-3 font-mono text-2xs text-[var(--color-sig-amber)]">{error}</p>
      )}
    </div>
  );
}
