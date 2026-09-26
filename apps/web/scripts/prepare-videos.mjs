/**
 * Prepara tus videos para la web. Uso:  npm run videos            (todos)
 *                                       npm run videos -- nombre1 nombre2
 *
 * 1. Copia tus videos (MP4/MOV) a  apps/web/media-src/videos/   (esa carpeta no se sube a git)
 * 2. Corre  npm run videos
 * 3. Copia el bloque JSON que imprime dentro de packages/content/data/videos.json
 *
 * Por cada video genera, en apps/web/public/media/videos/, un clip listo para el carrusel:
 *   · vertical 9:16 (si el original es horizontal, lo centra sobre un fondo desenfocado)
 *   · recortado a `duration` segundos (15 por defecto), desde `start`
 *   · H.264 + AAC con "faststart" (empieza a verse sin esperar la descarga completa)
 *   · de ≤ 3 MB: si pesa más, lo recomprime con más fuerza hasta que quepa
 * y una portada en WebP (480 px y ancho completo) en apps/web/public/media/images/.
 *
 * Los recortes se ajustan en  apps/web/video-clips.json  (start, duration, mute, posterAt).
 * Los originales NUNCA se modifican.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, '../media-src/videos');
const outDir = resolve(here, '../public/media/videos');
const imgDir = resolve(here, '../public/media/images');
const tmpDir = resolve(here, '../media-src/.tmp');
const clipsFile = resolve(here, '../video-clips.json');

const MAX_BYTES = 3 * 1024 * 1024;
const CRFS = [28, 31, 34, 37];
const EXT = new Set(['.mp4', '.mov', '.m4v']);
const DEFAULTS = { start: 0, duration: 15, mute: false, posterAt: 1 };

const slug = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'video';

const even = (n) => Math.max(2, Math.round(n / 2) * 2);
const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
const clock = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

function run(args) {
  return spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    encoding: 'utf8',
  });
}

/** Lee tamaño (ya con la rotación del celular aplicada), duración y si tiene audio. */
function probe(file) {
  const out = spawnSync(ffmpeg, ['-hide_banner', '-i', file], { encoding: 'utf8' }).stderr;
  const size = out.match(/Video:.*?(\d{2,5})x(\d{2,5})/);
  const time = out.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!size || !time) return null;
  let [w, h] = [Number(size[1]), Number(size[2])];
  const rotation = out.match(/rotation of (-?\d+)/);
  if (rotation && Math.abs(Number(rotation[1])) % 180 === 90) [w, h] = [h, w];
  return {
    w,
    h,
    seconds: Number(time[1]) * 3600 + Number(time[2]) * 60 + Number(time[3]),
    hasAudio: /Audio:/.test(out),
  };
}

/** Filtro para dejar el video en 9:16. Nunca agranda: si el original es más chico, queda igual. */
function buildFilter(w, h) {
  if (w > h) {
    // Horizontal: sale completo, centrado sobre un fondo desenfocado (no se recorta la escena).
    const outW = Math.min(720, even(w * 0.5625));
    const outH = even((outW * 16) / 9);
    return {
      outW,
      outH,
      complex:
        `[0:v]split=2[bg][fg];` +
        `[bg]scale=${outW}:${outH}:force_original_aspect_ratio=increase,crop=${outW}:${outH},boxblur=24:6[b];` +
        `[fg]scale=${outW}:-2[f];[b][f]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]`,
    };
  }
  const outW = Math.min(720, even(w));
  const outH = even((outW * 16) / 9);
  return {
    outW,
    outH,
    simple: `scale=${outW}:${outH}:force_original_aspect_ratio=increase,crop=${outW}:${outH},format=yuv420p`,
  };
}

