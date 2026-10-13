import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const authLimiter = rateLimiter({
  max: 15,
  windowMs: 60 * 1000,
  message: 'Too many authentication attempts. Please try again after a minute.',
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticateUser, getMe);

export default router;
