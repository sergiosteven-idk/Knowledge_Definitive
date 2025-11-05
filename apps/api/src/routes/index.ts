import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './users.routes.js';
import cursosRoutes from './cursos.routes.js';
import progresoRoutes from './progreso.routes.js';
import evaluacionesRoutes from './evaluaciones.routes.js';
import donacionesRoutes from './donaciones.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cursos', cursosRoutes);
router.use('/progreso', progresoRoutes);
router.use('/evaluaciones', evaluacionesRoutes);
router.use('/donaciones', donacionesRoutes);
router.use('/admin', adminRoutes);

export default router;
