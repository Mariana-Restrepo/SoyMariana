import { cn } from '@/lib/utils';

type Props = { className?: string };

/** Corazón trazado (misma forma que el ícono de la marca). Decorativo. */
export function Heart({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn('fill-current', className)}>
      <path d="M32 51 C11 37 9 22 20 16 C26 12.5 31 15.5 32 20 C33 15.5 38 12.5 44 16 C55 22 53 37 32 51 Z" />
    </svg>
  );
}

/** Estrellita de cuatro puntas. Decorativa. */
export function Sparkle({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('fill-current', className)}>
      <path d="M12 1.5c.6 5.4 3.8 9.1 10.5 10.5-6.7 1.4-9.9 5.1-10.5 10.5C11.4 17.1 8.2 13.4 1.5 12 8.200 10.6 11.400 6.900 12 1.500Z" />
    </svg>
  );
}

/** Flechita dibujada a mano hacia abajo. Decorativa. */
export function ArrowDown({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 40"
      aria-hidden="true"
      className={cn('fill-none stroke-current', className)}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2c-3 9-1 19 0 34M5 28l7 9 7-9" />
    </svg>
  );
}
