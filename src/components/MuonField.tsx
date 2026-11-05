"use client";

import { useEffect, useRef } from "react";

/**
 * A dark, faintly noisy detector field with sparse muon tracks.
 *
 * - Tracks are either long streaks that cross the frame fast (a bright head
 *   with a fading tail) or short CMOS-style hits that flash and decay.
 * - The noise is a small pre-rendered tile, re-offset at ~12 Hz like a sensor
 *   reading out frames, so it costs one pattern fill per frame.
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

type Palette = { track: string; accent: string; signal: string; field: string };

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) =>
    s.getPropertyValue(name).trim().replace(/\s+/g, " ") || fallback;
  return {
    track: get("--track", "235 245 255"),
    accent: get("--track-accent", "92 198 255"),
    signal: get("--track-signal", "255 164 92"),
    field: get("--field", "7 8 10"),
  };
}

function makeNoiseTile(field: string, light: boolean): HTMLCanvasElement {
  const size = 192;
  const tile = document.createElement("canvas");
  tile.width = tile.height = size;
  const ctx = tile.getContext("2d");
  if (!ctx) return tile;
  const img = ctx.createImageData(size, size);
  const [fr, fg, fb] = field.split(" ").map(Number);
  for (let i = 0; i < img.data.length; i += 4) {
    // Mostly faint read noise, with rare brighter (or darker) pixels.
    const r = Math.random();
    const n = r > 0.9985 ? 70 + Math.random() * 90 : Math.random() * 14;
    const v = light ? -n * 0.6 : n;
    img.data[i] = fr + v;
    img.data[i + 1] = fg + v;
    img.data[i + 2] = fb + v * 1.08;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return tile;
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
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frameEl = frameCounterId ? document.getElementById(frameCounterId) : null;
    const eventEl = eventCounterId ? document.getElementById(eventCounterId) : null;

    let palette = readPalette();
    let light = document.documentElement.dataset.theme === "light";
    let tile = makeNoiseTile(palette.field, light);
    let pattern = ctx.createPattern(tile, "repeat");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let tracks: Track[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let nextSpawn = 0;
    let noiseX = 0;
    let noiseY = 0;
    let lastNoise = 0;
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
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawField = () => {
      ctx.fillStyle = `rgb(${palette.field})`;
      ctx.fillRect(0, 0, width, height);
      if (pattern) {
        ctx.save();
        // Draw the noise tile at device-pixel scale so it reads as sensor grain.
        ctx.scale(1 / dpr, 1 / dpr);
        ctx.translate(noiseX, noiseY);
        ctx.fillStyle = pattern;
        ctx.globalAlpha = light ? 0.55 : 0.9;
        ctx.fillRect(-noiseX, -noiseY, width * dpr, height * dpr);
        ctx.restore();
      }
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
      if (now - lastNoise > 83) {
        lastNoise = now;
        noiseX = Math.floor(Math.random() * 192);
        noiseY = Math.floor(Math.random() * 192);
        frame += 1;
        if (frameEl) frameEl.textContent = String(frame).padStart(6, "0");
      }
      drawField();
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
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
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
      light = document.documentElement.dataset.theme === "light";
      tile = makeNoiseTile(palette.field, light);
      pattern = ctx.createPattern(tile, "repeat");
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

    // Start after the browser is idle so the canvas never competes with load.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 1200 })
      : globalThis.setTimeout(start, 300);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionChange);
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else globalThis.clearTimeout(idle);
    };
  }, [frameCounterId, eventCounterId]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
