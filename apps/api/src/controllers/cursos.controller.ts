import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/requireAuth.js';
import { cursoService } from '../services/curso.service.js';
import { cursoSchema, moduloSchema } from '../schemas/curso.schema.js';

const mapNivel = (nivel: string) => (nivel === 'basico' ? 'básico' : nivel);
const mapTipoEvaluacion = (tipo: string) => (tipo === 'practica' ? 'práctica' : tipo);

export const listCursos = async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 10);
  const data = await cursoService.list(page, pageSize);
  res.json({
    ...data,
    items: data.items.map((curso) => ({
      id: curso.idCurso,
      titulo: curso.nombre,
      descripcion: curso.descripcion,
      categoria: curso.categoria,
      nivel: mapNivel(curso.nivel),
      fechaInicio: curso.fechaInicio,
      fechaFin: curso.fechaFin
    }))
  });
};

export const createCurso = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token requerido' } });
  const parsed = cursoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details: parsed.error.flatten() } });
  }
  const curso = await cursoService.create(parsed.data);
  res.status(201).json({
    id: curso.idCurso,
    titulo: curso.nombre,
    descripcion: curso.descripcion,
    categoria: curso.categoria,
    nivel: mapNivel(curso.nivel),
    fechaInicio: curso.fechaInicio,
    fechaFin: curso.fechaFin
  });
};

export const getCurso = async (req: Request, res: Response) => {
  const curso = await cursoService.getById(Number(req.params.id));
  if (!curso) {
    return res.status(404).json({ error: { code: 'CURSO_NOT_FOUND', message: 'Curso no encontrado' } });
  }
  res.json({
    id: curso.idCurso,
    titulo: curso.nombre,
    descripcion: curso.descripcion,
    categoria: curso.categoria,
    nivel: mapNivel(curso.nivel),
    fechaInicio: curso.fechaInicio,
    fechaFin: curso.fechaFin,
    modulos: curso.modulos.map((modulo, index) => ({
      id: modulo.idModulo,
      titulo: modulo.nombreModulo,
      descripcion: modulo.descripcion,
      orden: index + 1,
      evaluaciones: modulo.evaluaciones.map((evaluacion) => ({
        id: evaluacion.idEvaluacion,
        titulo: evaluacion.nombre,
        descripcion: evaluacion.descripcion,
        tipo: mapTipoEvaluacion(evaluacion.tipo)
      }))
    })),
    evaluaciones: curso.modulos.flatMap((modulo) =>
      modulo.evaluaciones.map((evaluacion) => ({
        id: evaluacion.idEvaluacion,
        titulo: evaluacion.nombre,
        descripcion: evaluacion.descripcion,
        tipo: mapTipoEvaluacion(evaluacion.tipo),
        moduloId: modulo.idModulo,
        moduloTitulo: modulo.nombreModulo
      }))
    )
  });
};

export const updateCurso = async (req: Request, res: Response) => {
  const curso = await cursoService.update(Number(req.params.id), req.body);
  res.json({
    id: curso.idCurso,
    titulo: curso.nombre,
    descripcion: curso.descripcion,
    categoria: curso.categoria,
    nivel: mapNivel(curso.nivel),
    fechaInicio: curso.fechaInicio,
    fechaFin: curso.fechaFin
  });
};

export const deleteCurso = async (req: Request, res: Response) => {
  await cursoService.remove(Number(req.params.id));
  res.status(204).send();
};

export const addModulo = async (req: Request, res: Response) => {
  const parsed = moduloSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos' } });
  }
  const modulo = await cursoService.addModulo(Number(req.params.id), parsed.data);
  res.status(201).json({
    id: modulo.idModulo,
    titulo: modulo.nombreModulo,
    descripcion: modulo.descripcion
  });
};

export const updateModulo = async (req: Request, res: Response) => {
  const modulo = await cursoService.updateModulo(Number(req.params.moduloId), req.body);
  res.json({
    id: modulo.idModulo,
    titulo: modulo.nombreModulo,
    descripcion: modulo.descripcion
  });
};

export const deleteModulo = async (req: Request, res: Response) => {
  await cursoService.deleteModulo(Number(req.params.moduloId));
  res.status(204).send();
};

export const getModuloDetalle = async (req: Request, res: Response) => {
  const modulo = await cursoService.getModulo(Number(req.params.id), Number(req.params.moduloId));
  if (!modulo) {
    return res.status(404).json({ error: { code: 'MODULO_NOT_FOUND', message: 'Módulo no encontrado' } });
  }
  res.json({
    id: modulo.idModulo,
    titulo: modulo.nombreModulo,
    descripcion: modulo.descripcion,
    curso: modulo.curso?.nombre ?? null
  });
};
