import type { Video } from '@soymariana/content';
import { useIsFocused } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { useAppActive } from '@/hooks/use-app-active';
import { colors } from '@/theme';

import { VideoCard } from './VideoCard';

const GAP = 16;
const AUTO_ADVANCE_MS = 8000;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Video>);

type Props = { videos: readonly Video[] };

/**
 * Carrusel con snap: la tarjeta central es la activa. Reglas (las mismas que la web):
 *  1. Solo el video activo se reproduce, y solo con la pestaña enfocada y la app en primer plano.
 *  2. Siempre inicia mudo; el sonido lo activa la persona y solo aplica al video activo.
 *  3. Si la persona toca o desliza, el avance automático se detiene.
 */
export function VideoCarousel({ videos }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(260, Math.round(width * 0.66));
  const interval = cardWidth + GAP;
  const side = (width - cardWidth) / 2;

  const listRef = useRef<FlatList<Video>>(null);
  const scrollX = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const focused = useIsFocused();
  const appActive = useAppActive();

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [announce, setAnnounce] = useState('');

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // Sincroniza el índice activo con el desplazamiento (sirve tanto al deslizar como al usar scrollToIndex).
  useAnimatedReaction(
    () => Math.round(scrollX.value / interval),
    (index, previous) => {
      if (index !== previous && index >= 0 && index < videos.length) runOnJS(setActive)(index);
    },
  );

  const goTo = useCallback(
    (index: number) => {
      const target = (index + videos.length) % videos.length;
      listRef.current?.scrollToIndex({ index: target, animated: !reduceMotion });
    },
    [videos.length, reduceMotion],
  );

  const select = useCallback(
    (index: number) => {
      setInteracted(true);
      goTo(index);
    },
    [goTo],
  );

  const canPlay = focused && appActive;

  // Avance automático suave: nunca con interacción, pausa, reducir movimiento o app en segundo plano.
  useEffect(() => {
    if (reduceMotion || interacted || !playing || !canPlay) return;
    const id = setInterval(() => goTo(active + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, interacted, playing, canPlay, active, goTo]);

  return (
    <View>
      <AnimatedFlatList
        ref={listRef}
        data={videos as Video[]}
        horizontal
        keyExtractor={(video) => video.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={interval}
        decelerationRate="fast"
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => setInteracted(true)}
        getItemLayout={(_, index) => ({ length: interval, offset: interval * index, index })}
        contentContainerStyle={{ paddingHorizontal: side, paddingVertical: 24 }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        accessibilityLabel="Carrusel de videos de TikTok"
        renderItem={({ item, index }) => (
          <VideoCard
            video={item}
            index={index}
            total={videos.length}
            cardWidth={cardWidth}
            interval={interval}
            scrollX={scrollX}
            active={index === active}
            nearActive={Math.abs(index - active) <= 1}
            canPlay={canPlay}
            playing={playing}
            soundOn={soundOn}
            onSelect={select}
            onToggleSound={() => {
              setSoundOn((v) => !v);
              setInteracted(true);
              setAnnounce(
                soundOn
                  ? 'Sonido apagado.'
                  : 'Sonido activado. Solo suena el video que estás viendo.',
              );
            }}
            onTogglePlay={() => {
              setPlaying((v) => !v);
              setInteracted(true);
            }}
          />
        )}
      />

      <View style={styles.dots} accessibilityRole="tablist">
        {videos.map((video, i) => (
          <View
            key={video.id}
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={[styles.dot, i === active && styles.dotActive]}
          />
        ))}
      </View>

      <AppText
        variant="small"
        color={colors.inkSoft}
        accessibilityLiveRegion="polite"
        style={styles.announce}
      >
        {announce}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(43,31,38,0.2)' },
  dotActive: { width: 26, backgroundColor: colors.cereza },
  announce: { textAlign: 'center', marginTop: 12, minHeight: 20 },
});
