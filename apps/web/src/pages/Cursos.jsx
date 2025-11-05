import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';
import Section from '../components/ui/Section.jsx';

const fetchCursos = async () => {
  const { data } = await apiClient.get('/cursos');
  return data;
};

const Cursos = () => {
  const { data, isLoading } = useQuery({ queryKey: ['cursos'], queryFn: fetchCursos });

  return (
    <Section
      id="cursos"
      title="Cursos accesibles"
      description="Explora nuestra oferta formativa con ajustes de accesibilidad integrados."
    >
      {isLoading ? (
        <p role="status">Cargando cursos…</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {data?.items?.length ? (
            data.items.map((curso) => (
              <article key={curso.id} className="card" aria-labelledby={`curso-${curso.id}`}>
                <header className="flex items-center justify-between">
                  <h3 id={`curso-${curso.id}`} className="text-xl font-semibold text-primary-strong">
                    {curso.titulo}
                  </h3>
                  <span className="badge">{curso.categoria}</span>
                </header>
                <p className="mt-3 text-muted">{curso.descripcion}</p>
                <Link to={`/cursos/${curso.id}`} className="btn-secondary mt-4 w-full justify-center">
                  Ver detalles
                </Link>
              </article>
            ))
          ) : (
            <p>No hay cursos disponibles en este momento.</p>
          )}
        </div>
      )}
    </Section>
  );
};

export default Cursos;
