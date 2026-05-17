import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  getToken, setToken, clearAuth,
  getStoredUser, setStoredUser,
  apiLogin, apiRegister, apiLogout,
  apiForgotPassword, apiResetPassword,
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
    const storedUser  = getStoredUser();
    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
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
