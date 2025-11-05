import { useCallback, useEffect, useRef } from 'react';

export const useAnnouncer = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      const region = document.createElement('div');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.setAttribute('class', 'sr-only');
      region.style.position = 'absolute';
      region.style.width = '1px';
      region.style.height = '1px';
      region.style.margin = '-1px';
      region.style.border = '0';
      region.style.padding = '0';
      region.style.clip = 'rect(0 0 0 0)';
      document.body.appendChild(region);
      ref.current = region;
    }
    return () => {
      if (ref.current?.parentNode) {
        ref.current.parentNode.removeChild(ref.current);
      }
    };
  }, []);

  return useCallback((message) => {
    if (ref.current) {
      ref.current.textContent = '';
      window.requestAnimationFrame(() => {
        ref.current.textContent = message;
      });
    }
  }, []);
};
