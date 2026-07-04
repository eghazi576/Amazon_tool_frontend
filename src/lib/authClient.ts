const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "";

export type AuthUser = {
  id:        string;
  email:     string;
  createdAt: string;
  isAdmin?:  boolean;
};

// ─── Base fetch with auto-refresh on 401 ───────────────────────────────────

let refreshing: Promise<void> | null = null;

async function apiFetch(path: string, options?: RequestInit, retry = true): Promise<any> {
  const resp = await fetch(`${BACKEND}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (resp.status === 401 && retry) {
    // Attempt token refresh once
    if (!refreshing) {
      refreshing = fetch(`${BACKEND}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      }).then(() => { refreshing = null; }).catch(() => { refreshing = null; });
    }
    await refreshing;
    return apiFetch(path, options, false);
  }

  const json = await resp.json();
  if (!resp.ok) throw new Error(json.error || `HTTP ${resp.status}`);
  return json.data;
}

// ─── Auth API calls ─────────────────────────────────────────────────────────

export function apiLogin(email: string, password: string) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body:   JSON.stringify({ email, password }),
  }, false) as Promise<{ user: AuthUser }>;
}

export function apiRegister(email: string, password: string) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body:   JSON.stringify({ email, password }),
  }, false) as Promise<{ user: AuthUser }>;
}

export function apiLogout() {
  return apiFetch("/api/auth/logout", { method: "POST" }, false);
}

export function apiMe() {
  return apiFetch("/api/auth/me", undefined, false) as Promise<{ user: AuthUser }>;
}

export function apiForgotPassword(email: string) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body:   JSON.stringify({ email }),
  }, false) as Promise<void>;
}

export function apiResetPassword(token: string, password: string) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body:   JSON.stringify({ token, password }),
  }, false);
}
