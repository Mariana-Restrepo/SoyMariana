import { videos } from '@soymariana/content';

import { Reveal } from '@/components/brand/Reveal';
import { Eyebrow } from '@/components/ui/Section';
import { VideoCarousel } from '@/components/video/VideoCarousel';

/** Sección de videos: ocupa todo el ancho (el carrusel sangra hasta los bordes). */
export function VideosSection() {
  return (
    <section
      id="videos"
      aria-labelledby="videos-title"
      className="relative overflow-x-clip py-[var(--section-y)]"
    >
      <div className="wrap">
        <Reveal>
          <Eyebrow>Mi contenido</Eyebrow>
          <h2 id="videos-title" className="max-w-[14ch] text-h2">
            Mírame <em>en acción</em>
          </h2>
          <p className="mt-3 max-w-[46ch] text-lead text-ink-soft">
            Lo probé para que tú no tengas que hacerlo.
          </p>
        </Reveal>
      </div>
      <VideoCarousel videos={videos} />
    </section>
  );
}
