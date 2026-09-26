import type { Place } from '@soymariana/content';
import { seededRotation } from '@soymariana/core';

import { DisclosureTag } from '@/components/brand/DisclosureTag';
import { VerdictStamp } from '@/components/brand/VerdictStamp';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { externalProps, safeHref } from '@/lib/utils';

type Props = { place: Place };

/** Polaroid del diario de lugares: "Mariana fue aquí y esto fue lo que encontró". */
export function PlaceCard({ place }: Props) {
  const map = safeHref(place.mapUrl);
  const social = safeHref(place.socialUrl);

  return (
    <article
      className="relative rounded-[6px] bg-white px-3.5 pb-5 pt-3.5 shadow-soft transition duration-500 ease-out-soft hover:rotate-0 hover:scale-[1.02]"
      style={{ rotate: `${seededRotation(place.id, 2.4)}deg` }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-[26px] w-[84px] -translate-x-1/2 -rotate-3 bg-rosa/55"
      />
      <MediaFrame
        image={place.image}
        className="aspect-square rounded-[2px]"
        sizes="(min-width: 768px) 30vw, 90vw"
      />
      <p className="mx-1 mb-1 mt-3.5 font-hand text-[1.3rem] leading-none text-cereza-ink">
        {place.city}
      </p>
      <h3 className="mx-1 mb-1.5 text-[1.4rem] leading-tight">{place.name}</h3>
      <p className="mx-1 mb-2 text-[0.92rem] leading-relaxed text-ink-soft">{place.review}</p>

      {place.tried.length > 0 && (
        <>
          <p className="mx-1 mb-1 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ink-soft">
            Lo que probé
          </p>
          <ul className="mx-1 flex flex-wrap gap-1.5">
            {place.tried.map((item) => (
              <li
                key={item}
                className="rounded-pill bg-rosa-tint px-3 py-1 text-[0.72rem] font-medium"
              >
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mx-1 mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <VerdictStamp verdict={place.verdict} />
        {place.disclosure && <DisclosureTag disclosure={place.disclosure} />}
        {(map || social) && (
          <span className="flex gap-4 text-[0.85rem] font-medium">
            {map && (
              <a
                href={map}
                className="inline-flex min-h-11 items-center text-azul underline underline-offset-4"
                {...externalProps(map)}
              >
                Ver ubicación ↗
              </a>
            )}
            {social && (
              <a
                href={social}
                className="inline-flex min-h-11 items-center text-azul underline underline-offset-4"
                {...externalProps(social)}
              >
                En redes ↗
              </a>
            )}
          </span>
        )}
      </div>
    </article>
  );
}
