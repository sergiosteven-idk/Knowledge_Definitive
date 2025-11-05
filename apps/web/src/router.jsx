import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/ui/Layout.jsx';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import { lazy } from 'react';

const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Contacto = lazy(() => import('./pages/Contacto.jsx'));
const Discapacidad = lazy(() => import('./pages/Discapacidad.jsx'));
const Informacion = lazy(() => import('./pages/Informacion.jsx'));
const TyC = lazy(() => import('./pages/TyC.jsx'));
const Cursos = lazy(() => import('./pages/Cursos.jsx'));
const CursoDetalle = lazy(() => import('./pages/CursoDetalle.jsx'));
const ModuloDetalle = lazy(() => import('./pages/ModuloDetalle.jsx'));
const EvaluacionDetalle = lazy(() => import('./pages/EvaluacionDetalle.jsx'));
const Resultados = lazy(() => import('./pages/Resultados.jsx'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'contacto', element: <Contacto /> },
      { path: 'discapacidad', element: <Discapacidad /> },
      { path: 'informacion', element: <Informacion /> },
      { path: 'tyc', element: <TyC /> },
      { path: 'cursos', element: <Cursos /> },
      { path: 'cursos/:cursoId', element: <CursoDetalle /> },
      { path: 'cursos/:cursoId/modulos/:moduloId', element: <ModuloDetalle /> },
      { path: 'evaluaciones/:evaluacionId', element: <EvaluacionDetalle /> },
      {
        path: 'resultados/mis',
        element: (
          <ProtectedRoute roles={['estudiante', 'docente', 'admin']}>
            <Resultados />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

export default router;
