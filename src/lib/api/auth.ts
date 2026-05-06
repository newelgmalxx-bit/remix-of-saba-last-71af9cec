import { request, setToken, setUser, removeToken } from './client';
import type { User, ApiResponse } from './types';

export const auth = {
  signup: async (body: { name: string; email: string; phone?: string; password: string }) => {
    const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/signup', {
      method: 'POST', body: JSON.stringify(body),
    });
    if (res.data?.token) { setToken(res.data.token); setUser(res.data.user); }
    return res;
  },

  login: async (body: { email?: string; phone?: string; password: string }) => {
    const res = await request<ApiResponse<{ user: User; token: string; cart?: any }>>('/auth/login', {
      method: 'POST', body: JSON.stringify(body),
    });
    if (res.data?.token) { setToken(res.data.token); setUser(res.data.user); }
    return res;
  },

  google: async (idToken: string) => {
    const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/oauth/google', {
      method: 'POST', body: JSON.stringify({ idToken }),
    });
    if (res.data?.token) { setToken(res.data.token); setUser(res.data.user); }
    return res;
  },

  logout: async () => {
    try { await request('/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
    removeToken();
  },

  me: () => request<ApiResponse<{ user: User }>>('/auth/me'),

  forgot: (email: string) =>
    request<ApiResponse<{ ok: boolean }>>('/auth/forgot', {
      method: 'POST', body: JSON.stringify({ email }),
    }),

  reset: (token: string, password: string) =>
    request('/auth/reset', { method: 'POST', body: JSON.stringify({ token, password }) }),
};