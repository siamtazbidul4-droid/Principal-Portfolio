import { request } from './api';
import { IContactInquiry, ApiResponse } from '../types';

export const ContactService = {
  async submitContact(formData: {
    name: string;
    email: string;
    company?: string;
    projectType: string;
    budgetRange?: string;
    message: string;
  }): Promise<ApiResponse<{ referenceId: string }>> {
    return request<{ referenceId: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  async getInquiries(): Promise<ApiResponse<{ inquiries: IContactInquiry[]; stats: { total: number; unread: number } }>> {
    return request<{ inquiries: IContactInquiry[]; stats: { total: number; unread: number } }>('/contact');
  },

  async updateInquiryStatus(id: string, status: string): Promise<ApiResponse<IContactInquiry>> {
    return request<IContactInquiry>(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteInquiry(id: string): Promise<ApiResponse<void>> {
    return request<void>(`/contact/${id}`, {
      method: 'DELETE',
    });
  },
};
