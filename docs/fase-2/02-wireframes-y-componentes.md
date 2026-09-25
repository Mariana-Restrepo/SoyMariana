# Fase 2 · Diseño visual, wireframes y estructura de componentes

> Complementa a [`fase-1`](../fase-1/01-direccion-creativa-y-arquitectura.md). Aprobado en Fase 1: arquitectura monorepo (Web Vite + Móvil Expo) y cambio del header a **"Soy Mariana"**.
>
> **Para ver el diseño:** abre [`prototipo-visual.html`](prototipo-visual.html) en el navegador y cambia el tamaño de la ventana (móvil / tablet / desktop). Es un prototipo de **diseño** (HTML + un poco de JS): no es la app final, sirve para aprobar look, movimiento e interacción antes de programar la web real.

---

## 1. Qué contiene el prototipo

Todas las secciones, con contenido de ejemplo y `[PLACEHOLDERS]` claramente marcados:

| Sección           | Qué puedes probar                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header            | Wordmark **_Soy_ Mariana ♡**; se compacta al hacer scroll; indicador de sección activa; en móvil, menú a pantalla completa y pastilla flotante "¿Creamos algo?" tras el hero |
| Hero              | Titular, rotador _pruebo / descubro / recomiendo_, stickers y mini-tarjeta flotantes, pista de scroll                                                                        |
| Videos            | Carrusel con video activo al centro y vecinos atenuados; 🔇/🔊, ⏯, flechas, puntos, teclado (← →), swipe en móvil, avance automático suave                                   |
| Lo que pruebo     | 7 categorías que se expanden (hover en desktop, toque en móvil) y llevan a la colección filtrada                                                                             |
| Colección         | Filtros por categoría, tarjetas con **sellos de veredicto**, detalle en overlay; diario de lugares tipo polaroid                                                             |
| Sobre mí          | Frase central + tarjetas de historia con swipe                                                                                                                               |
| Números           | Cifras grandes que cuentan al entrar en pantalla; "Actualizado: [FECHA]"; estructura futura marcada                                                                          |
| Trabajemos juntas | Sección en cereza, formatos, CTA que abre el formulario de 2 pasos (valida, no envía)                                                                                        |
| Developer         | Cambio de "clima" a azul; 3 proyectos (el primero es este sitio)                                                                                                             |
| Footer            | Nombre grande, roles, redes, frase de cierre                                                                                                                                 |

`prefers-reduced-motion` está respetado (sin flotación, rotador, parallax ni autoavance de videos).

---

## 2. Decisiones de diseño tomadas en esta fase

1. **Wordmark "Soy Mariana".** _Soy_ en cursiva serif, _Mariana_ en serif regular, con un ♡ pequeño que reacciona al hover. Se compacta (28 → 22 px) al hacer scroll.
2. **Hero móvil: la foto va primero.** Con el texto primero, la foto quedaba bajo el pliegue y el hero dejaba de ser "principalmente visual". En móvil la foto se reduce (~230 px) y va arriba; el titular queda visible sin scroll.
3. **Una sola forma de "expandir".** Las categorías usan el patrón accesible _título-botón que cubre toda la tarjeta_ (toda la tarjeta es clicable, pero el HTML es válido y navegable con teclado). En dispositivos con mouse abre con hover; en táctil, con toque (una abierta a la vez).
4. **Videos: el _preview_ manda.** Cada tarjeta es un clip corto en loop; el video completo vive en TikTok ("Ver completo ↗"). El sonido es una preferencia que se activa a mano y **solo suena el video activo**.
5. **Menú móvil = hoja completa**, no barra inferior (es un recorrido continuo, no destinos independientes). Incluye el link discreto "mira mi lado developer".
6. **Cada sección tiene su "clima" de color** (mapa en Fase 1 §3.1). El cambio a azul en Developer funciona como un giro narrativo.
7. **Sellos > estrellas**, incluyendo _No me convenció_ (contorno punteado, gris), que es lo que vuelve creíble el resto.

---

## 3. Layout y responsive

**Grilla:** contenedor máx. 1160 px, gutter fluido `clamp(16px, 5vw, 40px)`, ritmo vertical de sección `clamp(4rem, 10vw, 8.5rem)`.

