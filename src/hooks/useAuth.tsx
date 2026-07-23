import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "@/lib/api/types";
import { runAfterCriticalPaint } from "@/lib/startup";

type LoginResult =
  | { user: User; token: string; requiresOtp?: false }
  | { user: null; token: null; requiresOtp: true; email?: string; message?: string };

type SignupResult =
  | { user: User; token: string; requiresOtp?: false }
  | { user: null; token: null; requiresOtp: true; email?: string; message?: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (creds: { phone?: string; email?: string; password: string }) => Promise<LoginResult>;
  signup: (body: { name: string; email: string; phone: string; password: string; city?: string; language?: string }) => Promise<SignupResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);
const TOKEN_KEY = "saba_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("saba:auth"));
}

function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("saba_user");
  window.dispatchEvent(new Event("saba:auth"));
}

const getAuthApi = async () => (await import("@/lib/api/auth")).auth;

function isProtectedPath() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path.startsWith("/admin") || path.startsWith("/account") || path.startsWith("/checkout");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => isProtectedPath() && !!getToken());

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    const tryMe = async () => {
      const authApi = await getAuthApi();
      const res = await authApi.me();
      const user = res.data?.user;
      setUser(user ?? null);
    };
    try {
      await tryMe();
    } catch (e) {
      if ((e as { status?: number })?.status === 401) {
        // Try one refresh round-trip before giving up.
        try {
          const authApi = await getAuthApi();
          const r = await authApi.refresh();
          if (r.data?.token) setToken(r.data.token);
          await tryMe();
        } catch (e2) {
          if ((e2 as { status?: number })?.status === 401) {
            clearToken();
            setUser(null);
          } else {
            // eslint-disable-next-line no-console
            console.warn("auth refresh failed (non-401), keeping current session", e2);
          }
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn("auth.me failed (non-401), keeping current session", e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const needsImmediateAuth = isProtectedPath();
    const cancel = getToken() && !needsImmediateAuth
      ? runAfterCriticalPaint(() => void refresh(), 7000)
      : undefined;
    if (!cancel) refresh();
    const onAuth = () => refresh();
    window.addEventListener("saba:auth", onAuth);
    window.addEventListener("storage", onAuth);
    return () => {
      cancel?.();
      window.removeEventListener("saba:auth", onAuth);
      window.removeEventListener("storage", onAuth);
    };
  }, [refresh]);

  const login = useCallback(async (creds: { phone?: string; email?: string; password: string }): Promise<LoginResult> => {
    const authApi = await getAuthApi();
    const res = await authApi.login(creds);
    const data = res.data;
    if (data?.requiresOtp) {
      return { user: null, token: null, requiresOtp: true, email: data.email, message: data.message };
    }
    if (!data?.token || !data?.user) {
      throw new Error("Invalid auth response");
    }
    setToken(data.token);
    setUser(data.user);
    return { user: data.user, token: data.token };
  }, []);

  const signup = useCallback(async (body: { name: string; email: string; phone: string; password: string; city?: string; language?: string }): Promise<SignupResult> => {
    const authApi = await getAuthApi();
    const res = await authApi.signup(body);
    const data = res.data;
    if (data?.requiresOtp) {
      return { user: null, token: null, requiresOtp: true, email: data.email, message: data.message };
    }
    if (!data?.token || !data?.user) throw new Error("Invalid auth response");
    setToken(data.token);
    setUser(data.user);
    return { user: data.user, token: data.token };
  }, []);

  const logout = useCallback(async () => {
    const authApi = await getAuthApi();
    try { await authApi.logout(); } catch { /* ignore */ }
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