import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { z } from 'zod';
import FormField from '../components/forms/FormField.jsx';
import Section from '../components/ui/Section.jsx';
import { useLogin } from '../hooks/useAuth.js';

const schema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const Login = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

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
      await login.mutateAsync(values);
      const redirectTo = location.state?.from?.pathname || '/cursos';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrors({ form: 'Credenciales inválidas o cuenta bloqueada temporalmente.' });
    }
  };

  return (
    <Section
      id="login"
      title="Inicia sesión"
      description="Accede a tus cursos, progreso y recursos personalizados."
    >
      <form className="mx-auto max-w-xl space-y-6" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <div role="alert" className="rounded-md bg-danger/10 px-4 py-3 text-sm text-danger">
            {errors.form}
          </div>
        )}
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
          autoComplete="current-password"
          error={errors.password}
          required
        />
        <button
          type="submit"
          className="btn-primary w-full justify-center"
          disabled={login.isPending}
        >
          {login.isPending ? 'Ingresando…' : 'Ingresar'}
        </button>
        <p className="text-center text-sm text-muted">
          ¿No tienes cuenta?{' '}
          <Link to="/signup" className="text-accent underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </Section>
  );
};

export default Login;
