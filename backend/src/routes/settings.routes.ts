import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { settingsSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', SettingsController.getPublicSettings);
router.put('/', requireAdminAuth as any, validateBody(settingsSchema), SettingsController.updateSettings);

export default router;
