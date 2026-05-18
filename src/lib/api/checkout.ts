import { request } from './client';
import type { Order, ApiResponse } from './types';

export type PaymentMethodInfo = {
  id: string;
  name: string;
  description?: string;
  logo?: string | null;
  fee?: number;
  type?: string;
};

// Static fallback if /checkout/payment-methods is unavailable.
export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  { id: 'myfatoorah', name: 'MyFatoorah', type: 'gateway' },
  { id: 'tamara', name: 'Tamara', type: 'bnpl' },
  { id: 'cod', name: 'Cash on Delivery', type: 'cod' },
];

// Map UI payment id to a backend-accepted gateway value.
// Backend accepts "myfatoorah", "tamara", or "cod" as independent providers.
function toBackendMethod(id: string | null | undefined): 'myfatoorah' | 'tamara' | 'cod' {
  if (id === 'cod') return 'cod';
  if (id === 'tamara') return 'tamara';
  return 'myfatoorah';
}

type CheckoutBody = {
  contact?: { name?: string; email?: string; phone: string; city?: string; address?: string };
  paymentMethod: 'myfatoorah' | 'tamara' | 'cod' | string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCity?: string;
  contactAddress?: string;
  city?: string;
  phone?: string;
  items?: Array<{ serviceSlug: string; serviceTitle?: string; planId?: string | null; planName?: string | null; price?: number; qty?: number }>;
};

function buildPayload(body: CheckoutBody) {
  return {
    paymentMethod: toBackendMethod(body.paymentMethod),
    contactName: body.contactName ?? body.contact?.name ?? '',
    contactEmail: body.contactEmail ?? body.contact?.email ?? '',
    contactPhone: body.contactPhone ?? body.contact?.phone ?? body.phone ?? '',
    city: body.contactCity ?? body.contact?.city ?? body.city,
    contactCity: body.contactCity ?? body.contact?.city ?? body.city,
    contactAddress: body.contactAddress ?? body.contact?.address,
    notes: body.notes,
    items: body.items,
  };
}

type CheckoutResponse = ApiResponse<{
  orderId: string;
  orderNumber: string;
  paymentUrl?: string | null;
  checkoutUrl?: string | null;
  checkout_url?: string | null;
  checkoutId?: string | null;
  checkout_id?: string | null;
  tamaraOrderId?: string | null;
  tamara_order_id?: string | null;
  invoiceId?: string | null;
  order?: Order;
}>;

export const checkout = {
  // POST /checkout — create order (online or COD).
  create: (body: CheckoutBody) =>
    request<CheckoutResponse>('/checkout', { method: 'POST', body: JSON.stringify(buildPayload(body)) }),

  // POST /checkout/initiate — alias used for online checkout.
  initiate: (body: CheckoutBody) =>
    request<CheckoutResponse>('/checkout/initiate', {
      method: 'POST',
      body: JSON.stringify(buildPayload(body)),
    }),

  // POST /checkout/cod — Cash on Delivery checkout.
  cod: (body: CheckoutBody) =>
    request<CheckoutResponse>('/checkout/cod', {
      method: 'POST',
      body: JSON.stringify(buildPayload({ ...body, paymentMethod: 'cod' })),
    }),

  // POST /checkout/myfatoorah — initiate hosted payment session for an existing order.
  initiateMyfatoorah: (orderId: string) =>
    request<ApiResponse<{ paymentUrl: string }>>('/checkout/myfatoorah', {
      method: 'POST', body: JSON.stringify({ orderId }),
    }),

  // GET /checkout/verify?paymentId=xxx — MyFatoorah return verification.
  verify: (paymentId: string) =>
    request<ApiResponse<{
      orderId: string;
      orderNumber: string;
      paid: boolean;
      paymentStatus?: 'paid' | 'pending' | 'failed';
      status?: 'confirmed' | 'pending' | 'cancelled';
      invoiceId?: string | null;
      paymentId?: string | null;
    }>>(`/checkout/verify?paymentId=${encodeURIComponent(paymentId)}`),

  // Legacy alias kept for older callers.
  callback: (paymentId: string) =>
    request<ApiResponse<{ paid: boolean; orderId?: string; orderNumber?: string }>>(
      `/checkout/verify?paymentId=${encodeURIComponent(paymentId)}`
    ),

  // GET /checkout/payment-methods — load methods from backend.
  paymentMethods: () =>
    request<ApiResponse<{ items: PaymentMethodInfo[] }>>('/checkout/payment-methods'),
};
