/**
 * Brand Intelligence Page
 * ========================
 * Implements exactly the "Automated Brand Hunting Tools for Amazon Wholesale FBA" DOCX spec.
 *
 * Table A — User Input Fields (15 fields, all entered manually):
 *  ASIN, Brand Name, Brand Website URL, Business Registration Details (date),
 *  Category, Sales Estimate (per ASIN), Ratings (avg), Reviews Count (avg),
 *  Number of FBA Sellers (per ASIN), Buybox Share (Amazon as seller %),
 *  IP Complaints History, Hazmat Status, Listing Suppressions History,
 *  MAP Violation Sensitivity, Adult / High-Risk Category
 *
 * Table B — Evaluation Criteria (12 criteria):
 *  6 Hard-reject | 2 High-weight | 4 Medium-weight
 *  Pass threshold: all hard checks + ≥ 70% of weighted score
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Boxes, CheckCircle2, XCircle, Globe, Building2, ShieldAlert,
  AlertTriangle, TrendingUp, Star, Users, Link, RotateCcw
} from "lucide-react";
import { scoreBrand, type BrandInput, type BrandScoreResult } from "@/lib/brandScoring";

// Default: all inputs empty / false — user fills everything manually
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
  listingSuppressions: false,
  mapViolationSensitive: false,
  adultOrHighRisk: false,
  massAccountTakedowns: false,
  listedOnAmazon: false,
  lastSaleWithin30Days: false,
};

export default function BrandIntelligence() {
  const [input, setInput]   = useState<BrandInput>(defaultInput);
  const [result, setResult] = useState<BrandScoreResult | null>(null);

  const set = <K extends keyof BrandInput>(k: K, v: BrandInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  const evaluate = () => setResult(scoreBrand(input));
  const reset    = () => { setInput(defaultInput); setResult(null); };

  const resultColor = !result
    ? ""
    : result.decision === "APPROVED"
    ? "border-emerald-500/40 bg-emerald-500/5"
    : "border-destructive/40 bg-destructive/5";

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Brand Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate any Amazon Wholesale FBA brand using the Brand Hunting Tool criteria.
            All 15 input fields are entered manually — then scored against 12 evaluation criteria.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
          <Boxes className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">

        {/* ── INPUT FORM (Table A — 15 user input fields) ─────────────────── */}
        <div className="space-y-4">

          {/* Section 1: Identity (ASIN, Brand Name, Website, Registration, Category) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Section 1 — Brand Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Brand Name *">
                  <Input value={input.brandName} onChange={(e) => set("brandName", e.target.value)} placeholder="e.g. Acme Co." />
                </Field>
                <Field label="Sample ASIN">
                  <Input
                    value={input.asin}
                    onChange={(e) => set("asin", e.target.value.toUpperCase())}
                    placeholder="B0XXXXXXXXX"
                    maxLength={10}
                    className="font-mono uppercase"
                  />
                </Field>
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
                <Field label="Category">
                  <Input value={input.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Home &amp; Kitchen, Sports" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Business Registration Details (date) *" hint="Any country — no registration = REJECT">
                  <Input
                    type="date"
                    value={input.businessRegistrationDate}
                    onChange={(e) => set("businessRegistrationDate", e.target.value)}
                  />
                </Field>
                <ToggleField
                  label="Has registered business details"
                  hint="Is any registration date/number verifiable? (No = REJECT)"
                  checked={input.hasRegisteredBusiness}
                  onChange={(v) => set("hasRegisteredBusiness", v)}
                  rejectIfNo
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <ToggleField
                  label="Brand already listed on Amazon"
                  hint="Does the brand have active Amazon listings? (No = REJECT)"
                  checked={input.listedOnAmazon}
                  onChange={(v) => set("listedOnAmazon", v)}
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

          {/* Section 2: Performance Signals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Section 2 — Performance Signals
              </CardTitle>
              <CardDescription className="text-xs">Sales Estimate, Ratings, Reviews, FBA Sellers, Buy Box share — as per spec Table A</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <NumField
                  label="Sales Estimate (per ASIN) — units/month"
                  hint="> 100 units/month = pass"
                  value={input.monthlySalesPerAsin}
                  onChange={(v) => set("monthlySalesPerAsin", v)}
                  placeholder="e.g. 150"
                />
                <NumField
                  label="Ratings (avg) — 0 to 5 stars"
                  value={input.avgRating}
                  onChange={(v) => set("avgRating", v)}
                  step={0.1}
                  max={5}
                  placeholder="e.g. 4.5"
                />
                <NumField
                  label="Reviews Count (avg)"
                  value={input.avgReviewCount}
                  onChange={(v) => set("avgReviewCount", v)}
                  placeholder="e.g. 250"
                />
                <NumField
                  label="Number of FBA Sellers (per ASIN)"
                  hint="Ideal: 3–5 sellers"
                  value={input.fbaSellersPerAsin}
                  onChange={(v) => set("fbaSellersPerAsin", v)}
                  placeholder="e.g. 4"
                />
                <NumField
                  label="Buybox Share — Amazon as seller (%)"
                  hint="% of time Amazon holds the Buy Box"
                  value={input.amazonBuyboxSharePct}
                  onChange={(v) => set("amazonBuyboxSharePct", v)}
                  max={100}
                  placeholder="e.g. 30"
                />
                <NumField
                  label="IP Complaints History (last 12 months)"
                  hint="0–1 = OK | ≥2 = lose 10 pts. Check ip-alert.com"
                  value={input.ipComplaintsLast12Mo}
                  onChange={(v) => set("ipComplaintsLast12Mo", v)}
                  placeholder="e.g. 0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Risk Flags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-destructive" /> Section 3 — Risk Flags
              </CardTitle>
              <CardDescription className="text-xs">
                Hazmat Status, IP Complaints, Listing Suppressions, MAP Sensitivity, Adult/High-Risk — from spec Table A
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
                  label="Hazmat Status — hazmat-heavy catalog (≥10%)"
                  hint="≥10% of catalog is hazmat? (Yes = REJECT)"
                  checked={input.hazmatHeavyCatalog}
                  onChange={(v) => set("hazmatHeavyCatalog", v)}
                  danger={input.hazmatHeavyCatalog}
                  rejectIfYes
                />
                <ToggleField
                  label="Listing Suppressions History"
                  hint="Frequent listing suppressions? (Yes = lose 5 pts)"
                  checked={input.listingSuppressions}
                  onChange={(v) => set("listingSuppressions", v)}
                  danger={input.listingSuppressions}
                />
                <ToggleField
                  label="MAP Violation Sensitivity"
                  hint="Does brand aggressively enforce MAP policy?"
                  checked={input.mapViolationSensitive}
                  onChange={(v) => set("mapViolationSensitive", v)}
                  danger={input.mapViolationSensitive}
                />
                <ToggleField
                  label="Adult / High-Risk Category"
                  hint="Adult, gambling, weapons, etc.? (Yes = REJECT)"
                  checked={input.adultOrHighRisk}
                  onChange={(v) => set("adultOrHighRisk", v)}
                  danger={input.adultOrHighRisk}
                  rejectIfYes
                />
                <ToggleField
                  label="History of mass account takedowns"
                  hint="Brand has caused mass seller account suspensions? (Yes = REJECT)"
                  checked={input.massAccountTakedowns}
                  onChange={(v) => set("massAccountTakedowns", v)}
                  danger={input.massAccountTakedowns}
                  rejectIfYes
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={evaluate} variant="hero" size="lg" className="flex-1">
              Evaluate Brand
            </Button>
            <Button variant="outline" size="lg" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>

        {/* ── VERDICT PANEL (Table B criteria results) ───────────────────── */}
        <div className="space-y-4">
          <Card className={result ? `border ${resultColor}` : ""}>
            <CardHeader>
              <CardTitle className="text-lg">Verdict</CardTitle>
              <CardDescription>Scored against 12 evaluation criteria from the Brand Hunting Tool spec.</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Fill in all fields and click <strong>Evaluate Brand</strong>.</p>
                  <p className="text-xs">The tool scores 12 criteria: 6 hard-reject checks and 6 weighted scoring checks. Pass threshold is 70% of max points.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Decision badge */}
                  <div className={`rounded-lg p-4 border ${resultColor}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {result.decision === "APPROVED"
                        ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        : <XCircle className="h-5 w-5 text-destructive" />
                      }
                      <span className="font-display text-xl font-bold">{result.decision}</span>
                      <Badge variant="outline" className="ml-auto font-mono">
                        {result.total}/{result.maxTotal} pts ({result.pct}%)
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.explanation}</p>

                    {/* Threshold bar */}
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

                  {/* Hard-fail reasons */}
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

                  {/* Criterion-by-criterion breakdown */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Criterion Breakdown (Table B)
                    </p>
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
                              : <XCircle className={`h-3.5 w-3.5 shrink-0 ${c.rejectIfFail ? "text-destructive" : "text-muted-foreground"}`} />
                            }
                            <span className={`truncate ${c.tier === "high" ? "font-medium" : ""}`}>
                              <span className="text-muted-foreground mr-1">#{c.criteriaNum}</span>
                              {c.label}
                            </span>
                            {c.rejectIfFail && (
                              <Badge variant="outline" className="text-[9px] py-0 h-4 px-1 shrink-0 text-destructive border-destructive/30">
                                REJECT
                              </Badge>
                            )}
                          </div>
                          <span className="font-mono text-muted-foreground ml-2 shrink-0">
                            {c.earned}/{c.weight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary stats */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <SummaryCell label="Hard checks" value={`${result.criteria.filter((c) => c.rejectIfFail && c.passed).length}/${result.criteria.filter((c) => c.rejectIfFail).length}`} ok={result.criteria.filter((c) => c.rejectIfFail && !c.passed).length === 0} />
                    <SummaryCell label="Score" value={`${result.total}/${result.maxTotal}`} ok={result.pct >= 70} />
                    <SummaryCell label="Threshold" value={result.pct >= 70 ? "✓ PASSED" : "✗ FAILED"} ok={result.pct >= 70} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Spec reference card */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Scoring Reference</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p><span className="font-semibold text-destructive">Hard Reject (6):</span> Website · Registration · Listed on Amazon · No hazmat ≥10% · No adult/high-risk · No mass takedowns</p>
              <p><span className="font-semibold text-foreground">High weight (10 pts):</span> Active brand (30d) · ≤1 IP complaint</p>
              <p><span className="font-semibold text-foreground">Medium weight (5 pts):</span> No IP-Alert flags · FBA sellers 3–5 · Sales &gt;100/mo · No suppressions</p>
              <p className="pt-1 border-t border-border/40">Pass = all hard checks + ≥70% of {Math.round((10*6 + 5*4) * 0.7)} weighted points (max {10*6 + 5*4} pts)</p>
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

function NumField({
  label, hint, value, onChange, step = 1, max, placeholder,
}: { label: string; hint?: string; value: number; onChange: (v: number) => void; step?: number; max?: number; placeholder?: string }) {
  return (
    <Field label={label} hint={hint}>
      <Input
        type="number" step={step} min={0} max={max}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </Field>
  );
}

function ToggleField({
  label, hint, checked, onChange, danger, rejectIfYes, rejectIfNo,
}: {
  label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void;
  danger?: boolean; rejectIfYes?: boolean; rejectIfNo?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-3 transition-colors ${danger ? "border-destructive/40 bg-destructive/5" : "border-border/60 bg-muted/20"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium leading-none">{label}</p>
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
