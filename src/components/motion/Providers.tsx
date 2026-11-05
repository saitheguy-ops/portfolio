"use client";

import { MotionConfig } from "motion/react";

/**
 * reducedMotion="user": when the OS asks for reduced motion, Motion skips
 * transform animations and keeps opacity, so every reveal becomes a fade.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
