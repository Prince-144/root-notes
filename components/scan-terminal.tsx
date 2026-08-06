"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * Live-typing mini terminal, pinned bottom-right on desktop.
 * Types out a fake feed-ingest session on a loop, then restarts.
 *
 * Starts empty on first render so server and client markup match — the
 * animation only begins in useEffect, after hydration.
 */

type Line = { text: string; tone?: "prompt" | "ok" | "dim" | "warn" };

const script: Line[] = [
  { text: "feed --watch --sources=all", tone: "prompt" },
  { text: "connecting to 42 sources…", tone: "dim" },
  { text: "[ok] rss      18 feeds", tone: "ok" },
  { text: "[ok] api       9 endpoints", tone: "ok" },
  { text: "[!!] 3 sources rate-limited", tone: "warn" },
  { text: "ranking by gravity…", tone: "dim" },
  { text: "[ok] 6 stories queued", tone: "ok" },
  { text: "publish --now", tone: "prompt" },
];

const TYPE_MS = 26;
const LINE_PAUSE_MS = 420;
const LOOP_PAUSE_MS = 3200;

export function ScanTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [typing, setTyping] = useState("");
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (dismissed) return;

    // Honour the user's motion preference — show the finished output, no typing.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines(script.map((l) => l.text));
      return;
    }

    const line = script[index];
    let char = 0;

    const tick = () => {
      char += 1;
      setTyping(line.text.slice(0, char));

      if (char < line.text.length) {
        timers.current.push(setTimeout(tick, TYPE_MS));
        return;
      }

      const last = index === script.length - 1;
      timers.current.push(
        setTimeout(
          () => {
            setTyping("");
            if (last) {
              setLines([]);
              setIndex(0);
            } else {
              setLines((prev) => [...prev, line.text]);
              setIndex((i) => i + 1);
            }
          },
          last ? LOOP_PAUSE_MS : LINE_PAUSE_MS,
        ),
      );
    };

    timers.current.push(setTimeout(tick, TYPE_MS));

    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      timers.current = [];
    };
  }, [index, dismissed]);

  if (dismissed) return null;

  const toneClass = (i: number) => {
    const tone = script[i]?.tone;
    if (tone === "ok") return "text-[var(--color-sig-green)]";
    if (tone === "warn") return "text-[var(--color-sig-amber)]";
    if (tone === "prompt") return "text-fg";
    return "text-fg-subtle";
  };

  return (
    <aside
      className="scan-terminal pointer-events-none fixed left-5 top-[65%] z-0 hidden w-[300px] -translate-y-1/2 opacity-60 lg:block"
      aria-hidden="true"
    >
      <div className="pointer-events-auto overflow-hidden rounded-md border border-line bg-panel/50 backdrop-blur-sm">
        <div className="flex items-center gap-2.5 border-b border-line bg-chrome px-3 py-2">
          <span className="size-2 rounded-full bg-[var(--color-dot-1)]" />
          <span className="size-2 rounded-full bg-[var(--color-dot-2)]" />
          <span className="size-2 rounded-full bg-[var(--color-dot-3)]" />
          <span className="ml-1 font-mono text-2xs tracking-wider text-fg-subtle">
            ingest — live
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Hide live feed"
            className="ml-auto text-fg-subtle transition-colors hover:text-accent"
          >
            <X className="size-3" strokeWidth={2} />
          </button>
        </div>

        <div className="h-[132px] overflow-hidden px-3 py-2.5 font-mono text-[11px] leading-[1.65]">
          {lines.map((text, i) => (
            <p key={i} className={toneClass(i)}>
              {script[i]?.tone === "prompt" && <span className="mr-1.5 text-accent">$</span>}
              {text}
            </p>
          ))}
          {typing && (
            <p className={toneClass(index)}>
              {script[index]?.tone === "prompt" && (
                <span className="mr-1.5 text-accent">$</span>
              )}
              {typing}
              <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-accent" />
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
