import { videos } from '@soymariana/content';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTabBarPadding } from '@/components/navigation/TabBar';
import { AppText, Em } from '@/components/ui/AppText';
import { Reveal } from '@/components/ui/Reveal';
import { VideoCarousel } from '@/components/video/VideoCarousel';
import { colors, layout } from '@/theme';

/** El carrusel ocupa todo el ancho (sangra hasta los bordes); el texto lleva el margen normal. */
export default function VideosScreen() {
  const bottom = useTabBarPadding();
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: bottom }}
      showsVerticalScrollIndicator={false}
    >
      <Reveal style={styles.head}>
        <AppText variant="eyebrow" color={colors.inkSoft} style={styles.eyebrow}>
          Mi contenido
        </AppText>
        <AppText variant="h2" accessibilityRole="header">
          Mírame <Em>en acción</Em>
        </AppText>
        <AppText variant="lead" color={colors.inkSoft} style={styles.sub}>
          Lo probé para que tú no tengas que hacerlo.
        </AppText>
      </Reveal>
      <View style={styles.carousel}>
        <VideoCarousel videos={videos} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.paper },
  head: { paddingHorizontal: layout.gutter, paddingTop: 12 },
  eyebrow: { marginBottom: 10 },
  sub: { marginTop: 8 },
  carousel: { marginTop: 8 },
});
