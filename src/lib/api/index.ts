import { auth as authNew } from './auth';
import { services as servicesNew, reviews, favorites } from './services';
import { cart as cartNew } from './cart';
import { checkout as checkoutNew } from './checkout';
import { account as accountNew } from './account';
import { admin as adminNew } from './admin';
import { publicApi } from './public';
import { request, removeToken } from './client';
import type { CartItem, Cart, ApiResponse } from './types';

export { reviews, favorites, publicApi };
export type * from './types';
export { getToken, setToken, removeToken, getUser, setUser, getSid, getLang, ApiError, BASE } from './client';

// Legacy alias used widely across the codebase.
export const clearToken = removeToken;

// ---------- Legacy CartLine type (alias of new CartItem) ----------
export type CartLine = CartItem;

// ============================================================
//  Auth — keep new shape but unwrap envelope for legacy callers
// ============================================================
export const auth = {
  ...authNew,
  // Legacy: returned { user, token } directly (no envelope).
  signup: async (body: { name: string; email: string; phone?: string; password: string }) => {
    const res = await authNew.signup(body);
    return res.data;
  },
  login: async (body: { email?: string; phone?: string; password: string }) => {
    const res = await authNew.login(body);
    return res.data;
  },
  me: async () => {
    const res = await authNew.me();
    return res.data; // { user }
  },
  oauthGoogle: async (idToken: string) => {
    const res = await authNew.google(idToken);
    return res.data;
  },
  // Convenience kept for new callers.
  google: authNew.google,
};

// ============================================================
//  Services
// ============================================================
export const services = {
  ...servicesNew,
  // Legacy: returned { items } directly.
  list: async (params?: { category?: string; q?: string }) => {
    const res = await servicesNew.list(params);
    return res.data; // { items }
  },
  // Legacy alias `get(slug)` returning { service }.
  get: async (slug: string) => {
    const res = await servicesNew.detail(slug);
    return res.data; // { service }
  },
};

// ============================================================
//  Cart — adds legacy aliases (addItem/updateItem/removeItem/applyCoupon)
// ============================================================
async function unwrapCart<T extends Promise<ApiResponse<Cart>>>(p: T): Promise<Cart> {
  const res = await p;
  return res.data;
}
export const cart = {
  ...cartNew,
  get: async () => {
    try { return await unwrapCart(cartNew.get()); } catch { return { items: [], subtotal: 0, vat: 0, total: 0, sessionId: '' } as Cart; }
  },
  addItem: async (body: { serviceSlug: string; planId?: string; qty?: number }) =>
    unwrapCart(cartNew.add(body)),
  updateItem: async (lineId: string, qty: number) =>
    unwrapCart(cartNew.updateQty(lineId, qty)),
  removeItem: async (lineId: string) =>
    unwrapCart(cartNew.remove(lineId)),
  applyCoupon: async (code: string) =>
    unwrapCart(cartNew.coupon(code)),
};

// ============================================================
//  Checkout — `.submit()` legacy + `.create()` new
// ============================================================
export const checkout = {
  ...checkoutNew,
  submit: async (body: Parameters<typeof checkoutNew.create>[0]) => {
    const res = await checkoutNew.create(body);
    return res.data;
  },
};

// ============================================================
//  Account — legacy method names mapped to new ones
// ============================================================
export const account = {
  ...accountNew,
  getProfile: async () => {
    const res = await accountNew.profile();
    return res.data?.user;
  },
  listOrders: async (q?: { status?: string; page?: number; limit?: number }) => {
    const res: any = await accountNew.orders(q);
    return res.data; // { items, total, page, pageSize, totalPages }
  },
  getOrder: async (id: string) => {
    const res = await accountNew.orderDetail(id);
    return res.data?.order;
  },
  listTickets: async (q?: { status?: string; priority?: string; page?: number; limit?: number }) => {
    const res: any = await accountNew.tickets(q);
    return res.data;
  },
  getTicket: async (id: string) => {
    const res = await accountNew.ticketDetail(id);
    return res.data?.ticket;
  },
  replyTicket: (id: string, text: string) => accountNew.ticketReply(id, text),
  closeTicket: (id: string) => accountNew.ticketClose(id),
};

