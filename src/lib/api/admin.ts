import { request, getToken, BASE } from './client';
import type { ServiceFull, Plan, Order, ApiResponse, PaginatedResponse } from './types';

export const admin = {
  getServices: (p?: any) => {
    const q = p ? new URLSearchParams(p).toString() : '';
    return request<PaginatedResponse<ServiceFull>>(`/admin/services${q ? '?' + q : ''}`);
  },
  createService: (body: any) => request<ApiResponse<{ service: ServiceFull }>>('/admin/services', { method: 'POST', body: JSON.stringify(body) }),
  getService: (slug: string) => request<ApiResponse<{ service: ServiceFull }>>(`/admin/services/${slug}`),
  updateService: (slug: string, body: any) => request<ApiResponse<{ service: ServiceFull }>>(`/admin/services/${slug}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteService: (slug: string) => request(`/admin/services/${slug}`, { method: 'DELETE' }),
  exportServices: () => fetch(`${BASE}/admin/services/export`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.blob()),

  getPlans: () => request<ApiResponse<{ items: Plan[] }>>('/admin/plans'),
  createPlan: (body: any) => request('/admin/plans', { method: 'POST', body: JSON.stringify(body) }),
  updatePlan: (id: string, body: any) => request(`/admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePlan: (id: string) => request(`/admin/plans/${id}`, { method: 'DELETE' }),

  getOrders: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request<PaginatedResponse<Order>>(`/admin/orders${q ? '?' + q : ''}`); },
  getOrder: (id: string) => request<ApiResponse<{ order: Order }>>(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, body: any) => request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateOrderPaymentStatus: (id: string, paymentStatus: string) => request(`/admin/orders/${id}/payment-status`, { method: 'PATCH', body: JSON.stringify({ paymentStatus }) }),
  addOrderNote: (id: string, text: string) => request(`/admin/orders/${id}/note`, { method: 'POST', body: JSON.stringify({ text }) }),

  getBookings: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/bookings${q ? '?' + q : ''}`); },
  updateBooking: (id: string, body: any) => request(`/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
  addBookingNote: (id: string, text: string) => request(`/admin/bookings/${id}/note`, { method: 'POST', body: JSON.stringify({ text }) }),

  getInvoices: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/invoices${q ? '?' + q : ''}`); },
  createInvoice: (body: any) => request('/admin/invoices', { method: 'POST', body: JSON.stringify(body) }),
  updateInvoice: (id: string, body: any) => request(`/admin/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteInvoice: (id: string) => request(`/admin/invoices/${id}`, { method: 'DELETE' }),
  invoicePdf: (id: string) => fetch(`${BASE}/admin/invoices/${id}/pdf`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.blob()),

  getClients: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/clients${q ? '?' + q : ''}`); },
  createClient: (body: any) => request('/admin/clients', { method: 'POST', body: JSON.stringify(body) }),
  updateClient: (id: string, body: any) => request(`/admin/clients/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteClient: (id: string) => request(`/admin/clients/${id}`, { method: 'DELETE' }),

  getPortfolio: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/portfolio${q ? '?' + q : ''}`); },
  createPortfolio: (body: any) => request('/admin/portfolio', { method: 'POST', body: JSON.stringify(body) }),
  updatePortfolio: (id: string, body: any) => request(`/admin/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePortfolio: (id: string) => request(`/admin/portfolio/${id}`, { method: 'DELETE' }),
  togglePortfolioVisibility: (id: string, visible: boolean) => request(`/admin/portfolio/${id}/visibility`, { method: 'PATCH', body: JSON.stringify({ visible }) }),

  getAnalytics: (range?: string) => request(`/admin/analytics${range ? '?range=' + range : ''}`),
  getStats: () => request('/admin/stats'),

  generateReport: (body: any) => {
    if (body.format === 'csv') return fetch(`${BASE}/admin/reports/generate`, { method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.blob());
    return request('/admin/reports/generate', { method: 'POST', body: JSON.stringify(body) });
  },

  getUsers: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/users${q ? '?' + q : ''}`); },
  inviteUser: (body: any) => request('/admin/users/invite', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id: string, body: any) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateUserRole: (id: string, role: string) => request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  deleteUser: (id: string) => request(`/admin/users/${id}`, { method: 'DELETE' }),

  getSettings: (group: string) => request(group === 'site' ? `/site/settings` : `/admin/settings/${group}`),
  updateSettings: (group: string, body: any) => request(group === 'site' ? `/site/settings` : `/admin/settings/${group}`, { method: 'PUT', body: JSON.stringify(body) }),

  upload: async (file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return fetch(`${BASE}/admin/uploads`, {
      method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: fd,
    }).then(r => r.json());
  },

  getNotifications: (limit?: number) => request(`/admin/notifications${limit ? '?limit=' + limit : ''}`),
  markNotificationsRead: (id?: string) => request(`/admin/notifications${id ? '?id=' + id : ''}`, { method: 'PATCH' }),

  getTickets: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/tickets${q ? '?' + q : ''}`); },
  getTicketDetail: (id: string) => request(`/admin/tickets/${id}`),
  replyTicket: (id: string, text: string) => request(`/admin/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),
  updateTicketStatus: (id: string, status: string) => request(`/admin/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateTicketPriority: (id: string, priority: string) => request(`/admin/tickets/${id}/priority`, { method: 'PATCH', body: JSON.stringify({ priority }) }),

  getReviews: (p?: any) => { const q = p ? new URLSearchParams(p).toString() : ''; return request(`/admin/reviews${q ? '?' + q : ''}`); },
  updateReviewStatus: (id: string, status: string) => request(`/admin/reviews/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteReview: (id: string) => request(`/admin/reviews/${id}`, { method: 'DELETE' }),

  getSiteSettings: () => request('/admin/site/settings'),
  updateSiteSettings: (body: any) => request('/admin/site/settings', { method: 'PUT', body: JSON.stringify(body) }),
};