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
    request(`/account/tickets/${id}/close`, { method: 'PATCH' }),

  createTicket: (body: { subject: string; orderId?: string; priority: 'low'|'normal'|'high'; message: string }) =>
    request<ApiResponse<{ id: string; number: string }>>('/account/tickets', {
      method: 'POST', body: JSON.stringify(body),
    }),

  payOrder: (id: string, body?: { paymentMethod?: string }) =>
    request<ApiResponse<{ paymentUrl: string | null }>>(`/account/orders/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(body ?? {}),
    }),
};