| Sección    | Móvil (< 700)                              | Tablet (700–899)    | Desktop (≥ 900)                         |
| ---------- | ------------------------------------------ | ------------------- | --------------------------------------- |
| Header     | Wordmark + botón ☰ → hoja completa        | Igual               | Wordmark + 3 links + botón cereza       |
| Hero       | 1 col: foto (pequeña) → texto              | 1 col               | 2 col: texto / foto grande con stickers |
| Videos     | Swipe, tarjeta activa ~260 px, sin flechas | Con flechas         | Con flechas, hover escala 1.035         |
| Categorías | 2 col                                      | 4 col               | 4 col                                   |
| Colección  | 1 col (masonry)                            | 2 col               | 3 col                                   |
| Diario     | 1 col                                      | 3 col               | 3 col                                   |
| Sobre mí   | Tarjetas con swipe horizontal              | Igual               | Igual (scroll con snap)                 |
| Números    | 1 col                                      | 3 col               | 3 col                                   |
| Marcas     | 1 col, formatos 2×4                        | 1 col, formatos 4×2 | 2 col (quién / cómo)                    |
| Developer  | 1 col                                      | 1 col               | 3 col                                   |
| Formulario | **Hoja inferior** (bottom sheet)           | Modal centrado      | Modal centrado                          |

Tamaños táctiles ≥ 44 px en los controles de móvil (botones de video, flechas, ☰, chips, links dentro de tarjetas y puntos del carrusel, que tienen un área de toque ampliada). El botón "¿Creamos algo?" del header de desktop mide 40 px porque solo se usa con mouse.

---

## 4. Wireframes (móvil primero)

```
HEADER (sticky)                     HOJA DE MENÚ
┌──────────────────────┐            ┌──────────────────────┐
│ Soy Mariana ♡     ☰  │            │ Soy Mariana ♡     ✕  │
└──────────────────────┘            │                      │
                                    │ Videos               │
HERO                                │ Lo que pruebo        │
┌──────────────────────┐            │ Sobre mí             │
│   ┌──────────┐ ♡     │            │ [ ¿Creamos algo? ]   │
│ [nota]│  foto  │[sello]│            │                      │
│   │  [▶mini] │       │            │ Y cuando no estoy    │
│   └──────────┘       │            │ creando… (developer) │
│ CREADORA · [CIUDAD]  │            └──────────────────────┘
│ La amiga que prueba  │
│ todo _primero._      │            VIDEOS
│ Productos, lugares…  │            ┌──────────────────────┐
│ Yo _pruebo_          │            │ Mírame _en acción_   │
│ [Mírame en acción]   │            │ ┌─┐ ┌────────┐ ┌─┐    │
│ ⌄ desliza, hay más   │            │ │ │ │ ACTIVO │ │ │    │
└──────────────────────┘            │ │ │ │ 🔇  ⏯ │ │ │    │
                                    │ └─┘ └────────┘ └─┘    │
COLECCIÓN                           │   Título · caption   │
┌──────────────────────┐            │   Ver en TikTok ↗    │
│ Esto sí te lo…       │            │      ─ ● ─ ─ ─       │
│ (Todo)(Belleza)(…)→  │            └──────────────────────┘
│ ┌──────────────────┐ │
│ │      foto        │ │            NÚMEROS
│ │ (♡ Se queda)     │ │            ┌──────────────────────┐
│ └──────────────────┘ │            │ 1.402  seguidores    │
│ CABELLO              │            │ 10,3K  likes         │
│ [PRODUCTO_01]        │            │ ~2.000 reproducciones│
│ “Opinión corta…”     │            │ ● Actualizado: [FECHA]│
└──────────────────────┘            └──────────────────────┘
```

Los wireframes de desktop están en el prototipo (mismo contenido, otra composición según §3).

---

## 5. Estructura de componentes (web)

Todo en `apps/web/src/`. Las rutas de la app son una sola página que compone las secciones.

