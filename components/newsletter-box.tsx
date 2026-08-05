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
    <div className="rounded-md border border-line bg-panel p-5">
      <p className="font-mono text-xs text-fg-subtle">
        <span className="mr-2 text-accent" aria-hidden>
          $
        </span>
        subscribe --daily
      </p>
      <h2 className="mt-3 text-sm font-semibold text-fg">
        One email each morning. No filler.
      </h2>

      {state === "done" ? (
        <p className="mt-4 font-mono text-xs text-[var(--color-sig-green)]">
          ✓ Check your inbox to confirm.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-2">
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
            className="w-full rounded border border-line bg-canvas px-3 py-2 font-mono text-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full rounded bg-accent px-3 py-2 font-mono text-xs font-medium tracking-wider text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {state === "sending" ? "SENDING…" : "SUBSCRIBE"}
          </button>
          {state === "error" && (
            <p className="font-mono text-2xs text-[var(--color-sig-amber)]">{error}</p>
          )}
        </form>
      )}
    </div>
  );
}
