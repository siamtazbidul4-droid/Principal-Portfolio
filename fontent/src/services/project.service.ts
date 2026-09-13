import { request } from './api';
import { IProject, ApiResponse } from '../types';

export const ProjectService = {
  async getPublicProjects(): Promise<ApiResponse<IProject[]>> {
    return request<IProject[]>('/projects');
  },

  async getProjectBySlug(slug: string): Promise<ApiResponse<IProject>> {
    return request<IProject>(`/projects/slug/${slug}`);
  },

  async getAllAdminProjects(): Promise<ApiResponse<IProject[]>> {
    return request<IProject[]>('/projects/admin/all');
  },

  async createProject(data: Partial<IProject>): Promise<ApiResponse<IProject>> {
    return request<IProject>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProject(id: string, data: Partial<IProject>): Promise<ApiResponse<IProject>> {
    return request<IProject>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};
