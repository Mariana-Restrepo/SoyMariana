import type { Video } from '@soymariana/content';
import { useEffect, useRef, useState } from 'react';

import { DisclosureTag } from '@/components/brand/DisclosureTag';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { cn, externalProps, safeHref } from '@/lib/utils';

type Props = {
  video: Video;
  index: number;
  total: number;
  active: boolean;
  /** Esta tarjeta está a una posición o menos de la activa: se puede cargar el archivo. */
  nearActive: boolean;
  /** El carrusel está en pantalla y la pestaña visible: se permite reproducir. */
  canPlay: boolean;
  playing: boolean;
  soundOn: boolean;
  onSelect: (index: number) => void;
  onToggleSound: () => void;
  onTogglePlay: () => void;
};

const roundBtn =
  'grid size-11 place-items-center rounded-full bg-white/90 text-lg shadow-soft transition hover:scale-110 aria-pressed:bg-ink aria-pressed:text-white';

export function VideoCard({
  video,
  index,
  total,
  active,
  nearActive,
  canPlay,
  playing,
  soundOn,
  onSelect,
  onToggleSound,
  onTogglePlay,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [failed, setFailed] = useState(false);
  const hasFile = !!video.src && !failed;
  const shouldLoad = hasFile && nearActive;
  const isPlaying = active && playing && canPlay;

  // Reproducción: solo el activo, solo si está permitido, y con el sonido que la persona eligió.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = !(active && soundOn);
    if (isPlaying) {
      el.play().catch(() => {
        // El navegador puede bloquear la reproducción: se queda en el poster sin romper nada.
      });
    } else {
      el.pause();
    }
  }, [isPlaying, active, soundOn, shouldLoad]);

  const tiktok = safeHref(video.tiktokUrl);

  return (
    <div
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${index + 1} de ${total}`}
      data-index={index}
      className={cn(
        'shrink-0 basis-[260px] snap-center transition duration-500 ease-out-soft',
        active
          ? 'scale-100 opacity-100 md:hover:scale-[1.035]'
          : 'scale-[0.84] opacity-55 blur-[1.2px] saturate-[0.85]',
      )}
    >
      <div className="relative isolate aspect-[9/16] overflow-hidden rounded-lg shadow-lift">
        {shouldLoad ? (
          <video
            ref={ref}
            src={video.src}
            poster={video.poster.src}
            aria-label={video.title}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (bar.current && v.duration) {
                bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
              }
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <MediaFrame
            image={video.poster}
            labelAt="top"
            className="absolute inset-0 h-full w-full"
          />
        )}

        {/* Luz que se desplaza mientras "reproduce" el placeholder */}
        {!hasFile && (
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -inset-[30%] -z-10 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255_/_0.55),transparent_45%)]',
              isPlaying && 'animate-drift',
            )}
          />
        )}

        {/* Botón de reproducir cuando el video está en pausa o es una tarjeta lateral */}
        {(!active || !playing) && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid place-items-center text-4xl text-white drop-shadow"
          >
            ▶
          </span>
        )}

        {/* Barra de progreso: real (timeupdate) o simulada para el placeholder */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-3.5 bottom-3.5 h-[3px] overflow-hidden rounded-full bg-white/50 transition-opacity',
            active ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span
            ref={bar}
            className={cn(
              'block h-full w-full origin-left scale-x-0 bg-white',
              !hasFile && 'animate-progress',
            )}
            style={!hasFile ? { animationPlayState: isPlaying ? 'running' : 'paused' } : undefined}
          />
        </span>

        {/* Controles: solo el video activo los ofrece (los demás no reciben foco) */}
        <div
          className={cn(
            'absolute bottom-7 right-3 flex flex-col gap-2.5 transition duration-300 ease-out-soft',
            active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1.5 opacity-0',
          )}
        >
          <button
            type="button"
            className={roundBtn}
            tabIndex={active ? 0 : -1}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Apagar sonido' : 'Activar sonido'}
            onClick={onToggleSound}
          >
            <span aria-hidden="true">{soundOn ? '🔊' : '🔇'}</span>
          </button>
          <button
            type="button"
            className={roundBtn}
            tabIndex={active ? 0 : -1}
            aria-pressed={!playing}
            aria-label={playing ? 'Pausar video' : 'Reproducir video'}
            onClick={onTogglePlay}
          >
            <span aria-hidden="true">{playing ? '⏸' : '▶'}</span>
          </button>
        </div>

        {/* Tarjetas laterales: todo el cuadro es un botón para traerlas al centro */}
        {!active && (
          <button
            type="button"
            className="absolute inset-0 z-10 cursor-pointer rounded-lg"
            aria-label={`Ver video ${index + 1}: ${video.title}`}
            onClick={() => onSelect(index)}
          />
        )}
      </div>

      <div
        className={cn(
          'px-1.5 pt-3.5 transition-opacity duration-300',
          active ? 'opacity-100' : 'opacity-0',
        )}
      >
        <h3 className="text-[1.3rem] leading-tight">{video.title}</h3>
        <p className="text-[0.92rem] text-ink-soft">{video.caption}</p>
        {video.disclosure && <DisclosureTag disclosure={video.disclosure} className="mt-2" />}
        {tiktok ? (
          <a
            href={tiktok}
            tabIndex={active ? 0 : -1}
            className="mt-1.5 inline-flex min-h-11 items-center text-[0.85rem] font-medium text-cereza-ink hover:underline"
            {...externalProps(tiktok)}
          >
            Ver completo en TikTok ↗
          </a>
        ) : (
          <span
            className="mt-1.5 inline-flex min-h-11 items-center text-[0.85rem] font-medium text-ink-soft"
            title="Enlace pendiente"
          >
            Ver completo en TikTok ↗
          </span>
        )}
      </div>
    </div>
  );
}
