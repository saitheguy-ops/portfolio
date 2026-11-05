# Things that move fast

Personal site of Samarth Abhisheak (Penn SEAS, B.S.E. Computer Science, 2030). It's a scroll through speeds, from muons at 0.998c down to a 15-minute focus sprint. A small readout in the corner tracks where you are on a log-scale speed rail.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Motion and Lenis. It is exported as a fully static site, with no backend and no API keys.

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static site in ./out
```

## Edit the content

All copy lives in **[`src/content.ts`](src/content.ts)**: hero, about, experience, projects, research, leadership, skills, contact and links. No component needs to change.

- Leave a project link as `""` to hide its **Code** or **Live** button. `codeNote` is shown when there is no code link.
- Each section, job and project has a `readout`: a `label` and `caption` for the corner readout, and `v` (a speed in m/s) that places the marker on the rail.
- `site.url` is used for link previews and the sitemap. Set it to your real domain. On Vercel, the production URL is used automatically.

## Replace images and the resume

Images are in `public/images/`. Drop in a file with the **same name** to replace one, or use any name and update its path in `src/content.ts`.

| File | Used for | Shape |
| --- | --- | --- |
| `headshot.jpg` | About | 4:5 portrait |
| `cosmic-ray-detector.jpg` | Cosmic Ray Detector card | 16:10 |
| `eclipse-data.png` | Inset on the detector card | ~16:10 |
| `vex-robot.jpg` | VEX Robotics card | 16:10 |
| `joby.webp`, `finance-assistant.webp`, `sprint.webp` | Project cards (from each repo's `docs/screenshots`) | 16:10 |

The current headshot, detector, eclipse and robot images are on-theme placeholders that name the file they stand in for. Cards crop to 16:10 from the top. Keep photos around 1600 px wide and under ~250 KB (JPEG or WebP) so pages stay fast. If a file is missing, the card shows a styled placeholder instead of a broken image.

**Resume:** replace `public/resume.pdf` (currently a placeholder) with a version that has no phone number or address. The Contact section's Resume button links to it.

## Deploy on Vercel (free tier)

1. Push this repo to GitHub, then in Vercel choose **Add New → Project** and import it. The Next.js preset works as is: the build command is `npm run build` and `next.config.ts` sets `output: "export"`.
2. **Custom domain:** in the project, go to **Settings → Domains**, add your domain (e.g. `samarth.dev`), and set the DNS records Vercel shows at your registrar (an `A` record for the apex, a `CNAME` for `www`). HTTPS is automatic.
3. Set `site.url` in `src/content.ts` to the domain and push again.

`vercel.json` only sets the content type for the generated Open Graph image. The `out/` folder also works on any static host.

## Notes on choices made

- **Speed journey:** sections run from fast to slow, and every readout pairs a label with a real speed: muons ≈ 0.998c, the Sun's galactic orbit ≈ 220 km/s, an eVTOL ≈ 320 km/h, a badminton smash ≈ 90 m/s, a walk down Locust Walk ≈ 1.4 m/s. Readouts that aren't speeds (τ ≈ 10⁻¹² s, Δt ≈ 1 ms) place the rail at the speed of the thing involved: carriers in a semiconductor, or a signal in fiber.
- **Research figures are schematic.** They are drawn from model curves (a bi-exponential decay, and a flat rotation curve vs. a Keplerian falloff), not measured data, and are labeled that way.
- **Theme:** dark ("detector dark") is the default whatever the OS setting, and the toggle remembers your choice. The light theme reads as a bubble-chamber print: dark tracks on warm paper.
- **Fonts:** Instrument Serif (display), Hanken Grotesk (body) and JetBrains Mono (readouts; chosen because it has Greek glyphs for μ, τ, Δ), all self-hosted with `next/font`. Only the serif is preloaded.
- **Motion:** the hero canvas pauses when off-screen or in a hidden tab. Its sensor noise is a CSS layer moved on the compositor. Animations use only transform and opacity. With `prefers-reduced-motion`, there's no Lenis, no pinning and no movement: the hero is a still frame, reveals are fades, and counters show their final values.
- **Pinned projects** run only on screens at least 1024 × 640 px. Smaller screens get a vertical stack.
- **Measured locally** (Lighthouse, production build, gzip server): performance 94 on mobile and 100 on desktop; accessibility, best practices and SEO 100.
