import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, dashboardController.getStats);
router.get('/user-profile', authenticate, dashboardController.getUserProfile);
router.get('/skill-gap', authenticate, dashboardController.getSkillGap);

export default router;
