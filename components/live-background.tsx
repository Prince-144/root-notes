/**
 * Ambient "live" background — sits behind all page content.
 *
 * Five layers, all purely decorative and aria-hidden:
 *   1. radial accent glow
 *   2. faint grid
 *   3. rotating globe + network arcs (canvas, right side)
 *   4. drifting monospace code fragments
 *   5. scanline sweep
 *
 * Everything except the globe is a server component: no JS, no randomness at
 * render (positions are hardcoded so server and client markup always match).
 * Animation is CSS and respects prefers-reduced-motion via globals.css.
 */

import { GlobeNetwork } from "./globe-network";

type Fragment = {
  text: string;
  /** % from left */ x: number;
  /** % from top */ y: number;
  /** seconds */ duration: number;
  /** seconds */ delay: number;
  opacity: number;
  size: number;
};

const fragments: Fragment[] = [
  { text: "$ curl -s https://api.example.com/v1/feed | jq '.items[]'", x: 2, y: 6, duration: 26, delay: 0, opacity: 0.13, size: 11 },
  { text: "CVE-2026-31427 — remote code execution", x: 3, y: 34, duration: 32, delay: 4, opacity: 0.1, size: 10 },
  { text: "npm audit --production  # 3 high, 1 critical", x: 1, y: 62, duration: 29, delay: 9, opacity: 0.11, size: 10 },
  { text: "git log --oneline --since='2 days ago'", x: 4, y: 88, duration: 34, delay: 2, opacity: 0.09, size: 10 },
  { text: "POST /v1/messages  200  142ms", x: 30, y: 12, duration: 30, delay: 6, opacity: 0.12, size: 10 },
  { text: "docker compose up -d --build", x: 26, y: 48, duration: 27, delay: 11, opacity: 0.1, size: 11 },
  { text: "SELECT slug, views FROM articles ORDER BY score DESC", x: 8, y: 74, duration: 36, delay: 1, opacity: 0.09, size: 10 },
  { text: "✓ build succeeded in 4.2s", x: 34, y: 96, duration: 25, delay: 14, opacity: 0.11, size: 10 },
  { text: "revalidatePath('/article/[slug]')", x: 20, y: 22, duration: 33, delay: 8, opacity: 0.07, size: 10 },
  { text: "score = views / (hours + 2) ** 1.5", x: 14, y: 52, duration: 31, delay: 16, opacity: 0.08, size: 10 },
];

export function LiveBackground() {
  return (
    <div className="live-bg" aria-hidden="true">
      <div className="live-bg__glow" />
      <div className="live-bg__grid" />

      <div className="live-bg__globe">
        <GlobeNetwork />
      </div>

      <div className="live-bg__code">
        {fragments.map((f, i) => (
          <span
            key={i}
            className="live-bg__fragment"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              fontSize: `${f.size}px`,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
            }}
          >
            {f.text}
          </span>
        ))}
      </div>

      <div className="live-bg__scan" />
    </div>
  );
}
