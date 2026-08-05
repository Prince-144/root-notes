"use client";

import { useEffect, useRef } from "react";

/**
 * Rotating wireframe globe with a dotted world map and animated great-circle
 * network arcs. Rendered to <canvas> (not SVG) so ~1000 dots + 36 arcs animate
 * at 60fps without thrashing the DOM.
 *
 * Purely decorative — sits inside LiveBackground, aria-hidden, pointer-events
 * none. Honours prefers-reduced-motion by drawing a single static frame.
 *
 * Projection: orthographic. Points are built as 3D unit vectors from lat/lon,
 * rotated about Y (spin) then X (tilt), and anything with z <= 0 is on the far
 * side of the sphere and gets culled.
 */

const TILT = 18; // degrees — tips the north pole toward the viewer
const SPIN_DEG_PER_SEC = 3.2;
const RAD = Math.PI / 180;

/**
 * Coarse 5° land mask. Each entry is [row, colStart, colEnd] where
 * lat = 80 - 5 * row  and  lon = -180 + 5 * col.
 * Deliberately low-fidelity: at dot size 1.35px it reads as continents.
 */
const LAND: [number, number, number][] = [
  // 80N — Canadian arctic, Greenland, Russian arctic
  [0, 14, 20], [0, 25, 32], [0, 50, 60],
  // 75N
  [1, 14, 23], [1, 24, 32], [1, 39, 41], [1, 50, 68],
  // 70N — Alaska, Canada, Greenland, Scandinavia, Siberia
  [2, 2, 7], [2, 10, 26], [2, 27, 32], [2, 36, 71],
  // 65N
  [3, 1, 7], [3, 9, 26], [3, 28, 32], [3, 34, 35], [3, 36, 71],
  // 60N
  [4, 1, 6], [4, 8, 27], [4, 29, 31], [4, 36, 71],
  // 55N
  [5, 7, 28], [5, 34, 71],
  // 50N
  [6, 7, 28], [6, 34, 71],
  // 45N
  [7, 8, 27], [7, 34, 71],
  // 40N — Mediterranean rim
  [8, 9, 27], [8, 34, 71],
  // 35N
  [9, 11, 26], [9, 33, 70],
  // 30N — Sahara, Middle East, China
  [10, 13, 25], [10, 34, 43], [10, 44, 70],
  // 25N — Arabia and India separate out
  [11, 15, 25], [11, 33, 43], [11, 44, 48], [11, 50, 55], [11, 56, 67],
  // 20N
  [12, 16, 24], [12, 32, 43], [12, 44, 48], [12, 50, 55], [12, 56, 62],
  // 15N
  [13, 17, 24], [13, 32, 44], [13, 45, 48], [13, 51, 56], [13, 57, 62],
  // 10N — Central America, top of South America, Gulf of Guinea
  [14, 19, 24], [14, 26, 30], [14, 33, 45], [14, 51, 56], [14, 57, 62],
  // 5N
  [15, 24, 31], [15, 33, 45], [15, 55, 63],
  // 0 — equator: Amazon, Congo, Indonesia
  [16, 25, 32], [16, 38, 44], [16, 55, 68],
  // 5S
  [17, 25, 34], [17, 38, 44], [17, 56, 68],
  // 10S
  [18, 25, 35], [18, 38, 44], [18, 57, 69],
  // 15S
  [19, 26, 35], [19, 38, 44], [19, 59, 68],
  // 20S — Madagascar splits off, Australia
  [20, 26, 34], [20, 38, 43], [20, 44, 46], [20, 58, 68],
  // 25S
  [21, 27, 33], [21, 39, 42], [21, 44, 46], [21, 58, 68],
  // 30S
  [22, 28, 33], [22, 39, 42], [22, 59, 67],
  // 35S — Cape, Tasmania, New Zealand
  [23, 28, 32], [23, 39, 41], [23, 60, 66], [23, 69, 71],
  // 40S
  [24, 28, 31], [24, 69, 71],
  // 45S
  [25, 28, 31], [25, 69, 70],
  // 50S / 55S — Patagonia tapering out
  [26, 28, 30],
  [27, 29, 30],
];

type City = { lat: number; lon: number };

