import express from 'express';
import * as credentialController from '../controllers/credentialController';
import { credentialSchema } from '../validation/credentialValidation';
import { validateBody } from '../middleware/validate';

const router = express.Router();

router.post('/issue',validateBody(credentialSchema), credentialController.issueCredential);
router.get('/', credentialController.getAllCredentials);
router.get('/:id', credentialController.getCredential);
router.post('/lookup', credentialController.lookupCredential);

export default router;
