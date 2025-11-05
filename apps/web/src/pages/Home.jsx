import Hero from '../components/ui/Hero.jsx';
import Section from '../components/ui/Section.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-16">
      <Hero
        title="Aprendizaje inclusivo para <span class='text-secondary'>todas las personas</span>"
        subtitle="Knowledge Definitive impulsa experiencias de formación accesibles, seguras y centradas en las personas."
        ctaPrimary={{ label: 'Explorar cursos', to: '/cursos' }}
        ctaSecondary={{ label: 'Conocer accesibilidad', to: '/discapacidad' }}
      />

      <Section
        id="valores"
        title="Nuestra esencia"
        description="La educación debe ser universal. Adaptamos contenidos, tecnologías y acompañamiento a cada necesidad."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[{
            title: 'Accesibilidad integral',
            description: 'Herramientas como la barra A11y, subtítulos, lectura en voz alta y diseño inclusivo.'
          },
          {
            title: 'Mentorías colaborativas',
            description: 'Docentes y especialistas guían el aprendizaje con planes personalizados.'
          },
          {
            title: 'Comunidad segura',
            description: 'Protocolos de seguridad, privacidad y moderación activa para un ambiente confiable.'
          }].map((item) => (
            <article key={item.title} className="card" aria-label={item.title}>
              <h3 className="text-xl font-semibold text-primary-strong">{item.title}</h3>
              <p className="mt-3 text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="impacto"
        title="Impacto medible"
        description="Métricas que respaldan nuestro compromiso con la inclusión y el aprendizaje continuo."
        variant="muted"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Personas certificadas', value: '1,200+' },
            { label: 'Cursos inclusivos', value: '85' },
            { label: 'Mentores activos', value: '150' }
          ].map((item) => (
            <article key={item.label} className="rounded-2xl bg-surface p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-secondary">{item.value}</p>
              <p className="mt-2 text-sm uppercase tracking-wide text-muted">{item.label}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="testimonios"
        title="Historias reales"
        variant="transparent"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {[{
            quote: 'Knowledge Definitive me permitió aprender programación con apoyos visuales y auditivos en todo momento.',
            author: 'Ana, desarrolladora front-end'
          },
          {
            quote: 'Como docente, puedo adaptar evaluaciones y seguir el progreso de cada estudiante con métricas accesibles.',
            author: 'Luis, mentor de UX'
          }].map((item) => (
            <figure key={item.author} className="card bg-surface-alt shadow-sm">
              <blockquote className="text-lg text-primary-strong">“{item.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted">{item.author}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="cta-final" variant="muted">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold text-primary-strong">¿Listo para comenzar?</h2>
          <p className="max-w-2xl text-muted">
            Regístrate gratuitamente, explora nuestros cursos y activa las herramientas de accesibilidad para vivir una
            experiencia adaptada a tus necesidades.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="btn-primary">
              Crear cuenta
            </Link>
            <Link to="/contacto" className="btn-secondary">
              Solicitar asesoría
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
