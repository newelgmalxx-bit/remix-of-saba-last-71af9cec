import { request, getToken, BASE } from './client';
import type { Plan, ApiResponse } from './types';

export const publicApi = {
  getPlans: () => request<ApiResponse<{ items: Plan[] }>>('/plans'),
  getPortfolio: (params?: { category?: string }) => {
    const q = params ? new URLSearchParams(params as any).toString() : '';
    return request(`/portfolio${q ? '?' + q : ''}`);
  },
  getSiteSettings: () => request<ApiResponse<{
    logo: string | null; nameAr: string; nameEn: string;
    taglineAr: string; taglineEn: string;
    social: Record<string, string>; maintenanceMode: boolean;
    currency?: string; vatRate?: number;
  }>>('/settings'),
  sendContact: (body: { name: string; email: string; phone?: string; service?: string; budget?: string; message: string }) =>
    request<ApiResponse<{ ok: boolean }>>('/contact', { method: 'POST', body: JSON.stringify(body) }),

  // Public reviews list. Pass serviceSlug to filter, or omit to fetch all published.
  getReviews: (params?: { serviceSlug?: string; limit?: number }) => {
    const q = params ? new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => [k, String(v)])
    ).toString() : '';
    return request<ApiResponse<{ items: any[]; average?: number; total?: number }>>(`/reviews${q ? '?' + q : ''}`);
  },

  // Public bookings endpoint.
  createBooking: (body: { name: string; email: string; phone?: string; date?: string; time?: string; notes?: string; serviceId?: string }) =>
    request<ApiResponse<any>>('/bookings', { method: 'POST', body: JSON.stringify(body) }),

  // Tracking codes for the storefront.
  getTracking: () => request<ApiResponse<{ pixels?: string; head?: string; body?: string }>>('/tracking'),

  // Generic upload (auth required by backend).
  upload: async (file: File, bucket: string = 'general') => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('bucket', bucket);
    return fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken() ?? ''}` },
      body: fd,
    }).then((r) => r.json());
  },
};