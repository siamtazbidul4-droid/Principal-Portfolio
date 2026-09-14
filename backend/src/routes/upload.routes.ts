import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

import { getUploadsDir } from '../config/uploads.js';
import { CloudinaryService } from '../services/cloudinary.service.js';

const router = Router();

const UPLOADS_DIR = getUploadsDir();

// Ensure the local fallback directory exists (used when Cloudinary is not
// configured, e.g. local development). In production Cloudinary is the store.
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

router.post('/', requireAdminAuth as any, async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename, dataUrl } = req.body;

    if (!dataUrl || typeof dataUrl !== 'string') {
      res.status(400).json({ success: false, message: 'Image data is required.' });
      return;
    }

    // Match data URI scheme: data:image/(png|jpeg|webp|gif|svg+xml);base64,...
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      res.status(400).json({
        success: false,
        message: 'Invalid image format. Supported formats: PNG, JPEG, WEBP, GIF, SVG.',
      });
      return;
    }

    let ext = matches[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Max 10MB limit
    if (buffer.length > 10 * 1024 * 1024) {
      res.status(400).json({
        success: false,
        message: 'Image size exceeds maximum limit of 10MB.',
      });
      return;
    }

    // Sanitize filename or generate unique name (used for the local fallback and
    // as a human-readable hint for the Cloudinary asset).
    const sanitizedBase = (filename || 'image')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 32);
    const uniqueFilename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${sanitizedBase}.${ext}`;

    // Preferred path: upload to Cloudinary and store the permanent HTTPS URL.
    // This is what makes images survive Render restarts/redeploys on the Free plan.
    if (CloudinaryService.isConfigured()) {
      const result = await CloudinaryService.uploadImage(dataUrl, { filename: uniqueFilename });
      if (result.success && result.url) {
        res.status(200).json({
          success: true,
          message: 'Image uploaded successfully.',
          data: {
            url: result.url,
            filename: result.publicId || uniqueFilename,
            size: buffer.length,
            storage: 'cloudinary',
          },
        });
        return;
      }
      // Do NOT silently persist a local-only URL in production: that is exactly the
      // ephemeral-filesystem failure mode this service exists to eliminate.
      res.status(502).json({
        success: false,
        message: result.error || 'Image storage provider is unavailable. Please try again.',
      });
      return;
    }

    // Local development fallback (Cloudinary not configured): write to disk and
    // return the relative `/uploads/...` path, preserving the original behavior.
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);
    await fs.promises.writeFile(filePath, buffer);
    const publicUrl = `/uploads/${uniqueFilename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        url: publicUrl,
        filename: uniqueFilename,
        size: buffer.length,
        storage: 'local',
      },
    });
  } catch (error) {
    console.error('[UploadRoutes]', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while saving image.',
    });
  }
});

export default router;
