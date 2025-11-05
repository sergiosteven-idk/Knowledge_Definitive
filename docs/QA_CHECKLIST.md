# QA Checklist

## General
- [ ] README actualizado con pasos de instalación.
- [ ] Variables `.env` configuradas para los entornos.
- [ ] Seeds ejecutados y cuentas de prueba disponibles.

## Frontend
- [ ] Lighthouse ≥ 95 en Accesibilidad y Performance.
- [ ] Navegación por teclado completa, sin trampas de foco.
- [ ] Formularios con validación y mensajes accesibles (`aria-live`).
- [ ] Test `npm run test` pasa sin errores.

## Backend
- [ ] Pruebas `npm run test` exitosas.
- [ ] Rate limiting operativo en `/api/auth/login`.
- [ ] Logs sin PII (revisar `apps/api/src/utils/logger.ts`).
- [ ] RBAC verificado con roles `admin`, `docente`, `miembro`.

## Seguridad
- [ ] Dependencias auditadas (`npm audit --production`).
- [ ] Headers de seguridad aplicados.
- [ ] Tokens JWT con expiración adecuada y rotación.
- [ ] Passwords hashed con bcrypt (cost 12).

## Performance
- [ ] Cachés de TanStack Query con invalidaciones correctas.
- [ ] Paginar listados grandes (Cursos, Donaciones).
- [ ] Lazy loading de rutas y componentes pesados.

## Accesibilidad
- [ ] Skip link operativo (`Ir al contenido principal`).
- [ ] A11yBar persiste preferencias tras recarga.
- [ ] Focus visible y consistente.
- [ ] Texto alternativo en imágenes clave.
