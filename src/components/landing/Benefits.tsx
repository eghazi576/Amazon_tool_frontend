import { Clock, Database, Target, Trophy, CheckCircle2 } from "lucide-react";

const benefits = [
  { icon: Clock,    title: "Research in seconds, not hours", text: "Researching one product used to take 20 minutes of tab-switching. With WholesaleOS it takes 3 seconds." },
  { icon: Database, title: "Real data, not estimates",      text: "Every number is pulled live from Keepa. You get 90 days of actual price and rank history, not a cached guess." },
  { icon: Target,   title: "Find products worth sourcing",  text: "Spot products with a healthy BSR, solid ROI, and no Amazon on the listing before you spend a penny." },
  { icon: Trophy,   title: "Vet brands before you call",   text: "Check IP complaints, hazmat risk, MAP enforcement, and seller count before you invest time in a supplier relationship." },
];

const metrics = [
  { value: "15",    label: "Scoring Criteria" },
  { value: "90d",   label: "Data Window" },
  { value: "< 3s",  label: "Per Lookup" },
  { value: "100%",  label: "Live API Data" },
];

const checks = [
  "Referral fees auto-detected for every Amazon category",
  "FBA fees calculated from real product weight and dimensions",
  "Monthly sales pulled from Amazon's own Bought in past month data",
  "Hazmat products flagged automatically, no manual checking",
  "Buy Box ownership and Amazon seller status detected instantly",
  "BSR spike detection to catch inflated or unreliable rankings",
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
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Why WholesaleOS</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
            Less time researching,{" "}
            <span className="gradient-text">more time sourcing</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Every calculation that used to happen in a spreadsheet now happens automatically. You just paste the ASIN.
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
