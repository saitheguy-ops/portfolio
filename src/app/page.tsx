import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import SpeedReadout from "@/components/SpeedReadout";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <div data-readout="about" className="h-[150vh]" />
      </main>
      <SpeedReadout />
    </>
  );
}
