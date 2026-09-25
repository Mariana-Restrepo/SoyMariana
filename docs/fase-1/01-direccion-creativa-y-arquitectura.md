# Fase 1 · Dirección creativa, arquitectura y sistema de diseño

> Estado: **propuesta para aprobar**. No hay implementación todavía.
> Contenido real que falta se marca con placeholders `[ASÍ_EN_MAYÚSCULAS]`.

> **Nota (Fase 4):** la sección "Su otra capa / Y cuando no estoy creando…" (lado developer) que aparece en este documento se retiró después por decisión de Mariana. Este archivo queda como registro histórico de la propuesta.

---

## 0. Resumen en 30 segundos

- **Concepto:** _"Tu amiga que ya probó todo, con su cuaderno de descubrimientos."_ El sitio es un **diario de descubrimientos** que se abre como una conversación, no una página que "presenta" a alguien.
- **Recorrido:** Mariana → videos → lo que prueba → colección de recomendaciones → quién es → números → trabajemos juntas → su lado developer (como "capa secreta" al final).
- **Diseño:** base crema muy clara, tinta cálida (nunca negro puro), rosado / cereza / azul usados como **fondos de momento, stickers y acentos**, nunca los tres a la vez con fuerza. Serif ligera con carácter para títulos + sans limpia y liviana para texto.
- **Arquitectura recomendada:** monorepo con **Web (React + Vite + TypeScript + Tailwind + Motion)** y **Móvil (Expo)**, compartiendo **contenido, tokens de diseño y lógica**, pero **no** la capa visual (ver §5, es la decisión más importante).
- **Contenido:** todo sale de archivos JSON tipados. Cambiar un video, una recomendación o un proyecto = editar un JSON, sin tocar componentes.

---

## 1. Concepto creativo

### La idea central

**"El cuaderno de Mariana."**

Una amiga que prueba todo primero tiene, en el fondo, un cuaderno: cosas pegadas, notas al margen, "esto sí", "esto no", corazones, subrayados. El sitio toma esa metáfora **sin volverla literal ni infantil** (nada de papel rayado ni textura kitsch):

| Lo que hace un cuaderno     | Cómo se traduce en la experiencia                                          |
| --------------------------- | -------------------------------------------------------------------------- |
| Pegar cosas que encontraste | Tarjetas ligeramente rotadas (±1–2°), como fotos pegadas                   |
| Anotar tu veredicto         | **Sellos de veredicto** ("Me sorprendió", "Vale la pena")                  |
| Subrayar lo importante      | Subrayados dibujados a mano en palabras clave                              |
| Dejar notitas               | Etiquetas tipo post-it: "amiga, mira esto"                                 |
| Páginas que se van pasando  | Scroll como recorrido narrativo, secciones con fondos de color que cambian |

### Por qué funciona para ella

1. Traduce **"la amiga que prueba todo primero"** en algo tangible: el cuaderno es la evidencia de que ya probó.
2. La **honestidad** (su valor central) tiene forma visual: hay veredictos negativos ("No me convenció") y se muestran sin miedo. Una tienda nunca haría eso; una amiga sí.
3. Separa naturalmente las dos identidades: el cuaderno es la creadora; la última "página" (la del developer) es _"y cuando no estoy creando…"_, un giro, no un CV.

### Regla anti-plantilla

Cada pantalla debe pasar la prueba **"¿esto lo podría tener cualquier creadora?"**. Si sí, se rediseña. Lo que es solo suyo: el sistema de veredictos, el vocabulario de amiga, los fondos rosa/cereza/azul de sus videos, y su cuaderno de lugares.

---

## 2. Arquitectura de información

### Sitemap (web)

Una **página principal narrativa** (una sola URL, con anclas por sección) + overlays profundos. Decisión deliberada: un solo `index.html` estático asegura vista previa correcta (Open Graph) cuando comparta el link desde su bio de TikTok/WhatsApp, y hace que el sitio se sienta como una historia continua.

```
/                         Página principal (historia)
├── #inicio               Hero
├── #videos               Mi contenido
├── #lo-que-pruebo        Categorías (entrada a la colección)
├── #coleccion            Recomendaciones + Diario de lugares
├── #sobre-mi             Historia visual
├── #numeros              Métricas
├── #trabajemos           Marcas + formulario
├── #developer            "Y cuando no estoy creando…"
└── footer

Overlays (con deep link, ej. /?r=nombre-del-producto)
├── Detalle de recomendación
├── Detalle de lugar
└── Formulario de colaboración (modal / hoja inferior en móvil)

Utilidades:  /404 amable · /privacidad (cuando el formulario guarde datos)
```

### Navegación (recortada a lo esencial)

Pediste no tener demasiadas opciones. De las 7 posibles, propongo **5 + 1 discreta**:

| Ítem                         | Contiene                                                                |
| ---------------------------- | ----------------------------------------------------------------------- |
| **Videos**                   | Mi contenido                                                            |
| **Lo que pruebo**            | Categorías + Colección + Diario de lugares                              |
| **Sobre mí**                 | Historia + números                                                      |
| **Trabajemos juntas**        | Marcas (CTA destacado, botón, no link)                                  |
| **Soy Mariana** (wordmark)   | Lleva al inicio. _"Soy"_ en cursiva serif, _"Mariana"_ en serif regular |
| _Y cuando no estoy creando…_ | Link discreto (footer + final del menú) al lado developer               |

