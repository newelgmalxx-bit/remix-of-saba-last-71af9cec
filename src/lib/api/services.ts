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

export const reviews = {
  list: (slug: string, params?: { page?: number; limit?: number; sort?: string }) => {
    const q = params ? new URLSearchParams(params as any).toString() : '';
    return request<ApiResponse<any>>(`/services/${slug}/reviews${q ? '?' + q : ''}`);
  },
  create: (slug: string, body: { rating: number; comment?: string }) =>
    request(`/services/${slug}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: { rating?: number; comment?: string }) =>
    request(`/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string) => request(`/reviews/${id}`, { method: 'DELETE' }),
};

export const favorites = {
  list: () => request<ApiResponse<{ slugs: string[] }>>('/me/favorites'),
  add: (slug: string) =>
    request<ApiResponse<{ favorited: boolean }>>('/me/favorites', {
      method: 'POST', body: JSON.stringify({ serviceSlug: slug }),
    }),
  remove: (slug: string) =>
    request<ApiResponse<{ favorited: boolean }>>(`/me/favorites/${slug}`, { method: 'DELETE' }),
};