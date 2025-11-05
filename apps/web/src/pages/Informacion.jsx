import Section from '../components/ui/Section.jsx';

const Informacion = () => {
  return (
    <div className="space-y-12">
      <Section
        id="informacion"
        title="Información institucional"
        description="Transparencia, gobernanza y compromiso social de Knowledge Definitive."
      >
        <article className="prose mx-auto">
          <h2>Misión</h2>
          <p>
            Democratizar el acceso al conocimiento mediante plataformas inclusivas, seguras y colaborativas que acompañen a las
            personas durante toda su trayectoria educativa.
          </p>
          <h2>Visión</h2>
          <p>
            Ser la red educativa de referencia en LATAM en materia de accesibilidad y aprendizaje universal, conectando
            instituciones, organizaciones civiles y personas.
          </p>
          <h3>Valores</h3>
          <ul>
            <li>Empatía y enfoque humano.</li>
            <li>Innovación responsable.</li>
            <li>Transparencia y protección de datos.</li>
            <li>Colaboración con comunidades diversas.</li>
          </ul>
        </article>
      </Section>
      <Section id="datos" variant="muted">
        <div className="grid gap-6 md:grid-cols-3">
          {[{
            title: 'Programas becarios',
            description: 'Fondos especiales para estudiantes con discapacidad y comunidades indígenas.'
          },
          {
            title: 'Alianzas estratégicas',
            description: 'Colaboración con ONGs y universidades para contenidos accesibles.'
          },
          {
            title: 'Seguridad de datos',
            description: 'Cumplimos GDPR y Ley Federal de Protección de Datos en México.'
          }].map((item) => (
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

export default Informacion;
