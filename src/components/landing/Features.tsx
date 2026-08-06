import { useState } from "react";
import { Link } from "react-router-dom";
import { ScanSearch, Gauge, Calculator, ShieldCheck, ArrowRight, ArrowLeft, Check } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Feature = {
  icon: typeof ScanSearch;
  title: string;
  description: string;
  accent: string;   // soft glow behind the card
  iconBg: string;    // icon tile gradient
  details: { intro: string; points: string[] };
};

const features: Feature[] = [
  {
    icon: ScanSearch,
    title: "ASIN Lookup & Analysis",
    description: "Put in an ASIN and get back 90 days of real market data: price history, BSR trends, FBA seller count and ratings, all in one place.",
    accent: "from-indigo-500/20 to-violet-500/10",
    iconBg: "from-indigo-500 to-violet-600",
    details: {
      intro: "Paste any Amazon ASIN and WholesaleOS pulls the full market picture, then draws it as one interactive chart you can read at a glance.",
      points: [
        "90-day Buy Box, Amazon and New price history, held like a Keepa chart",
        "Best Seller Rank trend, with sale-drop counting for demand",
        "Live FBA and FBM seller counts, and whether Amazon is on the listing",
        "Rating and review-count history over time",
        "All-time and 90-day price highs and lows",
        "Hover the chart for the exact value on any day",
      ],
    },
  },
  {
    icon: Gauge,
    title: "Automated FBA Scoring",
    description: "A scoring system built around how real FBA sellers evaluate products. 15 criteria, weighted by importance, with an instant verdict.",
    accent: "from-violet-500/20 to-fuchsia-500/10",
    iconBg: "from-violet-500 to-fuchsia-600",
    details: {
      intro: "Instead of eyeballing charts, you get one weighted score and a plain-English verdict, built on the checks experienced sellers actually run.",
      points: [
        "15 weighted criteria, from BSR and ROI to Buy Box stability",
        "Hard-reject checks: IP complaints, hazmat and authenticity",
        "A clear HIGHLY VIABLE / LIKELY VIABLE / SEEMS VIABLE / LOW VIABLE / NOT VIABLE verdict",
        "The reasons behind every score, not just a number",
        "Tune the thresholds to match your own buying rules",
      ],
    },
  },
  {
    icon: Calculator,
    title: "Profit Calculator",
    description: "Enter your cost and see your real margins. Referral fees, FBA fees, storage and inbound costs are all worked out for you.",
    accent: "from-sky-500/20 to-blue-500/10",
    iconBg: "from-sky-500 to-blue-600",
    details: {
      intro: "Real fee maths, not a guess. Add your cost of goods and any extra costs, and every Amazon fee is calculated from the product's own data.",
      points: [
        "Referral fee by category",
        "FBA fulfilment fee from weight and dimensions",
        "Monthly storage and inbound placement fees",
        "Net profit, ROI, margin and break-even price",
        "Add COGS and a miscellaneous cost of your own",
      ],
    },
  },
  {
    icon: ShieldCheck,
    title: "Brand Intelligence",
    description: "Before you call a brand, know if they are worth your time. IP history, hazmat risk, MAP policy, seller density and more.",
    accent: "from-emerald-500/20 to-teal-500/10",
    iconBg: "from-emerald-500 to-teal-600",
    details: {
      intro: "Vetting a wholesale brand is a different job from scoring one product. Brand Intelligence scores the brand itself so you avoid the ones that waste time or risk your account.",
      points: [
        "An 11-criteria VIABLE or NOT VIABLE brand verdict",
        "IP complaint history and counterfeit red flags",
        "Hazmat catalogue share and MAP-policy signals",
        "FBA seller density and monthly sales velocity",
        "Website and registered-business verification",
      ],
    },
  },
];

const Features = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx != null ? features[openIdx] : null;

  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Features</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Everything you need to <span className="gradient-text">win on Amazon</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for FBA wholesale sellers who research seriously.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-card p-6 transition-spring hover:-translate-y-2 hover:border-primary/40 hover:shadow-elegant glow-border"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${f.accent} blur-2xl transition-smooth group-hover:scale-150 group-hover:opacity-80`} />

              <div className="relative flex flex-1 flex-col">
                {/* Modern icon tile — each feature its own gradient + soft ring */}
                <div className="mb-5 relative inline-flex">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.iconBg} blur-lg opacity-40 transition-smooth group-hover:opacity-70`} />
                  <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.iconBg} shadow-elegant ring-1 ring-white/20`}>
                    <f.icon className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                </div>

                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{f.description}</p>

                <button
                  type="button"
                  onClick={() => setOpenIdx(i)}
                  className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-primary transition-smooth hover:gap-2"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-details modal. Back closes it and returns you to the page. */}
      <Dialog open={openIdx != null} onOpenChange={(o) => !o && setOpenIdx(null)}>
        <DialogContent className="max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${active.iconBg} shadow-elegant ring-1 ring-white/20`}>
                  <active.icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <DialogTitle className="font-display text-xl">{active.title}</DialogTitle>
                <DialogDescription className="text-left leading-relaxed">{active.details.intro}</DialogDescription>
              </DialogHeader>

              <ul className="space-y-2.5">
                {active.details.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <DialogFooter className="mt-2 gap-2 sm:justify-between">
                <Button variant="outline" onClick={() => setOpenIdx(null)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button asChild variant="hero">
                  <Link to="/sign-in">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Features;
