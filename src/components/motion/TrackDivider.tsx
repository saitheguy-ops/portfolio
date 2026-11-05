"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * A section divider drawn as a particle track. It draws itself as it scrolls
 * through the viewport: a curving primary track, a decay vertex, and a softer
 * secondary track leaving it.
 */
const VARIANTS = [
  {
    main: "M -20 92 C 260 88, 520 70, 760 52 S 1120 20, 1460 14",
    branch: "M 760 52 C 820 70, 880 96, 960 118",
    vertex: [760, 52] as const,
  },
  {
    main: "M -20 24 C 300 30, 560 46, 820 66 S 1180 98, 1460 104",
    branch: "M 820 66 C 900 50, 960 30, 1040 6",
    vertex: [820, 66] as const,
  },
  {
    main: "M -20 70 C 240 74, 480 66, 640 58 S 1060 36, 1460 40",
    branch: "M 640 58 C 700 84, 720 104, 790 124",
    vertex: [640, 58] as const,
  },
];

export default function TrackDivider({
  variant = 0,
  label,
}: {
  variant?: number;
  /** Small annotation at the vertex, e.g. "μ⁻ → e⁻ ν̄ₑ ν_μ". */
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 45%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const main = useTransform(smooth, (p) => (reduce ? 1 : Math.min(1, p * 1.25)));
  const branch = useTransform(smooth, (p) => (reduce ? 1 : Math.max(0, (p - 0.55) / 0.4)));
  const vertexOpacity = useTransform(smooth, (p) => (reduce ? 1 : p > 0.52 ? 1 : 0));
  const v = VARIANTS[variant % VARIANTS.length];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12"
    >
      <svg
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="h-20 w-full overflow-visible sm:h-28"
        fill="none"
      >
        <line x1="0" x2="1440" y1="65" y2="65" stroke="var(--line)" strokeDasharray="2 10" />
        <motion.path
          d={v.main}
          stroke="var(--ink)"
          strokeOpacity="0.55"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: main }}
        />
        <motion.path
          d={v.branch}
          stroke="var(--accent)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: branch }}
        />
        <motion.circle
          cx={v.vertex[0]}
          cy={v.vertex[1]}
          r="3.5"
          fill="var(--signal)"
          style={{ opacity: vertexOpacity }}
        />
      </svg>
      {label ? (
        <motion.span
          className="absolute top-0 font-mono text-[0.625rem] tracking-[0.12em] text-muted max-sm:hidden"
          style={{
            left: `calc(${(v.vertex[0] / 1440) * 100}% + 1rem)`,
            opacity: vertexOpacity,
          }}
        >
          {label}
        </motion.span>
      ) : null}
    </div>
  );
}
