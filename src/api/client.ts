/**
 * Backend (rezonans-backend) API client.
 *
 * API_BASE points at the live backend so the app works over the internet
 * (no adb reverse needed for the API). For local backend development, swap to
 * 'http://localhost:4000' with `adb reverse tcp:4000 tcp:4000` on a USB device.
 */
export const API_BASE = 'https://renozans-backend.baha.tr';

/** Google OAuth Web Client ID (audience for the native sign-in ID token). */
export const GOOGLE_WEB_CLIENT_ID =
  '518484091286-d5v1ecqtaveem727duvl85s94orn3j1o.apps.googleusercontent.com';

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  isPremium: boolean;
};

export type AuthResponse = { token: string; user: AuthUser };

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Sunucuya ulaşılamadı. Bağlantınızı kontrol edin.');
  }

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && data.message) ||
      'Bir hata oluştu. Lütfen tekrar deneyin.';
    throw new ApiError(res.status, message);
  }
  return data as T;
}

export const api = {
  register: (email: string, password: string, name?: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { email, password, ...(name ? { name } : {}) },
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  google: (idToken: string) =>
    request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: { idToken },
    }),

  forgotPassword: (email: string) =>
    request<{ ok: boolean; devCode?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),

  resetPassword: (email: string, code: string, password: string) =>
    request<{ ok: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: { email, code, password },
    }),

  me: (token: string) => request<{ user: AuthUser }>('/me', { token }),

  upgradePremium: (token: string) =>
    request<{ user: AuthUser }>('/me/premium', { method: 'POST', token }),
};
