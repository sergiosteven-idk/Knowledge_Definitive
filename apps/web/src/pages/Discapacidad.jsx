import Section from '../components/ui/Section.jsx';

const Discapacidad = () => {
  return (
    <div className="space-y-12">
      <Section
        id="discapacidad"
        title="Inclusión y discapacidad"
        description="El conocimiento es un derecho universal. Diseñamos experiencias alineadas a WCAG 2.2 y mejores prácticas de accesibilidad."
      >
        <article className="prose mx-auto">
          <h2>Principios de accesibilidad</h2>
          <p>
            Nuestros contenidos, evaluaciones y canales de soporte son perceptibles, operables, comprensibles y robustos. La barra
            de accesibilidad permite ajustar tipografías, contrastes, espaciados y activar lectura en voz alta.
          </p>
          <h3>Herramientas disponibles</h3>
          <ul>
            <li>Subtítulos automáticos y transcripciones descargables.</li>
            <li>Compatibilidad con lectores de pantalla, navegación por teclado y atajos.</li>
            <li>Material descargable en formatos de alto contraste y braille digital.</li>
            <li>Mentores certificados en inclusión y diseño universal.</li>
          </ul>
        </article>
      </Section>
      <Section id="recursos" variant="muted">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Guía de accesibilidad',
              description: 'Checklist para docentes y creadores de contenido alineado a WCAG 2.2. '
            },
            {
              title: 'Soporte en LSM',
              description: 'Sesiones en vivo con intérpretes certificados en lengua de señas mexicana.'
            },
            {
              title: 'Tecnologías adaptativas',
              description: 'Integración con lectores de pantalla, teclados alternativos y comandos de voz.'
            }
          ].map((item) => (
            <article key={item.title} className="card">
              <h3 className="text-xl font-semibold text-primary-strong">{item.title}</h3>
              <p className="mt-3 text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Discapacidad;
