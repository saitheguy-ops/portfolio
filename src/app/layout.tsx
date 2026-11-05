import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { site } from "@/content";
import "./globals.css";

// Fonts are downloaded at build time and self-hosted by next/font.
const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// On Vercel, use the production URL so link previews resolve; otherwise
// fall back to the URL in content.ts.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${site.name}: ${site.tagline}`,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.links.github }],
  keywords: [
    site.name,
    "Penn",
    "University of Pennsylvania",
    "computer science",
    "physics",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    siteName: site.name,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080a" },
    { media: "(prefers-color-scheme: light)", color: "#f1eee7" },
  ],
  colorScheme: "dark light",
};

// Runs before paint so the stored theme never flashes. Dark is the default.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