Fusioné "Lo que pruebo" y "Mis recomendaciones": las categorías son la **puerta de entrada** y la colección es lo que hay detrás. Dos ítems para lo mismo confundirían.

### User flows

**Flujo principal (descubrimiento)**
`Llega → ve hero y "siente" a Mariana → ve videos (autoplay mudo) → toca una categoría → ve ejemplos → abre una recomendación → sigue bajando → conoce su historia → ve números → contacta`

**Flujo de marca (el que más importa comercialmente)**
`Llega desde un correo/DM → hero → salta a "Trabajemos juntas" con el botón fijo → entiende formatos → ve números → "Cuéntame tu idea" → formulario 2 pasos → confirmación amable`
Para que una marca **entienda quién es Mariana en menos de 60 s**, el botón "¿Creamos algo?" está siempre a un toque (header en desktop; pastilla flotante en móvil después del hero).

**Flujo developer (reclutador / colega)**
`Footer o link discreto → "Y cuando no estoy creando…" → 3 proyectos → GitHub/demos`

### Orden narrativo y por qué

```
Mariana (hero) ─ ¿quién es?
  → Videos            ─ pruebo que es real: ya la ves hablando
  → Lo que pruebo     ─ ¿de qué habla?
  → Colección/Diario  ─ la evidencia (mi cuaderno)
  → Sobre mí          ─ ¿por qué lo hace?
  → Números           ─ honestos, sin maquillaje
  → Trabajemos juntas ─ ¿cómo trabajamos?
  → Developer         ─ el giro final
```

Los números van **justo antes** de "Trabajemos juntas" porque es donde una marca los necesita para decidir.

---

## 3. Dirección visual

### 3.1 Paleta

Base clara y limpia; el color es **evento**, no ambiente. Los valores son un punto de partida; **ideal calibrarlos con capturas de tus fondos reales de TikTok** (ver §10).

| Token         | Hex       | Uso                                                    |
| ------------- | --------- | ------------------------------------------------------ |
| `paper`       | `#FFFAF6` | Fondo base (crema cálido, no blanco clínico)           |
| `ink`         | `#2B1F26` | Texto principal (tinta cálida, nunca negro)            |
| `ink-soft`    | `#6B5A63` | Texto secundario                                       |
| `rosa`        | `#FF8DB5` | Color protagonista: fondos de sección, botón principal |
| `rosa-tint`   | `#FFE1EA` | Fondos suaves, tarjetas, hover                         |
| `rosa-deep`   | `#D9457F` | Acentos gráficos y textos grandes                      |
| `cereza`      | `#D92B3F` | Momento de énfasis: sellos, corazones, CTA de marca    |
| `cereza-tint` | `#FFD9D8` | Fondo de sellos "me sorprendió", detalles              |
| `azul`        | `#2F55E0` | Contraste fresco: lado developer, links, foco          |
| `azul-tint`   | `#DCE5FF` | Fondo de la sección developer, chips                   |

**Reglas de uso (para que no se sature):**

1. **Un color dominante por sección**, los otros dos solo como detalle (máx. ~10 % de la pantalla).
2. Mapa por sección: Hero → rosa · Videos → crema con acentos cereza · Colección → crema + los tres solo en sellos · Sobre mí → rosa-tint · Marcas → cereza como momento fuerte · **Developer → azul** (cambia el "clima" y marca la segunda capa).
3. El texto siempre en `ink` sobre fondos de color; nunca `ink` sobre `cereza`.
4. Los gradientes son de **un solo matiz** (rosa → rosa-tint), difusos y suaves, para "luz" de fondo, no bandas.

**Contraste verificado (WCAG):**

| Combinación                     | Ratio | Estado                                   |
| ------------------------------- | ----- | ---------------------------------------- |
| `ink` sobre `paper`             | 15.3  | AAA                                      |
| `ink` sobre `rosa`              | 7.3   | AAA                                      |
| `ink` sobre `rosa-tint` / tints | 12–13 | AAA                                      |
| `ink-soft` sobre `paper`        | 6.2   | AA                                       |
| blanco sobre `azul`             | 6.0   | AA                                       |
| blanco sobre `cereza`           | 4.8   | AA (solo botones y texto ≥ 14 px medio)  |
| `cereza` texto sobre `paper`    | 4.6   | AA (solo para acentos, no párrafos)      |
| `rosa-deep` sobre `paper`       | 4.0   | ⚠ solo texto grande (≥ 24 px) o gráficos |
| blanco sobre `rosa-deep`        | 4.1   | ⚠ solo texto grande                      |
| `ink` sobre `cereza`            | 3.3   | ❌ prohibido                             |

### 3.2 Tipografía

Ligera, femenina, legible. Todas de Google Fonts (gratis, soportan tildes y ñ).

| Rol              | Fuente                                     | Por qué                                                                                                                  |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Títulos**      | **Instrument Serif** (regular + _itálica_) | Serif editorial, delicada, con una itálica preciosa. Solo existe en peso regular: **imposible caer en títulos pesados**. |
| **Texto / UI**   | **DM Sans** (300–500)                      | Limpia, redondeada, muy legible en móvil, variable. Usar 300/400 para texto, 500 para botones.                           |
| **Notas a mano** | **Caveat** (500), _muy poco_               | Solo en 1–2 etiquetas tipo post-it por pantalla ("amiga, mira esto"). Nunca en párrafos.                                 |

