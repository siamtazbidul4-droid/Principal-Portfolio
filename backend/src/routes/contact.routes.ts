import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';
import { contactRateLimiter } from '../middleware/rateLimit.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { contactFormSchema } from '../validators/schemas.js';

const router = Router();

// Public submission
router.post('/', contactRateLimiter, validateBody(contactFormSchema), ContactController.submitContact);

// Admin-only inquiries
router.get('/', requireAdminAuth as any, ContactController.getInquiries);
router.get('/inquiries', requireAdminAuth as any, ContactController.getInquiries);
router.patch('/:id/status', requireAdminAuth as any, ContactController.updateInquiryStatus);
router.patch('/inquiries/:id/status', requireAdminAuth as any, ContactController.updateInquiryStatus);
router.delete('/:id', requireAdminAuth as any, ContactController.deleteInquiry);
router.delete('/inquiries/:id', requireAdminAuth as any, ContactController.deleteInquiry);

export default router;
