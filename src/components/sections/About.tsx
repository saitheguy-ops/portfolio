import { about, site } from "@/content";
import SafeImage from "../SafeImage";
import SectionHeader from "../SectionHeader";
import { Reveal, Wipe } from "../motion/Reveal";

export default function About() {
  const [lead, ...rest] = about.paragraphs;
  return (
    <section
      id="about"
      data-readout="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <SectionHeader index="01" label="About" title={about.heading} id="about-title" />

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        <figure className="lg:col-span-3">
          <Wipe className="frame-marks max-w-[18rem] !overflow-visible">
            <SafeImage
              src={about.headshot.src}
              alt={about.headshot.alt}
              width={800}
              height={1000}
              imgClassName="grayscale-[0.2]"
            />
          </Wipe>
          <figcaption className="mt-4 font-mono text-[0.625rem] uppercase leading-5 tracking-[0.14em] text-muted">
            <span className="block text-ink-soft">{site.name}</span>
            {site.school}
          </figcaption>
        </figure>

        <div className="lg:col-span-8 lg:col-start-5">
          <Reveal>
            <p className="font-display text-[clamp(1.75rem,3vw,2.6rem)] leading-[1.15] text-ink">
              {lead}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 text-[1.0625rem] leading-relaxed text-ink-soft md:grid-cols-2 md:gap-10">
            {rest.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
