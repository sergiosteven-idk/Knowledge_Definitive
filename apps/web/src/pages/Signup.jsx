import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Section from '../components/ui/Section.jsx';
import FormField from '../components/forms/FormField.jsx';
import { useRegister } from '../hooks/useAuth.js';

const schema = z
  .object({
    nombre: z.string().min(2, 'Ingresa tu nombre completo'),
    apellido: z.string().min(2, 'Ingresa tu apellido'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(8, 'La contraseña debe tener mínimo 8 caracteres'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

const Signup = () => {
  const [errors, setErrors] = useState({});
  const register = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const result = schema.safeParse(values);
    if (!result.success) {
      const formatted = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(formatted).map(([key, value]) => [key, value?.[0]])));
      return;
    }

    try {
      await register.mutateAsync({
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        password: values.password
      });
      navigate('/cursos', { replace: true });
    } catch (error) {
      setErrors({ form: 'No pudimos registrar tu cuenta. Inténtalo de nuevo.' });
    }
  };

  return (
    <Section
      id="signup"
      title="Crea tu cuenta"
      description="Únete a la comunidad Knowledge Definitive y personaliza tu experiencia."
    >
      <form className="mx-auto max-w-xl space-y-6" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <div role="alert" className="rounded-md bg-danger/10 px-4 py-3 text-sm text-danger">
            {errors.form}
          </div>
        )}
        <FormField
          id="nombre"
          name="nombre"
          label="Nombre completo"
          autoComplete="name"
          error={errors.nombre}
          required
        />
        <FormField
          id="apellido"
          name="apellido"
          label="Apellido"
          autoComplete="family-name"
          error={errors.apellido}
          required
        />
        <FormField
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          autoComplete="email"
          error={errors.email}
          required
        />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          autoComplete="new-password"
          error={errors.password}
          required
        />
        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirma tu contraseña"
          autoComplete="new-password"
          error={errors.confirmPassword}
          required
        />
        <button type="submit" className="btn-primary w-full justify-center" disabled={register.isPending}>
          {register.isPending ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
        <p className="text-center text-sm text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-accent underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </Section>
  );
};

export default Signup;
