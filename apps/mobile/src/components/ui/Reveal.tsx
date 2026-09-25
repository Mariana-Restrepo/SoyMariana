import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = { children: ReactNode; index?: number; style?: StyleProp<ViewStyle> };

/**
 * Entrada suave: aparece y sube un poco (mismos tiempos que la web: 500 ms, escalón de 70 ms).
 * Reanimated respeta por defecto el ajuste "reducir movimiento" del sistema.
 */
export function Reveal({ children, index = 0, style }: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(500).delay(index * 70)} style={style}>
      {children}
    </Animated.View>
  );
}