mkdirSync(srcDir, { recursive: true });
mkdirSync(outDir, { recursive: true });
mkdirSync(imgDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

const clips = existsSync(clipsFile) ? JSON.parse(readFileSync(clipsFile, 'utf8')) : {};
const wanted = process.argv.slice(2).map(slug);
const files = readdirSync(srcDir)
  .filter((f) => EXT.has(extname(f).toLowerCase()))
  .filter((f) => wanted.length === 0 || wanted.includes(slug(basename(f, extname(f)))))
  .sort();

if (files.length === 0) {
  console.log(
    `No hay videos${wanted.length ? ' con ese nombre' : ''} en ${srcDir}\n` +
      'Copia ahí tus originales y vuelve a correr: npm run videos',
  );
  process.exit(0);
}

let problems = 0;
for (const file of files) {
  const name = slug(basename(file, extname(file)));
  const input = resolve(srcDir, file);
  const info = probe(input);
  if (!info) {
    console.log(`✗ ${file}: no pude leerlo (¿es un video válido?)`);
    problems++;
    continue;
  }

  const cfg = { ...DEFAULTS, ...(clips[name] ?? {}) };
  const start = Math.min(Math.max(0, cfg.start), Math.max(0, info.seconds - 1));
  const duration = Math.min(cfg.duration, info.seconds - start);
  const { outW, outH, complex, simple } = buildFilter(info.w, info.h);
  const output = resolve(outDir, `${name}.mp4`);

  let crfUsed = 0;
  let ok = false;
  for (const crf of CRFS) {
    const args = ['-ss', String(start), '-t', String(duration), '-i', input];
    if (complex) args.push('-filter_complex', complex, '-map', '[v]');
    else args.push('-vf', simple, '-map', '0:v:0');
    args.push(
      '-c:v',
      'libx264',
      '-profile:v',
      'main',
      '-preset',
      'slow',
      '-crf',
      String(crf),
      '-movflags',
      '+faststart',
    );
    if (cfg.mute || !info.hasAudio) args.push('-an');
    else args.push('-map', '0:a:0', '-c:a', 'aac', '-b:a', '64k', '-ac', '1');
    args.push(output);

    const result = run(args);
    if (result.status !== 0) {
      console.log(`✗ ${file}: ffmpeg falló\n${result.stderr}`);
      problems++;
      break;
    }
    crfUsed = crf;
    if (statSync(output).size <= MAX_BYTES) {
      ok = true;
      break;
    }
  }
  if (!existsSync(output)) continue;
  const size = statSync(output).size;
  if (!ok) {
    console.log(
      `⚠ ${name}: pesa ${mb(size)} MB incluso al máximo de compresión. Acórtalo en video-clips.json.`,
    );
    problems++;
  }

  // Portada: un cuadro del clip ya recortado, en WebP.
  const still = resolve(tmpDir, `${name}.jpg`);
  run([
    '-ss',
    String(Math.min(cfg.posterAt, duration - 0.1)),
    '-i',
    output,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    still,
  ]);
  // Borra portadas viejas de este video (por ejemplo, de otro tamaño) antes de generar las nuevas.
  for (const old of readdirSync(imgDir).filter((f) => f.startsWith(`${name}-poster-`))) {
    rmSync(resolve(imgDir, old), { force: true });
  }
  const widths = [...new Set([480, outW].filter((w) => w <= outW))];
  const made = [];
  for (const w of widths) {
    const posterFile = `${name}-poster-${w}.webp`;
    const infoImg = await sharp(still)
      .resize({ width: w })
      .webp({ quality: 78, effort: 5 })
      .toFile(resolve(imgDir, posterFile));
    made.push({ w, height: infoImg.height, file: posterFile });
  }
  rmSync(still, { force: true });
  const big = made[made.length - 1];

  console.log(
    `\n✓ ${file}\n  ${clock(start)}–${clock(start + duration)} · ${outW}x${outH} · ${mb(size)} MB (crf ${crfUsed})` +
      `${cfg.mute || !info.hasAudio ? ' · sin audio' : ''}` +
      `${info.w > info.h ? ' · horizontal: centrado sobre fondo desenfocado' : ''}`,
  );
  console.log('  Pega esto en videos.json (cambia title, caption, alt y tiktokUrl):');
  console.log(
    JSON.stringify(
      {
        id: `video-${name}`,
        title: 'TITULO_CORTO',
        caption: 'UNA_LINEA_EN_TU_VOZ',
        src: `/media/videos/${name}.mp4`,
        poster: {
          src: `/media/images/${big.file}`,
          srcSet: made.map((m) => `/media/images/${m.file} ${m.w}w`).join(', '),
          width: big.w,
          height: big.height,
          alt: 'DESCRIBE_LA_PORTADA',
          placeholder: `[PORTADA_${name.toUpperCase().replace(/-/g, '_')}]`,
          tone: 'rosa',
        },
        tiktokUrl: 'LINK_DEL_VIDEO_EN_TIKTOK',
        disclosure: 'propio',
      },
      null,
      2,
    )
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n'),
  );
}

rmSync(tmpDir, { recursive: true, force: true });
console.log(
  `\nListo${problems ? ` (con ${problems} aviso${problems > 1 ? 's' : ''})` : ''}. ` +
    'Los clips están en apps/web/public/media/videos/ (no se suben a git: en producción van a tu servicio de alojamiento).',
);
process.exitCode = problems ? 1 : 0;
