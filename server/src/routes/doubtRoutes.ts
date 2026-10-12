import { Router } from 'express';
import { getDoubts, getDoubtById, createDoubt, claimDoubt, addAnswer, voteDoubt } from '../controllers/doubtController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getDoubts);
router.get('/:id', getDoubtById);
router.post('/', authenticateUser, createDoubt);
router.post('/:id/claim', authenticateUser, claimDoubt);
router.post('/:id/answers', authenticateUser, addAnswer);
router.post('/:id/vote', voteDoubt);

export default router;
