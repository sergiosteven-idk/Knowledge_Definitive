import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/requireAuth.js';
import { progresoService } from '../services/progreso.service.js';

export const getMine = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token requerido' } });
  }
  const progresos = await progresoService.mine(req.user.id);
  res.json(progresos);
};

export const updateProgreso = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token requerido' } });
  }
  const progreso = await progresoService.update(Number(req.params.id), req.user.id, req.body);
  res.json(progreso);
};
