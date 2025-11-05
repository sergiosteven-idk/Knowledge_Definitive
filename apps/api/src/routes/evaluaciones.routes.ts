import { Router } from 'express';
import {
  deleteEvaluacion,
  getEvaluacion,
  listEvaluaciones,
  responderEvaluacion,
  updateEvaluacion
} from '../controllers/evaluaciones.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get('/', listEvaluaciones);
router.get('/:id', getEvaluacion);
router.put('/:id', requireAuth, requireRole('evaluacion', 'manage'), updateEvaluacion);
router.delete('/:id', requireAuth, requireRole('evaluacion', 'manage'), deleteEvaluacion);
router.post('/:id/responder', requireAuth, responderEvaluacion);

export default router;
