import { useEffect, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  /** Giro fijo (ej. '-6deg'). Va en la MISMA vista animada: en Android, una vista rotada dentro de otra animada puede recortar el texto. */
  rotate?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Elemento que flota suavemente (movimiento orgánico de 7 s). Con "reducir movimiento"
 * del sistema, Reanimated la deja quieta.
 */
export function Float({ children, delay = 0, distance = 8, rotate = '0deg', style }: Props) {
  const reduce = useReducedMotion();
  const y = useSharedValue(0);

  useEffect(() => {
    if (reduce) return;
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-distance, { duration: 3500, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [y, delay, distance, reduce]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { rotate }],
  }));

  // Con "reducir movimiento" no flota y queda sin giro: en Android, una vista rotada que nunca se
  // redibuja recortaba su texto (visto en el emulador). Son adornos: sin giro se leen bien.
  if (reduce) {
    return (
      <View pointerEvents="none" style={style}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View pointerEvents="none" style={[style, animated]}>
      {children}
    </Animated.View>
  );
}
