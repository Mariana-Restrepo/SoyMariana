import { disclosures, links } from '@soymariana/content';
import { legal } from '@soymariana/content/legal';
import { fillLegalText, legalSlugFromPath } from '@soymariana/core';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DisclosureTag } from '@/components/brand/DisclosureTag';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { openLink, safeMailto } from '@/lib/links';
import { colors, layout, radii } from '@/theme';

/**
 * Política de privacidad y términos de uso (pantalla modal). Mismo texto que la web: sale de
 * packages/content (legal.json), así que cambiarlo en un solo lugar actualiza los dos.
 */
export default function LegalScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const legalSlug = legalSlugFromPath(`/${slug}`);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/mas'));

  if (!legalSlug) {
    return (
      <View style={styles.center}>
        <AppText variant="h2" style={styles.centerText}>
          Amiga, esta página no existe.
        </AppText>
        <Button label="Volver" variant="quiet" onPress={close} />
      </View>
    );
  }

  const doc = legalSlug === 'privacidad' ? legal.privacy : legal.terms;
  const otherSlug = legalSlug === 'privacidad' ? 'terminos' : 'privacidad';
  const otherTitle = legalSlug === 'privacidad' ? legal.terms.title : legal.privacy.title;
  const values = { name: legal.controller.name, place: legal.controller.place, email: links.email };
  const fill = (text: string) => fillLegalText(text, values);
  const mail = safeMailto(links.email);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: top + 64, paddingBottom: bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="eyebrow" color={colors.inkSoft}>
          Soy Mariana
        </AppText>
        <AppText variant="h2" accessibilityRole="header" style={styles.title}>
          {doc.title}
        </AppText>
        <AppText variant="small" color={colors.inkSoft}>
          Actualizado: {legal.updatedAt}
        </AppText>
        <AppText variant="lead" style={styles.intro}>
          {doc.intro}
        </AppText>

        {doc.sections.map((section, index) => (
          <View key={section.id} style={styles.section}>
            <AppText variant="h3" accessibilityRole="header" style={styles.sectionTitle}>
              {index + 1}. {section.title}
            </AppText>
            {section.paragraphs.map((paragraph) => (
              <AppText key={paragraph} variant="body" style={styles.paragraph}>
                {fill(paragraph)}
              </AppText>
            ))}
            {section.list?.map((item) => (
              <AppText key={item} variant="body" style={styles.paragraph}>
                <AppText variant="body" color={colors.cerezaInk}>
                  ♡{'  '}
                </AppText>
                {fill(item)}
              </AppText>
            ))}
            {section.showDisclosures ? (
              <View style={styles.disclosures}>
                {disclosures.items.map((item) => (
                  <View key={item.key} style={styles.disclosure}>
                    <DisclosureTag disclosure={item.key} />
                    <AppText variant="small" color={colors.inkSoft}>
                      {item.description}
                    </AppText>
                  </View>
                ))}
                <View style={styles.disclosure}>
                  <AppText variant="label">{disclosures.affiliate.label}</AppText>
                  <AppText variant="small" color={colors.inkSoft}>
                    {disclosures.affiliate.description}
                  </AppText>
                </View>
              </View>
            ) : null}
            {section.closing ? (
              <AppText variant="body" style={styles.paragraph}>
                {fill(section.closing)}
              </AppText>
            ) : null}
          </View>
        ))}

        <View style={styles.section}>
          <AppText variant="h3" accessibilityRole="header" style={styles.sectionTitle}>
            Contacto
          </AppText>
          <AppText variant="body" style={styles.paragraph}>
            {legal.controller.name} · {legal.controller.place}
          </AppText>
          {legal.controller.phone ? (
            <AppText variant="body" style={styles.paragraph}>
              Teléfono: {legal.controller.phone}
            </AppText>
          ) : null}
          {mail ? (
            <Button
              label={links.email}
              variant="quiet"
              onPress={() => openLink(mail)}
              style={styles.mail}
            />
          ) : (
            <AppText variant="body">{links.email}</AppText>
          )}
        </View>

        <Button
          label={`También: ${otherTitle}`}
          variant="quiet"
          onPress={() => router.replace({ pathname: '/legal/[slug]', params: { slug: otherSlug } })}
          style={styles.other}
        />
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar"
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
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  title: { marginTop: 10, marginBottom: 6 },
  intro: { marginTop: 16 },
  section: { marginTop: 30 },
  sectionTitle: { marginBottom: 8 },
  paragraph: { marginTop: 8 },
  disclosures: {
    marginTop: 12,
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
  },
  disclosure: { gap: 6 },
  mail: { marginTop: 10, alignSelf: 'flex-start' },
  other: { marginTop: 32, alignSelf: 'flex-start' },
  close: {
    position: 'absolute',
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
