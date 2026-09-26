import { categories, type Recommendation } from '@soymariana/content';
import { seededRotation } from '@soymariana/core';

import { DisclosureTag } from '@/components/brand/DisclosureTag';
import { VerdictStamp } from '@/components/brand/VerdictStamp';
import { MediaFrame } from '@/components/ui/MediaFrame';

const ratio = ['aspect-[4/5]', 'aspect-square', 'aspect-[4/3]'] as const;

type Props = { recommendation: Recommendation; index: number; onOpen: (slug: string) => void };

/** Tarjeta tipo "foto pegada": toda la tarjeta abre el detalle (botón estirado en el título). */
export function RecommendationCard({ recommendation: rec, index, onOpen }: Props) {
  const categoryName = categories.find((c) => c.key === rec.category)?.name ?? rec.category;

  return (
    <article
      className="group relative mb-[18px] break-inside-avoid rounded-lg bg-white p-3 pb-[18px] shadow-soft transition duration-500 ease-out-soft hover:-translate-y-1 hover:rotate-0 hover:shadow-lift has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-azul"
      style={{ rotate: `${seededRotation(rec.id, 1.6)}deg` }}
    >
      <div className="relative">
        <MediaFrame
          image={rec.image}
          className={`${ratio[index % ratio.length]} rounded-md`}
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw"
        />
        <VerdictStamp verdict={rec.verdict} className="absolute -bottom-3.5 left-2.5" />
      </div>
      <p className="mx-1.5 mb-1 mt-7 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ink-soft">
        {categoryName}
      </p>
      <h3 className="mx-1.5 mb-1 text-[1.55rem] leading-tight">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => onOpen(rec.slug)}
          className="text-left after:absolute after:inset-0 after:z-[1] focus-visible:outline-none"
        >
          {rec.name}
        </button>
      </h3>
      <p className="mx-1.5 text-[0.95rem] leading-relaxed text-ink-soft">“{rec.opinion}”</p>
      {rec.disclosure && (
        <div className="mx-1.5 mt-3">
          <DisclosureTag disclosure={rec.disclosure} />
        </div>
      )}
    </article>
  );
}