Escala (fluida con `clamp`, móvil primero): hero `clamp(2.6rem, 8vw, 6rem)` · h2 `clamp(2rem, 5vw, 3.5rem)` · texto 1rem–1.0625rem, interlineado 1.6. Recurso de marca: **una palabra en cursiva por título** (_"prueba"_ , _"primero"_), a veces con subrayado dibujado.

### 3.3 Forma y detalle "humano"

- **Radios:** `sm 10px` · `md 20px` · `lg 28px` · `pill`. Tarjetas grandes 28 px, no todo redondeado igual.
- **Sombras:** muy suaves y teñidas de rosa (`0 12px 32px -12px rgb(217 69 127 / .25)`), nunca grises duras.
- **Imperfecciones orgánicas:** rotación ±1–2° en tarjetas, esquinas de "cinta washi" en algunas fotos, subrayados SVG dibujados a mano, formas tipo blob suaves de fondo. Todo **derivado de una semilla por ítem** (mismo ítem = misma rotación siempre, no aleatorio en cada carga).
- **Biblioteca de "toques Mariana"** (usar 1–2 por vista, no todos): ♡ corazón trazado · ✦ estrellita · subrayado ondulado · sello de veredicto · etiqueta "lo probé" · post-it "amiga, mira esto" · flechita dibujada.
- **Espacio en blanco:** secciones con `padding-block` generoso (`clamp(4rem, 10vw, 9rem)`), máximo ~65 caracteres por línea.

### 3.4 Sellos de veredicto (elemento diferencial)

Reemplazan las estrellas de e-commerce. Cada uno es un sello circular/ovalado, ligeramente inclinado, con color y forma propios:

| Veredicto (`verdict`) | Texto del sello         | Color                    | Tono                   |
| --------------------- | ----------------------- | ------------------------ | ---------------------- |
| `repite`              | Sí volvería a comprarlo | cereza                   | Favorito               |
| `sorprendio`          | Me sorprendió           | azul                     | Grata sorpresa         |
| `vale-la-pena`        | Vale la pena            | rosa                     | Recomendado            |
| `se-queda`            | Esto se queda conmigo   | cereza + corazón         | Top absoluto           |
| `volveria`            | Lo volvería a visitar   | azul (para lugares)      | Lugares                |
| `no-convencio`        | No me convenció         | **gris tinta, contorno** | Honestidad (sin miedo) |

`No me convenció` existe a propósito: es lo que hace creíble todo lo demás.

---

## 4. Diseño de cada sección (wireframe conceptual)

> Móvil primero. Debajo de cada wireframe: intención UX.

### Header

```
Móvil:   [ Soy Mariana ♡ ]                        [ ☰ ]
Desktop: [ Soy Mariana ]  Videos  Lo que pruebo  Sobre mí        [ ¿Creamos algo? ]
```

- Sticky, transparente al inicio; al bajar se **compacta** (menos altura) y gana fondo `paper` con blur suave y línea fina.
- Móvil: menú como **hoja a pantalla completa** con los ítems grandes en serif (más "app" que un dropdown) y "Trabajemos juntas" como botón. Decisión UX: la barra inferior de pestañas es para apps con destinos independientes; este es un **recorrido continuo**, así que barra superior mínima + pastilla flotante contextual "¿Creamos algo?" tras el hero.
- Indicador de sección activa (punto/subrayado que se desliza).

### Hero

```
┌──────────────────────────────┐
│  ✦                  [lo probé]│
│      ┌────────┐               │
│ La amiga  │ foto / │  [amiga,   │
│ que       │ video  │   mira     │
│ prueba    │ Mariana│   esto]    │
│ todo      └────────┘               │
│ primero.        ▢ ▢ tarjetas      │
│ Productos, lugares y              │
│ recomendaciones reales.           │
│ Yo  [PRUEBO]  →  ↓ desliza        │
└──────────────────────────────┘
```

- Titular en serif con _primero_ en cursiva subrayado.
- **Rotador de palabras:** "Yo **pruebo** / **descubro** / **recomiendo**" (cambia cada ~2.5 s con fundido y desplazamiento corto; con `prefers-reduced-motion` queda estático en "pruebo").
- Elementos flotantes (stickers, mini-tarjetas) con movimiento orgánico lento y **parallax muy ligero**; en móvil se reducen a 2–3.
- Una pista sutil de scroll ("desliza, hay más") para crear curiosidad, en vez de mostrar todo.

### Videos ("Mi contenido")

- Carrusel: **el video activo al centro, más grande y nítido; los vecinos más pequeños, atenuados y desenfocados levemente** (profundidad, no lista).
- **Solo 1 video reproduciéndose a la vez** (el activo, y solo si la sección está en el viewport). Los demás muestran su _poster_.
- Controles por video (botones ≥ 44 px, con `aria-label` y foco visible): **🔇/🔊**, **⏯**, y "Ver en TikTok ↗".
- Avance automático suave cada N segundos **solo mientras la sección está visible**; se pausa al interactuar, con hover o con reduced-motion.
- Desktop: hover → escala 1.03 + aparece título y una línea de contexto. Móvil: **swipe** con snap, sin hover; la info va siempre visible bajo el video.
- El sonido lo activa la persona con un toque; se recuerda la preferencia, pero **nunca hay audio automático** y solo suena un video a la vez.

