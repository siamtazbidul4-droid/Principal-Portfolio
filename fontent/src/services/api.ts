import { ApiResponse } from '../types';

//const API_BASE_URL = '/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
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
