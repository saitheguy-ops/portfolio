"use client";

import { useEffect, useState } from "react";
import { RAIL_MAX, RAIL_MIN, railPosition, readouts } from "@/lib/readouts";

const TICKS = [
  { at: -1, label: "0.1" },
  { at: 0, label: "1" },
  { at: 3, label: "10³" },
  { at: 6, label: "10⁶" },
  { at: RAIL_MAX, label: "c" },
];

const fraction = (at: number) => (at - RAIL_MIN) / (RAIL_MAX - RAIL_MIN);

/**
 * Fixed instrument readout in the bottom-left corner. It shows the readout of
 * whichever `[data-readout]` element sits under a probe point a little below
 * the middle of the viewport, plus a log-scale speed rail.
 */
export default function SpeedReadout() {
  const [id, setId] = useState("hero");

  useEffect(() => {
    let raf = 0;
    const probe = () => {
      raf = 0;
      const x = window.innerWidth * 0.5;
      const y = window.innerHeight * 0.55;
      const stack = document.elementsFromPoint(x, y);
      for (const el of stack) {
        const hit = (el as HTMLElement).closest<HTMLElement>("[data-readout]");
        if (hit?.dataset.readout && readouts[hit.dataset.readout]) {
          setId(hit.dataset.readout);
          return;
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const r = readouts[id] ?? readouts.hero;
  const pos = railPosition(r.v);
  const log = Math.log10(r.v);

  return (
    <aside
      aria-label="Speed readout"
      className="pointer-events-none fixed bottom-3 left-3 z-40 flex w-[12.5rem] items-center gap-3 rounded-sm border border-line bg-bg/80 px-3 py-2 font-mono backdrop-blur-md sm:bottom-5 sm:left-5 sm:block sm:w-[14.5rem] sm:px-3.5 sm:py-3"
    >
      <div className="hidden items-center justify-between text-[0.625rem] uppercase tracking-[0.16em] text-muted sm:flex">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-signal motion-safe:animate-pulse" />
          readout
        </span>
        <span className="tabular">log₁₀ v = {log.toFixed(2)}</span>
      </div>

      <p className="min-w-0 shrink-0 overflow-hidden sm:mt-1.5">
        <span
          key={id}
          className="readout-tick block truncate text-[0.8125rem] text-ink sm:text-[1.05rem]"
        >
          {r.label}
        </span>
        <span
          key={`${id}-c`}
          className="readout-tick hidden truncate text-[0.6875rem] text-muted [animation-delay:60ms] sm:block"
        >
          {r.caption}
        </span>
      </p>

      {/* Log-scale rail, 0.1 m/s … c */}
      <div className="relative h-5 min-w-0 flex-1 sm:mt-3" aria-hidden="true">
        <div className="absolute inset-x-0 top-1.5 h-px bg-line-strong" />
        {TICKS.map((t) => (
          <div
            key={t.label}
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${fraction(t.at) * 100}%` }}
          >
            <span className="h-1.5 w-px bg-line-strong" />
            <span
              className={`mt-1 text-[0.5rem] leading-none text-muted ${t.at === 0 ? "max-sm:hidden" : ""}`}
            >
              {t.label}
            </span>
          </div>
        ))}
        <div className="absolute inset-x-0 top-0 h-3">
          <div
            className="h-3 w-full transition-transform duration-700 ease-out-expo"
            style={{ transform: `translateX(${pos * 100}%)` }}
          >
            <span className="absolute -left-px top-0 h-3 w-0.5 bg-accent shadow-[0_0_8px_var(--accent)]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
