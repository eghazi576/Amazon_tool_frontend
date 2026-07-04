import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  History as HistoryIcon, Trash2, Search, ExternalLink, Loader2,
  CheckCircle2, XCircle, Boxes,
} from "lucide-react";
import { getHistory, removeHistory, clearHistory, toCSV, downloadFile, type HistoryEntry } from "@/lib/history";
import {
  getBrandHistory, deleteBrandSearch, clearBrandHistory,
  type BrandHistoryEntry,
} from "@/lib/brandHistoryClient";

// ─── Product Research History ─────────────────────────────────────────────────

const productDecisionColor: Record<string, string> = {
  EXCELLENT: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  GOOD:      "bg-sky-500/15 text-sky-400 border-sky-500/30",
  AVERAGE:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  BAD:       "bg-orange-500/15 text-orange-400 border-orange-500/30",
  REJECT:    "bg-destructive/15 text-destructive border-destructive/30",
};

function ProductHistoryTab() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ]             = useState("");
  const navigate              = useNavigate();

  const refresh = async () => {
    setLoading(true);
    try { setEntries(await getHistory()); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    refresh();
    window.addEventListener("asin_history_changed", refresh);
    return () => window.removeEventListener("asin_history_changed", refresh);
  }, []);

  const filtered = entries.filter((e) => {
    const s = q.toLowerCase();
    return !s || e.asin.toLowerCase().includes(s)
      || (e.title ?? "").toLowerCase().includes(s)
      || (e.brand ?? "").toLowerCase().includes(s);
  });

  const handleClear = async () => {
    if (!window.confirm("Clear all product search history?")) return;
    await clearHistory();
    setEntries([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${entries.length} total · showing ${filtered.length}`}
        </p>
        <div className="flex gap-2">
          {filtered.length > 0 && (
            <Button variant="outline" size="sm"
              onClick={() => downloadFile(`product-history-${Date.now()}.csv`, toCSV(filtered), "text/csv")}>
              Export CSV
            </Button>
          )}
          {entries.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-1" /> Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Filter by ASIN, title, or brand" value={q}
          onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <HistoryIcon className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            {entries.length === 0 ? "No lookups yet — analyze an ASIN to get started." : "No matches."}
          </p>
          {entries.length === 0 && (
            <Button variant="hero" size="sm" className="mt-4" onClick={() => navigate("/dashboard/research")}>
              Go to Product Research
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border/60 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>ASIN</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead className="text-right">BSR</TableHead>
                <TableHead className="text-right">Sales/mo</TableHead>
                <TableHead>When</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id} className="group">
                  <TableCell className="max-w-[220px]">
                    <div className="flex items-center gap-2">
                      {e.image && <img src={e.image} alt="" className="h-8 w-8 rounded object-contain bg-muted/30 shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{e.title ?? "Untitled"}</p>
                        {e.brand && <p className="text-xs text-muted-foreground truncate">{e.brand}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{e.asin}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={productDecisionColor[e.decision]}>{e.decision}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {e.decision === "REJECT" ? "—" : `${e.total}/${e.maxTotal}`}
                    {e.pct != null && e.decision !== "REJECT" && (
                      <span className="text-muted-foreground ml-1">({e.pct}%)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">${(e.sellingPrice ?? 0).toFixed(2)}</TableCell>
                  <TableCell className={`text-right font-mono text-xs ${(e.profit ?? 0) > 0 ? "text-emerald-400" : (e.profit ?? 0) < 0 ? "text-destructive" : ""}`}>
                    {e.decision === "REJECT" ? "—" : `$${(e.profit ?? 0).toFixed(2)}`}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-xs ${(e.roi ?? 0) >= 20 ? "text-emerald-400" : ""}`}>
                    {e.decision === "REJECT" ? "—" : `${(e.roi ?? 0).toFixed(0)}%`}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {e.avgRank90 ? e.avgRank90.toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {e.monthlySalesEstimate ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(e.timestamp).toLocaleString(undefined, {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Re-run"
                        onClick={() => navigate(`/dashboard/research?asin=${e.asin}`)}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Remove"
                        onClick={async () => { await removeHistory(e.id); setEntries((p) => p.filter((x) => x.id !== e.id)); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Brand Intelligence History ───────────────────────────────────────────────

function BrandHistoryTab() {
  const [entries, setEntries] = useState<BrandHistoryEntry[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ]             = useState("");
  const navigate              = useNavigate();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getBrandHistory(200, 0);
      setEntries(data.entries);
      setTotal(data.total);
    } catch { /* stay empty */ }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const filtered = entries.filter((e) => {
    const s = q.toLowerCase();
    return !s
      || e.asin.toLowerCase().includes(s)
      || e.brandName.toLowerCase().includes(s)
      || (e.category ?? "").toLowerCase().includes(s);
  });

  const handleClear = async () => {
    if (!window.confirm("Clear all brand intelligence history?")) return;
    await clearBrandHistory();
    setEntries([]); setTotal(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${total} total · showing ${filtered.length}`}
        </p>
        {entries.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-1" /> Clear all
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Filter by ASIN, brand name, or category" value={q}
          onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Boxes className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            {entries.length === 0 ? "No brand evaluations yet — evaluate a brand to get started." : "No matches."}
          </p>
          {entries.length === 0 && (
            <Button variant="hero" size="sm" className="mt-4" onClick={() => navigate("/dashboard/brand")}>
              Go to Brand Intelligence
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border/60 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>ASIN</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead>Key Flags</TableHead>
                <TableHead>When</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id} className="group">
                  {/* Brand */}
                  <TableCell className="max-w-[160px]">
                    <p className="font-medium text-sm truncate">{e.brandName}</p>
                    {e.brandWebsite && (
                      <a href={e.brandWebsite} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline truncate block max-w-[140px]">
                        {e.brandWebsite.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </TableCell>
                  {/* ASIN */}
                  <TableCell className="font-mono text-xs">{e.asin}</TableCell>
                  {/* Category */}
                  <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                    {e.category ?? "—"}
                  </TableCell>
                  {/* Verdict */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {e.decision === "APPROVED"
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                      <span className={`text-xs font-semibold ${e.decision === "APPROVED" ? "text-emerald-400" : "text-destructive"}`}>
                        {e.decision}
                      </span>
                    </div>
                  </TableCell>
                  {/* Score */}
                  <TableCell className="text-right font-mono text-xs">
                    {e.score}/{e.maxScore}
                    <span className="text-muted-foreground ml-1">({e.scorePct}%)</span>
                  </TableCell>
                  {/* Key Flags */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {e.hazmatHeavyCatalog   && <FlagChip label="Hazmat" danger />}
                      {e.adultOrHighRisk       && <FlagChip label="Adult" danger />}
                      {e.massAccountTakedowns  && <FlagChip label="Takedowns" danger />}
                      {e.ipAlertRedFlags       && <FlagChip label="IP Flags" danger />}
                      {e.ipComplaintsLast12Mo > 0 && (
                        <FlagChip label={`${e.ipComplaintsLast12Mo} IP`} danger={e.ipComplaintsLast12Mo >= 2} />
                      )}
                      {!e.hazmatHeavyCatalog && !e.adultOrHighRisk && !e.massAccountTakedowns
                        && !e.ipAlertRedFlags && e.ipComplaintsLast12Mo === 0
                        && <span className="text-[9px] text-emerald-400">Clean</span>}
                    </div>
                  </TableCell>
                  {/* When */}
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(e.createdAt).toLocaleString(undefined, {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </TableCell>
                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Re-evaluate"
                        onClick={() => navigate(`/dashboard/brand?asin=${e.asin}`)}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Remove"
                        onClick={async () => {
                          await deleteBrandSearch(e.id);
                          setEntries((p) => p.filter((x) => x.id !== e.id));
                          setTotal((t) => t - 1);
                        }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function FlagChip({ label, danger }: { label: string; danger?: boolean }) {
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-medium border ${
      danger
        ? "bg-destructive/10 text-destructive border-destructive/25"
        : "bg-muted/40 text-muted-foreground border-border/50"
    }`}>{label}</span>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

const HistoryPage = () => (
  <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold">Search History</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Every analysis you've run saved to your account, accessible across devices.
      </p>
    </div>

    <Tabs defaultValue="product">
      <TabsList>
        <TabsTrigger value="product" className="gap-2">
          <Search className="h-3.5 w-3.5" /> Product Research
        </TabsTrigger>
        <TabsTrigger value="brand" className="gap-2">
          <Boxes className="h-3.5 w-3.5" /> Brand Intelligence
        </TabsTrigger>
      </TabsList>

      <TabsContent value="product" className="mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Product Lookups</CardTitle>
            <CardDescription>ASIN analyses with profit, ROI and scoring breakdown.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductHistoryTab />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="brand" className="mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Brand Evaluations</CardTitle>
            <CardDescription>Brand intelligence checks — APPROVED / REJECTED with flag summary.</CardDescription>
          </CardHeader>
          <CardContent>
            <BrandHistoryTab />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export default HistoryPage;
