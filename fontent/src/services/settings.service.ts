import { request } from './api';
import { ISiteSettings, ApiResponse } from '../types';

export const SettingsService = {
  async getPublicSettings(): Promise<ApiResponse<ISiteSettings>> {
    return request<ISiteSettings>('/settings');
  },

  async updateSettings(data: Partial<ISiteSettings>): Promise<ApiResponse<ISiteSettings>> {
    return request<ISiteSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
