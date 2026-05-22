import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, applicationController.getApplications);

export default router;
