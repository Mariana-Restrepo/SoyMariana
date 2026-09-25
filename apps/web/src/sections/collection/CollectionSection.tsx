import { categories, places, recommendations } from '@soymariana/content';
import {
  categoriesWithItems,
  filterByCategory,
  track,
  type CategoryFilter,
} from '@soymariana/core';
import { useMemo } from 'react';

import { Reveal } from '@/components/brand/Reveal';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Eyebrow, Section } from '@/components/ui/Section';
import { useDeepLink } from '@/hooks/use-deep-link';

import { PlaceCard } from './PlaceCard';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationDialog } from './RecommendationDialog';

type Props = { filter: CategoryFilter; onFilterChange: (filter: CategoryFilter) => void };

export function CollectionSection({ filter, onFilterChange }: Props) {
  const [openSlug, setOpenSlug] = useDeepLink('r');

  const chips = useMemo(() => categoriesWithItems(categories, [...recommendations, ...places]), []);
  const recs = useMemo(() => filterByCategory(recommendations, filter), [filter]);
  const spots = useMemo(() => filterByCategory(places, filter), [filter]);
  const openRec = recommendations.find((r) => r.slug === openSlug) ?? null;

  return (
    <Section id="coleccion" labelledBy="coleccion-title" className="pt-0">
      <Reveal>
        <Eyebrow>Mi colección</Eyebrow>
        <h2 id="coleccion-title" className="text-h2">
          Esto sí <em>te lo recomiendo</em>
        </h2>
        <p className="mt-2.5 text-lead text-ink-soft">(Y lo que no, también te lo cuento.)</p>
      </Reveal>

      <div
        role="group"
        aria-label="Filtrar por categoría"
        className="no-scrollbar -mx-0.5 mt-6 flex gap-2 overflow-x-auto px-0.5 pb-2.5 pt-1"
      >
        <Chip pressed={filter === 'all'} onClick={() => onFilterChange('all')}>
          Todo
        </Chip>
        {chips.map((category) => (
          <Chip
            key={category.key}
            pressed={filter === category.key}
            onClick={() => {
              onFilterChange(category.key);
              track('collection_filter', { category: category.key });
            }}
          >
            <span aria-hidden="true">{category.emoji}</span>&nbsp;{category.name}
          </Chip>
        ))}
      </div>

      {recs.length > 0 && (
        <div className="mt-5 columns-1 gap-[18px] sm:columns-2 lg:columns-3">
          {recs.map((rec, i) => (
            <Reveal key={rec.id} index={i % 3} className="break-inside-avoid">
              <RecommendationCard
                recommendation={rec}
                index={i}
                onOpen={(slug) => {
                  setOpenSlug(slug);
                  track('recommendation_open', { slug });
                }}
              />
            </Reveal>
          ))}
        </div>
      )}

      {recs.length === 0 && spots.length === 0 && (
        <div className="mt-8 rounded-lg bg-rosa-tint p-8 text-center">
          <p className="font-serif text-[1.6rem] italic">Todavía no he probado nada de esto. ✿</p>
          <Button variant="quiet" className="mt-4" onClick={() => onFilterChange('all')}>
            Ver todo
          </Button>
        </div>
      )}

      {spots.length > 0 && (
        <div className="mt-[clamp(4rem,9vw,7rem)]">
          <Reveal>
            <Eyebrow>Mi diario de lugares</Eyebrow>
            <h2 className="text-h2">
              Fui aquí y <em>esto encontré</em>
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-7 md:grid-cols-3 md:gap-[22px]">
            {spots.map((place, i) => (
              <Reveal key={place.id} index={i}>
                <PlaceCard place={place} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <RecommendationDialog recommendation={openRec} onClose={() => setOpenSlug(null)} />
    </Section>
  );
}
