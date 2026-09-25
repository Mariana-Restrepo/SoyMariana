# Fase 3 · Implementación web

Estado: **web completa con contenido de ejemplo**, monorepo funcionando. La app móvil (Fase 4) y la auditoría final (Fase 5) siguen pendientes.

## 1. Qué se construyó

**Monorepo (npm workspaces)**: el Expo que ya existía se movió a `apps/mobile` (con `git mv`, se conserva el historial) y se agregaron:

| Paquete               | Contiene                                                                                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@soymariana/tokens`  | Colores, tipografía, espaciado, radios, sombras, breakpoints, movimiento y capas. Un script genera `tokens.css` (tema de Tailwind v4) y los mismos valores quedan como objetos TS para móvil |
| `@soymariana/content` | 10 archivos JSON con todo el contenido, esquemas (zod), tipos, y `check-content` que valida y lista `[PLACEHOLDERS]`                                                                         |
| `@soymariana/core`    | Lógica sin UI: formato de números, filtros, validación y envío del formulario, rotación "orgánica" estable, interfaz de analítica. 16 pruebas                                                |
| `@soymariana/web`     | La web: 8 secciones, header/menú móvil, botón flotante, formulario, PWA, SEO                                                                                                                 |

**Secciones** (`apps/web/src/sections`): Hero · Videos (carrusel) · Categorías · Colección + Diario de lugares · Sobre mí · Números · Trabajemos juntas (+ formulario).

> **Actualización (Fase 4):** la sección "Su otra capa / Y cuando no estoy creando…" (lado developer) se retiró por decisión de Mariana, en web y en la app. Su contenido (`developer.json`) sigue en el historial de git (commit `b19267d`) por si se quiere retomar.

## 2. Decisiones y diferencias respecto al plan

| Tema                        | Decisión                                                                                                                                                                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React fijado en 19.2.3**  | Web y móvil deben compartir **una sola copia** de React (dos copias rompen React Native). Se verificó: solo existe `node_modules/react`. No actualizarlo por separado.                                                                                     |
| **Tipografías propias**     | Se sirven desde el propio sitio (`@fontsource`), no desde Google Fonts: más rápido, funciona sin conexión en la PWA y no comparte datos de las visitas con terceros.                                                                                       |
| **Contraste corregido**     | Al medir con axe/WCAG, el texto rojo de los sellos sobre su fondo rosado daba 3,7:1 (el prototipo de la Fase 2 tenía ese defecto). Se agregaron los tokens `cerezaInk` y `rosaInk` para texto pequeño; el cereza puro queda para botones con texto blanco. |
| **Detalle de lugar**        | En la Fase 1 se planteó un overlay también para lugares. Se omitió: la tarjeta polaroid ya muestra todo (qué probé, reseña, veredicto, enlaces). Las **recomendaciones** sí tienen detalle con link propio (`/?r=slug`).                                   |
| **Imágenes**                | Viven en `apps/web/public/media/images/` (no en `packages/content/media` como decía la Fase 1): así Vite las sirve y optimiza sin configuración extra. Para la app móvil se usarán URLs.                                                                   |
| **Videos fuera de git**     | `apps/web/public/media/videos/` está ignorado por git (pesan). En producción van a un servicio de alojamiento y en el JSON solo se guarda la URL.                                                                                                          |
| **Formulario sin backend**  | Con `VITE_INQUIRY_ENDPOINT` envía a ese servicio; sin él abre el correo de la persona (mailto). En desarrollo simula el envío. Nunca finge éxito en producción si no hay a dónde enviar.                                                                   |
| **Enlaces con placeholder** | Un `[LINK_TIKTOK]` nunca se convierte en enlace roto: se muestra como texto con subrayado punteado hasta que exista el enlace real. El JSON-LD tampoco publica redes falsas.                                                                               |
| **Números "pendientes"**    | Audiencia, ciudades, engagement, etc. están en `metrics.json` pero **no se muestran** en producción (solo en desarrollo, como recordatorio).                                                                                                               |

## 3. Cómo cambiar el contenido

Todo en `packages/content/data/`. Después de editar: `npm run check:content`.

### Agregar un video nuevo

1. Prepara el clip: vertical 9:16, **720×1280, MP4 H.264, 6–15 s, ≤ 3 MB**, idealmente sin marca de agua.
2. Súbelo a tu servicio de alojamiento (Cloudflare R2 / Bunny / Cloudinary). Para probar en tu PC, ponlo en `apps/web/public/media/videos/mi-video.mp4` y usa `"/media/videos/mi-video.mp4"`.
3. En `videos.json` agrega un objeto:

```json
{
  "id": "video-06",
  "title": "Título corto",
  "caption": "Una línea en mi voz",
  "src": "https://tu-hosting.com/mi-video.mp4",
  "poster": {
    "src": "/media/images/portada-06.webp",
    "alt": "Descripción de la portada",
    "placeholder": "portada",
    "tone": "rosa"
  },
  "tiktokUrl": "https://www.tiktok.com/@usuario/video/123"
}
```

Sin `src` se ve el placeholder de color. El orden del archivo es el orden del carrusel.

### Agregar una recomendación

En `recommendations.json`: `id` y `slug` **únicos**, `category` (belleza, cabello, cuidado-personal, restaurantes, lugares, productos, lifestyle) y `verdict` (`repite`, `sorprendio`, `vale-la-pena`, `se-queda`, `volveria`, `no-convencio`). `liked`/`disliked` son opcionales. Los lugares van en `places.json` con el mismo esquema de veredicto.

### Reemplazar una imagen

Copia la foto a `apps/web/public/media/images/` (WebP o JPG, ~1200 px de ancho máx.) y en el JSON pon `"src": "/media/images/foto.webp"`. Escribe un `alt` que describa la imagen. Al tener `src`, el `[PLACEHOLDER]` de esa imagen deja de contar como pendiente.

### Antes de publicar

```bash
npm run check                  # tipos, lint, pruebas, contenido
npm run check:content:strict   # falla si queda algún [PLACEHOLDER]
```

Y crea `apps/web/.env.local` con `VITE_SITE_URL` (y `VITE_INQUIRY_ENDPOINT` si conectas el formulario).

## 4. Verificación realizada

| Comprobación                                                                                                               | Resultado                                                    |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `tsc` (todos los paquetes y apps), ESLint (con `jsx-a11y`), Prettier                                                       | Sin errores                                                  |
| Pruebas unitarias (`core` 16, `content` 5)                                                                                 | 21 / 21                                                      |
| Contenido validado con zod                                                                                                 | 10 / 10 archivos                                             |
| Build web de producción                                                                                                    | OK · JS inicial **125 KB gz** (meta < 150) · CSS 10 KB gz    |
| Bundle Android de la app Expo desde el monorepo · `expo-doctor`                                                            | OK · 21 / 21                                                 |
| **axe-core** (WCAG 2.2 AA + buenas prácticas) en móvil: página, menú abierto, detalle abierto, formulario                  | **0 violaciones** (antes de corregir: 3 tipos, ya resueltos) |
| Flujos probados en navegador: carrusel, sonido/pausa, categorías, filtros, detalle con URL, formulario 2 pasos, menú móvil | Funcionan                                                    |
| Sin desborde horizontal en 375 px                                                                                          | OK                                                           |
| SEO del build: title, description, Open Graph, canonical, JSON-LD, robots, sitemap, manifest                               | Generados desde el contenido                                 |

### Lo que NO se pudo comprobar aún

- **Service worker de la PWA:** se genera y se sirve bien, pero el navegador integrado del editor no admite service workers, así que no se pudo confirmar la instalación. Prueba en Chrome real: `npm run build && npm run preview` → ícono de instalar en la barra de direcciones.
- **Rendimiento medido:** no se corrió Lighthouse ni se probó en un celular real; el peso del bundle es el único dato de rendimiento verificado.
- **Videos reales:** solo se probó con placeholders (la lógica de reproducción, sonido y límite de un video activo está escrita para `<video>` real, pero no se ejercitó con archivos).
- **`prefers-reduced-motion`**: está implementado (CSS + `MotionConfig`) pero no se probó activándolo en el sistema.
- **Lector de pantalla** (NVDA/VoiceOver) y navegación completa solo con teclado en dispositivos reales.
- **Envío real del formulario:** solo la simulación y las pruebas unitarias del envío.

## 5. Pendiente para las siguientes fases

- ~~**Fase 4:** app móvil~~ → hecha, ver [fase-4](../fase-4/04-app-movil.md).
- **Fase 5:** Lighthouse y pruebas en dispositivos; optimizar el peso de **Caveat** (51 KB, se usa en 4 etiquetas); generar imágenes responsive (`srcSet` ya está soportado en el JSON, falta el script que las produce); confirmar PWA; pruebas con lector de pantalla.
- **Contenido real** de tu parte (ver la lista de `npm run check:content`).
