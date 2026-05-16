import { Upload, Brain, BarChart3, Search } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "CSV Upload & Analysis",
    description: "Drag, drop, and instantly parse thousands of Amazon products with smart column detection.",
  },
  {
    icon: Brain,
    title: "AI Product Insights",
    description: "Let our AI surface winning products, hidden niches, and red flags from your data.",
  },
  {
    icon: BarChart3,
    title: "Advanced Visualization",
    description: "Beautiful, interactive graphs that turn raw data into clear, actionable stories.",
  },
  {
    icon: Search,
    title: "Brand & Market Research",
    description: "Analyze competitors, market share, and brand performance in just a few clicks.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Features</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Everything you need to <span className="gradient-text">win on Amazon</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for FBA sellers, students, and serious product researchers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-6 transition-spring hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-smooth group-hover:bg-primary/30" />

              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
