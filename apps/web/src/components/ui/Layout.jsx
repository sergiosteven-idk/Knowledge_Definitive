import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../Navbar.jsx';
import Footer from '../Footer.jsx';
import A11yBar from '../A11yBar.jsx';

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <A11yBar />
      <Navbar />
      <main id="contenido-principal" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
};

export default Layout;
