import type { Verdict } from '@soymariana/content';

import { cn } from '@/lib/utils';

/**
 * Sellos de veredicto: reemplazan las estrellas de e-commerce con el lenguaje de Mariana.
 * "No me convenció" existe a propósito (contorno punteado): la honestidad es la marca.
 * Todos cumplen contraste AA para texto pequeño (ver docs/fase-1 §3.1).
 */
const stamps: Record<Verdict, { label: string; className: string; rotate: number }> = {
  repite: {
    label: '♡ Sí volvería a comprarlo',
    className: 'border-cereza-ink bg-cereza-tint text-cereza-ink',
    rotate: -3,
  },
  sorprendio: {
    label: '✦ Me sorprendió',
    className: 'border-azul bg-azul-tint text-azul',
    rotate: 2,
  },
  'vale-la-pena': {
    label: 'Vale la pena',
    className: 'border-rosa-ink bg-rosa-tint text-rosa-ink',
    rotate: -2,
  },
  'se-queda': {
    label: '♡ Esto se queda conmigo',
    className: 'border-cereza bg-cereza text-white',
    rotate: 3,
  },
  volveria: {
    label: 'Lo volvería a visitar',
    className: 'border-azul bg-white text-azul',
    rotate: -1.5,
  },
  'no-convencio': {
    label: 'No me convenció',
    className: 'border-dashed border-ink-soft bg-transparent text-ink-soft',
    rotate: 1.5,
  },
};

type Props = { verdict: Verdict; className?: string };

export function VerdictStamp({ verdict, className }: Props) {
  const stamp = stamps[verdict];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border-2 px-3.5 py-1.5 text-[0.82rem] font-medium leading-tight',
        stamp.className,
        className,
      )}
      style={{ rotate: `${stamp.rotate}deg` }}
    >
      {stamp.label}
    </span>
  );
}
