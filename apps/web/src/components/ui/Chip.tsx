import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

type ChipProps = ComponentPropsWithoutRef<'button'> & { pressed?: boolean };

/** Chip de filtro: alterna con `aria-pressed`. Alto táctil de 44 px. */
export function Chip({ pressed = false, className, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center rounded-pill px-4 text-[0.9rem] font-normal transition duration-300 ease-out-soft',
        pressed
          ? 'bg-ink text-paper'
          : 'shadow-[inset_0_0_0_1.5px_rgb(43_31_38_/_0.25)] hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]',
        className,
      )}
      {...props}
    />
  );
}
