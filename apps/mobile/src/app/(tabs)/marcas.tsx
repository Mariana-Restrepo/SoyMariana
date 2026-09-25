import { collab, links } from '@soymariana/content';
import { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { InquiryForm } from '@/components/sections/InquiryForm';
import { AppText, Em } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Screen } from '@/components/ui/Screen';
import { openLink, safeMailto } from '@/lib/links';
import { colors, radii } from '@/theme';

/** Sección para marcas: natural, sin lenguaje corporativo, sin precios. */
export default function BrandsScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const formY = useRef(0);
  const mail = safeMailto(links.email);

  return (
    <Screen scrollRef={scrollRef} contentStyle={styles.content}>
      <Reveal>
        <View style={styles.hero}>
          <AppText variant="eyebrow" color={colors.white}>
            {collab.eyebrow}
          </AppText>
          <AppText
            variant="hero"
            color={colors.white}
            accessibilityRole="header"
            style={styles.title}
          >
            {collab.title} <Em style={{ color: colors.rosaTint }}>{collab.titleEmphasis}</Em>
          </AppText>
          <AppText variant="h3" color={colors.white} style={styles.phrase}>
            <Em>{collab.phrase}</Em>
          </AppText>

          <AppText variant="eyebrow" color={colors.white} style={styles.h4}>
            {collab.audiencesTitle}
          </AppText>
          <View style={styles.wrapRow}>
            {collab.audiences.map((audience) => (
              <View key={audience} style={styles.audience}>
                <AppText variant="small" color={colors.white}>
                  {audience}
                </AppText>
              </View>
            ))}
          </View>

          <Button
            label="Quiero trabajar con Mariana"
            variant="paper"
            style={styles.cta}
            onPress={() => scrollRef.current?.scrollTo({ y: formY.current - 12, animated: true })}
          />
          <AppText variant="small" color={colors.white}>
            o escríbeme a{' '}
            {mail ? (
              <AppText
                variant="small"
                color={colors.white}
                style={styles.underline}
                onPress={() => openLink(mail)}
              >
                {links.email}
              </AppText>
            ) : (
              <AppText variant="small" color={colors.white} style={styles.underline}>
                {links.email}
              </AppText>
            )}
          </AppText>
        </View>
      </Reveal>

      <Reveal index={1} style={styles.formats}>
        <AppText variant="eyebrow" color={colors.inkSoft} style={styles.h4}>
          {collab.formatsTitle}
        </AppText>
        <View style={styles.grid}>
          {collab.formats.map((format, i) => (
            <View key={format.id} style={styles.format}>
              <AppText variant="h3" color={colors.cerezaInk} importantForAccessibility="no">
                {String(i + 1).padStart(2, '0')}
              </AppText>
              <AppText variant="small">{format.title}</AppText>
            </View>
          ))}
        </View>
      </Reveal>

      <View style={styles.form} onLayout={(e) => (formY.current = e.nativeEvent.layout.y)}>
        <InquiryForm />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  hero: { backgroundColor: colors.cereza, borderRadius: radii.lg, padding: 24, paddingBottom: 28 },
  title: { marginTop: 10 },
  phrase: { marginTop: 14 },
  h4: { marginTop: 26, marginBottom: 10 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  audience: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.75)',
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  cta: { alignSelf: 'flex-start', marginTop: 28, marginBottom: 14 },
  underline: { textDecorationLine: 'underline' },
  formats: { marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  format: {
    width: '48%',
    minHeight: 92,
    justifyContent: 'space-between',
    backgroundColor: colors.rosaTint,
    borderRadius: radii.md,
    padding: 14,
  },
  form: { marginTop: 32 },
});
