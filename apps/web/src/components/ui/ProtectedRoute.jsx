import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useAuth.js';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return <div className="p-8 text-center" role="status">Verificando permisos…</div>;
  }

  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.some((role) => profile.roles?.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;
