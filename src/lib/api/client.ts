// Central API client for SABA backend.
// All responses follow: { success, data, message }
// Errors: 422 validation, 401 unauthorized, 403 forbidden.

export const API_BASE_URL = "https://saba-design.com/api";

const TOKEN_KEY = "saba_token";
const SESSION_KEY = "saba_session";

// ---------- Token ----------
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("saba:auth"));
}
export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("saba:auth"));
}

// ---------- Guest cart session ----------
function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let s = localStorage.getItem(SESSION_KEY);
  if (!s) {
    s = uuid();
    localStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

// ---------- Errors ----------
export class ApiError extends Error {
  status: number;
  errors: Record<string, string>;
  data: unknown;
  constructor(message: string, status: number, errors: Record<string, string> = {}, data: unknown = null) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.data = data;
  }
}

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };

export type RequestOpts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown; // JSON-serializable, or FormData
  query?: Record<string, string | number | boolean | undefined | null>;
  // Send X-Session-ID for cart/checkout endpoints (guests).
  sendSession?: boolean;
  // Skip Authorization header (for public endpoints).
  noAuth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: RequestOpts["query"]): string {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

function onUnauthorized() {
  clearToken();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

export async function apiRequest<T = unknown>(path: string, opts: RequestOpts = {}): Promise<T> {
  const { method = "GET", body, query, sendSession, noAuth, headers = {}, signal } = opts;

  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };
  if (!isForm && body !== undefined) finalHeaders["Content-Type"] = "application/json";

  if (!noAuth) {
    const tok = getToken();
    if (tok) finalHeaders.Authorization = `Bearer ${tok}`;
  }
  if (sendSession) finalHeaders["X-Session-ID"] = getSessionId();

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
      signal,
    });
  } catch (e: any) {
    throw new ApiError(e?.message || "Network error", 0);
  }

  if (res.status === 401) {
    onUnauthorized();
    throw new ApiError("Unauthorized", 401);
  }

  let payload: ApiEnvelope<T> | null = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      // non-JSON
    }
  }

  if (!res.ok) {
    const message = payload?.message || `Request failed (${res.status})`;
    const errors =
      payload && payload.data && typeof payload.data === "object" && "errors" in (payload.data as any)
        ? ((payload.data as any).errors as Record<string, string>)
        : {};
    throw new ApiError(message, res.status, errors, payload?.data ?? null);
  }

  return (payload?.data as T) ?? (undefined as unknown as T);
}

// Convenience: file-download style endpoints (CSV, PDF) — returns blob.
export async function apiDownload(path: string, opts: RequestOpts = {}): Promise<Blob> {
  const { method = "GET", body, query, headers = {}, signal } = opts;
  const finalHeaders: Record<string, string> = { ...headers };
  const tok = getToken();
  if (tok && !opts.noAuth) finalHeaders.Authorization = `Bearer ${tok}`;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isForm && body !== undefined) finalHeaders["Content-Type"] = "application/json";

  const res = await fetch(buildUrl(path, query), {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    signal,
  });
  if (res.status === 401) {
    onUnauthorized();
    throw new ApiError("Unauthorized", 401);
  }
  if (!res.ok) throw new ApiError(`Download failed (${res.status})`, res.status);
  return res.blob();
}

// PDF invoice helper: open in new tab.
export function openInvoicePdf(ref: string) {
  const tok = getToken() || "";
  const url = `${API_BASE_URL}/pdf?ref=${encodeURIComponent(ref)}&token=${encodeURIComponent(tok)}`;
  if (typeof window !== "undefined") window.open(url, "_blank");
}