import { request } from './api';
import { IService, ApiResponse } from '../types';

export const ServiceItemService = {
  async getPublicServices(): Promise<ApiResponse<IService[]>> {
    return request<IService[]>('/services');
  },

  async getAllAdminServices(): Promise<ApiResponse<IService[]>> {
    return request<IService[]>('/services/admin/all');
  },

  async createService(data: Partial<IService>): Promise<ApiResponse<IService>> {
    return request<IService>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateService(id: string, data: Partial<IService>): Promise<ApiResponse<IService>> {
    return request<IService>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteService(id: string): Promise<ApiResponse<void>> {
    return request<void>(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};
