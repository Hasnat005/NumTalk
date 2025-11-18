import { Router } from 'express';
import authRoutes from './authRoutes';
import calculationRoutes from './calculationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/calculations', calculationRoutes);

export default router;
