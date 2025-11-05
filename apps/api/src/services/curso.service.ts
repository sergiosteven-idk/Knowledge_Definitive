import { NivelCurso } from '@prisma/client';
import { prisma } from '../utils/prisma.js';

export const cursoService = {
  async list(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      prisma.curso.findMany({
        skip,
        take: pageSize,
        orderBy: { fechaInicio: 'desc' }
      }),
      prisma.curso.count()
    ]);
    return { items, total, page, pageSize };
  },
  async create(data: {
    nombre: string;
    descripcion?: string;
    categoria?: string;
    nivel: string;
    fechaInicio?: Date | string;
    fechaFin?: Date | string;
  }) {
    const { nivel, ...rest } = data;
    const nivelDB = (nivel === 'básico' ? 'basico' : nivel) as NivelCurso;
    return prisma.curso.create({ data: { ...rest, nivel: nivelDB } });
  },
  async getById(id: number) {
    return prisma.curso.findUnique({
      where: { idCurso: id },
      include: {
        modulos: {
          orderBy: { idModulo: 'asc' },
          include: {
            evaluaciones: {
              select: { idEvaluacion: true, nombre: true, descripcion: true, tipo: true }
            }
          }
        }
      }
    });
  },
  async getModulo(cursoId: number, moduloId: number) {
    return prisma.modulo.findFirst({
      where: { idCurso: cursoId, idModulo: moduloId },
      include: { curso: { select: { nombre: true } } }
    });
  },
  async update(
    id: number,
    data: Partial<{ nombre: string; descripcion: string; categoria: string; nivel: string; fechaInicio: Date | string; fechaFin: Date | string }>
  ) {
    const { nivel, ...rest } = data;
    return prisma.curso.update({
      where: { idCurso: id },
      data: nivel
        ? { ...rest, nivel: (nivel === 'básico' ? 'basico' : nivel) as NivelCurso }
        : rest
    });
  },
  async remove(id: number) {
    return prisma.curso.delete({ where: { idCurso: id } });
  },
  async addModulo(cursoId: number, data: { nombreModulo: string; descripcion?: string }) {
    return prisma.modulo.create({ data: { ...data, idCurso: cursoId } });
  },
  async updateModulo(moduloId: number, data: Partial<{ nombreModulo: string; descripcion: string }>) {
    return prisma.modulo.update({ where: { idModulo: moduloId }, data });
  },
  async deleteModulo(moduloId: number) {
    return prisma.modulo.delete({ where: { idModulo: moduloId } });
  }
};
