import { Target, Eye, Boxes, BadgeCheck } from "lucide-react";

const pillars = [
  {
    icon: Target,
    iconBg: "from-violet-500 to-purple-600",
    label: "Mission",
    text: "To help Amazon wholesale sellers discover profitable opportunities, make smarter sourcing decisions, and scale faster through artificial intelligence and automation.",
  },
  {
    icon: Eye,
    iconBg: "from-sky-500 to-blue-600",
    label: "Vision",
    text: "To become the operating system that powers every successful Amazon wholesale business.",
  },
  {
    icon: Boxes,
    iconBg: "from-fuchsia-500 to-pink-600",
    label: "What We Do",
    text: "WholesaleOS combines product research, profitability analysis, brand intelligence, competitor monitoring, supplier relationship management, and AI-powered recommendations into one platform built specifically for Amazon wholesale sellers.",
  },
  {
    icon: BadgeCheck,
    iconBg: "from-emerald-500 to-teal-600",
    label: "Brand Promise",
    text: "Everything an Amazon wholesale seller needs to research, analyze, source, monitor, and scale.",
  },
];

const About = () => (
  <section id="about" className="relative py-24 md:py-32">
    {/* Ambient glow */}
    <div className="pointer-events-none absolute left-0 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />

    <div className="container relative mx-auto px-6">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">About WholesaleOS</span>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          Built around one goal:{" "}
          <span className="gradient-text">your next profitable product</span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {pillars.map((p, i) => (
          <div
            key={p.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-8 transition-spring hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-smooth group-hover:scale-150 group-hover:opacity-80" />
            <div className="relative">
              {/* Modern icon tile — each pillar its own gradient + soft ring/glow */}
              <div className="mb-5 relative inline-flex">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${p.iconBg} blur-lg opacity-40 transition-smooth group-hover:opacity-70`} />
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.iconBg} shadow-elegant ring-1 ring-white/20`}>
                  <p.icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <h3 className="font-display text-xl font-semibold">{p.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About;
