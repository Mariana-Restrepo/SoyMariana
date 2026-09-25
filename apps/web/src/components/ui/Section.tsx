import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type SectionTone = 'paper' | 'rosa' | 'azul' | 'cereza';

const tones: Record<SectionTone, string> = {
  paper: '',
  rosa: 'bg-rosa-tint',
  azul: 'bg-azul-tint',
  cereza: 'bg-cereza text-white',
};

type SectionProps = {
  id: string;
  /** id del título (h2) que nombra la sección. */
  labelledBy: string;
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
};

/** Sección de la página: ritmo vertical fluido, gutter y landmark accesible. */
export function Section({ id, labelledBy, tone = 'paper', className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative overflow-x-clip py-[var(--section-y)]', tones[tone], className)}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}

type EyebrowProps = { children: ReactNode; light?: boolean; className?: string };

export function Eyebrow({ children, light = false, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'mb-4 block text-eyebrow font-medium uppercase tracking-[0.14em]',
        light ? 'text-white' : 'text-ink-soft',
        className,
      )}
    >
      {children}
    </span>
  );
}
