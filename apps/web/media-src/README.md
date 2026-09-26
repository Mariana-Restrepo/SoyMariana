# Fotos y videos originales

Copia aquí tus fotos (JPG, PNG, WebP…) y corre `npm run images` desde la raíz del proyecto.
Se generan versiones optimizadas en `apps/web/public/media/images/` y se imprime el bloque JSON para pegar en el contenido.

Los **videos** van en `videos/` y se preparan con `npm run videos` (clips de ≤ 15 s y ≤ 3 MB con su portada; ajustes en `apps/web/video-clips.json`).

Esta carpeta **no se sube a git** (los originales pesan y pueden traer ubicación GPS).
