import { Router } from 'express';
import { getById, getMe } from '../controllers/users.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get('/me', requireAuth, getMe);
router.get('/:id', requireAuth, requireRole('usuario', 'read'), getById);

export default router;