### Lo que pruebo

- Cuadrícula de 7 tarjetas ilustradas (no lista), cada una con su color, imagen, emoji-sticker y un detalle animado propio (p. ej. Cabello: rizo que se dibuja; Restaurantes: vapor).
- Toque/hover → la tarjeta **se expande** con 1 frase y 2–3 ejemplos + botón "Ver mi colección de [categoría]" (filtra la colección de abajo). Frase de ejemplo, Cabello: _"Rizos, técnicas y productos que sí (y no) funcionan."_
- Móvil: una columna con tarjetas apilables; una expandida a la vez.

### Colección: "Esto sí te lo recomiendo"

- Grid tipo collage (masonry ligero), tarjetas con foto, nombre, categoría, **sello de veredicto**, una opinión de 1–2 líneas y link cuando exista.
- Filtro por categoría (chips) y por veredicto.
- Tocar una tarjeta abre el **detalle** (overlay con deep link): más fotos, opinión completa, "qué me gustó / qué no", link.
- **Diario de lugares** (subsección con otro ritmo visual: fotos grandes tipo polaroid, ciudad como etiqueta): _"Fui aquí y esto encontré"_ → qué probé · qué me gustó · ciudad · link a mapa/red. Nada de puntajes ni rankings.

### Sobre mí

- Frase central en grande: _"Empecé creando contenido porque siempre me ha gustado descubrir cosas y compartirlas."_
- Debajo, **storytelling en tarjetas horizontales con scroll** (móvil: swipe) y timeline mínimo:
  `Quién soy (21, Colombia [CIUDAD])` → `Qué me gusta` → `Por qué empecé` → `Qué estudio` → `Lo que quiero construir`.
- Cada tarjeta: una foto + una línea. Nada de párrafos.

### Números

- 3 cifras grandes en serif, con conteo animado al entrar en viewport:
  **1.402** seguidores · **10,3K** likes · **~2.000** reproducciones en videos orgánicos, y una tarjeta de **interacción real** ("comentarios y participación") sin inventar porcentajes.
- Sello visible: _"Actualizado: [FECHA]"_ (sale del JSON) y nota _"Números orgánicos, sin comprarlos."_ — solo si ella lo confirma como cierto.
- Estructura lista y **oculta hasta tener datos** para: edad de audiencia, ciudades, género, promedio de reproducciones, engagement, mejores videos.

### Trabajemos juntas

- Título: _"¿Creamos algo?"_ · Frase clave propuesta: **_"Cuento lo que viví, no lo que me dictaron."_** (conserva tu idea, más cercana que "desde la experiencia, no desde el guion de venta"; también dejo la tuya como alternativa A/B).
- Con quién: chips (belleza, cabello, skincare, maquillaje, cuidado corporal, restaurantes, cafés, emprendimientos, lifestyle, experiencias).
- Cómo: 8 formatos como tarjetas cortas con ícono (reseña, recomendación, experiencia, visita, lanzamiento, video para TikTok, storytelling, demostración).
- **CTA:** botón cereza **"Quiero trabajar con Mariana"** → abre el formulario; junto a él un link secundario "o escríbeme a [CORREO]". Sin precios.

### Formulario ("Cuéntame tu idea")

- Campos exactos que pediste: nombre, marca, correo, IG/TikTok de la marca, tipo de colaboración, proyecto, presupuesto (opcional).
- **Dividido en 2 pasos** para que no se sienta gigante: (1) _Quién eres_ (nombre, marca, correo, red) → (2) _Tu idea_ (tipo, proyecto, presupuesto).
- Validación amable en línea, honeypot anti-spam, estado de envío y confirmación: _"Listo. Te leo y te respondo pronto."_
- Fase inicial: `mailto:` de respaldo + envío por servicio (ver §6.5).

### Y cuando no estoy creando… (developer)

- **Cambia el clima**: la sección pasa a `azul-tint`/`azul`, misma tipografía (sigue siendo ella), un toque más técnico (chips de tecnologías con estilo cuaderno, no logos genéricos).
- Frase: _"También estudio Desarrollo de Software, enfocada en frontend y experiencia de usuario."_
- 2–3 proyectos como tarjetas con captura, descripción corta, stack y links (GitHub / demo). **Este mismo sitio es el proyecto #1** ("Lo estás viendo").

### Footer

- Nombre grande en serif, "Creadora de contenido", "Desarrolladora de Software enfocada en Frontend y Experiencia de Usuario", redes, correo.
- Frase de cierre propuesta: **_"Gracias por pasar por aquí. Yo ya me voy a probar algo nuevo; nos vemos en TikTok. ♡"_** (alternativa más corta: _"Gracias por venir. Nos vemos en TikTok ♡"_).

---

## 5. Arquitectura técnica

### 5.1 Análisis: ¿la arquitectura que pedías es la mejor?

Evalué tres opciones. Ya existe en este repo un proyecto **Expo universal** (React Native Web), por eso el análisis también dice qué pasa con él.

