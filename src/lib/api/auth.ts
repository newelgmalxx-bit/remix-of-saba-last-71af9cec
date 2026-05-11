import { request, setToken, setUser, removeToken, getToken } from './client';
import type { User, ApiResponse } from './types';

export const auth = {
  signup: async (body: { name: string; email: string; phone?: string; password: string }) => {
    const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      method: 'POST', body: JSON.stringify(body),
    });
    if (res.data?.token) { setToken(res.data.token); setUser(res.data.user); }
    return res;
  },

  login: async (body: { email?: string; phone?: string; emailOrPhone?: string; password: string }) => {
    const email = body.email ?? body.emailOrPhone ?? body.phone ?? '';
    const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password: body.password }),
    });
    if (res.data?.token) { setToken(res.data.token); setUser(res.data.user); }
    return res;
  },

  google: async (idToken: string) => {
    const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/google', {
      method: 'POST', body: JSON.stringify({ idToken }),
    });
    if (res.data?.token) { setToken(res.data.token); setUser(res.data.user); }
    return res;
  },

  logout: async () => {
    if (getToken()) {
      try { await request('/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
    }
    removeToken();
  },

  me: () => request<ApiResponse<{ user: User }>>('/auth/me'),

  forgot: (email: string) =>
    request<ApiResponse<{ ok: boolean }>>('/auth/forgot-password', {
      method: 'POST', body: JSON.stringify({ email }),
    }),

  reset: (token: string, password: string) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};