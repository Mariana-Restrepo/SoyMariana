import type { MetricFormat } from '@soymariana/content';

/** 1402 → "1.402" (sin depender de Intl, que varía entre navegadores y Hermes). */
export function formatInt(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 10300 → "10,3K" · 1500000 → "1,5M" · 950 → "950". */
export function formatCompact(value: number): string {
  const trim = (n: number) => n.toFixed(1).replace('.', ',').replace(/,0$/, '');
  if (value >= 1_000_000) return `${trim(value / 1_000_000)}M`;
  if (value >= 1_000) return `${trim(value / 1_000)}K`;
  return formatInt(value);
}

/** 2000 → "~2.000". */
export function formatApprox(value: number): string {
  return `~${formatInt(value)}`;
}

export function formatMetric(value: number, format: MetricFormat): string {
  switch (format) {
    case 'compact':
      return formatCompact(value);
    case 'approx':
      return formatApprox(value);
    case 'int':
      return formatInt(value);
  }
}
