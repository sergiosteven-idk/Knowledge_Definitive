import { EstadoProgreso } from '@prisma/client';
import { prisma } from '../utils/prisma.js';

export const progresoService = {
  async mine(usuarioId: number) {
    return prisma.progreso.findMany({
      where: { idUsuario: usuarioId },
      include: {
        modulo: {
          select: {
            idModulo: true,
            nombreModulo: true,
            curso: { select: { idCurso: true, nombre: true } }
          }
        }
      },
      orderBy: { ultimaModificacion: 'desc' }
    });
  },
  async update(id: number, usuarioId: number, data: { estado?: string }) {
    const progreso = await prisma.progreso.findUnique({ where: { idProgreso: id } });
    if (!progreso) {
      throw Object.assign(new Error('Progreso no encontrado'), { status: 404, code: 'PROGRESO_NOT_FOUND' });
    }
    if (progreso.idUsuario !== usuarioId) {
      throw Object.assign(new Error('No autorizado'), { status: 403, code: 'FORBIDDEN' });
    }
    return prisma.progreso.update({
      where: { idProgreso: id },
      data: {
        estado: (data.estado as EstadoProgreso | undefined) ?? progreso.estado,
        ultimaModificacion: new Date()
      }
    });
  }
};
