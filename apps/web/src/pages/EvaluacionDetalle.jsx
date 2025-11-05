import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';
import Section from '../components/ui/Section.jsx';
import { useState } from 'react';

const fetchEvaluacion = async (id) => {
  const { data } = await apiClient.get(`/evaluaciones/${id}`);
  return data;
};

const EvaluacionDetalle = () => {
  const { evaluacionId } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['evaluacion', evaluacionId], queryFn: () => fetchEvaluacion(evaluacionId) });
  const [errors, setErrors] = useState({});

  const responder = useMutation({
    mutationFn: async (payload) => {
      const { data: response } = await apiClient.post(`/evaluaciones/${evaluacionId}/responder`, payload);
      return response;
    }
  });

  if (isLoading) {
    return (
      <Section id="evaluacion" title="Cargando evaluación…">
        <p role="status">Preparando preguntas accesibles…</p>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section id="evaluacion" title="Evaluación no encontrada">
        <p>Revisa el enlace o contacta a soporte.</p>
      </Section>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const respuestas = data.preguntas.map((pregunta) => ({
      preguntaId: pregunta.id,
      respuesta: formData.get(pregunta.id)
    }));

    const newErrors = {};
    respuestas.forEach((respuesta) => {
      if (!respuesta.respuesta || !String(respuesta.respuesta).trim()) {
        newErrors[respuesta.preguntaId] = 'Ingresa una respuesta válida';
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await responder.mutateAsync({ respuestas });
      event.currentTarget.reset();
    }
  };

  return (
    <Section id="evaluacion" title={data.titulo} description={data.descripcion}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {data.preguntas.map((pregunta, index) => (
          <fieldset key={pregunta.id} className="space-y-3 rounded-2xl bg-surface-alt p-4">
            <legend className="font-semibold text-primary-strong">
              Pregunta {index + 1}: {pregunta.titulo}
            </legend>
            {pregunta.opciones?.length ? (
              <div className="space-y-2">
                {pregunta.opciones.map((opcion) => (
                  <label key={opcion.valor} className="flex items-center gap-3 rounded-md bg-surface p-3 shadow-xs">
                    <input type="radio" name={pregunta.id} value={opcion.valor} />
                    <span>{opcion.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                name={pregunta.id}
                className="w-full rounded-md border border-border px-3 py-2"
                rows={4}
                aria-label={`Respuesta para ${pregunta.titulo}`}
              />
            )}
            {errors[pregunta.id] && <p className="text-sm text-danger">{errors[pregunta.id]}</p>}
          </fieldset>
        ))}
        <button type="submit" className="btn-primary" disabled={responder.isPending}>
          {responder.isPending ? 'Enviando…' : 'Enviar respuestas'}
        </button>
        {responder.data && (
          <div className="rounded-md bg-success/10 px-4 py-3 text-success" role="status">
            ¡Listo! Tu calificación: <strong>{responder.data.calificacion}</strong>
          </div>
        )}
      </form>
    </Section>
  );
};

export default EvaluacionDetalle;
