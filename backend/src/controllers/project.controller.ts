import { Request, Response } from 'express';
import { StorageService } from '../services/storage.service.js';

export class ProjectController {
  public static async getPublicProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await StorageService.getProjects({ publishedOnly: true });
      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve portfolio projects.' });
    }
  }

  public static async getPublicProjectBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const project = await StorageService.getProjectBySlug(slug);

      if (!project || !project.published) {
        res.status(404).json({
          success: false,
          message: 'Project case study not found or currently in private preview.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve project details.' });
    }
  }

  public static async getAllAdminProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await StorageService.getProjects({ publishedOnly: false });
      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve admin projects.' });
    }
  }

  public static async createProject(req: Request, res: Response): Promise<void> {
    try {
      const project = await StorageService.createProject(req.body);
      res.status(201).json({
        success: true,
        message: 'Project created successfully.',
        data: project,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create project.' });
    }
  }

  public static async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await StorageService.updateProject(id, req.body);

      if (!updated) {
        res.status(404).json({ success: false, message: 'Project not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Project updated successfully.',
        data: updated,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update project.' });
    }
  }

  public static async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await StorageService.deleteProject(id);

      if (!deleted) {
        res.status(404).json({ success: false, message: 'Project not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully.',
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete project.' });
    }
  }
}
