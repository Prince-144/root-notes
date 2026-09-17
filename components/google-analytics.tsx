"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/site.config";

/**
 * Where a reader's opt-out is kept. It is the key the old consent banner wrote
 * "granted" or "denied" to, so anyone who pressed Decline on it stays opted out
 * without a migration.
 */
const KEY = "rn-analytics-consent";
const OFF = "denied";

function optedOut(): boolean {
  try {
    return localStorage.getItem(KEY) === OFF;
  } catch {
    return false;
  }
}

/**
 * The tag reports to the production property wherever it runs, so without this
 * a local dev server or a vercel.app preview adds its page views to the site's.
 */
function onSiteDomain(): boolean {
  const host = new URL(siteConfig.url).hostname;
  return location.hostname === host || location.hostname === `www.${host}`;
}

/**
 * Google Analytics, for every reader who has not turned it off on /cookies.
 *
 * Until September 2026 it waited behind a consent banner and only ever saw the
 * readers who pressed Accept. The banner was removed so GA counts everyone it
 * can reach; /cookies and /privacy were rewritten to say so.
 */
export function GoogleAnalyticsTag() {
  // Decided after mount because the opt-out lives in localStorage, which the
  // server cannot read. next/script loads the tag after hydration regardless.
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setLoad(onSiteDomain() && !optedOut());
  }, []);

  return load ? <GoogleAnalytics gaId={siteConfig.googleAnalyticsId} /> : null;
}

/**
 * GA sets _ga and _ga_<stream> on the widest domain it can — ".rootnotes.in"
 * even from www — so try the bare host and each parent. Deleting on a domain
 * the cookie was never set on does nothing.
 */
function clearGaCookies() {
  const labels = location.hostname.split(".");
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0].trim();
    if (!/^_ga(_|$)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (let i = 0; i < labels.length - 1; i++) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${labels.slice(i).join(".")}`;
    }
  }
}

/**
 * Turns Google Analytics off, or back on, in this browser. Used by /cookies.
 *
 * Reloads rather than updating in place: switching off has to stop a tag that
 * is already running on this page, switching on has to load one, and a fresh
 * page is the one way to be sure of both.
 */
export function AnalyticsOptOut() {
  const [off, setOff] = useState<boolean | null>(null);
  const [unsaved, setUnsaved] = useState(false);
  useEffect(() => {
    setOff(optedOut());
  }, []);

  function toggle() {
    try {
      if (off) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, OFF);
    } catch {
      setUnsaved(true);
      return;
    }
    if (!off) {
      // Google's documented switch, so nothing more is sent before the reload.
      (window as unknown as Record<string, unknown>)[
        `ga-disable-${siteConfig.googleAnalyticsId}`
      ] = true;
      clearGaCookies();
    }
    location.reload();
  }

  // The label depends on localStorage, so nothing renders until it has been
  // read. Without JavaScript there is no tag to turn off either.
  if (off === null) return null;

  if (unsaved) {
    return (
      <span className="font-mono text-sm text-fg-muted">
        This browser blocks local storage, so the choice cannot be saved. Blocking the
        Google Analytics domains, as described below, works instead.
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="font-mono text-sm text-accent underline underline-offset-4 hover:opacity-70"
    >
      {off
        ? "Google Analytics is off in this browser. Turn it back on"
        : "Turn off Google Analytics in this browser"}
    </button>
  );
}
