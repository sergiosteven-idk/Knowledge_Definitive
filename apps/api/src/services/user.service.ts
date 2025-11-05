import { prisma } from '../utils/prisma.js';

export const userService = {
  async getMe(id: number) {
    return prisma.miembro.findUnique({
      where: { idUsuario: id },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        tipoUsuario: true,
        roles: { select: { rol: { select: { nombreRol: true } } } }
      }
    });
  },
  async getById(id: number) {
    return prisma.miembro.findUnique({
      where: { idUsuario: id },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        tipoUsuario: true,
        roles: { select: { rol: { select: { nombreRol: true } } } }
      }
    });
  }
};
