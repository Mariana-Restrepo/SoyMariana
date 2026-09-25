/**
 * Paleta de Soy Mariana.
 * Regla: el color es un evento, no el ambiente. Un color dominante por sección.
 * Contrastes verificados (WCAG) en docs/fase-1, §3.1.
 */
export const palette = {
  paper: '#FFFAF6',
  ink: '#2B1F26',
  inkSoft: '#6B5A63',

  rosa: '#FF8DB5',
  rosaTint: '#FFE1EA',
  /** Solo texto grande (≥ 24 px) o gráficos: 4.0 sobre paper. */
  rosaDeep: '#D9457F',
  /** Texto pequeño sobre rosaTint (5.9:1). */
  rosaInk: '#9C2A5B',

  cereza: '#D92B3F',
  cerezaTint: '#FFD9D8',
  /** Texto pequeño sobre cerezaTint o paper (5.7:1 / 7.2:1). El cereza puro solo va en botones con texto blanco. */
  cerezaInk: '#A61B2C',

  azul: '#2F55E0',
  azulTint: '#DCE5FF',

  white: '#FFFFFF',
} as const;

/** Tonos suaves para degradados de fotos / placeholders. */
export const tones = {
  rosa: { from: '#FFE1EA', to: '#FF8DB5' },
  cereza: { from: '#FFD9D8', to: '#FF9AA3' },
  azul: { from: '#DCE5FF', to: '#9DB3FF' },
  crema: { from: '#F3EBE6', to: '#D9CFCA' },
} as const;

export type ToneName = keyof typeof tones;

/** Colores semánticos: los componentes usan estos nombres, no los hex. */
export const semantic = {
  bg: palette.paper,
  text: palette.ink,
  textMuted: palette.inkSoft,
  accent: palette.rosa,
  brand: palette.cereza,
  focus: palette.azul,
  danger: palette.cereza,
  success: palette.azul,
} as const;

export type PaletteName = keyof typeof palette;
