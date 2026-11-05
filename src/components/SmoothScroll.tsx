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
        // In-page anchor links glide; section scroll-margin clears the nav.
        anchors: true,
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
