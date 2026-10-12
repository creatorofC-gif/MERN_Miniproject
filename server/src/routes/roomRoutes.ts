import { Router } from 'express';
import { getRooms, getRoomById, createRoom, joinRoom } from '../controllers/roomController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', authenticateUser, createRoom);
router.post('/:id/join', authenticateUser, joinRoom);

export default router;
