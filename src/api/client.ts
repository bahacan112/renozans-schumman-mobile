/**
 * Backend (rezonans-backend) API client.
 *
 * API_BASE notes for development:
 * - USB device + `adb reverse tcp:4000 tcp:4000` → http://localhost:4000 works.
 * - Wi-Fi (no reverse) → use the PC LAN IP, e.g. http://192.168.1.7:4000
 * - Production → the deployed HTTPS URL.
 */
export const API_BASE = 'http://localhost:4000';

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

  me: (token: string) => request<{ user: AuthUser }>('/me', { token }),

  upgradePremium: (token: string) =>
    request<{ user: AuthUser }>('/me/premium', { method: 'POST', token }),
};
