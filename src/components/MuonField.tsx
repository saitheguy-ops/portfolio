"use client";

import { useEffect, useRef } from "react";

/**
 * A dark, faintly noisy detector field with sparse muon tracks.
 *
 * - Tracks are either long streaks that cross the frame fast (a bright head
 *   with a fading tail) or short CMOS-style hits that flash and decay.
 * - The sensor noise is a separate CSS layer (.hero-noise) that jumps between
 *   offsets on the compositor, so the canvas only clears and strokes a few
 *   lines per frame.
 * - The loop stops when the canvas is off-screen or the tab is hidden, and
 *   draws a single still frame when the user prefers reduced motion.
 */

type Track = {
  x0: number;
  y0: number;
  dx: number; // unit direction
  dy: number;
  length: number; // px of visible trail
  travel: number; // total px the head travels
  speed: number; // px per ms
  born: number; // ms
  life: number; // ms the trail lingers after the head stops
  width: number;
  color: string; // "r g b"
  kind: "streak" | "hit";
};

type Palette = { track: string; accent: string; signal: string };

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) =>
    s.getPropertyValue(name).trim().replace(/\s+/g, " ") || fallback;
  return {
    track: get("--track", "235 245 255"),
    accent: get("--track-accent", "92 198 255"),
    signal: get("--track-signal", "255 164 92"),
  };
}

