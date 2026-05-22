import { Button } from "@/components/ui/button";
import { ArrowRight, ScanBarcode } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTA = () => (
  <section className="relative py-24 md:py-32">
    <div className="container mx-auto px-6">
      {/* Outer glow ring */}
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/50 via-accent/30 to-secondary/50 blur-sm opacity-70" />
        <div className="relative glass-card overflow-hidden rounded-3xl p-10 text-center md:p-16">

          {/* Glow accents */}
          <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary/25 blur-3xl animate-orb" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-orb" style={{ animationDelay: "-5s" }} />

          <div className="relative">
            {/* Icon badge */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-elegant animate-pulse-glow">
              <ScanBarcode className="h-8 w-8 text-white" />
            </div>

            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Start Your Research
              <br className="hidden sm:block" />
              <span className="gradient-text">Journey Today</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Create a free account and analyze your first product in under 30 seconds.
            </p>

            {/* Fake ASIN input teaser */}
            <div className="mx-auto mt-8 max-w-sm flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-left">
              <ScanBarcode className="h-4 w-4 shrink-0 text-primary" />
              <span className="font-mono text-sm text-muted-foreground cursor-blink">
                Paste your ASIN here…
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl" className="group animate-pulse-glow">
                <Link to="/sign-up">
                  Get Started Free
                  <ArrowRight className="transition-smooth group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/sign-in">Sign in instead</Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required · Real-time market data · Live insights
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FinalCTA;
