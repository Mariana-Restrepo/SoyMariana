import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const here = dirname(fileURLToPath(import.meta.url));
const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(resolve(here, '../../packages/content/data', file), 'utf8')) as T;

type Site = {
  title: string;
  description: string;
  themeColor: string;
  ogImage: string;
  keywords: string[];
};
type Links = Record<string, { url: string } | string>;

const isRealUrl = (value: string) => /^https?:\/\//i.test(value);
const escAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * SEO en tiempo de compilación, todo sale de packages/content (una sola fuente):
 * title, description, Open Graph, canonical, JSON-LD (Person + WebSite), robots.txt y sitemap.xml.
 */
function seo(siteUrl: string): Plugin {
  const site = readJson<Site>('site.json');
  const links = readJson<Links>('links.json');

  const sameAs = Object.values(links)
    .map((v) => (typeof v === 'string' ? v : v.url))
    .filter(isRealUrl);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#mariana`,
        name: 'Mariana Restrepo',
        alternateName: 'Soy Mariana',
        jobTitle: 'Creadora de contenido',
        description: site.description,
        url: `${siteUrl}/`,
        image: `${siteUrl}${site.ogImage}`,
        knowsAbout: [
          'Creación de contenido',
          'Belleza',
          'Cabello',
          'Restaurantes',
          'Desarrollo frontend',
        ],
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'Soy Mariana',
        url: `${siteUrl}/`,
        inLanguage: 'es-CO',
        publisher: { '@id': `${siteUrl}/#mariana` },
      },
    ],
  };

  const tokens: Record<string, string> = {
    __SITE_TITLE__: escAttr(site.title),
    __SITE_DESCRIPTION__: escAttr(site.description),
    __SITE_KEYWORDS__: escAttr(site.keywords.join(', ')),
    __THEME_COLOR__: site.themeColor,
    __OG_IMAGE_URL__: `${siteUrl}${site.ogImage}`,
    __SITE_URL__: siteUrl,
    __JSON_LD__: JSON.stringify(jsonLd, null, 2).replace(/</g, '\\u003c'),
  };

  return {
    name: 'soymariana-seo',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace(/__[A-Z_]+__/g, (token) => tokens[token] ?? token),
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url><loc>${siteUrl}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n` +
          `</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, here, 'VITE_');
  const siteUrl = (env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
  if (command === 'build' && !env.VITE_SITE_URL) {
    console.warn(
      '\n⚠  VITE_SITE_URL no está definida: canonical, Open Graph y sitemap quedan apuntando a http://localhost:5173.\n' +
        '   Define VITE_SITE_URL=https://tu-dominio.com antes de publicar (ver apps/web/.env.example).\n',
    );
  }
  const site = readJson<Site>('site.json');

  return {
    plugins: [
      react(),
      tailwindcss(),
      seo(siteUrl),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
        manifest: {
          name: 'Soy Mariana',
          short_name: 'Soy Mariana',
          description: site.description,
          lang: 'es-CO',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait',
          theme_color: site.themeColor,
          background_color: '#FFFAF6',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            {
              src: '/icons/icon-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          // Se guarda la "cáscara" de la app. Los videos NO se precachean (pesan y son opcionales).
          globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
          navigateFallback: '/index.html',
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    resolve: { alias: { '@': resolve(here, 'src') } },
    server: { port: 5173 },
    preview: { port: 4173 },
  };
});
