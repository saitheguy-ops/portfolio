"use client";

import { m } from "motion/react";
import { Fragment } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Rises and fades in once when it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article";
}) {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/**
 * A masked wipe: a panel in the page color slides off the content, revealing
 * it from left to right. Only transform and opacity are animated.
 */
export function Wipe({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
      <m.div
        aria-hidden="true"
        className="absolute inset-0 z-10 origin-right bg-bg"
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: delay + 0.05 }}
      >
        <span className="absolute inset-y-0 left-0 w-px bg-accent shadow-[0_0_12px_var(--accent)]" />
      </m.div>
    </m.div>
  );
}

/**
 * Splits text into words that rise out of a mask, staggered.
 * Words keep their spaces, so screen readers read the sentence normally.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <m.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
            <m.span
              className="inline-block"
              variants={{
                hidden: { y: "105%", opacity: 0 },
                shown: { y: "0%", opacity: 1 },
              }}
              transition={{ duration: 1, ease: EASE }}
            >
              {w}
            </m.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </m.span>
  );
}
