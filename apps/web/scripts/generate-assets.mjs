/**
 * Genera los recursos gráficos de la web a partir de formas vectoriales y las tipografías reales:
 *   public/favicon.svg, public/icons/*.png (PWA, favicon, apple-touch) y public/og-image.png
 *
 * Uso:  npm run assets -w @soymariana/web
 *
 * Son recursos PROVISIONALES con la identidad del prototipo. Cuando tengas tu logo o una foto
 * definitiva, reemplaza los archivos de public/ (mismos nombres y tamaños) y no hace falta tocar código.
 * El texto se convierte a trazos con opentype.js para no depender de fuentes instaladas en el equipo.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import opentype from 'opentype.js';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '../public');
mkdirSync(resolve(publicDir, 'icons'), { recursive: true });

const C = {
  paper: '#FFFAF6',
  ink: '#2B1F26',
  inkSoft: '#6B5A63',
  rosa: '#FF8DB5',
  rosaTint: '#FFE1EA',
  cereza: '#D92B3F',
  azul: '#2F55E0',
};

/* ---------- forma de la marca: un corazón sobre rosa ---------- */
const HEART =
  'M32 51 C11 37 9 22 20 16 C26 12.5 31 15.5 32 20 C33 15.5 38 12.5 44 16 C55 22 53 37 32 51 Z';

const iconSvg = ({ size, rounded = true, scale = 1, bg = C.rosa }) => {
  const r = rounded ? size * 0.25 : 0;
  const t = (size * (1 - scale)) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
    <g transform="translate(${t} ${t}) scale(${(size / 64) * scale})"><path d="${HEART}" fill="#fff"/></g>
  </svg>`;
};

// favicon.svg (vectorial, con el degradado suave de la marca)
writeFileSync(
  resolve(publicDir, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="${C.rosa}"/>
  <path d="${HEART}" fill="#fff"/>
</svg>
`,
);

const png = async (svg, file) => {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(resolve(publicDir, file));
  console.log('✓', file);
};

await png(iconSvg({ size: 32 }), 'icons/favicon-32.png');
await png(iconSvg({ size: 180, rounded: false }), 'icons/apple-touch-icon.png');
await png(iconSvg({ size: 192 }), 'icons/icon-192.png');
await png(iconSvg({ size: 512 }), 'icons/icon-512.png');
// maskable: fondo a sangre y el corazón dentro de la "zona segura" (80 %).
await png(iconSvg({ size: 512, rounded: false, scale: 0.62 }), 'icons/icon-maskable-512.png');

/* ---------- imagen para compartir (Open Graph 1200×630) ---------- */
const fontFile = (name) =>
  readFileSync(require.resolve(`@fontsource/instrument-serif/files/${name}.woff`));
const toArrayBuffer = (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const regular = opentype.parse(toArrayBuffer(fontFile('instrument-serif-latin-400-normal')));
const italic = opentype.parse(toArrayBuffer(fontFile('instrument-serif-latin-400-italic')));

// opentype.js no soporta las sustituciones contextuales (GSUB) de esta fuente, así que se
// compone el texto glifo por glifo (con kerning si la fuente lo trae).
// toPathData() de opentype.js omite el cierre (Z) de los contornos; se serializa a mano.
const num = (n) => Number(n.toFixed(2));
const commandsToD = (commands) =>
  commands
    .map((c) => {
      switch (c.type) {
        case 'M':
        case 'L':
          return `${c.type}${num(c.x)} ${num(c.y)}`;
        case 'Q':
          return `Q${num(c.x1)} ${num(c.y1)} ${num(c.x)} ${num(c.y)}`;
        case 'C':
          return `C${num(c.x1)} ${num(c.y1)} ${num(c.x2)} ${num(c.y2)} ${num(c.x)} ${num(c.y)}`;
        default:
          return 'Z';
      }
    })
    .join(' ');

const layout = (font, text, x, y, size) => {
  const scale = size / font.unitsPerEm;
  let cursor = x;
  const d = [];
  const glyphs = [...text].map((ch) => font.charToGlyph(ch));
  glyphs.forEach((glyph, i) => {
    d.push(commandsToD(glyph.getPath(cursor, y, size).commands));
    let kern = 0;
    const next = glyphs[i + 1];
    if (next) {
      try {
        kern = font.getKerningValue(glyph, next) || 0;
      } catch {
        kern = 0;
      }
    }
    cursor += (glyph.advanceWidth + kern) * scale;
  });
  return { d, width: cursor - x };
};
const textPath = (font, text, x, y, size, fill) =>
  `<g fill="${fill}">${layout(font, text, x, y, size)
    .d.filter(Boolean)
    .map((d) => `<path d="${d}"/>`)
    .join('')}</g>`;
const width = (font, text, size) => layout(font, text, 0, 0, size).width;

const W = 1200;
const H = 630;
const soy = 'Soy';
const mariana = 'Mariana';
const bigSize = 190;
const gap = 22;
const total = width(italic, soy, bigSize) + gap + width(regular, mariana, bigSize);
const startX = (W - total) / 2;
const baseline = 330;

const tagline = 'La amiga que prueba todo primero.';
const tagSize = 46;
const tagWidth = width(italic, tagline, tagSize);
const sub = 'Productos, lugares y recomendaciones reales.';
const subSize = 34;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g1" cx="82%" cy="24%" r="55%"><stop offset="0" stop-color="${C.rosa}"/><stop offset="1" stop-color="${C.rosa}" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="6%" cy="96%" r="45%"><stop offset="0" stop-color="${C.rosaTint}"/><stop offset="1" stop-color="${C.rosaTint}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>
  ${textPath(italic, soy, startX, baseline, bigSize, C.ink)}
  ${textPath(regular, mariana, startX + width(italic, soy, bigSize) + gap, baseline, bigSize, C.ink)}
  <rect x="${startX + width(italic, soy, bigSize) + gap}" y="${baseline + 18}" width="${width(regular, mariana, bigSize) * 0.78}" height="14" rx="7" fill="${C.rosa}" opacity="0.9"/>
  ${textPath(italic, tagline, (W - tagWidth) / 2, baseline + 128, tagSize, C.cereza)}
  ${textPath(regular, sub, (W - width(regular, sub, subSize)) / 2, baseline + 188, subSize, C.inkSoft)}
  <g transform="translate(1030 70) rotate(10) scale(1.5)"><path d="${HEART}" fill="${C.cereza}"/></g>
  <g transform="translate(96 470) rotate(-12) scale(0.9)"><path d="${HEART}" fill="${C.azul}" opacity="0.9"/></g>
</svg>`;
await png(og, 'og-image.png');
console.log('Listo. Recursos provisionales generados en apps/web/public.');
