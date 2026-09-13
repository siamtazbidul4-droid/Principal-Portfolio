import { Request, Response } from 'express';
import { StorageService } from '../services/storage.service.js';
import { EmailService } from '../services/email.service.js';

export class ContactController {
  public static async submitContact(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, company, projectType, budgetRange, message } = req.body;
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

      // 1. Persist inquiry in database
      const contactRecord = await StorageService.createContact({
        name,
        email,
        company: company || '',
        projectType,
        budgetRange: budgetRange || '',
        message,
        ip,
        emailSent: false,
      });

      // 2. Dispatch email via transactional HTTPS API
      const emailResult = await EmailService.sendContactNotification({
        name,
        email,
        company,
        projectType,
        budgetRange,
        message,
        createdAt: contactRecord.createdAt || new Date().toISOString(),
      });

      // 3. Update sent status and diagnostic details in storage
      await StorageService.updateContactEmailResult(
        contactRecord._id || contactRecord.id,
        emailResult.success,
        emailResult.error
      );

      // 4. If email delivery failed, return transparent failure to client
      if (!emailResult.success) {
        res.status(502).json({
          success: false,
          message:
            'Unable to deliver email notification to recipient inbox at this moment. Please email siamtazbidul4@gmail.com directly.',
          error: emailResult.error,
          data: {
            referenceId: contactRecord._id || contactRecord.id,
          },
        });
        return;
      }

      // 5. Return success message once real email was dispatched
      res.status(200).json({
        success: true,
        message: "Message received. Thanks for reaching out. I'll get back to you as soon as possible.",
        data: {
          referenceId: contactRecord._id || contactRecord.id,
          messageId: emailResult.messageId,
        },
      });
    } catch (error) {
      console.error('[ContactController.submitContact]', error);
      res.status(500).json({
        success: false,
        message: 'Unable to deliver your inquiry at this moment. Please email directly or try again.',
      });
    }
  }

  public static async getInquiries(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await StorageService.getContacts();
      const unreadCount = contacts.filter((c) => c.status === 'unread').length;

      res.status(200).json({
        success: true,
        data: {
          inquiries: contacts,
          stats: {
            total: contacts.length,
            unread: unreadCount,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to load inquiries.' });
    }
  }

  public static async updateInquiryStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['unread', 'read', 'contacted', 'archived'].includes(status)) {
        res.status(400).json({ success: false, message: 'Invalid inquiry status.' });
        return;
      }

      const updated = await StorageService.updateContactStatus(id, status);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Inquiry not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Inquiry status updated.',
        data: updated,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update inquiry.' });
    }
  }

  public static async deleteInquiry(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await StorageService.deleteContact(id);

      if (!deleted) {
        res.status(404).json({ success: false, message: 'Inquiry not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Inquiry removed successfully.',
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete inquiry.' });
    }
  }
}
