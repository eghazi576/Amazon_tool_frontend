import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardMockup from "./DashboardMockup";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pb-24 pt-32 md:pt-40">
      {/* Background grid + glow */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Amazon Research Tool
          </div>

          <h1 className="animate-fade-up mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl" style={{ animationDelay: "0.1s" }}>
            Smart Amazon Product
            <br />
            Research Powered by{" "}
            <span className="gradient-text">AI</span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl" style={{ animationDelay: "0.2s" }}>
            Upload your product data, get instant insights, scores, and graphs — all in one place.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "0.3s" }}>
            <Button asChild variant="hero" size="xl" className="group w-full sm:w-auto">
              <Link to="/sign-up">
                Get Started
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
        </div>

        {/* Dashboard preview */}
        <div className="animate-fade-up relative mx-auto mt-20 max-w-5xl" style={{ animationDelay: "0.5s" }}>
          <div className="absolute inset-0 -z-10 bg-gradient-primary opacity-30 blur-3xl" />
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
};

export default Hero;
