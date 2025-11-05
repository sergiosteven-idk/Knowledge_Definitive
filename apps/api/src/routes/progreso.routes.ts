import { Router } from 'express';
import { getMine, updateProgreso } from '../controllers/progreso.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/mine', requireAuth, getMine);
router.patch('/:id', requireAuth, updateProgreso);

export default router;
