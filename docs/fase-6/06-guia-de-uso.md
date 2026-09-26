# Fase 6 · Guía de uso: correr, cambiar y publicar

Esta es la guía del día a día. Todo lo que hay aquí se puede hacer **sin tocar componentes**: solo ejecutas comandos y editas archivos JSON.

> **Qué está probado y qué no.** Las secciones 1 a 5 se hicieron y verificaron en este proyecto. La sección 6 (publicar) son pasos de las plataformas que **no se ejecutaron desde aquí**: están marcados. Revisa la sección 9 antes de publicar.

## Índice

1. [Correr el proyecto](#1-correr-el-proyecto)
2. [Verlo en tu celular](#2-verlo-en-tu-celular)
3. [Cambiar el contenido](#3-cambiar-el-contenido)
4. [Actualizar tus números](#4-actualizar-tus-números-tiktok-studio)
5. [Fotos y videos](#5-fotos-y-videos)
6. [Publicar la web](#6-publicar-la-web)
7. [Conectar el formulario de marcas](#7-conectar-el-formulario-de-marcas)
8. [Si algo no funciona](#8-si-algo-no-funciona)
9. [Lista antes de publicar](#9-lista-antes-de-publicar)
10. [Lo que sigue](#10-lo-que-sigue)

---

## 1. Correr el proyecto

**Requisitos:** [Node.js](https://nodejs.org) 20 o superior y [VS Code](https://code.visualstudio.com). Git ya lo tienes.

**Primera vez en un computador nuevo:**

```bash
git clone https://github.com/Mariana-Restrepo/SoyMariana.git
cd SoyMariana
npm install
```

`npm install` se hace **una sola vez, desde la carpeta raíz**: instala la web, la app y los paquetes compartidos.

**Cada día:**

```bash
npm run web        # abre la web en http://localhost:5173
npm run mobile     # la app móvil (a = emulador Android, o escanea el QR con Expo Go)
```

Al guardar un archivo, la web se recarga sola. Para detener un servidor: `Ctrl + C` en la terminal.

**Comandos que más vas a usar:**

| Comando                 | Cuándo                                                                  |
| ----------------------- | ----------------------------------------------------------------------- |
| `npm run check:content` | **Cada vez que editas un JSON.** Valida el formato y lista lo pendiente |
| `npm run check`         | Antes de subir cambios: tipos, lint, pruebas y contenido                |
| `npm run images`        | Cuando agregues fotos nuevas (sección 5)                                |
| `npm run audit`         | Antes de publicar: rendimiento, accesibilidad y SEO (~4 min)            |
| `npm run build`         | Genera la versión de producción en `apps/web/dist`                      |

La lista completa está en el [README](../../README.md).

## 2. Verlo en tu celular

Los pasos completos para tu iPhone (Expo Go, modo túnel y qué hacer si no conecta) están en la [guía de la Fase 4](../fase-4/04-app-movil.md#1-cómo-verla-en-tu-iphone). Resumen:

- **La app:** `npm run mobile`, y escaneas el QR con la cámara del iPhone (necesitas Expo Go). Si tu Wi-Fi no deja: `npm run mobile:tunnel`.
- **Solo la web:** `npm run web:lan` y abres en Safari la dirección "Network" que muestra la terminal.

Con `web:lan` ves el diseño, pero **no** se instala como app: la instalación (PWA) solo funciona con la web publicada en `https://` (sección 6).

## 3. Cambiar el contenido

Todo vive en [`packages/content/data/`](../../packages/content/data). Editas, guardas y la web se actualiza.

| Quiero cambiar…                                   | Archivo                |
| ------------------------------------------------- | ---------------------- |
| Mi bio, historia, palabras que rotan, frase final | `profile.json`         |
| Redes y correo                                    | `links.json`           |
| Videos del carrusel                               | `videos.json`          |
| Textos de "Lo que pruebo"                         | `categories.json`      |
| Recomendaciones (productos)                       | `recommendations.json` |
| Lugares y restaurantes                            | `places.json`          |
| Números y audiencia                               | `metrics.json`         |
| Sección "Trabajemos juntas"                       | `collab.json`          |
| Etiquetas de transparencia (textos)               | `disclosures.json`     |
| Política de privacidad y términos de uso          | `legal.json`           |
| Título y descripción para Google                  | `site.json`            |

**Regla de oro:** después de editar, corre `npm run check:content`. Si te equivocas en una coma o en un nombre, te dice exactamente dónde. Si no dice error, el archivo está bien.

### Qué dejar sin llenar mientras no lo tengas

Los textos entre corchetes como `[PRODUCTO_01]` son **marcadores**. `check:content` los lista para que sepas qué falta. No los borres: reemplázalos cuando tengas el dato real. Nada se inventa por ti.

### Agregar una recomendación

En `recommendations.json`, copia un bloque entero y cámbialo. Cuidado con:

- `id` y `slug` **únicos** (el `slug` es el que va en el enlace: `?r=mi-producto`; usa minúsculas y guiones).
- `category`: `belleza`, `cabello`, `cuidado-personal`, `restaurantes`, `lugares`, `productos` o `lifestyle`.
- `verdict` (el sello): `repite`, `sorprendio`, `vale-la-pena`, `se-queda`, `volveria` o `no-convencio`.
- `liked` y `disliked` son listas cortas (2 o 3 cosas). Pueden quedar vacías `[]`.
- `link` es opcional: donde se puede comprar o ver el producto.

```json
{
  "id": "rec-07",
  "slug": "mi-producto",
  "name": "Nombre del producto",
  "category": "cabello",
  "verdict": "se-queda",
  "opinion": "Lo que pienso, con mi voz, en una o dos frases.",
  "liked": ["Se siente ligero"],
  "disliked": ["Se acaba rápido"],
  "image": {
    "src": "/media/images/mi-producto-960.webp",
    "alt": "Frasco del producto sobre una mesa",
    "placeholder": "producto",
    "tone": "rosa"
  },
  "link": "https://...",
  "linkLabel": "Ver dónde encontrarlo"
}
```

### Agregar un lugar

Igual, en `places.json`. Cambia lo que hay de más: `city` (ej. `"Medellín"`), `tried` (lo que probaste), `review` y, si quieres, `mapUrl` (enlace de Google Maps) y `socialUrl` (la red del lugar). Ojo: los tres lugares de ejemplo todavía dicen `[CIUDAD]`.

### Agregar o cambiar un video del carrusel

1. Prepara el clip (sección 5).
2. En `videos.json` agrega un objeto (el orden del archivo es el orden del carrusel):

```json
{
  "id": "video-06",
  "title": "Mirador La Palma, San Félix",
  "caption": "Un plan que no sabía que existía en Medellín.",
  "src": "https://tu-alojamiento.com/video-06.mp4",
  "poster": {
    "src": "/media/images/portada-06-960.webp",
    "alt": "Vista nocturna del mirador con luces",
    "placeholder": "portada",
    "tone": "rosa"
  },
  "tiktokUrl": "https://www.tiktok.com/@soymariiaana/video/123456789"
}
```

Sin `src` se ve un bloque de color con el título (el carrusel sigue funcionando). `tiktokUrl` es el enlace "Ver en TikTok" de cada tarjeta.

### Proyectos, GitHub, LinkedIn y la línea de desarrolladora

La sección "Y cuando no estoy creando…" **se quitó** en la Fase 4, y los enlaces a **GitHub y LinkedIn** y la línea de **desarrolladora de software** se quitaron después (web, app y esquemas). No hay proyectos que mantener. Si un día quieres volver a algo de eso, sigue en el historial de git (la sección en el commit `b19267d`).

### Los textos de "Sobre mí"

En `profile.json`, la lista `story` son las tarjetas. Ya tienes **Medellín** y tus 21 años. Quedan por completar `[ME_GUSTA_01]` y `[META_01]`. Son 4 tarjetas (quién soy, qué me gusta, por qué empecé y qué quiero construir); puedes agregar o quitar las que quieras copiando o borrando un bloque de `story`.

### El formulario de marcas

Los **tipos de colaboración** que se ofrecen (Reseña, Recomendación, Video para TikTok…) salen de la lista `types` de `collab.json`: agrega, quita o renombra ahí y se actualizan en la web y en la app. En la web se muestran como pastillas para elegir una. Los campos **obligatorios** llevan un asterisco (`*`): tu nombre, la marca, el correo y "Cuéntame sobre el proyecto". La red de la marca y el presupuesto son opcionales.

### Etiquetas de transparencia (cómo llegó cada cosa)

Cada recomendación, cada lugar (y, si quieres, cada video) lleva una etiqueta que dice cómo llegó a ti. Se elige con el campo `disclosure`:

| Valor          | Se muestra          | Úsalo cuando…                                                |
| -------------- | ------------------- | ------------------------------------------------------------ |
| `propio`       | Lo pagué yo         | Lo compraste tú o fuiste por tu cuenta, sin ninguna marca    |
| `regalo`       | Me lo regalaron     | Te lo enviaron sin costo, sin pago y sin condiciones         |
| `invitacion`   | Me invitaron        | Te invitaron al lugar o experiencia, sin pago ni condiciones |
| `colaboracion` | Colaboración pagada | Hay un acuerdo con la marca (pago u otra compensación)       |

Si hay pago o condiciones sobre lo que puedes decir, **es `colaboracion`**, aunque te hayan mandado el producto. Si el enlace de compra es de afiliado (puedes ganar una comisión), agrega `"affiliate": true` en la recomendación: el detalle mostrará el aviso.

```json
{
  "id": "rec-07",
  "name": "Nombre del producto",
  "disclosure": "regalo",
  "affiliate": true
}
```

Los textos de cada etiqueta (`disclosures.json`) se muestran también en los términos de uso; para cambiarlos, edítalos ahí. `npm run check:content:strict` **falla si una recomendación o un lugar no tiene etiqueta**: así nada se publica sin decir cómo llegó. Las de los ejemplos son solo para ver el diseño; cámbialas por las reales.

> En Colombia la Superintendencia de Industria y Comercio (SIC) tiene una guía sobre publicidad con influenciadores. Vale la pena leerla y decidir con tu abogado o abogada cómo marcar cada caso.

### Páginas legales: privacidad y términos

Están en `/privacidad` y `/terminos` (web) y en **Más** (app), y salen de un solo archivo: `packages/content/data/legal.json`. Los textos usan `{{name}}`, `{{place}}` y `{{email}}`, que se rellenan con tus datos (`controller` y `links.json`): no los escribas a mano.

Lo que hay que saber:

- **Son un borrador.** Los redacté según cómo funciona el sitio hoy (un formulario que recoge nombre, marca, correo y mensaje; sin cookies de seguimiento ni analítica). **No son asesoría legal.** Pídele a una persona abogada que los revise antes de publicar y, cuando lo haga, cambia `"reviewedByLawyer"` a `true`. Mientras esté en `false`, `check:content:strict` no te deja dar el sitio por listo.
- **Preguntas para esa revisión:** si conviene agregar tu teléfono (`controller.phone`), si el aviso del formulario basta o prefieres una casilla de aceptación, cuánto tiempo conservar los mensajes, y si te aplica registrar bases de datos ante la SIC.
- **Si cambias algo del sitio, actualiza los textos.** Por ejemplo: al agregar analítica (Plausible, Google Analytics…), cookies, un servicio de formulario concreto, o si más adelante conectas la API de TikTok. Cambia también `updatedAt`.
- **Para la app de desarrolladora de TikTok** y para las tiendas de apps te piden las direcciones públicas: `https://tu-dominio.com/privacidad` y `https://tu-dominio.com/terminos`.
- **Publicación:** estas rutas dependen de que el servicio devuelva la página principal cuando piden una ruta que no existe como archivo. Cloudflare Pages y Netlify lo hacen así si no agregas un `404.html` propio (no se probó en un servicio real).

### Título y descripción en Google

`site.json`. El título ideal mide entre 30 y 60 caracteres y la descripción entre 70 y 160; `npm run audit` lo comprueba.

## 4. Actualizar tus números (TikTok Studio)

Los números **no se actualizan solos** todavía (ver sección 10). Cada semana o cada mes, ~10 minutos:

**En TikTok → Perfil → TikTok Studio → Estadísticas**, elige **60 días** y toma estos datos:

| Dato                     | Dónde en TikTok Studio                                     | Dónde en `metrics.json`           |
| ------------------------ | ---------------------------------------------------------- | --------------------------------- |
| Seguidores               | Perfil (o Seguidores → Total)                              | `metrics` → `followers` → `value` |
| Likes acumulados         | Perfil ("Me gusta")                                        | `metrics` → `likes` → `value`     |
| Reproducciones (60 días) | Resumen → 60 días → "Visualizaciones de tus publicaciones" | `metrics` → `views` → `value`     |
| Edad de seguidores       | Seguidores → Estadísticas de seguidores → **Edad**         | `audience` → grupo `age`          |
| Países de seguidores     | Seguidores → Estadísticas de seguidores → **Ubicaciones**  | `audience` → grupo `location`     |
| Género de espectadores   | Espectadores → Estadísticas de espectadores → **Sexo**     | `audience` → grupo `gender`       |

Reglas:

- Escribe el número **completo**: `148200`, no `148.2K` (la web lo muestra como "148,2K").
- Los porcentajes de cada grupo **deben sumar 100**. Si TikTok muestra solo los 5 primeros países, el resto va como "Otros países" (100 menos la suma de los demás). `npm run check` falla si no suman 100.
- Cambia `updatedAt` a la fecha de hoy (ej. `"30 de septiembre de 2026"`). Se muestra como "Actualizado: …".
- Si cambias el periodo (por ejemplo, de 60 a 28 días), cambia también la etiqueta del número (`"label": "reproducciones en los últimos 60 días"`).
- Usa siempre el mismo periodo para que las cifras sean comparables, y prefiere 60 días o más: una semana con un video viral se ve inflada.

## 5. Fotos y videos

### Fotos

1. Copia tus fotos originales (del celular, del tamaño que sean) a `apps/web/media-src/`.
2. Corre `npm run images`.
3. Copia el bloque JSON que imprime dentro del archivo de contenido y cambia `alt` por una descripción real.

Genera versiones WebP de 480, 960 y 1440 px y **borra la ubicación GPS y los datos del celular** de las fotos. Las originales no se suben a git.

El `alt` es el texto que lee el lector de pantalla y Google: describe lo que se ve ("Mariana sonriendo con un café en la mano"), no "foto 1".

### Videos

Los videos **no van en git** (pesan): en producción se alojan en un servicio y en el JSON solo se guarda la dirección `https://…`.

**Prepararlos:** copia tus videos (aunque sean largos o pesados) a `apps/web/media-src/videos/` y corre:

```bash
npm run videos                       # todos
npm run videos -- mirador-la-palma   # solo uno (el nombre del archivo, sin .mp4)
```

Por cada video genera, en `apps/web/public/media/videos/`, un clip vertical 9:16 de hasta 15 s, H.264 con audio, que empieza a verse sin esperar la descarga y pesa **≤ 3 MB** (si no cabe, lo comprime más). Los horizontales quedan completos, centrados sobre un fondo desenfocado. También saca una portada (WebP) en `public/media/images/` e imprime el bloque JSON para `videos.json`. Tus originales no se tocan.

Cada clip parte del segundo 0. Para elegir mejor el momento, edita `apps/web/video-clips.json`:

```json
{
  "mirador-la-palma": { "start": 8, "duration": 14, "posterAt": 3 },
  "concierto-arcangel": { "mute": true }
}
```

`start` es el segundo donde empieza, `duration` cuánto dura, `mute: true` quita el audio (úsalo si suena música con derechos de autor, como en un concierto) y `posterAt` es el segundo de la portada. Los videos descargados de TikTok traen marca de agua: usa tu archivo original de edición o de la galería (con los originales del celular se ven más nítidos que los de WhatsApp).

**Dónde alojarlos** (uno solo):

- **Cloudflare R2** (recomendado si publicas en Cloudflare): tiene capa gratis.
- **Bunny** o **Cloudinary**: alternativas con capa gratis o muy barata.

Sube el clip de `public/media/videos/`, copia su dirección pública `https://…` y ponla en `src` del video. Para probar en tu PC sin subir nada, deja `"src": "/media/videos/mi-video.mp4"` (esa carpeta no se sube a git).

**Para la app móvil**, las rutas que empiezan con `/media/…` necesitan una dirección base: en `apps/mobile/.env.local` pon `EXPO_PUBLIC_MEDIA_BASE_URL=https://tu-dominio.com`. Si usas direcciones `https://…` completas en el JSON, no hace falta.

## 6. Publicar la web

> **No probado desde aquí:** estos pasos vienen de la forma de trabajar de las plataformas. Lo que sí está verificado es que `npm run build` genera la web y que `npm run audit` pasa sobre ese build.

La web es **estática** (archivos HTML, CSS y JS): se publica gratis en muchos servicios. Recomiendo **Cloudflare Pages** porque admite el archivo `apps/web/public/_headers` (seguridad y caché), es gratis y sirve videos con R2. Netlify también lo admite. **GitHub Pages no** sirve para las cabeceras de seguridad.

### Cloudflare Pages (pasos)

1. Crea tu cuenta en [cloudflare.com](https://www.cloudflare.com) y entra a **Workers & Pages → Create → Pages → Connect to Git**. Elige el repo `SoyMariana` (autoriza a Cloudflare en GitHub).
2. Configura el proyecto:
   - **Build command:** `npm run build`
   - **Build output directory:** `apps/web/dist`
   - **Root directory:** déjalo vacío (la raíz)
3. En **Environment variables** agrega:
   - `VITE_SITE_URL` = tu dirección final, sin `/` al final (ej. `https://soymariana.com`)
   - `VITE_INQUIRY_ENDPOINT` = (ver sección 7)
   - `NODE_VERSION` = `22`
4. Guarda y despliega. Cada vez que hagas `git push` a `main`, se vuelve a publicar solo.

Antes de conectar el dominio real, prueba con la dirección `*.pages.dev` que te da Cloudflare, pero recuerda que `VITE_SITE_URL` debe ser la del sitio final para que Google y las redes lean bien el título y la imagen. Si cambias de dirección, cambia la variable y vuelve a desplegar.

### Dominio propio

Compra un dominio (ej. `soymariana.com`, en Cloudflare o en otro registro) y conéctalo desde **Custom domains** del proyecto. Ponlo también en `VITE_SITE_URL`.

### Que Google te encuentre

1. Registra el sitio en [Google Search Console](https://search.google.com/search-console) y envía `https://tu-dominio.com/sitemap.xml` (ya se genera solo).
2. Pon el enlace de la web en la bio de TikTok e Instagram.
3. Comparte el enlace en WhatsApp o Instagram para ver cómo sale la imagen; cada red guarda copias, así que puede tardar en actualizarse.

### Instalar la web como app (PWA)

Con la web publicada en `https://`:

- **iPhone (Safari):** botón Compartir → **Añadir a pantalla de inicio**.
- **Android (Chrome):** menú ⋮ → **Instalar aplicación**.
- **Computador (Chrome/Edge):** ícono de instalar en la barra de direcciones.

En Chrome se comprobó que cumple los requisitos de instalación (manifiesto, íconos, service worker) y que abre sin conexión; no se hizo el clic real de "Instalar". **En iPhone no se probó.**

### La app móvil en las tiendas

Publicar la app en la App Store y Google Play es un paso aparte: cuenta de Apple Developer (**99 USD al año**), Google Play (**25 USD una vez**) y _builds_ con EAS. Mientras tanto, la PWA cumple la función de "app instalada" sin costo. Es una decisión para más adelante; avísame cuando quieras y lo preparamos.

## 7. Conectar el formulario de marcas

Sin configurar nada, en la web **publicada** el botón de envío abre el correo de quien escribe, con el mensaje ya redactado hacia `soymariiaana@gmail.com`. Funciona, pero depende de que esa persona tenga un correo configurado en su dispositivo. En tu PC (`npm run web`) el formulario solo **simula** el envío: no manda nada ni abre el correo, así que ahí no verás llegar nada.

Para que el mensaje llegue directo a tu bandeja:

1. Crea una cuenta en un servicio de formularios (por ejemplo [Formspree](https://formspree.io) o [Web3Forms](https://web3forms.com), ambos con capa gratis) y crea un formulario que envíe a tu correo.
2. Copia la dirección (endpoint) que te da y ponla en `VITE_INQUIRY_ENDPOINT` (en Cloudflare, y en `apps/web/.env.local` si quieres probarlo en tu PC).
3. La web envía un `POST` con JSON: `name`, `brand`, `email`, `brandSocial`, `collabType`, `message` y `budget`. Los servicios mencionados lo aceptan.

Para la app, la misma dirección va en `EXPO_PUBLIC_INQUIRY_ENDPOINT`.

> **No probado con un servicio real:** la lógica de envío está probada con pruebas automáticas y en modo simulado. Cuando lo conectes, haz un envío de prueba y confirma que el correo llega. No pongas nunca claves secretas en estas variables: quedan visibles en el navegador.

## 8. Si algo no funciona

| Síntoma                                                  | Qué hacer                                                                                                                         |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `npm` o `node` "no se reconoce"                          | Instala Node.js, cierra y abre VS Code.                                                                                           |
| `npm install` falla o hay errores raros                  | Borra la carpeta `node_modules` (deja `package-lock.json`) y corre `npm install` otra vez.                                        |
| "Puerto 5173 ocupado"                                    | Hay otra web abierta. Ciérrala con `Ctrl + C` en su terminal, o Vite usará el puerto siguiente y te lo dirá.                      |
| Editaste un JSON y la web no cambia                      | Corre `npm run check:content`: casi seguro hay una coma o comilla mal puesta y te dice en qué línea.                              |
| Ves un bloque de color en vez de la foto/video           | Es un marcador. Pon el `src` real (secciones 3 y 5).                                                                              |
| El celular no conecta a la app                           | Misma red Wi-Fi, permitir Node.js en el firewall, o `npm run mobile:tunnel` ([Fase 4](../fase-4/04-app-movil.md)).                |
| En producción no veo el cambio que hice                  | La web instalada (PWA) guarda una copia. Recarga dos veces, o cierra y abre la app instalada.                                     |
| `npm run audit` dice que no encuentra Chrome             | Instala Chrome o Edge, o define la variable `CHROME_PATH` con la ruta del `chrome.exe`.                                           |
| `npm run audit` falla la nota móvil una sola vez         | Cierra otros programas y repítelo; usa la mediana de 3 corridas. Si falla siempre, hay algo real que revisar.                     |
| La app en Android se ve cortada con "reducir movimiento" | Es un límite conocido (ver [Fase 5](../fase-5/05-optimizacion-y-auditoria.md#5-app-móvil-auditoría-en-android)).                  |
| Se rompió algo y no sé qué                               | `git status` muestra qué cambiaste; `git diff` cómo. Para volver un archivo al último commit: `git checkout -- ruta/del/archivo`. |

**Subir tus cambios a GitHub**, cuando estés conforme:

```bash
npm run check
git add -A
git commit -m "Describe qué cambiaste"
git push
```

## 9. Lista antes de publicar

- [ ] `npm run check:content:strict` sin marcadores pendientes (fotos, videos, textos, lugares).
- [ ] Cada recomendación y lugar tiene su etiqueta de transparencia (`disclosure`), y es la real.
- [ ] Una persona abogada revisó `legal.json` y lo marcaste como `reviewedByLawyer: true`; las direcciones `/privacidad` y `/terminos` abren en el sitio publicado.
- [ ] Todas las fotos tienen un `alt` real, pasadas por `npm run images`.
- [ ] Videos alojados en `https://`, ≤ 3 MB cada uno.
- [ ] `VITE_SITE_URL` con tu dirección final.
- [ ] Formulario conectado y probado con un envío real (sección 7).
- [ ] `npm run check` y `npm run audit` en verde.
- [ ] Probaste la web publicada en tu iPhone (instalación y videos).
- [ ] Tienes permiso para mostrar a las marcas o personas que aparezcan (por ejemplo, Bloomshell en tus videos).
- [ ] Los números de `metrics.json` están al día y con la fecha de hoy.
- [ ] Repositorio: pasar de **privado a público** solo cuando todo lo anterior esté listo y sin datos que no quieras mostrar.

## 10. Lo que sigue

- **Números automáticos desde TikTok:** se puede con la API oficial (seguidores, likes, lista de videos y sus vistas); **la edad, el género y las ubicaciones de la audiencia no** vienen en ella y seguirían siendo manuales. Necesita que registres una app en developers.tiktok.com y que TikTok la apruebe (pide una URL pública con política de privacidad y términos). Cuando la tengas retomamos.
- **La app móvil:** el bloque de audiencia ya se muestra igual que en la web (mismo `metrics.json`); queda decidir si se publica en las tiendas.
- **Qué mirar cada mes:** los videos de lugares de Medellín fueron los que mejor te funcionaron, y casi todo tu alcance viene de "Para ti". Vale la pena repetir lo que despegó y revisar el efecto cada mes con los mismos 60 días.

## Lo que no se pudo comprobar

- Publicación real (Cloudflare Pages, dominio, `_headers` en producción).
- Instalación como app y videos en **iPhone**.
- Envío real del formulario con un servicio.
- Videos ya recortados en un celular real y con conexión real (el comando `npm run videos` sí se probó con tus videos, y las portadas se revisaron).
- Videos reales pesados en la web.
- Lectores de pantalla reales (NVDA, VoiceOver, TalkBack).
