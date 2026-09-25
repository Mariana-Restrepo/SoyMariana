/**
 * Genera generated/tokens.css (Tailwind v4 @theme + variables CSS) desde los tokens TS.
 * Es lo único que se ejecuta para que web y móvil compartan el mismo sistema de diseño.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { breakpoints, motion, zIndex } from '../src/breakpoints-motion';
import { palette, tones } from '../src/colors';
import { radii, shadows } from '../src/radii-shadows';
import { layout } from '../src/spacing';
import { fontFamily, fontSizeFluid } from '../src/typography';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
const rem = (n: number) => `${n / 16}rem`;
const px = (n: number) => `${n}px`;

const lines: string[] = [];
const add = (line = '') => lines.push(line);

add(
  '/* GENERADO por packages/tokens/scripts/build-css.ts. No editar a mano: edita packages/tokens/src. */',
);
add('@theme {');
add('  /* Colores */');
for (const [k, v] of Object.entries(palette)) add(`  --color-${kebab(k)}: ${v};`);
add();
add('  /* Tipografía */');
for (const [k, v] of Object.entries(fontFamily)) add(`  --font-${k}: ${v};`);
for (const [k, v] of Object.entries(fontSizeFluid)) {
  add(`  --text-${kebab(k)}: ${v.size};`);
  add(`  --text-${kebab(k)}--line-height: ${v.lineHeight};`);
}
add();
add('  /* Radios y sombras */');
for (const [k, v] of Object.entries(radii)) add(`  --radius-${k}: ${px(v)};`);
for (const [k, v] of Object.entries(shadows)) add(`  --shadow-${k}: ${v};`);
add();
add('  /* Breakpoints (móvil primero) */');
for (const [k, v] of Object.entries(breakpoints)) add(`  --breakpoint-${k}: ${rem(v)};`);
add();
add('  /* Movimiento */');
add(`  --ease-out-soft: cubic-bezier(${motion.easing.outSoft.join(', ')});`);
add(`  --ease-in-out-soft: cubic-bezier(${motion.easing.inOutSoft.join(', ')});`);
add('}');
add();
add(':root {');
add('  /* Layout */');
add(`  --max-w: ${px(layout.maxWidth)};`);
add(`  --gutter: ${layout.gutter};`);
add(`  --section-y: ${layout.section};`);
add(`  --header-h: ${px(layout.headerHeight)};`);
add(`  --header-h-compact: ${px(layout.headerHeightCompact)};`);
add(`  --touch: ${px(layout.touchTarget)};`);
add();
add('  /* Movimiento */');
for (const [k, v] of Object.entries(motion.duration)) add(`  --dur-${k}: ${v}ms;`);
add();
add('  /* Capas */');
for (const [k, v] of Object.entries(zIndex)) add(`  --z-${kebab(k)}: ${v};`);
add();
add('  /* Tonos de foto / placeholder */');
for (const [k, v] of Object.entries(tones)) {
  add(`  --tone-${k}-from: ${v.from};`);
  add(`  --tone-${k}-to: ${v.to};`);
}
add('}');
add();

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../generated/tokens.css');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join('\n'));
console.log(`tokens.css generado (${lines.length} líneas) → ${out}`);
