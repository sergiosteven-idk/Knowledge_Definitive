import { Request, Response } from 'express';
import { evaluacionSchema, respuestaEvaluacionSchema } from '../schemas/curso.schema.js';
import { evaluacionService } from '../services/evaluacion.service.js';
import { AuthenticatedRequest } from '../middleware/requireAuth.js';

const mapTipoEvaluacion = (tipo: string) => (tipo === 'practica' ? 'práctica' : tipo);

export const listEvaluaciones = async (_req: Request, res: Response) => {
  const evaluaciones = await evaluacionService.list();
  res.json(
    evaluaciones.map((evaluacion) => ({
      id: evaluacion.idEvaluacion,
      titulo: evaluacion.nombre,
      descripcion: evaluacion.descripcion,
      tipo: mapTipoEvaluacion(evaluacion.tipo),
      modulo: {
        id: evaluacion.modulo.idModulo,
        nombre: evaluacion.modulo.nombreModulo,
        curso: evaluacion.modulo.curso
      }
    }))
  );
};

export const createEvaluacion = async (req: Request, res: Response) => {
  const parsed = evaluacionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos' } });
  }
  const evaluacion = await evaluacionService.create(parsed.data);
  res.status(201).json({
    id: evaluacion.idEvaluacion,
    titulo: evaluacion.nombre,
    descripcion: evaluacion.descripcion,
    tipo: mapTipoEvaluacion(evaluacion.tipo)
  });
};

export const getEvaluacion = async (req: Request, res: Response) => {
  const evaluacion = await evaluacionService.getById(Number(req.params.id));
  if (!evaluacion) {
    return res.status(404).json({ error: { code: 'EVALUACION_NOT_FOUND', message: 'Evaluación no encontrada' } });
  }
  res.json({
    id: evaluacion.idEvaluacion,
    titulo: evaluacion.nombre,
    descripcion: evaluacion.descripcion,
    tipo: mapTipoEvaluacion(evaluacion.tipo),
    modulo: evaluacion.modulo,
    preguntas: evaluacion.preguntas.map((pregunta) => ({
      id: pregunta.idPregunta,
      titulo: pregunta.texto,
      tipo: pregunta.tipo,
      opciones: pregunta.opciones ?? [],
      respuestaCorrecta: pregunta.respuestaCorrecta
    }))
  });
};

export const updateEvaluacion = async (req: Request, res: Response) => {
  const evaluacion = await evaluacionService.update(Number(req.params.id), req.body);
  res.json({
    id: evaluacion.idEvaluacion,
    titulo: evaluacion.nombre,
    descripcion: evaluacion.descripcion,
    tipo: mapTipoEvaluacion(evaluacion.tipo)
  });
};

export const deleteEvaluacion = async (req: Request, res: Response) => {
  await evaluacionService.remove(Number(req.params.id));
  res.status(204).send();
};

export const responderEvaluacion = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token requerido' } });
  }
  const parsed = respuestaEvaluacionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos' } });
  }
  const resultado = await evaluacionService.responder(Number(req.params.id), req.user.id, parsed.data.respuestas);
  res.status(201).json({
    id: resultado.idResultado,
    evaluacionId: resultado.idEvaluacion,
    usuarioId: resultado.idUsuario,
    calificacion: Number(resultado.calificacion),
    fechaRealizacion: resultado.fechaRealizacion
  });
};
