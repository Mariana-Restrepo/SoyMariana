# Soy Mariana

Experiencia digital personal de **Mariana Restrepo**: creadora de contenido ("la amiga que prueba todo primero") y desarrolladora frontend. Una **web** responsive instalable como PWA y una **app móvil**, que comparten contenido, sistema de diseño y lógica.

|                | Tecnología                                                                           |
| -------------- | ------------------------------------------------------------------------------------ |
| **Web**        | React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · PWA                        |
| **Móvil**      | Expo · React Native · Expo Router · TypeScript                                       |
| **Compartido** | `tokens` (diseño) · `content` (JSON + esquemas) · `core` (lógica), en npm workspaces |

## Requisitos

- [Node.js](https://nodejs.org) 20 o superior (probado con 24)
- [Visual Studio Code](https://code.visualstudio.com) con las extensiones de `.vscode/extensions.json`
- Para la app móvil: **Expo Go** en tu celular, o un emulador Android

## Empezar

```bash
npm install     # una sola vez, desde la raíz: instala todo el monorepo
npm run web     # abre la web en http://localhost:5173
```

| Comando                        | Qué hace                                                                                |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `npm run web`                  | Web en modo desarrollo (recarga al guardar)                                             |
| `npm run web:lan`              | Web visible desde otros dispositivos de tu red (ej. tu iPhone)                          |
| `npm run mobile`               | App móvil con Expo (`a` Android, o escanea el QR con Expo Go)                           |
| `npm run mobile:tunnel`        | Igual, pero por internet (si tu Wi-Fi no deja conectar el celular)                      |
| `npm run build`                | Compila la web para producción (`apps/web/dist`)                                        |
| `npm run preview`              | Sirve el build de producción para probarlo                                              |
| `npm run check`                | **Todo junto**: tipos, lint, pruebas y validación del contenido                         |
| `npm run audit`                | **Auditoría en Chrome real**: Lighthouse, accesibilidad, PWA sin conexión, teclado, SEO |
| `npm run images`               | Optimiza tus fotos (versiones responsive y sin ubicación GPS)                           |
| `npm run check:content`        | Valida el contenido y lista qué `[PLACEHOLDERS]` faltan reemplazar                      |
| `npm run check:content:strict` | Igual, pero **falla** si queda alguno (úsalo antes de publicar)                         |
| `npm run tokens`               | Regenera `tokens.css` desde el sistema de diseño                                        |
| `npm run assets`               | Regenera íconos PWA e imagen para redes (provisionales)                                 |
| `npm run format`               | Da formato al código con Prettier                                                       |

## Estructura

```
SoyMariana/
├── apps/
│   ├── web/                 React + Vite: secciones, componentes, PWA, SEO
│   │   ├── public/media/      imágenes (y videos en desarrollo) del sitio
│   │   └── src/               app · sections · components · hooks · lib · styles
│   └── mobile/              Expo + React Native: 5 pestañas, video nativo
├── packages/
│   ├── tokens/              colores, tipografía, espaciado, movimiento → tokens.css + objetos TS
│   ├── content/             TODO el contenido editable (data/*.json) + esquemas y tipos
│   └── core/                lógica pura: formato, filtros, formulario, analítica
└── docs/                    guías por fase (1 a 6); empieza por fase-6/06-guia-de-uso.md
```

## Cambiar el contenido

Todo el texto, videos, recomendaciones y proyectos viven en [`packages/content/data/`](packages/content/data). **No hace falta tocar componentes**: edita el JSON, guarda y la web se actualiza.

| Quiero cambiar…                  | Archivo                               |
| -------------------------------- | ------------------------------------- |
| Mis datos, historia, frase final | `profile.json`                        |
| Redes y correo                   | `links.json`                          |
| Videos del carrusel              | `videos.json`                         |
| Categorías de "Lo que pruebo"    | `categories.json`                     |
| Recomendaciones y lugares        | `recommendations.json`, `places.json` |
| Mis números y mi audiencia       | `metrics.json`                        |
| Sección para marcas              | `collab.json`                         |
| Título y descripción (SEO)       | `site.json`                           |

Después de editar, corre `npm run check:content`: valida el formato y te dice qué `[PLACEHOLDERS]` siguen pendientes. Guía paso a paso: [docs/fase-6](docs/fase-6/06-guia-de-uso.md).

## Variables de entorno

Copia `apps/web/.env.example` a `apps/web/.env.local`:

- `VITE_SITE_URL`: URL pública del sitio (canonical, Open Graph, sitemap).
- `VITE_INQUIRY_ENDPOINT`: servicio que recibe el formulario de marcas. Sin él, el formulario abre el correo (mailto).

## Documentación

- [Fase 1 · Dirección creativa y arquitectura](docs/fase-1/01-direccion-creativa-y-arquitectura.md)
- [Fase 2 · Diseño visual y componentes](docs/fase-2/02-wireframes-y-componentes.md) · [prototipo visual](docs/fase-2/prototipo-visual.html)
- [Fase 3 · Implementación web](docs/fase-3/03-implementacion-web.md)
- [Fase 4 · App móvil](docs/fase-4/04-app-movil.md) (incluye cómo verla en tu iPhone)
- [Fase 5 · Optimización y auditoría](docs/fase-5/05-optimizacion-y-auditoria.md) (resultados, fotos, videos y qué revisar antes de publicar)
- [Fase 6 · Guía de uso](docs/fase-6/06-guia-de-uso.md) (correr, cambiar contenido, actualizar números, publicar y qué hacer si algo falla)

## Convenciones

- Alias `@/` → `apps/web/src/` en la web.
- Tokens: nunca escribas un color o tamaño suelto; usa las clases de Tailwind derivadas de `packages/tokens`.
- Paquetes nuevos: `npm install <paquete> -w @soymariana/web` (o el workspace que corresponda). En móvil, `npx expo install <paquete>` desde `apps/mobile`.
- **React va fijado en 19.2.3** en toda la raíz para que web y móvil compartan una sola copia; no lo actualices por separado.
