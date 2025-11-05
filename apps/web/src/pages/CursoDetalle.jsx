import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';
import Section from '../components/ui/Section.jsx';

const fetchCurso = async (id) => {
  const { data } = await apiClient.get(`/cursos/${id}`);
  return data;
};

const CursoDetalle = () => {
  const { cursoId } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['curso', cursoId], queryFn: () => fetchCurso(cursoId) });

  if (isLoading) {
    return (
      <Section id="curso" title="Cargando curso…">
        <p role="status">Preparando información detallada…</p>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section id="curso" title="Curso no encontrado">
        <p>No pudimos encontrar la información solicitada.</p>
      </Section>
    );
  }

  return (
    <div className="space-y-12">
      <Section
        id="curso"
        title={data.titulo}
        description={data.descripcion}
      >
        <div className="flex flex-wrap gap-3 text-sm text-muted">
          <span className="badge">{data.categoria}</span>
          <span>Nivel: {data.nivel}</span>
          {data.fechaInicio && <span>Inicio: {new Date(data.fechaInicio).toLocaleDateString()}</span>}
          {data.fechaFin && <span>Fin: {new Date(data.fechaFin).toLocaleDateString()}</span>}
        </div>
      </Section>
      <Section id="modulos" title="Módulos del curso" variant="muted">
        <ol className="space-y-4" aria-label="Listado de módulos">
          {data.modulos?.map((modulo) => (
            <li key={modulo.id} className="card flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary-strong">{modulo.titulo}</h3>
                <span className="badge">Módulo {modulo.orden}</span>
              </div>
              <p className="text-muted">{modulo.descripcion}</p>
              <Link to={`modulos/${modulo.id}`} className="btn-secondary w-full justify-center md:w-auto">
                Ver módulo
              </Link>
            </li>
          ))}
        </ol>
      </Section>
      <Section id="evaluaciones" title="Evaluaciones" variant="transparent">
        <div className="grid gap-4 md:grid-cols-2">
          {data.evaluaciones?.map((evaluacion) => (
            <article key={evaluacion.id} className="card">
              <h3 className="text-lg font-semibold text-primary-strong">{evaluacion.titulo}</h3>
              <p className="text-muted">{evaluacion.descripcion}</p>
              <p className="text-xs text-muted">Módulo: {evaluacion.moduloTitulo}</p>
              <Link to={`/evaluaciones/${evaluacion.id}`} className="btn-primary mt-4 w-full justify-center">
                Resolver evaluación
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default CursoDetalle;
