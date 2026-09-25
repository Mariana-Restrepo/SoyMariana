import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

import { ease, seconds } from '@/lib/motion';

type Props = { words: readonly string[]; intervalMs?: number };

/**
 * Palabra que cambia suavemente (pruebo → descubro → recomiendo).
 * Es decorativa: el lector de pantalla recibe una frase estática, y con
 * prefers-reduced-motion se queda quieta en la primera palabra.
 */
export function WordRotator({ words, intervalMs = 2600 }: Props) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => window.clearInterval(id);
  }, [reduce, words.length, intervalMs]);

  return (
    <>
      <span className="sr-only">Yo {words.join(', ')}.</span>
      <span
        aria-hidden="true"
        className="flex items-baseline gap-2 text-[clamp(1.15rem,3vw,1.5rem)]"
      >
        Yo
        <span className="relative inline-block min-w-[9ch] font-serif text-[1.5em] italic text-cereza-ink">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={words[index]}
              className="inline-block"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: seconds.base, ease }}
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </>
  );
}
