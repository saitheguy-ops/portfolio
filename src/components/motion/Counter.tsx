"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/**
 * Counts up to `value` the first time it scrolls into view. The final value is
 * rendered on the server and reserves the space, so nothing shifts.
 */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.8,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const final = `${prefix}${fmt(value)}${suffix}`;

  useEffect(() => {
    const el = numRef.current;
    if (!el || reduce) return;
    if (!inView) {
      el.textContent = `${prefix}0${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${fmt(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, prefix, suffix, duration]);

  return (
    <span ref={ref} className="tabular relative inline-block">
      {/* Invisible copy of the final value holds the width. */}
      <span className="invisible" aria-hidden="true">
        {final}
      </span>
      <span ref={numRef} className="absolute inset-0" aria-hidden="true">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
