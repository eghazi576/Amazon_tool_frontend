import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import GraphPreview from "@/components/landing/GraphPreview";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/Seo";
import { softwareApplicationSchema } from "@/lib/jsonld";
import { routeMeta } from "@/lib/routes.js";

const meta = routeMeta("/");

const Index = () => (
  <div className="relative min-h-screen bg-background font-sans text-foreground overflow-x-hidden">

    {/* No FAQPage schema here. Ten of the homepage's questions are also on /faq,
        and publishing the same Q&A as structured data on two URLs invites Google
        to treat one as a duplicate. /faq owns the schema; this section keeps the
        visible copy and links there. */}
    <Seo
      title={meta.title}
      description={meta.description}
      path={meta.path}
      jsonLd={softwareApplicationSchema}
    />

    {/* ── Fixed background — composited GPU layer, never repaints on scroll ── */}
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, transform: "translateZ(0)", willChange: "transform" }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 grid-pattern" />

      {/* Aurora — single animated element, isolated layer */}
      <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 aurora opacity-30" />

      {/* Static orbs — no animation, just ambient color blobs */}
      <div className="absolute left-[5%]   top-[8%]  h-64 w-64 rounded-full bg-primary/8   blur-3xl" />
      <div className="absolute right-[4%]  top-[25%] h-52 w-52 rounded-full bg-secondary/8 blur-3xl" />
      <div className="absolute left-[18%] top-[55%]  h-40 w-40 rounded-full bg-accent/6    blur-2xl" />
      <div className="absolute right-[15%] top-[72%] h-44 w-44 rounded-full bg-primary/6   blur-2xl" />

      {/* SVG — static lines only, no SMIL animations */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bgBeam1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="hsl(263,85%,65%)" stopOpacity="0" />
            <stop offset="45%"  stopColor="hsl(263,85%,65%)" stopOpacity="0.10" />
            <stop offset="55%"  stopColor="hsl(217,91%,60%)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(190,95%,55%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bgBeam2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="hsl(190,95%,55%)" stopOpacity="0" />
            <stop offset="50%"  stopColor="hsl(190,95%,55%)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(263,85%,65%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Diagonal beams — static */}
        <line x1="-5%"  y1="0" x2="55%"  y2="100%" stroke="url(#bgBeam1)" strokeWidth="100" />
        <line x1="105%" y1="0" x2="45%"  y2="100%" stroke="url(#bgBeam2)" strokeWidth="70" />
        <line x1="30%"  y1="0" x2="85%"  y2="100%" stroke="url(#bgBeam1)" strokeWidth="35" opacity="0.4" />
        <line x1="70%"  y1="0" x2="15%"  y2="100%" stroke="url(#bgBeam2)" strokeWidth="25" opacity="0.3" />

        {/* Horizontal accent lines — static dashes */}
        {[15, 42, 70].map((y, i) => (
          <line key={`h${i}`}
            x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
            stroke="hsl(263,85%,65%)"
            strokeWidth="1"
            strokeDasharray="12 10"
            opacity="0.07"
          />
        ))}

        {/* Vertical accent lines — static */}
        {[8, 22, 78, 92].map((x, i) => (
          <line key={`v${i}`}
            x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%"
            stroke={i < 2 ? "hsl(263,85%,65%)" : "hsl(190,95%,55%)"}
            strokeWidth="0.5" strokeDasharray="6 10" opacity="0.08"
          />
        ))}
      </svg>
    </div>

    {/* ── All page content — z-10, always in front of background ── */}
    <div className="relative" style={{ zIndex: 10 }}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <GraphPreview />
        <HowItWorks />
        <Benefits />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>

  </div>
);

export default Index;
