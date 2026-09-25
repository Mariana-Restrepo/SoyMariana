import { categories, type Recommendation } from '@soymariana/content';
import { seededRotation } from '@soymariana/core';
import { Pressable, StyleSheet, View } from 'react-native';

import { VerdictStamp } from '@/components/brand/VerdictStamp';
import { AppText } from '@/components/ui/AppText';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { colors, radii, shadows } from '@/theme';

const ratios = [4 / 5, 1, 4 / 3] as const;

type Props = { recommendation: Recommendation; index: number; onOpen: (slug: string) => void };

/** Tarjeta tipo "foto pegada": ligeramente inclinada (siempre igual para el mismo id). */
export function RecommendationCard({ recommendation: rec, index, onOpen }: Props) {
  const categoryName = categories.find((c) => c.key === rec.category)?.name ?? rec.category;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${rec.name}. ${categoryName}. ${rec.opinion}. Ver detalle`}
      onPress={() => onOpen(rec.slug)}
      style={({ pressed }) => [
        styles.card,
        shadows.soft,
        {
          transform: [
            { rotate: `${seededRotation(rec.id, 1.4)}deg` },
            { scale: pressed ? 0.98 : 1 },
          ],
        },
      ]}
    >
      <View>
        <MediaFrame
          image={rec.image}
          style={[styles.photo, { aspectRatio: ratios[index % ratios.length] }]}
        />
        <VerdictStamp verdict={rec.verdict} style={styles.stamp} />
      </View>
      <AppText variant="eyebrow" color={colors.inkSoft} style={styles.category}>
        {categoryName}
      </AppText>
      <AppText variant="h3" style={styles.name}>
        {rec.name}
      </AppText>
      <AppText variant="small" color={colors.inkSoft} style={styles.opinion}>
        “{rec.opinion}”
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: 12, paddingBottom: 18 },
  photo: { width: '100%', borderRadius: radii.md },
  stamp: { position: 'absolute', left: 10, bottom: -14 },
  category: { marginTop: 28, marginHorizontal: 6, marginBottom: 4 },
  name: { marginHorizontal: 6 },
  opinion: { marginHorizontal: 6, marginTop: 4 },
});
