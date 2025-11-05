import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';
import Section from '../components/ui/Section.jsx';

const fetchModulo = async (cursoId, moduloId) => {
  const { data } = await apiClient.get(`/cursos/${cursoId}/modulos/${moduloId}`);
  return data;
};

const ModuloDetalle = () => {
  const { cursoId, moduloId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['modulo', moduloId],
    queryFn: () => fetchModulo(cursoId, moduloId)
  });

  if (isLoading) {
    return (
      <Section id="modulo" title="Cargando módulo…">
        <p role="status">Preparando contenidos accesibles…</p>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section id="modulo" title="Módulo no encontrado">
        <p>Verifica la URL o regresa al curso.</p>
      </Section>
    );
  }

  return (
    <Section id="modulo" title={data.titulo} description={data.descripcion}>
      <article className="space-y-2 text-muted">
        <p>Curso asociado: {data.curso ?? 'General'}</p>
        <p>
          Este módulo forma parte del curso y se actualiza continuamente. Revisa las evaluaciones correspondientes en la sección
          del curso para medir tu progreso.
        </p>
      </article>
    </Section>
  );
};

export default ModuloDetalle;