// ============================================================
//  Contact (legacy export)
// ============================================================
export const contact = {
  send: (body: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    publicApi.sendContact(body),
};

// ============================================================
//  Admin — keep flat new methods AND nested legacy namespaces
// ============================================================
const a = adminNew;
const qs = (p?: any) => (p ? '?' + new URLSearchParams(p).toString() : '');

const adminLegacy = {
  services: {
    list: async (q?: any) => {
      const r: any = await a.getServices(q);
      return r.data;
    },
    create: async (body: any) => {
      const r: any = await a.createService(body);
      return r.data;
    },
    get: async (slug: string) => {
      const r: any = await a.getService(slug);
      return r.data?.service;
    },
    update: (slug: string, body: any) => a.updateService(slug, body),
    remove: (slug: string) => a.deleteService(slug),
    exportCsv: () => a.exportServices(),
  },
  bookings: {
    list: async (q?: any) => {
      const r: any = await a.getOrders(q);
      return r.data;
    },
    setStatus: (id: string, body: any) => a.updateOrderStatus(id, body),
    addNote: (id: string, text: string) => a.addOrderNote(id, text),
  },
  orders: {
    list: async (q?: any) => {
      const r: any = await a.getOrders(q);
      return r.data;
    },
    get: async (id: string) => {
      const r: any = await a.getOrder(id);
      return r.data?.order;
    },
    setStatus: (id: string, body: any) => a.updateOrderStatus(id, body),
    addNote: (id: string, text: string) => a.addOrderNote(id, text),
  },
  consultations: {
    list: async (q?: any) => {
      const r: any = await a.getBookings(q);
      return r.data;
    },
    setStatus: (id: string, body: any) => a.updateBooking(id, body),
    addNote: (id: string, text: string) => a.addBookingNote(id, text),
  },
  invoices: {
    list: async (q?: any) => {
      const r: any = await a.getInvoices(q);
      return r.data;
    },
    create: (body: any) => a.createInvoice(body),
    setStatus: (id: string, status: string) => a.updateInvoice(id, { status }),
    remove: (id: string) => a.deleteInvoice(id),
    pdf: (id: string) => a.invoicePdf(id),
  },
  clients: {
    list: async (q?: any) => {
      const r: any = await a.getClients(q);
      return r.data;
    },
    create: (body: any) => a.createClient(body),
    update: (id: string, body: any) => a.updateClient(id, body),
    remove: (id: string) => a.deleteClient(id),
  },
  portfolio: {
    list: async (q?: any) => {
      const r: any = await a.getPortfolio(q);
      return r.data;
    },
    create: (body: any) => a.createPortfolio(body),
    update: (id: string, body: any) => a.updatePortfolio(id, body),
    remove: (id: string) => a.deletePortfolio(id),
    setVisibility: (id: string, visible: boolean) => a.togglePortfolioVisibility(id, visible),
  },
  plans: {
    list: async () => {
      const r: any = await a.getPlans();
      return r.data; // { items }
    },
    create: (body: any) => a.createPlan(body),
    update: (id: string, body: any) => a.updatePlan(id, body),
    remove: (id: string) => a.deletePlan(id),
  },
  analytics: async (range?: string) => {
    const r: any = await a.getAnalytics(range);
    return r.data;
  },
  stats: async () => {
    const r: any = await a.getStats();
    return r.data;
  },
  reports: {
    generate: (body: any) => a.generateReport(body),
  },
  users: {
    list: async (q?: any) => {
      const r: any = await a.getUsers(q);
      return r.data;
    },
    invite: (body: any) => a.inviteUser(body),
    update: (id: string, body: any) => a.updateUser(id, body),
    setRole: (id: string, role: string) => a.updateUserRole(id, role),
    remove: (id: string) => a.deleteUser(id),
  },
  settings: {
    get: async <T = any>(group: string) => {
      const r: any = await a.getSettings(group);
      return (r?.data ?? r) as T;
    },
    update: (group: string, body: any) => a.updateSettings(group, body),
  },
  upload: async (file: File) => {
    const r: any = await a.upload(file);
    return r?.data ?? r;
  },
  notifications: {
    list: async (limit?: number) => {
      const r: any = await a.getNotifications(limit);
      return r?.data ?? r;
    },
    markRead: (id?: number | string) => a.markNotificationsRead(id != null ? String(id) : undefined),
  },
  tickets: {
    list: async (q?: any) => {
      const r: any = await a.getTickets(q);
      return r?.data ?? r;
    },
    get: async (id: string) => {
      const r: any = await a.getTicketDetail(id);
      return r?.data?.ticket ?? r?.data ?? r;
    },
    reply: (id: string, text: string) => a.replyTicket(id, text),
    setStatus: (id: string, status: string) => a.updateTicketStatus(id, status),
    setPriority: (id: string, priority: string) => a.updateTicketPriority(id, priority),
  },
  reviews: {
    list: async (q?: any) => {
      const r: any = await a.getReviews(q);
      return r?.data ?? r;
    },
    setStatus: (id: string, status: string) => a.updateReviewStatus(id, status),
    remove: (id: string) => a.deleteReview(id),
  },
  siteSettings: async () => {
    const r: any = await a.getSiteSettings();
    return r?.data ?? r;
  },
};

// Merged: flat (new spec) + nested namespaces (legacy).
export const admin: typeof adminNew & typeof adminLegacy = Object.assign({}, adminNew, adminLegacy) as any;

// ============================================================
//  Default export — `api` namespace used by many old files.
// ============================================================
const api = { auth, services, cart, checkout, account, contact, admin };
export default api;