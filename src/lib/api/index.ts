import { apiRequest, apiDownload, openInvoicePdf, getToken, setToken, clearToken, getSessionId, ApiError } from "./client";
import type {
  AuthResponse, User, Service, ServiceFull, CartResponse, CheckoutResponse, CheckoutPaymentMethod,
  Order, Ticket, Paginated, AdminBooking, Invoice, AdminClient, AdminPortfolio, Plan,
  AnalyticsData, TeamMember, AdminNotification, SiteSettings,
} from "./types";

export { ApiError, getToken, setToken, clearToken, getSessionId, openInvoicePdf };
export type * from "./types";

// ===================== AUTH =====================
export const auth = {
  signup: (body: { name: string; email: string; phone: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/signup", { method: "POST", body, noAuth: true }),

  login: (body: { phone?: string; email?: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", { method: "POST", body, noAuth: true }),

  logout: () => apiRequest<{ ok: true }>("/auth/logout", { method: "POST" }),

  forgot: (email: string) =>
    apiRequest<{ ok: true }>("/auth/forgot", { method: "POST", body: { email }, noAuth: true }),

  reset: (token: string, password: string) =>
    apiRequest<{ message: string }>("/auth/reset", { method: "POST", body: { token, password }, noAuth: true }),

  me: () => apiRequest<{ user: User }>("/auth/me"),

  oauthGoogle: (id_token: string) =>
    apiRequest<AuthResponse>("/auth/oauth/google", { method: "POST", body: { id_token }, noAuth: true }),

  oauthApple: (body: { identity_token: string; full_name?: string; email?: string }) =>
    apiRequest<AuthResponse>("/auth/oauth/apple", { method: "POST", body, noAuth: true }),
};

// ===================== SERVICES (public) =====================
export const services = {
  list: (q?: { category?: string; q?: string }) =>
    apiRequest<{ items: Service[] }>("/services", { query: q, noAuth: true }),
  get: (slug: string) =>
    apiRequest<{ service: ServiceFull }>(`/services/${encodeURIComponent(slug)}`, { noAuth: true }),
};

// ===================== CART =====================
export const cart = {
  get: () => apiRequest<CartResponse>("/cart", { sendSession: true }),

  addItem: (body: { serviceSlug: string; planId?: string; qty?: number }) =>
    apiRequest<{ items: CartResponse["items"] }>("/cart/items", { method: "POST", body, sendSession: true }),

  updateItem: (lineId: string, qty: number) =>
    apiRequest<{ items: CartResponse["items"] }>(`/cart/items/${lineId}`, { method: "PATCH", body: { qty }, sendSession: true }),

  removeItem: (lineId: string) =>
    apiRequest<{ items: CartResponse["items"] }>(`/cart/items/${lineId}`, { method: "DELETE", sendSession: true }),

  applyCoupon: (code: string) =>
    apiRequest<{ discount: number; code: string; items: CartResponse["items"]; subtotal: number; total: number }>(
      "/cart/coupon", { method: "POST", body: { code }, sendSession: true },
    ),
};

// ===================== CHECKOUT =====================
export const checkout = {
  submit: (body: {
    contact: { name: string; email: string; phone: string; city?: string; address?: string };
    paymentMethod: CheckoutPaymentMethod;
    notes?: string;
  }) => apiRequest<CheckoutResponse>("/checkout", { method: "POST", body, sendSession: true }),
};

// ===================== ACCOUNT =====================
export const account = {
  getProfile: () => apiRequest<User>("/account/profile"),

  updateProfile: (data: { name: string; phone?: string; city?: string; avatar?: File }) => {
    if (data.avatar) {
      const fd = new FormData();
      fd.append("name", data.name);
      if (data.phone) fd.append("phone", data.phone);
      if (data.city) fd.append("city", data.city);
      fd.append("avatar", data.avatar);
      return apiRequest<User>("/account/profile", { method: "PUT", body: fd });
    }
    return apiRequest<User>("/account/profile", { method: "PUT", body: data });
  },

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<{ message: string }>("/account/password", {
      method: "PUT",
      body: { currentPassword, newPassword },
    }),

  listOrders: (q?: { status?: string; page?: number; limit?: number }) =>
    apiRequest<Paginated<Order>>("/account/orders", { query: q }),

  getOrder: (id: string) => apiRequest<Order>(`/account/orders/${id}`),

  listTickets: (q?: { status?: string; priority?: string; page?: number; limit?: number }) =>
    apiRequest<Paginated<Ticket>>("/account/tickets", { query: q }),

  createTicket: (body: { subject: string; orderId?: string; priority: "low" | "normal" | "high"; message: string }) =>
    apiRequest<{ id: string; number: string }>("/account/tickets", { method: "POST", body }),

  getTicket: (id: string) => apiRequest<Ticket>(`/account/tickets/${id}`),

  replyTicket: (id: string, text: string) =>
    apiRequest<{ message: string }>(`/account/tickets/${id}/messages`, { method: "POST", body: { text } }),

  closeTicket: (id: string) =>
    apiRequest<{ message: string }>(`/account/tickets/${id}/close`, { method: "PATCH" }),
};

// ===================== CONTACT =====================
export const contact = {
  send: (body: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    apiRequest<{ ok: true }>("/contact", { method: "POST", body, noAuth: true }),
};

// ===================== ADMIN =====================
export const admin = {
  // ----- Services -----
  services: {
    list: (q?: { status?: string; q?: string; page?: number; limit?: number }) =>
      apiRequest<Paginated<ServiceFull>>("/admin/services", { query: q }),
    create: (body: Partial<ServiceFull>) =>
      apiRequest<{ id: string }>("/admin/services", { method: "POST", body }),
    get: (slug: string) => apiRequest<ServiceFull>(`/admin/services/${encodeURIComponent(slug)}`),
    update: (slug: string, body: Partial<ServiceFull>) =>
      apiRequest<{ message: string }>(`/admin/services/${encodeURIComponent(slug)}`, { method: "PUT", body }),
    remove: (slug: string) =>
      apiRequest<{ message: string }>(`/admin/services/${encodeURIComponent(slug)}`, { method: "DELETE" }),
    exportCsv: () => apiDownload("/admin/services/export", { method: "POST" }),
  },

  // ----- Bookings -----
  bookings: {
    list: (q?: {
      status?: string; source?: string; q?: string; from?: string; to?: string; page?: number; limit?: number;
    }) => apiRequest<Paginated<AdminBooking>>("/admin/bookings", { query: q }),
    get: (id: string) => apiRequest<AdminBooking>(`/admin/bookings/${id}`),
    setStatus: (id: string, body: { status: string; note?: string; notifyClient?: boolean }) =>
      apiRequest<{ message: string }>(`/admin/bookings/${id}/status`, { method: "PATCH", body }),
    addNote: (id: string, text: string) =>
      apiRequest<{ message: string }>(`/admin/bookings/${id}/note`, { method: "POST", body: { text } }),
  },

  // ----- Invoices -----
  invoices: {
    list: (q?: { status?: string; q?: string; from?: string; to?: string; page?: number; limit?: number }) =>
      apiRequest<Paginated<Invoice>>("/admin/invoices", { query: q }),
    create: (body: {
      client: string; email: string; phone?: string; city?: string;
      items: { desc: string; qty: number; price: number }[];
      payment?: string; dueDate?: string; notes?: string;
    }) => apiRequest<{ id: string; number: string }>("/admin/invoices", { method: "POST", body }),
    get: (id: string) => apiRequest<Invoice>(`/admin/invoices/${id}`),
    setStatus: (id: string, status: "paid" | "pending" | "void") =>
      apiRequest<{ message: string }>(`/admin/invoices/${id}`, { method: "PATCH", body: { status } }),
    remove: (id: string) =>
      apiRequest<{ message: string }>(`/admin/invoices/${id}`, { method: "DELETE" }),
    pdf: (id: string) => `${"/admin/invoices"}/${id}/pdf`, // call openInvoicePdf instead for client side
  },

  // ----- Clients -----
  clients: {
    list: (q?: { segment?: string; q?: string; page?: number; limit?: number }) =>
      apiRequest<Paginated<AdminClient>>("/admin/clients", { query: q }),
    create: (body: { name: string; email: string; phone?: string; segment: "vip" | "regular" | "new" }) =>
      apiRequest<{ id: string }>("/admin/clients", { method: "POST", body }),
    get: (id: string) => apiRequest<AdminClient>(`/admin/clients/${id}`),
    update: (id: string, body: { name?: string; phone?: string; city?: string }) =>
      apiRequest<{ message: string }>(`/admin/clients/${id}`, { method: "PUT", body }),
    remove: (id: string) =>
      apiRequest<{ message: string }>(`/admin/clients/${id}`, { method: "DELETE" }),
  },

  // ----- Portfolio -----
  portfolio: {
    list: (q?: { category?: string; visible?: 0 | 1; q?: string }) =>
      apiRequest<{ items: AdminPortfolio[] }>("/admin/portfolio", { query: q }),
    create: (body: Partial<AdminPortfolio>) =>
      apiRequest<{ message: string }>("/admin/portfolio", { method: "POST", body }),
    update: (id: string, body: Partial<AdminPortfolio>) =>
      apiRequest<{ message: string }>(`/admin/portfolio/${id}`, { method: "PUT", body }),
    remove: (id: string) =>
      apiRequest<{ message: string }>(`/admin/portfolio/${id}`, { method: "DELETE" }),
    setVisibility: (id: string, visible: boolean) =>
      apiRequest<{ message: string }>(`/admin/portfolio/${id}/visibility`, { method: "PATCH", body: { visible } }),
  },

  // ----- Plans -----
  plans: {
    list: () => apiRequest<{ items: Plan[] }>("/admin/plans"),
    create: (body: Partial<Plan>) =>
      apiRequest<{ message: string }>("/admin/plans", { method: "POST", body }),
    update: (id: string, body: Partial<Plan> & { status?: "active" | "draft" }) =>
      apiRequest<{ message: string }>(`/admin/plans/${id}`, { method: "PUT", body }),
    remove: (id: string) =>
      apiRequest<{ message: string }>(`/admin/plans/${id}`, { method: "DELETE" }),
  },

  // ----- Analytics & Reports & Stats -----
  analytics: (range: "7d" | "30d" | "90d" | "year" = "30d") =>
    apiRequest<AnalyticsData>("/admin/analytics", { query: { range } }),

  stats: () => apiRequest<AnalyticsData>("/admin/stats"),

  reports: {
    generate: (body: { type: "sales" | "clients" | "services"; from?: string; to?: string; format: "csv" | "json" }) => {
      if (body.format === "csv") return apiDownload("/admin/reports/generate", { method: "POST", body });
      return apiRequest<{ items: any[] }>("/admin/reports/generate", { method: "POST", body });
    },
  },

  // ----- Users / Team -----
  users: {
    list: (q?: { role?: string; q?: string }) =>
      apiRequest<{ items: TeamMember[] }>("/admin/users", { query: q }),
    invite: (body: { name: string; email: string; role: "admin" | "manager" | "support" }) =>
      apiRequest<{ id: string }>("/admin/users/invite", { method: "POST", body }),
    update: (id: string, body: { name?: string; email?: string; phone?: string }) =>
      apiRequest<{ message: string }>(`/admin/users/${id}`, { method: "PUT", body }),
    setRole: (id: string, role: string) =>
      apiRequest<{ message: string }>(`/admin/users/${id}/role`, { method: "PATCH", body: { role } }),
    remove: (id: string) =>
      apiRequest<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" }),
  },

  // ----- Settings (key/value by group) -----
  settings: {
    get: <T = Record<string, unknown>>(group:
      | "profile" | "appearance" | "notifications" | "team" | "integrations"
      | "payment" | "partner" | "seo" | "tracking" | "site",
    ) => apiRequest<T>(`/admin/settings/${group}`),
    update: (
      group:
        | "profile" | "appearance" | "notifications" | "team" | "integrations"
        | "payment" | "partner" | "seo" | "tracking" | "site",
      body: Record<string, unknown>,
    ) => apiRequest<{ message: string }>(`/admin/settings/${group}`, { method: "PUT", body }),
  },

  // ----- Uploads -----
  upload: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiRequest<{ url: string; width: number | null; height: number | null; sizeBytes: number }>(
      "/admin/uploads", { method: "POST", body: fd },
    );
  },

  // ----- Notifications -----
  notifications: {
    list: (limit?: number) =>
      apiRequest<{ items: AdminNotification[]; unreadCount: number }>("/admin/notifications", { query: { limit } }),
    markRead: (id?: number) =>
      apiRequest<{ message: string }>("/admin/notifications", { method: "PATCH", query: { id } }),
  },

  // ----- Tickets -----
  tickets: {
    list: (q?: { status?: string; priority?: string; q?: string; page?: number; limit?: number }) =>
      apiRequest<Paginated<Ticket>>("/admin/tickets", { query: q }),
    get: (id: string) => apiRequest<Ticket>(`/admin/tickets/${id}`),
    reply: (id: string, text: string) =>
      apiRequest<{ message: string }>(`/admin/tickets/${id}/messages`, { method: "POST", body: { text } }),
    setStatus: (id: string, status: "open" | "answered" | "closed") =>
      apiRequest<{ message: string }>(`/admin/tickets/${id}/status`, { method: "PATCH", body: { status } }),
    setPriority: (id: string, priority: "low" | "normal" | "high") =>
      apiRequest<{ message: string }>(`/admin/tickets/${id}/priority`, { method: "PATCH", body: { priority } }),
  },

  // ----- Public site settings (used in app init) -----
  siteSettings: () => apiRequest<SiteSettings>("/admin/site/settings"),
};

// Default export for convenience.
const api = { auth, services, cart, checkout, account, contact, admin };
export default api;