import type { MetricsFile } from '@soymariana/content';
import { formatPercent } from '@soymariana/core';

import { Reveal } from '@/components/brand/Reveal';
import { cn } from '@/lib/utils';

type Audience = NonNullable<MetricsFile['audience']>;

/**
 * Quién me acompaña: edad, país y género en barras de porcentaje.
 * Los valores están siempre en texto (las barras son solo apoyo visual), y cada grupo
 * indica de quién son los datos: seguidores o espectadores.
 */
export function AudienceBlock({ audience }: { audience: Audience }) {
  return (
    <div className="mt-14">
      <Reveal>
        <h3 id="audiencia-title" className="text-h3">
          {audience.title}
        </h3>
      </Reveal>

      <ul aria-labelledby="audiencia-title" className="mt-6 grid gap-4 md:grid-cols-3">
        {audience.groups.map((group, groupIndex) => {
          const top = Math.max(...group.items.map((item) => item.value));
          return (
            <li key={group.id}>
              <Reveal index={groupIndex} className="h-full">
                <div className="h-full rounded-lg bg-white px-6 pb-6 pt-6 shadow-soft">
                  <h4 className="font-serif text-[1.35rem] leading-tight">{group.title}</h4>
                  <p className="mt-1 text-[0.9rem] text-ink-soft">{group.caption}</p>

                  <ul className="mt-5 space-y-3.5">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <div className="flex items-baseline justify-between gap-3 text-[0.95rem]">
                          <span>{item.label}</span>
                          <span
                            className={cn(
                              'tabular-nums',
                              item.value === top && 'font-medium text-cereza-ink',
                            )}
                          >
                            {formatPercent(item.value)}
                          </span>
                        </div>
                        <div
                          aria-hidden="true"
                          className="mt-1.5 h-2 overflow-hidden rounded-pill bg-ink/10"
                        >
                          <div
                            className={cn(
                              'h-full min-w-[3px] rounded-pill',
                              item.value === top ? 'bg-cereza' : 'bg-rosa',
                            )}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