| Criterio                                  | A) Expo universal (todo RN Web)                                                                          | **B) Monorepo: Web Vite + Móvil Expo** (recomendada)            | C) Solo web PWA |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------- |
| Código compartido                         | Máximo (~90 %)                                                                                           | Alto en lo que importa (contenido, tokens, lógica, tipos)       | n/a             |
| Calidad de la web (animación, CSS, video) | Limitada: sin CSS real (sticky, `backdrop-filter`, scroll-driven, `object-fit` fino), Motion no funciona | **Excelente**: CSS completo, Tailwind, Motion, `<video>` nativo | Excelente       |
| SEO y Open Graph                          | Posible, pero más frágil                                                                                 | Nativo, simple                                                  | Nativo          |
| Peso del bundle web                       | ~1.1 MB (medido en este repo)                                                                            | Muy pequeño                                                     | Muy pequeño     |
| Accesibilidad web (HTML semántico)        | Traducido desde RN, imperfecto                                                                           | HTML semántico real                                             | HTML semántico  |
| **Sirve como portafolio de frontend**     | Menos (es "React Native")                                                                                | **Sí**: React + TS + Vite + Tailwind, exactamente tu stack      | Sí              |
| App móvil real                            | Sí                                                                                                       | Sí (Expo)                                                       | Solo PWA        |
| Complejidad                               | Baja                                                                                                     | Media                                                           | Baja            |

**Recomendación: B.** Este proyecto vive de **animación fina, video, tipografía y SEO**, justo donde React Native Web es más débil. Y como además es tu portafolio de frontend, la web debe ser React + Vite + Tailwind _de verdad_. Lo que sí vale la pena compartir es **todo excepto la capa visual**.

> **Qué pasa con el Expo actual:** se conserva. Se mueve a `apps/mobile` y se le aplica el nuevo sistema de diseño. No se pierde nada.

### 5.2 Estructura de carpetas (monorepo con npm workspaces)

```
SoyMariana/
├── apps/
│   ├── web/                         React + Vite + TS + Tailwind + Motion
│   │   ├── public/                  favicon, og-image, robots.txt, sitemap.xml, manifest
│   │   ├── src/
│   │   │   ├── app/                 App.tsx, providers, layout de página
│   │   │   ├── sections/            Hero, Videos, LoQuePrueba, Coleccion, SobreMi,
│   │   │   │                        Numeros, Trabajemos, Developer, Footer
│   │   │   ├── components/          ui/ (Button, Card, Badge, Input, Modal, Sheet…)
│   │   │   │                        video/ (VideoCarousel, VideoCard, MuteButton…)
│   │   │   │                        brand/ (VerdictStamp, Sticker, Underline, PostIt, Doodles)
│   │   │   ├── hooks/               useInView, useReducedMotion, useActiveSection, …
│   │   │   ├── lib/                 motion presets, seo, analytics
│   │   │   └── styles/              index.css (importa tokens.css)
│   │   └── index.html               meta SEO + Open Graph + JSON-LD
│   └── mobile/                      Expo + React Native (actual proyecto, movido)
│       ├── src/app/                 Expo Router: tabs Inicio · Videos · Colección · Marcas · Más
│       ├── src/components/          equivalentes nativos con los mismos tokens
│       └── app.json
├── packages/
│   ├── tokens/                      ★ Fuente única del sistema de diseño
│   │   └── src/                     colors, typography, spacing, radii, shadows,
│   │                                breakpoints, motion → exporta TS + tokens.css + tema RN
│   ├── content/                     ★ Todo el contenido editable
│   │   ├── data/                    profile.json, videos.json, categories.json,
│   │   │                            recommendations.json, places.json, metrics.json,
│   │   │                            collab.json, projects.json, links.json
│   │   ├── src/                     tipos TS + validación (zod) + funciones de acceso
│   │   └── media/                   imágenes optimizadas (videos: ver §6.2)
│   └── core/                        ★ Lógica pura, sin UI
│       └── src/                     formatters (números, fechas), validación del formulario,
│                                    cliente de contacto, filtros/orden de colección,
│                                    analítica (interfaz), constantes
├── docs/                            esta documentación
├── package.json                     workspaces: ["apps/*", "packages/*"]
└── tsconfig.base.json
```

### 5.3 Qué se comparte y qué no

| Capa                              | ¿Compartida? | Cómo                                                                                                 |
| --------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| **Contenido** (videos, recos…)    | ✅ 100 %     | `packages/content`, misma fuente en web y móvil                                                      |
| **Modelos de datos y validación** | ✅ 100 %     | Tipos TS + esquemas zod                                                                              |
| **Design tokens**                 | ✅ 100 %     | `packages/tokens` genera `tokens.css` (web) y objeto de tema (RN)                                    |
| **Lógica** (formulario, filtros…) | ✅ ~90 %     | `packages/core`, funciones puras                                                                     |
| **Componentes visuales**          | ❌ Separados | Web usa HTML+Tailwind+Motion; móvil usa RN. Mismo nombre, misma API, misma apariencia por los tokens |
| **Animaciones**                   | ❌ Separadas | Web: Motion. Móvil: Reanimated. Mismos _presets_ (duraciones/easing) desde tokens                    |

Por qué no compartir componentes: es lo que haría la web más pobre (§5.1) y lo que menos aporta compartir, porque **el 80 % del esfuerzo de mantenimiento está en contenido y lógica**, no en `<div>`s.

### 5.4 Stack

