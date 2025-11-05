import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth.js';
import '../assets/css/auth.css';

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);

  const { mutate: login, isPending, error } = useLogin();

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
    const validation = { email: '', password: '', general: '' };
    let valid = true;

    if (!emailRegex.test(form.email)) {
      validation.email = 'El correo no tiene un formato válido.';
      valid = false;
    }

    if (form.password.length < 6 || !/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      validation.password = 'Debe tener al menos 6 caracteres, con letras y números.';
      valid = false;
    }

    setErrors(validation);
    return valid;
  }, [form.email, form.password]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    setErrors({ email: '', password: '', general: '' });

    login(
      { email: form.email, password: form.password },
      {
        onSuccess: () => {
          const searchParams = new URLSearchParams(location.search);
          const redirectTo = searchParams.get('next') || location.state?.from?.pathname || '/cursos';
          timeoutRef.current = setTimeout(() => {
            navigate(redirectTo, { replace: true });
          }, 200);
        },
        onError: (err) => {
          setErrors((prev) => ({
            ...prev,
            general: err?.response?.data?.message || 'Credenciales incorrectas o servidor no disponible.'
          }));
        }
      }
    );
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card" role="form" aria-labelledby="login-title">
          <div className="auth-logo" aria-hidden="true">
            <span role="img" aria-label="Graduación">
              🎓
            </span>
            Knowledge Definitive
          </div>
          <h2 id="login-title">Iniciar sesión</h2>
          <p className="subtitle">Accede a tus cursos, progreso y herramientas personalizadas.</p>

          {(errors.general || error) && (
            <div className="general-error" role="alert" aria-live="assertive">
              {errors.general || error?.response?.data?.message || 'Ocurrió un error.'}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
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
                maxLength={80}
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
              <div className="password-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  autoComplete="current-password"
                  minLength={6}
                  maxLength={120}
                  value={form.password}
                  onChange={onChange}
                  required
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <span id="password-error" className="error-message">
                {errors.password}
              </span>
            </div>

            <button type="submit" className="login-btn" disabled={isPending} aria-busy={isPending}>
              {isPending ? 'Validando…' : 'Iniciar sesión'}
            </button>

            <div className="login-section">
              <Link to="/signup" className="login-link">
                ¿No tienes cuenta? Regístrate
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
