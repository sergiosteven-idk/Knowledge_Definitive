import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import A11yBar from '../../A11yBar.jsx';

describe('A11yBar', () => {
  it('permite abrir y cerrar el panel', () => {
    render(<A11yBar />);
    const button = screen.getByRole('button', { name: /abrir opciones/i });
    fireEvent.click(button);
    expect(screen.getByText('Tamaño de fuente')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cerrar opciones/i }));
  });

  it('guarda preferencias en localStorage', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    render(<A11yBar />);
    fireEvent.click(screen.getByRole('button', { name: /abrir opciones/i }));
    fireEvent.click(screen.getByRole('button', { name: /grande/i }));
    expect(setItem).toHaveBeenCalled();
  });
});
