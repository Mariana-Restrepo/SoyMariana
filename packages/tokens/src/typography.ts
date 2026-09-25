/**
 * Tipografía: ligera y sin negritas. El peso 700 no existe en el sistema.
 * Títulos: Instrument Serif (solo peso regular + itálica).
 * Texto: DM Sans 300/400/500. Notas a mano: Caveat 500 (muy poco).
 */
export const fontFamily = {
  serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  sans: "'DM Sans Variable', 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  hand: "'Caveat', 'Bradley Hand', cursive",
} as const;

export const fontWeight = { light: 300, regular: 400, medium: 500 } as const;

/** Tamaños fluidos para web (móvil primero). */
export const fontSizeFluid = {
  hero: { size: 'clamp(2.7rem, 9vw, 6.2rem)', lineHeight: '1.04' },
  h2: { size: 'clamp(2.1rem, 6vw, 3.8rem)', lineHeight: '1.04' },
  h3: { size: '1.55rem', lineHeight: '1.1' },
  lead: { size: 'clamp(1.05rem, 2.4vw, 1.25rem)', lineHeight: '1.55' },
  body: { size: '1.0625rem', lineHeight: '1.6' },
  small: { size: '0.9rem', lineHeight: '1.5' },
  eyebrow: { size: '0.78rem', lineHeight: '1' },
  huge: { size: 'clamp(3.6rem, 15vw, 10rem)', lineHeight: '0.95' },
  number: { size: 'clamp(3.6rem, 11vw, 6rem)', lineHeight: '1' },
} as const;

/** Tamaños en px para React Native (equivalentes de los fluidos). */
export const fontSizeNative = {
  hero: 44,
  h2: 34,
  h3: 25,
  lead: 18,
  body: 17,
  small: 14,
  eyebrow: 12,
  huge: 58,
  number: 58,
} as const;
