import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { projectSchema } from '../validators/schemas.js';

const router = Router();

// Public routes
router.get('/', ProjectController.getPublicProjects);
router.get('/slug/:slug', ProjectController.getPublicProjectBySlug);

// Admin-only routes
router.get('/admin/all', requireAdminAuth as any, ProjectController.getAllAdminProjects);
router.post('/', requireAdminAuth as any, validateBody(projectSchema), ProjectController.createProject);
router.put('/:id', requireAdminAuth as any, validateBody(projectSchema), ProjectController.updateProject);
router.delete('/:id', requireAdminAuth as any, ProjectController.deleteProject);

// Public slug fallback
router.get('/:slug', ProjectController.getPublicProjectBySlug);

export default router;
