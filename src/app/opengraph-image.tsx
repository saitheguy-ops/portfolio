import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, site } from "@/content";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const font = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

// Fixed "random" tracks so the image is the same on every build.
const TRACKS = [
  { x: 820, y: -60, len: 420, angle: 72, color: "#5cc6ff", w: 2.5 },
  { x: 1010, y: 40, len: 260, angle: 101, color: "#ebe8e1", w: 1.6 },
  { x: 640, y: 120, len: 150, angle: 64, color: "#ebe8e1", w: 1.4 },
  { x: 1090, y: 300, len: 210, angle: 84, color: "#5cc6ff", w: 1.6 },
  { x: 930, y: 360, len: 90, angle: 118, color: "#ffa45c", w: 2 },
  { x: 720, y: 430, len: 120, angle: 76, color: "#ebe8e1", w: 1.2 },
];

export default async function Image() {
  const [serif, serifItalic, mono, monoGreek] = await Promise.all([
    font("instrument-serif", "instrument-serif-latin-400-normal.woff"),
    font("instrument-serif", "instrument-serif-latin-400-italic.woff"),
    font("jetbrains-mono", "jetbrains-mono-latin-400-normal.woff"),
    font("jetbrains-mono", "jetbrains-mono-greek-400-normal.woff"),
  ]);
  const words = site.tagline.split(" ");
  const last = words.pop();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "64px 72px",
        background: "radial-gradient(circle at 80% 20%, #10141a 0%, #07080a 60%)",
        color: "#ebe8e1",
        position: "relative",
      }}
    >
      {TRACKS.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            width: t.len,
            height: t.w,
            borderRadius: t.w,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${t.color})`,
            transform: `rotate(${t.angle}deg)`,
            transformOrigin: "0 50%",
            boxShadow: `0 0 12px ${t.color}`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 72,
          display: "flex",
          fontFamily: "Mono",
          fontSize: 20,
          letterSpacing: 3,
          color: "#8d919a",
        }}
      >
        {hero.eyebrow.toUpperCase()}
      </div>
      <div style={{ display: "flex", fontFamily: "Serif", fontSize: 132, lineHeight: 1 }}>
        {site.name}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 20,
          fontFamily: "Serif",
          fontSize: 54,
          color: "#c5c3bd",
        }}
      >
        {words.join(" ")}&nbsp;
        <span style={{ fontStyle: "italic", color: "#5cc6ff" }}>{last}</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 40,
          paddingTop: 22,
          borderTop: "1px solid rgba(235,232,225,0.18)",
          justifyContent: "space-between",
          fontFamily: "Mono",
          fontSize: 22,
          color: "#8d919a",
        }}
      >
        <span style={{ color: "#ebe8e1" }}>{hero.readout.label}</span>
        <span>{hero.readout.caption}</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Serif", data: serif, style: "normal", weight: 400 },
        { name: "Serif", data: serifItalic, style: "italic", weight: 400 },
        { name: "Mono", data: mono, style: "normal", weight: 400 },
        { name: "Mono", data: monoGreek, style: "normal", weight: 400 },
      ],
    },
  );
}
