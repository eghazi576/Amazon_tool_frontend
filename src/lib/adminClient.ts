import { type ScoringConfig } from "./scoring";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

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

export function getAdminSearches(limit = 50, offset = 0): Promise<{
  entries: AdminSearch[];
  total: number;
  limit: number;
  offset: number;
}> {
  return adminFetch(`/searches?limit=${limit}&offset=${offset}`);
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
