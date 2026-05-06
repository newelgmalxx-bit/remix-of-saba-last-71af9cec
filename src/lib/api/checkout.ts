import { request } from './client';
import type { Order, ApiResponse } from './types';

export const checkout = {
  create: (body: {
    contact: { name: string; email: string; phone: string; city?: string; address?: string };
    paymentMethod: string; notes?: string;
    couponCode?: string; discount?: number;
  }) => request<ApiResponse<{
    orderNumber: string; paymentUrl: string | null;
    payment: any | null; order: Order;
  }>>('/checkout', { method: 'POST', body: JSON.stringify(body) }),
};