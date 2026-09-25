import type { MetricFormat } from '@soymariana/content';
import { formatMetric } from '@soymariana/core';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

/**
 * Número que cuenta hasta su valor cuando `enabled` pasa a true.
 * El valor final es el estado inicial: con "reducir movimiento" nunca se ve un "0".
 */
export function useCountUp(
  value: number,
  format: MetricFormat,
  enabled: boolean,
  durationMs = 1400,
) {
  const reduce = useReducedMotion();
  const finalText = formatMetric(value, format);
  const [text, setText] = useState(finalText);

  useEffect(() => {
    if (!enabled || reduce) return;
    let frame = 0;
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setText(p < 1 ? formatMetric(value * eased, format) : finalText);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, reduce, value, format, finalText, durationMs]);

  return text;
}
