import { legal } from '@soymariana/content/legal';
import type { LegalSlug } from '@soymariana/core';
import { useEffect } from 'react';

import { Footer } from '@/components/layout/Footer';
import { withBase } from '@/lib/base';
import { LegalPage } from '@/sections/legal/LegalPage';

/**
 * Páginas legales (/privacidad y /terminos). Se cargan aparte (import dinámico en main.tsx):
 * quien entra a la página principal no descarga estos textos.
 */
export function LegalApp({ slug }: { slug: LegalSlug }) {
  const doc = slug === 'privacidad' ? legal.privacy : legal.terms;

  // El HTML es el mismo de la página principal: ajusta título, descripción y canonical a esta página.
  useEffect(() => {
    document.title = `${doc.title} · Soy Mariana`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', doc.description);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      const url = new URL(canonical.href);
      url.pathname = `/${slug}`;
      canonical.href = url.toString();
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', url.toString());
    }
  }, [doc, slug]);

  return (
    <>
      <a
        href="#main"
        className="fixed left-3 top-3 z-[70] -translate-y-24 rounded-pill bg-ink px-4 py-2.5 text-white transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <header className="border-b border-ink/10">
        <div className="wrap flex items-center justify-between gap-4 py-4">
          <a href={withBase('/')} className="flex items-baseline gap-1.5 font-serif text-[1.6rem] no-underline">
            <em className="text-[0.95em]">Soy</em>
            <span>Mariana</span>
            <span
              aria-hidden="true"
              className="inline-block -translate-y-[0.25em] text-[0.6em] not-italic text-cereza"
            >
              ♡
            </span>
          </a>
          <a
            href={withBase('/')}
            className="inline-flex min-h-11 items-center text-[0.95rem] underline underline-offset-4"
          >
            ← Volver al inicio
          </a>
        </div>
      </header>
      <main id="main">
        <LegalPage slug={slug} />
      </main>
      <Footer />
    </>
  );
}
