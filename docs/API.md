# API Knowledge_Definitive

## Autenticación (`/api/auth`)
| Método | Ruta      | Body | Respuesta | Notas |
| ------ | --------- | ---- | --------- | ----- |
| POST   | /register | `{ nombre, email, password }` | 201 con usuario y tokens | Valida con Zod, hash bcrypt, asigna rol `miembro`. |
| POST   | /login    | `{ email, password }` | 200 con tokens y perfil | Bloquea tras 5 intentos fallidos durante 15 min. |
| POST   | /refresh  | `{ refreshToken }` | 200 con nuevo access token | Verifica token en base de datos, rotación. |
| POST   | /logout   | `{ refreshToken }` | 204 | Invalida refresh. |

## Usuarios (`/api/users`)
- `GET /me`: Perfil del usuario autenticado.
- `GET /:id`: Requiere `requireRole('usuario', 'read')` para roles admin/editor.

## Cursos (`/api/cursos`)
- `GET /`: Público con paginación (`?page=1&pageSize=10`).
- `POST /`: Requiere rol `docente` o `editor` (`requireRole('curso', 'create')`).
- `GET /:id`: Incluye módulos y evaluaciones asociadas.
- `PUT /:id`: Actualización con control de propietario.
- `DELETE /:id`: Solo rol `super`.

## Módulos (`/api/cursos/:id/modulos`)
CRUD completo con verificación de dueño/rol. Incluye orden (`orden` INT) y contenidos enriquecidos (Markdown permitido tras sanitización).

## Progreso (`/api/progreso`)
- `GET /mine`: Avances del usuario autenticado.
- `PATCH /:id`: Actualiza porcentaje o estado, permitido al dueño o docente asignado.

## Evaluaciones (`/api/evaluaciones`)
- CRUD estándar. Las preguntas usan JSON (`tipo`, `opciones`).
- `POST /:id/responder`: Recibe respuestas, calcula calificación y persiste en `Resultado`.

## Donaciones (`/api/donaciones`)
- `POST /`: Registra intención de donación (simulado, sin gateway).
- `GET /mine`: Historial del usuario.

## Admin (`/api/admin/roles-permisos`)
- CRUD de `Rol` y `Permiso`.
- Asignación de permisos a roles y roles a usuarios.

## Respuestas de error estándar
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo email es obligatorio",
    "details": ["email"]
  }
}
```

## Headers de seguridad
- `Strict-Transport-Security`
- `Content-Security-Policy` (ver `apps/api/src/config/security.ts`)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`

## Versionado
Añada encabezado `Accept-Version` para futuras versiones (v1 por defecto).
