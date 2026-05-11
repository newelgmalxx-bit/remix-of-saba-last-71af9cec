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

// Reviews are listed publicly by service id. Use account.createReview for posting.
export const reviews = {
  list: (serviceId: string) =>
    request<ApiResponse<any>>(`/reviews/${serviceId}`),
  create: (serviceId: string, body: { rating: number; comment?: string }) =>
    request('/account/reviews', {
      method: 'POST',
      body: JSON.stringify({ serviceId, rating: body.rating, comment: body.comment ?? '' }),
    }),
};

// Favorites are keyed by service id per spec.
export const favorites = {
  list: () => request<ApiResponse<{ items: any[]; slugs?: string[] }>>('/account/favorites'),
  add: (serviceId: string) =>
    request<ApiResponse<{ favorited: boolean }>>(`/account/favorites/${serviceId}`, { method: 'POST' }),
  remove: (serviceId: string) =>
    request<ApiResponse<{ favorited: boolean }>>(`/account/favorites/${serviceId}`, { method: 'DELETE' }),
};