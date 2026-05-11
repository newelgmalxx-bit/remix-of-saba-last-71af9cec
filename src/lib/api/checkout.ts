import { request } from './client';
import type { Order, ApiResponse } from './types';

export type PaymentMethodInfo = {
  id: string;
  name: string;
  description?: string;
  logo?: string | null;
  type?: string;
};

// Spec doesn't expose a payment-methods endpoint — UI can use a static list.
export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  { id: 'myfatoorah', name: 'MyFatoorah', type: 'gateway' },
  { id: 'cod', name: 'Cash on Delivery', type: 'cod' },
];

export const checkout = {
  // POST /checkout — creates the order from the server-side cart.
  // body: { paymentMethod, contactName, contactEmail, contactPhone, contactCity?, contactAddress?, notes? }
  // Returns: { orderId, orderNumber, paymentUrl? }
  create: (body: {
    contact?: { name?: string; email?: string; phone: string; city?: string; address?: string };
    paymentMethod: 'myfatoorah' | 'cod' | string;
    notes?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactCity?: string;
    contactAddress?: string;
    // legacy
    phone?: string;
    city?: string;
    items?: Array<{ serviceSlug: string; serviceTitle?: string; planId?: string; planName?: string; price?: number; qty?: number }>;
  }) => {
    const payload: any = {
      paymentMethod: body.paymentMethod,
      contactName: body.contactName ?? body.contact?.name ?? '',
      contactEmail: body.contactEmail ?? body.contact?.email ?? '',
      contactPhone: body.contactPhone ?? body.contact?.phone ?? body.phone ?? '',
      contactCity: body.contactCity ?? body.contact?.city ?? body.city,
      contactAddress: body.contactAddress ?? body.contact?.address,
      notes: body.notes,
    };
    return request<ApiResponse<{
      orderId: string;
      orderNumber: string;
      paymentUrl?: string | null;
      order?: Order;
    }>>('/checkout', { method: 'POST', body: JSON.stringify(payload) });
  },

  // POST /checkout/myfatoorah — initiate hosted payment session for an existing order.
  initiateMyfatoorah: (orderId: string) =>
    request<ApiResponse<{ paymentUrl: string }>>('/checkout/myfatoorah', {
      method: 'POST', body: JSON.stringify({ orderId }),
    }),

  // GET /checkout/callback?paymentId=xxx — MyFatoorah return callback.
  verify: (paymentId: string) =>
    request<ApiResponse<{ paid: boolean; orderId?: string; orderNumber?: string }>>(
      `/checkout/callback?paymentId=${encodeURIComponent(paymentId)}`
    ),
};