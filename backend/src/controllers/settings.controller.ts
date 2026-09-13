import { Request, Response } from 'express';
import { StorageService } from '../services/storage.service.js';

export class SettingsController {
  public static async getPublicSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await StorageService.getSettings();
      res.status(200).json({ success: true, data: settings });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve site configuration.' });
    }
  }

  public static async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const updated = await StorageService.updateSettings(req.body);
      res.status(200).json({
        success: true,
        message: 'Site configuration updated successfully.',
        data: updated,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update site configuration.' });
    }
  }
}
