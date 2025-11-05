import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/requireAuth.js';
import { userService } from '../services/user.service.js';

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token requerido' } });
  }
  const usuario = await userService.getMe(req.user.id);
  if (!usuario) {
    return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' } });
  }
  res.json({
    id: usuario.idUsuario,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.correo,
    tipoUsuario: usuario.tipoUsuario,
    roles: usuario.roles.map((r) => r.rol.nombreRol)
  });
};

export const getById = async (req: AuthenticatedRequest, res: Response) => {
  const usuario = await userService.getById(Number(req.params.id));
  if (!usuario) {
    return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' } });
  }
  res.json({
    id: usuario.idUsuario,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.correo,
    tipoUsuario: usuario.tipoUsuario,
    roles: usuario.roles.map((r) => r.rol.nombreRol)
  });
};
