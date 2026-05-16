import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History as HistoryIcon, Trash2, Search, ExternalLink, Loader2, Star, TrendingUp, DollarSign } from "lucide-react";
import { getHistory, removeHistory, clearHistory, toCSV, downloadFile, type HistoryEntry } from "@/lib/history";

const decisionColor: Record<HistoryEntry["decision"], string> = {
  EXCELLENT: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  GOOD:      "bg-sky-500/15 text-sky-400 border-sky-500/30",
  AVERAGE:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  BAD:       "bg-orange-500/15 text-orange-400 border-orange-500/30",
  REJECT:    "bg-destructive/15 text-destructive border-destructive/30",
};

const HistoryPage = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ]             = useState("");
  const navigate              = useNavigate();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setEntries(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    window.addEventListener("asin_history_changed", refresh);
    return () => window.removeEventListener("asin_history_changed", refresh);
  }, []);

  const filtered = entries.filter((e) => {
    const s = q.toLowerCase();
    return !s
      || e.asin.toLowerCase().includes(s)
      || (e.title ?? "").toLowerCase().includes(s)
      || (e.brand ?? "").toLowerCase().includes(s);
  });

  const handleClear = async () => {
    if (!window.confirm("Clear all search history?")) return;
    await clearHistory();
    setEntries([]);
  };

  const handleRemove = async (id: string) => {
    await removeHistory(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExport = () => {
    downloadFile(`search-history-${Date.now()}.csv`, toCSV(filtered), "text/csv");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Search History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every ASIN you've analyzed — saved to your account, accessible across devices.
          </p>
        </div>
        <div className="flex gap-2">
          {filtered.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExport}>
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lookups</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${entries.length} total · showing ${filtered.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by ASIN, title, or brand"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading your history…</span>
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
                      {/* Product */}
                      <TableCell className="max-w-[220px]">
                        <div className="flex items-center gap-2">
                          {e.image && (
                            <img src={e.image} alt="" className="h-8 w-8 rounded object-contain bg-muted/30 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{e.title ?? "Untitled"}</p>
                            {e.brand && <p className="text-xs text-muted-foreground truncate">{e.brand}</p>}
                          </div>
                        </div>
                      </TableCell>
                      {/* ASIN */}
                      <TableCell className="font-mono text-xs">{e.asin}</TableCell>
                      {/* Decision */}
                      <TableCell>
                        <Badge variant="outline" className={decisionColor[e.decision]}>{e.decision}</Badge>
                      </TableCell>
                      {/* Score */}
                      <TableCell className="text-right font-mono text-xs">
                        {e.decision === "REJECT" ? "—" : `${e.total}/${e.maxTotal}`}
                        {e.pct != null && e.decision !== "REJECT" && (
                          <span className="text-muted-foreground ml-1">({e.pct}%)</span>
                        )}
                      </TableCell>
                      {/* Price */}
                      <TableCell className="text-right font-mono text-xs">
                        ${(e.sellingPrice ?? 0).toFixed(2)}
                      </TableCell>
                      {/* Profit */}
                      <TableCell className={`text-right font-mono text-xs ${(e.profit ?? 0) > 0 ? "text-emerald-400" : (e.profit ?? 0) < 0 ? "text-destructive" : ""}`}>
                        {e.decision === "REJECT" ? "—" : `$${(e.profit ?? 0).toFixed(2)}`}
                      </TableCell>
                      {/* ROI */}
                      <TableCell className={`text-right font-mono text-xs ${(e.roi ?? 0) >= 20 ? "text-emerald-400" : ""}`}>
                        {e.decision === "REJECT" ? "—" : `${(e.roi ?? 0).toFixed(0)}%`}
                      </TableCell>
                      {/* BSR */}
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {e.avgRank90 ? e.avgRank90.toLocaleString() : "—"}
                      </TableCell>
                      {/* Sales */}
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {e.monthlySalesEstimate ?? "—"}
                      </TableCell>
                      {/* When */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(e.timestamp).toLocaleString(undefined, {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </TableCell>
                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Re-run analysis"
                            onClick={() => navigate(`/dashboard/research?asin=${e.asin}`)}>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Remove"
                            onClick={() => handleRemove(e.id)}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
