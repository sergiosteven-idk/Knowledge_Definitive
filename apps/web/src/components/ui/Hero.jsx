import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Hero = ({ title, subtitle, ctaPrimary, ctaSecondary }) => {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary to-primary-strong text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center">
        <div className="md:w-3/5">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl" dangerouslySetInnerHTML={{ __html: title }} />
          <p className="mt-4 text-lg text-white/90">{subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            {ctaPrimary && (
              <Link
                to={ctaPrimary.to}
                className="rounded-full bg-white px-6 py-3 text-base font-semibold text-primary transition hover:bg-white/90 focus-visible:focus-outline"
              >
                {ctaPrimary.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                to={ctaSecondary.to}
                className="rounded-full border border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:focus-outline"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>
        <div className="md:w-2/5">
          <div className="rounded-3xl bg-white/10 p-6 shadow-lg backdrop-blur">
            <p className="text-sm uppercase tracking-wide text-white/70">Plataforma inclusiva</p>
            <p className="mt-3 text-lg leading-relaxed text-white/95">
              Acceso equitativo al conocimiento, aprendizaje adaptativo y soporte continuo para comunidades con y sin
              discapacidades.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  ctaPrimary: PropTypes.shape({ label: PropTypes.string, to: PropTypes.string }),
  ctaSecondary: PropTypes.shape({ label: PropTypes.string, to: PropTypes.string })
};

export default Hero;
