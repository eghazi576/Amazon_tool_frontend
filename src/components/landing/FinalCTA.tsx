import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="glass relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-12 text-center md:p-16">
          {/* glow accents */}
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Start Your Product Research <br className="hidden sm:block" />
              <span className="gradient-text">Journey Today</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Join thousands of FBA sellers using AI to find winning products faster.
            </p>
            <div className="mt-10 flex justify-center">
              <Button variant="hero" size="xl" className="group animate-pulse-glow">
                Go to Dashboard
                <ArrowRight className="transition-smooth group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
