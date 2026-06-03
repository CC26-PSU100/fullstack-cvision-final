import { Router } from 'express';
import * as cvController from '../controllers/cvController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.VERCEL ? path.join(os.tmpdir(), "uploads") : 'uploads/';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const hashing = crypto.randomBytes(4).toString('hex');
    cb(null, `cv-${originalName}-${hashing}.pdf`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF yang diizinkan'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', authenticate, cvController.getUserCv);
router.get('/guest-cvs', authenticate, cvController.getGuestCvs);
router.get('/:cvId/detailed-analysis', authenticate, cvController.getCvDetailedAnalysis);
router.put('/', authenticate, cvController.updateCv);
router.post('/experience', authenticate, cvController.addExperience);
router.put('/skills', authenticate, cvController.updateSkills);
router.post('/upload', optionalAuthenticate, upload.single('cv'), cvController.uploadCv);
router.post('/upload-and-analyse', optionalAuthenticate, (req: any, res: any, next: any) => { req.requestStartTime = Date.now(); next(); }, upload.single('cv'), cvController.uploadAndAnalyse);
router.post('/analyse', optionalAuthenticate, cvController.analyseCv);
router.post('/process/:cvId', optionalAuthenticate, cvController.processCv);
router.post('/:cvId/link', authenticate, cvController.linkCvToUser);
router.delete('/all', authenticate, cvController.deleteAllCvs);
router.delete('/:cvId', authenticate, cvController.deleteCv);
router.get('/guest-limit', cvController.checkGuestLimit);

export default router;
