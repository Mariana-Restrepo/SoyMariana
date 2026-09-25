/**
 * Auditoría completa de la web en Chrome real. Uso:  npm run audit   (desde la raíz)
 *
 * Compila la web, la sirve y comprueba:
 *   1. Lighthouse (móvil y escritorio): rendimiento, accesibilidad, buenas prácticas, SEO
 *   2. axe-core (WCAG 2.2 AA) en varios estados: página, menú móvil, detalle, formulario
 *   3. PWA: service worker registrado, caché llena y la app abre SIN conexión
 *   4. "Reducir movimiento": sin animaciones ambientales, números finales, sin autoavance
 *   5. Teclado: enlace "saltar al contenido", foco visible, foco atrapado en diálogos, Esc
 *   6. SEO estructural: un solo h1, jerarquía de títulos, alt, JSON-LD válido, robots, sitemap
 *   7. Consola limpia y sin peticiones fallidas
 *
 * Sale con código 1 si algo falla. Necesita Chrome o Edge instalado (o CHROME_PATH).
 */
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import puppeteer from 'puppeteer-core';

const here = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(here, '..');
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const PORT = 4180;
const URL_BASE = `http://127.0.0.1:${PORT}`;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
let failures = 0;
const check = (group, name, ok, detail = '') => {
  results.push({ group, name, ok, detail });
  if (!ok) failures++;
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? `  · ${detail}` : ''}`);
};
const section = (title) => console.log(`\n${title}`);

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found)
    throw new Error('No encontré Chrome ni Edge. Define CHROME_PATH con la ruta del ejecutable.');
  return found;
}

/* ---------- compilar y servir ---------- */
console.log('Compilando la web…');
execFileSync('npm', ['run', 'build'], {
  cwd: webDir,
  env: { ...process.env, VITE_SITE_URL: URL_BASE },
  stdio: 'ignore',
  shell: true,
});
const server = spawn(
  'npx',
  ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1', '--strictPort'],
  {
    cwd: webDir,
    stdio: 'ignore',
    shell: true,
  },
);
for (let i = 0; i < 40; i++) {
  try {
    if ((await fetch(URL_BASE)).ok) break;
  } catch {
    /* aún no está listo */
  }
  await wait(250);
}

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const cdpPort = Number(new URL(browser.wsEndpoint()).port);

async function newPage({ mobile = true, reducedMotion = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport(
    mobile
      ? { width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { width: 1280, height: 800 },
  );
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  return page;
}

async function runAxe(page, label) {
  await page.evaluate(axeSource);
  const r = await page.evaluate(() =>
    // eslint-disable-next-line no-undef
    axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
      },
    }),
  );
  const detail = r.violations.map((v) => `${v.id}(${v.nodes.length})`).join(', ');
  check(
    'axe',
    `axe · ${label}`,
    r.violations.length === 0,
    detail || `${r.passes.length} reglas cumplidas`,
  );
  return r;
}

try {
  /* ---------- 1. Lighthouse ---------- */
  section('1. Lighthouse');
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
  const lhResults = {};
  for (const [name, config] of [
    ['móvil', undefined],
    ['escritorio', desktopConfig],
  ]) {
    // Una sola corrida de Lighthouse es ruidosa (el mismo código puede dar 74 y 96 seguidas,
    // según lo que haga el equipo en ese momento). Se hacen 3 y se usa la mediana por rendimiento.
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const { lhr } = await lighthouse(
        URL_BASE,
        { port: cdpPort, output: 'json', logLevel: 'error', onlyCategories: categories },
        config,
      );
      runs.push(lhr);
    }
    runs.sort(
      (x, y) => (x.categories.performance?.score ?? 0) - (y.categories.performance?.score ?? 0),
    );
    const lhr = runs[1];
    console.log(
      `  [${name}] rendimiento en 3 corridas: ${runs.map((r) => Math.round((r.categories.performance?.score ?? 0) * 100)).join(' · ')} → mediana`,
    );
    lhResults[name] = lhr;
    const score = (c) => Math.round((lhr.categories[c]?.score ?? 0) * 100);
    const a = lhr.audits;
    const metrics = `LCP ${a['largest-contentful-paint'].displayValue} · CLS ${a['cumulative-layout-shift'].displayValue} · TBT ${a['total-blocking-time'].displayValue} · FCP ${a['first-contentful-paint'].displayValue}`;
    console.log(`  [${name}] ${metrics}`);
    const targets = {
      performance: name === 'móvil' ? 90 : 95,
      accessibility: 95,
      'best-practices': 95,
      seo: 95,
    };
    for (const c of categories) {
      check(
        'lighthouse',
        `Lighthouse ${name} · ${c}`,
        score(c) >= targets[c],
        `${score(c)} (meta ≥ ${targets[c]})`,
      );
    }
    const failing = Object.values(a).filter(
      (x) =>
        x.score !== null &&
        x.score < 1 &&
        x.scoreDisplayMode !== 'informative' &&
        x.scoreDisplayMode !== 'notApplicable' &&
        x.scoreDisplayMode !== 'manual',
    );
    for (const f of failing.slice(0, 8))
      console.log(`      · mejorable: ${f.title} (${Math.round(f.score * 100)})`);
  }

  /* ---------- 2. axe en varios estados ---------- */
  section('2. Accesibilidad (axe-core, WCAG 2.2 AA)');
  {
    const desktop = await newPage({ mobile: false });
    await desktop.goto(URL_BASE, { waitUntil: 'networkidle0' });
    await runAxe(desktop, 'escritorio · página completa');
    await desktop.close();

    const m = await newPage();
    await m.goto(URL_BASE, { waitUntil: 'networkidle0' });
    await runAxe(m, 'móvil · página completa');

    await m.click('button[aria-controls="mobile-menu"]');
    await wait(600);
    await runAxe(m, 'móvil · menú abierto');
    await m.keyboard.press('Escape');
    await wait(500);

    await m.evaluate(() => document.querySelector('#coleccion article h3 button')?.click());
    await wait(600);
    await runAxe(m, 'móvil · detalle de recomendación');
    await m.evaluate(() =>
      document.querySelector('dialog[open] button[aria-label="Cerrar"]')?.click(),
    );
    await wait(400);

    await m.evaluate(() => document.querySelector('#floating-cta button')?.click());
    await wait(1200);
    await runAxe(m, 'móvil · formulario (paso 1)');
    await m.close();
  }

  /* ---------- 3. PWA ---------- */
  section('3. PWA (instalable y funciona sin conexión)');
  {
    const page = await newPage();
    await page.goto(URL_BASE, { waitUntil: 'networkidle0' });
    const sw = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      const names = await caches.keys();
      let entries = 0;
      for (const n of names) entries += (await (await caches.open(n)).keys()).length;
      return { active: !!reg.active, scope: reg.scope, entries };
    });
    check('pwa', 'Service worker activo', sw.active, sw.scope);
    check('pwa', 'Caché de la app precargada', sw.entries >= 10, `${sw.entries} archivos`);

    const manifest = await page.evaluate(async () => {
      const link = document.querySelector('link[rel="manifest"]');
      if (!link) return null;
      return (await fetch(link.href)).json();
    });
    check('pwa', 'Manifiesto enlazado', !!manifest, manifest?.name);
    if (manifest) {
      const icons = await page.evaluate(
        async (list) => Promise.all(list.map(async (i) => (await fetch(i.src)).status)),
        manifest.icons,
      );
      check(
        'pwa',
        'Íconos del manifiesto existen',
        icons.every((s) => s === 200),
        icons.join(','),
      );
      check(
        'pwa',
        'Ícono maskable presente',
        manifest.icons.some((i) => i.purpose === 'maskable'),
      );
      check(
        'pwa',
        'Modo standalone y colores',
        manifest.display === 'standalone' && !!manifest.theme_color,
      );
    }

    await page.setOfflineMode(true);
    await page.reload({ waitUntil: 'load' });
    await wait(1200);
    const offline = await page.evaluate(() => ({
      title: document.title,
      hero: !!document.querySelector('#hero-title'),
      sections: document.querySelectorAll('main section').length,
    }));
    check(
      'pwa',
      'Abre SIN conexión (hero y secciones)',
      offline.hero && offline.sections >= 6,
      `${offline.sections} secciones`,
    );
    await page.setOfflineMode(false);
    await page.close();
  }

  /* ---------- 4. Reducir movimiento ---------- */
  section('4. "Reducir movimiento" (prefers-reduced-motion)');
  {
    const page = await newPage({ mobile: false, reducedMotion: true });
    await page.goto(URL_BASE, { waitUntil: 'networkidle0' });
    await wait(600);
    const r = await page.evaluate(async () => {
      const anims = document
        .getAnimations()
        .filter(
          (a) => a.playState === 'running' && a.effect?.getComputedTiming().iterations === Infinity,
        );
      const word = () =>
        document.querySelector('#inicio [aria-hidden="true"] span.font-serif')?.textContent?.trim();
      const w1 = word();
      await new Promise((res) => setTimeout(res, 3500));
      return {
        infinite: anims.length,
        rotatorStatic: w1 === word(),
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      };
    });
    check(
      'reduced-motion',
      'Sin animaciones infinitas (stickers, scroll…)',
      r.infinite === 0,
      `${r.infinite} activas`,
    );
    check('reduced-motion', 'El rotador de palabras se queda quieto', r.rotatorStatic);
    check('reduced-motion', 'Scroll sin animación', r.scrollBehavior === 'auto', r.scrollBehavior);

    await page.evaluate(() => document.querySelector('#numeros')?.scrollIntoView());
    await wait(900);
    const nums = await page.evaluate(() =>
      [...document.querySelectorAll('#numeros .sr-only')].map((e) => e.textContent).join(' | '),
    );
    const shown = await page.evaluate(() =>
      [...document.querySelectorAll('#numeros [aria-hidden="true"]')]
        .map((e) => e.textContent?.trim())
        .filter(Boolean)
        .slice(0, 3)
        .join(' | '),
    );
    check(
      'reduced-motion',
      'Los números se ven completos (sin contar desde 0)',
      nums.length > 0 && shown.includes('1.402'),
      shown,
    );

    await page.evaluate(() => document.querySelector('#videos')?.scrollIntoView());
    const before = await page.evaluate(() =>
      [...document.querySelectorAll('#videos [data-index]')].findIndex((c) =>
        c.className.includes('scale-100'),
      ),
    );
    await wait(9500);
    const after = await page.evaluate(() =>
      [...document.querySelectorAll('#videos [data-index]')].findIndex((c) =>
        c.className.includes('scale-100'),
      ),
    );
    check(
      'reduced-motion',
      'El carrusel no avanza solo',
      before === after,
      `tarjeta ${before} → ${after}`,
    );
    await page.close();
  }

  /* ---------- 5. Teclado ---------- */
  section('5. Teclado y foco');
  {
    const page = await newPage({ mobile: false });
    await page.goto(URL_BASE, { waitUntil: 'networkidle0' });
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
    check('keyboard', 'El primer Tab es "Saltar al contenido"', /saltar/i.test(first ?? ''), first);
    await page.keyboard.press('Enter');
    const hash = await page.evaluate(() => location.hash);
    check('keyboard', 'El enlace lleva al contenido principal', hash === '#main', hash);

    const ring = await page.evaluate(() => {
      const a = document.querySelector('header nav a');
      a.focus({ focusVisible: true });
      const s = getComputedStyle(a);
      return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
    });
    check(
      'keyboard',
      'Foco visible en enlaces (anillo azul)',
      ring.style !== 'none' && ring.width >= 2,
      `${ring.style} ${ring.width}px`,
    );

    // Abrir el formulario con teclado y comprobar que el foco queda atrapado
    await page.evaluate(() =>
      [...document.querySelectorAll('#trabajemos button')]
        .find((b) => /Quiero trabajar/.test(b.textContent))
        ?.focus(),
    );
    await page.keyboard.press('Enter');
    await wait(1200);
    let inside = true;
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      inside &&= await page.evaluate(() => {
        const el = document.activeElement;
        // Con un <dialog> modal el fondo es inerte: el foco solo puede estar dentro del diálogo o en el propio navegador (body).
        return !el || el === document.body || !!el.closest('dialog[open]');
      });
    }
    check(
      'keyboard',
      'El foco nunca llega a la página de fondo con el formulario abierto (14 Tab)',
      inside,
    );
    await page.keyboard.press('Escape');
    await wait(500);
    const back = await page.evaluate(() => ({
      closed: !document.querySelector('dialog[open]'),
      onTrigger: /Quiero trabajar/.test(document.activeElement?.textContent ?? ''),
    }));
    check(
      'keyboard',
      'Esc cierra el formulario y devuelve el foco al botón',
      back.closed && back.onTrigger,
    );
    await page.close();
  }

  /* ---------- 6. SEO estructural ---------- */
  section('6. SEO y estructura');
  {
    const page = await newPage({ mobile: false });
    await page.goto(URL_BASE, { waitUntil: 'networkidle0' });
    const s = await page.evaluate(() => {
      const meta = (sel) => document.querySelector(sel)?.getAttribute('content') ?? '';
      const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1]));
      let skip = false;
      heads.reduce((prev, cur) => {
        if (cur - prev > 1) skip = true;
        return cur;
      }, 1);
      let ld = null;
      try {
        ld = JSON.parse(
          document.querySelector('script[type="application/ld+json"]')?.textContent ?? '',
        );
      } catch {
        ld = null;
      }
      return {
        lang: document.documentElement.lang,
        title: document.title,
        description: meta('meta[name="description"]'),
        h1: document.querySelectorAll('h1').length,
        skip,
        imgsNoAlt: [...document.querySelectorAll('img')].filter(
          (i) => i.alt === undefined || i.getAttribute('alt') === null,
        ).length,
        canonical: document.querySelector('link[rel=canonical]')?.href,
        og: ['og:title', 'og:description', 'og:image', 'og:url'].every((p) =>
          meta(`meta[property="${p}"]`),
        ),
        twitter: meta('meta[name="twitter:card"]'),
        ldTypes: ld?.['@graph']?.map((n) => n['@type']).join(','),
        themeColor: meta('meta[name="theme-color"]'),
      };
    });
    check('seo', 'lang="es-CO"', s.lang === 'es-CO', s.lang);
    check(
      'seo',
      'Título entre 30 y 70 caracteres',
      s.title.length >= 30 && s.title.length <= 70,
      `${s.title.length}: ${s.title}`,
    );
    check(
      'seo',
      'Descripción entre 70 y 170 caracteres',
      s.description.length >= 70 && s.description.length <= 170,
      `${s.description.length}`,
    );
    check('seo', 'Un solo <h1>', s.h1 === 1, String(s.h1));
    check('seo', 'Jerarquía de títulos sin saltos', !s.skip);
    check('seo', 'Todas las imágenes tienen alt', s.imgsNoAlt === 0);
    check('seo', 'Canonical, Open Graph y Twitter Card', !!s.canonical && s.og && !!s.twitter);
    check(
      'seo',
      'Datos estructurados JSON-LD válidos',
      /Person/.test(s.ldTypes ?? '') && /WebSite/.test(s.ldTypes ?? ''),
      s.ldTypes,
    );
    const robots = await (await fetch(`${URL_BASE}/robots.txt`)).text();
    const sitemap = await (await fetch(`${URL_BASE}/sitemap.xml`)).text();
    check('seo', 'robots.txt apunta al sitemap', /Sitemap:/.test(robots));
    check('seo', 'sitemap.xml válido', /<urlset/.test(sitemap) && /<loc>/.test(sitemap));
    const og = await fetch(`${URL_BASE}/og-image.png`);
    check(
      'seo',
      'Imagen para redes existe (og-image.png)',
      og.ok && og.headers.get('content-type') === 'image/png',
    );
    await page.close();
  }

  /* ---------- 7. Consola y red ---------- */
  section('7. Consola y peticiones');
  {
    const page = await newPage();
    const problems = [];
    page.on('console', (m) => {
      if (['error', 'warning'].includes(m.type()))
        problems.push(`${m.type()}: ${m.text().slice(0, 120)}`);
    });
    page.on('requestfailed', (r) => problems.push(`falló: ${r.url().slice(0, 100)}`));
    page.on('response', (r) => {
      if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url().slice(0, 100)}`);
    });
    await page.goto(URL_BASE, { waitUntil: 'networkidle0' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await wait(800);
    check(
      'console',
      'Sin errores de consola ni peticiones fallidas',
      problems.length === 0,
      problems.slice(0, 3).join(' | '),
    );
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
  try {
    execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  } catch {
    /* en otros sistemas basta con server.kill() */
  }
}

console.log(
  `\n${failures === 0 ? '✓ Todo en orden' : `✗ ${failures} comprobación(es) fallaron`} (${results.length} en total)`,
);
process.exit(failures === 0 ? 0 : 1);