export default function MuonField({
  frameCounterId,
  eventCounterId,
}: {
  frameCounterId?: string;
  eventCounterId?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frameEl = frameCounterId ? document.getElementById(frameCounterId) : null;
    const eventEl = eventCounterId ? document.getElementById(eventCounterId) : null;

    const host = canvas.parentElement;
    let palette = readPalette();

    let width = 0;
    let height = 0;
    let dpr = 1;
    let tracks: Track[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let nextSpawn = 0;
    let lastFrame = 0;
    let frame = 0;
    let events = 0;

    const pickColor = () => {
      const r = Math.random();
      if (r < 0.05) return palette.signal;
      if (r < 0.32) return palette.accent;
      return palette.track;
    };

    const spawn = (now: number, age = 0): Track => {
      const streak = Math.random() < 0.42;
      // Mostly downward, within ~40° of vertical, like muons from the zenith.
      const angle = Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const dx = Math.cos(angle) * dir;
      const dy = Math.sin(angle);
      const diag = Math.hypot(width, height);
      if (streak) {
        // Start above the top edge so the streak crosses the frame.
        const x0 = Math.random() * width - dx * height * 0.3;
        const y0 = -40;
        const travel = (height + 80) / Math.max(dy, 0.35);
        return {
          x0,
          y0,
          dx,
          dy,
          length: diag * (0.18 + Math.random() * 0.22),
          travel,
          speed: travel / (380 + Math.random() * 420),
          born: now - age,
          life: 2200 + Math.random() * 2200,
          width: 1.1 + Math.random() * 1.0,
          color: pickColor(),
          kind: "streak",
        };
      }
      const len = 14 + Math.random() * Math.min(110, diag * 0.06);
      return {
        x0: Math.random() * width,
        y0: Math.random() * height,
        dx,
        dy,
        length: len,
        travel: len,
        speed: len / 60,
        born: now - age,
        life: 1400 + Math.random() * 2200,
        width: 1.3 + Math.random() * 1.3,
        color: pickColor(),
        kind: "hit",
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, rect.width < 640 ? 1.5 : 1.75);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawTrack = (t: Track, now: number) => {
      const age = now - t.born;
      const headDist = Math.min(age * t.speed, t.travel);
      const headDone = age * t.speed >= t.travel;
      const doneAt = t.travel / t.speed;
      const fade = headDone ? Math.max(0, 1 - (age - doneAt) / t.life) : 1;
      if (fade <= 0) return false;
      const tailDist = Math.max(0, headDist - t.length);
      const hx = t.x0 + t.dx * headDist;
      const hy = t.y0 + t.dy * headDist;
      const tx = t.x0 + t.dx * tailDist;
      const ty = t.y0 + t.dy * tailDist;

      const ease = Math.pow(fade, 1.6);
      // Glow pass: wide and faint. Core pass: thin and bright, brightest at head.
      const g = ctx.createLinearGradient(tx, ty, hx, hy);
      g.addColorStop(0, `rgb(${t.color} / 0)`);
      g.addColorStop(1, `rgb(${t.color} / ${0.3 * ease})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = t.width * (t.kind === "hit" ? 2.6 : 6);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      const c = ctx.createLinearGradient(tx, ty, hx, hy);
      c.addColorStop(0, `rgb(${t.color} / 0)`);
      c.addColorStop(0.4, `rgb(${t.color} / ${0.6 * ease})`);
      c.addColorStop(1, `rgb(${t.color} / ${ease})`);
      ctx.strokeStyle = c;
      ctx.lineWidth = t.width;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      if (!headDone && t.kind === "streak") {
        ctx.fillStyle = `rgb(${t.color} / 0.9)`;
        ctx.beginPath();
        ctx.arc(hx, hy, t.width * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      return true;
    };

    const render = (now: number) => {
      // The frame counter ticks at ~12 Hz, like a sensor reading out frames.
      if (now - lastFrame > 83) {
        lastFrame = now;
        frame += 1;
        if (frameEl) frameEl.textContent = String(frame).padStart(6, "0");
      }
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      tracks = tracks.filter((t) => drawTrack(t, now));
    };

    const loop = (now: number) => {
      if (!running) return;
      // Clamp big gaps (e.g. returning to the tab) so tracks don't jump.
      if (now - last > 250) nextSpawn = now + 200;
      last = now;
      if (now >= nextSpawn) {
        tracks.push(spawn(now));
        events += 1;
        if (eventEl) eventEl.textContent = String(events).padStart(4, "0");
        // Poisson-ish arrivals, ~1.6 per second, sparser on small screens.
        const rate = width < 640 ? 1 : 1.6;
        nextSpawn = now + (-Math.log(1 - Math.random()) * 1000) / rate;
      }
      render(now);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced.matches || !visible || document.hidden) return;
      running = true;
      if (host) host.dataset.running = "true";
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (host) host.dataset.running = "false";
      cancelAnimationFrame(raf);
    };

    const stillFrame = () => {
      // A single frame with a few tracks frozen mid-fade.
      const now = performance.now();
      tracks = [];
      for (let i = 0; i < 7; i++) {
        const t = spawn(now);
        t.born = now - t.travel / t.speed - Math.random() * t.life * 0.5;
        tracks.push(t);
      }
      render(now);
    };

    resize();
    // Seed a few tracks so the first frame is never empty.
    const t0 = performance.now();
    for (let i = 0; i < 6; i++) {
      const t = spawn(t0);
      t.born = t0 - t.travel / t.speed - Math.random() * t.life * 0.6;
      tracks.push(t);
    }
    events = tracks.length;
    render(t0);
    if (reduced.matches) stillFrame();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) {
        if (reduced.matches) stillFrame();
        else render(performance.now());
      }
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionChange = () => {
      if (reduced.matches) {
        stop();
        stillFrame();
      } else start();
    };
    reduced.addEventListener("change", onMotionChange);

    // Re-read colors when the theme changes.
    const mo = new MutationObserver(() => {
      palette = readPalette();
      tracks.forEach((t) => (t.color = palette.track));
      if (!running) {
        if (reduced.matches) stillFrame();
        else render(performance.now());
      }
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Start once the page has loaded and the browser is idle, so the canvas
    // never competes with the first paint.
    const hasIdle = typeof window.requestIdleCallback === "function";
    let idle: number | ReturnType<typeof setTimeout> = 0;
    const schedule = () => {
      idle = hasIdle
        ? window.requestIdleCallback(start, { timeout: 2000 })
        : globalThis.setTimeout(start, 600);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("load", schedule);
      reduced.removeEventListener("change", onMotionChange);
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else globalThis.clearTimeout(idle);
    };
  }, [frameCounterId, eventCounterId]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
