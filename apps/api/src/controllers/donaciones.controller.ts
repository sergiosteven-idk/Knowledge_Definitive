import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/requireAuth.js';
import { donacionService } from '../services/donacion.service.js';
import { donacionSchema } from '../schemas/donacion.schema.js';

export const createDonacion = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token requerido' } });
  }
  const parsed = donacionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos' } });
  }
  const donacion = await donacionService.create(req.user.id, parsed.data.monto, parsed.data.metodoPago);
  res.status(201).json(donacion);
};

export const getMisDonaciones = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token requerido' } });
  }
  const donaciones = await donacionService.mine(req.user.id);
  res.json(donaciones);
};
