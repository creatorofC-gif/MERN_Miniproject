import { Router } from 'express';
import { getLeaderboard, updateProfile, toggleDailyGoal } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.patch('/profile', authenticateUser, updateProfile);
router.post('/goals/toggle', authenticateUser, toggleDailyGoal);

export default router;
