import { Router } from 'express';
import { summarizeNotes, registerAiWaitlist } from '../controllers/aiController.js';

const router = Router();

router.post('/summarize', summarizeNotes);
router.post('/waitlist', registerAiWaitlist);

export default router;
