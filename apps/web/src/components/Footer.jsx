import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-16 bg-primary-strong text-white" aria-labelledby="pie">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4" id="pie">
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Knowledge Definitive</h2>
          <p className="text-sm text-white/80">
            Comunidad de aprendizaje inclusivo. Recursos, cursos y soporte continuo con enfoque de accesibilidad universal.
          </p>
          <p className="text-sm">© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Sitio</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:underline focus-visible:focus-outline" to="/">Inicio</Link></li>
            <li><Link className="hover:underline focus-visible:focus-outline" to="/cursos">Cursos</Link></li>
            <li><Link className="hover:underline focus-visible:focus-outline" to="/discapacidad">Discapacidad</Link></li>
            <li><Link className="hover:underline focus-visible:focus-outline" to="/informacion">Información</Link></li>
            <li><Link className="hover:underline focus-visible:focus-outline" to="/tyc">Términos y condiciones</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Contacto</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="hover:underline focus-visible:focus-outline" href="mailto:hola@knowledge.org">
                hola@knowledge.org
              </a>
            </li>
            <li>
              <a className="hover:underline focus-visible:focus-outline" href="tel:+521234567890">
                +52 123 456 7890
              </a>
            </li>
            <li>
              <address className="not-italic text-white/80">Av. Accesible 123, Ciudad Inclusiva</address>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Redes</h3>
          <ul className="mt-4 flex gap-3 text-2xl" aria-label="Redes sociales">
            <li>
              <a className="focus-visible:focus-outline hover:text-secondary" href="https://twitter.com" aria-label="Twitter">
                🐦
              </a>
            </li>
            <li>
              <a className="focus-visible:focus-outline hover:text-secondary" href="https://facebook.com" aria-label="Facebook">
                📘
              </a>
            </li>
            <li>
              <a className="focus-visible:focus-outline hover:text-secondary" href="https://instagram.com" aria-label="Instagram">
                📸
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
