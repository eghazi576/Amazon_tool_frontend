import { ScanBarcode, BarChart3, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: ScanBarcode,
    title: "Enter an Amazon ASIN",
    description:
      "Paste any 10-character Amazon product ID. We fetch live price history, BSR, ratings, FBA sellers, and more — instantly.",
    color: "from-primary/30 to-primary/5",
    glow: "bg-primary/20",
    ring: "border-primary/40",
    dot: "bg-primary",
  },
  {
    icon: BarChart3,
    title: "Analyze 90-day product data",
    description:
      "Our engine scores FBA viability across 15 criteria, calculates net profit, ROI, and surfaces the metrics that actually matter.",
    color: "from-secondary/30 to-secondary/5",
    glow: "bg-secondary/20",
    ring: "border-secondary/40",
    dot: "bg-secondary",
  },
  {
    icon: Lightbulb,
    title: "Get a clear buy / no-buy verdict",
    description:
      "See EXCELLENT, GOOD, AVERAGE, BAD, or REJECT with a full breakdown — source with confidence, not guesswork.",
    color: "from-accent/30 to-accent/5",
    glow: "bg-accent/20",
    ring: "border-accent/40",
    dot: "bg-accent",
  },
];

const HowItWorks = () => (
  <section id="how" className="relative py-24 md:py-32 overflow-hidden">

    {/* Section ambient glow */}
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />


    <div className="container relative mx-auto px-6">

      {/* Header */}
      <div className="mx-auto mb-20 max-w-2xl text-center animate-fade-up">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</span>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          From ASIN to <span className="gradient-text">decision</span> in 3 steps
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          No spreadsheets. No manual research. Just paste an ASIN and go.
        </p>
      </div>

      {/* Steps */}
      <div className="relative grid gap-8 md:grid-cols-3">

        {/* ── Animated SVG connector (desktop only) ── */}
        <div className="pointer-events-none absolute left-0 right-0 top-9 hidden md:block" style={{ height: "40px" }}>
          <svg width="100%" height="40" viewBox="0 0 1000 40" preserveAspectRatio="none" overflow="visible">
            <defs>
              <linearGradient id="connGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="hsl(263,85%,65%)" stopOpacity="0" />
                <stop offset="20%"  stopColor="hsl(263,85%,65%)" stopOpacity="0.7" />
                <stop offset="50%"  stopColor="hsl(217,91%,60%)" stopOpacity="0.9" />
                <stop offset="80%"  stopColor="hsl(190,95%,55%)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="hsl(190,95%,55%)" stopOpacity="0" />
              </linearGradient>
              <filter id="dotGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Base dashed gradient line */}
            <line
              x1="167" y1="20" x2="833" y2="20"
              stroke="url(#connGrad)"
              strokeWidth="1.5"
              strokeDasharray="8 5"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-39" dur="2s" repeatCount="indefinite" />
            </line>

            {/* Bright overlay line (draw animation) */}
            <line
              x1="167" y1="20" x2="833" y2="20"
              stroke="url(#connGrad)"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />

            {/* Moving glowing dot */}
            <circle r="5" fill="hsl(263,85%,65%)" filter="url(#dotGlow)" opacity="0.9">
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                path="M 167 20 L 833 20"
                rotate="auto"
              />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.95;1" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Second dot offset */}
            <circle r="3" fill="hsl(190,95%,55%)" filter="url(#dotGlow)" opacity="0.7">
              <animateMotion
                dur="2.5s"
                begin="-1.25s"
                repeatCount="indefinite"
                path="M 167 20 L 833 20"
                rotate="auto"
              />
              <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.05;0.95;1" begin="-1.25s" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Step cards */}
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative text-center group animate-fade-up"
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            {/* Icon container */}
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">

              {/* Outer pulsing ring */}
              <span
                className={`absolute inset-0 rounded-2xl border ${s.ring} animate-ping opacity-30`}
                style={{ animationDuration: `${2.5 + i * 0.4}s` }}
              />

              {/* Mid glow ring */}
              <span
                className={`absolute -inset-2 rounded-3xl ${s.glow} blur-xl transition-smooth group-hover:scale-125 group-hover:opacity-80`}
              />

              {/* Icon box */}
              <div className={`glass relative flex h-20 w-20 items-center justify-center rounded-2xl border ${s.ring} shadow-elegant transition-spring group-hover:-translate-y-1 group-hover:shadow-glow`}>
                <s.icon className="h-8 w-8 text-primary transition-smooth group-hover:scale-110" />
              </div>

              {/* Step number badge */}
              <span className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white shadow-elegant z-10">
                {i + 1}
              </span>

              {/* Vertical drop line on mobile */}
              {i < steps.length - 1 && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-px h-8 md:hidden">
                  <div className="w-full h-full bg-gradient-to-b from-primary/50 to-transparent" />
                  <div
                    className="absolute top-0 left-0 w-full h-2 bg-primary/80 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                </div>
              )}
            </div>

            {/* Text */}
            <h3 className="font-display text-xl font-semibold transition-smooth group-hover:text-primary">
              {s.title}
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {s.description}
            </p>

            {/* Bottom accent dot */}
            <div className={`mx-auto mt-4 h-1 w-8 rounded-full ${s.dot} opacity-50 transition-smooth group-hover:w-16 group-hover:opacity-90`} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
