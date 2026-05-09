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
    const qp = new URLSearchParams({ serviceSlug: slug, ...(params as any || {}) }).toString();
    return request<ApiResponse<any>>(`/reviews?${qp}`);
  },
  // POST /account/reviews (auth required) — backend expects { serviceSlug, rating, text }
  create: (slug: string, body: { rating: number; comment?: string }) =>
    request('/account/reviews', {
      method: 'POST',
      body: JSON.stringify({ serviceSlug: slug, rating: body.rating, text: body.comment ?? '' }),
    }),
};

export const favorites = {
  list: () => request<ApiResponse<{ items: any[]; slugs?: string[] }>>('/account/favorites'),
  add: (slug: string) =>
    request<ApiResponse<{ favorited: boolean }>>('/account/favorites', {
      method: 'POST', body: JSON.stringify({ serviceSlug: slug }),
    }),
  remove: (slug: string) =>
    request<ApiResponse<{ favorited: boolean }>>(`/account/favorites/${slug}`, { method: 'DELETE' }),
};