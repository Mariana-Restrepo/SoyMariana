/** Escala de 4 pt. */
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
  24: 96,
  36: 144,
} as const;

export const layout = {
  maxWidth: 1160,
  /** Gutter fluido (web). */
  gutter: 'clamp(16px, 5vw, 40px)',
  /** Ritmo vertical entre secciones (web). */
  section: 'clamp(4rem, 10vw, 8.5rem)',
  headerHeight: 68,
  headerHeightCompact: 54,
  /** Tamaño mínimo de objetivo táctil (WCAG 2.2 AA recomienda 44). */
  touchTarget: 44,
} as const;
