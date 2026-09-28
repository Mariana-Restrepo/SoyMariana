import { SILENT_DISCLOSURE, type Place } from '@soymariana/content';
import { seededRotation } from '@soymariana/core';
import { Pressable, StyleSheet, View } from 'react-native';

import { DisclosureTag } from '@/components/brand/DisclosureTag';
import { VerdictStamp } from '@/components/brand/VerdictStamp';
import { AppText } from '@/components/ui/AppText';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { layout, colors, shadows } from '@/theme';
import { openLink, safeUrl } from '@/lib/links';

/** Polaroid del diario de lugares: "Mariana fue aquí y esto fue lo que encontró". */
export function PlaceCard({ place }: { place: Place }) {
  const map = safeUrl(place.mapUrl);
  const social = safeUrl(place.socialUrl);
  const video = safeUrl(place.videoUrl);

  return (
    <View
      style={[
        styles.card,
        shadows.soft,
        { transform: [{ rotate: `${seededRotation(place.id, 2)}deg` }] },
      ]}
    >
      <View style={styles.tape} />
      <MediaFrame image={place.image} style={styles.photo} />
      <AppText variant="hand" color={colors.cerezaInk} style={styles.city}>
        {place.city}
      </AppText>
      <AppText variant="h3" style={styles.name}>
        {place.name}
      </AppText>
      <AppText variant="small" color={colors.inkSoft} style={styles.review}>
        {place.review}
      </AppText>

      {place.tried.length > 0 && (
        <>
          <AppText variant="eyebrow" color={colors.inkSoft} style={styles.triedLabel}>
            Lo que probé
          </AppText>
          <View style={styles.tags}>
            {place.tried.map((item) => (
              <View key={item} style={styles.tag}>
                <AppText variant="small" style={styles.tagText}>
                  {item}
                </AppText>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={styles.footer}>
        <VerdictStamp verdict={place.verdict} />
        {place.disclosure && place.disclosure !== SILENT_DISCLOSURE ? (
          <DisclosureTag disclosure={place.disclosure} />
        ) : null}
        {video && (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Ver mi video de ${place.name} en TikTok`}
            onPress={() => openLink(video)}
            style={styles.link}
          >
            <AppText variant="label" color={colors.azul}>
              Mi video ↗
            </AppText>
          </Pressable>
        )}
        {map && (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Ver ubicación de ${place.name}`}
            onPress={() => openLink(map)}
            style={styles.link}
          >
            <AppText variant="label" color={colors.azul}>
              Ver ubicación ↗
            </AppText>
          </Pressable>
        )}
        {social && (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Ver ${place.name} en redes`}
            onPress={() => openLink(social)}
            style={styles.link}
          >
            <AppText variant="label" color={colors.azul}>
              En redes ↗
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 18,
  },
  tape: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    width: 84,
    height: 26,
    backgroundColor: 'rgba(255,141,181,0.55)',
    transform: [{ rotate: '-3deg' }],
    zIndex: 2,
  },
  photo: { width: '100%', aspectRatio: 1, borderRadius: 2 },
  city: { marginTop: 14, marginHorizontal: 4 },
  name: { marginHorizontal: 4, marginTop: 2 },
  review: { marginHorizontal: 4, marginTop: 4, marginBottom: 10 },
  triedLabel: { marginHorizontal: 4, marginBottom: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginHorizontal: 4 },
  tag: {
    backgroundColor: colors.rosaTint,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: { fontSize: 12, lineHeight: 16 },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 16,
    rowGap: 8,
    marginHorizontal: 4,
    marginTop: 14,
  },
  link: { minHeight: layout.touch, justifyContent: 'center' },
});
