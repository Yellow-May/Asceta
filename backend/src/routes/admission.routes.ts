import { Router } from 'express';
import { applyForAdmission } from '../controllers/admission.controller';

const router = Router();

router.post('/apply', applyForAdmission);

export default router;
