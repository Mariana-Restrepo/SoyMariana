import type { ReactNode, RefObject } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTabBarPadding } from '@/components/navigation/TabBar';
import { colors, layout } from '@/theme';

type Props = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  scrollRef?: RefObject<ScrollView | null>;
};

/**
 * Pantalla desplazable: fondo crema, deja espacio para la barra flotante y centra el
 * contenido con un ancho máximo cómodo (útil en tablets y en la vista web de pruebas).
 */
export function Screen({ children, contentStyle, scrollRef }: Props) {
  const bottom = useTabBarPadding();
  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: bottom }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.paper },
  content: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.gutter,
  },
});
