import { TipoEvaluacion, TipoPregunta } from '@prisma/client';
import { prisma } from '../utils/prisma.js';

interface CrearEvaluacionPayload {
  moduloId: number;
  nombre: string;
  descripcion?: string;
  tipo: string;
  preguntas: { texto: string; tipo: string; opciones?: unknown; respuestaCorrecta?: string }[];
}

export const evaluacionService = {
  async list() {
    return prisma.evaluacion.findMany({
      include: {
        modulo: {
          select: {
            idModulo: true,
            nombreModulo: true,
            curso: { select: { idCurso: true, nombre: true } }
          }
        }
      }
    });
  },
  async create(data: CrearEvaluacionPayload) {
    const tipo = data.tipo === 'práctica' ? 'practica' : data.tipo;
    return prisma.evaluacion.create({
      data: {
        idModulo: data.moduloId,
        nombre: data.nombre,
        descripcion: data.descripcion,
        tipo: tipo as TipoEvaluacion,
        preguntas: {
          create: data.preguntas.map((pregunta) => ({
            texto: pregunta.texto,
            tipo: ((pregunta.tipo === 'opcion_multiple'
              ? 'opcion_multiple'
              : pregunta.tipo === 'verdadero_falso'
              ? 'verdadero_falso'
              : 'respuesta_abierta') as TipoPregunta),
            opciones: pregunta.opciones ?? null,
            respuestaCorrecta: pregunta.respuestaCorrecta ?? null
          }))
        }
      }
    });
  },
  async getById(id: number) {
    return prisma.evaluacion.findUnique({
      where: { idEvaluacion: id },
      include: { preguntas: true, modulo: { select: { nombreModulo: true } } }
    });
  },
  async update(id: number, data: Partial<{ nombre: string; descripcion: string; tipo: string }>) {
    const { tipo, ...rest } = data;
    return prisma.evaluacion.update({
      where: { idEvaluacion: id },
      data: tipo ? { ...rest, tipo: (tipo === 'práctica' ? 'practica' : tipo) as TipoEvaluacion } : rest
    });
  },
  async remove(id: number) {
    return prisma.evaluacion.delete({ where: { idEvaluacion: id } });
  },
  async responder(evaluacionId: number, usuarioId: number, respuestas: { preguntaId: number; respuesta: string }[]) {
    const evaluacion = await prisma.evaluacion.findUnique({
      where: { idEvaluacion: evaluacionId },
      include: { preguntas: true }
    });

    if (!evaluacion) {
      throw Object.assign(new Error('Evaluación no encontrada'), { status: 404, code: 'EVALUACION_NOT_FOUND' });
    }

    let correctas = 0;
    evaluacion.preguntas.forEach((pregunta) => {
      const respuestaUsuario = respuestas.find((r) => r.preguntaId === pregunta.idPregunta);
      if (pregunta.respuestaCorrecta && respuestaUsuario?.respuesta === pregunta.respuestaCorrecta) {
        correctas += 1;
      }
    });

    const calificacion = evaluacion.preguntas.length
      ? Number(((correctas / evaluacion.preguntas.length) * 100).toFixed(2))
      : 0;

    return prisma.resultado.create({
      data: {
        idEvaluacion: evaluacionId,
        idUsuario: usuarioId,
        calificacion
      }
    });
  }
};
