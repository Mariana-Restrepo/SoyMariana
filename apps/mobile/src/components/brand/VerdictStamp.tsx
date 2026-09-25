import type { Verdict } from '@soymariana/content';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radii } from '@/theme';

/**
 * Sellos de veredicto (mismo vocabulario que la web). "No me convenció" existe a propósito
 * (contorno punteado): la honestidad es la marca. Todos cumplen contraste AA en texto pequeño.
 */
const stamps: Record<
  Verdict,
  { label: string; fg: string; bg: string; border: string; dashed?: boolean; rotate: number }
> = {
  repite: {
    label: '♡ Sí volvería a comprarlo',
    fg: colors.cerezaInk,
    bg: colors.cerezaTint,
    border: colors.cerezaInk,
    rotate: -3,
  },
  sorprendio: {
    label: '✦ Me sorprendió',
    fg: colors.azul,
    bg: colors.azulTint,
    border: colors.azul,
    rotate: 2,
  },
  'vale-la-pena': {
    label: 'Vale la pena',
    fg: colors.rosaInk,
    bg: colors.rosaTint,
    border: colors.rosaInk,
    rotate: -2,
  },
  'se-queda': {
    label: '♡ Esto se queda conmigo',
    fg: colors.white,
    bg: colors.cereza,
    border: colors.cereza,
    rotate: 3,
  },
  volveria: {
    label: 'Lo volvería a visitar',
    fg: colors.azul,
    bg: colors.white,
    border: colors.azul,
    rotate: -1.5,
  },
  'no-convencio': {
    label: 'No me convenció',
    fg: colors.inkSoft,
    bg: 'transparent',
    border: colors.inkSoft,
    dashed: true,
    rotate: 1.5,
  },
};

type Props = { verdict: Verdict; style?: StyleProp<ViewStyle> };

export function VerdictStamp({ verdict, style }: Props) {
  const s = stamps[verdict];
  return (
    <View
      accessible
      accessibilityLabel={`Veredicto: ${s.label.replace(/^[♡✦]\s*/, '')}`}
      style={[
        styles.base,
        {
          backgroundColor: s.bg,
          borderColor: s.border,
          borderStyle: s.dashed ? 'dashed' : 'solid',
          transform: [{ rotate: `${s.rotate}deg` }],
        },
        style,
      ]}
    >
      <AppText variant="small" color={s.fg} style={styles.text}>
        {s.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderRadius: radii.pill,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },
  text: { fontSize: 13, lineHeight: 17 },
});
