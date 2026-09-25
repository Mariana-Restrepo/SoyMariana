import type { Video } from '@soymariana/content';
import { useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';

import { useVideoController } from './use-video-controller';
import { VideoCard } from './VideoCard';

type Props = {
  videos: readonly Video[];
  /** Cada cuántos ms avanza solo (solo si la persona no ha interactuado). */
  autoAdvanceMs?: number;
};

const arrowClass =
  'grid size-12 place-items-center rounded-full text-lg shadow-[inset_0_0_0_1.5px_var(--color-ink)] transition duration-300 ease-out-soft hover:scale-105 hover:bg-ink hover:text-paper';

/**
 * Carrusel con scroll-snap nativo (táctil y fluido): la tarjeta al centro es la activa,
 * las vecinas quedan atenuadas. Un solo video se reproduce, y solo mientras el carrusel se ve.
 */
export function VideoCarousel({ videos, autoAdvanceMs = 8000 }: Props) {
  const reduceMotion = useReducedMotion();
  const ctl = useVideoController(videos.length);
  const { active, setActive, wrap } = ctl;

  const rail = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [announce, setAnnounce] = useState('');

  const goTo = useCallback(
    (index: number, smooth = true) => {
      const container = rail.current;
      const card = container?.querySelectorAll<HTMLElement>('[data-index]')[wrap(index)];
      if (!container || !card) return;
      container.scrollTo({
        left: card.offsetLeft - (container.clientWidth - card.clientWidth) / 2,
        behavior: smooth && !reduceMotion ? 'smooth' : 'auto',
      });
    },
    [reduceMotion, wrap],
  );

  // Detecta cuál tarjeta está más cerca del centro mientras se desliza.
  useEffect(() => {
    const container = rail.current;
    if (!container) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const middle = container.scrollLeft + container.clientWidth / 2;
        let best = 0;
        let bestDistance = Infinity;
        container.querySelectorAll<HTMLElement>('[data-index]').forEach((card, i) => {
          const distance = Math.abs(card.offsetLeft + card.clientWidth / 2 - middle);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        });
        setActive(best);
      });
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener('scroll', onScroll);
    };
  }, [setActive]);

  // Centra la primera tarjeta al montar y conserva la tarjeta activa al cambiar el tamaño
  // (en el celular, ocultar la barra del navegador también dispara "resize").
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    goTo(0, false);
    const onResize = () => goTo(activeRef.current, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [goTo]);

  // Solo se reproduce mientras el carrusel está visible en pantalla.
  useEffect(() => {
    const container = rail.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Avance automático suave: nunca si hay interacción, pausa, reduced-motion o pestaña oculta.
  useEffect(() => {
    if (reduceMotion || ctl.interacted || !ctl.playing || !inView || !ctl.pageVisible) return;
    const id = window.setInterval(() => goTo(active + 1), autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [
    reduceMotion,
    ctl.interacted,
    ctl.playing,
    inView,
    ctl.pageVisible,
    active,
    autoAdvanceMs,
    goTo,
  ]);

  const select = (index: number) => {
    ctl.markInteracted();
    goTo(index);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      select(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  };

  const toggleSound = () => {
    ctl.toggleSound();
    setAnnounce(
      ctl.soundOn ? 'Sonido apagado.' : 'Sonido activado. Solo suena el video que estás viendo.',
    );
  };

  return (
    <div>
      <div className="wrap mb-2 flex justify-end">
        <div role="group" aria-label="Cambiar de video" className="hidden gap-2.5 md:flex">
          <button
            type="button"
            className={arrowClass}
            aria-label="Video anterior"
            onClick={() => select(active - 1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className={arrowClass}
            aria-label="Video siguiente"
            onClick={() => select(active + 1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* Región desplazable y enfocable (requisito de accesibilidad): ← → cambian de video. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={rail}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Videos de TikTok"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={ctl.markInteracted}
        onWheel={ctl.markInteracted}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[calc(50%-130px)] pb-8 pt-7"
      >
        {videos.map((video, i) => (
          <VideoCard
            key={video.id}
            video={video}
            index={i}
            total={videos.length}
            active={i === active}
            nearActive={Math.abs(i - active) <= 1}
            canPlay={inView && ctl.pageVisible}
            playing={ctl.playing}
            soundOn={ctl.soundOn}
            onSelect={select}
            onToggleSound={toggleSound}
            onTogglePlay={ctl.togglePlay}
          />
        ))}
      </div>

      <div className="flex justify-center" role="group" aria-label="Elegir video">
        {videos.map((video, i) => (
          <button
            key={video.id}
            type="button"
            aria-label={`Video ${i + 1}`}
            aria-current={i === active}
            onClick={() => select(i)}
            className="group grid h-11 min-w-7 place-items-center px-0.5"
          >
            <span
              aria-hidden="true"
              className={cn(
                'block h-2 rounded-full transition-all duration-300 ease-out-soft',
                i === active ? 'w-[26px] bg-cereza' : 'w-2 bg-ink/20 group-hover:bg-ink/40',
              )}
            />
          </button>
        ))}
      </div>

      <p
        aria-live="polite"
        className="mt-3.5 min-h-[1.4em] text-center text-[0.85rem] text-ink-soft"
      >
        {announce}
      </p>
    </div>
  );
}
