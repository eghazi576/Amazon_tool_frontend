import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  apiLogin, apiRegister, apiLogout,
  apiForgotPassword, apiResetPassword, apiMe,
} from "@/lib/authClient";

type AuthContextType = {
  user:      AuthUser | null;
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
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from cookie via /me on mount
  useEffect(() => {
    apiMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
  };

  const register = async (email: string, password: string) => {
    const data = await apiRegister(email, password);
    setUser(data.user);
  };

  const logout = async () => {
    try { await apiLogout(); } catch {}
    setUser(null);
  };

  const forgotPassword = (email: string) => apiForgotPassword(email);

  const resetPassword = async (tkn: string, password: string) => {
    await apiResetPassword(tkn, password);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, forgotPassword, resetPassword }}
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
