import { request, setToken, setUser, removeToken } from './client';
import type { User, ApiResponse } from './types';

export const auth = {
  signup: async (body: { name: string; email: string; phone?: string; password: string; city?: string }) => {
    const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      method: 'POST', body: JSON.stringify(body),
    });
    if (res.data?.token) { setToken(res.data.token); setUser(res.data.user); }
    return res;
  },

  login: async (body: { email?: string; phone?: string; emailOrPhone?: string; password: string }) => {
    const emailOrPhone = body.emailOrPhone ?? body.email ?? body.phone ?? '';
    const res = await request<ApiResponse<{ user: User; token: string; cart?: any }>>('/auth/login', {
      method: 'POST', body: JSON.stringify({ emailOrPhone, password: body.password }),
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
    // Backend has no /auth/logout endpoint — clear client-side token only.
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