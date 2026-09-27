import { categories, recommendations } from '@soymariana/content';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AffiliateNote, DisclosureTag, DisclosureText } from '@/components/brand/DisclosureTag';
import { VerdictStamp } from '@/components/brand/VerdictStamp';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { openLink, safeUrl } from '@/lib/links';
import { colors, layout, radii } from '@/theme';

/** Detalle de una recomendación (pantalla modal; también abre con el link soymariana://recomendacion/slug). */
export default function RecommendationDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const rec = recommendations.find((r) => r.slug === slug);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/coleccion'));

  if (!rec) {
    return (
      <View style={styles.center}>
        <AppText variant="h2" style={styles.centerText}>
          Amiga, esta recomendación no existe.
        </AppText>
        <Button label="Volver a la colección" variant="quiet" onPress={close} />
      </View>
    );
  }

  const categoryName = categories.find((c) => c.key === rec.category)?.name ?? rec.category;
  const link = safeUrl(rec.link);
  const video = safeUrl(rec.videoUrl);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: top + 64, paddingBottom: bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MediaFrame image={rec.image} style={styles.photo} />
        <AppText variant="eyebrow" color={colors.inkSoft} style={styles.category}>
          {categoryName}
        </AppText>
        <View style={styles.badges}>
          <VerdictStamp verdict={rec.verdict} />
          {rec.disclosure ? <DisclosureTag disclosure={rec.disclosure} /> : null}
        </View>
        <AppText variant="h2" accessibilityRole="header" style={styles.name}>
          {rec.name}
        </AppText>
        <AppText variant="lead">“{rec.opinion}”</AppText>
        {rec.disclosure ? (
          <DisclosureText disclosure={rec.disclosure} style={styles.disclosure} />
        ) : null}

        {rec.liked.length > 0 && (
          <View style={styles.block}>
            <AppText variant="h3">Lo que me gustó</AppText>
            {rec.liked.map((item) => (
              <AppText key={item} variant="body" style={styles.item}>
                <AppText variant="body" color={colors.cerezaInk}>
                  ♡{'  '}
                </AppText>
                {item}
              </AppText>
            ))}
          </View>
        )}
        {rec.disliked.length > 0 && (
          <View style={styles.block}>
            <AppText variant="h3">Lo que no tanto</AppText>
            {rec.disliked.map((item) => (
              <AppText key={item} variant="body" style={styles.item}>
                <AppText variant="body" color={colors.inkSoft}>
                  –{'  '}
                </AppText>
                {item}
              </AppText>
            ))}
          </View>
        )}

        {link ? (
          <Button
            label={`${rec.linkLabel ?? 'Ver más'} ↗`}
            variant="rosa"
            onPress={() => openLink(link)}
            style={styles.cta}
          />
        ) : null}
        {video ? (
          <Button
            label="Ver mi video en TikTok ↗"
            variant="quiet"
            onPress={() => openLink(video)}
            style={styles.videoLink}
          />
        ) : null}
        {link ? (
          rec.affiliate ? (
            <AffiliateNote style={styles.affiliate} />
          ) : null
        ) : rec.link ? (
          <AppText variant="small" color={colors.inkSoft} style={styles.cta}>
            Enlace pendiente de agregar.
          </AppText>
        ) : null}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar detalle"
        onPress={close}
        style={[styles.close, { top: top + 8 }]}
      >
        <AppText variant="label">✕</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: {
    paddingHorizontal: layout.gutter,
    paddingTop: 20,
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  photo: { width: '100%', aspectRatio: 16 / 10, borderRadius: radii.md },
  category: { marginTop: 18, marginBottom: 8 },
  name: { marginTop: 10, marginBottom: 8 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  disclosure: { marginTop: 12 },
  affiliate: { marginTop: 12 },
  videoLink: { marginTop: 14, alignSelf: 'flex-start' },
  block: { marginTop: 22, gap: 4 },
  item: { marginTop: 4 },
  cta: { marginTop: 28, alignSelf: 'flex-start' },
  close: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: layout.touch,
    height: layout.touch,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.gutter,
    gap: 16,
    backgroundColor: colors.paper,
  },
  centerText: { textAlign: 'center' },
});
