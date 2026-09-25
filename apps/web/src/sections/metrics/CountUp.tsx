import type { MetricFormat } from '@soymariana/content';
import { formatMetric } from '@soymariana/core';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type Props = { value: number; format: MetricFormat; className?: string };

/**
 * Número que cuenta al entrar en pantalla. El valor final está siempre en el HTML
 * (lector de pantalla, sin JS y reduced-motion ven el número real, nunca "0").
 */
export function CountUp({ value, format, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const finalText = formatMetric(value, format);
  const [display, setDisplay] = useState(finalText);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(formatMetric(v, format)),
      onComplete: () => setDisplay(finalText),
    });
    return () => controls.stop();
  }, [inView, reduce, value, format, finalText]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{finalText}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