```
App
├── SkipLink
├── Header                       ← Brand, DesktopNav, MenuButton, MobileSheet
├── FloatingCta                  ← visible tras el hero, oculto en #trabajemos
├── main
│   ├── HeroSection              ← WordRotator, FloatingSticker×n, PhotoFrame
│   ├── VideosSection            ← VideoCarousel → VideoCard×n (usa useVideoController)
│   ├── CategoriesSection        ← CategoryCard×7 (expandible)
│   ├── CollectionSection        ← FilterChips, RecommendationCard×n, PlaceCard×n, RecommendationDialog
│   ├── AboutSection             ← StoryCard×n
│   ├── MetricsSection           ← MetricCard×3, CountUp, PendingMetrics(solo dev)
│   ├── WorkSection              ← AudienceChips, FormatCard×8, InquiryDialog → InquiryForm
│   └── DeveloperSection         ← TechChip×n, ProjectCard×3
└── Footer
```

### 5.1 Primitivos (`components/ui`) y de marca (`components/brand`)

| Componente                             | Props clave                                                                      | Notas                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Button`                               | `variant: 'rosa' \| 'cereza' \| 'paper' \| 'quiet' \| 'azul'`, `size`, `asChild` | Alto mínimo 46 px, `:active` con escala .98                                    |
| `Chip`                                 | `pressed?`, `onToggle`                                                           | Filtros; `aria-pressed`                                                        |
| `Card`                                 | `tone: 'paper' \| 'rosa' \| 'azul' \| 'cereza'`, `rotate?: number`               | La rotación viene de una semilla por `id` (estable)                            |
| `Dialog`                               | `open`, `onClose`, `variant: 'modal' \| 'sheet'`                                 | Sobre `<dialog>` nativo (foco atrapado y Esc gratis). En móvil = hoja inferior |
| `Field`, `Input`, `Select`, `Textarea` | `label`, `error?`, `optional?`                                                   | Errores enlazados con `aria-describedby`, `aria-invalid`                       |
| `Section`                              | `id`, `tone`, `label`                                                            | Aporta `aria-labelledby` y el ritmo vertical                                   |
| `VerdictStamp`                         | `verdict: Verdict`                                                               | Color/forma/rotación por veredicto (Fase 1 §3.4)                               |
| `Sticker`, `PostIt`                    | `children`, `rotate`                                                             | Etiquetas tipo nota; máx. 1–2 por vista                                        |
| `HandUnderline`                        | `children`, `color`                                                              | Subrayado dibujado bajo la palabra clave                                       |
| `Doodle`                               | `name: 'heart' \| 'star' \| 'arrow'`                                             | SVG inline, hereda color                                                       |
| `WordRotator`                          | `words: string[]`, `interval`                                                    | Con reduced-motion queda fijo y texto alternativo estático                     |
| `Reveal`                               | `delay?`                                                                         | Fade + subida 16 px, una sola vez                                              |

### 5.2 Video (`components/video`)

```ts
interface VideoCarouselProps { videos: Video[]; autoAdvanceMs?: number }   // 5500 por defecto

