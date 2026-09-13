import { ApiResponse } from '../types';

//const API_BASE_URL = '/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Base origin used to resolve backend-hosted files (e.g. `/uploads/...`).
// - Single-service deploy (same origin): API_BASE_URL is `/api` -> FILE_BASE_URL is '' (keep relative).
// - Split deploy (Static Site + Web Service): API_BASE_URL is `https://<backend>/api`
//   -> FILE_BASE_URL is `https://<backend>` so images load from the backend, not the static host.
function computeFileBaseUrl(): string {
  const raw = (API_BASE_URL || '/api').trim();
  const trimmed = raw.replace(/\/+$/, '');
  if (trimmed === '/api') return '';
  if (trimmed.endsWith('/api')) return trimmed.slice(0, -'/api'.length);
  return trimmed;
}

export const FILE_BASE_URL = computeFileBaseUrl();

/**
 * Resolve a stored image/file URL to a loadable browser URL.
 * - Absolute http(s)/data:/blob: URLs pass through unchanged.
 * - Relative `/uploads/...` URLs are prefixed with the backend origin when the
 *   SPA is served from a different origin (split Render deployment).
 */
export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url) return '';
  const value = String(url).trim();
  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return value;
  }
  if (value.startsWith('/uploads/') && FILE_BASE_URL) {
    return `${FILE_BASE_URL}${value}`;
  }
  return value;
}
export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('aurelius_auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 && token) {
        localStorage.removeItem('aurelius_auth_token');
        localStorage.removeItem('aurelius_auth_user');
      }

      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
        errors: data.errors,
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    console.error(`API request error on [${options.method || 'GET'} ${endpoint}]:`, error);
    return {
      success: false,
      message: (error as Error).message || 'Network connection failed. Please verify connectivity.',
    };
  }
}
