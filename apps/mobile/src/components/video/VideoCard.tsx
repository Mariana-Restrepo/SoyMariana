import type { Video } from '@soymariana/content';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView, type VideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { mediaUrl } from '@/lib/media';
import { openLink, safeUrl } from '@/lib/links';
import { colors, layout, radii, shadows } from '@/theme';

type Props = {
  video: Video;
  index: number;
  total: number;
  cardWidth: number;
  interval: number;
  scrollX: SharedValue<number>;
  active: boolean;
  /** A una posición o menos de la activa: se puede cargar el archivo. */
  nearActive: boolean;
  /** La pestaña está enfocada y la app en primer plano. */
  canPlay: boolean;
  playing: boolean;
  soundOn: boolean;
  onSelect: (index: number) => void;
  onToggleSound: () => void;
  onTogglePlay: () => void;
};

/** Sincroniza el reproductor nativo con el estado de la tarjeta (mudo por defecto, solo el activo suena). */
function applyPlayback(player: VideoPlayer, playing: boolean, muted: boolean) {
  player.muted = muted;
  if (playing) player.play();
  else player.pause();
}

/** Reproductor real. Vive en su propio componente porque los hooks de expo-video no pueden ser condicionales. */
function NativeVideo({
  uri,
  playing,
  muted,
  onError,
}: {
  uri: string;
  playing: boolean;
  muted: boolean;
  onError: () => void;
}) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // Si el archivo falla (sin red, URL rota) se vuelve al poster sin romper la pantalla.
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  useEffect(() => {
    if (status === 'error') onError();
  }, [status, onError]);

  useEffect(() => {
    applyPlayback(player, playing, muted);
  }, [player, playing, muted]);

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
      // textureView: en Android la superficie por defecto no se dibuja bien dentro de vistas animadas (escala).
      surfaceType="textureView"
    />
  );
}

export function VideoCard({
  video,
  index,
  total,
  cardWidth,
  interval,
  scrollX,
  active,
  nearActive,
  canPlay,
  playing,
  soundOn,
  onSelect,
  onToggleSound,
  onTogglePlay,
}: Props) {
  const uri = mediaUrl(video.src);
  // Se recuerda QUÉ dirección falló (no un simple "falló"): si el video cambia, se vuelve a intentar.
  const [failedUri, setFailedUri] = useState<string | undefined>();
  const hasFile = !!uri && failedUri !== uri;
  const isPlaying = active && playing && canPlay;
  const tiktok = safeUrl(video.tiktokUrl);

  // La tarjeta central es la más grande y nítida; las vecinas quedan atenuadas (profundidad).
  const focusStyle = useAnimatedStyle(() => {
    const center = index * interval;
    const range = [center - interval, center, center + interval];
    return {
      transform: [{ scale: interpolate(scrollX.value, range, [0.84, 1, 0.84], 'clamp') }],
      opacity: interpolate(scrollX.value, range, [0.55, 1, 0.55], 'clamp'),
    };
  });

  // Barra de progreso simulada para el placeholder (con video real sería el progreso del archivo).
  const progress = useSharedValue(0);
  useEffect(() => {
    if (hasFile) return;
    if (isPlaying) {
      progress.value = withRepeat(
        withTiming(1, { duration: 8000, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      cancelAnimation(progress);
    }
    return () => cancelAnimation(progress);
  }, [hasFile, isPlaying, progress]);
  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <Animated.View
      accessible={false}
      accessibilityLabel={`Video ${index + 1} de ${total}`}
      style={[{ width: cardWidth }, focusStyle]}
    >
      <View style={[styles.box, shadows.lift, { width: cardWidth, height: cardWidth * (16 / 9) }]}>
        {/* El póster va siempre debajo: se ve hasta que el video pinta su primer cuadro. */}
        <MediaFrame image={video.poster} labelAt="top" style={StyleSheet.absoluteFill} />
        {hasFile && nearActive ? (
          <NativeVideo
            uri={uri}
            playing={isPlaying}
            muted={!(active && soundOn)}
            onError={() => setFailedUri(uri)}
          />
        ) : null}

        {(!active || !playing) && (
          <View pointerEvents="none" style={styles.playGlyph}>
            <AppText variant="h2" color={colors.white}>
              ▶
            </AppText>
          </View>
        )}

        {/* Progreso simulado solo para placeholders: con video real no se muestra una barra que no avanza. */}
        {active && !hasFile && (
          <View pointerEvents="none" style={styles.barTrack}>
            <Animated.View style={[styles.barFill, barStyle]} />
          </View>
        )}

        {active && (
          <View style={styles.tools}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={soundOn ? 'Apagar sonido' : 'Activar sonido'}
              accessibilityState={{ selected: soundOn }}
              onPress={onToggleSound}
              style={styles.round}
            >
              <AppText variant="lead">{soundOn ? '🔊' : '🔇'}</AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={playing ? 'Pausar video' : 'Reproducir video'}
              onPress={onTogglePlay}
              style={styles.round}
            >
              <AppText variant="lead">{playing ? '⏸' : '▶'}</AppText>
            </Pressable>
          </View>
        )}

        {!active && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ver video ${index + 1}: ${video.title}`}
            onPress={() => onSelect(index)}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>

      <View
        style={[styles.info, { opacity: active ? 1 : 0 }]}
        pointerEvents={active ? 'auto' : 'none'}
      >
        <AppText variant="h3">{video.title}</AppText>
        <AppText variant="small" color={colors.inkSoft}>
          {video.caption}
        </AppText>
        {tiktok ? (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Ver el video completo en TikTok"
            onPress={() => openLink(tiktok)}
            style={styles.link}
          >
            <AppText variant="label" color={colors.cerezaInk}>
              Ver completo en TikTok ↗
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.link}>
            <AppText variant="label" color={colors.inkSoft}>
              Ver completo en TikTok ↗ (enlace pendiente)
            </AppText>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radii.lg, overflow: 'hidden', backgroundColor: colors.rosaTint },
  playGlyph: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  barTrack: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    height: 3,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: colors.white },
  tools: { position: 'absolute', right: 12, bottom: 30, gap: 10 },
  round: {
    width: layout.touch,
    height: layout.touch,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { paddingTop: 14, paddingHorizontal: 6 },
  link: { minHeight: layout.touch, justifyContent: 'center' },
});
