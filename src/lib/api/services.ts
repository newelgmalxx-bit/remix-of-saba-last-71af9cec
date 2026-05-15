import { request } from './client';
import type { ServiceListItem, ServiceFull, ApiResponse } from './types';

export const services = {
  list: (params?: { category?: string; q?: string }) => {
    const q = params ? new URLSearchParams(params as any).toString() : '';
    return request<ApiResponse<{ items: ServiceListItem[] }>>(`/services${q ? '?' + q : ''}`);
  },

  detail: (slug: string) =>
    request<ApiResponse<{ service: ServiceFull }>>(`/services/${slug}`),
};

// Public reviews. List by serviceSlug (or all). Create requires auth.
export const reviews = {
  list: (params?: { serviceSlug?: string; limit?: number }) => {
    const q = params ? new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => [k, String(v)])
    ).toString() : '';
    return request<ApiResponse<{ items: any[]; average?: number; total?: number }>>(`/reviews${q ? '?' + q : ''}`);
  },
  create: (body: { serviceSlug: string; rating: number; text: string }) =>
    request('/account/reviews', { method: 'POST', body: JSON.stringify(body) }),
};

// Favorites are keyed by service id per spec.
export const favorites = {
  list: () => request<ApiResponse<{ items: any[]; slugs?: string[] }>>('/account/favorites'),
  add: (serviceId: string) =>
    request<ApiResponse<{ favorited: boolean }>>(`/account/favorites/${serviceId}`, { method: 'POST' }),
  remove: (serviceId: string) =>
    request<ApiResponse<{ favorited: boolean }>>(`/account/favorites/${serviceId}`, { method: 'DELETE' }),
};