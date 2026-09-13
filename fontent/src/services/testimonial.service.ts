import { request } from './api';
import { ITestimonial, ApiResponse } from '../types';

export const TestimonialService = {
  async getPublicTestimonials(): Promise<ApiResponse<ITestimonial[]>> {
    return request<ITestimonial[]>('/testimonials');
  },

  async getAllAdminTestimonials(): Promise<ApiResponse<ITestimonial[]>> {
    return request<ITestimonial[]>('/testimonials/admin/all');
  },

  async createTestimonial(data: Partial<ITestimonial>): Promise<ApiResponse<ITestimonial>> {
    return request<ITestimonial>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTestimonial(id: string, data: Partial<ITestimonial>): Promise<ApiResponse<ITestimonial>> {
    return request<ITestimonial>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTestimonial(id: string): Promise<ApiResponse<void>> {
    return request<void>(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  },
};
