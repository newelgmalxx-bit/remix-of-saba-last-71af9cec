import { request, getToken, getSid } from './client';
import type { Cart, ApiResponse } from './types';

// Backend returns the cart in camelCase (serviceSlug, serviceTitle, planId, planName, originalPrice, ...).
// The rest of the frontend still expects snake_case (service_slug, service_title, ...). Normalize at the boundary.
function normalizeCart(raw: any): Cart {
  if (!raw || typeof raw !== 'object') {
    return { items: [], subtotal: 0, vat: 0, total: 0, sessionId: '' } as Cart;
  }
  const items = Array.isArray(raw.items) ? raw.items : [];
  return {
    items: items.map((it: any) => ({
      id: String(it.id),
      service_slug: it.service_slug ?? it.serviceSlug ?? '',
      service_title: it.service_title ?? it.serviceTitle ?? '',
      plan_id: it.plan_id ?? it.planId ?? null,
      plan_name: it.plan_name ?? it.planName ?? null,
      price: Number(it.price) || 0,
      original_price: it.original_price ?? it.originalPrice ?? null,
      qty: Number(it.qty) || 1,
    })),
    subtotal: Number(raw.subtotal) || 0,
    vat: Number(raw.vat) || 0,
    total: Number(raw.total) || 0,
    sessionId: raw.sessionId ?? raw.session_id ?? '',
    discount: raw.couponDiscount ?? raw.discount ?? undefined,
    code: raw.coupon?.code ?? raw.code ?? undefined,
  };
}

async function unwrap(p: Promise<ApiResponse<any>>): Promise<ApiResponse<Cart>> {
  const res = await p;
  return { ...res, data: normalizeCart(res?.data) };
}

export const cart = {
  get: () => unwrap(request<ApiResponse<any>>('/cart')),

  add: (body: { serviceSlug: string; planId?: string; qty?: number }) => {
    const h: Record<string, string> = {};
    if (!getToken()) h['X-Session-Id'] = getSid();
    return unwrap(request<ApiResponse<any>>('/cart/items', { method: 'POST', body: JSON.stringify(body), headers: h }));
  },

  updateQty: (lineId: string, qty: number) =>
    unwrap(request<ApiResponse<any>>(`/cart/items/${lineId}`, { method: 'PUT', body: JSON.stringify({ qty }) })),

  remove: (lineId: string) =>
    unwrap(request<ApiResponse<any>>(`/cart/items/${lineId}`, { method: 'DELETE' })),

  clear: () => unwrap(request<ApiResponse<any>>('/cart', { method: 'DELETE' })),

  applyCoupon: (code: string) =>
    unwrap(request<ApiResponse<any>>('/cart/coupon', { method: 'POST', body: JSON.stringify({ code }) })),

  removeCoupon: () =>
    unwrap(request<ApiResponse<any>>('/cart/coupon', { method: 'DELETE' })),
};