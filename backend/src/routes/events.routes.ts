import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/events.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/roles.middleware';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.LECTURER),
  createEvent
);
router.put(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.LECTURER),
  updateEvent
);
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.LECTURER),
  deleteEvent
);

export default router;

