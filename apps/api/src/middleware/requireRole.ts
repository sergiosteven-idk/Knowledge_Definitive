import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './requireAuth.js';
import { prisma } from '../utils/prisma.js';

export const requireRole = (recurso: string, accion: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token requerido' } });
    }

    const rolesUsuario = await prisma.usuarioRol.findMany({
      where: { idUsuario: req.user.id },
      include: {
        rol: {
          include: {
            permisos: {
              include: {
                permiso: true
              }
            }
          }
        }
      }
    });

    const autorizado = rolesUsuario.some((usuarioRol) =>
      usuarioRol.rol.permisos.some(
        (permiso) => permiso.permiso.recurso === recurso && permiso.permiso.accion === accion
      )
    );

    if (!autorizado) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'No tienes permisos para esta acción' } });
    }

    next();
  };
};
