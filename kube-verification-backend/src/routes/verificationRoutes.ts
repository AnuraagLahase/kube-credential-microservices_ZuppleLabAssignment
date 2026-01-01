import express from 'express';
import * as verificationController from '../controllers/verificationController';
import { validateBody } from '../middleware/validate';
import { verificationSchema } from '../validation/verificationValidation';

const router = express.Router();

router.post('/check', verificationController.checkCredential);

export default router;
