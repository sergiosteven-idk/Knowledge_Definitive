import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLogout, useProfile } from '../hooks/useAuth.js';
import clsx from 'clsx';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/cursos', label: 'Cursos' },
  { to: '/discapacidad', label: 'Discapacidad' },
  { to: '/informacion', label: 'Información' },
  { to: '/contacto', label: 'Contacto' }
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { data: profile } = useProfile();
  const logout = useLogout();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate('/', { replace: true });
  };

  const navLinkClasses = ({ isActive }) =>
    clsx(
      'rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:focus-outline',
      isActive ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'
    );

  return (
    <header
      className="sticky top-0 z-40 bg-surface/95 backdrop-blur"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4" aria-label="Principal" ref={menuRef}>
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary-strong" aria-label="Ir a inicio">
          <span aria-hidden="true">🎓</span> Knowledge Definitive
        </Link>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 focus-visible:focus-outline lg:hidden"
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{open ? 'Cerrar' : 'Menú'}</span>
          <span aria-hidden="true">☰</span>
        </button>
        <div
          id="menu-principal"
          className={clsx(
            'absolute left-0 right-0 top-full origin-top transform bg-surface px-4 pb-6 pt-4 shadow-lg transition lg:static lg:flex lg:translate-y-0 lg:items-center lg:gap-6 lg:bg-transparent lg:p-0 lg:shadow-none',
            open ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 lg:opacity-100'
          )}
          style={{ transformOrigin: 'top' }}
        >
          <ul className="flex flex-col gap-2 lg:flex-row">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClasses} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            {profile?.roles?.includes('admin') && (
              <li>
                <NavLink to="/admin" className={navLinkClasses} onClick={() => setOpen(false)}>
                  Panel Admin
                </NavLink>
              </li>
            )}
          </ul>
          <div
            className="mt-4 flex flex-col gap-3 pt-4 lg:mt-0 lg:flex-row lg:items-center lg:border-none lg:pt-0"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            {profile ? (
              <>
                <span className="text-sm text-muted" role="status">
                  Hola, <strong>{profile.nombre}</strong>
                </span>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 lg:flex-row">
                <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>
                  Ingresar
                </Link>
                <Link to="/signup" className="btn-primary" onClick={() => setOpen(false)}>
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
