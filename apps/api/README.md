# Knowledge API

API REST construida con Express y Prisma para Knowledge Definitive.

## Scripts
- `npm run dev`: Ejecuta la API en modo desarrollo con recarga.
- `npm run build`: Compila TypeScript a JavaScript.
- `npm run start`: Inicia la versión compilada.
- `npm run test`: Ejecuta Jest + Supertest.
- `npm run prisma:generate`: Genera el cliente Prisma.
- `npm run prisma:migrate`: Ejecuta migraciones en local.
- `npm run prisma:deploy`: Aplica migraciones en producción.
- `npm run prisma:seed`: Inserta datos iniciales.

## Variables de entorno
Configura `.env` a partir de `.env.example`.

```
NODE_ENV=development
PORT=4000
DATABASE_URL="mysql://root:password@localhost:3306/KNOWLEDGE"
JWT_SECRET="cambia-esto-por-uno-largo-y-aleatorio"
JWT_EXPIRES="15m"
REFRESH_EXPIRES="7d"
CORS_ORIGIN="http://localhost:5173"
```

## Estructura
- `src/index.ts`: punto de entrada.
- `src/routes`: definiciones de rutas.
- `src/controllers`: lógica HTTP.
- `src/services`: lógica de negocio y acceso a datos.
- `src/middleware`: middlewares (auth, rbac, rate limit, errores).
- `src/schemas`: validaciones Zod.
- `prisma/schema.prisma`: definición del modelo y mapeo a MySQL.
- `prisma/seed.ts`: datos iniciales (roles, admin, docente, curso demo).

## Tests
Se incluyen pruebas básicas en `src/__tests__` que cubren autenticación y cursos.

## Seguridad
- Helmet con CSP, no sniff, frameguard.
- Rate limiting en `/auth/login` y `/auth/register`.
- JWT access + refresh con rotación y lista de tokens válidos.
- RBAC desde tablas `Rol`, `Permiso`, `RolPermiso`, `UsuarioRol`.
