import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Boxes, CheckCircle2, XCircle, Building2, ShieldAlert,
  TrendingUp, RotateCcw, Loader2, Sparkles, Pencil,
} from "lucide-react";
import { scoreBrand, type BrandInput, type BrandScoreResult } from "@/lib/brandScoring";
import { fetchKeepaProduct } from "@/lib/keepaService";
import { saveBrandSearch } from "@/lib/brandHistoryClient";

const defaultInput: BrandInput = {
  asin: "",
  brandName: "",
  brandWebsite: "",
  hasRegisteredBusiness: false,
  businessRegistrationDate: "",
  category: "",
  monthlySalesPerAsin: 0,
  avgRating: 0,
  avgReviewCount: 0,
  fbaSellersPerAsin: 0,
  amazonBuyboxSharePct: 0,
  ipComplaintsLast12Mo: 0,
  ipAlertRedFlags: false,
  hazmatHeavyCatalog: false,
  mapViolationSensitive: false,
  adultOrHighRisk: false,
  massAccountTakedowns: false,
  lastSaleWithin30Days: false,
};

// Fields that were auto-filled from API
type AutoFilledKeys = Set<keyof BrandInput>;

export default function BrandIntelligence() {
  const [input, setInput]         = useState<BrandInput>(defaultInput);
  const [result, setResult]       = useState<BrandScoreResult | null>(null);
  const [fetching, setFetching]   = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [autoFilled, setAutoFilled] = useState<AutoFilledKeys>(new Set());
  const [brandNameOverride, setBrandNameOverride] = useState(false);

  const set = <K extends keyof BrandInput>(k: K, v: BrandInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  const evaluate = () => {
    const scored = scoreBrand(input);
    setResult(scored);
    // Save to history (fire-and-forget — don't block UI on save errors)
    saveBrandSearch(input, scored).catch(() => {});
  };
  const reset = () => {
    setInput(defaultInput);
    setResult(null);
    setFetchError(null);
    setAutoFilled(new Set());
    setBrandNameOverride(false);
  };

  const fetchFromAsin = async () => {
    const asin = input.asin.trim().toUpperCase();
    if (asin.length !== 10) { setFetchError("ASIN must be exactly 10 characters"); return; }
    setFetching(true);
    setFetchError(null);
    try {
      const data = await fetchKeepaProduct(asin);
      const filled = new Set<keyof BrandInput>();

      const updates: Partial<BrandInput> = {};

      if (data.brand) {
        updates.brandName = data.brand;
        filled.add("brandName");
      }
      if (data.category || data.rootCategory) {
        updates.category = data.category || data.rootCategory || "";
        filled.add("category");
      }
      if (data.isHazmat) {
        updates.hazmatHeavyCatalog = true;
        filled.add("hazmatHeavyCatalog");
      }
      if (data.isAdultProduct) {
        updates.adultOrHighRisk = true;
        filled.add("adultOrHighRisk");
      }
      // MAP price exists → brand likely enforces MAP policy
      if (data.pricing?.mapPrice && data.pricing.mapPrice > 0) {
        updates.mapViolationSensitive = true;
        filled.add("mapViolationSensitive");
      }
      if (data.metrics.currentRating && data.metrics.currentRating > 0) {
        updates.avgRating = parseFloat(data.metrics.currentRating.toFixed(1));
        filled.add("avgRating");
      }
      if (data.metrics.currentReviewCount && data.metrics.currentReviewCount > 0) {
        updates.avgReviewCount = data.metrics.currentReviewCount;
        filled.add("avgReviewCount");
      }
      if (data.metrics.currentFbaCount && data.metrics.currentFbaCount > 0) {
        updates.fbaSellersPerAsin = data.metrics.currentFbaCount;
        filled.add("fbaSellersPerAsin");
      }
      if (data.metrics.monthlySalesEstimate && data.metrics.monthlySalesEstimate > 0) {
        updates.monthlySalesPerAsin = data.metrics.monthlySalesEstimate;
        filled.add("monthlySalesPerAsin");
      }
      if (data.metrics.amazonIsSeller) {
        updates.amazonBuyboxSharePct = 100;
        filled.add("amazonBuyboxSharePct");
      }

      setInput((p) => ({ ...p, ...updates }));
      setAutoFilled(filled);
      setBrandNameOverride(false);
    } catch (e: any) {
      setFetchError(e.message || "Failed to fetch product data");
    } finally {
      setFetching(false);
    }
  };

  const resultColor = !result ? ""
    : result.decision === "APPROVED"
    ? "border-emerald-500/40 bg-emerald-500/5"
    : "border-destructive/40 bg-destructive/5";

  const AutoBadge = ({ field }: { field: keyof BrandInput }) =>
    autoFilled.has(field) ? (
      <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-semibold bg-primary/15 text-primary border border-primary/25">
        <Sparkles className="h-2.5 w-2.5" /> Auto
      </span>
    ) : null;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Brand Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter an ASIN to auto-fill brand data, then complete the remaining fields and evaluate.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
          <Boxes className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">

          {/* ── ASIN Lookup ───────────────────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/3">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Auto-fill from ASIN
              </CardTitle>
              <CardDescription className="text-xs">
                Enter a sample ASIN from this brand — brand name, category, ratings, FBA sellers, hazmat status and more will be auto-filled.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={input.asin}
                  onChange={(e) => { set("asin", e.target.value.toUpperCase()); setFetchError(null); }}
                  placeholder="B0XXXXXXXXX"
                  maxLength={10}
                  className="font-mono uppercase"
                />
                <Button onClick={fetchFromAsin} disabled={fetching || input.asin.length !== 10} className="shrink-0 gap-1.5">
                  {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {fetching ? "Loading..." : "Submit"}
                </Button>
              </div>
              {fetchError && <p className="text-xs text-destructive">{fetchError}</p>}
              {autoFilled.size > 0 && (
                <p className="text-xs text-primary">
                  ✓ {autoFilled.size} fields auto-filled — review and adjust below if needed.
                </p>
              )}
            </CardContent>
          </Card>

          {/* ── Section 1: Brand Identity ─────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Section 1 — Brand Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">

                {/* Brand Name — auto-fill + manual override */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium">Brand Name *</Label>
                    <AutoBadge field="brandName" />
                    {autoFilled.has("brandName") && !brandNameOverride && (
                      <button
                        onClick={() => setBrandNameOverride(true)}
                        className="ml-auto text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
                      >
                        <Pencil className="h-2.5 w-2.5" /> Edit
                      </button>
                    )}
                  </div>
                  <Input
                    value={input.brandName}
                    onChange={(e) => set("brandName", e.target.value)}
                    placeholder="e.g. Acme Co."
                    readOnly={autoFilled.has("brandName") && !brandNameOverride}
                    className={autoFilled.has("brandName") && !brandNameOverride ? "bg-primary/5 border-primary/20" : ""}
                  />
                </div>

                {/* Category — auto-fill + editable */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium">Category</Label>
                    <AutoBadge field="category" />
                  </div>
                  <Input
                    value={input.category}
                    onChange={(e) => set("category", e.target.value)}
                    placeholder="e.g. Home & Kitchen"
                    className={autoFilled.has("category") ? "bg-primary/5 border-primary/20" : ""}
                  />
                </div>

                <Field label="Brand Website URL *" hint="Required — no website = REJECT">
                  <Input
                    value={input.brandWebsite}
                    onChange={(e) => set("brandWebsite", e.target.value)}
                    placeholder="https://brand.com"
                  />
                  {input.brandWebsite && !input.brandWebsite.startsWith("http") && (
                    <p className="text-[10px] text-amber-400 mt-1">Include https://</p>
                  )}
                </Field>

                <Field label="Business Registration Date *" hint="Any country — no registration = REJECT">
                  <Input
                    type="date"
                    value={input.businessRegistrationDate}
                    onChange={(e) => set("businessRegistrationDate", e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <ToggleField
                  label="Has registered business details"
                  hint="Is any registration date/number verifiable? (No = REJECT)"
                  checked={input.hasRegisteredBusiness}
                  onChange={(v) => set("hasRegisteredBusiness", v)}
                  rejectIfNo
                />
                <ToggleField
                  label="Brand is active (sale within last 30 days)"
                  hint="Is there a recent sale in the last 30 days? (No = lose 10 pts)"
                  checked={input.lastSaleWithin30Days}
                  onChange={(v) => set("lastSaleWithin30Days", v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Section 2: Performance Signals ──────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Section 2 — Performance Signals
              </CardTitle>
              <CardDescription className="text-xs">
                Fields marked <span className="text-primary font-medium">Auto</span> are fetched from the sample ASIN — adjust if needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <AutoNumField
                  label="Sales Estimate (units/month)"
                  hint="> 100 units/month = pass"
                  value={input.monthlySalesPerAsin}
                  onChange={(v) => set("monthlySalesPerAsin", v)}
                  placeholder="e.g. 150"
                  isAuto={autoFilled.has("monthlySalesPerAsin")}
                />
                <AutoNumField
                  label="Ratings (avg) — 0 to 5 stars"
                  value={input.avgRating}
                  onChange={(v) => set("avgRating", v)}
                  step={0.1} max={5}
                  placeholder="e.g. 4.5"
                  isAuto={autoFilled.has("avgRating")}
                />
                <AutoNumField
                  label="Reviews Count (avg)"
                  value={input.avgReviewCount}
                  onChange={(v) => set("avgReviewCount", v)}
                  placeholder="e.g. 250"
                  isAuto={autoFilled.has("avgReviewCount")}
                />
                <AutoNumField
                  label="Number of FBA Sellers (per ASIN)"
                  hint="Ideal: 3–5 sellers"
                  value={input.fbaSellersPerAsin}
                  onChange={(v) => set("fbaSellersPerAsin", v)}
                  placeholder="e.g. 4"
                  isAuto={autoFilled.has("fbaSellersPerAsin")}
                />
                <AutoNumField
                  label="Buybox Share — Amazon as seller (%)"
                  hint="% of time Amazon holds the Buy Box"
                  value={input.amazonBuyboxSharePct}
                  onChange={(v) => set("amazonBuyboxSharePct", v)}
                  max={100}
                  placeholder="e.g. 30"
                  isAuto={autoFilled.has("amazonBuyboxSharePct")}
                />
                <NumField
                  label="IP Complaints (last 12 months)"
                  hint="0–1 = OK | ≥2 = lose 10 pts. Check ip-alert.com"
                  value={input.ipComplaintsLast12Mo}
                  onChange={(v) => set("ipComplaintsLast12Mo", v)}
                  placeholder="e.g. 0"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Section 3: Risk Flags ────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-destructive" /> Section 3 — Risk Flags
              </CardTitle>
              <CardDescription className="text-xs">
                <span className="text-primary font-medium">Auto-detected:</span> Hazmat · Adult/High-Risk · MAP enforcement &nbsp;|&nbsp;
                <span className="text-muted-foreground">Manual check required:</span> IP-Alert · Mass Takedowns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <ToggleField
                  label="IP-Alert red flags (counterfeit risks)"
                  hint="Check ip-alert.com — any red flags? (Yes = lose 5 pts)"
                  checked={input.ipAlertRedFlags}
                  onChange={(v) => set("ipAlertRedFlags", v)}
                  danger={input.ipAlertRedFlags}
                />
                <ToggleField
                  label="Hazmat-heavy catalog (≥10%)"
                  hint="≥10% of catalog is hazmat? (Yes = lose 10 pts)"
                  checked={input.hazmatHeavyCatalog}
                  onChange={(v) => set("hazmatHeavyCatalog", v)}
                  danger={input.hazmatHeavyCatalog}
                  isAuto={autoFilled.has("hazmatHeavyCatalog")}
                />
                <ToggleField
                  label="Minimum Advertised Price (MAP)"
                  hint="Does brand aggressively enforce MAP policy?"
                  checked={input.mapViolationSensitive}
                  onChange={(v) => set("mapViolationSensitive", v)}
                  danger={input.mapViolationSensitive}
                  isAuto={autoFilled.has("mapViolationSensitive")}
                />
                <ToggleField
                  label="Adult / High-Risk Category"
                  hint="Adult, gambling, weapons, etc.? (Yes = lose 10 pts)"
                  checked={input.adultOrHighRisk}
                  onChange={(v) => set("adultOrHighRisk", v)}
                  danger={input.adultOrHighRisk}
                  isAuto={autoFilled.has("adultOrHighRisk")}
                />
                <ToggleField
                  label="History of mass account takedowns"
                  hint="Brand caused mass seller account suspensions? (Yes = REJECT)"
                  checked={input.massAccountTakedowns}
                  onChange={(v) => set("massAccountTakedowns", v)}
                  danger={input.massAccountTakedowns}
                  rejectIfYes
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={evaluate} variant="hero" size="lg" className="flex-1">Evaluate Brand</Button>
            <Button variant="outline" size="lg" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>

        {/* ── Verdict Panel ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <Card className={result ? `border ${resultColor}` : ""}>
            <CardHeader>
              <CardTitle className="text-lg">Verdict</CardTitle>
              <CardDescription>Scored against 11 evaluation criteria from the Brand Hunting Tool spec.</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Fill in fields (or fetch from ASIN) and click <strong>Evaluate Brand</strong>.</p>
                  <p className="text-xs">11 criteria: 5 hard-reject checks + 6 weighted scoring checks. Pass threshold is 70% of max points.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`rounded-lg p-4 border ${resultColor}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {result.decision === "APPROVED"
                        ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        : <XCircle className="h-5 w-5 text-destructive" />}
                      <span className="font-display text-xl font-bold">{result.decision}</span>
                      <Badge variant="outline" className="ml-auto font-mono">
                        {result.total}/{result.maxTotal} pts ({result.pct}%)
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.explanation}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Score</span>
                        <span>70% threshold ({Math.round(result.maxTotal * 0.7)} pts)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${result.decision === "APPROVED" ? "bg-emerald-500" : "bg-destructive"}`}
                          style={{ width: `${Math.min(result.pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {result.rejectionReasons.length > 0 && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                      <p className="text-xs font-semibold text-destructive mb-2 uppercase tracking-wide">Hard Reject Reasons</p>
                      <ul className="space-y-1">
                        {result.rejectionReasons.map((r) => (
                          <li key={r} className="flex items-center gap-2 text-sm text-destructive">
                            <XCircle className="h-3.5 w-3.5 shrink-0" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Criterion Breakdown</p>
                    <div className="space-y-1">
                      {result.criteria.map((c) => (
                        <div
                          key={c.key}
                          className={`flex items-center justify-between rounded-md px-3 py-2 text-xs border ${
                            c.passed
                              ? "border-emerald-500/20 bg-emerald-500/5"
                              : c.rejectIfFail
                              ? "border-destructive/30 bg-destructive/5"
                              : "border-border/60 bg-muted/20"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {c.passed
                              ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              : <XCircle className={`h-3.5 w-3.5 shrink-0 ${c.rejectIfFail ? "text-destructive" : "text-muted-foreground"}`} />}
                            <span className={`truncate ${c.tier === "high" ? "font-medium" : ""}`}>
                              <span className="text-muted-foreground mr-1">#{c.criteriaNum}</span>
                              {c.label}
                            </span>
                            {c.rejectIfFail && !c.passed && (
                              <Badge variant="outline" className="text-[9px] py-0 h-4 px-1 shrink-0 text-destructive border-destructive/30">REJECT</Badge>
                            )}
                          </div>
                          <span className="font-mono text-muted-foreground ml-2 shrink-0">{c.earned}/{c.weight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <SummaryCell label="Hard checks" value={`${result.criteria.filter((c) => c.rejectIfFail && c.passed).length}/${result.criteria.filter((c) => c.rejectIfFail).length}`} ok={result.criteria.filter((c) => c.rejectIfFail && !c.passed).length === 0} />
                    <SummaryCell label="Score" value={`${result.total}/${result.maxTotal}`} ok={result.pct >= 70} />
                    <SummaryCell label="Threshold" value={result.pct >= 70 ? "✓ PASSED" : "✗ FAILED"} ok={result.pct >= 70} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Scoring Reference</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p><span className="font-semibold text-destructive">Hard Reject (3):</span> Website · Registration · No mass takedowns</p>
              <p><span className="font-semibold text-foreground">High weight (10 pts):</span> Active brand (30d) · ≤1 IP complaint · No hazmat ≥10% · No adult/high-risk</p>
              <p><span className="font-semibold text-foreground">Medium weight (5 pts):</span> No IP-Alert flags · FBA sellers 3–5 · Sales &gt;100/mo</p>
              <p className="pt-1 border-t border-border/40">Pass = all hard checks + ≥70% weighted points</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {hint && <p className="text-[10px] text-muted-foreground -mt-1">{hint}</p>}
      {children}
    </div>
  );
}

function NumField({ label, hint, value, onChange, step = 1, max, placeholder }: {
  label: string; hint?: string; value: number; onChange: (v: number) => void;
  step?: number; max?: number; placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <Input type="number" step={step} min={0} max={max} value={value || ""}
        placeholder={placeholder} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
    </Field>
  );
}

function AutoNumField({ label, hint, value, onChange, step = 1, max, placeholder, isAuto }: {
  label: string; hint?: string; value: number; onChange: (v: number) => void;
  step?: number; max?: number; placeholder?: string; isAuto?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium">{label}</Label>
        {isAuto && (
          <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-semibold bg-primary/15 text-primary border border-primary/25">
            <Sparkles className="h-2.5 w-2.5" /> Auto
          </span>
        )}
      </div>
      {hint && <p className="text-[10px] text-muted-foreground -mt-1">{hint}</p>}
      <Input
        type="number" step={step} min={0} max={max} value={value || ""}
        placeholder={placeholder} onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={isAuto ? "bg-primary/5 border-primary/20" : ""}
      />
    </div>
  );
}

function ToggleField({ label, hint, checked, onChange, danger, rejectIfYes, rejectIfNo, isAuto }: {
  label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void;
  danger?: boolean; rejectIfYes?: boolean; rejectIfNo?: boolean; isAuto?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-3 transition-colors ${danger ? "border-destructive/40 bg-destructive/5" : "border-border/60 bg-muted/20"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs font-medium leading-none">{label}</p>
            {isAuto && (
              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-semibold bg-primary/15 text-primary border border-primary/25">
                <Sparkles className="h-2.5 w-2.5" /> Auto
              </span>
            )}
          </div>
          {hint && <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{hint}</p>}
          {(rejectIfYes || rejectIfNo) && (
            <span className="inline-block mt-1.5 text-[9px] rounded bg-destructive/15 text-destructive px-1.5 py-0.5 uppercase tracking-wide font-medium">
              {rejectIfYes ? "Yes = REJECT" : "No = REJECT"}
            </span>
          )}
        </div>
        <Switch checked={checked} onCheckedChange={onChange} className="shrink-0 mt-0.5" />
      </div>
    </div>
  );
}

function SummaryCell({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className={`rounded-lg border p-2 text-center ${ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-destructive/30 bg-destructive/5"}`}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-xs font-bold mt-0.5 ${ok ? "text-emerald-400" : "text-destructive"}`}>{value}</p>
    </div>
  );
}
