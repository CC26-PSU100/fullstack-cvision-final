import { Router } from 'express';
import authRoutes from './authRoutes';
import cvRoutes from './cvRoutes';
import jobRoutes from './jobRoutes';
import dashboardRoutes from './dashboardRoutes';
import applicationRoutes from './applicationRoutes';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/cv', cvRoutes);
router.use('/jobs', jobRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/applications', applicationRoutes);

export default router;
