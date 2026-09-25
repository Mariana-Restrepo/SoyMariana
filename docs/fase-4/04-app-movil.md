# Fase 4 · App móvil

App Expo (React Native) en `apps/mobile`. Usa los mismos paquetes que la web: **`tokens`** (colores, tipografías, radios), **`content`** (todo el contenido en JSON) y **`core`** (formato, filtros, formulario). Cambiar un texto o una recomendación en `packages/content/data/` actualiza web y app a la vez.

## 1. Cómo verla en tu iPhone

Necesitas: tu iPhone y tu PC en **la misma red Wi-Fi**.

1. En el iPhone, instala **Expo Go** desde la App Store (gratis).
2. En tu PC, desde la carpeta del proyecto:

   ```bash
   npm run mobile
   ```

3. Aparece un código QR en la terminal. Abre la **cámara del iPhone**, apúntala al QR y toca el aviso "Abrir en Expo Go".
4. La primera vez tarda un poco en empaquetar. Cada cambio que guardes en el código se refleja solo en el teléfono.

**Si no conecta** (Wi-Fi de universidad o de oficina que aísla los dispositivos, o el firewall de Windows lo bloquea):

- Windows puede preguntar si permites a Node.js usar la red: elige **redes privadas**.
- Prueba el modo túnel, que pasa por internet:

  ```bash
  npm run mobile:tunnel
  ```

  La primera vez pide instalar un paquete auxiliar (`@expo/ngrok`); acepta.

**Para ver solo la web en el iPhone** (Safari), sin instalar nada:

```bash
npm run web:lan
```

Abre en Safari la dirección "Network" que muestra la terminal (algo como `http://192.168.0.35:5173`). En Safari puedes usar Compartir → "Añadir a pantalla de inicio".

> Expo Go es para desarrollo y pruebas. Para tener la app instalada de forma permanente en el iPhone o publicarla en la App Store hace falta una cuenta de Apple Developer (99 USD/año) y generar un _build_ con EAS. Es una decisión para más adelante; la PWA de la web ya se puede instalar sin costo.

## 2. Qué tiene la app

Cinco pestañas (en la app sí son destinos independientes, a diferencia de la web, que es un recorrido continuo):

| Pestaña       | Contenido                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Inicio**    | Hero (foto, titular, stickers flotantes, palabras que rotan) y "Sin maquillaje" con los números que cuentan al entrar    |
| **Videos**    | Carrusel con snap: video activo al centro y vecinos atenuados; sonido y pausa; un solo video activo                      |
| **Colección** | Categorías como filtro, recomendaciones con sellos de veredicto, diario de lugares; el detalle se abre en pantalla modal |
| **Marcas**    | "¿Creamos algo?", con quién y cómo trabajar, y el formulario de 2 pasos                                                  |
| **Más**       | Sobre mí (tarjetas con swipe), redes, frase final                                                                        |

Detalles de comportamiento (iguales a la web):

- **Videos:** siempre inician **mudos**; el sonido lo activas tú y solo suena el video activo. Se pausan al cambiar de pestaña y al mandar la app a segundo plano. Si el archivo falla, se queda el póster sin romper nada. Sin `src` en el JSON se ve el placeholder.
- **Enlaces** con `[PLACEHOLDER]` no son enlaces: se muestran deshabilitados hasta que exista la URL real.
- **Formulario:** mismas validaciones y mensajes que la web. En desarrollo simula el envío; en producción usa `EXPO_PUBLIC_INQUIRY_ENDPOINT` o abre el correo (ver `apps/mobile/.env.example`).
- **Detalle de recomendación** con link propio: `soymariana://recomendacion/producto-01`.
- **Imágenes y videos:** en el JSON se guardan como rutas de la web (`/media/...`). En la app hace falta una URL absoluta: define `EXPO_PUBLIC_MEDIA_BASE_URL` (o usa URLs completas `https://...` en el JSON).

## 3. Cambios de esta fase

- **Se retiró la sección "Su otra capa / Y cuando no estoy creando…"** (lado developer), en la app y en la web, y se quitó su enlace del menú móvil. Su contenido (`developer.json`) sigue en el historial de git (commit `b19267d`).
  Se mantiene, porque no era parte de esa sección: la tarjeta "Qué estudio" de _Sobre mí_, la línea "Desarrolladora de Software…" del pie de página y los enlaces a GitHub y LinkedIn. Si también quieres quitarlos, se hace en `profile.json` y `links.json`.
- **Sin videos por ahora:** todos quedan como placeholders hasta que tú pases los tuyos.

## 4. Verificación realizada

Probado **en un emulador Android** (Android 15, pantalla 1080×2400) con Expo Go, tocando y deslizando de verdad:

| Comprobación                                                                                                                                                         | Resultado                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Las 5 pestañas, tipografías propias, ícono y pantalla de carga                                                                                                       | Correcto                                           |
| Carrusel: deslizar, sonido (se conserva al cambiar de video), pausa                                                                                                  | Correcto                                           |
| Detalle de recomendación (modal) y botón atrás de Android                                                                                                            | Correcto                                           |
| Formulario: validación con mensajes de Mariana, paso 2, envío y confirmación                                                                                         | Correcto                                           |
| **Video real** (archivo servido desde el PC): reproduce, pausa con el botón, **se pausa al cambiar de pestaña y al pasar la app a segundo plano**, reanuda al volver | Correcto (estado leído del reproductor de Android) |
| Video con dirección inaccesible: cae al póster sin romper la pantalla                                                                                                | Correcto                                           |
| `tsc`, ESLint (con el compilador de React), Prettier, 21 pruebas, `expo-doctor` 21/21, bundle de Android                                                             | Sin errores                                        |

Problemas reales que aparecieron al probar y ya se corrigieron: el encabezado perdía la palabra "Mariana" al cambiar de pestaña (texto anidado en Android), el titular dejaba "todo" solo en una línea, el video no se pintaba dentro de tarjetas animadas (hubo que usar `textureView`), el botón de cerrar del detalle quedaba pegado a la barra de estado, y un aviso amarillo de Reanimated innecesario.

### Lo que NO se pudo comprobar

- **iPhone / iOS:** no hay forma de probarlo desde este equipo (Windows). La app usa componentes multiplataforma y debería verse igual, pero puede haber diferencias sutiles (sombras, teclado, gestos). **Cuéntame qué ves en tu iPhone** y lo ajusto.
- **TalkBack / VoiceOver** (lectores de pantalla): las etiquetas y roles de accesibilidad están puestos, pero no se probó con el lector activado.
- **Rendimiento** en un celular real de gama baja y con videos reales pesados.
- **Enlaces externos** (TikTok, correo): con placeholders no hay a dónde ir; el código está, sin probar con URLs reales.
- **"Reducir movimiento"** del sistema activado: Reanimated lo respeta por defecto, pero no lo activé para probarlo.

## 5. Pendiente / mejoras posibles

- Barra de progreso **real** del video (hoy solo hay una simulada para placeholders, y se oculta cuando hay video real).
- Modo oscuro: la identidad depende de la base crema, por eso la app fuerza el tema claro.
- Publicación: identificadores (`bundleIdentifier` / `package`), cuenta de Apple/Google y _builds_ con EAS, cuando decidas publicar.
- Avisos y actualizaciones sin pasar por tiendas (EAS Update) si se publica.
