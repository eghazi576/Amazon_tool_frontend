import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import GraphPreview from "@/components/landing/GraphPreview";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="relative min-h-screen bg-background font-sans text-foreground overflow-x-hidden">

    {/* ── Global background — absolute, z-0, GPU accelerated ── */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, willChange: "transform", transform: "translateZ(0)" }}
    >

      <div className="absolute inset-0 grid-pattern" />

      {/* Aurora — opacity reduced to cut repaint cost */}
      <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 aurora opacity-35" />

      {/* Orbs — fewer, lower opacity, GPU layers */}
      <div className="absolute left-[5%]   top-[8%]  h-64 w-64 rounded-full bg-primary/8   blur-3xl animate-orb" style={{ willChange: "transform" }} />
      <div className="absolute right-[4%]  top-[25%] h-52 w-52 rounded-full bg-secondary/8 blur-3xl animate-orb" style={{ animationDelay: "-6s", willChange: "transform" }} />
      <div className="absolute left-[18%] top-[50%]  h-40 w-40 rounded-full bg-accent/6    blur-2xl animate-float-slow" style={{ animationDelay: "-3s", willChange: "transform" }} />
      <div className="absolute right-[15%] top-[70%] h-44 w-44 rounded-full bg-primary/6   blur-2xl animate-float"      style={{ animationDelay: "-5s", willChange: "transform" }} />
      <div className="absolute left-[40%] top-[85%]  h-32 w-32 rounded-full bg-secondary/6 blur-2xl animate-orb"        style={{ animationDelay: "-9s", willChange: "transform" }} />

      {/* SVG lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bgBeam1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="hsl(263,85%,65%)" stopOpacity="0" />
            <stop offset="45%"  stopColor="hsl(263,85%,65%)" stopOpacity="0.12" />
            <stop offset="55%"  stopColor="hsl(217,91%,60%)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="hsl(190,95%,55%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bgBeam2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="hsl(190,95%,55%)" stopOpacity="0" />
            <stop offset="50%"  stopColor="hsl(190,95%,55%)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="hsl(263,85%,65%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bgHScan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="hsl(263,85%,65%)" stopOpacity="0" />
            <stop offset="50%"  stopColor="hsl(263,85%,65%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(263,85%,65%)" stopOpacity="0" />
          </linearGradient>
          <filter id="bgGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Diagonal beams */}
        <line x1="-5%"  y1="0" x2="55%"  y2="100%" stroke="url(#bgBeam1)" strokeWidth="100" />
        <line x1="105%" y1="0" x2="45%"  y2="100%" stroke="url(#bgBeam2)" strokeWidth="70" />
        <line x1="30%"  y1="0" x2="85%"  y2="100%" stroke="url(#bgBeam1)" strokeWidth="35" opacity="0.5" />
        <line x1="70%"  y1="0" x2="15%"  y2="100%" stroke="url(#bgBeam2)" strokeWidth="25" opacity="0.4" />

        {/* Horizontal scan lines — fewer, slower, less repaints */}
        {[15, 42, 70].map((y, i) => (
          <line key={`h${i}`}
            x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
            stroke="url(#bgHScan)"
            strokeWidth="1"
            strokeDasharray="12 10"
            opacity="0.3"
          >
            <animate attributeName="stroke-dashoffset"
              from="0" to="-44"
              dur={`${8 + i * 2}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* Vertical accent lines */}
        {[8, 22, 78, 92].map((x, i) => (
          <line key={`v${i}`}
            x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%"
            stroke={i < 2 ? "hsl(263,85%,65%)" : "hsl(190,95%,55%)"}
            strokeWidth="0.5" strokeDasharray="6 10" opacity="0.1"
          >
            <animate attributeName="stroke-dashoffset"
              from={i % 2 === 0 ? "0" : "32"}
              to={i % 2 === 0 ? "32" : "0"}
              dur={`${5 + i * 0.8}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* Corner brackets */}
        <path d="M 28 28 L 28 88 M 28 28 L 88 28"
          stroke="hsl(263,85%,65%)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="0.15;0.45;0.15" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path d="M calc(100% - 28px) 28 L calc(100% - 28px) 88 M calc(100% - 28px) 28 L calc(100% - 88px) 28"
          stroke="hsl(190,95%,55%)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="0.1;0.35;0.1" dur="4.5s" repeatCount="indefinite" />
        </path>
        <path d="M 28 calc(100% - 28px) L 28 calc(100% - 88px) M 28 calc(100% - 28px) L 88 calc(100% - 28px)"
          stroke="hsl(217,91%,60%)" strokeWidth="1" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="0.08;0.28;0.08" dur="5s" repeatCount="indefinite" />
        </path>
        <path d="M calc(100% - 28px) calc(100% - 28px) L calc(100% - 28px) calc(100% - 88px) M calc(100% - 28px) calc(100% - 28px) L calc(100% - 88px) calc(100% - 28px)"
          stroke="hsl(263,85%,65%)" strokeWidth="1" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="0.05;0.2;0.05" dur="6s" repeatCount="indefinite" />
        </path>

        {/* Floating particles across whole page */}
        {[
          { cx:"7%",  cy:"6%",  r:1.5, dur:"7s",  delay:"0s"    },
          { cx:"93%", cy:"14%", r:1,   dur:"9s",  delay:"-2s"   },
          { cx:"3%",  cy:"33%", r:2,   dur:"6s",  delay:"-3s"   },
          { cx:"97%", cy:"44%", r:1.5, dur:"8s",  delay:"-1s"   },
          { cx:"50%", cy:"4%",  r:1,   dur:"5s",  delay:"-4s"   },
          { cx:"20%", cy:"60%", r:1.5, dur:"10s", delay:"-5.5s" },
          { cx:"80%", cy:"56%", r:1,   dur:"7s",  delay:"-2.5s" },
          { cx:"12%", cy:"76%", r:2,   dur:"8s",  delay:"-1.5s" },
          { cx:"88%", cy:"70%", r:1.5, dur:"6s",  delay:"-3.5s" },
          { cx:"45%", cy:"86%", r:1,   dur:"9s",  delay:"-6s"   },
          { cx:"65%", cy:"92%", r:1.5, dur:"7s",  delay:"-4.5s" },
          { cx:"33%", cy:"48%", r:1,   dur:"11s", delay:"-7s"   },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="hsl(263,85%,65%)" filter="url(#bgGlow)">
            <animate attributeName="opacity" values="0;0.65;0" dur={p.dur} begin={p.delay} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>

    {/* ── All page content — z-10, always in front of background ── */}
    <div className="relative" style={{ zIndex: 10 }}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <GraphPreview />
        <HowItWorks />
        <Benefits />
        <FinalCTA />
      </main>
      <Footer />
    </div>

  </div>
);

export default Index;
