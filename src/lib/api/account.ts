import { request, getToken, BASE } from './client';
import type { User, Order, Ticket, ApiResponse, PaginatedResponse } from './types';

export const account = {
  profile: () => request<ApiResponse<{ user: User }>>('/account/profile'),

  updateProfile: (body: FormData | Record<string, any>) => {
    if (body instanceof FormData) {
      return fetch(`${BASE}/account/profile`, {
        method: 'PUT', headers: { Authorization: `Bearer ${getToken()}` }, body,
      }).then(r => r.json());
    }
    return request<ApiResponse<{ user: User }>>('/account/profile', { method: 'PUT', body: JSON.stringify(body) });
  },

  changePassword: (current: string, newPass: string) =>
    request('/account/password', { method: 'PUT', body: JSON.stringify({ currentPassword: current, newPassword: newPass }) }),

  orders: (params?: { status?: string; page?: number }) => {
    const q = params ? new URLSearchParams(params as any).toString() : '';
    return request<PaginatedResponse<Order>>(`/account/orders${q ? '?' + q : ''}`);
  },

  orderDetail: (id: string) =>
    request<ApiResponse<{ order: Order }>>(`/account/orders/${id}`),

  tickets: (params?: { page?: number }) => {
    const q = params ? new URLSearchParams(params as any).toString() : '';
    return request<PaginatedResponse<Ticket>>(`/account/tickets${q ? '?' + q : ''}`);
  },

  ticketDetail: (id: string) =>
    request<ApiResponse<{ ticket: Ticket }>>(`/account/tickets/${id}`),

  ticketReply: (id: string, text: string) =>
    request(`/account/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),

  ticketClose: (id: string) =>
    request(`/account/tickets/${id}/close`, { method: 'PUT' }),

  createTicket: (body: {
    subject: string;
    message: string;
    department?: 'technical' | 'billing' | 'general';
    // legacy fields kept for older callers — backend ignores them
    orderId?: string;
    priority?: 'low' | 'normal' | 'high';
  }) => {
    const payload = {
      subject: body.subject,
      message: body.message,
      department: body.department ?? 'general',
    };
    return request<ApiResponse<{ id: string; number: string }>>('/account/tickets', {
      method: 'POST', body: JSON.stringify(payload),
    });
  },

  // Re-pay an existing unpaid order. Spec doesn't expose a dedicated endpoint;
  // we route through /checkout/initiate and pass `orderId` so the backend can
  // attach the new payment session to the same order (instead of creating a
  // new one). The webhook MUST update the existing order — see API_ENDPOINTS.md.
  payOrder: (id: string, body?: { paymentMethod?: string; phone?: string; city?: string }) => {
    const payload = {
      orderId: id,
      paymentMethod: body?.paymentMethod ?? 'mayfatoorah',
      phone: body?.phone ?? '',
      city: body?.city ?? '',
    };
    return request<ApiResponse<{
      orderId: string;
      orderNumber: string;
      paymentUrl: string | null;
    }>>('/checkout/initiate', { method: 'POST', body: JSON.stringify(payload) });
  },

  // ----- Reviews (auth) -----
  createReview: (body: { serviceSlug: string; rating: number; text: string }) =>
    request<ApiResponse<{ review: any }>>('/account/reviews', {
      method: 'POST', body: JSON.stringify(body),
    }),

  // ----- Favorites (auth) -----
  favorites: () =>
    request<ApiResponse<{ items: any[] }>>('/account/favorites'),

  addFavorite: (serviceSlug: string) =>
    request<ApiResponse<any>>('/account/favorites', {
      method: 'POST', body: JSON.stringify({ serviceSlug }),
    }),

  removeFavorite: (serviceSlug: string) =>
    request<ApiResponse<any>>(`/account/favorites/${serviceSlug}`, { method: 'DELETE' }),
};