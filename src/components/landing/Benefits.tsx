import { Clock, Database, Target, Trophy } from "lucide-react";

const benefits = [
  { icon: Clock, title: "Save time on research", text: "Cut hours of manual analysis to minutes with automated workflows." },
  { icon: Database, title: "Make data-driven decisions", text: "Replace guesswork with real metrics, scores, and trends." },
  { icon: Target, title: "Identify profitable products", text: "Spot winning niches before your competition catches on." },
  { icon: Trophy, title: "Understand market competition", text: "Map the brand landscape and find your edge instantly." },
];

const Benefits = () => {
  return (
    <section id="benefits" className="relative py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">Why Aurix</span>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
              Built for sellers who want to <span className="gradient-text">win faster</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Stop drowning in spreadsheets. Aurix does the heavy lifting so you can focus on building your brand.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-border bg-gradient-card p-5 transition-spring hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
