import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  getToken, setToken, clearAuth,
  getStoredUser, setStoredUser,
  apiLogin, apiRegister, apiLogout,
  apiForgotPassword, apiResetPassword,
  isTokenExpired,
} from "@/lib/authClient";

type AuthContextType = {
  user:      AuthUser | null;
  token:     string | null;
  isLoading: boolean;
  login:         (email: string, password: string) => Promise<void>;
  register:      (email: string, password: string) => Promise<void>;
  logout:        () => Promise<void>;
  forgotPassword:(email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [token,     setTokenState]= useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();

    // Immediately reject tokens that have expired (no network call needed)
    if (!storedToken || isTokenExpired(storedToken)) {
      clearAuth();
      setIsLoading(false);
      return;
    }

    // Validate with backend so isAdmin stays up-to-date
    fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/api/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.user) {
          setStoredUser(json.data.user);
          setUser(json.data.user);
          setTokenState(storedToken);
        } else {
          // Backend rejected the token (invalid/revoked)
          clearAuth();
        }
      })
      .catch(() => {
        // Network offline — only trust stored session if token is still valid
        const storedUser = getStoredUser();
        if (storedUser && !isTokenExpired(storedToken)) {
          setUser(storedUser);
          setTokenState(storedToken);
        } else {
          clearAuth();
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setToken(data.token);
    setStoredUser(data.user);
    setTokenState(data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string) => {
    const data = await apiRegister(email, password);
    setToken(data.token);
    setStoredUser(data.user);
    setTokenState(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    if (token) {
      try { await apiLogout(token); } catch {}
    }
    clearAuth();
    setTokenState(null);
    setUser(null);
  };

  const forgotPassword = (email: string) => apiForgotPassword(email);

  const resetPassword = async (tkn: string, password: string) => {
    await apiResetPassword(tkn, password);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