const CITIES: City[] = [
  { lat: 40.7, lon: -74.0 },   // 0  New York
  { lat: 51.5, lon: -0.1 },    // 1  London
  { lat: 35.7, lon: 139.7 },   // 2  Tokyo
  { lat: 1.3, lon: 103.8 },    // 3  Singapore
  { lat: -33.9, lon: 151.2 },  // 4  Sydney
  { lat: -23.5, lon: -46.6 },  // 5  São Paulo
  { lat: 19.1, lon: 72.9 },    // 6  Mumbai
  { lat: 6.5, lon: 3.4 },      // 7  Lagos
  { lat: 25.2, lon: 55.3 },    // 8  Dubai
  { lat: 37.8, lon: -122.4 },  // 9  San Francisco
  { lat: 50.1, lon: 8.7 },     // 10 Frankfurt
  { lat: 37.6, lon: 127.0 },   // 11 Seoul
  { lat: 55.8, lon: 37.6 },    // 12 Moscow
  { lat: 30.0, lon: 31.2 },    // 13 Cairo
  { lat: 43.7, lon: -79.4 },   // 14 Toronto
  { lat: 19.4, lon: -99.1 },   // 15 Mexico City
  { lat: -26.2, lon: 28.0 },   // 16 Johannesburg
  { lat: 31.2, lon: 121.5 },   // 17 Shanghai
  { lat: 34.1, lon: -118.2 },  // 18 Los Angeles
  { lat: -34.6, lon: -58.4 },  // 19 Buenos Aires
  { lat: -6.2, lon: 106.8 },   // 20 Jakarta
  { lat: 59.3, lon: 18.1 },    // 21 Stockholm
  { lat: 13.1, lon: 80.3 },    // 22 Chennai
  { lat: -1.3, lon: 36.8 },    // 23 Nairobi
  { lat: 41.0, lon: 28.98 },   // 24 Istanbul
  { lat: -36.8, lon: 174.8 },  // 25 Auckland
];

/** [from, to, arc height, seconds per traversal, start offset] */
const LINKS: [number, number, number, number, number][] = [
  [0, 1, 0.22, 5.5, 0.0],   [1, 8, 0.16, 4.2, 1.4],   [8, 3, 0.19, 5.0, 0.6],
  [3, 4, 0.15, 4.6, 2.1],   [9, 2, 0.26, 6.4, 0.9],   [5, 7, 0.18, 5.2, 2.8],
  [10, 6, 0.17, 4.8, 1.7],  [2, 11, 0.10, 3.4, 0.3],  [0, 5, 0.20, 5.8, 3.2],
  [12, 17, 0.20, 5.4, 1.1], [13, 16, 0.18, 5.0, 2.4], [14, 21, 0.19, 4.9, 0.4],
  [15, 19, 0.21, 5.6, 3.0], [18, 20, 0.28, 6.6, 1.9], [6, 3, 0.13, 3.8, 2.6],
  [11, 4, 0.22, 5.7, 0.8],  [1, 12, 0.11, 3.6, 1.2],  [7, 13, 0.14, 4.0, 3.4],
  [0, 14, 0.08, 3.0, 2.2],  [17, 3, 0.14, 4.1, 1.6],  [21, 12, 0.09, 3.2, 0.7],
  [9, 18, 0.07, 2.8, 2.9],  [16, 4, 0.26, 6.2, 1.3],  [19, 5, 0.09, 3.1, 0.2],
  [22, 8, 0.13, 3.9, 1.5],  [23, 6, 0.16, 4.4, 2.7],  [24, 10, 0.10, 3.3, 0.5],
  [25, 4, 0.08, 2.9, 1.8],  [1, 14, 0.21, 5.3, 2.3],  [15, 9, 0.09, 3.2, 0.1],
  [13, 24, 0.07, 2.7, 3.1], [20, 3, 0.07, 2.6, 1.0],  [22, 20, 0.15, 4.3, 2.0],
  [12, 2, 0.23, 5.9, 0.35], [16, 19, 0.24, 6.0, 1.65], [7, 5, 0.19, 5.1, 2.45],
];

type Vec3 = { x: number; y: number; z: number };

function toVec(lat: number, lon: number, r = 1): Vec3 {
  const p = lat * RAD;
  const l = lon * RAD;
  return {
    x: r * Math.cos(p) * Math.cos(l),
    y: r * Math.sin(p),
    z: r * Math.cos(p) * Math.sin(l),
  };
}

/** Spherical linear interpolation — gives a true great-circle path. */
function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a;
  const s = Math.sin(omega);
  const wa = Math.sin((1 - t) * omega) / s;
  const wb = Math.sin(t * omega) / s;
  return { x: a.x * wa + b.x * wb, y: a.y * wa + b.y * wb, z: a.z * wa + b.z * wb };
}

