import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Shield, Users, Search, TrendingUp, RotateCcw,
  Save, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  getAdminStats, getAdminSearches,
  getScoringConfig, saveScoringConfig, resetScoringConfig,
  getBrandScoringConfig, saveBrandScoringConfig, resetBrandScoringConfig,
  type AdminStats, type AdminSearch,
} from "@/lib/adminClient";
import { type ScoringConfig, DEFAULT_SCORING_CONFIG } from "@/lib/scoring";
import { type BrandScoringConfig, DEFAULT_BRAND_CONFIG } from "@/lib/brandScoring";
import { useToast } from "@/hooks/use-toast";

const decisionColor: Record<string, string> = {
  EXCELLENT: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  GOOD:      "bg-sky-500/15 text-sky-400 border-sky-500/30",
  AVERAGE:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  BAD:       "bg-orange-500/15 text-orange-400 border-orange-500/30",
  REJECT:    "bg-destructive/15 text-destructive border-destructive/30",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground">Logged in as {user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="searches">All Searches</TabsTrigger>
          <TabsTrigger value="scoring">Scoring Config</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="searches" className="mt-6">
          <SearchesTab />
        </TabsContent>
        <TabsContent value="scoring" className="mt-6">
          <Tabs defaultValue="product">
            <TabsList className="mb-6">
              <TabsTrigger value="product">Product Research</TabsTrigger>
              <TabsTrigger value="brand">Brand Intelligence</TabsTrigger>
            </TabsList>
            <TabsContent value="product">
              <ScoringTab toast={toast} />
            </TabsContent>
            <TabsContent value="brand">
              <BrandScoringTab toast={toast} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { icon: Users,     label: "Total Users",          value: stats.totalUsers,    color: "text-primary" },
    { icon: Search,    label: "Total Searches",        value: stats.totalSearches, color: "text-secondary" },
    { icon: TrendingUp,label: "Searches (last 7 days)",value: stats.recentSearches,color: "text-accent" },
  ] : [];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {loading ? (
        <div className="col-span-3 flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{c.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Searches Tab ─────────────────────────────────────────────────────────────

function SearchesTab() {
  const [data, setData]     = useState<{ entries: AdminSearch[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(0);
  const limit = 20;

  const load = useCallback((p: number) => {
    setLoading(true);
    getAdminSearches(limit, p * limit)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data ? `${data.total.toLocaleString()} total searches across all users` : "Loading…"}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {page + 1} / {totalPages || 1}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["User", "ASIN", "Title", "Decision", "Score%", "Price", "Profit", "ROI", "Date"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wide text-muted-foreground font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.entries.map((s, i) => (
                  <tr key={s.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground max-w-[120px] truncate">
                      {s.user.email}
                    </td>
                    <td className="px-3 py-2 font-mono font-semibold">{s.asin}</td>
                    <td className="px-3 py-2 max-w-[200px] truncate text-muted-foreground">{s.title ?? "—"}</td>
                    <td className="px-3 py-2">
                      {s.decision ? (
                        <span className={`inline-flex rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase ${decisionColor[s.decision] ?? ""}`}>
                          {s.decision}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-3 py-2 font-mono">{s.scorePct != null ? `${s.scorePct}%` : "—"}</td>
                    <td className="px-3 py-2 font-mono">{s.sellingPrice != null ? `$${s.sellingPrice}` : "—"}</td>
                    <td className={`px-3 py-2 font-mono ${s.profitPerUnit != null && s.profitPerUnit > 0 ? "text-emerald-400" : "text-destructive"}`}>
                      {s.profitPerUnit != null ? `$${s.profitPerUnit.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-3 py-2 font-mono">{s.roiPct != null ? `${s.roiPct}%` : "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Scoring Config Tab ───────────────────────────────────────────────────────

function ScoringTab({ toast }: { toast: any }) {
  const [config, setConfig] = useState<ScoringConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getScoringConfig()
      .then(setConfig)
      .catch(() => setConfig(DEFAULT_SCORING_CONFIG))
      .finally(() => setLoading(false));
  }, []);

  const setField = (path: string[], value: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      let obj: any = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  const save = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await saveScoringConfig(config);
      toast({ title: "Saved", description: "Scoring config updated successfully." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setSaving(true);
    try {
      const def = await resetScoringConfig();
      setConfig(def);
      toast({ title: "Reset", description: "Scoring config reset to defaults." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) return (
    <div className="flex justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Thresholds */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Rejection Thresholds</CardTitle>
          <CardDescription className="text-xs">Hard-reject limits — product fails these = REJECT instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <NumInput label="Max BSR (reject if ≥)"           value={config.maxBsr}          onChange={(v) => setField(["maxBsr"], v)} />
            <NumInput label="Min Monthly Sales (units)"        value={config.minMonthlySales}  onChange={(v) => setField(["minMonthlySales"], v)} />
            <NumInput label="Min ROI % (pass if ≥)"           value={config.minRoi}           onChange={(v) => setField(["minRoi"], v)} />
            <NumInput label="Min FBA Sellers"                  value={config.minFbaSellers}    onChange={(v) => setField(["minFbaSellers"], v)} />
            <NumInput label="Max FBA Sellers"                  value={config.maxFbaSellers}    onChange={(v) => setField(["maxFbaSellers"], v)} />
            <NumInput label="Min Rating (stars)"               value={config.minRating}        onChange={(v) => setField(["minRating"], v)} step={0.1} max={5} />
            <NumInput label="Min Review Count"                 value={config.minReviews}       onChange={(v) => setField(["minReviews"], v)} />
            <NumInput label="Min Selling Price ($)"            value={config.minPrice}         onChange={(v) => setField(["minPrice"], v)} />
          </div>
        </CardContent>
      </Card>

      {/* Decision thresholds */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Decision Thresholds (%)</CardTitle>
          <CardDescription className="text-xs">Score percentage cutoffs for EXCELLENT / GOOD / AVERAGE / BAD</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <NumInput label="EXCELLENT (% ≥)"  value={config.excellentPct} onChange={(v) => setField(["excellentPct"], v)} max={100} badge="emerald" />
            <NumInput label="GOOD (% ≥)"       value={config.goodPct}      onChange={(v) => setField(["goodPct"], v)}      max={100} badge="sky" />
            <NumInput label="AVERAGE (% ≥)"    value={config.averagePct}   onChange={(v) => setField(["averagePct"], v)}   max={100} badge="yellow" />
          </div>
        </CardContent>
      </Card>

      {/* Weights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Criterion Weights (points)</CardTitle>
          <CardDescription className="text-xs">Points awarded per criterion when passed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">High weight criteria</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {([
                ["notSeasonal",  "Not seasonal (#2)"],
                ["sales",        "Sales > threshold (#3)"],
                ["noRankSpikes", "No rank spikes (#4)"],
                ["roi",          "ROI ≥ threshold (#5)"],
                ["profit",       "Profit > $0 (#6)"],
                ["bbRotates",    "Buy Box rotates (#10)"],
                ["noAmazon",     "Amazon not seller (#11)"],
              ] as [keyof typeof config.weights, string][]).map(([key, label]) => (
                <NumInput key={key} label={label} value={config.weights[key]}
                  onChange={(v) => setField(["weights", key], v)} max={50} />
              ))}
            </div>

            <Separator />
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Medium weight criteria</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {([
                ["storageFee",     "Storage fee low/med (#7)"],
                ["mapAllows",      "Price ≥ MAP (#8)"],
                ["fbaCount",       "FBA seller count (#9)"],
                ["noRepricers",    "No aggressive repricers (#12)"],
                ["sellerRotation", "Seller rotation stable (#13)"],
                ["rating",         "Rating ≥ threshold (#19)"],
              ] as [keyof typeof config.weights, string][]).map(([key, label]) => (
                <NumInput key={key} label={label} value={config.weights[key]}
                  onChange={(v) => setField(["weights", key], v)} max={50} />
              ))}
            </div>

            <Separator />
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Low weight criteria</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {([
                ["reviews",  "Reviews ≥ threshold (#20)"],
                ["minPrice", "Price ≥ minimum (#21)"],
              ] as [keyof typeof config.weights, string][]).map(([key, label]) => (
                <NumInput key={key} label={label} value={config.weights[key]}
                  onChange={(v) => setField(["weights", key], v)} max={50} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={save} disabled={saving} variant="hero" className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
        <Button onClick={reset} disabled={saving} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" /> Reset to Defaults
        </Button>
      </div>
    </div>
  );
}

// ─── Brand Scoring Tab ────────────────────────────────────────────────────────

function BrandScoringTab({ toast }: { toast: any }) {
  const [config, setConfig] = useState<BrandScoringConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getBrandScoringConfig()
      .then(setConfig)
      .catch(() => setConfig(DEFAULT_BRAND_CONFIG))
      .finally(() => setLoading(false));
  }, []);

  const setField = (path: string[], value: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      let obj: any = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  const save = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await saveBrandScoringConfig(config);
      toast({ title: "Saved", description: "Brand scoring config updated." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const reset = async () => {
    setSaving(true);
    try {
      const def = await resetBrandScoringConfig();
      setConfig(def);
      toast({ title: "Reset", description: "Brand scoring config reset to defaults." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (loading || !config) return (
    <div className="flex justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Thresholds */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Brand Rejection Thresholds</CardTitle>
          <CardDescription className="text-xs">Configurable limits for brand evaluation criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <NumInput label="Approval threshold (%)"        value={config.approvalPct}     onChange={(v) => setField(["approvalPct"], v)}     max={100} badge="emerald" />
            <NumInput label="Max IP Complaints (last 12mo)" value={config.maxIpComplaints}  onChange={(v) => setField(["maxIpComplaints"], v)} />
            <NumInput label="Min FBA Sellers per ASIN"      value={config.minFbaSellers}    onChange={(v) => setField(["minFbaSellers"], v)} />
            <NumInput label="Max FBA Sellers per ASIN"      value={config.maxFbaSellers}    onChange={(v) => setField(["maxFbaSellers"], v)} />
            <NumInput label="Min Monthly Sales (units)"     value={config.minMonthlySales}  onChange={(v) => setField(["minMonthlySales"], v)} />
          </div>
        </CardContent>
      </Card>

      {/* Weights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Criterion Weights (points)</CardTitle>
          <CardDescription className="text-xs">Points awarded per criterion when passed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Hard Reject Criteria</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {([
              ["website",            "Has official website (#1)"],
              ["registeredBusiness", "Has registered business (#2)"],
              ["noHazmat",           "No hazmat catalog ≥10% (#9)"],
              ["noAdultRisk",        "No adult/high-risk category (#10)"],
              ["noTakedowns",        "No mass account takedowns (#12)"],
            ] as [keyof typeof config.weights, string][]).map(([key, label]) => (
              <NumInput key={key} label={label} value={config.weights[key]}
                onChange={(v) => setField(["weights", key], v)} max={50} />
            ))}
          </div>

          <Separator />
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">High Weight (Non-Reject)</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {([
              ["brandActive",    "Brand active — sale within 30d (#3)"],
              ["noIPComplaints", "IP complaints ≤ threshold (#5)"],
            ] as [keyof typeof config.weights, string][]).map(([key, label]) => (
              <NumInput key={key} label={label} value={config.weights[key]}
                onChange={(v) => setField(["weights", key], v)} max={50} />
            ))}
          </div>

          <Separator />
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Medium Weight</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {([
              ["noCounterfeit", "No counterfeit risks / IP-Alert (#6)"],
              ["fbaSellers",    "FBA sellers in ideal range (#7)"],
              ["salesVelocity", "Sales velocity > threshold (#8)"],
            ] as [keyof typeof config.weights, string][]).map(([key, label]) => (
              <NumInput key={key} label={label} value={config.weights[key]}
                onChange={(v) => setField(["weights", key], v)} max={50} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={save} disabled={saving} variant="hero" className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
        <Button onClick={reset} disabled={saving} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" /> Reset to Defaults
        </Button>
      </div>
    </div>
  );
}

// ─── Helper component ─────────────────────────────────────────────────────────

function NumInput({
  label, value, onChange, step = 1, max, badge,
}: {
  label: string; value: number; onChange: (v: number) => void;
  step?: number; max?: number; badge?: string;
}) {
  const badgeColors: Record<string, string> = {
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    sky:     "bg-sky-500/15 text-sky-400 border-sky-500/30",
    yellow:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium">{label}</Label>
        {badge && (
          <span className={`inline-flex rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase ${badgeColors[badge]}`}>
            {badge}
          </span>
        )}
      </div>
      <Input
        type="number" step={step} min={0} max={max}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="h-8 text-sm"
      />
    </div>
  );
}
