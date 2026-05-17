const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const TOKEN_KEY = "auth_token";
const USER_KEY  = "auth_user";

export type AuthUser = {
  id:        string;
  email:     string;
  createdAt: string;
};

// ─── Token storage ─────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ─── Base fetch helper ──────────────────────────────────────────────────────

async function apiFetch(path: string, options?: RequestInit): Promise<any> {
  const resp = await fetch(`${BACKEND}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  const json = await resp.json();
  if (!resp.ok) throw new Error(json.error || `HTTP ${resp.status}`);
  return json.data;
}

// ─── Auth API calls ─────────────────────────────────────────────────────────

export function apiLogin(email: string, password: string) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body:   JSON.stringify({ email, password }),
  }) as Promise<{ user: AuthUser; token: string }>;
}

export function apiRegister(email: string, password: string) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body:   JSON.stringify({ email, password }),
  }) as Promise<{ user: AuthUser; token: string }>;
}

export function apiLogout(token: string) {
  return apiFetch("/api/auth/logout", {
    method:  "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function apiForgotPassword(email: string) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body:   JSON.stringify({ email }),
  }) as Promise<void>;
}

export function apiResetPassword(token: string, password: string) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body:   JSON.stringify({ token, password }),
  });
}
