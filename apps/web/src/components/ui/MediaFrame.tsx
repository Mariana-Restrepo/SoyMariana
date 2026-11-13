import type { ImageRef } from '@soymariana/content';
import type { ReactNode } from 'react';

import { withBase, withBaseSrcSet } from '@/lib/base';
import { cn } from '@/lib/utils';

type Props = {
  image: ImageRef;
  /** Clases del contenedor (aspect-ratio, radios, etc.). */
  className?: string;
  /** Solo para la imagen principal (hero): carga inmediata y prioridad alta. */
  priority?: boolean;
  sizes?: string;
  /** Dónde se dibuja la etiqueta del placeholder. En videos va arriba para no chocar con el ▶. */
  labelAt?: 'center' | 'top';
  children?: ReactNode;
};

/**
 * Foto o, mientras no exista, un bloque de color con la etiqueta [PLACEHOLDER] bien visible.
 * El aspect-ratio lo pone quien lo usa: así nunca hay saltos de layout al cargar.
 */
export function MediaFrame({
  image,
  className,
  priority = false,
  sizes,
  labelAt = 'center',
  children,
}: Props) {
  const tone = image.tone;
  const gradient = `linear-gradient(150deg, var(--tone-${tone}-from), var(--tone-${tone}-to))`;
  const hasSrc = !!image.src;

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ background: gradient }}>
      {hasSrc ? (
        <img
          src={withBase(image.src)}
          srcSet={withBaseSrcSet(image.srcSet)}
          sizes={sizes}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={image.alt}
          className={cn(
            'absolute inset-0 grid bg-[repeating-linear-gradient(135deg,rgb(255_255_255_/_0.45)_0_14px,rgb(255_255_255_/_0.12)_14px_28px)] p-3 text-[0.72rem] font-medium tracking-[0.1em] text-ink-soft',
            labelAt === 'top'
              ? 'place-items-start justify-items-start'
              : 'place-items-center text-center',
          )}
        >
          <span className={cn(labelAt === 'top' && 'rounded-pill bg-white px-3 py-1')}>
            {image.placeholder}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
