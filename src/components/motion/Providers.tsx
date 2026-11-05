"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * - LazyMotion + domAnimation loads only the animation features this site
 *   uses, keeping the bundle small (components use `m.*`, not `motion.*`).
 * - reducedMotion="user": when the OS asks for reduced motion, Motion skips
 *   transform animations and keeps opacity, so every reveal becomes a fade.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