| Tema          | Elección                                                          | Nota                                                                 |
| ------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| Web           | React 19 + TypeScript + Vite                                      | Tu stack                                                             |
| Estilos web   | **Tailwind CSS v4**                                               | Los tokens entran como variables CSS (`@theme`) → una sola fuente    |
| Animación web | **Motion** (antes Framer Motion)                                  | `useScroll`, `whileInView`, layout animations, `useReducedMotion`    |
| Móvil         | Expo + React Native + Expo Router                                 | Ya creado; animaciones con Reanimated                                |
| Datos         | JSON + zod                                                        | Sin backend inicialmente                                             |
| Formulario    | `react-hook-form` + zod                                           | Validación compartida vía `packages/core`                            |
| PWA           | `vite-plugin-pwa`                                                 | Instalable; el service worker cachea la "cáscara", **no** los videos |
| SEO           | Meta estáticas en `index.html`, JSON-LD `Person`, sitemap, robots | Ver §7                                                               |
| Calidad       | ESLint + Prettier + `tsc` (ya configurados) + Vitest en `core`    |                                                                      |
| Hosting web   | Vercel / Netlify / Cloudflare Pages (gratis)                      | Sugiero Cloudflare Pages por CDN + R2 para videos                    |

### 5.5 Preparado para crecer (sin construirlo aún)

Cada capa tiene una costura clara para lo que pediste a futuro:

| Futuro                        | Costura                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **CMS**                       | `packages/content` hoy lee JSON; mañana el mismo módulo lee de Sanity/Strapi/Notion sin cambiar componentes |
| **Base de datos**             | Interfaz `ContentSource` con implementación `JsonSource` hoy y `ApiSource` mañana                           |
| **Auth para administración**  | Panel `/admin` como app separada (`apps/admin`)                                                             |
| **Analytics**                 | Interfaz `track(event)` en `core`; hoy no-op, luego Plausible/Umami/GA                                      |
| **Gestión de colaboraciones** | El formulario ya envía un `BrandInquiry` tipado; se conecta a una tabla/CRM                                 |

---

## 6. Modelo de datos, sistema de diseño y video

### 6.1 Modelo de datos (resumen)

```ts
type Category =
  | 'belleza'
  | 'cabello'
  | 'cuidado-personal'
  | 'restaurantes'
  | 'lugares'
  | 'productos'
  | 'lifestyle';

type Verdict = 'repite' | 'sorprendio' | 'vale-la-pena' | 'se-queda' | 'volveria' | 'no-convencio';

interface Video {
  id: string; // "video-01"
  title: string; // "[VIDEO_TIKTOK_01] Título"
  src: string; // mp4 propio (ver 6.2)
  poster: string; // imagen de portada
  tiktokUrl?: string;
  category?: Category;
  caption?: string; // 1 línea, voz de Mariana
}

interface Recommendation {
  id: string;
  slug: string;
  name: string;
  category: Category;
  verdict: Verdict;
  opinion: string; // 1-2 líneas, voz de Mariana
  liked?: string[];
  disliked?: string[];
  images: Image[];
  link?: string;
  date?: string;
}

interface Place {
  id: string;
  slug: string;
  name: string;
  city: string;
  category: Category;
  tried: string[]; // qué probé
  liked: string[]; // qué me gustó
  review: string;
  verdict: Verdict;
  images: Image[];
  mapUrl?: string;
  socialUrl?: string;
}

interface Metric {
  id: string;
  label: string;
  value: number;
  display?: string;
  approx?: boolean;
  note?: string;
}
interface MetricsFile {
  updatedAt: string;
  metrics: Metric[];
  pending: string[];
}
// pending = ["Edad de audiencia", "Ciudades", …] (estructura lista, oculta)

interface DevProject {
  id: string;
  name: string;
  description: string;
  stack: string[];
  image: Image;
  githubUrl?: string;
  demoUrl?: string;
}

interface BrandInquiry {
  name: string;
  brand: string;
  email: string;
  brandSocial?: string;
  collabType: CollabType;
  message: string;
  budget?: string;
}
```

Reglas: **ningún dato es obligatorio salvo `id`, nombre y categoría**; los `[PLACEHOLDERS]` se marcan con un prefijo y un script `npm run check:content` avisa cuáles faltan antes de publicar.

### 6.2 Estrategia de video (decisión con impacto real)

**Limitación importante:** los videos de TikTok incrustados (iframe/oEmbed) **no permiten** controles de audio propios, autoplay silencioso por viewport ni carrusel con enfoque. Para lograr lo que pediste necesitamos **los archivos de video propios** (los originales que ya tienes en tu teléfono/editor, idealmente **sin marca de agua**).

Plan:

- Formato: vertical 9:16, **720×1280, H.264 (MP4)**, 6–15 s en _loop_ como "preview", **≤ 3 MB c/u**. Cada tarjeta tiene botón "Ver completo en TikTok ↗" a la URL original.
- Atributos: `muted loop playsinline preload="none" poster`. Carga real (`src`) solo cuando la tarjeta está a ≤ 1 posición de la activa.
- **Máximo 1 video reproduciéndose**: un único controlador (`useVideoController`) decide cuál suena; `IntersectionObserver` pausa al salir del viewport.
- Hosting: los videos **no van en Git** (pesan). Van a **Cloudflare R2 / Bunny / Cloudinary**; en `videos.json` solo va la URL. Mientras tanto: placeholders (poster con degradado y etiqueta `[VIDEO_TIKTOK_01]`).
- Fallback: si el video falla o el usuario tiene ahorro de datos (`saveData`), se muestra solo el poster con botón de play.

