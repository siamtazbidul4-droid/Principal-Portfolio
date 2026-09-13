import { Request, Response } from 'express';
import { StorageService } from '../services/storage.service.js';

export class TestimonialController {
  public static async getPublicTestimonials(req: Request, res: Response): Promise<void> {
    try {
      const testimonials = await StorageService.getTestimonials({ publishedOnly: true });
      res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve testimonials.' });
    }
  }

  public static async getAllAdminTestimonials(req: Request, res: Response): Promise<void> {
    try {
      const testimonials = await StorageService.getTestimonials({ publishedOnly: false });
      res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve admin testimonials.' });
    }
  }

  public static async createTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const testimonial = await StorageService.createTestimonial(req.body);
      res.status(201).json({ success: true, message: 'Testimonial added.', data: testimonial });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create testimonial.' });
    }
  }

  public static async updateTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await StorageService.updateTestimonial(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Testimonial not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Testimonial updated.', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update testimonial.' });
    }
  }

  public static async deleteTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await StorageService.deleteTestimonial(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Testimonial not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Testimonial deleted successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete testimonial.' });
    }
  }
}
