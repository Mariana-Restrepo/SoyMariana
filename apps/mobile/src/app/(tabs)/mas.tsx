import { links, profile } from '@soymariana/content';
import { seededRotation } from '@soymariana/core';
import Constants from 'expo-constants';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Em } from '@/components/ui/AppText';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Reveal } from '@/components/ui/Reveal';
import { Screen } from '@/components/ui/Screen';
import { openLink, safeMailto, safeUrl } from '@/lib/links';
import { colors, layout, radii, shadows } from '@/theme';

function LinkRow({
  label,
  detail,
  url,
}: {
  label: string;
  detail: string;
  url: string | undefined;
}) {
  const enabled = !!url;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={enabled ? `${label}: ${detail}` : `${label}: enlace pendiente`}
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={() => openLink(url)}
      style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]}
    >
      <AppText variant="body" style={!enabled && styles.pending}>
        {label}
      </AppText>
      <AppText variant="small" color={enabled ? colors.azul : colors.inkSoft}>
        {enabled ? `${detail} ↗` : 'enlace pendiente'}
      </AppText>
    </Pressable>
  );
}

/** Más: quién es Mariana (historia visual) y dónde encontrarla. */
export default function MoreScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen contentStyle={styles.content}>
      {/* ---------- Sobre mí ---------- */}
      <Reveal>
        <AppText variant="eyebrow" color={colors.inkSoft} style={styles.eyebrow}>
          Sobre mí
        </AppText>
        <AppText variant="h2" accessibilityRole="header" style={styles.quote}>
          {profile.aboutTitle} <Em style={{ color: colors.cerezaInk }}>{profile.aboutEmphasis}</Em>{' '}
          {profile.aboutSuffix}
        </AppText>
      </Reveal>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={266}
        decelerationRate="fast"
        style={styles.storyScroll}
        contentContainerStyle={styles.story}
        accessibilityLabel="Mi historia, desliza para ver más"
      >
        {profile.story.map((card) => (
          <View
            key={card.label}
            style={[
              styles.storyCard,
              shadows.soft,
              { transform: [{ rotate: `${seededRotation(card.label, 1.6)}deg` }] },
            ]}
          >
            <MediaFrame image={card.image} style={styles.storyPhoto} />
            <AppText variant="eyebrow" color={colors.cerezaInk} style={styles.storyLabel}>
              {card.label}
            </AppText>
            <AppText variant="h3" style={styles.storyText}>
              {card.text}
            </AppText>
          </View>
        ))}
      </ScrollView>

      {/* ---------- Redes y cierre ---------- */}
      <View style={styles.social}>
        <AppText variant="eyebrow" color={colors.inkSoft} style={styles.eyebrow}>
          Encuéntrame
        </AppText>
        <LinkRow label="TikTok" detail={links.tiktok.handle} url={safeUrl(links.tiktok.url)} />
        <LinkRow
          label="Instagram"
          detail={links.instagram.handle}
          url={safeUrl(links.instagram.url)}
        />
        <LinkRow label="GitHub" detail={links.github.handle} url={safeUrl(links.github.url)} />
        <LinkRow
          label="LinkedIn"
          detail={links.linkedin.handle}
          url={safeUrl(links.linkedin.url)}
        />
        <LinkRow label="Correo" detail={links.email} url={safeMailto(links.email)} />

        <AppText variant="h3" style={styles.closing}>
          <Em>{profile.closing}</Em>
        </AppText>
        <AppText variant="small" color={colors.inkSoft}>
          © {new Date().getFullYear()} {profile.fullName} · versión {version}
        </AppText>
        <AppText variant="small" color={colors.inkSoft}>
          {profile.roleDev}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  eyebrow: { marginBottom: 10 },
  quote: { marginBottom: 6 },
  storyScroll: { marginHorizontal: -layout.gutter, marginTop: 20 },
  story: { paddingHorizontal: layout.gutter, paddingVertical: 12, gap: 16 },
  storyCard: {
    width: 250,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 12,
    paddingBottom: 20,
  },
  storyPhoto: { width: '100%', aspectRatio: 4 / 5, borderRadius: radii.md },
  storyLabel: { marginTop: 14, marginHorizontal: 6, marginBottom: 4 },
  storyText: { marginHorizontal: 6 },

  social: { marginTop: 44, gap: 2 },
  linkRow: {
    minHeight: layout.touch + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43,31,38,0.1)',
  },
  pending: { textDecorationLine: 'underline', textDecorationStyle: 'dotted' },
  closing: { marginTop: 32, marginBottom: 14 },
});
