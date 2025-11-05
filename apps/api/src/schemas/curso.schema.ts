import { z } from 'zod';

export const cursoSchema = z
  .object({
    nombre: z.string().min(3),
    descripcion: z.string().min(10).optional(),
    categoria: z.string().min(3).optional(),
    nivel: z.enum(['básico', 'intermedio', 'avanzado']),
    fechaInicio: z.coerce.date().optional(),
    fechaFin: z.coerce.date().optional()
  })
  .refine(
    (data) => {
      if (data.fechaInicio && data.fechaFin) {
        return data.fechaFin >= data.fechaInicio;
      }
      return true;
    },
    { message: 'La fecha de finalización debe ser posterior a la de inicio', path: ['fechaFin'] }
  );

export const moduloSchema = z.object({
  nombreModulo: z.string().min(3),
  descripcion: z.string().min(5).optional()
});

const preguntaSchema = z
  .object({
    texto: z.string().min(3),
    tipo: z.enum(['opcion_multiple', 'verdadero_falso', 'respuesta_abierta']).default('opcion_multiple'),
    opciones: z
      .array(z.object({ valor: z.string().min(1), label: z.string().min(1) }))
      .optional(),
    respuestaCorrecta: z.string().min(1).optional()
  })
  .refine(
    (value) => {
      if (value.tipo === 'opcion_multiple') {
        return Array.isArray(value.opciones) && value.opciones.length >= 2 && !!value.respuestaCorrecta;
      }
      if (value.tipo === 'verdadero_falso') {
        return value.respuestaCorrecta === 'verdadero' || value.respuestaCorrecta === 'falso';
      }
      return true;
    },
    {
      message: 'Configura correctamente las opciones y la respuesta de la pregunta',
      path: ['opciones']
    }
  );

export const evaluacionSchema = z.object({
  moduloId: z.number().int().positive(),
  nombre: z.string().min(3),
  descripcion: z.string().min(5).optional(),
  tipo: z.enum(['quiz', 'examen', 'práctica']).default('quiz'),
  preguntas: z.array(preguntaSchema).min(1)
});

export const respuestaEvaluacionSchema = z.object({
  respuestas: z
    .array(
      z.object({
        preguntaId: z.number().int(),
        respuesta: z.string().min(1)
      })
    )
    .min(1)
});
