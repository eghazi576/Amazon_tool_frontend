/**
 * History service
 * ================
 * Saves ASIN search history to backend DB (Supabase) when user is logged in.
 * Falls back to localStorage if not logged in or DB unavailable.
 *
 * Backend endpoint: POST /api/search/save
 *                  GET  /api/search/history
 *                  DELETE /api/search/:id
 *                  DELETE /api/search/clear/all
 */

import { supabase } from "@/integrations/supabase/client";
import type { ScoreResult } from "./scoring";

export type HistoryEntry = {
  id: string;
  timestamp: number;        // unix ms
  asin: string;
  title: string | null;
  brand: string | null;
  image: string | null;
  category?: string | null;
  decision: ScoreResult["decision"];
  total: number;
  maxTotal: number;
  pct?: number;
  sellingPrice: number;
  profit: number;
  roi: number;
  rejectionReasons: string[];
  // Extra Keepa metrics stored
  currentRank?: number | null;
  avgRank90?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  fbaSellerCount?: number | null;
  monthlySalesEstimate?: number | null;
  monthlyRevenue?: number | null;
  isHazmat?: boolean;
  amazonIsSeller?: boolean;
};

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const LS_KEY  = "asin_history";
const LS_MAX  = 100;

// Get Supabase session token (null if not logged in)
async function getBearerToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

// Dispatch event so History page re-renders
const notify = () => window.dispatchEvent(new Event("asin_history_changed"));

// ─── localStorage fallback ────────────────────────────────────────────────────
function lsGet(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
}
function lsSave(entries: HistoryEntry[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(entries.slice(0, LS_MAX)));
}

// ─── addHistory — called after every score calculation ───────────────────────
export async function addHistory(
  entry: Omit<HistoryEntry, "id" | "timestamp">,
  scoreResult?: ScoreResult
): Promise<HistoryEntry> {
  const full: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };

  const token = await getBearerToken();

  if (token) {
    // Save to DB via backend
    try {
      await fetch(`${BACKEND}/api/search/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          asin:              full.asin,
          title:             full.title,
          brand:             full.brand,
          image:             full.image,
          category:          full.category,
          sellingPrice:      full.sellingPrice,
          medianPrice:       scoreResult?.medianPrice90 ?? full.sellingPrice,
          profit:            full.profit,
          roi:               full.roi,
          margin:            scoreResult?.margin ?? 0,
          decision:          full.decision,
          score:             full.total,
          maxScore:          full.maxTotal,
          pct:               scoreResult?.pct ?? 0,
          referralFee:       scoreResult?.referralFee ?? 0,
          fbaFee:            scoreResult?.fbaFee ?? 0,
          storageFee:        scoreResult?.storageFee ?? 0,
          totalFees:         scoreResult?.totalFees ?? 0,
          cogs:              scoreResult?.cogs ?? 0,
          breakEven:         scoreResult?.breakEven ?? 0,
          rejectionReasons:  full.rejectionReasons,
          currentRank:       full.currentRank,
          avgRank90:         full.avgRank90,
          currentRating:     full.rating,
          currentReviewCount:full.reviewCount,
          currentFbaCount:   full.fbaSellerCount,
          monthlySalesEstimate: full.monthlySalesEstimate,
          monthlyRevenue:    full.monthlyRevenue,
          isHazmat:          full.isHazmat,
          amazonIsSeller:    full.amazonIsSeller,
        }),
      });
    } catch (e) {
      console.warn("History DB save failed, falling back to localStorage:", e);
      // Fallback to localStorage
      lsSave([full, ...lsGet()]);
    }
  } else {
    // Not logged in — use localStorage
    lsSave([full, ...lsGet()]);
  }

  notify();
  return full;
}

// ─── getHistory — loads from DB if logged in, else localStorage ──────────────
export async function getHistory(): Promise<HistoryEntry[]> {
  const token = await getBearerToken();

  if (token) {
    try {
      const resp = await fetch(`${BACKEND}/api/search/history?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("DB fetch failed");
      const { entries } = await resp.json();

      // Map DB rows → HistoryEntry shape
      return (entries ?? []).map((row: any): HistoryEntry => ({
        id:               row.id,
        timestamp:        new Date(row.created_at).getTime(),
        asin:             row.asin,
        title:            row.title,
        brand:            row.brand,
        image:            row.image,
        category:         row.category,
        decision:         row.decision,
        total:            row.score ?? 0,
        maxTotal:         row.max_score ?? 104,
        pct:              row.score_pct,
        sellingPrice:     row.selling_price ?? 0,
        profit:           row.profit_per_unit ?? 0,
        roi:              row.roi_pct ?? 0,
        rejectionReasons: row.rejection_reasons ?? [],
        currentRank:      row.current_bsr,
        avgRank90:        row.avg_bsr_90d,
        rating:           row.rating,
        reviewCount:      row.review_count,
        fbaSellerCount:   row.fba_seller_count,
        monthlySalesEstimate: row.monthly_sales_est,
        monthlyRevenue:   row.monthly_revenue,
        isHazmat:         row.is_hazmat,
        amazonIsSeller:   row.amazon_is_seller,
      }));
    } catch {
      // Fallback to localStorage
      return lsGet();
    }
  }

  return lsGet();
}

// ─── removeHistory ────────────────────────────────────────────────────────────
export async function removeHistory(id: string): Promise<void> {
  const token = await getBearerToken();
  if (token) {
    try {
      await fetch(`${BACKEND}/api/search/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Fallback
      lsSave(lsGet().filter((e) => e.id !== id));
    }
  } else {
    lsSave(lsGet().filter((e) => e.id !== id));
  }
  notify();
}

// ─── clearHistory ─────────────────────────────────────────────────────────────
export async function clearHistory(): Promise<void> {
  const token = await getBearerToken();
  if (token) {
    try {
      await fetch(`${BACKEND}/api/search/clear/all`, {
        method: "DELETE",
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

// ─── CSV export helpers (unchanged) ─────────────────────────────────────────
export function toCSV(entries: HistoryEntry[]): string {
  const header = ["Timestamp","ASIN","Title","Brand","Decision","Score","Max","Price","Profit","ROI%","Reasons"];
  const rows   = entries.map((e) => [
    new Date(e.timestamp).toISOString(), e.asin,
    (e.title ?? "").replace(/"/g, '""'),
    (e.brand ?? "").replace(/"/g, '""'),
    e.decision, e.total, e.maxTotal,
    e.sellingPrice.toFixed(2), e.profit.toFixed(2), e.roi.toFixed(1),
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
