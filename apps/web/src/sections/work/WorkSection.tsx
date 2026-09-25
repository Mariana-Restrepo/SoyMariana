import { collab, links } from '@soymariana/content';

import { useInquiry } from '@/app/inquiry';
import { Reveal } from '@/components/brand/Reveal';
import { Button } from '@/components/ui/Button';
import { Eyebrow, Section } from '@/components/ui/Section';
import { safeMailto } from '@/lib/utils';

/** Sección para marcas: natural, sin lenguaje corporativo, sin precios. */
export function WorkSection() {
  const { open } = useInquiry();
  const mail = safeMailto(links.email);

  return (
    <Section id="trabajemos" labelledBy="trabajemos-title" tone="cereza">
      <Reveal>
        <Eyebrow light>{collab.eyebrow}</Eyebrow>
        <h2 id="trabajemos-title" className="text-h2">
          {collab.title} <em className="text-rosa-tint">{collab.titleEmphasis}</em>
        </h2>
        <p className="mb-8 mt-5 max-w-[24ch] font-serif text-[clamp(1.4rem,3.6vw,2.1rem)] italic leading-tight">
          {collab.phrase}
        </p>
      </Reveal>

      <div className="grid gap-9 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-14">
        <Reveal index={1}>
          <h3 className="mb-3 font-sans text-eyebrow font-medium uppercase tracking-[0.14em]">
            {collab.audiencesTitle}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {collab.audiences.map((audience) => (
              <li
                key={audience}
                className="rounded-pill border-[1.5px] border-white/75 px-4 py-2 text-[0.92rem] font-normal transition duration-300 hover:bg-white hover:text-cereza-ink"
              >
                {audience}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
            <Button variant="paper" onClick={() => open('work')}>
              Quiero trabajar con Mariana
            </Button>
            <span>
              o escríbeme a{' '}
              {mail ? (
                <a href={mail} className="underline underline-offset-4">
                  {links.email}
                </a>
              ) : (
                <span className="underline decoration-dotted underline-offset-4">
                  {links.email}
                </span>
              )}
            </span>
          </div>
        </Reveal>

        <Reveal index={2}>
          <h3 className="mb-3 font-sans text-eyebrow font-medium uppercase tracking-[0.14em]">
            {collab.formatsTitle}
          </h3>
          <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {collab.formats.map((format, i) => (
              <li
                key={format.id}
                className="flex min-h-[104px] flex-col justify-between gap-2.5 rounded-md bg-white/12 p-4 text-[0.92rem] leading-tight transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:bg-white/20"
              >
                <span aria-hidden="true" className="font-serif text-[1.7rem] leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {format.title}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
