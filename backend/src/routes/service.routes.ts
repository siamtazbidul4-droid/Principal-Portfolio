import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { serviceSchema } from '../validators/schemas.js';

const router = Router();

// Public
router.get('/', ServiceController.getPublicServices);

// Admin
router.get('/admin/all', requireAdminAuth as any, ServiceController.getAllAdminServices);
router.post('/', requireAdminAuth as any, validateBody(serviceSchema), ServiceController.createService);
router.put('/:id', requireAdminAuth as any, validateBody(serviceSchema), ServiceController.updateService);
router.delete('/:id', requireAdminAuth as any, ServiceController.deleteService);

export default router;
