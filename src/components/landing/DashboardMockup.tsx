const linePath  = "M0,75 Q50,65 100,50 T200,35 T300,25 T400,18";
const areaPath  = `${linePath} L400,100 L0,100 Z`;
const rankPath  = "M0,30 Q50,35 100,45 T200,55 T300,50 T400,40";
const rankArea  = `${rankPath} L400,100 L0,100 Z`;

const DashboardMockup = () => (
  <div className="glass-card relative w-full overflow-hidden rounded-2xl shadow-elegant">
    {/* Window chrome */}
    <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
      <div className="flex gap-1.5">
        <span className="h-3 w-3 rounded-full bg-destructive/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
      </div>
      <span className="text-[11px] text-muted-foreground">thewholesaleos.com</span>
      <div className="h-4 w-16 rounded-full bg-muted/60" />
    </div>

    <div className="p-4 md:p-5 space-y-4">

      {/* ASIN Search bar */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-primary/30 bg-muted/40 px-3 py-2">
          <span className="text-[10px] font-mono text-primary font-semibold tracking-widest">ASIN</span>
          <span className="h-3.5 w-px bg-border/60" />
          <span className="font-mono text-xs text-foreground cursor-blink">B07PXGQC1Q</span>
        </div>
        <div className="shrink-0 rounded-lg bg-gradient-primary px-3 py-2 text-[11px] font-semibold text-white shadow-elegant">
          Submit
        </div>
      </div>

      {/* Product card */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-3 flex gap-3">
        {/* Thumbnail placeholder */}
        <div className="h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/10 border border-border/50 flex items-center justify-center">
          <svg className="h-6 w-6 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="text-xs font-semibold leading-snug line-clamp-1 text-foreground">
              Taygeer Large Travel Backpack, 17 inch Laptop
            </p>
            {/* Score badge */}
            <span className="shrink-0 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
              EXCELLENT
            </span>
          </div>

          {/* Mini stats */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            <span>BSR <span className="text-foreground font-medium">2,441</span></span>
            <span>Rating <span className="text-yellow-400 font-medium">4.7★</span></span>
            <span>FBA <span className="text-foreground font-medium">8</span></span>
            <span>Sales/mo <span className="text-emerald-400 font-medium">~310</span></span>
          </div>
        </div>
      </div>

      {/* Profit strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Price",   value: "$29.99", color: "text-foreground" },
          { label: "Profit",  value: "+$7.82", color: "text-emerald-400" },
          { label: "ROI",     value: "35%",    color: "text-emerald-400" },
          { label: "Margin",  value: "26%",    color: "text-sky-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border/50 bg-muted/30 p-2 text-center">
            <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className={`text-xs font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Price chart */}
        <div className="rounded-lg border border-border/50 bg-muted/20 p-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">Price · 90d</span>
            <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5">+18.2%</span>
          </div>
          <svg viewBox="0 0 400 100" className="h-16 w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(263 85% 65%)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="hsl(263 85% 65%)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(263 85% 65%)" />
                <stop offset="100%" stopColor="hsl(190 95% 55%)" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />
            <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* BSR chart */}
        <div className="rounded-lg border border-border/50 bg-muted/20 p-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">BSR · 90d</span>
            <span className="text-[9px] font-semibold text-sky-400 bg-sky-500/10 rounded px-1.5 py-0.5">Stable</span>
          </div>
          <svg viewBox="0 0 400 100" className="h-16 w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rankAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(190 95% 55%)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="hsl(190 95% 55%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={rankArea} fill="url(#rankAreaGrad)" />
            <path d={rankPath} fill="none" stroke="hsl(190 95% 55%)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Score criteria snippet */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { label: "#3 Sales > 100/mo",      pass: true  },
          { label: "#5 ROI ≥ 20%",           pass: true  },
          { label: "#11 Amazon not selling",  pass: true  },
          { label: "#9 FBA sellers 3–15",     pass: true  },
          { label: "#2 Not seasonal",         pass: false },
        ].map((c) => (
          <span
            key={c.label}
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-medium ${
              c.pass
                ? "border-emerald-500/25 bg-emerald-500/8 text-emerald-400"
                : "border-border/50 bg-muted/30 text-muted-foreground"
            }`}
          >
            <span>{c.pass ? "✓" : "✗"}</span>
            {c.label}
          </span>
        ))}
      </div>
    </div>

    {/* Ambient glows */}
    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />

    {/* Scan line */}
    <div className="pointer-events-none absolute inset-0 scan-line opacity-40" />
  </div>
);

export default DashboardMockup;
