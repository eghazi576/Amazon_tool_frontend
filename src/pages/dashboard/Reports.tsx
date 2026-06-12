import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Download, FileText, FileSpreadsheet, FileJson } from "lucide-react";
import { getHistory, toCSV, downloadFile, type HistoryEntry } from "@/lib/history";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const decisionColor: Record<HistoryEntry["decision"], string> = {
  EXCELLENT: "hsl(142 71% 45%)",
  GOOD: "hsl(199 89% 55%)",
  AVERAGE: "hsl(38 92% 55%)",
  BAD: "hsl(25 95% 60%)",
  REJECT: "hsl(var(--destructive))",
};

const ReportsPage = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const refresh = () => setEntries(getHistory());
    refresh();
    window.addEventListener("asin_history_changed", refresh);
    return () => window.removeEventListener("asin_history_changed", refresh);
  }, []);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { EXCELLENT: 0, GOOD: 0, AVERAGE: 0, BAD: 0, REJECT: 0 };
    let totalRoi = 0, scoredCount = 0, approvedCount = 0;
    entries.forEach((e) => {
      counts[e.decision] = (counts[e.decision] ?? 0) + 1;
      if (e.decision !== "REJECT") {
        totalRoi += e.roi;
        scoredCount++;
        if (e.decision === "EXCELLENT" || e.decision === "GOOD") approvedCount++;
      }
    });
    return {
      counts,
      avgRoi: scoredCount > 0 ? totalRoi / scoredCount : 0,
      approvedCount,
      total: entries.length,
    };
  }, [entries]);

  const pieData = (["EXCELLENT", "GOOD", "AVERAGE", "BAD", "REJECT"] as const)
    .map((k) => ({ name: k, value: stats.counts[k] ?? 0 }))
    .filter((d) => d.value > 0);

  const recentBars = entries.slice(0, 10).reverse().map((e) => ({
    name: e.asin.slice(-4),
    score: e.decision === "REJECT" ? 0 : e.total,
  }));

  const exportCSV = () => {
    if (entries.length === 0) return toast({ title: "Nothing to export", description: "Run an analysis first." });
    downloadFile(`wholesaleos-report-${new Date().toISOString().slice(0, 10)}.csv`, toCSV(entries), "text/csv");
    toast({ title: "CSV downloaded" });
  };

  const exportJSON = () => {
    if (entries.length === 0) return toast({ title: "Nothing to export", description: "Run an analysis first." });
    downloadFile(`wholesaleos-report-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(entries, null, 2), "application/json");
    toast({ title: "JSON downloaded" });
  };

  const exportSummary = () => {
    if (entries.length === 0) return toast({ title: "Nothing to export", description: "Run an analysis first." });
    const lines = [
      `WholesaleOS Product Research Report`,
      `Generated: ${new Date().toLocaleString()}`,
      ``,
      `Total lookups: ${stats.total}`,
      `Approved (Excellent + Good): ${stats.approvedCount}`,
      `Average ROI: ${stats.avgRoi.toFixed(1)}%`,
      ``,
      `Verdict breakdown:`,
      ...Object.entries(stats.counts).map(([k, v]) => `  ${k}: ${v}`),
      ``,
      `Top entries:`,
      ...entries.slice(0, 20).map(
        (e) => `  [${e.decision}] ${e.asin} — ${e.title?.slice(0, 60) ?? ""} | $${e.sellingPrice.toFixed(2)} | ROI ${e.roi.toFixed(0)}%`
      ),
    ].join("\n");
    downloadFile(`wholesaleos-summary-${new Date().toISOString().slice(0, 10)}.txt`, lines, "text/plain");
    toast({ title: "Summary downloaded" });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aggregate insights from your analyses, with export options.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total lookups" value={stats.total.toString()} />
        <KpiCard label="Approved" value={stats.approvedCount.toString()} accent="text-emerald-400" />
        <KpiCard label="Rejected" value={(stats.counts.REJECT ?? 0).toString()} accent="text-destructive" />
        <KpiCard label="Avg ROI" value={`${stats.avgRoi.toFixed(0)}%`} />
      </div>

      {/* Generate report card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generate report</CardTitle>
          <CardDescription>Download your full research history in your preferred format.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" onClick={exportCSV} className="justify-start h-auto py-3" disabled={entries.length === 0}>
              <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">CSV export</span>
                <span className="text-xs text-muted-foreground">Spreadsheet-ready</span>
              </div>
            </Button>
            <Button variant="outline" onClick={exportJSON} className="justify-start h-auto py-3" disabled={entries.length === 0}>
              <FileJson className="h-5 w-5 text-sky-400" />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">JSON export</span>
                <span className="text-xs text-muted-foreground">Full raw data</span>
              </div>
            </Button>
            <Button variant="hero" onClick={exportSummary} className="justify-start h-auto py-3" disabled={entries.length === 0}>
              <FileText className="h-5 w-5" />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">Summary report</span>
                <span className="text-xs opacity-80">Text overview</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      {entries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No data yet — analyze an ASIN to populate reports.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Verdict distribution</CardTitle>
              <CardDescription className="text-xs">Across all {stats.total} lookups</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={decisionColor[d.name as HistoryEntry["decision"]]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {pieData.map((d) => (
                  <Badge key={d.name} variant="outline" style={{ color: decisionColor[d.name as HistoryEntry["decision"]] }}>
                    {d.name}: {d.value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent scores</CardTitle>
              <CardDescription className="text-xs">Last {recentBars.length} analyses (by ASIN suffix)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={recentBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const KpiCard = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-2xl font-bold ${accent ?? ""}`}>{value}</p>
    </CardContent>
  </Card>
);

export default ReportsPage;
