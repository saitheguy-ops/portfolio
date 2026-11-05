"use client";

import { motion } from "motion/react";

const W = 420;
const H = 260;
const PAD = { l: 44, r: 16, t: 18, b: 36 };
const iw = W - PAD.l - PAD.r;
const ih = H - PAD.t - PAD.b;

function path(fn: (x: number) => number, x0: number, x1: number, xmax: number, ymax: number) {
  const pts: string[] = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    const y = fn(x);
    const px = PAD.l + (x / xmax) * iw;
    const py = PAD.t + ih - (y / ymax) * ih;
    pts.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return pts.join(" ");
}

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: "0px 0px -15% 0px" },
  transition: {
    pathLength: { duration: 1.8, ease: [0.16, 1, 0.3, 1] as const, delay },
    opacity: { duration: 0.3, delay },
  },
});

function Axes({ x, y, ticks }: { x: string; y: string; ticks: { at: number; label: string }[] }) {
  return (
    <g fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted)">
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + ih} stroke="var(--line-strong)" />
      <line x1={PAD.l} y1={PAD.t + ih} x2={PAD.l + iw} y2={PAD.t + ih} stroke="var(--line-strong)" />
      {ticks.map((t) => (
        <g key={t.label}>
          <line
            x1={PAD.l + t.at * iw}
            x2={PAD.l + t.at * iw}
            y1={PAD.t + ih}
            y2={PAD.t + ih + 4}
            stroke="var(--line-strong)"
          />
          <text x={PAD.l + t.at * iw} y={PAD.t + ih + 16} textAnchor="middle">
            {t.label}
          </text>
        </g>
      ))}
      <text x={PAD.l + iw} y={H - 4} textAnchor="end">
        {x}
      </text>
      <text x={PAD.l - 8} y={PAD.t + 4} textAnchor="end">
        {y}
      </text>
    </g>
  );
}

/** Schematic figures, drawn with model curves (not measured data). */
export default function ResearchFigure({ kind }: { kind: "decay" | "rotation" }) {
  if (kind === "decay") {
    // Bi-exponential relaxation after the pump: fast + slow component.
    const xmax = 100;
    const fast = (t: number) => 0.62 * Math.exp(-t / 4);
    const slow = (t: number) => 0.38 * Math.exp(-t / 38);
    return (
      <figure>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Schematic of a pump–probe decay: the signal drops quickly, then slowly, over about 100 picoseconds.">
          <Axes
            x="pump–probe delay (ps)"
            y="ΔA"
            ticks={[0, 25, 50, 75].map((v) => ({ at: v / xmax, label: String(v) }))}
          />
          <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={PAD.t + ih} stroke="var(--signal)" strokeDasharray="2 4" />
          <motion.path d={path(fast, 0, xmax, xmax, 1.05)} stroke="var(--muted)" strokeDasharray="3 5" fill="none" {...draw(0.3)} />
          <motion.path d={path(slow, 0, xmax, xmax, 1.05)} stroke="var(--muted)" strokeDasharray="3 5" fill="none" {...draw(0.45)} />
          <motion.path d={path((t) => fast(t) + slow(t), 0, xmax, xmax, 1.05)} stroke="var(--accent)" strokeWidth="1.8" fill="none" {...draw(0)} />
          <text x={PAD.l + 8} y={PAD.t + 10} fontFamily="var(--font-mono)" fontSize="10" fill="var(--signal)">
            pump
          </text>
          <text x={PAD.l + iw * 0.34} y={PAD.t + ih * 0.62} fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted)">
            τ₁ fast · τ₂ slow
          </text>
        </svg>
        <figcaption className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
          Schematic · multi-exponential fit
        </figcaption>
      </figure>
    );
  }

  // Rotation curve: flat observed curve vs. a Keplerian falloff.
  const xmax = 20;
  const ymax = 300;
  const observed = (r: number) => 232 * (1 - Math.exp(-r / 1.6)) - 0.6 * r;
  const kepler = (r: number) => (r < 5 ? observed(r) : observed(5) * Math.sqrt(5 / r));
  const sunX = PAD.l + (8.2 / xmax) * iw;
  const sunY = PAD.t + ih - (observed(8.2) / ymax) * ih;
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Schematic rotation curve: orbital speed stays flat near 220 km/s far from the galactic center, instead of falling off as visible matter alone predicts.">
        <Axes
          x="radius (kpc)"
          y="v (km/s)"
          ticks={[0, 5, 10, 15].map((v) => ({ at: v / xmax, label: String(v) }))}
        />
        <motion.path d={path(kepler, 0.05, xmax, xmax, ymax)} stroke="var(--muted)" strokeDasharray="3 5" fill="none" {...draw(0.4)} />
        <motion.path d={path(observed, 0.05, xmax, xmax, ymax)} stroke="var(--accent)" strokeWidth="1.8" fill="none" {...draw(0)} />
        <motion.circle
          cx={sunX}
          cy={sunY}
          r="4"
          fill="var(--signal)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        />
        <g fontFamily="var(--font-mono)" fontSize="10">
          <text x={sunX + 8} y={sunY - 8} fill="var(--signal)">
            Sun · ≈220 km/s
          </text>
          <text x={PAD.l + iw - 4} y={PAD.t + ih * 0.3} textAnchor="end" fill="var(--accent)">
            observed (21 cm)
          </text>
          <text x={PAD.l + iw - 4} y={PAD.t + ih * 0.74} textAnchor="end" fill="var(--muted)">
            visible matter only
          </text>
        </g>
      </svg>
      <figcaption className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
        Schematic · rotation curve
      </figcaption>
    </figure>
  );
}
