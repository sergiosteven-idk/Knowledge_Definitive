import Section from '../components/ui/Section.jsx';

const TyC = () => {
  return (
    <Section
      id="terminos"
      title="Términos y condiciones"
      description="Última actualización: enero 2024"
    >
      <article className="prose mx-auto">
        <h2>1. Aceptación</h2>
        <p>
          Al crear una cuenta o utilizar los servicios de Knowledge Definitive aceptas estos términos, nuestra política de
          privacidad y lineamientos de accesibilidad.
        </p>
        <h2>2. Privacidad y protección de datos</h2>
        <p>
          Utilizamos cifrado en tránsito y en reposo. Puedes solicitar acceso, rectificación o eliminación de tus datos en cualquier
          momento escribiendo a privacidad@knowledge.org.
        </p>
        <h2>3. Conducta de usuarios</h2>
        <p>
          Promovemos un entorno respetuoso e inclusivo. Cualquier forma de discriminación será investigada y puede resultar en la
          suspensión de la cuenta.
        </p>
        <h2>4. Propiedad intelectual</h2>
        <p>
          Los contenidos educativos son propiedad de sus autores y se comparten bajo licencias específicas. Respeta los términos de
          cada curso.
        </p>
        <h2>5. Actualizaciones</h2>
        <p>
          Los términos pueden cambiar. Notificaremos a los usuarios registrados con anticipación y mantendremos un historial de
          versiones en este apartado.
        </p>
      </article>
    </Section>
  );
};

export default TyC;
