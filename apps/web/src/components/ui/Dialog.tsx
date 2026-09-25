import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  /** id del título dentro del diálogo (para aria-labelledby). */
  labelledBy: string;
  className?: string;
  children: ReactNode;
};

/**
 * Diálogo modal sobre <dialog> nativo: el navegador atrapa el foco, cierra con Esc
 * y devuelve el foco a quien lo abrió. En móvil se dibuja como hoja inferior (ver index.css).
 */
export function Dialog({ open, onClose, labelledBy, className, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Evita que la página de fondo se desplace mientras el diálogo está abierto.
  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [open]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      className="sm-dialog"
      onClose={onClose}
      // Esc ya cierra el diálogo con teclado; el clic en el fondo es un atajo extra para mouse.
      onClick={(event) => {
        // Clic en el fondo (fuera del contenido) cierra.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={cn('relative max-h-[92svh] overflow-y-auto p-6 md:p-7', className)}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-white text-lg shadow-soft transition hover:scale-105"
        >
          <span aria-hidden="true">✕</span>
        </button>
        {children}
      </div>
    </dialog>
  );
}
