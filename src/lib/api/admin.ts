import { request, getToken, BASE } from './client';
import type { ServiceFull, Plan, Order, ApiResponse, PaginatedResponse } from './types';

export const admin = {
  // Dashboard
  getDashboard: () => request<ApiResponse<any>>('/admin/dashboard'),

  getServices: (p?: any) => {
    const q = p ? new URLSearchParams(p).toString() : '';
    return request<PaginatedResponse<ServiceFull>>(`/admin/services${q ? '?' + q : ''}`);
  },
  createService: (body: any) => request<ApiResponse<{ service: ServiceFull }>>('/admin/services', { method: 'POST', body: JSON.stringify(body) }),
  // Spec uses {id}; we keep param name `idOrSlug` for backward compat with admin pages still using slug.
  getService: (idOrSlug: string) => request<ApiResponse<{ service: ServiceFull }>>(`/admin/services/${idOrSlug}`),
  updateService: (idOrSlug: string, body: any) => request<ApiResponse<{ service: ServiceFull }>>(`/admin/services/${idOrSlug}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteService: (idOrSlug: string) => request(`/admin/services/${idOrSlug}`, { method: 'DELETE' }),
  exportServices: () => fetch(`${BASE}/admin/services/export`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.blob()),

  getPlans: () => request<ApiResponse<{ items: Plan[] }>>('/admin/plans'),
  createPlan: (body: any) => request('/admin/plans', { method: 'POST', body: JSON.stringify(body) }),
  updatePlan: (id: string, body: any) => request(`/admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePlan: (id: string) => request(`/admin/plans/${id}`, { method: 'DELETE' }),

  getOrders: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request<PaginatedResponse<Order>>(`/admin/orders${q ? '?' + q : ''}`); },
  getOrder: (id: string) => request<ApiResponse<{ order: Order }>>(`/admin/orders/${id}`),
  // Spec exposes a single PUT /admin/orders/{id} for updates.
  updateOrder: (id: string, body: any) => request(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateOrderStatus: (id: string, body: any) => request(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateOrderPaymentStatus: (id: string, paymentStatus: string) =>
    paymentStatus === 'paid'
      ? request(`/admin/orders/${id}/confirm-payment`, { method: 'POST' })
      : request(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify({ paymentStatus }) }),
  confirmOrderPayment: (id: string) => request(`/admin/orders/${id}/confirm-payment`, { method: 'POST' }),
  addOrderNote: (id: string, text: string) => request(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify({ note: text }) }),

  getBookings: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/bookings${q ? '?' + q : ''}`); },
  updateBooking: (id: string, body: any) => request(`/admin/bookings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  addBookingNote: (id: string, text: string) => request(`/admin/bookings/${id}`, { method: 'PUT', body: JSON.stringify({ note: text }) }),

  getInvoices: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/invoices${q ? '?' + q : ''}`); },
  getInvoice: (id: string) => request(`/admin/invoices/${id}`),
  // Spec only exposes GET on admin invoices; keep stubs for legacy callers.
  createInvoice: (body: any, pdf?: Blob) => {
    if (pdf) {
      const fd = new FormData();
      fd.append('data', JSON.stringify(body));
      fd.append('pdf', pdf, `invoice-${body.number || Date.now()}.pdf`);
      return fetch(`${BASE}/admin/invoices`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      }).then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      });
    }
    return request('/admin/invoices', { method: 'POST', body: JSON.stringify(body) });
  },
  updateInvoice: (id: string, body: any) => request(`/admin/invoices/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteInvoice: (id: string) => request(`/admin/invoices/${id}`, { method: 'DELETE' }),
  invoicePdf: (id: string) => fetch(`${BASE}/admin/invoices/${id}/pdf`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.blob()),

  // "Clients" are not a separate resource in the new spec — alias to /admin/users.
  getClients: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/users${q ? '?' + q : ''}`); },
  createClient: (body: any) => request('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
  updateClient: (id: string, body: any) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteClient: (id: string) => request(`/admin/users/${id}`, { method: 'DELETE' }),

  getPortfolio: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/portfolio${q ? '?' + q : ''}`); },
  createPortfolio: (body: any) => request('/admin/portfolio', { method: 'POST', body: JSON.stringify(body) }),
  updatePortfolio: (id: string, body: any) => request(`/admin/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePortfolio: (id: string) => request(`/admin/portfolio/${id}`, { method: 'DELETE' }),
  togglePortfolioVisibility: (id: string, visible: boolean) => request(`/admin/portfolio/${id}`, { method: 'PUT', body: JSON.stringify({ visible }) }),

  getAnalytics: (range?: string) => request(`/admin/dashboard${range ? '?range=' + range : ''}`),
  getStats: () => request('/admin/dashboard'),

  generateReport: (body: any) => {
    if (body.format === 'csv') return fetch(`${BASE}/admin/reports/generate`, { method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.blob());
    return request('/admin/reports/generate', { method: 'POST', body: JSON.stringify(body) });
  },

  getUsers: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/users${q ? '?' + q : ''}`); },
  inviteUser: (body: any) => request('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id: string, body: any) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateUserRole: (id: string, role: string) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id: string) => request(`/admin/users/${id}`, { method: 'DELETE' }),

  getSettings: (group: string) => request(group === 'site' ? `/settings` : `/admin/settings`),
  updateSettings: (_group: string, body: any) => request(`/admin/settings`, { method: 'PUT', body: JSON.stringify(body) }),

  upload: async (file: File, bucket: string = 'general') => {
    const fd = new FormData(); fd.append('file', file);
    fd.append('bucket', bucket);
    return fetch(`${BASE}/upload`, {
      method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: fd,
    }).then(r => r.json());
  },

  getNotifications: (limit?: number) => request(`/admin/notifications${limit ? '?limit=' + limit : ''}`),
  markNotificationsRead: (id?: string) =>
    id
      ? request(`/admin/notifications/${id}/read`, { method: 'PUT' })
      : request(`/admin/notifications/read-all`, { method: 'PUT' }),

  getTickets: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/tickets${q ? '?' + q : ''}`); },
  getTicketDetail: (id: string) => request(`/admin/tickets/${id}`),
  replyTicket: (id: string, text: string) => request(`/admin/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),
  updateTicketStatus: (id: string, status: string) => request(`/admin/tickets/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateTicketPriority: (id: string, priority: string) => request(`/admin/tickets/${id}`, { method: 'PUT', body: JSON.stringify({ priority }) }),

  getReviews: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/reviews${q ? '?' + q : ''}`); },
  updateReviewStatus: (id: string, status: string) => request(`/admin/reviews/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteReview: (id: string) => request(`/admin/reviews/${id}`, { method: 'DELETE' }),

  // Site settings — public GET via /settings, admin update via /admin/settings.
  getSiteSettings: () => request('/settings'),
  updateSiteSettings: (body: any) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(body) }),

  // Tracking codes (pixels / head / body scripts)
  trackingList: () => request<ApiResponse<{ items: any[] }>>('/admin/tracking-codes'),
  trackingCreate: (body: any) => request('/admin/tracking-codes', { method: 'POST', body: JSON.stringify(body) }),
  trackingUpdate: (id: number | string, body: any) => request(`/admin/tracking-codes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  trackingToggle: (id: number | string) => request(`/admin/tracking-codes/${id}`, { method: 'PUT', body: JSON.stringify({ toggle: true }) }),
  trackingDelete: (id: number | string) => request(`/admin/tracking-codes/${id}`, { method: 'DELETE' }),
  getPublicTracking: () => request<ApiResponse<{ pixels?: string; head?: string; body?: string }>>('/tracking'),

  // Coupons (admin)
  getCoupons: () => request<ApiResponse<{ items: any[] }>>('/admin/coupons'),
  createCoupon: (body: any) => request('/admin/coupons', { method: 'POST', body: JSON.stringify(body) }),
  updateCoupon: (id: string, body: any) => request(`/admin/coupons/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCoupon: (id: string) => request(`/admin/coupons/${id}`, { method: 'DELETE' }),

  // Contact messages (admin)
  getContactMessages: () => request<ApiResponse<{ items: any[] }>>('/admin/contact-messages'),
  updateContactMessage: (id: string, body: any) => request(`/admin/contact-messages/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};