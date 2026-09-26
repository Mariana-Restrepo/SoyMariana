import { categories, type Recommendation } from '@soymariana/content';

import { AffiliateNote, DisclosureTag, DisclosureText } from '@/components/brand/DisclosureTag';
import { VerdictStamp } from '@/components/brand/VerdictStamp';
import { ButtonLink } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { externalProps, safeHref } from '@/lib/utils';

type Props = { recommendation: Recommendation | null; onClose: () => void };

/** Detalle de una recomendación (overlay con link propio: /?r=slug). */
export function RecommendationDialog({ recommendation: rec, onClose }: Props) {
  const link = safeHref(rec?.link);
  const categoryName = rec
    ? (categories.find((c) => c.key === rec.category)?.name ?? rec.category)
    : '';

  return (
    <Dialog open={!!rec} onClose={onClose} labelledBy="rec-dialog-title">
      {rec && (
        <div>
          <MediaFrame image={rec.image} className="mb-4 aspect-[16/10] rounded-md" sizes="560px" />
          <p className="mb-2 text-eyebrow font-medium uppercase tracking-[0.14em] text-ink-soft">
            {categoryName}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <VerdictStamp verdict={rec.verdict} />
            {rec.disclosure && <DisclosureTag disclosure={rec.disclosure} />}
          </div>
          <h2 id="rec-dialog-title" className="my-2 text-[2.2rem] leading-none">
            {rec.name}
          </h2>
          <p className="text-ink">“{rec.opinion}”</p>
          {rec.disclosure && <DisclosureText disclosure={rec.disclosure} className="mt-2.5" />}

          {rec.liked.length > 0 && (
            <>
              <h3 className="mt-4 text-[1.4rem]">Lo que me gustó</h3>
              <ul className="mb-3 mt-1 space-y-1 text-[0.95rem]">
                {rec.liked.map((item) => (
                  <li
                    key={item}
                    className="relative pl-6 before:absolute before:left-0 before:text-cereza-ink before:content-['♡']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
          {rec.disliked.length > 0 && (
            <>
              <h3 className="text-[1.4rem]">Lo que no tanto</h3>
              <ul className="mb-4 mt-1 space-y-1 text-[0.95rem]">
                {rec.disliked.map((item) => (
                  <li
                    key={item}
                    className="relative pl-6 before:absolute before:left-0 before:text-ink-soft before:content-['–']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          {link ? (
            <>
              <ButtonLink variant="rosa" href={link} {...externalProps(link)}>
                {rec.linkLabel ?? 'Ver más'} ↗
              </ButtonLink>
              {rec.affiliate && <AffiliateNote className="mt-3" />}
            </>
          ) : rec.link ? (
            <p className="text-[0.85rem] text-ink-soft">Enlace pendiente de agregar.</p>
          ) : null}
        </div>
      )}
    </Dialog>
  );
}
