import type { ImageRef } from '@soymariana/content';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { mediaUrl } from '@/lib/media';
import { colors, radii, tones } from '@/theme';

import { AppText } from './AppText';

type Props = {
  image: ImageRef;
  style?: StyleProp<ViewStyle>;
  /** En videos la etiqueta va arriba para no chocar con el ▶ del centro. */
  labelAt?: 'center' | 'top';
  children?: ReactNode;
};

/**
 * Foto o, mientras no exista, un bloque de color con la etiqueta [PLACEHOLDER] visible.
 * Quien lo usa define el tamaño (aspectRatio, width): así no hay saltos de layout.
 */
export function MediaFrame({ image, style, labelAt = 'center', children }: Props) {
  const tone = tones[image.tone];
  const uri = mediaUrl(image.src);

  return (
    <View style={[styles.frame, style]}>
      <LinearGradient
        colors={[tone.from, tone.to]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {uri ? (
        <Image
          source={{ uri }}
          contentFit="cover"
          transition={200}
          accessibilityLabel={image.alt}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={image.alt}
          style={[styles.placeholder, labelAt === 'top' ? styles.top : styles.center]}
        >
          <AppText
            variant="small"
            color={colors.inkSoft}
            style={[styles.label, labelAt === 'top' && styles.pill]}
          >
            {image.placeholder}
          </AppText>
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden' },
  placeholder: { ...StyleSheet.absoluteFill, padding: 12 },
  center: { alignItems: 'center', justifyContent: 'center' },
  top: { alignItems: 'flex-start', justifyContent: 'flex-start' },
  label: { fontSize: 11, letterSpacing: 1.1, textAlign: 'center' },
  pill: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
});
