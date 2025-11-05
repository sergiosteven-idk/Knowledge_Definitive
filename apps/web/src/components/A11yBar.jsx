import { useEffect, useRef, useState } from 'react';

const DEFAULT_STATE = {
  font: 'base',
  contrast: 'normal',
  spacing: 'normal',
  simplified: false,
  tts: false
};

const STORAGE_KEY = 'knowledge:a11y-preferences';

const options = {
  font: [
    { value: 'base', label: 'Fuente base' },
    { value: 'large', label: 'Grande' },
    { value: 'xlarge', label: 'Extra grande' }
  ],
  contrast: [
    { value: 'normal', label: 'Contraste estándar' },
    { value: 'high', label: 'Alto contraste' }
  ],
  spacing: [
    { value: 'normal', label: 'Espaciado normal' },
    { value: 'relaxed', label: 'Relajado' },
    { value: 'extra', label: 'Extra' }
  ]
};

const syncHtmlAttributes = (state) => {
  const root = document.documentElement;
  root.setAttribute('data-a11y-font', state.font);
  root.setAttribute('data-a11y-contrast', state.contrast);
  root.setAttribute('data-a11y-spacing', state.spacing);
  if (state.simplified) {
    root.setAttribute('data-theme', 'simplified');
  } else {
    root.removeAttribute('data-theme');
  }
};

const usePersistentState = () => {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_STATE, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('No se pudo leer preferencias de accesibilidad', error);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('No se pudo guardar preferencias', error);
    }
    syncHtmlAttributes(state);
  }, [state]);

  useEffect(() => {
    syncHtmlAttributes(state);
  }, []);

  return [state, setState];
};

const A11yBar = () => {
  const [state, setState] = usePersistentState();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.altKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        setOpen((prev) => !prev);
        if (!open) {
          requestAnimationFrame(() => {
            panelRef.current?.querySelector('button, input, select, textarea, a')?.focus();
          });
        }
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const update = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!state.tts) {
      window.speechSynthesis?.cancel();
    }
  }, [state.tts]);

  useEffect(() => {
    const focusableSelectors = 'a[href], button, textarea, input, select';
    const handleFocusTrap = (event) => {
      if (!open || !panelRef.current) return;
      if (!panelRef.current.contains(event.target)) {
        const first = panelRef.current.querySelector(focusableSelectors);
        first?.focus();
      }
    };
    document.addEventListener('focusin', handleFocusTrap);
    return () => document.removeEventListener('focusin', handleFocusTrap);
  }, [open]);

  return (
    <div className="bg-surface-alt text-sm text-text shadow-xs" role="region" aria-label="Controles de accesibilidad">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-primary-strong">Accesibilidad</span>
          <span className="hidden text-muted sm:inline">Atajo: Alt + T</span>
        </div>
        <button
          type="button"
          className="rounded-md border border-transparent px-3 py-1 font-semibold text-primary transition hover:bg-primary/10 focus-visible:focus-outline"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="a11y-panel"
        >
          {open ? 'Cerrar' : 'Abrir'} opciones
        </button>
      </div>
      {open && (
        <div
          id="a11y-panel"
          ref={panelRef}
          className="bg-surface px-4 py-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <fieldset className="space-y-2">
              <legend className="font-semibold text-primary-strong">Tamaño de fuente</legend>
              <div className="flex flex-wrap gap-2">
                {options.font.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update('font', option.value)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition focus-visible:focus-outline ${
                      state.font === option.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-alt text-primary hover:bg-primary/10'
                    }`}
                    aria-pressed={state.font === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="font-semibold text-primary-strong">Contraste</legend>
              <div className="flex flex-wrap gap-2">
                {options.contrast.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update('contrast', option.value)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition focus-visible:focus-outline ${
                      state.contrast === option.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-alt text-primary hover:bg-primary/10'
                    }`}
                    aria-pressed={state.contrast === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="font-semibold text-primary-strong">Espaciado</legend>
              <div className="flex flex-wrap gap-2">
                {options.spacing.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update('spacing', option.value)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition focus-visible:focus-outline ${
                      state.spacing === option.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-alt text-primary hover:bg-primary/10'
                    }`}
                    aria-pressed={state.spacing === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md bg-surface-alt px-3 py-2">
                <span className="font-semibold text-primary-strong">Modo simplificado</span>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={state.simplified}
                    onChange={(e) => update('simplified', e.target.checked)}
                  />
                  <span className="text-sm">{state.simplified ? 'Activado' : 'Desactivado'}</span>
                </label>
              </div>
              <div className="flex items-center justify-between rounded-md bg-surface-alt px-3 py-2">
                <span className="font-semibold text-primary-strong">Lectura en voz alta</span>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={state.tts} onChange={(e) => update('tts', e.target.checked)} />
                  <span className="text-sm">{state.tts ? 'Activado' : 'Desactivado'}</span>
                </label>
              </div>
              {state.tts && (
                <button
                  type="button"
                  className="w-full rounded-md bg-info px-4 py-2 text-sm font-semibold text-white transition hover:bg-info/90 focus-visible:focus-outline"
                  onClick={() => speak('Bienvenido a Knowledge Definitive, una plataforma accesible e inclusiva.')}
                >
                  Reproducir mensaje de bienvenida
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default A11yBar;
