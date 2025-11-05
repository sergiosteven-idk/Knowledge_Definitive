import { prisma } from '../utils/prisma.js';

export const adminService = {
  async listRoles() {
    const [roles, asignaciones] = await Promise.all([
      prisma.rol.findMany({
        include: {
          permisos: {
            include: {
              permiso: true
            }
          }
        }
      }),
      prisma.usuarioRol.findMany({
        include: {
          miembro: { select: { idUsuario: true, nombre: true, apellido: true, correo: true } },
          rol: { select: { idRol: true, nombreRol: true } }
        },
        take: 20
      })
    ]);
    return {
      roles: roles.map((rol) => ({
        id: rol.idRol,
        nombre: rol.nombreRol,
        descripcion: rol.descripcion,
        permisos: rol.permisos.map((p) => p.permiso)
      })),
      asignaciones
    };
  },
  async createRol(nombre: string, descripcion?: string) {
    return prisma.rol.create({ data: { nombreRol: nombre, descripcion } });
  },
  async assignPermiso(rolId: number, permisoId: number) {
    return prisma.rolPermiso.create({ data: { idRol: rolId, idPermiso: permisoId } });
  },
  async assignRol(usuarioId: number, rolId: number) {
    return prisma.usuarioRol.create({ data: { idUsuario: usuarioId, idRol: rolId } });
  }
};
