import { projects, projectsIntro } from "@/content";
import ProjectCard from "../ProjectCard";
import ProjectsTrack from "../ProjectsTrack";
import SectionHeader from "../SectionHeader";
import { Reveal } from "../motion/Reveal";
import { Tilt } from "../motion/Tilt";

export default function Projects() {
  const intro = (
    <SectionHeader
      index="03"
      label="Projects"
      title={projectsIntro.heading}
      id="projects-title"
      aside={<p className="max-w-xl text-lg text-ink-soft">{projectsIntro.body}</p>}
    />
  );
  const cards = projects.map((p, i) => (
    <Reveal key={p.id} className="h-full">
      <Tilt className="h-full">
        <ProjectCard project={p} index={i} total={projects.length} />
      </Tilt>
    </Reveal>
  ));

  return (
    <section id="projects" data-readout="projects" aria-labelledby="projects-title">
      <ProjectsTrack intro={intro} cards={cards} />
    </section>
  );
}
