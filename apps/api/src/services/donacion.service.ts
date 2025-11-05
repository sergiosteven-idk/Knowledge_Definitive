import { MetodoPago } from '@prisma/client';
import { prisma } from '../utils/prisma.js';

export const donacionService = {
  async create(usuarioId: number, monto: number, metodoPago: string) {
    return prisma.donaciones.create({
      data: {
        idUsuario: usuarioId,
        monto,
        metodoPago: metodoPago as MetodoPago
      }
    });
  },
  async mine(usuarioId: number) {
    return prisma.donaciones.findMany({
      where: { idUsuario: usuarioId },
      orderBy: { fechaDonacion: 'desc' }
    });
  }
};
