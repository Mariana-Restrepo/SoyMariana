import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { colors, fonts } from '@/theme';

type Props = { words: readonly string[]; intervalMs?: number };

/**
 * "Yo pruebo → descubro → recomiendo". Decorativa: el lector de pantalla recibe la frase
 * completa una sola vez, y con "reducir movimiento" se queda en la primera palabra.
 */
export function WordRotator({ words, intervalMs = 2600 }: Props) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [reduce, words.length, intervalMs]);

  return (
    <View accessible accessibilityLabel={`Yo ${words.join(', ')}.`} style={styles.row}>
      <AppText variant="lead" importantForAccessibility="no">
        Yo
      </AppText>
      <View style={styles.slot} importantForAccessibility="no-hide-descendants">
        <Animated.Text
          key={words[index]}
          entering={FadeInDown.duration(280)}
          exiting={FadeOutUp.duration(200)}
          style={styles.word}
        >
          {words[index]}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  slot: { height: 40, minWidth: 170, justifyContent: 'center', overflow: 'hidden' },
  word: { fontFamily: fonts.serifItalic, fontSize: 30, lineHeight: 36, color: colors.cerezaInk },
});
