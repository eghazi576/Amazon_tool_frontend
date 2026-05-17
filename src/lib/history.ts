/**
 * History service
 * ================
 * Saves ASIN search history to the custom backend DB when the user is logged in.
 * Falls back to localStorage if not logged in or the DB is unavailable.
 *
 * Endpoints used:
 *   POST   /api/search/save
 *   GET    /api/search/history
 *   DELETE /api/search/:id
 *   DELETE /api/search/clear/all
 */

import { getToken } from "@/lib/authClient";
import type { ScoreResult } from "./scoring";

export type HistoryEntry = {
  id:        string;
  timestamp: number;
  asin:      string;
  title:     string | null;
  brand:     string | null;
  image:     string | null;
  category?: string | null;
  decision:  ScoreResult["decision"];
  total:     number;
  maxTotal:  number;
  pct?:      number;
  sellingPrice:   number;
  medianPrice?:   number | null;
  profit:         number | null;
  roi:            number | null;
  rejectionReasons: string[];
  currentRank?:         number | null;
  avgRank90?:           number | null;
  rating?:              number | null;
  reviewCount?:         number | null;
  fbaSellerCount?:      number | null;
  monthlySalesEstimate?: number | null;
  monthlyRevenue?:      number | null;
  isHazmat?:            boolean;
  amazonIsSeller?:      boolean;
};

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const LS_KEY  = "asin_history";
const LS_MAX  = 100;

function getBearerToken(): string | null {
  return getToken();
}

const notify = () => window.dispatchEvent(new Event("asin_history_changed"));

// ─── localStorage fallback ────────────────────────────────────────────────────
function lsGet(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
}
function lsSave(entries: HistoryEntry[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(entries.slice(0, LS_MAX)));
}

// ─── addHistory ───────────────────────────────────────────────────────────────
export async function addHistory(
  entry: Omit<HistoryEntry, "id" | "timestamp">,
  scoreResult?: ScoreResult
): Promise<HistoryEntry> {
  const full: HistoryEntry = {
    ...entry,
    id:        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };

  const token = getBearerToken();

  if (token) {
    try {
      await fetch(`${BACKEND}/api/search/save`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          asin:                 full.asin,
          title:                full.title,
          brand:                full.brand,
          image:                full.image,
          category:             full.category,
          sellingPrice:         full.sellingPrice,
          medianPrice:          full.medianPrice ?? full.sellingPrice,
          profit:               full.profit,
          roi:                  full.roi,
          margin:               scoreResult?.margin ?? 0,
          decision:             full.decision,
          score:                full.total,
          maxScore:             full.maxTotal,
          pct:                  scoreResult?.pct ?? 0,
          referralFee:          scoreResult?.referralFee ?? 0,
          fbaFee:               scoreResult?.fbaFee ?? 0,
          storageFee:           scoreResult?.storageFee ?? 0,
          totalFees:            scoreResult?.totalFees ?? 0,
          cogs:                 scoreResult?.cogs ?? 0,
          breakEven:            scoreResult?.breakEven ?? 0,
          rejectionReasons:     full.rejectionReasons,
          currentRank:          full.currentRank,
          avgRank90:            full.avgRank90,
          currentRating:        full.rating,
          currentReviewCount:   full.reviewCount,
          currentFbaCount:      full.fbaSellerCount,
          monthlySalesEstimate: full.monthlySalesEstimate,
          monthlyRevenue:       full.monthlyRevenue,
          isHazmat:             full.isHazmat,
          amazonIsSeller:       full.amazonIsSeller,
        }),
      });
    } catch (e) {
      console.warn("History DB save failed, falling back to localStorage:", e);
      lsSave([full, ...lsGet()]);
    }
  } else {
    lsSave([full, ...lsGet()]);
  }

  notify();
  return full;
}

// ─── getHistory ───────────────────────────────────────────────────────────────
export async function getHistory(): Promise<HistoryEntry[]> {
  const token = getBearerToken();

  if (token) {
    try {
      const resp = await fetch(`${BACKEND}/api/search/history?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("DB fetch failed");
      const json = await resp.json();
      const entries = json?.data?.entries ?? [];

      // Prisma returns camelCase field names
      return entries.map((row: any): HistoryEntry => ({
        id:               row.id,
        timestamp:        new Date(row.createdAt).getTime(),
        asin:             row.asin,
        title:            row.title,
        brand:            row.brand,
        image:            row.image,
        category:         row.category,
        decision:         row.decision,
        total:            row.score ?? 0,
        maxTotal:         row.maxScore ?? 104,
        pct:              row.scorePct,
        sellingPrice:     row.sellingPrice ?? 0,
        profit:           row.profitPerUnit ?? 0,
        roi:              row.roiPct ?? 0,
        rejectionReasons: row.rejectionReasons ?? [],
        currentRank:      row.currentBsr,
        avgRank90:        row.avgBsr90d,
        rating:           row.rating,
        reviewCount:      row.reviewCount,
        fbaSellerCount:   row.fbaSellerCount,
        monthlySalesEstimate: row.monthlySalesEst,
        monthlyRevenue:   row.monthlyRevenue,
        isHazmat:         row.isHazmat,
        amazonIsSeller:   row.amazonIsSeller,
      }));
    } catch {
      return lsGet();
    }
  }

  return lsGet();
}

// ─── removeHistory ────────────────────────────────────────────────────────────
export async function removeHistory(id: string): Promise<void> {
  const token = getBearerToken();
  if (token) {
    try {
      await fetch(`${BACKEND}/api/search/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      lsSave(lsGet().filter((e) => e.id !== id));
    }
  } else {
    lsSave(lsGet().filter((e) => e.id !== id));
  }
  notify();
}

// ─── clearHistory ─────────────────────────────────────────────────────────────
export async function clearHistory(): Promise<void> {
  const token = getBearerToken();
  if (token) {
    try {
      await fetch(`${BACKEND}/api/search/clear/all`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  } else {
    localStorage.removeItem(LS_KEY);
  }
  notify();
}

// ─── CSV export helpers ───────────────────────────────────────────────────────
export function toCSV(entries: HistoryEntry[]): string {
  const header = ["Timestamp","ASIN","Title","Brand","Decision","Score","Max","Price","Profit","ROI%","Reasons"];
  const rows   = entries.map((e) => [
    new Date(e.timestamp).toISOString(), e.asin,
    (e.title ?? "").replace(/"/g, '""'),
    (e.brand ?? "").replace(/"/g, '""'),
    e.decision, e.total, e.maxTotal,
    e.sellingPrice.toFixed(2), (e.profit ?? 0).toFixed(2), (e.roi ?? 0).toFixed(1),
    e.rejectionReasons.join("; "),
  ]);
  return [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}
