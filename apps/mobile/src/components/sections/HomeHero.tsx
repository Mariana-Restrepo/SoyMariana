import { profile } from '@soymariana/content';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { WordRotator } from '@/components/brand/WordRotator';
import { AppText, Em } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Float } from '@/components/ui/Float';
import { HeartMark } from '@/components/ui/Icons';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Reveal } from '@/components/ui/Reveal';
import { colors, radii, shadows } from '@/theme';

/** Nota tipo post-it, decorativa (la lee el lector de pantalla solo como parte de la foto). */
function Note({ text }: { text: string }) {
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={styles.note}
    >
      <AppText variant="hand" color={colors.cerezaInk}>
        {text}
      </AppText>
    </View>
  );
}

/**
 * Hero: la foto va primero (el hero es sobre todo visual), luego el titular y las dos entradas
 * a lo demás. Sin bloques de texto: el resto de la historia se descubre en las otras pestañas.
 */
export function HomeHero() {
  // Las notas son solo adorno. Con "reducir movimiento" activo se omiten: en Android (emulador, Android 15) su
  // texto quedaba recortado al dibujarse sin animación, y para quien pide menos movimiento son ruido visual.
  const reduceMotion = useReducedMotion();

  return (
    <View style={styles.wrap}>
      <Reveal>
        <View style={styles.stage}>
          <MediaFrame image={profile.heroImage} style={[styles.photo, shadows.lift]} />
          {!reduceMotion && (
            <>
              <Float delay={0} rotate="-6deg" style={styles.floatA}>
                <Note text="amiga, mira esto" />
              </Float>
              <Float delay={900} rotate="4deg" style={styles.floatB}>
                <Note text="lo probé ✦" />
              </Float>
            </>
          )}
          <Float delay={1600} style={styles.floatC}>
            <HeartMark color={colors.cereza} size={30} />
          </Float>
        </View>
      </Reveal>

      <Reveal index={1}>
        <AppText variant="eyebrow" color={colors.inkSoft} style={styles.eyebrow}>
          {profile.eyebrow} · {profile.city}
        </AppText>
        <AppText variant="hero" accessibilityRole="header">
          {profile.heroTitle}
        </AppText>
        {/* El subrayado rosa se dibuja detrás de la palabra clave. */}
        <View style={styles.emphasis}>
          <View style={styles.underline} />
          <AppText variant="hero">
            <Em>{profile.heroEmphasis}</Em>
          </AppText>
        </View>
      </Reveal>

      <Reveal index={2}>
        <AppText variant="lead" color={colors.inkSoft} style={styles.subtitle}>
          {profile.heroSubtitle}
        </AppText>
        <WordRotator words={profile.heroWords} />
      </Reveal>

      <Reveal index={3} style={styles.actions}>
        <Button
          label="Mírame en acción"
          variant="rosa"
          onPress={() => router.navigate('/videos')}
        />
        <Button
          label="Lo que pruebo"
          variant="quiet"
          onPress={() => router.navigate('/coleccion')}
        />
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 12, gap: 24 },
  stage: { alignItems: 'center', paddingVertical: 20 },
  photo: {
    width: 210,
    aspectRatio: 1 / 1.08,
    borderRadius: radii.lg,
    transform: [{ rotate: '1.6deg' }],
  },
  floatA: { position: 'absolute', top: 6, left: '10%' },
  floatB: { position: 'absolute', bottom: 34, right: '8%' },
  floatC: { position: 'absolute', top: 0, right: '30%' },
  // Sin `elevation`: en Android una vista rotada con sombra puede recortar su texto al dibujarse (visto en el emulador).
  // El relieve lo da un borde fino y una sombra solo para iOS.
  note: {
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(43,31,38,0.08)',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  eyebrow: { marginBottom: 10 },
  emphasis: { alignSelf: 'flex-start' },
  underline: {
    position: 'absolute',
    left: -2,
    right: -2,
    bottom: 6,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.rosa,
    opacity: 0.9,
  },
  subtitle: { marginBottom: 14 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
