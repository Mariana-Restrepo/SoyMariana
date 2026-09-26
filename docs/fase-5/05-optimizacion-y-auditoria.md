# Fase 5 · Optimización, accesibilidad, SEO y PWA

Esta fase no agrega pantallas: **mide** lo construido con herramientas reales, corrige lo que salió mal y deja las herramientas para repetir las pruebas cuando cambies contenido.

## 1. Resultados (web)

Medidos en **Chrome 153 real** con `npm run audit` (Lighthouse, axe-core y pruebas propias), sobre el build de producción:

| Medida                          | Móvil (4G lenta simulada)  | Escritorio               |
| ------------------------------- | -------------------------- | ------------------------ |
| Rendimiento (Lighthouse)        | **96**                     | **100**                  |
| Accesibilidad                   | **100**                    | **100**                  |
| Buenas prácticas                | **100**                    | **100**                  |
| SEO                             | **100**                    | **100**                  |
| LCP / FCP / CLS / TBT           | 2,2 s / 1,7 s / 0 / 140 ms | 0,5 s / 0,4 s / 0 / 0 ms |
| JavaScript inicial (comprimido) | 111 KB (antes 124 KB)      |                          |

Los tiempos móviles son de **simulación** (Lighthouse frena CPU y red); en un celular normal con buena conexión serán menores.

**42 comprobaciones propias, todas correctas:**

- **Accesibilidad (axe-core, WCAG 2.2 AA):** 0 violaciones en 5 estados: escritorio, móvil, menú abierto, detalle de recomendación y formulario.
- **PWA:** service worker activo, 18 archivos en caché, manifiesto con íconos (incluido _maskable_) y **la web abre y se ve completa sin conexión**.
- **"Reducir movimiento":** sin animaciones infinitas, el rotador de palabras queda quieto, el scroll no se anima, los números aparecen ya completos y el carrusel no avanza solo.
- **Teclado:** el primer Tab es "Saltar al contenido", el foco se ve (anillo azul de 3 px), con el formulario abierto el foco no escapa a la página de fondo, y Esc cierra y devuelve el foco al botón.
- **SEO:** un solo `h1`, títulos sin saltos, todas las imágenes con `alt`, título de 53 caracteres, descripción de 159, canonical, Open Graph, Twitter Card, JSON-LD válido, `robots.txt`, `sitemap.xml` e imagen para redes.
- **Consola:** sin errores ni peticiones fallidas.

## 2. Qué se mejoró

| Cambio                                                                    | Efecto                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `LazyMotion` (solo el motor de animación de DOM)                          | −13 KB de JavaScript; FCP móvil de 2,1 s a 1,7 s                         |
| Precarga de las 3 tipografías críticas                                    | El titular se pinta con su tipografía real, sin salto                    |
| Título SEO más corto (78 → 53 caracteres)                                 | Ya no se corta en los resultados de búsqueda                             |
| Nombre accesible del logo = texto visible ("Soy Mariana")                 | Cumple WCAG 2.5.3 (_Label in Name_)                                      |
| Cabeceras de caché y seguridad (`apps/web/public/_headers`)               | Cache inmutable de `/assets`, CSP, sin _clickjacking_, permisos cerrados |
| Botón "¿Creamos algo?" de la app: 40 → 44 dp                              | Tamaño táctil correcto                                                   |
| App: en "reducir movimiento" se omiten las dos notas decorativas del hero | Ver §5 (recorte de texto en Android)                                     |

La **política de seguridad (CSP)** se probó de verdad: se sirvió el build con esas cabeceras exactas y se usó la página (menú, detalle, formulario, service worker) sin **ninguna violación**.

## 3. Herramientas nuevas

```bash
npm run audit     # auditoría completa en Chrome real (tarda ~4 min). Falla si algo empeora
npm run images    # optimiza tus fotos (ver abajo)
```

Lighthouse se corre **3 veces por perfil y se usa la mediana**: una sola corrida es ruidosa (con el mismo código llegó a dar 74 y 96 seguidas). Cierra otros programas pesados mientras corre.

**Antes de publicar, corre `npm run audit`.** Necesita Chrome o Edge instalado (o la variable `CHROME_PATH`).

### Fotos: `npm run images`

