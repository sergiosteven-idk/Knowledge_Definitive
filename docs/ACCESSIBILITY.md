# Accesibilidad (WCAG 2.2)

## Principios clave
- **Perceptible**: Contrastes mínimos AA/AAA, soporte para modo alto contraste, tipografía escalable y `prefers-reduced-motion`.
- **Operable**: Navegación completa por teclado, atajos accesibles (Alt+T para barra A11y), focus visibles, skip links.
- **Comprensible**: Etiquetas claras, mensajes de error contextualizados, indicaciones en vivo (`aria-live="polite"`).
- **Robusto**: Uso correcto de roles, atributos ARIA y estructura semántica.

## Implementaciones destacadas
- `A11yBar`: controla tamaño de fuente, contraste, espaciado, modo simplificado y lector TTS. Persistencia en `localStorage` mediante data attributes en `<html>` (`data-a11y-font`, `data-a11y-contrast`, etc.).
- `Navbar`: control de foco al abrir/cerrar menú hamburguesa, roles correctos y feedback visual.
- Formularios (`Login`, `Signup`, `Contacto`): componentes `FormField` con `aria-describedby`, mensajes en `aria-live`, validación incremental con Zod.

## Checklist rápida
- [x] Contraste mínimo 4.5:1 en texto normal.
- [x] Estados hover/focus/active definidos en tokens de diseño.
- [x] Skip link antes de la `Navbar`.
- [x] Contenido accesible en móviles (target > 44px).
- [x] Labels y placeholders nunca sustituyen indicaciones.
- [x] Indicar progreso en procesos multi-step (evaluaciones).

## Cómo extender
1. Usa el hook `useAnnouncer` (ver `apps/web/src/hooks/useAnnouncer.js`) para nuevos feedbacks.
2. Si agregas componentes, respeta tokens definidos en `packages/ui/src/tokens.css` y clases utilitarias en Tailwind.
3. Ejecuta Lighthouse con modo accesibilidad y Testing Library con `axe` en nuevas vistas.
