import { profile } from '@soymariana/content';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';

import { Heart, Sparkle } from '@/components/brand/Doodles';
import { WordRotator } from '@/components/brand/WordRotator';
import { ButtonLink } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Eyebrow } from '@/components/ui/Section';

/** Entrada escalonada por CSS (no por JS): el titular no espera a que cargue el bundle para verse. */
const rise = (i: number) => ({ animationDelay: `${i * 90}ms` });

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const floatY = useTransform(scrollY, [0, 600], [0, -12]); // parallax muy ligero (≤ 12 px)

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="hero-bg relative -mt-[var(--header-h)] min-h-[min(100svh,880px)] overflow-x-clip pb-[clamp(3rem,8vw,6rem)] pt-[calc(var(--header-h)+28px)]"
    >
      <div className="wrap grid items-center gap-8 lg:min-h-[640px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <div className="animate-rise" style={rise(0)}>
            <Eyebrow>
              {profile.eyebrow} · {profile.city}
            </Eyebrow>
          </div>
          <h1 id="hero-title" className="mb-4 mt-1 text-hero animate-rise" style={rise(1)}>
            {profile.heroTitle} <em className="hand-underline">{profile.heroEmphasis}</em>
          </h1>
          <p className="max-w-[46ch] text-lead text-ink-soft animate-rise" style={rise(2)}>
            {profile.heroSubtitle}
          </p>
          <div className="my-6 animate-rise" style={rise(3)}>
            <WordRotator words={profile.heroWords} />
          </div>
          <div className="flex flex-wrap gap-3 animate-rise" style={rise(4)}>
            <ButtonLink variant="rosa" href="#videos">
              Mírame en acción
            </ButtonLink>
            <ButtonLink variant="quiet" href="#coleccion">
              Lo que pruebo
            </ButtonLink>
          </div>
          <p
            className="mt-8 hidden items-center gap-3 text-[0.9rem] text-ink-soft animate-rise sm:flex"
            style={rise(5)}
          >
            <span
              aria-hidden="true"
              className="relative block h-[34px] w-[22px] rounded-xl shadow-[inset_0_0_0_1.5px_var(--color-ink-soft)]"
            >
              <span className="absolute left-1/2 top-[7px] -ml-[1.5px] h-[7px] w-[3px] animate-wheel rounded-full bg-ink-soft" />
            </span>
            desliza, hay más
          </p>
        </div>

        {/* En móvil la foto va primero y más pequeña: el hero debe ser sobre todo visual. */}
        <div
          className="relative order-first w-[min(56%,230px)] justify-self-center animate-rise lg:order-none lg:w-[min(86%,440px)]"
          style={rise(2)}
        >
          <MediaFrame
            image={profile.heroImage}
            priority
            sizes="(min-width: 1024px) 440px, 230px"
            className="aspect-[1/1.05] rotate-[1.6deg] rounded-lg shadow-lift lg:aspect-[4/5]"
          />

          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ y: reduce ? 0 : floatY }}
          >
            <span className="absolute -left-5 -top-4 animate-float -rotate-6 rounded-xl bg-white px-3.5 py-1.5 font-hand text-[1.35rem] leading-none text-cereza-ink shadow-soft [animation-delay:-1s]">
              amiga, mira esto
            </span>
            <span className="absolute -right-5 bottom-10 animate-float rotate-[4deg] rounded-xl bg-white px-3.5 py-1.5 font-hand text-[1.35rem] leading-none shadow-soft [animation-delay:-3s]">
              lo probé ✦
            </span>
            <span className="absolute -right-6 top-[22%] animate-float rotate-[-3deg] whitespace-nowrap rounded-pill border-2 border-cereza-ink bg-cereza-tint px-3.5 py-1.5 text-[0.82rem] font-medium text-cereza-ink [animation-delay:-1.5s] max-sm:-right-3">
              ♡ Me lo llevo
            </span>
            <span className="absolute -bottom-6 -left-3 grid aspect-[9/16] w-20 -rotate-[5deg] animate-float place-items-center rounded-2xl border-[3px] border-white bg-gradient-to-br from-azul to-[#8fa8ff] text-xl text-white shadow-soft [animation-delay:-4s] sm:-left-4 sm:w-24">
              ▶
            </span>
            <Heart className="absolute -top-8 right-[34%] hidden size-8 animate-float text-cereza sm:block [animation-duration:5s]" />
            <Sparkle className="absolute -left-9 bottom-[16%] hidden size-6 animate-float text-azul sm:block [animation-delay:-2s] [animation-duration:6s]" />
          </m.div>
        </div>
      </div>
    </section>
  );
}
