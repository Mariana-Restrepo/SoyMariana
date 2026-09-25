import { Pressable, StyleSheet } from 'react-native';

import { colors, layout, radii } from '@/theme';

import { AppText } from './AppText';

type Props = { label: string; pressed?: boolean; onPress: () => void; light?: boolean };

/** Chip de filtro (alto táctil de 44). `light` para usarlo sobre fondos de color. */
export function Chip({ label, pressed = false, onPress, light = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: pressed }}
      onPress={onPress}
      style={[
        styles.base,
        pressed
          ? { backgroundColor: light ? colors.white : colors.ink }
          : {
              borderWidth: 1.5,
              borderColor: light ? 'rgba(255,255,255,0.75)' : 'rgba(43,31,38,0.25)',
            },
      ]}
    >
      <AppText
        variant="small"
        color={
          pressed ? (light ? colors.cerezaInk : colors.paper) : light ? colors.white : colors.ink
        }
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.touch,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
