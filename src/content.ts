/**
 * All of the site's copy lives in this file.
 *
 * Edit text, links and images here; no component needs to change.
 * - Leave a link as "" to hide its button (e.g. `live: ""`).
 * - Image paths point into /public (e.g. "/images/vex-robot.jpg").
 * - `readout` entries drive the fixed speed readout in the corner. Each one
 *   has a display label and `v`, a speed in m/s that places the marker on the
 *   log-scale rail (10⁻¹ m/s … c).
 */

export type Readout = {
  /** Big monospace value, e.g. "μ → 0.998c". */
  label: string;
  /** Small caption under the value. */
  caption: string;
  /** Characteristic speed in m/s, used for the rail position. */
  v: number;
};

export type Link = { label: string; href: string };

export type Experience = {
  id: string;
  org: string;
  role: string;
  dates: string;
  location?: string;
  summary: string;
  bullets: string[];
  note?: string;
  readout: Readout;
};

export type Stat = {
  /** Number to count up to. */
  value: number;
  /** Text after the number, e.g. "M+" or "%". */
  suffix?: string;
  /** Text before the number, e.g. "". */
  prefix?: string;
  label: string;
};

export type Project = {
  id: string;
  title: string;
  /** One-line role or context, shown above the title. */
  kicker: string;
  /** Two sentences. */
  description: string;
  tags: string[];
  /** The speed / scale the project belongs to. */
  scale: string;
  image: { src: string; alt: string };
  /** Optional small inset image shown over the corner of the main one. */
  inset?: { src: string; alt: string };
  links: { code: string; live: string };
  /** Shown when there is no code link, e.g. "coming soon". */
  codeNote?: string;
  stats?: Stat[];
  readout: Readout;
};

export type Research = {
  id: string;
  org: string;
  role: string;
  dates: string;
  title: string;
  description: string;
  details: string[];
  advisors?: string;
  /** Which small figure to draw next to the entry. */
  figure: "decay" | "rotation";
  readout: Readout;
};

export const site = {
  name: "Samarth Abhisheak",
  shortName: "Samarth",
  tagline: "I build things that move fast.",
  /** Used for <title>, search results and link previews. */
  description:
    "Samarth Abhisheak: Computer Science at Penn. Software, physics and finance, from picosecond carrier lifetimes to muons at 0.998c.",
  /** Change this to your real domain once it is set up. */
  url: "https://samarth-abhisheak.vercel.app",
  school: "University of Pennsylvania · B.S.E. Computer Science · 2030",
  email: "samarthabhi2210@gmail.com",
  links: {
    github: "https://github.com/saitheguy-ops",
    linkedin: "https://linkedin.com/in/samarth-abhisheak-b896a2321",
    resume: "/resume.pdf",
  },
};

export const nav: Link[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Penn Engineering · CS '30",
  title: site.name,
  line: site.tagline,
  scrollHint: "Scroll to slow down",
  readout: {
    label: "μ → 0.998c",
    caption: "cosmic-ray muon, sea level",
    v: 2.992e8,
  } satisfies Readout,
  /** Small instrument annotations around the hero canvas. */
  annotations: ["CMOS · dark-frame subtracted", "exp 1/30 s", "frame ∞"],
};

export const about = {
  heading: "Fast things, measured carefully.",
  paragraphs: [
    "I'm a Computer Science student at Penn who likes building things that move fast and measuring things that move faster.",
    "I came to software through physics: first a pump–probe laser setup timing electrons in quantum dots, then a radio telescope weighing the Milky Way, then a Raspberry Pi in a club room counting muons during a solar eclipse. Every one of those experiments ended up being a software problem, and I found I loved that part most.",
    "Now I write code for data pipelines, robots and markets, and I still care about the same thing: getting the numbers right when everything is moving.",
  ],
  headshot: {
    src: "/images/headshot.jpg",
    alt: "Portrait of Samarth Abhisheak",
  },
  readout: {
    label: "v ≈ 1.4 m/s",
    caption: "walking down Locust Walk",
    v: 1.4,
  } satisfies Readout,
};

