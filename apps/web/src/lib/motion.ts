import { motion as tokens } from '@soymariana/tokens';

/** Presets de movimiento derivados de los tokens (mismos valores que usará la app móvil). */
export const ease = tokens.easing.outSoft as unknown as [number, number, number, number];
export const easeInOut = tokens.easing.inOutSoft as unknown as [number, number, number, number];

export const seconds = {
  fast: tokens.duration.fast / 1000,
  base: tokens.duration.base / 1000,
  slow: tokens.duration.slow / 1000,
};

export const RISE = tokens.rise;
export const STAGGER = tokens.stagger / 1000;
