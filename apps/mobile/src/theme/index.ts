import { fontSizeNative, palette, radii, shadowsNative, spacing, tones } from '@soymariana/tokens';

/**
 * Tema de la app móvil: todo sale de @soymariana/tokens (mismo sistema de diseño que la web).
 * Nunca escribas un color o tamaño suelto en un componente: agrégalo a los tokens.
 */
export const colors = palette;
export { radii, shadowsNative as shadows, spacing, tones };

/** Nombres de las fuentes tal como las registra expo-font (ver app/_layout.tsx). */
export const fonts = {
  serif: 'InstrumentSerif_400Regular',
  serifItalic: 'InstrumentSerif_400Regular_Italic',
  sansLight: 'DMSans_300Light',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  hand: 'Caveat_500Medium',
} as const;

/** Variantes de texto. Ligero y sin negritas: el peso 700 no existe en el sistema. */
export const textStyles = {
  hero: { fontFamily: fonts.serif, fontSize: fontSizeNative.hero, lineHeight: 43 },
  h2: { fontFamily: fonts.serif, fontSize: fontSizeNative.h2, lineHeight: 37 },
  h3: { fontFamily: fonts.serif, fontSize: fontSizeNative.h3, lineHeight: 28 },
  lead: { fontFamily: fonts.sansLight, fontSize: fontSizeNative.lead, lineHeight: 27 },
  body: { fontFamily: fonts.sansLight, fontSize: 16, lineHeight: 25 },
  small: { fontFamily: fonts.sans, fontSize: fontSizeNative.small, lineHeight: 21 },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSizeNative.eyebrow,
    lineHeight: 14,
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  },
  label: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20 },
  hand: { fontFamily: fonts.hand, fontSize: 22, lineHeight: 24 },
  number: { fontFamily: fonts.serif, fontSize: fontSizeNative.number, lineHeight: 60 },
} as const;

export type TextVariant = keyof typeof textStyles;

export const layout = {
  /** Margen lateral de las pantallas. */
  gutter: 20,
  /** Alto mínimo táctil (WCAG 2.2 recomienda 44). */
  touch: 44,
  tabBarHeight: 68,
  maxContentWidth: 640,
} as const;
