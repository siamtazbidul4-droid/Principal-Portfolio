import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StorageService } from '../services/storage.service.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const admin = await StorageService.getAdminByEmail(email);

      if (!admin || !admin.passwordHash) {
        res.status(401).json({
          success: false,
          message: 'Invalid administrative credentials.',
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash);

      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid administrative credentials.',
        });
        return;
      }

      await StorageService.updateAdminLastLogin(admin._id || admin.id);

      const token = jwt.sign(
        {
          id: admin._id || admin.id,
          email: admin.email,
          role: admin.role || 'superadmin',
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        data: {
          token,
          user: {
            id: admin._id || admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
      });
    } catch (error) {
      console.error('[AuthController.login]', error);
      res.status(500).json({
        success: false,
        message: 'An internal authentication error occurred.',
      });
    }
  }

  public static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated.' });
        return;
      }

      const admin = await StorageService.getAdminByEmail(req.user.email);
      if (!admin) {
        res.status(404).json({ success: false, message: 'Admin account not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: admin._id || admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          lastLogin: admin.lastLogin,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve session info.' });
    }
  }

  public static logout(req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  }
}
