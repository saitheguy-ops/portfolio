import { hero, site } from "@/content";
import MuonField from "./MuonField";
import { Magnetic } from "./motion/Tilt";

export default function Hero() {
  const words = hero.line.split(" ");
  const lastWord = words.pop();

  return (
    <section
      id="top"
      data-readout="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[640px] flex-col overflow-hidden h-svh"
    >
      <MuonField frameCounterId="hero-frame" eventCounterId="hero-events" />
      {/* Soft falloff so text stays legible over the field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_100%,var(--bg)_0%,transparent_60%)] opacity-90"
      />

      {/* Instrument annotations */}
      <div
        aria-hidden="true"
        className="fade-in pointer-events-none absolute right-5 top-20 hidden text-right font-mono text-[0.625rem] uppercase leading-5 tracking-[0.16em] text-muted sm:block sm:right-8 lg:right-12"
        style={{ "--d": "900ms" } as React.CSSProperties}
      >
        {hero.annotations.map((a) => (
          <p key={a}>{a}</p>
        ))}
        <p className="tabular">
          frame <span id="hero-frame">000000</span> · events <span id="hero-events">0000</span>
        </p>
      </div>

      <div className="relative mx-auto mt-auto w-full max-w-[90rem] px-5 pb-24 sm:px-8 sm:pb-44 lg:px-12">
        <p className="label rise-line">
          <span style={{ "--d": "100ms" } as React.CSSProperties}>{hero.eyebrow}</span>
        </p>
        <h1
          id="hero-title"
          className="display mt-5 text-[clamp(3.5rem,16vw,6.5rem)] text-ink sm:text-[clamp(4rem,11.5vw,11.5rem)]"
        >
          {site.name.split(" ").map((part, i) => (
            <span key={part} className="rise-line">
              <span style={{ "--d": `${180 + i * 110}ms` } as React.CSSProperties}>{part}</span>
            </span>
          ))}
        </h1>
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="rise-line font-display text-[clamp(1.6rem,3.2vw,2.75rem)] leading-tight text-ink-soft">
            <span style={{ "--d": "460ms" } as React.CSSProperties}>
              {words.join(" ")} <em className="text-accent">{lastWord}</em>
            </span>
          </p>
          <ul
            className="fade-in flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-[0.14em]"
            style={{ "--d": "700ms" } as React.CSSProperties}
          >
            <li>
              <Magnetic strength={0.3}>
                <a className="link-track" href={site.links.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </Magnetic>
            </li>
            <li>
              <Magnetic strength={0.3}>
                <a
                  className="link-track"
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </Magnetic>
            </li>
            <li>
              <Magnetic strength={0.3}>
                <a className="link-track" href={`mailto:${site.email}`}>
                  Email
                </a>
              </Magnetic>
            </li>
          </ul>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="fade-in absolute bottom-6 right-5 hidden font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted sm:right-8 sm:block lg:right-12"
        style={{ "--d": "1200ms" } as React.CSSProperties}
      >
        {hero.scrollHint} ↓
      </p>
    </section>
  );
}
