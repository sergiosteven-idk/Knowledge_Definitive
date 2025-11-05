import { Router } from 'express';
import { assignPermiso, assignRol, createRol, listRolesPermisos } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get('/roles-permisos', requireAuth, requireRole('usuario', 'read'), listRolesPermisos);
router.post('/roles', requireAuth, requireRole('usuario', 'read'), createRol);
router.post('/roles/:rolId/permisos', requireAuth, requireRole('usuario', 'read'), assignPermiso);
router.post('/roles/asignar', requireAuth, requireRole('usuario', 'read'), assignRol);

export default router;
