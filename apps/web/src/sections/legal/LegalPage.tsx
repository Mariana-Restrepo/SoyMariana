import { disclosures, links } from '@soymariana/content';
import { legal } from '@soymariana/content/legal';
import { fillLegalText, type LegalSlug } from '@soymariana/core';

import { DisclosureTag } from '@/components/brand/DisclosureTag';
import { withBase } from '@/lib/base';
import { safeMailto } from '@/lib/utils';

const bullet =
  "relative pl-6 before:absolute before:left-0 before:text-cereza-ink before:content-['♡']";

/**
 * Política de privacidad o términos de uso. Todo el texto sale de packages/content (legal.json):
 * para cambiarlo se edita el JSON, no este componente.
 */
export function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = slug === 'privacidad' ? legal.privacy : legal.terms;
  const other =
    slug === 'privacidad'
      ? { href: withBase('/terminos'), label: legal.terms.title }
      : { href: withBase('/privacidad'), label: legal.privacy.title };

  const values = {
    name: legal.controller.name,
    place: legal.controller.place,
    email: links.email,
  };
  const fill = (text: string) => fillLegalText(text, values);
  const mail = safeMailto(links.email);

  return (
    <article aria-labelledby="legal-title" className="wrap py-[clamp(2.5rem,7vw,5rem)]">
      <div className="max-w-[44rem]">
        <p className="mb-4 text-eyebrow font-medium uppercase tracking-[0.14em] text-ink-soft">
          Soy Mariana
        </p>
        <h1 id="legal-title" className="text-h2">
          {doc.title}
        </h1>
        <p className="mt-2 text-[0.9rem] text-ink-soft">Actualizado: {legal.updatedAt}</p>
        <p className="mt-6 text-lead">{doc.intro}</p>

        <nav
          aria-label="En esta página"
          className="mt-8 rounded-lg bg-rosa-tint p-5 text-[0.95rem]"
        >
          <p className="mb-2 text-eyebrow font-medium uppercase tracking-[0.14em] text-ink-soft">
            En esta página
          </p>
          <ol className="list-inside list-decimal space-y-1">
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="underline underline-offset-4">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {doc.sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="mt-10 scroll-mt-24"
          >
            <h2 id={`${section.id}-title`} className="mb-3 text-h3">
              {index + 1}. {section.title}
            </h2>
            <div className="space-y-3 text-body">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{fill(paragraph)}</p>
              ))}

              {section.list && (
                <ul className="space-y-1.5">
                  {section.list.map((item) => (
                    <li key={item} className={bullet}>
                      {fill(item)}
                    </li>
                  ))}
                </ul>
              )}

              {section.showDisclosures && (
                <dl className="space-y-4 rounded-lg bg-white p-5 shadow-soft">
                  {disclosures.items.map((item) => (
                    <div key={item.key}>
                      <dt>
                        <DisclosureTag disclosure={item.key} />
                      </dt>
                      <dd className="mt-1.5 text-[0.95rem] text-ink-soft">{item.description}</dd>
                    </div>
                  ))}
                  <div>
                    <dt className="font-medium">{disclosures.affiliate.label}</dt>
                    <dd className="mt-1 text-[0.95rem] text-ink-soft">
                      {disclosures.affiliate.description}
                    </dd>
                  </div>
                </dl>
              )}

              {section.closing && <p>{fill(section.closing)}</p>}
            </div>
          </section>
        ))}

        <section aria-labelledby="contacto-title" className="mt-10 scroll-mt-24">
          <h2 id="contacto-title" className="mb-3 text-h3">
            Contacto
          </h2>
          <p className="text-body">
            {legal.controller.name} · {legal.controller.place}
            <br />
            Correo:{' '}
            {mail ? (
              <a href={mail} className="underline underline-offset-4">
                {links.email}
              </a>
            ) : (
              links.email
            )}
            {legal.controller.phone && (
              <>
                <br />
                Teléfono: {legal.controller.phone}
              </>
            )}
          </p>
        </section>

        <p className="mt-10 border-t border-ink/15 pt-6 text-[0.95rem]">
          También te puede interesar:{' '}
          <a href={other.href} className="underline underline-offset-4">
            {other.label}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
