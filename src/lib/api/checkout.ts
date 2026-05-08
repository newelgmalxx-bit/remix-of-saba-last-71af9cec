import { request } from './client';
import type { Order, ApiResponse } from './types';

export const checkout = {
  create: (body: {
    contact: { name: string; email: string; phone: string; city?: string; address?: string };
    paymentMethod: string; notes?: string;
    items?: Array<{ serviceSlug: string; serviceTitle?: string; planId?: string; planName?: string; price?: number; qty?: number }>;
  }) => request<ApiResponse<{
    orderNumber: string; paymentUrl: string | null;
    payment: any | null; order: Order;
  }>>('/checkout', { method: 'POST', body: JSON.stringify(body) }),
};