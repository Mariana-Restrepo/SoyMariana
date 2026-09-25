/** Móvil primero: estos son mínimos (min-width). */
export const breakpoints = { sm: 480, md: 768, lg: 1024, xl: 1280 } as const;

export const motion = {
  /** Duraciones en ms. */
  duration: { fast: 150, base: 280, slow: 500, ambient: 7000 },
  /** Curvas cubic-bezier. */
  easing: {
    outSoft: [0.22, 1, 0.36, 1],
    inOutSoft: [0.65, 0, 0.35, 1],
  },
  /** Distancia de entrada (px) para fade + subida. */
  rise: 16,
  /** Retraso entre hijos escalonados (ms). */
  stagger: 70,
} as const;

export const zIndex = {
  base: 0,
  floatingCta: 30,
  sheet: 35,
  header: 40,
  modal: 50,
  toast: 60,
} as const;
