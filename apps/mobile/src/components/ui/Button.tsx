import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, layout, radii, shadows } from '@/theme';

import { AppText } from './AppText';

export type ButtonVariant = 'rosa' | 'cereza' | 'paper' | 'quiet' | 'azul';

const variants: Record<
  ButtonVariant,
  { bg: string; fg: string; border?: string; shadow?: boolean }
> = {
  rosa: { bg: colors.rosa, fg: colors.ink, shadow: true },
  cereza: { bg: colors.cereza, fg: colors.white },
  paper: { bg: colors.paper, fg: colors.ink },
  quiet: { bg: 'transparent', fg: colors.ink, border: colors.ink },
  azul: { bg: colors.azul, fg: colors.white },
};

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

/** Botón redondeado: alto táctil ≥ 46, se "hunde" un poco al presionar. */
export function Button({
  label,
  variant = 'rosa',
  style,
  disabled,
  accessibilityLabel,
  ...props
}: Props) {
  const v = variants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : null,
        v.shadow ? shadows.lift : null,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <AppText variant="label" color={v.fg}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.touch + 2,
    paddingHorizontal: 24,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
  disabled: { opacity: 0.55 },
});
