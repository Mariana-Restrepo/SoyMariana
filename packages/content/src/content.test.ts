import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { categories, disclosures, metrics, places, recommendations, videos } from './index';
import { legal } from './legal';
import { extractPlaceholders, findPlaceholders, isPlaceholder } from './placeholders';
import {
  categoryInfoSchema,
  disclosureKeys,
  disclosuresFileSchema,
  legalFileSchema,
  metricsFileSchema,
  placeSchema,
  recommendationSchema,
  videoSchema,
} from './schemas';

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

describe('audiencia', () => {
  it('cumple el esquema y cada grupo suma 100 %', () => {
    expect(metricsFileSchema.safeParse(metrics).success).toBe(true);
    for (const group of metrics.audience?.groups ?? []) {
      const total = group.items.reduce((sum, item) => sum + item.value, 0);
      expect(total, group.id).toBeCloseTo(100, 5);
    }
  });
});

describe('transparencia y textos legales', () => {
  it('cumplen los esquemas', () => {
    expect(disclosuresFileSchema.safeParse(disclosures).success).toBe(true);
    expect(legalFileSchema.safeParse(legal).success).toBe(true);
  });

  it('hay una definición por cada etiqueta de transparencia', () => {
    expect(disclosures.items.map((item) => item.key).sort()).toEqual([...disclosureKeys].sort());
  });

  it('los textos legales solo usan datos que se rellenan', () => {
    const allowed = new Set(['name', 'place', 'email']);
    const text = JSON.stringify(legal);
    const tokens = [...text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1] ?? '');
    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens) expect(allowed.has(token), token).toBe(true);
  });

  it('cada documento tiene secciones con id único', () => {
    for (const doc of [legal.privacy, legal.terms]) {
      const ids = doc.sections.map((section) => section.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
    expect(legal.terms.sections.some((section) => section.showDisclosures)).toBe(true);
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
