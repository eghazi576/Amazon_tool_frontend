import type { BrandInput, BrandScoreResult } from "./brandScoring";

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "";

function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch(path: string, options?: RequestInit) {
  const resp = await fetch(`${BACKEND}/api/brand-history${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options?.headers ?? {}) },
  });
  const json = await resp.json();
  if (!resp.ok) throw new Error(json.error || `HTTP ${resp.status}`);
  return json.data;
}

export type BrandHistoryEntry = {
  id:            string;
  createdAt:     string;
  asin:          string;
  brandName:     string;
  brandWebsite:  string | null;
  category:      string | null;
  decision:      "APPROVED" | "REJECTED";
  score:         number;
  maxScore:      number;
  scorePct:      number;
  rejected:      boolean;
  rejectionReasons: string[];
  explanation:   string | null;
  hasRegisteredBusiness: boolean;
  hazmatHeavyCatalog:    boolean;
  adultOrHighRisk:       boolean;
  massAccountTakedowns:  boolean;
  lastSaleWithin30Days:  boolean;
  ipComplaintsLast12Mo:  number;
  ipAlertRedFlags:       boolean;
  fbaSellersPerAsin:     number | null;
  monthlySalesPerAsin:   number | null;
  mapViolationSensitive: boolean;
};

export function saveBrandSearch(input: BrandInput, result: BrandScoreResult): Promise<BrandHistoryEntry> {
  return apiFetch("/", {
    method: "POST",
    body: JSON.stringify({
      asin:                  input.asin,
      brandName:             input.brandName,
      brandWebsite:          input.brandWebsite,
      category:              input.category,
      decision:              result.decision,
      score:                 result.total,
      maxScore:              result.maxTotal,
      scorePct:              result.pct,
      rejected:              result.rejected,
      rejectionReasons:      result.rejectionReasons,
      explanation:           result.explanation,
      hasRegisteredBusiness: input.hasRegisteredBusiness,
      hazmatHeavyCatalog:    input.hazmatHeavyCatalog,
      adultOrHighRisk:       input.adultOrHighRisk,
      massAccountTakedowns:  input.massAccountTakedowns,
      lastSaleWithin30Days:  input.lastSaleWithin30Days,
      ipComplaintsLast12Mo:  input.ipComplaintsLast12Mo,
      ipAlertRedFlags:       input.ipAlertRedFlags,
      fbaSellersPerAsin:     input.fbaSellersPerAsin,
      monthlySalesPerAsin:   input.monthlySalesPerAsin,
      mapViolationSensitive: input.mapViolationSensitive,
    }),
  });
}

export function getBrandHistory(limit = 50, offset = 0): Promise<{
  entries: BrandHistoryEntry[];
  total: number;
}> {
  return apiFetch(`/?limit=${limit}&offset=${offset}`);
}

export function deleteBrandSearch(id: string): Promise<void> {
  return apiFetch(`/${id}`, { method: "DELETE" });
}

export function clearBrandHistory(): Promise<void> {
  return apiFetch("/", { method: "DELETE" });
}
