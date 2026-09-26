import { disclosures, type DisclosureKey } from '@soymariana/content';

import { cn } from '@/lib/utils';

/**
 * Etiqueta de transparencia: cómo llegó a Mariana lo que recomienda.
 * Es plana y sin inclinación a propósito (no es un sello de opinión como el veredicto): se lee
 * como información. La colaboración pagada es la más marcada porque es publicidad.
 * El texto siempre está escrito: el color nunca es lo único que informa.
 */
const styles: Record<DisclosureKey, string> = {
  propio: 'border-ink/35 bg-white text-ink',
  regalo: 'border-azul bg-azul-tint text-azul',
  invitacion: 'border-rosa-ink bg-rosa-tint text-rosa-ink',
  colaboracion: 'border-ink bg-ink text-paper',
};

type TagProps = { disclosure: DisclosureKey; className?: string };

export function DisclosureTag({ disclosure, className }: TagProps) {
  const info = disclosures.items.find((item) => item.key === disclosure);
  if (!info) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[6px] border px-2.5 py-1.5 text-[0.76rem] font-medium leading-none',
        styles[disclosure],
        className,
      )}
    >
      <span className="sr-only">Transparencia: </span>
      {info.label}
    </span>
  );
}

/** Lo que significa la etiqueta, en una frase (para el detalle de una recomendación). */
export function DisclosureText({ disclosure, className }: TagProps) {
  const info = disclosures.items.find((item) => item.key === disclosure);
  if (!info) return null;
  return (
    <p className={cn('text-[0.85rem] leading-snug text-ink-soft', className)}>
      <span className="font-medium text-ink">{info.label}.</span> {info.description}
    </p>
  );
}

/** Aviso de que el enlace es de afiliado. */
export function AffiliateNote({ className }: { className?: string }) {
  return (
    <p className={cn('text-[0.82rem] leading-snug text-ink-soft', className)}>
      <span className="font-medium text-ink">{disclosures.affiliate.label}.</span>{' '}
      {disclosures.affiliate.description}
    </p>
  );
}
