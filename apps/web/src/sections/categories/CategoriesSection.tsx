import { categories, type CategoryInfo, type CategoryKey } from '@soymariana/content';
import { seededRotation, track } from '@soymariana/core';
import { useState, type MouseEvent } from 'react';

import { Reveal } from '@/components/brand/Reveal';
import { Eyebrow, Section } from '@/components/ui/Section';
import { useCanHover } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

const toneBg: Record<CategoryInfo['tone'], string> = {
  rosa: 'bg-rosa-tint',
  azul: 'bg-azul-tint',
  cereza: 'bg-cereza-tint',
  crema: 'bg-paper',
};

type Props = { onSeeCollection: (category: CategoryKey) => void };

/**
 * Categorías como tarjetas que se expanden (no una lista).
 * Mouse: se abren al pasar el cursor. Táctil/teclado: un toque las abre; una a la vez.
 * Patrón accesible: el título es un botón que se estira sobre toda la tarjeta.
 */
export function CategoriesSection({ onSeeCollection }: Props) {
  const canHover = useCanHover();
  const [openKey, setOpenKey] = useState<CategoryKey | null>(null);

  const onToggle = (key: CategoryKey, event: MouseEvent) => {
    // Con mouse el hover ya la abrió: el clic la mantiene abierta en vez de cerrarla.
    if (canHover && event.detail > 0) {
      setOpenKey(key);
      return;
    }
    setOpenKey((current) => (current === key ? null : key));
    track('category_open', { category: key });
  };

  return (
    <Section id="lo-que-pruebo" labelledBy="categorias-title" className="pt-0">
      <Reveal>
        <Eyebrow>Lo que pruebo</Eyebrow>
        <h2 id="categorias-title" className="max-w-[18ch] text-h2">
          ¿Qué estoy <em>probando</em> últimamente?
        </h2>
      </Reveal>

      <ul className="mt-9 grid grid-cols-2 items-start gap-3.5 md:grid-cols-4 md:gap-[18px]">
        {categories.map((category, i) => {
          const open = openKey === category.key;
          const panelId = `cat-${category.key}`;
          return (
            <li key={category.key}>
              <Reveal index={i % 4}>
                <article
                  onMouseEnter={() => canHover && setOpenKey(category.key)}
                  onMouseLeave={() =>
                    canHover && setOpenKey((k) => (k === category.key ? null : k))
                  }
                  className={cn(
                    'group relative overflow-hidden rounded-lg transition duration-500 ease-out-soft hover:-translate-y-1 hover:rotate-0 hover:shadow-lift has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-azul',
                    toneBg[category.tone],
                  )}
                  style={{ rotate: `${seededRotation(category.key, 1.2)}deg` }}
                >
                  <div
                    aria-hidden="true"
                    className="grid aspect-[1/0.9] place-items-center text-[clamp(2.4rem,7vw,3.4rem)]"
                    style={{
                      background: `linear-gradient(160deg, var(--tone-${category.tone}-from), var(--tone-${category.tone}-to))`,
                    }}
                  >
                    <span
                      className={cn(
                        'inline-block transition-transform duration-500 ease-out-soft group-hover:-rotate-[8deg] group-hover:scale-[1.18]',
                        open && '-rotate-[8deg] scale-[1.18]',
                      )}
                    >
                      {category.emoji}
                    </span>
                  </div>

                  <div className="px-4 pb-4">
                    <h3 className="text-[1.5rem]">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={(event) => onToggle(category.key, event)}
                        className="block w-full text-left after:absolute after:inset-0 after:z-[1] focus-visible:outline-none"
                      >
                        {category.name}
                      </button>
                    </h3>

                    {/* Se expande con grid-rows (sin medir alturas). El contenido cerrado no es enfocable. */}
                    <div
                      id={panelId}
                      className={cn(
                        'grid transition-[grid-template-rows,visibility] duration-500 ease-out-soft',
                        open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
                      )}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="mb-3 mt-1.5 text-[0.92rem] leading-snug">{category.blurb}</p>
                        <ul className="mb-2.5 flex flex-wrap gap-1.5">
                          {category.examples.map((example) => (
                            <li
                              key={example}
                              className="rounded-pill bg-white/70 px-2.5 py-1 text-[0.72rem] font-medium"
                            >
                              {example}
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => onSeeCollection(category.key)}
                          className="relative z-[2] inline-flex min-h-11 items-center text-[0.85rem] font-medium underline underline-offset-[3px]"
                        >
                          Ver en mi colección →
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
