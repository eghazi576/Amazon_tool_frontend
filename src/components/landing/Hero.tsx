import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, Zap, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardMockup from "./DashboardMockup";

const stats = [
  { icon: Zap,        value: "< 3s",  label: "per lookup"       },
  { icon: TrendingUp, value: "15",    label: "scoring criteria" },
  { icon: Shield,     value: "100%",  label: "Live market data"  },
];

// Headline words with stagger
const line1 = ["The", "AI-Powered", "Wholesale"];
const line2 = ["Analyst", "That", "Never"];

const Hero = () => (
  <section className="relative overflow-hidden pb-24 pt-32 md:pt-40">

    {/* ── One-time hero sweep line ─────────────────────────────── */}
    <div
      className="pointer-events-none absolute left-0 right-0 z-20"
      style={{
        height: "2px",
        background: "linear-gradient(90deg, transparent 0%, hsl(263 85% 65% / 0.8) 30%, hsl(190 95% 55% / 0.9) 70%, transparent 100%)",
        animation: "hero-sweep 2.2s cubic-bezier(0.4,0,0.6,1) 0.2s forwards",
        top: "-3px",
      }}
    />

    {/* ── Sonar pulse rings from hero center ──────────────────── */}
    <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 animate-sonar"
          style={{
            width: "120px", height: "120px",
            animationDelay: `${i * 0.75}s`,
            animationDuration: "3s",
          }}
        />
      ))}
    </div>

    {/* ── Section orbs ────────────────────────────────────────── */}
    <div className="pointer-events-none absolute left-[6%]  top-[18%] h-64 w-64 rounded-full bg-primary/10   blur-3xl animate-orb" />
    <div className="pointer-events-none absolute right-[5%] top-[30%] h-48 w-48 rounded-full bg-secondary/10 blur-3xl animate-orb" style={{ animationDelay: "-4s" }} />
    <div className="pointer-events-none absolute left-[20%] bottom-[8%] h-32 w-32 rounded-full bg-accent/8  blur-2xl animate-float-slow" style={{ animationDelay: "-2s" }} />

    {/* ── Main content ─────────────────────────────────────────── */}
    <div className="container relative mx-auto px-6">
      <div className="relative z-10 mx-auto max-w-4xl text-center">

        {/* Live badge */}
        <div
          className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur shimmer"
          style={{ animationDelay: "0s" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Built for Amazon Wholesale Sellers
        </div>

        {/* Headline — word-by-word stagger */}
        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl" style={{ perspective: "600px" }}>
          <span className="block">
            {line1.map((word, i) => (
              <span
                key={word}
                className="animate-word-up inline-block mr-[0.25em]"
                style={{ animationDelay: `${0.08 + i * 0.1}s` }}
              >
                {word}
              </span>
            ))}
          </span>
          <span className="block mt-1">
            {line2.map((word, i) => (
              <span
                key={word}
                className="animate-word-up inline-block mr-[0.25em]"
                style={{ animationDelay: `${0.28 + i * 0.1}s` }}
              >
                {word}
              </span>
            ))}
            {" "}
            <span
              className="animate-word-up inline-block gradient-text"
              style={{ animationDelay: "0.58s" }}
            >
              Sleeps
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          style={{ animationDelay: "0.65s" }}
        >
          Research products. Analyze profitability. Discover brands.
          Monitor competitors. Manage suppliers.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.75s" }}
        >
          <Button asChild variant="hero" size="xl" className="group w-full sm:w-auto animate-pulse-glow">
            <Link to="/sign-up">
              Get Started Free
              <ArrowRight className="transition-smooth group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
            <Link to="/sign-in">
              <LogIn />
              Sign In
            </Link>
          </Button>
        </div>

        {/* Stat pills */}
        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.88s" }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="stat-pill flex items-center gap-2 rounded-full px-4 py-2 text-sm animate-slide-up"
              style={{ animationDelay: `${0.9 + i * 0.1}s` }}
            >
              <s.icon className="h-3.5 w-3.5 text-primary" />
              <span className="font-bold text-foreground">{s.value}</span>
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mockup */}
      <div
        className="animate-fade-up relative mx-auto mt-20 max-w-5xl"
        style={{ animationDelay: "0.7s" }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-primary opacity-20 blur-3xl" />
        <div
          className="pointer-events-none absolute -inset-8 rounded-3xl border border-primary/10 animate-spin-slow"
          style={{ borderRadius: "28px" }}
        />
        <div
          className="pointer-events-none absolute -inset-14 rounded-3xl border border-accent/6 animate-spin-slow"
          style={{ borderRadius: "36px", animationDirection: "reverse", animationDuration: "30s" }}
        />
        <DashboardMockup />
      </div>
    </div>
  </section>
);

export default Hero;