export const experience: Experience[] = [
  {
    id: "invita",
    org: "InVita Healthcare Technologies",
    role: "AI Summer Intern",
    dates: "Jun – Aug 2026",
    summary:
      "Built the pipeline that moves InVita's legacy donor data into production.",
    bullets: [
      "Built a Git-tracked SQL ETL pipeline that parses, cleans and validates 1M+ legacy donor records in under a second; it now runs in production.",
      "InVita's software serves 1,300+ healthcare organizations in 30+ countries.",
      "Built a dashboard so non-technical coordinators can run the pipeline themselves.",
      "Reported directly to the CTO.",
    ],
    note: "Proprietary: no public code.",
    readout: {
      label: "10⁶ rows < 1 s",
      caption: "legacy records, parsed + validated",
      v: 2.0e8,
    },
  },
  {
    id: "kindling",
    org: "Johns Hopkins Kindling Venture Program",
    role: "Venture Fellow",
    dates: "Feb – Jun 2026",
    summary:
      "Customer discovery and pitch validation for AI-enabled optical detection that gives EMTs real-time situational awareness.",
    bullets: [
      "Ran customer discovery to learn what EMTs need to see before and during a call.",
      "Validated and sharpened the venture's pitch against what we heard.",
    ],
    readout: {
      label: "v ≈ 30 m/s",
      caption: "an ambulance, en route",
      v: 30,
    },
  },
];

export const experienceStats: Stat[] = [
  { value: 1, suffix: "M+", label: "donor records per run" },
  { value: 1300, suffix: "+", label: "healthcare organizations" },
  { value: 30, suffix: "+", label: "countries" },
];

export const projectsIntro = {
  heading: "Projects, from 0.998c down to a 15-minute sprint.",
  body: "Five things I've built, ordered by how fast the thing they measure or move goes.",
};

export const projects: Project[] = [
  {
    id: "cosmic",
    title: "CMOS Cosmic Ray Detector",
    kicker: "Founder, Cosmic Ray Club",
    description:
      "A muon detector made from a Raspberry Pi 5 and a CMOS camera, with a Python/C++ pipeline that uses dark-frame subtraction to pull particle tracks out of sensor noise. We measured cosmic-ray flux during the April 2024 total solar eclipse, shared the data with a university in Japan, and presented it to QuarkNet and Johns Hopkins.",
    tags: ["Python", "C++", "Raspberry Pi 5", "CMOS", "image processing"],
    scale: "0.998c · cosmic",
    image: {
      src: "/images/cosmic-ray-detector.jpg",
      alt: "The Raspberry Pi 5 and CMOS camera cosmic-ray detector",
    },
    inset: {
      src: "/images/eclipse-data.png",
      alt: "Cosmic-ray flux measured during the April 2024 solar eclipse",
    },
    links: { code: "", live: "" },
    codeNote: "Code held locally on my Raspberry Pi. Coming soon.",
    readout: {
      label: "Φ ≈ 1 μ/cm²/min",
      caption: "muon flux at sea level",
      v: 2.992e8,
    },
  },
  {
    id: "vex",
    title: "VEX Robotics",
    kicker: "Captain, Main Programmer & Driver · 7+ seasons",
    description:
      "I rebuilt our autonomous code from scripted motion to odometry-based position tracking with path-following and path-finding. I was primary driver at the VEX World Championship, where we qualified four times.",
    tags: ["C++", "odometry", "path following", "path finding"],
    scale: "≈ 2 m/s · robots",
    image: {
      src: "/images/vex-robot.jpg",
      alt: "Our VEX competition robot",
    },
    links: { code: "", live: "" },
    codeNote: "Code coming soon.",
    stats: [
      { value: 4, suffix: "×", label: "Worlds qualifier" },
      { value: 80, suffix: "%", label: "avg. win rate" },
    ],
    readout: {
      label: "v ≈ 2 m/s",
      caption: "drivetrain at full tilt",
      v: 2,
    },
  },
  {
    id: "joby",
    title: "JOBY Stock Pitch Builder",
    kicker: "Equity research, automated",
    description:
      "A fully sourced investment pitch on Joby Aviation, a pre-revenue air-taxi company, built from SEC EDGAR filings and market data. It values the company with a scenario DCF and a reverse DCF, and produces an analyst briefing that refreshes on request.",
    tags: ["Next.js", "TypeScript", "Recharts", "SEC EDGAR"],
    scale: "≈ 320 km/h · air taxis",
    image: {
      src: "/images/joby.png",
      alt: "Screenshot of the JOBY Stock Pitch Builder briefing page",
    },
    links: {
      code: "https://github.com/saitheguy-ops/joby-stock-pitch",
      live: "",
    },
    readout: {
      label: "v ≈ 320 km/h",
      caption: "eVTOL air taxi, cruise",
      v: 89,
    },
  },
  {
    id: "finance",
    title: "AI Finance Assistant",
    kicker: "Jarvis for stock research",
    description:
      "A chat assistant for stock research that answers with live quotes, charts and news, and can paper-trade on command. It uses tool calls for every number, so it never makes up a price.",
    tags: ["Next.js", "TypeScript", "Claude API", "tool use"],
    scale: "Δt ≈ 1 ms · markets",
    image: {
      src: "/images/finance-assistant.png",
      alt: "Screenshot of the AI Finance Assistant chat",
    },
    links: {
      code: "https://github.com/saitheguy-ops/ai-finance-assistant",
      live: "",
    },
    readout: {
      label: "Δt ≈ 1 ms",
      caption: "one market-data tick",
      v: 2.0e8,
    },
  },
  {
    id: "sprint",
    title: "Sprint",
    kicker: "A focus app",
    description:
      "A mobile-first focus app built around short, timed sprints: pick one task, start the countdown, and build a streak. It's built on the idea that starting is the hard part, and a running clock makes starting easier.",
    tags: ["Next.js", "Supabase", "Prisma", "mobile-first"],
    scale: "Δt = 15 min · focus",
    image: {
      src: "/images/sprint.png",
      alt: "Screenshots of the Sprint focus app",
    },
    links: { code: "https://github.com/saitheguy-ops/sprint", live: "" },
    readout: {
      label: "Δt = 15 min",
      caption: "one sprint, sitting still on purpose",
      v: 0.1,
    },
  },
];

