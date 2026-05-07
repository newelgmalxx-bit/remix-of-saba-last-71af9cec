import type { PartnerOrder, PartnerOrdersResponse, PartnerPingResponse } from "@/types/partner";

const BASE_URL = "https://saba-design.com/api";
const KEY_STORAGE = "admin_partner_test_key";

export const getPartnerKey = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY_STORAGE) || "";
};

export const setPartnerKey = (key: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_STORAGE, key);
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = getPartnerKey();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (key) headers["Authorization"] = `Bearer ${key}`;
  if (init.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-json */ }

  if (!res.ok) {
    const msg = json?.message || json?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return (json as T);
}

export const partnerAdminApi = {
  baseUrl: BASE_URL,
  ping: () => request<PartnerPingResponse>("/partner/ping"),
  sync: () => request<{ ok: boolean; synced?: number; message?: string }>("/partner/sync", { method: "POST" }),
  listOrders: (params?: { status?: string; q?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.status && params.status !== "all") sp.set("status", params.status);
    if (params?.q) sp.set("q", params.q);
    if (params?.page) sp.set("page", String(params.page));
    const qs = sp.toString();
    return request<PartnerOrdersResponse | PartnerOrder[]>(`/partner/orders${qs ? `?${qs}` : ""}`);
  },
  getOrder: (id: string | number) => request<{ data: PartnerOrder } | PartnerOrder>(`/partner/orders/${id}`),
  updateOrderStatus: (id: string | number, status: string) =>
    request<{ ok: boolean }>(`/partner/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};