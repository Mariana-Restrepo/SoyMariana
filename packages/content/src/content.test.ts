import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { categories, places, recommendations, videos } from './index';
import { extractPlaceholders, findPlaceholders, isPlaceholder } from './placeholders';
import { categoryInfoSchema, placeSchema, recommendationSchema, videoSchema } from './schemas';

describe('contenido de ejemplo', () => {
  it('cumple los esquemas', () => {
    expect(z.array(videoSchema).safeParse(videos).success).toBe(true);
    expect(z.array(categoryInfoSchema).safeParse(categories).success).toBe(true);
    expect(z.array(recommendationSchema).safeParse(recommendations).success).toBe(true);
    expect(z.array(placeSchema).safeParse(places).success).toBe(true);
  });

  it('los slugs e ids son únicos', () => {
    const slugs = [...recommendations, ...places].map((x) => x.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const ids = videos.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('placeholders', () => {
  it('detecta [PLACEHOLDERS] en mayúsculas', () => {
    expect(isPlaceholder('[VIDEO_TIKTOK_01]')).toBe(true);
    expect(isPlaceholder('[CORREO]')).toBe(true);
    expect(isPlaceholder('Hola [CIUDAD]')).toBe(true);
    expect(isPlaceholder('texto normal')).toBe(false);
    expect(isPlaceholder('[minúsculas]')).toBe(false);
    expect(isPlaceholder('[Texto entre corchetes en minúscula]')).toBe(false);
    expect(isPlaceholder('Foto de Mariana (pendiente de agregar)')).toBe(true);
  });

  it('extrae y ubica placeholders dentro de estructuras', () => {
    expect(extractPlaceholders('[A_B] y [CD]')).toEqual(['[A_B]', '[CD]']);
    expect(findPlaceholders({ a: ['[X_1]'], b: { c: 'ok' } })).toEqual([
      { path: '$.a[0]', placeholder: '[X_1]' },
    ]);
  });

  it('una imagen con src real ya no cuenta su etiqueta', () => {
    const pending = { src: '', alt: 'Foto', placeholder: '[IMAGEN_HERO_01]' };
    const done = { src: '/media/hero.jpg', alt: 'Foto', placeholder: '[IMAGEN_HERO_01]' };
    expect(findPlaceholders(pending)).toHaveLength(1);
    expect(findPlaceholders(done)).toHaveLength(0);
  });
});