export const research: Research[] = [
  {
    id: "umbc",
    org: "UMBC",
    role: "Physics Researcher",
    dates: "Feb – Sep 2023",
    title: "Picosecond carriers in CsPbI₃ quantum dots",
    description:
      "Transient absorption spectroscopy of CsPbI₃ quantum dots: a pump pulse excites the dots, a delayed probe pulse watches them relax, and the decay gives carrier lifetimes on the scale of picoseconds.",
    details: [
      "Pump–probe measurements of carrier dynamics",
      "Chirp correction and multi-exponential fits",
    ],
    advisors: "Advised by Profs. Rachel Gelfand and Juzar Thingna",
    figure: "decay",
    readout: {
      label: "τ ≈ 10⁻¹² s",
      caption: "carrier lifetime, CsPbI₃ QDs",
      v: 1.0e5,
    },
  },
  {
    id: "jhu",
    org: "Johns Hopkins",
    role: "Advanced Physics Research Student",
    dates: "Jul 2024 – Sep 2025",
    title: "Weighing the Milky Way with a radio telescope",
    description:
      "I mapped the Milky Way's rotation curve with a Small Radio Telescope, using Doppler shifts of the 21-cm hydrogen line. The curve stays flat far from the center, where visible matter alone says it should fall: evidence for dark matter.",
    details: [
      "Doppler shifts of the 21-cm H I line",
      "Rotation curve vs. a Keplerian falloff",
    ],
    figure: "rotation",
    readout: {
      label: "v ≈ 220 km/s",
      caption: "the Sun's orbit around the galaxy",
      v: 2.2e5,
    },
  },
];

export const leadership = {
  heading: "Leadership & honors",
  roles: [
    { title: "CS Club", detail: "President" },
    {
      title: "Mu Alpha Theta",
      detail: "President · peer tutoring for 400+ students",
    },
    { title: "Varsity Badminton", detail: "Captain" },
  ],
  honors: [
    { title: "JHU Future Scholar", detail: "1 of 10 statewide" },
    { title: "Carson Scholar", detail: "3×" },
    { title: "Chess Team Championship", detail: "Gold, 4×" },
    { title: "Physics Olympics", detail: "Gold" },
  ],
  readout: {
    label: "v ≈ 90 m/s",
    caption: "a badminton smash, off the racquet",
    v: 90,
  } satisfies Readout,
};

export const skills = {
  heading: "Tools",
  groups: [
    {
      label: "languages",
      items: ["Python", "C++", "Java", "SQL", "OCaml", "JavaScript", "HTML/CSS"],
    },
    {
      label: "practice",
      items: [
        "Git",
        "ETL / data validation",
        "data analysis",
        "Raspberry Pi",
        "LLMs",
      ],
    },
  ],
  readout: {
    label: "f ≈ 3 GHz",
    caption: "one clock tick ≈ 0.3 ns",
    v: 2.0e8,
  } satisfies Readout,
};

export const contact = {
  heading: "Send me something fast.",
  body: "I'm always happy to talk about software, physics, robots or markets. Email is the quickest way to reach me.",
  readout: {
    label: "v ≈ 0.67c",
    caption: "your email, over fiber",
    v: 2.0e8,
  } satisfies Readout,
};

export const footer = {
  note: "Built with Next.js. No trackers, no cookies.",
};
