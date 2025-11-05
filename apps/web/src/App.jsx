import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router.jsx';
import { SkipLink } from './components/ui/SkipLink.jsx';
import './assets/css/app.css';
import { useAuthHydrator } from './hooks/useAuth.js';

const App = () => {
  useAuthHydrator();

  return (
    <div className="min-h-screen bg-background text-text">
      <SkipLink />
      <Suspense fallback={<div className="p-8 text-center" role="status">Cargando…</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
};

export default App;
