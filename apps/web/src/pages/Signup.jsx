import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth.js';
import '../assets/css/auth.css';

const nameRegex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s'-]{2,50}$/;
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const Signup = () => {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '', general: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);

  const { mutate: register, isPending, error } = useRegister();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = useCallback(() => {
    const nextErrors = { nombre: '', apellido: '', email: '', password: '', confirmPassword: '', general: '' };
    let valid = true;

    if (!nameRegex.test(form.nombre)) {
      nextErrors.nombre = 'Nombre inválido. Usa solo letras y un mínimo de 2 caracteres.';
      valid = false;
    }

    if (!nameRegex.test(form.apellido)) {
      nextErrors.apellido = 'Apellido inválido. Usa solo letras y un mínimo de 2 caracteres.';
      valid = false;
    }

    if (!emailRegex.test(form.email)) {
      nextErrors.email = 'Correo electrónico inválido.';
      valid = false;
    }

    if (form.password.length < 6 || !/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      nextErrors.password = 'Mínimo 6 caracteres, combinando letras y números.';
      valid = false;
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
      valid = false;
    }

    setErrors(nextErrors);
    return valid;
  }, [form]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    setErrors((prev) => ({ ...prev, general: '' }));
    setMessage('');

    register(
      { nombre: form.nombre, apellido: form.apellido, email: form.email, password: form.password },
      {
        onSuccess: () => {
          setMessage('✅ Registro exitoso, redirigiendo…');
          const searchParams = new URLSearchParams(location.search);
          const redirectTo = searchParams.get('next') || '/cursos';
          timeoutRef.current = setTimeout(() => {
            navigate(redirectTo, { replace: true });
          }, 1200);
        },
        onError: (err) => {
          setErrors((prev) => ({
            ...prev,
            general: err?.response?.data?.message || 'Error en el registro. Intenta nuevamente.'
          }));
        }
      }
    );
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card" role="form" aria-labelledby="signup-title">
          <div className="auth-logo" aria-hidden="true">
            <span role="img" aria-label="Graduación">
              🎓
            </span>
            Knowledge Definitive
          </div>
          <h2 id="signup-title">Crear cuenta</h2>
          <p className="subtitle">Únete a la comunidad Knowledge y personaliza tu aprendizaje accesible.</p>

          {(errors.general || error) && (
            <div className="general-error" role="alert" aria-live="assertive">
              {errors.general || error?.response?.data?.message || 'Ocurrió un error.'}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                className="form-input"
                autoComplete="given-name"
                value={form.nombre}
                onChange={onChange}
                required
                aria-invalid={Boolean(errors.nombre)}
                aria-describedby="nombre-error"
              />
              <span id="nombre-error" className="error-message">
                {errors.nombre}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="apellido" className="form-label">
                Apellido
              </label>
              <input
                id="apellido"
                name="apellido"
                className="form-input"
                autoComplete="family-name"
                value={form.apellido}
                onChange={onChange}
                required
                aria-invalid={Boolean(errors.apellido)}
                aria-describedby="apellido-error"
              />
              <span id="apellido-error" className="error-message">
                {errors.apellido}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                autoComplete="email"
                value={form.email}
                onChange={onChange}
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby="email-error"
              />
              <span id="email-error" className="error-message">
                {errors.email}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                autoComplete="new-password"
                value={form.password}
                onChange={onChange}
                required
                aria-invalid={Boolean(errors.password)}
                aria-describedby="password-error"
                minLength={6}
                maxLength={120}
              />
              <span id="password-error" className="error-message">
                {errors.password}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={onChange}
                required
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby="confirm-password-error"
                minLength={6}
                maxLength={120}
              />
              <span id="confirm-password-error" className="error-message">
                {errors.confirmPassword}
              </span>
            </div>

            <button type="submit" className="signup-btn" disabled={isPending} aria-busy={isPending}>
              {isPending ? 'Registrando…' : 'Registrarse'}
            </button>
          </form>

          {message && (
            <p className="signup-message" role="status" aria-live="polite">
              {message}
            </p>
          )}

          <div className="login-section">
            <Link to="/login" className="login-link">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
