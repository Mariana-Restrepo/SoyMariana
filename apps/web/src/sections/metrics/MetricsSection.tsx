import { metrics } from '@soymariana/content';

import { Heart, Sparkle } from '@/components/brand/Doodles';
import { Reveal } from '@/components/brand/Reveal';
import { Eyebrow, Section } from '@/components/ui/Section';
import { cn, isDev } from '@/lib/utils';

import { CountUp } from './CountUp';

const toneBg = {
  rosa: 'bg-rosa-tint',
  azul: 'bg-azul-tint',
  cereza: 'bg-cereza-tint',
  crema: 'bg-paper',
} as const;

/**
 * Números grandes y honestos. Solo se muestran las métricas que existen en metrics.json:
 * nada se inventa. Las "pendientes" (audiencia, ciudades, engagement…) quedan ocultas
 * en producción y solo se ven en desarrollo para recordar qué falta.
 */
export function MetricsSection() {
  return (
    <Section id="numeros" labelledBy="numeros-title">
      <Reveal>
        <Eyebrow>Los números</Eyebrow>
        <h2 id="numeros-title" className="text-h2">
          Sin <em>maquillaje</em>
        </h2>
      </Reveal>

      <ul className="mt-9 grid gap-4 md:grid-cols-3">
        {metrics.metrics.map((metric, i) => (
          <li key={metric.id}>
            <Reveal index={i} className="h-full">
              <div
                className={cn(
                  'relative h-full overflow-hidden rounded-lg px-6 pb-6 pt-7',
                  toneBg[metric.tone],
                )}
              >
                {i % 2 === 0 ? (
                  <Heart className="absolute right-3.5 top-3 size-6 text-cereza opacity-80" />
                ) : (
                  <Sparkle className="absolute right-3.5 top-3 size-6 text-azul opacity-80" />
                )}
                <CountUp
                  value={metric.value}
                  format={metric.format}
                  className="block font-serif text-number"
                />
                <p className="mt-2">{metric.label}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal>
        <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9rem] text-ink-soft">
          <span className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-1.5 shadow-soft">
            <span aria-hidden="true" className="size-2 rounded-full bg-cereza" />
            Actualizado: {metrics.updatedAt}
          </span>
          {metrics.note && <span>{metrics.note}</span>}
        </p>
      </Reveal>

      {isDev && metrics.pending.length > 0 && (
        <div className="mt-6 rounded-md border-[1.5px] border-dashed border-ink/30 p-4 text-[0.88rem] text-ink-soft">
          <strong className="font-medium text-ink">Solo en desarrollo:</strong> estructura lista y
          oculta en producción hasta tener datos reales.
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {metrics.pending.map((item) => (
              <li
                key={item}
                className="rounded-pill px-3 py-0.5 shadow-[inset_0_0_0_1px_rgb(43_31_38_/_0.25)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
