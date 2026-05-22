import { Router } from 'express';
import * as jobController from '../controllers/jobController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', jobController.getAllJobs);
router.get('/search', jobController.searchJobs);
router.post('/:jobId/save', authenticate, jobController.saveJob);

export default router;
