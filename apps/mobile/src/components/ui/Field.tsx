import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, layout } from '@/theme';

import { AppText } from './AppText';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  optional?: boolean;
  error?: string;
};

/** Campo con etiqueta visible y error en la voz de Mariana. */
export function Field({ label, optional, error, multiline, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label" style={styles.label}>
        {label}
        {optional ? (
          <AppText variant="small" color={colors.inkSoft}>
            {' '}
            (opcional)
          </AppText>
        ) : null}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={error}
        placeholderTextColor={colors.inkSoft}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.input,
          multiline && styles.multiline,
          { borderColor: error ? colors.cereza : 'rgba(43,31,38,0.22)' },
        ]}
        {...props}
      />
      {error ? (
        <AppText
          variant="small"
          color={colors.cerezaInk}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={styles.error}
        >
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { marginBottom: 6 },
  input: {
    minHeight: layout.touch + 4,
    borderWidth: 1.5,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
  },
  multiline: { minHeight: 120 },
  error: { marginTop: 4 },
});