1. Copia tus fotos originales (cualquier tamaño) a `apps/web/media-src/`.
2. Corre `npm run images`.
3. Copia el bloque JSON que imprime dentro de tu archivo de contenido y cambia `alt` por una descripción real.

Genera versiones WebP de 480, 960 y 1440 px (el navegador elige la que necesita), corrige la orientación de fotos de celular y **elimina los metadatos EXIF, incluida la ubicación GPS**. Se probó con fotos sintéticas con EXIF y con orientación girada. Las originales no se suben a git.

### Videos: `npm run videos`

Copia tus videos a `apps/web/media-src/videos/` y corre `npm run videos`: genera un clip vertical de hasta 15 s y ≤ 3 MB por cada uno, con su portada. Usa `ffmpeg-static` (un ffmpeg que viene con el proyecto: no hay que instalar nada en el sistema). Se probó con 7 videos reales de WhatsApp (576×1024 y uno horizontal): pesan entre 0,8 y 2,3 MB. Los detalles están en la [guía de uso](../fase-6/06-guia-de-uso.md#videos).

## 4. Publicar: lo que hay que saber

- `apps/web/public/_headers` lo entienden **Cloudflare Pages** y **Netlify** (recomiendo Cloudflare Pages: gratis, rápido y sirve también los videos con R2). **GitHub Pages no admite cabeceras personalizadas**, y en Vercel las mismas reglas van en un `vercel.json` (no incluido, no probado).
- Define `VITE_SITE_URL` (tu dominio real) antes de compilar: se usa en canonical, Open Graph, sitemap y datos estructurados.
- Los videos y fotos externas deben venir de `https://` (la política de seguridad permite `img-src` y `media-src` con `https:`).
- Para que el sitio aparezca al buscar tu nombre: dominio propio, enlazarlo desde tus bios y registrarlo en Google Search Console.
- `npm run check:content:strict` debe pasar (sin `[PLACEHOLDERS]`) y `npm run audit` debe salir en verde.

## 5. App móvil: auditoría en Android

Sobre el emulador Android 15 con Expo Go. Se leyó el **árbol de accesibilidad** real de cada pestaña (`uiautomator`): etiqueta de cada elemento tocable y tamaño ≥ 44 dp.

| Pestaña   | Elementos tocables | Problemas reales |
| --------- | ------------------ | ---------------- |
| Inicio    | 9                  | 0                |
| Videos    | 10                 | 0                |
| Colección | 13                 | 0                |
| Marcas    | 7                  | 0                |
| Más       | 10                 | 0                |

Se corrigió un problema real (botón del encabezado de 40 dp). Los pocos avisos que quedan son elementos **cortados por el borde de la pantalla o de la barra de pestañas** (solo asoma una parte), no botones pequeños.

**"Reducir movimiento" en Android:** se activó en el sistema del emulador y se comprobó que la palabra rotatoria queda quieta y que la pantalla no se rompe. En ese modo, las dos notas decorativas del hero ("amiga, mira esto", "lo probé ✦") aparecían con el texto recortado (un fallo de dibujo de Android sin animación que no logré resolver en el origen, tras probar quitar la rotación, la sombra y la vista animada). Como son solo adorno, **en ese modo no se muestran**. Con el movimiento normal se ven completas.

Los ajustes de animación del emulador se restauraron después de la prueba.

## 6. Lo que NO se pudo comprobar

- **iPhone / iOS:** sigue sin probarse desde este equipo (Windows).
- **Lectores de pantalla reales** (NVDA, VoiceOver, TalkBack): se verificaron las etiquetas y roles con herramientas, pero no se escuchó ninguno.
- **Celular real de gama baja** y **conexión real**: los números de rendimiento son de simulación en una PC.
- **La imagen del sitio al compartirlo** en WhatsApp/Instagram/TikTok: la imagen y las etiquetas existen y son correctas, pero cada red las cachea y las muestra a su manera; se ve al publicar con el dominio real.
- **Videos reales pesados** en la web (en la app sí se probó reproducción real con un archivo de prueba).
- **Envío real del formulario:** falta conectar tu servicio (`VITE_INQUIRY_ENDPOINT`).
- **Posibles mejoras de rendimiento móvil** (ya en 96): mostrar el hero como HTML estático antes de que cargue JavaScript, y dividir las secciones bajo el pliegue. No se hicieron porque el beneficio no justifica el riesgo de saltos visuales.
