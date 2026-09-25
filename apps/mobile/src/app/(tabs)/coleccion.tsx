import { categories, places, recommendations } from '@soymariana/content';
import {
  categoriesWithItems,
  filterByCategory,
  track,
  type CategoryFilter,
} from '@soymariana/core';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { PlaceCard } from '@/components/sections/PlaceCard';
import { RecommendationCard } from '@/components/sections/RecommendationCard';
import { AppText, Em } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Reveal } from '@/components/ui/Reveal';
import { Screen } from '@/components/ui/Screen';
import { colors, layout, radii, tones } from '@/theme';

/**
 * Colección: las categorías ("lo que pruebo") son la puerta de entrada y filtran las
 * recomendaciones y el diario de lugares. Mismo modelo que la web.
 */
export default function CollectionScreen() {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const shown = useMemo(() => categoriesWithItems(categories, [...recommendations, ...places]), []);
  const recs = useMemo(() => filterByCategory(recommendations, filter), [filter]);
  const spots = useMemo(() => filterByCategory(places, filter), [filter]);
  const selected = categories.find((c) => c.key === filter);

  const open = (slug: string) => {
    track('recommendation_open', { slug });
    router.push({ pathname: '/recomendacion/[slug]', params: { slug } });
  };

  return (
    <Screen contentStyle={styles.content}>
      <Reveal>
        <AppText variant="eyebrow" color={colors.inkSoft} style={styles.eyebrow}>
          Lo que pruebo
        </AppText>
        <AppText variant="h2" accessibilityRole="header">
          Esto sí <Em>te lo recomiendo</Em>
        </AppText>
        <AppText variant="lead" color={colors.inkSoft} style={styles.sub}>
          (Y lo que no, también te lo cuento.)
        </AppText>
      </Reveal>

      {/* Categorías: tarjetas de color con su emoji (el filtro principal). */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.stripScroll}
        contentContainerStyle={styles.strip}
        accessibilityLabel="Categorías"
      >
        <Chip label="Todo" pressed={filter === 'all'} onPress={() => setFilter('all')} />
        {shown.map((category) => {
          const on = filter === category.key;
          const tone = tones[category.tone];
          return (
            <Pressable
              key={category.key}
              accessibilityRole="button"
              accessibilityLabel={`${category.name}. ${category.blurb}`}
              accessibilityState={{ selected: on }}
              onPress={() => {
                setFilter(on ? 'all' : category.key);
                if (!on) track('collection_filter', { category: category.key });
              }}
              style={[styles.cat, { backgroundColor: tone.from }, on && styles.catOn]}
            >
              <AppText variant="h3" importantForAccessibility="no">
                {category.emoji}
              </AppText>
              <AppText variant="small" style={styles.catName}>
                {category.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {selected ? (
        <AppText variant="lead" color={colors.inkSoft} style={styles.blurb}>
          <Em style={styles.blurbEm}>{selected.blurb}</Em>
        </AppText>
      ) : null}

      <View style={styles.list}>
        {recs.map((rec, i) => (
          <Reveal key={rec.id} index={i % 3}>
            <RecommendationCard recommendation={rec} index={i} onOpen={open} />
          </Reveal>
        ))}
      </View>

      {recs.length === 0 && spots.length === 0 && (
        <View style={styles.empty}>
          <AppText variant="h3" style={styles.emptyText}>
            Todavía no he probado nada de esto. ✿
          </AppText>
          <Button label="Ver todo" variant="quiet" onPress={() => setFilter('all')} />
        </View>
      )}

      {spots.length > 0 && (
        <View style={styles.diary}>
          <AppText variant="eyebrow" color={colors.inkSoft} style={styles.eyebrow}>
            Mi diario de lugares
          </AppText>
          <AppText variant="h2" accessibilityRole="header">
            Fui aquí y <Em>esto encontré</Em>
          </AppText>
          <View style={styles.polas}>
            {spots.map((place, i) => (
              <Reveal key={place.id} index={i}>
                <PlaceCard place={place} />
              </Reveal>
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  eyebrow: { marginBottom: 10 },
  sub: { marginTop: 6 },
  stripScroll: { marginTop: 20, marginHorizontal: -layout.gutter },
  strip: { paddingHorizontal: layout.gutter, gap: 8, alignItems: 'center' },
  cat: {
    minHeight: layout.touch + 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
  },
  catOn: { borderWidth: 2, borderColor: colors.ink },
  catName: { fontSize: 14 },
  blurb: { marginTop: 12 },
  blurbEm: { fontSize: 20 },
  list: { marginTop: 22, gap: 26 },
  empty: {
    marginTop: 28,
    padding: 28,
    borderRadius: radii.lg,
    backgroundColor: colors.rosaTint,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: { textAlign: 'center' },
  diary: { marginTop: 64 },
  polas: { marginTop: 26, gap: 30 },
});
