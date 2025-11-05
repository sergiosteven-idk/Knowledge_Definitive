# Knowledge Web

Aplicación React/Vite de la plataforma Knowledge_Definitive.

## Scripts
- `npm run dev`: inicia Vite en http://localhost:5173.
- `npm run build`: compila para producción.
- `npm run preview`: sirve la build generada.
- `npm run test`: ejecuta Vitest + Testing Library.
- `npm run lint`: ejecuta ESLint.

## Variables de entorno
Crea `.env` basado en `.env.example`:
```
VITE_API_URL="http://localhost:4000/api"
```

## Características
- React Router con rutas protegidas por RBAC.
- TanStack Query para manejo de sesiones (`useAuth`).
- Tailwind CSS con tokens importados desde `packages/ui/src/tokens.css` para mantener consistencia.
- Componentes accesibles: `A11yBar`, `Navbar`, `Footer` y páginas con semántica adecuada.

## Tests
Ejecuta `npm run test` para correr pruebas unitarias de componentes clave.
