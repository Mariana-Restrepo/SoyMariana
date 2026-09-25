import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, layout } from '@/theme';

export default function NotFound() {
  return (
    <View style={styles.wrap}>
      <AppText variant="h2" style={styles.center}>
        Amiga, esta pantalla no la he probado todavía.
      </AppText>
      <Link href="/" style={styles.link} accessibilityRole="link">
        <AppText variant="label" color={colors.azul}>
          Volver al inicio
        </AppText>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.gutter,
    gap: 16,
    backgroundColor: colors.paper,
  },
  center: { textAlign: 'center' },
  link: { minHeight: layout.touch, paddingVertical: 12 },
});