### 6.3 Sistema de diseño (qué vive en `packages/tokens`)

| Familia         | Tokens                                                                                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color           | `paper, ink, ink-soft, rosa(+tint,+deep), cereza(+tint), azul(+tint)` + semánticos: `bg, bg-alt, text, text-muted, accent, focus, danger, success`                         |
| Tipografía      | familias, tamaños fluidos, pesos permitidos (300/400/500 — **el 700 no existe en el sistema**), interlineados                                                              |
| Espaciado       | escala 4 pt: 4·8·12·16·24·32·48·64·96·144                                                                                                                                  |
| Radios          | `sm 10 · md 20 · lg 28 · pill`                                                                                                                                             |
| Sombras         | `soft · lift · glow-rosa` (teñidas)                                                                                                                                        |
| Breakpoints     | `sm 480 · md 768 · lg 1024 · xl 1280` (móvil primero)                                                                                                                      |
| Movimiento      | duraciones `fast 150 · base 280 · slow 500 · ambient 6000+`; easings `out-soft cubic-bezier(.22,1,.36,1)`, `in-out-soft cubic-bezier(.65,0,.35,1)`; distancias `rise 16px` |
| Z-index / capas | `base, sticky-header, floating-cta, sheet, modal, toast`                                                                                                                   |

### 6.4 Componentes reutilizables

- **Primitivos:** `Button` (primary rosa · brand cereza · quiet · icon), `Card`, `Badge`/`Chip`, `Input`/`Select`/`Textarea` (con label y error), `Modal`, `Sheet` (hoja inferior), `Toast`, `IconButton`, `Section`, `Container`.
- **Marca:** `VerdictStamp`, `Sticker`, `PostIt`, `HandUnderline`, `Doodle` (♡ ✦ →), `WashiTape`, `WordRotator`.
- **Video:** `VideoCarousel`, `VideoCard`, `MuteButton`, `PlayPauseButton`, `useVideoController`.
- **Datos:** `CountUp` (número animado), `MetricCard`, `CategoryCard` (expandible), `RecommendationCard`, `PlaceCard`, `ProjectCard`, `TimelineCard`.
- **Formulario:** `InquiryForm` (2 pasos) + `InquirySuccess`.

### 6.5 Formulario: envío sin backend propio

Fase 1: envío a un servicio de formularios (Formspree / Web3Forms / Resend + función serverless en Cloudflare), con `mailto:` de respaldo. Los datos del formulario son de terceros (marcas): se añade una nota corta de privacidad y una página `/privacidad`. Se decide el servicio en la Fase 3.

### 6.6 Estrategia de animación

| Nivel        | Qué                                                                                                                   | Regla                                               |
| ------------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Entrada      | Fade + subida de 16 px, escalonado (60–80 ms entre hijos)                                                             | Una sola vez por elemento (`once`)                  |
| Scroll       | Parallax ≤ 12 px en 2–3 elementos del hero; header que se compacta                                                    | Solo `transform`/`opacity` (nada que cause reflow)  |
| Interacción  | Hover/tap: escala 1.02–1.04, cambio de tinte; botones con "resorte" mínimo                                            | ≤ 280 ms                                            |
| Ambiente     | Stickers que flotan lento (6–10 s), rotador de palabras, número que cuenta                                            | Se pausan fuera del viewport                        |
| Transiciones | Expansión de tarjetas de categoría y apertura de detalle con animación de layout compartido                           | Sin bloquear la interacción                         |
| **Reducido** | `prefers-reduced-motion`: sin parallax, sin flotación, sin rotador, sin autoavance de videos; aparecen con fade corto | **Obligatorio**, probado en cada componente animado |

---

## 7. Performance, accesibilidad y SEO (criterios de aceptación)

**Performance (móvil, 4G simulada):** LCP < 2,5 s · CLS < 0,05 · INP < 200 ms · JS inicial < 150 KB gz. Cómo: imágenes AVIF/WebP con `srcset` y `sizes`, hero `fetchpriority="high"`, todo lo demás `loading="lazy"`; secciones bajo el pliegue con `React.lazy` (developer y colección se cargan al acercarse); fuentes `font-display: swap` con subconjunto latino; videos según §6.2; solo `transform`/`opacity` animados.

**Accesibilidad (WCAG 2.2 AA):** contraste verificado (§3.1) · navegación completa con teclado · foco visible (anillo azul de 3 px) · `skip-to-content` · landmarks (`header/main/nav/footer`) · `alt` real en imágenes (o `alt=""` si son decorativas) · controles de video con `aria-pressed`/`aria-label` · carrusel con controles y sin trampas de foco · objetivos táctiles ≥ 44 px · formulario con `label`, errores enlazados con `aria-describedby` · `prefers-reduced-motion` y `prefers-color-scheme` respetados (decisión: v1 solo tema claro, la identidad depende de la base crema; modo oscuro queda para una fase posterior).

**SEO:** `<title>` "Soy Mariana · Mariana Restrepo, creadora de contenido y recomendaciones reales" · meta description · Open Graph + Twitter Card con imagen 1200×630 · favicon (SVG + PNG + apple-touch-icon) · `sitemap.xml` · `robots.txt` · JSON-LD `Person` (name, jobTitle, sameAs con redes) · HTML semántico con un solo `h1` · `lang="es-CO"`. Para que _"Mariana Restrepo"_ posicione: dominio propio con su nombre (`marianarestrepo.com` / `.co`, por confirmar), enlazarlo desde la bio de TikTok/Instagram/GitHub/LinkedIn y registrar el sitio en Google Search Console.

