import type { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Icon, type IconName } from '@/components/ui/Icons';
import { colors, layout, radii, shadows } from '@/theme';

/** Props que recibe la barra (se infieren de <Tabs tabBar>, sin importar paquetes internos). */
type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

/** Ícono y etiqueta de cada pestaña (el nombre es el archivo de la ruta). */
const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Inicio', icon: 'home' },
  videos: { label: 'Videos', icon: 'play' },
  coleccion: { label: 'Colección', icon: 'heart' },
  marcas: { label: 'Marcas', icon: 'mail' },
  mas: { label: 'Más', icon: 'sparkle' },
};

/** Alto que ocupa la barra flotante: las pantallas dejan este espacio abajo para no quedar tapadas. */
export function useTabBarPadding(): number {
  const { bottom } = useSafeAreaInsets();
  return layout.tabBarHeight + Math.max(bottom, 12) + 20;
}

/**
 * Barra de pestañas propia (píldora flotante con blur suave de color): en la app
 * las cinco secciones sí son destinos independientes, a diferencia de la web (un recorrido).
 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(bottom, 12) }]}>
      <View accessibilityRole="tablist" style={[styles.bar, shadows.soft]}>
        {state.routes.map((route, index) => {
          const meta = TABS[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          const color = focused ? colors.ink : colors.inkSoft;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={meta.label}
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              style={styles.item}
            >
              <View style={[styles.pill, focused && styles.pillActive]}>
                <Icon name={meta.icon} color={color} filled={focused && meta.icon !== 'play'} />
              </View>
              <AppText variant="small" color={color} style={styles.label}>
                {meta.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 16 },
  bar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: layout.maxContentWidth,
    height: layout.tabBarHeight,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,250,246,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(43,31,38,0.07)',
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  item: {
    flex: 1,
    minHeight: layout.touch + 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  pill: {
    width: 52,
    height: 30,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: { backgroundColor: colors.rosaTint },
  label: { fontSize: 11, lineHeight: 14 },
});
