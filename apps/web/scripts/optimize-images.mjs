/**
 * Optimiza tus fotos para la web. Uso:  npm run images   (desde la raíz)
 *
 * 1. Copia tus fotos originales a  apps/web/media-src/   (JPG, PNG, WebP, AVIF o TIFF; cualquier tamaño)
 * 2. Corre  npm run images
 * 3. Copia el bloque JSON que imprime dentro de tu archivo de contenido (packages/content/data/*.json)
 *
 * Para cada foto genera versiones WebP de 480, 960 y 1440 px de ancho en apps/web/public/media/images/
 * (el navegador elige la que necesita: menos datos en el celular, más nitidez en pantallas grandes).
 *
 * Además:
 *  - Corrige la orientación de las fotos del celular.
 *  - ELIMINA los metadatos EXIF (ubicación GPS, modelo del celular, fecha…): las fotos que subes a
 *    un sitio público no deberían decir dónde vives ni dónde estabas.
 *
 * Los originales (media-src/) no se suben a git: pesan y pueden traer metadatos privados.
 */
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, '../media-src');
const outDir = resolve(here, '../public/media/images');
const WIDTHS = [480, 960, 1440];
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);

mkdirSync(srcDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

const slug = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'foto';

const files = readdirSync(srcDir).filter((f) => EXT.has(extname(f).toLowerCase()));
if (files.length === 0) {
  console.log(
    `No hay fotos en ${srcDir}\nCopia ahí tus originales y vuelve a correr: npm run images`,
  );
  process.exit(0);
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

for (const file of files) {
  const name = slug(basename(file, extname(file)));
  const input = sharp(resolve(srcDir, file), { failOn: 'none' }).rotate(); // .rotate() aplica la orientación EXIF
  const meta = await sharp(resolve(srcDir, file)).rotate().metadata();
  const originalWidth = meta.autoOrient?.width ?? meta.width ?? 0;

  // Nunca se agranda una foto: solo se generan anchos menores o iguales al original.
  const widths = WIDTHS.filter((w) => w <= originalWidth);
  if (widths.length === 0) widths.push(originalWidth);

  const made = [];
  for (const w of widths) {
    const out = resolve(outDir, `${name}-${w}.webp`);
    const info = await input
      .clone()
      .resize({ width: w })
      .webp({ quality: 78, effort: 5 })
      .toFile(out);
    made.push({ w, height: info.height, size: info.size });
  }

  const main = made.find((m) => m.w === 960) ?? made[made.length - 1];
  const srcSet = made.map((m) => `/media/images/${name}-${m.w}.webp ${m.w}w`).join(', ');

  console.log(
    `\n✓ ${file}  (${originalWidth}px)  →  ${made.map((m) => `${m.w}px ${kb(m.size)}`).join(' · ')}`,
  );
  console.log('  Pega esto en el JSON (cambia "alt" por una descripción real de la foto):');
  console.log(
    JSON.stringify(
      {
        src: `/media/images/${name}-${main.w}.webp`,
        srcSet,
        width: main.w,
        height: main.height,
        alt: 'DESCRIBE_LA_FOTO',
        placeholder: `[IMAGEN_${name.toUpperCase().replace(/-/g, '_')}]`,
        tone: 'rosa',
      },
      null,
      2,
    )
      .split('\n')
      .map((l) => `  ${l}`)
      .join('\n'),
  );
}

if (!existsSync(outDir)) process.exitCode = 1;
console.log(
  '\nListo. Recuerda: escribe un "alt" que describa la imagen (lo lee el lector de pantalla).',
);
