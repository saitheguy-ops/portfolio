import {
  about,
  contact,
  experience,
  hero,
  leadership,
  projects,
  projectsIntro,
  research,
  skills,
  type Readout,
} from "@/content";

/** Every readout on the page, keyed by the `data-readout` id that shows it. */
export const readouts: Record<string, Readout> = {
  hero: hero.readout,
  about: about.readout,
  ...Object.fromEntries(experience.map((e) => [e.id, e.readout])),
  projects: projectsIntro.readout,
  ...Object.fromEntries(projects.map((p) => [p.id, p.readout])),
  ...Object.fromEntries(research.map((r) => [r.id, r.readout])),
  leadership: leadership.readout,
  skills: skills.readout,
  contact: contact.readout,
};

/** Rail range, in log10(m/s): 0.1 m/s … c. */
export const RAIL_MIN = -1;
export const RAIL_MAX = Math.log10(299_792_458);

export function railPosition(v: number) {
  const x = (Math.log10(Math.max(v, 1e-3)) - RAIL_MIN) / (RAIL_MAX - RAIL_MIN);
  return Math.min(1, Math.max(0, x));
}
