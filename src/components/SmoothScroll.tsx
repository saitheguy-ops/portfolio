"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Lenis smooth scrolling. Skipped entirely when the user prefers reduced
 * motion, so the browser's native scrolling is left alone.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const setup = () => {
      lenis?.destroy();
      lenis = null;
      if (reduced.matches) return;
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.11,
        smoothWheel: true,
        // Let in-page anchor links glide, landing below the fixed nav.
        anchors: { offset: -64 },
      });
    };

    setup();
    reduced.addEventListener("change", setup);
    return () => {
      reduced.removeEventListener("change", setup);
      lenis?.destroy();
    };
  }, []);

  return null;
}
