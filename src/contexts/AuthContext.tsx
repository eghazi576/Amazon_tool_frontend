import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  apiLogin, apiRegister, apiLogout,
  apiForgotPassword, apiResetPassword, apiMe, apiRefresh,
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

  // Keep an active session alive. The access token lives 15 minutes, so while a
  // user is signed in and the app is open we refresh it every 14 -- the refresh
  // token rotates on each call, so the session never expires under someone who
  // is still using the tool. The timer stops on logout or when the tab closes.
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      apiRefresh().catch(() => {}); // a failed refresh surfaces on the next API call
    }, 14 * 60 * 1000);
    return () => clearInterval(id);
  }, [user]);

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
