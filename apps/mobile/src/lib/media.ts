/**
 * Las imágenes del contenido se guardan como rutas de la web (/media/images/foto.webp).
 * En la app se necesita una URL absoluta: define EXPO_PUBLIC_MEDIA_BASE_URL
 * (ej. https://tu-dominio.com) o usa URLs completas (https://...) en el JSON.
 * Si no hay forma de resolverla, se muestra el placeholder de color.
 */
const BASE = (process.env.EXPO_PUBLIC_MEDIA_BASE_URL ?? '').replace(/\/$/, '');

export function mediaUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/') && BASE) return `${BASE}${src}`;
  return undefined;
}
