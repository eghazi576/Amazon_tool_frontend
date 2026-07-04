import { type ScoringConfig } from "./scoring";
import { type BrandScoringConfig } from "./brandScoring";

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "";

function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function adminFetch(path: string, options?: RequestInit) {
  const resp = await fetch(`${BACKEND}/api/admin${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options?.headers ?? {}) },
  });
  const json = await resp.json();
  if (!resp.ok) throw new Error(json.error || `HTTP ${resp.status}`);
  return json.data;
}

export type AdminSearch = {
  id: string;
  asin: string;
  title: string | null;
  brand: string | null;
  category: string | null;
  decision: string | null;
  scorePct: number | null;
  sellingPrice: number | null;
  profitPerUnit: number | null;
  roiPct: number | null;
  createdAt: string;
  user: { email: string };
};

export type AdminStats = {
  totalUsers: number;
  totalSearches: number;
  recentSearches: number;
};

export function getAdminStats(): Promise<AdminStats> {
  return adminFetch("/stats");
}

export type SearchFilters = {
  search?:   string;
  decision?: string;
  dateFrom?: string;
  dateTo?:   string;
};

export function getAdminSearches(
  limit = 50,
  offset = 0,
  filters: SearchFilters = {}
): Promise<{ entries: AdminSearch[]; total: number; limit: number; offset: number }> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (filters.search)   params.set("search",   filters.search);
  if (filters.decision) params.set("decision", filters.decision);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo)   params.set("dateTo",   filters.dateTo);
  return adminFetch(`/searches?${params.toString()}`);
}

export function getScoringConfig(): Promise<ScoringConfig> {
  return adminFetch("/scoring-config");
}

export function saveScoringConfig(config: ScoringConfig): Promise<ScoringConfig> {
  return adminFetch("/scoring-config", {
    method: "PUT",
    body: JSON.stringify(config),
  });
}

export function resetScoringConfig(): Promise<ScoringConfig> {
  return adminFetch("/scoring-config/reset", { method: "POST" });
}

export function getBrandScoringConfig(): Promise<BrandScoringConfig> {
  return adminFetch("/brand-scoring-config");
}

export function saveBrandScoringConfig(config: BrandScoringConfig): Promise<BrandScoringConfig> {
  return adminFetch("/brand-scoring-config", {
    method: "PUT",
    body: JSON.stringify(config),
  });
}

export function resetBrandScoringConfig(): Promise<BrandScoringConfig> {
  return adminFetch("/brand-scoring-config/reset", { method: "POST" });
}

export function getAdminBrandSearches(
  limit = 50,
  offset = 0,
  filters: { search?: string; decision?: string } = {}
): Promise<{ entries: any[]; total: number; limit: number; offset: number }> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (filters.search)   params.set("search",   filters.search);
  if (filters.decision) params.set("decision", filters.decision);
  return adminFetch(`/brand-searches?${params.toString()}`);
}