export function GlobeNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /**
     * Custom properties don't resolve through getPropertyValue (it returns the
     * literal "var(--color-azure-500)"), and canvas fillStyle doesn't accept
     * color-mix(). So: paint the var onto a throwaway element, read the
     * computed rgb, and build rgba() strings by hand.
     */
    const readVar = (name: string, fallback: [number, number, number]) => {
      const probe = document.createElement("span");
      probe.style.cssText = `color: var(${name}); position: absolute; visibility: hidden;`;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).color;
      probe.remove();
      const m = computed.match(/\d+(\.\d+)?/g);
      return m && m.length >= 3
        ? ([Number(m[0]), Number(m[1]), Number(m[2])] as [number, number, number])
        : fallback;
    };

    const accentRgb = readVar("--accent", [59, 125, 255]);
    const dimRgb = readVar("--fg-subtle", [107, 119, 148]);
    const rgba = (c: [number, number, number], a: number) =>
      `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
    const accent = rgba(accentRgb, 1);

    let width = 0;
    let height = 0;
    let radius = 0;
    let cx = 0;
    let cy = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.min(Math.max(window.innerWidth * 0.62, 520), 940);
      width = size;
      height = size;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = size * 0.38;
      cx = size / 2;
      cy = size / 2;
    };

    resize();
    window.addEventListener("resize", resize);

    const cosT = Math.cos(TILT * RAD);
    const sinT = Math.sin(TILT * RAD);

    /** Rotate about Y by `spin`, then about X by TILT, then project. */
    const project = (v: Vec3, cosS: number, sinS: number) => {
      const x = v.x * cosS + v.z * sinS;
      const z1 = -v.x * sinS + v.z * cosS;
      const y = v.y * cosT - z1 * sinT;
      const z = v.y * sinT + z1 * cosT;
      return { sx: cx + x * radius, sy: cy - y * radius, z };
    };

    // Pre-compute land dot vectors once
    const dots: Vec3[] = [];
    for (const [row, from, to] of LAND) {
      const lat = 80 - row * 5;
      for (let col = from; col <= to; col++) {
        dots.push(toVec(lat, -180 + col * 5));
      }
    }

    const cityVecs = CITIES.map((c) => toVec(c.lat, c.lon));

    const draw = (elapsed: number) => {
      const spin = (elapsed * SPIN_DEG_PER_SEC - 40) * RAD;
      const cosS = Math.cos(spin);
      const sinS = Math.sin(spin);

      ctx.clearRect(0, 0, width, height);

      // Atmospheric halo
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.32);
      halo.addColorStop(0, rgba(accentRgb, 0.22));
      halo.addColorStop(0.55, rgba(accentRgb, 0.07));
      halo.addColorStop(1, rgba(accentRgb, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.32, 0, Math.PI * 2);
      ctx.fill();

      // Sphere body
      const body = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.35, radius * 0.1,
        cx, cy, radius,
      );
      body.addColorStop(0, rgba(accentRgb, 0.13));
      body.addColorStop(1, rgba(accentRgb, 0));
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Limb
      ctx.strokeStyle = rgba(accentRgb, 0.34);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Graticule
      ctx.strokeStyle = rgba(dimRgb, 0.26);
      ctx.lineWidth = 0.6;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const p = project(toVec(lat, lon), cosS, sinS);
          if (p.z <= 0) { started = false; continue; }
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.stroke();
      }
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -85; lat <= 85; lat += 4) {
          const p = project(toVec(lat, lon), cosS, sinS);
          if (p.z <= 0) { started = false; continue; }
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.stroke();
      }

      // Land dots — fade toward the limb
      for (const v of dots) {
        const p = project(v, cosS, sinS);
        if (p.z <= 0.04) continue;
        ctx.globalAlpha = Math.min(1, p.z * 1.5) * 0.72;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 1.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Network arcs
      for (const [ai, bi, alt, period, offset] of LINKS) {
        const a = cityVecs[ai];
        const b = cityVecs[bi];
        const steps = 46;
        const pts: { sx: number; sy: number; z: number }[] = [];

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const m = slerp(a, b, t);
          const lift = 1 + alt * Math.sin(Math.PI * t);
          pts.push(project({ x: m.x * lift, y: m.y * lift, z: m.z * lift }, cosS, sinS));
        }

        // Static arc line
        ctx.strokeStyle = rgba(accentRgb, 0.3);
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        let started = false;
        for (const p of pts) {
          if (p.z <= -0.12) { started = false; continue; }
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.stroke();

        // Travelling packet with a comet tail
        const prog = ((elapsed + offset) % period) / period;
        const head = Math.floor(prog * steps);
        const tail = 9;
        for (let k = 0; k < tail; k++) {
          const idx = head - k;
          if (idx < 0 || idx > steps) continue;
          const p = pts[idx];
          if (p.z <= -0.12) continue;
          ctx.globalAlpha = (1 - k / tail) * 0.9;
          ctx.fillStyle = k === 0 ? "#ffffff" : accent;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, k === 0 ? 2.1 : 1.5 * (1 - k / tail) + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // City nodes, gently pulsing
      cityVecs.forEach((v, i) => {
        const p = project(v, cosS, sinS);
        if (p.z <= 0.02) return;
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 1.6 + i * 1.1);

        ctx.globalAlpha = 0.16 + pulse * 0.2;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 5 + pulse * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      draw(0);
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="globe-network" />;
}
