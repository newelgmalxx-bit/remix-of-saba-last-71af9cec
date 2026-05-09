import { request } from './client';
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
  }>>('/site/settings'),
  sendContact: (body: { name: string; email: string; phone?: string; service?: string; budget?: string; message: string }) =>
    request<ApiResponse<{ ok: boolean }>>('/contact', { method: 'POST', body: JSON.stringify(body) }),
};