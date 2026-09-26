import { disclosures, type DisclosureKey } from '@soymariana/content';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, fonts } from '@/theme';

/**
 * Etiqueta de transparencia (mismo vocabulario y colores que la web): cómo llegó a Mariana lo
 * que recomienda. Plana y sin inclinación: se lee como información, no como un sello de opinión.
 * El texto siempre está escrito; el color nunca es lo único que informa.
 */
const palette: Record<DisclosureKey, { fg: string; bg: string; border: string }> = {
  propio: { fg: colors.ink, bg: colors.white, border: 'rgba(43,31,38,0.35)' },
  regalo: { fg: colors.azul, bg: colors.azulTint, border: colors.azul },
  invitacion: { fg: colors.rosaInk, bg: colors.rosaTint, border: colors.rosaInk },
  colaboracion: { fg: colors.paper, bg: colors.ink, border: colors.ink },
};

const infoFor = (key: DisclosureKey) => disclosures.items.find((item) => item.key === key);

/** Texto para lectores de pantalla: "Transparencia: Me lo regalaron". */
export const disclosureA11y = (key: DisclosureKey): string =>
  `Transparencia: ${infoFor(key)?.label ?? ''}`;

type TagProps = { disclosure: DisclosureKey; style?: StyleProp<ViewStyle> };

export function DisclosureTag({ disclosure, style }: TagProps) {
  const info = infoFor(disclosure);
  if (!info) return null;
  const c = palette[disclosure];
  return (
    <View
      accessible
      accessibilityLabel={disclosureA11y(disclosure)}
      style={[styles.tag, { backgroundColor: c.bg, borderColor: c.border }, style]}
    >
      <AppText variant="label" color={c.fg} importantForAccessibility="no" style={styles.tagText}>
        {info.label}
      </AppText>
    </View>
  );
}

/** Lo que significa la etiqueta, en una frase (para el detalle de una recomendación). */
export function DisclosureText({
  disclosure,
  style,
}: {
  disclosure: DisclosureKey;
  style?: StyleProp<TextStyle>;
}) {
  const info = infoFor(disclosure);
  if (!info) return null;
  return (
    <AppText variant="small" color={colors.inkSoft} style={style}>
      <Text style={styles.strong}>{info.label}.</Text> {info.description}
    </AppText>
  );
}

/** Aviso de que el enlace es de afiliado. */
export function AffiliateNote({ style }: { style?: StyleProp<TextStyle> }) {
  return (
    <AppText variant="small" color={colors.inkSoft} style={style}>
      <Text style={styles.strong}>{disclosures.affiliate.label}.</Text>{' '}
      {disclosures.affiliate.description}
    </AppText>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: { fontSize: 12.5, lineHeight: 16 },
  strong: { fontFamily: fonts.sansMedium, color: colors.ink },
});
