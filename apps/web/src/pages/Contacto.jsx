import { useState } from 'react';
import Section from '../components/ui/Section.jsx';
import FormField from '../components/forms/FormField.jsx';

const Contacto = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const newErrors = {};
    if (!values.nombre) newErrors.nombre = 'Ingresa tu nombre';
    if (!values.email) newErrors.email = 'Ingresa tu correo';
    if (!values.mensaje) newErrors.mensaje = 'Cuéntanos cómo podemos ayudarte';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      event.currentTarget.reset();
    }
  };

  return (
    <Section
      id="contacto"
      title="Contacto"
      description="Estamos aquí para escucharte. Completa el formulario y responderemos en menos de 24 horas."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <FormField id="nombre" name="nombre" label="Nombre" error={errors.nombre} required />
          <FormField id="email" name="email" type="email" label="Correo electrónico" error={errors.email} required />
          <FormField id="asunto" name="asunto" label="Asunto" description="Opcional" />
          <FormField id="mensaje" name="mensaje" label="Mensaje" error={errors.mensaje} required>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="5"
              aria-invalid={Boolean(errors.mensaje)}
              className="w-full rounded-md border border-transparent bg-surface px-4 py-3 text-base shadow-xs transition focus-visible:focus-outline"
              style={{ borderColor: errors.mensaje ? undefined : 'var(--color-border)' }}
            ></textarea>
          </FormField>
          <button type="submit" className="btn-primary w-full md:w-auto">
            Enviar mensaje
          </button>
          {submitted && (
            <p className="text-sm text-success" role="status">
              ¡Gracias! Hemos recibido tu mensaje y nos pondremos en contacto muy pronto.
            </p>
          )}
        </form>
        <div className="space-y-6 rounded-2xl bg-surface-alt p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-primary-strong">Centro de ayuda</h3>
          <p className="text-muted">
            Ofrecemos atención inclusiva con soporte en lengua de señas, subtitulado en vivo y respuestas accesibles.
          </p>
          <ul className="space-y-2 text-sm">
            <li><strong>Correo:</strong> hola@knowledge.org</li>
            <li><strong>Teléfono:</strong> +52 123 456 7890</li>
            <li><strong>Horario:</strong> Lunes a viernes de 9:00 a 18:00 (GMT-6)</li>
          </ul>
          <div className="rounded-lg bg-primary/10 p-4 text-sm text-primary-strong">
            <p className="font-semibold">Accesibilidad</p>
            <p>
              Si necesitas apoyo adicional, indícalo en el mensaje y adaptaremos nuestros canales de comunicación.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contacto;
