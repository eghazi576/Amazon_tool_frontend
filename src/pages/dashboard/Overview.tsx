import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, Sparkles, Boxes, TrendingUp, Activity,
  DollarSign, CheckCircle2, ArrowRight, Clock, Zap,
} from "lucide-react";
import { getHistory, type HistoryEntry } from "@/lib/history";
import { getBrandHistory, type BrandHistoryEntry } from "@/lib/brandHistoryClient";
import { useAuth } from "@/contexts/AuthContext";

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

// ─── Data hooks ───────────────────────────────────────────────────────────────
type Stats = {
  lookupsToday:  number;
  avgScore:      number | null;
  brandsApproved: number;
  brandsTracked: number;
};

function useOverviewData() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [recent, setRecent] = useState<HistoryEntry[]>([]);
  const [recentBrands, setRecentBrands] = useState<BrandHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getHistory(), getBrandHistory(200, 0)])
      .then(([history, brandData]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lookupsToday = history.filter(
          (e) => new Date(e.timestamp) >= today
        ).length;

        const scored = history.filter(
          (e) => e.decision !== "REJECT" && e.pct != null
        );
        const avgScore =
          scored.length > 0
            ? Math.round(scored.reduce((s, e) => s + (e.pct ?? 0), 0) / scored.length)
            : null;

        const brands = brandData.entries;
        const brandsApproved = brands.filter((b) => b.decision === "APPROVED").length;

        setStats({ lookupsToday, avgScore, brandsApproved, brandsTracked: brands.length });
        setRecent(history.slice(0, 5));
        setRecentBrands(brands.slice(0, 3));
      })
      .catch(() => {
        setStats({ lookupsToday: 0, avgScore: null, brandsApproved: 0, brandsTracked: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  return { stats, recent, recentBrands, loading };
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const kpiConfig = [
  {
    key: "lookupsToday" as const,
    label: "Lookups today",
    icon: Activity,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    suffix: "",
    format: (v: number) => v.toString(),
  },
  {
    key: "avgScore" as const,
    label: "Avg. score",
    icon: TrendingUp,
    gradient: "from-sky-500/20 to-sky-500/5",
    iconColor: "text-sky-400",
    suffix: "%",
    format: (v: number) => v.toString(),
  },
  {
    key: "brandsApproved" as const,
    label: "Brands approved",
    icon: CheckCircle2,
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
    suffix: "",
    format: (v: number) => v.toString(),
  },
  {
    key: "brandsTracked" as const,
    label: "Brands tracked",
    icon: Boxes,
    gradient: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
    suffix: "",
    format: (v: number) => v.toString(),
  },
];

function KpiCard({
  label, value, icon: Icon, gradient, iconColor, suffix, loading,
}: {
  label: string; value: number | null; icon: any; gradient: string;
  iconColor: string; suffix: string; loading: boolean;
}) {
  const displayed = useCountUp(value ?? 0);

  return (
    <Card className="relative overflow-hidden border-border/60 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
      <CardContent className="relative p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm border border-border/40`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </div>
        {loading ? (
          <div className="h-8 w-16 rounded-md bg-muted/60 animate-pulse" />
        ) : value === null ? (
          <p className="font-display text-2xl font-bold text-muted-foreground">—</p>
        ) : (
          <p className="font-display text-2xl font-bold tabular-nums">
            {displayed}{suffix}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Recent product row ───────────────────────────────────────────────────────
const decisionColor: Record<string, string> = {
  EXCELLENT: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  GOOD:      "bg-sky-500/15 text-sky-400 border-sky-500/30",
  AVERAGE:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  BAD:       "bg-orange-500/15 text-orange-400 border-orange-500/30",
  REJECT:    "bg-destructive/15 text-destructive border-destructive/30",
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Action cards ─────────────────────────────────────────────────────────────
const actions = [
  {
    to: "/dashboard/research",
    icon: Search,
    title: "Product Research",
    desc: "Enter an ASIN — get live market data, profit & viability score instantly.",
    cta: "Analyze a product",
    accent: "from-primary/20 to-primary/5",
    border: "hover:border-primary/40",
  },
  {
    to: "/dashboard/brand",
    icon: Boxes,
    title: "Brand Intelligence",
    desc: "Evaluate a brand's catalog, IP history, FBA health and approval risk.",
    cta: "Explore brands",
    accent: "from-violet-500/20 to-violet-500/5",
    border: "hover:border-violet-500/40",
  },
  {
    to: "/dashboard/history",
    icon: Clock,
    title: "Search History",
    desc: "All your product and brand lookups — searchable, filterable, exportable.",
    cta: "View history",
    accent: "from-sky-500/20 to-sky-500/5",
    border: "hover:border-sky-500/40",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
const Overview = () => {
  const { user } = useAuth();
  const { stats, recent, recentBrands, loading } = useOverviewData();
  const firstName = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Welcome back, <span className="text-primary">{firstName}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Research Amazon products, score viability, and uncover brand opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-primary" />
          Powered by live market data
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiConfig.map((k) => (
          <KpiCard
            key={k.key}
            label={k.label}
            value={stats ? (stats[k.key] as number) : null}
            icon={k.icon}
            gradient={k.gradient}
            iconColor={k.iconColor}
            suffix={k.suffix}
            loading={loading}
          />
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((a) => (
          <Link key={a.to} to={a.to} className="group block">
            <Card className={`h-full relative overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant ${a.border}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${a.accent} opacity-0 group-hover:opacity-70 transition-opacity duration-300`} />
              <CardContent className="relative p-5 flex flex-col gap-3 h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant shrink-0">
                  <a.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">{a.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
                  {a.cta} <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent activity row */}
      {(recent.length > 0 || recentBrands.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent product lookups */}
          {recent.length > 0 && (
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Recent Lookups</span>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
                    <Link to="/dashboard/history">View all <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                </div>
                <div className="space-y-2">
                  {recent.map((e, i) => (
                    <Link
                      key={e.id}
                      to={`/dashboard/research?asin=${e.asin}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors group"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {e.image ? (
                        <img src={e.image} alt="" className="h-8 w-8 rounded object-contain bg-muted/30 shrink-0" />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted/40 shrink-0 flex items-center justify-center">
                          <Search className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{e.title ?? e.asin}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{e.asin}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 ${decisionColor[e.decision] ?? ""}`}>
                          {e.decision}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{timeAgo(e.timestamp)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent brand evaluations */}
          {recentBrands.length > 0 && (
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-violet-400" />
                    <span className="text-sm font-semibold">Recent Brand Evals</span>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
                    <Link to="/dashboard/history">View all <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                </div>
                <div className="space-y-2">
                  {recentBrands.map((b, i) => (
                    <Link
                      key={b.id}
                      to={`/dashboard/brand?asin=${b.asin}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="h-8 w-8 rounded bg-violet-500/10 border border-violet-500/20 shrink-0 flex items-center justify-center">
                        <Boxes className="h-3.5 w-3.5 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{b.brandName}</p>
                        <p className="text-[10px] text-muted-foreground">{b.category ?? b.asin}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {b.decision === "APPROVED" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-destructive" />
                        )}
                        <span className={`text-[10px] font-semibold ${b.decision === "APPROVED" ? "text-emerald-400" : "text-destructive"}`}>
                          {b.decision}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{timeAgo(new Date(b.createdAt).getTime())}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      )}

      {/* Empty state — no history yet */}
      {!loading && recent.length === 0 && recentBrands.length === 0 && (
        <Card className="border-border/40 border-dashed">
          <CardContent className="py-12 flex flex-col items-center text-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-elegant">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-base">Start your first analysis</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Search an ASIN to get profit, ROI, and a viability score — or evaluate a brand with Brand Intelligence.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button asChild variant="hero" size="sm">
                <Link to="/dashboard/research">Analyze a product</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/brand">Brand Intelligence</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default Overview;
