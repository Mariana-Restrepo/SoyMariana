import { useCallback, useEffect, useState } from 'react';

/**
 * Estado único del carrusel de videos. Reglas (docs/fase-2 §5.2):
 *  1. Solo el video activo puede reproducirse.
 *  2. Siempre inicia mudo: el sonido lo activa la persona con un gesto y es una preferencia
 *     que se conserva al cambiar de video, pero nunca suenan dos a la vez.
 *  3. Si la persona interactúa (toca, desliza, pausa), el avance automático se detiene.
 *  4. Nada se reproduce si la pestaña no está visible.
 */
export function useVideoController(count: number) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const markInteracted = useCallback(() => setInteracted(true), []);
  const toggleSound = useCallback(() => {
    setSoundOn((v) => !v);
    setInteracted(true);
  }, []);
  const togglePlay = useCallback(() => {
    setPlaying((v) => !v);
    setInteracted(true);
  }, []);

  const wrap = useCallback((index: number) => (index + count) % count, [count]);

  return {
    active,
    setActive,
    playing,
    soundOn,
    interacted,
    pageVisible,
    markInteracted,
    toggleSound,
    togglePlay,
    wrap,
  };
}
