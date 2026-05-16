import { FileUp, Cpu, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: FileUp,
    title: "Upload your CSV file",
    description: "Drop your Amazon product export and we'll handle the rest — automatic parsing, no formatting needed.",
  },
  {
    icon: Cpu,
    title: "Analyze product data",
    description: "Our engine scores products, calculates trends, and surfaces the metrics that actually matter.",
  },
  {
    icon: Lightbulb,
    title: "Get AI-powered insights",
    description: "Receive clear recommendations, niche opportunities, and competitive analysis in seconds.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how" className="relative py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            From CSV to <span className="gradient-text">clarity</span> in 3 steps
          </h2>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting line on desktop */}
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />

          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-xl" />
                <div className="glass relative flex h-20 w-20 items-center justify-center rounded-2xl">
                  <s.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground shadow-elegant">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
