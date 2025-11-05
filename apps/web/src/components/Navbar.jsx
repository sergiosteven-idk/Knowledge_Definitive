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
      open
        ? isActive
          ? 'bg-primary text-white shadow-sm'
          : 'text-primary-strong hover:bg-primary/10'
        : isActive
          ? 'bg-white/25 text-white shadow-sm'
          : 'text-white/90 hover:bg-white/15'
    );

  const authLinkClasses = (variant = 'secondary') => {
    const base = 'inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:focus-outline';

    if (variant === 'primary') {
      return clsx(base, open ? 'bg-primary text-white hover:bg-primary-strong shadow-sm' : 'bg-secondary text-primary-strong hover:bg-secondary/90 shadow-sm');
    }

    if (variant === 'ghost') {
      return clsx(base, open ? 'text-primary-strong hover:bg-primary/10' : 'text-white/80 hover:bg-white/15');
    }

    return clsx(base, open ? 'border border-primary text-primary-strong hover:bg-primary/10' : 'border border-white/70 text-white hover:bg-white/20');
  };

  return (
    <header
      className="sticky top-0 z-40 text-white shadow-md"
      style={{ background: 'linear-gradient(120deg, var(--color-primary-strong), var(--color-primary))' }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4" aria-label="Principal" ref={menuRef}>
        <Link to="/" className="flex items-center gap-2 text-lg font-bold" aria-label="Ir a inicio">
          <span aria-hidden="true">🎓</span> Knowledge Definitive
        </Link>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:focus-outline lg:hidden"
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
            'absolute left-0 right-0 top-full origin-top transform px-4 pb-6 pt-4 transition lg:static lg:flex lg:translate-y-0 lg:items-center lg:gap-8 lg:bg-transparent lg:p-0',
            open
              ? 'scale-y-100 bg-white/95 text-primary-strong shadow-xl'
              : 'scale-y-0 opacity-0 text-white lg:opacity-100'
          )}
          style={{ transformOrigin: 'top', borderTop: open ? '1px solid rgba(107, 70, 193, 0.18)' : undefined }}
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
                <span
                  className={clsx('text-sm font-medium', open ? 'text-primary-strong' : 'text-white/90')}
                  role="status"
                >
                  Hola, <strong>{profile.nombre}</strong>
                </span>
                <button
                  type="button"
                  className={authLinkClasses(open ? 'secondary' : 'ghost')}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 lg:flex-row">
                <Link to="/login" className={authLinkClasses('secondary')} onClick={() => setOpen(false)}>
                  Ingresar
                </Link>
                <Link to="/signup" className={authLinkClasses('primary')} onClick={() => setOpen(false)}>
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
