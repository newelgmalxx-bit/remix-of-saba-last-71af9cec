import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import api, { clearToken, getToken, setToken, ApiError } from "@/lib/api";
import type { User } from "@/lib/api";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (creds: { phone?: string; email?: string; password: string }) => Promise<User>;
  signup: (body: { name: string; email: string; phone: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user } = await api.auth.me();
      setUser(user);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onAuth = () => refresh();
    window.addEventListener("saba:auth", onAuth);
    window.addEventListener("storage", onAuth);
    return () => {
      window.removeEventListener("saba:auth", onAuth);
      window.removeEventListener("storage", onAuth);
    };
  }, [refresh]);

  const login = useCallback(async (creds: { phone?: string; email?: string; password: string }) => {
    const { user, token } = await api.auth.login(creds);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async (body: { name: string; email: string; phone: string; password: string }) => {
    const { user, token } = await api.auth.signup(body);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try { await api.auth.logout(); } catch { /* ignore */ }
    clearToken();
    setUser(null);
  }, []);

  const value: AuthCtx = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: !!user && ["admin", "owner", "manager", "support"].includes(user.role),
    login, signup, logout, refresh,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}