import { profile } from '@soymariana/content';
import { seededRotation } from '@soymariana/core';

import { Reveal } from '@/components/brand/Reveal';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Eyebrow, Section } from '@/components/ui/Section';

/** Historia visual: una frase central + tarjetas con foto y una sola línea cada una. */
export function AboutSection() {
  return (
    <Section id="sobre-mi" labelledBy="sobre-mi-title" tone="rosa">
      <Reveal>
        <Eyebrow>Sobre mí</Eyebrow>
        <h2
          id="sobre-mi-title"
          className="mb-10 max-w-[20ch] font-serif text-[clamp(2rem,6.2vw,4.4rem)] leading-[1.08]"
        >
          {profile.aboutTitle} <em className="text-cereza-ink">{profile.aboutEmphasis}</em>{' '}
          {profile.aboutSuffix}
        </h2>
      </Reveal>

      {/* Scroll horizontal con snap: se desliza en móvil y con trackpad/teclado en desktop. */}
      {/* Región desplazable: debe poder enfocarse para desplazarla con el teclado. */}
      <div
        role="region"
        aria-label="Mi historia, desliza para ver más"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-6 pt-2"
      >
        {profile.story.map((card) => (
          <article
            key={card.label}
            className="w-[min(74vw,290px)] shrink-0 snap-start rounded-lg bg-white p-3 pb-[22px] shadow-soft transition duration-500 ease-out-soft hover:-translate-y-1 hover:rotate-0"
            style={{ rotate: `${seededRotation(card.label, 1.6)}deg` }}
          >
            <MediaFrame
              image={card.image}
              className="mb-3.5 aspect-[4/5] rounded-md"
              sizes="290px"
            />
            <p className="mx-1.5 mb-1 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-cereza-ink">
              {card.label}
            </p>
            <p className="mx-1.5 font-serif text-[1.35rem] leading-tight">{card.text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