// Reglas del controlador (hook único compartido por todas las tarjetas)
useVideoController(): {
  activeIndex: number;
  isPlaying: boolean;          // pausa manual del usuario
  soundOn: boolean;            // preferencia; solo aplica al activo
  goTo(i: number): void;
  toggleSound(): void; togglePlay(): void;
}
```

Reglas (cada una tiene prueba en Fase 5):

1. Máximo **1** `<video>` reproduciendo; los demás muestran solo el `poster`.
2. `src` real solo para el activo y sus vecinos inmediatos (`preload="none"` en el resto).
3. Sale del viewport → pausa; vuelve → reanuda (si el usuario no pausó).
4. Avance automático solo si: sección visible, sin interacción del usuario, sin pausa manual, pestaña visible y sin `prefers-reduced-motion`.
5. Sonido: siempre inicia mudo; el usuario lo activa con un toque; la preferencia persiste al cambiar de video, pero nunca hay audio sin gesto previo.
6. Falla la carga o `saveData` activo → se muestra el `poster` con botón ▶.

### 5.3 Datos y contenido

| Sección           | Lee de                       | Tipo                                                                   |
| ----------------- | ---------------------------- | ---------------------------------------------------------------------- |
| Hero, footer, SEO | `profile.json`, `links.json` | `Profile`, `Links`                                                     |
| Videos            | `videos.json`                | `Video[]`                                                              |
| Categorías        | `categories.json`            | `CategoryInfo[]` (`key`, `emoji`, `name`, `tone`, `blurb`, `examples`) |
| Colección         | `recommendations.json`       | `Recommendation[]`                                                     |
| Diario            | `places.json`                | `Place[]`                                                              |
| Sobre mí          | `profile.json` (`story[]`)   | `StoryCard[]`                                                          |
| Números           | `metrics.json`               | `MetricsFile`                                                          |
| Marcas            | `collab.json`                | `{ audiences[], formats[] }`                                           |
| Developer         | `projects.json`              | `DevProject[]`                                                         |

Convención de placeholders (buscables con `npm run check:content`): `[VIDEO_TIKTOK_01]`, `[IMAGEN_PRODUCTO_01]`, `[LINK_GITHUB_01]`, `[CIUDAD]`, `[CORREO]`, `[FECHA]`…

---

## 6. Estados que hay que diseñar (además del "camino feliz")

| Componente                        | Vacío                                                      | Cargando                                                                             | Error                                                                              |
| --------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Imágenes                          | —                                                          | Fondo del **color dominante** de la foto (sin saltos de layout, `aspect-ratio` fijo) | Bloque de color de la categoría + alt visible                                      |
| Video                             | —                                                          | Poster                                                                               | Poster + ▶ + "Míralo en TikTok ↗"                                                  |
| Colección (filtro sin resultados) | "Todavía no he probado nada de esto. ✿" + botón "Ver todo" | Esqueleto de 3 tarjetas                                                              | —                                                                                  |
| Números                           | Métricas pendientes **no se muestran**                     | Valor final visible sin JS                                                           | —                                                                                  |
| Formulario                        | —                                                          | Botón "Enviando…" deshabilitado                                                      | "Ay, algo falló. Inténtalo de nuevo o escríbeme a [CORREO]." + conserva lo escrito |
| Detalle (dialog)                  | —                                                          | —                                                                                    | Slug inexistente → se cierra y vuelve a la colección                               |

---

## 7. Web ↔ Móvil (adelanto de Fase 4)

La app Expo consume los mismos `tokens`, `content` y `core`; cambia la **navegación** (barra de pestañas, porque en app sí son destinos):

| Pestaña   | Contenido                      | Componentes nativos                        |
| --------- | ------------------------------ | ------------------------------------------ |
| Inicio    | Hero + métricas resumidas      | `Hero`, `MetricCard`                       |
| Videos    | Carrusel/feed vertical         | `VideoFeed` (expo-video)                   |
| Colección | Recomendaciones + diario       | `RecommendationCard`, `PlaceCard`          |
| Marcas    | Trabajemos juntas + formulario | `InquiryForm` (misma validación de `core`) |
| Más       | Sobre mí + developer + redes   | `StoryCard`, `ProjectCard`                 |

---

## 8. Estado de accesibilidad del prototipo

**Ya resuelto:** skip link · landmarks y un solo `h1` · foco visible azul de 3 px · controles de video con `aria-pressed`/`aria-label` · carrusel con `role="region"`, flechas de teclado y puntos · contenido colapsado **no enfocable** (`visibility: hidden`) · diálogos nativos con foco atrapado · formulario con `label` real y errores por campo · objetivos ≥ 44 px · `prefers-reduced-motion`.

**Pendiente para Fase 5 (a propósito, se prueba en la app real):** trampa de foco y `inert` en la hoja del menú móvil · anuncio del carrusel con lector de pantalla (NVDA/VoiceOver) · contraste de textos sobre fotos reales · orden de foco tras cerrar diálogos · auditoría axe + Lighthouse.

---

## 9. Pendiente de tu parte

- Tus **fotos reales** (hero, sobre mí) y capturas de tus fondos de TikTok para afinar el rosa/rojo/azul.
- **Videos originales** (o confirmar que empezamos con placeholders).
- Textos: usuario de TikTok, correo, ciudad, "qué me gusta", "qué quiero construir", frases de cada categoría (las de ejemplo son propuestas mías).
- Decisión de **hosting de videos** (Cloudflare R2 / Bunny / Cloudinary) y **dominio**.
