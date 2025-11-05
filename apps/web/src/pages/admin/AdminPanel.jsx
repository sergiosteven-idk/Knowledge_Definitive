import { useQuery } from '@tanstack/react-query';
import apiClient from '../../utils/apiClient.js';
import Section from '../../components/ui/Section.jsx';

const fetchRoles = async () => {
  const { data } = await apiClient.get('/admin/roles-permisos');
  return data;
};

const AdminPanel = () => {
  const { data, isLoading } = useQuery({ queryKey: ['roles-permisos'], queryFn: fetchRoles });

  return (
    <Section
      id="admin"
      title="Panel de administración"
      description="Gestiona roles, permisos y asignaciones."
    >
      {isLoading ? (
        <p role="status">Cargando configuración…</p>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl bg-surface-alt p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-strong">Roles y permisos</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {data?.roles?.map((rol) => (
                <li key={rol.id} className="rounded-md bg-surface p-3 shadow-xs">
                  <p className="font-semibold">{rol.nombre}</p>
                  <p className="text-muted">{rol.descripcion}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-muted">
                    Permisos:{' '}
                    {rol.permisos.length
                      ? rol.permisos
                          .map((permiso) => `${permiso.recurso}:${permiso.accion}`)
                          .join(', ')
                      : 'Sin permisos asignados'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-surface-alt p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-strong">Asignaciones recientes</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {data?.asignaciones?.length ? (
                data.asignaciones.map((asignacion) => (
                  <li key={`${asignacion.miembro.idUsuario}-${asignacion.rol.idRol}`} className="rounded-md bg-surface p-3 shadow-xs">
                    <p>
                      <strong>{`${asignacion.miembro.nombre} ${asignacion.miembro.apellido}`}</strong> →{' '}
                      {asignacion.rol.nombreRol}
                    </p>
                    <p className="text-muted">{asignacion.miembro.correo}</p>
                  </li>
                ))
              ) : (
                <li>No hay asignaciones registradas.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </Section>
  );
};

export default AdminPanel;
