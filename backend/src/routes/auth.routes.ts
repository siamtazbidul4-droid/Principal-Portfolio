import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimit.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { loginSchema } from '../validators/schemas.js';

const router = Router();

router.post('/login', authRateLimiter, validateBody(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', requireAdminAuth as any, AuthController.getMe as any);

export default router;
