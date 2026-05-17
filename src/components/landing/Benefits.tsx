import { Clock, Database, Target, Trophy, CheckCircle2 } from "lucide-react";

const benefits = [
  { icon: Clock,    title: "Save hours on research",       text: "What takes hours manually takes seconds — automated ASIN lookup, scoring, and profit calc." },
  { icon: Database, title: "Live data, not guesswork",     text: "Every number comes from real Keepa API data. 90-day history, not a snapshot." },
  { icon: Target,   title: "Identify profitable products", text: "Spot products with BSR < 50k, ROI ≥ 20%, and no Amazon competition before sourcing." },
  { icon: Trophy,   title: "Score brands intelligently",   text: "12-point brand vetting: IP complaints, hazmat, MAP sensitivity, seller count — all in one tool." },
];

const metrics = [
  { value: "15",    label: "Scoring Criteria" },
  { value: "90d",   label: "Keepa Data Window" },
  { value: "< 3s",  label: "Per Lookup" },
  { value: "100%",  label: "Live API Data" },
];

const checks = [
  "Referral fee auto-detected by category",
  "FBA fee from weight & dimensions",
  "Monthly sales estimate from BSR",
  "Hazmat auto-flagged from Keepa",
  "Buy Box & Amazon seller detection",
  "Rank spike anomaly detection",
];

const Benefits = () => (
  <section id="benefits" className="relative py-24 md:py-32">
    {/* Ambient glow */}
    <div className="pointer-events-none absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-accent/8 blur-3xl" />

    <div className="container relative mx-auto px-6 space-y-20">

      {/* Metrics strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="glass-card rounded-2xl p-5 text-center animate-count-up shimmer"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <p className="font-display text-3xl font-bold gradient-text">{m.value}</p>
            <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wide">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Why Aurix</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
            Built for sellers who want to{" "}
            <span className="gradient-text">win faster</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Stop drowning in spreadsheets. Aurix does the heavy lifting so you can focus on sourcing and scaling.
          </p>

          {/* Check list */}
          <ul className="mt-8 space-y-2.5">
            {checks.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-5 transition-spring hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/8 blur-2xl transition-smooth group-hover:bg-primary/20" />
              <div className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition-smooth group-hover:bg-primary group-hover:text-white shadow-sm">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-sm">{b.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Benefits;
