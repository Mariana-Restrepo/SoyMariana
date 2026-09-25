import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { HeartMark } from '@/components/ui/Icons';
import { colors, fonts, layout, radii } from '@/theme';

/**
 * Encabezado de marca: "Soy Mariana ♡" en todas las pestañas + acceso directo
 * "¿Creamos algo?" para marcas (se oculta en la propia pestaña de Marcas).
 */
export function AppHeader() {
  const { top } = useSafeAreaInsets();
  const pathname = usePathname();
  const showCta = !pathname.startsWith('/marcas');

  return (
    <View style={[styles.wrap, { paddingTop: top + 8 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Soy Mariana, ir al inicio"
        onPress={() => router.navigate('/')}
        style={styles.brand}
      >
        {/* Dos textos separados (no anidados): en Android el texto anidado a veces desaparece al cambiar de pestaña. */}
        <AppText variant="h3" style={[styles.brandText, { fontFamily: fonts.serifItalic }]}>
          Soy
        </AppText>
        <AppText variant="h3" style={styles.brandText}>
          {' '}
          Mariana
        </AppText>
        <View style={styles.heart}>
          <HeartMark color={colors.cereza} size={11} />
        </View>
      </Pressable>

      {showCta && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="¿Creamos algo? Ir a la sección de marcas"
          onPress={() => router.navigate('/marcas')}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
        >
          <AppText variant="small" color={colors.white} style={styles.ctaText}>
            ¿Creamos algo?
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.gutter,
    paddingBottom: 10,
    backgroundColor: colors.paper,
  },
  brand: {
    minHeight: layout.touch,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  brandText: { fontSize: 26, lineHeight: 34 },
  heart: { marginLeft: 3, marginTop: 6 },
  cta: {
    minHeight: layout.touch - 4,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.cereza,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontFamily: fonts.sansMedium },
});
