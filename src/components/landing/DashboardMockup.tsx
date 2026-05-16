import { TrendingUp, DollarSign, Star, Package } from "lucide-react";

const DashboardMockup = () => {
  const linePath = "M0,80 Q40,70 80,55 T160,40 T240,30 T320,20 T400,15";
  const areaPath = `${linePath} L400,100 L0,100 Z`;

  return (
    <div className="glass relative w-full overflow-hidden rounded-2xl p-4 shadow-elegant md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-destructive/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-muted-foreground">aurix.app/dashboard</span>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { icon: Package, label: "Products", value: "1,284", color: "text-primary" },
          { icon: DollarSign, label: "Avg Price", value: "$42.5", color: "text-accent" },
          { icon: Star, label: "Rating", value: "4.6", color: "text-yellow-400" },
          { icon: TrendingUp, label: "Score", value: "92", color: "text-secondary" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <div className="mb-1 flex items-center gap-2">
              <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</span>
            </div>
            <div className="font-display text-lg font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Price Trend · 30 days</span>
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">+24.8%</span>
        </div>
        <svg viewBox="0 0 400 100" className="h-32 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(263 85% 65%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(263 85% 65%)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(263 85% 65%)" />
              <stop offset="100%" stopColor="hsl(190 95% 55%)" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGrad)" />
          <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Floating accent glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
    </div>
  );
};

export default DashboardMockup;
