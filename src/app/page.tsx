import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import SpeedReadout from "@/components/SpeedReadout";
import TrackDivider from "@/components/motion/TrackDivider";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Leadership from "@/components/sections/Leadership";
import Projects from "@/components/sections/Projects";
import Research from "@/components/sections/Research";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <TrackDivider variant={0} label="μ⁻ → e⁻ ν̄ₑ ν_μ" />
        <About />
        <TrackDivider variant={1} />
        <Experience />
        <TrackDivider variant={2} label="v ↓" />
        <Projects />
        <TrackDivider variant={0} />
        <Research />
        <TrackDivider variant={1} />
        <Leadership />
        <TrackDivider variant={2} label="→ c" />
        <Contact />
      </main>
      <SpeedReadout />
    </>
  );
}
