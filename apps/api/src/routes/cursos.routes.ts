import { Router } from 'express';
import {
  addModulo,
  createCurso,
  deleteCurso,
  deleteModulo,
  getCurso,
  getModuloDetalle,
  listCursos,
  updateCurso,
  updateModulo
} from '../controllers/cursos.controller.js';
import { createEvaluacion } from '../controllers/evaluaciones.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get('/', listCursos);
router.post('/', requireAuth, requireRole('curso', 'create'), createCurso);
router.get('/:id', getCurso);
router.put('/:id', requireAuth, requireRole('curso', 'update'), updateCurso);
router.delete('/:id', requireAuth, requireRole('curso', 'delete'), deleteCurso);

router.post('/:id/modulos', requireAuth, requireRole('curso', 'update'), addModulo);
router.get('/:id/modulos/:moduloId', getModuloDetalle);
router.put('/:id/modulos/:moduloId', requireAuth, requireRole('curso', 'update'), updateModulo);
router.delete('/:id/modulos/:moduloId', requireAuth, requireRole('curso', 'delete'), deleteModulo);

router.post('/:id/evaluaciones', requireAuth, requireRole('evaluacion', 'manage'), createEvaluacion);

export default router;
