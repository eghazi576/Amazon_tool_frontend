import { ScanBarcode, Brain, BarChart3, Search } from "lucide-react";

const features = [
  {
    icon: ScanBarcode,
    title: "ASIN Lookup & Analysis",
    description: "Paste any Amazon ASIN and get live 90-day Keepa data — price history, BSR, FBA sellers, ratings, and more.",
    accent: "from-primary/20 to-secondary/10",
    iconColor: "text-primary",
  },
  {
    icon: Brain,
    title: "Automated FBA Scoring",
    description: "15-criteria scoring engine based on the Wholesale FBA Product Hunting framework. Instant buy / no-buy verdict.",
    accent: "from-secondary/20 to-accent/10",
    iconColor: "text-secondary",
  },
  {
    icon: BarChart3,
    title: "Profit Calculator",
    description: "Auto-calculates referral fee, FBA fee, storage, inbound placement. Enter COGS to see real net profit and ROI.",
    accent: "from-accent/20 to-primary/10",
    iconColor: "text-accent",
  },
  {
    icon: Search,
    title: "Brand Intelligence",
    description: "Score brands on 12 criteria — IP history, hazmat catalog, FBA seller count, and more before you reach out.",
    accent: "from-primary/15 to-accent/15",
    iconColor: "text-primary",
  },
];

const Features = () => (
  <section id="features" className="relative py-24 md:py-32">
    {/* Subtle section glow */}
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
    </div>

    <div className="container relative mx-auto px-6">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">Features</span>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          Everything you need to{" "}
          <span className="gradient-text">win on Amazon</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Built for FBA wholesale sellers who research seriously.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-6 transition-spring hover:-translate-y-2 hover:border-primary/40 hover:shadow-elegant glow-border"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* Top gradient sweep */}
            <div
              className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${f.accent} blur-2xl transition-smooth group-hover:scale-150 group-hover:opacity-80`}
            />

            <div className="relative">
              {/* Icon */}
              <div className="mb-5 relative inline-flex">
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.accent} blur-md opacity-60 group-hover:opacity-100 transition-smooth`} />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
              </div>

              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>

              {/* Bottom arrow on hover */}
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-smooth group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
                Learn more
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
