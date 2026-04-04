import express from 'express';
import {
  createSession,
  submitAnswer,
  completeSession,
  getSessions,
  getSession,
  getAnalytics,
} from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All session routes require auth

router.get('/analytics', getAnalytics);
router.route('/').get(getSessions).post(createSession);
router.route('/:id').get(getSession);
router.post('/:id/answers', submitAnswer);
router.put('/:id/complete', completeSession);

export default router;
