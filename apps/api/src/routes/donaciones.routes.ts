import { Router } from 'express';
import { createDonacion, getMisDonaciones } from '../controllers/donaciones.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.post('/', requireAuth, createDonacion);
router.get('/mine', requireAuth, getMisDonaciones);

export default router;
