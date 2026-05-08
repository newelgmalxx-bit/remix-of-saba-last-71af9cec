import { request, getToken, getSid } from './client';
import type { Cart, ApiResponse } from './types';

export const cart = {
  get: () => request<ApiResponse<Cart>>('/cart'),

  add: (body: { serviceSlug: string; planId?: string; qty?: number }) => {
    const h: Record<string, string> = {};
    if (!getToken()) h['X-Session-Id'] = getSid();
    return request<ApiResponse<Cart>>('/cart/items', { method: 'POST', body: JSON.stringify(body), headers: h });
  },

  updateQty: (lineId: string, qty: number) =>
    request<ApiResponse<Cart>>(`/cart/items/${lineId}`, { method: 'PATCH', body: JSON.stringify({ qty }) }),

  remove: (lineId: string) =>
    request<ApiResponse<Cart>>(`/cart/items/${lineId}`, { method: 'DELETE' }),
};