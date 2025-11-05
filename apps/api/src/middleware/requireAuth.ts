import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../utils/prisma.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    roles: string[];
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token requerido' } });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: number; email: string; exp: number };

    const miembro = await prisma.miembro.findUnique({
      where: { idUsuario: payload.userId },
      include: {
        roles: {
          include: {
            rol: {
              include: {
                permisos: { include: { permiso: true } }
              }
            }
          }
        }
      }
    });

    if (!miembro) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuario no encontrado' } });
    }

    req.user = {
      id: miembro.idUsuario,
      email: miembro.correo,
      roles: miembro.roles.map((rol) => rol.rol.nombreRol)
    };

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp - now < 60) {
      const newToken = jwt.sign({ userId: miembro.idUsuario, email: miembro.correo }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES
      });
      res.setHeader('X-Refresh-Token', newToken);
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token inválido' } });
  }
};
