import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, authController.checkSession);
router.post('/login', authController.login);
router.post('/register', authController.register);

export default router;
