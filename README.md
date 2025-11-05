# Knowledge_Definitive

Proyecto monorepo que combina un front-end accesible en React/Vite y una API segura en Node.js/Express con Prisma y MySQL. Este documento actúa como guía maestra para clonar, instalar, ejecutar, probar y desplegar la plataforma.

## Tabla de contenidos
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación rápida](#instalación-rápida)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Base de datos](#base-de-datos)
- [Accesibilidad, seguridad y performance](#accesibilidad-seguridad-y-performance)
- [Pruebas y CI](#pruebas-y-ci)
- [Despliegue](#despliegue)
- [Recursos adicionales](#recursos-adicionales)

## Arquitectura
- **apps/web**: Aplicación React con Vite, Tailwind CSS, React Router y TanStack Query. Incluye componentes accesibles (WCAG 2.2) y un sistema de tokens de diseño.
- **apps/api**: API REST con Express, Prisma y MySQL. Seguridad reforzada con JWT, Helmet, CORS estricto, rate limiting, sanitización y validaciones Zod. Implementa RBAC basado en tablas `Rol`, `Permiso`, `RolPermiso` y `UsuarioRol`.
- **packages/ui**: Tokens y utilidades compartidas para estilado consistente.
- **docs**: Documentación ampliada, checklist de QA y guía de endpoints.

## Requisitos
- Node.js 18+
- npm 9+
- MySQL 8+ (o MariaDB 10.5+)
- Opcional: Docker para despliegue, MongoDB para logs (no obligatorio).

## Instalación rápida
```bash
# 1. Clonar y entrar al proyecto
git clone <REPO-URL> Knowledge_Definitive
cd Knowledge_Definitive

# 2. Instalar dependencias del frontend
cd apps/web
npm install

# 3. Instalar dependencias del backend
cd ../api
npm install

# 4. Configurar variables de entorno (ver sección siguiente)
#    y preparar la base de datos ejecutando knowledge.sql o prisma migrate + seed

# 5. Ejecutar ambos servidores en paralelo
cd ../web
npm run dev # Vite en http://localhost:5173
cd ../api
npm run dev # API en http://localhost:4000
```

## Estructura de carpetas
```
Knowledge_Definitive/
├─ apps/
│  ├─ api/
│  │  ├─ prisma/
│  │  │  ├─ schema.prisma
│  │  │  └─ seed.ts
│  │  ├─ src/
│  │  │  ├─ config/
│  │  │  ├─ controllers/
│  │  │  ├─ middleware/
│  │  │  ├─ routes/
│  │  │  ├─ schemas/
│  │  │  ├─ services/
│  │  │  └─ utils/
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ web/
│     ├─ public/
│     ├─ src/
│     │  ├─ assets/
│     │  ├─ components/
│     │  ├─ hooks/
│     │  ├─ pages/
│     │  ├─ App.jsx
│     │  ├─ main.jsx
│     │  └─ router.jsx
│     ├─ package.json
│     ├─ tailwind.config.cjs
│     └─ vite.config.js
├─ packages/
│  └─ ui/
│     ├─ src/
│     │  └─ tokens.css
│     └─ package.json
├─ docs/
│  ├─ README.md
│  ├─ ACCESSIBILITY.md
│  ├─ API.md
│  └─ QA_CHECKLIST.md
├─ .github/workflows/ci.yml
├─ .editorconfig
├─ .gitignore
└─ README.md
```

## Variables de entorno
Consulte los archivos `.env.example` provistos en `apps/web` y `apps/api`.

## Scripts disponibles
### Frontend (`apps/web/package.json`)
- `npm run dev`: Inicia Vite en modo desarrollo.
- `npm run build`: Genera build de producción.
- `npm run preview`: Previsualiza la build.
- `npm run lint`: Ejecuta ESLint.
- `npm run test`: Ejecuta pruebas con Vitest.

### Backend (`apps/api/package.json`)
- `npm run dev`: Ejecuta la API con `tsx` y recarga en caliente.
- `npm run build`: Compila TypeScript a JavaScript.
- `npm run start`: Inicia la API compilada.
- `npm run test`: Corre Jest + Supertest.
- `npm run lint`: Revisa ESLint (si se habilita).
- `npm run prisma:generate`: Genera el cliente Prisma.
- `npm run prisma:migrate`: Ejecuta migraciones.
- `npm run prisma:seed`: Corre el seed inicial.

## Base de datos
1. Cree la base de datos `KNOWLEDGE` en MySQL.
2. Importe el archivo `knowledge.sql` original o ejecute `npx prisma migrate deploy` seguido de `npm run prisma:seed`.
3. Actualice `DATABASE_URL` en `apps/api/.env` con credenciales reales.

## Accesibilidad, seguridad y performance
- Accesibilidad AA/AAA: barra A11y con persistencia, skip links, foco visible, respeto de `prefers-reduced-motion`.
- Seguridad: Helmet, CORS whitelisting, rate limiting en endpoints de auth, JWT access + refresh con rotación, bloqueo por intentos repetidos, sanitización.
- Performance: Lazy loading de rutas, TanStack Query para caché, Axios interceptors para refresh, índices sugeridos en tablas críticas.

## Pruebas y CI
- Front: Vitest + Testing Library.
- Back: Jest + Supertest para endpoints críticos.
- GitHub Actions (`.github/workflows/ci.yml`) ejecuta lint y tests en cada push/PR.

## Despliegue
- **API**: Docker + MySQL (o servicio administrado). Configurar variables de entorno, HTTPS detrás de Nginx/Caddy, logs estructurados.
- **Web**: Deploy estático (Vercel/Netlify) o Nginx. Ajustar `VITE_API_URL` según entorno.
- Actualice CORS y cookies (SameSite=Lax si se usan cookies) para producción.

## Recursos adicionales
- `docs/ACCESSIBILITY.md`: checklist WCAG 2.2 aplicada.
- `docs/API.md`: Endpoints con contratos y ejemplos.
- `docs/QA_CHECKLIST.md`: guía para validaciones manuales.

> Para detalles específicos de cada app revise los README particulares dentro de `apps/web` y `apps/api`.
