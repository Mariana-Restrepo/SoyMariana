/**
 * Valida el contenido con los esquemas y lista los [PLACEHOLDERS] que faltan por reemplazar.
 *
 *   npm run check:content            → valida; los placeholders son solo un aviso
 *   npm run check:content -- --strict → además FALLA si queda algún placeholder (usar antes de publicar)
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import { findPlaceholders } from '../src/placeholders';
import * as S from '../src/schemas';

const dataDir = resolve(dirname(fileURLToPath(import.meta.url)), '../data');
const strict = process.argv.includes('--strict');

const files = {
  'site.json': S.siteSchema,
  'profile.json': S.profileSchema,
  'links.json': S.linksSchema,
  'videos.json': z.array(S.videoSchema),
  'categories.json': z.array(S.categoryInfoSchema),
  'recommendations.json': z.array(S.recommendationSchema),
  'places.json': z.array(S.placeSchema),
  'metrics.json': S.metricsFileSchema,
  'collab.json': S.collabSchema,
} as const;

let invalid = 0;
let totalPlaceholders = 0;
const report: string[] = [];

for (const [name, schema] of Object.entries(files)) {
  const raw: unknown = JSON.parse(readFileSync(resolve(dataDir, name), 'utf8'));
  const result = schema.safeParse(raw);
  if (!result.success) {
    invalid++;
    console.error(`✗ ${name} no es válido:`);
    for (const issue of result.error.issues) {
      console.error(`    ${issue.path.join('.') || '(raíz)'}: ${issue.message}`);
    }
    continue;
  }
  const found = findPlaceholders(raw);
  totalPlaceholders += found.length;
  console.log(
    `✓ ${name}${found.length ? `  · ${found.length} placeholder(s) por reemplazar` : ''}`,
  );
  if (found.length) {
    const unique = [...new Set(found.map((f) => f.placeholder))];
    report.push(`  ${name}: ${unique.join(' ')}`);
  }
}

if (report.length) {
  console.log('\nPendiente de reemplazar con contenido real:');
  console.log(report.join('\n'));
}

if (invalid > 0) {
  console.error(`\n${invalid} archivo(s) con errores.`);
  process.exit(1);
}
if (strict && totalPlaceholders > 0) {
  console.error(`\n--strict: quedan ${totalPlaceholders} placeholder(s). No publiques todavía.`);
  process.exit(1);
}
console.log(strict ? '\nContenido listo para publicar.' : '\nContenido válido.');
