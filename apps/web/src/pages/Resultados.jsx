import { useQuery } from '@tanstack/react-query';
import apiClient from '../utils/apiClient.js';
import Section from '../components/ui/Section.jsx';

const fetchResultados = async () => {
  const { data } = await apiClient.get('/progreso/mine');
  return data;
};

const Resultados = () => {
  const { data, isLoading } = useQuery({ queryKey: ['resultados'], queryFn: fetchResultados });

  return (
    <Section
      id="resultados"
      title="Mis resultados"
      description="Consulta el progreso y desempeño en evaluaciones."
    >
      {isLoading ? (
        <p role="status">Cargando resultados…</p>
      ) : (
        <div className="space-y-4">
          {data?.length ? (
            data.map((registro) => (
              <article key={registro.idProgreso ?? registro.id} className="card">
                <h3 className="text-lg font-semibold text-primary-strong">
                  {registro.modulo?.curso?.nombre ?? 'Curso sin título'}
                </h3>
                <p className="text-sm text-muted">Módulo: {registro.modulo?.nombreModulo}</p>
                <p className="text-sm text-muted">Estado: {registro.estado?.replace(/_/g, ' ')}</p>
                <p className="text-sm text-muted">
                  Última actualización: {new Date(registro.ultimaModificacion).toLocaleString()}
                </p>
              </article>
            ))
          ) : (
            <p>No registramos resultados aún. Completa una evaluación para ver tus métricas.</p>
          )}
        </div>
      )}
    </Section>
  );
};

export default Resultados;
