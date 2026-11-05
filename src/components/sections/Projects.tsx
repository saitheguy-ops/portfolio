import { projects, projectsIntro } from "@/content";
import ProjectCard from "../ProjectCard";
import SectionHeader from "../SectionHeader";
import { Reveal } from "../motion/Reveal";

export default function Projects() {
  return (
    <section
      id="projects"
      data-readout="projects"
      aria-labelledby="projects-title"
      className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <SectionHeader
        index="03"
        label="Projects"
        title={projectsIntro.heading}
        id="projects-title"
        aside={<p className="max-w-xl text-lg text-ink-soft">{projectsIntro.body}</p>}
      />
      <ol className="mt-16 grid gap-20 md:grid-cols-2 md:gap-x-10">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.id}>
            <ProjectCard project={p} index={i} total={projects.length} />
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
