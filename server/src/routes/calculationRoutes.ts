import { Router } from 'express';
import {
  getCalculations,
  replyToCalculation,
  startCalculation,
} from '../controllers/calculationController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getCalculations);
router.post('/start', requireAuth, startCalculation);
router.post('/:calculationId/respond', requireAuth, replyToCalculation);

export default router;
