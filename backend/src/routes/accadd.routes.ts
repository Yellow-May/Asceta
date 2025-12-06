import { Router } from 'express';
import {
  register,
  getAuthStatus,
} from '../controllers/accadd/auth.controller';
import {
  initiatePayment,
  getPaymentStatus,
} from '../controllers/accadd/payment.controller';

const router = Router();

// Auth routes
router.post('/auth/register', register);
router.get('/auth/status/:email', getAuthStatus);

// Payment routes
router.post('/payment/initiate', initiatePayment);
router.get('/payment/status/:email', getPaymentStatus);

export default router;

