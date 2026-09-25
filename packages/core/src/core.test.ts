import { describe, expect, it, vi } from 'vitest';

import { categories, recommendations } from '@soymariana/content';

import { setTracker, track } from './analytics';
import { categoriesWithItems, filterByCategory } from './collection';
import { formatApprox, formatCompact, formatInt, formatMetric } from './format';
import {
  buildMailto,
  emptyInquiry,
  submitInquiry,
  toInquiry,
  validateInquiry,
  type InquiryDraft,
} from './inquiry';
import { hashString, seededRotation } from './seed';

describe('formato de números', () => {
  it('separa miles con punto', () => {
    expect(formatInt(1402)).toBe('1.402');
    expect(formatInt(999)).toBe('999');
    expect(formatInt(1234567)).toBe('1.234.567');
  });
  it('compacta con coma decimal', () => {
    expect(formatCompact(10300)).toBe('10,3K');
    expect(formatCompact(10000)).toBe('10K');
    expect(formatCompact(1_500_000)).toBe('1,5M');
    expect(formatCompact(950)).toBe('950');
  });
  it('aproxima', () => {
    expect(formatApprox(2000)).toBe('~2.000');
    expect(formatMetric(2000, 'approx')).toBe('~2.000');
    expect(formatMetric(1402, 'int')).toBe('1.402');
    expect(formatMetric(10300, 'compact')).toBe('10,3K');
  });
});

describe('rotación orgánica', () => {
  it('es estable para el mismo id', () => {
    expect(seededRotation('rec-01')).toBe(seededRotation('rec-01'));
    expect(hashString('a')).toBe(hashString('a'));
  });
  it('respeta el máximo y varía entre ids', () => {
    const values = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => seededRotation(id, 2));
    values.forEach((v) => expect(Math.abs(v)).toBeLessThanOrEqual(2));
    expect(new Set(values).size).toBeGreaterThan(1);
  });
});

describe('colección', () => {
  it('filtra por categoría', () => {
    expect(filterByCategory(recommendations, 'all')).toHaveLength(recommendations.length);
    const belleza = filterByCategory(recommendations, 'belleza');
    expect(belleza.length).toBeGreaterThan(0);
    expect(belleza.every((r) => r.category === 'belleza')).toBe(true);
  });
  it('solo ofrece categorías con elementos', () => {
    const shown = categoriesWithItems(categories, recommendations);
    expect(shown.every((c) => recommendations.some((r) => r.category === c.key))).toBe(true);
    expect(shown.length).toBeLessThan(categories.length + 1);
  });
});

const valid: InquiryDraft = {
  ...emptyInquiry,
  name: ' Ana ',
  brand: 'Marca X',
  email: 'ana@marca.co',
  message: 'Hola, tengo una idea.',
};

describe('formulario de marcas', () => {
  it('valida el paso 1 y el paso 2 por separado', () => {
    expect(Object.keys(validateInquiry(emptyInquiry, 1)).sort()).toEqual([
      'brand',
      'email',
      'name',
    ]);
    expect(Object.keys(validateInquiry(emptyInquiry, 2))).toEqual(['message']);
    expect(validateInquiry(valid)).toEqual({});
  });
  it('rechaza correos inválidos', () => {
    expect(validateInquiry({ ...valid, email: 'no-es-correo' }, 1).email).toBeDefined();
    expect(validateInquiry({ ...valid, email: 'a@b' }, 1).email).toBeDefined();
  });
  it('limpia espacios y aplica el tipo por defecto', () => {
    const q = toInquiry(valid, 'Reseña');
    expect(q.name).toBe('Ana');
    expect(q.collabType).toBe('Reseña');
    expect(q.budget).toBeUndefined();
  });
  it('arma el mailto con asunto y cuerpo codificados', () => {
    const href = buildMailto('mari@ejemplo.co', toInquiry(valid, 'Reseña'));
    expect(href.startsWith('mailto:mari@ejemplo.co?subject=')).toBe(true);
    expect(decodeURIComponent(href)).toContain('Colaboración con Marca X');
    expect(decodeURIComponent(href)).toContain('Hola, tengo una idea.');
  });

  describe('envío', () => {
    const inquiry = toInquiry(valid, 'Reseña');

    it('ignora bots (honeypot) sin enviar nada', async () => {
      const fetchImpl = vi.fn();
      const r = await submitInquiry(inquiry, {
        endpoint: 'https://x',
        honeypot: 'spam',
        fetchImpl,
      });
      expect(r).toEqual({ ok: true, via: 'ignored' });
      expect(fetchImpl).not.toHaveBeenCalled();
    });
    it('usa el endpoint cuando existe', async () => {
      const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      const r = await submitInquiry(inquiry, { endpoint: 'https://x', fetchImpl });
      expect(r).toEqual({ ok: true, via: 'endpoint' });
      expect(fetchImpl).toHaveBeenCalledOnce();
    });
    it('informa error si el servicio falla o no hay red', async () => {
      const bad = vi.fn().mockResolvedValue({ ok: false, status: 500 });
      expect((await submitInquiry(inquiry, { endpoint: 'https://x', fetchImpl: bad })).ok).toBe(
        false,
      );
      const down = vi.fn().mockRejectedValue(new Error('offline'));
      expect((await submitInquiry(inquiry, { endpoint: 'https://x', fetchImpl: down })).ok).toBe(
        false,
      );
    });
    it('sin endpoint usa mailto solo si el correo es real', async () => {
      const ok = await submitInquiry(inquiry, { email: 'mari@ejemplo.co' });
      expect(ok).toMatchObject({ ok: true, via: 'mailto' });
      const placeholder = await submitInquiry(inquiry, { email: '[CORREO]' });
      expect(placeholder.ok).toBe(false);
    });
  });
});

describe('analítica', () => {
  it('no rompe aunque el tracker falle', () => {
    setTracker(() => {
      throw new Error('boom');
    });
    expect(() => track('evento')).not.toThrow();
    const spy = vi.fn();
    setTracker(spy);
    track('cta_click', { where: 'hero' });
    expect(spy).toHaveBeenCalledWith('cta_click', { where: 'hero' });
  });
});