---

## 8. Copy: voz y ejemplos

**Voz:** habla como en un audio a una amiga. Tuteo, frases cortas, un "amiga" cuando cabe (no en cada línea), colombianismos naturales y suaves, sin exagerar. Nada de "potencia tu marca".

| Dónde            | Propuesta                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Hero             | **La amiga que prueba todo primero.** · Productos, lugares y recomendaciones reales.                        |
| Rotador          | Yo **pruebo** · **descubro** · **recomiendo**                                                               |
| Videos           | _Mírame en acción_ · "Lo probé para que tú no tengas que hacerlo."                                          |
| Categorías       | _¿Qué estoy probando?_                                                                                      |
| Colección        | _Esto sí te lo recomiendo_ · subtítulo "(y lo que no, también te lo cuento)"                                |
| Diario           | _Fui aquí y esto encontré_                                                                                  |
| Sobre mí         | "Empecé creando contenido porque siempre me ha gustado descubrir cosas y compartirlas."                     |
| Números          | _Los números, sin maquillaje_ (+ "Todo orgánico. Lo que ves es lo que hay." **solo si es cierto**)          |
| Marcas           | _¿Creamos algo?_ · "Cuento lo que viví, no lo que me dictaron."                                             |
| Botón formulario | **Cuéntame tu idea**                                                                                        |
| Éxito            | "Listo, ya lo tengo. Te leo con calma y te respondo pronto."                                                |
| Error            | "Ay, algo falló. Inténtalo de nuevo o escríbeme a [CORREO]."                                                |
| Developer        | _Y cuando no estoy creando…_ · "También estudio Desarrollo de Software: frontend y experiencia de usuario." |
| Footer           | "Gracias por pasar por aquí. Yo me voy a probar algo nuevo; nos vemos en TikTok ♡"                          |
| 404              | "Amiga, esta página no la he probado todavía."                                                              |

---

## 9. Plan de fases

| Fase  | Entrega                                                                                                  | Depende de                       |
| ----- | -------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **1** | Esta propuesta + _style tile_ (`style-tile.html`) → **tú apruebas**                                      | Tu feedback                      |
| **2** | Wireframes/diseño visual afinado de cada sección, catálogo de componentes                                | Fase 1 aprobada + fotos/capturas |
| **3** | Monorepo, `tokens`, `content`, `core`, **web completa** con placeholders, PWA                            | Fase 2                           |
| **4** | App móvil (Expo) consumiendo los mismos paquetes                                                         | Fase 3                           |
| **5** | Performance, accesibilidad, SEO (auditoría con Lighthouse, axe, pruebas de teclado y lector de pantalla) | Fase 4                           |
| **6** | Guías: correr el proyecto, y cambiar contenido / videos / recomendaciones / proyectos                    | Todo                             |

**Nota sobre orden:** propongo que la **web salga primero y sola** (Fase 3) y se publique; la app móvil (Fase 4) reutiliza lo construido.

---

## 10. Lo que necesito de ti (no bloquea la aprobación, sí la Fase 2)

**Decisiones**

1. ¿Apruebas la arquitectura B (monorepo Web Vite + Móvil Expo) y que movamos el Expo actual a `apps/mobile`?
2. ¿La app móvil debe **publicarse en tiendas** (Apple ~99 USD/año, Google ~25 USD una vez, con revisión) o basta por ahora con la **PWA instalable**? Recomiendo PWA primero.
3. ¿Tienes los **videos originales** (sin marca de agua) para el carrusel? Sin ellos usaremos placeholders.
4. ¿Tienes/quieres un **dominio** propio?

**Contenido (todo se puede dejar como placeholder)**

- Usuario de TikTok, Instagram, GitHub, LinkedIn y correo de contacto
- Ciudad (para el diario y SEO)
- 1–2 capturas de tus fondos de TikTok (para calibrar rosa / rojo / azul exactos)
- 3–5 fotos tuyas (hero y sobre mí) y, si existen, fotos de 4–6 recomendaciones y 3–4 lugares
- Nombres y enlaces de tus 2–3 proyectos developer (uno será este sitio)
- Confirmar si puedo escribir "todo orgánico" en Números

## 11. Riesgos y cómo se manejan

| Riesgo                                       | Mitigación                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Sobrecarga visual por tanto detalle "humano" | Máx. 1–2 toques de marca por vista; revisión "¿respira?" en cada sección                                                 |
| Muchos videos afectan el rendimiento móvil   | 1 solo activo, `preload="none"`, videos ≤ 3 MB, fallback a poster                                                        |
| Sin videos propios el carrusel no se ve real | Placeholders bien diseñados; el sistema funciona igual al reemplazar                                                     |
| Métricas bajas mostradas "en grande"         | Se presentan como **honestidad** ("sin maquillaje") y se prioriza calidad de interacción; se actualizan solas desde JSON |
| El lado developer opaque a la creadora       | Va al final, con clima de color distinto y en la navegación como link discreto                                           |
| Datos de marcas en el formulario             | Aviso de privacidad, servicio confiable, sin guardar de más                                                              |
