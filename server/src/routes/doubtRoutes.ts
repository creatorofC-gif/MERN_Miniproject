import { Router } from 'express';
import { getDoubts, getDoubtById, createDoubt, claimDoubt, addAnswer, voteDoubt } from '../controllers/doubtController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const createLimiter = rateLimiter({
  max: 10,
  windowMs: 60 * 1000,
  message: 'Too many doubts posted. Please wait a minute.',
});

const voteLimiter = rateLimiter({
  max: 30,
  windowMs: 60 * 1000,
  message: 'Too many votes submitted. Please slow down.',
});

router.get('/', getDoubts);
router.get('/:id', getDoubtById);
router.post('/', authenticateUser, createLimiter, createDoubt);
router.post('/:id/claim', authenticateUser, claimDoubt);
router.post('/:id/answers', authenticateUser, addAnswer);
router.post('/:id/vote', authenticateUser, voteLimiter, voteDoubt);

export default router;
