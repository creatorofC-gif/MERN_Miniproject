import { Router } from 'express';
import { getRooms, getRoomById, createRoom, joinRoom } from '../controllers/roomController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const createRoomLimiter = rateLimiter({
  max: 10,
  windowMs: 60 * 1000,
  message: 'Too many rooms created. Please wait a minute.',
});

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', authenticateUser, createRoomLimiter, createRoom);
router.post('/:id/join', authenticateUser, joinRoom);

export default router;
