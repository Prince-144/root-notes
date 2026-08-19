"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/site.config";

const KEY = "rn-analytics-consent";

type Choice = "granted" | "denied";

function read(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Analytics consent, and the analytics tag itself.
 *
 * The tag lives here rather than in the layout because consent has to gate
 * loading, not just reporting — Google Analytics sets its cookies the moment
 * the script runs, so a banner that appears alongside a script already running
 * is decoration. Nothing loads until someone chooses.
 *
 * Default is no. An unanswered banner is not consent, and the site works
 * identically either way.
 */
export function CookieConsent() {
  // Undefined until the effect has read localStorage: rendering the banner
  // during hydration would flash it at people who already answered.
  const [choice, setChoice] = useState<Choice | null | undefined>(undefined);

  useEffect(() => {
    setChoice(read());

    // The cookie policy page offers a link that clears the stored choice; this
    // brings the banner back without a reload.
    const onReset = () => setChoice(null);
    window.addEventListener("rn-consent-reset", onReset);
    return () => window.removeEventListener("rn-consent-reset", onReset);
  }, []);

  // Publishes the banner's height to CSS so the page and the sticky header can
  // move down by exactly that much. Observed rather than hard-coded: the text
  // wraps to two lines on a phone and one on a desktop, and the height changes
  // with the reader's font size.
  const banner = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = banner.current;
    const root = document.documentElement;
    if (!el) {
      root.style.setProperty("--consent-h", "0px");
      return;
    }
    const ro = new ResizeObserver(([entry]) => {
      root.style.setProperty("--consent-h", `${entry.contentRect.height}px`);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--consent-h", "0px");
    };
  }, [choice]);

  function decide(next: Choice) {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Private mode with storage blocked — honour the choice for this page
      // view and ask again next time rather than failing.
    }
    setChoice(next);
  }

  return (
    <>
      {choice === "granted" && <GoogleAnalytics gaId={siteConfig.googleAnalyticsId} />}

      {/* Sits above the sticky header rather than along the bottom edge. The
          effect above offsets the page while it is up so it never covers the
          navigation. */}
      {choice === null && (
        <div
          ref={banner}
          role="dialog"
          aria-label="Analytics cookies"
          className="consent-banner fixed inset-x-0 top-0 z-50 border-b border-line bg-panel/95 backdrop-blur"
        >
          <div className="container-page flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-relaxed text-fg-muted">
              <span className="font-mono text-xs text-accent">$ cookies --analytics</span>
              <br />
              We would like to use Google Analytics to see which articles get read. It sets
              cookies. Declining changes nothing about what you can read — we still count
              page views without cookies, and that counts nobody in particular.{" "}
              <a href="/cookies" className="text-accent hover:opacity-70">
                Cookie Policy
              </a>
            </p>

            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="rounded-md border border-line px-4 py-2 font-mono text-sm text-fg transition-colors hover:border-fg-subtle"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="rounded-md bg-accent px-4 py-2 font-mono text-sm font-medium text-bg transition-opacity hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Clears the stored choice so the banner returns. Used by the cookie policy. */
export function ResetConsentButton() {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.removeItem(KEY);
        } catch {
          /* nothing stored to clear */
        }
        window.dispatchEvent(new Event("rn-consent-reset"));
        setDone(true);
      }}
      className="font-mono text-sm text-accent underline underline-offset-4 hover:opacity-70"
    >
      {done ? "Cleared — the banner is back at the top of the page." : "Change my choice"}
    </button>
  );
}
