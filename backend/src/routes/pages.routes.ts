import { Router } from 'express';
import {
  getAllPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} from '../controllers/pages.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/roles.middleware';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/', getAllPages);
router.get('/:slug', getPageBySlug);
router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.LECTURER),
  createPage
);
router.put(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.LECTURER),
  updatePage
);
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN),
  deletePage
);

export default router;

