import { Text, type TextProps } from 'react-native';

import { colors, fonts, textStyles, type TextVariant } from '@/theme';

type Props = TextProps & {
  variant?: TextVariant;
  /** Color del texto (por defecto la tinta cálida, nunca negro puro). */
  color?: string;
};

/** Texto con las variantes del sistema de diseño. */
export function AppText({ variant = 'body', color = colors.ink, style, ...props }: Props) {
  return <Text style={[textStyles[variant], { color }, style]} {...props} />;
}

/** Palabra en cursiva serif (el toque editorial de los títulos). Va dentro de un texto serif. */
export function Em({ style, ...props }: TextProps) {
  return <Text style={[{ fontFamily: fonts.serifItalic }, style]} {...props} />;
}
