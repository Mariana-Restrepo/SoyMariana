import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { ease, RISE, seconds, STAGGER } from '@/lib/motion';

type RevealProps = {
  children: ReactNode;
  /** Posición dentro de un grupo: escalona la entrada (index × 70 ms). */
  index?: number;
  className?: string;
};

/**
 * Entrada suave: aparece y sube 16 px, una sola vez, al llegar a pantalla.
 * Con prefers-reduced-motion (MotionConfig en App) desaparece el desplazamiento.
 */
export function Reveal({ children, index = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: seconds.slow, ease, delay: index * STAGGER }}
    >
      {children}
    </motion.div>
  );
}
