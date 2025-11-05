import PropTypes from 'prop-types';

const Section = ({ title, description, children, id, variant = 'default' }) => {
  const variants = {
    default: 'bg-surface shadow-sm',
    muted: 'bg-surface-alt',
    transparent: 'bg-transparent'
  };

  return (
    <section
      id={id}
      className={`mx-auto mb-12 max-w-6xl rounded-lg px-6 py-10 transition ${variants[variant]}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      {title && (
        <header className="mb-6 space-y-2 text-center md:text-left">
          <h2 id={id ? `${id}-title` : undefined} className="text-3xl font-bold text-primary-strong">
            {title}
          </h2>
          {description && <p className="text-lg text-muted">{description}</p>}
        </header>
      )}
      <div className="space-y-6">{children}</div>
    </section>
  );
};

Section.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'muted', 'transparent'])
};

export default Section;
