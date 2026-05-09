import { request } from './client';
import type { Order, ApiResponse } from './types';

export type PaymentMethodInfo = {
  id: string;
  name: string;
  description?: string;
  logo?: string | null;
  type?: string;
};

export const checkout = {
  // GET /checkout/payment-methods (public)
  getPaymentMethods: () =>
    request<ApiResponse<{ items: PaymentMethodInfo[] }>>('/checkout/payment-methods'),

  // POST /checkout/initiate (auth) — server reads cart + computes totals
  // body: { paymentMethod, phone, city, notes? }
  // Returns: { orderId, orderNumber, paymentUrl }
  create: (body: {
    contact?: { name?: string; email?: string; phone: string; city?: string; address?: string };
    paymentMethod: string;
    notes?: string;
    phone?: string;
    city?: string;
    items?: Array<{ serviceSlug: string; serviceTitle?: string; planId?: string; planName?: string; price?: number; qty?: number }>;
  }) => {
    // Spec only requires { paymentMethod, phone, city, notes }. Map legacy `contact`.
    const phone = body.phone ?? body.contact?.phone ?? '';
    const city = body.city ?? body.contact?.city ?? '';
    const payload: any = {
      paymentMethod: body.paymentMethod,
      phone,
      city,
      notes: body.notes,
    };
    if (body.items?.length) payload.items = body.items;
    const path = body.paymentMethod === 'cod' ? '/checkout/cod' : '/checkout/initiate';
    return request<ApiResponse<{
      orderId: string;
      orderNumber: string;
      paymentUrl: string | null;
      payment?: any | null;
      order?: Order;
    }>>(path, { method: 'POST', body: JSON.stringify(payload) });
  },

  // GET /checkout/verify?paymentId=xxx (public, called after MyFatoorah callback)
  verify: (paymentId: string) =>
    request<ApiResponse<{ paid: boolean; orderId?: string; orderNumber?: string }>>(
      `/checkout/verify?paymentId=${encodeURIComponent(paymentId)}`
    ),
};