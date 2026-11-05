import { contact, footer, site } from "@/content";
import MuonMark from "../MuonMark";
import { Reveal, SplitText } from "../motion/Reveal";

export default function Contact() {
  return (
    <section
      id="contact"
      data-readout="contact"
      aria-labelledby="contact-title"
      className="relative mx-auto max-w-[90rem] px-5 pb-28 pt-20 sm:px-8 sm:pt-24 lg:px-12"
    >
      <p className="label flex items-center gap-3">
        <span className="text-accent">07</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        Contact
      </p>
      <h2 id="contact-title" className="display mt-8 max-w-5xl text-[clamp(3rem,9vw,8.5rem)]">
        <SplitText text={contact.heading} />
      </h2>
      <Reveal delay={0.15}>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">{contact.body}</p>
        <a
          href={`mailto:${site.email}`}
          className="link-track mt-10 break-all font-display text-[clamp(1.6rem,4.2vw,3.5rem)] leading-tight"
        >
          {site.email}
        </a>
        <div className="mt-12 flex flex-wrap gap-3">
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="btn">
            LinkedIn
          </a>
          <a href={site.links.github} target="_blank" rel="noreferrer" className="btn">
            GitHub
          </a>
          <a href={site.links.resume} target="_blank" rel="noreferrer" className="btn btn-accent">
            Resume (PDF)
          </a>
        </div>
      </Reveal>

      <footer className="mt-32 flex flex-col gap-4 border-t border-line pt-8 font-mono text-[0.6875rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3">
          <MuonMark className="size-5 text-ink" />© {new Date().getFullYear()} {site.name}
        </p>
        <p>{footer.note}</p>
      </footer>
    </section>
  );
}
