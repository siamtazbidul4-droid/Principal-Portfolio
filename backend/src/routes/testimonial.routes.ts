import { Router } from 'express';
import { TestimonialController } from '../controllers/testimonial.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { testimonialSchema } from '../validators/schemas.js';

const router = Router();

// Public
router.get('/', TestimonialController.getPublicTestimonials);

// Admin
router.get('/admin/all', requireAdminAuth as any, TestimonialController.getAllAdminTestimonials);
router.post('/', requireAdminAuth as any, validateBody(testimonialSchema), TestimonialController.createTestimonial);
router.put('/:id', requireAdminAuth as any, validateBody(testimonialSchema), TestimonialController.updateTestimonial);
router.delete('/:id', requireAdminAuth as any, TestimonialController.deleteTestimonial);

export default router;
