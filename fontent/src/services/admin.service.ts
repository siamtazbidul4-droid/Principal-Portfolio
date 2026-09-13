import { request } from './api';
import { IAdminUser, ApiResponse } from '../types';

export const AdminService = {
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: IAdminUser }>> {
    return request<{ token: string; user: IAdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getMe(): Promise<ApiResponse<IAdminUser>> {
    return request<IAdminUser>('/auth/me');
  },

  async logout(): Promise<ApiResponse<void>> {
    return request<void>('/auth/logout', {
      method: 'POST',
    });
  },
};
