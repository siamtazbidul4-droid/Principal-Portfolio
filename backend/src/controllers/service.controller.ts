import { Request, Response } from 'express';
import { StorageService } from '../services/storage.service.js';

export class ServiceController {
  public static async getPublicServices(req: Request, res: Response): Promise<void> {
    try {
      const services = await StorageService.getServices({ publishedOnly: true });
      res.status(200).json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve services.' });
    }
  }

  public static async getAllAdminServices(req: Request, res: Response): Promise<void> {
    try {
      const services = await StorageService.getServices({ publishedOnly: false });
      res.status(200).json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve admin services.' });
    }
  }

  public static async createService(req: Request, res: Response): Promise<void> {
    try {
      const service = await StorageService.createService(req.body);
      res.status(201).json({ success: true, message: 'Service capability added.', data: service });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create service.' });
    }
  }

  public static async updateService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await StorageService.updateService(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Service not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Service capability updated.', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update service.' });
    }
  }

  public static async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await StorageService.deleteService(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Service not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Service deleted successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete service.' });
    }
  }
}
