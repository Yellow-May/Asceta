import { Router } from 'express';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/news.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/roles.middleware';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.LECTURER),
  createNews
);
router.put(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.LECTURER),
  updateNews
);
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.LECTURER),
  deleteNews
);

export default router;



